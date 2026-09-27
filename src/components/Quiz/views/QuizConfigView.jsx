import React from 'react';
import { vocabularyData } from '../../../data/vocabulary';
import { quizStyles } from './quizViewStyles';

/**
 * QuizConfigView - Presentational component for Quiz IDLE state
 * Cho phép người dùng tùy chỉnh hình thức ôn tập, chiều câu hỏi, tốc độ audio,
 * phạm vi bài học và số lượng câu hỏi.
 */
export const QuizConfigView = ({
  activePool = [],
  lessonId = 1,
  scopeLabel = '',
  questionFormat = 'choice',
  setQuestionFormat,
  quizMode = 'vi_to_ja',
  setQuizMode,
  audioSpeed = 1.0,
  setAudioSpeed,
  selectedScope = 'current',
  setSelectedScope,
  questionCount = 10,
  setQuestionCount,
  autoPlayAudio = true,
  setAutoPlayAudio,
  dueQuestions = [],
  onStartSession,
  onBack,
}) => {
  const minRequired = questionFormat === 'choice' ? 4 : 1;
  const hasEnoughItems = activePool.length >= minRequired;

  return (
    <div style={quizStyles.card}>
      {/* Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={quizStyles.idleBadge}>
          🧠 Spaced Repetition (SM-2)
        </div>
        <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: '600' }}>
          Tổng kho: {activePool.length} từ vựng
        </span>
      </div>

      <h2 style={{ color: '#e91e8c', fontSize: '1.85rem', margin: '12px 0 8px', fontWeight: '800' }}>
        🎯 Luyện Tập & Kiểm Tra Từ Vựng
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.96rem', lineHeight: '1.5', margin: '0 0 20px' }}>
        Lựa chọn trắc nghiệm phản xạ, gõ từ vựng âm tiết WanaKana hoặc luyện nghe chép chính tả Dictation.
      </p>

      {/* 0. TÙY CHỌN HÌNH THỨC ÔN TẬP (QUESTION FORMAT) */}
      <div style={quizStyles.sectionBox}>
        <div style={quizStyles.sectionHeader}>
          <span>📝 Hình thức ôn tập:</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`quiz-mode-pill ${questionFormat === 'choice' ? 'active' : ''}`}
            onClick={() => setQuestionFormat('choice')}
          >
            🔘 Trắc Nghiệm (4 lựa chọn)
          </button>
          <button
            type="button"
            className={`quiz-mode-pill ${questionFormat === 'typing' ? 'active' : ''}`}
            onClick={() => {
              setQuestionFormat('typing');
              if (quizMode === 'listening') setQuizMode('vi_to_ja');
            }}
          >
            ⌨️ Tự Luận Gõ Phím (WanaKana)
          </button>
          <button
            type="button"
            className={`quiz-mode-pill ${questionFormat === 'dictation' ? 'active' : ''}`}
            onClick={() => {
              setQuestionFormat('dictation');
              setQuizMode('listening');
            }}
          >
            ✍️ Nghe Chép Chính Tả (Dictation)
          </button>
        </div>
      </div>

      {/* 1. TÙY CHỌN DẠNG BÀI / CHIỀU CÂU HỎI */}
      {questionFormat !== 'dictation' && (
        <div style={quizStyles.sectionBox}>
          <div style={quizStyles.sectionHeader}>
            <span>🎮 Chiều câu hỏi:</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`quiz-mode-pill ${quizMode === 'vi_to_ja' ? 'active' : ''}`}
              onClick={() => setQuizMode('vi_to_ja')}
            >
              🇻🇳 ➔ 🇯🇵 {questionFormat === 'typing' ? 'Gõ Từ Tiếng Nhật' : 'Nghĩa sang Từ'}
            </button>
            <button
              type="button"
              className={`quiz-mode-pill ${quizMode === 'ja_to_vi' ? 'active' : ''}`}
              onClick={() => setQuizMode('ja_to_vi')}
            >
              🔄 🇯🇵 ➔ 🇻🇳 {questionFormat === 'typing' ? 'Gõ Nghĩa Tiếng Việt' : 'Từ sang Nghĩa'}
            </button>
            {questionFormat === 'choice' && (
              <button
                type="button"
                className={`quiz-mode-pill ${quizMode === 'listening' ? 'active' : ''}`}
                onClick={() => setQuizMode('listening')}
              >
                🎧 Luyện Nghe Audio
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1.1 TÙY CHỌN TỐC ĐỘ PHÁT ÂM AUDIO */}
      {(questionFormat === 'dictation' || quizMode === 'listening') && (
        <div style={quizStyles.sectionBox}>
          <div style={quizStyles.sectionHeader}>
            <span>🎧 Tốc độ phát âm mẫu:</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={`idle-spd-${spd}`}
                type="button"
                className={`quiz-mode-pill ${audioSpeed === spd ? 'active' : ''}`}
                onClick={() => setAudioSpeed(spd)}
              >
                {spd}x {spd === 0.75 ? '(Chậm rõ)' : spd === 1.0 ? '(Chuẩn)' : '(Nâng cao)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. TÙY CHỌN PHẠM VI BÀI HỌC (SCOPE) */}
      <div style={quizStyles.sectionBox}>
        <div style={quizStyles.sectionHeader}>
          <span>📚 Phạm vi ôn tập:</span>
          <span style={{ fontSize: '0.85rem', color: '#e91e8c', fontWeight: '700' }}>
            {scopeLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button
            type="button"
            className={`quiz-chip ${selectedScope === 'current' ? 'active' : ''}`}
            onClick={() => setSelectedScope('current')}
          >
            📌 Bài {lessonId}
          </button>
          <button
            type="button"
            className={`quiz-chip ${selectedScope === '1-3' ? 'active' : ''}`}
            onClick={() => setSelectedScope('1-3')}
          >
            Bài 1 – 3
          </button>
          <button
            type="button"
            className={`quiz-chip ${selectedScope === '1-5' ? 'active' : ''}`}
            onClick={() => setSelectedScope('1-5')}
          >
            Bài 1 – 5
          </button>
          <button
            type="button"
            className={`quiz-chip ${selectedScope === '1-10' ? 'active' : ''}`}
            onClick={() => setSelectedScope('1-10')}
          >
            Bài 1 – 10
          </button>
          <button
            type="button"
            className={`quiz-chip ${selectedScope === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedScope('all')}
          >
            🌟 Tất cả 15 bài
          </button>
        </div>

        {/* Chọn nhanh một bài học đơn lẻ bất kỳ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
          <span>Hoặc chọn nhanh bài:</span>
          <select
            value={typeof selectedScope === 'number' ? selectedScope : (selectedScope === 'current' ? lessonId : '')}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedScope(Number(e.target.value));
              }
            }}
            style={quizStyles.selectInput}
          >
            <option value="">-- Chọn bài lẻ --</option>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                Bài {num} ({vocabularyData[String(num)]?.length || 0} từ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. TÙY CHỌN SỐ LƯỢNG CÂU & BỘ LỌC ĐẾN HẠN SM-2 */}
      <div style={quizStyles.sectionBox}>
        <div style={quizStyles.sectionHeader}>
          <span>⚡ Số lượng câu hỏi:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#4a5568' }}>
            <input
              type="checkbox"
              checked={autoPlayAudio}
              onChange={(e) => setAutoPlayAudio(e.target.checked)}
              style={{ accentColor: '#e91e8c', cursor: 'pointer' }}
            />
            🔊 Tự động phát âm
          </label>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[10, 20, 30].map((count) => (
            <button
              key={count}
              type="button"
              className={`quiz-chip ${questionCount === count ? 'active' : ''}`}
              onClick={() => setQuestionCount(count)}
            >
              {count} câu
            </button>
          ))}
          <button
            type="button"
            className={`quiz-chip ${questionCount === 'all' ? 'active' : ''}`}
            onClick={() => setQuestionCount('all')}
          >
            Tất cả từ
          </button>
        </div>
      </div>

      {/* Thống kê SM-2 & Nút Bắt Đầu */}
      <div style={quizStyles.dueSummaryBox}>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#2d3748', fontWeight: '700' }}>
            {dueQuestions.length > 0
              ? `⚡ Có ${dueQuestions.length} từ đến hạn ôn tập SM-2 trong ${scopeLabel}`
              : `🎉 Tất cả từ vựng trong ${scopeLabel} đã được ôn tập tốt hôm nay!`}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '2px' }}>
            Thuật toán SM-2 sẽ tăng dần khoảng cách ngày ôn tập khi bạn trả lời chính xác.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
        {onBack && (
          <button
            type="button"
            className="quiz-action-btn"
            style={quizStyles.secondaryBtn}
            onClick={onBack}
          >
            ⬅ Quay lại Dashboard
          </button>
        )}

        {dueQuestions.length >= minRequired && (
          <button
            type="button"
            className="quiz-action-btn"
            style={quizStyles.primaryBtn}
            onClick={() => onStartSession(false)}
          >
            🚀 Ôn tập từ đến hạn ({Math.min(questionCount === 'all' ? dueQuestions.length : questionCount, dueQuestions.length)} câu)
          </button>
        )}

        <button
          type="button"
          className="quiz-action-btn"
          style={dueQuestions.length >= minRequired ? quizStyles.outlineBtn : quizStyles.primaryBtn}
          onClick={() => onStartSession(true)}
          disabled={!hasEnoughItems}
        >
          🔄 Ôn tập tự do ({activePool.length} từ)
        </button>
      </div>

      {!hasEnoughItems && (
        <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginTop: '16px', textAlign: 'center' }}>
          ⚠️ {questionFormat === 'choice'
            ? 'Cần tối thiểu 4 từ vựng trong bài học để tạo 4 lựa chọn trắc nghiệm.'
            : 'Không có từ vựng nào trong bài học đã chọn.'}
        </p>
      )}
    </div>
  );
};
