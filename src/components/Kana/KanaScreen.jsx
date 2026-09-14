import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  KANA_SECTIONS,
  getSelectedKanaItems,
  getAllRowIds,
  getSeionRowIds,
} from '../../data/kanaData';
import '../../styles/sakura.css';

/**
 * KanaScreen Component - Module Bảng Chữ Cái & Kiểm Tra Phản Xạ (Tofugu Style)
 * 1. Bảng Tra Cứu Tương Tác (Interactive Chart) kèm phát âm TTS
 * 2. Bộ Lọc Tuyển Chọn Hàng/Nhóm chữ linh hoạt
 * 3. Kiểm Tra Phản Xạ Chủ Động (Active Recall Speed Typing + Multiple Choice)
 * 4. Báo Cáo Kết Quả & Ôn Tập Chữ Yếu
 */
export const KanaScreen = ({ onBack }) => {
  // Main view: 'chart' | 'setup' | 'quiz' | 'results'
  const [activeTab, setActiveTab] = useState('chart');

  // Chart state
  const [chartScript, setChartScript] = useState('hiragana'); // 'hiragana' | 'katakana'

  // Quiz Setup state
  const [quizScript, setQuizScript] = useState('hiragana'); // 'hiragana' | 'katakana' | 'both'
  const [quizMode, setQuizMode] = useState('typing'); // 'typing' | 'choice'
  const [selectedRows, setSelectedRows] = useState(getSeionRowIds()); // Mặc định chọn 46 âm cơ bản

  // Active Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [isInputShaking, setIsInputShaking] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(null); // { correct: bool, text: string } | null
  const [stats, setStats] = useState({ correct: 0, wrong: 0, troubleItems: [] });
  const [choiceOptions, setChoiceOptions] = useState([]);
  const inputRef = useRef(null);

  // Phát âm chữ cái tiếng Nhật (Web Speech API)
  const speakKana = (character) => {
    if (!character || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(character);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Toggle chọn / bỏ chọn một hàng
  const toggleRow = (rowId) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      }
      return [...prev, rowId];
    });
  };

  // Các action chọn nhanh
  const selectAllRows = () => setSelectedRows(getAllRowIds());
  const selectSeionOnly = () => setSelectedRows(getSeionRowIds());
  const clearAllRows = () => setSelectedRows([]);

  // Bắt đầu làm bài Quiz
  const startQuiz = (customItems = null) => {
    let pool = customItems;
    if (!pool) {
      if (selectedRows.length === 0) {
        alert('Vui lòng chọn ít nhất một hàng chữ cái để bắt đầu kiểm tra!');
        return;
      }
      pool = getSelectedKanaItems(quizScript, selectedRows);
    }

    if (pool.length === 0) {
      alert('Không có ký tự nào được chọn!');
      return;
    }

    // Xáo trộn ngẫu nhiên (Fisher-Yates shuffle)
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setTypedInput('');
    setIsInputShaking(false);
    setShowAnswerFeedback(null);
    setStats({ correct: 0, wrong: 0, troubleItems: [] });
    setActiveTab('quiz');
  };

  // Tạo các lựa chọn trắc nghiệm cho câu hiện tại
  useEffect(() => {
    if (activeTab === 'quiz' && quizMode === 'choice' && quizQuestions[currentIndex]) {
      const current = quizQuestions[currentIndex];
      const allRomaji = Array.from(new Set(quizQuestions.map((q) => q.romaji)));
      const wrongPool = allRomaji.filter((r) => r !== current.romaji);
      const wrongShuffled = wrongPool.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [current.romaji, ...wrongShuffled].sort(() => Math.random() - 0.5);
      setChoiceOptions(options);
    }
  }, [activeTab, quizMode, currentIndex, quizQuestions]);

  // Focus ô input khi ở chế độ gõ phím
  useEffect(() => {
    if (activeTab === 'quiz' && quizMode === 'typing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTab, currentIndex, quizMode]);

  // Xử lý khi người dùng trả lời đúng
  const handleCorrectAnswer = (item) => {
    speakKana(item.character);
    setShowAnswerFeedback({ correct: true, text: `Chính xác: ${item.romaji}` });
    setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));

    setTimeout(() => {
      advanceNextQuestion();
    }, 450);
  };

  // Xử lý khi người dùng trả lời sai hoặc không biết
  const handleWrongAnswer = (item, isSkip = false) => {
    setIsInputShaking(true);
    setTimeout(() => setIsInputShaking(false), 500);

    setStats((prev) => {
      const exists = prev.troubleItems.find((t) => t.character === item.character);
      const updatedTrouble = exists
        ? prev.troubleItems.map((t) =>
            t.character === item.character ? { ...t, count: t.count + 1 } : t
          )
        : [...prev.troubleItems, { ...item, count: 1 }];

      return {
        ...prev,
        wrong: prev.wrong + 1,
        troubleItems: updatedTrouble,
      };
    });

    if (isSkip) {
      setShowAnswerFeedback({
        correct: false,
        text: `Đáp án là: ${item.romaji}`,
      });
      speakKana(item.character);
      setTimeout(() => {
        advanceNextQuestion();
      }, 1000);
    }
  };

  // Chuyển sang câu tiếp theo hoặc kết thúc
  const advanceNextQuestion = () => {
    setShowAnswerFeedback(null);
    setTypedInput('');
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setActiveTab('results');
    }
  };

  // Lắng nghe gõ phím tự động (Speed Typing như Tofugu)
  const handleTypingChange = (e) => {
    const val = e.target.value.toLowerCase().trim();
    setTypedInput(val);

    const current = quizQuestions[currentIndex];
    if (!current) return;

    // Kiểm tra xem có khớp romaji chính hoặc các cách gõ thay thế (alts) không
    const isMatch =
      val === current.romaji.toLowerCase() ||
      (current.alts && current.alts.includes(val));

    if (isMatch) {
      handleCorrectAnswer(current);
    }
  };

  // Khi bấm Enter trong ô gõ phím nếu chưa khớp
  const handleTypingKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const current = quizQuestions[currentIndex];
      if (!current) return;
      const isMatch =
        typedInput === current.romaji.toLowerCase() ||
        (current.alts && current.alts.includes(typedInput));
      if (!isMatch) {
        handleWrongAnswer(current, false);
      }
    }
  };

  // Chọn đáp án trắc nghiệm
  const handleSelectChoice = (option) => {
    const current = quizQuestions[currentIndex];
    if (!current) return;

    if (option === current.romaji) {
      handleCorrectAnswer(current);
    } else {
      handleWrongAnswer(current, true);
    }
  };

  // Ôn tập lại chỉ những chữ đã làm sai
  const retryTroubleKana = () => {
    if (stats.troubleItems.length === 0) return;
    startQuiz(stats.troubleItems);
  };

  // Tổng số ký tự đã chọn
  const totalSelectedChars = useMemo(() => {
    return getSelectedKanaItems(quizScript, selectedRows).length;
  }, [quizScript, selectedRows]);

  return (
    <div style={styles.container}>
      {/* Top Bar Header */}
      <div style={styles.topBar}>
        {onBack && (
          <button type="button" style={styles.backBtn} onClick={onBack}>
            ⬅ Quay lại Dashboard
          </button>
        )}
        <div style={styles.headerTitleWrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={styles.pageTitle}>🔤 Bảng Chữ Cái & Luyện Phản Xạ</h1>
            <span style={styles.badgeEdTech}>Active Recall • Tofugu Mode</span>
          </div>
          <span style={styles.pageSubTitle}>
            Học chuẩn 104 âm Hiragana & Katakana • Luyện phản xạ gõ phím thần tốc & trắc nghiệm
          </span>
        </div>
      </div>

      {/* Main Switcher Navigation Tabs */}
      <div style={styles.tabNavRow}>
        <button
          type="button"
          style={{
            ...styles.navTabBtn,
            ...(activeTab === 'chart' ? styles.navTabBtnActive : {}),
          }}
          onClick={() => setActiveTab('chart')}
        >
          📖 Bảng Tra Cứu (Kana Chart)
        </button>
        <button
          type="button"
          style={{
            ...styles.navTabBtn,
            ...(activeTab === 'setup' || activeTab === 'quiz' || activeTab === 'results'
              ? styles.navTabBtnActive
              : {}),
          }}
          onClick={() => setActiveTab('setup')}
        >
          🎯 Luyện Tập Phản Xạ (Kana Quiz)
        </button>
      </div>

      {/* TAB 1: BẢNG TRA CỨU TƯƠNG TÁC (KANA CHART) */}
      {activeTab === 'chart' && (
        <div style={styles.cardBox}>
          {/* Sub-toggle: Hiragana vs Katakana */}
          <div style={styles.chartControlBar}>
            <div style={styles.scriptToggleWrap}>
              <button
                type="button"
                style={{
                  ...styles.scriptBtn,
                  ...(chartScript === 'hiragana' ? styles.scriptBtnActive : {}),
                }}
                onClick={() => setChartScript('hiragana')}
              >
                🌸 Hiragana (Chữ mềm)
              </button>
              <button
                type="button"
                style={{
                  ...styles.scriptBtn,
                  ...(chartScript === 'katakana' ? styles.scriptBtnActive : {}),
                }}
                onClick={() => setChartScript('katakana')}
              >
                ⚡ Katakana (Chữ cứng)
              </button>
            </div>

            <button
              type="button"
              style={styles.actionLaunchQuizBtn}
              onClick={() => {
                setQuizScript(chartScript);
                setActiveTab('setup');
              }}
            >
              🚀 Luyện tập bảng này ngay
            </button>
          </div>

          {/* Render Sections (Seion, Dakuon, Yoon) */}
          {KANA_SECTIONS.map((section) => (
            <div key={section.id} style={styles.chartSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>{section.title}</h3>
                <span style={styles.sectionDesc}>{section.description}</span>
              </div>

              <div style={styles.chartRowsContainer}>
                {section.rows.map((row) => (
                  <div key={row.id} style={styles.chartRowCard}>
                    <div style={styles.rowTitleLabel}>{row.name}</div>
                    <div style={styles.kanaGridRow}>
                      {row.items.map((item, idx) => {
                        const char = chartScript === 'hiragana' ? item.hira : item.kata;
                        return (
                          <div
                            key={idx}
                            style={styles.kanaCell}
                            onClick={() => speakKana(char)}
                            title={`Click để nghe phát âm: ${item.romaji}`}
                          >
                            <span style={styles.kanaCharacter}>{char}</span>
                            <span style={styles.kanaRomaji}>{item.romaji}</span>
                            <span style={styles.speakerIcon}>🔊</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CẤU HÌNH BÀI KIỂM TRA (QUIZ SETUP) */}
      {activeTab === 'setup' && (
        <div style={styles.cardBox}>
          <div style={styles.setupHeader}>
            <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#2d3748', fontWeight: '800' }}>
              🎯 Tùy Chọn Bài Kiểm Tra Phản Xạ
            </h2>
            <p style={{ color: '#718096', fontSize: '0.92rem', margin: '4px 0 0' }}>
              Tùy chỉnh linh hoạt các hàng chữ bạn muốn rèn luyện (theo phương pháp chủ động Tofugu)
            </p>
          </div>

          {/* 1. Chọn bảng chữ cái */}
          <div style={styles.setupBlock}>
            <label style={styles.setupBlockLabel}>1. Chọn Bảng Chữ Cái:</label>
            <div style={styles.pillGroup}>
              <button
                type="button"
                style={{
                  ...styles.pillOption,
                  ...(quizScript === 'hiragana' ? styles.pillOptionActive : {}),
                }}
                onClick={() => setQuizScript('hiragana')}
              >
                🌸 Hiragana
              </button>
              <button
                type="button"
                style={{
                  ...styles.pillOption,
                  ...(quizScript === 'katakana' ? styles.pillOptionActive : {}),
                }}
                onClick={() => setQuizScript('katakana')}
              >
                ⚡ Katakana
              </button>
              <button
                type="button"
                style={{
                  ...styles.pillOption,
                  ...(quizScript === 'both' ? styles.pillOptionActive : {}),
                }}
                onClick={() => setQuizScript('both')}
              >
                🔄 Trộn Lẫn Cả 2 Bảng
              </button>
            </div>
          </div>

          {/* 2. Chọn hình thức kiểm tra */}
          <div style={styles.setupBlock}>
            <label style={styles.setupBlockLabel}>2. Chọn Hình Thức Kiểm Tra:</label>
            <div style={styles.pillGroup}>
              <button
                type="button"
                style={{
                  ...styles.pillOption,
                  ...(quizMode === 'typing' ? styles.pillOptionActive : {}),
                }}
                onClick={() => setQuizMode('typing')}
              >
                ⌨️ Gõ Phím Phản Xạ (Speed Typing - Tofugu)
              </button>
              <button
                type="button"
                style={{
                  ...styles.pillOption,
                  ...(quizMode === 'choice' ? styles.pillOptionActive : {}),
                }}
                onClick={() => setQuizMode('choice')}
              >
                🔘 Trắc Nghiệm 4 Đáp Án (Multiple Choice)
              </button>
            </div>
          </div>

          {/* 3. Bộ lọc tuyển chọn hàng chữ cái */}
          <div style={styles.setupBlock}>
            <div style={styles.rowSelectorToolbar}>
              <label style={styles.setupBlockLabel}>
                3. Chọn Hàng Chữ Luyện Tập ({totalSelectedChars} ký tự đã chọn):
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" style={styles.quickSelectBtn} onClick={selectAllRows}>
                  ✓ Chọn Tất Cả
                </button>
                <button type="button" style={styles.quickSelectBtn} onClick={selectSeionOnly}>
                  🌸 Chỉ Âm Cơ Bản (46 chữ)
                </button>
                <button type="button" style={styles.quickSelectBtn} onClick={clearAllRows}>
                  ✕ Bỏ Chọn Hết
                </button>
              </div>
            </div>

            {/* Checklist các hàng theo từng nhóm âm */}
            <div style={styles.rowChecklistContainer}>
              {KANA_SECTIONS.map((section) => (
                <div key={section.id} style={{ marginBottom: '16px' }}>
                  <div style={styles.sectionDividerTitle}>{section.title}</div>
                  <div style={styles.rowsPillsGrid}>
                    {section.rows.map((row) => {
                      const isSelected = selectedRows.includes(row.id);
                      const previewChars = row.items.map((it) => it.hira).join(' ');
                      return (
                        <div
                          key={row.id}
                          style={{
                            ...styles.rowCheckPill,
                            ...(isSelected ? styles.rowCheckPillActive : {}),
                          }}
                          onClick={() => toggleRow(row.id)}
                        >
                          <span style={styles.rowCheckbox}>{isSelected ? '✓' : ''}</span>
                          <div>
                            <div style={styles.rowCheckName}>{row.name}</div>
                            <div style={styles.rowCheckPreview}>{previewChars}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Action Button */}
          <div style={styles.startActionRow}>
            <button
              type="button"
              style={{
                ...styles.startQuizLargeBtn,
                ...(totalSelectedChars === 0 ? styles.startQuizBtnDisabled : {}),
              }}
              onClick={() => startQuiz()}
              disabled={totalSelectedChars === 0}
            >
              🚀 Bắt Đầu Kiểm Tra ({totalSelectedChars} ký tự)
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: MÀN HÌNH LÀM BÀI QUIZ (ACTIVE RECALL QUIZ) */}
      {activeTab === 'quiz' && quizQuestions[currentIndex] && (
        <div style={styles.quizWrapper}>
          {/* Quiz Top Bar */}
          <div style={styles.quizHeaderRow}>
            <button
              type="button"
              style={styles.quizAbortBtn}
              onClick={() => setActiveTab('setup')}
            >
              ✕ Dừng bài kiểm tra
            </button>

            {/* Progress counter */}
            <div style={styles.quizProgressText}>
              Câu <strong>{currentIndex + 1}</strong> / {quizQuestions.length}
            </div>

            {/* Live Stats */}
            <div style={styles.quizLiveStats}>
              <span style={{ color: '#059669', fontWeight: '800' }}>✓ {stats.correct}</span>
              <span style={{ color: '#e11d48', fontWeight: '800' }}>✕ {stats.wrong}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Main Flashcard Center */}
          <div style={styles.quizCard}>
            <div style={styles.quizScriptBadge}>
              {quizQuestions[currentIndex].type === 'hiragana' ? '🌸 HIRAGANA' : '⚡ KATAKANA'} •{' '}
              {quizQuestions[currentIndex].rowName}
            </div>

            {/* Ký tự hiển thị to bản */}
            <div style={styles.bigCharacterDisplay}>
              {quizQuestions[currentIndex].character}
            </div>

            {/* Nút nghe phát âm */}
            <button
              type="button"
              style={styles.quizSpeakerBtn}
              onClick={() => speakKana(quizQuestions[currentIndex].character)}
              title="Nghe phát âm"
            >
              🔊 Nghe âm thanh
            </button>

            {/* CHẾ ĐỘ 1: GÕ PHÍM (SPEED TYPING - TOFUGU STYLE) */}
            {quizMode === 'typing' && (
              <div style={styles.typingInputWrap}>
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Gõ Romaji vào đây (vd: a, ka, shi)..."
                  value={typedInput}
                  onChange={handleTypingChange}
                  onKeyDown={handleTypingKeyDown}
                  className={isInputShaking ? 'shake-animation' : ''}
                  style={{
                    ...styles.typingInput,
                    borderColor: isInputShaking ? '#f43f5e' : '#cbd5e0',
                    backgroundColor: isInputShaking ? '#fff1f2' : '#ffffff',
                  }}
                />

                <div style={styles.typingHelperRow}>
                  <button
                    type="button"
                    style={styles.skipBtn}
                    onClick={() => handleWrongAnswer(quizQuestions[currentIndex], true)}
                  >
                    ❓ Không nhớ / Xem đáp án
                  </button>
                  <span style={{ fontSize: '0.78rem', color: '#a0aec0' }}>
                    💡 Tự động chuyển câu khi gõ đúng
                  </span>
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ 2: TRẮC NGHIỆM 4 ĐÁP ÁN (MULTIPLE CHOICE) */}
            {quizMode === 'choice' && (
              <div style={styles.choiceGrid}>
                {choiceOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={styles.choiceBtn}
                    onClick={() => handleSelectChoice(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Answer Feedback Banner */}
            {showAnswerFeedback && (
              <div
                style={{
                  ...styles.feedbackBanner,
                  backgroundColor: showAnswerFeedback.correct ? '#ecfdf5' : '#fff1f2',
                  color: showAnswerFeedback.correct ? '#065f46' : '#9f1239',
                  border: `1.5px solid ${showAnswerFeedback.correct ? '#a7f3d0' : '#fecdd3'}`,
                }}
              >
                {showAnswerFeedback.correct ? '✓ ' : '✕ '}
                {showAnswerFeedback.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BÁO CÁO KẾT QUẢ & ÔN TẬP CHỮ YẾU (RESULTS) */}
      {activeTab === 'results' && (
        <div style={styles.cardBox}>
          <div style={styles.resultsCenterHeader}>
            <span style={{ fontSize: '3.5rem' }}>
              {stats.wrong === 0 ? '🎉' : stats.correct > stats.wrong ? '🌸' : '💪'}
            </span>
            <h2 style={styles.resultsTitle}>
              {stats.wrong === 0
                ? 'Tuyệt Vời! Độ Chính Xác 100%'
                : stats.correct > stats.wrong
                ? 'Làm Rất Tốt! Hãy Tiếp Tục Phát Huy'
                : 'Cần Luyện Tập Thêm!'}
            </h2>
            <p style={{ color: '#718096', fontSize: '0.95rem' }}>
              Hoàn thành bài kiểm tra {quizQuestions.length} ký tự
            </p>
          </div>

          {/* Stats Badges Grid */}
          <div style={styles.resultsStatsRow}>
            <div style={styles.resultStatBox}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669' }}>
                {stats.correct}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                Câu trả lời đúng
              </div>
            </div>

            <div style={styles.resultStatBox}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#e11d48' }}>
                {stats.wrong}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                Số lần sai / Bỏ qua
              </div>
            </div>

            <div style={styles.resultStatBox}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#db2777' }}>
                {Math.round((stats.correct / Math.max(1, stats.correct + stats.wrong)) * 100)}%
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                Độ chính xác
              </div>
            </div>
          </div>

          {/* Danh sách các chữ hay bị sai (Trouble / Weak Kana) */}
          {stats.troubleItems.length > 0 && (
            <div style={styles.troubleSection}>
              <h4 style={styles.troubleSectionTitle}>
                ⚠️ Các chữ cái bạn cần ôn thêm ({stats.troubleItems.length} chữ):
              </h4>
              <div style={styles.troubleChipsWrap}>
                {stats.troubleItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={styles.troubleChip}
                    onClick={() => speakKana(item.character)}
                    title={`Bấm để nghe phát âm: ${item.romaji}`}
                  >
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                      {item.character}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: '700' }}>
                      {item.romaji}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      ({item.count} lần sai)
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  type="button"
                  style={styles.retryTroubleBtn}
                  onClick={retryTroubleKana}
                >
                  ⚡ Ôn lại ngay các chữ bị sai này
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={styles.resultsActionsRow}>
            <button
              type="button"
              style={styles.primaryActionBtn}
              onClick={() => startQuiz()}
            >
              🔁 Làm lại bài này
            </button>
            <button
              type="button"
              style={styles.secondaryActionBtn}
              onClick={() => setActiveTab('setup')}
            >
              ⚙️ Cấu hình bộ chữ khác
            </button>
            <button
              type="button"
              style={styles.secondaryActionBtn}
              onClick={() => setActiveTab('chart')}
            >
              📖 Xem lại Bảng Chữ Cái
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '16px 16px 80px',
    position: 'relative',
    zIndex: 1,
  },
  topBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: '8px 18px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.88rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
  },
  headerTitleWrap: {
    marginTop: '4px',
  },
  pageTitle: {
    fontSize: '1.85rem',
    fontWeight: '800',
    color: '#2d3748',
    margin: '0',
    letterSpacing: '-0.3px',
  },
  badgeEdTech: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: '#fdf2f8',
    color: '#db2777',
    border: '1px solid #fbcfe8',
  },
  pageSubTitle: {
    fontSize: '0.95rem',
    color: '#718096',
    display: 'block',
    marginTop: '4px',
  },
  tabNavRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  navTabBtn: {
    padding: '10px 22px',
    backgroundColor: '#ffffff',
    color: '#4a5568',
    border: '1.5px solid #e2e8f0',
    borderRadius: '18px',
    fontSize: '0.94rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  navTabBtnActive: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    borderColor: '#e91e8c',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
  },
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)',
    border: '1.5px solid #fce7f3',
  },
  chartControlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '18px',
    marginBottom: '20px',
    borderBottom: '1px solid #f8e7ee',
    flexWrap: 'wrap',
    gap: '12px',
  },
  scriptToggleWrap: {
    display: 'flex',
    backgroundColor: '#f8fafc',
    padding: '4px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    gap: '4px',
  },
  scriptBtn: {
    padding: '8px 18px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  scriptBtnActive: {
    backgroundColor: '#ffffff',
    color: '#e91e8c',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  actionLaunchQuizBtn: {
    padding: '10px 22px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.92rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(233, 30, 140, 0.25)',
    transition: 'all 0.2s ease',
  },
  chartSection: {
    marginBottom: '32px',
  },
  sectionHeader: {
    marginBottom: '14px',
  },
  sectionTitle: {
    margin: '0',
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionDesc: {
    fontSize: '0.85rem',
    color: '#64748b',
  },
  chartRowsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  chartRowCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  rowTitleLabel: {
    fontSize: '0.82rem',
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  kanaGridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
    gap: '10px',
  },
  kanaCell: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1.5px solid #f1f5f9',
    padding: '10px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  kanaCharacter: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: '1.2',
  },
  kanaRomaji: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#db2777',
    marginTop: '2px',
  },
  speakerIcon: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    fontSize: '0.65rem',
    opacity: 0.4,
  },
  setupHeader: {
    marginBottom: '20px',
    borderBottom: '1px solid #f8e7ee',
    paddingBottom: '16px',
  },
  setupBlock: {
    marginBottom: '22px',
  },
  setupBlockLabel: {
    display: 'block',
    fontSize: '0.94rem',
    fontWeight: '800',
    color: '#334155',
    marginBottom: '10px',
  },
  pillGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  pillOption: {
    padding: '10px 20px',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #cbd5e0',
    borderRadius: '16px',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pillOptionActive: {
    backgroundColor: '#fff0f6',
    borderColor: '#e91e8c',
    color: '#e91e8c',
    boxShadow: '0 2px 8px rgba(233, 30, 140, 0.15)',
  },
  rowSelectorToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  quickSelectBtn: {
    padding: '4px 12px',
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e0',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  rowChecklistContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '16px',
    border: '1px solid #e2e8f0',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  sectionDividerTitle: {
    fontSize: '0.84rem',
    fontWeight: '800',
    color: '#64748b',
    marginBottom: '8px',
  },
  rowsPillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '8px',
  },
  rowCheckPill: {
    backgroundColor: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  },
  rowCheckPillActive: {
    borderColor: '#e91e8c',
    backgroundColor: '#fff0f6',
  },
  rowCheckbox: {
    width: '18px',
    height: '18px',
    borderRadius: '6px',
    border: '1.5px solid #cbd5e0',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '900',
    color: '#e91e8c',
  },
  rowCheckName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  rowCheckPreview: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  startActionRow: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #f8e7ee',
  },
  startQuizLargeBtn: {
    padding: '14px 44px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 50%, #f43f5e 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '1.05rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(233, 30, 140, 0.35)',
    transition: 'all 0.2s ease',
  },
  startQuizBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  quizWrapper: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  quizHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  quizAbortBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e0',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#64748b',
    cursor: 'pointer',
  },
  quizProgressText: {
    fontSize: '0.92rem',
    color: '#475569',
  },
  quizLiveStats: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.92rem',
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '9999px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)',
    transition: 'width 0.25s ease',
  },
  quizCard: {
    backgroundColor: '#ffffff',
    borderRadius: '28px',
    padding: '36px 24px',
    textAlign: 'center',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  quizScriptBadge: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#db2777',
    backgroundColor: '#fdf2f8',
    padding: '4px 12px',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  bigCharacterDisplay: {
    fontSize: '6.5rem',
    fontWeight: '900',
    color: '#1e293b',
    lineHeight: '1.1',
    margin: '10px 0',
    userSelect: 'none',
  },
  quizSpeakerBtn: {
    backgroundColor: '#fff0f6',
    border: '1px solid #fce7f3',
    color: '#e91e8c',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '28px',
  },
  typingInputWrap: {
    width: '100%',
    maxWidth: '380px',
  },
  typingInput: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.35rem',
    fontWeight: '800',
    textAlign: 'center',
    borderRadius: '20px',
    border: '2px solid #cbd5e0',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  typingHelperRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: '#e11d48',
    fontWeight: '700',
    fontSize: '0.82rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  choiceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    width: '100%',
    maxWidth: '400px',
  },
  choiceBtn: {
    padding: '16px',
    fontSize: '1.25rem',
    fontWeight: '800',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  feedbackBanner: {
    marginTop: '20px',
    padding: '10px 20px',
    borderRadius: '16px',
    fontSize: '0.92rem',
    fontWeight: '700',
    animation: 'sakuraFadeOnly 0.2s ease',
  },
  resultsCenterHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  resultsTitle: {
    fontSize: '1.65rem',
    fontWeight: '900',
    color: '#1e293b',
    margin: '12px 0 4px',
  },
  resultsStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  resultStatBox: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '18px',
    textAlign: 'center',
    border: '1.5px solid #e2e8f0',
  },
  troubleSection: {
    backgroundColor: '#fff1f2',
    borderRadius: '20px',
    padding: '20px',
    border: '1.5px solid #fecdd3',
    marginBottom: '28px',
  },
  troubleSectionTitle: {
    margin: '0 0 12px',
    fontSize: '1rem',
    fontWeight: '800',
    color: '#9f1239',
  },
  troubleChipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  troubleChip: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1.5px solid #fecdd3',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  retryTroubleBtn: {
    padding: '10px 26px',
    backgroundColor: '#e11d48',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
  },
  resultsActionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryActionBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontWeight: '800',
    fontSize: '0.94rem',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
  },
  secondaryActionBtn: {
    padding: '12px 22px',
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1.5px solid #cbd5e0',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.94rem',
    cursor: 'pointer',
  },
};
