import React from 'react';
import { quizStyles } from './quizViewStyles';

/**
 * QuizResultView - Presentational component for Quiz FINISHED state
 * Tổng kết điểm số, tỷ lệ phần trăm chính xác và khối Cứu hộ từ sai (Targeted Retry).
 */
export const QuizResultView = ({
  score = 0,
  totalQuestions = 0,
  wrongItems = [],
  onRetryMistakes,
  onQuitGame,
  onRestartSession,
  onBack,
}) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isPassed = percentage >= 80;

  return (
    <div style={{ ...quizStyles.card, textAlign: 'center' }}>
      <span style={{ fontSize: '3.2rem', display: 'block', marginBottom: '8px' }}>
        {isPassed ? '🎉' : '💪'}
      </span>
      <h2 style={{ fontSize: '2rem', color: isPassed ? '#28a745' : '#e91e8c', margin: '0 0 16px', fontWeight: '800' }}>
        {isPassed ? 'Xuất Sắc Hoàn Thành!' : 'Hoàn Thành Phiên Ôn Tập!'}
      </h2>

      {/* Score Circle */}
      <div style={quizStyles.scoreCircle}>
        <span style={{ fontSize: '3.4rem', fontWeight: '800', color: '#e91e8c', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '1.1rem', color: '#718096', fontWeight: '600' }}>
          / {totalQuestions}
        </span>
      </div>

      <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', margin: '18px 0 8px' }}>
        Độ chính xác: {percentage}%
      </p>

      <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5', maxWidth: '520px', margin: '0 auto 24px' }}>
        {isPassed
          ? 'Tiến độ ôn tập SM-2 đã được cập nhật! Các từ trả lời đúng sẽ kéo dài khoảng cách ôn tập để củng cố trí nhớ dài hạn.'
          : 'Các từ trả lời sai đã được tự động ghi nhận vào Hộp Cứu Hộ Điểm Yếu (Mistake Vault) để bạn luyện tập bổ sung.'}
      </p>

      {/* ⚠️ CỨU HỘ TỪ SAI (TARGETED RETRY) */}
      {wrongItems.length > 0 && (
        <div style={quizStyles.wrongSectionBox}>
          <div style={{ fontWeight: '700', color: '#c53030', marginBottom: '12px', fontSize: '0.98rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span>⚠️</span> Có {wrongItems.length} từ bạn trả lời chưa chính xác trong phiên này:
          </div>
          <div style={quizStyles.wrongGrid}>
            {wrongItems.map((item, idx) => (
              <div key={item.id || idx} style={quizStyles.wrongItemChip}>
                <div style={{ fontWeight: '700', color: '#1a202c', fontSize: '1rem' }}>
                  {item.kanji ? `${item.kanji} (${item.hiragana})` : item.hiragana}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '2px' }}>
                  {item.meaning || item.meaning_vi}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="quiz-action-btn"
            style={quizStyles.retryMistakesBtn}
            onClick={onRetryMistakes}
          >
            🔥 Thử thách lại {wrongItems.length} từ làm sai ngay
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
        <button
          type="button"
          className="quiz-action-btn"
          style={quizStyles.secondaryBtn}
          onClick={onQuitGame}
        >
          ⚙️ Tùy chỉnh chế độ & phạm vi
        </button>
        <button
          type="button"
          className="quiz-action-btn"
          style={quizStyles.primaryBtn}
          onClick={onRestartSession}
        >
          🔄 Luyện tập lại
        </button>
        {onBack && (
          <button
            type="button"
            className="quiz-action-btn"
            style={quizStyles.outlineBtn}
            onClick={onBack}
          >
            🏠 Về Dashboard
          </button>
        )}
      </div>
    </div>
  );
};
