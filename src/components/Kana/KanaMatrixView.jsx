import React from 'react';
import { KANA_SECTIONS } from '../../data/kanaData';

/**
 * KanaMatrixView - Bảng tra cứu tương tác Kana (Hiragana / Katakana)
 * Hiển thị ma trận ký tự Seion, Dakuon, Yoon kèm phát âm qua Web Speech API
 */
export const KanaMatrixView = ({
  chartScript,
  setChartScript,
  onLaunchQuiz,
  onSpeakKana,
}) => {
  return (
    <div style={styles.cardBox}>
      {/* Sub-toggle: Hiragana vs Katakana */}
      <div style={styles.chartControlBar}>
        <div style={styles.scriptToggleWrap}>
          <button
            type="button"
            style={{
              ...styles.scriptBtn,
              ...(chartScript === 'hiragana' ? styles.scriptBtnActive : {}),
            }}
            onClick={() => setChartScript('hiragana')}
          >
            🌸 Hiragana (Chữ mềm)
          </button>
          <button
            type="button"
            style={{
              ...styles.scriptBtn,
              ...(chartScript === 'katakana' ? styles.scriptBtnActive : {}),
            }}
            onClick={() => setChartScript('katakana')}
          >
            ⚡ Katakana (Chữ cứng)
          </button>
        </div>

        <button
          type="button"
          style={styles.actionLaunchQuizBtn}
          onClick={onLaunchQuiz}
        >
          🚀 Luyện tập bảng này ngay
        </button>
      </div>

      {/* Render Sections (Seion, Dakuon, Yoon) */}
      {KANA_SECTIONS.map((section) => (
        <div key={section.id} style={styles.chartSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>{section.title}</h3>
            <span style={styles.sectionDesc}>{section.description}</span>
          </div>

          <div style={styles.chartRowsContainer}>
            {section.rows.map((row) => (
              <div key={row.id} style={styles.chartRowCard}>
                <div style={styles.rowTitleLabel}>{row.name}</div>
                <div style={styles.kanaGridRow}>
                  {row.items.map((item, idx) => {
                    const char = chartScript === 'hiragana' ? item.hira : item.kata;
                    return (
                      <div
                        key={idx}
                        style={styles.kanaCell}
                        onClick={() => onSpeakKana(char)}
                        title={`Click để nghe phát âm: ${item.romaji}`}
                      >
                        <span style={styles.kanaCharacter}>{char}</span>
                        <span style={styles.kanaRomaji}>{item.romaji}</span>
                        <span style={styles.speakerIcon}>🔊</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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
  chartControlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '18px',
    marginBottom: '20px',
    borderBottom: '1px solid #f8e7ee',
    flexWrap: 'wrap',
    gap: '12px',
  },
  scriptToggleWrap: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    padding: '4px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    gap: '4px',
  },
  scriptBtn: {
    padding: '8px 18px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  scriptBtnActive: {
    backgroundColor: '#ffffff',
    color: '#e91e8c',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  actionLaunchQuizBtn: {
    padding: '10px 22px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.92rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(233, 30, 140, 0.25)',
    transition: 'all 0.2s ease',
  },
  chartSection: {
    marginBottom: '32px',
  },
  sectionHeader: {
    marginBottom: '14px',
  },
  sectionTitle: {
    margin: '0',
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionDesc: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  chartRowsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chartRowCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rowTitleLabel: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  kanaGridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
    gap: '10px',
  },
  kanaCell: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1.5px solid #f1f5f9',
    padding: '10px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  kanaCharacter: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: '1.2',
  },
  kanaRomaji: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#db2777',
    marginTop: '2px',
  },
  speakerIcon: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    fontSize: '0.65rem',
    opacity: 0.4,
  },
};
