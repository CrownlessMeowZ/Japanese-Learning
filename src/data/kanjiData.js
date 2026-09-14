/**
 * Dữ liệu Hán Tự (Kanji) N5 - Giáo trình Dekiru Nihongo Sơ cấp (15 Bài học)
 * Tích hợp chuẩn: Chữ Kanji, Âm Hán Việt, Bộ thủ, Số nét, Âm On/Kun, Nét vẽ mẫu và Từ ghép thực tế
 */

export const kanjiData = [
  // ==========================================
  // BÀI 1: SỐ ĐẾM, NGÀY THÁNG, TÊN NƯỚC, BẢN THÂN
  // ==========================================
  {
    id: 'k_1',
    character: '一',
    hanViet: 'NHẤT',
    meaning: 'Một, số một',
    radical: '一 (Nhất)',
    strokeCount: 1,
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと', 'ひと.つ'],
    lessonId: 1,
    strokes: ['M 15,50 L 85,50'],
    examples: [
      { word: '一つ', reading: 'ひとつ', meaning: 'Một cái' },
      { word: '一人', reading: 'ひとり', meaning: 'Một người' },
      { word: '一日', reading: 'ついたち', meaning: 'Ngày mùng một' },
      { word: '一番', reading: 'いちばん', meaning: 'Số một, nhất' }
    ]
  },
  {
    id: 'k_2',
    character: '二',
    hanViet: 'NHỊ',
    meaning: 'Hai, số hai',
    radical: '二 (Nhị)',
    strokeCount: 2,
    onyomi: ['ニ', 'ジ'],
    kunyomi: ['ふた', 'ふた.つ'],
    lessonId: 1,
    strokes: [
      'M 25,35 L 75,35',
      'M 15,68 L 85,68'
    ],
    examples: [
      { word: '二つ', reading: 'ふたつ', meaning: 'Hai cái' },
      { word: '二人', reading: 'ふたり', meaning: 'Hai người' },
      { word: '二月', reading: 'にがつ', meaning: 'Tháng hai' },
      { word: '二十歳', reading: 'はたち', meaning: 'Hai mươi tuổi' }
    ]
  },
  {
    id: 'k_3',
    character: '三',
    hanViet: 'TAM',
    meaning: 'Ba, số ba',
    radical: '一 (Nhất)',
    strokeCount: 3,
    onyomi: ['サン'],
    kunyomi: ['み', 'み.つ', 'みっ.つ'],
    lessonId: 1,
    strokes: [
      'M 25,30 L 75,30',
      'M 30,50 L 70,50',
      'M 15,72 L 85,72'
    ],
    examples: [
      { word: '三つ', reading: 'みっつ', meaning: 'Ba cái' },
      { word: '三日', reading: 'みっか', meaning: 'Ngày mùng ba' },
      { word: '三年', reading: 'さんねん', meaning: 'Ba năm' },
      { word: '三人', reading: 'さんにん', meaning: 'Ba người' }
    ]
  },
  {
    id: 'k_4',
    character: '四',
    hanViet: 'TỨ',
    meaning: 'Bốn, số bốn',
    radical: '囗 (Vi)',
    strokeCount: 5,
    onyomi: ['シ'],
    kunyomi: ['よ', 'よ.つ', 'よっ.つ', 'よん'],
    lessonId: 1,
    strokes: [
      'M 25,25 L 25,80',
      'M 25,25 L 75,25 L 75,80',
      'M 40,25 L 35,55',
      'M 58,25 L 65,55',
      'M 25,80 L 75,80'
    ],
    examples: [
      { word: '四つ', reading: 'よっつ', meaning: 'Bốn cái' },
      { word: '四日', reading: 'よっか', meaning: 'Ngày mùng bốn' },
      { word: '四月', reading: 'しがつ', meaning: 'Tháng tư' },
      { word: '四季', reading: 'しき', meaning: 'Bốn mùa' }
    ]
  },
  {
    id: 'k_5',
    character: '五',
    hanViet: 'NGŨ',
    meaning: 'Năm, số năm',
    radical: '二 (Nhị)',
    strokeCount: 4,
    onyomi: ['ゴ'],
    kunyomi: ['いつ', 'いつ.つ'],
    lessonId: 1,
    strokes: [
      'M 20,25 L 80,25',
      'M 48,25 L 42,75',
      'M 42,50 L 70,50 L 70,75',
      'M 15,75 L 85,75'
    ],
    examples: [
      { word: '五つ', reading: 'いつつ', meaning: 'Năm cái' },
      { word: '五日', reading: 'いつか', meaning: 'Ngày mùng năm' },
      { word: '五月', reading: 'ごがつ', meaning: 'Tháng năm' },
      { word: '五人', reading: 'ごにん', meaning: 'Năm người' }
    ]
  },
  {
    id: 'k_6',
    character: '六',
    hanViet: 'LỤC',
    meaning: 'Sáu, số sáu',
    radical: '八 (Bát)',
    strokeCount: 4,
    onyomi: ['ロク', 'リク'],
    kunyomi: ['む', 'む.つ', 'むっ.つ', 'むい'],
    lessonId: 1,
    strokes: [
      'M 50,15 L 50,30',
      'M 15,35 L 85,35',
      'M 40,48 L 22,80',
      'M 60,48 L 78,80'
    ],
    examples: [
      { word: '六つ', reading: 'むっつ', meaning: 'Sáu cái' },
      { word: '六日', reading: 'むいか', meaning: 'Ngày mùng sáu' },
      { word: '六月', reading: 'ろくがつ', meaning: 'Tháng sáu' }
    ]
  },
  {
    id: 'k_7',
    character: '七',
    hanViet: 'THẤT',
    meaning: 'Bảy, số bảy',
    radical: '一 (Nhất)',
    strokeCount: 2,
    onyomi: ['シチ'],
    kunyomi: ['なな', 'なな.つ', 'なの'],
    lessonId: 1,
    strokes: [
      'M 15,45 L 85,40',
      'M 48,20 L 48,70 Q 48,85 70,85'
    ],
    examples: [
      { word: '七つ', reading: 'ななつ', meaning: 'Bảy cái' },
      { word: '七日', reading: 'なのか', meaning: 'Ngày mùng bảy' },
      { word: '七月', reading: 'しちがつ', meaning: 'Tháng bảy' }
    ]
  },
  {
    id: 'k_8',
    character: '八',
    hanViet: 'BÁT',
    meaning: 'Tám, số tám',
    radical: '八 (Bát)',
    strokeCount: 2,
    onyomi: ['ハチ'],
    kunyomi: ['や', 'や.つ', 'やっ.つ', 'よう'],
    lessonId: 1,
    strokes: [
      'M 40,25 L 20,80',
      'M 55,18 L 82,82'
    ],
    examples: [
      { word: '八つ', reading: 'やっつ', meaning: 'Tám cái' },
      { word: '八日', reading: 'ようか', meaning: 'Ngày mùng tám' },
      { word: '八月', reading: 'はちがつ', meaning: 'Tháng tám' }
    ]
  },
  {
    id: 'k_9',
    character: '九',
    hanViet: 'CỬU',
    meaning: 'Chín, số chín',
    radical: '乙 (Ất)',
    strokeCount: 2,
    onyomi: ['キュウ', 'ク'],
    kunyomi: ['ここの', 'ここの.つ'],
    lessonId: 1,
    strokes: [
      'M 48,20 L 25,80',
      'M 30,35 L 75,35 Q 70,82 85,75'
    ],
    examples: [
      { word: '九つ', reading: 'ここのつ', meaning: 'Chín cái' },
      { word: '九日', reading: 'ここのか', meaning: 'Ngày mùng chín' },
      { word: '九月', reading: 'くがつ', meaning: 'Tháng chín' }
    ]
  },
  {
    id: 'k_10',
    character: '十',
    hanViet: 'THẬP',
    meaning: 'Mười, số mười',
    radical: '十 (Thập)',
    strokeCount: 2,
    onyomi: ['ジュウ', 'ジッ'],
    kunyomi: ['とお', 'と'],
    lessonId: 1,
    strokes: [
      'M 15,50 L 85,50',
      'M 50,15 L 50,85'
    ],
    examples: [
      { word: '十', reading: 'とお', meaning: 'Mười cái' },
      { word: '十日', reading: 'とおか', meaning: 'Ngày mùng mười' },
      { word: '十月', reading: 'じゅうがつ', meaning: 'Tháng mười' }
    ]
  },
  {
    id: 'k_11',
    character: '百',
    hanViet: 'BÁCH',
    meaning: 'Trăm, một trăm',
    radical: '白 (Bạch)',
    strokeCount: 6,
    onyomi: ['ヒャク', 'ビャク'],
    kunyomi: ['もも'],
    lessonId: 1,
    strokes: [
      'M 20,22 L 80,22',
      'M 50,22 L 40,40',
      'M 28,40 L 28,85',
      'M 28,40 L 72,40 L 72,85',
      'M 28,62 L 72,62',
      'M 28,85 L 72,85'
    ],
    examples: [
      { word: '百', reading: 'ひゃく', meaning: 'Một trăm' },
      { word: '三百', reading: 'さんびゃく', meaning: 'Ba trăm' },
      { word: '六百', reading: 'ろっぴゃく', meaning: 'Sáu trăm' },
      { word: '百科事典', reading: 'ひゃっかじてん', meaning: 'Bách khoa toàn thư' }
    ]
  },
  {
    id: 'k_12',
    character: '千',
    hanViet: 'THIÊN',
    meaning: 'Nghìn, một ngàn',
    radical: '十 (Thập)',
    strokeCount: 3,
    onyomi: ['セン'],
    kunyomi: ['ち'],
    lessonId: 1,
    strokes: [
      'M 72,18 L 30,35',
      'M 15,48 L 85,48',
      'M 50,35 L 50,88'
    ],
    examples: [
      { word: '千', reading: 'せん', meaning: 'Một nghìn' },
      { word: '三千', reading: 'さんぜん', meaning: 'Ba nghìn' },
      { word: '千円', reading: 'せんえん', meaning: 'Một nghìn yên' }
    ]
  },
  {
    id: 'k_13',
    character: '万',
    hanViet: 'VẠN',
    meaning: 'Vạn, mười nghìn',
    radical: '一 (Nhất)',
    strokeCount: 3,
    onyomi: ['マン', 'バン'],
    kunyomi: ['よろず'],
    lessonId: 1,
    strokes: [
      'M 18,25 L 82,25',
      'M 46,25 L 35,80',
      'M 35,46 L 75,46 Q 80,75 55,75'
    ],
    examples: [
      { word: '一万', reading: 'いちまん', meaning: 'Mười nghìn (1 vạn)' },
      { word: '万国', reading: 'ばんこく', meaning: 'Vạn quốc, toàn thế giới' },
      { word: '万歳', reading: 'ばんざい', meaning: 'Vạn tuế, hoan hô' }
    ]
  },
  {
    id: 'k_14',
    character: '円',
    hanViet: 'VIÊN',
    meaning: 'Tiền Yên, tròn',
    radical: '冂 (Quynh)',
    strokeCount: 4,
    onyomi: ['エン'],
    kunyomi: ['まる.い'],
    lessonId: 1,
    strokes: [
      'M 26,25 L 26,85',
      'M 26,25 L 74,25 L 74,85',
      'M 42,25 L 42,85',
      'M 58,25 L 58,85'
    ],
    examples: [
      { word: '円', reading: 'えん', meaning: 'Đồng Yên Nhật' },
      { word: '百円', reading: 'ひゃくえん', meaning: 'Một trăm yên' },
      { word: '円高', reading: 'えんだか', meaning: 'Đồng yên tăng giá' }
    ]
  },
  {
    id: 'k_15',
    character: '日',
    hanViet: 'NHẬT',
    meaning: 'Mặt trời, ngày, Nhật Bản',
    radical: '日 (Nhật)',
    strokeCount: 4,
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    lessonId: 1,
    strokes: [
      'M 26,20 L 26,82',
      'M 26,20 L 74,20 L 74,82',
      'M 26,50 L 74,50',
      'M 26,82 L 74,82'
    ],
    examples: [
      { word: '日本', reading: 'にほん', meaning: 'Nước Nhật' },
      { word: '日曜日', reading: 'にちようび', meaning: 'Chủ nhật' },
      { word: '毎日', reading: 'まいにち', meaning: 'Mỗi ngày' },
      { word: '休日', reading: 'きゅうじつ', meaning: 'Ngày nghỉ' }
    ]
  },
  {
    id: 'k_16',
    character: '本',
    hanViet: 'BẢN',
    meaning: 'Sách, gốc rễ, nguồn gốc',
    radical: '木 (Mộc)',
    strokeCount: 5,
    onyomi: ['ホン'],
    kunyomi: ['もと'],
    lessonId: 1,
    strokes: [
      'M 18,38 L 82,38',
      'M 50,15 L 50,85',
      'M 50,38 L 22,78',
      'M 50,38 L 78,78',
      'M 32,70 L 68,70'
    ],
    examples: [
      { word: '本', reading: 'ほん', meaning: 'Quyển sách' },
      { word: '日本語', reading: 'にほんご', meaning: 'Tiếng Nhật' },
      { word: '山本', reading: 'やまもと', meaning: 'Họ Yamamoto' },
      { word: '本当に', reading: 'ほんとうに', meaning: 'Thực sự' }
    ]
  },
  {
    id: 'k_17',
    character: '人',
    hanViet: 'NHÂN',
    meaning: 'Người, con người',
    radical: '人 (Nhân)',
    strokeCount: 2,
    onyomi: ['ジン', 'ニン'],
    kunyomi: ['ひと'],
    lessonId: 1,
    strokes: [
      'M 50,20 L 25,82',
      'M 42,46 L 78,82'
    ],
    examples: [
      { word: '人', reading: 'ひと', meaning: 'Người' },
      { word: '日本人', reading: 'にほんじん', meaning: 'Người Nhật' },
      { word: '三人', reading: 'さんにん', meaning: 'Ba người' },
      { word: '大人', reading: 'おとな', meaning: 'Người lớn' }
    ]
  },
  {
    id: 'k_18',
    character: '月',
    hanViet: 'NGUYỆT',
    meaning: 'Mặt trăng, tháng',
    radical: '月 (Nguyệt)',
    strokeCount: 4,
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    lessonId: 1,
    strokes: [
      'M 30,20 L 25,85',
      'M 30,20 L 72,20 L 72,85',
      'M 30,42 L 72,42',
      'M 30,62 L 72,62'
    ],
    examples: [
      { word: '月', reading: 'つき', meaning: 'Mặt trăng' },
      { word: '月曜日', reading: 'げつようび', meaning: 'Thứ hai' },
      { word: '一月', reading: 'いちがつ', meaning: 'Tháng một' },
      { word: '今月', reading: 'こんげつ', meaning: 'Tháng này' }
    ]
  },
  {
    id: 'k_19',
    character: '年',
    hanViet: 'NIÊN',
    meaning: 'Năm, tuổi tác',
    radical: '干 (Can)',
    strokeCount: 6,
    onyomi: ['ネン'],
    kunyomi: ['とし'],
    lessonId: 1,
    strokes: [
      'M 45,18 L 30,35',
      'M 20,38 L 80,38',
      'M 32,54 L 68,54',
      'M 32,38 L 32,72',
      'M 15,72 L 85,72',
      'M 50,38 L 50,88'
    ],
    examples: [
      { word: '年', reading: 'とし', meaning: 'Năm, tuổi' },
      { word: '今年', reading: 'ことし', meaning: 'Năm nay' },
      { word: '来年', reading: 'らいねん', meaning: 'Năm sau' },
      { word: '去年', reading: 'きょねん', meaning: 'Năm ngoái' }
    ]
  },
  {
    id: 'k_20',
    character: '私',
    hanViet: 'TƯ',
    meaning: 'Tôi, riêng tư',
    radical: '禾 (Hòa)',
    strokeCount: 7,
    onyomi: ['シ'],
    kunyomi: ['わたし', 'わたくし'],
    lessonId: 1,
    strokes: [
      'M 38,18 L 20,30',
      'M 12,42 L 46,42',
      'M 30,30 L 30,80',
      'M 30,46 L 15,68',
      'M 30,46 L 44,68',
      'M 65,30 L 52,50',
      'M 54,50 L 78,50 Q 82,78 60,82'
    ],
    examples: [
      { word: '私', reading: 'わたし', meaning: 'Tôi' },
      { word: '私立', reading: 'しりつ', meaning: 'Dân lập, tư thục' }
    ]
  },

  // ==========================================
  // BÀI 2: VỊ TRÍ, PHƯƠNG HƯỚNG, ĐỊA ĐIỂM
  // ==========================================
  {
    id: 'k_21',
    character: '上',
    hanViet: 'THƯỢNG',
    meaning: 'Trên, ở trên, lên',
    radical: '一 (Nhất)',
    strokeCount: 3,
    onyomi: ['ジョウ', 'ショウ'],
    kunyomi: ['うえ', 'あ.がる', 'のぼ.る'],
    lessonId: 2,
    strokes: [
      'M 50,20 L 50,75',
      'M 50,48 L 78,48',
      'M 15,78 L 85,78'
    ],
    examples: [
      { word: '上', reading: 'うえ', meaning: 'Bên trên' },
      { word: '上手', reading: 'じょうず', meaning: 'Giỏi' },
      { word: '上がる', reading: 'あがる', meaning: 'Đi lên, tăng lên' }
    ]
  },
  {
    id: 'k_22',
    character: '下',
    hanViet: 'HẠ',
    meaning: 'Dưới, ở dưới, xuống',
    radical: '一 (Nhất)',
    strokeCount: 3,
    onyomi: ['カ', 'ゲ'],
    kunyomi: ['した', 'さ.がる', 'くだ.る'],
    lessonId: 2,
    strokes: [
      'M 15,25 L 85,25',
      'M 50,25 L 50,82',
      'M 50,50 L 75,68'
    ],
    examples: [
      { word: '下', reading: 'した', meaning: 'Bên dưới' },
      { word: '下手', reading: 'へた', meaning: 'Kém' },
      { word: '地下鉄', reading: 'ちかてつ', meaning: 'Tàu điện ngầm' }
    ]
  },
  {
    id: 'k_23',
    character: '中',
    hanViet: 'TRUNG',
    meaning: 'Trong, ở giữa, Trung Quốc',
    radical: '丨 (Cổn)',
    strokeCount: 4,
    onyomi: ['チュウ'],
    kunyomi: ['なか'],
    lessonId: 2,
    strokes: [
      'M 25,32 L 25,65',
      'M 25,32 L 75,32 L 75,65',
      'M 25,65 L 75,65',
      'M 50,15 L 50,88'
    ],
    examples: [
      { word: '中', reading: 'なか', meaning: 'Bên trong' },
      { word: '一日中', reading: 'いちにちじゅう', meaning: 'Cả ngày' },
      { word: '中国', reading: 'ちゅうごく', meaning: 'Trung Quốc' },
      { word: '中学校', reading: 'ちゅうがっこう', meaning: 'Trường THCS' }
    ]
  },
  {
    id: 'k_24',
    character: '右',
    hanViet: 'HỮU',
    meaning: 'Phải, bên phải',
    radical: '口 (Khẩu)',
    strokeCount: 5,
    onyomi: ['ウ', 'ユウ'],
    kunyomi: ['みぎ'],
    lessonId: 2,
    strokes: [
      'M 50,18 L 22,75',
      'M 20,38 L 80,38',
      'M 32,50 L 32,82',
      'M 32,50 L 68,50 L 68,82',
      'M 32,82 L 68,82'
    ],
    examples: [
      { word: '右', reading: 'みぎ', meaning: 'Bên phải' },
      { word: '右手', reading: 'みぎて', meaning: 'Tay phải' },
      { word: '左右', reading: 'さゆう', meaning: 'Trái phải' }
    ]
  },
  {
    id: 'k_25',
    character: '左',
    hanViet: 'TẢ',
    meaning: 'Trái, bên trái',
    radical: '工 (Công)',
    strokeCount: 5,
    onyomi: ['サ'],
    kunyomi: ['ひだり'],
    lessonId: 2,
    strokes: [
      'M 20,38 L 80,38',
      'M 50,18 L 22,75',
      'M 30,58 L 70,58',
      'M 50,58 L 50,82',
      'M 25,82 L 75,82'
    ],
    examples: [
      { word: '左', reading: 'ひだり', meaning: 'Bên trái' },
      { word: '左手', reading: 'ひだりて', meaning: 'Tay trái' },
      { word: '左折', reading: 'させつ', meaning: 'Rẽ trái' }
    ]
  },
  {
    id: 'k_26',
    character: '東',
    hanViet: 'ĐÔNG',
    meaning: 'Phía đông, phương đông',
    radical: '木 (Mộc)',
    strokeCount: 8,
    onyomi: ['トウ'],
    kunyomi: ['ひがし'],
    lessonId: 2,
    strokes: [
      'M 20,28 L 80,28',
      'M 28,40 L 28,68',
      'M 28,40 L 72,40 L 72,68',
      'M 28,54 L 72,54',
      'M 28,68 L 72,68',
      'M 50,15 L 50,88',
      'M 50,68 L 24,85',
      'M 50,68 L 76,85'
    ],
    examples: [
      { word: '東', reading: 'ひがし', meaning: 'Phía đông' },
      { word: '東京', reading: 'とうきょう', meaning: 'Tokyo' },
      { word: '東口', reading: 'ひがしぐち', meaning: 'Cửa đông' }
    ]
  },
  {
    id: 'k_27',
    character: '西',
    hanViet: 'TÂY',
    meaning: 'Phía tây, phương tây',
    radical: '西 (Tây)',
    strokeCount: 6,
    onyomi: ['セイ', 'サイ'],
    kunyomi: ['にし'],
    lessonId: 2,
    strokes: [
      'M 22,25 L 78,25',
      'M 26,25 L 26,82',
      'M 26,25 L 74,25 L 74,82',
      'M 42,25 L 35,58',
      'M 58,25 L 65,58',
      'M 26,82 L 74,82'
    ],
    examples: [
      { word: '西', reading: 'にし', meaning: 'Phía tây' },
      { word: '西口', reading: 'にしぐち', meaning: 'Cửa tây' },
      { word: '西洋', reading: 'せいよう', meaning: 'Phương Tây' }
    ]
  },
  {
    id: 'k_28',
    character: '南',
    hanViet: 'NAM',
    meaning: 'Phía nam, phương nam',
    radical: '十 (Thập)',
    strokeCount: 9,
    onyomi: ['ナン'],
    kunyomi: ['みなみ'],
    lessonId: 2,
    strokes: [
      'M 24,25 L 76,25',
      'M 50,15 L 50,38',
      'M 26,38 L 26,85',
      'M 26,38 L 74,38 L 74,85',
      'M 38,50 L 62,50',
      'M 38,50 L 38,72',
      'M 62,50 L 62,72',
      'M 38,72 L 62,72',
      'M 26,85 L 74,85'
    ],
    examples: [
      { word: '南', reading: 'みなみ', meaning: 'Phía nam' },
      { word: '南口', reading: 'みなみぐち', meaning: 'Cửa nam' },
      { word: '東南アジア', reading: 'とうなんアジア', meaning: 'Đông Nam Á' }
    ]
  },
  {
    id: 'k_29',
    character: '北',
    hanViet: 'BẮC',
    meaning: 'Phía bắc, phương bắc',
    radical: '匕 (Chủy)',
    strokeCount: 5,
    onyomi: ['ホク'],
    kunyomi: ['きた'],
    lessonId: 2,
    strokes: [
      'M 30,25 L 30,82',
      'M 18,52 L 40,45',
      'M 22,78 L 40,65',
      'M 72,22 L 55,50',
      'M 55,45 L 55,80 Q 75,82 82,72'
    ],
    examples: [
      { word: '北', reading: 'きた', meaning: 'Phía bắc' },
      { word: '北口', reading: 'きたぐち', meaning: 'Cửa bắc' },
      { word: '北海道', reading: 'ほっかいどう', meaning: 'Hokkaido' }
    ]
  },
  {
    id: 'k_30',
    character: '口',
    hanViet: 'KHẨU',
    meaning: 'Miệng, cửa vào/ra',
    radical: '口 (Khẩu)',
    strokeCount: 3,
    onyomi: ['コウ', 'ク'],
    kunyomi: ['くち'],
    lessonId: 2,
    strokes: [
      'M 26,28 L 26,78',
      'M 26,28 L 74,28 L 74,78',
      'M 26,78 L 74,78'
    ],
    examples: [
      { word: '口', reading: 'くち', meaning: 'Miệng' },
      { word: '入口', reading: 'いりぐち', meaning: 'Cửa vào' },
      { word: '出口', reading: 'でぐち', meaning: 'Cửa ra' },
      { word: '人口', reading: 'じんこう', meaning: 'Dân số' }
    ]
  },

  // ==========================================
  // BÀI 3: THỜI GIAN, GIỜ GIẤC, SINH HOẠT
  // ==========================================
  {
    id: 'k_31',
    character: '時',
    hanViet: 'THỜI',
    meaning: 'Thời gian, giờ, lúc',
    radical: '日 (Nhật)',
    strokeCount: 10,
    onyomi: ['ジ'],
    kunyomi: ['とき'],
    lessonId: 3,
    strokes: [
      'M 18,28 L 18,72',
      'M 18,28 L 40,28 L 40,72',
      'M 18,50 L 40,50',
      'M 18,72 L 40,72',
      'M 50,30 L 82,30',
      'M 65,18 L 65,85',
      'M 48,50 L 85,50',
      'M 54,68 L 80,68',
      'M 76,50 L 84,62'
    ],
    examples: [
      { word: '時間', reading: 'じかん', meaning: 'Thời gian' },
      { word: '一時', reading: 'いちじ', meaning: 'Một giờ' },
      { word: '時々', reading: 'ときどき', meaning: 'Thỉnh thoảng' },
      { word: '時計', reading: 'とけい', meaning: 'Đồng hồ' }
    ]
  },
  {
    id: 'k_32',
    character: '分',
    hanViet: 'PHÂN',
    meaning: 'Phút, chia, hiểu',
    radical: '刀 (Đao)',
    strokeCount: 4,
    onyomi: ['ブン', 'フン', 'ブ'],
    kunyomi: ['わ.ける', 'わ.かる'],
    lessonId: 3,
    strokes: [
      'M 42,22 L 20,48',
      'M 58,22 L 80,48',
      'M 35,46 L 70,46',
      'M 70,46 L 40,84'
    ],
    examples: [
      { word: '五分', reading: 'ごふん', meaning: 'Năm phút' },
      { word: '分かる', reading: 'わかる', meaning: 'Hiểu' },
      { word: '気分', reading: 'きぶん', meaning: 'Tâm trạng' }
    ]
  },
  {
    id: 'k_33',
    character: '半',
    hanViet: 'BÁN',
    meaning: 'Nửa, rưỡi, một nửa',
    radical: '十 (Thập)',
    strokeCount: 5,
    onyomi: ['ハン'],
    kunyomi: ['なか.ば'],
    lessonId: 3,
    strokes: [
      'M 32,22 L 40,32',
      'M 68,22 L 60,32',
      'M 20,40 L 80,40',
      'M 15,62 L 85,62',
      'M 50,20 L 50,88'
    ],
    examples: [
      { word: '一時半', reading: 'いちじはん', meaning: 'Một giờ rưỡi' },
      { word: '半分', reading: 'はんぶん', meaning: 'Một nửa' },
      { word: '半年', reading: 'はんとし', meaning: 'Nửa năm' }
    ]
  },
  {
    id: 'k_34',
    character: '今',
    hanViet: 'KIM',
    meaning: 'Bây giờ, hiện tại',
    radical: '人 (Nhân)',
    strokeCount: 4,
    onyomi: ['コン', 'キン'],
    kunyomi: ['いま'],
    lessonId: 3,
    strokes: [
      'M 50,18 L 20,52',
      'M 48,22 L 80,52',
      'M 38,54 L 62,54',
      'M 40,54 L 40,82 Q 40,85 68,78'
    ],
    examples: [
      { word: '今', reading: 'いま', meaning: 'Bây giờ' },
      { word: '今日', reading: 'きょう', meaning: 'Hôm nay' },
      { word: '今月', reading: 'こんげつ', meaning: 'Tháng này' },
      { word: '今年', reading: 'ことし', meaning: 'Năm nay' }
    ]
  },
  {
    id: 'k_35',
    character: '毎',
    hanViet: 'MỖI',
    meaning: 'Mỗi, từng',
    radical: '毋 (Vô)',
    strokeCount: 6,
    onyomi: ['マイ'],
    kunyomi: ['ごと'],
    lessonId: 3,
    strokes: [
      'M 45,18 L 30,32',
      'M 25,36 L 75,36',
      'M 45,36 L 35,80',
      'M 35,50 L 68,50 L 65,80',
      'M 42,62 L 58,62',
      'M 20,80 L 80,80'
    ],
    examples: [
      { word: '毎日', reading: 'まいにち', meaning: 'Mỗi ngày' },
      { word: '毎週', reading: 'まいしゅう', meaning: 'Mỗi tuần' },
      { word: '毎月', reading: 'まいつき', meaning: 'Mỗi tháng' },
      { word: '毎年', reading: 'まいとし', meaning: 'Mỗi năm' }
    ]
  },

  // ==========================================
  // BÀI 4: HỌC TẬP, TRƯỜNG LỚP, ĐI LẠI
  // ==========================================
  {
    id: 'k_36',
    character: '先',
    hanViet: 'TIÊN',
    meaning: 'Trước, đi trước',
    radical: '儿 (Nhi)',
    strokeCount: 6,
    onyomi: ['セン'],
    kunyomi: ['さき', 'ま.ず'],
    lessonId: 4,
    strokes: [
      'M 48,15 L 36,32',
      'M 20,35 L 80,35',
      'M 50,35 L 50,56',
      'M 15,56 L 85,56',
      'M 42,56 L 30,85',
      'M 58,56 L 58,80 Q 72,85 82,75'
    ],
    examples: [
      { word: '先生', reading: 'せんせい', meaning: 'Thầy cô, giáo viên' },
      { word: '先週', reading: 'せんしゅう', meaning: 'Tuần trước' },
      { word: 'お先に', reading: 'おさきに', meaning: 'Xin phép trước' }
    ]
  },
  {
    id: 'k_37',
    character: '生',
    hanViet: 'SINH',
    meaning: 'Sống, sinh ra, học trò',
    radical: '生 (Sinh)',
    strokeCount: 5,
    onyomi: ['セイ', 'ショウ'],
    kunyomi: ['い.きる', 'う.まれる', 'なま'],
    lessonId: 4,
    strokes: [
      'M 36,20 L 25,38',
      'M 20,40 L 80,40',
      'M 50,20 L 50,85',
      'M 30,60 L 70,60',
      'M 15,85 L 85,85'
    ],
    examples: [
      { word: '学生', reading: 'がくせい', meaning: 'Học sinh, sinh viên' },
      { word: '先生', reading: 'せんせい', meaning: 'Giáo viên' },
      { word: '誕生日', reading: 'たんじょうび', meaning: 'Sinh nhật' },
      { word: '生きる', reading: 'いきる', meaning: 'Sống' }
    ]
  },
  {
    id: 'k_38',
    character: '学',
    hanViet: 'HỌC',
    meaning: 'Học hỏi, trường học',
    radical: '子 (Tử)',
    strokeCount: 8,
    onyomi: ['ガク'],
    kunyomi: ['まな.ぶ'],
    lessonId: 4,
    strokes: [
      'M 35,18 L 30,30',
      'M 50,15 L 50,28',
      'M 68,18 L 72,30',
      'M 25,38 L 30,48',
      'M 30,42 L 75,42 L 75,50',
      'M 48,50 L 35,65 L 65,65',
      'M 50,65 L 50,85',
      'M 25,78 L 75,78'
    ],
    examples: [
      { word: '学校', reading: 'がっこう', meaning: 'Trường học' },
      { word: '大学', reading: 'だいがく', meaning: 'Trường đại học' },
      { word: '留学生', reading: 'りゅうがくせい', meaning: 'Du học sinh' }
    ]
  },
  {
    id: 'k_39',
    character: '校',
    hanViet: 'HIỆU',
    meaning: 'Trường học',
    radical: '木 (Mộc)',
    strokeCount: 10,
    onyomi: ['コウ'],
    kunyomi: [],
    lessonId: 4,
    strokes: [
      'M 12,38 L 44,38',
      'M 28,18 L 28,85',
      'M 28,40 L 15,70',
      'M 32,46 L 45,62',
      'M 65,15 L 65,28',
      'M 48,32 L 84,32',
      'M 60,40 L 48,82',
      'M 70,40 L 85,82'
    ],
    examples: [
      { word: '学校', reading: 'がっこう', meaning: 'Trường học' },
      { word: '高校', reading: 'こうこう', meaning: 'Trường cấp 3' },
      { word: '小学校', reading: 'しょうがっこう', meaning: 'Trường tiểu học' }
    ]
  },
  {
    id: 'k_40',
    character: '大',
    hanViet: 'ĐẠI',
    meaning: 'Lớn, to lớn',
    radical: '大 (Đại)',
    strokeCount: 3,
    onyomi: ['ダイ', 'タイ'],
    kunyomi: ['おお', 'おお.きい'],
    lessonId: 4,
    strokes: [
      'M 15,42 L 85,42',
      'M 50,18 L 25,85',
      'M 45,45 L 80,85'
    ],
    examples: [
      { word: '大きい', reading: 'おおきい', meaning: 'To, lớn' },
      { word: '大学', reading: 'だいがく', meaning: 'Đại học' },
      { word: '大変', reading: 'たいへん', meaning: 'Vất vả, rất' },
      { word: '大人', reading: 'おとな', meaning: 'Người lớn' }
    ]
  },
  {
    id: 'k_41',
    character: '小',
    hanViet: 'TIỂU',
    meaning: 'Nhỏ, bé',
    radical: '小 (Tiểu)',
    strokeCount: 3,
    onyomi: ['ショウ'],
    kunyomi: ['ちい.さい', 'こ-'],
    lessonId: 4,
    strokes: [
      'M 50,20 L 50,82 Q 50,88 42,80',
      'M 35,42 L 20,68',
      'M 65,42 L 80,68'
    ],
    examples: [
      { word: '小さい', reading: 'ちいさい', meaning: 'Nhỏ, bé' },
      { word: '小学校', reading: 'しょうがっこう', meaning: 'Trường tiểu học' },
      { word: '小川', reading: 'おがわ', meaning: 'Con suối nhỏ' }
    ]
  },
  {
    id: 'k_42',
    character: '行',
    hanViet: 'HÀNH',
    meaning: 'Đi, tiến hành',
    radical: '行 (Hành)',
    strokeCount: 6,
    onyomi: ['コウ', 'ギョウ'],
    kunyomi: ['い.く', 'ゆ.く', 'おこな.う'],
    lessonId: 4,
    strokes: [
      'M 40,20 L 25,38',
      'M 38,40 L 20,75',
      'M 30,55 L 30,85',
      'M 58,25 L 85,25',
      'M 68,25 L 68,48',
      'M 68,48 L 68,82 Q 68,88 78,82'
    ],
    examples: [
      { word: '行く', reading: 'いく', meaning: 'Đi' },
      { word: '旅行', reading: 'りょこう', meaning: 'Du lịch' },
      { word: '銀行', reading: 'ぎんこう', meaning: 'Ngân hàng' }
    ]
  },
  {
    id: 'k_43',
    character: '来',
    hanViet: 'LAI',
    meaning: 'Đến, tới, tương lai',
    radical: '木 (Mộc)',
    strokeCount: 7,
    onyomi: ['ライ'],
    kunyomi: ['く.る', 'き.たる'],
    lessonId: 4,
    strokes: [
      'M 20,25 L 80,25',
      'M 32,38 L 44,48',
      'M 68,38 L 56,48',
      'M 18,52 L 82,52',
      'M 50,25 L 50,88',
      'M 50,52 L 25,82',
      'M 50,52 L 75,82'
    ],
    examples: [
      { word: '来る', reading: 'くる', meaning: 'Đến' },
      { word: '来年', reading: 'らいねん', meaning: 'Năm sau' },
      { word: '来月', reading: 'らいげつ', meaning: 'Tháng sau' },
      { word: '来週', reading: 'らいしゅう', meaning: 'Tuần sau' }
    ]
  },
  {
    id: 'k_44',
    character: '帰',
    hanViet: 'QUY',
    meaning: 'Về, trở về',
    radical: '巾 (Cân)',
    strokeCount: 10,
    onyomi: ['キ'],
    kunyomi: ['かえ.る', 'かえ.す'],
    lessonId: 4,
    strokes: [
      'M 26,20 L 32,30',
      'M 38,20 L 22,48',
      'M 25,48 L 38,78',
      'M 50,22 L 82,22',
      'M 60,35 L 75,35',
      'M 52,50 L 52,85',
      'M 52,50 L 80,50 L 80,85',
      'M 66,50 L 66,85'
    ],
    examples: [
      { word: '帰る', reading: 'かえる', meaning: 'Về nhà' },
      { word: '帰国', reading: 'きこく', meaning: 'Về nước' },
      { word: '帰り道', reading: 'かえりみち', meaning: 'Đường về' }
    ]
  },
  {
    id: 'k_45',
    character: '車',
    hanViet: 'XA',
    meaning: 'Xe, xe hơi',
    radical: '車 (Xa)',
    strokeCount: 7,
    onyomi: ['シャ'],
    kunyomi: ['くるま'],
    lessonId: 4,
    strokes: [
      'M 25,25 L 75,25',
      'M 30,40 L 30,68',
      'M 30,40 L 70,40 L 70,68',
      'M 30,54 L 70,54',
      'M 30,68 L 70,68',
      'M 15,80 L 85,80',
      'M 50,15 L 50,88'
    ],
    examples: [
      { word: '車', reading: 'くるま', meaning: 'Xe hơi' },
      { word: '電車', reading: 'でんしゃ', meaning: 'Tàu điện' },
      { word: '自転車', reading: 'じてんしゃ', meaning: 'Xe đạp' }
    ]
  },

  // ==========================================
  // BÀI 5-6: ĂN UỐNG, ĐỜI SỐNG, SINH HOẠT
  // ==========================================
  {
    id: 'k_46',
    character: '食',
    hanViet: 'THỰC',
    meaning: 'Ăn, món ăn, thực phẩm',
    radical: '食 (Thực)',
    strokeCount: 9,
    onyomi: ['ショク', 'ジキ'],
    kunyomi: ['た.べる', 'く.う'],
    lessonId: 5,
    strokes: [
      'M 50,15 L 20,45',
      'M 48,18 L 80,45',
      'M 50,35 L 50,50',
      'M 35,50 L 68,50',
      'M 32,58 L 32,85',
      'M 32,58 L 70,58 L 70,85',
      'M 32,70 L 70,70',
      'M 32,85 L 70,85'
    ],
    examples: [
      { word: '食べる', reading: 'たべる', meaning: 'Ăn' },
      { word: '食事', reading: 'しょくじ', meaning: 'Bữa ăn' },
      { word: '食堂', reading: 'しょくどう', meaning: 'Nhà ăn, căng tin' },
      { word: '食べ物', reading: 'たべもの', meaning: 'Thức ăn' }
    ]
  },
  {
    id: 'k_47',
    character: '飲',
    hanViet: 'ẨM',
    meaning: 'Uống, đồ uống',
    radical: '食 (Thực)',
    strokeCount: 12,
    onyomi: ['イン'],
    kunyomi: ['の.む'],
    lessonId: 5,
    strokes: [
      'M 38,15 L 18,35',
      'M 32,25 L 46,25',
      'M 24,38 L 44,38',
      'M 22,50 L 44,50',
      'M 32,50 L 32,82',
      'M 70,18 L 56,38',
      'M 58,35 L 82,35',
      'M 60,50 L 50,85',
      'M 62,50 L 78,82'
    ],
    examples: [
      { word: '飲む', reading: 'のむ', meaning: 'Uống' },
      { word: '飲み物', reading: 'のみもの', meaning: 'Đồ uống' },
      { word: '飲食店', reading: 'いんしょくてん', meaning: 'Quán ăn uống' }
    ]
  },
  {
    id: 'k_48',
    character: '水',
    hanViet: 'THỦY',
    meaning: 'Nước, thứ tư',
    radical: '水 (Thủy)',
    strokeCount: 4,
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    lessonId: 5,
    strokes: [
      'M 50,15 L 50,85 Q 50,88 42,80',
      'M 38,36 L 20,55',
      'M 60,30 L 78,42',
      'M 55,50 L 80,82'
    ],
    examples: [
      { word: '水', reading: 'みず', meaning: 'Nước' },
      { word: '水曜日', reading: 'すいようび', meaning: 'Thứ tư' },
      { word: '水泳', reading: 'すいえい', meaning: 'Bơi lội' }
    ]
  },
  {
    id: 'k_49',
    character: '火',
    hanViet: 'HỎA',
    meaning: 'Lửa, thứ ba',
    radical: '火 (Hỏa)',
    strokeCount: 4,
    onyomi: ['カ'],
    kunyomi: ['ひ', '-び'],
    lessonId: 5,
    strokes: [
      'M 30,42 L 20,62',
      'M 70,38 L 80,58',
      'M 50,20 L 35,82',
      'M 45,45 L 75,82'
    ],
    examples: [
      { word: '火', reading: 'ひ', meaning: 'Lửa' },
      { word: '火曜日', reading: 'かようび', meaning: 'Thứ ba' },
      { word: '花火', reading: 'はなび', meaning: 'Pháo hoa' }
    ]
  },
  {
    id: 'k_50',
    character: '木',
    hanViet: 'MỘC',
    meaning: 'Cây, gỗ, thứ năm',
    radical: '木 (Mộc)',
    strokeCount: 4,
    onyomi: ['ボク', 'モク'],
    kunyomi: ['き', 'こ-'],
    lessonId: 5,
    strokes: [
      'M 18,40 L 82,40',
      'M 50,18 L 50,88',
      'M 50,40 L 22,82',
      'M 50,40 L 78,82'
    ],
    examples: [
      { word: '木', reading: 'き', meaning: 'Cái cây' },
      { word: '木曜日', reading: 'もくようび', meaning: 'Thứ năm' },
      { word: '木造', reading: 'もくぞう', meaning: 'Làm bằng gỗ' }
    ]
  },
  {
    id: 'k_51',
    character: '金',
    hanViet: 'KIM',
    meaning: 'Vàng, tiền, thứ sáu',
    radical: '金 (Kim)',
    strokeCount: 8,
    onyomi: ['キン', 'コン'],
    kunyomi: ['かね', 'かな-'],
    lessonId: 5,
    strokes: [
      'M 50,15 L 20,45',
      'M 48,18 L 80,45',
      'M 30,42 L 70,42',
      'M 22,60 L 78,60',
      'M 50,42 L 50,82',
      'M 35,70 L 26,78',
      'M 65,70 L 74,78',
      'M 15,85 L 85,85'
    ],
    examples: [
      { word: 'お金', reading: 'おかね', meaning: 'Tiền' },
      { word: '金曜日', reading: 'きんようび', meaning: 'Thứ sáu' },
      { word: '料金', reading: 'りょうきん', meaning: 'Tiền phí' }
    ]
  },
  {
    id: 'k_52',
    character: '土',
    hanViet: 'THỔ',
    meaning: 'Đất, thứ bảy',
    radical: '土 (Thổ)',
    strokeCount: 3,
    onyomi: ['ド', 'ト'],
    kunyomi: ['つち'],
    lessonId: 5,
    strokes: [
      'M 25,48 L 75,48',
      'M 50,20 L 50,82',
      'M 15,82 L 85,82'
    ],
    examples: [
      { word: '土曜日', reading: 'どようび', meaning: 'Thứ bảy' },
      { word: '土地', reading: 'とち', meaning: 'Đất đai' },
      { word: 'お土産', reading: 'おみやげ', meaning: 'Quà lưu niệm' }
    ]
  },
  {
    id: 'k_53',
    character: '見',
    hanViet: 'KIẾN',
    meaning: 'Nhìn, xem, thấy',
    radical: '見 (Kiến)',
    strokeCount: 7,
    onyomi: ['ケン'],
    kunyomi: ['み.る', 'み.える', 'み.せる'],
    lessonId: 6,
    strokes: [
      'M 30,20 L 30,62',
      'M 30,20 L 70,20 L 70,62',
      'M 30,34 L 70,34',
      'M 30,48 L 70,48',
      'M 30,62 L 70,62',
      'M 42,62 L 30,85',
      'M 58,62 L 58,82 Q 72,85 82,75'
    ],
    examples: [
      { word: '見る', reading: 'みる', meaning: 'Xem, nhìn' },
      { word: '見せる', reading: 'みせる', meaning: 'Cho xem' },
      { word: '意見', reading: 'いけん', meaning: 'Ý kiến' }
    ]
  },
  {
    id: 'k_54',
    character: '聞',
    hanViet: 'VĂN',
    meaning: 'Nghe, hỏi',
    radical: '耳 (Nhĩ)',
    strokeCount: 14,
    onyomi: ['ブン', 'モン'],
    kunyomi: ['き.く', 'き.こえる'],
    lessonId: 6,
    strokes: [
      'M 20,20 L 20,85',
      'M 20,20 L 45,20 L 45,50',
      'M 55,20 L 80,20 L 80,85',
      'M 35,45 L 65,45',
      'M 40,45 L 40,75',
      'M 60,45 L 60,75',
      'M 32,75 L 68,75'
    ],
    examples: [
      { word: '聞く', reading: 'きく', meaning: 'Nghe, hỏi' },
      { word: '新聞', reading: 'しんぶん', meaning: 'Báo chí' },
      { word: '聞こえる', reading: 'きこえる', meaning: 'Nghe thấy' }
    ]
  },
  {
    id: 'k_55',
    character: '読',
    hanViet: 'ĐỘC',
    meaning: 'Đọc, đọc sách',
    radical: '言 (Ngôn)',
    strokeCount: 14,
    onyomi: ['ドク', 'トク'],
    kunyomi: ['よ.む'],
    lessonId: 6,
    strokes: [
      'M 26,20 L 26,28',
      'M 15,35 L 42,35',
      'M 18,48 L 40,48',
      'M 18,60 L 40,60',
      'M 20,72 L 20,85',
      'M 20,72 L 38,72 L 38,85',
      'M 58,25 L 82,25',
      'M 70,25 L 70,50',
      'M 52,58 L 84,58',
      'M 60,65 L 50,85',
      'M 70,65 L 80,85'
    ],
    examples: [
      { word: '読む', reading: 'よむ', meaning: 'Đọc' },
      { word: '読書', reading: 'どくしょ', meaning: 'Đọc sách' }
    ]
  },
  {
    id: 'k_56',
    character: '書',
    hanViet: 'THƯ',
    meaning: 'Viết, thư từ, sách',
    radical: '曰 (Viết)',
    strokeCount: 10,
    onyomi: ['ショ'],
    kunyomi: ['か.く'],
    lessonId: 6,
    strokes: [
      'M 25,20 L 75,20',
      'M 50,20 L 50,55',
      'M 28,32 L 72,32',
      'M 25,44 L 75,44',
      'M 18,56 L 82,56',
      'M 32,65 L 32,88',
      'M 32,65 L 68,65 L 68,88',
      'M 32,76 L 68,76',
      'M 32,88 L 68,88'
    ],
    examples: [
      { word: '書く', reading: 'かく', meaning: 'Viết' },
      { word: '図書館', reading: 'としょかん', meaning: 'Thư viện' },
      { word: '辞書', reading: 'じしょ', meaning: 'Từ điển' }
    ]
  },
  {
    id: 'k_57',
    character: '話',
    hanViet: 'THOẠI',
    meaning: 'Nói chuyện, câu chuyện',
    radical: '言 (Ngôn)',
    strokeCount: 13,
    onyomi: ['ワ'],
    kunyomi: ['はな.す', 'はなし'],
    lessonId: 6,
    strokes: [
      'M 25,18 L 25,26',
      'M 14,34 L 40,34',
      'M 16,46 L 38,46',
      'M 16,58 L 38,58',
      'M 18,70 L 18,85',
      'M 18,70 L 36,70 L 36,85',
      'M 72,20 L 55,35',
      'M 48,45 L 82,45',
      'M 65,35 L 65,65',
      'M 54,68 L 54,85',
      'M 54,68 L 78,68 L 78,85'
    ],
    examples: [
      { word: '話す', reading: 'はなす', meaning: 'Nói chuyện' },
      { word: '電話', reading: 'でんわ', meaning: 'Điện thoại' },
      { word: '会話', reading: 'かいわ', meaning: 'Hội thoại' }
    ]
  },
  {
    id: 'k_58',
    character: '買',
    hanViet: 'MÃI',
    meaning: 'Mua, mua sắm',
    radical: '貝 (Bối)',
    strokeCount: 12,
    onyomi: ['バイ'],
    kunyomi: ['か.う'],
    lessonId: 6,
    strokes: [
      'M 25,22 L 75,22',
      'M 25,22 L 25,38',
      'M 75,22 L 75,38',
      'M 25,38 L 75,38',
      'M 30,45 L 30,80',
      'M 30,45 L 70,45 L 70,80',
      'M 30,56 L 70,56',
      'M 30,68 L 70,68',
      'M 30,80 L 70,80',
      'M 38,84 L 28,92',
      'M 62,84 L 72,92'
    ],
    examples: [
      { word: '買う', reading: 'かう', meaning: 'Mua' },
      { word: '買い物', reading: 'かいもの', meaning: 'Mua sắm' }
    ]
  },
  {
    id: 'k_59',
    character: '物',
    hanViet: 'VẬT',
    meaning: 'Vật, đồ vật, sự vật',
    radical: '牛 (Ngưu)',
    strokeCount: 8,
    onyomi: ['ブツ', 'モツ'],
    kunyomi: ['もの'],
    lessonId: 6,
    strokes: [
      'M 35,20 L 22,42',
      'M 12,45 L 45,45',
      'M 30,25 L 30,85',
      'M 18,80 L 45,62',
      'M 68,20 L 52,38',
      'M 54,35 L 82,35 Q 86,65 72,82',
      'M 62,45 L 50,75',
      'M 70,45 L 60,78'
    ],
    examples: [
      { word: '物', reading: 'もの', meaning: 'Đồ vật' },
      { word: '食べ物', reading: 'たべもの', meaning: 'Thức ăn' },
      { word: '荷物', reading: 'にもつ', meaning: 'Hành lý' },
      { word: '動物', reading: 'どうぶつ', meaning: 'Động vật' }
    ]
  },
  {
    id: 'k_60',
    character: '友',
    hanViet: 'HỮU',
    meaning: 'Bạn bè, hữu nghị',
    radical: '又 (Hựu)',
    strokeCount: 4,
    onyomi: ['ユウ'],
    kunyomi: ['とも'],
    lessonId: 6,
    strokes: [
      'M 20,32 L 80,32',
      'M 50,18 L 22,78',
      'M 35,48 L 68,48',
      'M 68,48 L 38,82 Q 58,85 75,78'
    ],
    examples: [
      { word: '友達', reading: 'ともだち', meaning: 'Bạn bè' },
      { word: '親友', reading: 'しんゆう', meaning: 'Bạn thân' },
      { word: '友人', reading: 'ゆうじん', meaning: 'Người bạn' }
    ]
  }
];

export const getKanjiByLesson = (lessonId) => {
  const target = parseInt(lessonId, 10);
  return kanjiData.filter((k) => k.lessonId === target);
};
