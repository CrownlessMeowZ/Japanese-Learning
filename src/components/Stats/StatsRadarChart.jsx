import React from 'react';

/**
 * StatsRadarChart - Biểu đồ mạng nhện SVG thuần 5 kỹ năng
 * Tối ưu hóa 100% SVG Client-side, không cài thư viện ngoài, chuẩn 60fps
 */
export const StatsRadarChart = ({ skills = {} }) => {
  const cx = 190;
  const cy = 160;
  const radius = 95;

  const skillKeys = [
    { key: 'vocab', label: '📖 Từ Vựng', color: '#e91e8c' },
    { key: 'kanji', label: '🈸 Hán Tự', color: '#d97706' },
    { key: 'grammar', label: '📐 Ngữ Pháp', color: '#059669' },
    { key: 'speaking', label: '🗣️ Nghe & Nói', color: '#2563eb' },
    { key: 'kana', label: '🔤 Chữ Cái', color: '#7c3aed' },
  ];

  const totalAxes = skillKeys.length;

  // Tính tọa độ góc của ngũ giác (Bắt đầu từ đỉnh trên cùng -Math.PI / 2)
  const getCoordinates = (index, r) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / totalAxes;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    };
  };

  // Tạo đường dẫn cho các vành đai ngũ giác đồng tâm (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const points = skillKeys.map((_, i) => {
      const { x, y } = getCoordinates(i, radius * level);
      return `${x},${y}`;
    }).join(' ');
    return { level, points };
  });

  // Tọa độ 5 điểm dữ liệu thực tế của học viên
  const dataPoints = skillKeys.map((item, i) => {
    const rawScore = skills[item.key]?.score || 0;
    // Điểm tối thiểu 8 để hình không bị sụp hoàn toàn về tâm
    const r = Math.max(8, (rawScore / 100) * radius);
    const { x, y } = getCoordinates(i, r);
    return { ...item, score: rawScore, x, y };
  });

  const polygonPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="stats-radar-wrapper">
      <svg
        viewBox="0 0 380 320"
        className="stats-radar-svg"
      >
        <defs>
          {/* Gradient màu hồng Sakura chuyển đỏ rực rỡ */}
          <linearGradient id="sakuraRadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.15" />
          </linearGradient>

          {/* Bóng đổ nhẹ cho đa giác dữ liệu */}
          <filter id="radarShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#be185d" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Lưới vành đai ngũ giác (Concentric Grid Rings) */}
        {gridPolygons.map(({ level, points }) => (
          <polygon
            key={`grid-ring-${level}`}
            points={points}
            fill={level === 1.0 ? '#fdf2f8' : 'none'}
            fillOpacity={level === 1.0 ? 0.35 : 0}
            stroke="#fbcfe8"
            strokeWidth={level === 1.0 ? '1.8' : '1'}
            strokeDasharray={level === 1.0 ? 'none' : '3 3'}
          />
        ))}

        {/* 2. Các trục nan quạt tỏa ra từ tâm (Axes Lines) */}
        {skillKeys.map((_, i) => {
          const { x, y } = getCoordinates(i, radius);
          return (
            <line
              key={`axis-line-${i}`}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#f472b6"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              strokeOpacity="0.6"
            />
          );
        })}

        {/* 3. Đa giác dữ liệu năng lực học tập (Data Polygon) */}
        <polygon
          points={polygonPath}
          fill="url(#sakuraRadarGradient)"
          stroke="#be185d"
          strokeWidth="2.5"
          filter="url(#radarShadow)"
          style={{ transition: 'all 0.5s ease-out' }}
        />

        {/* 4. Các điểm nút dữ liệu (Vertex Dots) & Chỉ số */}
        {dataPoints.map((pt) => (
          <g key={`point-dot-${pt.key}`}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill="#ffffff"
              stroke="#be185d"
              strokeWidth="2.5"
            />
            <circle
              cx={pt.x}
              cy={pt.y}
              r="2.5"
              fill="#e11d48"
            />
          </g>
        ))}

        {/* 5. Nhãn tiêu đề 5 kỹ năng xung quanh */}
        {skillKeys.map((item, i) => {
          const { x, y } = getCoordinates(i, radius + 24);
          const rawScore = skills[item.key]?.score || 0;

          // Điều chỉnh căn lề chữ dựa theo vị trí góc
          let textAnchor = 'middle';
          let dy = '0.35em';
          if (i === 1 || i === 2) {
            textAnchor = 'start';
          } else if (i === 3 || i === 4) {
            textAnchor = 'end';
          }
          if (i === 0) dy = '-0.5em';

          return (
            <g key={`radar-label-${item.key}`}>
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dy={dy}
                fontSize="11"
                fontWeight="800"
                fill="#1e293b"
                style={{ fontFamily: 'inherit' }}
              >
                {item.label}
              </text>
              <text
                x={x}
                y={y + 14}
                textAnchor={textAnchor}
                dy={dy}
                fontSize="10"
                fontWeight="900"
                fill="#be185d"
                style={{ fontFamily: 'inherit' }}
              >
                {rawScore}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
