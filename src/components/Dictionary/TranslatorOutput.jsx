import React from 'react';

/**
 * TranslatorOutput - Khung hiển thị kết quả dịch, phát âm (TTS) và sao chép kết quả
 * Hỗ trợ hiển thị huy hiệu Tra từ Offline và cách đọc Romaji tương ứng
 */
export const TranslatorOutput = ({
  translatedText,
  targetLang,
  targetPhonetic,
  isLoading,
  isOfflineResult,
  copySuccess,
  onSpeak,
  onCopy,
}) => {
  return (
    <div style={{ ...styles.boxWrapper, backgroundColor: '#fffafc' }}>
      {/* Box Header: Target Lang, Offline Badge, Copy Status */}
      <div style={styles.boxHeader}>
        <div style={styles.headerBadgeGroup}>
          <span style={styles.langBadge}>
            {targetLang === 'ja' ? '🇯🇵 Tiếng Nhật' : '🇻🇳 Tiếng Việt'}
          </span>
          {isOfflineResult && (
            <span style={styles.offlineBadge}>⚡ Tra từ Offline</span>
          )}
        </div>
        {copySuccess && <span style={styles.copiedBadge}>✓ Đã sao chép!</span>}
      </div>

      {/* Readonly Textarea hiển thị bản dịch */}
      <textarea
        style={{ ...styles.textarea, backgroundColor: '#fffafc', cursor: 'default' }}
        placeholder={isLoading ? 'Đang dịch văn bản...' : 'Kết quả dịch sẽ xuất hiện ở đây...'}
        value={translatedText}
        readOnly
        rows={6}
      />

      {/* Hiển thị Cách Đọc (Romaji) của bản dịch đích */}
      {targetPhonetic && (
        <div className="phonetic-text" style={styles.phoneticText}>
          <span style={styles.phoneticLabel}>Cách đọc: </span>
          {targetPhonetic}
        </div>
      )}

      {/* Box Footer: Nút Nghe, Nút Copy và Đếm ký tự */}
      <div style={styles.boxFooter}>
        <div style={styles.footerButtonsGroup}>
          <button
            type="button"
            style={styles.iconActionBtn}
            onClick={() => onSpeak(translatedText, targetLang)}
            disabled={!translatedText.trim()}
            title="Phát âm bản dịch (TTS)"
          >
            🔊 Nghe bản dịch
          </button>
          <button
            type="button"
            style={styles.iconActionBtn}
            onClick={() => onCopy(translatedText)}
            disabled={!translatedText.trim()}
            title="Sao chép kết quả"
          >
            📋 Sao chép
          </button>
        </div>
        {translatedText && (
          <span style={styles.charCount}>{translatedText.length} ký tự</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  boxWrapper: {
    border: '1.5px solid #edf2f7',
    borderRadius: '20px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fffafc',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  boxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  headerBadgeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  langBadge: {
    backgroundColor: '#f8fafc',
    color: '#334155',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '0.84rem',
    fontWeight: '800',
    border: '1px solid #e2e8f0',
  },
  offlineBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: '#fef3c7',
    color: '#b45309',
  },
  copiedBadge: {
    color: '#28a745',
    fontSize: '0.82rem',
    fontWeight: '700',
  },
  textarea: {
    width: '100%',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#2d3748',
    minHeight: '150px',
    boxSizing: 'border-box',
    backgroundColor: '#fffafc',
  },
  phoneticText: {
    fontStyle: 'italic',
    color: '#718096',
    fontSize: '0.94rem',
    padding: '8px 0 10px',
    lineHeight: '1.5',
    borderTop: '1px dashed #f0e2e7',
    marginTop: '6px',
    wordBreak: 'break-word',
  },
  phoneticLabel: {
    fontWeight: '600',
    color: '#a0aec0',
    fontStyle: 'normal',
    fontSize: '0.82rem',
  },
  boxFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #edf2f7',
    marginTop: 'auto',
    flexWrap: 'wrap',
    gap: '8px',
  },
  footerButtonsGroup: {
    display: 'flex',
    gap: '8px',
  },
  iconActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  charCount: {
    fontSize: '0.78rem',
    color: '#a0aec0',
  },
};
