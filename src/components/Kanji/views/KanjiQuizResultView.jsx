import React from 'react';
import { kanjiQuizStyles as styles } from './kanjiQuizStyles';

/**
 * KanjiQuizResultView - Màn hình Báo Cáo Kết Quả & Ôn Luyện Chữ Hán Làm Sai
 */
export const KanjiQuizResultView = ({
  score,
  totalQuestions,
  missedKanji,
  onRetryMissed,
  onRestartNew,
  onBackToGrid,
}) => {
  const percent = Math.round((score / Math.max(1, totalQuestions)) * 100);

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
        <div style={styles.resultScoreNumber}>{score} / {totalQuestions}</div>
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
            onClick={onRetryMissed}
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
          onClick={onRestartNew}
        >
          🔄 Luyện Tập Lại Vòng Mới
        </button>
      </div>
    </div>
  );
};
