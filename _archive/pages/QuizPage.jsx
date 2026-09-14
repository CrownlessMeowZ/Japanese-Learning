import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LessonSelector from '../components/LessonSelector';
import { vocabularyData } from '../data/vocabulary';

const QuizPage = () => {
  const { lessonId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [mode, setMode] = useState('jp-vn'); // 'jp-vn' or 'vn-jp'

  const normalizedId = lessonId ? String(lessonId).replace('lesson', '') : null;

  useEffect(() => {
    generateQuiz();
  }, [lessonId, mode]);

  const generateQuiz = () => {
    const data = normalizedId 
      ? (vocabularyData[normalizedId] || []) 
      : Object.values(vocabularyData).flat();
    if (data.length < 4) {
      setQuestions([]);
      return;
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(10, data.length));
    
    const quizQuestions = selected.map(word => {
      const wrongAnswers = data
        .filter(w => w !== word && w.meaning !== word.meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [word, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        questionWord: word,
        options,
      };
    });

    setQuestions(quizQuestions);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizFinished(false);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (option, e) => {
    if (selectedAnswer !== null) return;
    
    // Xóa ngay lập tức focus khỏi button và toàn bộ active element để tránh viền đen mặc định của trình duyệt
    if (e?.currentTarget) {
      e.currentTarget.blur();
    }
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    setSelectedAnswer(option);
    
    const currentQ = questions[currentIdx];
    const isCorrect = option === currentQ.questionWord;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Tự động phát âm từ tiếng Nhật khi chọn
    speakText(currentQ.questionWord.hiragana || currentQ.questionWord.kanji);

    setTimeout(() => {
      // Blur lần nữa trước khi chuyển câu để triệt tiêu hoàn toàn viền focus
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }

      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
        saveResults(score + (isCorrect ? 1 : 0), questions.length);
      }
    }, 1400);
  };

  const saveResults = (finalScore, total) => {
    const saved = localStorage.getItem('japaneseProgress') || '{}';
    try {
      const parsed = JSON.parse(saved);
      parsed.quizHistory = parsed.quizHistory || [];
      parsed.quizHistory.push({
        lessonId,
        mode,
        score: finalScore,
        total,
        date: new Date().toISOString()
      });
      localStorage.setItem('japaneseProgress', JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  };

  const currentQ = questions[currentIdx];

  // Tính style cho từng ô đáp án:
  // - Khi bắt đầu / chuyển câu / di chuột: viền pastel nhẹ nhàng, tuyệt đối không bị dính ô vuông bao quát
  // - Sau khi đã bấm chọn: MỚI hiện hình vuông bao quát nổi bật (xanh lá nếu đúng, đỏ nếu sai)
  const getOptionStyle = (option) => {
    const baseStyle = {
      padding: '16px 18px',
      fontSize: '1.15rem',
      borderRadius: '12px',
      cursor: 'pointer',
      outline: 'none',
      border: '2px solid #f0e2e7',
      backgroundColor: '#ffffff',
      color: '#333333',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
      position: 'relative',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    };

    // Khi người dùng chưa chọn đáp án nào: Giữ nguyên giao diện sạch, KHÔNG có hình bao quát
    if (selectedAnswer === null) {
      return baseStyle;
    }

    // Sau khi đã chọn đáp án: MỚI kích hoạt hình vuông bao quát rõ nét
    const isThisWordCorrect = option === currentQ.questionWord;
    const isThisWordChosen = option === selectedAnswer;

    if (isThisWordCorrect) {
      // Ô đáp án ĐÚNG: Khung bao quát xanh lá nổi bật
      return {
        ...baseStyle,
        border: '3px solid #28a745',
        backgroundColor: '#eafaf1',
        color: '#155724',
        fontWeight: 'bold',
        transform: 'scale(1.02)',
        boxShadow: '0 0 0 4px rgba(40, 167, 69, 0.25), 0 8px 20px rgba(40, 167, 69, 0.2)',
        cursor: 'default',
      };
    }

    if (isThisWordChosen && !isThisWordCorrect) {
      // Ô đáp án người dùng chọn SAI: Khung bao quát đỏ nổi bật
      return {
        ...baseStyle,
        border: '3px solid #dc3545',
        backgroundColor: '#fdf0f1',
        color: '#721c24',
        fontWeight: 'bold',
        transform: 'scale(0.99)',
        boxShadow: '0 0 0 4px rgba(220, 53, 69, 0.25), 0 8px 20px rgba(220, 53, 69, 0.2)',
        cursor: 'default',
      };
    }

    // Các ô còn lại không được chọn: Mờ nhẹ đi
    return {
      ...baseStyle,
      opacity: 0.4,
      border: '2px solid #e2e8f0',
      backgroundColor: '#f8f9fa',
      color: '#888888',
      cursor: 'not-allowed',
    };
  };

  const styles = {
    container: {
      padding: '24px 16px',
      backgroundColor: '#fff5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    },
    header: {
      color: '#e91e8c',
      marginBottom: '16px',
      fontSize: '2rem',
      textAlign: 'center'
    },
    controls: {
      display: 'flex',
      gap: '12px',
      margin: '20px 0',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    modeButton: {
      padding: '10px 18px',
      backgroundColor: 'white',
      border: '2px solid #e91e8c',
      color: '#e91e8c',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 6px rgba(233, 30, 140, 0.1)'
    },
    activeMode: {
      backgroundColor: '#e91e8c',
      color: 'white',
      boxShadow: '0 4px 12px rgba(233, 30, 140, 0.3)'
    },
    card: {
      backgroundColor: 'white',
      padding: '32px 28px',
      borderRadius: '20px',
      boxShadow: '0 12px 30px rgba(233, 30, 140, 0.12)',
      width: '100%',
      maxWidth: '540px',
      textAlign: 'center',
      position: 'relative'
    },
    progressBarOuter: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '20px'
    },
    progressBarInner: {
      height: '100%',
      backgroundColor: '#e91e8c',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    },
    questionMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#777',
      fontWeight: 'bold',
      fontSize: '0.95rem',
      marginBottom: '10px'
    },
    questionText: {
      fontSize: '2.4rem',
      fontWeight: 'bold',
      color: '#2d3748',
      margin: '15px 0 8px',
      lineHeight: '1.2'
    },
    questionSub: {
      fontSize: '1.25rem',
      color: '#e91e8c',
      marginBottom: '24px',
      fontWeight: '500'
    },
    soundBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'none',
      border: 'none',
      color: '#e91e8c',
      fontSize: '0.9rem',
      cursor: 'pointer',
      marginBottom: '20px',
      padding: '6px 14px',
      borderRadius: '20px',
      backgroundColor: '#fff0f6',
      outline: 'none',
      transition: 'all 0.2s'
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginTop: '10px'
    },
    results: {
      textAlign: 'center',
      padding: '20px 10px'
    },
    score: {
      fontSize: '3.5rem',
      color: '#e91e8c',
      fontWeight: 'bold',
      margin: '16px 0'
    },
    retryBtn: {
      padding: '14px 36px',
      backgroundColor: '#e91e8c',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      fontSize: '1.15rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '24px',
      outline: 'none',
      boxShadow: '0 6px 18px rgba(233, 30, 140, 0.35)',
      transition: 'all 0.2s'
    }
  };

  if (questions.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>❓ Trắc Nghiệm Từ Vựng</h1>
        <LessonSelector basePath="/quiz" currentLesson={lessonId} />
        <div style={{marginTop: '40px', color: '#666', fontSize: '1.1rem'}}>
          Chưa có đủ từ vựng để tạo bài quiz (tối thiểu 4 từ). Vui lòng chọn bài khác!
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      {/* CSS thuần cho hover và reset focus: Tuyệt đối không bị dính hình vuông hay viền đen */}
      <style>{`
        .quiz-opt-btn {
          outline: none !important;
          -webkit-tap-highlight-color: transparent;
        }
        .quiz-opt-btn:hover:not(:disabled) {
          background-color: #fff0f6 !important;
          border-color: #ffb6c1 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(233, 30, 140, 0.12) !important;
        }
        .quiz-opt-btn:focus,
        .quiz-opt-btn:focus-visible,
        .quiz-opt-btn:active {
          outline: none !important;
          box-shadow: none;
        }
      `}</style>

      <h1 style={styles.header}>❓ Trắc Nghiệm Từ Vựng</h1>
      <LessonSelector basePath="/quiz" currentLesson={lessonId} />
      
      {!quizFinished && (
        <div style={styles.controls}>
          <button 
            style={{...styles.modeButton, ...(mode === 'jp-vn' ? styles.activeMode : {})}}
            onClick={() => setMode('jp-vn')}
          >
            🇯🇵 Nhật → 🇻🇳 Việt
          </button>
          <button 
            style={{...styles.modeButton, ...(mode === 'vn-jp' ? styles.activeMode : {})}}
            onClick={() => setMode('vn-jp')}
          >
            🇻🇳 Việt → 🇯🇵 Nhật
          </button>
        </div>
      )}

      <div style={styles.card}>
        {quizFinished ? (
          <div style={styles.results}>
            <h2 style={{color: '#2d3748', fontSize: '1.8rem'}}>🎉 Hoàn Thành Bài Quiz!</h2>
            <div style={styles.score}>
              {score} / {questions.length}
            </div>
            <p style={{fontSize: '1.2rem', color: '#555', marginBottom: '8px'}}>
              Độ chính xác: <strong>{Math.round((score / questions.length) * 100)}%</strong>
            </p>
            <p style={{color: '#888', fontSize: '0.95rem'}}>
              {score === questions.length ? '🌟 Xuất sắc! Bạn đã trả lời đúng tất cả!' : 'Cố gắng luyện tập thêm để ghi nhớ tốt hơn nhé!'}
            </p>
            <button style={styles.retryBtn} onClick={generateQuiz}>
              🔄 Làm lại bài này
            </button>
          </div>
        ) : (
          <>
            <div style={styles.progressBarOuter}>
              <div style={{...styles.progressBarInner, width: `${progressPercent}%`}} />
            </div>

            <div style={styles.questionMeta}>
              <span>Câu hỏi {currentIdx + 1} / {questions.length}</span>
              <span style={{color: '#e91e8c'}}>⭐ {score} điểm</span>
            </div>
            
            {mode === 'jp-vn' ? (
              <>
                <div style={styles.questionText}>
                  {currentQ.questionWord.kanji || currentQ.questionWord.hiragana}
                </div>
                {currentQ.questionWord.kanji && (
                  <div style={styles.questionSub}>{currentQ.questionWord.hiragana}</div>
                )}
                <button 
                  style={styles.soundBtn}
                  onClick={() => speakText(currentQ.questionWord.hiragana || currentQ.questionWord.kanji)}
                  title="Nghe phát âm"
                >
                  🔊 Nghe phát âm
                </button>
              </>
            ) : (
              <>
                <div style={{...styles.questionText, fontSize: '2rem'}}>
                  {currentQ.questionWord.meaning}
                </div>
                <div style={{...styles.questionSub, color: '#888', fontSize: '1rem'}}>
                  Chọn từ tiếng Nhật tương ứng
                </div>
              </>
            )}

            <div style={styles.optionsGrid}>
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQ.questionWord;
                const showFeedback = selectedAnswer !== null;

                return (
                  <button
                    key={`q-${currentIdx}-opt-${i}`}
                    className="quiz-opt-btn"
                    style={getOptionStyle(opt)}
                    onClick={(e) => handleAnswer(opt, e)}
                    disabled={selectedAnswer !== null}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {showFeedback && isCorrect && <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✓</span>}
                      {showFeedback && isSelected && !isCorrect && <span style={{ color: '#dc3545', fontSize: '1.2rem' }}>✗</span>}
                      {mode === 'jp-vn' ? opt.meaning : (opt.kanji || opt.hiragana)}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;

