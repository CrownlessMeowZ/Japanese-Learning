import React, { useState, useRef, useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

/**
 * FuriganaSwitch Component
 * Tối ưu UX cho nút bật/tắt phiên âm Furigana:
 * - Nhãn trực quan '[Aあ] Phiên âm'
 * - Biểu tượng ℹ️ (Info) với con trỏ pointer (thay vì cursor: help gây ra con trỏ kèm dấu ? trên Windows)
 * - Custom Tooltip Card giải thích trực quan, có ví dụ Kanji minh họa và gợi ý phương pháp luyện thi JLPT
 * - Hỗ trợ mượt mà cả Hover chuột lẫn Chạm/Click trên mobile
 */
export const FuriganaSwitch = () => {
  const showFurigana = useSettingsStore((state) => state.showFurigana);
  const toggleFurigana = useSettingsStore((state) => state.toggleFurigana);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const containerRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Xử lý hover vào icon hoặc card tooltip (không bị chớp giật khi di chuyển chuột giữa 2 phần)
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(false);
    }, 220);
  };

  // Đóng tooltip khi click ra ngoài (đặc biệt hữu dụng cho người dùng mobile / tablet)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsTooltipOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#ffffff',
        padding: '5px 12px 5px 14px',
        borderRadius: '24px',
        border: '1.5px solid #fce7f3',
        boxShadow: '0 2px 8px rgba(233, 30, 140, 0.08)',
        userSelect: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Nút Toggle Switch chính */}
      <button
        type="button"
        role="switch"
        aria-checked={showFurigana}
        onClick={toggleFurigana}
        aria-label="Bật hoặc tắt phiên âm Hiragana trên đầu chữ Hán"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          outline: 'none',
        }}
      >
        {/* Nhãn trực quan: [Aあ] Phiên âm */}
        <span
          style={{
            fontSize: '0.86rem',
            fontWeight: '700',
            color: showFurigana ? '#e91e8c' : '#718096',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span
            style={{
              backgroundColor: showFurigana ? '#fff0f6' : '#edf2f7',
              color: showFurigana ? '#e91e8c' : '#4a5568',
              border: `1px solid ${showFurigana ? '#f8bbd0' : '#cbd5e0'}`,
              borderRadius: '6px',
              padding: '1px 5px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
            }}
          >
            Aあ
          </span>
          Phiên âm
        </span>

        {/* Thanh gạt Toggle Switch */}
        <span
          style={{
            width: '34px',
            height: '18px',
            backgroundColor: showFurigana ? '#e91e8c' : '#cbd5e0',
            borderRadius: '9px',
            position: 'relative',
            display: 'inline-block',
            transition: 'background-color 0.25s ease',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '2px',
              left: showFurigana ? '18px' : '2px',
              width: '14px',
              height: '14px',
              backgroundColor: '#ffffff',
              borderRadius: '50%',
              transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </span>
      </button>

      {/* Biểu tượng Info giải thích công dụng (Đổi cursor sang pointer, không còn dấu ? của OS) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsTooltipOpen((prev) => !prev);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Furigana là gì?"
        style={{
          background: isTooltipOpen ? '#fce7f3' : 'transparent',
          border: 'none',
          borderRadius: '50%',
          width: '22px',
          height: '22px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: 0,
          outline: 'none',
          color: isTooltipOpen ? '#e91e8c' : '#a0aec0',
          transition: 'all 0.2s ease',
        }}
      >
        ℹ️
      </button>

      {/* Custom Tooltip Card - Sakura Glassmorphism */}
      {isTooltipOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '310px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            border: '1.5px solid #fbcfe8',
            boxShadow: '0 12px 32px rgba(233, 30, 140, 0.16), 0 4px 12px rgba(0, 0, 0, 0.04)',
            padding: '16px',
            zIndex: 1000,
            textAlign: 'left',
            animation: 'sakuraFadeInUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            lineHeight: 1.5,
            color: '#2d3748',
          }}
        >
          {/* Mũi tên trỏ lên (Tooltip Pointer Arrow) */}
          <div
            style={{
              position: 'absolute',
              top: '-7px',
              right: '18px',
              width: '12px',
              height: '12px',
              backgroundColor: '#ffffff',
              borderLeft: '1.5px solid #fbcfe8',
              borderTop: '1.5px solid #fbcfe8',
              transform: 'rotate(45deg)',
            }}
          />

          {/* Tiêu đề Tooltip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              borderBottom: '1px solid #fce7f3',
              paddingBottom: '8px',
            }}
          >
            <div style={{ fontWeight: '800', color: '#e91e8c', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span>
              <span>Furigana (Phiên âm) là gì?</span>
            </div>
            <button
              type="button"
              onClick={() => setIsTooltipOpen(false)}
              aria-label="Đóng"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a0aec0',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1,
                padding: '2px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Hộp minh họa trực quan (Visual Kanji Example) */}
          <div
            style={{
              backgroundColor: '#fff0f6',
              borderRadius: '10px',
              padding: '8px 12px',
              marginBottom: '10px',
              border: '1px dashed #f8bbd0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '2px' }}>Ví dụ cách hiển thị:</div>
            <ruby style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a202c', rubyPosition: 'over' }}>
              私
              <rt style={{ fontSize: '0.75rem', color: '#e91e8c', fontWeight: 'bold' }}>わたし</rt>
            </ruby>
            <span style={{ fontSize: '0.85rem', color: '#718096', marginLeft: '8px' }}>(Watashi = Tôi)</span>
          </div>

          {/* Định nghĩa ngắn gọn */}
          <p style={{ fontSize: '0.82rem', margin: '0 0 10px 0', color: '#4a5568' }}>
            <strong>Furigana</strong> là chữ <em>Hiragana cỡ nhỏ</em> nằm phía trên chữ Hán (Kanji) để chỉ dẫn cách đọc chuẩn xác.
          </p>

          {/* Hướng dẫn phương pháp học */}
          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>🟢 BẬT:</span>
              <span style={{ color: '#4a5568' }}>
                Hỗ trợ đọc trơn tru khi mới học, không bị vấp từ vựng mới.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: '#e11d48', fontWeight: 'bold' }}>⚪ TẮT:</span>
              <span style={{ color: '#4a5568' }}>
                Tự che phiên âm để kiểm tra trí nhớ mặt chữ Kanji (luyện thi JLPT).
              </span>
            </div>
          </div>

          {/* Nút thao tác nhanh & Trạng thái hiện tại */}
          <button
            type="button"
            onClick={() => toggleFurigana()}
            style={{
              width: '100%',
              backgroundColor: showFurigana ? '#fff0f6' : '#f8fafc',
              border: `1px solid ${showFurigana ? '#f8bbd0' : '#e2e8f0'}`,
              color: showFurigana ? '#e91e8c' : '#64748b',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{showFurigana ? '🟢 Đang BẬT phiên âm' : '⚪ Đang TẮT phiên âm'}</span>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>(Nhấp để đổi)</span>
          </button>
        </div>
      )}
    </div>
  );
};
