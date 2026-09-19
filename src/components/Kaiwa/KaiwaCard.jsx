import React, { useState, useCallback, useEffect } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { calculateMatchPercentage } from '../../utils/stringUtils';
import { FuriganaText } from '../FuriganaText';

/**
 * KaiwaCard Component - Nâng cấp toàn diện Bước 3
 * Tích hợp:
 * 1. Phát âm chuẩn Audio Singleton
 * 2. Luyện Nói Shadowing với Web Speech Recognition API
 * 3. Khắc phục dứt điểm lỗi tự tắt mic: Cho phép lấy hơi 5s, tự chốt khi nói xong (1.8s silence), khống chế tối đa 10s
 * 4. Hiển thị chữ thu âm thời gian thực (Live interim preview)
 * 5. Chấm điểm phát âm đa tầng (Phonetic Levenshtein) với phản hồi khích lệ
 */
export const KaiwaCard = React.memo(({ item }) => {
  const soundTarget = item.audio_url || item.japanese_text;
  const targetJapanese = item.japanese_text || '';
  const targetHiragana = item.hiragana || '';

  const { isPlaying, playAudio, stopAudio } = useAudioPlayer(soundTarget);
  const [matchResult, setMatchResult] = useState(null); // { percentage, isPass, feedbackLevel, cleanSpoken }

  // Xử lý khi có kết quả từ Speech Recognition
  const handleSpeechResult = useCallback(
    (spokenText) => {
      if (!spokenText) return;
      const result = calculateMatchPercentage(spokenText, targetJapanese, targetHiragana);
      setMatchResult(result);
    },
    [targetJapanese, targetHiragana]
  );

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: 'ja-JP',
    onResult: handleSpeechResult,
  });

  // Tự động dừng thu âm khi component unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  const handleSpeakerClick = (e) => {
    e.stopPropagation();
    if (isListening) stopListening();
    playAudio(soundTarget);
  };

  const handleMicClick = (e) => {
    e.stopPropagation();
    stopAudio(); // Dừng phát âm thanh máy để tránh micro thu lại tiếng của chính loa

    if (isListening) {
      stopListening();
    } else {
      setMatchResult(null);
      resetTranscript();
      startListening();
    }
  };

  const handleRetrySpeaking = (e) => {
    e.stopPropagation();
    setMatchResult(null);
    resetTranscript();
    startListening();
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '22px',
        border: isPlaying
          ? '2px solid #e91e8c'
          : isListening
          ? '2.5px solid #e53e3e'
          : '2px solid #fce7f3',
        boxShadow: isPlaying
          ? '0 8px 26px rgba(233, 30, 140, 0.22)'
          : isListening
          ? '0 8px 28px rgba(229, 62, 62, 0.28)'
          : '0 4px 16px rgba(233, 30, 140, 0.05)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* 1. Header: Danh mục & Các nút tương tác */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: '#fff0f6',
            color: '#e91e8c',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {item.category || 'Kaiwa'}
        </span>

        {/* Nút Thao Tác: Loa + Mic */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Nút Mic Ghi Âm Luyện Nói */}
          {isSupported && (
            <button
              type="button"
              onClick={handleMicClick}
              title={isListening ? 'Đang lắng nghe... Bấm để dừng sớm' : 'Bấm để đọc luyện nói câu này (Shadowing)'}
              style={{
                height: '38px',
                padding: '0 14px',
                borderRadius: '20px',
                border: isListening ? '2px solid #e53e3e' : '2px solid transparent',
                backgroundColor: isListening ? '#fff5f5' : '#f0fdf4',
                color: isListening ? '#e53e3e' : '#15803d',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.86rem',
                fontWeight: '700',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isListening ? '0 0 16px rgba(229, 62, 62, 0.4)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
              }}
              className="kaiwa-mic-btn"
            >
              <span style={{ fontSize: '1.1rem' }}>{isListening ? '⏹️' : '🎙️'}</span>
              <span>{isListening ? 'Dừng' : 'Luyện Nói'}</span>
            </button>
          )}

          {/* Nút Loa Phát Âm Bản Xứ */}
          <button
            type="button"
            onClick={handleSpeakerClick}
            title={isPlaying ? 'Dừng phát' : 'Nghe phát âm chuẩn bản xứ'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isPlaying ? '#e91e8c' : '#fff0f6',
              color: isPlaying ? '#ffffff' : '#e91e8c',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: isPlaying ? '0 0 14px rgba(233, 30, 140, 0.4)' : '0 2px 6px rgba(233, 30, 140, 0.1)',
            }}
          >
            {isPlaying ? '⏸' : '🔊'}
          </button>
        </div>
      </div>

      {/* 2. Nội dung câu thoại tiếng Nhật & Romaji */}
      <div style={{ margin: '8px 0 14px' }}>
        <div style={{ color: '#1a202c', fontWeight: '700', fontSize: '1.25rem', lineHeight: '1.6' }}>
          <FuriganaText kanji={item.japanese_text} kana={item.hiragana} />
        </div>
        <p style={{ fontSize: '0.92rem', color: '#718096', fontStyle: 'italic', margin: '6px 0 0' }}>
          {item.romaji}
        </p>
      </div>

      {/* 3. Lời dịch tiếng Việt & Ngữ cảnh giao tiếp */}
      <div style={{ borderTop: '1px dashed #fce7f3', paddingTop: '12px' }}>
        <p style={{ fontSize: '1.02rem', fontWeight: '600', color: '#2d3748', margin: '0 0 6px' }}>
          {item.vietnamese_meaning}
        </p>
        <div
          style={{
            fontSize: '0.84rem',
            color: '#475569',
            backgroundColor: '#f8fafc',
            padding: '8px 12px',
            borderRadius: '10px',
            lineHeight: '1.45',
            border: '1px solid #f1f5f9',
          }}
        >
          💡 <span style={{ fontWeight: '700' }}>Ngữ cảnh:</span> {item.context_usage}
        </div>
      </div>

      {/* 4. Khung Thông Báo Khi Đang Thu Âm (Live Speech Stream) */}
      {isListening && (
        <div
          style={{
            marginTop: '14px',
            padding: '12px 14px',
            borderRadius: '14px',
            backgroundColor: '#fff5f5',
            border: '1.5px solid #feb2b2',
            fontSize: '0.88rem',
            color: '#c53030',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem', animation: 'pulse 1.2s infinite' }}>🔴</span>
            <span>Đang lắng nghe... Hãy đọc to câu tiếng Nhật trên</span>
          </div>

          {/* Hiển thị chữ thu âm theo thời gian thực (Interim live preview) */}
          {(interimTranscript || transcript) ? (
            <div style={{ fontSize: '0.95rem', color: '#2d3748', fontWeight: '600', fontStyle: 'italic', marginTop: '6px' }}>
              🎙️ Bạn đang nói: 「{interimTranscript || transcript}」
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: '#718096', marginTop: '4px' }}>
              (Nói xong dừng lại 1.8s hệ thống sẽ tự động chốt và chấm điểm)
            </div>
          )}
        </div>
      )}

      {/* 5. Thông báo lỗi hoặc chưa nghe thấy tiếng */}
      {error && !isListening && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: '#fffaf0',
            border: '1px solid #feebc8',
            fontSize: '0.85rem',
            color: '#c05621',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <span>⚠️ {typeof error === 'string' ? error : 'Chưa nhận diện được. Hãy thử lại!'}</span>
          <button
            type="button"
            onClick={handleRetrySpeaking}
            style={{
              padding: '4px 10px',
              backgroundColor: '#dd6b20',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            Nói lại
          </button>
        </div>
      )}

      {/* 6. Bảng Điểm & Đánh Giá Phát Âm AI (Speech Shadowing Scorer) */}
      {matchResult && !isListening && (
        <div
          style={{
            marginTop: '14px',
            padding: '14px 16px',
            borderRadius: '14px',
            backgroundColor:
              matchResult.percentage >= 80
                ? '#f0fdf4'
                : matchResult.percentage >= 60
                ? '#fffbeb'
                : '#fff1f2',
            border: `1.5px solid ${
              matchResult.percentage >= 80
                ? '#86efac'
                : matchResult.percentage >= 60
                ? '#fde68a'
                : '#fecdd3'
            }`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                Âm thanh nhận diện:
              </div>
              <div style={{ fontSize: '1.02rem', fontWeight: '700', color: '#1e293b', marginTop: '2px' }}>
                「{matchResult.cleanSpoken}」
              </div>
            </div>

            {/* Huy hiệu điểm số */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '900',
                  color:
                    matchResult.percentage >= 80
                      ? '#16a34a'
                      : matchResult.percentage >= 60
                      ? '#d97706'
                      : '#e11d48',
                }}
              >
                {matchResult.percentage}%
              </span>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color:
                    matchResult.percentage >= 80
                      ? '#15803d'
                      : matchResult.percentage >= 60
                      ? '#b45309'
                      : '#be123c',
                  marginTop: '1px',
                }}
              >
                {matchResult.percentage >= 80
                  ? '🎉 Xuất Sắc!'
                  : matchResult.percentage >= 60
                  ? '👍 Khá Tốt!'
                  : '💪 Luyện Thêm'}
              </div>
            </div>
          </div>

          {/* Lời nhận xét khích lệ & Nút thử lại */}
          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(0, 0, 0, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: '#475569' }}>
              {matchResult.percentage >= 80
                ? 'Phát âm rất rõ ràng, người bản xứ hoàn toàn hiểu được!'
                : matchResult.percentage >= 60
                ? 'Ngữ điệu ổn, chú ý thêm các âm ngắt hoặc trường âm.'
                : 'Hãy nghe lại mẫu bằng loa 🔊 và đọc to hơn nhé!'}
            </span>

            <button
              type="button"
              onClick={handleRetrySpeaking}
              style={{
                padding: '4px 12px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🔄 Nói lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

KaiwaCard.displayName = 'KaiwaCard';
