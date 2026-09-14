import React, { useState } from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useProgress } from '../../hooks/useProgress';
import { FuriganaText } from '../FuriganaText';

/**
 * Flashcard Component
 * Thẻ học từ vựng 3D Flip (transform: rotateY(180deg) & preserve-3d)
 * Tích hợp Spaced Repetition (SM-2): [ ❌ Chưa thuộc ] (quality=1) & [ ✅ Đã nhớ ] (quality=4)
 */
export const Flashcard = ({
  item,
  onNext,
  _onPrev,
  currentIndex = 0,
  totalCount = 0,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [prevId, setPrevId] = useState(item?.id);
  const { reviewItem } = useProgress();

  const soundTarget = item?.hiragana || item?.kanji || item?.audio_url || '';
  const { isPlaying, playAudio, stopAudio } = useAudioPlayer(soundTarget);

  // Tự động lật về mặt trước khi đổi sang từ vựng mới (không dùng effect gây cascading render)
  if (item?.id !== prevId) {
    setPrevId(item?.id);
    setIsFlipped(false);
  }

  if (!item) return null;

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleSpeakerClick = (e) => {
    e.stopPropagation();
    playAudio(soundTarget);
  };

  // Đánh giá SM-2 và chuyển sang thẻ tiếp theo
  const handleReview = (e, quality) => {
    e.stopPropagation();
    stopAudio();

    if (item?.id) {
      reviewItem(item.id, 'vocab', quality);
    }

    // Lật lại mặt trước rồi chuyển thẻ
    setIsFlipped(false);
    if (onNext) {
      setTimeout(() => {
        onNext();
      }, 150);
    }
  };

  const displayKanji = item.kanji || item.hiragana;
  const hasKanji = Boolean(item.kanji && item.kanji !== item.hiragana);

  return (
    <div style={styles.scene}>
      <div
        style={{
          ...styles.cardInner,
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={handleCardClick}
      >
        {/* ========================================================= */}
        {/* MẶT TRƯỚC (Front Face): Kanji to rõ + Nút Loa             */}
        {/* ========================================================= */}
        <div style={styles.cardFaceFront}>
          {/* Top Bar: Counter & Speaker */}
          <div style={styles.cardHeader}>
            <span style={styles.counterBadge}>
              {currentIndex + 1} / {totalCount}
            </span>

            <button
              onClick={handleSpeakerClick}
              title={isPlaying ? 'Đang phát...' : 'Nghe phát âm'}
              style={{
                ...styles.speakerBtn,
                ...(isPlaying ? styles.speakerBtnActive : {}),
              }}
            >
              {isPlaying ? '⏸' : '🔊'}
            </button>
          </div>

          {/* Center: Main Word */}
          <div style={styles.centerContent}>
            <div style={styles.kanjiText}>
              {displayKanji}
            </div>
            {hasKanji && (
              <div style={styles.subHiragana}>
                {item.hiragana}
              </div>
            )}
          </div>

          {/* Bottom Hint */}
          <div style={styles.cardFooterHint}>
            💡 Nhấn vào thẻ để lật xem nghĩa
          </div>
        </div>

        {/* ========================================================= */}
        {/* MẶT SAU (Back Face): Furigana, Nghĩa tiếng Việt & 2 Nút SM-2 */}
        {/* ========================================================= */}
        <div style={styles.cardFaceBack}>
          {/* Top Bar */}
          <div style={styles.cardHeader}>
            <span style={styles.categoryBadge}>
              {item.sectionTitle || item.category || 'Từ vựng'}
            </span>

            <button
              onClick={handleSpeakerClick}
              title="Nghe lại phát âm"
              style={{
                ...styles.speakerBtn,
                ...(isPlaying ? styles.speakerBtnActive : {}),
              }}
            >
              {isPlaying ? '⏸' : '🔊'}
            </button>
          </div>

          {/* Center: Furigana + Vietnamese Meaning */}
          <div style={styles.centerContent}>
            <div style={styles.furiganaWrapper}>
              <FuriganaText kanji={item.kanji} kana={item.hiragana} />
            </div>

            <div style={styles.meaningText}>
              {item.meaning}
            </div>
          </div>

          {/* Bottom Action: 2 Nút Đánh Giá SM-2 */}
          <div style={styles.actionRow}>
            <button
              style={styles.btnFail}
              onClick={(e) => handleReview(e, 1)}
              title="Chưa nhớ - Ôn lại vào ngày mai"
            >
              ❌ Chưa thuộc
            </button>

            <button
              style={styles.btnPass}
              onClick={(e) => handleReview(e, 4)}
              title="Đã nhớ - Tăng khoảng cách ôn tập SM-2"
            >
              ✅ Đã nhớ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  scene: {
    width: '100%',
    maxWidth: '460px',
    height: '310px',
    margin: '0 auto',
    perspective: '1000px',
  },
  cardInner: {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  cardFaceFront: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px 24px 18px',
    boxShadow: '0 12px 32px rgba(233, 30, 140, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '2px solid #fce7f3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardFaceBack: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    backgroundColor: '#fffbfc',
    borderRadius: '24px',
    padding: '24px 24px 18px',
    boxShadow: '0 12px 32px rgba(233, 30, 140, 0.16), 0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '2px solid #f8bbd0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterBadge: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#a0aec0',
    backgroundColor: '#f7fafc',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  categoryBadge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#e91e8c',
    backgroundColor: '#fff0f6',
    padding: '4px 12px',
    borderRadius: '12px',
    maxWidth: '280px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  speakerBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1.5px solid #fce7f3',
    backgroundColor: '#ffffff',
    fontSize: '1.15rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  speakerBtnActive: {
    backgroundColor: '#e91e8c',
    color: '#ffffff',
    borderColor: '#e91e8c',
    boxShadow: '0 0 14px rgba(233, 30, 140, 0.5)',
  },
  centerContent: {
    textAlign: 'center',
    margin: 'auto 0',
  },
  kanjiText: {
    fontSize: '3.4rem',
    fontWeight: '800',
    color: '#2d3748',
    letterSpacing: '2px',
  },
  subHiragana: {
    fontSize: '1.2rem',
    color: '#718096',
    marginTop: '6px',
    fontWeight: '500',
  },
  furiganaWrapper: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '8px',
  },
  meaningText: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#e91e8c',
    marginTop: '6px',
    lineHeight: '1.4',
  },
  cardFooterHint: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#a0aec0',
    fontWeight: '500',
  },
  actionRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginTop: '8px',
  },
  btnFail: {
    padding: '11px 16px',
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    border: '1.5px solid #feb2b2',
    borderRadius: '14px',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  btnPass: {
    padding: '11px 16px',
    backgroundColor: '#f0fff4',
    color: '#2f855a',
    border: '1.5px solid #9ae6b4',
    borderRadius: '14px',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
};
