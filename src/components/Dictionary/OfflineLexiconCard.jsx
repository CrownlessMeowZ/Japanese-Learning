import React from 'react';

/**
 * OfflineLexiconCard - Thẻ hiển thị kết quả bóc tách từ từ điển offline
 * Tra cứu tức thì không cần mạng từ cơ sở dữ liệu 15 bài Dekiru Nihongo
 */
export const OfflineLexiconCard = ({ results, onSpeak }) => {
  if (!results || results.length === 0) return null;

  return (
    <div style={styles.localDictSection}>
      <div style={styles.localDictHeader}>
        <span>📚 Kết quả trong Từ điển Dekiru Nihongo ({results.length} từ khớp):</span>
        <span style={styles.offlineStatusText}>
          ✓ Khả dụng Ngoại tuyến
        </span>
      </div>
      <div style={styles.localDictGrid}>
        {results.map((item, idx) => (
          <div key={item.id || idx} style={styles.localDictCard}>
            <div style={styles.cardTopRow}>
              <div>
                <div style={styles.cardKanji}>
                  {item.kanji}{' '}
                  <span style={styles.cardHiragana}>
                    【{item.hiragana}】
                  </span>
                </div>
                <div style={styles.cardMeaning}>
                  👉 {item.meaning}
                </div>
              </div>
              <button
                type="button"
                style={styles.miniSpeakerBtn}
                onClick={() => onSpeak(item.hiragana || item.kanji, 'ja')}
                title="Nghe phát âm"
              >
                🔊
              </button>
            </div>
            <div style={styles.cardLessonBadge}>
              Bài {item.lessonId} • {item.sectionTitle || 'Từ vựng'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  localDictSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '18px 20px',
    border: '1.5px solid #e2e8f0',
    marginBottom: '22px',
  },
  localDictHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '6px',
  },
  offlineStatusText: {
    fontSize: '0.75rem',
    color: '#059669',
    fontWeight: '700',
  },
  localDictGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '12px',
  },
  localDictCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '12px 14px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  cardKanji: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#2d3748',
  },
  cardHiragana: {
    fontSize: '0.95rem',
    color: '#e91e8c',
    fontWeight: '600',
  },
  cardMeaning: {
    fontSize: '0.95rem',
    color: '#4a5568',
    marginTop: '3px',
  },
  miniSpeakerBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #fce7f3',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  cardLessonBadge: {
    fontSize: '0.75rem',
    color: '#a0aec0',
    marginTop: '6px',
  },
};
