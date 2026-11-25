import {
  useProgressStore,
  SAKURA_HIGHSCORE_STORAGE_KEY,
  sanitizeSakuraHighscores,
} from '../../store/progressStore.js';
import { getTodayDateString } from '../../utils/srsAlgo.js';

export const HIGHSCORE_STORAGE_KEY = SAKURA_HIGHSCORE_STORAGE_KEY;

export const DIFFICULTY_CONFIG = {
  easy: { name: 'Khởi Động (4x3)', pairs: 6, seconds: 45, gridClass: 'match-grid-4x3' },
  normal: { name: 'Chuẩn Mực (4x4)', pairs: 8, seconds: 60, gridClass: 'match-grid-4x4' },
  hard: { name: 'Thần Tốc (5x4)', pairs: 10, seconds: 75, gridClass: 'match-grid-5x4' },
};

/**
 * Fisher-Yates Shuffle Algorithm (O(N))
 */
export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Lấy danh sách Highscores từ LocalStorage
 */
export function loadHighscoresFromStorage() {
  try {
    const raw = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const cleaned = sanitizeSakuraHighscores(parsed);
    if (JSON.stringify(cleaned) !== JSON.stringify(parsed)) {
      localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return {};
  }
}

export function getHighscoreItem(highscores, difficulty, key) {
  const compositeKey = `${difficulty}_${key}`;
  if (highscores[compositeKey]) return highscores[compositeKey];
  if (difficulty === 'normal' && highscores[key]) return highscores[key];
  return { highScore: 0, bestTime: null, gamesPlayed: 0 };
}

/**
 * Lưu Highscores vào LocalStorage theo từng chế độ khó
 */
export function saveHighscoreToStorage(difficulty, key, newScore, timeTaken, isClear = false) {
  try {
    const current = loadHighscoresFromStorage();
    const compositeKey = `${difficulty}_${key}`;
    const prev = current[compositeKey] || (difficulty === 'normal' ? current[key] : null) || { highScore: 0, bestTime: null, gamesPlayed: 0 };

    const isNewHighscore = newScore > (prev.highScore || 0);

    // Chỉ lưu thời gian phá đảo khi người chơi thực sự dọn sạch bàn cờ
    let updatedBestTime = prev.bestTime;
    if (isClear && timeTaken) {
      if (!prev.bestTime || prev.bestTime >= 999 || prev.bestTime <= 1) {
        updatedBestTime = timeTaken;
      } else {
        updatedBestTime = Math.min(timeTaken, prev.bestTime);
      }
    }

    const updated = {
      ...current,
      [compositeKey]: {
        highScore: Math.max(newScore, prev.highScore || 0),
        bestTime: updatedBestTime,
        gamesPlayed: (prev.gamesPlayed || 0) + 1,
        lastPlayed: getTodayDateString(),
      },
    };
    localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sakura-highscores-updated'));
    }

    // Ghi nhận hoạt động vào Heatmap & cập nhật Streak
    try {
      useProgressStore.getState().logActivity(1);
      useProgressStore.getState().updateActivityStreak();
    } catch {
      // ignore
    }

    return { updated, isNewHighscore };
  } catch {
    return { updated: {}, isNewHighscore: false };
  }
}

/**
 * Tạo danh sách thẻ bài ngẫu nhiên từ kho từ vựng
 */
export function generateCardsFromPool(pool, pairsCount) {
  const shuffledPool = shuffleArray(pool.filter((v) => v.meaning || v.meaning_vi || v.vietnamese));
  const selectedVocab = [];
  const usedIds = new Set();
  const usedMeanings = new Set();
  const usedJpTexts = new Set();

  const normalizeMeaning = (item) =>
    String(item.meaning || item.meaning_vi || item.vietnamese || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

  const normalizeJp = (item) =>
    String(item.kanji || item.hiragana || '').trim();

  // Khử trùng nghĩa tiếng Việt và mặt chữ tiếng Nhật trên cùng 1 bàn cờ
  for (const item of shuffledPool) {
    if (selectedVocab.length >= pairsCount) break;
    const viNorm = normalizeMeaning(item);
    const jpNorm = normalizeJp(item);
    if (!viNorm || !jpNorm) continue;
    if (usedMeanings.has(viNorm) || usedJpTexts.has(jpNorm)) continue;

    usedMeanings.add(viNorm);
    usedJpTexts.add(jpNorm);
    if (item.id) usedIds.add(item.id);
    selectedVocab.push(item);
  }

  // Fallback dự phòng nếu pool nhỏ có ít hơn pairsCount nghĩa phân biệt
  if (selectedVocab.length < pairsCount) {
    for (const item of shuffledPool) {
      if (selectedVocab.length >= pairsCount) break;
      if (item.id && usedIds.has(item.id)) continue;
      if (!item.id && selectedVocab.includes(item)) continue;
      if (item.id) usedIds.add(item.id);
      selectedVocab.push(item);
    }
  }

  const newCards = [];
  selectedVocab.forEach((item, index) => {
    const pairId = item.id || `pair-${index}`;
    const jpText = item.kanji || item.hiragana;
    const viText = item.meaning || item.meaning_vi || item.vietnamese;

    // Thẻ tiếng Nhật
    newCards.push({
      id: `${pairId}-jp`,
      pairId,
      type: 'jp',
      text: jpText,
      kanji: item.kanji,
      kana: item.hiragana,
      audio_url: item.audio_url,
    });

    // Thẻ tiếng Việt
    newCards.push({
      id: `${pairId}-vi`,
      pairId,
      type: 'vi',
      text: viText,
      kanji: item.kanji,
      kana: item.hiragana,
    });
  });

  return shuffleArray(newCards);
}
