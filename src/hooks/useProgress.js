import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useProgressStore, healMistakeVault } from '../store/progressStore';
import { getTodayDateString } from '../utils/srsAlgo';

/**
 * Chuẩn hóa danh sách các biến thể ID ngữ pháp để tương thích ngược (vd: L01_G01 <-> L01_G1 <-> grammar_L1_1)
 * @param {string|number} id
 * @returns {Array<string|number>}
 */
const getGrammarIdVariants = (id) => {
  if (typeof id !== 'string') return [id];
  const m = id.match(/^L(\d+)_G(\d+)$/i);
  if (m) {
    const lNum = parseInt(m[1], 10);
    const gNum = parseInt(m[2], 10);
    const canonical = `L${String(lNum).padStart(2, '0')}_G${String(gNum).padStart(2, '0')}`;
    const legacyPaddedL = `L${String(lNum).padStart(2, '0')}_G${gNum}`;
    const legacyRaw = `grammar_L${lNum}_${gNum}`;
    return [...new Set([canonical, id, legacyPaddedL, legacyRaw])];
  }
  const gm = id.match(/^grammar_L(\d+)_(\d+)$/i);
  if (gm) {
    const lNum = parseInt(gm[1], 10);
    const gNum = parseInt(gm[2], 10);
    const canonical = `L${String(lNum).padStart(2, '0')}_G${String(gNum).padStart(2, '0')}`;
    const legacyPaddedL = `L${String(lNum).padStart(2, '0')}_G${gNum}`;
    return [...new Set([canonical, id, legacyPaddedL])];
  }
  return [id];
};

/**
 * ⚡ Atomic Selectors - Chọn lọc nguyên tử cho từng thuộc tính
 * Triệt tiêu hoàn toàn re-render thừa thãi cho các component chỉ đọc 1 trường duy nhất
 */
export const useDailyStreak = () => useProgressStore((state) => state.daily_streak);
export const useBonsaiState = () => useProgressStore((state) => state.bonsai_state);
export const useLearnedItems = () => useProgressStore((state) => state.learned_items);
export const useKanjiLearned = () => useProgressStore((state) => state.kanji_learned || {});
export const useCurrentLesson = () => useProgressStore((state) => state.current_lesson);
export const useActivityHistory = () => useProgressStore((state) => state.activity_history || {});
export const useKaiwaScores = () => useProgressStore((state) => state.kaiwa_scores || {});
export const useKanaPractice = () => useProgressStore((state) => state.kana_practice || {});

/**
 * Hook chuyên biệt chỉ lấy Sổ tay điểm yếu (đã tự động phục hồi)
 */
export const useMistakeVault = () => {
  const raw = useProgressStore((state) => state.mistake_vault);
  return useMemo(() => healMistakeVault(raw), [raw]);
};

/**
 * Hook chuyên biệt chỉ chứa các hàm hành động (Actions Only)
 * Các hàm này có tham chiếu ổn định tuyệt đối, component gọi chúng KHÔNG BAO GIỜ bị re-render
 */
export const useProgressActions = () => {
  return useProgressStore(
    useShallow((state) => ({
      setCurrentLesson: state.setCurrentLesson,
      toggleLearnedItem: state.toggleLearnedItem,
      reviewItem: state.reviewItem,
      waterBonsai: state.waterBonsai,
      recordMistake: state.recordMistake,
      recordRescueSuccess: state.recordRescueSuccess,
      clearMistake: state.clearMistake,
      clearAllMistakes: state.clearAllMistakes,
      toggleKanjiLearned: state.toggleKanjiLearned,
      logActivity: state.logActivity,
      recordKaiwaScore: state.recordKaiwaScore,
      recordKanaPractice: state.recordKanaPractice,
      importAllData: state.importAllData,
      resetAllProgress: state.resetAllProgress,
    }))
  );
};

/**
 * Facade Hook: useProgress (Bảo toàn 100% tương thích ngược)
 * Sử dụng useShallow để so sánh nông các thuộc tính state, ngăn chặn re-render thừa
 */
export const useProgress = () => {
  const stateData = useProgressStore(
    useShallow((state) => ({
      currentLesson: state.current_lesson,
      dailyStreak: state.daily_streak,
      learnedItems: state.learned_items,
      bonsaiState: state.bonsai_state,
      rawMistakeVault: state.mistake_vault,
      kanjiLearned: state.kanji_learned || {},
      activityHistory: state.activity_history || {},
      kaiwaScores: state.kaiwa_scores || {},
      kanaPractice: state.kana_practice || {},
      setCurrentLesson: state.setCurrentLesson,
      toggleLearnedItem: state.toggleLearnedItem,
      reviewItem: state.reviewItem,
      waterBonsai: state.waterBonsai,
      recordMistake: state.recordMistake,
      recordRescueSuccess: state.recordRescueSuccess,
      clearMistake: state.clearMistake,
      clearAllMistakes: state.clearAllMistakes,
      toggleKanjiLearned: state.toggleKanjiLearned,
      logActivity: state.logActivity,
      recordKaiwaScore: state.recordKaiwaScore,
      recordKanaPractice: state.recordKanaPractice,
      importAllData: state.importAllData,
      resetAllProgress: state.resetAllProgress,
    }))
  );

  const {
    currentLesson,
    dailyStreak,
    learnedItems,
    bonsaiState,
    rawMistakeVault,
    kanjiLearned,
    activityHistory,
    kaiwaScores,
    kanaPractice,
    setCurrentLesson,
    toggleLearnedItem,
    reviewItem,
    waterBonsai,
    recordMistake,
    recordRescueSuccess,
    clearMistake,
    clearAllMistakes,
    toggleKanjiLearned,
    logActivity,
    recordKaiwaScore,
    recordKanaPractice,
    importAllData,
    resetAllProgress,
  } = stateData;

  const mistakeVault = useMemo(
    () => healMistakeVault(rawMistakeVault),
    [rawMistakeVault]
  );

  const markAsLearned = useCallback(
    (id, type = 'vocab') => {
      if (type === 'grammar') {
        const variants = getGrammarIdVariants(id);
        const existingKeys = variants.filter((k) => Boolean(learnedItems[k]));
        if (existingKeys.length > 0) {
          existingKeys.forEach((key) => toggleLearnedItem(key, type));
          return;
        }
        toggleLearnedItem(variants[0], type);
        return;
      }
      toggleLearnedItem(id, type);
    },
    [toggleLearnedItem, learnedItems]
  );

  const checkIsLearned = useCallback(
    (id) => {
      return getGrammarIdVariants(id).some((k) => Boolean(learnedItems[k]));
    },
    [learnedItems]
  );

  // Lọc các từ cần ôn tập hôm nay theo thuật toán SM-2 (chưa học hoặc nextReviewDate <= hôm nay)
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
          const record = getGrammarIdVariants(id).map((k) => learnedItems[k]).find(Boolean);
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

  // Tính tỷ lệ % hoàn thành và số từ đã thuộc trong bài học
  const getCompletionRate = useCallback(
    (lessonId, items = []) => {
      if (!items || items.length === 0) {
        return { percentage: 0, learnedCount: 0, totalCount: 0 };
      }

      const totalCount = items.length;
      let learnedCount = 0;

      for (let i = 0; i < totalCount; i++) {
        const item = items[i];
        const key = item.id || item.kanji || item.grammar_id || item.hiragana || `${lessonId}_${i}`;
        if (getGrammarIdVariants(key).some((k) => Boolean(learnedItems[k]))) {
          learnedCount++;
        }
      }

      const percentage = Math.round((learnedCount / totalCount) * 100);
      return { percentage, learnedCount, totalCount };
    },
    [learnedItems]
  );

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
