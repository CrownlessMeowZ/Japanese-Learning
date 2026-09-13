// src/hooks/useAudioPlayer.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Global Audio Manager (Singleton instance ngoài React lifecycle)
 * Đảm bảo chỉ có duy nhất 1 nguồn phát âm thanh (HTML5 Audio hoặc SpeechSynthesis)
 * trên toàn bộ ứng dụng tại bất kỳ thời điểm nào.
 */
class AudioManager {
  constructor() {
    if (AudioManager.instance) {
      return AudioManager.instance;
    }
    this.currentAudio = null;
    this.currentUtterance = null;
    this.currentPlayingTarget = null;
    this.subscribers = new Set();
    AudioManager.instance = this;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(isPlaying, target = null) {
    this.currentPlayingTarget = isPlaying ? target : null;
    this.subscribers.forEach((cb) => cb(isPlaying, this.currentPlayingTarget));
  }

  stopAll() {
    // 1. Dừng HTML5 Audio và hủy sạch event listeners
    if (this.currentAudio) {
      this.currentAudio.onended = null;
      this.currentAudio.onerror = null;
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // 2. Dừng Web Speech API nếu đang phát
    this.currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.notify(false, null);
  }

  /**
   * Kiểm tra chuỗi truyền vào là URL file âm thanh hay văn bản tiếng Nhật
   * @param {string} input 
   * @returns {boolean}
   */
  isAudioUrl(input) {
    if (typeof input !== 'string') return false;
    const urlPattern = /^(https?:\/\/|\/|blob:|\.\.?\/).*\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i;
    return urlPattern.test(input.trim());
  }

  /**
   * Làm sạch chuỗi Furigana dạng "漢字[かんじ]" thành văn bản chuẩn để đọc
   * @param {string} text 
   * @returns {string}
   */
  cleanJapaneseText(text) {
    if (!text) return '';
    // Chuyển "私[わたし]は" thành "わたしは" hoặc giữ nguyên chữ Hán nếu không có ngoặc
    return text.replace(/\[(.*?)\]/g, '$1').trim();
  }

  play(textOrUrl) {
    if (!textOrUrl || typeof textOrUrl !== 'string') return;
    const input = textOrUrl.trim();

    // Nếu click lại chính mục đang phát -> Toggle Pause/Stop
    if (this.currentPlayingTarget === input) {
      this.stopAll();
      return;
    }

    // Dừng âm thanh trước đó ngay lập tức (Chống đè âm)
    this.stopAll();

    // Mode 1: HTML5 Audio (File MP3/WAV tĩnh)
    if (this.isAudioUrl(input)) {
      const audio = new Audio(input);
      this.currentAudio = audio;
      this.notify(true, input);

      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.notify(false, null);
        }
      };

      audio.onerror = () => {
        // Chỉ xử lý fallback nếu audio lỗi vẫn là audio đang active (chống race condition)
        if (this.currentAudio !== audio) return;
        console.warn(`[AudioManager] Không thể load file: ${input}, fallback sang TTS.`);
        this.currentAudio = null;
        this.playSpeech(input);
      };

      audio.play().catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('[AudioManager] Play error:', err);
          if (this.currentAudio === audio) {
            this.currentAudio = null;
            this.playSpeech(input);
          }
        }
      });
      return;
    }

    // Mode 2: Web Speech Synthesis Fallback (Nhật ngữ)
    this.playSpeech(input);
  }

  playSpeech(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('[AudioManager] Web Speech API không được hỗ trợ trên trình duyệt này.');
      this.notify(false, null);
      return;
    }

    const cleanText = this.cleanJapaneseText(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.88; // Tốc độ chuẩn cho người học ngoại ngữ

    this.currentUtterance = utterance;

    utterance.onstart = () => {
      if (this.currentUtterance === utterance) {
        this.notify(true, text);
      }
    };

    utterance.onend = () => {
      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
        this.notify(false, null);
      }
    };

    utterance.onerror = (e) => {
      // Bỏ qua lỗi 'interrupted' hoặc 'canceled' do stopAll chủ động hủy để không đè state của utterance mới
      if (e.error === 'interrupted' || e.error === 'canceled') return;

      if (this.currentUtterance === utterance) {
        this.currentUtterance = null;
        this.notify(false, null);
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
}

const audioManager = new AudioManager();

/**
 * Custom Hook: useAudioPlayer
 * Cung cấp state `isPlaying` (boolean hoặc kiểm tra theo target) và action `playAudio`
 */
export const useAudioPlayer = (specificTarget = null) => {
  const [currentlyPlayingTarget, setCurrentlyPlayingTarget] = useState(audioManager.currentTextOrUrl);
  const [isPlayingGlobally, setIsPlayingGlobally] = useState(Boolean(audioManager.currentTextOrUrl));

  useEffect(() => {
    // Đăng ký nhận notify từ Audio Manager Singleton
    const unsubscribe = audioManager.subscribe((playing, target) => {
      setIsPlayingGlobally(playing);
      setCurrentlyPlayingTarget(target);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Phát âm thanh (HTML5 Audio hoặc Web Speech API)
   */
  const playAudio = useCallback((textOrUrl) => {
    audioManager.play(textOrUrl);
  }, []);

  /**
   * Dừng âm thanh đang phát
   */
  const stopAudio = useCallback(() => {
    audioManager.stopAll();
  }, []);

  // Nếu truyền specificTarget vào hook, isPlaying sẽ đại diện chính xác cho item đó
  const isPlaying = specificTarget
    ? isPlayingGlobally && currentlyPlayingTarget === specificTarget
    : isPlayingGlobally;

  return {
    isPlaying,
    currentlyPlayingTarget,
    playAudio,
    stopAudio,
  };
};
