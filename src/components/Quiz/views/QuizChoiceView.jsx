import React from 'react';
import { FuriganaText } from '../../FuriganaText';
import { quizStyles } from './quizViewStyles';

/**
 * QuizChoiceView - Presentational component for Multiple Choice Mode (Trắc nghiệm 4 lựa chọn)
 * Hỗ trợ 3 chiều: vi_to_ja (Nghĩa -> Từ), ja_to_vi (Từ -> Nghĩa), listening (Luyện nghe audio)
 */
export const QuizChoiceView = ({
  currentQuestion,
  selectedAnswer = null,
  quizMode = 'vi_to_ja',
  audioSpeed = 1.0,
  onSelectOption,
  onNextQuestion,
  onPlayAudio,
  getAudioTarget,
  currentIndex = 0,
  totalQuestions = 0,
}) => {
  if (!currentQuestion) return null;

  const target = currentQuestion.correctAnswer;
  const isAnswered = selectedAnswer !== null;

  return (
    <div>
      {/* CHẾ ĐỘ 1: VI ➔ JA (Nghĩa sang Từ) */}
      {quizMode === 'vi_to_ja' && (
        <div style={quizStyles.questionPrompt}>
          <span style={quizStyles.promptSubLabel}>🇻🇳 Nghĩa tiếng Việt:</span>
          <h1 style={quizStyles.promptMainText}>
            {target.meaning || target.meaning_vi || target.vietnamese}
          </h1>
        </div>
      )}

      {/* CHẾ ĐỘ 2: JA ➔ VI (Từ sang Nghĩa - Đảo chiều) */}
      {quizMode === 'ja_to_vi' && (
        <div style={{ ...quizStyles.questionPrompt, borderLeftColor: '#e91e8c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={quizStyles.promptSubLabel}>🇯🇵 Chọn nghĩa tiếng Việt đúng của từ:</span>
            <button
              type="button"
              style={quizStyles.speakerMiniBtn}
              onClick={() => onPlayAudio(getAudioTarget(target), audioSpeed)}
              title="Nghe phát âm chuẩn"
            >
              🔊 Nghe lại ({audioSpeed}x)
            </button>
          </div>
          <h1 style={{ ...quizStyles.promptMainText, fontSize: '2.4rem', color: '#1a202c', marginTop: '8px' }}>
            <FuriganaText kanji={target.kanji} kana={target.hiragana} />
          </h1>
        </div>
      )}

      {/* CHẾ ĐỘ 3: LISTENING (Luyện Nghe Trắc Nghiệm) */}
      {quizMode === 'listening' && (
        <div style={{
          ...quizStyles.questionPrompt,
          borderLeftColor: isAnswered ? '#28a745' : '#e91e8c',
          textAlign: 'center',
          padding: '24px 20px',
        }}>
          {!isAnswered ? (
            <>
              <span style={quizStyles.promptSubLabel}>
                🎧 Lắng nghe phát âm và chọn đáp án chính xác:
              </span>
              <div style={{ margin: '16px 0' }}>
                <button
                  type="button"
                  className="quiz-listening-audio-btn quiz-pulse-anim"
                  onClick={() => onPlayAudio(getAudioTarget(target), audioSpeed)}
                  title="Bấm để nghe lại phát âm"
                >
                  <span style={{ fontSize: '2.5rem' }}>🔊</span>
                  <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                    Bấm để nghe lại ({audioSpeed}x)
                  </span>
                </button>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#718096' }}>
                (Mặt chữ và nghĩa sẽ hiển thị ngay khi bạn chọn đáp án)
              </div>
            </>
          ) : (
            <div>
              <span style={{ fontSize: '0.88rem', color: '#28a745', fontWeight: '700' }}>
                ✓ Đáp án tiếng Nhật chuẩn:
              </span>
              <h1 style={{ fontSize: '2.3rem', color: '#1a202c', margin: '8px 0 6px' }}>
                <FuriganaText kanji={target.kanji} kana={target.hiragana} />
              </h1>
              <p style={{ margin: 0, color: '#4a5568', fontSize: '1.1rem', fontWeight: '600' }}>
                {target.meaning || target.meaning_vi}
              </p>
            </div>
          )}
        </div>
      )}

      {/* LƯỚI 4 ĐÁP ÁN LỰA CHỌN */}
      <div style={quizStyles.optionsGrid}>
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect =
            (opt.id && target.id && opt.id === target.id) ||
            (opt.kanji && target.kanji && opt.kanji === target.kanji) ||
            opt === target;

          let statusClass = '';
          if (isAnswered) {
            if (isCorrect) {
              statusClass = 'correct';
            } else if (isSelected) {
              statusClass = 'wrong';
            } else {
              statusClass = 'faded';
            }
          }

          return (
            <div
              key={`${currentQuestion.questionId || currentQuestion.id}-opt-${idx}`}
              style={{ position: 'relative' }}
            >
              <button
                type="button"
                className={`quiz-option-btn ${statusClass}`}
                onClick={() => onSelectOption(opt)}
                disabled={isAnswered}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                  {isAnswered && isCorrect && <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>}
                  {isAnswered && isSelected && !isCorrect && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>✗</span>}

                  {/* Hiển thị tiếng Nhật (FuriganaText) khi ở chế độ vi_to_ja */}
                  {quizMode === 'vi_to_ja' && (
                    <span style={{ fontSize: '1.2rem' }}>
                      <FuriganaText
                        kanji={opt.kanji}
                        kana={opt.hiragana || opt.kana}
                      />
                    </span>
                  )}

                  {/* Hiển thị Nghĩa Tiếng Việt khi ở chế độ ja_to_vi hoặc listening */}
                  {(quizMode === 'ja_to_vi' || quizMode === 'listening') && (
                    <span style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                      {opt.meaning || opt.meaning_vi || opt.vietnamese}
                    </span>
                  )}
                </div>
              </button>

              {/* Nút [ 🔊 Nghe lại ] hiển thị bên cạnh đáp án đúng khi đã trả lời */}
              {isAnswered && isCorrect && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(getAudioTarget(opt), audioSpeed);
                  }}
                  title="Nghe lại phát âm chuẩn"
                  style={quizStyles.replayAudioBtn}
                >
                  🔊 Nghe
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Nút Chuyển Câu Kế Tiếp */}
      {isAnswered && (
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button
            type="button"
            className="quiz-action-btn"
            style={quizStyles.primaryBtn}
            onClick={onNextQuestion}
          >
            {currentIndex + 1 < totalQuestions ? 'Câu tiếp theo ➔' : 'Xem kết quả 🏁'}
          </button>
        </div>
      )}
    </div>
  );
};
