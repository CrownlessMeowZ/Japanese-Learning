import { useProgressStore } from '../../store/progressStore';

export const HIGHSCORE_STORAGE_KEY = 'nihongo_master_sakura_match_highscores';

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
    let hasCleaned = false;
    // Tự động làm sạch các giá trị lỗi cũ (như 999s hoặc 1s do đóng băng thời gian trước đó)
    Object.keys(parsed).forEach((k) => {
      if (parsed[k]?.bestTime >= 999 || parsed[k]?.bestTime === 1) {
        parsed[k].bestTime = null;
        hasCleaned = true;
      }
    });
    if (hasCleaned) {
      localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
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
        lastPlayed: new Date().toISOString().slice(0, 10),
      },
    };
    localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(updated));

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
  const shuffledPool = shuffleArray(pool.filter((v) => v.meaning || v.meaning_vi));
  const selectedVocab = shuffledPool.slice(0, pairsCount);

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
