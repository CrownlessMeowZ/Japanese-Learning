import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * KanjiCanvasPad - Bàn vẽ luyện viết chữ Hán trên HTML5 Canvas
 * Hỗ trợ cảm ứng đa điểm (Touch Mobile/Tablet) + Chuột (Desktop)
 * Lưới 4 ô chữ điền chuẩn thư pháp + Nét mờ đồ nét (Ghost Tracing)
 */
export const KanjiCanvasPad = ({
  targetCharacter = '',
  size = 240,
  onFinishStroke,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGhost, setShowGhost] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [history, setHistory] = useState([]); // Lưu các bước vẽ để Undo

  // Thiết lập Canvas Retina / Hi-DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 7;

    // Lưu snapshot trống ban đầu
    setHistory([canvas.toDataURL()]);
  }, [size]);

  // Xóa toàn bộ nét vẽ
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
    setHistory([canvas.toDataURL()]);
  }, []);

  // Xóa khi đổi sang chữ Hán khác
  useEffect(() => {
    handleClear();
  }, [targetCharacter, handleClear]);

  // Tính tọa độ chuột hoặc ngón tay
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Bắt đầu vẽ
  const startDrawing = (e) => {
    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  // Di chuyển nét vẽ
  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Kết thúc nét vẽ
  const stopDrawing = (e) => {
    if (!isDrawing) return;
    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);

    // Lưu snapshot cho Undo
    setHistory((prev) => [...prev.slice(-15), canvas.toDataURL()]);

    if (onFinishStroke) {
      onFinishStroke();
    }
  };

  // Hoàn tác nét trước (Undo)
  const handleUndo = () => {
    if (history.length <= 1) {
      handleClear();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const newHistory = [...history];
    newHistory.pop(); // Bỏ snapshot hiện tại
    const prevSnapshot = newHistory[newHistory.length - 1];

    const img = new Image();
    img.src = prevSnapshot;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      ctx.drawImage(img, 0, 0, size, size);
      setHistory(newHistory);
      if (newHistory.length <= 1) {
        setHasDrawn(false);
      }
    };
  };

  return (
    <div style={styles.padWrapper}>
      <div style={{ ...styles.canvasContainer, width: size, height: size }}>
        {/* Lưới chữ điền 4 ô đỏ nhạt truyền thống */}
        <svg viewBox="0 0 100 100" style={styles.gridSvg} aria-hidden="true">
          <line x1="0" y1="50" x2="100" y2="50" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#fbcfe8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="#ffe4e6" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="#ffe4e6" strokeWidth="0.8" strokeDasharray="4 4" />
          <rect x="1" y="1" width="98" height="98" fill="none" stroke="#f472b6" strokeWidth="1.5" rx="10" />
        </svg>

        {/* Nét chữ mờ đồ nét (Ghost Tracing Guide) */}
        {showGhost && targetCharacter && (
          <div
            style={{
              ...styles.ghostChar,
              fontSize: `${size * 0.72}px`,
            }}
          >
            {targetCharacter}
          </div>
        )}

        {/* Lớp vẽ Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={styles.canvas}
        />
      </div>

      {/* Thanh công cụ bàn vẽ */}
      <div style={styles.toolbarRow}>
        <button
          type="button"
          onClick={() => setShowGhost((prev) => !prev)}
          style={{
            ...styles.toolBtn,
            backgroundColor: showGhost ? '#fce7f3' : '#f1f5f9',
            color: showGhost ? '#e91e8c' : '#64748b',
          }}
          title="Bật / tắt chữ mờ để đồ theo nét"
        >
          {showGhost ? '👁️ Nét mờ: Bật' : '👁️‍🗨️ Nét mờ: Tắt'}
        </button>

        <button
          type="button"
          onClick={handleUndo}
          disabled={!hasDrawn}
          style={{
            ...styles.toolBtn,
            opacity: hasDrawn ? 1 : 0.5,
            cursor: hasDrawn ? 'pointer' : 'not-allowed',
          }}
          title="Hoàn tác nét vừa vẽ"
        >
          ↩️ Hoàn tác
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={!hasDrawn}
          style={{
            ...styles.toolBtn,
            backgroundColor: '#fff1f2',
            color: '#e11d48',
            borderColor: '#fecdd3',
            opacity: hasDrawn ? 1 : 0.5,
            cursor: hasDrawn ? 'pointer' : 'not-allowed',
          }}
          title="Xóa viết lại từ đầu"
        >
          🧹 Xóa hết
        </button>
      </div>
    </div>
  );
};

const styles = {
  padWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  canvasContainer: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(233, 30, 140, 0.12)',
    overflow: 'hidden',
    touchAction: 'none',
    userSelect: 'none',
  },
  gridSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  },
  ghostChar: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fbcfe8',
    fontFamily: '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", serif',
    fontWeight: '700',
    lineHeight: 1,
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 2,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
    cursor: 'crosshair',
  },
  toolbarRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toolBtn: {
    padding: '6px 12px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
