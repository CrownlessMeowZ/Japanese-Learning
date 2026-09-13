import React, { useEffect, useMemo } from 'react';
import { useQuizEngine, QUIZ_STATUS } from '../../hooks/useQuizEngine';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useProgress } from '../../hooks/useProgress';
import { FuriganaText } from '../FuriganaText';
import '../../styles/quiz.css';

/**
 * QuizScreen Component
 * Tích hợp Spaced Repetition (SM-2): Lọc câu hỏi đến hạn ôn tập và cập nhật quality (1 | 4)
 * Tích hợp Audio Singleton: Tự động phát âm đáp án đúng và hỗ trợ nút [ 🔊 Nghe lại ]
 */
export const QuizScreen = ({ lessonId = 1, rawQuestions = [], onBack }) => {
  const {
    status,
    currentIndex,
    currentQuestion,
    score,
    selectedAnswer,
    totalQuestions,
    startGame,
    handleAnswer,
    nextQuestion,
    quitGame,
  } = useQuizEngine();

  const { playAudio, stopAudio } = useAudioPlayer();
  const { getDueItems, reviewItem } = useProgress();

  // Dọn dẹp âm thanh khi unmount khỏi Quiz
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Lọc danh sách các ID từ vựng đã đến hạn ôn tập hôm nay hoặc chưa từng học
  const dueIds = useMemo(() => {
    return getDueItems(lessonId, rawQuestions);
  }, [getDueItems, lessonId, rawQuestions]);

  // Danh sách câu hỏi cần ôn theo Spaced Repetition (SM-2)
  const dueQuestions = useMemo(() => {
    const idSet = new Set(dueIds);
    return rawQuestions.filter((q) => {
      const key = q.id || q.kanji || q.hiragana;
      return idSet.has(key);
    });
  }, [rawQuestions, dueIds]);

  // Helper lấy chuỗi phát âm chuẩn của từ tiếng Nhật
  const getAudioTarget = (item) => {
    if (!item) return '';
    return item.audio_url || item.hiragana || item.kanji || item.japanese || '';
  };

  /**
   * Xử lý chọn đáp án & cập nhật thuật toán SM-2
   */
  const onSelectOption = (opt) => {
    if (selectedAnswer !== null) return;

    // 1. Kiểm tra tính đúng đắn từ Quiz Engine
    const isCorrect = handleAnswer(opt);

    // 2. Cập nhật Spaced Repetition (SM-2)
    // Đúng ngay lần đầu: quality = 4 (Nhớ sau một chút ngập ngừng / tốt)
    // Trả lời sai: quality = 1 (Sai, nhận ra khi xem đáp án)
    const quality = isCorrect ? 4 : 1;
    const target = currentQuestion?.correctAnswer;
    const targetId = target?.id || target?.kanji || target?.hiragana || currentQuestion?.id;

    if (targetId) {
      reviewItem(targetId, 'vocab', quality);
    }

    // 3. Tự động phát âm thanh của đáp án CHÍNH XÁC để user ghi nhớ
    const soundTarget = getAudioTarget(target);
    if (soundTarget) {
      playAudio(soundTarget);
    }
  };

  // -------------------------------------------------------------
  // VIEW: EMPTY STATE (Không còn từ nào cần ôn tập hôm nay)
  // -------------------------------------------------------------
  if (status === QUIZ_STATUS.IDLE && dueQuestions.length === 0 && rawQuestions.length > 0) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px' }}>🎉</span>
          <h2 style={{ color: '#28a745', fontSize: '1.8rem', margin: '0 0 12px', fontWeight: '700' }}>
            Bạn đã hoàn thành mục tiêu hôm nay!
          </h2>
          <p style={{ color: '#4a5568', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Không còn từ nào cần ôn theo lịch ngắt quãng Spaced Repetition (SM-2).
            Tất cả từ vựng trong Bài {lessonId} đã được ghi nhớ vững vàng.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {onBack && (
              <button style={styles.secondaryBtn} onClick={onBack}>
                ⬅ Quay lại Dashboard
              </button>
            )}
            <button
              style={styles.primaryBtn}
              onClick={() => startGame(rawQuestions, rawQuestions, 10)}
            >
              🔄 Ôn tập tự do toàn bộ ({rawQuestions.length} từ)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: IDLE STATE (Màn hình bắt đầu có từ cần ôn)
  // -------------------------------------------------------------
  const renderIdleView = () => (
    <div style={styles.card}>
      <div style={styles.idleBadge}>
        🧠 Spaced Repetition (SM-2)
      </div>
      <h2 style={{ color: '#e91e8c', fontSize: '1.9rem', margin: '14px 0 10px', fontWeight: '700' }}>
        🎯 Ôn Tập Trắc Nghiệm - Bài {lessonId}
      </h2>
      <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px' }}>
        Hệ thống tự động lọc ra <strong>{dueQuestions.length}</strong> từ vựng đã đến hạn ôn tập hôm nay.
        Thuật toán SM-2 sẽ tự động điều chỉnh khoảng cách ngày ôn tập tiếp theo dựa trên độ chính xác của bạn.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {onBack && (
          <button style={styles.secondaryBtn} onClick={onBack}>
            ⬅ Quay lại Dashboard
          </button>
        )}
        <button
          style={styles.primaryBtn}
          onClick={() => startGame(dueQuestions, rawQuestions, 10)}
          disabled={dueQuestions.length === 0}
        >
          🚀 Bắt đầu ôn tập ({dueQuestions.length} từ đến hạn)
        </button>
      </div>

      {rawQuestions.length < 4 && (
        <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginTop: '16px', textAlign: 'center' }}>
          ⚠️ Cần tối thiểu 4 từ vựng trong bài học để tạo 4 lựa chọn trắc nghiệm.
        </p>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // VIEW 2: PLAYING STATE (Màn hình câu hỏi)
  // -------------------------------------------------------------
  const renderPlayingView = () => {
    if (!currentQuestion) return null;

    const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
    const target = currentQuestion.correctAnswer;
    const isAnswered = selectedAnswer !== null;

    return (
      <div style={styles.card}>
        {/* Progress Bar */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
        </div>

        {/* Header Meta */}
        <div style={styles.metaRow}>
          <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: '600' }}>
            Câu hỏi {currentIndex + 1} / {totalQuestions}
          </span>
          <span style={{ color: '#e91e8c', fontWeight: 'bold' }}>
            ⭐ Đúng: {score}
          </span>
        </div>

        {/* Question: Nghĩa tiếng Việt */}
        <div style={styles.questionPrompt}>
          <span style={{ fontSize: '0.88rem', color: '#888', display: 'block', marginBottom: '6px' }}>
            Nghĩa tiếng Việt:
          </span>
          <h1 style={{ fontSize: '2.1rem', color: '#2d3748', margin: 0, fontWeight: '700' }}>
            {target.meaning || target.meaning_vi || target.vietnamese}
          </h1>
        </div>

        {/* 4 Options Buttons */}
        <div style={styles.optionsGrid}>
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrect =
              (opt.id && target.id && opt.id === target.id) ||
              (opt.kanji && target.kanji && opt.kanji === target.kanji) ||
              opt === target;

            // Dynamic Styling dựa vào trạng thái chọn
            let dynamicStyle = {};
            if (isAnswered) {
              if (isCorrect) {
                dynamicStyle = styles.correctBtn;
              } else if (isSelected) {
                dynamicStyle = styles.wrongBtn;
              } else {
                dynamicStyle = { opacity: 0.35, cursor: 'not-allowed' };
              }
            }

            return (
              <div key={`${currentQuestion.questionId || currentQuestion.id}-opt-${idx}`} style={{ position: 'relative' }}>
                <button
                  className="quiz-option-btn"
                  style={dynamicStyle}
                  onClick={() => onSelectOption(opt)}
                  disabled={isAnswered}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                    {isAnswered && isCorrect && <span style={{ color: '#28a745' }}>✓</span>}
                    {isAnswered && isSelected && !isCorrect && <span style={{ color: '#dc3545' }}>✗</span>}
                    <FuriganaText
                      kanji={opt.kanji}
                      kana={opt.hiragana || opt.kana}
                    />
                  </div>
                </button>

                {/* Nút [ 🔊 Nghe lại ] hiển thị bên cạnh đáp án đúng khi đã trả lời */}
                {isAnswered && isCorrect && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(getAudioTarget(opt));
                    }}
                    title="Nghe lại phát âm chuẩn"
                    style={styles.replayAudioBtn}
                  >
                    🔊 Nghe lại
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Question Button */}
        {isAnswered && (
          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <button style={styles.primaryBtn} onClick={nextQuestion}>
              {currentIndex + 1 < totalQuestions ? 'Câu tiếp theo ➔' : 'Xem kết quả 🏁'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // VIEW 3: FINISHED STATE (Màn hình kết quả & Tỷ lệ %)
  // -------------------------------------------------------------
  const renderFinishedView = () => {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPassed = percentage >= 80;

    return (
      <div style={{ ...styles.card, textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: isPassed ? '#28a745' : '#e91e8c', margin: '0 0 16px', fontWeight: '700' }}>
          {isPassed ? '🎉 Xuất Sắc!' : '💪 Hoàn Thành Phiên Ôn Tập!'}
        </h2>

        <div style={styles.scoreCircle}>
          <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#e91e8c' }}>
            {score}
          </span>
          <span style={{ fontSize: '1.2rem', color: '#718096' }}>/ {totalQuestions}</span>
        </div>

        <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', margin: '16px 0 8px' }}>
          Độ chính xác: {percentage}%
        </p>

        <p style={{ color: '#718096', fontSize: '0.95rem', marginBottom: '28px', lineHeight: '1.5' }}>
          {isPassed
            ? 'Tiến độ ôn tập SM-2 đã được cập nhật! Các từ đúng sẽ có khoảng cách ôn tập dài hơn.'
            : 'Các từ trả lời sai đã được reset về chu kỳ 1 ngày để bạn ôn lại vào ngày mai.'}
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={styles.secondaryBtn} onClick={quitGame}>
            🏠 Về trang bắt đầu
          </button>
          <button
            style={styles.primaryBtn}
            onClick={() => startGame(dueQuestions.length > 0 ? dueQuestions : rawQuestions, rawQuestions, totalQuestions || 10)}
          >
            🔄 Luyện tập lại
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {status === QUIZ_STATUS.IDLE && renderIdleView()}
      {status === QUIZ_STATUS.PLAYING && renderPlayingView()}
      {status === QUIZ_STATUS.FINISHED && renderFinishedView()}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '30px 16px',
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px 28px',
    boxShadow: '0 10px 30px rgba(233, 30, 140, 0.1)',
    border: '1px solid #fce7f3',
  },
  idleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '16px',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  progressTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e91e8c',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  questionPrompt: {
    backgroundColor: '#fffaf0',
    borderLeft: '4px solid #dd6b20',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  correctBtn: {
    backgroundColor: '#f0fff4',
    borderColor: '#28a745',
    color: '#28a745',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.25)',
  },
  wrongBtn: {
    backgroundColor: '#fff5f5',
    borderColor: '#dc3545',
    color: '#dc3545',
    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.25)',
  },
  replayAudioBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#ffffff',
    border: '1px solid #e91e8c',
    color: '#e91e8c',
    borderRadius: '14px',
    padding: '4px 10px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(233, 30, 140, 0.15)',
    zIndex: 2,
  },
  scoreCircle: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: '6px solid #fce7f3',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    padding: '12px 28px',
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    padding: '12px 24px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
