import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  getSelectedKanaItems,
  getAllRowIds,
  getSeionRowIds,
} from '../../data/kanaData';
import { KanaMatrixView } from './KanaMatrixView';
import { KanaQuizSetup } from './KanaQuizSetup';
import { KanaSpeedTyping } from './KanaSpeedTyping';
import { KanaQuizMultipleChoice } from './KanaQuizMultipleChoice';
import { KanaResultsModal } from './KanaResultsModal';
import { useProgressStore } from '../../store/progressStore';
import '../../styles/sakura.css';

/**
 * KanaScreen Component - Container điều phối Bảng Chữ Cái & Luyện Phản Xạ
 * Quản lý trạng thái tập trung và điều hướng qua các Dumb Components chuyên trách
 */
export const KanaScreen = ({ onBack }) => {
  // Main view: 'chart' | 'setup' | 'quiz' | 'results'
  const [activeTab, setActiveTab] = useState('chart');

  // Chart state
  const [chartScript, setChartScript] = useState('hiragana'); // 'hiragana' | 'katakana'

  // Quiz Setup state
  const [quizScript, setQuizScript] = useState('hiragana'); // 'hiragana' | 'katakana' | 'both'
  const [quizMode, setQuizMode] = useState('typing'); // 'typing' | 'choice'
  const [selectedRows, setSelectedRows] = useState(getSeionRowIds()); // Mặc định chọn 46 âm cơ bản

  // Active Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [isInputShaking, setIsInputShaking] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(null); // { correct: bool, text: string } | null
  const [stats, setStats] = useState({ correct: 0, wrong: 0, troubleItems: [] });
  const inputRef = useRef(null);
  const recordedQuizRef = useRef(false);

  // Ghi nhận thành tích luyện tập Kana vào Progress Store khi hoàn thành Quiz
  useEffect(() => {
    if (activeTab === 'quiz') {
      recordedQuizRef.current = false;
    } else if (activeTab === 'results' && !recordedQuizRef.current && quizQuestions.length > 0) {
      recordedQuizRef.current = true;
      try {
        useProgressStore.getState().recordKanaPractice(stats.correct, quizQuestions.length);
      } catch {
        // ignore
      }
    }
  }, [activeTab, quizQuestions.length, stats.correct]);

  // Phát âm chữ cái tiếng Nhật (Web Speech API)
  const speakKana = useCallback((character) => {
    if (!character || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(character);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Toggle chọn / bỏ chọn một hàng
  const toggleRow = useCallback((rowId) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      }
      return [...prev, rowId];
    });
  }, []);

  // Đổi bảng chữ cái và đồng bộ danh sách hàng hợp lệ
  const handleSetQuizScript = useCallback((newScript) => {
    setQuizScript(newScript);
    const validRowIds = new Set(getAllRowIds(newScript));
    setSelectedRows((prev) => {
      const filtered = prev.filter((id) => validRowIds.has(id));
      return filtered.length > 0 ? filtered : getSeionRowIds();
    });
  }, []);

  // Các action chọn nhanh
  const selectAllRows = useCallback(() => setSelectedRows(getAllRowIds(quizScript)), [quizScript]);
  const selectSeionOnly = useCallback(() => setSelectedRows(getSeionRowIds()), []);
  const clearAllRows = useCallback(() => setSelectedRows([]), []);

  // Bắt đầu làm bài Quiz
  const startQuiz = useCallback((customItems = null) => {
    let pool = customItems;
    if (!pool) {
      if (selectedRows.length === 0) {
        alert('Vui lòng chọn ít nhất một hàng chữ cái để bắt đầu kiểm tra!');
        return;
      }
      pool = getSelectedKanaItems(quizScript, selectedRows);
    }

    if (pool.length === 0) {
      alert('Không có ký tự nào được chọn!');
      return;
    }

    // Xáo trộn ngẫu nhiên và chuẩn bị sẵn 4 lựa chọn trắc nghiệm cho từng câu
    const allRomaji = Array.from(new Set(pool.map((q) => q.romaji)));
    const shuffled = [...pool].sort(() => Math.random() - 0.5).map((current) => {
      const wrongPool = allRomaji.filter((r) => r !== current.romaji);
      const wrongShuffled = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [current.romaji, ...wrongShuffled].sort(() => Math.random() - 0.5);
      return {
        ...current,
        choiceOptions: options,
      };
    });

    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setTypedInput('');
    setIsInputShaking(false);
    setShowAnswerFeedback(null);
    setStats({ correct: 0, wrong: 0, troubleItems: [] });
    setActiveTab('quiz');
  }, [quizScript, selectedRows]);

  // Lựa chọn trắc nghiệm cho câu hiện tại (trích xuất trực tiếp từ câu hỏi đã chuẩn bị)
  const currentQuestion = quizQuestions[currentIndex];
  const choiceOptions = currentQuestion?.choiceOptions || [];

  // Focus ô input khi ở chế độ gõ phím
  useEffect(() => {
    if (activeTab === 'quiz' && quizMode === 'typing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTab, currentIndex, quizMode]);

  // Chuyển sang câu tiếp theo hoặc kết thúc
  const advanceNextQuestion = useCallback(() => {
    setShowAnswerFeedback(null);
    setTypedInput('');
    setCurrentIndex((prev) => {
      if (prev + 1 < quizQuestions.length) {
        return prev + 1;
      }
      setActiveTab('results');
      return prev;
    });
  }, [quizQuestions.length]);

  // Xử lý khi người dùng trả lời đúng
  const handleCorrectAnswer = useCallback((item) => {
    speakKana(item.character);
    setShowAnswerFeedback({ correct: true, text: `Chính xác: ${item.romaji}` });
    setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));

    setTimeout(() => {
      advanceNextQuestion();
    }, 450);
  }, [speakKana, advanceNextQuestion]);

  // Xử lý khi người dùng trả lời sai hoặc không biết
  const handleWrongAnswer = useCallback((item, isSkip = false) => {
    setIsInputShaking(true);
    setTimeout(() => setIsInputShaking(false), 500);

    setStats((prev) => {
      const exists = prev.troubleItems.find((t) => t.character === item.character);
      const updatedTrouble = exists
        ? prev.troubleItems.map((t) =>
            t.character === item.character ? { ...t, count: t.count + 1 } : t
          )
        : [...prev.troubleItems, { ...item, count: 1 }];

      return {
        ...prev,
        wrong: prev.wrong + 1,
        troubleItems: updatedTrouble,
      };
    });

    if (isSkip) {
      setShowAnswerFeedback({
        correct: false,
        text: `Đáp án là: ${item.romaji}`,
      });
      speakKana(item.character);
      setTimeout(() => {
        advanceNextQuestion();
      }, 1000);
    }
  }, [speakKana, advanceNextQuestion]);

  // Lắng nghe gõ phím tự động (Speed Typing như Tofugu)
  const handleTypingChange = useCallback((e) => {
    const val = e.target.value.toLowerCase().trim();
    setTypedInput(val);

    const current = quizQuestions[currentIndex];
    if (!current) return;

    // Kiểm tra xem có khớp romaji chính hoặc các cách gõ thay thế (alts) không
    const isMatch =
      val === current.romaji.toLowerCase() ||
      (current.alts && current.alts.includes(val));

    if (isMatch) {
      handleCorrectAnswer(current);
    }
  }, [currentIndex, quizQuestions, handleCorrectAnswer]);

  // Khi bấm Enter trong ô gõ phím nếu chưa khớp
  const handleTypingKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const current = quizQuestions[currentIndex];
      if (!current) return;
      const isMatch =
        typedInput === current.romaji.toLowerCase() ||
        (current.alts && current.alts.includes(typedInput));
      if (!isMatch) {
        handleWrongAnswer(current, false);
      }
    }
  }, [currentIndex, quizQuestions, typedInput, handleWrongAnswer]);

  // Chọn đáp án trắc nghiệm
  const handleSelectChoice = useCallback((option) => {
    const current = quizQuestions[currentIndex];
    if (!current) return;

    if (option === current.romaji) {
      handleCorrectAnswer(current);
    } else {
      handleWrongAnswer(current, true);
    }
  }, [currentIndex, quizQuestions, handleCorrectAnswer, handleWrongAnswer]);

  // Ôn tập lại chỉ những chữ đã làm sai
  const retryTroubleKana = useCallback(() => {
    if (stats.troubleItems.length === 0) return;
    startQuiz(stats.troubleItems);
  }, [stats.troubleItems, startQuiz]);

  // Tổng số ký tự đã chọn
  const totalSelectedChars = useMemo(() => {
    return getSelectedKanaItems(quizScript, selectedRows).length;
  }, [quizScript, selectedRows]);

  return (
    <div style={styles.container}>
      {/* Top Bar Header */}
      <div style={styles.topBar}>
        {onBack && (
          <button type="button" style={styles.backBtn} onClick={onBack}>
            ⬅ Quay lại Dashboard
          </button>
        )}
        <div style={styles.headerTitleWrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={styles.pageTitle}>🔤 Bảng Chữ Cái & Luyện Phản Xạ</h1>
            <span style={styles.badgeEdTech}>Active Recall • Tofugu Mode</span>
          </div>
          <span style={styles.pageSubTitle}>
            Học chuẩn 104 âm Hiragana & Katakana • Luyện phản xạ gõ phím thần tốc & trắc nghiệm
          </span>
        </div>
      </div>

      {/* Main Switcher Navigation Tabs */}
      <div style={styles.tabNavRow}>
        <button
          type="button"
          className={`kana-nav-tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
          onClick={() => setActiveTab('chart')}
        >
          📖 Bảng Tra Cứu (Kana Chart)
        </button>
        <button
          type="button"
          className={`kana-nav-tab-btn ${
            activeTab === 'setup' || activeTab === 'quiz' || activeTab === 'results'
              ? 'active'
              : ''
          }`}
          onClick={() => setActiveTab('setup')}
        >
          🎯 Luyện Tập Phản Xạ (Kana Quiz)
        </button>
      </div>

      {/* TAB 1: BẢNG TRA CỨU TƯƠNG TÁC (KANA CHART) */}
      {activeTab === 'chart' && (
        <KanaMatrixView
          chartScript={chartScript}
          setChartScript={setChartScript}
          onLaunchQuiz={() => {
            setQuizScript(chartScript);
            setActiveTab('setup');
          }}
          onSpeakKana={speakKana}
        />
      )}

      {/* TAB 2: CẤU HÌNH BÀI KIỂM TRA (QUIZ SETUP) */}
      {activeTab === 'setup' && (
        <KanaQuizSetup
          quizScript={quizScript}
          setQuizScript={handleSetQuizScript}
          quizMode={quizMode}
          setQuizMode={setQuizMode}
          selectedRows={selectedRows}
          toggleRow={toggleRow}
          selectAllRows={selectAllRows}
          selectSeionOnly={selectSeionOnly}
          clearAllRows={clearAllRows}
          totalSelectedChars={totalSelectedChars}
          onStartQuiz={() => startQuiz()}
        />
      )}

      {/* TAB 3: MÀN HÌNH LÀM BÀI QUIZ (ACTIVE RECALL QUIZ) */}
      {activeTab === 'quiz' && currentQuestion && (
        <div style={styles.quizWrapper}>
          {/* Quiz Top Bar */}
          <div style={styles.quizHeaderRow}>
            <button
              type="button"
              style={styles.quizAbortBtn}
              onClick={() => setActiveTab('setup')}
            >
              ✕ Dừng bài kiểm tra
            </button>

            {/* Progress counter */}
            <div style={styles.quizProgressText}>
              Câu <strong>{currentIndex + 1}</strong> / {quizQuestions.length}
            </div>

            {/* Live Stats */}
            <div style={styles.quizLiveStats}>
              <span style={{ color: '#059669', fontWeight: '800' }}>✓ {stats.correct}</span>
              <span style={{ color: '#e11d48', fontWeight: '800' }}>✕ {stats.wrong}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Main Flashcard Center */}
          <div style={styles.quizCard}>
            <div style={styles.quizScriptBadge}>
              {currentQuestion.type === 'hiragana' ? '🌸 HIRAGANA' : '⚡ KATAKANA'} •{' '}
              {currentQuestion.rowName}
            </div>

            {/* Ký tự hiển thị to bản */}
            <div style={styles.bigCharacterDisplay}>
              {currentQuestion.character}
            </div>

            {/* Nút nghe phát âm */}
            <button
              type="button"
              style={styles.quizSpeakerBtn}
              onClick={() => speakKana(currentQuestion.character)}
              title="Nghe phát âm"
            >
              🔊 Nghe âm thanh
            </button>

            {/* CHẾ ĐỘ 1: GÕ PHÍM (SPEED TYPING - TOFUGU STYLE) */}
            {quizMode === 'typing' && (
              <KanaSpeedTyping
                inputRef={inputRef}
                typedInput={typedInput}
                isInputShaking={isInputShaking}
                onChange={handleTypingChange}
                onKeyDown={handleTypingKeyDown}
                onSkip={() => handleWrongAnswer(currentQuestion, true)}
              />
            )}

            {/* CHẾ ĐỘ 2: TRẮC NGHIỆM 4 ĐÁP ÁN (MULTIPLE CHOICE) */}
            {quizMode === 'choice' && (
              <KanaQuizMultipleChoice
                choiceOptions={choiceOptions}
                onSelectChoice={handleSelectChoice}
              />
            )}

            {/* Answer Feedback Banner */}
            {showAnswerFeedback && (
              <div
                style={{
                  ...styles.feedbackBanner,
                  backgroundColor: showAnswerFeedback.correct ? '#ecfdf5' : '#fff1f2',
                  color: showAnswerFeedback.correct ? '#065f46' : '#9f1239',
                  border: `1.5px solid ${showAnswerFeedback.correct ? '#a7f3d0' : '#fecdd3'}`,
                }}
              >
                {showAnswerFeedback.correct ? '✓ ' : '✕ '}
                {showAnswerFeedback.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BÁO CÁO KẾT QUẢ & ÔN TẬP CHỮ YẾU (RESULTS) */}
      {activeTab === 'results' && (
        <KanaResultsModal
          stats={stats}
          totalQuestions={quizQuestions.length}
          onSpeakKana={speakKana}
          onRetryTrouble={retryTroubleKana}
          onRestartQuiz={() => startQuiz()}
          onGoToSetup={() => setActiveTab('setup')}
          onGoToChart={() => setActiveTab('chart')}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '16px 16px 80px',
    position: 'relative',
    zIndex: 1,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: '8px 18px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.88rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
  },
  headerTitleWrap: {
    marginTop: '4px',
  },
  pageTitle: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#2d3748',
    margin: '0',
    letterSpacing: '-0.3px',
  },
  badgeEdTech: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: '#fdf2f8',
    color: '#db2777',
    border: '1px solid #fbcfe8',
  },
  pageSubTitle: {
    fontSize: '0.95rem',
    color: '#718096',
    display: 'block',
    marginTop: '4px',
  },
  tabNavRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  navTabBtn: {
    padding: '10px 22px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #e2e8f0',
    borderRadius: '18px',
    fontSize: '0.94rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  navTabBtnActive: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    borderColor: '#e91e8c',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
  },
  quizWrapper: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  quizHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  quizAbortBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e0',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#64748b',
    cursor: 'pointer',
  },
  quizProgressText: {
    fontSize: '0.92rem',
    color: '#475569',
  },
  quizLiveStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.92rem',
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '9999px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)',
    transition: 'width 0.25s ease',
  },
  quizCard: {
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    padding: '36px 24px',
    textAlign: 'center',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  quizScriptBadge: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#db2777',
    backgroundColor: '#fdf2f8',
    padding: '4px 12px',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  bigCharacterDisplay: {
    fontSize: '6.5rem',
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: '1.1',
    margin: '10px 0',
    userSelect: 'none',
  },
  quizSpeakerBtn: {
    backgroundColor: '#fff0f6',
    border: '1px solid #fce7f3',
    color: '#e91e8c',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '28px',
  },
  feedbackBanner: {
    marginTop: '20px',
    padding: '10px 20px',
    borderRadius: '16px',
    fontSize: '0.92rem',
    fontWeight: '700',
    animation: 'sakuraFadeOnly 0.2s ease',
  },
};
