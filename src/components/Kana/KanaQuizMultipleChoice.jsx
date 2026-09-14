import React from 'react';

/**
 * KanaQuizMultipleChoice - Giao diện trắc nghiệm 4 đáp án cho Kana Quiz
 * Hiển thị 4 lựa chọn Romaji được xáo trộn ngẫu nhiên
 */
export const KanaQuizMultipleChoice = ({
  choiceOptions,
  onSelectChoice,
}) => {
  return (
    <div style={styles.choiceGrid}>
      {choiceOptions.map((opt, idx) => (
        <button
          key={idx}
          type="button"
          style={styles.choiceBtn}
          onClick={() => onSelectChoice(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

const styles = {
  choiceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    width: '100%',
    maxWidth: '400px',
  },
  choiceBtn: {
    padding: '16px',
    fontSize: '1.25rem',
    fontWeight: '800',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
};
