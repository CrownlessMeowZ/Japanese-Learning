import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [stats, setStats] = useState({ words: 0, score: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('japaneseProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        const learnedWordsCount = Object.keys(parsed.learnedWords || {}).length;
        const quizzes = parsed.quizHistory || [];
        let avgScore = 0;
        if (quizzes.length > 0) {
          const totalPct = quizzes.reduce((acc, curr) => acc + (curr.score / curr.total), 0);
          avgScore = Math.round((totalPct / quizzes.length) * 100);
        }
        setStats({ words: learnedWordsCount, score: avgScore });
      } else {
        setStats({ words: 0, score: 0 });
      }
    } catch (e) {
      console.error(e);
      setStats({ words: 0, score: 0 });
    }
  }, []);

  const features = [
    { id: 'vocabulary', title: 'Từ vựng', desc: 'Học từ vựng mới theo chủ đề', icon: '📖', color: '#ff9a9e' },
    { id: 'flashcard', title: 'Flashcard', desc: 'Ôn tập hiệu quả với flashcard 3D', icon: '🎴', color: '#a18cd1' },
    { id: 'quiz', title: 'Quiz', desc: 'Kiểm tra kiến thức qua bài trắc nghiệm 2 chiều', icon: '❓', color: '#fbc2eb' },
    { id: 'grammar', title: 'Ngữ pháp', desc: 'Cấu trúc ngữ pháp trọng tâm theo bài học', icon: '✍️', color: '#8fd3f4' },
    { id: 'exercises', title: 'Bài tập', desc: 'Luyện gõ cách đọc Hiragana theo chữ Kanji', icon: '📝', color: '#84fab0' },
    { id: 'dictionary', title: 'Từ điển / Tra cứu', desc: 'Dịch 2 chiều Nhật ↔ Việt, tra cứu API trực tuyến & phát âm', icon: '🔍', color: '#ff758c' },
    { id: 'progress', title: 'Tiến độ', desc: 'Theo dõi sự tiến bộ & chuỗi ngày học', icon: '📈', color: '#fccb90' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="jp-text" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
          ようこそ！
        </h1>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
          Chào mừng đến với Nihongo Master
        </h2>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem', fontSize: '1.1rem' }}>
          Bắt đầu hành trình chinh phục tiếng Nhật của bạn ngay hôm nay!
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginBottom: '4rem',
        flexWrap: 'wrap'
      }}>
        <div className="card" style={{ padding: '1.5rem 3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.words}</div>
          <div style={{ color: 'var(--text-light)' }}>Từ đã học</div>
        </div>
        <div className="card" style={{ padding: '1.5rem 3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.score}%</div>
          <div style={{ color: 'var(--text-light)' }}>Điểm trung bình</div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {features.map(f => (
          <Link to={`/${f.id}`} key={f.id} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ 
              padding: '2rem', 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderTop: `5px solid ${f.color}`
            }}>
              <div style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem',
                background: `${f.color}22`,
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px'
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
