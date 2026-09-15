import React from 'react';
import '../../styles/sakura.css';

/**
 * KanaQuizMultipleChoice - Giao diện trắc nghiệm 4 đáp án cho Kana Quiz
 * Hiển thị 4 lựa chọn Romaji được xáo trộn ngẫu nhiên
 * Hiệu ứng tương tác mượt mà: Di chuột phóng to + hiện viền hồng, di sang chỗ khác bé lại + mất viền
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
          className="kana-choice-btn"
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
    gap: '14px',
    width: '100%',
    maxWidth: '420px',
  },
};
