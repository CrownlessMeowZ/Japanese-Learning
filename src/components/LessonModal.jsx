import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { vocabularyData } from '../data/vocabulary';
import { grammarData } from '../data/grammar';
import '../styles/sakura.css';

/**
 * LessonModal Component (Progressive Disclosure Pattern)
 * Giảm tải Cognitive Overload trên Dashboard bằng cách gom 4 kỹ năng vào Modal chuyên dụng:
 * 1. 📖 Từ Vựng (Flashcard 3D)
 * 2. 📝 Ngữ Pháp (Cấu trúc & ví dụ)
 * 3. 🗣️ Giao Tiếp (Luyện phát âm AI)
 * 4. 🎯 Quiz (Thuật toán SM-2)
 */
export const LessonModal = ({
  lessonId,
  onClose,
  onSelectVocab,
  onSelectGrammar,
  onSelectKaiwa,
  onSelectQuiz,
}) => {
  // Lấy dữ liệu bài học để hiển thị số liệu thực tế
  const words = vocabularyData[String(lessonId)] || [];
  const grammars = grammarData[lessonId] || grammarData[String(lessonId)] || [];
  const isQuizDisabled = words.length < 4;

  // Khóa cuộn trang nền khi mở Modal
  useEffect(() => {
    if (!lessonId) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lessonId]);

  // Hỗ trợ phím ESC để đóng Modal thuận tiện
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lessonId) return null;

  const handleAction = (callback) => {
    if (callback) {
      callback(lessonId);
    }
    onClose();
  };

  return createPortal(
    <div
      className="lesson-modal-overlay"
      onClick={(e) => {
        // Chỉ đóng khi click trực tiếp vào backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-modal-title"
    >
      <div className="lesson-modal-box">
        {/* Modal Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.subTitleBadge}>
              🌸 Dekiru Nihongo • 第{lessonId}課
            </div>
            <h3 id="lesson-modal-title" style={styles.title}>
              Bài {lessonId} - Chọn kỹ năng
            </h3>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Đóng cửa sổ"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Modal Body: 4 Skill Action Cards */}
        <div style={styles.body}>
          {/* 1. 📖 Từ Vựng */}
          <button
            type="button"
            className="skill-card-item skill-vocab"
            onClick={() => handleAction(onSelectVocab)}
          >
            <div className="skill-icon-circle" style={{ backgroundColor: '#fff0f6', color: '#e91e8c' }}>
              📖
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.skillHeaderRow}>
                <span style={styles.skillTitle}>Từ Vựng</span>
                <span className="skill-badge" style={{ backgroundColor: '#fff0f6', color: '#e91e8c' }}>
                  {words.length} từ
                </span>
              </div>
              <p style={styles.skillDesc}>
                Flashcard 3D lật thẻ, âm thanh chuẩn & ghi nhớ Kanji
              </p>
            </div>
            <span className="skill-arrow">➔</span>
          </button>

          {/* 2. 📝 Ngữ Pháp */}
          <button
            type="button"
            className="skill-card-item skill-grammar"
            onClick={() => handleAction(onSelectGrammar)}
          >
            <div className="skill-icon-circle" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
              📝
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.skillHeaderRow}>
                <span style={styles.skillTitle}>Ngữ Pháp</span>
                <span className="skill-badge" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                  {grammars.length} mẫu
                </span>
              </div>
              <p style={styles.skillDesc}>
                Cấu trúc câu, giải thích chi tiết & ví dụ song ngữ
              </p>
            </div>
            <span className="skill-arrow">➔</span>
          </button>

          {/* 3. 🗣️ Giao Tiếp */}
          <button
            type="button"
            className="skill-card-item skill-kaiwa"
            onClick={() => handleAction(onSelectKaiwa)}
          >
            <div className="skill-icon-circle" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
              🗣️
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.skillHeaderRow}>
                <span style={styles.skillTitle}>Giao Tiếp</span>
                <span className="skill-badge" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
                  AI Voice
                </span>
              </div>
              <p style={styles.skillDesc}>
                Luyện phát âm giọng nói & chấm điểm phản xạ thực tế
              </p>
            </div>
            <span className="skill-arrow">➔</span>
          </button>

          {/* 4. 🎯 Quiz */}
          <button
            type="button"
            className="skill-card-item skill-quiz"
            onClick={() => handleAction(onSelectQuiz)}
            disabled={isQuizDisabled}
            title={isQuizDisabled ? 'Cần tối thiểu 4 từ vựng để tạo bài Quiz' : ''}
          >
            <div className="skill-icon-circle" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
              🎯
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.skillHeaderRow}>
                <span style={styles.skillTitle}>Trắc Nghiệm (Quiz)</span>
                <span className="skill-badge" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                  SM-2 SRS
                </span>
              </div>
              <p style={styles.skillDesc}>
                {isQuizDisabled
                  ? '⚠️ Cần tối thiểu 4 từ vựng để tạo bài trắc nghiệm'
                  : 'Ôn tập thông minh theo thuật toán Spaced Repetition'}
              </p>
            </div>
            <span className="skill-arrow">➔</span>
          </button>
        </div>

        {/* Modal Footer Note */}
        <div style={styles.footer}>
          <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
            💡 Mẹo: Nhấn phím <kbd style={styles.kbd}>Esc</kbd> hoặc bấm ra ngoài để quay lại
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

const styles = {
  header: {
    padding: '24px 24px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid #f8e7ee',
  },
  subTitleBadge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#e91e8c',
    marginBottom: '4px',
    letterSpacing: '0.2px',
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#2d3748',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  body: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skillHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '3px',
  },
  skillTitle: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  skillDesc: {
    fontSize: '0.84rem',
    color: '#718096',
    margin: 0,
    lineHeight: '1.4',
  },
  footer: {
    padding: '12px 24px 20px',
    textAlign: 'center',
    backgroundColor: '#fffdfd',
    borderTop: '1px solid #faf0f4',
    borderBottomLeftRadius: '26px',
    borderBottomRightRadius: '26px',
  },
  kbd: {
    backgroundColor: '#edf2f7',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontFamily: 'monospace',
    color: '#4a5568',
  },
};
