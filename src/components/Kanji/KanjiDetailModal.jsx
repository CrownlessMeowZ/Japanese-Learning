import React, { useState, useCallback } from 'react';
import { KanjiCanvasPad } from './KanjiCanvasPad';
import { KanjiStrokeAnimator } from './KanjiStrokeAnimator';

/**
 * KanjiDetailModal - Cửa sổ chi tiết chữ Hán & Bàn luyện viết
 */
export const KanjiDetailModal = ({
  kanjiItem,
  isOpen,
  onClose,
  isLearned = false,
  onToggleLearned,
}) => {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'stroke'

  // Phát âm chữ/từ bằng Web Speech API
  const speak = useCallback((text) => {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  if (!isOpen || !kanjiItem) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={styles.lessonPill}>Bài {kanjiItem.lessonId}</span>
            <span style={styles.strokeCountPill}>{kanjiItem.strokeCount} nét</span>
            {kanjiItem.radical && (
              <span style={styles.radicalPill}>Bộ: {kanjiItem.radical}</span>
            )}
          </div>
          <button type="button" style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Thân Modal */}
        <div style={styles.bodyGrid}>
          {/* CỘT TRÁI: Bàn vẽ luyện viết Canvas & Diễn hoạt nét */}
          <div style={styles.canvasCol}>
            <div style={styles.tabHeader}>
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'write' ? styles.activeTabBtn : {}),
                }}
              >
                ✍️ Tập viết Canvas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stroke')}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === 'stroke' ? styles.activeTabBtn : {}),
                }}
              >
                🎬 Thứ tự nét
              </button>
            </div>

            <div style={styles.practiceContainer}>
              {activeTab === 'write' ? (
                <KanjiCanvasPad
                  targetCharacter={kanjiItem.character}
                  size={240}
                />
              ) : (
                <KanjiStrokeAnimator
                  kanjiItem={kanjiItem}
                  size={240}
                />
              )}
            </div>

            {/* Nút đánh dấu đã thuộc */}
            <button
              type="button"
              onClick={() => onToggleLearned && onToggleLearned(kanjiItem.id || kanjiItem.character)}
              style={{
                ...styles.learnToggleBtn,
                backgroundColor: isLearned ? '#ecfdf5' : '#fff1f2',
                color: isLearned ? '#059669' : '#e11d48',
                borderColor: isLearned ? '#a7f3d0' : '#fecdd3',
              }}
            >
              {isLearned ? '✓ Đã thuộc chữ Hán này' : '○ Đánh dấu đã thuộc'}
            </button>
          </div>

          {/* CỘT PHẢI: Thông tin Hán Việt, On/Kun, Từ ghép */}
          <div style={styles.infoCol}>
            {/* Chữ lớn + Âm Hán Việt */}
            <div style={styles.mainCharRow}>
              <div style={styles.bigCharacter}>{kanjiItem.character}</div>
              <div>
                <div style={styles.hanViet}>{kanjiItem.hanViet}</div>
                <div style={styles.meaning}>{kanjiItem.meaning}</div>
                <button
                  type="button"
                  onClick={() => speak(kanjiItem.character)}
                  style={styles.speakerBtn}
                  title="Nghe phát âm"
                >
                  🔊 Nghe âm
                </button>
              </div>
            </div>

            {/* Bảng âm On / Kun */}
            <div style={styles.readingsBox}>
              <div style={styles.readingRow}>
                <span style={styles.readingLabel}>Âm Onyomi (Hán):</span>
                <span style={styles.readingValue}>
                  {kanjiItem.onyomi && kanjiItem.onyomi.length > 0
                    ? kanjiItem.onyomi.join('、 ')
                    : '—'}
                </span>
              </div>
              <div style={styles.readingRow}>
                <span style={styles.readingLabel}>Âm Kunyomi (Thuần):</span>
                <span style={styles.readingValue}>
                  {kanjiItem.kunyomi && kanjiItem.kunyomi.length > 0
                    ? kanjiItem.kunyomi.join('、 ')
                    : '—'}
                </span>
              </div>
            </div>

            {/* Danh sách từ ghép thực tế */}
            <div style={styles.examplesSection}>
              <div style={styles.examplesTitle}>📖 Từ vựng ghép thông dụng:</div>
              <div style={styles.examplesList}>
                {kanjiItem.examples && kanjiItem.examples.length > 0 ? (
                  kanjiItem.examples.map((ex, idx) => (
                    <div key={idx} style={styles.exampleItem}>
                      <div style={styles.exampleWordRow}>
                        <span style={styles.exampleWord}>{ex.word}</span>
                        <span style={styles.exampleReading}>【{ex.reading}】</span>
                        <button
                          type="button"
                          onClick={() => speak(ex.reading || ex.word)}
                          style={styles.miniSpeaker}
                          title="Nghe từ này"
                        >
                          🔊
                        </button>
                      </div>
                      <div style={styles.exampleMeaning}>👉 {ex.meaning}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Chưa có từ ghép mẫu.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
    animation: 'sakuraFadeOnly 0.2s ease',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    maxWidth: '720px',
    width: '100%',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '24px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 20px 45px rgba(233, 30, 140, 0.18)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '14px',
    borderBottom: '1px solid #fce7f3',
    marginBottom: '18px',
  },
  lessonPill: {
    backgroundColor: '#fce7f3',
    color: '#e91e8c',
    fontSize: '0.8rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  strokeCountPill: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  radicalPill: {
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  bodyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  canvasCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  tabHeader: {
    display: 'flex',
    gap: '6px',
    backgroundColor: '#f1f5f9',
    padding: '4px',
    borderRadius: '14px',
  },
  tabBtn: {
    padding: '6px 14px',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTabBtn: {
    backgroundColor: '#ffffff',
    color: '#e91e8c',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  },
  practiceContainer: {
    margin: '4px 0',
  },
  learnToggleBtn: {
    width: '100%',
    maxWidth: '240px',
    padding: '10px 16px',
    borderRadius: '14px',
    border: '1.5px solid',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  mainCharRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  bigCharacter: {
    fontSize: '4.2rem',
    fontFamily: '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", serif',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 1,
  },
  hanViet: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#e91e8c',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  meaning: {
    fontSize: '0.95rem',
    color: '#334155',
    margin: '2px 0 6px',
    fontWeight: '500',
  },
  speakerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    backgroundColor: '#fff0f6',
    border: '1px solid #fbcfe8',
    borderRadius: '8px',
    fontSize: '0.78rem',
    color: '#e91e8c',
    fontWeight: '600',
    cursor: 'pointer',
  },
  readingsBox: {
    backgroundColor: '#fff9fb',
    borderRadius: '14px',
    padding: '12px 14px',
    border: '1px solid #fce7f3',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  readingRow: {
    display: 'flex',
    gap: '8px',
    fontSize: '0.85rem',
  },
  readingLabel: {
    color: '#64748b',
    fontWeight: '600',
    minWidth: '130px',
  },
  readingValue: {
    color: '#0f172a',
    fontWeight: '700',
  },
  examplesSection: {
    marginTop: '4px',
  },
  examplesTitle: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '8px',
  },
  examplesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '190px',
    overflowY: 'auto',
  },
  exampleItem: {
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    padding: '8px 12px',
    border: '1px solid #f1f5f9',
  },
  exampleWordRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9rem',
    fontWeight: '700',
  },
  exampleWord: {
    color: '#0f172a',
  },
  exampleReading: {
    color: '#e91e8c',
    fontSize: '0.85rem',
  },
  miniSpeaker: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '0 4px',
  },
  exampleMeaning: {
    fontSize: '0.8rem',
    color: '#475569',
    marginTop: '2px',
  },
};
