import React from 'react';

/**
 * KanaResultsModal - Màn hình báo cáo kết quả và ôn tập các ký tự yếu (Trouble Kana)
 * Thống kê độ chính xác, số lần sai và cho phép ôn lại riêng các ký tự chưa vững
 */
export const KanaResultsModal = ({
  stats,
  totalQuestions,
  onSpeakKana,
  onRetryTrouble,
  onRestartQuiz,
  onGoToSetup,
  onGoToChart,
}) => {
  const accuracy = Math.round(
    (stats.correct / Math.max(1, stats.correct + stats.wrong)) * 100
  );

  return (
    <div style={styles.cardBox}>
      <div style={styles.resultsCenterHeader}>
        <span style={{ fontSize: '3.5rem' }}>
          {stats.wrong === 0 ? '🎉' : stats.correct > stats.wrong ? '🌸' : '💪'}
        </span>
        <h2 style={styles.resultsTitle}>
          {stats.wrong === 0
            ? 'Tuyệt Vời! Độ Chính Xác 100%'
            : stats.correct > stats.wrong
            ? 'Làm Rất Tốt! Hãy Tiếp Tục Phát Huy'
            : 'Cần Luyện Tập Thêm!'}
        </h2>
        <p style={{ color: '#718096', fontSize: '0.95rem' }}>
          Hoàn thành bài kiểm tra {totalQuestions} ký tự
        </p>
      </div>

      {/* Stats Badges Grid */}
      <div style={styles.resultsStatsRow}>
        <div style={styles.resultStatBox}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669' }}>
            {stats.correct}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
            Câu trả lời đúng
          </div>
        </div>

        <div style={styles.resultStatBox}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#e11d48' }}>
            {stats.wrong}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
            Số lần sai / Bỏ qua
          </div>
        </div>

        <div style={styles.resultStatBox}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#db2777' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
            Độ chính xác
          </div>
        </div>
      </div>

      {/* Danh sách các chữ hay bị sai (Trouble / Weak Kana) */}
      {stats.troubleItems.length > 0 && (
        <div style={styles.troubleSection}>
          <h4 style={styles.troubleSectionTitle}>
            ⚠️ Các chữ cái bạn cần ôn thêm ({stats.troubleItems.length} chữ):
          </h4>
          <div style={styles.troubleChipsWrap}>
            {stats.troubleItems.map((item, idx) => (
              <div
                key={idx}
                style={styles.troubleChip}
                onClick={() => onSpeakKana(item.character)}
                title={`Bấm để nghe phát âm: ${item.romaji}`}
              >
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                  {item.character}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: '700' }}>
                  {item.romaji}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  ({item.count} lần sai)
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              type="button"
              style={styles.retryTroubleBtn}
              onClick={onRetryTrouble}
            >
              ⚡ Ôn lại ngay các chữ bị sai này
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={styles.resultsActionsRow}>
        <button
          type="button"
          style={styles.primaryActionBtn}
          onClick={onRestartQuiz}
        >
          🔁 Làm lại bài này
        </button>
        <button
          type="button"
          style={styles.secondaryActionBtn}
          onClick={onGoToSetup}
        >
          ⚙️ Cấu hình bộ chữ khác
        </button>
        <button
          type="button"
          style={styles.secondaryActionBtn}
          onClick={onGoToChart}
        >
          📖 Xem lại Bảng Chữ Cái
        </button>
      </div>
    </div>
  );
};

const styles = {
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)',
    border: '1.5px solid #fce7f3',
  },
  resultsCenterHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  resultsTitle: {
    fontSize: '1.65rem',
    fontWeight: '900',
    color: '#1e293b',
    margin: '12px 0 4px',
  },
  resultsStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  resultStatBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '18px',
    textAlign: 'center',
    border: '1.5px solid #e2e8f0',
  },
  troubleSection: {
    backgroundColor: '#fff1f2',
    borderRadius: '20px',
    padding: '20px',
    border: '1.5px solid #fecdd3',
    marginBottom: '28px',
  },
  troubleSectionTitle: {
    margin: '0 0 12px',
    fontSize: '1rem',
    fontWeight: '800',
    color: '#9f1239',
  },
  troubleChipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  troubleChip: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1.5px solid #fecdd3',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  retryTroubleBtn: {
    padding: '10px 26px',
    backgroundColor: '#e11d48',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
  },
  resultsActionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryActionBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.94rem',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
  },
  secondaryActionBtn: {
    padding: '12px 22px',
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.94rem',
    cursor: 'pointer',
  },
};
