// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook: useSpeechRecognition
 * Bọc Web Speech Recognition API (webkitSpeechRecognition) cho tiếng Nhật (ja-JP)
 * Xử lý Graceful Degradation và tự động dọn dẹp listeners
 */
export const useSpeechRecognition = (options = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const isSupported = typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = options.lang || 'ja-JP';
    recognition.continuous = false; // Thu 1 câu hoàn chỉnh rồi dừng
    recognition.interimResults = false; // Chỉ nhận kết quả chốt cuối cùng
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript;
      setTranscript(resultText);
      if (options.onResult) {
        options.onResult(resultText);
      }
    };

    recognition.onerror = (event) => {
      // 'no-speech' không coi là lỗi nghiêm trọng, chỉ là user chưa nói
      if (event.error !== 'no-speech') {
        console.warn('[useSpeechRecognition] Error:', event.error);
        setError(event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {
        // Ignore abort on unmount
      }
      recognitionRef.current = null;
    };
  }, [isSupported, options.lang]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('NOT_SUPPORTED');
      return;
    }

    if (recognitionRef.current) {
      try {
        setTranscript('');
        setError(null);
        recognitionRef.current.start();
      } catch (err) {
        // Tránh lỗi khi gọi start() lúc recognition đang trong quá trình chạy
        if (err.name !== 'InvalidStateError') {
          console.warn('[useSpeechRecognition] startListening error:', err);
        }
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
