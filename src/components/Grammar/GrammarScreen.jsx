import React, { useEffect } from 'react';
import { GrammarCard } from './GrammarCard';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

/**
 * GrammarScreen Component
 * Màn hình danh sách ngữ pháp cuộn dọc (Scrollable), có nút Back và thống kê số điểm ngữ pháp
 */
export const GrammarScreen = ({ lessonId, grammarList = [], onBack }) => {
  const { stopAudio } = useAudioPlayer();

  // Dọn dẹp âm thanh khi rời khỏi màn hình Ngữ pháp
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.headerRow}>
        <button style={styles.backBtn} onClick={onBack}>
          ⬅ Quay lại Dashboard
        </button>
        <div style={styles.metaInfo}>
          <span style={styles.lessonBadge}>Bài {lessonId}</span>
          <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '600' }}>
            {grammarList.length} cấu trúc ngữ pháp
          </span>
        </div>
      </div>

      {/* Screen Title */}
      <div style={styles.titleSection}>
        <h1 style={styles.mainTitle}>
          📝 Ngữ Pháp Dekiru Nihongo - Bài {lessonId}
        </h1>
        <p style={styles.subTitle}>
          Học công thức, giải thích chi tiết và luyện nghe các câu ví dụ thực tế.
        </p>
      </div>

      {/* Empty Fallback State */}
      {grammarList.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={{ fontSize: '3rem' }}>🌱</span>
          <h3 style={{ color: '#2d3748', margin: '14px 0 6px' }}>Đang cập nhật dữ liệu ngữ pháp</h3>
          <p style={{ color: '#718096', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 20px' }}>
            Nội dung ngữ pháp cho Bài {lessonId} đang được hoàn thiện. Bạn có thể học các bài có sẵn (Bài 4, 5, 6, 7).
          </p>
          <button style={styles.primaryBtn} onClick={onBack}>
            Quay về Dashboard
          </button>
        </div>
      ) : (
        /* Vertical Scrollable Grammar List */
        <div style={styles.list}>
          {grammarList.map((item, idx) => (
            <GrammarCard
              key={item.grammar_id || idx}
              item={item}
              lessonId={lessonId}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '24px 16px 60px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backBtn: {
    padding: '8px 18px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  lessonBadge: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  mainTitle: {
    fontSize: '2rem',
    color: '#e91e8c',
    margin: '0 0 8px',
    fontWeight: '700',
  },
  subTitle: {
    fontSize: '1rem',
    color: '#718096',
    margin: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '48px 24px',
    textAlign: 'center',
    border: '1px dashed #cbd5e0',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
  },
  primaryBtn: {
    padding: '10px 24px',
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
