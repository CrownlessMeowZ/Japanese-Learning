import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as wanakana from 'wanakana';
import { verifyTypedAnswer, generateHint } from '../../utils/typingValidator';
import { FuriganaText } from '../FuriganaText';

/**
 * QuizTypingInput Component - Bước 4: Module Luyện Gõ Từ Vựng & Chép Chính Tả
 * 
 * Tính năng chính:
 * 1. Bộ gõ thông minh WanaKana (âm tiết rớt tự động: watashi -> わたし, ko-hi- -> コーヒー)
 * 2. Thanh chuyển đổi chế độ gõ tức thì: [あ Hiragana] | [ア Katakana] | [ABC Romaji] | [VI Tiếng Việt]
 * 3. Chấp nhận đáp án linh hoạt (Kanji, Kana, Romaji, tiếng Việt có/không dấu)
 * 4. Hệ thống gợi ý nhiều cấp độ (💡 Gợi ý chữ đầu, số lượng ký tự)
 * 5. Điều khiển phím Enter 2 nấc: Nhấn lần 1 = Kiểm tra, Nhấn lần 2 = Sang câu kế
 */
export const QuizTypingInput = ({
  target,
  direction = 'to_ja', // 'to_ja' hoặc 'to_vi'
  isDictation = false,
  isAnswered = false,
  selectedAnswer = null,
  onCheckAnswer,
  onNextQuestion,
  onPlayAudio,
  audioSpeed = 1.0,
  onChangeAudioSpeed,
}) => {
  const inputRef = useRef(null);
  const [inputVal, setInputVal] = useState('');
  const [inputMode, setInputMode] = useState(direction === 'to_vi' ? 'vietnamese' : 'hiragana');
  const [hintLevel, setHintLevel] = useState(0);

  // Tự động focus vào ô nhập khi component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Xử lý thay đổi nội dung ô gõ theo chế độ IME
  const handleInputChange = (e) => {
    if (isAnswered) return;
    const raw = e.target.value;

    let converted = raw;
    if (inputMode === 'hiragana') {
      converted = wanakana.toKana(raw, { IMEMode: true });
    } else if (inputMode === 'katakana') {
      converted = wanakana.toKatakana(raw, { IMEMode: true });
    }
    setInputVal(converted);
  };

  // Xử lý nộp câu trả lời
  const handleSubmit = useCallback(() => {
    if (isAnswered) {
      onNextQuestion?.();
      return;
    }

    if (!inputVal.trim()) {
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    // Chốt âm nếu còn chữ 'n' lơ lửng cuối chuỗi ở chế độ Kana
    let finalized = inputVal.trim();
    if (inputMode === 'hiragana') {
      finalized = wanakana.toKana(finalized);
    } else if (inputMode === 'katakana') {
      finalized = wanakana.toKatakana(finalized);
    }

    // Kiểm tra tính đúng đắn đa tầng
    const result = verifyTypedAnswer({
      userInput: finalized,
      target,
      direction
    });

    onCheckAnswer({
      userInput: finalized,
      isCorrect: result.isCorrect,
      feedback: result.feedback,
      expectedAnswer: result.expectedAnswer,
      isFuzzyMatch: result.isFuzzyMatch
    }, result.isCorrect);
  }, [isAnswered, inputVal, inputMode, target, direction, onCheckAnswer, onNextQuestion]);

  // Lắng nghe phím Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Kích hoạt gợi ý
  const handleToggleHint = () => {
    setHintLevel((prev) => (prev < 2 ? prev + 1 : 1));
    if (inputRef.current) inputRef.current.focus();
  };

  const hintText = hintLevel > 0
    ? generateHint({ target, direction, hintLevel })
    : '';

  const isCorrect = selectedAnswer ? Boolean(selectedAnswer.isCorrect) : false;

  return (
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* THANH CHỌN BỘ GÕ IME (INPUT MODE SELECTOR) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700' }}>
            Bộ gõ:
          </span>
          <button
            type="button"
            className={`quiz-mode-pill ${inputMode === 'hiragana' ? 'active' : ''}`}
            onClick={() => {
              setInputMode('hiragana');
              if (inputRef.current) inputRef.current.focus();
            }}
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '10px' }}
          >
            あ Hiragana
          </button>
          <button
            type="button"
            className={`quiz-mode-pill ${inputMode === 'katakana' ? 'active' : ''}`}
            onClick={() => {
              setInputMode('katakana');
              if (inputRef.current) inputRef.current.focus();
            }}
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '10px' }}
          >
            ア Katakana
          </button>
          <button
            type="button"
            className={`quiz-mode-pill ${inputMode === 'romaji' ? 'active' : ''}`}
            onClick={() => {
              setInputMode('romaji');
              if (inputRef.current) inputRef.current.focus();
            }}
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '10px' }}
          >
            ABC Romaji
          </button>
          <button
            type="button"
            className={`quiz-mode-pill ${inputMode === 'vietnamese' ? 'active' : ''}`}
            onClick={() => {
              setInputMode('vietnamese');
              if (inputRef.current) inputRef.current.focus();
            }}
            style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '10px' }}
          >
            🇻🇳 Tiếng Việt
          </button>
        </div>

        {/* Nút Gợi ý (Hint) */}
        {!isAnswered && (
          <button
            type="button"
            onClick={handleToggleHint}
            style={{
              padding: '4px 12px',
              fontSize: '0.82rem',
              fontWeight: '700',
              borderRadius: '10px',
              border: '1px solid #f59e0b',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            💡 Gợi ý {hintLevel > 0 ? `(Cấp ${hintLevel})` : ''}
          </button>
        )}
      </div>

      {/* KHUNG HIỂN THỊ GỢI Ý NẾU CÓ */}
      {hintText && !isAnswered && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1.5px dashed #f59e0b',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '0.9rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💡</span>
          <span style={{ fontWeight: '600' }}>{hintText}</span>
        </div>
      )}

      {/* THANH ĐIỀU KHIỂN TỐC ĐỘ PHÁT ÂM (DÀNH CHO CHẾ ĐỘ DICTATION) */}
      {isDictation && onChangeAudioSpeed && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '8px 12px',
          backgroundColor: '#fff0f6',
          borderRadius: '12px',
          border: '1px solid #fbcfe8'
        }}>
          <span style={{ fontSize: '0.84rem', color: '#be185d', fontWeight: '700' }}>
            🎧 Tốc độ đọc:
          </span>
          {[0.75, 1.0, 1.25].map((spd) => (
            <button
              key={`spd-${spd}`}
              type="button"
              onClick={() => onChangeAudioSpeed(spd)}
              style={{
                padding: '3px 10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                borderRadius: '8px',
                border: audioSpeed === spd ? '1.5px solid #e91e8c' : '1px solid #f472b6',
                backgroundColor: audioSpeed === spd ? '#e91e8c' : '#ffffff',
                color: audioSpeed === spd ? '#ffffff' : '#be185d',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {spd}x {spd === 0.75 ? '(Chậm)' : spd === 1.0 ? '(Chuẩn)' : '(Nhanh)'}
            </button>
          ))}
        </div>
      )}

      {/* Ô NHẬP LIỆU CHÍNH (MAIN INPUT) */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isAnswered}
          placeholder={
            direction === 'to_vi'
              ? 'Nhập nghĩa tiếng Việt (ví dụ: tôi, đất nước...)'
              : inputMode === 'katakana'
              ? 'Gõ Romaji để rớt Katakana (ví dụ: ko-hi- -> コーヒー)'
              : inputMode === 'romaji'
              ? 'Gõ trực tiếp Romaji (ví dụ: watashi)'
              : 'Gõ Romaji để rớt Hiragana (ví dụ: watashi -> わたし)'
          }
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '16px 20px',
            fontSize: '1.35rem',
            fontWeight: '600',
            textAlign: 'center',
            borderRadius: '16px',
            outline: 'none',
            border: isAnswered
              ? isCorrect
                ? '2.5px solid #28a745'
                : '2.5px solid #dc3545'
              : '2px solid #cbd5e1',
            backgroundColor: isAnswered
              ? isCorrect
                ? '#f0fdf4'
                : '#fef2f2'
              : '#ffffff',
            color: '#1e293b',
            boxShadow: isAnswered
              ? isCorrect
                ? '0 4px 14px rgba(40, 167, 69, 0.15)'
                : '0 4px 14px rgba(220, 53, 69, 0.15)'
              : '0 3px 10px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease'
          }}
        />

        {/* Nút Xóa nhanh ô nhập */}
        {!isAnswered && inputVal && (
          <button
            type="button"
            onClick={() => {
              setInputVal('');
              if (inputRef.current) inputRef.current.focus();
            }}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              backgroundColor: '#e2e8f0',
              color: '#64748b',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700'
            }}
            title="Xóa nhanh"
          >
            ✕
          </button>
        )}
      </div>

      {/* PHẢN HỒI KẾT QUẢ SAU KHI NỘP (FEEDBACK BANNER) */}
      {isAnswered && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '14px',
          border: isCorrect ? '2px solid #86efac' : '2px solid #fca5a5',
          backgroundColor: isCorrect ? '#f0fdf4' : '#fff5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '800',
              fontSize: '1.15rem',
              color: isCorrect ? '#15803d' : '#b91c1c'
            }}>
              <span>{isCorrect ? '🎉' : '✗'}</span>
              <span>{selectedAnswer?.feedback || (isCorrect ? 'Chính xác hoàn hảo!' : 'Chưa chính xác.')}</span>
            </div>

            {/* Nút Nghe lại phát âm */}
            <button
              type="button"
              onClick={() => onPlayAudio?.(target.audio_url || target.hiragana || target.kanji)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1.5px solid #e91e8c',
                backgroundColor: '#ffffff',
                color: '#e91e8c',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(233, 30, 140, 0.15)'
              }}
            >
              🔊 Nghe lại phát âm
            </button>
          </div>

          <div style={{
            fontSize: '1rem',
            color: '#334155',
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div>
              <span style={{ color: '#64748b', fontWeight: '600' }}>Từ chuẩn tiếng Nhật: </span>
              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.25rem' }}>
                <FuriganaText kanji={target.kanji} kana={target.hiragana} />
              </span>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: '600' }}>Nghĩa tiếng Việt: </span>
              <span style={{ fontWeight: '700', color: '#e91e8c' }}>
                {target.meaning || target.meaning_vi || target.vietnamese}
              </span>
            </div>
            {!isCorrect && (
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                (Bạn đã nhập: <span style={{ textDecoration: 'line-through', color: '#ef4444', fontWeight: '600' }}>{selectedAnswer?.userInput || inputVal}</span>)
              </div>
            )}
          </div>
        </div>
      )}

      {/* HÀNG NÚT THAO TÁC (KIỂM TRA HOẶC CÂU KẾ TIẾP) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
        {!isAnswered ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="quiz-action-btn"
            style={{
              padding: '14px 36px',
              fontSize: '1.1rem',
              fontWeight: '800',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#e91e8c',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>✓ Kiểm tra</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
              Enter ↵
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextQuestion}
            className="quiz-action-btn"
            style={{
              padding: '14px 36px',
              fontSize: '1.1rem',
              fontWeight: '800',
              borderRadius: '14px',
              border: 'none',
              backgroundColor: '#e91e8c',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Câu tiếp theo ➔</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
              Enter ↵
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
