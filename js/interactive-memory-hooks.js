/**
 * Interactive Memory Hooks System
 * Vanilla JavaScript implementation for Security+ Training Platform
 * 
 * Features:
 * - Collapsible mistake cards with click-to-reveal
 * - Self-check buttons (Yes I knew / No I didn't)
 * - Progress tracking via localStorage
 * - Mnemonic and Analogy display
 * - Weak spots aggregation
 */

(function() {
    'use strict';
    
    // Storage keys
    const STORAGE_KEYS = {
        WEAK_SPOTS: 'secplus_weak_spots',
        MASTERED: 'secplus_mastered'
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Helper Functions
    // ═══════════════════════════════════════════════════════════════════════════
    
    function getStoredSet(key) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
            return new Set();
        }
    }
    
    function saveStoredSet(key, set) {
        try {
            localStorage.setItem(key, JSON.stringify([...set]));
        } catch (e) {
            console.warn('Error saving to localStorage:', e);
        }
    }
    
    function escapeHtmlSafe(str) {
        if (!str) return '';
        if (typeof window.escapeHtml === 'function') {
            return window.escapeHtml(str);
        }
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Mistake Card Status Management
    // ═══════════════════════════════════════════════════════════════════════════
    
    function getMistakeStatus(mistakeId) {
        const mastered = getStoredSet(STORAGE_KEYS.MASTERED);
        const weak = getStoredSet(STORAGE_KEYS.WEAK_SPOTS);
        
        if (mastered.has(mistakeId)) return 'mastered';
        if (weak.has(mistakeId)) return 'weak';
        return null;
    }
    
    function markAsMastered(mistakeId) {
        const mastered = getStoredSet(STORAGE_KEYS.MASTERED);
        const weak = getStoredSet(STORAGE_KEYS.WEAK_SPOTS);
        
        mastered.add(mistakeId);
        weak.delete(mistakeId);
        
        saveStoredSet(STORAGE_KEYS.MASTERED, mastered);
        saveStoredSet(STORAGE_KEYS.WEAK_SPOTS, weak);
        
        return 'mastered';
    }
    
    function markAsWeak(mistakeId) {
        const mastered = getStoredSet(STORAGE_KEYS.MASTERED);
        const weak = getStoredSet(STORAGE_KEYS.WEAK_SPOTS);
        
        weak.add(mistakeId);
        mastered.delete(mistakeId);
        
        saveStoredSet(STORAGE_KEYS.WEAK_SPOTS, weak);
        saveStoredSet(STORAGE_KEYS.MASTERED, mastered);
        
        return 'weak';
    }
    
    function resetMistakeStatus(mistakeId) {
        const mastered = getStoredSet(STORAGE_KEYS.MASTERED);
        const weak = getStoredSet(STORAGE_KEYS.WEAK_SPOTS);
        
        mastered.delete(mistakeId);
        weak.delete(mistakeId);
        
        saveStoredSet(STORAGE_KEYS.MASTERED, mastered);
        saveStoredSet(STORAGE_KEYS.WEAK_SPOTS, weak);
        
        return null;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Progress Calculation
    // ═══════════════════════════════════════════════════════════════════════════
    
    function calculateProgress(lessonId, sectionIndex, totalMistakes) {
        const mastered = getStoredSet(STORAGE_KEYS.MASTERED);
        const weak = getStoredSet(STORAGE_KEYS.WEAK_SPOTS);
        
        const prefix = `${lessonId}-${sectionIndex}`;
        let masteredCount = 0;
        let weakCount = 0;
        
        mastered.forEach(id => {
            if (id.startsWith(prefix)) masteredCount++;
        });
        weak.forEach(id => {
            if (id.startsWith(prefix)) weakCount++;
        });
        
        return {
            mastered: masteredCount,
            weak: weakCount,
            untested: totalMistakes - masteredCount - weakCount,
            percentage: totalMistakes > 0 ? Math.round((masteredCount / totalMistakes) * 100) : 0
        };
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // UI Update Functions
    // ═══════════════════════════════════════════════════════════════════════════
    
    function updateMistakeCardUI(mistakeId, status) {
        const card = document.querySelector(`[data-mistake-id="${mistakeId}"]`);
        if (!card) return;
        
        // Update card class
        card.classList.remove('mastered', 'weak');
        if (status) {
            card.classList.add(status);
        }
        
        // Update badge
        const badgeContainer = card.querySelector('.mistake-status-container');
        if (badgeContainer) {
            if (status === 'mastered') {
                badgeContainer.innerHTML = '<span class="mistake-status-badge mastered">✓ Mastered</span>';
            } else if (status === 'weak') {
                badgeContainer.innerHTML = '<span class="mistake-status-badge weak">Review Needed</span>';
            } else {
                badgeContainer.innerHTML = '';
            }
        }
        
        // Update buttons
        const knewBtn = card.querySelector('.btn-knew');
        const didntKnowBtn = card.querySelector('.btn-didnt-know');
        const resetBtn = card.querySelector('.btn-reset');
        
        if (knewBtn) {
            knewBtn.classList.toggle('active', status === 'mastered');
        }
        if (didntKnowBtn) {
            didntKnowBtn.classList.toggle('active', status === 'weak');
        }
        if (resetBtn) {
            resetBtn.style.display = status ? 'inline-block' : 'none';
        }
        
        // Update progress bar
        const section = card.closest('.memory-hooks-section');
        if (section) {
            const lessonId = section.dataset.lessonId;
            const sectionIndex = section.dataset.sectionIndex;
            const totalMistakes = parseInt(section.dataset.totalMistakes || '0');
            updateProgressBar(section, lessonId, sectionIndex, totalMistakes);
        }
    }
    
    function updateProgressBar(container, lessonId, sectionIndex, totalMistakes) {
        const progressContainer = container.querySelector('.memory-hooks-progress');
        if (!progressContainer || totalMistakes === 0) return;
        
        const progress = calculateProgress(lessonId, sectionIndex, totalMistakes);
        
        // Update percentage text
        const percentText = progressContainer.querySelector('.progress-percent');
        if (percentText) {
            percentText.textContent = `${progress.percentage}% Mastered`;
        }
        
        // Update progress bar segments
        const masteredBar = progressContainer.querySelector('.progress-mastered');
        const weakBar = progressContainer.querySelector('.progress-weak');
        
        if (masteredBar) {
            masteredBar.style.width = `${(progress.mastered / totalMistakes) * 100}%`;
        }
        if (weakBar) {
            weakBar.style.width = `${(progress.weak / totalMistakes) * 100}%`;
        }
        
        // Update legend
        const legendMastered = progressContainer.querySelector('.legend-mastered');
        const legendWeak = progressContainer.querySelector('.legend-weak');
        const legendUntested = progressContainer.querySelector('.legend-untested');
        
        if (legendMastered) legendMastered.textContent = `● ${progress.mastered} Mastered`;
        if (legendWeak) legendWeak.textContent = `● ${progress.weak} Review`;
        if (legendUntested) legendUntested.textContent = `● ${progress.untested} Not Tested`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Event Handlers
    // ═══════════════════════════════════════════════════════════════════════════
    
    function handleMistakeToggle(e) {
        const header = e.currentTarget;
        const card = header.closest('.mistake-card');
        const explanation = card.querySelector('.mistake-explanation');
        const toggle = card.querySelector('.mistake-toggle');
        
        if (explanation) {
            const isVisible = explanation.style.display !== 'none';
            explanation.style.display = isVisible ? 'none' : 'block';
            if (toggle) {
                toggle.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        }
    }
    
    function handleKnewClick(e) {
        e.stopPropagation();
        const mistakeId = e.currentTarget.dataset.mistakeId;
        const newStatus = markAsMastered(mistakeId);
        updateMistakeCardUI(mistakeId, newStatus);
        
        // Show feedback
        if (window.notify) {
            window.notify.success('Marked as mastered!', 1500);
        }
    }
    
    function handleDidntKnowClick(e) {
        e.stopPropagation();
        const mistakeId = e.currentTarget.dataset.mistakeId;
        const newStatus = markAsWeak(mistakeId);
        updateMistakeCardUI(mistakeId, newStatus);
        
        // Show feedback
        if (window.notify) {
            window.notify.warning('Added to review list', 1500);
        }
    }
    
    function handleResetClick(e) {
        e.stopPropagation();
        const mistakeId = e.currentTarget.dataset.mistakeId;
        const newStatus = resetMistakeStatus(mistakeId);
        updateMistakeCardUI(mistakeId, newStatus);
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Render Functions
    // ═══════════════════════════════════════════════════════════════════════════
    
    function renderMnemonicCard(mnemonic) {
        if (!mnemonic) return '';
        
        return `
            <div class="mnemonic-card">
                <div class="mnemonic-label">
                    <span>🧠</span> Memory Trick
                </div>
                <p class="mnemonic-text">${escapeHtmlSafe(mnemonic)}</p>
            </div>
        `;
    }
    
    function renderAnalogyCard(analogy) {
        if (!analogy) return '';
        
        // Handle string format (simple analogy)
        if (typeof analogy === 'string') {
            return `
                <div class="analogy-card">
                    <div class="analogy-label">
                        <span>💡</span> Think of it like...
                    </div>
                    <p class="analogy-text">${escapeHtmlSafe(analogy)}</p>
                </div>
            `;
        }
        
        // Handle object format with concept and optional mapping/explanation
        if (typeof analogy === 'object') {
            const concept = analogy.concept || '';
            const explanation = analogy.explanation || '';
            const mapping = analogy.mapping || [];
            
            let mappingHtml = '';
            if (mapping.length > 0) {
                mappingHtml = `
                    <div class="analogy-mapping">
                        ${mapping.map(m => `
                            <div class="mapping-item">
                                <strong>${escapeHtmlSafe(m.category || m.type || m.item || '')}</strong>
                                <span class="mapping-equiv">→ ${escapeHtmlSafe(m.restaurant_equivalent || m.home_equivalent || m.equivalent || m.analogy || '')}</span>
                                ${m.explanation ? `<span class="mapping-explain">(${escapeHtmlSafe(m.explanation)})</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            return `
                <div class="analogy-card">
                    <div class="analogy-label">
                        <span>💡</span> Think of it like...
                    </div>
                    ${concept ? `<p class="analogy-concept-text">${escapeHtmlSafe(concept)}</p>` : ''}
                    ${explanation ? `<p class="analogy-text">${escapeHtmlSafe(explanation)}</p>` : ''}
                    ${mappingHtml}
                </div>
            `;
        }
        
        return '';
    }
    
    function renderProgressBar(lessonId, sectionIndex, totalMistakes) {
        if (totalMistakes === 0) return '';
        
        const progress = calculateProgress(lessonId, sectionIndex, totalMistakes);
        
        return `
            <div class="memory-hooks-progress">
                <div class="progress-header">
                    <span class="progress-label">Common Mistakes Progress</span>
                    <span class="progress-percent">${progress.percentage}% Mastered</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-mastered" style="width: ${(progress.mastered / totalMistakes) * 100}%"></div>
                    <div class="progress-weak" style="width: ${(progress.weak / totalMistakes) * 100}%"></div>
                </div>
                <div class="progress-legend">
                    <span class="legend-mastered">● ${progress.mastered} Mastered</span>
                    <span class="legend-weak">● ${progress.weak} Review</span>
                    <span class="legend-untested">● ${progress.untested} Not Tested</span>
                </div>
            </div>
        `;
    }
    
    function renderMistakeCard(mistake, lessonId, sectionIndex, mistakeIndex) {
        const mistakeId = `${lessonId}-${sectionIndex}-${mistakeIndex}`;
        const status = getMistakeStatus(mistakeId);
        
        const statusClass = status || '';
        const statusBadge = status === 'mastered' 
            ? '<span class="mistake-status-badge mastered">✓ Mastered</span>'
            : status === 'weak'
            ? '<span class="mistake-status-badge weak">Review Needed</span>'
            : '';
        
        return `
            <div class="mistake-card ${statusClass}" data-mistake-id="${mistakeId}">
                <div class="mistake-header">
                    <div class="mistake-text">
                        <span class="mistake-icon">⚠️</span>
                        <span class="mistake-content">${escapeHtmlSafe(mistake.mistake)}</span>
                    </div>
                    <div class="mistake-header-right">
                        <div class="mistake-status-container">${statusBadge}</div>
                        <span class="mistake-toggle">▼</span>
                    </div>
                </div>
                
                <div class="mistake-explanation" style="display: none;">
                    <div class="mistake-why-wrong">
                        <div class="mistake-label wrong">❌ Why this is wrong:</div>
                        <p>${escapeHtmlSafe(mistake.why_wrong || 'No explanation provided.')}</p>
                    </div>
                    
                    <div class="mistake-correct">
                        <div class="mistake-label correct">✅ Correct understanding:</div>
                        <p>${escapeHtmlSafe(mistake.correct || 'Review the correct concept.')}</p>
                    </div>
                    
                    <div class="self-check">
                        <span class="self-check-label">Did you already know this?</span>
                        <div class="self-check-buttons">
                            <button class="btn-reset" data-mistake-id="${mistakeId}" 
                                    style="display: ${status ? 'inline-block' : 'none'}">
                                Reset
                            </button>
                            <button class="btn-knew ${status === 'mastered' ? 'active' : ''}" 
                                    data-mistake-id="${mistakeId}">
                                ✓ Yes, I knew this
                            </button>
                            <button class="btn-didnt-know ${status === 'weak' ? 'active' : ''}" 
                                    data-mistake-id="${mistakeId}">
                                ✗ No, review needed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderMemoryHooks(memoryHooks, lessonId, sectionIndex) {
        if (!memoryHooks) return '';
        
        const { mnemonic, analogy, common_mistakes = [] } = memoryHooks;
        
        // Don't render if no content
        if (!mnemonic && !analogy && common_mistakes.length === 0) {
            return '';
        }
        
        const mistakesHtml = common_mistakes.length > 0 ? `
            <div class="common-mistakes-section">
                <div class="common-mistakes-header">
                    <span class="cm-icon">⚠️</span>
                    <h5 class="cm-title">Common Mistakes (${common_mistakes.length})</h5>
                </div>
                <p class="cm-instruction">Click each mistake to reveal why it's wrong and test your knowledge.</p>
                
                ${renderProgressBar(lessonId, sectionIndex, common_mistakes.length)}
                
                <div class="mistakes-list">
                    ${common_mistakes.map((mistake, index) => 
                        renderMistakeCard(mistake, lessonId, sectionIndex, index)
                    ).join('')}
                </div>
            </div>
        ` : '';
        
        return `
            <div class="memory-hooks-section" 
                 data-lesson-id="${lessonId}" 
                 data-section-index="${sectionIndex}"
                 data-total-mistakes="${common_mistakes.length}">
                <div class="memory-hooks-header">
                    <span class="mh-icon">🧠</span>
                    <h4 class="mh-title">Memory Hooks</h4>
                </div>
                
                ${renderMnemonicCard(mnemonic)}
                ${renderAnalogyCard(analogy)}
                ${mistakesHtml}
            </div>
        `;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Initialization
    // ═══════════════════════════════════════════════════════════════════════════
    
    function initMemoryHooksListeners(container) {
        if (!container) container = document;
        
        // Mistake card toggle listeners
        container.querySelectorAll('.mistake-header').forEach(header => {
            header.addEventListener('click', handleMistakeToggle);
        });
        
        // Self-check button listeners
        container.querySelectorAll('.btn-knew').forEach(btn => {
            btn.addEventListener('click', handleKnewClick);
        });
        
        container.querySelectorAll('.btn-didnt-know').forEach(btn => {
            btn.addEventListener('click', handleDidntKnowClick);
        });
        
        container.querySelectorAll('.btn-reset').forEach(btn => {
            btn.addEventListener('click', handleResetClick);
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Weak Spots Review Functions
    // ═══════════════════════════════════════════════════════════════════════════
    
    function getAllWeakSpots() {
        return getStoredSet(STORAGE_KEYS.WEAK_SPOTS);
    }
    
    function getAllMastered() {
        return getStoredSet(STORAGE_KEYS.MASTERED);
    }
    
    function getWeakSpotDetails(lessons) {
        const weakIds = getAllWeakSpots();
        const details = [];
        
        weakIds.forEach(id => {
            const parts = id.split('-');
            const mistakeIndex = parseInt(parts.pop());
            const sectionIndex = parseInt(parts.pop());
            const lessonId = parts.join('-');
            
            // Find the lesson
            const lesson = lessons.find(l => l.lesson_id === lessonId || l.id === lessonId);
            if (!lesson) return;
            
            // Find section and mistake
            const sections = lesson.sections || lesson.content?.sections || [];
            const section = sections[sectionIndex];
            if (!section) return;
            
            const memoryHooks = section.memory_hooks || section.memoryHooks;
            const mistakes = memoryHooks?.common_mistakes || [];
            const mistake = mistakes[mistakeIndex];
            if (!mistake) return;
            
            details.push({
                id,
                lessonId,
                lessonTitle: lesson.title,
                sectionIndex,
                sectionTitle: section.title,
                domain: lesson.domain,
                mistake
            });
        });
        
        // Sort by domain
        details.sort((a, b) => {
            if (a.domain !== b.domain) return a.domain - b.domain;
            return a.lessonId.localeCompare(b.lessonId);
        });
        
        return details;
    }
    
    function clearAllWeakSpots() {
        localStorage.removeItem(STORAGE_KEYS.WEAK_SPOTS);
    }
    
    function getWeakSpotCount() {
        return getAllWeakSpots().size;
    }
    
    function getMasteredCount() {
        return getAllMastered().size;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.MemoryHooks = {
        // Rendering
        render: renderMemoryHooks,
        renderMnemonicCard,
        renderAnalogyCard,
        renderMistakeCard,
        renderProgressBar,
        
        // Initialization
        initListeners: initMemoryHooksListeners,
        
        // Status management
        getMistakeStatus,
        markAsMastered,
        markAsWeak,
        resetMistakeStatus,
        
        // Progress
        calculateProgress,
        
        // Weak spots
        getAllWeakSpots,
        getAllMastered,
        getWeakSpotDetails,
        getWeakSpotCount,
        getMasteredCount,
        clearAllWeakSpots,
        
        // Constants
        STORAGE_KEYS
    };
    
    console.log('✅ Interactive Memory Hooks system loaded');
    
})();
