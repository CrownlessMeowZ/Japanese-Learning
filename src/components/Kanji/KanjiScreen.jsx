import React, { useState, useMemo } from 'react';
import { kanjiData } from '../../data/kanjiData';
import { useProgress } from '../../hooks/useProgress';
import { KanjiGrid } from './KanjiGrid';
import { KanjiDetailModal } from './KanjiDetailModal';

/**
 * KanjiScreen - Màn hình Học & Luyện Viết Hán Tự N5 (Dekiru Nihongo)
 */
export const KanjiScreen = ({ onBack }) => {
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKanji, setActiveKanji] = useState(null);

  const { kanjiLearned, toggleKanjiLearned } = useProgress();

  // Danh sách các bài học có Hán tự
  const availableLessons = useMemo(() => {
    const set = new Set(kanjiData.map((k) => k.lessonId));
    return ['all', ...Array.from(set).sort((a, b) => a - b)];
  }, []);

  // Lọc chữ Hán theo bài học & từ khóa tìm kiếm
  const filteredKanji = useMemo(() => {
    const rawQ = searchQuery.toLowerCase().trim();

    return kanjiData.filter((item) => {
      // 1. Lọc theo bài học
      if (selectedLesson !== 'all' && item.lessonId !== Number(selectedLesson)) {
        return false;
      }

      // 2. Lọc theo tìm kiếm (Chữ Hán, Âm Hán Việt, Nghĩa, Âm On/Kun)
      if (!rawQ) return true;

      const matchChar = item.character.includes(rawQ);
      const matchHanViet = item.hanViet?.toLowerCase().includes(rawQ);
      const matchMeaning = item.meaning?.toLowerCase().includes(rawQ);
      const matchOnyomi = item.onyomi?.some((on) => on.toLowerCase().includes(rawQ));
      const matchKunyomi = item.kunyomi?.some((kun) => kun.toLowerCase().includes(rawQ));

      return matchChar || matchHanViet || matchMeaning || matchOnyomi || matchKunyomi;
    });
  }, [selectedLesson, searchQuery]);

  // Thống kê tiến độ Hán tự
  const stats = useMemo(() => {
    const total = kanjiData.length;
    let learnedCount = 0;
    for (const k of kanjiData) {
      if (kanjiLearned[k.id || k.character]) {
        learnedCount++;
      }
    }
    const percent = total > 0 ? Math.round((learnedCount / total) * 100) : 0;
    return { total, learnedCount, percent };
  }, [kanjiLearned]);

  return (
    <div className="sakura-tab-view" style={styles.container}>
      {/* Top Navigation Row */}
      <div style={styles.topRow}>
        <button type="button" style={styles.backBtn} onClick={onBack}>
          ⬅ Quay lại Dashboard
        </button>

        {/* Thống kê tiến độ học chữ Hán */}
        <div style={styles.statsPill}>
          <span>🈸 Đã thuộc: <strong>{stats.learnedCount}</strong> / {stats.total} chữ Hán</span>
          <span style={styles.percentBadge}>{stats.percent}%</span>
        </div>
      </div>

      {/* Title Header */}
      <div style={styles.titleSection}>
        <h1 style={styles.mainTitle}>
          🈸 Học & Luyện Viết Hán Tự (Kanji N5)
        </h1>
        <p style={styles.subTitle}>
          Nắm vững âm Hán Việt, quy tắc thứ tự nét và tự tay cầm bút luyện viết ngay trên Canvas.
        </p>
      </div>

      {/* Thanh Tìm kiếm & Bộ lọc bài */}
      <div style={styles.filterSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm theo Chữ Hán, Âm Hán Việt (vd: NHẬT, HỌC), nghĩa tiếng Việt..."
          style={styles.searchInput}
        />

        {/* Tab lọc bài học */}
        <div style={styles.lessonTabs}>
          {availableLessons.map((les) => (
            <button
              key={les}
              type="button"
              onClick={() => setSelectedLesson(les)}
              className={`sakura-subtab-btn ${selectedLesson === les ? 'active' : ''}`}
            >
              {les === 'all' ? 'Tất cả bài' : `Bài ${les}`}
            </button>
          ))}
        </div>
      </div>

      {/* Lưới chữ Hán */}
      <div style={{ marginTop: '20px' }}>
        <KanjiGrid
          kanjiList={filteredKanji}
          learnedMap={kanjiLearned}
          onSelectKanji={(item) => setActiveKanji(item)}
        />
      </div>

      {/* Modal Chi tiết & Bàn vẽ Canvas */}
      {activeKanji && (
        <KanjiDetailModal
          kanjiItem={activeKanji}
          isOpen={Boolean(activeKanji)}
          onClose={() => setActiveKanji(null)}
          isLearned={Boolean(kanjiLearned[activeKanji.id || activeKanji.character])}
          onToggleLearned={(id) => toggleKanjiLearned(id)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '24px 16px 80px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backBtn: {
    padding: '9px 18px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #cbd5e0',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  statsPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#ffffff',
    border: '1.5px solid #fce7f3',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#475569',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.06)',
  },
  percentBadge: {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    fontSize: '0.8rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  mainTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 8px',
    letterSpacing: '-0.5px',
  },
  subTitle: {
    fontSize: '0.95rem',
    color: '#64748b',
    margin: 0,
    lineHeight: 1.5,
  },
  filterSection: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '18px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 4px 16px rgba(233, 30, 140, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 18px',
    fontSize: '0.95rem',
    borderRadius: '14px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  lessonTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
};
