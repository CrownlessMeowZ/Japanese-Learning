import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateSM2, getTodayDateString, addDaysToDate } from '../utils/srsAlgo.js';
import { vocabularyData } from '../data/vocabulary.js';
import { grammarData } from '../data/grammar.js';
import { useSettingsStore } from './settingsStore.js';

export const SAKURA_HIGHSCORE_STORAGE_KEY = 'nihongo_master_sakura_match_highscores';
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isPlainObject = (val) => Boolean(val) && typeof val === 'object' && !Array.isArray(val);

const notifyHighscoresUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sakura-highscores-updated'));
  }
};

let dictionaryCache = null;

// Khởi tạo Map đánh chỉ mục từ vựng & ngữ pháp (O(1) lookup): Tối ưu tốc độ tra cứu và tự phục hồi ID
const getDictionaryCache = () => {
  if (!dictionaryCache) {
    dictionaryCache = new Map();

    // Index vocabulary (15 bài Dekiru Nihongo)
    if (vocabularyData && typeof vocabularyData === 'object') {
      for (const [lessonKey, words] of Object.entries(vocabularyData)) {
        if (Array.isArray(words)) {
          const lessonNum = parseInt(lessonKey, 10) || 1;
          for (const w of words) {
            const entry = {
              ...w,
              lessonId: w.lessonId || (w.lesson ? parseInt(w.lesson, 10) : lessonNum),
              type: 'vocab',
            };
            if (w.id) dictionaryCache.set(w.id, entry);
            if (w.kanji && !dictionaryCache.has(w.kanji)) dictionaryCache.set(w.kanji, entry);
            if (w.hiragana && !dictionaryCache.has(w.hiragana)) dictionaryCache.set(w.hiragana, entry);
          }
        }
      }
    }

    // Index grammar (các bài ngữ pháp)
    if (grammarData && typeof grammarData === 'object') {
      for (const [lessonKey, grammars] of Object.entries(grammarData)) {
        if (Array.isArray(grammars)) {
          const lessonNum = parseInt(lessonKey, 10) || 1;
          for (let i = 0; i < grammars.length; i++) {
            const g = grammars[i];
            const fallbackId = `grammar_L${lessonNum}_${i + 1}`;
            const legacyPaddedId = `L${String(lessonNum).padStart(2, '0')}_G${i + 1}`;
            const gId = g.id || fallbackId;
            const entry = {
              ...g,
              id: gId,
              text: g.title || g.structure || '',
              kanji: g.title || '',
              hiragana: '',
              meaning: g.titleVi || g.explanation || '',
              lessonId: lessonNum,
              type: 'grammar',
            };
            dictionaryCache.set(gId, entry);
            dictionaryCache.set(fallbackId, entry);
            dictionaryCache.set(legacyPaddedId, entry);
            if (g.id) dictionaryCache.set(g.id, entry);
            if (g.title && !dictionaryCache.has(g.title)) dictionaryCache.set(g.title, entry);
            if (g.structure && !dictionaryCache.has(g.structure)) dictionaryCache.set(g.structure, entry);
          }
        }
      }
    }
  }
  return dictionaryCache;
};

export const findDictionaryItem = (query) => {
  if (!query) return null;
  const cache = getDictionaryCache();
  if (typeof query === 'string') {
    return cache.get(query) || null;
  }
  if (typeof query === 'object') {
    if (query.id && cache.has(query.id)) return cache.get(query.id);
    if (query.kanji && cache.has(query.kanji)) return cache.get(query.kanji);
    if (query.hiragana && cache.has(query.hiragana)) return cache.get(query.hiragana);
    if (query.text && cache.has(query.text)) return cache.get(query.text);
  }
  return null;
};

/**
 * Factory Function & Schema Guard cho các mục trong Mistake Vault
 * Đảm bảo:
 * 1. Không bao giờ lưu chuỗi ID thô (như L01_G01, grammar_L1_1, L1_48) vào trường text hiển thị
 * 2. Đầy đủ các trường chuẩn: id, text, reading, meaning, lessonId, type, wrongCount, consecutiveCorrect, lastMistakeAt
 * 3. Tự động truy hồi từ điển O(1) để điền nghĩa/âm đọc nếu dữ liệu đầu vào bị thiếu
 * @param {Object|string} item Dữ liệu truyền vào (object hoặc rawId)
 * @param {Object|null} existing Bản ghi cũ trong vault (nếu đã từng làm sai trước đó)
 * @returns {Object|null} Bản ghi Mistake Vault chuẩn hóa
 */
export const createMistakeVaultEntry = (item, existing = null) => {
  if (!item) return null;
  const rawId = typeof item === 'string'
    ? item
    : (item.id || item.kanji || item.hiragana || item.character || item.text);
  if (!rawId) return null;

  // 1. Tra cứu qua Dictionary Cache
  const matched = findDictionaryItem(item) || findDictionaryItem(rawId);
  const id = (matched && matched.id) || (typeof item === 'object' && item.id) || rawId;

  // 2. Chốt chặn Schema chống ID thô (Schema Guard)
  const isRawIdentifier = (str) =>
    !str ||
    str === id ||
    /^L\d+(_[A-Z0-9]+|\d+)$/i.test(str) ||
    /^grammar_/i.test(str);

  let text = '';
  if (matched) {
    text = matched.kanji || matched.hiragana || matched.text || '';
  }
  if ((!text || isRawIdentifier(text)) && typeof item === 'object') {
    const candidate = item.kanji || item.character || item.title || item.text || item.hiragana;
    if (candidate && !isRawIdentifier(candidate)) {
      text = candidate;
    }
  }
  if (!text || isRawIdentifier(text)) {
    if (typeof item === 'object' && item.reading && !isRawIdentifier(item.reading)) {
      text = item.reading;
    } else if (matched && matched.meaning) {
      text = matched.meaning;
    } else {
      text = rawId;
    }
  }

  // 3. Chuẩn hóa reading
  const reading = (matched && (matched.hiragana || matched.reading)) ||
    (typeof item === 'object' && (item.hiragana || item.romaji || item.reading)) ||
    '';

  // 4. Chuẩn hóa meaning
  const meaning = (matched && (matched.meaning || matched.titleVi)) ||
    (typeof item === 'object' && (item.meaning || item.meaning_vi || item.vietnamese || item.explanation || item.titleVi)) ||
    '';

  // 5. Chuẩn hóa lessonId
  let lessonId = 1;
  if (matched && matched.lessonId) {
    lessonId = matched.lessonId;
  } else if (typeof item === 'object' && (item.lessonId || item.lesson)) {
    lessonId = parseInt(item.lessonId || item.lesson, 10) || 1;
  } else {
    const matchLesson = String(id).match(/^L(\d+)_/i);
    if (matchLesson) {
      lessonId = parseInt(matchLesson[1], 10) || 1;
    }
  }

  // 6. Chuẩn hóa type
  const type = (matched && matched.type) ||
    (typeof item === 'object' && item.type) ||
    'vocab';

  return {
    id,
    text,
    reading,
    meaning,
    lessonId,
    type,
    wrongCount: (existing?.wrongCount || 0) + 1,
    consecutiveCorrect: 0,
    lastMistakeAt: new Date().toISOString(),
  };
};

/**
 * Chuẩn hóa & hợp nhất các bản ghi trong Mistake Vault về đúng Canonical ID (tránh trùng key rawId vs entry.id)
 * Đồng thời tự động chữa lành nếu bị lưu nhầm mã ID (vd: L1_48) thay vì chữ Kanji/Hiragana
 * @param {Object} vault Đối tượng mistake_vault
 * @returns {Object} Mistake vault đã được chuẩn hóa và chữa lành thông tin
 */
export const healMistakeVault = (vault) => {
  if (!isPlainObject(vault)) return {};
  const healed = {};

  for (const [rawKey, item] of Object.entries(vault)) {
    if (!isPlainObject(item)) continue;

    const match =
      findDictionaryItem(item) ||
      findDictionaryItem(rawKey) ||
      (item.id ? findDictionaryItem(item.id) : null) ||
      (item.text ? findDictionaryItem(item.text) : null);

    const canonicalId = String((match && match.id) || item.id || rawKey);
    const isRawIdText =
      !item.text ||
      item.text === rawKey ||
      item.text === canonicalId ||
      /^L\d+(_[A-Z0-9]+|\d+)$/i.test(item.text) ||
      /^grammar_/i.test(item.text);
    const isMissingMeaning = !item.meaning;
    const isMissingReading = !item.reading && item.type !== 'grammar';

    let normalized = {
      ...item,
      id: canonicalId,
      wrongCount: Math.max(1, parseInt(item.wrongCount, 10) || 1),
      consecutiveCorrect: Math.max(0, parseInt(item.consecutiveCorrect, 10) || 0),
    };

    if (match && (isRawIdText || isMissingMeaning || isMissingReading)) {
      normalized = {
        ...normalized,
        text: isRawIdText ? (match.kanji || match.hiragana || match.text || item.text || canonicalId) : item.text,
        reading: item.reading || match.hiragana || match.reading || '',
        meaning: item.meaning || match.meaning || match.titleVi || '',
        lessonId: item.lessonId || match.lessonId || 1,
        type: item.type || match.type || 'vocab',
      };
    }

    if (healed[canonicalId]) {
      const prev = healed[canonicalId];
      const prevTime = Date.parse(prev.lastMistakeAt || '') || 0;
      const curTime = Date.parse(normalized.lastMistakeAt || '') || 0;
      const base = curTime >= prevTime ? normalized : prev;
      healed[canonicalId] = {
        ...base,
        id: canonicalId,
        text: base.text || prev.text || normalized.text,
        reading: base.reading || prev.reading || normalized.reading || '',
        meaning: base.meaning || prev.meaning || normalized.meaning || '',
        wrongCount: Math.max(prev.wrongCount || 1, normalized.wrongCount || 1),
        consecutiveCorrect: Math.min(prev.consecutiveCorrect ?? 0, normalized.consecutiveCorrect ?? 0),
        lastMistakeAt: curTime >= prevTime ? (normalized.lastMistakeAt || prev.lastMistakeAt) : (prev.lastMistakeAt || normalized.lastMistakeAt),
      };
    } else {
      healed[canonicalId] = normalized;
    }
  }

  return healed;
};

// Tính khoảng cách số ngày lịch địa phương giữa 2 mốc YYYY-MM-DD
const getCalendarDayDiff = (fromDateStr, toDateStr) => {
  if (!fromDateStr || !toDateStr) return Number.NaN;
  const from = new Date(`${fromDateStr}T00:00:00`);
  const to = new Date(`${toDateStr}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return Number.NaN;
  }
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
};

// Kiểm tra & đồng bộ chuỗi Streak theo ngày hiện tại: lỡ >= 1 ngày trọn vẹn (diffDays >= 2) -> reset count về 0
export const computeSyncedStreak = (dailyStreak, today = getTodayDateString()) => {
  if (!isPlainObject(dailyStreak)) {
    return { count: 0, lastActiveDate: null, bestStreak: 0 };
  }
  const count = Math.max(0, parseInt(dailyStreak.count, 10) || 0);
  const bestStreak = Math.max(count, parseInt(dailyStreak.bestStreak, 10) || 0);
  const lastActiveDate =
    typeof dailyStreak.lastActiveDate === 'string' && DATE_KEY_PATTERN.test(dailyStreak.lastActiveDate)
      ? dailyStreak.lastActiveDate
      : null;

  if (!lastActiveDate) {
    return { count: 0, lastActiveDate: null, bestStreak };
  }

  const diffDays = getCalendarDayDiff(lastActiveDate, today);
  if (Number.isNaN(diffDays) || diffDays >= 2) {
    return { count: 0, lastActiveDate, bestStreak };
  }

  return { count, lastActiveDate, bestStreak };
};

// Tính streak theo ngày lịch địa phương (diffDays): 1 ngày -> tăng chuỗi; cùng ngày -> giữ nguyên; >=2 ngày -> reset về 1
const calculateStreak = (lastDate, currentStreak) => {
  const today = getTodayDateString();
  if (!lastDate) return { count: 1, lastDate: today };

  if (lastDate === today) {
    return { count: Math.max(1, currentStreak || 0), lastDate: today };
  }

  const diffDays = getCalendarDayDiff(lastDate, today);

  if (diffDays === 1) {
    return { count: Math.max(0, currentStreak || 0) + 1, lastDate: today };
  }

  return { count: 1, lastDate: today };
};

/**
 * Chuẩn hóa bản ghi kỷ lục Sakura Match (dùng chung cho Backup/Restore và Match Utils)
 */
export const sanitizeSakuraHighscores = (raw) => {
  if (!isPlainObject(raw)) return {};
  const cleaned = {};
  for (const [key, val] of Object.entries(raw)) {
    if (!key || !isPlainObject(val)) continue;
    const rawBestTime = Number(val.bestTime);
    const validBestTime =
      typeof val.bestTime === 'number' &&
      Number.isFinite(rawBestTime) &&
      rawBestTime > 1 &&
      rawBestTime < 999
        ? Math.round(rawBestTime)
        : null;
    cleaned[key] = {
      highScore: Math.max(0, Math.round(Number(val.highScore) || 0)),
      bestTime: validBestTime,
      gamesPlayed: Math.max(0, Math.round(Number(val.gamesPlayed) || 0)),
      ...(typeof val.lastPlayed === 'string' && DATE_KEY_PATTERN.test(val.lastPlayed.slice(0, 10))
        ? { lastPlayed: val.lastPlayed.slice(0, 10) }
        : {}),
    };
  }
  return cleaned;
};

const RECOGNIZED_BACKUP_KEYS = [
  'learned_items',
  'kanji_learned',
  'mistake_vault',
  'daily_streak',
  'bonsai_state',
  'activity_history',
  'kaiwa_scores',
  'kana_practice',
  'sakura_match_highscores',
  'settings',
];

const OBJECT_BACKUP_SECTIONS = [
  'learned_items',
  'kanji_learned',
  'mistake_vault',
  'daily_streak',
  'bonsai_state',
  'activity_history',
  'kaiwa_scores',
  'kana_practice',
  'sakura_match_highscores',
  'settings',
];

/**
 * Schema Guard: Xác thực & làm sạch dữ liệu sao lưu JSON trước khi khôi phục vào Store
 * @param {unknown} raw Dữ liệu JSON parse từ file backup
 * @returns {{ valid: boolean, data?: Object, error?: string }}
 */
export const validateAndSanitizeBackup = (raw) => {
  if (!isPlainObject(raw)) {
    return { valid: false, error: 'File JSON không đúng cấu trúc đối tượng hợp lệ.' };
  }

  if (raw.appName !== undefined && raw.appName !== 'Nihongo Master') {
    return { valid: false, error: 'File sao lưu không thuộc ứng dụng Nihongo Master.' };
  }

  const hasKnownKey = RECOGNIZED_BACKUP_KEYS.some((key) =>
    Object.prototype.hasOwnProperty.call(raw, key)
  );
  if (!hasKnownKey) {
    return {
      valid: false,
      error: 'File JSON không chứa dữ liệu học tập hợp lệ của Nihongo Master.',
    };
  }

  for (const section of OBJECT_BACKUP_SECTIONS) {
    if (raw[section] !== undefined && !isPlainObject(raw[section])) {
      return {
        valid: false,
        error: `Trường dữ liệu "${section}" bị hỏng hoặc sai định dạng đối tượng.`,
      };
    }
  }

  const sanitized = {};

  if (raw.current_lesson !== undefined) {
    const lessonNum = parseInt(raw.current_lesson, 10);
    sanitized.current_lesson =
      Number.isFinite(lessonNum) && lessonNum >= 1 && lessonNum <= 15 ? lessonNum : 1;
  }

  if (raw.learned_items !== undefined) {
    const cleanedLearned = {};
    for (const [id, entry] of Object.entries(raw.learned_items)) {
      if (!id || !isPlainObject(entry)) continue;
      const ef = Number(entry.easinessFactor);
      cleanedLearned[id] = {
        ...entry,
        type: typeof entry.type === 'string' && entry.type ? entry.type : 'vocab',
        repetition: Math.max(0, Math.round(Number(entry.repetition) || 0)),
        interval: Math.max(0, Math.round(Number(entry.interval) || 0)),
        easinessFactor: Number.isFinite(ef) && ef >= 1.3 ? ef : 2.5,
      };
    }
    sanitized.learned_items = cleanedLearned;
  }

  if (raw.kanji_learned !== undefined) {
    const cleanedKanji = {};
    for (const [id, val] of Object.entries(raw.kanji_learned)) {
      if (!id || !val) continue;
      if (isPlainObject(val)) {
        cleanedKanji[id] = { ...val };
      } else if (val === true) {
        cleanedKanji[id] = { learnedAt: new Date().toISOString() };
      }
    }
    sanitized.kanji_learned = cleanedKanji;
  }

  if (raw.mistake_vault !== undefined) {
    sanitized.mistake_vault = healMistakeVault(raw.mistake_vault);
  }

  if (raw.daily_streak !== undefined) {
    sanitized.daily_streak = computeSyncedStreak(raw.daily_streak);
  }

  if (raw.bonsai_state !== undefined) {
    const lastWateredDate =
      typeof raw.bonsai_state.lastWateredDate === 'string' &&
      DATE_KEY_PATTERN.test(raw.bonsai_state.lastWateredDate)
        ? raw.bonsai_state.lastWateredDate
        : null;
    sanitized.bonsai_state = {
      lastWateredDate,
      waterCount: Math.max(0, parseInt(raw.bonsai_state.waterCount, 10) || 0),
    };
  }

  if (raw.activity_history !== undefined) {
    const cleanedHistory = {};
    for (const [dateKey, count] of Object.entries(raw.activity_history)) {
      const numeric = Number(count);
      if (DATE_KEY_PATTERN.test(dateKey) && Number.isFinite(numeric) && numeric > 0) {
        cleanedHistory[dateKey] = Math.round(numeric);
      }
    }
    sanitized.activity_history = cleanedHistory;
  }

  if (raw.kaiwa_scores !== undefined) {
    const cleanedKaiwa = {};
    for (const [id, score] of Object.entries(raw.kaiwa_scores)) {
      const numeric = Number(score);
      if (id && Number.isFinite(numeric)) {
        cleanedKaiwa[id] = Math.max(0, Math.min(100, Math.round(numeric)));
      }
    }
    sanitized.kaiwa_scores = cleanedKaiwa;
  }

  if (raw.kana_practice !== undefined) {
    sanitized.kana_practice = {
      totalPracticed: Math.max(0, parseInt(raw.kana_practice.totalPracticed, 10) || 0),
      correctAnswers: Math.max(0, parseInt(raw.kana_practice.correctAnswers, 10) || 0),
      lastPracticedAt:
        typeof raw.kana_practice.lastPracticedAt === 'string'
          ? raw.kana_practice.lastPracticedAt
          : null,
    };
  }

  if (raw.sakura_match_highscores !== undefined) {
    sanitized.sakura_match_highscores = sanitizeSakuraHighscores(raw.sakura_match_highscores);
  }

  if (raw.settings !== undefined) {
    sanitized.settings = {
      showFurigana:
        raw.settings.showFurigana !== undefined ? Boolean(raw.settings.showFurigana) : true,
    };
  }

  return { valid: true, data: sanitized };
};

export const useProgressStore = create(
  persist(
    (set, get) => ({
      learned_items: {},
      current_lesson: 1,
      daily_streak: {
        count: 0,
        lastActiveDate: null,
        bestStreak: 0,
      },

      // Vườn Bonsai Sakura (Sakura Habit Garden)
      bonsai_state: {
        lastWateredDate: null,
        waterCount: 0,
      },

      // Sổ tay điểm yếu / Hộp cứu hộ (Mistake Vault)
      mistake_vault: {},

      // Danh sách chữ Hán (Kanji) đã ghi nhớ
      kanji_learned: {},

      // Lịch sử hoạt động theo ngày (Activity History cho Heatmap 365 ngày: { [YYYY-MM-DD]: count })
      activity_history: {},

      // Điểm số luyện nói Kaiwa ({ [dialogueId]: highestScore })
      kaiwa_scores: {},

      // Thống kê luyện bảng chữ cái Kana
      kana_practice: {
        totalPracticed: 0,
        correctAnswers: 0,
        lastPracticedAt: null,
      },

      setCurrentLesson: (lessonId) => {
        const numericId = parseInt(lessonId, 10);
        if (numericId >= 1 && numericId <= 15) {
          set({ current_lesson: numericId });
        }
      },

      logActivity: (count = 1, dateStr = getTodayDateString()) => {
        const history = { ...(get().activity_history || {}) };
        history[dateStr] = (history[dateStr] || 0) + count;
        set({ activity_history: history });
      },

      recordKaiwaScore: (dialogueId, score) => {
        if (!dialogueId) return;
        const currentScores = { ...(get().kaiwa_scores || {}) };
        const existing = currentScores[dialogueId] || 0;
        if (score > existing) {
          currentScores[dialogueId] = score;
        }
        set({ kaiwa_scores: currentScores });
        get().logActivity(1);
        get().updateActivityStreak();
      },

      recordKanaPractice: (correctCount = 1, totalCount = 1) => {
        const current = get().kana_practice || { totalPracticed: 0, correctAnswers: 0 };
        set({
          kana_practice: {
            totalPracticed: (current.totalPracticed || 0) + totalCount,
            correctAnswers: (current.correctAnswers || 0) + correctCount,
            lastPracticedAt: new Date().toISOString(),
          },
        });
        get().logActivity(1);
        get().updateActivityStreak();
      },

      syncStreakWithToday: () => {
        const current = get().daily_streak;
        const synced = computeSyncedStreak(current);
        if (
          !current ||
          synced.count !== current.count ||
          synced.lastActiveDate !== current.lastActiveDate ||
          synced.bestStreak !== current.bestStreak
        ) {
          set({ daily_streak: synced });
        }
      },

      updateActivityStreak: () => {
        const { daily_streak } = get();
        const updated = calculateStreak(daily_streak?.lastActiveDate, daily_streak?.count || 0);
        set({
          daily_streak: {
            count: updated.count,
            lastActiveDate: updated.lastDate,
            bestStreak: Math.max(daily_streak?.bestStreak || 0, updated.count),
          },
        });

        // Đồng thời ghi nhận vào activity_history ngày hôm nay
        const today = getTodayDateString();
        const history = { ...(get().activity_history || {}) };
        if (!history[today]) {
          history[today] = 1;
          set({ activity_history: history });
        }
      },

      /**
       * Chăm sóc & Tưới nước cho cây Bonsai Sakura
       * @returns {boolean} true nếu tưới thành công, false nếu hôm nay đã tưới rồi
       */
      waterBonsai: () => {
        const today = getTodayDateString();
        const { bonsai_state } = get();

        if (bonsai_state?.lastWateredDate === today) {
          return false;
        }

        set({
          bonsai_state: {
            lastWateredDate: today,
            waterCount: ((bonsai_state && bonsai_state.waterCount) || 0) + 1,
          },
        });

        get().updateActivityStreak();
        return true;
      },

      /**
       * Ghi nhận một mục trả lời sai vào Sổ Tay Điểm Yếu (Mistake Vault)
       * Tự động tra cứu từ điển & chuẩn hóa Canonical ID để tránh trùng lặp key giữa rawId và entry.id
       * @param {Object|string} item Thông tin từ vựng / ngữ pháp hoặc mã ID
       */
      recordMistake: (item) => {
        if (!item) return;
        const vault = healMistakeVault(get().mistake_vault);
        const rawId =
          typeof item === 'string'
            ? item
            : item.id || item.kanji || item.hiragana || item.character || item.text;
        if (!rawId) return;

        const matched = findDictionaryItem(item) || findDictionaryItem(rawId);
        const canonicalTargetId =
          (matched && matched.id) || (typeof item === 'object' && item.id) || rawId;
        const existing = vault[canonicalTargetId] || vault[rawId] || null;

        const entry = createMistakeVaultEntry(item, existing);
        if (!entry) return;

        if (rawId !== entry.id) {
          delete vault[rawId];
        }
        if (canonicalTargetId !== entry.id) {
          delete vault[canonicalTargetId];
        }
        vault[entry.id] = entry;
        set({ mistake_vault: vault });
      },

      /**
       * Ghi nhận khi học viên ôn tập đúng một mục trong Hộp Cứu Hộ
       * Khi trả lời đúng liên tiếp đạt đủ số lần sai (wrongCount), từ đó được coi là Tốt Nghiệp và xóa khỏi Vault
       * @param {string|number} id ID của item
       * @returns {boolean} true nếu tốt nghiệp (đạt đủ số lần đúng bằng số lần sai), false nếu chưa
       */
      recordRescueSuccess: (id) => {
        if (!id) return false;
        const vault = healMistakeVault(get().mistake_vault);
        const matched = findDictionaryItem(id);
        const targetKey = vault[id]
          ? id
          : matched?.id && vault[matched.id]
            ? matched.id
            : null;
        if (!targetKey) return false;

        const existing = vault[targetKey];
        const targetCorrect = Math.max(1, existing.wrongCount || 1);
        const nextCorrect = (existing.consecutiveCorrect || 0) + 1;
        let isGraduated = false;

        if (nextCorrect >= targetCorrect) {
          delete vault[targetKey];
          if (id !== targetKey) delete vault[id];
          isGraduated = true;
        } else {
          vault[targetKey] = {
            ...existing,
            consecutiveCorrect: nextCorrect,
            lastReviewedAt: new Date().toISOString(),
          };
        }

        set({ mistake_vault: vault });
        get().updateActivityStreak();
        return isGraduated;
      },

      /**
       * Xóa thủ công 1 mục khỏi Hộp Cứu Hộ
       */
      clearMistake: (id) => {
        if (!id) return;
        const vault = healMistakeVault(get().mistake_vault);
        const matched = findDictionaryItem(id);
        delete vault[id];
        if (matched?.id && matched.id !== id) {
          delete vault[matched.id];
        }
        set({ mistake_vault: vault });
      },

      /**
       * Xóa sạch toàn bộ Hộp Cứu Hộ
       */
      clearAllMistakes: () => {
        set({ mistake_vault: {} });
      },

      /**
       * Đánh dấu đã học / chưa học nhanh (Toggle)
       */
      toggleLearnedItem: (id, type = 'vocab') => {
        if (!id) return;
        const currentItems = { ...get().learned_items };
        const exists = Boolean(currentItems[id]);

        if (exists) {
          delete currentItems[id];
        } else {
          currentItems[id] = {
            type,
            repetition: 0,
            interval: 0,
            easinessFactor: 2.5,
            nextReviewDate: getTodayDateString(),
            learnedAt: new Date().toISOString(),
          };
        }

        set({ learned_items: currentItems });

        if (!exists) {
          get().updateActivityStreak();
        }
      },

      /**
       * Đánh dấu đã nhớ / chưa nhớ một chữ Hán (Kanji)
       * @param {string} kanjiId ID chữ Hán (vd: 'k_1' hoặc chữ Kanji)
       */
      toggleKanjiLearned: (kanjiId) => {
        if (!kanjiId) return;
        const current = { ...(get().kanji_learned || {}) };
        const exists = Boolean(current[kanjiId]);

        if (exists) {
          delete current[kanjiId];
        } else {
          current[kanjiId] = {
            learnedAt: new Date().toISOString(),
          };
        }

        set({ kanji_learned: current });
        if (!exists) {
          get().updateActivityStreak();
        }
      },

      /**
       * Nhập toàn bộ dữ liệu sao lưu từ file JSON kèm Schema Guard (bao gồm Sakura Match & Settings)
       * @param {Object} importedData Dữ liệu backup JSON
       * @returns {boolean} true nếu import thành công
       */
      importAllData: (importedData) => {
        const check = validateAndSanitizeBackup(importedData);
        if (!check.valid) {
          return false;
        }

        const safe = check.data;
        const cur = get();

        set({
          learned_items: safe.learned_items ?? cur.learned_items ?? {},
          kanji_learned: safe.kanji_learned ?? cur.kanji_learned ?? {},
          mistake_vault: safe.mistake_vault ?? cur.mistake_vault ?? {},
          bonsai_state: safe.bonsai_state ?? cur.bonsai_state,
          daily_streak: safe.daily_streak ?? cur.daily_streak,
          current_lesson: safe.current_lesson ?? cur.current_lesson ?? 1,
          activity_history: safe.activity_history ?? cur.activity_history ?? {},
          kaiwa_scores: safe.kaiwa_scores ?? cur.kaiwa_scores ?? {},
          kana_practice: safe.kana_practice ?? cur.kana_practice,
        });

        if (safe.sakura_match_highscores !== undefined) {
          try {
            localStorage.setItem(
              SAKURA_HIGHSCORE_STORAGE_KEY,
              JSON.stringify(safe.sakura_match_highscores)
            );
            notifyHighscoresUpdated();
          } catch {
            // Bỏ qua nếu trình duyệt chặn storage
          }
        }

        if (safe.settings !== undefined) {
          useSettingsStore.getState().setFurigana(safe.settings.showFurigana);
        }

        return true;
      },

      /**
       * Đặt lại toàn bộ tiến độ học tập (bao gồm cả kỷ lục Sakura Match & cài đặt Furigana)
       */
      resetAllProgress: () => {
        set({
          learned_items: {},
          kanji_learned: {},
          current_lesson: 1,
          daily_streak: {
            count: 0,
            lastActiveDate: null,
            bestStreak: 0,
          },
          bonsai_state: {
            lastWateredDate: null,
            waterCount: 0,
          },
          mistake_vault: {},
          activity_history: {},
          kaiwa_scores: {},
          kana_practice: {
            totalPracticed: 0,
            correctAnswers: 0,
            lastPracticedAt: null,
          },
        });

        try {
          localStorage.removeItem(SAKURA_HIGHSCORE_STORAGE_KEY);
          localStorage.removeItem('sakura_match_highscores');
          notifyHighscoresUpdated();
        } catch {
          // Bỏ qua nếu môi trường không có localStorage
        }

        useSettingsStore.getState().setFurigana(true);
      },

      /**
       * Cập nhật tiến độ Spaced Repetition (SM-2) sau một phiên ôn tập
       * Tự động liên kết với Hộp Cứu Hộ khi trả lời sai (quality < 3) hoặc sửa đúng (quality >= 4)
       * @param {string|number} id ID của item (từ vựng / ngữ pháp)
       * @param {string} [type='vocab'] Loại item ('vocab' | 'grammar' | 'kaiwa')
       * @param {number} [quality=4] Điểm đánh giá độ nhớ (0-5)
       * @param {Object} [itemData=null] Dữ liệu đối tượng để lưu vào Mistake Vault nếu sai
       */
      reviewItem: (id, type = 'vocab', quality = 4, itemData = null) => {
        if (!id) return;
        const today = getTodayDateString();
        const currentItems = { ...get().learned_items };
        const existing = currentItems[id] || {
          type,
          repetition: 0,
          interval: 0,
          easinessFactor: 2.5,
          nextReviewDate: today,
          learnedAt: new Date().toISOString(),
        };

        // Tính toán thông số SM-2 mới
        const sm2 = calculateSM2(
          quality,
          existing.interval,
          existing.repetition,
          existing.easinessFactor
        );

        // Ngày ôn tập kế tiếp = Ngày hôm nay + interval (ngày)
        const nextReviewDate = addDaysToDate(today, sm2.interval);

        currentItems[id] = {
          ...existing,
          ...sm2,
          type: type || existing.type,
          nextReviewDate,
          lastReviewedAt: new Date().toISOString(),
        };

        set({ learned_items: currentItems });

        // Tự động ghi nhận vào Mistake Vault nếu học viên đánh giá "Chưa thuộc / Khó" (quality < 3)
        if (quality < 3) {
          get().recordMistake(itemData || id);
        } else if (quality >= 4) {
          get().recordRescueSuccess(id);
        }

        // Cập nhật streak học tập hàng ngày & ghi nhận activity
        get().logActivity(1);
        get().updateActivityStreak();
      },
    }),
    {
      name: 'nihongo_progress_storage_v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.mistake_vault = healMistakeVault(state.mistake_vault);
          state.daily_streak = computeSyncedStreak(state.daily_streak);
          if (!state.kanji_learned) {
            state.kanji_learned = {};
          }
          if (!state.activity_history) {
            state.activity_history = {};
          }
          if (!state.kaiwa_scores) {
            state.kaiwa_scores = {};
          }
          if (!state.kana_practice) {
            state.kana_practice = {
              totalPracticed: 0,
              correctAnswers: 0,
              lastPracticedAt: null,
            };
          }
        }
      },
    }
  )
);
