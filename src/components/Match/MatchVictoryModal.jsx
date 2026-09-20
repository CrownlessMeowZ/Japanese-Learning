import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * MatchVictoryModal Component - Modal Kết quả Minigame Sakura Match
 * Hiển thị điểm số, thời gian, combo cao nhất và vinh danh kỷ lục mới (New Highscore)
 */
export const MatchVictoryModal = ({
  isOpen,
  isVictory,
  score,
  timeTaken,
  remainingSeconds,
  matchedPairsCount,
  totalPairsCount,
  maxCombo,
  isNewHighscore,
  highscore,
  onPlayAgain,
  onChangeLesson,
  onOpenHighscores,
  onBackToDashboard,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onPlayAgain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPlayAgain]);

  if (!isOpen) return null;

  return createPortal(
    <div className="match-modal-overlay" role="dialog" aria-modal="true">
      <div className="match-modal-box">
        {/* Biểu tượng cảm xúc lớn */}
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
          {isVictory ? '🌸🎉' : '⏰💪'}
        </div>

        {/* Tiêu đề chính */}
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          color: isVictory ? '#be185d' : '#334155',
          margin: '0 0 6px'
        }}>
          {isVictory ? 'HOÀN HẢO! DỌN BÀN THÀNH CÔNG' : 'HẾT GIỜ RỒI!'}
        </h2>

        <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0 0 18px' }}>
          {isVictory
            ? 'Bạn có phản xạ mắt và trí nhớ từ vựng tiếng Nhật xuất sắc!'
            : `Bạn đã kịp nối được ${matchedPairsCount}/${totalPairsCount} cặp từ vựng. Đừng nản lòng nhé!`}
        </p>

        {/* Huy hiệu New Highscore nếu phá kỷ lục */}
        {isNewHighscore && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            padding: '6px 16px',
            borderRadius: '14px',
            color: '#92400e',
            fontWeight: '800',
            fontSize: '0.95rem',
            marginBottom: '16px',
            animation: 'comboPop 0.4s ease'
          }}>
            <span>🏆</span>
            <span>KỶ LỤC MỚI ĐƯỢC THIẾT LẬP!</span>
          </div>
        )}

        {/* Bảng thống kê chi tiết ván đấu */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          backgroundColor: '#f8fafc',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '22px'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>
              TỔNG ĐIỂM
            </div>
            <div style={{ fontSize: '1.6rem', color: '#e91e8c', fontWeight: '900' }}>
              {score}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>
              {isVictory ? 'THỜI GIAN HOÀN TẤT' : 'THỜI GIAN CÒN LẠI'}
            </div>
            <div style={{ fontSize: '1.6rem', color: '#0284c7', fontWeight: '900' }}>
              {isVictory ? `${timeTaken}s` : `${remainingSeconds}s`}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>
              CHUỖI COMBO CAO NHẤT
            </div>
            <div style={{ fontSize: '1.2rem', color: '#d97706', fontWeight: '800' }}>
              {maxCombo > 1 ? `x${maxCombo} Combo 🔥` : 'x1'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700' }}>
              KỶ LỤC BÀI NÀY
            </div>
            <div style={{ fontSize: '1.2rem', color: '#16a34a', fontWeight: '800' }}>
              {highscore} điểm
            </div>
          </div>
        </div>

        {/* Hàng nút bấm thao tác */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={onPlayAgain}
            style={{
              padding: '14px 20px',
              backgroundColor: '#e91e8c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '800',
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>🔄 Chơi Lại Bàn Mới</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {onChangeLesson && (
              <button
                type="button"
                onClick={onChangeLesson}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                📚 Đổi bài học
              </button>
            )}

            {onOpenHighscores && (
              <button
                type="button"
                onClick={onOpenHighscores}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fffbeb',
                  color: '#d97706',
                  border: '1.5px solid #fde68a',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                🏆 Bảng Kỷ Lục
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onBackToDashboard}
            style={{
              padding: '10px 16px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.86rem',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            ⬅ Quay lại Dashboard
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
