import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/Welcome/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { QuizScreen } from './components/Quiz/QuizScreen';
import { GrammarScreen } from './components/Grammar/GrammarScreen';
import { KaiwaScreen } from './components/Kaiwa/KaiwaScreen';
import { VocabScreen } from './components/Vocab/VocabScreen';
import { Translator } from './components/Dictionary/Translator';
import { FuriganaSwitch } from './components/FuriganaSwitch';
import { useProgress } from './hooks/useProgress';
import { vocabularyData } from './data/vocabulary';
import { grammarData } from './data/grammar';
import './styles/furigana.css';
import './styles/sakura.css';
import './App.css';

/**
 * App Root Component - Sakura EdTech App
 * Quản lý Layout, Sakura Petals Animation, Glassmorphism Header,
 * Trạng thái mạng Online/Offline (PWA) và State-based Routing
 */
export default function App() {
  // Mặc định mở Giao diện Mở Đầu (WelcomeScreen) tạo ấn tượng chuyên nghiệp
  const [currentRoute, setCurrentRoute] = useState('welcome'); // 'welcome' | 'dashboard' | 'quiz' | 'vocab' | 'grammar' | 'kaiwa' | 'translator'
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { dailyStreak } = useProgress();

  // Lắng nghe trạng thái kết nối mạng Online / Offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Navigation handlers
  const handleOpenWelcome = () => {
    setCurrentRoute('welcome');
  };

  const handleOpenDashboard = () => {
    setCurrentRoute('dashboard');
  };

  const handleOpenQuiz = (lessonId) => {
    setActiveLessonId(lessonId);
    setCurrentRoute('quiz');
  };

  const handleOpenVocab = (lessonId) => {
    setActiveLessonId(lessonId);
    setCurrentRoute('vocab');
  };

  const handleOpenGrammar = (lessonId) => {
    setActiveLessonId(lessonId);
    setCurrentRoute('grammar');
  };

  const handleOpenKaiwa = (lessonId) => {
    setActiveLessonId(lessonId);
    setCurrentRoute('kaiwa');
  };

  const handleOpenTranslator = () => {
    setCurrentRoute('translator');
  };

  const handleBackToDashboard = () => {
    setCurrentRoute('dashboard');
  };

  // Trích xuất dữ liệu theo lessonId
  const quizRawQuestions = vocabularyData[String(activeLessonId)] || [];
  const lessonGrammar = grammarData[activeLessonId] || grammarData[String(activeLessonId)] || [];

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#fff8fa', position: 'relative' }}>
      {/* 🌸 Falling Sakura Petals Animation (Pure CSS, GPU-Accelerated) */}
      <div className="sakura-bg" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, i) => (
          <span key={i} className="petal" />
        ))}
      </div>

      {/* 🌸 Sticky Glassmorphism Header */}
      <header className="sakura-header-glass">
        <div style={styles.headerContent}>
          {/* Brand Logo & Title (Bấm vào để về màn hình mở đầu Welcome) */}
          <div style={styles.brand} onClick={handleOpenWelcome} title="Về trang giới thiệu mở đầu">
            <span style={{ fontSize: '1.9rem', filter: 'drop-shadow(0 2px 6px rgba(233, 30, 140, 0.25))' }}>
              🌸
            </span>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#e91e8c', letterSpacing: '-0.3px' }}>
                Nihongo Master
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: '500' }}>
                Dekiru Nihongo Sơ Cấp
              </div>
            </div>
          </div>

          {/* Header Action Controls - Thứ tự: Khóa Học -> Từ Điển -> Phiên Âm -> Số Lửa */}
          <div style={styles.headerActions}>
            {/* Network Status Badge (Online / Offline PWA indicator) */}
            {!isOnline ? (
              <div style={styles.offlinePill} title="Đang ở chế độ Ngoại tuyến (Offline PWA). Bạn vẫn học được đầy đủ 15 bài học!">
                📴 Offline Mode
              </div>
            ) : null}

            {/* 1. Nút Khóa Học (Dashboard) */}
            <button
              type="button"
              onClick={handleOpenDashboard}
              className={`sakura-nav-btn ${currentRoute === 'dashboard' ? 'active' : ''}`}
              title="Vào lộ trình 15 bài học"
            >
              📚 Khóa Học
            </button>

            {/* 2. Nút Mở Từ Điển & Dịch Thuật */}
            <button
              type="button"
              onClick={handleOpenTranslator}
              className={`sakura-nav-btn ${currentRoute === 'translator' ? 'active' : ''}`}
              title="Mở Từ Điển & Dịch Thuật AI (TTS)"
            >
              🔍 Từ Điển
            </button>

            {/* 3. Global Furigana Switch (Phiên Âm) */}
            <FuriganaSwitch />

            {/* 4. Gamified Streak Badge (Số lửa học mỗi ngày) */}
            <div className="sakura-streak-pill" title={`Chuỗi học tập liên tiếp: ${dailyStreak.count} ngày!`}>
              🔥 {dailyStreak.count} ngày
            </div>
          </div>
        </div>
      </header>

      {/* Main Content (State-based Route Dispatcher kèm hiệu ứng chuyển tab sakura-tab-view) */}
      <main style={{ position: 'relative', zIndex: 1, padding: '16px 0 40px' }}>
        <div key={currentRoute + (activeLessonId ? `-${activeLessonId}` : '')} className="sakura-tab-view">
          {currentRoute === 'welcome' && (
            <WelcomeScreen
              onStartLearning={handleOpenDashboard}
              onOpenTranslator={handleOpenTranslator}
              onSelectLesson={(lessonId) => {
                setActiveLessonId(lessonId);
                setCurrentRoute('vocab');
              }}
            />
          )}

          {currentRoute === 'dashboard' && (
            <Dashboard
              onSelectQuiz={handleOpenQuiz}
              onSelectVocab={handleOpenVocab}
              onSelectGrammar={handleOpenGrammar}
              onSelectKaiwa={handleOpenKaiwa}
              onOpenTranslator={handleOpenTranslator}
            />
          )}

          {currentRoute === 'translator' && (
            <Translator onBack={handleBackToDashboard} />
          )}

          {currentRoute === 'quiz' && (
            <QuizScreen
              lessonId={activeLessonId}
              rawQuestions={quizRawQuestions}
              onBack={handleBackToDashboard}
            />
          )}

          {currentRoute === 'grammar' && (
            <GrammarScreen
              lessonId={activeLessonId}
              grammarList={lessonGrammar}
              onBack={handleBackToDashboard}
            />
          )}

          {currentRoute === 'kaiwa' && (
            <KaiwaScreen
              lessonId={activeLessonId}
              onBack={handleBackToDashboard}
            />
          )}

          {currentRoute === 'vocab' && (
            <VocabScreen
              lessonId={activeLessonId}
              vocabularyList={quizRawQuestions}
              onBack={handleBackToDashboard}
            />
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  headerContent: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  navPillBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1.5px solid #fce7f3',
    fontWeight: '700',
    fontSize: '0.86rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.2s ease',
    outline: 'none',
    userSelect: 'none',
  },
  offlinePill: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '0.78rem',
    fontWeight: '700',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
};
