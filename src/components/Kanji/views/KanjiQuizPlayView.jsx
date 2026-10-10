import React from 'react';
import { kanjiQuizStyles as styles } from './kanjiQuizStyles';

/**
 * KanjiQuizPlayView - Màn hình Câu Hỏi và Thử Thách Phản Xạ Kanji
 */
export const KanjiQuizPlayView = ({
  currentQ,
  currentIndex,
  totalQuestions,
  score,
  streak,
  questionType,
  selectedOption,
  isAnswered,
  onSelectOption,
  onNextQuestion,
  onQuit,
}) => {
  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div style={styles.playingCard}>
      {/* Progress Bar & Header */}
      <div style={styles.playHeader}>
        <button
          type="button"
          style={styles.quitBtn}
          onClick={onQuit}
        >
          ✕ Dừng lại
        </button>

        <div style={styles.progressContainer}>
          <div style={styles.progressText}>
            Câu <strong>{currentIndex + 1}</strong> / {totalQuestions}
          </div>
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
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
              onClick={() => onSelectOption(opt)}
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
            onClick={onNextQuestion}
          >
            {currentIndex + 1 === totalQuestions ? 'Xem Kết Quả ➔' : 'Câu Tiếp Theo ➔'}
          </button>
        </div>
      )}
    </div>
  );
};
