import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateSM2, getTodayDateString, addDaysToDate } from '../utils/srsAlgo';
import { vocabularyData } from '../data/vocabulary';
import { grammarData } from '../data/grammar';

let dictionaryCache = null;

export const getDictionaryCache = () => {
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
            const gId = g.id || `grammar_L${lessonNum}_${i + 1}`;
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
            if (g.title && !dictionaryCache.has(g.title)) dictionaryCache.set(g.title, entry);
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
 * Tự động chữa lành các bản ghi trong Mistake Vault nếu bị lưu nhầm mã ID (vd: L1_48) thay vì chữ Kanji/Hiragana
 * @param {Object} vault Đối tượng mistake_vault
 * @returns {Object} Mistake vault đã được chữa lành thông tin
 */
export const healMistakeVault = (vault) => {
  if (!vault || typeof vault !== 'object') return {};
  const healed = { ...vault };

  for (const [id, item] of Object.entries(healed)) {
    if (!item) continue;
    const isRawIdText = !item.text || item.text === id || /^L\d+_\d+$/i.test(item.text);
    const isMissingMeaning = !item.meaning;
    const isMissingReading = !item.reading && item.type !== 'grammar';

    if (isRawIdText || isMissingMeaning || isMissingReading) {
      const match = findDictionaryItem(id) || (item.text ? findDictionaryItem(item.text) : null);
      if (match) {
        healed[id] = {
          ...item,
          id: item.id || id,
          text: match.kanji || match.hiragana || match.text || item.text,
          reading: item.reading || match.hiragana || match.reading || '',
          meaning: item.meaning || match.meaning || match.titleVi || '',
          lessonId: item.lessonId || match.lessonId || 1,
          type: item.type || match.type || 'vocab',
        };
      }
    }
  }

  return healed;
};

const calculateStreak = (lastDate, currentStreak) => {
  const today = getTodayDateString();
  if (!lastDate) return { count: 1, lastDate: today };

  if (lastDate === today) {
    return { count: currentStreak, lastDate: today };
  }

  const last = new Date(`${lastDate}T00:00:00`);
  const now = new Date(`${today}T00:00:00`);
  const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { count: currentStreak + 1, lastDate: today };
  }

  return { count: 1, lastDate: today };
};

export const useProgressStore = create(
  persist(
    (set, get) => ({
      learned_items: {},
      current_lesson: 1,
      daily_streak: {
        count: 1,
        lastActiveDate: getTodayDateString(),
        bestStreak: 1,
      },

      // Vườn Bonsai Sakura (Sakura Habit Garden)
      bonsai_state: {
        lastWateredDate: null,
        waterCount: 0,
      },

      // Sổ tay điểm yếu / Hộp cứu hộ (Mistake Vault)
      mistake_vault: {},

      setCurrentLesson: (lessonId) => {
        const numericId = parseInt(lessonId, 10);
        if (numericId >= 1 && numericId <= 15) {
          set({ current_lesson: numericId });
        }
      },

      updateActivityStreak: () => {
        const { daily_streak } = get();
        const updated = calculateStreak(daily_streak.lastActiveDate, daily_streak.count);
        set({
          daily_streak: {
            count: updated.count,
            lastActiveDate: updated.lastDate,
            bestStreak: Math.max(daily_streak.bestStreak, updated.count),
          },
        });
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
       * Tự động tra cứu từ điển để trích xuất chữ Kanji/Hiragana & Nghĩa chuẩn (tuyệt đối không hiển thị mã ID như L1_48)
       * @param {Object|string} item Thông tin từ vựng / ngữ pháp hoặc mã ID
       */
      recordMistake: (item) => {
        if (!item) return;
        const rawId = typeof item === 'string' ? item : (item.id || item.kanji || item.hiragana || item.character || item.text);
        if (!rawId) return;

        // Tra cứu dictionary để lấy đầy đủ kanji, hiragana, meaning, lessonId
        const matched = findDictionaryItem(item) || findDictionaryItem(rawId);
        const id = (matched && matched.id) || (typeof item === 'object' && item.id) || rawId;

        // Xác định text hiển thị (Kanji/Hiragana/Cụm từ, tuyệt đối không dùng mã ID L1_48)
        let text = '';
        if (matched) {
          text = matched.kanji || matched.hiragana || matched.text || '';
        }
        if (!text && typeof item === 'object') {
          const candidate = item.kanji || item.character || item.title;
          if (candidate && !/^L\d+_\d+$/i.test(candidate)) {
            text = candidate;
          } else if (item.text && !/^L\d+_\d+$/i.test(item.text)) {
            text = item.text;
          }
        }
        if (!text) {
          text = (typeof item === 'object' && (item.hiragana || item.reading)) || rawId;
        }

        const reading = (matched && matched.hiragana) ||
          (typeof item === 'object' && (item.hiragana || item.romaji || item.reading)) ||
          '';

        const meaning = (matched && matched.meaning) ||
          (typeof item === 'object' && (item.meaning || item.meaning_vi || item.vietnamese || item.explanation)) ||
          '';

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

        const type = (matched && matched.type) ||
          (typeof item === 'object' && item.type) ||
          'vocab';

        const vault = healMistakeVault({ ...(get().mistake_vault || {}) });
        const existing = vault[id];

        vault[id] = {
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

        set({ mistake_vault: vault });
      },

      /**
       * Ghi nhận khi học viên ôn tập đúng một mục trong Hộp Cứu Hộ
       * Khi trả lời đúng liên tiếp >= 2 lần, từ đó được coi là Tốt Nghiệp và xóa khỏi Vault
       * @param {string|number} id ID của item
       * @returns {boolean} true nếu tốt nghiệp (đạt 2 lần đúng), false nếu chưa
       */
      recordRescueSuccess: (id) => {
        if (!id) return false;
        const vault = { ...(get().mistake_vault || {}) };
        const existing = vault[id];
        if (!existing) return false;

        const nextCorrect = (existing.consecutiveCorrect || 0) + 1;
        let isGraduated = false;

        if (nextCorrect >= 2) {
          delete vault[id];
          isGraduated = true;
        } else {
          vault[id] = {
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
        const vault = { ...(get().mistake_vault || {}) };
        delete vault[id];
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

        // Cập nhật streak học tập hàng ngày
        get().updateActivityStreak();
      },
    }),
    {
      name: 'nihongo_progress_storage_v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state && state.mistake_vault) {
          state.mistake_vault = healMistakeVault(state.mistake_vault);
        }
      },
    }
  )
);
