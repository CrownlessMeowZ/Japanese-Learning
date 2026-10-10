import React from 'react';
import { vocabularyData } from '../../data/vocabulary';
import { MatchHighscoreModal } from './MatchHighscoreModal';
import { DIFFICULTY_CONFIG, getHighscoreItem } from './matchUtils';

/**
 * MatchLobbyView Component - Sảnh chờ lựa chọn độ khó và bài học Sakura Match
 */
export const MatchLobbyView = ({
  onBack,
  difficulty,
  setDifficulty,
  highscores,
  isHighscoreModalOpen,
  setIsHighscoreModalOpen,
  handleSelectLesson,
}) => {
  const currentConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;
  const allVocabCount = Object.values(vocabularyData).flat().length;

  return (
    <div className="match-container" style={{ maxWidth: '880px', margin: '0 auto', padding: '16px' }}>
      {/* Top Bar Lobby */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '8px 18px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            color: '#475569',
            fontWeight: '700',
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ⬅ Dashboard
        </button>

        <button
          type="button"
          onClick={() => setIsHighscoreModalOpen(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '12px',
            color: '#d97706',
            fontWeight: '800',
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          🏆 Bảng Vàng Kỷ Lục
        </button>
      </div>

      {/* Hero Intro */}
      <div style={{
        textAlign: 'center',
        padding: '24px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #fbcfe8',
        boxShadow: '0 4px 20px rgba(233, 30, 140, 0.08)',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '2.8rem', display: 'block', marginBottom: '8px' }}>🌸⚔️</span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#be185d', margin: '0 0 8px' }}>
          Sakura Match - Đấu Phản Xạ Từ Vựng
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 20px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
          Hãy chọn bài học và độ khó bạn muốn chinh phục. Dọn sạch các cặp từ vựng trước khi hết giờ để ghi tên vào bảng vàng kỷ lục!
        </p>

        {/* Difficulty Selector in Lobby */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#fdf2f8',
          padding: '6px 12px',
          borderRadius: '14px',
          border: '1px solid #fbcfe8',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#be185d' }}>
            Độ khó:
          </span>
          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
            <button
              key={`lobby-diff-${key}`}
              type="button"
              onClick={() => setDifficulty(key)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: difficulty === key ? '2px solid #e91e8c' : '1px solid #cbd5e1',
                backgroundColor: difficulty === key ? '#ffffff' : '#f8fafc',
                color: difficulty === key ? '#be185d' : '#64748b',
                fontWeight: '800',
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: difficulty === key ? '0 2px 8px rgba(233, 30, 140, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {cfg.name} ({cfg.seconds}s)
            </button>
          ))}
        </div>
      </div>

      {/* Special Banner: Đại Chiến Toàn Bộ 15 Bài */}
      <div style={{
        padding: '18px 20px',
        backgroundColor: '#fff0f6',
        borderRadius: '18px',
        border: '2px solid #f472b6',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>👑</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#be185d' }}>
              Đại Chiến Toàn Bộ 15 Bài
            </span>
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
            Xáo trộn ngẫu nhiên từ vựng trong tất cả 15 bài học ({allVocabCount} từ)
            {getHighscoreItem(highscores, difficulty, 'all').highScore ? ` • Kỷ lục (${currentConfig.name}): ${getHighscoreItem(highscores, difficulty, 'all').highScore}đ` : ''}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSelectLesson('all')}
          style={{
            padding: '10px 24px',
            backgroundColor: '#e91e8c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(233, 30, 140, 0.3)',
            transition: 'transform 0.15s ease'
          }}
        >
          ⚔️ Đấu Ngay
        </button>
      </div>

      {/* Grid 15 Lessons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: '12px'
      }}>
        {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => {
          const vocabCount = vocabularyData[String(num)]?.length || 0;
          const hs = getHighscoreItem(highscores, difficulty, String(num));
          const hasScore = Boolean(hs?.highScore);

          return (
            <div
              key={`lobby-ls-${num}`}
              onClick={() => handleSelectLesson(num)}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #f1f5f9',
                borderRadius: '16px',
                padding: '14px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#fdf2f8',
                  color: '#be185d',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  marginBottom: '8px'
                }}>
                  Bài {num}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {vocabCount} từ vựng
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '0.76rem', color: hasScore ? '#ea580c' : '#94a3b8', fontWeight: '700' }}>
                  {hasScore ? `🏆 ${hs.highScore}đ` : 'Chưa đấu'}
                </div>
                <button
                  type="button"
                  style={{
                    marginTop: '6px',
                    width: '100%',
                    padding: '6px 0',
                    backgroundColor: '#fff1f2',
                    color: '#e11d48',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  Chọn bài ➔
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Highscore Modal in Lobby */}
      <MatchHighscoreModal
        isOpen={isHighscoreModalOpen}
        onClose={() => setIsHighscoreModalOpen(false)}
        highscores={highscores}
        initialDifficulty={difficulty}
        onSelectLesson={(lsId, targetDiff) => {
          handleSelectLesson(lsId, targetDiff || difficulty);
        }}
      />
    </div>
  );
};
