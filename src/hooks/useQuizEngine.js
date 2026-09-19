import { useState, useCallback, useMemo } from 'react';

/**
 * Quiz State Machine Enum
 * @readonly
 * @enum {string}
 */
export const QUIZ_STATUS = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED',
};

/**
 * Fisher-Yates (Knuth) Shuffle Algorithm
 * Đảm bảo phân phối ngẫu nhiên đồng đều (Unbiased Permutation).
 * Tránh vòng lặp vô hạn và suy biến hiệu năng của while + rejection sampling.
 * 
 * @template T
 * @param {T[]} array - Mảng đầu vào
 * @returns {T[]} Mảng mới đã được xáo trộn ngẫu nhiên
 * 
 * @complexity Time: O(N) - Duyệt ngược từ N-1 về 1, mỗi bước hoán vị O(1).
 * @complexity Space: O(N) - Tạo bản sao mảng, không mutate trực tiếp dữ liệu nguồn.
 */
export const fisherYatesShuffle = (array) => {
  if (!Array.isArray(array) || array.length <= 1) {
    return array ? [...array] : [];
  }

  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i--) {
    // Chọn chỉ số ngẫu nhiên trong khoảng [0, i]
    const j = Math.floor(Math.random() * (i + 1));
    // Swap in-place
    const temp = clone[i];
    clone[i] = clone[j];
    clone[j] = temp;
  }

  return clone;
};

/**
 * Custom Hook: useQuizEngine
 * Quản lý toàn bộ State Machine và thuật toán sinh câu hỏi trắc nghiệm
 */
export const useQuizEngine = () => {
  const [status, setStatus] = useState(QUIZ_STATUS.IDLE);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  /**
   * Khởi tạo và sinh bộ câu hỏi trắc nghiệm
   * 
   * @param {Array<Object>} rawItems - Tập dữ liệu thô (tối thiểu 4 phần tử)
   * @param {number} [quizLength=10] - Số lượng câu hỏi muốn sinh
   * 
   * @complexity Time: O(M * N) với M = quizLength, N = tổng số rawItems.
   *             Vì N ~ 100-1000 và M <= 20, thuật toán chạy trong < 2ms.
   * @complexity Space: O(M) lưu trữ bộ câu hỏi.
   */
  const startGame = useCallback((rawItems, distractorBankOrLength = 10, lengthParam = 10) => {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      console.warn('[useQuizEngine] Cần có ít nhất 1 item để bắt đầu.');
      return false;
    }

    const hasCustomBank = Array.isArray(distractorBankOrLength);
    const distractorBank = hasCustomBank ? distractorBankOrLength : rawItems;
    const quizLength = hasCustomBank ? lengthParam : distractorBankOrLength;

    if (distractorBank.length < 4) {
      console.warn('[useQuizEngine] Cần tối thiểu 4 items trong ngân hàng để tạo 4 lựa chọn trắc nghiệm.');
      return false;
    }

    // 1. Trộn toàn bộ câu hỏi mục tiêu để chọn ra M câu hỏi chính
    const shuffledBank = fisherYatesShuffle(rawItems);
    const selectedBank = shuffledBank.slice(0, Math.min(quizLength, shuffledBank.length));

    // 2. Với mỗi câu hỏi, trích xuất 3 Distractors (đáp án sai) từ ngân hàng từ vựng
    const generatedQuestions = selectedBank.map((targetItem, idx) => {
      // Lọc bỏ đáp án đúng và các từ đồng nghĩa khỏi danh sách làm distractor
      const targetMeaning = targetItem.meaning || targetItem.meaning_vi || targetItem.vietnamese;

      const candidateDistractors = distractorBank.filter((item) => {
        if (item.id && targetItem.id) return item.id !== targetItem.id;
        if (item.kanji && targetItem.kanji) return item.kanji !== targetItem.kanji;
        if (item.hiragana && targetItem.hiragana) return item.hiragana !== targetItem.hiragana;
        const itemMeaning = item.meaning || item.meaning_vi || item.vietnamese;
        if (targetMeaning && itemMeaning && targetMeaning === itemMeaning) return false;
        return item !== targetItem;
      });

      // Trộn tập ứng viên và lấy đúng 3 phần tử đầu tiên -> Đảm bảo O(N)
      const chosenDistractors = fisherYatesShuffle(candidateDistractors).slice(0, 3);

      // Gộp 1 đáp án đúng + 3 đáp án sai và xáo trộn vị trí hiển thị
      const options = fisherYatesShuffle([targetItem, ...chosenDistractors]);

      return {
        id: targetItem.id || targetItem.kanji || targetItem.hiragana || `quiz_q_${idx + 1}`,
        questionId: `quiz_q_${idx + 1}`,
        correctAnswer: targetItem,
        options,
      };
    });

    // 3. Reset state & chuyển trạng thái sang PLAYING
    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setStatus(QUIZ_STATUS.PLAYING);
    return true;
  }, []);

  /**
   * Xử lý khi người dùng chọn một đáp án hoặc nhập câu trả lời tự luận
   * @param {Object} option - Đáp án được chọn hoặc object câu trả lời tự luận { userInput, isCorrect }
   * @param {boolean|null} [customIsCorrect=null] - Cho phép truyền cờ đúng/sai tùy biến (dành cho chế độ gõ Typing)
   * @returns {boolean|null} Trả về boolean isCorrect nếu xử lý thành công
   */
  const handleAnswer = useCallback((option, customIsCorrect = null) => {
    if (status !== QUIZ_STATUS.PLAYING || selectedAnswer !== null) {
      return null;
    }

    const currentQ = questions[currentIndex];
    if (!currentQ) return null;

    setSelectedAnswer(option);

    // Kiểm tra tính đúng đắn
    let isCorrect;
    if (typeof customIsCorrect === 'boolean') {
      isCorrect = customIsCorrect;
    } else if (typeof option === 'object' && option !== null && 'isCorrect' in option) {
      isCorrect = Boolean(option.isCorrect);
    } else {
      isCorrect = Boolean(
        (option?.id && currentQ.correctAnswer.id && option.id === currentQ.correctAnswer.id) ||
        (option?.kanji && currentQ.correctAnswer.kanji && option.kanji === currentQ.correctAnswer.kanji) ||
        option === currentQ.correctAnswer
      );
    }

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    return isCorrect;
  }, [status, selectedAnswer, questions, currentIndex]);

  /**
   * Chuyển sang câu hỏi kế tiếp hoặc kết thúc Quiz
   */
  const nextQuestion = useCallback(() => {
    if (status !== QUIZ_STATUS.PLAYING) return;

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prevIdx) => prevIdx + 1);
      setSelectedAnswer(null);
    } else {
      setStatus(QUIZ_STATUS.FINISHED);
    }
  }, [status, currentIndex, questions.length]);

  /**
   * Thoát bài Quiz, đưa State Machine về IDLE
   */
  const quitGame = useCallback(() => {
    setStatus(QUIZ_STATUS.IDLE);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  }, []);

  // Computed Properties (Memoized)
  const currentQuestion = useMemo(() => {
    if (status !== QUIZ_STATUS.PLAYING || !questions[currentIndex]) {
      return null;
    }
    return questions[currentIndex];
  }, [status, questions, currentIndex]);

  const isAnswerCorrect = useMemo(() => {
    if (selectedAnswer === null || !currentQuestion) return null;
    if (typeof selectedAnswer === 'object' && selectedAnswer !== null && 'isCorrect' in selectedAnswer) {
      return Boolean(selectedAnswer.isCorrect);
    }
    return (
      (selectedAnswer.id && currentQuestion.correctAnswer.id && selectedAnswer.id === currentQuestion.correctAnswer.id) ||
      (selectedAnswer.kanji && currentQuestion.correctAnswer.kanji && selectedAnswer.kanji === currentQuestion.correctAnswer.kanji) ||
      selectedAnswer === currentQuestion.correctAnswer
    );
  }, [selectedAnswer, currentQuestion]);

  return {
    // States
    status,
    questions,
    currentIndex,
    currentQuestion,
    score,
    selectedAnswer,
    isAnswerCorrect,
    totalQuestions: questions.length,

    // Actions
    startGame,
    handleAnswer,
    nextQuestion,
    quitGame,
  };
};
