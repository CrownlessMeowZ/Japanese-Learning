import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * MatchHighscoreModal Component - Bảng Vàng Kỷ Lục Cá Nhân Sakura Match
 * Hiển thị điểm số kỷ lục, thời gian nhanh nhất và số trận đã chơi của từng bài học
 */
export const MatchHighscoreModal = ({
  isOpen,
  onClose,
  highscores = {},
  onSelectLesson,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lessonsList = Array.from({ length: 15 }, (_, i) => String(i + 1));

  return createPortal(
    <div
      className="match-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="match-modal-box" style={{ maxWidth: '580px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>🏆</span>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#be185d', margin: 0 }}>
                Bảng Vàng Kỷ Lục Sakura Match
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Điểm cao nhất & Thời gian dọn bàn nhanh nhất
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: '700',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Danh sách 15 bài học */}
        <div style={{
          overflowY: 'auto',
          flex: 1,
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {/* Mục: Tất Cả 15 Bài */}
          {(() => {
            const allStats = highscores['all'] || {};
            const hasPlayed = Boolean(allStats.highScore);
            return (
              <div style={{
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1.5px solid #fbcfe8',
                backgroundColor: '#fff0f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '800', color: '#be185d', fontSize: '0.96rem' }}>
                    🌸 Đại Chiến Toàn Bộ 15 Bài
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {hasPlayed ? `Đã chơi: ${allStats.gamesPlayed || 1} ván` : 'Chưa thiết lập kỷ lục'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#be185d' }}>
                      {allStats.highScore ? `${allStats.highScore} đ` : '---'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      {allStats.bestTime ? `⏱️ ${allStats.bestTime}s` : '---'}
                    </div>
                  </div>

                  {onSelectLesson && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectLesson('all');
                        onClose();
                      }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#e91e8c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Đấu ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 15 Bài Học Cụ Thể */}
          {lessonsList.map((lsId) => {
            const stats = highscores[lsId] || {};
            const hasPlayed = Boolean(stats.highScore);

            return (
              <div
                key={`hs-ls-${lsId}`}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: hasPlayed ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  backgroundColor: hasPlayed ? '#fffaf0' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: hasPlayed ? '#ffedd5' : '#f1f5f9',
                    color: hasPlayed ? '#c2410c' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.82rem',
                    fontWeight: '800'
                  }}>
                    {lsId}
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>
                      Bài {lsId}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {hasPlayed ? `Đã chơi ${stats.gamesPlayed || 1} lần` : 'Chưa có kỷ lục'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: hasPlayed ? '#ea580c' : '#94a3b8' }}>
                      {stats.highScore ? `${stats.highScore} đ` : '---'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {stats.bestTime ? `⏱️ ${stats.bestTime}s` : ''}
                    </div>
                  </div>

                  {onSelectLesson && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectLesson(Number(lsId));
                        onClose();
                      }}
                      style={{
                        padding: '4px 10px',
                        backgroundColor: '#f8fafc',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '0.76rem',
                        cursor: 'pointer'
                      }}
                    >
                      Chơi
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#e2e8f0',
              color: '#334155',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
