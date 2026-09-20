import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { vocabularyData } from '../../data/vocabulary';
import { MatchCard } from './MatchCard';
import { MatchVictoryModal } from './MatchVictoryModal';
import { MatchHighscoreModal } from './MatchHighscoreModal';
import { soundEffects } from '../../utils/soundEffects';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import '../../styles/match.css';

const HIGHSCORE_STORAGE_KEY = 'nihongo_master_sakura_match_highscores';

const DIFFICULTY_CONFIG = {
  easy: { name: 'Khởi Động (4x3)', pairs: 6, seconds: 45, gridClass: 'match-grid-4x3' },
  normal: { name: 'Chuẩn Mực (4x4)', pairs: 8, seconds: 60, gridClass: 'match-grid-4x4' },
  hard: { name: 'Thần Tốc (5x4)', pairs: 10, seconds: 75, gridClass: 'match-grid-5x4' },
};

/**
 * Fisher-Yates Shuffle Algorithm (O(N))
 */
function shuffleArray(array) {
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
function loadHighscoresFromStorage() {
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

function getHighscoreItem(highscores, difficulty, key) {
  const compositeKey = `${difficulty}_${key}`;
  if (highscores[compositeKey]) return highscores[compositeKey];
  if (difficulty === 'normal' && highscores[key]) return highscores[key];
  return { highScore: 0, bestTime: null, gamesPlayed: 0 };
}

/**
 * Lưu Highscores vào LocalStorage theo từng chế độ khó
 */
function saveHighscoreToStorage(difficulty, key, newScore, timeTaken, isClear = false) {
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
    return { updated, isNewHighscore };
  } catch {
    return { updated: {}, isNewHighscore: false };
  }
}

/**
 * Tạo danh sách thẻ bài ngẫu nhiên từ kho từ vựng
 */
function generateCardsFromPool(pool, pairsCount) {
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

/**
 * SakuraMatchScreen Component - Bước 5: Đấu Phản Xạ Gamification Sakura Match
 */
export const SakuraMatchScreen = ({ initialLessonId = null, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState(initialLessonId);
  const [difficulty, setDifficulty] = useState('normal'); // 'easy' | 'normal' | 'hard'
  const [gameState, setGameState] = useState(() => (initialLessonId ? 'playing' : 'lobby'));
  
  const currentConfig = DIFFICULTY_CONFIG[difficulty];

  // Lấy danh sách từ vựng theo bài học đã chọn
  const vocabPool = useMemo(() => {
    if (!selectedLesson) return [];
    if (selectedLesson === 'all') {
      return Object.values(vocabularyData).flat();
    }
    return vocabularyData[String(selectedLesson)] || [];
  }, [selectedLesson]);

  const [cards, setCards] = useState(() => (
    initialLessonId
      ? generateCardsFromPool(
          initialLessonId === 'all'
            ? Object.values(vocabularyData).flat()
            : (vocabularyData[String(initialLessonId)] || []),
          currentConfig.pairs
        )
      : []
  ));
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [matchedPairIds, setMatchedPairIds] = useState(new Set());
  const [mismatchIds, setMismatchIds] = useState([]);
  
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => currentConfig.seconds);
  const [finalTimeTaken, setFinalTimeTaken] = useState(0);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isHighscoreModalOpen, setIsHighscoreModalOpen] = useState(false);
  const [highscores, setHighscores] = useState(() => loadHighscoresFromStorage());
  const [gameSessionId, setGameSessionId] = useState(0);

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const isCheckingRef = useRef(false);
  const { playAudio, stopAudio } = useAudioPlayer();

  // Khởi tạo bàn cờ mới
  const initGame = useCallback((targetPool = vocabPool, targetConfig = currentConfig) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isCheckingRef.current = false;
    startTimeRef.current = Date.now();
    scoreRef.current = 0;

    setCards(generateCardsFromPool(targetPool, targetConfig.pairs));
    setSelectedCardIds([]);
    setMatchedPairIds(new Set());
    setMismatchIds([]);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setSecondsLeft(targetConfig.seconds);
    setFinalTimeTaken(0);
    setIsNewRecord(false);
    setGameState('playing');
    setGameSessionId((prev) => prev + 1);
  }, [vocabPool, currentConfig]);

  // Đổi bài học
  const handleSelectLesson = (lsId, targetDiff = difficulty) => {
    setSelectedLesson(lsId);
    if (targetDiff !== difficulty) {
      setDifficulty(targetDiff);
    }
    const newCfg = DIFFICULTY_CONFIG[targetDiff] || currentConfig;
    const newPool = lsId === 'all'
      ? Object.values(vocabularyData).flat()
      : (vocabularyData[String(lsId)] || []);
    initGame(newPool, newCfg);
  };

  // Dọn dẹp âm thanh và timer khi rời component
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopAudio();
    };
  }, [stopAudio]);

  // Quản lý đồng hồ đếm ngược
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setGameState('timeout');
          setFinalTimeTaken(currentConfig.seconds);
          soundEffects.playMatchError();

          // Cập nhật số ván chơi và điểm số đã đạt được trước khi hết giờ vào bảng kỷ lục theo độ khó
          const lessonKey = String(selectedLesson);
          const currentScore = scoreRef.current;
          const { updated } = saveHighscoreToStorage(difficulty, lessonKey, currentScore, null, false);
          setHighscores(updated);
          return 0;
        }

        if (prev <= 6 && prev > 1) {
          soundEffects.playTick(prev <= 4);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, gameSessionId, selectedLesson, currentConfig.seconds, difficulty]);

  // Xử lý khi người chơi bấm chọn một thẻ
  const handleCardClick = useCallback((clickedCard) => {
    if (gameState !== 'playing' || isCheckingRef.current) return;
    if (matchedPairIds.has(clickedCard.pairId)) return;

    // Nếu bấm lại chính thẻ đang chọn -> bỏ chọn
    if (selectedCardIds.length === 1 && selectedCardIds[0] === clickedCard.id) {
      setSelectedCardIds([]);
      return;
    }

    // Chọn thẻ thứ nhất
    if (selectedCardIds.length === 0) {
      setSelectedCardIds([clickedCard.id]);
      return;
    }

    // Chọn thẻ thứ hai -> Bắt đầu so khớp
    if (selectedCardIds.length === 1) {
      const firstCardId = selectedCardIds[0];
      const firstCard = cards.find((c) => c.id === firstCardId);
      if (!firstCard) return;

      setSelectedCardIds([firstCardId, clickedCard.id]);
      isCheckingRef.current = true;

      // Kiểm tra xem có đúng cặp không (cùng pairId nhưng khác id)
      const isMatch = firstCard.pairId === clickedCard.pairId && firstCard.id !== clickedCard.id;

      if (isMatch) {
        // === GHÉP ĐÚNG ===
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setMaxCombo((prev) => Math.max(prev, nextCombo));

        // Tính điểm: Điểm cơ bản 100đ * hệ số combo
        const comboMultiplier = 1 + (nextCombo - 1) * 0.5;
        const pointsEarned = Math.round(100 * comboMultiplier);
        setScore((prev) => {
          const nextScore = prev + pointsEarned;
          scoreRef.current = nextScore;
          return nextScore;
        });

        soundEffects.playMatchSuccess(nextCombo);

        // Lưu thẻ đã ghép
        const nextMatched = new Set(matchedPairIds);
        nextMatched.add(firstCard.pairId);
        setMatchedPairIds(nextMatched);
        setSelectedCardIds([]);
        isCheckingRef.current = false;

        // KIỂM TRA ĐIỀU KIỆN CHIẾN THẮNG (DỌN SẠCH BÀN CỜ)
        if (nextMatched.size === currentConfig.pairs) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          soundEffects.playVictory();

          // Tính toán thời gian thực tế đã bỏ ra từ khi bắt đầu
          const actualTimeTaken = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
          setFinalTimeTaken(actualTimeTaken);

          // Thưởng điểm thời gian còn lại: mỗi giây còn lại = 30đ
          const timeBonus = Math.max(0, secondsLeft) * 30;
          const finalScore = score + pointsEarned + timeBonus;
          scoreRef.current = finalScore;

          setScore(finalScore);
          setGameState('victory');

          // Lưu kỷ lục vào LocalStorage theo độ khó
          const lessonKey = String(selectedLesson);
          const { updated, isNewHighscore } = saveHighscoreToStorage(difficulty, lessonKey, finalScore, actualTimeTaken, true);
          setHighscores(updated);
          setIsNewRecord(isNewHighscore);
        }
      } else {
        // === GHÉP SAI ===
        soundEffects.playMatchError();
        setCombo(0); // Reset chuỗi combo
        setMismatchIds([firstCardId, clickedCard.id]);

        // Sau 450ms tự động mở khóa và bỏ chọn thẻ để người chơi tiếp tục
        setTimeout(() => {
          setSelectedCardIds([]);
          setMismatchIds([]);
          isCheckingRef.current = false;
        }, 450);
      }
    }
  }, [gameState, matchedPairIds, selectedCardIds, cards, combo, currentConfig.pairs, secondsLeft, score, selectedLesson, difficulty]);

  // Bật/tắt âm thanh hiệu ứng & giọng đọc AI
  const toggleSound = () => {
    const nextVal = !isSoundMuted;
    setIsSoundMuted(nextVal);
    soundEffects.setEnabled(!nextVal);
    if (nextVal) {
      stopAudio();
    }
  };

  const lessonKey = String(selectedLesson);
  const currentLessonHighscore = getHighscoreItem(highscores, difficulty, lessonKey).highScore;
  const isTimeUrgent = secondsLeft <= 10 && gameState === 'playing';

  if (gameState === 'lobby') {
    return (
      <div className="match-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              color: '#475569',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⬅ Dashboard
          </button>

          <button
            type="button"
            onClick={() => setIsHighscoreModalOpen(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: '12px',
              color: '#d97706',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🏆 Bảng Vàng Kỷ Lục
          </button>
        </div>

        {/* Hero Intro */}
        <div style={{
          textAlign: 'center',
          padding: '24px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #fbcfe8',
          boxShadow: '0 4px 20px rgba(233, 30, 140, 0.08)',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '2.8rem', display: 'block', marginBottom: '8px' }}>🌸⚔️</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#be185d', margin: '0 0 8px' }}>
            Sakura Match - Đấu Phản Xạ Từ Vựng
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Hãy chọn bài học và độ khó bạn muốn chinh phục. Dọn sạch các cặp từ vựng trước khi hết giờ để ghi tên vào bảng vàng kỷ lục!
          </p>

          {/* Difficulty Selector in Lobby */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fdf2f8',
            padding: '6px 12px',
            borderRadius: '14px',
            border: '1px solid #fbcfe8',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#be185d' }}>
              Độ khó:
            </span>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
              <button
                key={`lobby-diff-${key}`}
                type="button"
                onClick={() => setDifficulty(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: difficulty === key ? '2px solid #e91e8c' : '1px solid #cbd5e1',
                  backgroundColor: difficulty === key ? '#ffffff' : '#f8fafc',
                  color: difficulty === key ? '#be185d' : '#64748b',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: difficulty === key ? '0 2px 8px rgba(233, 30, 140, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {cfg.name} ({cfg.seconds}s)
              </button>
            ))}
          </div>
        </div>

        {/* Special Banner: Đại Chiến Toàn Bộ 15 Bài */}
        <div style={{
          padding: '18px 20px',
          backgroundColor: '#fff0f6',
          borderRadius: '18px',
          border: '2px solid #f472b6',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>👑</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#be185d' }}>
                Đại Chiến Toàn Bộ 15 Bài
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
              Xáo trộn ngẫu nhiên từ vựng trong tất cả 15 bài học ({Object.values(vocabularyData).flat().length} từ)
              {getHighscoreItem(highscores, difficulty, 'all').highScore ? ` • Kỷ lục (${currentConfig.name}): ${getHighscoreItem(highscores, difficulty, 'all').highScore}đ` : ''}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectLesson('all')}
            style={{
              padding: '10px 24px',
              backgroundColor: '#e91e8c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
              transition: 'transform 0.15s ease'
            }}
          >
            ⚔️ Đấu Ngay
          </button>
        </div>

        {/* Grid 15 Lessons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '12px'
        }}>
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
            const vocabCount = vocabularyData[String(num)]?.length || 0;
            const hs = getHighscoreItem(highscores, difficulty, String(num));
            const hasScore = Boolean(hs?.highScore);

            return (
              <div
                key={`lobby-ls-${num}`}
                onClick={() => handleSelectLesson(num)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #f1f5f9',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#fdf2f8',
                    color: '#be185d',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    marginBottom: '8px'
                  }}>
                    Bài {num}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {vocabCount} từ vựng
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.76rem', color: hasScore ? '#ea580c' : '#94a3b8', fontWeight: '700' }}>
                    {hasScore ? `🏆 ${hs.highScore}đ` : 'Chưa đấu'}
                  </div>
                  <button
                    type="button"
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      padding: '6px 0',
                      backgroundColor: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    Chọn bài ➔
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highscore Modal in Lobby */}
        <MatchHighscoreModal
          isOpen={isHighscoreModalOpen}
          onClose={() => setIsHighscoreModalOpen(false)}
          highscores={highscores}
          initialDifficulty={difficulty}
          onSelectLesson={(lsId, targetDiff) => {
            handleSelectLesson(lsId, targetDiff || difficulty);
          }}
        />
      </div>
    );
  }

  return (
    <div className="match-container">
      {/* 1. THANH TRẠNG THÁI TRÊN ĐỈNH (HUD BAR) */}
      <div className="match-hud-bar">
        {/* Nút Quay lại Dashboard, Chọn bài khác & Huy hiệu bài học */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              color: '#475569',
              fontWeight: '700',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ⬅ Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              stopAudio();
              setGameState('lobby');
            }}
            style={{
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #fbcfe8',
              borderRadius: '12px',
              color: '#be185d',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Quay lại sảnh chọn bài học khác"
          >
            📋 Chọn bài khác
          </button>

          <span style={{
            fontSize: '0.82rem',
            fontWeight: '800',
            color: '#be185d',
            backgroundColor: '#fdf2f8',
            padding: '5px 12px',
            borderRadius: '10px',
            border: '1px solid #fbcfe8'
          }}>
            {selectedLesson === 'all' ? '🌸 Toàn Bộ 15 Bài' : `Bài ${selectedLesson}`} • {currentConfig.name}
          </span>
        </div>

        {/* Điểm số hiện tại */}
        <div className="match-stat-item">
          <span className="match-stat-label">Điểm số</span>
          <span className="match-stat-value" style={{ color: '#e91e8c' }}>
            {score}
          </span>
        </div>

        {/* Đồng hồ đếm ngược 60s */}
        <div className="match-stat-item">
          <span className="match-stat-label">Thời gian</span>
          <div className={`match-timer-badge ${isTimeUrgent ? 'match-timer-danger' : ''}`}>
            <span>⏱️</span>
            <span>{String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Tiến độ hoàn thành cặp thẻ */}
        <div className="match-stat-item">
          <span className="match-stat-label">Đã dọn</span>
          <span className="match-stat-value" style={{ color: '#0284c7' }}>
            {matchedPairIds.size}/{currentConfig.pairs}
          </span>
        </div>

        {/* Cột phải: Kỷ Lục + Âm Thanh (Hàng trên) & Đổi Bàn Mới (Hàng dưới) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '6px',
          minWidth: '150px'
        }}>
          {/* Hàng trên: Nút Kỷ lục & Loa */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setIsHighscoreModalOpen(true)}
              style={{
                flex: 1,
                padding: '4px 10px',
                backgroundColor: '#fffbeb',
                border: '1.5px solid #fde68a',
                borderRadius: '10px',
                color: '#d97706',
                fontWeight: '800',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
              title="Xem bảng vàng kỷ lục theo từng chế độ"
            >
              <span>🏆</span>
              <span>Kỷ lục ({currentLessonHighscore}đ)</span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              style={{
                padding: '4px 8px',
                backgroundColor: '#f1f5f9',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isSoundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isSoundMuted ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Hàng dưới: Nút Đổi bàn mới */}
          <button
            type="button"
            onClick={() => initGame()}
            style={{
              width: '100%',
              padding: '4px 10px',
              backgroundColor: '#fce7f3',
              color: '#be185d',
              border: '1px solid #fbcfe8',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
            title="Xáo trộn lại bộ thẻ từ vựng mới"
          >
            <span>🔄</span>
            <span>Đổi bàn mới</span>
          </button>
        </div>
      </div>

      {/* 3. COMBO BANNER NỔI BẬT NẾU CÓ CHUỖI LIÊN TIẾP */}
      <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
        {combo >= 2 && (
          <div className="match-combo-pill">
            <span>🔥</span>
            <span>COMBO x{combo}! ({1 + (combo - 1) * 0.5}x ĐIỂM)</span>
          </div>
        )}
      </div>

      {/* 4. BÀN CỜ LƯỚI THẺ TƯƠNG TÁC (MATCH GRID) */}
      <div className={`match-grid ${currentConfig.gridClass}`}>
        {cards.map((card) => {
          const isSelected = selectedCardIds.includes(card.id);
          const isMatched = matchedPairIds.has(card.pairId);
          const isMismatch = mismatchIds.includes(card.id);

          return (
            <MatchCard
              key={card.id}
              card={card}
              isSelected={isSelected}
              isMatched={isMatched}
              isMismatch={isMismatch}
              onClick={handleCardClick}
              onPlayAudio={isSoundMuted ? undefined : playAudio}
            />
          );
        })}
      </div>

      {/* 5. MODAL KẾT QUẢ (VICTORY / TIME OUT) */}
      <MatchVictoryModal
        isOpen={gameState === 'victory' || gameState === 'timeout'}
        isVictory={gameState === 'victory'}
        score={score}
        timeTaken={finalTimeTaken}
        remainingSeconds={secondsLeft}
        matchedPairsCount={matchedPairIds.size}
        totalPairsCount={currentConfig.pairs}
        maxCombo={maxCombo}
        isNewHighscore={isNewRecord}
        highscore={currentLessonHighscore}
        onPlayAgain={() => initGame()}
        onChangeLesson={() => setGameState('lobby')}
        onOpenHighscores={() => setIsHighscoreModalOpen(true)}
        onBackToDashboard={onBack}
      />

      {/* 6. MODAL BẢNG VÀNG KỶ LỤC CÁ NHÂN */}
      <MatchHighscoreModal
        isOpen={isHighscoreModalOpen}
        onClose={() => setIsHighscoreModalOpen(false)}
        highscores={highscores}
        initialDifficulty={difficulty}
        onSelectLesson={(lsId, targetDiff) => {
          handleSelectLesson(lsId, targetDiff || difficulty);
        }}
      />
    </div>
  );
};
