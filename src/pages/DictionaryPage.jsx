import React, { useState, useEffect } from 'react';
import { vocabularyData } from '../data/vocabulary';
import { offlineDictionary } from '../data/offlineDictionary';

export default function DictionaryPage() {
  const [inputText, setInputText] = useState('');
  const [direction, setDirection] = useState('auto'); // 'auto', 'ja-vi', 'vi-ja'
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [localMatches, setLocalMatches] = useState([]);
  const [offlineMatches, setOfflineMatches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nihongoSearchHistory');
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Detect if text contains Japanese characters (Hiragana, Katakana, Kanji)
  const isJapaneseText = (str) => {
    return /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/.test(str);
  };

  // Find matches in internal course vocabulary (300+ words)
  const findCourseMatches = (query) => {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();

    const results = [];
    Object.keys(vocabularyData).forEach((lessonId) => {
      vocabularyData[lessonId].forEach((word) => {
        const kanjiMatch = word.kanji && word.kanji.toLowerCase().includes(q);
        const hiraMatch = word.hiragana && word.hiragana.toLowerCase().includes(q);
        const vnMatch = word.meaning && word.meaning.toLowerCase().includes(q);

        if (kanjiMatch || hiraMatch || vnMatch) {
          results.push({
            ...word,
            lesson: lessonId,
          });
        }
      });
    });
    return results.slice(0, 6);
  };

  // Find matches in the extended offline dictionary (Supports Kanji, Hiragana, Romaji, and Vietnamese)
  const findOfflineMatches = (query) => {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();

    return offlineDictionary.filter((item) => {
      const kanjiMatch = item.kanji && item.kanji.toLowerCase().includes(q);
      const hiraMatch = item.hiragana && item.hiragana.toLowerCase().includes(q);
      const romajiMatch = item.romaji && item.romaji.toLowerCase().includes(q);
      const meaningMatch = item.meaning && item.meaning.toLowerCase().includes(q);
      return kanjiMatch || hiraMatch || romajiMatch || meaningMatch;
    }).slice(0, 10);
  };

  const handleTranslate = async (textToTranslate = inputText) => {
    const query = textToTranslate.trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg('');
    setTranslatedText('');

    // Always perform local & offline dictionary lookups (Works 100% Offline)
    const courseResults = findCourseMatches(query);
    const offlineResults = findOfflineMatches(query);
    setLocalMatches(courseResults);
    setOfflineMatches(offlineResults);

    // If offline dictionary has a direct exact match, prepare default offline translation
    const exactMatch = offlineResults.find(
      (m) =>
        (m.kanji && m.kanji.toLowerCase() === query.toLowerCase()) ||
        (m.hiragana && m.hiragana.toLowerCase() === query.toLowerCase()) ||
        (m.romaji && m.romaji.toLowerCase() === query.toLowerCase()) ||
        (m.meaning && m.meaning.toLowerCase().includes(query.toLowerCase()))
    );

    // If device is offline, rely purely on local offline dictionary
    if (!navigator.onLine) {
      setIsLoading(false);
      if (exactMatch) {
        setTranslatedText(exactMatch.meaning + (exactMatch.romaji ? ` (${exactMatch.romaji})` : ''));
      } else if (offlineResults.length > 0) {
        setTranslatedText(offlineResults[0].meaning);
      } else if (courseResults.length > 0) {
        setTranslatedText(courseResults[0].meaning);
      } else {
        setErrorMsg('Bạn đang ở chế độ ngoại tuyến và từ này chưa có trong từ điển offline có sẵn.');
      }
      return;
    }

    // Determine translation direction for online API
    let langpair = 'ja|vi';
    if (direction === 'vi-ja') {
      langpair = 'vi|ja';
    } else if (direction === 'ja-vi') {
      langpair = 'ja|vi';
    } else {
      // Auto-detect
      langpair = isJapaneseText(query) ? 'ja|vi' : 'vi|ja';
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout fallback

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=${langpair}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data && data.responseData && data.responseData.translatedText) {
        let result = data.responseData.translatedText.trim();
        setTranslatedText(result);

        // Save to search history
        const newHistory = [
          { query, result, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...searchHistory.filter((item) => item.query.toLowerCase() !== query.toLowerCase()),
        ].slice(0, 10);

        setSearchHistory(newHistory);
        localStorage.setItem('nihongoSearchHistory', JSON.stringify(newHistory));
      } else {
        // Fallback to offline match if API returns no text
        if (exactMatch) {
          setTranslatedText(exactMatch.meaning);
        } else {
          setErrorMsg('Không tìm thấy bản dịch trực tuyến phù hợp.');
        }
      }
    } catch (err) {
      console.warn('Online API fetch failed, falling back to offline dictionary:', err);
      if (exactMatch) {
        setTranslatedText(exactMatch.meaning);
      } else if (offlineResults.length > 0) {
        setTranslatedText(offlineResults[0].meaning);
      } else {
        setErrorMsg('Không thể kết nối máy chủ trực tuyến. Đã hiển thị kết quả từ từ điển ngoại tuyến bên dưới nếu có.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech (Phát âm giọng đọc - Hoạt động cả Online & Offline qua Web Speech API)
  const speakText = (text, lang = 'ja-JP') => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng phát âm này.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // tốc độ vừa phải cho người học
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearSearch = () => {
    setInputText('');
    setTranslatedText('');
    setLocalMatches([]);
    setOfflineMatches([]);
    setErrorMsg('');
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('nihongoSearchHistory');
  };

  const sampleQueries = [
    { label: 'arigatou', text: 'arigatou' },
    { label: 'ohayou', text: 'ohayou' },
    { label: 'watashi', text: 'watashi' },
    { label: 'tabemasu', text: '食べます' },
    { label: 'Xin chào', text: 'Xin chào' },
    { label: 'Cảm ơn', text: 'Cảm ơn' },
    { label: 'Bao nhiêu tiền?', text: 'いくら' },
    { label: 'Thời tiết', text: '天気' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '960px', margin: '0 auto' }}>
      {/* Network Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          backgroundColor: isOnline ? '#e8f5e9' : '#fff3e0',
          color: isOnline ? '#2e7d32' : '#e65100',
          border: `1px solid ${isOnline ? '#a5d6a7' : '#ffcc80'}`,
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <span>{isOnline ? '🟢' : '🟠'}</span>
          <span>
            {isOnline
              ? 'Chế độ Kép: Tra cứu Online API & Từ điển Offline'
              : 'Chế độ Ngoại tuyến (Offline): Sử dụng dữ liệu từ điển tích hợp sẵn'}
          </span>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="jp-text" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
          🔍 Từ Điển & Dịch Thuật (Online & Offline)
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Tra cứu hai chiều Nhật ↔ Việt: hỗ trợ <strong>Kanji</strong>, <strong>Hiragana</strong>, <strong>Romaji</strong> (như: <em>arigatou, watashi</em>) và <strong>tiếng Việt</strong>
        </p>
      </div>

      {/* Mode / Language Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setDirection('auto')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: `2px solid ${direction === 'auto' ? 'var(--primary)' : '#ddd'}`,
            background: direction === 'auto' ? 'var(--primary)' : 'white',
            color: direction === 'auto' ? 'white' : 'var(--text-main)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ✨ Tự động nhận diện (Auto)
        </button>

        <button
          onClick={() => setDirection('ja-vi')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: `2px solid ${direction === 'ja-vi' ? 'var(--primary)' : '#ddd'}`,
            background: direction === 'ja-vi' ? 'var(--primary)' : 'white',
            color: direction === 'ja-vi' ? 'white' : 'var(--text-main)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🇯🇵 Nhật ➔ 🇻🇳 Việt
        </button>

        <button
          onClick={() => setDirection('vi-ja')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            border: `2px solid ${direction === 'vi-ja' ? 'var(--primary)' : '#ddd'}`,
            background: direction === 'vi-ja' ? 'var(--primary)' : 'white',
            color: direction === 'vi-ja' ? 'white' : 'var(--text-main)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🇻🇳 Việt ➔ 🇯🇵 Nhật
        </button>
      </div>

      {/* Main Search Input Card */}
      <div className="card" style={{ padding: '1.8rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            rows="3"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            placeholder="Nhập chữ Nhật (Kanji, Hiragana), Romaji (arigatou, sensei...) hoặc tiếng Việt..."
            style={{
              width: '100%',
              padding: '1rem 3rem 1rem 1rem',
              borderRadius: '12px',
              border: '2px solid #ffccd8',
              fontSize: '1.2rem',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = '#ffccd8')}
          />

          {inputText && (
            <button
              onClick={clearSearch}
              title="Xóa nội dung"
              style={{
                position: 'absolute',
                right: '12px',
                top: '15px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {inputText && (
              <button
                onClick={() => speakText(inputText, isJapaneseText(inputText) ? 'ja-JP' : 'vi-VN')}
                title="Nghe phát âm từ nguồn"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                🔊 Nghe từ nhập
              </button>
            )}
          </div>

          <button
            onClick={() => handleTranslate()}
            disabled={isLoading || !inputText.trim()}
            style={{
              padding: '0.8rem 2.2rem',
              backgroundColor: isLoading || !inputText.trim() ? '#f8bbd0' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(233,30,140,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? '⏳ Đang tra cứu...' : '🔎 Tra Từ Điển'}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid #ffeef2' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginRight: '8px' }}>
            Gợi ý tra nhanh (có hỗ trợ Romaji):
          </span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' }}>
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.text);
                  handleTranslate(sample.text);
                }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  borderRadius: '15px',
                  border: '1px solid #ffccd8',
                  background: '#fff5f7',
                  color: 'var(--primary)',
                  cursor: 'pointer'
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error / Offline Notice */}
      {errorMsg && (
        <div style={{
          backgroundColor: '#fff3e0',
          color: '#e65100',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          textAlign: 'center',
          border: '1px solid #ffe0b2'
        }}>
          ℹ️ {errorMsg}
        </div>
      )}

      {/* Online / Primary Translated Result Card */}
      {translatedText && (
        <div className="card" style={{
          padding: '1.8rem',
          marginBottom: '2rem',
          borderLeft: '6px solid var(--primary)',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isOnline ? '🌐 Kết Quả Dịch' : '⚡ Kết Quả Tra Cứu Offline'}
            </span>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => speakText(translatedText, isJapaneseText(translatedText) ? 'ja-JP' : 'vi-VN')}
                title="Nghe phát âm kết quả"
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔊 Phát âm
              </button>
              <button
                onClick={() => handleCopy(translatedText)}
                title="Sao chép kết quả"
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {copied ? '✅ Đã chép' : '📋 Sao chép'}
              </button>
            </div>
          </div>

          <div style={{
            fontSize: '1.8rem',
            color: '#222',
            fontWeight: '600',
            lineHeight: 1.4,
            padding: '8px 0'
          }}>
            {translatedText}
          </div>
        </div>
      )}

      {/* Offline Dictionary Matches */}
      {offlineMatches.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Từ Điển Ngoại Tuyến ({offlineMatches.length} mục tìm thấy)
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {offlineMatches.map((word, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid #a18cd1'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#222' }}>
                      {word.kanji}
                    </div>
                    {word.category && (
                      <span style={{
                        fontSize: '0.75rem',
                        background: '#f3e5f5',
                        color: '#7b1fa2',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        {word.category}
                      </span>
                    )}
                  </div>

                  {word.hiragana && (
                    <div style={{ fontSize: '1.1rem', color: '#666', marginTop: '4px' }}>
                      {word.hiragana}
                      {word.romaji && <span style={{ fontSize: '0.9rem', color: '#999', marginLeft: '6px' }}>({word.romaji})</span>}
                    </div>
                  )}

                  <div style={{
                    marginTop: '10px',
                    fontSize: '1.1rem',
                    color: 'var(--primary)',
                    fontWeight: 'bold'
                  }}>
                    {word.meaning}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => speakText(word.kanji || word.hiragana, 'ja-JP')}
                    title="Nghe phát âm"
                    style={{
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    🔊 Nghe
                  </button>
                  <button
                    onClick={() => handleCopy(`${word.kanji}: ${word.meaning}`)}
                    title="Sao chép"
                    style={{
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    📋 Chép
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matches from Curated Course Vocabulary (Dekiru / Shokyu) */}
      {localMatches.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Khớp Với Giáo Trình Shokyu / Dekiru ({localMatches.length} từ)
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {localMatches.map((word, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid var(--secondary)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#222' }}>
                      {word.kanji || word.hiragana}
                    </div>
                    <span style={{
                      fontSize: '0.8rem',
                      background: '#fff0f5',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      Bài {word.lesson}
                    </span>
                  </div>

                  {word.kanji && (
                    <div style={{ fontSize: '1.1rem', color: '#666', marginTop: '4px' }}>
                      {word.hiragana}
                    </div>
                  )}

                  <div style={{
                    marginTop: '10px',
                    fontSize: '1.1rem',
                    color: 'var(--primary)',
                    fontWeight: 'bold'
                  }}>
                    {word.meaning}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => speakText(word.kanji || word.hiragana, 'ja-JP')}
                    title="Nghe phát âm"
                    style={{
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    🔊 Nghe
                  </button>
                  <button
                    onClick={() => handleCopy(`${word.kanji || word.hiragana}: ${word.meaning}`)}
                    title="Sao chép"
                    style={{
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    📋 Chép
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🕒 Lịch Sử Tra Cứu Gần Đây
            </h3>
            <button
              onClick={clearHistory}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Xóa lịch sử
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {searchHistory.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setInputText(item.query);
                  handleTranslate(item.query);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  backgroundColor: '#fdf0f4',
                  border: '1px solid #f8bbd0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#444'
                }}
                title={`Kết quả: ${item.result}`}
              >
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{item.query}</span>
                <span style={{ color: '#888' }}>➔ {item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
