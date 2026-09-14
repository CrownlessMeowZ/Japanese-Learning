import React, { useState, useEffect } from 'react';

/**
 * KanjiStrokeAnimator - Hiển thị thứ tự từng nét viết chữ Hán
 * Hỗ trợ diễn hoạt (Animation) từng nét SVG và đánh số thứ tự nét 1, 2, 3...
 */
export const KanjiStrokeAnimator = ({ kanjiItem, size = 180 }) => {
  const strokes = kanjiItem?.strokes || [];
  const [prevChar, setPrevChar] = useState(kanjiItem?.character);
  const [activeStrokeCount, setActiveStrokeCount] = useState(strokes.length);
  const [isPlaying, setIsPlaying] = useState(false);

  // Tự động reset khi đổi chữ Hán (Adjusting state during render)
  if (kanjiItem?.character !== prevChar) {
    setPrevChar(kanjiItem?.character);
    setActiveStrokeCount(strokes.length);
    setIsPlaying(false);
  }

  // Hiệu ứng chạy từng nét một
  useEffect(() => {
    if (!isPlaying) return;

    if (activeStrokeCount < strokes.length) {
      const timer = setTimeout(() => {
        setActiveStrokeCount((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        setIsPlaying(false);
      }, 350);
      return () => clearTimeout(finishTimer);
    }
  }, [isPlaying, activeStrokeCount, strokes.length]);

  const handlePlayAnimation = () => {
    setActiveStrokeCount(0);
    setIsPlaying(true);
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.box, width: size, height: size }}>
        {/* Lưới chữ điền 4 ô mờ */}
        <svg
          viewBox="0 0 100 100"
          style={styles.gridSvg}
          aria-hidden="true"
        >
          <line x1="0" y1="50" x2="100" y2="50" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="#f472b6" strokeWidth="1.5" rx="8" />
        </svg>

        {/* Nét vẽ SVG hoặc Chữ mẫu */}
        {strokes.length > 0 ? (
          <svg viewBox="0 0 100 100" style={styles.strokeSvg}>
            {strokes.slice(0, activeStrokeCount).map((pathD, idx) => (
              <g key={idx}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={idx === activeStrokeCount - 1 && isPlaying ? '#e91e8c' : '#1e293b'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        ) : (
          <div style={styles.fallbackChar}>
            {kanjiItem?.character}
          </div>
        )}
      </div>

      {/* Điều khiển phát nét */}
      <div style={styles.controlsRow}>
        <button
          type="button"
          onClick={handlePlayAnimation}
          disabled={isPlaying || strokes.length === 0}
          style={styles.playBtn}
          title="Xem lại từng nét viết"
        >
          {isPlaying ? 'Đang vẽ nét...' : '▶ Thứ tự nét viết'}
        </button>
        <span style={styles.strokeBadge}>
          {strokes.length > 0 ? `${activeStrokeCount}/${strokes.length} nét` : `${kanjiItem?.strokeCount || 0} nét`}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  box: {
    position: 'relative',
    backgroundColor: '#fff7f9',
    borderRadius: '16px',
    boxShadow: 'inset 0 2px 6px rgba(233, 30, 140, 0.08)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  strokeSvg: {
    width: '82%',
    height: '82%',
    zIndex: 2,
  },
  fallbackChar: {
    fontSize: '5rem',
    fontFamily: '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", serif',
    fontWeight: '700',
    color: '#1e293b',
    userSelect: 'none',
    zIndex: 2,
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  playBtn: {
    padding: '6px 14px',
    backgroundColor: '#fce7f3',
    color: '#e91e8c',
    border: '1px solid #f472b6',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  strokeBadge: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4px 10px',
    borderRadius: '12px',
  },
};
