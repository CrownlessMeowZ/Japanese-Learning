import React from 'react';

/**
 * Component FuriganaText
 * Hỗ trợ 2 chế độ:
 * 1. Truyền kanji & kana riêng biệt: <FuriganaText kanji="日本語" kana="にほんご" />
 * 2. Truyền chuỗi chứa markup furigana: <FuriganaText text="私[わたし]は学生[がくせい]です。" />
 */
export const FuriganaText = React.memo(({ kanji, kana, text, className = '' }) => {
  // Mode 1: Parse từ chuỗi markup text dạng "漢字[かんじ]"
  const rawText = text || (typeof kanji === 'string' && kanji.includes('[') ? kanji : null);
  if (rawText) {
    const tokens = [];
    const pattern = /([一-龠々〆ヶ]+)\[([ぁ-んァ-ヶ]+)\]|([^[\\]]+)/g;
    let match;

    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[2]) {
        tokens.push({ kanji: match[1], furigana: match[2], isRuby: true });
      } else if (match[3]) {
        tokens.push({ text: match[3], isRuby: false });
      }
    }

    return (
      <span className={`furigana-line ${className}`} style={{ lineHeight: '1.8' }}>
        {tokens.map((token, idx) =>
          token.isRuby ? (
            <ruby key={idx} className="ruby-wrapper" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.15', margin: '0 1px' }}>
              <span className="ruby-base">{token.kanji}</span>
              <rt style={{ fontSize: '0.6em', color: '#e91e8c', fontWeight: 'bold' }}>{token.furigana}</rt>
            </ruby>
          ) : (
            <span key={idx}>{token.text}</span>
          )
        )}
      </span>
    );
  }

  // Mode 2: Truyền kanji và kana độc lập
  if (!kanji || kanji === kana) {
    return <span className={`ruby-base ${className}`}>{kana || kanji}</span>;
  }

  return (
    <ruby className={`ruby-wrapper ${className}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.15', margin: '0 1px' }}>
      <span className="ruby-base">{kanji}</span>
      <rt style={{ fontSize: '0.6em', color: '#e91e8c', fontWeight: 'bold' }}>{kana}</rt>
    </ruby>
  );
});

FuriganaText.displayName = 'FuriganaText';
