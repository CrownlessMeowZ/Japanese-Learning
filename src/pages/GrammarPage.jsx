import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import LessonSelector from '../components/LessonSelector';
import { grammarData } from '../data/grammar';

const GrammarPage = () => {
  const { lessonId } = useParams();
  const [expandedItems, setExpandedItems] = useState({});

  const normalizedId = lessonId ? String(lessonId).replace('lesson', '') : null;
  const lessonGrammar = normalizedId 
    ? (grammarData[normalizedId] || []) 
    : Object.values(grammarData).flat();

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#fff5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    },
    header: {
      color: '#e91e8c',
      marginBottom: '20px'
    },
    list: {
      width: '100%',
      maxWidth: '800px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginTop: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '20px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottom: '1px solid #ffeeef'
    },
    title: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    icon: {
      color: '#e91e8c',
      fontSize: '1.2rem',
      transition: 'transform 0.3s'
    },
    content: {
      padding: '20px',
      backgroundColor: '#fafafa'
    },
    explanation: {
      fontSize: '1.1rem',
      color: '#555',
      marginBottom: '15px',
      lineHeight: '1.5'
    },
    structure: {
      backgroundColor: '#fff0f5',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #e91e8c'
    },
    structureTitle: {
      color: '#e91e8c',
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '0.9rem',
      textTransform: 'uppercase'
    },
    pattern: {
      fontFamily: 'monospace',
      fontSize: '1.1rem',
      color: '#333'
    },
    examples: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    exampleItem: {
      paddingBottom: '15px',
      borderBottom: '1px dashed #ddd'
    },
    exampleJp: {
      fontSize: '1.2rem',
      color: '#222',
      marginBottom: '5px'
    },
    exampleVn: {
      color: '#666',
      fontStyle: 'italic'
    },
    empty: {
      padding: '40px',
      color: '#888',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📖 Ôn Luyện Ngữ Pháp</h1>
      <LessonSelector basePath="/grammar" currentLesson={lessonId} />

      {lessonGrammar.length === 0 ? (
        <div style={styles.empty}>Chưa có điểm ngữ pháp cho bài học này. Hãy chọn bài khác nhé!</div>
      ) : (
        <div style={styles.list}>
          {lessonGrammar.map((grammar, idx) => (
            <div key={idx} style={styles.card}>
              <div 
                style={styles.cardHeader} 
                onClick={() => toggleExpand(idx)}
              >
                <h3 style={styles.title}>{grammar.title}</h3>
                <span style={{...styles.icon, transform: expandedItems[idx] ? 'rotate(180deg)' : 'none'}}>
                  ▼
                </span>
              </div>
              
              {expandedItems[idx] && (
                <div style={styles.content}>
                  <div style={styles.explanation}>{grammar.explanation}</div>
                  
                  {grammar.structure && (
                    <div style={styles.structure}>
                      <div style={styles.structureTitle}>Cấu trúc</div>
                      <div style={styles.pattern}>{grammar.structure}</div>
                    </div>
                  )}

                  {grammar.examples && grammar.examples.length > 0 && (
                    <div style={styles.examples}>
                      <div style={styles.structureTitle}>Ví dụ</div>
                      {grammar.examples.map((ex, i) => (
                        <div key={i} style={styles.exampleItem}>
                          <div style={styles.exampleJp}>{ex.japanese}</div>
                          <div style={styles.exampleVn}>{ex.vietnamese}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrammarPage;
