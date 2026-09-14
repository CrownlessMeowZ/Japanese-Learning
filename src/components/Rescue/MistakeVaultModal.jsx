import React, { useState, useMemo, useCallback } from 'react';
import { findDictionaryItem } from '../../store/progressStore';

/**
 * MistakeVaultModal - Sổ Tay Điểm Yếu & Hộp Cứu Hộ Luyện Tập
 * Tự động gom các từ vựng/ngữ pháp hay làm sai, cung cấp chế độ ôn tập cứu hộ cấp tốc
 */
export const MistakeVaultModal = ({
  isOpen,
  onClose,
  mistakeVault = {},
  onRescueSuccess,
  onRescueFail,
  onClearMistake,
  onClearAll,
}) => {
  const [activeMode, setActiveMode] = useState('list'); // 'list' | 'practice'
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [recentGraduatedText, setRecentGraduatedText] = useState(null);

  // Chuyển đối tượng mistakeVault thành mảng và sắp xếp theo số lần sai giảm dần
  const mistakeList = useMemo(() => {
    return Object.values(mistakeVault || {})
      .map((item) => {
        if (!item) return item;
        // Defensive: nếu text trùng với id hoặc là mã ID (vd: L1_48), tự tra cứu từ điển để khôi phục chữ Kanji/Hiragana
        if (item.text === item.id || /^L\d+_\d+$/i.test(item.text) || !item.meaning) {
          const match = findDictionaryItem(item.id) || (item.text ? findDictionaryItem(item.text) : null);
          if (match) {
            return {
              ...item,
              text: match.kanji || match.hiragana || match.text || item.text,
              reading: item.reading || match.hiragana || '',
              meaning: item.meaning || match.meaning || match.titleVi || '',
              lessonId: item.lessonId || match.lessonId || 1,
              type: item.type || match.type || 'vocab',
            };
          }
        }
        return item;
      })
      .sort((a, b) => b.wrongCount - a.wrongCount);
  }, [mistakeVault]);

  // Phát âm chữ cái tiếng Nhật bằng Web Speech API
  const speakWord = useCallback((text) => {
    if (!text || !('speechSynthesis' in window)) return;
    // Không đọc mã ID như L1_48
    if (/^L\d+_\d+$/i.test(text)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Bắt đầu chế độ luyện tập cứu hộ
  const startPractice = () => {
    if (mistakeList.length === 0) return;
    setPracticeIndex(0);
    setIsFlipped(false);
    setRecentGraduatedText(null);
    setActiveMode('practice');
  };

  const currentItem = mistakeList[practiceIndex];

  // Xử lý khi người dùng chọn "Đã thuộc (+1)" trong phiên cứu hộ
  const handlePassItem = () => {
    if (!currentItem) return;

    speakWord(currentItem.text);
    const isGraduated = onRescueSuccess ? onRescueSuccess(currentItem.id) : false;

    if (isGraduated) {
      setRecentGraduatedText(currentItem.text);
    }

    setTimeout(() => {
      setRecentGraduatedText(null);
      setIsFlipped(false);
      if (practiceIndex + 1 < mistakeList.length) {
        setPracticeIndex((prev) => prev + 1);
      } else {
        setActiveMode('list');
      }
    }, isGraduated ? 800 : 350);
  };

  // Xử lý khi người dùng chọn "Chưa nhớ" trong phiên cứu hộ
  const handleFailItem = () => {
    if (!currentItem) return;

    if (onRescueFail) {
      onRescueFail(currentItem);
    }

    setIsFlipped(false);
    if (practiceIndex + 1 < mistakeList.length) {
      setPracticeIndex((prev) => prev + 1);
    } else {
      setActiveMode('list');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div style={styles.topHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 style={styles.modalTitle}>⚠️ Hộp Cứu Hộ Điểm Yếu</h2>
            <span style={styles.badgeCount}>
              {mistakeList.length} mục cần cứu hộ
            </span>
          </div>

          <button
            type="button"
            style={styles.closeBtn}
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>

        {/* ========================================================= */}
        {/* CHẾ ĐỘ 1: DANH SÁCH TẤT CẢ CÁC ĐIỂM YẾU (LIST MODE)       */}
        {/* ========================================================= */}
        {activeMode === 'list' && (
          <div>
            {mistakeList.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: '3.5rem' }}>🌸</span>
                <h3 style={styles.emptyTitle}>Vườn Tri Thức Trong Lành!</h3>
                <p style={styles.emptyDesc}>
                  Bạn hiện tại không có điểm yếu nào cần cứu hộ. Cứ tự tin học từ vựng và làm Quiz nhé!
                </p>
                <button
                  type="button"
                  style={styles.primaryActionBtn}
                  onClick={onClose}
                >
                  Tiếp tục bài học
                </button>
              </div>
            ) : (
              <div>
                {/* Thanh công cụ hành động */}
                <div style={styles.toolbarRow}>
                  <div style={styles.helperText}>
                    💡 Trả lời đúng <strong>2 lần liên tiếp</strong> để tốt nghiệp khỏi danh sách điểm yếu!
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      style={styles.primaryActionBtn}
                      onClick={startPractice}
                    >
                      ⚡ Bắt đầu phiên cứu hộ
                    </button>

                    {onClearAll && (
                      <button
                        type="button"
                        style={styles.clearAllBtn}
                        onClick={onClearAll}
                        title="Xóa tất cả các mục trong hộp cứu hộ"
                      >
                        ✕ Xóa hết
                      </button>
                    )}
                  </div>
                </div>

                {/* Danh sách các thẻ từ yếu */}
                <div style={styles.itemsListContainer}>
                  {mistakeList.map((item) => (
                    <div key={item.id} style={styles.itemCard}>
                      <div style={styles.itemMainInfo}>
                        <div style={styles.itemKanjiRow}>
                          <span style={styles.itemKanji}>{item.text}</span>
                          {item.reading && item.reading !== item.text && (
                            <span style={styles.itemReading}>
                              【{item.reading}】
                            </span>
                          )}
                          <button
                            type="button"
                            style={styles.miniSpeakerBtn}
                            onClick={() => speakWord(item.text)}
                            title="Nghe phát âm"
                          >
                            🔊
                          </button>
                        </div>

                        <div style={styles.itemMeaning}>
                          👉 {item.meaning}
                        </div>

                        <div style={styles.badgesRow}>
                          <span style={styles.wrongBadge}>
                            ❌ Sai {item.wrongCount} lần
                          </span>
                          <span style={styles.rescueBadge}>
                            🎯 Đã sửa đúng: {item.consecutiveCorrect || 0}/2
                          </span>
                          {item.lessonId && (
                            <span style={styles.lessonBadge}>
                              Bài {item.lessonId}
                            </span>
                          )}
                        </div>
                      </div>

                      {onClearMistake && (
                        <button
                          type="button"
                          style={styles.deleteItemBtn}
                          onClick={() => onClearMistake(item.id)}
                          title="Xóa mục này khỏi danh sách cứu hộ"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* CHẾ ĐỘ 2: PHIÊN LUYỆN TẬP CỨU HỘ CẤP TỐC (PRACTICE MODE)   */}
        {/* ========================================================= */}
        {activeMode === 'practice' && currentItem && (
          <div style={styles.practiceWrapper}>
            <div style={styles.practiceHeaderRow}>
              <button
                type="button"
                style={styles.abortPracticeBtn}
                onClick={() => setActiveMode('list')}
              >
                ⬅ Về danh sách
              </button>

              <span style={styles.practiceCounter}>
                Mục <strong>{practiceIndex + 1}</strong> / {mistakeList.length}
              </span>

              <span style={styles.wrongBadge}>
                Lỗi sai: {currentItem.wrongCount} lần
              </span>
            </div>

            {/* Thông báo chúc mừng khi vừa có từ tốt nghiệp */}
            {recentGraduatedText && (
              <div style={styles.graduatedBanner}>
                🎉 Xuất sắc! Từ <strong>"{recentGraduatedText}"</strong> đã tốt nghiệp khỏi danh sách điểm yếu!
              </div>
            )}

            {/* Flashcard Cứu Hộ */}
            <div
              style={styles.rescueCard}
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              <div style={styles.cardTypeLabel}>
                {currentItem.type === 'grammar' ? '📖 NGỮ PHÁP' : '🔤 TỪ VỰNG'} • BÀI {currentItem.lessonId}
              </div>

              {/* Chữ Kanji / Từ mục tiêu */}
              <div style={styles.bigCardWord}>{currentItem.text}</div>

              <button
                type="button"
                style={styles.cardSpeakerBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentItem.text);
                }}
                title="Nghe phát âm"
              >
                🔊 Nghe phát âm
              </button>

              {/* Khi lật mặt sau: Hiện nghĩa & Phiên âm */}
              {isFlipped ? (
                <div style={styles.revealedBox}>
                  {currentItem.reading && (
                    <div style={styles.revealedReading}>
                      【{currentItem.reading}】
                    </div>
                  )}
                  <div style={styles.revealedMeaning}>
                    {currentItem.meaning}
                  </div>
                </div>
              ) : (
                <div style={styles.flipHint}>
                  💡 Nhấp vào thẻ để kiểm tra đáp án
                </div>
              )}
            </div>

            {/* Các nút Đánh Giá Cứu Hộ */}
            <div style={styles.practiceActionsRow}>
              <button
                type="button"
                style={styles.failBtn}
                onClick={handleFailItem}
              >
                ❌ Vẫn chưa nhớ (0/2)
              </button>

              <button
                type="button"
                style={styles.passBtn}
                onClick={handlePassItem}
              >
                ✅ Đã nhớ (+1)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
    animation: 'sakuraFadeOnly 0.2s ease',
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    maxWidth: '680px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '24px',
    border: '1.5px solid #fce7f3',
    boxShadow: '0 20px 45px rgba(233, 30, 140, 0.18)',
    position: 'relative',
  },
  topHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #f8e7ee',
    marginBottom: '16px',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  badgeCount: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#e11d48',
    backgroundColor: '#fff1f2',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid #fecdd3',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
  },
  toolbarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  helperText: {
    fontSize: '0.84rem',
    color: '#475569',
  },
  primaryActionBtn: {
    padding: '8px 18px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontWeight: '800',
    fontSize: '0.86rem',
    cursor: 'pointer',
    boxShadow: '0 3px 10px rgba(233, 30, 140, 0.25)',
  },
  clearAllBtn: {
    padding: '8px 14px',
    backgroundColor: '#ffffff',
    color: '#64748b',
    border: '1px solid #cbd5e0',
    borderRadius: '14px',
    fontWeight: '700',
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  itemsListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '440px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    border: '1.5px solid #f1f5f9',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
    transition: 'all 0.2s ease',
  },
  itemMainInfo: {
    flex: 1,
  },
  itemKanjiRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  itemKanji: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#1e293b',
  },
  itemReading: {
    fontSize: '0.92rem',
    color: '#e91e8c',
    fontWeight: '700',
  },
  miniSpeakerBtn: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: '1px solid #fce7f3',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
  },
  itemMeaning: {
    fontSize: '0.9rem',
    color: '#475569',
    margin: '4px 0 8px',
  },
  badgesRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  wrongBadge: {
    fontSize: '0.74rem',
    fontWeight: '800',
    color: '#e11d48',
    backgroundColor: '#fff1f2',
    padding: '2px 8px',
    borderRadius: '8px',
    border: '1px solid #fecdd3',
  },
  rescueBadge: {
    fontSize: '0.74rem',
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#ecfdf5',
    padding: '2px 8px',
    borderRadius: '8px',
    border: '1px solid #a7f3d0',
  },
  lessonBadge: {
    fontSize: '0.74rem',
    fontWeight: '700',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    padding: '2px 8px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  deleteItemBtn: {
    background: 'none',
    border: 'none',
    color: '#cbd5e0',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '36px 16px',
  },
  emptyTitle: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '12px 0 6px',
  },
  emptyDesc: {
    fontSize: '0.92rem',
    color: '#64748b',
    maxWidth: '420px',
    margin: '0 auto 20px',
    lineHeight: '1.5',
  },
  practiceWrapper: {
    padding: '8px 0',
  },
  practiceHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  abortPracticeBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e0',
    borderRadius: '12px',
    padding: '5px 12px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#475569',
    cursor: 'pointer',
  },
  practiceCounter: {
    fontSize: '0.92rem',
    color: '#334155',
  },
  graduatedBanner: {
    backgroundColor: '#ecfdf5',
    border: '1.5px solid #a7f3d0',
    color: '#065f46',
    padding: '10px 16px',
    borderRadius: '14px',
    marginBottom: '14px',
    fontSize: '0.88rem',
    fontWeight: '700',
    textAlign: 'center',
    animation: 'sakuraFadeOnly 0.2s ease',
  },
  rescueCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px 20px',
    textAlign: 'center',
    border: '2px dashed #f8bbd0',
    boxShadow: '0 8px 24px rgba(233, 30, 140, 0.06)',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  cardTypeLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#db2777',
    backgroundColor: '#fdf2f8',
    padding: '3px 10px',
    borderRadius: '10px',
    display: 'inline-block',
    marginBottom: '12px',
  },
  bigCardWord: {
    fontSize: '3.2rem',
    fontWeight: '900',
    color: '#1e293b',
    margin: '8px 0',
  },
  cardSpeakerBtn: {
    backgroundColor: '#fff0f6',
    border: '1px solid #fce7f3',
    color: '#e91e8c',
    padding: '6px 14px',
    borderRadius: '14px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    margin: '6px 0 16px',
  },
  revealedBox: {
    backgroundColor: '#fdf2f8',
    borderRadius: '14px',
    padding: '14px',
    marginTop: '12px',
  },
  revealedReading: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#e91e8c',
  },
  revealedMeaning: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#1e293b',
    marginTop: '4px',
  },
  flipHint: {
    fontSize: '0.84rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  practiceActionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  failBtn: {
    padding: '12px',
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    border: '1.5px solid #fecdd3',
    borderRadius: '16px',
    fontSize: '0.94rem',
    fontWeight: '800',
    cursor: 'pointer',
  },
  passBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    fontSize: '0.94rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
  },
};
