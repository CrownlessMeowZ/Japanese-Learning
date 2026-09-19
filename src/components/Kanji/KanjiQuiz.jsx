import React, { useState, useMemo, useCallback } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import '../../styles/sakura.css';

/**
 * Thuật toán Fisher-Yates shuffle an toàn
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * KanjiQuiz Component - Đấu Trường Trắc Nghiệm Hán Tự N5
 * Hỗ trợ 3 chế độ:
 * 1. Chữ Hán ➔ Âm Hán-Việt & Nghĩa
 * 2. Âm Hán-Việt & Nghĩa ➔ Chữ Hán
 * 3. Chữ Hán ➔ Cách đọc (Onyomi / Kunyomi)
 */
export const KanjiQuiz = ({
  kanjiList = [],
  learnedMap = {},
  onMarkLearned,
  onBackToGrid,
}) => {
  const { playAudio } = useAudioPlayer();

  // Quiz configuration state
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [questionType, setQuestionType] = useState('kanji_to_hanviet');
  const [questionCount, setQuestionCount] = useState(10);

  // Active play state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missedKanji, setMissedKanji] = useState([]);

  // Danh sách các bài học có Hán tự
  const availableLessons = useMemo(() => {
    const set = new Set(kanjiList.map((k) => k.lessonId).filter(Boolean));
    return ['all', ...Array.from(set).sort((a, b) => a - b)];
  }, [kanjiList]);

  // Bộ Hán tự theo bài lọc hoặc chỉ chữ chưa thuộc
  const targetPool = useMemo(() => {
    if (selectedLesson === 'unlearned') {
      return kanjiList.filter((k) => !learnedMap[k.id || k.character]);
    }
    if (selectedLesson === 'all') return kanjiList;
    return kanjiList.filter((k) => k.lessonId === Number(selectedLesson));
  }, [kanjiList, selectedLesson, learnedMap]);

  /**
   * Khởi tạo ngân hàng câu hỏi trắc nghiệm
   */
  const startQuiz = useCallback((customPool = null) => {
    const pool = customPool || targetPool;
    if (!pool || pool.length < 4) return;

    const shuffled = shuffleArray(pool);
    const count = questionCount === 'all' ? shuffled.length : Math.min(Number(questionCount), shuffled.length);
    const selectedTargets = shuffled.slice(0, count);

    const generated = selectedTargets.map((target) => {
      // Chọn 3 phương án gây nhiễu (distractors) khác với target
      const otherCandidates = pool.filter((k) => k.character !== target.character);
      const distractors = shuffleArray(otherCandidates).slice(0, 3);

      let questionText = '';
      let subPrompt = '';
      let correctAnswer = '';
      let options = [];

      if (questionType === 'kanji_to_hanviet') {
        questionText = target.character;
        subPrompt = 'Chọn Âm Hán-Việt và Nghĩa tương ứng';
        correctAnswer = `${target.hanViet} (${target.meaning})`;
        options = shuffleArray([
          correctAnswer,
          ...distractors.map((d) => `${d.hanViet} (${d.meaning})`),
        ]);
      } else if (questionType === 'hanviet_to_kanji') {
        questionText = `${target.hanViet}`;
        subPrompt = `Ý nghĩa: "${target.meaning}" — Chọn Chữ Hán đúng`;
        correctAnswer = target.character;
        options = shuffleArray([
          correctAnswer,
          ...distractors.map((d) => d.character),
        ]);
      } else {
        // kanji_to_reading
        questionText = target.character;
        subPrompt = `Âm Hán: ${target.hanViet} — Chọn cách đọc đúng`;
        const kunStr = (target.kunyomi || []).join(' / ') || '—';
        const onStr = (target.onyomi || []).join(' / ') || '—';
        correctAnswer = `Kun: ${kunStr} | On: ${onStr}`;
        options = shuffleArray([
          correctAnswer,
          ...distractors.map((d) => {
            const dKun = (d.kunyomi || []).join(' / ') || '—';
            const dOn = (d.onyomi || []).join(' / ') || '—';
            return `Kun: ${dKun} | On: ${dOn}`;
          }),
        ]);
      }

      return {
        target,
        questionText,
        subPrompt,
        correctAnswer,
        options,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMissedKanji([]);
    setQuizState('playing');
  }, [targetPool, questionCount, questionType]);

  const currentQ = questions[currentIndex];

  /**
   * Xử lý khi người dùng chọn đáp án
   */
  const handleSelectOption = (opt) => {
    if (isAnswered) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      // Phát âm âm thanh mẫu của chữ Hán
      const audioTarget = currentQ.target?.kunyomi?.[0]?.replace(/\./g, '') ||
                          currentQ.target?.character ||
                          currentQ.target?.examples?.[0]?.word || '';
      if (audioTarget) {
        playAudio(audioTarget);
      }

      // Đánh dấu đã thuộc nếu có hàm callback
      if (onMarkLearned && currentQ.target?.id) {
        onMarkLearned(currentQ.target.id);
      }
    } else {
      setStreak(0);
      setMissedKanji((prev) => {
        if (prev.some((k) => k.character === currentQ.target.character)) return prev;
        return [...prev, currentQ.target];
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizState('result');
    }
  };

  // =========================================================
  // VIEW: SETUP SCREEN
  // =========================================================
  if (quizState === 'setup') {
    return (
      <div style={styles.setupCard}>
        <div style={styles.setupHeader}>
          <h2 style={{ margin: '0 0 8px', color: '#1a202c', fontSize: '1.6rem', fontWeight: '800' }}>
            🎯 Thiết Lập Đấu Trường Kanji Quiz
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.95rem' }}>
            Rèn luyện khả năng nhận diện 80 Hán tự N5 qua phản xạ đa chiều.
          </p>
        </div>

        {/* 1. Chọn phạm vi bài học */}
        <div style={styles.setupSection}>
          <label style={styles.setupLabel}>📚 Chọn phạm vi bài học:</label>
          <div style={styles.chipRow}>
            {availableLessons.map((les) => (
              <button
                key={les}
                type="button"
                onClick={() => setSelectedLesson(les)}
                className={`kanji-quiz-chip ${selectedLesson === les ? 'active' : ''}`}
              >
                {les === 'all' ? 'Toàn bộ 80 chữ Hán' : `Bài ${les}`}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedLesson('unlearned')}
              className={`kanji-quiz-chip ${selectedLesson === 'unlearned' ? 'active' : ''}`}
            >
              ⚠️ Chỉ chữ chưa thuộc ({kanjiList.filter((k) => !learnedMap[k.id || k.character]).length})
            </button>
          </div>
        </div>

        {/* 2. Chọn dạng câu hỏi */}
        <div style={styles.setupSection}>
          <label style={styles.setupLabel}>🔤 Dạng bài tập:</label>
          <div style={styles.modeGrid}>
            <div
              className={`kanji-mode-card ${questionType === 'kanji_to_hanviet' ? 'active' : ''}`}
              onClick={() => setQuestionType('kanji_to_hanviet')}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🈸 ➔ 🇻🇳</div>
              <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>
                Nhìn Chữ Hán ➔ Chọn Âm Hán Việt
              </div>
              <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>
                Ví dụ: <strong>日</strong> ➔ Chọn <strong>NHẬT (Mặt trời, ngày)</strong>
              </div>
            </div>

            <div
              className={`kanji-mode-card ${questionType === 'hanviet_to_kanji' ? 'active' : ''}`}
              onClick={() => setQuestionType('hanviet_to_kanji')}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🇻🇳 ➔ 🈸</div>
              <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>
                Nhìn Âm Hán Việt ➔ Chọn Chữ Hán
              </div>
              <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>
                Ví dụ: <strong>HỌC</strong> ➔ Chọn <strong>学</strong>
              </div>
            </div>

            <div
              className={`kanji-mode-card ${questionType === 'kanji_to_reading' ? 'active' : ''}`}
              onClick={() => setQuestionType('kanji_to_reading')}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🈸 ➔ 🇯🇵</div>
              <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>
                Nhìn Chữ Hán ➔ Chọn Cách Đọc (On/Kun)
              </div>
              <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>
                Ví dụ: <strong>人</strong> ➔ Chọn <strong>Kun: ひと | On: ジン</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Chọn số lượng câu hỏi */}
        <div style={styles.setupSection}>
          <label style={styles.setupLabel}>🔢 Số lượng câu hỏi:</label>
          <div style={styles.chipRow}>
            {[10, 20, 30, 'all'].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setQuestionCount(cnt)}
                className={`kanji-quiz-chip ${questionCount === cnt ? 'active' : ''}`}
              >
                {cnt === 'all' ? `Tất cả (${targetPool.length} câu)` : `${cnt} câu`}
              </button>
            ))}
          </div>
        </div>

        {/* Nút Bắt đầu */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
          <button
            type="button"
            className="kanji-action-btn"
            style={styles.cancelBtn}
            onClick={onBackToGrid}
          >
            ⬅ Xem Bảng Chữ Hán
          </button>
          <button
            type="button"
            className="kanji-action-btn"
            style={styles.startBtn}
            onClick={() => startQuiz()}
            disabled={targetPool.length < 4}
          >
            🚀 Bắt Đầu Đấu Trường ({targetPool.length} chữ khả dụng)
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW: PLAYING SCREEN
  // =========================================================
  if (quizState === 'playing' && currentQ) {
    const isCorrect = selectedOption === currentQ.correctAnswer;

    return (
      <div style={styles.playingCard}>
        {/* Progress Bar & Header */}
        <div style={styles.playHeader}>
          <button
            type="button"
            style={styles.quitBtn}
            onClick={() => setQuizState('setup')}
          >
            ✕ Dừng lại
          </button>

          <div style={styles.progressContainer}>
            <div style={styles.progressText}>
              Câu <strong>{currentIndex + 1}</strong> / {questions.length}
            </div>
            <div style={styles.progressBarTrack}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div style={styles.scorePill}>
            <span>🏆 Điểm: {score}</span>
            {streak > 1 && <span style={styles.streakFlame}>🔥 x{streak}</span>}
          </div>
        </div>

        {/* Question Area */}
        <div style={styles.questionBox}>
          <div style={styles.subPromptText}>{currentQ.subPrompt}</div>
          <div style={questionType === 'hanviet_to_kanji' ? styles.questionHanViet : styles.questionKanji}>
            {currentQ.questionText}
          </div>
          {currentQ.target && (
            <div style={styles.targetMeta}>
              Bài {currentQ.target.lessonId} • {currentQ.target.strokeCount} nét • Bộ thủ: {currentQ.target.radical}
            </div>
          )}
        </div>

        {/* Options Grid (4 phương án lựa chọn) */}
        <div style={styles.optionsGrid}>
          {currentQ.options.map((opt, idx) => {
            const isThisSelected = selectedOption === opt;
            const isThisCorrect = opt === currentQ.correctAnswer;

            let statusClass = '';
            if (isAnswered) {
              if (isThisCorrect) {
                statusClass = 'correct';
              } else if (isThisSelected) {
                statusClass = 'wrong';
              } else {
                statusClass = 'faded';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                style={styles.optionBtn}
                onClick={() => handleSelectOption(opt)}
                className={`kana-choice-btn ${statusClass}`}
              >
                <span style={styles.optionIndex}>{String.fromCharCode(65 + idx)}</span>
                <span style={styles.optionText}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Answer Feedback Banner */}
        {isAnswered && (
          <div style={{
            ...styles.feedbackBanner,
            backgroundColor: isCorrect ? '#f0fdf4' : '#fff1f2',
            borderColor: isCorrect ? '#86efac' : '#fecdd3',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>{isCorrect ? '🎉' : '💡'}</span>
              <div>
                <div style={{
                  fontWeight: '800',
                  color: isCorrect ? '#166534' : '#9f1239',
                  fontSize: '1.05rem',
                }}>
                  {isCorrect ? 'Chính xác! Xuất sắc lắm!' : 'Chưa chính xác rồi!'}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#4a5568', marginTop: '2px' }}>
                  Đáp án chuẩn: <strong>{currentQ.correctAnswer}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              style={styles.nextBtn}
              onClick={handleNextQuestion}
            >
              {currentIndex + 1 === questions.length ? 'Xem Kết Quả ➔' : 'Câu Tiếp Theo ➔'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================
  // VIEW: RESULT SCREEN
  // =========================================================
  const percent = Math.round((score / Math.max(1, questions.length)) * 100);

  return (
    <div style={styles.resultCard}>
      <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
        {percent >= 80 ? '🌸' : percent >= 50 ? '🍃' : '🌱'}
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1a202c', margin: '0 0 8px' }}>
        Hoàn Thành Đấu Trường Hán Tự!
      </h2>

      <p style={{ color: '#718096', fontSize: '0.95rem', margin: '0 0 24px' }}>
        {percent >= 80
          ? 'Phong độ tuyệt vời! Bạn đã ghi nhớ rất sâu sắc các chữ Hán này.'
          : 'Hãy kiên trì ôn luyện nhé, mỗi lần làm lại là một lần khắc sâu trí nhớ.'}
      </p>

      {/* Score Box */}
      <div style={styles.resultScoreBox}>
        <div style={styles.resultScoreNumber}>{score} / {questions.length}</div>
        <div style={styles.resultPercentBadge}>{percent}% Chính xác</div>
      </div>

      {/* Missed Kanji Review */}
      {missedKanji.length > 0 && (
        <div style={styles.missedSection}>
          <div style={{ fontWeight: '700', color: '#e11d48', fontSize: '0.95rem', marginBottom: '12px' }}>
            ⚠️ Các chữ Hán cần củng cố thêm ({missedKanji.length} chữ):
          </div>
          <div style={styles.missedGrid}>
            {missedKanji.map((k) => (
              <div key={k.character} style={styles.missedItem}>
                <span style={styles.missedChar}>{k.character}</span>
                <div>
                  <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '0.88rem' }}>
                    {k.hanViet}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#718096' }}>
                    {k.meaning}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="kanji-action-btn"
            style={styles.retryMissedBtn}
            onClick={() => startQuiz(missedKanji)}
          >
            🔥 Thử Thách Lại {missedKanji.length} Chữ Làm Sai
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="kanji-action-btn"
          style={styles.cancelBtn}
          onClick={onBackToGrid}
        >
          ⬅ Về Bảng Chữ Hán
        </button>

        <button
          type="button"
          className="kanji-action-btn"
          style={styles.startBtn}
          onClick={() => startQuiz()}
        >
          🔄 Luyện Tập Lại Vòng Mới
        </button>
      </div>
    </div>
  );
};

const styles = {
  setupCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '36px 28px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08)',
    maxWidth: '820px',
    margin: '0 auto',
  },
  setupHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  setupSection: {
    marginBottom: '24px',
  },
  setupLabel: {
    display: 'block',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '10px',
    fontSize: '0.95rem',
  },
  chipRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  startBtn: {
    padding: '12px 28px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 100%)',
    color: '#ffffff',
    border: 'none',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.25)',
    transition: 'all 0.2s ease',
  },
  cancelBtn: {
    padding: '12px 22px',
    borderRadius: '14px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  playingCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '28px 24px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08)',
    maxWidth: '780px',
    margin: '0 auto',
  },
  playHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
  },
  quitBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  progressContainer: {
    flex: 1,
    textAlign: 'center',
  },
  progressText: {
    fontSize: '0.85rem',
    color: '#718096',
    marginBottom: '6px',
  },
  progressBarTrack: {
    height: '8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#e91e8c',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  scorePill: {
    backgroundColor: '#fff0f6',
    padding: '6px 14px',
    borderRadius: '16px',
    fontWeight: '700',
    fontSize: '0.88rem',
    color: '#e91e8c',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  streakFlame: {
    color: '#f97316',
  },
  questionBox: {
    textAlign: 'center',
    padding: '32px 16px',
    backgroundColor: '#fffafc',
    borderRadius: '20px',
    border: '1.5px dashed #fbcfe8',
    marginBottom: '24px',
  },
  subPromptText: {
    fontSize: '0.92rem',
    color: '#888',
    fontWeight: '600',
    marginBottom: '8px',
  },
  questionKanji: {
    fontSize: '4.8rem',
    fontWeight: '900',
    color: '#1a202c',
    lineHeight: '1.2',
    fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif',
  },
  questionHanViet: {
    fontSize: '2.4rem',
    fontWeight: '900',
    color: '#e91e8c',
    lineHeight: '1.2',
  },
  targetMeta: {
    fontSize: '0.82rem',
    color: '#a0aec0',
    marginTop: '8px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    border: '2px solid transparent',
    borderRadius: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  optionIndex: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#64748b',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    lineHeight: '1.4',
  },
  feedbackBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderRadius: '16px',
    border: '1.5px solid',
    marginTop: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  nextBtn: {
    padding: '10px 22px',
    borderRadius: '12px',
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    border: 'none',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.25)',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '40px 24px',
    textAlign: 'center',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08)',
    maxWidth: '680px',
    margin: '0 auto',
  },
  resultScoreBox: {
    backgroundColor: '#fff5f8',
    borderRadius: '20px',
    padding: '24px',
    border: '1.5px solid #fce7f3',
    maxWidth: '320px',
    margin: '0 auto 24px',
  },
  resultScoreNumber: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#e91e8c',
  },
  resultPercentBadge: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: '#718096',
    marginTop: '4px',
  },
  missedSection: {
    backgroundColor: '#fffafc',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #fee2e2',
    textAlign: 'left',
    marginTop: '20px',
  },
  missedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '10px',
    marginBottom: '16px',
  },
  missedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid #fed7aa',
  },
  missedChar: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#e11d48',
  },
  retryMissedBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#ffe4e6',
    color: '#be123c',
    border: '1px solid #fecdd3',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
