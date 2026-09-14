/**
 * Romaji to Japanese (Hiragana & Katakana) Converter
 * Tự động chuyển đổi chuỗi Romaji sang chữ Nhật chuẩn xác:
 * - Hỗ trợ Hiragana (ví dụ: "watashi" -> "わたし", "mannaka" -> "まんなか", "gakkou" -> "がっこう")
 * - Nhận diện chính xác các từ mượn Katakana phổ biến (ví dụ: "biiru" -> "ビール" (bia), "biru" -> "ビル" (tòa nhà))
 * - Xử lý chuẩn xác âm mũi 'n' (kondo -> こんど, shinbun -> しんぶん) và phụ âm đôi sokuon (っ)
 */

const ROMAJI_TO_HIRAGANA_MAP = {
  // Trigraphs & Digraphs (Ưu tiên thay thế các cụm dài trước)
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
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
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

const SORTED_KEYS = Object.keys(ROMAJI_TO_HIRAGANA_MAP).sort((a, b) => b.length - a.length);
const ROMAJI_REGEX = new RegExp(SORTED_KEYS.join('|'), 'g');

/**
 * Bảng từ điển Katakana thông dụng trong Dekiru Nihongo & đời sống hàng ngày
 * Giúp phân biệt rạch ròi các từ đồng âm/gần âm:
 * - "biiru" (bia) -> "ビール"
 * - "biru" (tòa nhà) -> "ビル"
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
 * Chuyển chuỗi Romaji sang Hiragana chuẩn xác
 * @param {string} text - Chuỗi văn bản người dùng gõ
 * @returns {string} Chuỗi sau khi map sang Hiragana
 */
export function romajiToHiragana(text) {
  if (!text || typeof text !== 'string') return '';
  let str = text.toLowerCase().trim();

  // 1. Xử lý 'nn' theo sau bởi nguyên âm hoặc y (ví dụ: mannaka -> まんなか, onnanoko -> おんなのこ)
  str = str.replace(/nn([aiueoy])/g, (match, p1) => 'んn' + p1);

  // 2. Xử lý n' hoặc n- (ví dụ: shin'ai -> しんあい)
  str = str.replace(/n['’\-]/g, 'ん');

  // 3. Xử lý 'n' đứng trước phụ âm (trừ y) hoặc cuối từ -> 'ん' (kondo -> こんど, shinbun -> しんぶん)
  str = str.replace(/n(?=[^aiueoy\s]|$)/g, 'ん');

  // 4. Xử lý phụ âm đôi sokuon (っ)
  str = str.replace(/tc(?=ch)/g, 'っ');
  str = str.replace(/([bcdfghjklmpqrstvwxyz])\1/g, (match, p1) => {
    if (p1 === 'n') return 'ん';
    return 'っ' + p1;
  });

  // 5. Map sang ký tự Hiragana
  return str.replace(ROMAJI_REGEX, (match) => ROMAJI_TO_HIRAGANA_MAP[match] || match);
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
  return romajiToHiragana(trimmed);
}

/**
 * Chuyển Katakana sang Hiragana
 */
export function katakanaToHiragana(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/**
 * Chuyển Hiragana sang Katakana
 */
export function hiraganaToKatakana(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

const KANA_TO_ROMAJI_MAP = {
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho', 'し': 'shi',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho', 'ち': 'chi', 'つ': 'tsu',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo', 'じ': 'ji',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ne': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'ん': 'n'
};

/**
 * Chuyển Kana (Hiragana hoặc Katakana) sang Romaji chuẩn
 * Hỗ trợ tự động: sokuon (っ/ッ), trường âm (ー), âm ghép (きゃ, しゃ...)
 */
export function kanaToRomaji(kana) {
  if (!kana || typeof kana !== 'string') return '';
  const hira = katakanaToHiragana(kana).replace(/[（）()]/g, '').trim();
  let result = '';

  for (let i = 0; i < hira.length; i++) {
    const two = hira.slice(i, i + 2);
    // Xử lý âm ngắt sokuon っ
    if (two[0] === 'っ') {
      const nextPair = hira.slice(i + 1, i + 3);
      const nextRom = KANA_TO_ROMAJI_MAP[nextPair] || KANA_TO_ROMAJI_MAP[hira[i + 1]] || '';
      result += nextRom[0] || '';
      continue;
    }
    // Xử lý trường âm ー (kéo dài nguyên âm liền trước)
    if (two[1] === 'ー') {
      const baseRom = KANA_TO_ROMAJI_MAP[two[0]] || '';
      const lastVowel = baseRom.slice(-1);
      result += baseRom + lastVowel;
      i++;
      continue;
    }
    // Xử lý âm ghép 2 ký tự (きゃ, しゃ...)
    if (KANA_TO_ROMAJI_MAP[two]) {
      result += KANA_TO_ROMAJI_MAP[two];
      i++;
      continue;
    }
    // Xử lý từng ký tự đơn
    const one = hira[i];
    if (KANA_TO_ROMAJI_MAP[one]) {
      result += KANA_TO_ROMAJI_MAP[one];
    } else {
      result += one;
    }
  }

  return result;
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
