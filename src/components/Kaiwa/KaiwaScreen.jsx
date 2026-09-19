import React, { useEffect, useMemo, useState } from 'react';
import { KaiwaCard } from './KaiwaCard';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

import { kaiwaData } from '../../data/kaiwaData';

export const DEFAULT_KAIWA_BY_LESSON = kaiwaData;

/**
 * KaiwaScreen Component
 * Màn hình danh sách hội thoại & luyện nói (Speech Recognition) theo bài học
 */
export const KaiwaScreen = ({ lessonId, kaiwaList = [], onBack }) => {
  const { stopAudio } = useAudioPlayer();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dọn dẹp âm thanh singleton khi rời màn hình
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Dữ liệu hiển thị (kết hợp data truyền vào hoặc fallback theo lessonId)
  const items = useMemo(() => {
    if (kaiwaList && kaiwaList.length > 0) return kaiwaList;
    return kaiwaData[lessonId] || kaiwaData[String(lessonId)] || [];
  }, [lessonId, kaiwaList]);

  // Categories filter
  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [items]);

  // Filter items theo category & search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !q ||
        item.vietnamese_meaning?.toLowerCase().includes(q) ||
        item.japanese_text?.toLowerCase().includes(q) ||
        item.romaji?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div style={styles.container}>
      {/* Top Header Row */}
      <div style={styles.headerRow}>
        <button style={styles.backBtn} onClick={onBack}>
          ⬅ Quay lại Dashboard
        </button>
        <div style={styles.metaInfo}>
          <span style={styles.lessonBadge}>Bài {lessonId}</span>
          <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: '600' }}>
            {filteredItems.length}/{items.length} mẫu câu giao tiếp
          </span>
        </div>
      </div>

      {/* Title Section */}
      <div style={styles.titleSection}>
        <h1 style={styles.mainTitle}>
          🗣️ Giao Tiếp & Luyện Giọng Nói - Bài {lessonId}
        </h1>
        <p style={styles.subTitle}>
          Lắng nghe phát âm chuẩn bằng loa 🔊 và bấm mic 🎤 để đọc thử, hệ thống AI sẽ phân tích tỷ lệ chính xác tức thì.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={styles.filterSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm kiếm mẫu câu, ý nghĩa tiếng Việt, romaji..."
          style={styles.searchInput}
        />

        {categories.length > 2 && (
          <div style={styles.categoryRow}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  ...styles.categoryBtn,
                  ...(selectedCategory === cat ? styles.categoryBtnActive : {}),
                }}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Kaiwa Cards Grid */}
      {filteredItems.length === 0 ? (
        <div style={styles.emptyCard}>
          <span style={{ fontSize: '3rem' }}>💬</span>
          <h3 style={{ color: '#2d3748', margin: '14px 0 6px' }}>Không tìm thấy mẫu câu phù hợp</h3>
          <p style={{ color: '#718096', fontSize: '0.92rem' }}>
            Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredItems.map((item) => (
            <KaiwaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '960px',
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
    transition: 'all 0.2s ease',
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  lessonBadge: {
    backgroundColor: '#15803d',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '14px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  titleSection: {
    textAlign: 'center',
    margin: '10px 0 24px',
  },
  mainTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#15803d',
    margin: '0 0 8px',
  },
  subTitle: {
    fontSize: '0.95rem',
    color: '#718096',
    maxWidth: '620px',
    margin: '0 auto',
    lineHeight: '1.5',
  },
  filterSection: {
    marginBottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '520px',
    padding: '12px 20px',
    borderRadius: '25px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    fontSize: '0.95rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
    transition: 'border-color 0.2s',
  },
  categoryRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryBtn: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  categoryBtnActive: {
    backgroundColor: '#15803d',
    color: '#ffffff',
    borderColor: '#15803d',
    boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1.5px dashed #cbd5e1',
    margin: '20px 0',
  },
};
