import React from 'react';
import { getKanaSections } from '../../data/kanaData';
import '../../styles/sakura.css';

/**
 * KanaQuizSetup - Màn hình cấu hình bài kiểm tra phản xạ Kana
 * Tích hợp hiệu ứng hoạt họa tương tác:
 * - Rê chuột vào ô: Phóng to + Hiện viền hồng
 * - Rời chuột sang chỗ khác: Bé lại về kích thước thường + Mất viền
 * - Khi chọn cái khác: Thẻ cũ tự động mất viền bao quát hoàn toàn
 */
export const KanaQuizSetup = ({
  quizScript,
  setQuizScript,
  quizMode,
  setQuizMode,
  selectedRows,
  toggleRow,
  selectAllRows,
  selectSeionOnly,
  clearAllRows,
  totalSelectedChars,
  onStartQuiz,
}) => {
  const sections = getKanaSections(quizScript);

  return (
    <div style={styles.cardBox}>
      <div style={styles.setupHeader}>
        <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#2d3748', fontWeight: '800' }}>
          🎯 Tùy Chọn Bài Kiểm Tra Phản Xạ
        </h2>
        <p style={{ color: '#718096', fontSize: '0.92rem', margin: '4px 0 0' }}>
          Tùy chỉnh linh hoạt các hàng chữ bạn muốn rèn luyện (theo phương pháp chủ động Tofugu)
        </p>
      </div>

      {/* 1. Chọn bảng chữ cái */}
      <div style={styles.setupBlock}>
        <label style={styles.setupBlockLabel}>1. Chọn Bảng Chữ Cái:</label>
        <div style={styles.pillGroup}>
          <button
            type="button"
            className={`kana-pill-option ${quizScript === 'hiragana' ? 'active' : ''}`}
            onClick={() => setQuizScript('hiragana')}
          >
            🌸 Hiragana
          </button>
          <button
            type="button"
            className={`kana-pill-option ${quizScript === 'katakana' ? 'active' : ''}`}
            onClick={() => setQuizScript('katakana')}
          >
            ⚡ Katakana
          </button>
          <button
            type="button"
            className={`kana-pill-option ${quizScript === 'both' ? 'active' : ''}`}
            onClick={() => setQuizScript('both')}
          >
            🔄 Trộn Lẫn Cả 2 Bảng
          </button>
        </div>
      </div>

      {/* 2. Chọn hình thức kiểm tra */}
      <div style={styles.setupBlock}>
        <label style={styles.setupBlockLabel}>2. Chọn Hình Thức Kiểm Tra:</label>
        <div style={styles.pillGroup}>
          <button
            type="button"
            className={`kana-pill-option ${quizMode === 'typing' ? 'active' : ''}`}
            onClick={() => setQuizMode('typing')}
          >
            ⌨️ Gõ Phím Phản Xạ (Speed Typing - Tofugu)
          </button>
          <button
            type="button"
            className={`kana-pill-option ${quizMode === 'choice' ? 'active' : ''}`}
            onClick={() => setQuizMode('choice')}
          >
            🔘 Trắc Nghiệm 4 Đáp Án (Multiple Choice)
          </button>
        </div>
      </div>

      {/* 3. Bộ lọc tuyển chọn hàng chữ cái */}
      <div style={styles.setupBlock}>
        <div style={styles.rowSelectorToolbar}>
          <label style={styles.setupBlockLabel}>
            3. Chọn Hàng Chữ Luyện Tập ({totalSelectedChars} ký tự đã chọn):
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className="kana-quick-btn" onClick={selectAllRows}>
              ✓ Chọn Tất Cả
            </button>
            <button type="button" className="kana-quick-btn" onClick={selectSeionOnly}>
              🌸 Chỉ Âm Cơ Bản (46 chữ)
            </button>
            <button type="button" className="kana-quick-btn" onClick={clearAllRows}>
              ✕ Bỏ Chọn Hết
            </button>
          </div>
        </div>

        {/* Checklist các hàng theo từng nhóm âm */}
        <div style={styles.rowChecklistContainer}>
          {sections.map((section) => (
            <div key={section.id} style={{ marginBottom: '18px' }}>
              <div style={styles.sectionDividerTitle}>{section.title}</div>
              <div style={styles.rowsPillsGrid}>
                {section.rows.map((row) => {
                  const isSelected = selectedRows.includes(row.id);

                  // Preview chữ cái đúng theo bảng đang chọn (Hiragana, Katakana hoặc Cả hai)
                  const previewChars = row.items
                    .map((it) => {
                      if (quizScript === 'katakana') {
                        return it.kata;
                      }
                      if (quizScript === 'both') {
                        return it.hira ? `${it.hira}/${it.kata}` : it.kata;
                      }
                      return it.hira || it.kata;
                    })
                    .join(' ');

                  return (
                    <div
                      key={row.id}
                      className={`kana-row-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleRow(row.id)}
                    >
                      <span
                        style={{
                          ...styles.rowCheckbox,
                          ...(isSelected ? styles.rowCheckboxActive : {}),
                        }}
                      >
                        {isSelected ? '✓' : ''}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={styles.rowCheckName}>{row.name}</div>
                        <div style={styles.rowCheckPreview}>{previewChars}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Action Button */}
      <div style={styles.startActionRow}>
        <button
          type="button"
          style={{
            ...styles.startQuizLargeBtn,
            ...(totalSelectedChars === 0 ? styles.startQuizBtnDisabled : {}),
          }}
          onClick={onStartQuiz}
          disabled={totalSelectedChars === 0}
        >
          🚀 Bắt Đầu Kiểm Tra ({totalSelectedChars} ký tự)
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
  setupHeader: {
    marginBottom: '20px',
    borderBottom: '1px solid #f8e7ee',
    paddingBottom: '16px',
  },
  setupBlock: {
    marginBottom: '22px',
  },
  setupBlockLabel: {
    display: 'block',
    fontSize: '0.94rem',
    fontWeight: '800',
    color: '#334155',
    marginBottom: '10px',
  },
  pillGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  rowSelectorToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  rowChecklistContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '16px',
    border: '1px solid #f1f5f9',
    maxHeight: '440px',
    overflowY: 'auto',
  },
  sectionDividerTitle: {
    fontSize: '0.86rem',
    fontWeight: '800',
    color: '#475569',
    marginBottom: '10px',
    paddingBottom: '4px',
    borderBottom: '1px dashed #e2e8f0',
  },
  rowsPillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '10px',
  },
  rowCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '900',
    color: '#ffffff',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  rowCheckboxActive: {
    borderColor: '#e91e8c',
    backgroundColor: '#e91e8c',
    color: '#ffffff',
  },
  rowCheckName: {
    fontSize: '0.86rem',
    fontWeight: '700',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rowCheckPreview: {
    fontSize: '0.78rem',
    color: '#64748b',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  startActionRow: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '18px',
    borderTop: '1px solid #f8e7ee',
  },
  startQuizLargeBtn: {
    padding: '14px 44px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 50%, #f43f5e 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '1.05rem',
    fontWeight: '800',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 6px 20px rgba(233, 30, 140, 0.35)',
    transition: 'all 0.2s ease',
  },
  startQuizBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};
