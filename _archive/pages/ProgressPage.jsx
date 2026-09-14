import React, { useState, useEffect } from 'react';
import { vocabularyData } from '../data/vocabulary';

const ProgressPage = () => {
  const [stats, setStats] = useState({
    learnedWordsCount: 0,
    totalQuizzes: 0,
    averageScore: 0,
    streak: 1
  });
  const [learnedByLesson, setLearnedByLesson] = useState({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const saved = localStorage.getItem('japaneseProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const learned = parsed.learnedWords || {};
        
        let totalLearned = 0;
        const lessonStats = {};

        // Calculate learned words per lesson
        Object.keys(vocabularyData).forEach(lessonKey => {
          let count = 0;
          vocabularyData[lessonKey].forEach(word => {
            if (learned[word.kanji || word.hiragana]) {
              count++;
              totalLearned++;
            }
          });
          lessonStats[lessonKey] = {
            learned: count,
            total: vocabularyData[lessonKey].length
          };
        });

        // Calculate quiz stats
        const quizzes = parsed.quizHistory || [];
        let avgScore = 0;
        if (quizzes.length > 0) {
          const totalPct = quizzes.reduce((acc, curr) => acc + (curr.score / curr.total), 0);
          avgScore = Math.round((totalPct / quizzes.length) * 100);
        }

        setStats({
          learnedWordsCount: totalLearned,
          totalQuizzes: quizzes.length,
          averageScore: avgScore,
          streak: parsed.streak || 1
        });
        setLearnedByLesson(lessonStats);

      } catch (e) {
        console.error(e);
      }
    }
  };

  const clearData = () => {
    if (window.confirm('Are you sure you want to delete all progress? This cannot be undone.')) {
      localStorage.removeItem('japaneseProgress');
      loadProgress();
    }
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
      marginBottom: '30px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '800px',
      marginBottom: '40px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#e91e8c',
      marginBottom: '10px'
    },
    statLabel: {
      color: '#666',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '0.9rem'
    },
    chartContainer: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      width: '100%',
      maxWidth: '800px',
      marginBottom: '40px'
    },
    chartTitle: {
      color: '#333',
      marginBottom: '20px',
      borderBottom: '2px solid #fff0f5',
      paddingBottom: '10px'
    },
    barRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px'
    },
    barLabel: {
      width: '80px',
      fontWeight: 'bold',
      color: '#555'
    },
    barTrack: {
      flex: 1,
      height: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      overflow: 'hidden',
      marginRight: '15px'
    },
    barFill: {
      height: '100%',
      backgroundColor: '#e91e8c',
      transition: 'width 0.5s ease-out'
    },
    barText: {
      width: '60px',
      textAlign: 'right',
      color: '#666',
      fontSize: '0.9rem'
    },
    dangerBtn: {
      padding: '12px 24px',
      backgroundColor: 'transparent',
      color: '#dc3545',
      border: '2px solid #dc3545',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📈 Tiến Độ Học Tập</h1>

      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.learnedWordsCount}</div>
          <div style={styles.statLabel}>Từ Vựng Đã Học</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.totalQuizzes}</div>
          <div style={styles.statLabel}>Bài Quiz Đã Làm</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.averageScore}%</div>
          <div style={styles.statLabel}>Điểm Trung Bình</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.streak} <span style={{fontSize:'1.5rem'}}>🔥</span></div>
          <div style={styles.statLabel}>Ngày Học Liên Tiếp</div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <h2 style={styles.chartTitle}>📊 Số từ đã thuộc theo từng bài</h2>
        {Object.keys(learnedByLesson).length === 0 ? (
          <p>Chưa có dữ liệu tiến độ.</p>
        ) : (
          Object.keys(learnedByLesson).map(lessonKey => {
            const data = learnedByLesson[lessonKey];
            const pct = data.total > 0 ? (data.learned / data.total) * 100 : 0;
            return (
              <div key={lessonKey} style={styles.barRow}>
                <div style={styles.barLabel}>{lessonKey.replace('lesson', 'Bài ')}</div>
                <div style={styles.barTrack}>
                  <div style={{...styles.barFill, width: `${pct}%`}}></div>
                </div>
                <div style={styles.barText}>{data.learned}/{data.total}</div>
              </div>
            );
          })
        )}
      </div>

      <button style={styles.dangerBtn} onClick={clearData}>
        🗑️ Đặt lại toàn bộ tiến độ
      </button>
    </div>
  );
};

export default ProgressPage;
