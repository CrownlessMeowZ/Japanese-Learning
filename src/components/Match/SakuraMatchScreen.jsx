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

/**
 * Lưu Highscores vào LocalStorage
 */
function saveHighscoreToStorage(key, newScore, timeTaken, isClear = false) {
  try {
    const current = loadHighscoresFromStorage();
    const prev = current[key] || { highScore: 0, bestTime: null, gamesPlayed: 0 };

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
      [key]: {
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
export const SakuraMatchScreen = ({ initialLessonId = 1, onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState(initialLessonId);
  const [difficulty, setDifficulty] = useState('normal'); // 'easy' | 'normal' | 'hard'
  const [gameState, setGameState] = useState('playing'); // 'ready' | 'playing' | 'paused' | 'victory' | 'timeout'
  
  const currentConfig = DIFFICULTY_CONFIG[difficulty];

  // Lấy danh sách từ vựng theo bài học đã chọn
  const vocabPool = useMemo(() => {
    if (selectedLesson === 'all') {
      return Object.values(vocabularyData).flat();
    }
    return vocabularyData[String(selectedLesson)] || [];
  }, [selectedLesson]);

  const [cards, setCards] = useState(() => generateCardsFromPool(vocabPool, currentConfig.pairs));
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
  const handleSelectLesson = (lsId) => {
    setSelectedLesson(lsId);
    const newPool = lsId === 'all'
      ? Object.values(vocabularyData).flat()
      : (vocabularyData[String(lsId)] || []);
    initGame(newPool, currentConfig);
  };

  // Đổi độ khó
  const handleSelectDifficulty = (diffKey) => {
    setDifficulty(diffKey);
    const newCfg = DIFFICULTY_CONFIG[diffKey];
    initGame(vocabPool, newCfg);
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

          // Cập nhật số ván chơi và điểm số đã đạt được trước khi hết giờ vào bảng kỷ lục
          const lessonKey = String(selectedLesson);
          const currentScore = scoreRef.current;
          const { updated } = saveHighscoreToStorage(lessonKey, currentScore, null, false);
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
  }, [gameState, gameSessionId, selectedLesson, currentConfig.seconds]);

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

          // Lưu kỷ lục vào LocalStorage
          const lessonKey = String(selectedLesson);
          const { updated, isNewHighscore } = saveHighscoreToStorage(lessonKey, finalScore, actualTimeTaken, true);
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
  }, [gameState, matchedPairIds, selectedCardIds, cards, combo, currentConfig.pairs, secondsLeft, score, selectedLesson]);

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
  const currentLessonHighscore = highscores[lessonKey]?.highScore || 0;
  const isTimeUrgent = secondsLeft <= 10 && gameState === 'playing';

  return (
    <div className="match-container">
      {/* 1. THANH TRẠNG THÁI TRÊN ĐỈNH (HUD BAR) */}
      <div className="match-hud-bar">
        {/* Nút Quay lại Dashboard */}
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

        {/* Nút Bảng Vàng & Âm Thanh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsHighscoreModalOpen(true)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
              borderRadius: '12px',
              color: '#d97706',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Xem bảng vàng kỷ lục cá nhân"
          >
            <span>🏆</span>
            <span>Kỷ lục ({currentLessonHighscore}đ)</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            style={{
              padding: '6px 10px',
              backgroundColor: '#f1f5f9',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            title={isSoundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isSoundMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* 2. THANH CHỌN BÀI HỌC & ĐỘ KHÓ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px',
        padding: '8px 16px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #f1f5f9'
      }}>
        {/* Lựa chọn bài học */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#64748b' }}>
            Bài học:
          </span>
          <select
            value={selectedLesson}
            onChange={(e) => {
              const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
              handleSelectLesson(val);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontWeight: '700',
              fontSize: '0.86rem',
              color: '#1e293b',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">🌸 Toàn Bộ 15 Bài (Đại Chiến)</option>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
              <option key={`opt-ls-${num}`} value={num}>
                Bài {num} ({vocabularyData[String(num)]?.length || 0} từ)
              </option>
            ))}
          </select>
        </div>

        {/* Lựa chọn độ khó */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#64748b' }}>
            Chế độ:
          </span>
          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
            <button
              key={`diff-${key}`}
              type="button"
              onClick={() => handleSelectDifficulty(key)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: difficulty === key ? '1.5px solid #e91e8c' : '1px solid #cbd5e1',
                backgroundColor: difficulty === key ? '#fdf2f8' : '#ffffff',
                color: difficulty === key ? '#be185d' : '#64748b',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cfg.name}
            </button>
          ))}
        </div>

        {/* Nút Làm Mới Bàn Cờ */}
        <button
          type="button"
          onClick={() => initGame()}
          style={{
            padding: '6px 14px',
            backgroundColor: '#fce7f3',
            color: '#be185d',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🔄 Đổi bàn mới
        </button>
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
        onChangeLesson={() => setIsHighscoreModalOpen(true)}
        onOpenHighscores={() => setIsHighscoreModalOpen(true)}
        onBackToDashboard={onBack}
      />

      {/* 6. MODAL BẢNG VÀNG KỶ LỤC CÁ NHÂN */}
      <MatchHighscoreModal
        isOpen={isHighscoreModalOpen}
        onClose={() => setIsHighscoreModalOpen(false)}
        highscores={highscores}
        onSelectLesson={(lsId) => {
          handleSelectLesson(lsId);
        }}
      />
    </div>
  );
};
