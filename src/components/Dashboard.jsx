import React, { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { vocabularyData } from '../data/vocabulary';
import { grammarData } from '../data/grammar';
import { LessonModal } from './LessonModal';
import '../styles/sakura.css';

/**
 * Dashboard Component - Progressive Disclosure (Modal Pattern)
 * Tinh gọn giao diện để loại bỏ triệt để tình trạng Cognitive Overload:
 * - Mỗi thẻ bài học chỉ hiển thị thông tin trọng tâm + 1 nút duy nhất: [ 🚀 Vào Bài Học ]
 * - Khi click sẽ kích hoạt LessonModal với 4 lựa chọn kỹ năng chuyên sâu (Từ Vựng, Ngữ Pháp, Giao Tiếp, Quiz)
 */
export const Dashboard = ({ onSelectQuiz, onSelectVocab, onSelectGrammar, onSelectKaiwa, onOpenTranslator }) => {
  const { dailyStreak, getCompletionRate } = useProgress();
  const [selectedLessonForModal, setSelectedLessonForModal] = useState(null);

  // Danh sách 15 bài học chuẩn Dekiru Nihongo Sơ cấp
  const lessons = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      {/* Top Banner: Daily Streak & Overview */}
      <div className="sakura-dashboard-banner">
        <div style={styles.streakInfo}>
          <div style={styles.streakFlameCircle}>
            <span style={{ fontSize: '2.4rem' }}>🔥</span>
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#e91e8c', letterSpacing: '-0.2px' }}>
              {dailyStreak.count} ngày liên tiếp
            </div>
            <div style={{ fontSize: '0.92rem', color: '#718096', marginTop: '2px' }}>
              Học tập mỗi ngày để giữ vững phong độ và chuỗi Streak nhé!
            </div>
          </div>
        </div>

        <div style={styles.streakStats}>
          <span style={styles.badge}>🏆 Kỷ lục: {dailyStreak.bestStreak} ngày</span>
          <span style={styles.badge}>🌸 Giáo trình: Dekiru Nihongo (15 bài)</span>
          {onOpenTranslator && (
            <button
              type="button"
              style={styles.translatorBannerBtn}
              onClick={onOpenTranslator}
              title="Tra cứu từ vựng và dịch song ngữ"
            >
              🔍 Tra Cứu Từ Điển
            </button>
          )}
        </div>
      </div>

      <div style={styles.sectionHeader}>
        <div>
          <h2 style={{ color: '#2d3748', fontSize: '1.65rem', margin: 0, fontWeight: '800' }}>
            📚 Lộ Trình 15 Bài Học
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#a0aec0', fontWeight: '500' }}>
            Minna no Nihongo & Dekiru Nihongo Sơ cấp
          </span>
        </div>
      </div>

      {/* Grid 15 Lessons */}
      <div style={styles.grid}>
        {lessons.map((lessonId) => {
          const words = vocabularyData[String(lessonId)] || [];
          const grammars = grammarData[lessonId] || grammarData[String(lessonId)] || [];
          const { percentage, learnedCount, totalCount } = getCompletionRate(lessonId, words);

          return (
            <div key={lessonId} className="sakura-lesson-card">
              <div>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={styles.lessonTag}>Bài {lessonId}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#2d3748' }}>
                      第{lessonId}課
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '700' }}>
                    {learnedCount}/{totalCount} từ ({percentage}%)
                  </span>
                </div>

                {/* Progress Bar with Soft Rounded Pill */}
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${percentage}%`,
                      backgroundColor: percentage === 100 ? '#10b981' : '#e91e8c',
                    }}
                  />
                </div>

                <div style={{ fontSize: '1.08rem', fontWeight: '700', color: '#2d3748', margin: '14px 0 6px' }}>
                  Dekiru Nihongo - Bài {lessonId}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#718096', marginBottom: '18px' }}>
                  Bao gồm {words.length} từ vựng • {grammars.length} mẫu ngữ pháp • Hội thoại AI
                </div>
              </div>

              {/* Nút duy nhất trải dài full width - Progressive Disclosure */}
              <button
                type="button"
                className="enter-lesson-btn"
                onClick={() => setSelectedLessonForModal(lessonId)}
                title={`Mở danh sách kỹ năng Bài ${lessonId}`}
              >
                <span>🚀 Vào Bài Học</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Lesson Action Modal (Progressive Disclosure) */}
      {selectedLessonForModal && (
        <LessonModal
          lessonId={selectedLessonForModal}
          onClose={() => setSelectedLessonForModal(null)}
          onSelectVocab={onSelectVocab}
          onSelectGrammar={onSelectGrammar}
          onSelectKaiwa={onSelectKaiwa}
          onSelectQuiz={onSelectQuiz}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '24px 16px 80px',
    position: 'relative',
    zIndex: 1,
  },
  streakFlameCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#fff0f6',
    border: '2px solid #fce7f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(233, 30, 140, 0.12)',
  },
  streakInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  streakStats: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#ffffff',
    color: '#e91e8c',
    padding: '7px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 2px 6px rgba(233, 30, 140, 0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    margin: '32px 0 18px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '22px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  lessonTag: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '10px',
    fontSize: '0.78rem',
    fontWeight: '800',
    letterSpacing: '0.3px',
    boxShadow: '0 2px 6px rgba(233, 30, 140, 0.2)',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#edf2f7',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  translatorBannerBtn: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '7px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '800',
    border: '1.5px solid #f8bbd0',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.12)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
};
