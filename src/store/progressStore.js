import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateSM2, getTodayDateString, addDaysToDate } from '../utils/srsAlgo';

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
       * @param {string|number} id ID của item (từ vựng / ngữ pháp)
       * @param {string} [type='vocab'] Loại item ('vocab' | 'grammar' | 'kaiwa')
       * @param {number} [quality=4] Điểm đánh giá độ nhớ (0-5)
       */
      reviewItem: (id, type = 'vocab', quality = 4) => {
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

        // Cập nhật streak học tập hàng ngày
        get().updateActivityStreak();
      },
    }),
    {
      name: 'nihongo_progress_storage_v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
