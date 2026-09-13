import { vocabularyData } from '../data/vocabulary.js';
import { romajiToHiragana } from './romajiConverter.js';

// Tập hợp toàn bộ 965 từ vựng của 15 bài học thành mảng phẳng (cached)
let cachedAllWords = null;

function getAllVocabularyWords() {
  if (!cachedAllWords) {
    const list = [];
    Object.keys(vocabularyData).forEach((lessonKey) => {
      const items = vocabularyData[lessonKey] || [];
      items.forEach((item) => {
        list.push({
          ...item,
          lessonId: lessonKey,
        });
      });
    });
    cachedAllWords = list;
  }
  return cachedAllWords;
}

// Loại bỏ dấu ngoặc đơn để so khớp chính xác (vd: "（お）名前" -> "名前" hoặc "お名前")
function cleanJapaneseText(str) {
  if (!str) return '';
  return str.replace(/[（）()]/g, '').trim();
}

/**
 * Tra cứu từ vựng Offline trong cơ sở dữ liệu 965 từ vựng Dekiru Nihongo
 * Hỗ trợ tìm bằng:
 * - Romaji (vd: "watashi", "gakkou", "namae")
 * - Hiragana (vd: "わたし", "なまえ")
 * - Kanji (vd: "私", "名前")
 * - Nghĩa tiếng Việt (vd: "tôi", "trường học")
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
  const hiraganaFromRomaji = romajiToHiragana(raw);

  const exactMatches = [];
  const partialMatches = [];

  for (const word of allWords) {
    const kanji = word.kanji || '';
    const hiragana = word.hiragana || '';
    const meaning = (word.meaning || '').toLowerCase();

    const cleanKanji = cleanJapaneseText(kanji).toLowerCase();
    const cleanHira = cleanJapaneseText(hiragana).toLowerCase();

    // 1. Kiểm tra khớp chính xác (Exact match)
    const isExact =
      cleanKanji === raw ||
      cleanHira === raw ||
      cleanHira === hiraganaFromRomaji ||
      meaning === raw;

    if (isExact) {
      exactMatches.push(word);
      continue;
    }

    // 2. Kiểm tra khớp một phần (Partial match)
    const isPartial =
      meaning.includes(raw) ||
      cleanKanji.includes(raw) ||
      cleanHira.includes(raw) ||
      (hiraganaFromRomaji && (cleanHira.includes(hiraganaFromRomaji) || cleanKanji.includes(hiraganaFromRomaji)));

    if (isPartial) {
      partialMatches.push(word);
    }
  }

  return [...exactMatches, ...partialMatches].slice(0, maxResults);
}
