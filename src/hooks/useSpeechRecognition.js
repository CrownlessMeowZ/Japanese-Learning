// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook: useSpeechRecognition (Nâng cấp toàn diện Bước 3)
 * Bọc Web Speech Recognition API (webkitSpeechRecognition) cho tiếng Nhật & tiếng Việt
 * 
 * Các cải tiến vượt bậc:
 * 1. Bật continuous = true: Giữ luồng thu âm liên tục, không bị ngắt ngang khi người dùng ngập ngừng lấy hơi.
 * 2. Bật interimResults = true: Trả về kết quả theo thời gian thực (real-time stream) để người dùng thấy mic bắt âm ngay.
 * 3. Cơ chế 3 tầng tự động ngắt thông minh (Smart 3-Tier Auto-Stop):
 *    - Tier 1: Khoảng chờ ban đầu 5.0s (khắc phục dứt điểm lỗi bật 0.5s - 1s mic đã tự tắt).
 *    - Tier 2: Tự động chốt kết quả sau 1.8s im lặng khi nói xong (Trailing Silence - rảnh tay, không cần bấm tắt).
 *    - Tier 3: Khống chế thời gian tối đa 10.0s (bảo vệ pin và tránh thu tạp âm nếu người dùng quên tắt).
 */
export const useSpeechRecognition = (options = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const optionsRef = useRef(options);
  const isListeningRef = useRef(false);
  const hasSpokenRef = useRef(false);
  const fullTranscriptRef = useRef('');

  // Bộ đếm thời gian cho các tầng Auto-Stop
  const initialSilenceTimerRef = useRef(null);
  const trailingSilenceTimerRef = useRef(null);
  const maxTimeoutTimerRef = useRef(null);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const isSupported = typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  // Xóa toàn bộ các bộ đếm thời gian
  const clearAllTimers = useCallback(() => {
    if (initialSilenceTimerRef.current) {
      clearTimeout(initialSilenceTimerRef.current);
      initialSilenceTimerRef.current = null;
    }
    if (trailingSilenceTimerRef.current) {
      clearTimeout(trailingSilenceTimerRef.current);
      trailingSilenceTimerRef.current = null;
    }
    if (maxTimeoutTimerRef.current) {
      clearTimeout(maxTimeoutTimerRef.current);
      maxTimeoutTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    clearAllTimers();
    isListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Bỏ qua nếu đã dừng
      }
    }

    // Bắn kết quả cuối cùng nếu có
    const finalResult = fullTranscriptRef.current.trim();
    if (finalResult && optionsRef.current.onResult) {
      optionsRef.current.onResult(finalResult);
    }
  }, [clearAllTimers]);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = options.lang || 'ja-JP';
    recognition.continuous = true; // Giữ luồng âm thanh liên tục không ngắt sớm
    recognition.interimResults = true; // Nhận diện thời gian thực
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);

      // TIER 1: Khoảng chờ mở đầu 5.0 giây (Grace Period)
      // Cho phép người học thoải mái chuẩn bị tâm lý và lấy hơi mà không bị tắt mic
      initialSilenceTimerRef.current = setTimeout(() => {
        if (!hasSpokenRef.current && isListeningRef.current) {
          setError('Chưa nghe thấy giọng nói. Hãy bấm mic và thử lại nhé!');
          stopListening();
        }
      }, 5000);

      // TIER 3: Khống chế thời gian tối đa 10.0 giây (nếu người dùng quên tắt mic)
      maxTimeoutTimerRef.current = setTimeout(() => {
        if (isListeningRef.current) {
          stopListening();
        }
      }, 10000);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let finalAccumulated = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalAccumulated += text;
        } else {
          interim += text;
        }
      }

      // Khi đã có âm thanh phát ra:
      if (interim || finalAccumulated) {
        hasSpokenRef.current = true;
        // Hủy bộ đếm khoảng lặng mở đầu vì người dùng đã bắt đầu nói
        if (initialSilenceTimerRef.current) {
          clearTimeout(initialSilenceTimerRef.current);
          initialSilenceTimerRef.current = null;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
      }

      if (finalAccumulated) {
        fullTranscriptRef.current = (fullTranscriptRef.current + ' ' + finalAccumulated).trim();
        setTranscript(fullTranscriptRef.current);
        setInterimTranscript('');
      }

      // TIER 2: Tự động chốt khi người dùng nói xong (Trailing Silence 1.8 giây)
      // Mỗi khi có tín hiệu âm thanh mới, reset lại bộ đếm 1.8s.
      // Khi người dùng dừng lại 1.8s sau từ cuối cùng -> Tự động chốt và đóng mic!
      if (trailingSilenceTimerRef.current) {
        clearTimeout(trailingSilenceTimerRef.current);
      }
      trailingSilenceTimerRef.current = setTimeout(() => {
        if (isListeningRef.current && hasSpokenRef.current) {
          const currentText = (fullTranscriptRef.current || interim).trim();
          if (currentText) {
            fullTranscriptRef.current = currentText;
            setTranscript(currentText);
          }
          stopListening();
        }
      }, 1800);
    };

    recognition.onerror = (event) => {
      // 'no-speech' trong khoảng 5s đầu là bình thường khi người dùng đang suy nghĩ
      if (event.error === 'no-speech') {
        if (!hasSpokenRef.current && isListeningRef.current) {
          // Bỏ qua, để initialSilenceTimer tự xử lý sau 5s thay vì tắt ngay ở 0.5s!
          return;
        }
      } else if (event.error !== 'aborted') {
        console.warn('[useSpeechRecognition] Error:', event.error);
        setError(event.error);
        stopListening();
      }
    };

    recognition.onend = () => {
      // Nếu browser tự ngắt trong khi vẫn trong thời gian thu âm hợp lệ:
      if (isListeningRef.current && !hasSpokenRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          // Bỏ qua nếu không khởi động lại được
        }
      }
      setIsListening(false);
      isListeningRef.current = false;
      clearAllTimers();
    };

    recognitionRef.current = recognition;

    return () => {
      clearAllTimers();
      try {
        recognition.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    };
  }, [isSupported, options.lang, clearAllTimers, stopListening]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('NOT_SUPPORTED');
      return;
    }

    clearAllTimers();
    hasSpokenRef.current = false;
    fullTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        if (err.name !== 'InvalidStateError') {
          console.warn('[useSpeechRecognition] startListening error:', err);
        }
      }
    }
  }, [isSupported, clearAllTimers]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    hasSpokenRef.current = false;
    fullTranscriptRef.current = '';
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
