import React from 'react';

/**
 * SpellSuggestionChip - Banner gợi ý sửa lỗi chính tả ("Did you mean...?")
 * Tích hợp từ Google AI Spellcheck và bộ Levenshtein Fuzzy Matcher nội bộ
 */
export const SpellSuggestionChip = ({ suggestion, onApply }) => {
  if (!suggestion) return null;

  return (
    <div className="sakura-spellcheck-banner" style={styles.banner}>
      <span style={styles.label}>💡 Có phải bạn muốn tìm:</span>
      <button
        type="button"
        className="sakura-spellcheck-suggestion"
        onClick={() => onApply(suggestion.text)}
        title="Bấm để tự động sửa và dịch từ này"
        style={styles.suggestionBtn}
      >
        👉 {suggestion.display}
      </button>
    </div>
  );
};

const styles = {
  banner: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: '600',
    fontSize: '0.86rem',
    color: '#9f1239',
  },
  suggestionBtn: {
    background: 'none',
    border: 'none',
    color: '#e11d48',
    fontWeight: '700',
    fontSize: '0.86rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '2px 6px',
    borderRadius: '8px',
  },
};
