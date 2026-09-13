/**
 * ============================================================================
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm
 * ============================================================================
 * Thuật toán tính toán chu kỳ lặp lại ngắt quãng (Spaced Repetition)
 * dựa trên chất lượng phản hồi (quality: 0 - 5).
 */

/**
 * Trả về chuỗi ngày theo giờ địa phương định dạng YYYY-MM-DD
 */
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Cộng thêm số ngày vào một mốc ngày (YYYY-MM-DD) và trả về YYYY-MM-DD
 */
export const addDaysToDate = (baseDateStr, days) => {
  const base = baseDateStr
    ? new Date(`${baseDateStr}T00:00:00`)
    : new Date();
  base.setDate(base.getDate() + Math.max(0, days));

  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Tính toán trạng thái SRS tiếp theo theo thuật toán SM-2
 *
 * @param {number} quality Điểm đánh giá (0-5)
 *   0: Hoàn toàn quên
 *   1: Trả lời sai, nhận ra khi xem đáp án
 *   2: Trả lời sai nhưng nhớ mang máng
 *   3: Nhớ nhưng gặp khó khăn lớn
 *   4: Nhớ sau một chút ngập ngừng
 *   5: Phản xạ hoàn hảo, nhớ ngay lập tức
 * @param {number} [interval=0] Khoảng cách ngày hiện tại
 * @param {number} [repetition=0] Số lần lặp lại thành công liên tiếp
 * @param {number} [easinessFactor=2.5] Hệ số dễ (EF), tối thiểu 1.3
 * @returns {{ interval: number, repetition: number, easinessFactor: number }}
 */
export const calculateSM2 = (
  quality,
  interval = 0,
  repetition = 0,
  easinessFactor = 2.5
) => {
  // Chuẩn hóa input
  const q = Math.max(0, Math.min(5, Math.round(Number(quality) || 0)));
  const currentInterval = Math.max(0, Math.round(Number(interval) || 0));
  const currentRepetition = Math.max(0, Math.round(Number(repetition) || 0));
  const currentEF = Math.max(1.3, Number(easinessFactor) || 2.5);

  let nextInterval = 1;
  let nextRepetition = 0;

  // Cập nhật Easiness Factor (EF)
  // Công thức chuẩn SM-2: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let nextEF = currentEF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (nextEF < 1.3) {
    nextEF = 1.3;
  }
  // Giữ 2 chữ số thập phân cho đẹp và tránh sai số float
  nextEF = Math.round(nextEF * 100) / 100;

  // Đánh giá thành công (quality >= 3)
  if (q >= 3) {
    if (currentRepetition === 0) {
      nextInterval = 1;
    } else if (currentRepetition === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(currentInterval * currentEF);
    }
    nextRepetition = currentRepetition + 1;
  } else {
    // Trả lời sai (quality < 3): Reset chuỗi về vạch xuất phát
    nextRepetition = 0;
    nextInterval = 1;
  }

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    easinessFactor: nextEF,
  };
};
