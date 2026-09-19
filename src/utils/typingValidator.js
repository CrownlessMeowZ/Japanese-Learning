import * as wanakana from 'wanakana';
import { levenshteinDistance } from './stringUtils.js';

/**
 * Loại bỏ dấu tiếng Việt (Accents Removal)
 * Hỗ trợ người học có thể gõ "toi" hoặc "tôi" đều được chấp nhận hợp lệ
 * @param {string} str 
 * @returns {string}
 */
export const removeVietnameseAccents = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

/**
 * Làm sạch chuỗi cơ bản trước khi so khớp:
 * Loại bỏ khoảng trắng thừa, dấu câu, ngoặc đơn
 * @param {string} str 
 * @returns {string}
 */
export const cleanText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[\s。、！？!?・…「」『』（）()\-–—_~〜:;,.]/g, '')
    .trim()
    .toLowerCase();
};

/**
 * Trích xuất toàn bộ các dạng đáp án tiếng Nhật hợp lệ của một từ vựng
 * Bao gồm: Kanji, Hiragana, Katakana, Romaji (với/không tiền tố lịch sự お/ご)
 * @param {Object} target 
 * @returns {Set<string>} Tập hợp các chuỗi đáp án chuẩn hóa hợp lệ
 */
export const getValidJapaneseAnswers = (target) => {
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
      validSet.add(cleanText(hyphenated));
    } catch {
      // Bỏ qua nếu lỗi parse
    }
  });

  return validSet;
};

/**
 * Trích xuất danh sách các nghĩa tiếng Việt hợp lệ
 * Xử lý các từ đồng nghĩa cách nhau bằng dấu phẩy, gạch chéo (/), chấm phẩy
 * @param {Object} target 
 * @returns {{ accented: string[], unaccented: string[] }}
 */
export const getValidVietnameseAnswers = (target) => {
  if (!target) return { accented: [], unaccented: [] };

  const rawMeaning = target.meaning || target.meaning_vi || target.vietnamese || '';
  if (!rawMeaning) return { accented: [], unaccented: [] };

  // Tách nghĩa theo các ký tự phân cách thông dụng
  const parts = rawMeaning
    .split(/[,;/|\n]+/)
    .map((p) => p.replace(/\(.*?\)|（.*?）|[~～...]/g, '').trim())
    .filter(Boolean);

  const accented = [];
  const unaccented = [];

  parts.forEach((p) => {
    const low = p.toLowerCase();
    accented.push(low);
    unaccented.push(removeVietnameseAccents(low));

    // Thêm dạng bỏ chữ "người", "sự", "việc", "bị", "được" ở đầu nếu có
    const stripped = low.replace(/^(người|sự|việc|được|bị)\s+/i, '');
    if (stripped !== low) {
      accented.push(stripped);
      unaccented.push(removeVietnameseAccents(stripped));
    }
  });

  return {
    accented: [...new Set(accented)],
    unaccented: [...new Set(unaccented)]
  };
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
  const inputLower = rawInput.toLowerCase();
  const inputNoAccent = removeVietnameseAccents(inputLower);
  const expectedVi = target.meaning || target.meaning_vi || '';

  // 1. So khớp có dấu
  const directMatch = accented.some((ans) => ans === inputLower || ans.includes(inputLower) || inputLower.includes(ans));
  if (directMatch) {
    return {
      isCorrect: true,
      feedback: '✓ Chính xác hoàn hảo!',
      expectedAnswer: expectedVi,
      isFuzzyMatch: false
    };
  }

  // 2. So khớp không dấu (cho phép người học không bật gõ dấu tiếng Việt)
  const noAccentMatch = unaccented.some((ans) => ans === inputNoAccent || ans.includes(inputNoAccent) || inputNoAccent.includes(ans));
  if (noAccentMatch) {
    return {
      isCorrect: true,
      feedback: '✓ Đúng nghĩa tiếng Việt!',
      expectedAnswer: expectedVi,
      isFuzzyMatch: false
    };
  }

  // 3. So khớp Levenshtein trên tiếng Việt không dấu nếu độ dài >= 5 ký tự
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

    // Hint level >= 2: Hiện 2 chữ đầu + Romaji gợi ý
    const prefix = kana.slice(0, 2);
    const romajiHint = wanakana.toRomaji(kana);
    return `Bắt đầu bằng: 「${prefix}...」 (Phiên âm: ${romajiHint})`;
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
