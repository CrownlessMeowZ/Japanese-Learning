import React, { useState, useMemo } from 'react';
import { Flashcard } from './Flashcard';
import { FuriganaText } from '../FuriganaText';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useProgress } from '../../hooks/useProgress';
import { vocabularyData } from '../../data/vocabulary';
import { romajiToHiragana } from '../../utils/romajiConverter';

/**
 * VocabScreen Component
 * Chế độ hiển thị danh sách từ vựng + Chế độ học qua Flashcard 3D
 */
export const VocabScreen = ({
  lessonId = 1,
  vocabularyList = [],
  onBack,
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'flashcard'
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');

  const { playAudio } = useAudioPlayer();
  const { checkIsLearned } = useProgress();

  // Dữ liệu từ vựng của bài học (ưu tiên prop, fallback về dataset)
  const allWords = useMemo(() => {
    if (vocabularyList && vocabularyList.length > 0) return vocabularyList;
    return vocabularyData[String(lessonId)] || [];
  }, [vocabularyList, lessonId]);

  // Bộ lọc sections / Can-do
  const sections = useMemo(() => {
    const set = new Set(allWords.map((w) => w.sectionTitle || w.section).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [allWords]);

  // Lọc từ vựng theo tìm kiếm (hỗ trợ Kanji, Hiragana, Romaji tự chuyển đổi và tiếng Việt)
  const filteredWords = useMemo(() => {
    const rawQ = searchQuery.toLowerCase().trim();
    if (!rawQ) {
      return allWords.filter((item) => {
        return (
          selectedSection === 'all' ||
          item.sectionTitle === selectedSection ||
          item.section === selectedSection
        );
      });
    }

    // Tự động chuyển đổi chuỗi Romaji người dùng gõ sang Hiragana (vd: namae -> なまえ)
    const hiraganaQ = romajiToHiragana(rawQ);

    return allWords.filter((item) => {
      const matchSection =
        selectedSection === 'all' ||
        item.sectionTitle === selectedSection ||
        item.section === selectedSection;

      const meaningLower = item.meaning?.toLowerCase() || '';
      const kanjiLower = item.kanji?.toLowerCase() || '';
      const hiraganaLower = item.hiragana?.toLowerCase() || '';

      const matchSearch =
        meaningLower.includes(rawQ) ||
        kanjiLower.includes(rawQ) ||
        hiraganaLower.includes(rawQ) ||
        (hiraganaQ && (hiraganaLower.includes(hiraganaQ) || kanjiLower.includes(hiraganaQ)));

      return matchSection && matchSearch;
    });
  }, [allWords, selectedSection, searchQuery]);

  // Điều hướng thẻ Flashcard
  const handleNextCard = () => {
    if (filteredWords.length === 0) return;
    setFlashcardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    if (filteredWords.length === 0) return;
    setFlashcardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleStartFlashcard = () => {
    setFlashcardIndex(0);
    setViewMode('flashcard');
  };

  // -------------------------------------------------------------
  // VIEW: FLASHCARD MODE
  // -------------------------------------------------------------
  if (viewMode === 'flashcard') {
    const currentWord = filteredWords[flashcardIndex] || allWords[flashcardIndex];

    return (
      <div key="flashcard-mode" className="sakura-tab-view" style={styles.container}>
        {/* Top Header Flashcard Mode */}
        <div style={styles.topRow}>
          <button
            style={styles.backBtn}
            onClick={() => setViewMode('list')}
          >
            ⬅ Quay lại danh sách
          </button>

          <div style={styles.flashcardMeta}>
            <span style={styles.lessonTag}>Bài {lessonId}</span>
            <span style={{ color: '#718096', fontWeight: '600', fontSize: '0.9rem' }}>
              Flashcard {filteredWords.length > 0 ? flashcardIndex + 1 : 0} / {filteredWords.length}
            </span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', margin: '14px 0 24px' }}>
          <h2 style={{ color: '#e91e8c', fontSize: '1.7rem', margin: '0 0 6px', fontWeight: '800' }}>
            🎴 Luyện Trí Nhớ Flashcard
          </h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>
            Lật thẻ để kiểm tra nghĩa. Chọn [✅ Đã nhớ] hoặc [❌ Chưa thuộc] để thuật toán SM-2 lập lịch ôn tập.
          </p>
        </div>

        {/* Centered Flashcard */}
        <div style={{ margin: '16px 0 24px' }}>
          {currentWord ? (
            <Flashcard
              item={currentWord}
              onNext={handleNextCard}
              onPrev={handlePrevCard}
              currentIndex={flashcardIndex}
              totalCount={filteredWords.length}
            />
          ) : (
            <div style={styles.emptyCard}>
              Không có từ vựng nào trong danh mục này.
            </div>
          )}
        </div>

        {/* Flashcard Nav Controls */}
        <div style={styles.navControls}>
          <button
            style={styles.navBtn}
            onClick={handlePrevCard}
            disabled={filteredWords.length <= 1}
          >
            ◀ Thẻ trước
          </button>

          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#4a5568' }}>
            {filteredWords.length > 0 ? flashcardIndex + 1 : 0} / {filteredWords.length}
          </span>

          <button
            style={styles.navBtn}
            onClick={handleNextCard}
            disabled={filteredWords.length <= 1}
          >
            Thẻ tiếp theo ▶
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: VOCABULARY LIST MODE
  // -------------------------------------------------------------
  return (
    <div key="list-mode" className="sakura-tab-view" style={styles.container}>
      {/* Top Action Row */}
      <div style={styles.topRow}>
        <button style={styles.backBtn} onClick={onBack}>
          ⬅ Quay lại Dashboard
        </button>

        {/* Nút nổi bật: Học qua Flashcard */}
        <button
          style={styles.flashcardHeroBtn}
          onClick={handleStartFlashcard}
          title="Bật chế độ lật thẻ ghi nhớ Flashcard 3D"
        >
          🎴 Học qua Flashcard ({filteredWords.length} từ)
        </button>
      </div>

      {/* Screen Title */}
      <div style={styles.titleSection}>
        <div style={{ display: 'inline-block', marginBottom: '8px' }}>
          <span style={styles.lessonTag}>Bài {lessonId}</span>
        </div>
        <h1 style={styles.mainTitle}>
          📖 Danh Sách Từ Vựng Dekiru Nihongo
        </h1>
        <p style={styles.subTitle}>
          Tổng số: <strong>{allWords.length}</strong> từ vựng chuẩn Dekiru Nihongo Sơ cấp.
        </p>
      </div>

      {/* Filter & Search Section */}
      <div style={styles.filterSection}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm theo Kanji, Hiragana, Romaji (vd: namae) hoặc nghĩa tiếng Việt..."
          style={styles.searchInput}
        />

        {sections.length > 2 && (
          <div style={styles.sectionTabs}>
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`sakura-subtab-btn ${selectedSection === sec ? 'active' : ''}`}
              >
                {sec === 'all' ? 'Tất cả mục' : sec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vocabulary Cards List (Lướt êm ái khi đổi phân loại tab) */}
      <div key={selectedSection} className="sakura-fade-in" style={styles.wordGrid}>
        {filteredWords.map((word, idx) => {
          const isLearned = checkIsLearned(word.id);
          const sound = word.hiragana || word.kanji;

          return (
            <div
              key={word.id || idx}
              style={{
                ...styles.wordCard,
                borderColor: isLearned ? '#a7f3d0' : '#f0e2e7',
                backgroundColor: isLearned ? '#f0fdf4' : '#ffffff',
              }}
            >
              <div style={styles.wordCardHeader}>
                <span style={styles.wordIndex}>#{idx + 1}</span>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isLearned && (
                    <span style={styles.learnedChip}>✓ Đã thuộc</span>
                  )}

                  <button
                    onClick={() => playAudio(sound)}
                    title="Nghe phát âm"
                    style={styles.inlineSpeakerBtn}
                  >
                    🔊
                  </button>
                </div>
              </div>

              {/* Japanese Ruby */}
              <div style={styles.jpWord}>
                <FuriganaText kanji={word.kanji} kana={word.hiragana} />
              </div>

              {/* Meaning */}
              <div style={styles.viMeaning}>
                {word.meaning}
              </div>

              {/* Section Subtitle */}
              {word.sectionTitle && (
                <div style={styles.sectionMeta}>
                  {word.sectionTitle}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '24px 16px 60px',
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
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  },
  flashcardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  lessonTag: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    padding: '4px 14px',
    borderRadius: '14px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  flashcardHeroBtn: {
    padding: '11px 22px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #d81b60 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.95rem',
    boxShadow: '0 4px 16px rgba(233, 30, 140, 0.35)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  titleSection: {
    textAlign: 'center',
    margin: '12px 0 24px',
  },
  mainTitle: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#2d3748',
    margin: '6px 0 8px',
  },
  subTitle: {
    fontSize: '0.95rem',
    color: '#718096',
    margin: 0,
  },
  filterSection: {
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  searchInput: {
    width: '100%',
    maxWidth: '560px',
    padding: '12px 20px',
    borderRadius: '25px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    fontSize: '0.95rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
  },
  sectionTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '800px',
  },
  tabBtn: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#475569',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    borderColor: '#e91e8c',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.25)',
  },
  wordGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  wordCard: {
    borderRadius: '16px',
    padding: '18px 20px',
    border: '1.5px solid #f0e2e7',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  wordCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  wordIndex: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#a0aec0',
  },
  learnedChip: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#d1fae5',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  inlineSpeakerBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid #fce7f3',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  jpWord: {
    fontSize: '1.45rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
  },
  viMeaning: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#4a5568',
    lineHeight: '1.4',
  },
  sectionMeta: {
    fontSize: '0.78rem',
    color: '#a0aec0',
    marginTop: '10px',
    borderTop: '1px dashed #f0e2e7',
    paddingTop: '8px',
  },
  navControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
  },
  navBtn: {
    padding: '10px 22px',
    backgroundColor: '#ffffff',
    color: '#2d3748',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1.5px dashed #cbd5e0',
    color: '#718096',
  },
};
