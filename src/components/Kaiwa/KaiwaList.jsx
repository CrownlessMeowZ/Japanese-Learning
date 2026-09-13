import React, { useState, useMemo } from 'react';
import { KaiwaCard } from './KaiwaCard';

export const KaiwaList = ({ items = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchTerm.toLowerCase().trim();
      const matchSearch = !query ||
        item.vietnamese_meaning?.toLowerCase().includes(query) ||
        item.japanese_text?.toLowerCase().includes(query) ||
        item.romaji?.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchTerm]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#e91e8c', fontSize: '2.2rem', marginBottom: '8px' }}>
          🗣️ Mẫu Câu Giao Tiếp (Kaiwa Hub)
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Bấm vào biểu tượng Loa hoặc Thẻ để nghe phát âm. Âm thanh tự động quản lý không bị đè tiếng.
        </p>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm theo nghĩa tiếng Việt, Romaji hoặc Kanji..."
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '12px 18px',
            borderRadius: '25px',
            border: '2px solid #f0e2e7',
            outline: 'none',
            fontSize: '0.95rem',
            margin: '18px auto 14px',
            display: 'block'
          }}
        />

        {/* Categories */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1.5px solid #e91e8c',
                backgroundColor: selectedCategory === cat ? '#e91e8c' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#e91e8c',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredItems.map(item => (
          <KaiwaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
