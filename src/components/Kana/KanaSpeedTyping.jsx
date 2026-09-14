import React from 'react';

/**
 * KanaSpeedTyping - Chế độ luyện gõ phím Romaji phản xạ nhanh (Tofugu style)
 * Tự động chuyển câu khi gõ đúng Romaji hoặc phím tắt alts
 */
export const KanaSpeedTyping = ({
  inputRef,
  typedInput,
  isInputShaking,
  onChange,
  onKeyDown,
  onSkip,
}) => {
  return (
    <div style={styles.typingInputWrap}>
      <input
        ref={inputRef}
        type="text"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder="Gõ Romaji vào đây (vd: a, ka, shi)..."
        value={typedInput}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={isInputShaking ? 'shake-animation' : ''}
        style={{
          ...styles.typingInput,
          borderColor: isInputShaking ? '#f43f5e' : '#cbd5e0',
          backgroundColor: isInputShaking ? '#fff1f2' : '#ffffff',
        }}
      />

      <div style={styles.typingHelperRow}>
        <button
          type="button"
          style={styles.skipBtn}
          onClick={onSkip}
        >
          ❓ Không nhớ / Xem đáp án
        </button>
        <span style={{ fontSize: '0.78rem', color: '#a0aec0' }}>
          💡 Tự động chuyển câu khi gõ đúng
        </span>
      </div>
    </div>
  );
};

const styles = {
  typingInputWrap: {
    width: '100%',
    maxWidth: '380px',
  },
  typingInput: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.35rem',
    fontWeight: '800',
    textAlign: 'center',
    borderRadius: '20px',
    border: '2px solid #cbd5e0',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  typingHelperRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: '#e11d48',
    fontWeight: '700',
    fontSize: '0.82rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
};
