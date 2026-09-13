import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Trang chủ', icon: '🏠' },
  { path: '/vocabulary', label: 'Từ vựng', icon: '📖' },
  { path: '/flashcard', label: 'Flashcard', icon: '🎴' },
  { path: '/quiz', label: 'Quiz', icon: '❓' },
  { path: '/grammar', label: 'Ngữ pháp', icon: '✍️' },
  { path: '/exercises', label: 'Bài tập', icon: '📝' },
  { path: '/dictionary', label: 'Từ điển', icon: '🔍' },
  { path: '/progress', label: 'Tiến độ', icon: '📈' },
];

export default function Layout() {
  const location = useLocation();

  // Create petals statically for the background
  const petals = Array.from({ length: 20 }).map((_, i) => {
    const left = Math.random() * 100;
    const animDuration = 10 + Math.random() * 15;
    const animDelay = Math.random() * 5;
    const width = 10 + Math.random() * 15;
    const height = width * 1.5;
    return (
      <div
        key={i}
        className="petal"
        style={{
          left: `${left}%`,
          width: `${width}px`,
          height: `${height}px`,
          animationDuration: `${animDuration}s`,
          animationDelay: `${animDelay}s`,
        }}
      />
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="sakura-container">{petals}</div>
      
      <header style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(233, 30, 140, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🌸</span>
            <h1 className="jp-text" style={{ margin: 0, color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '700' }}>日本語マスター</h1>
          </Link>
          
          <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-light)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    padding: '0.5rem 0',
                    borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>{link.icon}</span> {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        background: 'white',
        borderTop: '1px solid rgba(233, 30, 140, 0.1)',
        color: 'var(--text-light)'
      }}>
        <p className="jp-text">© {new Date().getFullYear()} 日本語マスター (Nihongo Master). All rights reserved.</p>
      </footer>
    </div>
  );
}
