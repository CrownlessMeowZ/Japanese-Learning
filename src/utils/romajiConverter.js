/**
 * Romaji to Hiragana Converter
 * Tự động chuyển đổi chuỗi Romaji sang Hiragana cho thanh tìm kiếm từ vựng
 * Ví dụ: "namae" -> "なまえ", "watashi" -> "わたし", "gakkou" -> "がっこう"
 */

const ROMAJI_TO_HIRAGANA_MAP = {
  // Trigraphs & Digraphs (Ưu tiên thay thế trước)
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ', shi: 'し',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', chi: 'ち', tsu: 'つ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ', ji: 'じ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',

  // 2-letter syllables
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', si: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', ti: 'ち', tu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'mo',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',

  // Single vowels & n
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  nn: 'ん', n: 'ん',
};

// Sắp xếp các khóa dài trước để tránh bị nuốt từ
const SORTED_KEYS = Object.keys(ROMAJI_TO_HIRAGANA_MAP).sort((a, b) => b.length - a.length);
const ROMAJI_REGEX = new RegExp(SORTED_KEYS.join('|'), 'g');

/**
 * Chuyển chuỗi Romaji sang Hiragana
 * @param {string} text - Chuỗi văn bản người dùng gõ
 * @returns {string} Chuỗi sau khi map sang Hiragana
 */
export function romajiToHiragana(text) {
  if (!text || typeof text !== 'string') return '';
  let str = text.toLowerCase();

  // Xử lý phụ âm đôi (âm ngắt sokuon っ) trừ 'nn'
  str = str.replace(/([bcdfghjklmpqrstvwxyz])\1/g, (match, p1) => {
    if (p1 === 'n') return 'ん';
    return 'っ' + p1;
  });

  return str.replace(ROMAJI_REGEX, (match) => ROMAJI_TO_HIRAGANA_MAP[match] || match);
}

/**
 * Kiểm tra xem chuỗi có phải là Romaji (ký tự Latin có nguyên âm tiếng Nhật) hay không
 * @param {string} text
 * @returns {boolean}
 */
export function isProbablyRomaji(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim().toLowerCase();
  // Nếu đã chứa ký tự tiếng Nhật (Hiragana, Katakana, CJK Kanji) thì không phải thuần Romaji
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(trimmed)) {
    return false;
  }
  // Nếu chỉ gồm chữ cái Latin và có chứa nguyên âm a, e, i, o, u
  return /^[a-zA-Z\s'’\-]+$/.test(trimmed) && /[aeiou]/.test(trimmed);
}

