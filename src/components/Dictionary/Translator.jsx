import React, { useState, useMemo, useCallback } from 'react';
import {
  romajiToHiragana,
  romajiToJapanese,
  isProbablyRomaji,
} from '../../utils/romajiConverter';
import {
  searchLocalDictionary,
  getExactWordByRomaji,
  getFuzzySuggestions,
} from '../../utils/localDictionary';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { TranslatorInput } from './TranslatorInput';
import { TranslatorOutput } from './TranslatorOutput';
import { OfflineLexiconCard } from './OfflineLexiconCard';
import { SpellSuggestionChip } from './SpellSuggestionChip';
import { TranslationHistory } from './TranslationHistory';
import '../../styles/sakura.css';

/**
 * Translator Component - Smart Container Quản lý Từ Điển & Dịch Thuật Đa Năng
 * Điều phối gọi Google Translate API, Fallback Offline, Nhận diện giọng nói STT và Web Speech TTS
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
  const [spellSuggestion, setSpellSuggestion] = useState(null);
  const [history, setHistory] = useState([]);

  // Mẫu câu gợi ý nhanh cho người học
  const samplePhrases = useMemo(
    () => [
      { text: 'mannaka', from: 'ja', to: 'vi', label: 'mannaka (Ở giữa / Chính giữa)' },
      { text: 'biiru', from: 'ja', to: 'vi', label: 'biiru (Bia - Katakana)' },
      { text: 'biru', from: 'ja', to: 'vi', label: 'biru (Tòa nhà - Katakana)' },
      { text: 'watashi', from: 'ja', to: 'vi', label: 'watashi (Tôi - Romaji)' },
      { text: 'arigatou gozaimasu', from: 'ja', to: 'vi', label: 'arigatou gozaimasu (Cảm ơn)' },
      { text: 'Xin chào, bạn khỏe không?', from: 'vi', to: 'ja', label: 'Xin chào (VI ➔ JA)' },
    ],
    []
  );

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
   * Tra cứu Offline từ cơ sở dữ liệu từ vựng nội bộ
   */
  const handleOfflineLookup = useCallback((query) => {
    const results = searchLocalDictionary(query, 1);
    if (results.length > 0) {
      const best = results[0];
      const resultText = sourceLang === 'ja' ? best.meaning : `${best.kanji} (${best.hiragana})`;

      if (sourceLang === 'ja') {
        setTranslatedText(best.meaning);
        setSourcePhonetic(best.hiragana);
        setTargetPhonetic('');
      } else {
        setTranslatedText(resultText);
        setTargetPhonetic(best.hiragana);
        setSourcePhonetic('');
      }
      setIsOfflineResult(true);
      setErrorMessage(null);
      setSpellSuggestion(null);

      // Lưu vào lịch sử tra cứu
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.sourceText.toLowerCase() !== query.toLowerCase());
        return [
          {
            sourceText: query,
            translatedText: resultText,
            sourceLang,
            targetLang,
            time: Date.now(),
          },
          ...filtered,
        ].slice(0, 10);
      });
    } else {
      setIsOfflineResult(false);
      // Khi offline và không tìm thấy kết quả chính xác, thử tìm từ viết gần đúng nhất
      const fuzzy = getFuzzySuggestions(query, 1);
      if (fuzzy.length > 0 && fuzzy[0].dist <= 2) {
        const best = fuzzy[0];
        setSpellSuggestion({
          text: best.text,
          display:
            best.romaji && best.romaji !== best.hiragana
              ? `${best.romaji} (${best.kanji || best.hiragana}: ${best.meaning})`
              : `${best.kanji || best.hiragana} (${best.meaning})`,
          source: 'local',
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
  }, [sourceLang, targetLang]);

  /**
   * Gọi Dịch Thuật (Kết hợp Google AI + Offline Fallback)
   */
  const handleTranslate = useCallback(async (overrideText = null) => {
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

    const exactLocalWord = isRomaji ? getExactWordByRomaji(trimmed) : null;

    if (sourceLang === 'ja' && isRomaji) {
      if (exactLocalWord) {
        queryToSend = exactLocalWord.hiragana || exactLocalWord.kanji;
      } else {
        queryToSend = romajiToJapanese(trimmed);
      }
      setSourcePhonetic(`${trimmed} (${queryToSend})`);
    } else if (sourceLang === 'vi' && isRomaji) {
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

          if (typeof item[0] === 'string') {
            fullTranslatedText += item[0];
          }

          if (typeof item[2] === 'string' && item[2].trim()) {
            tgtTranslit = item[2].trim();
          }

          if (typeof item[3] === 'string' && item[3].trim()) {
            srcTranslit = item[3].trim();
          }
        }
      }

      setTranslatedText(fullTranslatedText);

      if (isRomaji) {
        setSourcePhonetic(`${trimmed} (${queryToSend})`);
      } else {
        setSourcePhonetic(srcTranslit);
      }
      setTargetPhonetic(tgtTranslit);
      setIsOfflineResult(false);

      // Lưu vào lịch sử tra cứu
      if (fullTranslatedText) {
        setHistory((prev) => {
          const filtered = prev.filter(
            (item) => item.sourceText.toLowerCase() !== trimmed.toLowerCase()
          );
          return [
            {
              sourceText: trimmed,
              translatedText: fullTranslatedText,
              sourceLang: actualSourceLang,
              targetLang: actualTargetLang,
              time: Date.now(),
            },
            ...filtered,
          ].slice(0, 10);
        });
      }

      // --- 3. Bóc tách Gợi Ý Sửa Lỗi Chính Tả ("Did you mean...?") ---
      let detectedSuggestion = null;

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
            source: 'google',
          };
        }
      }

      if (!detectedSuggestion && (isRomaji || actualSourceLang === 'ja')) {
        const fuzzy = getFuzzySuggestions(trimmed, 1);
        if (fuzzy.length > 0 && fuzzy[0].dist <= 2) {
          const best = fuzzy[0];
          const suggestionText = best.text;
          if (suggestionText.toLowerCase() !== trimmed.toLowerCase()) {
            detectedSuggestion = {
              text: suggestionText,
              display:
                best.romaji && best.romaji !== best.hiragana
                  ? `${best.romaji} (${best.kanji || best.hiragana}: ${best.meaning})`
                  : `${best.kanji || best.hiragana} (${best.meaning})`,
              source: 'local',
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
  }, [sourceText, sourceLang, targetLang, handleOfflineLookup]);

  // Hook nhận diện giọng nói Web Speech STT
  const { isListening, startListening, stopListening, isSupported: isSpeechSupported } =
    useSpeechRecognition({
      lang: sourceLang === 'ja' ? 'ja-JP' : 'vi-VN',
      onResult: (text) => {
        if (text) {
          setSourceText(text);
          handleTranslate(text);
        }
      },
    });

  const handleToggleListening = useCallback(() => {
    if (!isSpeechSupported) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech Recognition.');
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, isSpeechSupported, startListening, stopListening]);

  /**
   * Bấm áp dụng từ gợi ý sửa lỗi chính tả
   */
  const handleApplySuggestion = useCallback((suggestedText) => {
    setSourceText(suggestedText);
    setSpellSuggestion(null);
    handleTranslate(suggestedText);
  }, [handleTranslate]);

  /**
   * Đảo chiều ngôn ngữ dịch (JA ↔ VI)
   */
  const handleSwapLanguages = useCallback(() => {
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
  }, [sourceLang, targetLang, sourceText, translatedText, sourcePhonetic, targetPhonetic]);

  /**
   * Phát âm văn bản bằng Web Speech API
   */
  const handleSpeak = useCallback((textToSpeak, langCode) => {
    if (!textToSpeak || !textToSpeak.trim()) return;

    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ phát âm Web Speech API.');
      return;
    }

    window.speechSynthesis.cancel();

    let spokenText = textToSpeak;
    if (langCode === 'ja' && isProbablyRomaji(textToSpeak)) {
      spokenText = romajiToHiragana(textToSpeak);
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = langCode === 'ja' ? 'ja-JP' : 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Sao chép kết quả vào clipboard
   */
  const handleCopy = useCallback(async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('[Translator] Copy error:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
    setSourcePhonetic('');
    setTargetPhonetic('');
    setSpellSuggestion(null);
    setErrorMessage(null);
    setIsOfflineResult(false);
  }, []);

  const handleSwitchToJaVi = useCallback(() => {
    setSourceLang('ja');
    setTargetLang('vi');
  }, []);

  const handleSelectHistory = useCallback((item) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setSourceText(item.sourceText);
    handleTranslate(item.sourceText);
  }, [handleTranslate]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleSelectSample = useCallback((phrase) => {
    setSourceLang(phrase.from);
    setTargetLang(phrase.to);
    setSourceText(phrase.text);
    setSpellSuggestion(null);
    setErrorMessage(null);
    handleTranslate(phrase.text);
  }, [handleTranslate]);

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
            <h1 style={styles.pageTitle}>🔍 Từ Điển & Dịch Thuật Thông Minh</h1>
            <span style={styles.badgeOnlineOffline}>
              {navigator.onLine ? '🌐 Online + Google AI' : '📴 Offline Mode'}
            </span>
          </div>
          <span style={styles.pageSubTitle}>
            Dịch song ngữ Nhật - Việt • Tự động hiểu Romaji • Hiển thị Cách Đọc & Tra cứu Offline 965 từ
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div style={styles.mainCard}>
        {/* Dual Input/Output Grid */}
        <div style={styles.grid}>
          {/* 1. Component Nhập Liệu */}
          <TranslatorInput
            sourceText={sourceText}
            onSourceTextChange={(val) => {
              setSourceText(val);
              if (spellSuggestion) setSpellSuggestion(null);
            }}
            sourceLang={sourceLang}
            targetLang={targetLang}
            sourcePhonetic={sourcePhonetic}
            isSwapping={isSwapping}
            isRomajiMisplaced={isRomajiMisplaced}
            isListening={isListening}
            onSwapLanguages={handleSwapLanguages}
            onSwitchToJaVi={handleSwitchToJaVi}
            onTranslate={() => handleTranslate()}
            onClear={handleClear}
            onSpeak={handleSpeak}
            onToggleListening={handleToggleListening}
          >
            {/* Gợi ý sửa lỗi chính tả phong cách Google Dịch ("Did you mean...?") */}
            <SpellSuggestionChip
              suggestion={spellSuggestion}
              onApply={handleApplySuggestion}
            />
          </TranslatorInput>

          {/* 2. Component Kết Quả */}
          <TranslatorOutput
            translatedText={translatedText}
            targetLang={targetLang}
            targetPhonetic={targetPhonetic}
            isLoading={isLoading}
            isOfflineResult={isOfflineResult}
            copySuccess={copySuccess}
            onSpeak={handleSpeak}
            onCopy={handleCopy}
          />
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div style={styles.errorAlert}>
            <span>{errorMessage}</span>
            <button
              type="button"
              style={styles.retryBtn}
              onClick={() => handleTranslate()}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Nút Kích Hoạt Dịch Chính */}
        <div style={styles.actionRow}>
          <button
            type="button"
            style={styles.translateMainBtn}
            onClick={() => handleTranslate()}
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

        {/* 3. Thẻ Từ Điển Nội Bộ Dekiru Nihongo Offline */}
        <OfflineLexiconCard
          results={localDictResults}
          onSpeak={handleSpeak}
        />

        {/* 4. Lịch Sử Tra Cứu & Mẫu Câu Thử Nghiệm */}
        <TranslationHistory
          history={history}
          samplePhrases={samplePhrases}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          onSelectSample={handleSelectSample}
        />
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
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
};
