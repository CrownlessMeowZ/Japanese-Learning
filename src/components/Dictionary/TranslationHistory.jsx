import React from 'react';

/**
 * TranslationHistory - Vùng hiển thị lịch sử các từ đã tra cứu & cụm từ mẫu
 * Giúp học viên dễ dàng xem lại các từ vựng vừa tra và thử nghiệm các mẫu câu thông dụng
 */
export const TranslationHistory = ({
  history = [],
  samplePhrases = [],
  onSelectHistory,
  onClearHistory,
  onSelectSample,
}) => {
  return (
    <div style={styles.container}>
      {/* 1. Lịch sử tra cứu gần nhất */}
      {history.length > 0 && (
        <div style={styles.historySection}>
          <div style={styles.sectionHeaderRow}>
            <span style={styles.sectionTitle}>🕒 Lịch sử tra cứu gần đây ({history.length}):</span>
            <button
              type="button"
              style={styles.clearHistoryBtn}
              onClick={onClearHistory}
              title="Xóa toàn bộ lịch sử tra cứu"
            >
              ✕ Xóa lịch sử
            </button>
          </div>
          <div style={styles.chipsRow}>
            {history.map((item, idx) => (
              <button
                key={idx}
                type="button"
                style={styles.historyChip}
                onClick={() => onSelectHistory(item)}
                title={`Tra lại: ${item.sourceText} ➔ ${item.translatedText}`}
              >
                <span style={styles.historyLangBadge}>
                  {item.sourceLang.toUpperCase()}➔{item.targetLang.toUpperCase()}
                </span>
                <span style={styles.historyText}>{item.sourceText}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Mẫu câu thử nghiệm nhanh */}
      {samplePhrases.length > 0 && (
        <div style={styles.sampleSection}>
          <span style={styles.sampleTitle}>💡 Thử nghiệm nhanh các cụm từ (Click để dịch):</span>
          <div style={styles.chipsRow}>
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                style={styles.sampleChip}
                onClick={() => onSelectSample(phrase)}
                title={`Dịch thử: ${phrase.text}`}
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    borderTop: '1px solid #f8e7ee',
    paddingTop: '18px',
    marginTop: '10px',
  },
  historySection: {
    marginBottom: '16px',
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '6px',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#475569',
  },
  clearHistoryBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '8px',
    transition: 'color 0.2s ease',
  },
  sampleSection: {
    marginTop: '4px',
  },
  sampleTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#718096',
    display: 'block',
    marginBottom: '10px',
  },
  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  historyChip: {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e0',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.82rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    fontWeight: '600',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
  },
  historyLangBadge: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: '#e91e8c',
    backgroundColor: '#fff0f6',
    padding: '2px 5px',
    borderRadius: '6px',
  },
  historyText: {
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sampleChip: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    border: '1px solid #fce7f3',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.84rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '600',
  },
};
