import React from 'react';

const katakanaToHiragana = (str) =>
  str.replace(/[\u30a1-\u30f6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const KANJI_CHUNK_REGEX = /[一-龠々〆ヶ0-9０-９A-Za-z]+|[^一-龠々〆ヶ0-9０-９A-Za-z]+/g;
const IS_KANJI_OR_ALNUM = /[一-龠々〆ヶ0-9０-９A-Za-z]/;

/**
 * Gióng hàng tự động chuỗi Kanji và Kana để chỉ đặt <ruby><rt> phía trên đúng phần Hán tự,
 * giữ nguyên okurigana / trợ từ / dấu câu giúp xuống dòng tự nhiên trên mọi màn hình.
 * Trả về null nếu không thể gióng neo chính xác (tự động fallback về ruby nguyên cụm).
 */
const alignKanjiWithKana = (kanjiStr, kanaStr) => {
  const parts = kanjiStr.match(KANJI_CHUNK_REGEX);
  if (!parts || parts.length <= 1) return null;

  const cleanKana = katakanaToHiragana(kanaStr).replace(/\s+/g, '');
  if (!cleanKana) return null;

  let regexStr = '^';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (IS_KANJI_OR_ALNUM.test(part)) {
      regexStr += i === parts.length - 1 ? '(.+)' : '(.+?)';
    } else {
      const anchor = katakanaToHiragana(part.replace(/\s+/g, ''));
      regexStr += escapeRegExp(anchor);
    }
  }
  regexStr += '$';

  const match = cleanKana.match(new RegExp(regexStr));
  if (!match) return null;

  const tokens = [];
  let groupIdx = 1;
  for (const part of parts) {
    if (IS_KANJI_OR_ALNUM.test(part)) {
      tokens.push({ kanji: part, furigana: match[groupIdx++], isRuby: true });
    } else {
      tokens.push({ text: part, isRuby: false });
    }
  }
  return tokens;
};

const RUBY_STYLE = { rubyPosition: 'over', margin: '0 1px' };
const RT_STYLE = { fontSize: '0.58em', color: '#e91e8c', fontWeight: '700', lineHeight: '1.1' };

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
    const pattern = /([一-龠々〆ヶ]+)\[([ぁ-んァ-ヶー]+)\]|([^[\]]+)/g;
    let match;

    while ((match = pattern.exec(rawText)) !== null) {
      if (match[1] && match[2]) {
        tokens.push({ kanji: match[1], furigana: match[2], isRuby: true });
      } else if (match[3]) {
        tokens.push({ text: match[3], isRuby: false });
      }
    }

    return (
      <span lang="ja" className={`furigana-line ${className}`} style={{ lineHeight: '1.9' }}>
        {tokens.map((token, idx) =>
          token.isRuby ? (
            <ruby key={idx} className="ruby-wrapper" style={RUBY_STYLE}>
              <span className="ruby-base">{token.kanji}</span>
              <rt style={RT_STYLE}>{token.furigana}</rt>
            </ruby>
          ) : (
            <span key={idx}>{token.text}</span>
          )
        )}
      </span>
    );
  }

  // Mode 2: Truyền kanji và kana độc lập
  if (!kanji || !kana || kanji === kana) {
    return (
      <span lang="ja" className={`ruby-base ${className}`}>
        {kanji || kana}
      </span>
    );
  }

  const alignedTokens = alignKanjiWithKana(kanji, kana);
  if (alignedTokens) {
    return (
      <span lang="ja" className={`furigana-line ${className}`} style={{ lineHeight: '1.9' }}>
        {alignedTokens.map((token, idx) =>
          token.isRuby ? (
            <ruby key={idx} className="ruby-wrapper" style={RUBY_STYLE}>
              <span className="ruby-base">{token.kanji}</span>
              <rt style={RT_STYLE}>{token.furigana}</rt>
            </ruby>
          ) : (
            <span key={idx}>{token.text}</span>
          )
        )}
      </span>
    );
  }

  return (
    <ruby lang="ja" className={`ruby-wrapper ${className}`} style={RUBY_STYLE}>
      <span className="ruby-base">{kanji}</span>
      <rt style={RT_STYLE}>{kana}</rt>
    </ruby>
  );
});

FuriganaText.displayName = 'FuriganaText';
