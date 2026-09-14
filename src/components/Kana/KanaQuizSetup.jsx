import React from 'react';
import { KANA_SECTIONS } from '../../data/kanaData';

/**
 * KanaQuizSetup - Màn hình cấu hình bài kiểm tra phản xạ Kana
 * Cho phép chọn bảng chữ cái, hình thức kiểm tra (gõ phím / trắc nghiệm) và các hàng ký tự
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
            style={{
              ...styles.pillOption,
              ...(quizScript === 'hiragana' ? styles.pillOptionActive : {}),
            }}
            onClick={() => setQuizScript('hiragana')}
          >
            🌸 Hiragana
          </button>
          <button
            type="button"
            style={{
              ...styles.pillOption,
              ...(quizScript === 'katakana' ? styles.pillOptionActive : {}),
            }}
            onClick={() => setQuizScript('katakana')}
          >
            ⚡ Katakana
          </button>
          <button
            type="button"
            style={{
              ...styles.pillOption,
              ...(quizScript === 'both' ? styles.pillOptionActive : {}),
            }}
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
            style={{
              ...styles.pillOption,
              ...(quizMode === 'typing' ? styles.pillOptionActive : {}),
            }}
            onClick={() => setQuizMode('typing')}
          >
            ⌨️ Gõ Phím Phản Xạ (Speed Typing - Tofugu)
          </button>
          <button
            type="button"
            style={{
              ...styles.pillOption,
              ...(quizMode === 'choice' ? styles.pillOptionActive : {}),
            }}
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
            <button type="button" style={styles.quickSelectBtn} onClick={selectAllRows}>
              ✓ Chọn Tất Cả
            </button>
            <button type="button" style={styles.quickSelectBtn} onClick={selectSeionOnly}>
              🌸 Chỉ Âm Cơ Bản (46 chữ)
            </button>
            <button type="button" style={styles.quickSelectBtn} onClick={clearAllRows}>
              ✕ Bỏ Chọn Hết
            </button>
          </div>
        </div>

        {/* Checklist các hàng theo từng nhóm âm */}
        <div style={styles.rowChecklistContainer}>
          {KANA_SECTIONS.map((section) => (
            <div key={section.id} style={{ marginBottom: '16px' }}>
              <div style={styles.sectionDividerTitle}>{section.title}</div>
              <div style={styles.rowsPillsGrid}>
                {section.rows.map((row) => {
                  const isSelected = selectedRows.includes(row.id);
                  const previewChars = row.items.map((it) => it.hira).join(' ');
                  return (
                    <div
                      key={row.id}
                      style={{
                        ...styles.rowCheckPill,
                        ...(isSelected ? styles.rowCheckPillActive : {}),
                      }}
                      onClick={() => toggleRow(row.id)}
                    >
                      <span style={styles.rowCheckbox}>{isSelected ? '✓' : ''}</span>
                      <div>
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
    gap: '10px',
    flexWrap: 'wrap',
  },
  pillOption: {
    padding: '10px 20px',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #cbd5e0',
    borderRadius: '16px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillOptionActive: {
    backgroundColor: '#fff0f6',
    borderColor: '#e91e8c',
    color: '#e91e8c',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.15)',
  },
  rowSelectorToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  quickSelectBtn: {
    padding: '4px 12px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e0',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  rowChecklistContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  sectionDividerTitle: {
    fontSize: '0.84rem',
    fontWeight: '800',
    color: '#64748b',
    marginBottom: '8px',
  },
  rowsPillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '8px',
  },
  rowCheckPill: {
    backgroundColor: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  },
  rowCheckPillActive: {
    borderColor: '#e91e8c',
    backgroundColor: '#fff0f6',
  },
  rowCheckbox: {
    width: '18px',
    height: '18px',
    borderRadius: '6px',
    border: '1.5px solid #cbd5e0',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '900',
    color: '#e91e8c',
  },
  rowCheckName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  rowCheckPreview: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  startActionRow: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
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
    boxShadow: '0 6px 20px rgba(233, 30, 140, 0.35)',
    transition: 'all 0.2s ease',
  },
  startQuizBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
};
