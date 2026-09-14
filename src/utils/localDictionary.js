import { vocabularyData } from '../data/vocabulary.js';
import { offlineDictionary } from '../data/offlineDictionary.js';
import {
  romajiToHiragana,
  romajiToJapanese,
  katakanaToHiragana,
  kanaToRomaji
} from './romajiConverter.js';

// Tập hợp toàn bộ kho từ vựng (> 1.150 từ & mẫu câu) thành mảng phẳng có đánh chỉ mục Romaji tự động
let cachedAllWords = null;
let romajiIndexMap = null;

// Loại bỏ dấu ngoặc đơn để so khớp chính xác (vd: "（お）名前" -> "名前" hoặc "お名前")
function cleanJapaneseText(str) {
  if (!str) return '';
  return str.replace(/[（）()]/g, '').trim();
}

/**
 * Tính khoảng cách Levenshtein giữa 2 chuỗi để nhận diện lỗi chính tả
 */
function levenshteinDistance(s1, s2) {
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  let prev = Array.from({ length: s2.length + 1 }, (_, i) => i);
  for (let i = 1; i <= s1.length; i++) {
    let curr = [i];
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[s2.length];
}

function getAllVocabularyWords() {
  if (!cachedAllWords) {
    const list = [];
    const rMap = new Map();
    const seen = new Set();

    // 1. Nạp 965 từ vựng theo 15 bài Dekiru Nihongo
    Object.keys(vocabularyData).forEach((lessonKey) => {
      const items = vocabularyData[lessonKey] || [];
      items.forEach((item) => {
        const cleanK = cleanJapaneseText(item.kanji || '');
        const cleanH = cleanJapaneseText(item.hiragana || '');
        const computedRomaji = kanaToRomaji(cleanH || cleanK).toLowerCase();
        // Hỗ trợ cả cách gõ dấu gạch ngang trường âm: ví dụ bi-ru thay cho biiru, ko-hi- thay cho koohii
        const altRomaji = computedRomaji.replace(/([aeiou])\1/g, '$1-');

        const uniqueKey = `${cleanK}_${cleanH}`.toLowerCase();
        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          const enrichedItem = {
            ...item,
            lessonId: lessonKey,
            cleanKanji: cleanK.toLowerCase(),
            cleanHira: cleanH.toLowerCase(),
            hiraNorm: katakanaToHiragana(cleanH.toLowerCase()),
            romaji: computedRomaji,
            altRomaji: altRomaji,
          };

          list.push(enrichedItem);

          // Lưu vào index map để tra cứu O(1)
          if (computedRomaji && !rMap.has(computedRomaji)) {
            rMap.set(computedRomaji, enrichedItem);
          }
          if (altRomaji && !rMap.has(altRomaji)) {
            rMap.set(altRomaji, enrichedItem);
          }
        }
      });
    });

    // 2. Nạp thêm các từ & mẫu câu giao tiếp thông dụng từ offlineDictionary
    offlineDictionary.forEach((item) => {
      const cleanK = cleanJapaneseText(item.kanji || '');
      const cleanH = cleanJapaneseText(item.hiragana || '');
      const computedRomaji = (item.romaji || kanaToRomaji(cleanH || cleanK)).toLowerCase().replace(/\s+/g, '');
      const altRomaji = computedRomaji.replace(/([aeiou])\1/g, '$1-');

      const uniqueKey = `${cleanK}_${cleanH}`.toLowerCase();
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        const enrichedItem = {
          ...item,
          cleanKanji: cleanK.toLowerCase(),
          cleanHira: cleanH.toLowerCase(),
          hiraNorm: katakanaToHiragana(cleanH.toLowerCase()),
          romaji: computedRomaji,
          altRomaji: altRomaji,
        };

        list.push(enrichedItem);

        if (computedRomaji && !rMap.has(computedRomaji)) {
          rMap.set(computedRomaji, enrichedItem);
        }
        if (altRomaji && !rMap.has(altRomaji)) {
          rMap.set(altRomaji, enrichedItem);
        }
      }
    });

    cachedAllWords = list;
    romajiIndexMap = rMap;
  }
  return cachedAllWords;
}

/**
 * Tra cứu tức thì từ vựng theo Romaji từ kho 965 từ vựng
 * Tự động phân giải chính xác từ Katakana lẫn Hiragana/Kanji
 * @param {string} romaji 
 * @returns {Object|null}
 */
export function getExactWordByRomaji(romaji) {
  if (!romaji || typeof romaji !== 'string') return null;
  getAllVocabularyWords();
  const key = romaji.trim().toLowerCase();
  return romajiIndexMap.get(key) || null;
}

/**
 * Tra cứu từ vựng Offline trong cơ sở dữ liệu 965 từ vựng Dekiru Nihongo
 * Hỗ trợ tìm kiếm thông minh bằng:
 * - Romaji (vd: "mannaka" -> 真ん中, "biiru" -> ビール, "biru" -> ビル, "karee" -> カレー, "watashi" -> 私)
 * - Katakana / Hiragana (vd: "ビール", "まんなか", "わたし")
 * - Chữ Hán Kanji (vd: "真ん中", "私", "間")
 * - Nghĩa tiếng Việt (vd: "ở giữa", "chính giữa", "bia", "tòa nhà", "tôi")
 * 
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} [maxResults=6] - Số lượng kết quả tối đa
 * @returns {Array<Object>} Danh sách từ vựng khớp nhất
 */
export function searchLocalDictionary(query, maxResults = 6) {
  if (!query || typeof query !== 'string') return [];
  const raw = query.trim().toLowerCase();
  if (!raw) return [];

  const allWords = getAllVocabularyWords();
  const jpHiragana = romajiToHiragana(raw);
  const jpDirect = romajiToJapanese(raw);

  const exactMatches = [];
  const partialMatches = [];

  for (const word of allWords) {
    const meaning = (word.meaning || '').toLowerCase();

    // 1. Kiểm tra khớp chính xác (Exact match)
    const isExact =
      word.cleanKanji === raw ||
      word.cleanHira === raw ||
      word.romaji === raw ||
      word.altRomaji === raw ||
      word.cleanKanji === jpDirect ||
      word.cleanHira === jpDirect ||
      (jpDirect && word.hiraNorm === katakanaToHiragana(jpDirect)) ||
      (jpHiragana && word.hiraNorm === jpHiragana) ||
      meaning === raw;

    if (isExact) {
      exactMatches.push(word);
      continue;
    }

    // 2. Kiểm tra khớp một phần (Partial match)
    const isPartial =
      meaning.includes(raw) ||
      word.cleanKanji.includes(raw) ||
      word.cleanHira.includes(raw) ||
      (word.romaji && word.romaji.includes(raw)) ||
      (jpHiragana && word.hiraNorm.includes(jpHiragana)) ||
      (jpDirect && (word.cleanKanji.includes(jpDirect) || word.cleanHira.includes(jpDirect)));

    if (isPartial) {
      partialMatches.push(word);
    }
  }

  return [...exactMatches, ...partialMatches].slice(0, maxResults);
}

/**
 * Gợi ý sửa lỗi chính tả thông minh theo giải thuật khoảng cách Levenshtein (Levenshtein Distance <= 2)
 * Giúp người dùng khi gõ sai Romaji (vd: "manaka" -> "mannaka", "arigato" -> "arigatou", "konichiwa" -> "konnichiwa")
 * hoặc gõ sai Hiragana/Katakana (vd: "こにちは" -> "こんにちは", "びーる" -> "ビール")
 *
 * @param {string} query - Từ khóa người dùng nhập (có thể chứa lỗi chính tả)
 * @param {number} [maxResults=3] - Số lượng từ gợi ý tối đa
 * @returns {Array<{ text: string, kanji: string, hiragana: string, meaning: string, romaji: string, dist: number }>}
 */
export function getFuzzySuggestions(query, maxResults = 3) {
  if (!query || typeof query !== 'string') return [];
  const raw = query.trim().toLowerCase();
  if (raw.length < 3) return [];

  const allWords = getAllVocabularyWords();
  const scored = [];
  const seenWords = new Set();

  for (const w of allWords) {
    const r = w.romaji || '';
    const altR = w.altRomaji || '';
    const h = w.cleanHira || '';

    let d = 99;
    let matchedOn = 'romaji';

    if (r) {
      const dr = levenshteinDistance(raw, r);
      const dAlt = altR ? levenshteinDistance(raw, altR) : 99;
      const minRomaji = Math.min(dr, dAlt);
      if (minRomaji < d) {
        d = minRomaji;
        matchedOn = 'romaji';
      }
    }

    if (h && raw.length <= h.length + 2) {
      const dh = levenshteinDistance(raw, h);
      if (dh < d) {
        d = dh;
        matchedOn = 'kana';
      }
    }

    const maxAllowed = raw.length <= 4 ? 1 : 2;
    if (d > 0 && d <= maxAllowed) {
      const uniqueId = (w.cleanKanji || '') + '_' + (w.cleanHira || '');
      if (!seenWords.has(uniqueId)) {
        seenWords.add(uniqueId);
        scored.push({
          text: matchedOn === 'romaji' ? (w.romaji || w.hiragana) : (w.hiragana || w.kanji),
          kanji: w.kanji,
          hiragana: w.hiragana,
          meaning: w.meaning,
          romaji: w.romaji,
          dist: d,
        });
      }
    }
  }

  scored.sort((a, b) => a.dist - b.dist);
  return scored.slice(0, maxResults);
}
