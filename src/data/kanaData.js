/**
 * Kana Dataset - Bộ Dữ Liệu Bảng Chữ Cái Tiếng Nhật (Hiragana & Katakana)
 * Chuẩn Tofugu (https://kana-quiz.tofugu.com/)
 *
 * Phân chia đầy đủ theo cấu trúc:
 * 1. Main Kana (Âm cơ bản - Seion: 10 hàng, 46 chữ cái)
 * 2. Dakuten Kana (Âm đục & bán đục - Dakuon & Handakuon: Hiragana có 5 hàng, Katakana có thêm hàng ヴ/vu)
 * 3. Combination Kana (Âm ghép - Yōon chuẩn: 12 hàng)
 * 4. Extended Katakana (Âm ghép ngoại lai Katakana: 8 hàng gồm ヴァ, ウィ, ファ, ツァ, シェ, ジェ, チェ, Irregular)
 */

// 1. ÂM CƠ BẢN (SEION - 清音: Dùng chung cho Hiragana & Katakana)
export const SEION_ROWS = [
  {
    id: 'row-a',
    name: 'Hàng A (a, i, u, e, o)',
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
    name: 'Hàng Ka (ka, ki, ku, ke, ko)',
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
    name: 'Hàng Sa (sa, shi, su, se, so)',
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
    name: 'Hàng Ta (ta, chi, tsu, te, to)',
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
    name: 'Hàng Na (na, ni, nu, ne, no)',
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
    name: 'Hàng Ha (ha, hi, fu, he, ho)',
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
    name: 'Hàng Ma (ma, mi, mu, me, mo)',
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
    name: 'Hàng Ya (ya, yu, yo)',
    items: [
      { romaji: 'ya', hira: 'や', kata: 'ヤ', alts: ['ya'] },
      { romaji: 'yu', hira: 'ゆ', kata: 'ユ', alts: ['yu'] },
      { romaji: 'yo', hira: 'よ', kata: 'ヨ', alts: ['yo'] },
    ],
  },
  {
    id: 'row-ra',
    name: 'Hàng Ra (ra, ri, ru, re, ro)',
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
    name: 'Hàng Wa & N (wa, wo, n)',
    items: [
      { romaji: 'wa', hira: 'わ', kata: 'ワ', alts: ['wa'] },
      { romaji: 'wo', hira: 'を', kata: 'ヲ', alts: ['wo', 'o'] },
      { romaji: 'n', hira: 'ん', kata: 'ン', alts: ['n', 'nn'] },
    ],
  },
];

// 2. ÂM ĐỤC & BÁN ĐỤC CHUẨN (DAKUON - 5 hàng cơ bản)
export const COMMON_DAKUON_ROWS = [
  {
    id: 'row-ga',
    name: 'Hàng Ga (ga, gi, gu, ge, go)',
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
    name: 'Hàng Za (za, ji, zu, ze, zo)',
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
    name: 'Hàng Da (da, ji, zu, de, do)',
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
    name: 'Hàng Ba (ba, bi, bu, be, bo)',
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
    name: 'Hàng Pa (pa, pi, pu, pe, po)',
    items: [
      { romaji: 'pa', hira: 'ぱ', kata: 'パ', alts: ['pa'] },
      { romaji: 'pi', hira: 'ぴ', kata: 'ピ', alts: ['pi'] },
      { romaji: 'pu', hira: 'ぷ', kata: 'プ', alts: ['pu'] },
      { romaji: 'pe', hira: 'ぺ', kata: 'ペ', alts: ['pe'] },
      { romaji: 'po', hira: 'ぽ', kata: 'ポ', alts: ['po'] },
    ],
  },
];

// Hàng âm đục đặc thù Katakana: ヴ (vu)
export const KATAKANA_VU_ROW = {
  id: 'row-vu',
  name: 'Hàng Vu (ヴ)',
  items: [
    { romaji: 'vu', hira: 'ゔ', kata: 'ヴ', alts: ['vu'] },
  ],
};

// 3. ÂM GHÉP CHUẨN (YŌON - 12 hàng theo chuẩn Tofugu)
export const COMMON_YOON_ROWS = [
  {
    id: 'row-kya',
    name: 'Hàng Kya (kya, kyu, kyo)',
    items: [
      { romaji: 'kya', hira: 'きゃ', kata: 'キャ', alts: ['kya'] },
      { romaji: 'kyu', hira: 'きゅ', kata: 'キュ', alts: ['kyu'] },
      { romaji: 'kyo', hira: 'きょ', kata: 'キョ', alts: ['kyo'] },
    ],
  },
  {
    id: 'row-sha',
    name: 'Hàng Sha (sha, shu, sho)',
    items: [
      { romaji: 'sha', hira: 'しゃ', kata: 'シャ', alts: ['sha', 'sya'] },
      { romaji: 'shu', hira: 'しゅ', kata: 'シュ', alts: ['shu', 'syu'] },
      { romaji: 'sho', hira: 'しょ', kata: 'ショ', alts: ['sho', 'syo'] },
    ],
  },
  {
    id: 'row-cha',
    name: 'Hàng Cha (cha, chu, cho)',
    items: [
      { romaji: 'cha', hira: 'ちゃ', kata: 'チャ', alts: ['cha', 'tya'] },
      { romaji: 'chu', hira: 'ちゅ', kata: 'チュ', alts: ['chu', 'tyu'] },
      { romaji: 'cho', hira: 'ちょ', kata: 'チョ', alts: ['cho', 'tyo'] },
    ],
  },
  {
    id: 'row-nya',
    name: 'Hàng Nya (nya, nyu, nyo)',
    items: [
      { romaji: 'nya', hira: 'にゃ', kata: 'ニャ', alts: ['nya'] },
      { romaji: 'nyu', hira: 'にゅ', kata: 'ニュ', alts: ['nyu'] },
      { romaji: 'nyo', hira: 'にょ', kata: 'ニョ', alts: ['nyo'] },
    ],
  },
  {
    id: 'row-hya',
    name: 'Hàng Hya (hya, hyu, hyo)',
    items: [
      { romaji: 'hya', hira: 'ひゃ', kata: 'ヒャ', alts: ['hya'] },
      { romaji: 'hyu', hira: 'ひゅ', kata: 'ヒュ', alts: ['hyu'] },
      { romaji: 'hyo', hira: 'ひょ', kata: 'ヒョ', alts: ['hyo'] },
    ],
  },
  {
    id: 'row-mya',
    name: 'Hàng Mya (mya, myu, myo)',
    items: [
      { romaji: 'mya', hira: 'みゃ', kata: 'ミャ', alts: ['mya'] },
      { romaji: 'myu', hira: 'みゅ', kata: 'ミュ', alts: ['myu'] },
      { romaji: 'myo', hira: 'みょ', kata: 'ミョ', alts: ['myo'] },
    ],
  },
  {
    id: 'row-rya',
    name: 'Hàng Rya (rya, ryu, ryo)',
    items: [
      { romaji: 'rya', hira: 'りゃ', kata: 'リャ', alts: ['rya'] },
      { romaji: 'ryu', hira: 'りゅ', kata: 'リュ', alts: ['ryu'] },
      { romaji: 'ryo', hira: 'りょ', kata: 'リョ', alts: ['ryo'] },
    ],
  },
  {
    id: 'row-gya',
    name: 'Hàng Gya (gya, gyu, gyo)',
    items: [
      { romaji: 'gya', hira: 'ぎゃ', kata: 'ギャ', alts: ['gya'] },
      { romaji: 'gyu', hira: 'ぎゅ', kata: 'ギュ', alts: ['gyu'] },
      { romaji: 'gyo', hira: 'ぎょ', kata: 'ギョ', alts: ['gyo'] },
    ],
  },
  {
    id: 'row-ja',
    name: 'Hàng Ja (ja, ju, jo)',
    items: [
      { romaji: 'ja', hira: 'じゃ', kata: 'ジャ', alts: ['ja', 'zya', 'jya'] },
      { romaji: 'ju', hira: 'じゅ', kata: 'ジュ', alts: ['ju', 'zyu', 'jyu'] },
      { romaji: 'jo', hira: 'じょ', kata: 'ジョ', alts: ['jo', 'zyo', 'jyo'] },
    ],
  },
  {
    id: 'row-dya',
    name: 'Hàng Dya (dya, dyu, dyo)',
    items: [
      { romaji: 'dya', hira: 'ぢゃ', kata: 'ヂャ', alts: ['dya', 'ja'] },
      { romaji: 'dyu', hira: 'ぢゅ', kata: 'ヂュ', alts: ['dyu', 'ju'] },
      { romaji: 'dyo', hira: 'ぢょ', kata: 'ヂョ', alts: ['dyo', 'jo'] },
    ],
  },
  {
    id: 'row-bya',
    name: 'Hàng Bya (bya, byu, byo)',
    items: [
      { romaji: 'bya', hira: 'びゃ', kata: 'ビャ', alts: ['bya'] },
      { romaji: 'byu', hira: 'びゅ', kata: 'ビュ', alts: ['byu'] },
      { romaji: 'byo', hira: 'びょ', kata: 'ビョ', alts: ['byo'] },
    ],
  },
  {
    id: 'row-pya',
    name: 'Hàng Pya (pya, pyu, pyo)',
    items: [
      { romaji: 'pya', hira: 'ぴゃ', kata: 'ピャ', alts: ['pya'] },
      { romaji: 'pyu', hira: 'ぴゅ', kata: 'ピュ', alts: ['pyu'] },
      { romaji: 'pyo', hira: 'ぴょ', kata: 'ピョ', alts: ['pyo'] },
    ],
  },
];

// 4. ÂM GHÉP NGOẠI LAI KATAKANA (EXTENDED / FOREIGN KATAKANA - 8 hàng theo Tofugu)
export const EXTENDED_KATAKANA_ROWS = [
  {
    id: 'row-va',
    name: 'Hàng Va (ヴァ, ヴィ, ヴェ, ヴォ)',
    items: [
      { romaji: 'va', hira: 'ゔぁ', kata: 'ヴァ', alts: ['va'] },
      { romaji: 'vi', hira: 'ゔぃ', kata: 'ヴィ', alts: ['vi'] },
      { romaji: 've', hira: 'ゔぇ', kata: 'ヴェ', alts: ['ve'] },
      { romaji: 'vo', hira: 'ゔぉ', kata: 'ヴォ', alts: ['vo'] },
    ],
  },
  {
    id: 'row-wi',
    name: 'Hàng Wi (ウィ, ウェ, ウォ)',
    items: [
      { romaji: 'wi', hira: 'うぃ', kata: 'ウィ', alts: ['wi', 'ui'] },
      { romaji: 'we', hira: 'うぇ', kata: 'ウェ', alts: ['we'] },
      { romaji: 'wo', hira: 'うぉ', kata: 'ウォ', alts: ['wo'] },
    ],
  },
  {
    id: 'row-fa',
    name: 'Hàng Fa (ファ, フィ, フェ, フォ)',
    items: [
      { romaji: 'fa', hira: 'ふぁ', kata: 'ファ', alts: ['fa', 'fua'] },
      { romaji: 'fi', hira: 'ふぃ', kata: 'フィ', alts: ['fi', 'fui'] },
      { romaji: 'fe', hira: 'ふぇ', kata: 'フェ', alts: ['fe', 'fue'] },
      { romaji: 'fo', hira: 'ふぉ', kata: 'フォ', alts: ['fo', 'fuo'] },
    ],
  },
  {
    id: 'row-tsa',
    name: 'Hàng Tsa (ツァ, ツィ, ツェ, ツォ)',
    items: [
      { romaji: 'tsa', hira: 'つぁ', kata: 'ツァ', alts: ['tsa'] },
      { romaji: 'tsi', hira: 'つぃ', kata: 'ツィ', alts: ['tsi'] },
      { romaji: 'tse', hira: 'つぇ', kata: 'ツェ', alts: ['tse'] },
      { romaji: 'tso', hira: 'つぉ', kata: 'ツォ', alts: ['tso'] },
    ],
  },
  {
    id: 'row-she',
    name: 'Hàng She (シェ)',
    items: [
      { romaji: 'she', hira: 'しぇ', kata: 'シェ', alts: ['she', 'sye'] },
    ],
  },
  {
    id: 'row-je',
    name: 'Hàng Je (ジェ)',
    items: [
      { romaji: 'je', hira: 'じぇ', kata: 'ジェ', alts: ['je', 'zye'] },
    ],
  },
  {
    id: 'row-che',
    name: 'Hàng Che (チェ)',
    items: [
      { romaji: 'che', hira: 'ちぇ', kata: 'チェ', alts: ['che', 'tye'] },
    ],
  },
  {
    id: 'row-irregular',
    name: 'Hàng Irregular (ティ, ディ, トゥ, ドゥ)',
    items: [
      { romaji: 'ti', hira: 'てぃ', kata: 'ティ', alts: ['ti', 'thi'] },
      { romaji: 'di', hira: 'でぃ', kata: 'ディ', alts: ['di', 'dhi'] },
      { romaji: 'tu', hira: 'とぅ', kata: 'トゥ', alts: ['tu', 'twu'] },
      { romaji: 'du', hira: 'どぅ', kata: 'ドゥ', alts: ['du', 'dwu'] },
    ],
  },
];

/**
 * Lấy danh sách các Section tương ứng cho Hiragana, Katakana hoặc Kết Hợp Cả Hai
 * @param {'hiragana' | 'katakana' | 'both'} scriptType
 * @returns {Array<{ id: string, title: string, description: string, rows: Array<Object> }>}
 */
export function getKanaSections(scriptType = 'hiragana') {
  if (scriptType === 'hiragana') {
    return [
      {
        id: 'seion',
        title: 'Âm Cơ Bản (Main Kana - 清音: 46 chữ)',
        description: '46 chữ cái Hiragana cơ bản cấu thành nền tảng phát âm tiếng Nhật',
        rows: SEION_ROWS,
      },
      {
        id: 'dakuon',
        title: 'Âm Đục & Bán Đục (Dakuten Kana - 濁音/半濁音: 25 chữ)',
        description: '25 âm Hiragana có thêm dấu Tenten (゛) hoặc Maru (゜)',
        rows: COMMON_DAKUON_ROWS,
      },
      {
        id: 'yoon',
        title: 'Âm Ghép (Combination Kana - 拗音: 36 chữ)',
        description: '12 hàng âm ghép kết hợp với ya, yu, yo viết nhỏ (ゃ, ゅ, ょ)',
        rows: COMMON_YOON_ROWS,
      },
    ];
  }

  if (scriptType === 'katakana') {
    return [
      {
        id: 'seion',
        title: 'Âm Cơ Bản (Main Kana - 清音: 46 chữ)',
        description: '46 chữ cái Katakana cơ bản cấu thành nền tảng phiên âm từ mượn',
        rows: SEION_ROWS,
      },
      {
        id: 'dakuon',
        title: 'Âm Đục & Bán Đục (Dakuten Kana - 濁音/半濁音: 26 chữ)',
        description: '25 âm đục tiêu chuẩn + âm đặc thù ヴ (vu)',
        rows: [...COMMON_DAKUON_ROWS, KATAKANA_VU_ROW],
      },
      {
        id: 'yoon',
        title: 'Âm Ghép Tiêu Chuẩn (Combination Kana - 拗音: 36 chữ)',
        description: '12 hàng âm ghép kết hợp với ャ, ュ, ョ viết nhỏ',
        rows: COMMON_YOON_ROWS,
      },
      {
        id: 'extended_katakana',
        title: 'Âm Ghép Ngoại Lai (Extended Katakana - 22 chữ)',
        description: '8 hàng biến âm chuyên biệt cho từ mượn tiếng nước ngoài (Tofugu Mode)',
        rows: EXTENDED_KATAKANA_ROWS,
      },
    ];
  }

  // Chế độ Kết hợp cả 2 bảng (Combined / both)
  return [
    {
      id: 'seion',
      title: 'Âm Cơ Bản (Main Kana: 46 âm - Hiragana & Katakana)',
      description: 'Luyện song song cả chữ mềm Hiragana và chữ cứng Katakana',
      rows: SEION_ROWS,
    },
    {
      id: 'dakuon',
      title: 'Âm Đục & Bán Đục (Dakuten Kana: 26 âm)',
      description: 'Âm đục có dấu ゛, ゜và âm đặc thù ヴ (vu)',
      rows: [...COMMON_DAKUON_ROWS, KATAKANA_VU_ROW],
    },
    {
      id: 'yoon',
      title: 'Âm Ghép Tiêu Chuẩn (Combination Kana: 12 hàng)',
      description: '12 hàng âm ghép truyền thống kết hợp ya, yu, yo',
      rows: COMMON_YOON_ROWS,
    },
    {
      id: 'extended_katakana',
      title: 'Âm Ghép Ngoại Lai (Extended Katakana: 8 hàng)',
      description: 'Các biến âm đặc thù Katakana: ヴァ, ウィ, ファ, ツァ, シェ, ジェ, チェ, Irregular',
      rows: EXTENDED_KATAKANA_ROWS,
    },
  ];
}

// Giữ lại KANA_SECTIONS mặc định để tương thích
export const KANA_SECTIONS = getKanaSections('both');

/**
 * Lấy danh sách phẳng tất cả các ký tự theo loại bảng chữ cái (hiragana, katakana hoặc both)
 * @param {'hiragana' | 'katakana' | 'both'} scriptType
 * @param {Array<string>} selectedRowIds
 * @returns {Array<Object>}
 */
export function getSelectedKanaItems(scriptType = 'hiragana', selectedRowIds = []) {
  const selectedSet = new Set(selectedRowIds);
  const sections = getKanaSections(scriptType);
  const results = [];

  sections.forEach((section) => {
    section.rows.forEach((row) => {
      if (selectedSet.has(row.id)) {
        row.items.forEach((item) => {
          if (scriptType === 'hiragana') {
            if (item.hira) {
              results.push({
                character: item.hira,
                romaji: item.romaji,
                alts: item.alts,
                type: 'hiragana',
                rowId: row.id,
                rowName: row.name,
              });
            }
          } else if (scriptType === 'katakana') {
            if (item.kata) {
              results.push({
                character: item.kata,
                romaji: item.romaji,
                alts: item.alts,
                type: 'katakana',
                rowId: row.id,
                rowName: row.name,
              });
            }
          } else {
            // 'both': trộn lẫn cả 2 bảng
            if (item.hira) {
              results.push({
                character: item.hira,
                romaji: item.romaji,
                alts: item.alts,
                type: 'hiragana',
                rowId: row.id,
                rowName: row.name,
              });
            }
            if (item.kata) {
              results.push({
                character: item.kata,
                romaji: item.romaji,
                alts: item.alts,
                type: 'katakana',
                rowId: row.id,
                rowName: row.name,
              });
            }
          }
        });
      }
    });
  });

  return results;
}

/**
 * Lấy tất cả ID của các hàng cho loại bảng chữ cái tương ứng
 * @param {'hiragana' | 'katakana' | 'both'} scriptType
 */
export function getAllRowIds(scriptType = 'both') {
  const sections = getKanaSections(scriptType);
  const ids = [];
  sections.forEach((section) => {
    section.rows.forEach((row) => ids.push(row.id));
  });
  return ids;
}

/**
 * Lấy ID các hàng thuộc nhóm Seion (Âm cơ bản)
 */
export function getSeionRowIds() {
  return SEION_ROWS.map((r) => r.id);
}
