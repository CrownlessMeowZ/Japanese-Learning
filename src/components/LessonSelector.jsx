import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function LessonSelector({ basePath }) {
  const { lessonId } = useParams();
  
  // Clean base path to ensure it always starts with single slash and has no trailing slash
  const cleanPath = '/' + (basePath || '').replace(/^\/+|\/+$/g, '');
  const cleanLessonId = lessonId ? String(lessonId).replace('lesson', '') : null;

  // Generating Lesson 1 to 15
  const lessons = Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    name: `Bài ${i + 1}`,
    topic: `Bài học ${i + 1}`
  }));

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Chọn bài học:</h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.8rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '12px'
      }}>
        <Link 
          to={cleanPath}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '20px',
            textDecoration: 'none',
            background: !cleanLessonId ? 'var(--primary)' : 'white',
            color: !cleanLessonId ? 'white' : 'var(--text-main)',
            border: `1px solid ${!cleanLessonId ? 'var(--primary)' : '#ddd'}`,
            transition: 'all 0.2s ease',
            fontWeight: !cleanLessonId ? 'bold' : 'normal',
            boxShadow: !cleanLessonId ? '0 4px 10px rgba(233,30,140,0.3)' : 'none'
          }}
        >
          Tất cả
        </Link>
        
        {lessons.map(lesson => {
          const isActive = cleanLessonId === lesson.id;
          return (
            <Link 
              key={lesson.id}
              to={`${cleanPath}/${lesson.id}`}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '20px',
                textDecoration: 'none',
                background: isActive ? 'var(--primary)' : 'white',
                color: isActive ? 'white' : 'var(--text-main)',
                border: `1px solid ${isActive ? 'var(--primary)' : '#ddd'}`,
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 'bold' : 'normal',
                boxShadow: isActive ? '0 4px 10px rgba(233,30,140,0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              title={lesson.topic}
            >
              {lesson.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
