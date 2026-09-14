import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import LessonSelector from '../components/LessonSelector';
import { vocabularyData, lessonMeta } from '../data/vocabulary';

const VocabularyPage = () => {
  const { lessonId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [learnedWords, setLearnedWords] = useState({});
  const [showAllMeanings, setShowAllMeanings] = useState(false);
  const [revealedWords, setRevealedWords] = useState({});

  const normalizedId = lessonId ? String(lessonId).replace('lesson', '') : null;

  // Reset selected sub-section when switching lessons
  useEffect(() => {
    setSelectedSection('all');
  }, [lessonId]);

  const currentLessonMeta = normalizedId ? lessonMeta[normalizedId] : null;

  const lessonData = useMemo(() => {
    if (!normalizedId) {
      const allWords = [];
      Object.keys(vocabularyData).forEach((id) => {
        vocabularyData[id].forEach((w) => {
          allWords.push({ ...w, lesson: id });
        });
      });
      return allWords;
    }
    const words = vocabularyData[normalizedId] || [];
    return words.map((w) => ({ ...w, lesson: normalizedId }));
  }, [normalizedId]);

  useEffect(() => {
    const saved = localStorage.getItem('japaneseProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLearnedWords(parsed.learnedWords || {});
      } catch (e) {
        console.error('Error loading progress', e);
      }
    }
  }, []);

  const saveProgress = (newLearned) => {
    const saved = localStorage.getItem('japaneseProgress') || '{}';
    try {
      const parsed = JSON.parse(saved);
      parsed.learnedWords = newLearned;
      localStorage.setItem('japaneseProgress', JSON.stringify(parsed));
    } catch (e) {
      console.error('Error saving progress', e);
    }
  };

  const toggleLearned = (kanji) => {
    const newLearned = { ...learnedWords, [kanji]: !learnedWords[kanji] };
    setLearnedWords(newLearned);
    saveProgress(newLearned);
  };

  const toggleReveal = (index) => {
    setRevealedWords((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const filteredWords = useMemo(() => {
    let result = lessonData;

    // Filter by sub-section if selected
    if (selectedSection !== 'all') {
      result = result.filter((w) => w.section === selectedSection);
    }

    if (!searchTerm) return result;
    const lower = searchTerm.toLowerCase().trim();

    // Check if user is searching for a lesson number, e.g., "bài 1", "bai 1", "bài 2"
    const lessonMatch = lower.match(/(?:bài|bai|lesson)\s*(\d+)/i);
    const targetLesson = lessonMatch ? lessonMatch[1] : null;

    return result.filter((word) => {
      if (targetLesson && String(word.lesson) === targetLesson) {
        return true;
      }
      return (
        (word.kanji && word.kanji.toLowerCase().includes(lower)) ||
        (word.hiragana && word.hiragana.toLowerCase().includes(lower)) ||
        (word.meaning && word.meaning.toLowerCase().includes(lower)) ||
        (word.section && word.section.includes(lower)) ||
        (word.sectionTitle && word.sectionTitle.toLowerCase().includes(lower)) ||
        (word.lesson && `bài ${word.lesson}`.includes(lower))
      );
    });
  }, [lessonData, selectedSection, searchTerm]);

  // Group filtered words by sub-section for clean layout
  const groupedWords = useMemo(() => {
    const groups = {};
    filteredWords.forEach((word) => {
      const secKey = word.sectionTitle || `Phần ${word.section || 'Khác'}`;
      if (!groups[secKey]) {
        groups[secKey] = [];
      }
      groups[secKey].push(word);
    });
    return groups;
  }, [filteredWords]);

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#fff5f5',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
    },
    header: {
      textAlign: 'center',
      color: '#e91e8c',
      marginBottom: '20px',
    },
    subHeader: {
      textAlign: 'center',
      color: '#666',
      fontSize: '1.05rem',
      marginTop: '-10px',
      marginBottom: '25px',
    },
    sectionNav: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '20px',
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(233, 30, 140, 0.08)',
    },
    sectionBtn: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: '1.5px solid #ffccd8',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    controls: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(233, 30, 140, 0.1)',
    },
    input: {
      padding: '10px 15px',
      borderRadius: '25px',
      border: '1.5px solid #e91e8c',
      width: '320px',
      outline: 'none',
      fontSize: '1rem',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#e91e8c',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(233, 30, 140, 0.2)',
    },
    sectionTitleBanner: {
      fontSize: '1.25rem',
      color: '#2c3e50',
      backgroundColor: '#fff',
      padding: '12px 20px',
      borderRadius: '10px',
      borderLeft: '5px solid var(--primary)',
      marginTop: '30px',
      marginBottom: '15px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '16px',
      marginBottom: '20px',
    },
    card: {
      backgroundColor: 'white',
      padding: '18px',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'all 0.2s',
      position: 'relative',
      borderTop: '4px solid #ff6b9d',
    },
    sectionBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      fontSize: '0.75rem',
      backgroundColor: '#fff0f5',
      color: '#e91e8c',
      padding: '2px 8px',
      borderRadius: '10px',
      fontWeight: 'bold',
    },
    kanji: {
      fontSize: '2.1rem',
      fontWeight: 'bold',
      color: '#222',
      marginBottom: '4px',
      marginTop: '10px',
    },
    hiragana: {
      fontSize: '1.15rem',
      color: '#666',
      marginBottom: '10px',
    },
    meaning: {
      fontSize: '1.05rem',
      color: '#e91e8c',
      padding: '10px 14px',
      backgroundColor: '#fff5f8',
      borderRadius: '8px',
      width: '100%',
      cursor: 'pointer',
      minHeight: '46px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      border: '1px dashed #ffb3c6',
    },
    checkbox: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      cursor: 'pointer',
      width: '20px',
      height: '20px',
      accentColor: '#e91e8c',
    },
    audioBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      marginBottom: '6px',
      padding: '4px 8px',
      borderRadius: '50%',
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: '#888',
      fontSize: '1.1rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        📖 Từ Vựng Giáo Trình Dekiru Nihongo Sơ Cấp (Quyển Hồng)
      </h1>
      <p style={styles.subHeader}>
        {normalizedId
          ? `Đang học: Bài ${normalizedId} - Gồm 3 phần mục tiêu Can-do`
          : 'Tổng hợp trọn bộ 15 Bài (~945 từ vựng kèm chữ Hán, Hiragana và phân mục 1.1, 1.2, 1.3...)'}
      </p>

      {/* Lesson Selector */}
      <LessonSelector basePath="/vocabulary" />

      {/* Sub-section Navigation if specific lesson selected */}
      {currentLessonMeta && currentLessonMeta.subsections && (
        <div style={styles.sectionNav}>
          <button
            onClick={() => setSelectedSection('all')}
            style={{
              ...styles.sectionBtn,
              backgroundColor: selectedSection === 'all' ? 'var(--primary)' : 'white',
              color: selectedSection === 'all' ? 'white' : '#555',
              borderColor: selectedSection === 'all' ? 'var(--primary)' : '#ffccd8',
            }}
          >
            📑 Tất cả các phần Bài {normalizedId}
          </button>

          {currentLessonMeta.subsections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              style={{
                ...styles.sectionBtn,
                backgroundColor: selectedSection === sec.id ? 'var(--primary)' : '#fff5f8',
                color: selectedSection === sec.id ? 'white' : 'var(--primary)',
                borderColor: selectedSection === sec.id ? 'var(--primary)' : '#ffb3c6',
              }}
            >
              <strong>{sec.id}</strong> {sec.titleJp} ({sec.titleVi})
            </button>
          ))}
        </div>
      )}

      {/* Search & Display Controls */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Tìm từ, chữ Hán, Hiragana hoặc 'Bài 1', '1.1'..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button
          style={styles.button}
          onClick={() => setShowAllMeanings(!showAllMeanings)}
        >
          {showAllMeanings ? 'Ẩn tất cả nghĩa' : 'Hiện tất cả nghĩa'}
        </button>
        <div style={{ padding: '8px', fontWeight: 'bold', color: '#e91e8c' }}>
          Số từ hiển thị: {filteredWords.length}
        </div>
      </div>

      {/* Word List Grouped by Sub-Section */}
      {filteredWords.length === 0 ? (
        <div style={styles.empty}>
          Không tìm thấy từ vựng nào phù hợp với từ khóa "{searchTerm}".
        </div>
      ) : (
        Object.entries(groupedWords).map(([sectionTitle, wordsList]) => (
          <div key={sectionTitle}>
            <div style={styles.sectionTitleBanner}>
              <span>📌 {sectionTitle}</span>
              <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 'normal' }}>
                ({wordsList.length} từ)
              </span>
            </div>

            <div style={styles.grid}>
              {wordsList.map((word, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.card,
                    opacity: learnedWords[word.kanji || word.hiragana] ? 0.65 : 1,
                  }}
                >
                  {word.section && (
                    <span style={styles.sectionBadge}>
                      Mục {word.section}
                    </span>
                  )}

                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={!!learnedWords[word.kanji || word.hiragana]}
                    onChange={() => toggleLearned(word.kanji || word.hiragana)}
                    title={
                      learnedWords[word.kanji || word.hiragana]
                        ? 'Đã thuộc (Bấm để hủy)'
                        : 'Đánh dấu đã thuộc'
                    }
                  />

                  <div style={styles.kanji}>{word.kanji || word.hiragana}</div>
                  {word.kanji && <div style={styles.hiragana}>{word.hiragana}</div>}

                  <button
                    onClick={() => speakText(word.kanji || word.hiragana)}
                    title="Nghe phát âm"
                    style={styles.audioBtn}
                  >
                    🔊
                  </button>

                  <div
                    style={styles.meaning}
                    onClick={() => toggleReveal(`${word.section}-${idx}`)}
                    title="Bấm để xem hoặc ẩn nghĩa"
                  >
                    {showAllMeanings || revealedWords[`${word.section}-${idx}`]
                      ? word.meaning
                      : '👁️ (Bấm để xem nghĩa)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VocabularyPage;
