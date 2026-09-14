import React from 'react';

/**
 * TranslatorInput - Khung textarea nhập liệu, nút đảo chiều ngôn ngữ (JA-VI), nút Micro (STT)
 * Hỗ trợ nhận diện Romaji thông minh, phát âm gốc và gõ phím tắt Ctrl + Enter
 */
export const TranslatorInput = ({
  sourceText,
  onSourceTextChange,
  sourceLang,
  targetLang,
  sourcePhonetic,
  isSwapping,
  isRomajiMisplaced,
  isListening,
  onSwapLanguages,
  onSwitchToJaVi,
  onTranslate,
  onClear,
  onSpeak,
  onToggleListening,
  children,
}) => {
  return (
    <div style={styles.boxWrapper}>
      {/* Box Header: Language Badge, Swap Button, Clear Button */}
      <div style={styles.boxHeader}>
        <div style={styles.langControlWrap}>
          <span style={styles.langBadge}>
            {sourceLang === 'ja' ? '🇯🇵 Tiếng Nhật' : '🇻🇳 Tiếng Việt'}
          </span>

          <button
            type="button"
            className={`translator-swap-btn ${isSwapping ? 'swapping' : ''}`}
            style={styles.swapBtn}
            onClick={onSwapLanguages}
            title={`Đảo chiều ngôn ngữ (${sourceLang.toUpperCase()} ↔ ${targetLang.toUpperCase()})`}
          >
            🔄 Đảo chiều (JA ↔ VI)
          </button>
        </div>

        {sourceText && (
          <button
            type="button"
            style={styles.clearBtn}
            onClick={onClear}
            title="Xóa nội dung"
          >
            ✕ Xóa
          </button>
        )}
      </div>

      {/* Gợi ý thông minh khi gõ Romaji trong khi đang ở chế độ VI */}
      {isRomajiMisplaced && (
        <div style={styles.romajiNotice}>
          <span>
            💡 Phát hiện Romaji tiếng Nhật (<strong>{sourceText}</strong>).
          </span>
          <button
            type="button"
            style={styles.romajiNoticeBtn}
            onClick={onSwitchToJaVi}
          >
            Chuyển sang JA ➔ VI
          </button>
        </div>
      )}

      {/* Textarea nhập liệu chính */}
      <textarea
        style={styles.textarea}
        placeholder={
          sourceLang === 'ja'
            ? 'Nhập tiếng Nhật: Kanji, Hiragana hoặc Romaji (vd: "watashi", "mannaka", "o namae wa")...'
            : 'Nhập tiếng Việt hoặc từ khóa cần dịch...'
        }
        value={sourceText}
        onChange={(e) => onSourceTextChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            onTranslate();
          }
        }}
        rows={6}
      />

      {/* Hiển thị Cách Đọc (Romaji / Hiragana) của ô nguồn */}
      {sourcePhonetic && (
        <div className="phonetic-text" style={styles.phoneticText}>
          <span style={styles.phoneticLabel}>Cách đọc: </span>
          {sourcePhonetic}
        </div>
      )}

      {/* Chèn banner gợi ý sửa lỗi chính tả nếu có */}
      {children}

      {/* Box Footer: Nút Nghe, Nút Micro (STT) và Đếm ký tự */}
      <div style={styles.boxFooter}>
        <div style={styles.footerActionsGroup}>
          <button
            type="button"
            style={styles.iconActionBtn}
            onClick={() => onSpeak(sourceText, sourceLang)}
            disabled={!sourceText.trim()}
            title="Phát âm văn bản gốc (TTS)"
          >
            🔊 Nghe phát âm
          </button>

          {onToggleListening && (
            <button
              type="button"
              style={{
                ...styles.iconActionBtn,
                ...(isListening ? styles.listeningBtnActive : {}),
              }}
              onClick={onToggleListening}
              title="Nhập bằng giọng nói (Micro Web Speech API)"
            >
              {isListening ? '🔴 Đang lắng nghe...' : '🎙️ Giọng nói'}
            </button>
          )}
        </div>

        <span style={styles.charCount}>{sourceText.length} ký tự</span>
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
    backgroundColor: '#ffffff',
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
  langControlWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  langBadge: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '0.84rem',
    fontWeight: '800',
    border: '1px solid #fce7f3',
  },
  swapBtn: {
    backgroundColor: '#ffffff',
    color: '#2d3748',
    border: '1.5px solid #edf2f7',
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#a0aec0',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '700',
  },
  romajiNotice: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '12px',
    fontSize: '0.82rem',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
  },
  romajiNoticeBtn: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
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
    backgroundColor: 'transparent',
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
  footerActionsGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  listeningBtnActive: {
    backgroundColor: '#fff1f2',
    borderColor: '#f43f5e',
    color: '#e11d48',
    animation: 'pulse 1.5s infinite',
  },
  charCount: {
    fontSize: '0.78rem',
    color: '#a0aec0',
  },
};
