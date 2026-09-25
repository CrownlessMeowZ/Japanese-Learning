import React, { useState } from 'react';

const DAY_LABELS = ['', 'T2', '', 'T4', '', 'T6', ''];

/**
 * StatsHeatmap - Biểu đồ nhiệt hoạt động 365 ngày
 * Ma trận 53 tuần x 7 ngày, hiệu ứng hover tooltip, hỗ trợ cuộn ngang mượt mà trên mobile
 */
export const StatsHeatmap = ({
  weeks = [],
  monthLabels = [],
  totalActiveDays = 0,
  totalActivities = 0,
}) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    formattedDate: '',
    count: 0,
  });

  const handleMouseEnter = (e, day) => {
    if (day.isFuture) return;
    const rect = e.target.getBoundingClientRect();
    const parentRect = e.currentTarget.closest('.stats-heatmap-scroll')?.getBoundingClientRect() || rect;

    setTooltip({
      visible: true,
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top,
      formattedDate: day.formattedDate,
      count: day.count,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="stats-card-box stats-heatmap-section" style={{ position: 'relative' }}>
      <div className="stats-card-title">
        <h3>
          <span>🔥</span>
          <span>Lịch Hoạt Động Cày Cuốc 365 Ngày (Activity Heatmap)</span>
        </h3>
        <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '700' }}>
          Đã cày: <strong style={{ color: '#be185d' }}>{totalActiveDays}</strong> ngày ({totalActivities} lượt học)
        </div>
      </div>

      <div className="stats-heatmap-scroll" style={{ position: 'relative' }}>
        {/* Tooltip nổi khi hover */}
        {tooltip.visible && (
          <div
            className="stats-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <div>{tooltip.formattedDate}</div>
            <div style={{ color: tooltip.count > 0 ? '#fbcfe8' : '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>
              {tooltip.count > 0
                ? `🌸 ${tooltip.count} lượt hoạt động`
                : 'Chưa có hoạt động'}
            </div>
          </div>
        )}

        {/* Hàng nhãn các tháng ở trên đỉnh */}
        <div style={{ display: 'flex', marginLeft: '26px', marginBottom: '6px', minWidth: '780px' }}>
          {weeks.map((_, wIndex) => {
            const m = monthLabels.find((ml) => ml.weekIndex === wIndex);
            return (
              <div
                key={`m-label-${wIndex}`}
                style={{
                  width: '16px',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  color: '#94a3b8',
                  textAlign: 'left',
                }}
              >
                {m ? m.label : ''}
              </div>
            );
          })}
        </div>

        {/* Ma trận tuần và các ngày */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Cột nhãn Thứ (T2, T4, T6) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '18px', paddingTop: '1px' }}>
            {DAY_LABELS.map((lbl, idx) => (
              <div
                key={`day-lbl-${idx}`}
                style={{
                  height: '13px',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {lbl}
              </div>
            ))}
          </div>

          {/* Lưới 53 cột x 7 hàng */}
          <div className="stats-heatmap-grid">
            {weeks.map((week, wIdx) => (
              <div key={`week-col-${wIdx}`} className="stats-heatmap-column">
                {week.map((day, dIdx) => (
                  <div
                    key={`day-cell-${wIdx}-${dIdx}`}
                    className={`stats-heatmap-cell stats-cell-lvl-${day.level}`}
                    style={{
                      opacity: day.isFuture ? 0.25 : 1,
                      border: day.isToday ? '1.5px solid #be185d' : 'none',
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chú thích mức độ ở góc dưới */}
      <div className="stats-heatmap-legend">
        <span>Ít</span>
        <div className="stats-heatmap-legend-items">
          <div className="stats-heatmap-cell stats-cell-lvl-0" title="0 lượt" />
          <div className="stats-heatmap-cell stats-cell-lvl-1" title="1-2 lượt" />
          <div className="stats-heatmap-cell stats-cell-lvl-2" title="3-5 lượt" />
          <div className="stats-heatmap-cell stats-cell-lvl-3" title="6-9 lượt" />
          <div className="stats-heatmap-cell stats-cell-lvl-4" title="10+ lượt" />
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
};
