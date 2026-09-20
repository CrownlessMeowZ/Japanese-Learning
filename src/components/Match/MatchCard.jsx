import React from 'react';
import { FuriganaText } from '../FuriganaText';

/**
 * MatchCard Component - Thẻ từ vựng tương tác trong Minigame Sakura Match
 * 
 * Props:
 * - card: { id, pairId, type: 'jp' | 'vi', text, kanji, kana, meaning, audio_url }
 * - isSelected: boolean
 * - isMatched: boolean
 * - isMismatch: boolean
 * - onClick: (card) => void
 * - onPlayAudio?: (sound) => void
 */
export const MatchCard = React.memo(({
  card,
  isSelected,
  isMatched,
  isMismatch,
  onClick,
  onPlayAudio,
}) => {
  const isJp = card.type === 'jp';

  const handleClick = () => {
    if (isMatched) return;
    onClick(card);
    if (isJp && onPlayAudio) {
      onPlayAudio(card.audio_url || card.kana || card.kanji || card.text);
    }
  };

  const cardClasses = [
    'match-card',
    isJp ? 'match-card-jp' : 'match-card-vi',
    isSelected ? 'selected' : '',
    isMatched ? 'matched' : '',
    isMismatch ? 'mismatch' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role="button"
      tabIndex={isMatched ? -1 : 0}
      aria-label={card.text}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Huy hiệu ngôn ngữ */}
      <span className="match-card-lang-tag">
        {isJp ? '🇯🇵 Tiếng Nhật' : '🇻🇳 Nghĩa Việt'}
      </span>

      {/* Nội dung chính của thẻ */}
      <div className="match-card-text">
        {isJp ? (
          <FuriganaText
            kanji={card.kanji || card.text}
            kana={card.kana || card.hiragana}
          />
        ) : (
          <span>{card.text}</span>
        )}
      </div>

      {/* Biểu tượng trạng thái nhỏ khi ghép đúng */}
      {isMatched && (
        <span style={{ position: 'absolute', bottom: '6px', fontSize: '0.85rem' }}>
          ✓
        </span>
      )}
    </div>
  );
});

MatchCard.displayName = 'MatchCard';
