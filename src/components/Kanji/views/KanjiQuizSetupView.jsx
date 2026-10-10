import React from 'react';
import { kanjiQuizStyles as styles } from './kanjiQuizStyles';

/**
 * KanjiQuizSetupView - Màn hình Cấu Hình Đấu Trường Trắc Nghiệm Hán Tự N5
 */
export const KanjiQuizSetupView = ({
  availableLessons,
  selectedLesson,
  setSelectedLesson,
  kanjiList,
  learnedMap,
  questionType,
  setQuestionType,
  questionCount,
  setQuestionCount,
  targetPool,
  onBackToGrid,
  onStartQuiz,
}) => {
  return (
    <div style={styles.setupCard}>
      <div style={styles.setupHeader}>
        <span style={{ fontSize: '2.5rem' }}>🎯</span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1a202c', margin: '8px 0' }}>
          Đấu Trường Trắc Nghiệm Hán Tự N5
        </h2>
        <p style={{ color: '#718096', fontSize: '0.92rem', margin: 0 }}>
          Thiết lập cấu hình bài tập để bắt đầu kiểm tra phản xạ chữ Hán.
        </p>
      </div>

      {/* 1. Chọn phạm vi bài học */}
      <div style={styles.setupSection}>
        <label style={styles.setupLabel}>📚 Chọn phạm vi bài học:</label>
        <div style={styles.chipRow}>
          {availableLessons.map((les) => (
            <button
              key={les}
              type="button"
              onClick={() => setSelectedLesson(les)}
              className={`kanji-quiz-chip ${selectedLesson === les ? 'active' : ''}`}
            >
              {les === 'all' ? 'Toàn bộ 80 chữ Hán' : `Bài ${les}`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedLesson('unlearned')}
            className={`kanji-quiz-chip ${selectedLesson === 'unlearned' ? 'active' : ''}`}
          >
            ⚠️ Chỉ chữ chưa thuộc ({kanjiList.filter((k) => !learnedMap[k.id || k.character]).length})
          </button>
        </div>
      </div>

      {/* 2. Chọn dạng câu hỏi */}
      <div style={styles.setupSection}>
        <label style={styles.setupLabel}>🔤 Dạng bài tập:</label>
        <div style={styles.modeGrid}>
          <div
            className={`kanji-mode-card ${questionType === 'kanji_to_hanviet' ? 'active' : ''}`}
            onClick={() => setQuestionType('kanji_to_hanviet')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🈸 ➔ 🇻🇳</div>
            <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>
              Nhìn Chữ Hán ➔ Chọn Âm Hán Việt
            </div>
            <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>
              Ví dụ: <strong>日</strong> ➔ Chọn <strong>NHẬT (Mặt trời, ngày)</strong>
            </div>
          </div>

          <div
            className={`kanji-mode-card ${questionType === 'hanviet_to_kanji' ? 'active' : ''}`}
            onClick={() => setQuestionType('hanviet_to_kanji')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🇻🇳 ➔ 🈸</div>
            <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>
              Nhìn Âm Hán Việt ➔ Chọn Chữ Hán
            </div>
            <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>
              Ví dụ: <strong>HỌC</strong> ➔ Chọn <strong>学</strong>
            </div>
          </div>

          <div
            className={`kanji-mode-card ${questionType === 'kanji_to_reading' ? 'active' : ''}`}
            onClick={() => setQuestionType('kanji_to_reading')}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🈸 ➔ 🇯🇵</div>
            <div style={{ fontWeight: '700', color: '#2d3748', fontSize: '1rem' }}>
              Nhìn Chữ Hán ➔ Chọn Cách Đọc (On/Kun)
            </div>
            <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '4px' }}>
              Ví dụ: <strong>人</strong> ➔ Chọn <strong>Kun: ひと | On: ジン</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Chọn số lượng câu hỏi */}
      <div style={styles.setupSection}>
        <label style={styles.setupLabel}>🔢 Số lượng câu hỏi:</label>
        <div style={styles.chipRow}>
          {[10, 20, 30, 'all'].map((cnt) => (
            <button
              key={cnt}
              type="button"
              onClick={() => setQuestionCount(cnt)}
              className={`kanji-quiz-chip ${questionCount === cnt ? 'active' : ''}`}
            >
              {cnt === 'all' ? `Tất cả (${targetPool.length} câu)` : `${cnt} câu`}
            </button>
          ))}
        </div>
      </div>

      {/* Nút Bắt đầu */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
        <button
          type="button"
          className="kanji-action-btn"
          style={styles.cancelBtn}
          onClick={onBackToGrid}
        >
          ⬅ Xem Bảng Chữ Hán
        </button>
        <button
          type="button"
          className="kanji-action-btn"
          style={styles.startBtn}
          onClick={onStartQuiz}
          disabled={targetPool.length < 4}
        >
          🚀 Bắt Đầu Đấu Trường ({targetPool.length} chữ khả dụng)
        </button>
      </div>
    </div>
  );
};
