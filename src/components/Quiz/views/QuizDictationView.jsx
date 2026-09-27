import React from 'react';
import { FuriganaText } from '../../FuriganaText';
import { QuizTypingInput } from '../QuizTypingInput';
import { quizStyles } from './quizViewStyles';

/**
 * QuizDictationView - Presentational component for Typing Mode & Audio Dictation Lab
 * 1. Chế độ Tự Luận Gõ Phím (Typing Mode): 2 chiều (vi_to_ja, ja_to_vi)
 * 2. Chế độ Nghe Chép Chính Tả (Dictation Mode): Trực quan hóa sóng âm thanh, nghe và gõ lại tiếng Nhật
 */
export const QuizDictationView = ({
  currentQuestion,
  questionFormat = 'typing',
  quizMode = 'vi_to_ja',
  selectedAnswer = null,
  currentIndex = 0,
  audioSpeed = 1.0,
  setAudioSpeed,
  onCheckTypedAnswer,
  onNextQuestion,
  onPlayAudio,
  getAudioTarget,
}) => {
  if (!currentQuestion) return null;

  const target = currentQuestion.correctAnswer;
  const isAnswered = selectedAnswer !== null;

  return (
    <div>
      {/* =========================================================
          FORMAT 1: TỰ LUẬN GÕ PHÍM (TYPING MODE)
         ========================================================= */}
      {questionFormat === 'typing' && (
        <div>
          {quizMode === 'vi_to_ja' && (
            <div style={quizStyles.questionPrompt}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', marginBottom: '8px' }}>
                ⌨️ LUYỆN GÕ TỪ VỰNG (TYPING MODE)
              </div>
              <span style={quizStyles.promptSubLabel}>🇻🇳 Nghĩa tiếng Việt (Hãy gõ từ tiếng Nhật tương ứng):</span>
              <h1 style={quizStyles.promptMainText}>
                {target.meaning || target.meaning_vi || target.vietnamese}
              </h1>
            </div>
          )}

          {quizMode === 'ja_to_vi' && (
            <div style={{ ...quizStyles.questionPrompt, borderLeftColor: '#e91e8c' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', marginBottom: '8px' }}>
                ⌨️ LUYỆN GÕ NGHĨA TIẾNG VIỆT (TYPING MODE)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={quizStyles.promptSubLabel}>🇯🇵 Từ tiếng Nhật (Hãy gõ nghĩa tiếng Việt tương ứng):</span>
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

          <QuizTypingInput
            key={`${target.id || target.kanji || target.hiragana || currentIndex}-typing`}
            target={target}
            direction={quizMode === 'ja_to_vi' ? 'to_vi' : 'to_ja'}
            isDictation={false}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
            onCheckAnswer={onCheckTypedAnswer}
            onNextQuestion={onNextQuestion}
            onPlayAudio={(sound) => onPlayAudio(sound, audioSpeed)}
            audioSpeed={audioSpeed}
            onChangeAudioSpeed={setAudioSpeed}
          />
        </div>
      )}

      {/* =========================================================
          FORMAT 2: NGHE CHÉP CHÍNH TẢ (AUDIO DICTATION LAB)
         ========================================================= */}
      {questionFormat === 'dictation' && (
        <div>
          <div style={{
            ...quizStyles.questionPrompt,
            borderLeftColor: isAnswered ? (selectedAnswer?.isCorrect ? '#28a745' : '#dc3545') : '#e91e8c',
            background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
            textAlign: 'center',
            padding: '26px 20px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(233, 30, 140, 0.08)',
          }}>
            {!isAnswered ? (
              <>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '10px' }}>
                  🎧 PHÒNG LUYỆN NGHE CHÉP CHÍNH TẢ (AUDIO DICTATION)
                </div>
                <div style={quizStyles.promptSubLabel}>
                  Lắng nghe kỹ phát âm của người bản xứ và chép lại từ vựng:
                </div>

                {/* Nút Nghe Lớn Có Sóng Âm (Pulse Audio Button) */}
                <div style={{ margin: '16px 0 10px' }}>
                  <button
                    type="button"
                    className="quiz-listening-audio-btn quiz-pulse-anim"
                    onClick={() => onPlayAudio(getAudioTarget(target), audioSpeed)}
                    title="Bấm để nghe lại phát âm"
                  >
                    <span style={{ fontSize: '2.4rem' }}>🔊</span>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                      Phát âm lại ({audioSpeed}x)
                    </span>
                  </button>
                </div>

                {/* Hoạt ảnh Sóng Âm (Sound Waveform Bars) */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '28px', margin: '8px 0 10px' }}>
                  <div className="dictation-wave-bar" />
                  <div className="dictation-wave-bar" />
                  <div className="dictation-wave-bar" />
                  <div className="dictation-wave-bar" />
                  <div className="dictation-wave-bar" />
                  <div className="dictation-wave-bar" />
                  <div className="dictation-wave-bar" />
                </div>

                <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                  💡 Âm thanh tự phát khi đổi câu. Gõ bằng <strong>Hiragana</strong>, <strong>Katakana</strong> hoặc <strong>Romaji</strong>.
                </div>
              </>
            ) : (
              <div>
                <span style={{ fontSize: '0.9rem', color: selectedAnswer?.isCorrect ? '#28a745' : '#dc3545', fontWeight: '800' }}>
                  {selectedAnswer?.isCorrect ? '✓ Bạn đã chép chính xác:' : '✗ Đáp án chuẩn:'}
                </span>
                <h1 style={{ fontSize: '2.4rem', color: '#1a202c', margin: '8px 0 6px' }}>
                  <FuriganaText kanji={target.kanji} kana={target.hiragana} />
                </h1>
                <p style={{ margin: '0 0 10px', color: '#4a5568', fontSize: '1.15rem', fontWeight: '600' }}>
                  {target.meaning || target.meaning_vi}
                </p>
                {selectedAnswer?.userInput && (
                  <div style={{ fontSize: '0.86rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '6px 14px', borderRadius: '10px', display: 'inline-block' }}>
                    Từ bạn đã chép: <strong style={{ color: selectedAnswer?.isCorrect ? '#16a34a' : '#e11d48' }}>「{selectedAnswer.userInput}」</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          <QuizTypingInput
            key={`${target.id || target.kanji || target.hiragana || currentIndex}-dictation`}
            target={target}
            direction="to_ja"
            isDictation={true}
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
            onCheckAnswer={onCheckTypedAnswer}
            onNextQuestion={onNextQuestion}
            onPlayAudio={(sound) => onPlayAudio(sound, audioSpeed)}
            audioSpeed={audioSpeed}
            onChangeAudioSpeed={setAudioSpeed}
          />
        </div>
      )}
    </div>
  );
};
