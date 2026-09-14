import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LessonSelector from '../components/LessonSelector';
import { vocabularyData } from '../data/vocabulary';

const ExercisePage = () => {
  const { lessonId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const normalizedId = lessonId ? String(lessonId).replace('lesson', '') : null;

  useEffect(() => {
    generateExercises();
  }, [lessonId]);

  const generateExercises = () => {
    const data = normalizedId 
      ? (vocabularyData[normalizedId] || []) 
      : Object.values(vocabularyData).flat();
    if (data.length === 0) {
      setExercises([]);
      return;
    }

    // Just typing the reading exercises for now
    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 10);
    const exList = shuffled.filter(w => w.kanji).map(w => ({
      type: 'type_reading',
      question: w.kanji,
      answer: w.hiragana,
      meaning: w.meaning
    }));

    setExercises(exList);
    setCurrentIndex(0);
    setInputVal('');
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  const checkAnswer = () => {
    if (!inputVal.trim()) return;
    
    const currentEx = exercises[currentIndex];
    const isCorrect = inputVal.trim() === currentEx.answer;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentIndex + 1 < exercises.length) {
        setCurrentIndex(c => c + 1);
        setInputVal('');
        setFeedback(null);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

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
    card: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '500px',
      textAlign: 'center',
      marginTop: '20px'
    },
    question: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    meaning: {
      color: '#666',
      marginBottom: '30px'
    },
    input: {
      padding: '15px',
      fontSize: '1.2rem',
      width: '80%',
      border: '2px solid #ddd',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      outline: 'none',
      borderColor: feedback === 'correct' ? '#28a745' : feedback === 'wrong' ? '#dc3545' : '#ddd'
    },
    button: {
      padding: '15px 30px',
      backgroundColor: '#e91e8c',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      width: '80%'
    },
    feedbackText: {
      marginTop: '15px',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: feedback === 'correct' ? '#28a745' : '#dc3545'
    },
    empty: {
      padding: '40px',
      color: '#888'
    }
  };

  if (exercises.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>📝 Luyện Tập Tiếng Nhật</h1>
        <LessonSelector basePath="/exercises" currentLesson={lessonId} />
        <div style={styles.empty}>Không có đủ từ vựng Kanji trong bài này để tạo bài tập gõ cách đọc.</div>
      </div>
    );
  }

  const currentEx = exercises[currentIndex];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📝 Luyện Tập Tiếng Nhật</h1>
      <LessonSelector basePath="/exercises" currentLesson={lessonId} />

      <div style={styles.card}>
        {finished ? (
          <div>
            <h2>🎉 Hoàn Thành Luyện Tập!</h2>
            <div style={{fontSize: '3rem', color: '#e91e8c', margin: '20px 0'}}>
              {score} / {exercises.length}
            </div>
            <button style={styles.button} onClick={generateExercises}>Làm lại</button>
          </div>
        ) : (
          <div>
            <div style={{color: '#999', marginBottom: '20px'}}>
              Câu hỏi {currentIndex + 1} / {exercises.length} | Điểm: {score}
            </div>
            <p style={{fontWeight: 'bold', color: '#e91e8c'}}>Nhập cách đọc Hiragana cho từ sau:</p>
            <div style={styles.question}>{currentEx.question}</div>
            <div style={styles.meaning}>Ý nghĩa: {currentEx.meaning}</div>

            <input 
              type="text"
              style={styles.input}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Nhập hiragana..."
              disabled={feedback !== null}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <br />
            <button 
              style={styles.button} 
              onClick={checkAnswer}
              disabled={feedback !== null || !inputVal.trim()}
            >
              Kiểm tra đáp án
            </button>

            {feedback && (
              <div style={styles.feedbackText}>
                {feedback === 'correct' ? 'Chính xác! ✨' : `Sai rồi. Đáp án đúng là: ${currentEx.answer}`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePage;
