import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LessonSelector from '../components/LessonSelector';
import { vocabularyData } from '../data/vocabulary';

const FlashcardPage = () => {
  const { lessonId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [words, setWords] = useState([]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    const normalizedId = lessonId ? String(lessonId).replace('lesson', '') : null;
    const lessonData = normalizedId 
      ? (vocabularyData[normalizedId] || []) 
      : Object.values(vocabularyData).flat();
    setWords([...lessonData]);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [lessonId]);

  useEffect(() => {
    let interval;
    if (isAutoPlay && words.length > 0) {
      interval = setInterval(() => {
        setIsFlipped(prev => {
          if (!prev) return true;
          handleNext();
          return false;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentIndex, words]);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 150);
  };

  const shuffleCards = () => {
    setIsFlipped(false);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setTimeout(() => {
      setWords(shuffled);
      setCurrentIndex(0);
    }, 150);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentWord = words[currentIndex];

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#fff5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    },
    header: {
      color: '#e91e8c',
      marginBottom: '20px'
    },
    cardContainer: {
      perspective: '1000px',
      width: '350px',
      height: '250px',
      margin: '40px 0',
      cursor: 'pointer'
    },
    cardInner: {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d',
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    },
    cardFace: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(233, 30, 140, 0.2)',
      padding: '20px',
      boxSizing: 'border-box'
    },
    cardBack: {
      transform: 'rotateY(180deg)',
      backgroundColor: '#fff0f5'
    },
    kanji: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#333'
    },
    hiragana: {
      fontSize: '1.5rem',
      color: '#666',
      marginTop: '10px'
    },
    meaning: {
      fontSize: '2rem',
      color: '#e91e8c',
      fontWeight: 'bold'
    },
    controls: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#e91e8c',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'background-color 0.2s'
    },
    secondaryButton: {
      backgroundColor: 'white',
      color: '#e91e8c',
      border: '2px solid #e91e8c'
    },
    progress: {
      fontSize: '1.2rem',
      color: '#666',
      fontWeight: 'bold',
      marginBottom: '20px'
    },
    empty: {
      padding: '40px',
      color: '#888'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎴 Thẻ Học Từ Vựng (Flashcard)</h1>
      <LessonSelector basePath="/flashcard" currentLesson={lessonId} />

      {words.length === 0 ? (
        <div style={styles.empty}>Không có từ vựng nào cho bài học này.</div>
      ) : (
        <>
          <div style={styles.progress}>
            Thẻ {currentIndex + 1} / {words.length}
          </div>

          <div style={styles.cardContainer} onClick={toggleFlip} title="Bấm để lật thẻ">
            <div style={styles.cardInner}>
              <div style={styles.cardFace}>
                <div style={styles.kanji}>{currentWord.kanji || currentWord.hiragana}</div>
                {currentWord.kanji && <div style={styles.hiragana}>{currentWord.hiragana}</div>}
              </div>
              <div style={{...styles.cardFace, ...styles.cardBack}}>
                <div style={styles.meaning}>{currentWord.meaning}</div>
              </div>
            </div>
          </div>

          <div style={styles.controls}>
            <button style={styles.button} onClick={handlePrev}>◀ Trước</button>
            <button style={styles.button} onClick={handleNext}>Tiếp theo ▶</button>
          </div>
          
          <div style={styles.controls}>
            <button 
              style={{...styles.button, ...styles.secondaryButton}} 
              onClick={shuffleCards}
            >
              🔀 Xáo trộn
            </button>
            <button 
              style={{...styles.button, ...styles.secondaryButton, backgroundColor: isAutoPlay ? '#ffe0f0' : 'white'}} 
              onClick={() => setIsAutoPlay(!isAutoPlay)}
            >
              {isAutoPlay ? '⏹ Dừng tự động' : '▶ Tự động lật'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardPage;
