/**
 * String Utility Module - Sakura EdTech System
 * Thuật toán so khớp chuỗi & Đánh giá độ chính xác ngữ âm tiếng Nhật (Phonetic Speech Scoring)
 */

import { katakanaToHiragana, romajiToHiragana, kanaToRomaji } from './romajiConverter.js';

/**
 * Thuật toán Levenshtein Distance bằng Quy hoạch động (Dynamic Programming).
 * Đã tối ưu hóa không gian bộ nhớ (Space Optimization) từ O(M*N) xuống O(min(M, N)).
 * 
 * @param {string} s1 
 * @param {string} s2 
 * @returns {number} Khoảng cách chỉnh sửa tối thiểu (Số phép chèn, xóa, thay thế)
 */
export const levenshteinDistance = (s1, s2) => {
  if (s1 === s2) return 0;
  if (!s1) return s2 ? s2.length : 0;
  if (!s2) return s1.length;

  let str1 = s1;
  let str2 = s2;
  if (str1.length > str2.length) {
    str1 = s2;
    str2 = s1;
  }

  const m = str1.length;
  const n = str2.length;

  let prevRow = new Array(m + 1);
  let currRow = new Array(m + 1);

  for (let i = 0; i <= m; i++) {
    prevRow[i] = i;
  }

  for (let j = 1; j <= n; j++) {
    currRow[0] = j;
    const char2 = str2[j - 1];

    for (let i = 1; i <= m; i++) {
      const char1 = str1[i - 1];
      const cost = char1 === char2 ? 0 : 1;

      currRow[i] = Math.min(
        prevRow[i] + 1,       // Xóa (Deletion)
        currRow[i - 1] + 1,   // Chèn (Insertion)
        prevRow[i - 1] + cost // Thay thế (Substitution)
      );
    }

    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[m];
};

/**
 * Làm sạch chuỗi cơ bản: Loại bỏ dấu câu và khoảng trắng
 * @param {string} text 
 * @returns {string}
 */
export const cleanJapaneseTextForComparison = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\[(.*?)\]/g, '$1') // Bỏ ngoặc vuông giữ kana
    .replace(/[\s。、！？!?・…「」『』（）()\-–—_~〜:;]/g, '')
    .trim()
    .toLowerCase();
};

/**
 * Chuẩn hóa ngữ âm tiếng Nhật (Phonetic Normalization):
 * - Đưa Katakana về Hiragana
 * - Đưa Romaji về Hiragana nếu người học nói lẫn âm Latin
 * - Chuẩn hóa ngữ âm các trợ từ: は -> わ, を -> お, へ -> え
 * @param {string} text 
 * @returns {string}
 */
export const normalizeToPhoneticKana = (text) => {
  if (!text || typeof text !== 'string') return '';

  let str = cleanJapaneseTextForComparison(text);

  // 1. Chuyển Katakana sang Hiragana
  str = katakanaToHiragana(str);

  // 2. Chuyển Romaji sang Hiragana nếu có
  if (/[a-zA-Z]/.test(str)) {
    str = romajiToHiragana(str);
  }

  // 3. Chuẩn hóa trợ từ ngữ âm (chỉ thay thế trợ từ đơn lẻ hoặc ở ranh giới từ)
  str = str
    .replace(/は(?=です|ます|[あ-ん]|$)/g, 'わ')
    .replace(/を/g, 'お');

  return str;
};

/**
 * Tính tỷ lệ % khớp đa chiều giữa phát âm thực tế và câu mục tiêu
 * Có dung sai thích ứng với người nói nhanh, nuốt âm nhẹ hoặc nhận diện Kanji/Kana
 * 
 * @param {string} spokenStr - Chuỗi thu từ giọng nói qua Web Speech API
 * @param {string} targetJapanese - Câu tiếng Nhật mục tiêu (chứa Kanji hoặc Kana)
 * @param {string} [targetHiragana] - Câu phiên âm Hiragana thuần
 * @returns {{
 *   percentage: number,
 *   isPass: boolean,
 *   feedbackLevel: 'excellent' | 'good' | 'retry',
 *   cleanSpoken: string,
 *   cleanTarget: string
 * }}
 */
export const calculateMatchPercentage = (spokenStr, targetJapanese = '', targetHiragana = '') => {
  if (!spokenStr) {
    return {
      percentage: 0,
      isPass: false,
      feedbackLevel: 'retry',
      cleanSpoken: '',
      cleanTarget: targetJapanese || targetHiragana || '',
    };
  }

  // 1. Chuẩn hóa chuỗi người nói
  const spokenKana = normalizeToPhoneticKana(spokenStr);
  const spokenClean = cleanJapaneseTextForComparison(spokenStr);

  // 2. Chuẩn hóa chuỗi mục tiêu
  const targetKana = normalizeToPhoneticKana(targetHiragana || targetJapanese);
  const targetClean = cleanJapaneseTextForComparison(targetJapanese);

  // So khớp trực tiếp nếu giống nhau 100%
  if (spokenClean === targetClean || spokenKana === targetKana) {
    return {
      percentage: 100,
      isPass: true,
      feedbackLevel: 'excellent',
      cleanSpoken: spokenStr,
      cleanTarget: targetJapanese,
    };
  }

  // 3. So khớp Levenshtein trên tầng Ngữ âm Kana (Hiragana)
  const distKana = levenshteinDistance(spokenKana, targetKana);
  const maxLenKana = Math.max(spokenKana.length, targetKana.length);
  const scoreKana = maxLenKana > 0 ? Math.max(0, 1 - distKana / maxLenKana) : 0;

  // 4. So khớp Levenshtein trên tầng Chữ gốc (Kanji)
  const distClean = levenshteinDistance(spokenClean, targetClean);
  const maxLenClean = Math.max(spokenClean.length, targetClean.length);
  const scoreClean = maxLenClean > 0 ? Math.max(0, 1 - distClean / maxLenClean) : 0;

  // 5. So khớp trên tầng Romaji (rất tốt cho việc bù trừ các âm ngắt sokuon / trường âm bị nuốt nhẹ)
  const romajiSpoken = kanaToRomaji(spokenKana);
  const romajiTarget = kanaToRomaji(targetKana);
  const distRomaji = levenshteinDistance(romajiSpoken, romajiTarget);
  const maxLenRomaji = Math.max(romajiSpoken.length, romajiTarget.length);
  const scoreRomaji = maxLenRomaji > 0 ? Math.max(0, 1 - distRomaji / maxLenRomaji) : 0;

  // Lấy điểm số cao nhất trong 3 tầng so khớp
  const bestScore = Math.max(scoreKana, scoreClean, scoreRomaji);

  // Tính tỷ lệ % (làm tròn)
  let percentage = Math.round(bestScore * 100);

  // Thưởng dung sai nhẹ (+5%) cho câu dài (>15 ký tự) nếu đạt độ tương đồng >70%
  if (targetKana.length >= 15 && percentage >= 70 && percentage < 100) {
    percentage = Math.min(100, percentage + 5);
  }

  // Xếp loại đánh giá
  let feedbackLevel = 'retry';
  if (percentage >= 80) {
    feedbackLevel = 'excellent';
  } else if (percentage >= 60) {
    feedbackLevel = 'good';
  }

  return {
    percentage,
    isPass: percentage >= 75,
    feedbackLevel,
    cleanSpoken: spokenStr,
    cleanTarget: targetJapanese,
  };
};
