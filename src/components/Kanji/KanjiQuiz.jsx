import React, { useState, useMemo, useCallback } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { KanjiQuizSetupView } from './views/KanjiQuizSetupView';
import { KanjiQuizPlayView } from './views/KanjiQuizPlayView';
import { KanjiQuizResultView } from './views/KanjiQuizResultView';
import '../../styles/sakura.css';

/**
 * Fisher-Yates shuffle algorithm
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * KanjiQuiz Component - Orchestrator Đấu Trường Trắc Nghiệm Hán Tự N5
 * Điều phối 3 views: Setup ➔ Play ➔ Result
 */
export const KanjiQuiz = ({
  kanjiList = [],
  learnedMap = {},
  onMarkLearned,
  onBackToGrid,
}) => {
  const { playAudio } = useAudioPlayer();

  // Quiz configuration state
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [selectedLesson, setSelectedLesson] = useState('all');
  const [questionType, setQuestionType] = useState('kanji_to_hanviet');
  const [questionCount, setQuestionCount] = useState(10);

  // Active play state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missedKanji, setMissedKanji] = useState([]);

  // Danh sách các bài học có Hán tự
  const availableLessons = useMemo(() => {
    const set = new Set(kanjiList.map((k) => k.lessonId).filter(Boolean));
    return ['all', ...Array.from(set).sort((a, b) => a - b)];
  }, [kanjiList]);

  // Bộ Hán tự theo bài lọc hoặc chỉ chữ chưa thuộc
  const targetPool = useMemo(() => {
    if (selectedLesson === 'unlearned') {
      return kanjiList.filter((k) => !learnedMap[k.id || k.character]);
    }
    if (selectedLesson === 'all') return kanjiList;
    return kanjiList.filter((k) => k.lessonId === Number(selectedLesson));
  }, [kanjiList, selectedLesson, learnedMap]);

  /**
   * Khởi tạo ngân hàng câu hỏi trắc nghiệm
   */
  const startQuiz = useCallback((customPool = null) => {
    const pool = customPool || targetPool;
    if (!pool || pool.length < 4) return;

    const shuffled = shuffleArray(pool);
    const count = questionCount === 'all' ? shuffled.length : Math.min(Number(questionCount), shuffled.length);
    const selectedTargets = shuffled.slice(0, count);

    const generated = selectedTargets.map((target) => {
      const otherCandidates = pool.filter((k) => k.character !== target.character);
      const distractors = shuffleArray(otherCandidates).slice(0, 3);

      let questionText = '';
      let subPrompt = '';
      let correctAnswer = '';
      let options = [];

      if (questionType === 'kanji_to_hanviet') {
        questionText = target.character;
        subPrompt = 'Chọn Âm Hán-Việt và Nghĩa tương ứng';
        correctAnswer = `${target.hanViet} (${target.meaning})`;
        options = shuffleArray([
          correctAnswer,
          ...distractors.map((d) => `${d.hanViet} (${d.meaning})`),
        ]);
      } else if (questionType === 'hanviet_to_kanji') {
        questionText = `${target.hanViet}`;
        subPrompt = `Ý nghĩa: "${target.meaning}" — Chọn Chữ Hán đúng`;
        correctAnswer = target.character;
        options = shuffleArray([
          correctAnswer,
          ...distractors.map((d) => d.character),
        ]);
      } else {
        questionText = target.character;
        subPrompt = `Âm Hán: ${target.hanViet} — Chọn cách đọc đúng`;
        const kunStr = (target.kunyomi || []).join(' / ') || '—';
        const onStr = (target.onyomi || []).join(' / ') || '—';
        correctAnswer = `Kun: ${kunStr} | On: ${onStr}`;
        options = shuffleArray([
          correctAnswer,
          ...distractors.map((d) => {
            const dKun = (d.kunyomi || []).join(' / ') || '—';
            const dOn = (d.onyomi || []).join(' / ') || '—';
            return `Kun: ${dKun} | On: ${dOn}`;
          }),
        ]);
      }

      return {
        target,
        questionText,
        subPrompt,
        correctAnswer,
        options,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setMissedKanji([]);
    setQuizState('playing');
  }, [targetPool, questionCount, questionType]);

  const currentQ = questions[currentIndex];

  /**
   * Xử lý khi người dùng chọn đáp án
   */
  const handleSelectOption = (opt) => {
    if (isAnswered) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      const audioTarget = currentQ.target?.kunyomi?.[0]?.replace(/\./g, '') ||
                          currentQ.target?.character ||
                          currentQ.target?.examples?.[0]?.word || '';
      if (audioTarget) {
        playAudio(audioTarget);
      }

      if (onMarkLearned && currentQ.target?.id) {
        onMarkLearned(currentQ.target.id);
      }
    } else {
      setStreak(0);
      setMissedKanji((prev) => {
        if (prev.some((k) => k.character === currentQ.target.character)) return prev;
        return [...prev, currentQ.target];
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizState('result');
    }
  };

  if (quizState === 'setup') {
    return (
      <KanjiQuizSetupView
        availableLessons={availableLessons}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        kanjiList={kanjiList}
        learnedMap={learnedMap}
        questionType={questionType}
        setQuestionType={setQuestionType}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        targetPool={targetPool}
        onBackToGrid={onBackToGrid}
        onStartQuiz={() => startQuiz()}
      />
    );
  }

  if (quizState === 'playing' && currentQ) {
    return (
      <KanjiQuizPlayView
        currentQ={currentQ}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        streak={streak}
        questionType={questionType}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        onSelectOption={handleSelectOption}
        onNextQuestion={handleNextQuestion}
        onQuit={() => setQuizState('setup')}
      />
    );
  }

  return (
    <KanjiQuizResultView
      score={score}
      totalQuestions={questions.length}
      missedKanji={missedKanji}
      onRetryMissed={() => startQuiz(missedKanji)}
      onRestartNew={() => startQuiz()}
      onBackToGrid={onBackToGrid}
    />
  );
};
