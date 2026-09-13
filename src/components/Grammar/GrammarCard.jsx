import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useProgress } from '../../hooks/useProgress';
import { FuriganaText } from '../FuriganaText';

/**
 * ExampleItem Component
 * Một câu ví dụ ngữ pháp kèm nút phát âm Audio riêng biệt
 */
const ExampleItem = React.memo(({ example }) => {
  const soundTarget = example.audio_url || example.japanese;
  const { isPlaying, playAudio } = useAudioPlayer(soundTarget);

  return (
    <div style={styles.exampleItem}>
      <div style={{ flex: 1 }}>
        <div style={styles.exampleJp}>
          <FuriganaText
            text={example.furigana}
            kanji={example.japanese}
            kana={example.furigana}
          />
        </div>
        {example.romaji && (
          <div style={styles.exampleRomaji}>{example.romaji}</div>
        )}
        <div style={styles.exampleVi}>{example.vietnamese}</div>
      </div>

      <button
        onClick={() => playAudio(soundTarget)}
        title={isPlaying ? 'Dừng phát' : 'Nghe phát âm'}
        style={{
          ...styles.speakerBtn,
          ...(isPlaying ? styles.speakerBtnActive : {})
        }}
      >
        {isPlaying ? '⏸' : '🔊'}
      </button>
    </div>
  );
});

/**
 * GrammarCard Component
 * Hiển thị cấu trúc ngữ pháp, giải thích, câu ví dụ và nút "Đánh dấu đã hiểu"
 */
export const GrammarCard = React.memo(({ item, lessonId, index }) => {
  const grammarId = item.grammar_id || `L${String(lessonId).padStart(2, '0')}_G${index + 1}`;
  const { checkIsLearned, markAsLearned } = useProgress();
  const isLearned = checkIsLearned(grammarId);

  const handleToggleLearned = () => {
    markAsLearned(grammarId, 'grammar');
  };

  return (
    <div style={{
      ...styles.card,
      border: isLearned ? '2px solid #28a745' : '1.5px solid #f0e2e7',
      boxShadow: isLearned ? '0 6px 20px rgba(40, 167, 69, 0.12)' : '0 4px 14px rgba(0, 0, 0, 0.04)',
    }}>
      {/* Header: Title + Tag + Mark as Learned Button */}
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.badgeRow}>
            <span style={styles.grammarTag}>Ngữ pháp {index + 1}</span>
            {item.level && <span style={styles.levelTag}>{item.level}</span>}
            {isLearned && <span style={styles.learnedBadge}>✓ Đã hiểu</span>}
          </div>
          <h3 style={styles.title}>{item.title}</h3>
          {(item.titleVi || item.meaning_vi || item.meaning) && (
            <div style={styles.meaning}>
              💡 {item.titleVi || item.meaning_vi || item.meaning}
            </div>
          )}
        </div>

        <button
          onClick={handleToggleLearned}
          style={{
            ...styles.learnedBtn,
            ...(isLearned ? styles.learnedBtnActive : {})
          }}
        >
          {isLearned ? '✓ Đã nắm vững' : 'Đánh dấu đã hiểu'}
        </button>
      </div>

      {/* Structure Box */}
      <div style={styles.structureBox}>
        <div style={styles.structureLabel}>CÔNG THỨC:</div>
        <div style={styles.structureText}>{item.structure}</div>
      </div>

      {/* Explanation */}
      {item.explanation && (
        <div style={styles.explanationSection}>
          <div style={styles.sectionLabel}>Giải thích:</div>
          <p style={styles.explanationText}>{item.explanation}</p>
        </div>
      )}

      {/* Examples List */}
      {Array.isArray(item.examples) && item.examples.length > 0 && (
        <div style={styles.examplesSection}>
          <div style={styles.sectionLabel}>Ví dụ thực tế ({item.examples.length}):</div>
          <div style={styles.examplesList}>
            {item.examples.map((ex, exIdx) => (
              <ExampleItem key={exIdx} example={ex} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    marginBottom: '22px',
    transition: 'all 0.25s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  badgeRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  grammarTag: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  levelTag: {
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  learnedBadge: {
    backgroundColor: '#eafaf1',
    color: '#28a745',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '1.4rem',
    color: '#2d3748',
    margin: '0 0 6px',
    fontWeight: '700',
  },
  meaning: {
    fontSize: '1.05rem',
    color: '#e91e8c',
    fontWeight: '600',
  },
  learnedBtn: {
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  learnedBtnActive: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    borderColor: '#28a745',
    boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
  },
  structureBox: {
    backgroundColor: '#fff5f8',
    borderRadius: '12px',
    padding: '14px 18px',
    borderLeft: '4px solid #e91e8c',
    margin: '14px 0 16px',
  },
  structureLabel: {
    fontSize: '0.75rem',
    color: '#e91e8c',
    fontWeight: '800',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  structureText: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  explanationSection: {
    margin: '12px 0 16px',
  },
  sectionLabel: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#718096',
    marginBottom: '6px',
  },
  explanationText: {
    fontSize: '0.95rem',
    color: '#4a5568',
    lineHeight: '1.6',
    margin: 0,
  },
  examplesSection: {
    borderTop: '1px dashed #edf2f7',
    paddingTop: '14px',
    marginTop: '14px',
  },
  examplesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  exampleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #edf2f7',
  },
  exampleJp: {
    fontSize: '1.15rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '4px',
  },
  exampleRomaji: {
    fontSize: '0.85rem',
    color: '#718096',
    fontStyle: 'italic',
    marginBottom: '2px',
  },
  exampleVi: {
    fontSize: '0.92rem',
    color: '#4a5568',
  },
  speakerBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#ffffff',
    color: '#e91e8c',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.2s',
  },
  speakerBtnActive: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    boxShadow: '0 0 12px rgba(233, 30, 140, 0.4)',
  },
};
