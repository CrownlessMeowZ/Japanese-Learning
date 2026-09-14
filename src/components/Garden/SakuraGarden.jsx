import React, { useState, useMemo } from 'react';

/**
 * Danh sách danh ngôn & triết lý Nhật Bản truyền cảm hứng
 */
const ZEN_QUOTES = [
  { ja: '継続は力なり', romaji: 'Keizoku wa chikara nari', vi: 'Kiên trì chính là sức mạnh bền bỉ nhất.' },
  { ja: '千里の道も一歩から', romaji: 'Senri no michi mo ippo kara', vi: 'Hành trình vạn dặm khởi đầu từ một bước chân.' },
  { ja: '七転び八起き', romaji: 'Nanakorobi yaoki', vi: 'Bảy lần ngã, tám lần đứng dậy.' },
  { ja: '一期一会', romaji: 'Ichigo ichie', vi: 'Nhất kỳ nhất hội – Trân quý từng khoảnh khắc học tập.' },
  { ja: '初心忘るべからず', romaji: 'Shoshin wasurerubekarazu', vi: 'Đừng bao giờ quên sơ tâm và khát vọng ban đầu.' },
  { ja: '雨降って地固まる', romaji: 'Ame futte ji katamaru', vi: 'Sau cơn mưa trời lại sáng, đất càng thêm vững chãi.' },
];

/**
 * Xác định giai đoạn tiến hóa của cây Bonsai theo chuỗi ngày học liên tục (Streak)
 */
const getBonsaiStage = (streakCount = 1) => {
  if (streakCount >= 30) {
    return {
      stage: 5,
      name: 'Đại Thụ Mãn Khai',
      kanji: '満開の桜',
      badge: '✨ Master Bonsai (Cấp 5)',
      description: 'Cây cổ thụ Bonsai vươn cành rực rỡ, biểu trưng cho sự bền bỉ tuyệt đỉnh!',
      nextTarget: null,
      daysToNext: 0,
    };
  }
  if (streakCount >= 14) {
    return {
      stage: 4,
      name: 'Nở Hoa Rực Rỡ',
      kanji: '開花',
      badge: '🌺 Hoa Nở (Cấp 4)',
      description: 'Những đóa hoa anh đào đầu tiên đã bung nở ngát hương!',
      nextTarget: 30,
      daysToNext: 30 - streakCount,
    };
  }
  if (streakCount >= 7) {
    return {
      stage: 3,
      name: 'Đơm Nụ Hồng',
      kanji: 'つぼみ',
      badge: '🌸 Kết Nụ (Cấp 3)',
      description: 'Cây đã đủ cứng cáp và xuất hiện những nụ hoa e ấp.',
      nextTarget: 14,
      daysToNext: 14 - streakCount,
    };
  }
  if (streakCount >= 3) {
    return {
      stage: 2,
      name: 'Cây Non Vươn Cành',
      kanji: '若木',
      badge: '🌿 Cây Non (Cấp 2)',
      description: 'Thân cây gỗ đã định hình, các nhánh lá vươn lên đón nắng.',
      nextTarget: 7,
      daysToNext: 7 - streakCount,
    };
  }
  return {
    stage: 1,
    name: 'Mầm Non Tinh Khôi',
    kanji: '新芽',
    badge: '🌱 Mầm Non (Cấp 1)',
    description: 'Hạt mầm tri thức bắt đầu đâm chồi từ chậu gốm Nhật Bản.',
    nextTarget: 3,
    daysToNext: 3 - streakCount,
  };
};

/**
 * Component Vẽ Cây Bonsai Bằng SVG Vector Đa Tầng
 */
const BonsaiTreeSvg = ({ stage, isWatering }) => {
  return (
    <svg
      viewBox="0 0 240 220"
      style={{
        width: '100%',
        maxWidth: '220px',
        height: 'auto',
        overflow: 'visible',
        filter: 'drop-shadow(0 8px 16px rgba(233, 30, 140, 0.12))',
      }}
    >
      <defs>
        {/* Gradient cho chậu gốm sứ */}
        <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Gradient đất */}
        <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#573a27" />
          <stop offset="100%" stopColor="#3e2717" />
        </linearGradient>

        {/* Gradient thân gỗ */}
        <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#5c2c16" />
        </linearGradient>

        {/* Gradient tán hoa anh đào */}
        <linearGradient id="sakuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb3d9" />
          <stop offset="50%" stopColor="#ff70a6" />
          <stop offset="100%" stopColor="#e91e8c" />
        </linearGradient>

        {/* Hào quang cấp 5 */}
        <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(251, 207, 232, 0.6)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
      </defs>

      {/* Hiệu ứng hào quang cho Stage 5 */}
      {stage === 5 && (
        <circle cx="120" cy="85" r="75" fill="url(#auraGrad)" opacity="0.8">
          <animate
            attributeName="r"
            values="70;80;70"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Chậu Gốm Bonsai (Bonsai Ceramic Pot) */}
      <g transform="translate(0, 150)">
        {/* Đất */}
        <ellipse cx="120" cy="12" rx="60" ry="14" fill="url(#soilGrad)" />

        {/* Vành chậu */}
        <ellipse cx="120" cy="10" rx="66" ry="12" fill="#475569" />
        <ellipse cx="120" cy="8" rx="64" ry="10" fill="url(#potGrad)" />

        {/* Thân chậu */}
        <path
          d="M 58 12 L 68 46 Q 120 54 172 46 L 182 12 Z"
          fill="url(#potGrad)"
        />

        {/* Chân chậu */}
        <rect x="74" y="46" width="16" height="6" rx="2" fill="#1e293b" />
        <rect x="150" y="46" width="16" height="6" rx="2" fill="#1e293b" />

        {/* Họa tiết hoa anh đào trên chậu */}
        <circle cx="120" cy="28" r="4" fill="#f472b6" opacity="0.85" />
        <circle cx="116" cy="25" r="3" fill="#fbcfe8" opacity="0.7" />
        <circle cx="124" cy="25" r="3" fill="#fbcfe8" opacity="0.7" />
        <circle cx="117" cy="32" r="3" fill="#fbcfe8" opacity="0.7" />
        <circle cx="123" cy="32" r="3" fill="#fbcfe8" opacity="0.7" />
      </g>

      {/* CÂY BONSAI THEO GIAI ĐOẠN */}
      <g
        style={{
          transformOrigin: '120px 160px',
          transition: 'transform 0.5s ease',
          transform: isWatering ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {/* ================= STAGE 1: MẦM NON ================= */}
        {stage === 1 && (
          <g>
            {/* Chồi xanh mọc từ đất */}
            <path
              d="M 120 156 Q 118 135 120 120"
              stroke="#65a30d"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* 2 lá mầm non */}
            <path
              d="M 120 120 C 105 110 100 125 120 130 Z"
              fill="#84cc16"
            />
            <path
              d="M 120 120 C 135 110 140 125 120 130 Z"
              fill="#a3e635"
            />
            {/* Giọt sương mai */}
            <circle cx="112" cy="116" r="2.5" fill="#38bdf8" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* ================= STAGE 2: CÂY NON ================= */}
        {stage === 2 && (
          <g>
            {/* Thân cây gỗ non uốn nhẹ */}
            <path
              d="M 120 158 Q 112 135 124 112 Q 130 96 122 84"
              stroke="url(#trunkGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cành phụ */}
            <path
              d="M 120 122 Q 105 116 98 108"
              stroke="url(#trunkGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 124 102 Q 138 98 146 90"
              stroke="url(#trunkGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Tán lá xanh */}
            <circle cx="95" cy="106" r="14" fill="#65a30d" />
            <circle cx="148" cy="88" r="12" fill="#84cc16" />
            <circle cx="120" cy="80" r="16" fill="#4d7c0f" />
          </g>
        )}

        {/* ================= STAGE 3: KẾT NỤ ================= */}
        {stage === 3 && (
          <g>
            {/* Thân Bonsai thế nghiêng thanh thoát */}
            <path
              d="M 120 158 Q 110 130 128 108 Q 138 88 120 70"
              stroke="url(#trunkGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 116 126 Q 94 114 84 104"
              stroke="url(#trunkGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 126 96 Q 148 90 160 80"
              stroke="url(#trunkGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Vòm tán xanh dày */}
            <circle cx="82" cy="102" r="18" fill="#4d7c0f" />
            <circle cx="162" cy="78" r="16" fill="#65a30d" />
            <circle cx="118" cy="65" r="22" fill="#3f6212" />

            {/* Nụ hoa anh đào tròn hồng */}
            <circle cx="76" cy="98" r="5" fill="#f472b6" />
            <circle cx="88" cy="108" r="4.5" fill="#fb7185" />
            <circle cx="158" cy="72" r="5" fill="#f472b6" />
            <circle cx="168" cy="82" r="4.5" fill="#fb7185" />
            <circle cx="112" cy="58" r="5.5" fill="#ec4899" />
            <circle cx="126" cy="62" r="5" fill="#f472b6" />
          </g>
        )}

        {/* ================= STAGE 4: HOA NỞ ================= */}
        {stage === 4 && (
          <g>
            {/* Thân cây Bonsai uốn lượn nghệ thuật */}
            <path
              d="M 120 158 Q 106 128 130 100 Q 144 76 118 56"
              stroke="url(#trunkGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 112 126 Q 84 112 70 98"
              stroke="url(#trunkGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 128 92 Q 158 84 174 70"
              stroke="url(#trunkGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Tán hoa anh đào bung nở hồng rực */}
            <ellipse cx="68" cy="94" rx="26" ry="18" fill="url(#sakuraGrad)" />
            <ellipse cx="174" cy="66" rx="24" ry="17" fill="url(#sakuraGrad)" />
            <ellipse cx="118" cy="50" rx="36" ry="24" fill="url(#sakuraGrad)" />

            {/* Các cánh hoa anh đào nổi bật */}
            <circle cx="62" cy="90" r="6" fill="#fff" opacity="0.9" />
            <circle cx="74" cy="98" r="5" fill="#fdf2f8" opacity="0.95" />
            <circle cx="168" cy="62" r="6" fill="#fff" opacity="0.9" />
            <circle cx="116" cy="44" r="7" fill="#fff" opacity="0.9" />
            <circle cx="130" cy="54" r="6" fill="#fdf2f8" opacity="0.9" />
            <circle cx="104" cy="52" r="5" fill="#fff" opacity="0.9" />

            {/* Cánh hoa rơi lơ lửng */}
            <path
              d="M 88 126 Q 92 130 88 134 Q 84 130 88 126 Z"
              fill="#f472b6"
              opacity="0.85"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 10,25; 15,45"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        )}

        {/* ================= STAGE 5: ĐẠI THỤ MÃN KHAI ================= */}
        {stage === 5 && (
          <g>
            {/* Thân Bonsai cổ thụ bề thế */}
            <path
              d="M 120 158 Q 100 125 132 94 Q 150 68 116 46"
              stroke="url(#trunkGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Nhánh trái dài */}
            <path
              d="M 110 125 Q 76 110 58 92"
              stroke="url(#trunkGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Nhánh phải dài */}
            <path
              d="M 130 88 Q 166 78 186 60"
              stroke="url(#trunkGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Vòm hoa đại thụ bồng bềnh như mây */}
            <ellipse cx="54" cy="86" rx="30" ry="22" fill="url(#sakuraGrad)" />
            <ellipse cx="188" cy="56" rx="28" ry="20" fill="url(#sakuraGrad)" />
            <ellipse cx="116" cy="40" rx="46" ry="28" fill="url(#sakuraGrad)" />
            <ellipse cx="116" cy="30" rx="32" ry="20" fill="#fbcfe8" opacity="0.6" />

            {/* Chi tiết hoa trắng & nhụy vàng */}
            <circle cx="48" cy="80" r="7" fill="#ffffff" />
            <circle cx="62" cy="92" r="6.5" fill="#fdf2f8" />
            <circle cx="182" cy="50" r="7" fill="#ffffff" />
            <circle cx="194" cy="62" r="6" fill="#fdf2f8" />
            <circle cx="114" cy="34" r="8" fill="#ffffff" />
            <circle cx="132" cy="44" r="7" fill="#fdf2f8" />
            <circle cx="98" cy="42" r="6.5" fill="#ffffff" />

            {/* Các chấm lấp lánh vàng kim */}
            <circle cx="114" cy="34" r="2.5" fill="#fbbf24" />
            <circle cx="48" cy="80" r="2" fill="#fbbf24" />
            <circle cx="182" cy="50" r="2" fill="#fbbf24" />

            {/* Cánh hoa rơi liên tục */}
            <path
              d="M 80 110 Q 84 114 80 118 Q 76 114 80 110 Z"
              fill="#f472b6"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 12,30; 20,60"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M 160 85 Q 164 89 160 93 Q 156 89 160 85 Z"
              fill="#fbcfe8"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -10,35; -16,70"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        )}
      </g>
    </svg>
  );
};

/**
 * SakuraGarden Component - Thẻ Vườn Bonsai Tăng Trưởng
 * Đặt ngay trên Dashboard để gắn kết hành vi học tập hàng ngày
 */
export const SakuraGarden = ({ streakCount = 1, bonsaiState, onWater }) => {
  const [isWatering, setIsWatering] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const stageInfo = useMemo(() => getBonsaiStage(streakCount), [streakCount]);
  const currentQuote = ZEN_QUOTES[quoteIndex % ZEN_QUOTES.length];

  // Kiểm tra xem hôm nay đã tưới nước chưa
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const isAlreadyWatered = bonsaiState?.lastWateredDate === todayStr;

  const handleWaterClick = () => {
    if (isAlreadyWatered) return;

    setIsWatering(true);
    if (onWater) {
      onWater();
    }

    // Đổi sang quote truyền cảm hứng tiếp theo
    setQuoteIndex((prev) => prev + 1);

    setTimeout(() => {
      setIsWatering(false);
    }, 800);
  };

  return (
    <div style={styles.cardContainer}>
      {/* Cột Trái: Đồ Họa Cây Bonsai */}
      <div style={styles.visualCol}>
        <div style={styles.badgeWrap}>
          <span style={styles.stageBadge}>{stageInfo.badge}</span>
        </div>

        <div style={styles.treeWrapper}>
          <BonsaiTreeSvg stage={stageInfo.stage} isWatering={isWatering} />
        </div>

        <div style={styles.treeKanjiName}>
          {stageInfo.kanji} • {stageInfo.name}
        </div>
      </div>

      {/* Cột Phải: Thông tin Tiến Trình & Tương Tác */}
      <div style={styles.infoCol}>
        <div>
          <div style={styles.headerTitleRow}>
            <h3 style={styles.gardenTitle}>🌸 Vườn Bonsai Sakura (桜の盆栽)</h3>
            <span style={styles.waterCounterBadge}>
              💧 Đã tưới {bonsaiState?.waterCount || 0} lần
            </span>
          </div>

          <p style={styles.stageDesc}>{stageInfo.description}</p>

          {/* Thanh Tiến Trình Lên Cấp Tiếp Theo */}
          {stageInfo.nextTarget && (
            <div style={styles.progressBlock}>
              <div style={styles.progressLabelRow}>
                <span style={styles.progressLabel}>
                  Tiến hóa cấp tiếp theo:
                </span>
                <span style={styles.progressValue}>
                  Còn <strong>{stageInfo.daysToNext}</strong> ngày streak
                </span>
              </div>
              <div style={styles.progressBarTrack}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${Math.min(
                      100,
                      Math.max(
                        10,
                        (streakCount / stageInfo.nextTarget) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Câu Danh Ngôn Zen Nhật Bản */}
        <div style={styles.quoteCard} onClick={() => setQuoteIndex((prev) => prev + 1)} title="Bấm để đổi danh ngôn">
          <div style={styles.quoteJapanese}>{currentQuote.ja}</div>
          <div style={styles.quoteRomaji}>{currentQuote.romaji}</div>
          <div style={styles.quoteVietnamese}>👉 {currentQuote.vi}</div>
        </div>

        {/* Nút Tưới Nước Hàng Ngày */}
        <div style={styles.actionRow}>
          <button
            type="button"
            style={{
              ...styles.waterBtn,
              ...(isAlreadyWatered ? styles.waterBtnDisabled : {}),
            }}
            onClick={handleWaterClick}
            disabled={isAlreadyWatered}
            title={
              isAlreadyWatered
                ? 'Hôm nay bạn đã chăm sóc cây rồi, hãy quay lại vào ngày mai!'
                : 'Tưới nước chăm sóc cây và duy trì năng lượng học tập!'
            }
          >
            {isAlreadyWatered ? (
              <span>✨ Đã chăm sóc hôm nay</span>
            ) : (
              <span>💧 Tưới nước cho cây hôm nay</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 8px 30px rgba(233, 30, 140, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
    marginBottom: '28px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  visualCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    backgroundColor: '#fffafc',
    borderRadius: '20px',
    border: '1px solid #fce7f3',
  },
  badgeWrap: {
    marginBottom: '8px',
  },
  stageBadge: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#db2777',
    backgroundColor: '#fdf2f8',
    padding: '4px 12px',
    borderRadius: '12px',
    border: '1px solid #fbcfe8',
  },
  treeWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0',
  },
  treeKanjiName: {
    fontSize: '0.92rem',
    fontWeight: '800',
    color: '#334155',
    marginTop: '6px',
    letterSpacing: '0.5px',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: '16px',
  },
  headerTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '6px',
  },
  gardenTitle: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  waterCounterBadge: {
    fontSize: '0.76rem',
    fontWeight: '700',
    color: '#0284c7',
    backgroundColor: '#f0f9ff',
    padding: '4px 10px',
    borderRadius: '10px',
    border: '1px solid #bae6fd',
  },
  stageDesc: {
    fontSize: '0.88rem',
    color: '#64748b',
    margin: '4px 0 14px',
    lineHeight: '1.5',
  },
  progressBlock: {
    marginBottom: '14px',
  },
  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: '6px',
  },
  progressLabel: {
    fontWeight: '600',
  },
  progressValue: {
    color: '#e91e8c',
  },
  progressBarTrack: {
    width: '100%',
    height: '7px',
    backgroundColor: '#f1f5f9',
    borderRadius: '9999px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)',
    borderRadius: '9999px',
    transition: 'width 0.4s ease',
  },
  quoteCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  quoteJapanese: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#e91e8c',
  },
  quoteRomaji: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    margin: '2px 0 4px',
  },
  quoteVietnamese: {
    fontSize: '0.84rem',
    color: '#475569',
    fontWeight: '600',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '4px',
  },
  waterBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    fontWeight: '800',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  waterBtnDisabled: {
    background: '#f1f5f9',
    color: '#94a3b8',
    boxShadow: 'none',
    cursor: 'default',
    border: '1px solid #cbd5e0',
  },
};
