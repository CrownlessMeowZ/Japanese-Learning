import { useCallback, useMemo } from 'react';
import { useProgressStore, healMistakeVault } from '../store/progressStore';
import { getTodayDateString } from '../utils/srsAlgo';

export const useProgress = () => {
  const learnedItems = useProgressStore((state) => state.learned_items);
  const currentLesson = useProgressStore((state) => state.current_lesson);
  const dailyStreak = useProgressStore((state) => state.daily_streak);

  const setCurrentLesson = useProgressStore((state) => state.setCurrentLesson);
  const toggleLearnedItem = useProgressStore((state) => state.toggleLearnedItem);
  const reviewItem = useProgressStore((state) => state.reviewItem);

  const markAsLearned = useCallback(
    (id, type = 'vocab') => {
      toggleLearnedItem(id, type);
    },
    [toggleLearnedItem]
  );

  const checkIsLearned = useCallback(
    (id) => {
      return Boolean(learnedItems[id]);
    },
    [learnedItems]
  );

  /**
   * Lọc và trả về danh sách các ID đã đến hạn ôn tập (nextReviewDate <= hôm nay) hoặc chưa từng học
   * @param {string|number} lessonId ID bài học (phục vụ context hoặc filter)
   * @param {Array<string|number|object>} lessonItemIds Danh sách ID hoặc object có .id
   * @returns {Array<string|number>} Danh sách các ID cần ôn tập
   */
  const getDueItems = useCallback(
    (lessonId, lessonItemIds = []) => {
      const today = getTodayDateString();
      if (!Array.isArray(lessonItemIds) || lessonItemIds.length === 0) {
        return [];
      }

      return lessonItemIds
        .map((item) =>
          typeof item === 'object' && item !== null
            ? item.id || item.kanji || item.grammar_id
            : item
        )
        .filter((id) => {
          if (!id) return false;
          const record = learnedItems[id];
          // Chưa từng học -> đến lượt học
          if (!record) return true;
          // Đã học -> kiểm tra xem đã đến hạn ôn tập chưa
          if (!record.nextReviewDate || record.nextReviewDate <= today) {
            return true;
          }
          return false;
        });
    },
    [learnedItems]
  );

  const getCompletionRate = useCallback(
    (lessonId, items = []) => {
      if (!items || items.length === 0) {
        return { percentage: 0, learnedCount: 0, totalCount: 0 };
      }

      const totalCount = items.length;
      let learnedCount = 0;

      for (let i = 0; i < totalCount; i++) {
        const item = items[i];
        const key = item.id || item.kanji || item.hiragana || `${lessonId}_${i}`;
        if (learnedItems[key]) {
          learnedCount++;
        }
      }

      const percentage = Math.round((learnedCount / totalCount) * 100);
      return { percentage, learnedCount, totalCount };
    },
    [learnedItems]
  );

  const bonsaiState = useProgressStore((state) => state.bonsai_state);
  const rawMistakeVault = useProgressStore((state) => state.mistake_vault);
  const mistakeVault = useMemo(() => healMistakeVault(rawMistakeVault), [rawMistakeVault]);
  const kanjiLearned = useProgressStore((state) => state.kanji_learned || {});
  const activityHistory = useProgressStore((state) => state.activity_history || {});
  const kaiwaScores = useProgressStore((state) => state.kaiwa_scores || {});
  const kanaPractice = useProgressStore((state) => state.kana_practice || {});
  const waterBonsai = useProgressStore((state) => state.waterBonsai);
  const recordMistake = useProgressStore((state) => state.recordMistake);
  const recordRescueSuccess = useProgressStore((state) => state.recordRescueSuccess);
  const clearMistake = useProgressStore((state) => state.clearMistake);
  const clearAllMistakes = useProgressStore((state) => state.clearAllMistakes);
  const toggleKanjiLearned = useProgressStore((state) => state.toggleKanjiLearned);
  const logActivity = useProgressStore((state) => state.logActivity);
  const recordKaiwaScore = useProgressStore((state) => state.recordKaiwaScore);
  const recordKanaPractice = useProgressStore((state) => state.recordKanaPractice);
  const importAllData = useProgressStore((state) => state.importAllData);
  const resetAllProgress = useProgressStore((state) => state.resetAllProgress);

  const checkIsKanjiLearned = useCallback(
    (id) => Boolean(kanjiLearned[id]),
    [kanjiLearned]
  );

  return {
    currentLesson,
    dailyStreak,
    learnedItems,
    bonsaiState,
    mistakeVault,
    kanjiLearned,
    activityHistory,
    kaiwaScores,
    kanaPractice,
    setCurrentLesson,
    markAsLearned,
    checkIsLearned,
    checkIsKanjiLearned,
    toggleKanjiLearned,
    reviewItem,
    getDueItems,
    getCompletionRate,
    waterBonsai,
    recordMistake,
    recordRescueSuccess,
    clearMistake,
    clearAllMistakes,
    logActivity,
    recordKaiwaScore,
    recordKanaPractice,
    importAllData,
    resetAllProgress,
  };
};
