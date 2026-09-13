/**
 * String Utility Module
 * Thuật toán so sánh xâu ký tự và tính toán độ tương đồng
 */

/**
 * Thuật toán Levenshtein Distance bằng Quy hoạch động (Dynamic Programming).
 * Đã tối ưu hóa không gian bộ nhớ (Space Optimization) từ O(M*N) xuống O(min(M, N)).
 * 
 * @param {string} s1 
 * @param {string} s2 
 * @returns {number} Khoảng cách chỉnh sửa tối thiểu (Số phép chèn, xóa, thay thế)
 * 
 * @complexity Time: O(M * N) với M = s1.length, N = s2.length.
 * @complexity Space: O(min(M, N)) - Chỉ lưu 2 dòng rolling buffer.
 */
export const levenshteinDistance = (s1, s2) => {
  if (s1 === s2) return 0;
  if (!s1) return s2 ? s2.length : 0;
  if (!s2) return s1.length;

  // Đảm bảo s1 luôn là chuỗi ngắn hơn để tối ưu mảng DP: O(min(M, N))
  let str1 = s1;
  let str2 = s2;
  if (str1.length > str2.length) {
    str1 = s2;
    str2 = s1;
  }

  const m = str1.length;
  const n = str2.length;

  // Khởi tạo rolling array với kích thước m + 1
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

    // Swap buffers
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[m];
};

/**
 * Làm sạch chuỗi tiếng Nhật:
 * - Loại bỏ dấu câu (。、！？!?・…「」『』（）()[]), khoảng trắng thừa
 * - Lọc thẻ phiên âm Furigana dạng "漢字[かんじ]" thành chữ Hán hoặc Kana tương ứng
 * 
 * @param {string} text 
 * @returns {string}
 */
export const cleanJapaneseTextForComparison = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\[(.*?)\]/g, '$1') // Bỏ ngoặc vuông giữ kana
    .replace(/[\s。、！？!?・…「」『』（）()\-–—_~〜]/g, '')
    .trim()
    .toLowerCase();
};

/**
 * Tính tỷ lệ % khớp giữa chuỗi phát âm thực tế và câu mục tiêu
 * 
 * @param {string} spokenStr - Chuỗi user nói qua Speech Recognition
 * @param {string} targetStr - Chuỗi câu tiếng Nhật mục tiêu
 * @returns {{ percentage: number, distance: number, cleanSpoken: string, cleanTarget: string }}
 */
export const calculateMatchPercentage = (spokenStr, targetStr) => {
  const cleanSpoken = cleanJapaneseTextForComparison(spokenStr);
  const cleanTarget = cleanJapaneseTextForComparison(targetStr);

  if (!cleanSpoken || !cleanTarget) {
    return { percentage: 0, distance: 0, cleanSpoken, cleanTarget };
  }

  if (cleanSpoken === cleanTarget) {
    return { percentage: 100, distance: 0, cleanSpoken, cleanTarget };
  }

  const distance = levenshteinDistance(cleanSpoken, cleanTarget);
  const maxLength = Math.max(cleanSpoken.length, cleanTarget.length);

  // Tỷ lệ tương đồng = (1 - distance / max_len) * 100
  const ratio = Math.max(0, 1 - distance / maxLength);
  const percentage = Math.round(ratio * 100);

  return {
    percentage,
    distance,
    cleanSpoken,
    cleanTarget,
  };
};
