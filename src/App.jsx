import React, { useState, useEffect, Suspense, lazy } from 'react';
import { SplashScreen } from './components/Splash/SplashScreen';
import { WelcomeScreen } from './components/Welcome/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { FuriganaSwitch } from './components/FuriganaSwitch';
import { useProgress } from './hooks/useProgress';
import { vocabularyData } from './data/vocabulary';
import { grammarData } from './data/grammar';
import './styles/furigana.css';
import './styles/sakura.css';
import './App.css';

// Code Splitting: Lazy-load các màn hình lớn để giảm tối đa kích thước bundle khởi động ban đầu
const QuizScreen = lazy(() => import('./components/Quiz/QuizScreen').then((m) => ({ default: m.QuizScreen })));
const GrammarScreen = lazy(() => import('./components/Grammar/GrammarScreen').then((m) => ({ default: m.GrammarScreen })));
const KaiwaScreen = lazy(() => import('./components/Kaiwa/KaiwaScreen').then((m) => ({ default: m.KaiwaScreen })));
const VocabScreen = lazy(() => import('./components/Vocab/VocabScreen').then((m) => ({ default: m.VocabScreen })));
const Translator = lazy(() => import('./components/Dictionary/Translator').then((m) => ({ default: m.Translator })));
const KanaScreen = lazy(() => import('./components/Kana/KanaScreen').then((m) => ({ default: m.KanaScreen })));
const KanjiScreen = lazy(() => import('./components/Kanji/KanjiScreen').then((m) => ({ default: m.KanjiScreen })));
const SakuraMatchScreen = lazy(() => import('./components/Match/SakuraMatchScreen').then((m) => ({ default: m.SakuraMatchScreen })));
const StatsScreen = lazy(() => import('./components/Stats/StatsScreen').then((m) => ({ default: m.StatsScreen })));
const BackupRestoreModal = lazy(() => import('./components/Backup/BackupRestoreModal').then((m) => ({ default: m.BackupRestoreModal })));

/**
 * App Root Component - Sakura EdTech App
 * Quản lý Layout, Sakura Petals Animation, Glassmorphism Header,
 * Trạng thái mạng Online/Offline (PWA) và State-based Routing
 */
export default function App() {
  // Trạng thái Intro Mở Đầu (SplashScreen): chỉ xuất hiện 1 lần đầu khi mở app (sessionStorage)
  // Khi reload (F5) hoặc ấn lại link sẽ không hiện lại; người dùng có thể bấm nút "✨ Intro" trên Header để xem lại bất cứ lúc nào
  const [showSplash, setShowSplash] = useState(() => {
    try {
      const hasSeen = sessionStorage.getItem('nihongo_intro_shown');
      if (!hasSeen) {
        sessionStorage.setItem('nihongo_intro_shown', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });
  const [currentRoute, setCurrentRoute] = useState('welcome'); // 'welcome' | 'dashboard' | 'kana' | 'kanji' | 'quiz' | 'vocab' | 'grammar' | 'kaiwa' | 'translator'
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
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

  const handleOpenKana = () => {
    setCurrentRoute('kana');
  };

  const handleOpenKanji = () => {
    setCurrentRoute('kanji');
  };

  const handleOpenMatch = (lessonId = 1) => {
    setActiveLessonId(lessonId);
    setCurrentRoute('match');
  };

  const handleOpenStats = () => {
    setCurrentRoute('stats');
  };

  const handleBackToDashboard = () => {
    setCurrentRoute('dashboard');
  };

  // Trích xuất dữ liệu theo lessonId
  const quizRawQuestions = vocabularyData[String(activeLessonId)] || [];
  const lessonGrammar = grammarData[activeLessonId] || grammarData[String(activeLessonId)] || [];

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#fff8fa', position: 'relative' }}>
      {/* 🌸 Intro Splash Screen (Mở đầu tự động chuyển vào màn hình chính sau ~2.2s) */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

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

          {/* Header Action Controls - Thứ tự: Khóa Học -> Bảng Chữ Cái -> Từ Điển -> Phiên Âm -> Số Lửa -> Intro */}
          <div style={styles.headerActions}>
            {/* Network Status Badge (Online / Offline PWA indicator) */}
            {!isOnline ? (
              <div style={styles.offlinePill} title="Đang ở chế độ Ngoại tuyến (Offline PWA). Bạn vẫn học được đầy đủ 15 bài học!">
                📴 Offline Mode
              </div>
            ) : null}

            {/* 0. Nút Trang Chủ (Welcome Screen) */}
            <button
              type="button"
              onClick={handleOpenWelcome}
              className={`sakura-nav-btn ${currentRoute === 'welcome' ? 'active' : ''}`}
              title="Về màn hình mở đầu giới thiệu & tính năng nổi bật"
            >
              🌸 Trang Chủ
            </button>

            {/* 1. Nút Khóa Học (Dashboard) */}
            <button
              type="button"
              onClick={handleOpenDashboard}
              className={`sakura-nav-btn ${currentRoute === 'dashboard' ? 'active' : ''}`}
              title="Vào lộ trình 15 bài học"
            >
              📚 Khóa Học
            </button>

            {/* 2. Nút Bảng Chữ Cái (Kana Chart & Quiz Tofugu Style) */}
            <button
              type="button"
              onClick={handleOpenKana}
              className={`sakura-nav-btn ${currentRoute === 'kana' ? 'active' : ''}`}
              title="Học Bảng Chữ Cái Hiragana & Katakana, Luyện phản xạ"
            >
              🔤 Bảng Chữ Cái
            </button>

            {/* 3. Nút Hán Tự (Kanji N5 Canvas) */}
            <button
              type="button"
              onClick={handleOpenKanji}
              className={`sakura-nav-btn ${currentRoute === 'kanji' ? 'active' : ''}`}
              title="Học chữ Hán N5, Âm Hán Việt & Luyện viết trên Canvas"
            >
              🈸 Hán Tự
            </button>

            {/* 4. Nút Mở Từ Điển & Dịch Thuật */}
            <button
              type="button"
              onClick={handleOpenTranslator}
              className={`sakura-nav-btn ${currentRoute === 'translator' ? 'active' : ''}`}
              title="Mở Từ Điển & Dịch Thuật AI (TTS)"
            >
              🔍 Từ Điển
            </button>

            {/* 4b. Nút Đấu Phản Xạ Sakura Match */}
            <button
              type="button"
              onClick={() => handleOpenMatch(null)}
              className={`sakura-nav-btn ${currentRoute === 'match' ? 'active' : ''}`}
              title="Minigame Đấu Phản Xạ Nối Từ Vựng 60 Giây"
            >
              🌸 Sakura Match
            </button>

            {/* 4c. Nút Trung Tâm Thống Kê & Radar Năng Lực (Bước 6) */}
            <button
              type="button"
              onClick={handleOpenStats}
              className={`sakura-nav-btn ${currentRoute === 'stats' ? 'active' : ''}`}
              title="Trung tâm thống kê 5 kỹ năng & lịch cày cuốc 365 ngày"
            >
              📊 Thống Kê
            </button>

            {/* 5. Global Furigana Switch (Phiên Âm) */}
            <FuriganaSwitch />

            {/* 6. Gamified Streak Badge (Số lửa học mỗi ngày) */}
            <div className="sakura-streak-pill" title={`Chuỗi học tập liên tiếp: ${dailyStreak.count} ngày!`}>
              🔥 {dailyStreak.count} ngày
            </div>

            {/* 7. Nút Xem Intro Mở Đầu */}
            <button
              type="button"
              onClick={() => setShowSplash(true)}
              className="sakura-nav-btn"
              title="Bấm để xem lại màn hình Intro chào mừng & danh ngôn"
            >
              ✨ Intro
            </button>

            {/* 8. Nút Sao Lưu & Khôi Phục JSON */}
            <button
              type="button"
              onClick={() => setIsBackupModalOpen(true)}
              className="sakura-nav-btn"
              title="Sao lưu & Khôi phục dữ liệu học tập (JSON)"
            >
              💾 Sao Lưu
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (State-based Route Dispatcher kèm hiệu ứng chuyển tab sakura-tab-view) */}
      <main style={{ position: 'relative', zIndex: 1, padding: '16px 0 40px' }}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#e91e8c', fontWeight: '700' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px', animation: 'streakPulse 1.5s ease-in-out infinite' }}>🌸</span>
            Đang tải dữ liệu học tập...
          </div>
        }>
          <div key={currentRoute + (activeLessonId ? `-${activeLessonId}` : '')} className="sakura-tab-view">
            {currentRoute === 'welcome' && (
              <WelcomeScreen
                onStartLearning={handleOpenDashboard}
                onOpenTranslator={handleOpenTranslator}
                onOpenKana={handleOpenKana}
                onOpenKanji={handleOpenKanji}
                onOpenMatch={handleOpenMatch}
                onOpenStats={handleOpenStats}
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
                onSelectMatch={handleOpenMatch}
                onOpenMatch={handleOpenMatch}
                onOpenStats={handleOpenStats}
                onOpenTranslator={handleOpenTranslator}
                onOpenKana={handleOpenKana}
                onOpenKanji={handleOpenKanji}
              />
            )}

            {currentRoute === 'stats' && (
              <StatsScreen
                onBack={handleBackToDashboard}
                onSelectLesson={(lessonId) => {
                  setActiveLessonId(lessonId);
                  setCurrentRoute('vocab');
                }}
              />
            )}

            {currentRoute === 'match' && (
              <SakuraMatchScreen
                initialLessonId={activeLessonId}
                onBack={handleBackToDashboard}
              />
            )}

            {currentRoute === 'kana' && (
              <KanaScreen onBack={handleBackToDashboard} />
            )}

            {currentRoute === 'kanji' && (
              <KanjiScreen onBack={handleBackToDashboard} />
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
        </Suspense>
      </main>

      {/* 💾 Modal Sao Lưu & Khôi Phục Dữ Liệu */}
      {isBackupModalOpen && (
        <Suspense fallback={null}>
          <BackupRestoreModal
            isOpen={isBackupModalOpen}
            onClose={() => setIsBackupModalOpen(false)}
          />
        </Suspense>
      )}
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
