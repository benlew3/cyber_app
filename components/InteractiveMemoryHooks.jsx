import React, { useState, useEffect } from 'react';

/**
 * Interactive Memory Hooks Component
 * 
 * Features:
 * - Collapsible mistake cards (click to reveal explanation)
 * - Self-check buttons (Yes I knew / No I didn't)
 * - Progress tracking via localStorage
 * - Visual feedback on mastery status
 * - Mnemonic and Analogy display
 */

// Storage key for tracking weak spots
const WEAK_SPOTS_KEY = 'secplus_weak_spots';
const MASTERED_KEY = 'secplus_mastered';

// Helper functions for localStorage
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

// Individual Mistake Card Component
const MistakeCard = ({ mistake, lessonId, sectionIndex, mistakeIndex }) => {
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState(null); // null | 'mastered' | 'weak'
  
  const mistakeId = `${lessonId}-${sectionIndex}-${mistakeIndex}`;
  
  // Load status on mount
  useEffect(() => {
    const mastered = getStoredSet(MASTERED_KEY);
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    
    if (mastered.has(mistakeId)) {
      setStatus('mastered');
    } else if (weak.has(mistakeId)) {
      setStatus('weak');
    }
  }, [mistakeId]);
  
  const handleKnew = () => {
    // Mark as mastered
    const mastered = getStoredSet(MASTERED_KEY);
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    
    mastered.add(mistakeId);
    weak.delete(mistakeId);
    
    saveStoredSet(MASTERED_KEY, mastered);
    saveStoredSet(WEAK_SPOTS_KEY, weak);
    
    setStatus('mastered');
  };
  
  const handleDidntKnow = () => {
    // Mark as weak spot
    const mastered = getStoredSet(MASTERED_KEY);
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    
    weak.add(mistakeId);
    mastered.delete(mistakeId);
    
    saveStoredSet(WEAK_SPOTS_KEY, weak);
    saveStoredSet(MASTERED_KEY, mastered);
    
    setStatus('weak');
  };
  
  const resetStatus = () => {
    const mastered = getStoredSet(MASTERED_KEY);
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    
    mastered.delete(mistakeId);
    weak.delete(mistakeId);
    
    saveStoredSet(MASTERED_KEY, mastered);
    saveStoredSet(WEAK_SPOTS_KEY, weak);
    
    setStatus(null);
    setRevealed(false);
  };

  return (
    <div 
      style={{
        background: status === 'mastered' ? 'rgba(16, 185, 129, 0.1)' : 
                   status === 'weak' ? 'rgba(239, 68, 68, 0.1)' : 
                   '#27272a',
        border: `1px solid ${
          status === 'mastered' ? '#10b981' : 
          status === 'weak' ? '#ef4444' : 
          '#3f3f46'
        }`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Mistake Header - Always Visible */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          cursor: 'pointer'
        }}
        onClick={() => setRevealed(!revealed)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <span style={{ color: '#fafafa', fontWeight: 500 }}>
            {mistake.mistake}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {status === 'mastered' && (
            <span style={{ 
              background: '#10b981', 
              color: '#fff', 
              padding: '2px 8px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              ✓ Mastered
            </span>
          )}
          {status === 'weak' && (
            <span style={{ 
              background: '#ef4444', 
              color: '#fff', 
              padding: '2px 8px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              Review Needed
            </span>
          )}
          
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '20px',
              cursor: 'pointer',
              transform: revealed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            ▼
          </button>
        </div>
      </div>
      
      {/* Expandable Explanation */}
      {revealed && (
        <div 
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #3f3f46',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {/* Why Wrong */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '6px'
            }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Why this is wrong:</span>
            </div>
            <p style={{ 
              color: '#d4d4d8', 
              margin: 0,
              paddingLeft: '24px',
              lineHeight: '1.6'
            }}>
              {mistake.why_wrong}
            </p>
          </div>
          
          {/* Correct Understanding */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '6px'
            }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Correct understanding:</span>
            </div>
            <p style={{ 
              color: '#d4d4d8', 
              margin: 0,
              paddingLeft: '24px',
              lineHeight: '1.6'
            }}>
              {mistake.correct}
            </p>
          </div>
          
          {/* Self-Check Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px dashed #3f3f46'
          }}>
            <span style={{ color: '#71717a', fontSize: '14px' }}>
              Did you already know this?
            </span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {status && (
                <button
                  onClick={(e) => { e.stopPropagation(); resetStatus(); }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #3f3f46',
                    color: '#71717a',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Reset
                </button>
              )}
              
              <button
                onClick={(e) => { e.stopPropagation(); handleKnew(); }}
                style={{
                  background: status === 'mastered' ? '#10b981' : 'transparent',
                  border: `1px solid ${status === 'mastered' ? '#10b981' : '#10b981'}`,
                  color: status === 'mastered' ? '#fff' : '#10b981',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '13px',
                  transition: 'all 0.2s ease'
                }}
              >
                ✓ Yes, I knew this
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleDidntKnow(); }}
                style={{
                  background: status === 'weak' ? '#ef4444' : 'transparent',
                  border: `1px solid ${status === 'weak' ? '#ef4444' : '#ef4444'}`,
                  color: status === 'weak' ? '#fff' : '#ef4444',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '13px',
                  transition: 'all 0.2s ease'
                }}
              >
                ✗ No, review needed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mnemonic Display Component
const MnemonicCard = ({ mnemonic }) => {
  if (!mnemonic) return null;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
      border: '1px solid #ec4899',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>🧠</span>
        <span style={{ color: '#ec4899', fontWeight: 600 }}>Memory Trick</span>
      </div>
      <p style={{ color: '#fafafa', margin: 0, lineHeight: '1.6' }}>
        {mnemonic}
      </p>
    </div>
  );
};

// Analogy Display Component
const AnalogyCard = ({ analogy }) => {
  if (!analogy) return null;
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(59, 130, 246, 0.1))',
      border: '1px solid #6366f1',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>💡</span>
        <span style={{ color: '#6366f1', fontWeight: 600 }}>Think of it like...</span>
      </div>
      <p style={{ color: '#fafafa', margin: 0, lineHeight: '1.6' }}>
        {analogy}
      </p>
    </div>
  );
};

// Progress Summary Component
const ProgressSummary = ({ totalMistakes, lessonId }) => {
  const [stats, setStats] = useState({ mastered: 0, weak: 0, untested: 0 });
  
  useEffect(() => {
    const mastered = getStoredSet(MASTERED_KEY);
    const weak = getStoredSet(WEAK_SPOTS_KEY);
    
    let masteredCount = 0;
    let weakCount = 0;
    
    // Count items for this lesson
    mastered.forEach(id => {
      if (id.startsWith(lessonId)) masteredCount++;
    });
    weak.forEach(id => {
      if (id.startsWith(lessonId)) weakCount++;
    });
    
    setStats({
      mastered: masteredCount,
      weak: weakCount,
      untested: totalMistakes - masteredCount - weakCount
    });
  }, [totalMistakes, lessonId]);
  
  if (totalMistakes === 0) return null;
  
  const percentMastered = Math.round((stats.mastered / totalMistakes) * 100);
  
  return (
    <div style={{
      background: '#18181b',
      border: '1px solid #3f3f46',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{ color: '#a1a1aa', fontSize: '14px' }}>
          Common Mistakes Progress
        </span>
        <span style={{ color: '#fafafa', fontWeight: 600 }}>
          {percentMastered}% Mastered
        </span>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        height: '8px',
        background: '#27272a',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex'
      }}>
        <div style={{
          width: `${(stats.mastered / totalMistakes) * 100}%`,
          background: '#10b981',
          transition: 'width 0.3s ease'
        }} />
        <div style={{
          width: `${(stats.weak / totalMistakes) * 100}%`,
          background: '#ef4444',
          transition: 'width 0.3s ease'
        }} />
      </div>
      
      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginTop: '10px',
        fontSize: '13px'
      }}>
        <span style={{ color: '#10b981' }}>● {stats.mastered} Mastered</span>
        <span style={{ color: '#ef4444' }}>● {stats.weak} Review Needed</span>
        <span style={{ color: '#71717a' }}>● {stats.untested} Not Tested</span>
      </div>
    </div>
  );
};

// Main Interactive Memory Hooks Component
const InteractiveMemoryHooks = ({ memoryHooks, lessonId, sectionIndex }) => {
  if (!memoryHooks) return null;
  
  const { mnemonic, analogy, common_mistakes = [] } = memoryHooks;
  
  // Don't render if no content
  if (!mnemonic && !analogy && common_mistakes.length === 0) {
    return null;
  }
  
  return (
    <div style={{
      background: '#18181b',
      borderLeft: '4px solid #ec4899',
      borderRadius: '0 8px 8px 0',
      padding: '20px',
      marginTop: '16px'
    }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '20px' }}>🧠</span>
        <h3 style={{ 
          color: '#fafafa', 
          margin: 0,
          fontSize: '18px',
          fontWeight: 600
        }}>
          Memory Hooks
        </h3>
      </div>
      
      {/* Mnemonic */}
      <MnemonicCard mnemonic={mnemonic} />
      
      {/* Analogy */}
      <AnalogyCard analogy={analogy} />
      
      {/* Common Mistakes Section */}
      {common_mistakes.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ color: '#f59e0b', fontSize: '16px' }}>⚠️</span>
            <h4 style={{ 
              color: '#f59e0b', 
              margin: 0,
              fontSize: '16px',
              fontWeight: 600
            }}>
              Common Mistakes ({common_mistakes.length})
            </h4>
          </div>
          
          <p style={{ 
            color: '#71717a', 
            fontSize: '14px', 
            marginBottom: '16px' 
          }}>
            Click each mistake to reveal why it's wrong and test your knowledge.
          </p>
          
          {/* Progress Summary */}
          <ProgressSummary 
            totalMistakes={common_mistakes.length} 
            lessonId={`${lessonId}-${sectionIndex}`}
          />
          
          {/* Mistake Cards */}
          {common_mistakes.map((mistake, index) => (
            <MistakeCard
              key={index}
              mistake={mistake}
              lessonId={lessonId}
              sectionIndex={sectionIndex}
              mistakeIndex={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveMemoryHooks;

// Also export individual components for flexibility
export { MistakeCard, MnemonicCard, AnalogyCard, ProgressSummary };
