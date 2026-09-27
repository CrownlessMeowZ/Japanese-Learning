import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuizEngine, QUIZ_STATUS } from '../../hooks/useQuizEngine';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useProgress } from '../../hooks/useProgress';
import { vocabularyData } from '../../data/vocabulary';
import { quizStyles } from './views/quizViewStyles';
import { QuizConfigView } from './views/QuizConfigView';
import { QuizChoiceView } from './views/QuizChoiceView';
import { QuizDictationView } from './views/QuizDictationView';
import { QuizResultView } from './views/QuizResultView';
import '../../styles/quiz.css';

/**
 * QuizScreen Component (Orchestrator Pattern)
 * Điều phối luồng làm bài và kết nối State/SM-2 Logic với 4 Dumb Views:
 * 1. QuizConfigView: Màn hình thiết lập chế độ, phạm vi bài học và số lượng câu hỏi
 * 2. QuizChoiceView: Chế độ trắc nghiệm 4 lựa chọn (Nghĩa -> Từ, Từ -> Nghĩa, Luyện nghe)
 * 3. QuizDictationView: Chế độ luyện gõ phím WanaKana & Nghe chép chính tả (Dictation)
 * 4. QuizResultView: Tổng kết kết quả & Cứu hộ từ sai (Targeted Retry)
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
  // 1. Hình thức làm bài: 'choice' | 'typing' | 'dictation'
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

    const isCorrect = handleAnswer(opt);
    const target = currentQuestion?.correctAnswer;
    const targetId = target?.id || target?.kanji || target?.hiragana || currentQuestion?.id;

    // Cập nhật thuật toán SM-2 (Đúng: quality = 4, Sai: quality = 1)
    const quality = isCorrect ? 4 : 1;
    if (targetId) {
      reviewItem(targetId, 'vocab', quality, target);
    }

    // Ghi nhận từ sai vào danh sách củng cố
    if (!isCorrect && target) {
      setWrongItems((prev) => {
        const exists = prev.some(
          (w) => (w.id && w.id === target.id) || (w.kanji && w.kanji === target.kanji)
        );
        return exists ? prev : [...prev, target];
      });
    }

    // Phát âm thanh củng cố thính giác
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

  return (
    <div style={quizStyles.container}>
      {/* VIEW 1: IDLE STATE */}
      {status === QUIZ_STATUS.IDLE && (
        <QuizConfigView
          activePool={activePool}
          lessonId={lessonId}
          scopeLabel={scopeLabel}
          questionFormat={questionFormat}
          setQuestionFormat={setQuestionFormat}
          quizMode={quizMode}
          setQuizMode={setQuizMode}
          audioSpeed={audioSpeed}
          setAudioSpeed={setAudioSpeed}
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          autoPlayAudio={autoPlayAudio}
          setAutoPlayAudio={setAutoPlayAudio}
          dueQuestions={dueQuestions}
          onStartSession={(forceAll) => {
            setOnlyDue(!forceAll);
            handleStartSession(forceAll);
          }}
          onBack={onBack}
        />
      )}

      {/* VIEW 2: PLAYING STATE */}
      {status === QUIZ_STATUS.PLAYING && currentQuestion && (
        <div style={quizStyles.card}>
          {/* Progress Bar */}
          <div style={quizStyles.progressTrack}>
            <div
              style={{
                ...quizStyles.progressFill,
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Header Meta Row */}
          <div style={quizStyles.metaRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: '700' }}>
                Câu {currentIndex + 1} / {totalQuestions}
              </span>
              <span style={quizStyles.modeTag}>
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

          {/* Render Presentational View theo Question Format */}
          {questionFormat === 'choice' ? (
            <QuizChoiceView
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              quizMode={quizMode}
              audioSpeed={audioSpeed}
              onSelectOption={onSelectOption}
              onNextQuestion={nextQuestion}
              onPlayAudio={playAudio}
              getAudioTarget={getAudioTarget}
              currentIndex={currentIndex}
              totalQuestions={totalQuestions}
            />
          ) : (
            <QuizDictationView
              currentQuestion={currentQuestion}
              questionFormat={questionFormat}
              quizMode={quizMode}
              selectedAnswer={selectedAnswer}
              currentIndex={currentIndex}
              audioSpeed={audioSpeed}
              setAudioSpeed={setAudioSpeed}
              onCheckTypedAnswer={onCheckTypedAnswer}
              onNextQuestion={nextQuestion}
              onPlayAudio={playAudio}
              getAudioTarget={getAudioTarget}
            />
          )}
        </div>
      )}

      {/* VIEW 3: FINISHED STATE */}
      {status === QUIZ_STATUS.FINISHED && (
        <QuizResultView
          score={score}
          totalQuestions={totalQuestions}
          wrongItems={wrongItems}
          onRetryMistakes={handleRetryMistakes}
          onQuitGame={quitGame}
          onRestartSession={() => handleStartSession(false)}
          onBack={onBack}
        />
      )}
    </div>
  );
};
