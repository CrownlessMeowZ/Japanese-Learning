import * as wanakana from 'wanakana';

/**
 * Romaji to Japanese (Hiragana & Katakana) Converter
 * Tự động chuyển đổi chuỗi Romaji sang chữ Nhật chuẩn xác:
 * - Tích hợp thư viện chuẩn quốc tế wanakana cho việc chuyển đổi âm tiết Hepburn/Kunrei
 * - Duy trì bảng từ điển Katakana thông dụng cho các từ mượn ngoại lai (ví dụ: "biiru" -> "ビール", "biru" -> "ビル")
 */

/**
 * Bảng từ điển Katakana thông dụng trong Dekiru Nihongo & đời sống hàng ngày
 * Giúp phân biệt rạch ròi các từ đồng âm/gần âm mượn tiếng nước ngoài
 */
export const COMMON_KATAKANA_MAP = {
  biiru: 'ビール', 'bi-ru': 'ビール', 'bīru': 'ビール',
  biru: 'ビル',
  koohii: 'コーヒー', 'ko-hi-': 'コーヒー', kohi: 'コーヒー', 'kōhī': 'コーヒー',
  pan: 'パン', terebi: 'テレビ', toire: 'トイレ', wain: 'ワイン',
  juusu: 'ジュース', 'ju-su': 'ジュース', 'jūsu': 'ジュース',
  depaato: 'デパート', apaato: 'アパート', hoteru: 'ホテル',
  suupaa: 'スーパー', 'su-pa-': 'スーパー', 'sūpā': 'スーパー',
  keeki: 'ケーキ', 'ke-ki': 'ケーキ', 'kēki': 'ケーキ',
  chizu: 'チーズ', chiizu: 'チーズ',
  sandoicchi: 'サンドイッチ', bataa: 'バター',
  shatsu: 'シャツ', taoru: 'タオル', kamera: 'カメラ',
  pasokon: 'パソコン', sumaho: 'スマホ', nooto: 'ノート',
  pen: 'ペン', boorupen: 'ボールペン', shawaa: 'シャワー',
  purezento: 'プレゼント', supoon: 'スプーン', fooku: 'フォーク',
  naifu: 'ナイフ', kappu: 'カップ', koppu: 'コップ',
  resutoran: 'レストラン', teepu: 'テープ',
  aisu: 'アイス', aisukuriimu: 'アイスクリーム',
  beddo: 'ベッド', patei: 'パーティー', paatii: 'パーティー',
  dansu: 'ダンス', karaoke: 'カラオケ',
  intaanetto: 'インターネット', intanetto: 'インターネット'
};

/**
 * Chuyển chuỗi Romaji sang Hiragana chuẩn xác qua wanakana
 * @param {string} text - Chuỗi văn bản người dùng gõ
 * @returns {string} Chuỗi sau khi map sang Hiragana
 */
export function romajiToHiragana(text) {
  if (!text || typeof text !== 'string') return '';
  return wanakana.toHiragana(text.trim());
}

/**
 * Chuyển chuỗi Romaji sang chữ Nhật thông minh (ưu tiên Katakana cho từ mượn)
 * @param {string} text
 * @returns {string}
 */
export function romajiToJapanese(text) {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim().toLowerCase();

  // Nếu là từ mượn Katakana phổ biến (như biiru -> ビール, biru -> ビル)
  if (COMMON_KATAKANA_MAP[trimmed]) {
    return COMMON_KATAKANA_MAP[trimmed];
  }

  // Mặc định chuyển sang Hiragana (như mannaka -> まんなか, watashi -> わたし)
  return wanakana.toHiragana(trimmed);
}

/**
 * Chuyển Katakana sang Hiragana
 */
export function katakanaToHiragana(str) {
  if (!str || typeof str !== 'string') return '';
  return wanakana.toHiragana(str);
}

/**
 * Chuyển Hiragana sang Katakana
 */
export function hiraganaToKatakana(str) {
  if (!str || typeof str !== 'string') return '';
  return wanakana.toKatakana(str);
}

/**
 * Chuyển Kana (Hiragana hoặc Katakana) sang Romaji chuẩn
 */
export function kanaToRomaji(kana) {
  if (!kana || typeof kana !== 'string') return '';
  return wanakana.toRomaji(kana.trim());
}

/**
 * Kiểm tra xem chuỗi có phải là Romaji hay không
 * @param {string} text
 * @returns {boolean}
 */
export function isProbablyRomaji(text) {
  if (!text || typeof text !== 'string') return false;
  return wanakana.isRomaji(text.trim());
}
