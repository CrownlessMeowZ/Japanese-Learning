import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuizEngine, QUIZ_STATUS } from '../../hooks/useQuizEngine';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useProgress } from '../../hooks/useProgress';
import { vocabularyData } from '../../data/vocabulary';
import { FuriganaText } from '../FuriganaText';
import { QuizTypingInput } from './QuizTypingInput';
import '../../styles/quiz.css';

/**
 * QuizScreen Component - Nâng cấp toàn diện Bước 2.2 & Bước 4
 * 1. 🔘 Chế độ Trắc Nghiệm 4 lựa chọn (Multiple Choice)
 * 2. ⌨️ Chế độ Tự Luận Gõ Phím (Typing Mode): Tích hợp bộ gõ WanaKana rớt âm tự động
 * 3. ✍️ Chế độ Nghe Chép Chính Tả (Audio Dictation Mode) với điều chỉnh tốc độ 0.75x - 1.25x
 * 4. 🎧 Chế độ Luyện Nghe Trắc Nghiệm: Ẩn chữ, nghe âm thanh phát âm và chọn nghĩa
 * 5. 🔄 Chế độ Đảo Chiều Đề Thi (Nghĩa sang Từ / Từ sang Nghĩa)
 * 6. 📚 Chế độ Thi Tổng Hợp Liên Bài (1-3, 1-5, 1-10, 15 bài)
 * 7. 🔥 Cứu hộ từ sai (Targeted Retry) & Spaced Repetition (SM-2)
 */
export const QuizScreen = ({ lessonId = 1, rawQuestions = [], onBack }) => {
  const {
    status,
    currentIndex,
    currentQuestion,
    score,
    selectedAnswer,
    totalQuestions,
    startGame,
    handleAnswer,
    nextQuestion,
    quitGame,
  } = useQuizEngine();

  const { playAudio, stopAudio } = useAudioPlayer();
  const { getDueItems, reviewItem } = useProgress();

  // --- CONFIGURATION STATE ---
  // 1. Hình thức làm bài: 'choice' (Trắc nghiệm 4 đáp án) | 'typing' (Tự luận gõ phím) | 'dictation' (Nghe chép chính tả)
  const [questionFormat, setQuestionFormat] = useState('choice');

  // 2. Chiều câu hỏi: 'vi_to_ja' | 'ja_to_vi' | 'listening'
  const [quizMode, setQuizMode] = useState('vi_to_ja');

  // 3. Tốc độ phát âm thanh (0.75x, 1.0x, 1.25x)
  const [audioSpeed, setAudioSpeed] = useState(1.0);

  // 4. Phạm vi bài học: 'current' | '1-3' | '1-5' | '1-10' | 'all' | number (1..15)
  const [selectedScope, setSelectedScope] = useState('current');

  // 5. Số lượng câu hỏi mỗi phiên
  const [questionCount, setQuestionCount] = useState(10);

  // 6. Bộ lọc: Chỉ ôn từ đến hạn SM-2 hay toàn bộ
  const [onlyDue, setOnlyDue] = useState(true);

  // 7. Tự động phát âm thanh khi vào câu hỏi mới
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);

  // 8. Danh sách các từ làm sai trong phiên hiện tại (Targeted Retry)
  const [wrongItems, setWrongItems] = useState([]);

  // Dọn dẹp âm thanh khi unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // --- TẬP TỪ VỰNG THEO PHẠM VI (ACTIVE POOL) ---
  const activePool = useMemo(() => {
    if (selectedScope === 'current') {
      if (Array.isArray(rawQuestions) && rawQuestions.length > 0) {
        return rawQuestions;
      }
      return vocabularyData[String(lessonId)] || [];
    }
    if (selectedScope === '1-3') {
      return [1, 2, 3].flatMap((num) => vocabularyData[String(num)] || []);
    }
    if (selectedScope === '1-5') {
      return [1, 2, 3, 4, 5].flatMap((num) => vocabularyData[String(num)] || []);
    }
    if (selectedScope === '1-10') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].flatMap((num) => vocabularyData[String(num)] || []);
    }
    if (selectedScope === 'all') {
      return Object.values(vocabularyData).flat();
    }
    // Nếu chọn một bài học cụ thể (1..15)
    return vocabularyData[String(selectedScope)] || [];
  }, [selectedScope, lessonId, rawQuestions]);

  // Danh sách từ đến hạn ôn tập SM-2 trong phạm vi hiện tại
  const currentScopeId = selectedScope === 'current' ? lessonId : selectedScope;
  const dueIds = useMemo(() => {
    return getDueItems(currentScopeId, activePool);
  }, [getDueItems, currentScopeId, activePool]);

  const dueQuestions = useMemo(() => {
    const idSet = new Set(dueIds);
    return activePool.filter((q) => {
      const key = q.id || q.kanji || q.hiragana;
      return idSet.has(key);
    });
  }, [activePool, dueIds]);

  // Helper lấy chuỗi phát âm chuẩn của từ tiếng Nhật
  const getAudioTarget = useCallback((item) => {
    if (!item) return '';
    return item.audio_url || item.hiragana || item.kanji || item.japanese || '';
  }, []);

  // --- AUDIO AUTO-PLAY KHI SANG CÂU MỚI ---
  useEffect(() => {
    if (status === QUIZ_STATUS.PLAYING && currentQuestion) {
      const target = currentQuestion.correctAnswer;
      const sound = getAudioTarget(target);
      if (sound && (quizMode === 'listening' || questionFormat === 'dictation' || autoPlayAudio)) {
        const timer = setTimeout(() => {
          playAudio(sound, audioSpeed);
        }, 180);
        return () => clearTimeout(timer);
      }
    }
  }, [status, currentIndex, currentQuestion, quizMode, questionFormat, autoPlayAudio, playAudio, getAudioTarget, audioSpeed]);

  // --- BẮT ĐẦU PHIÊN ÔN TẬP ---
  const handleStartSession = useCallback((forceAll = false) => {
    const minRequired = questionFormat === 'choice' ? 4 : 1;
    const shouldUseDue = !forceAll && onlyDue && dueQuestions.length >= minRequired;
    const targetPool = shouldUseDue ? dueQuestions : activePool;

    if (!targetPool || targetPool.length === 0) return;

    const count = questionCount === 'all'
      ? targetPool.length
      : Math.min(questionCount, targetPool.length);

    setWrongItems([]);
    startGame(targetPool, activePool, count);
  }, [questionFormat, onlyDue, dueQuestions, activePool, questionCount, startGame]);

  // --- XỬ LÝ CHỌN ĐÁP ÁN TRẮC NGHIỆM & SM-2 ---
  const onSelectOption = (opt) => {
    if (selectedAnswer !== null) return;

    // 1. Kiểm tra đáp án
    const isCorrect = handleAnswer(opt);
    const target = currentQuestion?.correctAnswer;
    const targetId = target?.id || target?.kanji || target?.hiragana || currentQuestion?.id;

    // 2. Cập nhật thuật toán SM-2 (Đúng: quality = 4, Sai: quality = 1)
    const quality = isCorrect ? 4 : 1;
    if (targetId) {
      reviewItem(targetId, 'vocab', quality, target);
    }

    // 3. Ghi nhận từ sai vào danh sách củng cố
    if (!isCorrect && target) {
      setWrongItems((prev) => {
        const exists = prev.some(
          (w) => (w.id && w.id === target.id) || (w.kanji && w.kanji === target.kanji)
        );
        return exists ? prev : [...prev, target];
      });
    }

    // 4. Phát âm thanh của đáp án đúng để củng cố thính giác
    const soundTarget = getAudioTarget(target);
    if (soundTarget) {
      playAudio(soundTarget, audioSpeed);
    }
  };

  // --- XỬ LÝ NỘP CÂU TRẢ LỜI TỰ LUẬN / DICTATION ---
  const onCheckTypedAnswer = useCallback((answerObj, isCorrect) => {
    if (selectedAnswer !== null) return;

    handleAnswer(answerObj, isCorrect);
    const target = currentQuestion?.correctAnswer;
    const targetId = target?.id || target?.kanji || target?.hiragana || currentQuestion?.id;

    const quality = isCorrect ? 4 : 1;
    if (targetId) {
      reviewItem(targetId, 'vocab', quality, target);
    }

    if (!isCorrect && target) {
      setWrongItems((prev) => {
        const exists = prev.some(
          (w) => (w.id && w.id === target.id) || (w.kanji && w.kanji === target.kanji)
        );
        return exists ? prev : [...prev, target];
      });
    }

    const soundTarget = getAudioTarget(target);
    if (soundTarget) {
      playAudio(soundTarget, audioSpeed);
    }
  }, [selectedAnswer, handleAnswer, currentQuestion, reviewItem, getAudioTarget, playAudio, audioSpeed]);

  // --- THỬ THÁCH LẠI CÁC TỪ LÀM SAI (TARGETED RETRY) ---
  const handleRetryMistakes = useCallback(() => {
    if (wrongItems.length === 0) return;
    const retryPool = [...wrongItems];
    setWrongItems([]);
    startGame(retryPool, activePool, retryPool.length);
  }, [wrongItems, activePool, startGame]);

  // Tên tiêu đề phạm vi hiện tại
  const scopeLabel = useMemo(() => {
    if (selectedScope === 'current') return `Bài ${lessonId}`;
    if (selectedScope === '1-3') return 'Tổng hợp Bài 1 – 3';
    if (selectedScope === '1-5') return 'Tổng hợp Bài 1 – 5';
    if (selectedScope === '1-10') return 'Tổng hợp Bài 1 – 10';
    if (selectedScope === 'all') return 'Toàn bộ 15 bài N5';
    return `Bài ${selectedScope}`;
  }, [selectedScope, lessonId]);

  // =============================================================
  // VIEW 1: IDLE STATE (Thiết lập chế độ, phạm vi và số lượng câu)
  // =============================================================
  const renderIdleView = () => {
    const minRequired = questionFormat === 'choice' ? 4 : 1;
    const hasEnoughItems = activePool.length >= minRequired;

    return (
      <div style={styles.card}>
        {/* Header Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={styles.idleBadge}>
            🧠 Spaced Repetition (SM-2)
          </div>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '600' }}>
            Tổng kho: {activePool.length} từ vựng
          </span>
        </div>

        <h2 style={{ color: '#e91e8c', fontSize: '1.85rem', margin: '12px 0 8px', fontWeight: '800' }}>
          🎯 Luyện Tập & Kiểm Tra Từ Vựng
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.96rem', lineHeight: '1.5', margin: '0 0 20px' }}>
          Lựa chọn trắc nghiệm phản xạ, gõ từ vựng âm tiết WanaKana hoặc luyện nghe chép chính tả Dictation.
        </p>

        {/* 0. TÙY CHỌN HÌNH THỨC ÔN TẬP (QUESTION FORMAT) */}
        <div style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <span>📝 Hình thức ôn tập:</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`quiz-mode-pill ${questionFormat === 'choice' ? 'active' : ''}`}
              onClick={() => setQuestionFormat('choice')}
            >
              🔘 Trắc Nghiệm (4 lựa chọn)
            </button>
            <button
              type="button"
              className={`quiz-mode-pill ${questionFormat === 'typing' ? 'active' : ''}`}
              onClick={() => {
                setQuestionFormat('typing');
                if (quizMode === 'listening') setQuizMode('vi_to_ja');
              }}
            >
              ⌨️ Tự Luận Gõ Phím (WanaKana)
            </button>
            <button
              type="button"
              className={`quiz-mode-pill ${questionFormat === 'dictation' ? 'active' : ''}`}
              onClick={() => {
                setQuestionFormat('dictation');
                setQuizMode('listening');
              }}
            >
              ✍️ Nghe Chép Chính Tả (Dictation)
            </button>
          </div>
        </div>

        {/* 1. TÙY CHỌN DẠNG BÀI / CHIỀU CÂU HỎI */}
        {questionFormat !== 'dictation' && (
          <div style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <span>🎮 Chiều câu hỏi:</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`quiz-mode-pill ${quizMode === 'vi_to_ja' ? 'active' : ''}`}
                onClick={() => setQuizMode('vi_to_ja')}
              >
                🇻🇳 ➔ 🇯🇵 {questionFormat === 'typing' ? 'Gõ Từ Tiếng Nhật' : 'Nghĩa sang Từ'}
              </button>
              <button
                type="button"
                className={`quiz-mode-pill ${quizMode === 'ja_to_vi' ? 'active' : ''}`}
                onClick={() => setQuizMode('ja_to_vi')}
              >
                🔄 🇯🇵 ➔ 🇻🇳 {questionFormat === 'typing' ? 'Gõ Nghĩa Tiếng Việt' : 'Từ sang Nghĩa'}
              </button>
              {questionFormat === 'choice' && (
                <button
                  type="button"
                  className={`quiz-mode-pill ${quizMode === 'listening' ? 'active' : ''}`}
                  onClick={() => setQuizMode('listening')}
                >
                  🎧 Luyện Nghe Audio
                </button>
              )}
            </div>
          </div>
        )}

        {/* 1.1 TÙY CHỌN TỐC ĐỘ PHÁT ÂM AUDIO */}
        {(questionFormat === 'dictation' || quizMode === 'listening') && (
          <div style={styles.sectionBox}>
            <div style={styles.sectionHeader}>
              <span>🎧 Tốc độ phát âm mẫu:</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[0.75, 1.0, 1.25].map((spd) => (
                <button
                  key={`idle-spd-${spd}`}
                  type="button"
                  className={`quiz-mode-pill ${audioSpeed === spd ? 'active' : ''}`}
                  onClick={() => setAudioSpeed(spd)}
                >
                  {spd}x {spd === 0.75 ? '(Chậm rõ)' : spd === 1.0 ? '(Chuẩn)' : '(Nâng cao)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. TÙY CHỌN PHẠM VI BÀI HỌC (SCOPE) */}
        <div style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <span>📚 Phạm vi ôn tập:</span>
            <span style={{ fontSize: '0.85rem', color: '#e91e8c', fontWeight: '700' }}>
              {scopeLabel}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <button
              type="button"
              className={`quiz-chip ${selectedScope === 'current' ? 'active' : ''}`}
              onClick={() => setSelectedScope('current')}
            >
              📌 Bài {lessonId}
            </button>
            <button
              type="button"
              className={`quiz-chip ${selectedScope === '1-3' ? 'active' : ''}`}
              onClick={() => setSelectedScope('1-3')}
            >
              Bài 1 – 3
            </button>
            <button
              type="button"
              className={`quiz-chip ${selectedScope === '1-5' ? 'active' : ''}`}
              onClick={() => setSelectedScope('1-5')}
            >
              Bài 1 – 5
            </button>
            <button
              type="button"
              className={`quiz-chip ${selectedScope === '1-10' ? 'active' : ''}`}
              onClick={() => setSelectedScope('1-10')}
            >
              Bài 1 – 10
            </button>
            <button
              type="button"
              className={`quiz-chip ${selectedScope === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedScope('all')}
            >
              🌟 Tất cả 15 bài
            </button>
          </div>

          {/* Chọn nhanh một bài học đơn lẻ bất kỳ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
            <span>Hoặc chọn nhanh bài:</span>
            <select
              value={typeof selectedScope === 'number' ? selectedScope : (selectedScope === 'current' ? lessonId : '')}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedScope(Number(e.target.value));
                }
              }}
              style={styles.selectInput}
            >
              <option value="">-- Chọn bài lẻ --</option>
              {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Bài {num} ({vocabularyData[String(num)]?.length || 0} từ)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. TÙY CHỌN SỐ LƯỢNG CÂU & BỘ LỌC ĐẾN HẠN SM-2 */}
        <div style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <span>⚡ Số lượng câu hỏi:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#4a5568' }}>
              <input
                type="checkbox"
                checked={autoPlayAudio}
                onChange={(e) => setAutoPlayAudio(e.target.checked)}
                style={{ accentColor: '#e91e8c', cursor: 'pointer' }}
              />
              🔊 Tự động phát âm
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[10, 20, 30].map((count) => (
              <button
                key={count}
                type="button"
                className={`quiz-chip ${questionCount === count ? 'active' : ''}`}
                onClick={() => setQuestionCount(count)}
              >
                {count} câu
              </button>
            ))}
            <button
              type="button"
              className={`quiz-chip ${questionCount === 'all' ? 'active' : ''}`}
              onClick={() => setQuestionCount('all')}
            >
              Tất cả từ
            </button>
          </div>
        </div>

        {/* Thống kê SM-2 & Nút Bắt Đầu */}
        <div style={styles.dueSummaryBox}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: '700' }}>
              {dueQuestions.length > 0
                ? `⚡ Có ${dueQuestions.length} từ đến hạn ôn tập SM-2 trong ${scopeLabel}`
                : `🎉 Tất cả từ vựng trong ${scopeLabel} đã được ôn tập tốt hôm nay!`}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '2px' }}>
              Thuật toán SM-2 sẽ tăng dần khoảng cách ngày ôn tập khi bạn trả lời chính xác.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
          {onBack && (
            <button
              type="button"
              className="quiz-action-btn"
              style={styles.secondaryBtn}
              onClick={onBack}
            >
              ⬅ Quay lại Dashboard
            </button>
          )}

          {dueQuestions.length >= (questionFormat === 'choice' ? 4 : 1) && (
            <button
              type="button"
              className="quiz-action-btn"
              style={styles.primaryBtn}
              onClick={() => {
                setOnlyDue(true);
                handleStartSession(false);
              }}
            >
              🚀 Ôn tập từ đến hạn ({Math.min(questionCount === 'all' ? dueQuestions.length : questionCount, dueQuestions.length)} câu)
            </button>
          )}

          <button
            type="button"
            className="quiz-action-btn"
            style={dueQuestions.length >= (questionFormat === 'choice' ? 4 : 1) ? styles.outlineBtn : styles.primaryBtn}
            onClick={() => {
              setOnlyDue(false);
              handleStartSession(true);
            }}
            disabled={!hasEnoughItems}
          >
            🔄 Ôn tập tự do ({activePool.length} từ)
          </button>
        </div>

        {!hasEnoughItems && (
          <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginTop: '16px', textAlign: 'center' }}>
            ⚠️ {questionFormat === 'choice'
              ? 'Cần tối thiểu 4 từ vựng trong bài học để tạo 4 lựa chọn trắc nghiệm.'
              : 'Không có từ vựng nào trong bài học đã chọn.'}
          </p>
        )}
      </div>
    );
  };

  // =============================================================
  // VIEW 2: PLAYING STATE (Màn hình làm câu hỏi trắc nghiệm)
  // =============================================================
  const renderPlayingView = () => {
    if (!currentQuestion) return null;

    const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
    const target = currentQuestion.correctAnswer;
    const isAnswered = selectedAnswer !== null;

    return (
      <div style={styles.card}>
        {/* Progress Bar */}
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
        </div>

        {/* Header Meta Row */}
        <div style={styles.metaRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: '700' }}>
              Câu {currentIndex + 1} / {totalQuestions}
            </span>
            <span style={styles.modeTag}>
              {questionFormat === 'dictation' && '✍️ Nghe Chép Chính Tả'}
              {questionFormat === 'typing' && (quizMode === 'vi_to_ja' ? '⌨️ Gõ Tiếng Nhật' : '⌨️ Gõ Tiếng Việt')}
              {questionFormat === 'choice' && quizMode === 'vi_to_ja' && '🇻🇳 ➔ 🇯🇵 Nghĩa sang Từ'}
              {questionFormat === 'choice' && quizMode === 'ja_to_vi' && '🔄 🇯🇵 ➔ 🇻🇳 Từ sang Nghĩa'}
              {questionFormat === 'choice' && quizMode === 'listening' && '🎧 Luyện Nghe'}
            </span>
          </div>
          <span style={{ color: '#e91e8c', fontWeight: 'bold', fontSize: '0.95rem' }}>
            ⭐ Đúng: {score}
          </span>
        </div>

        {/* =========================================================
            FORMAT 1: TỰ LUẬN GÕ PHÍM (TYPING MODE)
           ========================================================= */}
        {/* =========================================================
            FORMAT 1: TỰ LUẬN GÕ TỪ VỰNG (TYPING MODE)
           ========================================================= */}
        {questionFormat === 'typing' && (
          <div>
            {quizMode === 'vi_to_ja' && (
              <div style={styles.questionPrompt}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', marginBottom: '8px' }}>
                  ⌨️ LUYỆN GÕ TỪ VỰNG (TYPING MODE)
                </div>
                <span style={styles.promptSubLabel}>🇻🇳 Nghĩa tiếng Việt (Hãy gõ từ tiếng Nhật tương ứng):</span>
                <h1 style={styles.promptMainText}>
                  {target.meaning || target.meaning_vi || target.vietnamese}
                </h1>
              </div>
            )}

            {quizMode === 'ja_to_vi' && (
              <div style={{ ...styles.questionPrompt, borderLeftColor: '#e91e8c' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', marginBottom: '8px' }}>
                  ⌨️ LUYỆN GÕ NGHĨA TIẾNG VIỆT (TYPING MODE)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.promptSubLabel}>🇯🇵 Từ tiếng Nhật (Hãy gõ nghĩa tiếng Việt tương ứng):</span>
                  <button
                    type="button"
                    style={styles.speakerMiniBtn}
                    onClick={() => playAudio(getAudioTarget(target), audioSpeed)}
                    title="Nghe phát âm chuẩn"
                  >
                    🔊 Nghe lại ({audioSpeed}x)
                  </button>
                </div>
                <h1 style={{ ...styles.promptMainText, fontSize: '2.4rem', color: '#1a202c', marginTop: '8px' }}>
                  <FuriganaText kanji={target.kanji} kana={target.hiragana} />
                </h1>
              </div>
            )}

            <QuizTypingInput
              key={`${target.id || target.kanji || target.hiragana || currentIndex}-typing`}
              target={target}
              direction={quizMode === 'ja_to_vi' ? 'to_vi' : 'to_ja'}
              isDictation={false}
              isAnswered={isAnswered}
              selectedAnswer={selectedAnswer}
              onCheckAnswer={onCheckTypedAnswer}
              onNextQuestion={nextQuestion}
              onPlayAudio={(sound) => playAudio(sound, audioSpeed)}
              audioSpeed={audioSpeed}
              onChangeAudioSpeed={setAudioSpeed}
            />
          </div>
        )}

        {/* =========================================================
            FORMAT 2: NGHE CHÉP CHÍNH TẢ (AUDIO DICTATION LAB)
           ========================================================= */}
        {questionFormat === 'dictation' && (
          <div>
            <div style={{
              ...styles.questionPrompt,
              borderLeftColor: isAnswered ? (selectedAnswer?.isCorrect ? '#28a745' : '#dc3545') : '#e91e8c',
              background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
              textAlign: 'center',
              padding: '26px 20px',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(233, 30, 140, 0.08)',
            }}>
              {!isAnswered ? (
                <>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', backgroundColor: '#fce7f3', color: '#be185d', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '800', marginBottom: '10px' }}>
                    🎧 PHÒNG LUYỆN NGHE CHÉP CHÍNH TẢ (AUDIO DICTATION)
                  </div>
                  <div style={styles.promptSubLabel}>
                    Lắng nghe kỹ phát âm của người bản xứ và chép lại từ vựng:
                  </div>

                  {/* Nút Nghe Lớn Có Sóng Âm (Pulse Audio Button) */}
                  <div style={{ margin: '16px 0 10px' }}>
                    <button
                      type="button"
                      className="quiz-listening-audio-btn quiz-pulse-anim"
                      onClick={() => playAudio(getAudioTarget(target), audioSpeed)}
                      title="Bấm để nghe lại phát âm"
                    >
                      <span style={{ fontSize: '2.4rem' }}>🔊</span>
                      <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                        Phát âm lại ({audioSpeed}x)
                      </span>
                    </button>
                  </div>

                  {/* Hoạt ảnh Sóng Âm (Sound Waveform Bars) */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '28px', margin: '8px 0 10px' }}>
                    <div className="dictation-wave-bar" />
                    <div className="dictation-wave-bar" />
                    <div className="dictation-wave-bar" />
                    <div className="dictation-wave-bar" />
                    <div className="dictation-wave-bar" />
                    <div className="dictation-wave-bar" />
                    <div className="dictation-wave-bar" />
                  </div>

                  <div style={{ fontSize: '0.83rem', color: '#64748b' }}>
                    💡 Âm thanh tự phát khi đổi câu. Gõ bằng <strong>Hiragana</strong>, <strong>Katakana</strong> hoặc <strong>Romaji</strong>.
                  </div>
                </>
              ) : (
                <div>
                  <span style={{ fontSize: '0.9rem', color: selectedAnswer?.isCorrect ? '#28a745' : '#dc3545', fontWeight: '800' }}>
                    {selectedAnswer?.isCorrect ? '✓ Bạn đã chép chính xác:' : '✗ Đáp án chuẩn:'}
                  </span>
                  <h1 style={{ fontSize: '2.4rem', color: '#1a202c', margin: '8px 0 6px' }}>
                    <FuriganaText kanji={target.kanji} kana={target.hiragana} />
                  </h1>
                  <p style={{ margin: '0 0 10px', color: '#4a5568', fontSize: '1.15rem', fontWeight: '600' }}>
                    {target.meaning || target.meaning_vi}
                  </p>
                  {selectedAnswer?.userInput && (
                    <div style={{ fontSize: '0.86rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '6px 14px', borderRadius: '10px', display: 'inline-block' }}>
                      Từ bạn đã chép: <strong style={{ color: selectedAnswer?.isCorrect ? '#16a34a' : '#e11d48' }}>「{selectedAnswer.userInput}」</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            <QuizTypingInput
              key={`${target.id || target.kanji || target.hiragana || currentIndex}-dictation`}
              target={target}
              direction="to_ja"
              isDictation={true}
              isAnswered={isAnswered}
              selectedAnswer={selectedAnswer}
              onCheckAnswer={onCheckTypedAnswer}
              onNextQuestion={nextQuestion}
              onPlayAudio={(sound) => playAudio(sound, audioSpeed)}
              audioSpeed={audioSpeed}
              onChangeAudioSpeed={setAudioSpeed}
            />
          </div>
        )}

        {/* =========================================================
            FORMAT 3: TRẮC NGHIỆM 4 LỰA CHỌN (MULTIPLE CHOICE)
           ========================================================= */}
        {questionFormat === 'choice' && (
          <div>
            {/* CHẾ ĐỘ 1: VI ➔ JA (Nghĩa sang Từ) */}
            {quizMode === 'vi_to_ja' && (
              <div style={styles.questionPrompt}>
                <span style={styles.promptSubLabel}>🇻🇳 Nghĩa tiếng Việt:</span>
                <h1 style={styles.promptMainText}>
                  {target.meaning || target.meaning_vi || target.vietnamese}
                </h1>
              </div>
            )}

            {/* CHẾ ĐỘ 2: JA ➔ VI (Từ sang Nghĩa - Đảo chiều) */}
            {quizMode === 'ja_to_vi' && (
              <div style={{ ...styles.questionPrompt, borderLeftColor: '#e91e8c' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.promptSubLabel}>🇯🇵 Chọn nghĩa tiếng Việt đúng của từ:</span>
                  <button
                    type="button"
                    style={styles.speakerMiniBtn}
                    onClick={() => playAudio(getAudioTarget(target), audioSpeed)}
                    title="Nghe phát âm chuẩn"
                  >
                    🔊 Nghe lại ({audioSpeed}x)
                  </button>
                </div>
                <h1 style={{ ...styles.promptMainText, fontSize: '2.4rem', color: '#1a202c', marginTop: '8px' }}>
                  <FuriganaText kanji={target.kanji} kana={target.hiragana} />
                </h1>
              </div>
            )}

            {/* CHẾ ĐỘ 3: LISTENING (Luyện Nghe Trắc Nghiệm) */}
            {quizMode === 'listening' && (
              <div style={{
                ...styles.questionPrompt,
                borderLeftColor: isAnswered ? '#28a745' : '#e91e8c',
                textAlign: 'center',
                padding: '24px 20px',
              }}>
                {!isAnswered ? (
                  <>
                    <span style={styles.promptSubLabel}>
                      🎧 Lắng nghe phát âm và chọn đáp án chính xác:
                    </span>
                    <div style={{ margin: '16px 0' }}>
                      <button
                        type="button"
                        className="quiz-listening-audio-btn quiz-pulse-anim"
                        onClick={() => playAudio(getAudioTarget(target), audioSpeed)}
                        title="Bấm để nghe lại phát âm"
                      >
                        <span style={{ fontSize: '2.5rem' }}>🔊</span>
                        <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>
                          Bấm để nghe lại ({audioSpeed}x)
                        </span>
                      </button>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#718096' }}>
                      (Mặt chữ và nghĩa sẽ hiển thị ngay khi bạn chọn đáp án)
                    </div>
                  </>
                ) : (
                  <div>
                    <span style={{ fontSize: '0.88rem', color: '#28a745', fontWeight: '700' }}>
                      ✓ Đáp án tiếng Nhật chuẩn:
                    </span>
                    <h1 style={{ fontSize: '2.3rem', color: '#1a202c', margin: '8px 0 6px' }}>
                      <FuriganaText kanji={target.kanji} kana={target.hiragana} />
                    </h1>
                    <p style={{ margin: 0, color: '#4a5568', fontSize: '1.1rem', fontWeight: '600' }}>
                      {target.meaning || target.meaning_vi}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* LƯỚI 4 ĐÁP ÁN LỰA CHỌN */}
            <div style={styles.optionsGrid}>
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect =
                  (opt.id && target.id && opt.id === target.id) ||
                  (opt.kanji && target.kanji && opt.kanji === target.kanji) ||
                  opt === target;

                // Trạng thái sau khi trả lời: correct (viền xanh) | wrong (viền đỏ) | faded (mờ)
                let statusClass = '';
                if (isAnswered) {
                  if (isCorrect) {
                    statusClass = 'correct';
                  } else if (isSelected) {
                    statusClass = 'wrong';
                  } else {
                    statusClass = 'faded';
                  }
                }

                return (
                  <div
                    key={`${currentQuestion.questionId || currentQuestion.id}-opt-${idx}`}
                    style={{ position: 'relative' }}
                  >
                    <button
                      type="button"
                      className={`quiz-option-btn ${statusClass}`}
                      onClick={() => onSelectOption(opt)}
                      disabled={isAnswered}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                        {isAnswered && isCorrect && <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>}
                        {isAnswered && isSelected && !isCorrect && <span style={{ color: '#dc3545', fontWeight: 'bold' }}>✗</span>}

                        {/* Hiển thị tiếng Nhật (FuriganaText) khi ở chế độ vi_to_ja */}
                        {quizMode === 'vi_to_ja' && (
                          <span style={{ fontSize: '1.2rem' }}>
                            <FuriganaText
                              kanji={opt.kanji}
                              kana={opt.hiragana || opt.kana}
                            />
                          </span>
                        )}

                        {/* Hiển thị Nghĩa Tiếng Việt khi ở chế độ ja_to_vi hoặc listening */}
                        {(quizMode === 'ja_to_vi' || quizMode === 'listening') && (
                          <span style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                            {opt.meaning || opt.meaning_vi || opt.vietnamese}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Nút [ 🔊 Nghe lại ] hiển thị bên cạnh đáp án đúng khi đã trả lời */}
                    {isAnswered && isCorrect && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(getAudioTarget(opt), audioSpeed);
                        }}
                        title="Nghe lại phát âm chuẩn"
                        style={styles.replayAudioBtn}
                      >
                        🔊 Nghe
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Nút Chuyển Câu Kế Tiếp */}
            {isAnswered && (
              <div style={{ marginTop: '28px', textAlign: 'center' }}>
                <button
                  type="button"
                  className="quiz-action-btn"
                  style={styles.primaryBtn}
                  onClick={nextQuestion}
                >
                  {currentIndex + 1 < totalQuestions ? 'Câu tiếp theo ➔' : 'Xem kết quả 🏁'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // =============================================================
  // VIEW 3: FINISHED STATE (Tổng kết, tỷ lệ % và Cứu hộ từ sai)
  // =============================================================
  const renderFinishedView = () => {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPassed = percentage >= 80;

    return (
      <div style={{ ...styles.card, textAlign: 'center' }}>
        <span style={{ fontSize: '3.2rem', display: 'block', marginBottom: '8px' }}>
          {isPassed ? '🎉' : '💪'}
        </span>
        <h2 style={{ fontSize: '2rem', color: isPassed ? '#28a745' : '#e91e8c', margin: '0 0 16px', fontWeight: '800' }}>
          {isPassed ? 'Xuất Sắc Hoàn Thành!' : 'Hoàn Thành Phiên Ôn Tập!'}
        </h2>

        {/* Score Circle */}
        <div style={styles.scoreCircle}>
          <span style={{ fontSize: '3.4rem', fontWeight: '800', color: '#e91e8c', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '1.1rem', color: '#718096', fontWeight: '600' }}>
            / {totalQuestions}
          </span>
        </div>

        <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', margin: '18px 0 8px' }}>
          Độ chính xác: {percentage}%
        </p>

        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5', maxWidth: '520px', margin: '0 auto 24px' }}>
          {isPassed
            ? 'Tiến độ ôn tập SM-2 đã được cập nhật! Các từ trả lời đúng sẽ kéo dài khoảng cách ôn tập để củng cố trí nhớ dài hạn.'
            : 'Các từ trả lời sai đã được tự động ghi nhận vào Hộp Cứu Hộ Điểm Yếu (Mistake Vault) để bạn luyện tập bổ sung.'}
        </p>

        {/* ⚠️ CỨU HỘ TỪ SAI (TARGETED RETRY) */}
        {wrongItems.length > 0 && (
          <div style={styles.wrongSectionBox}>
            <div style={{ fontWeight: '700', color: '#c53030', marginBottom: '12px', fontSize: '0.98rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>⚠️</span> Có {wrongItems.length} từ bạn trả lời chưa chính xác trong phiên này:
            </div>
            <div style={styles.wrongGrid}>
              {wrongItems.map((item, idx) => (
                <div key={item.id || idx} style={styles.wrongItemChip}>
                  <div style={{ fontWeight: '700', color: '#1a202c', fontSize: '1rem' }}>
                    {item.kanji ? `${item.kanji} (${item.hiragana})` : item.hiragana}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '2px' }}>
                    {item.meaning || item.meaning_vi}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="quiz-action-btn"
              style={styles.retryMistakesBtn}
              onClick={handleRetryMistakes}
            >
              🔥 Thử thách lại {wrongItems.length} từ làm sai ngay
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
          <button
            type="button"
            className="quiz-action-btn"
            style={styles.secondaryBtn}
            onClick={quitGame}
          >
            ⚙️ Tùy chỉnh chế độ & phạm vi
          </button>
          <button
            type="button"
            className="quiz-action-btn"
            style={styles.primaryBtn}
            onClick={() => handleStartSession(false)}
          >
            🔄 Luyện tập lại
          </button>
          {onBack && (
            <button
              type="button"
              className="quiz-action-btn"
              style={styles.outlineBtn}
              onClick={onBack}
            >
              🏠 Về Dashboard
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {status === QUIZ_STATUS.IDLE && renderIdleView()}
      {status === QUIZ_STATUS.PLAYING && renderPlayingView()}
      {status === QUIZ_STATUS.FINISHED && renderFinishedView()}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '65vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '32px 28px',
    boxShadow: '0 10px 32px rgba(233, 30, 140, 0.1)',
    border: '1px solid #fce7f3',
  },
  idleBadge: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '16px',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  sectionBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '14px 18px',
    marginBottom: '14px',
    border: '1px solid #f1f5f9',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontWeight: '700',
    color: '#334155',
    fontSize: '0.92rem',
  },
  selectInput: {
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    fontSize: '0.85rem',
    color: '#334155',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  dueSummaryBox: {
    backgroundColor: '#fffaf0',
    borderLeft: '4px solid #dd6b20',
    padding: '14px 18px',
    borderRadius: '12px',
    marginTop: '16px',
  },
  progressTrack: {
    width: '100%',
    height: '8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e91e8c',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modeTag: {
    fontSize: '0.78rem',
    fontWeight: '700',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  questionPrompt: {
    backgroundColor: '#fffaf0',
    borderLeft: '4px solid #dd6b20',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  promptSubLabel: {
    fontSize: '0.86rem',
    color: '#718096',
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
  },
  promptMainText: {
    fontSize: '2rem',
    color: '#2d3748',
    margin: 0,
    fontWeight: '800',
    lineHeight: '1.3',
  },
  speakerMiniBtn: {
    padding: '4px 12px',
    backgroundColor: '#fff0f6',
    border: '1px solid #fbcfe8',
    borderRadius: '14px',
    color: '#e91e8c',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    outline: 'none',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  replayAudioBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#ffffff',
    border: '1.5px solid #e91e8c',
    color: '#e91e8c',
    borderRadius: '14px',
    padding: '4px 12px',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.2)',
    zIndex: 2,
  },
  scoreCircle: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    border: '6px solid #fce7f3',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrongSectionBox: {
    backgroundColor: '#fff5f5',
    border: '1.5px solid #fed7d7',
    borderRadius: '18px',
    padding: '18px',
    marginBottom: '20px',
  },
  wrongGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
    marginBottom: '16px',
  },
  wrongItemChip: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '10px 12px',
    border: '1px solid #feb2b2',
    textAlign: 'left',
  },
  retryMistakesBtn: {
    padding: '12px 24px',
    backgroundColor: '#e53e3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.95rem',
    boxShadow: '0 4px 14px rgba(229, 62, 62, 0.35)',
  },
  primaryBtn: {
    padding: '12px 28px',
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.95rem',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
  },
  secondaryBtn: {
    padding: '12px 24px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
  outlineBtn: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#e91e8c',
    border: '2px solid #e91e8c',
    borderRadius: '25px',
    fontWeight: '700',
    fontSize: '0.95rem',
  },
};
