import React, { useState, useMemo } from 'react';
import {
  romajiToHiragana,
  romajiToJapanese,
  isProbablyRomaji
} from '../../utils/romajiConverter';
import { searchLocalDictionary, getExactWordByRomaji, getFuzzySuggestions } from '../../utils/localDictionary';
import '../../styles/sakura.css';

/**
 * Translator Component - Module Từ Điển & Dịch Thuật Đa Năng
 * - Tích hợp Google Translate Unofficial API (dt=t&dt=rm&dt=qc&dt=qca) với multi-client fallback
 * - Tự động nhận diện và sửa lỗi chính tả ("Có phải bạn muốn tìm...") từ Google AI + Thuật toán Levenshtein cục bộ
 * - Tự động nhận diện và chuyển đổi Romaji chuẩn xác qua Dynamic Romaji Index từ kho > 1.150 từ vựng
 * - Tích hợp bộ Từ điển Nội bộ hoạt động 100% OFFLINE
 * - Hiển thị Cách đọc (Romaji/Phonetic) & Phát âm chuẩn Web Speech TTS
 */
export const Translator = ({ onBack }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('ja'); // 'ja' | 'vi'
  const [targetLang, setTargetLang] = useState('vi'); // 'vi' | 'ja'
  const [sourcePhonetic, setSourcePhonetic] = useState('');
  const [targetPhonetic, setTargetPhonetic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isOfflineResult, setIsOfflineResult] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [spellSuggestion, setSpellSuggestion] = useState(null); // Gợi ý chính tả "Có phải bạn muốn tìm..."

  // Mẫu câu gợi ý nhanh cho người học
  const samplePhrases = [
    { text: 'mannaka', from: 'ja', to: 'vi', label: 'mannaka (Ở giữa / Chính giữa)' },
    { text: 'biiru', from: 'ja', to: 'vi', label: 'biiru (Bia - Katakana)' },
    { text: 'biru', from: 'ja', to: 'vi', label: 'biru (Tòa nhà - Katakana)' },
    { text: 'watashi', from: 'ja', to: 'vi', label: 'watashi (Tôi - Romaji)' },
    { text: 'arigatou gozaimasu', from: 'ja', to: 'vi', label: 'arigatou gozaimasu (Cảm ơn)' },
    { text: 'Xin chào, bạn khỏe không?', from: 'vi', to: 'ja', label: 'Xin chào (VI ➔ JA)' },
  ];

  // Tra cứu tức thì từ điển 965 từ vựng nội bộ (hoạt động 100% Offline)
  const localDictResults = useMemo(() => {
    const trimmed = sourceText.trim();
    if (!trimmed || trimmed.length < 1) return [];
    return searchLocalDictionary(trimmed, 4);
  }, [sourceText]);

  // Nhận diện xem người dùng có đang gõ Romaji khi ô nguồn đang là 'vi' không
  const isRomajiMisplaced = useMemo(() => {
    if (sourceLang !== 'vi') return false;
    const trimmed = sourceText.trim();
    return isProbablyRomaji(trimmed);
  }, [sourceText, sourceLang]);

  /**
   * Gọi Dịch Thuật (Kết hợp Google AI + Offline Fallback)
   * @param {string|null} [overrideText=null] - Từ khóa ghi đè (vd khi bấm vào gợi ý sửa lỗi chính tả)
   */
  const handleTranslate = async (overrideText = null) => {
    const textToProcess = typeof overrideText === 'string' ? overrideText : sourceText;
    const trimmed = textToProcess.trim();
    if (!trimmed) {
      setTranslatedText('');
      setSourcePhonetic('');
      setTargetPhonetic('');
      setSpellSuggestion(null);
      setErrorMessage(null);
      setIsOfflineResult(false);
      return;
    }

    if (typeof overrideText === 'string') {
      setSourceText(overrideText);
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsOfflineResult(false);
    setSpellSuggestion(null);

    // Xử lý thông minh cho Romaji dựa trên Dynamic Romaji Index từ kho từ vựng
    let queryToSend = trimmed;
    let actualSourceLang = sourceLang;
    let actualTargetLang = targetLang;
    const isRomaji = isProbablyRomaji(trimmed);

    // Kiểm tra xem từ Romaji có khớp với từ nào trong kho từ vựng nội bộ không
    const exactLocalWord = isRomaji ? getExactWordByRomaji(trimmed) : null;

    if (sourceLang === 'ja' && isRomaji) {
      if (exactLocalWord) {
        // Tự động phân giải chính xác chữ Katakana/Hiragana tương ứng từ cơ sở dữ liệu
        queryToSend = exactLocalWord.hiragana || exactLocalWord.kanji;
      } else {
        queryToSend = romajiToJapanese(trimmed);
      }
      setSourcePhonetic(`${trimmed} (${queryToSend})`);
    } else if (sourceLang === 'vi' && isRomaji) {
      // Nếu đang chọn VI nhưng người dùng gõ Romaji tiếng Nhật:
      if (exactLocalWord) {
        queryToSend = exactLocalWord.hiragana || exactLocalWord.kanji;
      } else {
        queryToSend = romajiToJapanese(trimmed);
      }
      actualSourceLang = 'ja';
      actualTargetLang = 'vi';
      setSourcePhonetic(`${trimmed} (${queryToSend})`);
    }

    // 1. Nếu thiết bị đang Offline: Tra cứu trực tiếp từ điển nội bộ
    if (!navigator.onLine) {
      handleOfflineLookup(trimmed);
      setIsLoading(false);
      return;
    }

    // 2. Nếu Online: Gọi Google Translate với cơ chế Multi-client Fallback & Spellcheck
    const googleClients = ['dict-chrome-ex', 'at', 'gtx'];
    let data = null;
    let lastError = null;

    for (const client of googleClients) {
      try {
        const endpoint = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=${actualSourceLang}&tl=${actualTargetLang}&dt=t&dt=rm&dt=qc&dt=qca&q=${encodeURIComponent(
          queryToSend
        )}`;
        const response = await fetch(endpoint);
        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (!data) {
      console.warn('[Translator] All Google endpoints failed, falling back to local dictionary:', lastError);
      handleOfflineLookup(trimmed);
      setIsLoading(false);
      return;
    }

    try {
      let fullTranslatedText = '';
      let srcTranslit = '';
      let tgtTranslit = '';

      if (Array.isArray(data) && Array.isArray(data[0])) {
        for (const item of data[0]) {
          if (!Array.isArray(item)) continue;

          // Gộp tất cả các đoạn dịch văn bản
          if (typeof item[0] === 'string') {
            fullTranslatedText += item[0];
          }

          // Trích xuất cách đọc Romaji của bản dịch đích (item[2])
          if (typeof item[2] === 'string' && item[2].trim()) {
            tgtTranslit = item[2].trim();
          }

          // Trích xuất cách đọc của văn bản gốc (item[3])
          if (typeof item[3] === 'string' && item[3].trim()) {
            srcTranslit = item[3].trim();
          }
        }
      }

      setTranslatedText(fullTranslatedText);
      // Hiển thị cách đọc phiên âm chuẩn
      if (isRomaji) {
        setSourcePhonetic(`${trimmed} (${queryToSend})`);
      } else {
        setSourcePhonetic(srcTranslit);
      }
      setTargetPhonetic(tgtTranslit);
      setIsOfflineResult(false);

      // --- 3. Bóc tách Gợi Ý Sửa Lỗi Chính Tả ("Did you mean...?") ---
      let detectedSuggestion = null;

      // A. Kiểm tra phản hồi Spellcheck từ Google Translate (data[7])
      if (Array.isArray(data) && Array.isArray(data[7]) && data[7].length >= 2) {
        const gText = typeof data[7][1] === 'string' ? data[7][1].trim() : '';
        if (
          gText &&
          gText.toLowerCase() !== trimmed.toLowerCase() &&
          gText.toLowerCase() !== queryToSend.toLowerCase()
        ) {
          detectedSuggestion = {
            text: gText,
            display: gText,
            source: 'google'
          };
        }
      }

      // B. Nếu Google chưa có gợi ý hoặc từ là Romaji/tiếng Nhật bị sai chính tả:
      // Kiểm tra bộ Levenshtein Fuzzy Matcher từ kho từ vựng nội bộ (> 1.150 từ)
      if (!detectedSuggestion && (isRomaji || actualSourceLang === 'ja')) {
        const fuzzy = getFuzzySuggestions(trimmed, 1);
        if (fuzzy.length > 0 && fuzzy[0].dist <= 2) {
          const best = fuzzy[0];
          const suggestionText = best.text;
          if (suggestionText.toLowerCase() !== trimmed.toLowerCase()) {
            detectedSuggestion = {
              text: suggestionText,
              display: best.romaji && best.romaji !== best.hiragana
                ? `${best.romaji} (${best.kanji || best.hiragana}: ${best.meaning})`
                : `${best.kanji || best.hiragana} (${best.meaning})`,
              source: 'local'
            };
          }
        }
      }

      setSpellSuggestion(detectedSuggestion);
    } catch (err) {
      console.warn('[Translator] Parse error, falling back to local dictionary:', err);
      handleOfflineLookup(trimmed);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Tra cứu Offline từ cơ sở dữ liệu từ vựng nội bộ
   */
  const handleOfflineLookup = (query) => {
    const results = searchLocalDictionary(query, 1);
    if (results.length > 0) {
      const best = results[0];
      if (sourceLang === 'ja') {
        setTranslatedText(best.meaning);
        setSourcePhonetic(best.hiragana);
        setTargetPhonetic('');
      } else {
        setTranslatedText(`${best.kanji} (${best.hiragana})`);
        setTargetPhonetic(best.hiragana);
        setSourcePhonetic('');
      }
      setIsOfflineResult(true);
      setErrorMessage(null);
      setSpellSuggestion(null);
    } else {
      setIsOfflineResult(false);
      // Khi offline và không tìm thấy kết quả chính xác, thử tìm từ viết gần đúng nhất
      const fuzzy = getFuzzySuggestions(query, 1);
      if (fuzzy.length > 0 && fuzzy[0].dist <= 2) {
        const best = fuzzy[0];
        setSpellSuggestion({
          text: best.text,
          display: best.romaji && best.romaji !== best.hiragana
            ? `${best.romaji} (${best.kanji || best.hiragana}: ${best.meaning})`
            : `${best.kanji || best.hiragana} (${best.meaning})`,
          source: 'local'
        });
      }
      if (!navigator.onLine) {
        setErrorMessage(
          '📴 Bạn đang ngoại tuyến. Từ này chưa có trong bộ từ vựng có sẵn. Vui lòng kết nối internet để dịch bằng Google AI.'
        );
      } else {
        setErrorMessage('⚠️ Không thể kết nối đến máy chủ Google Dịch. Vui lòng thử lại sau.');
      }
    }
  };

  /**
   * Bấm áp dụng từ gợi ý sửa lỗi chính tả
   */
  const handleApplySuggestion = (suggestedText) => {
    setSourceText(suggestedText);
    setSpellSuggestion(null);
    handleTranslate(suggestedText);
  };

  /**
   * Đảo chiều ngôn ngữ dịch (JA ↔ VI)
   */
  const handleSwapLanguages = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);

    const nextSourceLang = targetLang;
    const nextTargetLang = sourceLang;

    setSourceLang(nextSourceLang);
    setTargetLang(nextTargetLang);

    const prevSourceText = sourceText;
    const prevTargetText = translatedText;
    const prevSourcePhonetic = sourcePhonetic;
    const prevTargetPhonetic = targetPhonetic;

    setSourceText(prevTargetText);
    setTranslatedText(prevSourceText);
    setSourcePhonetic(prevTargetPhonetic);
    setTargetPhonetic(prevSourcePhonetic);
    setSpellSuggestion(null);
    setErrorMessage(null);
    setIsOfflineResult(false);
  };

  /**
   * Phát âm văn bản bằng Web Speech API (hoạt động cả khi Offline)
   */
  const handleSpeak = (textToSpeak, langCode) => {
    if (!textToSpeak || !textToSpeak.trim()) return;

    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ phát âm Web Speech API.');
      return;
    }

    window.speechSynthesis.cancel();

    // Nếu văn bản tiếng Nhật đang là Romaji, đọc bằng Hiragana đã chuyển đổi để âm chuẩn
    let spokenText = textToSpeak;
    if (langCode === 'ja' && isProbablyRomaji(textToSpeak)) {
      spokenText = romajiToHiragana(textToSpeak);
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = langCode === 'ja' ? 'ja-JP' : 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Sao chép kết quả
   */
  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('[Translator] Copy error:', err);
    }
  };

  const getLangName = (code) => {
    return code === 'ja' ? '🇯🇵 Tiếng Nhật (Japanese)' : '🇻🇳 Tiếng Việt (Vietnamese)';
  };

  return (
    <div style={styles.container}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        {onBack && (
          <button type="button" style={styles.backBtn} onClick={onBack}>
            ⬅ Quay lại Dashboard
          </button>
        )}
        <div style={styles.headerTitleWrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={styles.pageTitle}>🔍 Từ Điển & Dịch Thuật Thông Minh</h1>
            <span style={styles.badgeOnlineOffline}>
              {navigator.onLine ? '🌐 Online + Google AI' : '📴 Offline Mode'}
            </span>
          </div>
          <span style={styles.pageSubTitle}>
            Dịch song ngữ Nhật - Việt • Tự động hiểu Romaji (vd: watashi) • Hiển thị Cách Đọc & Tra cứu Offline 965 từ
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div style={styles.mainCard}>
        {/* Language Selection Header */}
        <div style={styles.langSelectorRow}>
          <div style={styles.langBadge}>{getLangName(sourceLang)}</div>

          <button
            type="button"
            className={`translator-swap-btn ${isSwapping ? 'swapping' : ''}`}
            style={styles.swapBtn}
            onClick={handleSwapLanguages}
            title="Đảo chiều ngôn ngữ (JA ↔ VI)"
          >
            🔄 Đảo chiều (JA ↔ VI)
          </button>

          <div style={styles.langBadge}>{getLangName(targetLang)}</div>
        </div>

        {/* Gợi ý thông minh khi phát hiện người dùng gõ Romaji nhầm ô VI */}
        {isRomajiMisplaced && (
          <div style={styles.romajiNotice}>
            <span>💡 Phát hiện bạn đang gõ Romaji tiếng Nhật (<strong>{sourceText}</strong>).</span>
            <button
              type="button"
              style={styles.romajiNoticeBtn}
              onClick={() => {
                setSourceLang('ja');
                setTargetLang('vi');
              }}
            >
              Chuyển sang Tiếng Nhật ➔ Tiếng Việt
            </button>
          </div>
        )}

        {/* Dual Textarea Grid */}
        <div style={styles.grid}>
          {/* Ô Nhập Liệu (Source Box) */}
          <div style={styles.boxWrapper}>
            <div style={styles.boxHeader}>
              <span style={styles.boxHeaderLabel}>Văn bản gốc ({sourceLang.toUpperCase()})</span>
              {sourceText && (
                <button
                  type="button"
                  style={styles.clearBtn}
                  onClick={() => {
                    setSourceText('');
                    setTranslatedText('');
                    setSourcePhonetic('');
                    setTargetPhonetic('');
                    setSpellSuggestion(null);
                    setErrorMessage(null);
                    setIsOfflineResult(false);
                  }}
                  title="Xóa nội dung"
                >
                  ✕ Xóa
                </button>
              )}
            </div>

            <textarea
              style={styles.textarea}
              placeholder={
                sourceLang === 'ja'
                  ? 'Nhập tiếng Nhật: Kanji, Hiragana hoặc Romaji (vd: "watashi", "mannaka", "o namae wa")...'
                  : 'Nhập tiếng Việt hoặc từ khóa cần dịch...'
              }
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                if (spellSuggestion) setSpellSuggestion(null);
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
              rows={6}
            />

            {/* Hiển thị Cách Đọc của ô nguồn */}
            {sourcePhonetic && (
              <div className="phonetic-text" style={styles.phoneticText}>
                <span style={styles.phoneticLabel}>Cách đọc: </span>
                {sourcePhonetic}
              </div>
            )}

            {/* Gợi ý sửa lỗi chính tả phong cách Google Dịch ("Did you mean...?") */}
            {spellSuggestion && (
              <div className="sakura-spellcheck-banner" style={{ margin: '10px 0' }}>
                <span style={{ fontWeight: '600' }}>💡 Có phải bạn muốn tìm:</span>
                <button
                  type="button"
                  className="sakura-spellcheck-suggestion"
                  onClick={() => handleApplySuggestion(spellSuggestion.text)}
                  title="Bấm để tự động sửa và dịch từ này"
                >
                  👉 {spellSuggestion.display}
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={styles.boxFooter}>
              <button
                type="button"
                style={styles.iconActionBtn}
                onClick={() => handleSpeak(sourceText, sourceLang)}
                disabled={!sourceText.trim()}
                title="Phát âm văn bản gốc (TTS)"
              >
                🔊 Nghe phát âm
              </button>
              <span style={styles.charCount}>{sourceText.length} ký tự</span>
            </div>
          </div>

          {/* Ô Kết Quả (Target Box) */}
          <div style={{ ...styles.boxWrapper, backgroundColor: '#fffafc' }}>
            <div style={styles.boxHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.boxHeaderLabel}>Bản dịch ({targetLang.toUpperCase()})</span>
                {isOfflineResult && (
                  <span style={styles.offlineBadge}>⚡ Tra từ Offline</span>
                )}
              </div>
              {copySuccess && <span style={styles.copiedBadge}>✓ Đã sao chép!</span>}
            </div>

            <textarea
              style={{ ...styles.textarea, backgroundColor: '#fffafc', cursor: 'default' }}
              placeholder={isLoading ? 'Đang dịch văn bản...' : 'Kết quả dịch sẽ xuất hiện ở đây...'}
              value={translatedText}
              readOnly
              rows={6}
            />

            {/* Hiển thị Cách Đọc (Romaji) của bản dịch */}
            {targetPhonetic && (
              <div className="phonetic-text" style={styles.phoneticText}>
                <span style={styles.phoneticLabel}>Cách đọc: </span>
                {targetPhonetic}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={styles.boxFooter}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={styles.iconActionBtn}
                  onClick={() => handleSpeak(translatedText, targetLang)}
                  disabled={!translatedText.trim()}
                  title="Phát âm bản dịch (TTS)"
                >
                  🔊 Nghe bản dịch
                </button>
                <button
                  type="button"
                  style={styles.iconActionBtn}
                  onClick={() => handleCopy(translatedText)}
                  disabled={!translatedText.trim()}
                  title="Sao chép kết quả"
                >
                  📋 Sao chép
                </button>
              </div>
              {translatedText && <span style={styles.charCount}>{translatedText.length} ký tự</span>}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={styles.errorAlert}>
            <span>{errorMessage}</span>
            <button type="button" style={styles.retryBtn} onClick={handleTranslate}>
              Thử lại
            </button>
          </div>
        )}

        {/* Translate Action Button */}
        <div style={styles.actionRow}>
          <button
            type="button"
            style={styles.translateMainBtn}
            onClick={handleTranslate}
            disabled={isLoading || !sourceText.trim()}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.spinner} /> Đang dịch...
              </span>
            ) : (
              <span>✨ Dịch ngay (Ctrl + Enter)</span>
            )}
          </button>
        </div>

        {/* Kết quả Tra Cứu Nhanh từ Bộ Từ Điển Nội Bộ (Offline Dictionary Card) */}
        {localDictResults.length > 0 && (
          <div style={styles.localDictSection}>
            <div style={styles.localDictHeader}>
              <span>📚 Kết quả trong Từ điển Dekiru Nihongo ({localDictResults.length} từ khớp):</span>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
                ✓ Khả dụng Ngoại tuyến
              </span>
            </div>
            <div style={styles.localDictGrid}>
              {localDictResults.map((item, idx) => (
                <div key={item.id || idx} style={styles.localDictCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2d3748' }}>
                        {item.kanji} <span style={{ fontSize: '0.95rem', color: '#e91e8c', fontWeight: '600' }}>【{item.hiragana}】</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', color: '#4a5568', marginTop: '3px' }}>
                        👉 {item.meaning}
                      </div>
                    </div>
                    <button
                      type="button"
                      style={styles.miniSpeakerBtn}
                      onClick={() => handleSpeak(item.hiragana || item.kanji, 'ja')}
                      title="Nghe phát âm"
                    >
                      🔊
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '6px' }}>
                    Bài {item.lessonId} • {item.sectionTitle || 'Từ vựng'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Section */}
        <div style={styles.sampleSection}>
          <span style={styles.sampleSectionTitle}>💡 Thử nghiệm nhanh các cụm từ (Click để dịch):</span>
          <div style={styles.sampleChipsRow}>
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                style={styles.sampleChip}
                onClick={() => {
                  setSourceLang(phrase.from);
                  setTargetLang(phrase.to);
                  setSourceText(phrase.text);
                  setSpellSuggestion(null);
                  setErrorMessage(null);
                  handleTranslate(phrase.text);
                }}
                title={`Dịch thử: ${phrase.text}`}
              >
                {phrase.label}
              </button>
            ))}
          </div>
        </div>
      </div>
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
  badgeOnlineOffline: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  },
  pageSubTitle: {
    fontSize: '0.95rem',
    color: '#718096',
    display: 'block',
    marginTop: '4px',
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 12px 36px rgba(233, 30, 140, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02)',
    border: '1.5px solid #fce7f3',
  },
  langSelectorRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #f8e7ee',
    flexWrap: 'wrap',
    gap: '12px',
  },
  langBadge: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    padding: '8px 16px',
    borderRadius: '16px',
    fontSize: '0.92rem',
    fontWeight: '800',
    border: '1px solid #fce7f3',
  },
  swapBtn: {
    backgroundColor: '#ffffff',
    color: '#2d3748',
    border: '1.5px solid #edf2f7',
    padding: '8px 18px',
    borderRadius: '20px',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  romajiNotice: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    color: '#1d4ed8',
    padding: '10px 16px',
    borderRadius: '14px',
    fontSize: '0.86rem',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  romajiNoticeBtn: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    border: 'none',
    padding: '5px 12px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  boxWrapper: {
    border: '1.5px solid #edf2f7',
    borderRadius: '20px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  boxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  boxHeaderLabel: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#a0aec0',
    letterSpacing: '0.5px',
  },
  offlineBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: '#fef3c7',
    color: '#b45309',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#a0aec0',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '700',
  },
  copiedBadge: {
    color: '#28a745',
    fontSize: '0.82rem',
    fontWeight: '700',
  },
  textarea: {
    width: '100%',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#2d3748',
    minHeight: '150px',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
  },
  phoneticText: {
    fontStyle: 'italic',
    color: '#718096',
    fontSize: '0.94rem',
    padding: '8px 0 10px',
    lineHeight: '1.5',
    borderTop: '1px dashed #f0e2e7',
    marginTop: '6px',
    wordBreak: 'break-word',
  },
  phoneticLabel: {
    fontWeight: '600',
    color: '#a0aec0',
    fontStyle: 'normal',
    fontSize: '0.82rem',
  },
  boxFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #edf2f7',
    marginTop: 'auto',
  },
  iconActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  charCount: {
    fontSize: '0.78rem',
    color: '#a0aec0',
  },
  errorAlert: {
    backgroundColor: '#fff5f5',
    border: '1px solid #feb2b2',
    color: '#c53030',
    padding: '12px 18px',
    borderRadius: '16px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  retryBtn: {
    backgroundColor: '#c53030',
    color: '#ffffff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  translateMainBtn: {
    padding: '14px 42px',
    background: 'linear-gradient(135deg, #e91e8c 0%, #ff4b8b 50%, #f43f5e 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9999px',
    fontSize: '1.02rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(233, 30, 140, 0.35)',
    transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.8s linear infinite',
  },
  localDictSection: {
    backgroundColor: '#f8fafc',
    borderRadius: '18px',
    padding: '18px 20px',
    border: '1.5px solid #e2e8f0',
    marginBottom: '22px',
  },
  localDictHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '12px',
  },
  localDictGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '12px',
  },
  localDictCard: {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    padding: '12px 14px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
  },
  miniSpeakerBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #fce7f3',
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
  },
  sampleSection: {
    borderTop: '1px solid #f8e7ee',
    paddingTop: '18px',
  },
  sampleSectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#718096',
    display: 'block',
    marginBottom: '10px',
  },
  sampleChipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  sampleChip: {
    backgroundColor: '#fff0f6',
    color: '#e91e8c',
    border: '1px solid #fce7f3',
    padding: '6px 14px',
    borderRadius: '16px',
    fontSize: '0.84rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '600',
  },
};
