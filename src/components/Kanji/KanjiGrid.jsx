import React from 'react';

/**
 * KanjiGrid - Lưới danh sách các thẻ chữ Hán N5
 */
export const KanjiGrid = ({
  kanjiList = [],
  learnedMap = {},
  onSelectKanji,
}) => {
  if (!kanjiList || kanjiList.length === 0) {
    return (
      <div style={styles.emptyBox}>
        <span style={{ fontSize: '3rem' }}>🔍</span>
        <h3 style={styles.emptyTitle}>Không tìm thấy chữ Hán nào</h3>
        <p style={styles.emptyDesc}>
          Hãy thử đổi từ khóa tìm kiếm hoặc chọn bài học khác.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {kanjiList.map((item) => {
        const isLearned = Boolean(learnedMap[item.id || item.character]);

        return (
          <div
            key={item.id}
            onClick={() => onSelectKanji && onSelectKanji(item)}
            style={{
              ...styles.card,
              borderColor: isLearned ? '#a7f3d0' : '#fce7f3',
              backgroundColor: isLearned ? '#f0fdf4' : '#ffffff',
            }}
          >
            {/* Huy hiệu góc */}
            <div style={styles.badgeRow}>
              <span style={styles.strokeBadge}>{item.strokeCount} nét</span>
              {isLearned && (
                <span style={styles.learnedChip}>✓ Đã nhớ</span>
              )}
            </div>

            {/* Chữ Hán to */}
            <div style={styles.character}>{item.character}</div>

            {/* Âm Hán Việt */}
            <div style={styles.hanViet}>{item.hanViet}</div>

            {/* Nghĩa ngắn gọn */}
            <div style={styles.meaning} title={item.meaning}>
              {item.meaning}
            </div>

            {/* Bài học footer */}
            <div style={styles.cardFooter}>
              <span>Bài {item.lessonId}</span>
              <span style={styles.actionHint}>Tập viết ✍️</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
    gap: '16px',
  },
  card: {
    borderRadius: '18px',
    border: '1.5px solid #fce7f3',
    padding: '16px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(233, 30, 140, 0.05)',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
  },
  badgeRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  strokeBadge: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '2px 7px',
    borderRadius: '8px',
  },
  learnedChip: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  character: {
    fontSize: '3.2rem',
    fontFamily: '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", serif',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 1.1,
    margin: '4px 0',
  },
  hanViet: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#e91e8c',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  meaning: {
    fontSize: '0.8rem',
    color: '#475569',
    margin: '4px 0 10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  cardFooter: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px dashed #fce7f3',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.72rem',
    color: '#94a3b8',
    fontWeight: '600',
  },
  actionHint: {
    color: '#e91e8c',
    fontWeight: '700',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '48px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    border: '1.5px dashed #fce7f3',
  },
  emptyTitle: {
    color: '#1e293b',
    fontSize: '1.2rem',
    margin: '12px 0 6px',
  },
  emptyDesc: {
    color: '#64748b',
    fontSize: '0.9rem',
    margin: 0,
  },
};
