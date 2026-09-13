import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import '../../styles/sakura.css';

/**
 * WelcomeScreen Component - Giao diện Mở Đầu (Hero Onboarding Screen)
 * Thiết kế theo phong cách EdTech hiện đại (Duolingo / Apple Design):
 * - Hero Banner tạo cảm hứng học tập với hiệu ứng Sakura
 * - Nêu bật 3 trụ cột công nghệ: Thuật toán SM-2, AI Voice Kaiwa & Offline 100%
 * - Thống kê 965 từ vựng, 15 bài học sơ cấp
 * - Nút kêu gọi hành động (CTA) nổi bật để người dùng bắt đầu ngay
 */
export const WelcomeScreen = ({ onStartLearning, onOpenTranslator, onSelectLesson }) => {
  const { dailyStreak } = useProgress();

  return (
    <div style={styles.container}>
      {/* 1. HERO BANNER SECTION */}
      <div style={styles.heroCard}>
        <div style={styles.heroBadge}>
          🌸 CỔNG VÀO VŨ TRỤ NHẬT NGỮ • DEKIRU NIHONGO SƠ CẤP
        </div>

        <h1 style={styles.heroTitle}>
          Chinh Phục Tiếng Nhật Toàn Diện Từ Con Số 0
        </h1>

        <p style={styles.heroSubtitle}>
          Hệ thống học tiếng Nhật thông minh kết hợp <strong>Thuật toán lặp lại ngắt quãng (SM-2)</strong>,
          <strong> AI luyện nói phản xạ Kaiwa</strong> và công nghệ <strong>PWA Offline 100%</strong> sẵn sàng
          đồng hành cùng bạn mọi lúc, mọi nơi kể cả khi không có internet.
        </p>

        {/* CTA Buttons */}
        <div style={styles.ctaRow}>
          <button
            type="button"
            style={styles.primaryCtaBtn}
            onClick={onStartLearning}
          >
            <span>🚀 Bắt Đầu Học Ngay</span>
          </button>

          <button
            type="button"
            style={styles.secondaryCtaBtn}
            onClick={onOpenTranslator}
          >
            <span>🔍 Tra Cứu Từ Điển & Dịch AI</span>
          </button>
        </div>

        {/* Streak Status if learner has progress */}
        {dailyStreak.count > 0 && (
          <div style={styles.streakNotice}>
            🔥 Bạn đang duy trì chuỗi học tập <strong>{dailyStreak.count} ngày liên tiếp</strong>! Hãy tiếp tục phát huy nhé.
          </div>
        )}
      </div>

      {/* 2. STATS BAR (Thống kê ấn tượng) */}
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <div style={styles.statNumber}>15</div>
          <div style={styles.statLabel}>Bài học Dekiru Nihongo</div>
          <div style={styles.statDesc}>Đầy đủ từ vựng, ngữ pháp & Kaiwa</div>
        </div>

        <div style={styles.statBox}>
          <div style={styles.statNumber}>965+</div>
          <div style={styles.statLabel}>Từ vựng chuẩn giáo trình</div>
          <div style={styles.statDesc}>100% đối chiếu sách hồng, đủ Kanji & phiên âm</div>
        </div>

        <div style={styles.statBox}>
          <div style={styles.statNumber}>SM-2</div>
          <div style={styles.statLabel}>Thuật toán Spaced Repetition</div>
          <div style={styles.statDesc}>Tính toán chu kỳ ôn tập chống quên não bộ</div>
        </div>

        <div style={styles.statBox}>
          <div style={styles.statNumber}>100%</div>
          <div style={styles.statLabel}>Khả dụng Offline PWA</div>
          <div style={styles.statDesc}>Học tập trên máy bay, tàu xe không cần internet</div>
        </div>
      </div>

      {/* 3. CORE PILLARS SECTION (3 Trụ Cột Nổi Bật) */}
      <div style={{ margin: '48px 0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2d3748', margin: '0 0 8px' }}>
          ✨ Tính Năng Đột Phá Hỗ Trợ Người Học
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#718096', margin: 0 }}>
          Bộ công cụ toàn diện được thiết kế tối ưu cho trải nghiệm người dùng hiện đại
        </p>
      </div>

      <div style={styles.featuresGrid}>
        {/* Feature 1 */}
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, backgroundColor: '#fff0f6', color: '#e91e8c' }}>
            🎴
          </div>
          <h3 style={styles.featureTitle}>Flashcard 3D & SM-2 SRS</h3>
          <p style={styles.featureDesc}>
            Lật thẻ ghi nhớ 3D sống động. Thuật toán Spaced Repetition tự động tính toán thời điểm vàng
            để bạn ôn lại từ vựng đúng lúc sắp quên, giúp chuyển kiến thức vào trí nhớ dài hạn vĩnh viễn.
          </p>
        </div>

        {/* Feature 2 */}
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, backgroundColor: '#f0fdf4', color: '#15803d' }}>
            🗣️
          </div>
          <h3 style={styles.featureTitle}>Giao Tiếp Kaiwa & AI Voice</h3>
          <p style={styles.featureDesc}>
            Luyện nói các tình huống thực tế trong đời sống Nhật Bản. Tích hợp công nghệ Text-to-Speech
            giọng đọc chuẩn bản xứ và nhận diện giọng nói chấm điểm độ chuẩn xác tức thì.
          </p>
        </div>

        {/* Feature 3 */}
        <div style={styles.featureCard}>
          <div style={{ ...styles.featureIcon, backgroundColor: '#f0f9ff', color: '#0284c7' }}>
            🔍
          </div>
          <h3 style={styles.featureTitle}>Từ Điển Google AI & Romaji</h3>
          <p style={styles.featureDesc}>
            Dịch thuật song ngữ thông minh, tự động hiểu chữ Romaji (như <em>"watashi"</em> ➔ <em>"Tôi"</em>),
            hiển thị cách đọc (Phonetic) chi tiết và tra cứu offline 965 từ vựng khi không có mạng.
          </p>
        </div>
      </div>

      {/* 4. QUICK JUMP LESSONS */}
      <div style={styles.quickLessonsCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2d3748', margin: '0 0 4px' }}>
              📚 Chọn Nhanh Bài Học Đầu Tiên
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#718096' }}>
              Bắt đầu với những chủ đề căn bản quen thuộc nhất
            </span>
          </div>
          <button
            type="button"
            style={styles.viewAllLessonsBtn}
            onClick={onStartLearning}
          >
            Xem trọn bộ 15 bài ➔
          </button>
        </div>

        <div style={styles.lessonChipsGrid}>
          {[
            { id: 1, title: 'Bài 1: Tên, quốc gia, công việc', badge: 'Căn bản' },
            { id: 2, title: 'Bài 2: Vị trí, mua sắm & nhà hàng', badge: 'Đời sống' },
            { id: 3, title: 'Bài 3: Thời gian & sinh hoạt hàng ngày', badge: 'Thói quen' },
            { id: 4, title: 'Bài 4: Đi lại, du lịch & phương tiện', badge: 'Giao thông' },
            { id: 5, title: 'Bài 5: Gia đình & người thân', badge: 'Quan hệ' },
          ].map((lesson) => (
            <div
              key={lesson.id}
              style={styles.lessonChip}
              onClick={() => onSelectLesson ? onSelectLesson(lesson.id) : onStartLearning()}
              title={`Nhảy vào Bài ${lesson.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.lessonNumber}>第{lesson.id}課</span>
                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#2d3748' }}>
                  {lesson.title}
                </span>
              </div>
              <span style={styles.lessonTagBadge}>{lesson.badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FOOTER */}
      <footer style={styles.footer}>
        <div>🌸 <strong>Nihongo Master</strong> • Ứng dụng học tiếng Nhật hiện đại</div>
        <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '6px' }}>
          Phát triển bởi đội ngũ DeepMind AI Engineering • Hoạt động Online & Offline PWA 2026
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '20px 16px 80px',
    position: 'relative',
    zIndex: 1,
  },
  heroCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #fff6f9 50%, #fdf2f8 100%)',
    borderRadius: '28px',
    padding: '44px 36px',
    textAlign: 'center',
    boxShadow: '0 16px 40px rgba(233, 30, 140, 0.09), 0 2px 10px rgba(0, 0, 0, 0.02)',
    border: '1.5px solid #fce7f3',
    marginBottom: '32px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '6px 18px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
    border: '1.5px solid #fbcfe8',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.1)',
    marginBottom: '18px',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#1a202c',
    margin: '0 0 16px',
    letterSpacing: '-0.5px',
    lineHeight: '1.25',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: '#4a5568',
    maxWidth: '780px',
    margin: '0 auto 32px',
    lineHeight: '1.65',
  },
  ctaRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  primaryCtaBtn: {
    padding: '16px 36px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 50%, #f43f5e 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '1.05rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 22px rgba(233, 30, 140, 0.38)',
    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
    userSelect: 'none',
  },
  secondaryCtaBtn: {
    padding: '15px 32px',
    backgroundColor: '#ffffff',
    color: '#2d3748',
    border: '2px solid #fce7f3',
    borderRadius: '9999px',
    fontSize: '1.02rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  },
  streakNotice: {
    marginTop: '24px',
    display: 'inline-block',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid #fbcfe8',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '36px',
  },
  statBox: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '24px 20px',
    textAlign: 'center',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 6px 18px rgba(233, 30, 140, 0.05)',
  },
  statNumber: {
    fontSize: '2.2rem',
    fontWeight: '900',
    color: '#e91e8c',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: '4px',
  },
  statDesc: {
    fontSize: '0.8rem',
    color: '#718096',
    lineHeight: '1.4',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '22px',
    marginBottom: '40px',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: '22px',
    padding: '28px 24px',
    border: '1.5px solid #f0e2e7',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
  },
  featureIcon: {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.7rem',
    marginBottom: '16px',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#2d3748',
    margin: '0 0 10px',
  },
  featureDesc: {
    fontSize: '0.92rem',
    color: '#718096',
    lineHeight: '1.6',
    margin: 0,
  },
  quickLessonsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 8px 24px rgba(233, 30, 140, 0.06)',
    marginBottom: '40px',
  },
  viewAllLessonsBtn: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    border: '1px solid #fbcfe8',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  lessonChipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px',
  },
  lessonChip: {
    backgroundColor: '#f8fafc',
    border: '1.5px solid #e2e8f0',
    borderRadius: '16px',
    padding: '14px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  lessonNumber: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    padding: '3px 8px',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: '800',
  },
  lessonTagBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#718096',
    backgroundColor: '#edf2f7',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  footer: {
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #f8e7ee',
    color: '#718096',
    fontSize: '0.9rem',
  },
};
