import React, { useState, useEffect } from 'react';

/**
 * Weak Spots Review Component
 * 
 * Aggregates all items marked as "Review Needed" across all lessons
 * Allows focused study on problem areas
 */

const WEAK_SPOTS_KEY = 'secplus_weak_spots';
const MASTERED_KEY = 'secplus_mastered';

// Helper to get stored set
const getStoredSet = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveStoredSet = (key, set) => {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

// Parse mistake ID to get components
const parseMistakeId = (id) => {
  const parts = id.split('-');
  // Format: D1-LESSON-001-0-1 (lessonId-sectionIndex-mistakeIndex)
  const mistakeIndex = parseInt(parts.pop());
  const sectionIndex = parseInt(parts.pop());
  const lessonId = parts.join('-');
  return { lessonId, sectionIndex, mistakeIndex };
};

// Single Review Card
const ReviewCard = ({ mistakeId, mistakeData, onMastered, onRemove }) => {
  const [revealed, setRevealed] = useState(false);
  
  if (!mistakeData) return null;
  
  const { lessonId, sectionIndex } = parseMistakeId(mistakeId);
  
  return (
    <div style={{
      background: '#27272a',
      border: '1px solid #ef4444',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px'
    }}>
      {/* Source Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid #3f3f46'
      }}>
        <span style={{
          background: '#3f3f46',
          color: '#a1a1aa',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {lessonId} • Section {sectionIndex + 1}
        </span>
        
        <button
          onClick={onRemove}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          title="Remove from review list"
        >
          ✕
        </button>
      </div>
      
      {/* Mistake */}
      <div 
        style={{ cursor: 'pointer' }}
        onClick={() => setRevealed(!revealed)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{
              color: '#fafafa',
              margin: 0,
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {mistakeData.mistake}
            </p>
            
            {!revealed && (
              <p style={{
                color: '#6366f1',
                margin: '8px 0 0 0',
                fontSize: '14px'
              }}>
                Click to reveal explanation →
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Revealed Content */}
      {revealed && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #3f3f46'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{
              color: '#ef4444',
              fontWeight: 600,
              margin: '0 0 6px 0',
              fontSize: '14px'
            }}>
              ❌ Why this is wrong:
            </p>
            <p style={{
              color: '#d4d4d8',
              margin: 0,
              lineHeight: '1.6',
              paddingLeft: '20px'
            }}>
              {mistakeData.why_wrong}
            </p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              color: '#10b981',
              fontWeight: 600,
              margin: '0 0 6px 0',
              fontSize: '14px'
            }}>
              ✅ Correct understanding:
            </p>
            <p style={{
              color: '#d4d4d8',
              margin: 0,
              lineHeight: '1.6',
              paddingLeft: '20px'
            }}>
              {mistakeData.correct}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => setRevealed(false)}
              style={{
                background: 'transparent',
                border: '1px solid #3f3f46',
                color: '#a1a1aa',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Hide
            </button>
            
            <button
              onClick={onMastered}
              style={{
                background: '#10b981',
                border: 'none',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ✓ Got it! Mark as Mastered
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Weak Spots Review Component
const WeakSpotsReview = ({ lessons }) => {
  const [weakSpots, setWeakSpots] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or specific domain
  
  // Build weak spots list with full data
  useEffect(() => {
    const weakIds = getStoredSet(WEAK_SPOTS_KEY);
    const spots = [];
    
    weakIds.forEach(id => {
      const { lessonId, sectionIndex, mistakeIndex } = parseMistakeId(id);
      
      // Find the lesson
      const lesson = lessons.find(l => l.lesson_id === lessonId);
      if (!lesson) return;
      
      // Find the section
      const section = lesson.sections?.[sectionIndex];
      if (!section) return;
      
      // Find the mistake
      const mistake = section.memory_hooks?.common_mistakes?.[mistakeIndex];
      if (!mistake) return;
      
      spots.push({
        id,
        lessonId,
        sectionIndex,
        mistakeIndex,
        lessonTitle: lesson.title,
        sectionTitle: section.title,
        domain: lesson.domain,
        mistakeData: mistake
      });
    });
    
    // Sort by domain, then lesson
    spots.sort((a, b) => {
      if (a.domain !== b.domain) return a.domain - b.domain;
      return a.lessonId.localeCompare(b.lessonId);
    });
    
    setWeakSpots(spots);
  }, [lessons]);
  
  const handleMastered = (id) => {
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    const mastered = getStoredSet(MASTERED_KEY);
    
    weak.delete(id);
    mastered.add(id);
    
    saveStoredSet(WEAK_SPOTS_KEY, weak);
    saveStoredSet(MASTERED_KEY, mastered);
    
    setWeakSpots(prev => prev.filter(s => s.id !== id));
  };
  
  const handleRemove = (id) => {
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    weak.delete(id);
    saveStoredSet(WEAK_SPOTS_KEY, weak);
    setWeakSpots(prev => prev.filter(s => s.id !== id));
  };
  
  const handleClearAll = () => {
    if (window.confirm('Clear all weak spots? This cannot be undone.')) {
      localStorage.removeItem(WEAK_SPOTS_KEY);
      setWeakSpots([]);
    }
  };
  
  // Get unique domains for filter
  const domains = [...new Set(weakSpots.map(s => s.domain))].sort();
  
  // Filter spots
  const filteredSpots = filter === 'all' 
    ? weakSpots 
    : weakSpots.filter(s => s.domain === parseInt(filter));
  
  // Domain colors
  const domainColors = {
    1: '#6366f1',
    2: '#f59e0b',
    3: '#10b981',
    4: '#8b5cf6',
    5: '#ec4899'
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          color: '#fafafa',
          margin: '0 0 8px 0',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>📚</span>
          Weak Spots Review
        </h1>
        <p style={{
          color: '#a1a1aa',
          margin: 0,
          fontSize: '16px'
        }}>
          Focus your study on areas that need more attention
        </p>
      </div>
      
      {/* Stats Bar */}
      <div style={{
        background: '#18181b',
        border: '1px solid #3f3f46',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            color: '#ef4444',
            fontSize: '32px',
            fontWeight: 700
          }}>
            {weakSpots.length}
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '14px' }}>
            Items to Review
          </div>
        </div>
        
        {/* Domain Breakdown */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {domains.map(d => (
            <div key={d} style={{ textAlign: 'center' }}>
              <div style={{
                color: domainColors[d],
                fontSize: '20px',
                fontWeight: 600
              }}>
                {weakSpots.filter(s => s.domain === d).length}
              </div>
              <div style={{ color: '#71717a', fontSize: '12px' }}>
                D{d}
              </div>
            </div>
          ))}
        </div>
        
        {weakSpots.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              background: 'transparent',
              border: '1px solid #3f3f46',
              color: '#71717a',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Filter */}
      {domains.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              background: filter === 'all' ? '#3f3f46' : 'transparent',
              border: '1px solid #3f3f46',
              color: filter === 'all' ? '#fafafa' : '#a1a1aa',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            All ({weakSpots.length})
          </button>
          
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d.toString())}
              style={{
                background: filter === d.toString() ? domainColors[d] : 'transparent',
                border: `1px solid ${domainColors[d]}`,
                color: filter === d.toString() ? '#fff' : domainColors[d],
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Domain {d} ({weakSpots.filter(s => s.domain === d).length})
            </button>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {filteredSpots.length === 0 && (
        <div style={{
          background: '#18181b',
          border: '1px solid #3f3f46',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ color: '#fafafa', margin: '0 0 8px 0' }}>
            {weakSpots.length === 0 ? 'No Weak Spots!' : 'No items in this filter'}
          </h3>
          <p style={{ color: '#a1a1aa', margin: 0 }}>
            {weakSpots.length === 0 
              ? 'Start studying lessons and mark items you need to review.'
              : 'Try selecting a different domain filter.'}
          </p>
        </div>
      )}
      
      {/* Review Cards */}
      {filteredSpots.map(spot => (
        <ReviewCard
          key={spot.id}
          mistakeId={spot.id}
          mistakeData={spot.mistakeData}
          onMastered={() => handleMastered(spot.id)}
          onRemove={() => handleRemove(spot.id)}
        />
      ))}
      
      {/* Completion Message */}
      {filteredSpots.length > 0 && filteredSpots.length <= 3 && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <p style={{ color: '#10b981', margin: 0 }}>
            Almost there! Just {filteredSpots.length} more to master! 💪
          </p>
        </div>
      )}
    </div>
  );
};

export default WeakSpotsReview;
