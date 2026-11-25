import * as wanakana from 'wanakana';
import { levenshteinDistance, removeVietnameseAccents } from './stringUtils.js';
import { romajiToJapanese } from './romajiConverter.js';

/**
 * Làm sạch chuỗi cơ bản trước khi so khớp:
 * Loại bỏ khoảng trắng thừa, dấu câu, ngoặc đơn, ký tự sóng tilde
 * @param {string} str 
 * @returns {string}
 */
const cleanText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[\s。、！？!?・…「」『』（）()\-–—_~〜～:;,.]/g, '')
    .trim()
    .toLowerCase();
};

/**
 * Trích xuất toàn bộ các dạng đáp án tiếng Nhật hợp lệ của một từ vựng
 * Bao gồm: Kanji, Hiragana, Katakana, Romaji (với/không tiền tố lịch sự お/ご)
 * @param {Object} target 
 * @returns {Set<string>} Tập hợp các chuỗi đáp án chuẩn hóa hợp lệ
 */
const getValidJapaneseAnswers = (target) => {
  const validSet = new Set();
  if (!target) return validSet;

  const rawCandidates = [
    target.kanji,
    target.hiragana,
    target.kana,
    target.japanese,
    target.japanese_text
  ].filter(Boolean);

  // Mở rộng các biến thể có ngoặc đơn: ví dụ "(お)名前" -> ["(お)名前", "お名前", "名前"]
  const expandedCandidates = [];
  rawCandidates.forEach((raw) => {
    const cleaned = raw.replace(/[~～...…]/g, '').trim();
    expandedCandidates.push(cleaned);
    if (cleaned.includes('(') || cleaned.includes('（')) {
      const withPrefix = cleaned.replace(/[()（）]/g, '');
      const withoutPrefix = cleaned.replace(/\([^)]*\)|（[^）]*）/g, '');
      if (withPrefix) expandedCandidates.push(withPrefix);
      if (withoutPrefix) expandedCandidates.push(withoutPrefix);
    }
  });

  expandedCandidates.forEach((cand) => {
    validSet.add(cand);
    validSet.add(cleanText(cand));

    // 1. Chuyển sang Hiragana qua WanaKana
    try {
      const asKana = wanakana.toKana(cand);
      validSet.add(asKana);
      validSet.add(cleanText(asKana));
    } catch {
      // Bỏ qua nếu lỗi parse
    }

    // 2. Chuyển sang Katakana qua WanaKana
    try {
      const asKata = wanakana.toKatakana(cand);
      validSet.add(asKata);
      validSet.add(cleanText(asKata));
    } catch {
      // Bỏ qua nếu lỗi parse
    }

    // 3. Chuyển sang Romaji qua WanaKana
    try {
      const asRomaji = wanakana.toRomaji(cand).toLowerCase();
      validSet.add(asRomaji);
      validSet.add(cleanText(asRomaji));
      // Hỗ trợ trường âm dạng dấu gạch ngang (koohii -> ko-hi-, biiru -> bi-ru)
      const hyphenated = asRomaji.replace(/([aeiou])\1/g, '$1-');
      validSet.add(hyphenated);
      // Lưu ý: Không add cleanText(hyphenated) vì sẽ biến "bi-ru" thành "biru" gây nhận diện nhầm Bia với Tòa nhà!
    } catch {
      // Bỏ qua nếu lỗi parse
    }
  });

  return validSet;
};

/**
 * Khắc phục các khoảng trắng bị ngắt âm tiết do OCR trong dữ liệu tiếng Việt
 * (vd: "Công vi ệc" -> "Công việc", "Bưu đi ện" -> "Bưu điện", "Thịt l ợn" -> "Thịt lợn")
 * @param {string} str
 * @returns {string}
 */
const SPLIT_CONSONANT_RE =
  /(^|[\s,;/()])(ngh|ng|nh|ch|gh|kh|ph|th|tr|[bcdfghklmnpqrstvwxzđ])\s+([aăâeêioôơuưyáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ])/gi;

const healVietnameseOcrText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/Thành o hố/g, 'Thành phố')
    .replace(/thành o hố/gi, 'thành phố')
    .replace(/cà\s*-ri/gi, 'cà ri')
    .replace(SPLIT_CONSONANT_RE, '$1$2$3')
    .replace(SPLIT_CONSONANT_RE, '$1$2$3')
    .replace(
      /(^|[\s,;/()])([bcdđghklmnpqrstvx]|nh|ch|th|tr|ph|kh|ng|ngh)?(?:i|uy)\s+(ế|ề|ể|ễ|ệ)([a-zà-ỹ]*)/gi,
      (full, sep, onset = '', vowel, tail = '') => {
        const prefix = full.toLowerCase().includes('uy') ? `${onset}uy` : `${onset}i`;
        return `${sep}${prefix}${vowel}${tail}`;
      }
    )
    .replace(/(^|[\s,;/()])([bcdđghklmnpqrstvx]|nh|ch|th|tr|ph|kh|ng|ngh)?ư\s+(ớ|ờ|ở|ỡ|ợ)([a-zà-ỹ]+)/gi, '$1$2ư$3$4')
    .replace(/(^|[\s,;/()])([bcdđghklmnpqrstvx]|nh|ch|th|tr|ph|kh|ng)u\s+(ố|ồ|ổ|ỗ|ộ|ấ|ầ|ẩ|ẫ|ậ)([a-zà-ỹ]+)/gi, '$1$2u$3$4')
    .replace(/(^|[\s,;/()])(qu|gi)\s+([aăâeêioôơuưyáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ][a-zà-ỹ]*)/gi, '$1$2$3')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Chuẩn hóa chính tả tiếng Việt (NFC, bỏ khoảng trắng thừa, đồng nhất thanh điệu oà/òa & i/y thông dụng)
 * @param {string} str
 * @returns {string}
 */
const normalizeViOrthography = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFC')
    .toLowerCase()
    .replace(/oà/g, 'òa')
    .replace(/oá/g, 'óa')
    .replace(/oả/g, 'ỏa')
    .replace(/oã/g, 'õa')
    .replace(/oạ/g, 'ọa')
    .replace(/oè/g, 'òe')
    .replace(/oé/g, 'óe')
    .replace(/oẻ/g, 'ỏe')
    .replace(/oẽ/g, 'õe')
    .replace(/oẹ/g, 'ọe')
    .replace(/uỳ/g, 'ùy')
    .replace(/uý/g, 'úy')
    .replace(/uỷ/g, 'ủy')
    .replace(/uỹ/g, 'ũy')
    .replace(/uỵ/g, 'ụy')
    .replace(/(^|\s)giầy(?=\s|$)/g, '$1giày')
    .replace(/(^|\s)mỳ(?=\s|$)/g, '$1mì')
    .replace(/(^|\s)sỹ(?=\s|$)/g, '$1sĩ')
    .replace(/(^|\s)kĩ(?=\s|$)/g, '$1kỹ')
    .replace(/(^|\s)mĩ(?=\s|$)/g, '$1mỹ')
    .replace(/(^|\s)lí(?=\s|$)/g, '$1lý')
    .replace(/(^|\s)quí(?=\s|$)/g, '$1quý')
    .replace(/(^|\s)kì(?=\s|$)/g, '$1kỳ')
    .replace(/\s+/g, ' ')
    .trim();
};

const GRAMMAR_PAREN_RE =
  /^(của\b|khi\b|động từ|tính từ|danh từ|số nhiều|nhiệt độ|thời tiết|cảm giác|đèn|nước,|chia sẻ|lịch sự|nước nào|bạn\b|người\b|nói chung|phương ngữ|tàu,|sức khỏe|thời gian|công ty|nhà hàng|cửa hàng|cách\b|dùng\b)/i;

/**
 * Mở rộng cụm chứa dấu gạch chéo "/" (vd: "Thầy/Cô giáo" -> ["thầy giáo", "cô giáo", "thầy cô giáo", "thầy cô"])
 * @param {string} segment
 * @returns {string[]}
 */
const expandSlashPhrase = (segment) => {
  const results = [];
  const cleanedSegment = segment.replace(/[.!?…]+$/g, '').trim();
  if (!cleanedSegment) return results;

  // Tách trực tiếp các vế qua "/"
  const rawParts = cleanedSegment.split('/').map((s) => s.trim()).filter(Boolean);
  results.push(...rawParts);

  // Mở rộng cụm chia sẻ tiền tố/hậu tố dùng chung (ưu tiên gạch chéo viết liền như "Thầy/Cô giáo", "2 bát/suất cơm"
  // hoặc mẫu đơn giản đầu câu như "Anh / chị ơi")
  const hasTightSlash = /[^\s/]\/[^\s/]/.test(cleanedSegment);
  const match = cleanedSegment.match(/^(.*?)([^\s/]+)\s*\/\s*([^\s/]+)(.*)$/);
  if (match && rawParts.length === 2) {
    const [, rawPrefix, opt1, opt2, rawSuffix] = match;
    const prefix = rawPrefix;
    const suffix = rawSuffix;
    const prefixNorm = prefix.trim().toLowerCase();
    const suffixNorm = suffix.trim().toLowerCase();
    const opt1Norm = opt1.toLowerCase();
    const opt2Norm = opt2.toLowerCase();

    const shouldExpand =
      (prefixNorm || suffixNorm) &&
      (hasTightSlash || !prefixNorm) &&
      (!prefixNorm || !prefixNorm.split(/\s+/).includes(opt2Norm)) &&
      (!suffixNorm || !suffixNorm.split(/\s+/).includes(opt1Norm));

    if (shouldExpand) {
      results.push(`${prefix}${opt1}${suffix}`.trim());
      results.push(`${prefix}${opt2}${suffix}`.trim());
      results.push(`${prefix}${opt1} ${opt2}${suffix}`.trim());
      if (!prefixNorm) {
        results.push(`${opt1} ${opt2}`.trim());
      }
    }
  }

  return results;
};

/**
 * Trích xuất danh sách các nghĩa tiếng Việt hợp lệ
 * - Tự động chữa lỗi tách chữ OCR
 * - Mở rộng đồng nghĩa trong ngoặc, cụm gạch chéo "/" (Thầy/Cô giáo), bỏ loại từ phổ biến
 * @param {Object} target
 * @returns {{ accented: string[], unaccented: string[] }}
 */
const getValidVietnameseAnswers = (target) => {
  if (!target) return { accented: [], unaccented: [] };

  const rawMeaningRaw = target.meaning || target.meaning_vi || target.vietnamese || '';
  if (!rawMeaningRaw) return { accented: [], unaccented: [] };
  const rawMeaning = healVietnameseOcrText(rawMeaningRaw);

  // Trích xuất nghĩa đồng nghĩa nằm trong ngoặc đơn (vd: "(cấp 3)", "(Quần vợt)", "(dưa lưới)") trước khi xóa ngoặc
  const parenSynonyms = [];
  for (const m of rawMeaning.matchAll(/\(([^)]+)\)|（([^）]+)）/g)) {
    const inner = (m[1] || m[2] || '').trim();
    if (inner && inner.length >= 2 && !GRAMMAR_PAREN_RE.test(inner)) {
      parenSynonyms.push(inner);
    }
  }

  // Tách theo dấu phẩy, chấm phẩy, gạch đứng hoặc xuống dòng rồi bung tiếp các cụm "/"
  const baseSegments = rawMeaning
    .split(/[,;|\n]+/)
    .map((p) => p.replace(/\(.*?\)|（.*?）|[~～...…]/g, '').replace(/[.!?]+$/g, '').trim())
    .filter(Boolean);

  const expandedParts = [];
  for (const seg of [...baseSegments, ...parenSynonyms]) {
    expandedParts.push(...expandSlashPhrase(seg));
  }

  const accented = [];
  const unaccented = [];

  const pushCandidate = (val) => {
    const norm = normalizeViOrthography(val);
    if (!norm) return;
    accented.push(norm);
    unaccented.push(removeVietnameseAccents(norm));
  };

  expandedParts.forEach((part) => {
    const low = normalizeViOrthography(part);
    if (!low) return;
    pushCandidate(low);

    // Lược bỏ từ mở đầu không làm đổi nghĩa cốt lõi
    const strippedRole = low.replace(/^(người|sự|việc|được|bị)\s+/i, '');
    if (strippedRole !== low) pushCandidate(strippedRole);

    const strippedClassifier = low.replace(/^(quả|trái|cái|chiếc|cuốn|quyển|bức|tấm|món|chữ)\s+/i, '');
    if (strippedClassifier !== low && strippedClassifier.length >= 3) {
      pushCandidate(strippedClassifier);
    }

    const strippedSchool = low.replace(/^trường\s+/i, '');
    if (strippedSchool !== low && strippedSchool.length >= 6) {
      pushCandidate(strippedSchool);
    }
  });

  return {
    accented: [...new Set(accented)],
    unaccented: [...new Set(unaccented)]
  };
};

const normalizeJapaneseKey = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\([^)]*\)|（[^）]*）|\[[^\]]*\]/g, '')
    .replace(/[~～0-9\s。、！？!?・]/g, '')
    .trim();
};

/**
 * Bảng từ gần nghĩa tiếng Việt kèm ghi chú nhắc nhớ sắc thái theo chuẩn Dekiru Nihongo
 */
const NEAR_SYNONYM_RULES = [
  {
    keys: ['先生', 'せんせい'],
    synonyms: ['giáo viên', 'giảng viên', 'người dạy'],
    note: '先生 dùng tôn xưng "Thầy/Cô giáo" của người khác (khi tự nói nghề của mình dùng 教師).',
  },
  {
    keys: ['教師', 'きょうし'],
    synonyms: ['thầy giáo', 'cô giáo', 'thầy cô', 'thầy cô giáo', 'giảng viên', 'nghề giáo viên'],
    note: '教師 chỉ nghề "Giáo viên" khách quan/khiêm nhường (gọi trực tiếp Thầy/Cô người khác dùng 先生).',
  },
  {
    keys: ['学生', 'がくせい'],
    synonyms: ['sinh viên', 'học sinh sinh viên', 'học trò'],
    note: 'Sách dịch 学生 là "Học sinh" (trong tiếng Nhật thường chỉ chung học sinh lớn & sinh viên đại học).',
  },
  {
    keys: ['会社員', 'かいしゃいん'],
    synonyms: ['nhân viên công ty', 'nhân viên', 'dân văn phòng'],
    note: 'Sách dịch 会社員 là "Nhân viên văn phòng" / nhân viên công ty nói chung (còn 社員 luôn đi kèm tên công ty).',
  },
  {
    keys: ['社員', 'しゃいん'],
    synonyms: ['nhân viên công ty', 'nhân viên văn phòng'],
    note: '社員 là "Nhân viên của công ty ～", luôn ghép sau tên công ty (vd: IMCの社員).',
  },
  {
    keys: ['仕事', 'しごと'],
    synonyms: ['việc làm', 'nghề nghiệp'],
    note: '（お）仕事 nghĩa chuẩn trong sách là "Công việc".',
  },
  {
    keys: ['国', 'くに'],
    synonyms: ['quốc gia', 'tổ quốc', 'quê hương', 'nước'],
    note: '（お）国 nghĩa chuẩn trong sách là "Đất nước".',
  },
  {
    keys: ['高校', 'こうこう'],
    synonyms: ['trường cấp 3', 'cấp ba', 'trường cấp ba', 'thpt', 'trường thpt', 'trung học phổ thông'],
    note: '高校 viết tắt của 高等学校 — "Trường trung học phổ thông (cấp 3)".',
  },
  {
    keys: ['トイレ'],
    synonyms: ['vệ sinh', 'phòng vệ sinh', 'nhà xí', 'wc', 'toilet'],
    note: 'トイレ nghĩa chuẩn trong sách là "Nhà vệ sinh".',
  },
  {
    keys: ['携帯電話', 'けいたいでんわ', 'けいたんでんわ'],
    synonyms: ['điện thoại', 'di động', 'điện thoại cầm tay', 'smartphone'],
    note: '携帯電話 là "Điện thoại di động" (phân biệt với 電話 là điện thoại nói chung).',
  },
  {
    keys: ['パソコン'],
    synonyms: ['máy tính', 'máy vi tính', 'laptop', 'pc', 'máy tính xách tay'],
    note: 'パソコン (Personal Computer) nghĩa đầy đủ là "Máy tính cá nhân".',
  },
  {
    keys: ['豚肉', 'ぶたにく'],
    synonyms: ['thịt heo'],
    note: '豚肉 nghĩa chuẩn trong sách là "Thịt lợn" (phương ngữ miền Nam: "Thịt heo").',
  },
  {
    keys: ['ご飯', 'ごはん'],
    synonyms: ['bữa ăn', 'bữa cơm', 'cơm trắng'],
    note: 'ご飯 vừa có nghĩa là "Cơm", vừa dùng để chỉ "Bữa ăn" nói chung.',
  },
  {
    keys: ['朝ご飯', 'あさごはん'],
    synonyms: ['bữa sáng', 'ăn sáng', 'điểm tâm'],
    note: '朝ご飯 nghĩa sát chữ là "Cơm sáng" (cũng dùng chỉ bữa ăn sáng).',
  },
  {
    keys: ['昼ご飯', 'ひるごはん'],
    synonyms: ['bữa trưa', 'ăn trưa'],
    note: '昼ご飯 nghĩa sát chữ là "Cơm trưa" (cũng dùng chỉ bữa ăn trưa).',
  },
  {
    keys: ['晩ご飯', 'ばんごはん'],
    synonyms: ['bữa tối', 'ăn tối', 'cơm chiều'],
    note: '晩ご飯 nghĩa sát chữ là "Cơm tối" (cũng dùng chỉ bữa ăn tối).',
  },
  {
    keys: ['駅', 'えき'],
    synonyms: ['ga', 'ga tàu', 'ga tàu điện', 'trạm tàu'],
    note: '駅 nghĩa chuẩn trong sách là "Nhà ga".',
  },
  {
    keys: ['電車', 'でんしゃ'],
    synonyms: ['tàu', 'tàu hỏa', 'xe lửa'],
    note: '電車 chính xác là "Tàu điện" (phân biệt với 新幹線 là tàu siêu tốc Shinkansen).',
  },
  {
    keys: ['映画', 'えいが'],
    synonyms: ['phim', 'bộ phim', 'điện ảnh'],
    note: '映画 nghĩa chuẩn trong sách là "Phim ảnh / Bộ phim".',
  },
  {
    keys: ['きれい', '綺麗'],
    synonyms: ['sạch', 'sạch đẹp', 'xinh', 'xinh đẹp', 'gọn gàng'],
    note: 'きれい（な） mang cả hai nghĩa quan trọng là "Đẹp" và "Sạch sẽ".',
  },
  {
    keys: ['元気', 'げんき'],
    synonyms: ['khỏe', 'mạnh khỏe', 'tràn đầy năng lượng'],
    note: '元気（な） nghĩa chuẩn trong sách là "Khỏe mạnh, hoạt bát".',
  },
  {
    keys: ['両親', 'りょうしん'],
    synonyms: ['cha mẹ', 'ba mẹ', 'ba má', 'bố mẹ tôi', 'cha mẹ tôi'],
    note: '両親 là "Bố mẹ" (nhấn mạnh cặp song thân, thường dùng cho gia đình mình).',
  },
  {
    keys: ['父', 'ちち'],
    synonyms: ['ba', 'cha', 'tía', 'bố tôi', 'ba tôi', 'cha tôi'],
    note: '父 dùng để nói về "Bố của mình" (khiêm nhường; bố người khác dùng お父さん).',
  },
  {
    keys: ['お父さん', 'おとうさん'],
    synonyms: ['ba', 'cha', 'tía', 'bố bạn', 'ba bạn'],
    note: 'お父さん dùng tôn kính cho "Bố của người khác" hoặc khi con cái gọi trực tiếp bố mình.',
  },
  {
    keys: ['母', 'はは'],
    synonyms: ['má', 'u', 'mẹ tôi', 'má tôi'],
    note: '母 dùng để nói về "Mẹ của mình" (khiêm nhường; mẹ người khác dùng お母さん).',
  },
  {
    keys: ['お母さん', 'おかあさん'],
    synonyms: ['má', 'u', 'mẹ bạn', 'má bạn'],
    note: 'お母さん dùng tôn kính cho "Mẹ của người khác" hoặc khi con cái gọi trực tiếp mẹ mình.',
  },
  {
    keys: ['兄', 'あに'],
    synonyms: ['anh', 'anh hai', 'anh cả', 'anh tôi', 'anh trai tôi'],
    note: '兄 chỉ "Anh trai của mình" (khiêm nhường; anh người khác dùng お兄さん).',
  },
  {
    keys: ['お兄さん', 'おにいさん'],
    synonyms: ['anh', 'anh trai bạn', 'anh bạn'],
    note: 'お兄さん dùng tôn kính cho "Anh trai của người khác" hoặc khi xưng hô với thanh niên.',
  },
  {
    keys: ['姉', 'あね'],
    synonyms: ['chị', 'chị hai', 'chị cả', 'chị tôi', 'chị gái tôi'],
    note: '姉 chỉ "Chị gái của mình" (khiêm nhường; chị người khác dùng お姉さん).',
  },
  {
    keys: ['お姉さん', 'おねえさん'],
    synonyms: ['chị', 'chị gái bạn', 'chị bạn'],
    note: 'お姉さん dùng tôn kính cho "Chị gái của người khác" hoặc khi xưng hô với cô gái trẻ.',
  },
  {
    keys: ['夫', 'おっと'],
    synonyms: ['ông xã', 'chồng tôi'],
    note: '夫 chỉ "Chồng của mình" (khiêm nhường; chồng người khác dùng ご主人).',
  },
  {
    keys: ['ご主人', 'ごしゅじん'],
    synonyms: ['ông xã', 'chồng bạn'],
    note: 'ご主人 dùng tôn kính để gọi "Chồng của người khác".',
  },
  {
    keys: ['妻', 'つま'],
    synonyms: ['bà xã', 'vợ tôi'],
    note: '妻 chỉ "Vợ của mình" (khiêm nhường; vợ người khác dùng 奥さん).',
  },
  {
    keys: ['奥さん', 'おくさん'],
    synonyms: ['bà xã', 'vợ bạn'],
    note: '奥さん dùng tôn kính để gọi "Vợ của người khác".',
  },
];

const NEAR_SYNONYM_MAP = new Map();
for (const rule of NEAR_SYNONYM_RULES) {
  for (const key of rule.keys) {
    NEAR_SYNONYM_MAP.set(key, rule);
  }
}

const matchNearSynonym = (target, inputNorm, inputNoAccent) => {
  if (!target) return null;
  const candidateKeys = [
    normalizeJapaneseKey(target.kanji),
    normalizeJapaneseKey(target.hiragana),
    normalizeJapaneseKey(target.kana),
  ].filter(Boolean);

  for (const key of candidateKeys) {
    const rule = NEAR_SYNONYM_MAP.get(key);
    if (!rule) continue;
    const isMatched = rule.synonyms.some((syn) => {
      const synNorm = normalizeViOrthography(syn);
      const synNoAccent = removeVietnameseAccents(synNorm);
      return (
        matchesVietnameseMeaning(synNorm, inputNorm) ||
        matchesVietnameseMeaning(synNoAccent, inputNoAccent)
      );
    });
    if (isMatched) {
      return rule;
    }
  }
  return null;
};

/**
 * So khớp nghĩa tiếng Việt an toàn:
 * - Chặn việc gõ 1-2 chữ cái (vd: "a", "nh") ăn điểm do .includes()
 * - Chỉ cho phép khớp trọn vẹn nguyên nghĩa hoặc cụm từ đủ dài (>= 2 từ và >= 5 ký tự) theo ranh giới khoảng trắng
 * @param {string} ans
 * @param {string} input
 * @returns {boolean}
 */
const matchesVietnameseMeaning = (ans, input) => {
  const normAns = ans.replace(/\s+/g, ' ').trim();
  const normInput = input.replace(/\s+/g, ' ').trim();
  if (!normAns || !normInput) return false;

  if (normAns === normInput) return true;

  const shorter = normAns.length <= normInput.length ? normAns : normInput;
  const longer = normAns.length <= normInput.length ? normInput : normAns;
  const shorterWords = shorter.split(' ');
  if (shorterWords.length < 2 || shorter.length < 5) return false;

  return ` ${longer} `.includes(` ${shorter} `);
};

/**
 * Kiểm tra câu trả lời tự luận (Flexible Answer Verification)
 * 
 * @param {Object} params
 * @param {string} params.userInput - Nội dung người dùng gõ
 * @param {Object} params.target - Đối tượng từ vựng mục tiêu
 * @param {'to_ja'|'to_vi'} params.direction - Chiều câu hỏi: 'to_ja' (gõ tiếng Nhật) hoặc 'to_vi' (gõ tiếng Việt)
 * @returns {{ isCorrect: boolean, feedback: string, expectedAnswer: string, isFuzzyMatch: boolean }}
 */
export const verifyTypedAnswer = ({ userInput, target, direction = 'to_ja' }) => {
  if (!userInput || typeof userInput !== 'string' || !target) {
    return {
      isCorrect: false,
      feedback: 'Bạn chưa nhập câu trả lời.',
      expectedAnswer: target?.hiragana || target?.kanji || target?.meaning || '',
      isFuzzyMatch: false
    };
  }

  const rawInput = userInput.trim();
  const cleanedInput = cleanText(rawInput);

  // --- TRƯỜNG HỢP 1: GÕ TIẾNG NHẬT (Hiragana / Katakana / Romaji / Kanji) ---
  if (direction === 'to_ja') {
    const validAnswers = getValidJapaneseAnswers(target);
    const expected = target.kanji && target.kanji !== target.hiragana
      ? `${target.kanji} (${target.hiragana})`
      : target.hiragana || target.kanji || '';

    // 1. So khớp trực tiếp chuỗi đã làm sạch
    if (validAnswers.has(cleanedInput) || validAnswers.has(rawInput)) {
      return {
        isCorrect: true,
        feedback: '✓ Chính xác hoàn hảo!',
        expectedAnswer: expected,
        isFuzzyMatch: false
      };
    }

    // 2. Thử chuyển đổi input sang Kana bằng WanaKana
    const inputAsKana = cleanText(wanakana.toKana(rawInput));
    if (validAnswers.has(inputAsKana) || validAnswers.has(wanakana.toKana(rawInput))) {
      return {
        isCorrect: true,
        feedback: '✓ Chính xác hoàn hảo!',
        expectedAnswer: expected,
        isFuzzyMatch: false
      };
    }

    // 2.5 Thử chuyển đổi input sang Katakana bằng WanaKana (hỗ trợ ko-hi- -> コーヒー, bi-ru -> ビール)
    const inputAsKataRaw = wanakana.toKatakana(rawInput);
    const inputAsKata = cleanText(inputAsKataRaw);
    if (validAnswers.has(inputAsKata) || validAnswers.has(inputAsKataRaw)) {
      return {
        isCorrect: true,
        feedback: '✓ Chính xác hoàn hảo!',
        expectedAnswer: expected,
        isFuzzyMatch: false
      };
    }

    // 3. Thử chuyển đổi input sang Romaji bằng WanaKana
    const inputAsRomaji = cleanText(wanakana.toRomaji(rawInput));
    if (validAnswers.has(inputAsRomaji)) {
      return {
        isCorrect: true,
        feedback: '✓ Chính xác hoàn hảo!',
        expectedAnswer: expected,
        isFuzzyMatch: false
      };
    }

    // 3.5 Thử chuyển đổi Romaji có trường âm macron (ō, ī, ū) qua từ điển Katakana thông dụng
    const inputAsCommonJa = romajiToJapanese(rawInput);
    if (inputAsCommonJa && (validAnswers.has(inputAsCommonJa) || validAnswers.has(cleanText(inputAsCommonJa)))) {
      return {
        isCorrect: true,
        feedback: '✓ Chính xác hoàn hảo!',
        expectedAnswer: expected,
        isFuzzyMatch: false
      };
    }

    // 4. Dung sai Levenshtein nhẹ (cho phép nhầm 1 lỗi gõ phím nếu từ >= 4 ký tự)
    const targetKana = cleanText(target.hiragana || target.kanji || '');
    if (targetKana.length >= 4 && inputAsKana.length >= 3) {
      const dist = levenshteinDistance(inputAsKana, targetKana);
      if (dist <= 1) {
        return {
          isCorrect: true,
          feedback: `✓ Gần như hoàn hảo! (Chính xác nhất là: ${expected})`,
          expectedAnswer: expected,
          isFuzzyMatch: true
        };
      }
    }

    return {
      isCorrect: false,
      feedback: `✗ Chưa chính xác.`,
      expectedAnswer: expected,
      isFuzzyMatch: false
    };
  }

  // --- TRƯỜNG HỢP 2: GÕ TIẾNG VIỆT (Nghĩa từ vựng) ---
  const { accented, unaccented } = getValidVietnameseAnswers(target);
  const inputLower = normalizeViOrthography(rawInput);
  const inputNoAccent = removeVietnameseAccents(inputLower);
  const expectedVi = healVietnameseOcrText(target.meaning || target.meaning_vi || target.vietnamese || '');

  // 1. So khớp có dấu
  const directMatch = accented.some((ans) => matchesVietnameseMeaning(ans, inputLower));
  if (directMatch) {
    return {
      isCorrect: true,
      feedback: '✓ Chính xác hoàn hảo!',
      expectedAnswer: expectedVi,
      isFuzzyMatch: false
    };
  }

  // 2. So khớp không dấu (cho phép người học không bật gõ dấu tiếng Việt)
  const noAccentMatch = unaccented.some((ans) => matchesVietnameseMeaning(ans, inputNoAccent));
  if (noAccentMatch) {
    return {
      isCorrect: true,
      feedback: '✓ Đúng nghĩa tiếng Việt!',
      expectedAnswer: expectedVi,
      isFuzzyMatch: false
    };
  }

  // 3. So khớp từ gần nghĩa phổ biến kèm nhắc nhớ sắc thái (vd: 先生 <-> "giáo viên")
  const synonymMatch = matchNearSynonym(target, inputLower, inputNoAccent);
  if (synonymMatch) {
    return {
      isCorrect: true,
      feedback: `✓ Chấp nhận nghĩa gần đúng! 💡 Lưu ý: ${synonymMatch.note}`,
      expectedAnswer: expectedVi,
      isFuzzyMatch: true
    };
  }

  // 4. So khớp Levenshtein trên tiếng Việt không dấu nếu độ dài >= 5 ký tự
  for (const ans of unaccented) {
    if (ans.length >= 5 && inputNoAccent.length >= 4) {
      const dist = levenshteinDistance(inputNoAccent, ans);
      if (dist <= 1) {
        return {
          isCorrect: true,
          feedback: `✓ Gần đúng nghĩa! (${expectedVi})`,
          expectedAnswer: expectedVi,
          isFuzzyMatch: true
        };
      }
    }
  }

  return {
    isCorrect: false,
    feedback: `✗ Chưa chính xác.`,
    expectedAnswer: expectedVi,
    isFuzzyMatch: false
  };
};

/**
 * Sinh gợi ý từng bước (Hint System)
 * @param {Object} params
 * @param {Object} params.target
 * @param {'to_ja'|'to_vi'} params.direction
 * @param {number} params.hintLevel
 * @returns {string}
 */
export const generateHint = ({ target, direction = 'to_ja', hintLevel = 1 }) => {
  if (!target) return '';

  if (direction === 'to_ja') {
    const kana = (target.hiragana || target.kanji || '').replace(/[()（）~～...]/g, '').trim();
    if (!kana) return '';

    if (hintLevel === 1) {
      const firstChar = kana.charAt(0);
      const remainingDots = ' _'.repeat(Math.max(0, kana.length - 1));
      return `Chữ cái đầu tiên: 「${firstChar}」${remainingDots} (${kana.length} ký tự)`;
    }

    // Hint level >= 2: Hiện 2 chữ đầu + Romaji của 2 ký tự đầu (tránh lộ cả từ)
    const prefix = kana.slice(0, 2);
    const suffix = kana.length > 2 ? '...' : '';
    const romajiHint = wanakana.toRomaji(prefix);
    return `Bắt đầu bằng: 「${prefix}${suffix}」 (Phiên âm: ${romajiHint}${suffix})`;
  }

  // Direction: to_vi
  const meaning = target.meaning || target.meaning_vi || '';
  if (!meaning) return '';

  if (hintLevel === 1) {
    return `Chữ cái đầu tiếng Việt: 「${meaning.charAt(0).toUpperCase()}...」 (${meaning.split(/\s+/).length} từ)`;
  }

  const firstWord = meaning.split(/[\s,;/]+/)[0] || '';
  return `Từ đầu tiên: 「${firstWord} ...」`;
};
