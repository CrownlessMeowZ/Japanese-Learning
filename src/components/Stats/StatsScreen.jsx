import React, { useState, useMemo } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { StatsRadarChart } from './StatsRadarChart';
import { StatsHeatmap } from './StatsHeatmap';
import {
  calculateCompetencyRadar,
  generate365DaysHeatmap,
  get15LessonsBreakdown,
} from '../../utils/statsUtils';
import '../../styles/stats.css';

/**
 * Đọc kỷ lục Sakura Match từ LocalStorage
 */
function loadMatchStats() {
  try {
    const raw = localStorage.getItem('nihongo_master_sakura_match_highscores') || localStorage.getItem('sakura_match_highscores');
    if (!raw) return { topScore: 0, totalGames: 0 };
    const parsed = JSON.parse(raw);
    let topScore = 0;
    let totalGames = 0;
    for (const val of Object.values(parsed)) {
      if (val) {
        if (val.highScore && val.highScore > topScore) topScore = val.highScore;
        if (val.gamesPlayed) totalGames += val.gamesPlayed;
      }
    }
    return { topScore, totalGames };
  } catch {
    return { topScore: 0, totalGames: 0 };
  }
}

/**
 * StatsScreen Component - Trung Tâm Thống Kê & Radar Năng Lực (Bước 6)
 * Trực quan hóa toàn diện 5 kỹ năng, lịch hoạt động 365 ngày và tiến độ 15 bài học
 */
export const StatsScreen = ({ onBack, onSelectLesson }) => {
  const {
    learnedItems,
    kanjiLearned,
    dailyStreak,
    bonsaiState,
    mistakeVault,
    activityHistory,
    kaiwaScores,
    kanaPractice,
  } = useProgress();

  const [matchStats] = useState(loadMatchStats);

  // Tính toán năng lực 5 kỹ năng (Radar)
  const radarData = useMemo(() => {
    return calculateCompetencyRadar(
      learnedItems,
      kanjiLearned,
      kaiwaScores,
      kanaPractice
    );
  }, [learnedItems, kanjiLearned, kaiwaScores, kanaPractice]);

  // Tính toán dữ liệu biểu đồ nhiệt 365 ngày
  const heatmapData = useMemo(() => {
    return generate365DaysHeatmap(
      activityHistory,
      learnedItems,
      kanjiLearned,
      mistakeVault,
      bonsaiState
    );
  }, [activityHistory, learnedItems, kanjiLearned, mistakeVault, bonsaiState]);

  // Tiến độ chi tiết 15 bài học
  const lessonsBreakdown = useMemo(() => {
    return get15LessonsBreakdown(learnedItems);
  }, [learnedItems]);

  // Số từ còn trong Hộp cứu hộ
  const mistakeCount = Object.keys(mistakeVault || {}).length;

  return (
    <div className="stats-container">
      {/* 1. Header Điều Hướng */}
      <div className="stats-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={onBack}
            className="stats-back-btn"
            title="Quay lại khóa học"
          >
            ⬅ Dashboard
          </button>
          <div className="stats-header-title">
            <span style={{ fontSize: '1.6rem' }}>📊</span>
            <div>
              <h1>Trung Tâm Thống Kê & Radar Năng Lực</h1>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                Phân tích dữ liệu học tập Dekiru Nihongo & thói quen 365 ngày
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '6px 14px',
            backgroundColor: '#fff1f2',
            border: '1.5px solid #fecdd3',
            borderRadius: '12px',
            color: '#e11d48',
            fontWeight: '800',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🔥 {dailyStreak.count} ngày liên tiếp
          </span>
        </div>
      </div>

      {/* 2. Lưới 4 Thẻ Chỉ Số Tổng Quan (Hero Metric Cards) */}
      <div className="stats-metrics-grid">
        {/* Card 1: Từ Vựng SM-2 SRS */}
        <div className="stats-metric-card">
          <div>
            <div className="stats-metric-header">
              <span className="stats-metric-label">Từ Vựng (SRS)</span>
              <div className="stats-metric-icon" style={{ backgroundColor: '#fdf2f8', color: '#e91e8c' }}>
                📚
              </div>
            </div>
            <div className="stats-metric-value" style={{ color: '#be185d' }}>
              {radarData.skills.vocab.count}
              <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}> / 965</span>
            </div>
          </div>
          <div className="stats-metric-desc">
            🌟 <strong>{radarData.skills.vocab.mastered}</strong> từ thuộc dài hạn (≥14 ngày)
          </div>
        </div>

        {/* Card 2: Hán Tự & Ngữ Pháp */}
        <div className="stats-metric-card">
          <div>
            <div className="stats-metric-header">
              <span className="stats-metric-label">Hán Tự & Ngữ Pháp</span>
              <div className="stats-metric-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                🈸
              </div>
            </div>
            <div className="stats-metric-value" style={{ color: '#d97706' }}>
              {radarData.skills.kanji.count}
              <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}> / 80 chữ</span>
            </div>
          </div>
          <div className="stats-metric-desc">
            📐 <strong>{radarData.skills.grammar.count}/68</strong> mẫu ngữ pháp đã học
          </div>
        </div>

        {/* Card 3: Thói Quen & Streak */}
        <div className="stats-metric-card">
          <div>
            <div className="stats-metric-header">
              <span className="stats-metric-label">Chuỗi & Thói Quen</span>
              <div className="stats-metric-icon" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}>
                🔥
              </div>
            </div>
            <div className="stats-metric-value" style={{ color: '#15803d' }}>
              {dailyStreak.count}
              <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}> ngày</span>
            </div>
          </div>
          <div className="stats-metric-desc">
            🏆 Kỷ lục: <strong>{dailyStreak.bestStreak}</strong> ngày • 🪴 Tưới: <strong>{bonsaiState?.waterCount || 0}</strong> lần
          </div>
        </div>

        {/* Card 4: Minigame & Cứu Hộ */}
        <div className="stats-metric-card">
          <div>
            <div className="stats-metric-header">
              <span className="stats-metric-label">Phản Xạ & Cứu Hộ</span>
              <div className="stats-metric-icon" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                ⚔️
              </div>
            </div>
            <div className="stats-metric-value" style={{ color: '#0284c7' }}>
              {matchStats.topScore}
              <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}> điểm</span>
            </div>
          </div>
          <div className="stats-metric-desc">
            🎮 {matchStats.totalGames} ván đấu • ⚠️ Sổ lỗi: <strong>{mistakeCount}</strong> từ
          </div>
        </div>
      </div>

      {/* 3. Phần Radar 5 Kỹ Năng & Bảng Phân Tích Chuyên Sâu */}
      <div className="stats-radar-section">
        {/* Khối bên trái: Biểu Đồ Mạng Nhện SVG thuần */}
        <div className="stats-card-box">
          <div className="stats-card-title">
            <h3>
              <span>🎯</span>
              <span>Bản Đồ Năng Lực 5 Chiều</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700' }}>
              Ngũ giác cân đối
            </span>
          </div>

          <StatsRadarChart skills={radarData.skills} />
        </div>

        {/* Khối bên phải: Cấp Bậc & Thanh Năng Lực Chi Tiết */}
        <div className="stats-card-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="stats-card-title">
              <h3>
                <span>🎖️</span>
                <span>Xếp Hạng Cấp Bậc & Chi Tiết</span>
              </h3>
            </div>

            {/* Thẻ Cấp Bậc Danh Hiệu */}
            <div className="stats-rank-card">
              <div className="stats-rank-score-circle">
                <span className="number">{radarData.overallScore}</span>
                <span className="max">/ 100</span>
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: '900', color: radarData.rankColor }}>
                  {radarData.rankTitle}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px', lineHeight: '1.4' }}>
                  {radarData.rankDesc}
                </div>
              </div>
            </div>

            {/* Danh Sách Thanh Tiến Độ 5 Kỹ Năng */}
            <div className="stats-skill-bars">
              {/* Kỹ năng 1: Từ vựng */}
              <div className="stats-skill-row">
                <div className="stats-skill-info">
                  <span style={{ color: '#1e293b' }}>📖 Từ Vựng ({radarData.skills.vocab.count}/{radarData.skills.vocab.total})</span>
                  <span style={{ color: '#e91e8c' }}>{radarData.skills.vocab.score}%</span>
                </div>
                <div className="stats-skill-track">
                  <div className="stats-skill-fill" style={{ width: `${radarData.skills.vocab.score}%`, backgroundColor: '#e91e8c' }} />
                </div>
              </div>

              {/* Kỹ năng 2: Hán tự */}
              <div className="stats-skill-row">
                <div className="stats-skill-info">
                  <span style={{ color: '#1e293b' }}>🈸 Hán Tự N5 ({radarData.skills.kanji.count}/{radarData.skills.kanji.total})</span>
                  <span style={{ color: '#d97706' }}>{radarData.skills.kanji.score}%</span>
                </div>
                <div className="stats-skill-track">
                  <div className="stats-skill-fill" style={{ width: `${radarData.skills.kanji.score}%`, backgroundColor: '#d97706' }} />
                </div>
              </div>

              {/* Kỹ năng 3: Bảng chữ cái */}
              <div className="stats-skill-row">
                <div className="stats-skill-info">
                  <span style={{ color: '#1e293b' }}>🔤 Bảng Chữ Cái (Kana)</span>
                  <span style={{ color: '#7c3aed' }}>{radarData.skills.kana.score}%</span>
                </div>
                <div className="stats-skill-track">
                  <div className="stats-skill-fill" style={{ width: `${radarData.skills.kana.score}%`, backgroundColor: '#7c3aed' }} />
                </div>
              </div>

              {/* Kỹ năng 4: Ngữ pháp */}
              <div className="stats-skill-row">
                <div className="stats-skill-info">
                  <span style={{ color: '#1e293b' }}>📐 Ngữ Pháp ({radarData.skills.grammar.count}/{radarData.skills.grammar.total})</span>
                  <span style={{ color: '#059669' }}>{radarData.skills.grammar.score}%</span>
                </div>
                <div className="stats-skill-track">
                  <div className="stats-skill-fill" style={{ width: `${radarData.skills.grammar.score}%`, backgroundColor: '#059669' }} />
                </div>
              </div>

              {/* Kỹ năng 5: Nghe & nói */}
              <div className="stats-skill-row">
                <div className="stats-skill-info">
                  <span style={{ color: '#1e293b' }}>🗣️ Nghe & Nói Kaiwa ({radarData.skills.speaking.count}/{radarData.skills.speaking.total})</span>
                  <span style={{ color: '#2563eb' }}>{radarData.skills.speaking.score}%</span>
                </div>
                <div className="stats-skill-track">
                  <div className="stats-skill-fill" style={{ width: `${radarData.skills.speaking.score}%`, backgroundColor: '#2563eb' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Lời khuyên AI Cá Nhân Hóa */}
          {radarData.weakestSkill && (
            <div className="stats-ai-advice-box">
              <strong style={{ color: '#be185d' }}>💡 Gợi ý bứt phá: </strong>
              {radarData.weakestSkill.advice}
            </div>
          )}
        </div>
      </div>

      {/* 4. Lịch Hoạt Động Cày Cuốc 365 Ngày (Heatmap) */}
      <StatsHeatmap
        weeks={heatmapData.weeks}
        monthLabels={heatmapData.monthLabels}
        totalActiveDays={heatmapData.totalActiveDays}
        totalActivities={heatmapData.totalActivities}
      />

      {/* 5. Phân Tích Tiến Độ 15 Bài Học Dekiru Nihongo */}
      <div className="stats-card-box">
        <div className="stats-card-title">
          <h3>
            <span>📚</span>
            <span>Tiến Độ 15 Bài Học Chuẩn Dekiru Nihongo</span>
          </h3>
          <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: '700' }}>
            Toàn bộ 15 bài học sơ cấp
          </span>
        </div>

        <div className="stats-lessons-grid">
          {lessonsBreakdown.map((item) => {
            const isCompleted = item.percent >= 80;
            return (
              <div key={`stat-ls-${item.lessonId}`} className="stats-lesson-item">
                <div className="stats-lesson-item-header">
                  <span className="stats-lesson-name">
                    Bài {item.lessonId}
                  </span>
                  <span
                    className="stats-lesson-badge"
                    style={{
                      backgroundColor: isCompleted ? '#ecfdf5' : '#f8fafc',
                      color: isCompleted ? '#059669' : '#64748b',
                      border: isCompleted ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    }}
                  >
                    {item.percent}%
                  </span>
                </div>

                {/* Thanh tiến độ bài học */}
                <div className="stats-skill-track" style={{ height: '6px' }}>
                  <div
                    className="stats-skill-fill"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: isCompleted ? '#10b981' : '#e91e8c',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#64748b' }}>
                  <span>Từ vựng: <strong>{item.vocabLearned}/{item.vocabCount}</strong></span>
                  <span>Ngữ pháp: <strong>{item.grammarLearned}/{item.grammarCount}</strong></span>
                </div>

                {onSelectLesson && (
                  <button
                    type="button"
                    onClick={() => onSelectLesson(item.lessonId)}
                    style={{
                      marginTop: '4px',
                      padding: '4px 8px',
                      backgroundColor: '#fdf2f8',
                      color: '#be185d',
                      border: '1px solid #fbcfe8',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    Vào ôn luyện ➔
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
