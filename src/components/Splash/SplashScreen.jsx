import React, { useState, useEffect } from 'react';
import '../../styles/sakura.css';

// Danh sách danh ngôn & châm ngôn tiếng Nhật truyền cảm hứng (Kotowaza)
const INSPIRATIONAL_QUOTES = [
  {
    kanji: '七転び八起き',
    hiragana: 'ななころびやおき',
    romaji: 'Nana korobi ya oki',
    meaning: 'Ngã bảy lần, đứng dậy tám lần — Kiên trì đến cùng',
    context: 'Học tiếng Nhật là hành trình không ngại vấp ngã',
  },
  {
    kanji: '継続は力なり',
    hiragana: 'けいぞくはちからなり',
    romaji: 'Keizoku wa chikara nari',
    meaning: 'Kiên trì tích lũy mỗi ngày chính là sức mạnh lớn nhất',
    context: 'Mỗi ngày 15 phút tạo nên kỳ tích',
  },
  {
    kanji: '千里の道も一歩から',
    hiragana: 'せんりのみちもいっぽから',
    romaji: 'Senri no michi mo ippo kara',
    meaning: 'Đường đi vạn dặm cũng bắt đầu từ một bước chân',
    context: 'Từng từ vựng hôm nay là nền móng cho N3, N2',
  },
  {
    kanji: '一期一会',
    hiragana: 'いちごいちえ',
    romaji: 'Ichigo ichie',
    meaning: 'Mỗi khoảnh khắc gặp gỡ đều là duyên phận quý giá độc nhất',
    context: 'Trân trọng từng buổi học và từng cơ hội luyện tập',
  },
  {
    kanji: '初心忘るべからず',
    hiragana: 'しょしんわするべからず',
    romaji: 'Shoshin wasuru bekarazu',
    meaning: 'Đừng bao giờ lãng quên tâm nguyện thuở ban đầu',
    context: 'Giữ mãi ngọn lửa đam mê với tiếng Nhật',
  },
  {
    kanji: '塵も積もれば山となる',
    hiragana: 'ちりもつもればやまとなる',
    romaji: 'Chiri mo tsumoreba yama to naru',
    meaning: 'Bụi bặm tích tụ sẽ hóa núi cao — Tích tiểu thành đại',
    context: 'Kiến thức tích lũy từng ngày sẽ thành tài',
  },
  {
    kanji: '日進月歩',
    hiragana: 'にっしんげっぽ',
    romaji: 'Nisshin geppo',
    meaning: 'Mỗi ngày mỗi tháng đều không ngừng tiến bộ vượt bậc',
    context: 'Hôm nay bạn đã giỏi hơn ngày hôm qua',
  },
];

/**
 * SplashScreen Component - Màn hình Intro Mở Đầu Đẳng Cấp Sakura EdTech
 * - Thời lượng hiển thị: 4.5 giây (đủ để đọc châm ngôn và ngắm hiệu ứng)
 * - Tự động đếm ngược và chuyển vào Dashboard chính
 * - Có nút tương tác "🚀 Vào Học Ngay (X giây)" và nút "Bỏ qua ✕"
 * - Cánh hoa Sakura bay lượn nền mượt mà
 */
export const SplashScreen = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Chọn ngẫu nhiên một câu châm ngôn khi khởi động
  const [quote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
    return INSPIRATIONAL_QUOTES[randomIndex];
  });

  const handleDismiss = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    // Chờ hiệu ứng mờ dần (Fade-out 350ms) rồi gọi onFinish
    setTimeout(() => {
      onFinish();
    }, 350);
  };

  // Điều khiển thanh tiến trình và đếm ngược (chỉ bắt đầu khi người dùng thực sự nhìn thấy tab)
  useEffect(() => {
    let interval = null;

    const startTimer = () => {
      const totalMs = 4500; // 4.5 giây
      const startTime = Date.now();

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setProgress(currentProgress);

        const remaining = Math.max(0, Math.ceil((totalMs - elapsed) / 1000));
        setSecondsLeft(remaining);

        if (elapsed >= totalMs) {
          clearInterval(interval);
          handleDismiss();
        }
      }, 30);
    };

    // Nếu tab đang bị ẩn (Brave/Chrome đang khởi động nền), chờ đến khi tab hiển thị trước mắt người dùng
    if (document.visibilityState === 'hidden') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          startTimer();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (interval) clearInterval(interval);
      };
    } else {
      startTimer();
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, []);

  return (
    <div className={`sakura-splash-backdrop ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Cánh hoa anh đào rơi trong màn hình Intro */}
      <div className="sakura-bg" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="petal" />
        ))}
      </div>

      {/* Nút Bỏ qua ở góc trên */}
      <button
        type="button"
        className="sakura-splash-skip-btn"
        onClick={handleDismiss}
        title="Bỏ qua intro và vào học ngay"
      >
        Bỏ qua ✕
      </button>

      {/* Container Nội dung Trung tâm */}
      <div className="sakura-splash-content">
        {/* Logo hoa anh đào bừng nở */}
        <div className="sakura-splash-logo-wrap">
          <div className="sakura-splash-halo" />
          <span className="sakura-splash-emoji">🌸</span>
        </div>

        {/* Tên ứng dụng */}
        <h1 className="sakura-splash-app-title">Nihongo Master</h1>
        <p className="sakura-splash-app-subtitle">日本語マスター • Dekiru Nihongo Sơ Cấp</p>

        {/* Thẻ Châm ngôn tiếng Nhật mỗi ngày (Kotowaza Wisdom) */}
        <div className="sakura-splash-quote-card">
          <div className="sakura-splash-quote-badge">🎋 Châm ngôn truyền cảm hứng hôm nay</div>
          <div className="sakura-splash-quote-kanji">{quote.kanji}</div>
          <div className="sakura-splash-quote-reading">
            【{quote.hiragana}】 • <em>{quote.romaji}</em>
          </div>
          <div className="sakura-splash-quote-meaning">👉 {quote.meaning}</div>
        </div>

        {/* Thanh tiến trình Sakura Progress */}
        <div className="sakura-splash-progress-track">
          <div
            className="sakura-splash-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="sakura-splash-loading-text">
          <span>Đang nạp không gian học tập...</span>
          <span className="sakura-splash-percent">{progress}%</span>
        </div>

        {/* Nút bấm trực quan: Vào học ngay */}
        <button
          type="button"
          className="sakura-splash-enter-btn"
          onClick={handleDismiss}
          title="Bấm để vào Dashboard ngay"
        >
          🚀 Vào Học Ngay ({secondsLeft}s)
        </button>
      </div>
    </div>
  );
};
