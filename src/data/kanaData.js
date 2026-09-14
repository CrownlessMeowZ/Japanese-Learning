/**
 * Kana Dataset - Bộ Dữ Liệu Bảng Chữ Cái Tiếng Nhật (Hiragana & Katakana)
 * Đầy đủ 104 âm Hiragana & 104 âm Katakana:
 * 1. Seion (Âm cơ bản - 46 chữ)
 * 2. Dakuon & Handakuon (Âm đục & âm bán đục - 25 chữ)
 * 3. Yōon (Âm ghép - 33 chữ)
 */

export const KANA_SECTIONS = [
  {
    id: 'seion',
    title: 'Âm Cơ Bản (Seion - 清音)',
    description: '46 chữ cái cơ bản cấu thành nền tảng phát âm tiếng Nhật',
    rows: [
      {
        id: 'row-a',
        name: 'Hàng A (Nguyên âm)',
        items: [
          { romaji: 'a', hira: 'あ', kata: 'ア', alts: ['a'] },
          { romaji: 'i', hira: 'い', kata: 'イ', alts: ['i'] },
          { romaji: 'u', hira: 'う', kata: 'ウ', alts: ['u'] },
          { romaji: 'e', hira: 'え', kata: 'エ', alts: ['e'] },
          { romaji: 'o', hira: 'お', kata: 'オ', alts: ['o'] },
        ],
      },
      {
        id: 'row-ka',
        name: 'Hàng Ka',
        items: [
          { romaji: 'ka', hira: 'か', kata: 'カ', alts: ['ka'] },
          { romaji: 'ki', hira: 'き', kata: 'キ', alts: ['ki'] },
          { romaji: 'ku', hira: 'く', kata: 'ク', alts: ['ku'] },
          { romaji: 'ke', hira: 'け', kata: 'ケ', alts: ['ke'] },
          { romaji: 'ko', hira: 'こ', kata: 'コ', alts: ['ko'] },
        ],
      },
      {
        id: 'row-sa',
        name: 'Hàng Sa',
        items: [
          { romaji: 'sa', hira: 'さ', kata: 'サ', alts: ['sa'] },
          { romaji: 'shi', hira: 'し', kata: 'シ', alts: ['shi', 'si'] },
          { romaji: 'su', hira: 'す', kata: 'ス', alts: ['su'] },
          { romaji: 'se', hira: 'せ', kata: 'セ', alts: ['se'] },
          { romaji: 'so', hira: 'そ', kata: 'ソ', alts: ['so'] },
        ],
      },
      {
        id: 'row-ta',
        name: 'Hàng Ta',
        items: [
          { romaji: 'ta', hira: 'た', kata: 'タ', alts: ['ta'] },
          { romaji: 'chi', hira: 'ち', kata: 'チ', alts: ['chi', 'ti'] },
          { romaji: 'tsu', hira: 'つ', kata: 'ツ', alts: ['tsu', 'tu'] },
          { romaji: 'te', hira: 'て', kata: 'テ', alts: ['te'] },
          { romaji: 'to', hira: 'と', kata: 'ト', alts: ['to'] },
        ],
      },
      {
        id: 'row-na',
        name: 'Hàng Na',
        items: [
          { romaji: 'na', hira: 'な', kata: 'ナ', alts: ['na'] },
          { romaji: 'ni', hira: 'に', kata: 'ニ', alts: ['ni'] },
          { romaji: 'nu', hira: 'ぬ', kata: 'ヌ', alts: ['nu'] },
          { romaji: 'ne', hira: 'ね', kata: 'ネ', alts: ['ne'] },
          { romaji: 'no', hira: 'の', kata: 'ノ', alts: ['no'] },
        ],
      },
      {
        id: 'row-ha',
        name: 'Hàng Ha',
        items: [
          { romaji: 'ha', hira: 'は', kata: 'ハ', alts: ['ha'] },
          { romaji: 'hi', hira: 'ひ', kata: 'ヒ', alts: ['hi'] },
          { romaji: 'fu', hira: 'ふ', kata: 'フ', alts: ['fu', 'hu'] },
          { romaji: 'he', hira: 'へ', kata: 'ヘ', alts: ['he'] },
          { romaji: 'ho', hira: 'ほ', kata: 'ホ', alts: ['ho'] },
        ],
      },
      {
        id: 'row-ma',
        name: 'Hàng Ma',
        items: [
          { romaji: 'ma', hira: 'ま', kata: 'マ', alts: ['ma'] },
          { romaji: 'mi', hira: 'み', kata: 'ミ', alts: ['mi'] },
          { romaji: 'mu', hira: 'む', kata: 'ム', alts: ['mu'] },
          { romaji: 'me', hira: 'め', kata: 'メ', alts: ['me'] },
          { romaji: 'mo', hira: 'も', kata: 'モ', alts: ['mo'] },
        ],
      },
      {
        id: 'row-ya',
        name: 'Hàng Ya',
        items: [
          { romaji: 'ya', hira: 'や', kata: 'ヤ', alts: ['ya'] },
          { romaji: 'yu', hira: 'ゆ', kata: 'ユ', alts: ['yu'] },
          { romaji: 'yo', hira: 'よ', kata: 'ヨ', alts: ['yo'] },
        ],
      },
      {
        id: 'row-ra',
        name: 'Hàng Ra',
        items: [
          { romaji: 'ra', hira: 'ら', kata: 'ラ', alts: ['ra'] },
          { romaji: 'ri', hira: 'り', kata: 'リ', alts: ['ri'] },
          { romaji: 'ru', hira: 'る', kata: 'ル', alts: ['ru'] },
          { romaji: 're', hira: 'れ', kata: 'レ', alts: ['re'] },
          { romaji: 'ro', hira: 'ろ', kata: 'ロ', alts: ['ro'] },
        ],
      },
      {
        id: 'row-wa',
        name: 'Hàng Wa & N',
        items: [
          { romaji: 'wa', hira: 'わ', kata: 'ワ', alts: ['wa'] },
          { romaji: 'wo', hira: 'を', kata: 'ヲ', alts: ['wo', 'o'] },
          { romaji: 'n', hira: 'ん', kata: 'ン', alts: ['n', 'nn'] },
        ],
      },
    ],
  },
  {
    id: 'dakuon',
    title: 'Âm Đục & Bán Đục (Dakuon & Handakuon - 濁音 / 半濁音)',
    description: '25 âm có thêm dấu Tenten (゛) hoặc Maru (゜)',
    rows: [
      {
        id: 'row-ga',
        name: 'Hàng Ga (Tenten ゛)',
        items: [
          { romaji: 'ga', hira: 'が', kata: 'ガ', alts: ['ga'] },
          { romaji: 'gi', hira: 'ぎ', kata: 'ギ', alts: ['gi'] },
          { romaji: 'gu', hira: 'ぐ', kata: 'グ', alts: ['gu'] },
          { romaji: 'ge', hira: 'げ', kata: 'ゲ', alts: ['ge'] },
          { romaji: 'go', hira: 'ご', kata: 'ゴ', alts: ['go'] },
        ],
      },
      {
        id: 'row-za',
        name: 'Hàng Za (Tenten ゛)',
        items: [
          { romaji: 'za', hira: 'ざ', kata: 'ザ', alts: ['za'] },
          { romaji: 'ji', hira: 'じ', kata: 'ジ', alts: ['ji', 'zi'] },
          { romaji: 'zu', hira: 'ず', kata: 'ズ', alts: ['zu'] },
          { romaji: 'ze', hira: 'ぜ', kata: 'ゼ', alts: ['ze'] },
          { romaji: 'zo', hira: 'ぞ', kata: 'ゾ', alts: ['zo'] },
        ],
      },
      {
        id: 'row-da',
        name: 'Hàng Da (Tenten ゛)',
        items: [
          { romaji: 'da', hira: 'だ', kata: 'ダ', alts: ['da'] },
          { romaji: 'ji', hira: 'ぢ', kata: 'ヂ', alts: ['ji', 'di'] },
          { romaji: 'zu', hira: 'づ', kata: 'ヅ', alts: ['zu', 'du'] },
          { romaji: 'de', hira: 'で', kata: 'デ', alts: ['de'] },
          { romaji: 'do', hira: 'ど', kata: 'ド', alts: ['do'] },
        ],
      },
      {
        id: 'row-ba',
        name: 'Hàng Ba (Tenten ゛)',
        items: [
          { romaji: 'ba', hira: 'ば', kata: 'バ', alts: ['ba'] },
          { romaji: 'bi', hira: 'び', kata: 'ビ', alts: ['bi'] },
          { romaji: 'bu', hira: 'ぶ', kata: 'ブ', alts: ['bu'] },
          { romaji: 'be', hira: 'べ', kata: 'ベ', alts: ['be'] },
          { romaji: 'bo', hira: 'ぼ', kata: 'ボ', alts: ['bo'] },
        ],
      },
      {
        id: 'row-pa',
        name: 'Hàng Pa (Maru ゜)',
        items: [
          { romaji: 'pa', hira: 'ぱ', kata: 'パ', alts: ['pa'] },
          { romaji: 'pi', hira: 'ぴ', kata: 'ピ', alts: ['pi'] },
          { romaji: 'pu', hira: 'ぷ', kata: 'プ', alts: ['pu'] },
          { romaji: 'pe', hira: 'ぺ', kata: 'ペ', alts: ['pe'] },
          { romaji: 'po', hira: 'ぽ', kata: 'ポ', alts: ['po'] },
        ],
      },
    ],
  },
  {
    id: 'yoon',
    title: 'Âm Ghép (Yōon - 拗音)',
    description: '33 âm kết hợp với ya, yu, yo viết nhỏ (ゃ, ゅ, ょ)',
    rows: [
      {
        id: 'row-kya',
        name: 'Hàng Kya, Sha, Cha',
        items: [
          { romaji: 'kya', hira: 'きゃ', kata: 'キャ', alts: ['kya'] },
          { romaji: 'kyu', hira: 'きゅ', kata: 'キュ', alts: ['kyu'] },
          { romaji: 'kyo', hira: 'きょ', kata: 'キョ', alts: ['kyo'] },
          { romaji: 'sha', hira: 'しゃ', kata: 'シャ', alts: ['sha', 'sya'] },
          { romaji: 'shu', hira: 'しゅ', kata: 'シュ', alts: ['shu', 'syu'] },
          { romaji: 'sho', hira: 'しょ', kata: 'ショ', alts: ['sho', 'syo'] },
          { romaji: 'cha', hira: 'ちゃ', kata: 'チャ', alts: ['cha', 'tya'] },
          { romaji: 'chu', hira: 'ちゅ', kata: 'チュ', alts: ['chu', 'tyu'] },
          { romaji: 'cho', hira: 'ちょ', kata: 'チョ', alts: ['cho', 'tyo'] },
        ],
      },
      {
        id: 'row-nya',
        name: 'Hàng Nya, Hya, Mya, Rya',
        items: [
          { romaji: 'nya', hira: 'にゃ', kata: 'ニャ', alts: ['nya'] },
          { romaji: 'nyu', hira: 'にゅ', kata: 'ニュ', alts: ['nyu'] },
          { romaji: 'nyo', hira: 'にょ', kata: 'ニョ', alts: ['nyo'] },
          { romaji: 'hya', hira: 'ひゃ', kata: 'ヒャ', alts: ['hya'] },
          { romaji: 'hyu', hira: 'ひゅ', kata: 'ヒュ', alts: ['hyu'] },
          { romaji: 'hyo', hira: 'ひょ', kata: 'ヒョ', alts: ['hyo'] },
          { romaji: 'mya', hira: 'みゃ', kata: 'ミャ', alts: ['mya'] },
          { romaji: 'myu', hira: 'みゅ', kata: 'ミュ', alts: ['myu'] },
          { romaji: 'myo', hira: 'みょ', kata: 'ミョ', alts: ['myo'] },
          { romaji: 'rya', hira: 'りゃ', kata: 'リャ', alts: ['rya'] },
          { romaji: 'ryu', hira: 'りゅ', kata: 'リュ', alts: ['ryu'] },
          { romaji: 'ryo', hira: 'りょ', kata: 'リョ', alts: ['ryo'] },
        ],
      },
      {
        id: 'row-gya',
        name: 'Âm Ghép Đục (Gya, Ja, Bya, Pya)',
        items: [
          { romaji: 'gya', hira: 'ぎゃ', kata: 'ギャ', alts: ['gya'] },
          { romaji: 'gyu', hira: 'ぎゅ', kata: 'ギュ', alts: ['gyu'] },
          { romaji: 'gyo', hira: 'ぎょ', kata: 'ギョ', alts: ['gyo'] },
          { romaji: 'ja', hira: 'じゃ', kata: 'ジャ', alts: ['ja', 'zya', 'jya'] },
          { romaji: 'ju', hira: 'じゅ', kata: 'ジュ', alts: ['ju', 'zyu', 'jyu'] },
          { romaji: 'jo', hira: 'じょ', kata: 'ジョ', alts: ['jo', 'zyo', 'jyo'] },
          { romaji: 'bya', hira: 'びゃ', kata: 'ビャ', alts: ['bya'] },
          { romaji: 'byu', hira: 'びゅ', kata: 'ビュ', alts: ['byu'] },
          { romaji: 'byo', hira: 'びょ', kata: 'ビョ', alts: ['byo'] },
          { romaji: 'pya', hira: 'ぴゃ', kata: 'ピャ', alts: ['pya'] },
          { romaji: 'pyu', hira: 'ぴゅ', kata: 'ピュ', alts: ['pyu'] },
          { romaji: 'pyo', hira: 'ぴょ', kata: 'ピョ', alts: ['pyo'] },
        ],
      },
    ],
  },
];

/**
 * Lấy danh sách phẳng tất cả các ký tự theo loại bảng chữ cái (hira, kata hoặc both)
 * @param {'hiragana' | 'katakana' | 'both'} scriptType
 * @param {Array<string>} selectedRowIds
 * @returns {Array<Object>}
 */
export function getSelectedKanaItems(scriptType = 'hiragana', selectedRowIds = []) {
  const selectedSet = new Set(selectedRowIds);
  const results = [];

  KANA_SECTIONS.forEach((section) => {
    section.rows.forEach((row) => {
      if (selectedSet.has(row.id)) {
        row.items.forEach((item) => {
          if (scriptType === 'hiragana') {
            results.push({
              character: item.hira,
              romaji: item.romaji,
              alts: item.alts,
              type: 'hiragana',
              rowId: row.id,
              rowName: row.name,
            });
          } else if (scriptType === 'katakana') {
            results.push({
              character: item.kata,
              romaji: item.romaji,
              alts: item.alts,
              type: 'katakana',
              rowId: row.id,
              rowName: row.name,
            });
          } else {
            // Cả 2 (Trộn lẫn Hiragana & Katakana)
            results.push({
              character: item.hira,
              romaji: item.romaji,
              alts: item.alts,
              type: 'hiragana',
              rowId: row.id,
              rowName: row.name,
            });
            results.push({
              character: item.kata,
              romaji: item.romaji,
              alts: item.alts,
              type: 'katakana',
              rowId: row.id,
              rowName: row.name,
            });
          }
        });
      }
    });
  });

  return results;
}

/**
 * Lấy tất cả ID của các hàng (mặc định chọn hết)
 */
export function getAllRowIds() {
  const ids = [];
  KANA_SECTIONS.forEach((section) => {
    section.rows.forEach((row) => ids.push(row.id));
  });
  return ids;
}

/**
 * Lấy ID các hàng thuộc nhóm Seion (Âm cơ bản)
 */
export function getSeionRowIds() {
  const seion = KANA_SECTIONS.find((s) => s.id === 'seion');
  return seion ? seion.rows.map((r) => r.id) : [];
}
