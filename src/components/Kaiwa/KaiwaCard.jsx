import React, { useState, useCallback } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { calculateMatchPercentage } from '../../utils/stringUtils';
import { FuriganaText } from '../FuriganaText';

/**
 * KaiwaCard Component
 * Tích hợp: Phát âm Audio + Thu âm nhận diện giọng nói & Chấm điểm phản xạ (Levenshtein DP)
 */
export const KaiwaCard = React.memo(({ item }) => {
  const soundTarget = item.audio_url || item.japanese_text;
  const targetJapanese = item.japanese_text || '';

  const { isPlaying, playAudio, stopAudio } = useAudioPlayer(soundTarget);
  const [matchResult, setMatchResult] = useState(null); // { percentage, cleanSpoken }

  // Xử lý khi có kết quả từ Speech Recognition
  const handleSpeechResult = useCallback((spokenText) => {
    if (!spokenText) return;
    const result = calculateMatchPercentage(spokenText, targetJapanese);
    setMatchResult(result);
  }, [targetJapanese]);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    lang: 'ja-JP',
    onResult: handleSpeechResult,
  });

  const handleSpeakerClick = (e) => {
    e.stopPropagation();
    // Dừng nghe nếu đang ghi âm
    if (isListening) stopListening();
    playAudio(soundTarget);
  };

  const handleMicClick = (e) => {
    e.stopPropagation();
    // Dừng phát âm thanh máy để tránh thu lại tiếng của chính mình
    stopAudio();

    if (isListening) {
      stopListening();
    } else {
      setMatchResult(null);
      startListening();
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: isPlaying
          ? '2px solid #e91e8c'
          : isListening
          ? '2px solid #3182ce'
          : '2px solid #f0e2e7',
        boxShadow: isPlaying
          ? '0 8px 24px rgba(233, 30, 140, 0.22)'
          : isListening
          ? '0 8px 24px rgba(49, 130, 206, 0.25)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Top Header: Category & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '4px 10px',
          borderRadius: '12px',
          backgroundColor: '#fff0f6',
          color: '#e91e8c',
          textTransform: 'uppercase'
        }}>
          {item.category || 'Kaiwa'}
        </span>

        {/* Action Buttons: Speaker + Mic */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Nút Mic Ghi Âm */}
          {isSupported && (
            <button
              onClick={handleMicClick}
              title={isListening ? 'Đang lắng nghe... bấm để dừng' : 'Bấm để đọc thử câu này'}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isListening ? '#e53e3e' : '#ebf8ff',
                color: isListening ? '#ffffff' : '#3182ce',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: isListening ? '0 0 12px rgba(229, 62, 62, 0.6)' : 'none',
                animation: isListening ? 'pulse 1s infinite ease-in-out' : 'none',
              }}
            >
              🎤
            </button>
          )}

          {/* Nút Loa Phát Âm */}
          <button
            onClick={handleSpeakerClick}
            title={isPlaying ? 'Dừng phát' : 'Nghe phát âm chuẩn'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isPlaying ? '#e91e8c' : '#fff0f6',
              color: isPlaying ? '#ffffff' : '#e91e8c',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: isPlaying ? '0 0 14px rgba(233, 30, 140, 0.5)' : 'none',
            }}
          >
            {isPlaying ? '⏸' : '🔊'}
          </button>
        </div>
      </div>

      {/* Main Text & Romaji */}
      <div style={{ margin: '8px 0 14px' }}>
        <div style={{ color: '#2d3748', fontWeight: '600' }}>
          <FuriganaText kanji={item.japanese_text} kana={item.hiragana} />
        </div>
        <p style={{ fontSize: '0.95rem', color: '#718096', fontStyle: 'italic', margin: '6px 0 0' }}>
          {item.romaji}
        </p>
      </div>

      {/* Meaning & Context */}
      <div style={{ borderTop: '1px dashed #edf2f7', paddingTop: '12px' }}>
        <p style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1a202c', margin: '0 0 6px' }}>
          {item.vietnamese_meaning}
        </p>
        <div style={{
          fontSize: '0.85rem',
          color: '#4a5568',
          backgroundColor: '#f7fafc',
          padding: '8px 12px',
          borderRadius: '8px',
          lineHeight: '1.4'
        }}>
          💡 <span style={{ fontWeight: '500' }}>Ngữ cảnh:</span> {item.context_usage}
        </div>
      </div>

      {/* Speech Recognition Feedback Panel */}
      {isListening && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          borderRadius: '10px',
          backgroundColor: '#ebf8ff',
          border: '1px solid #bee3f8',
          fontSize: '0.88rem',
          color: '#2b6cb0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ animation: 'spin 1s infinite linear' }}>🎙️</span>
          <span>Đang lắng nghe... Hãy đọc to câu trên bằng tiếng Nhật.</span>
        </div>
      )}

      {/* Scoring Result Badge */}
      {matchResult && !isListening && (
        <div style={{
          marginTop: '12px',
          padding: '12px 14px',
          borderRadius: '12px',
          backgroundColor: matchResult.percentage >= 80 ? '#f0fff4' : '#fffaf0',
          border: `1.5px solid ${matchResult.percentage >= 80 ? '#9ae6b4' : '#fbd38d'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#718096' }}>Bạn đã đọc:</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#2d3748' }}>
              「{transcript || matchResult.cleanSpoken}」
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: matchResult.percentage >= 80 ? '#28a745' : '#dd6b20',
            }}>
              {matchResult.percentage}%
            </span>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: matchResult.percentage >= 80 ? '#28a745' : '#dd6b20'
            }}>
              {matchResult.percentage >= 80 ? '✓ Đạt chuẩn' : 'Cần cố gắng'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

KaiwaCard.displayName = 'KaiwaCard';
