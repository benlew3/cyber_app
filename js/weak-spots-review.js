/**
 * Weak Spots Review System
 * Security+ Training Platform
 * 
 * Provides a dedicated page to review all items marked as "Review Needed"
 */

(function() {
    'use strict';
    
    // Domain colors for filtering
    const DOMAIN_COLORS = {
        1: '#6366f1',
        2: '#f59e0b',
        3: '#10b981',
        4: '#8b5cf6',
        5: '#ec4899'
    };
    
    // Current filter state
    let currentFilter = 'all';
    let revealedCards = new Set();
    
    /**
     * Get all lessons from APP content
     */
    function getAllLessons() {
        if (window.APP && window.APP.content && window.APP.content.lessons) {
            return window.APP.content.lessons;
        }
        if (window.ALL_LESSONS) {
            return window.ALL_LESSONS;
        }
        return [];
    }
    
    /**
     * Show the Weak Spots Review page
     */
    function showWeakSpotsReview() {
        console.log('📚 Loading Weak Spots Review...');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const content = document.getElementById('content');
        if (!content) return;
        
        // Get weak spots details
        const lessons = getAllLessons();
        const weakSpots = window.MemoryHooks ? window.MemoryHooks.getWeakSpotDetails(lessons) : [];
        
        // Get unique domains
        const domains = [...new Set(weakSpots.map(s => s.domain))].sort();
        
        // Filter spots
        const filteredSpots = currentFilter === 'all' 
            ? weakSpots 
            : weakSpots.filter(s => s.domain === parseInt(currentFilter));
        
        // Calculate stats per domain
        const domainCounts = {};
        domains.forEach(d => {
            domainCounts[d] = weakSpots.filter(s => s.domain === d).length;
        });
        
        content.innerHTML = `
            <div class="container weak-spots-page">
                <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                
                <div class="weak-spots-header">
                    <h1 class="weak-spots-title">
                        <span>📚</span>
                        Weak Spots Review
                    </h1>
                    <p class="weak-spots-subtitle">
                        Focus your study on areas that need more attention
                    </p>
                </div>
                
                <!-- Stats Bar -->
                <div class="weak-spots-stats">
                    <div>
                        <div class="weak-spots-count">${weakSpots.length}</div>
                        <div class="weak-spots-count-label">Items to Review</div>
                    </div>
                    
                    <div class="domain-breakdown">
                        ${domains.map(d => `
                            <div class="domain-stat">
                                <div class="domain-stat-value" style="color: ${DOMAIN_COLORS[d]}">${domainCounts[d]}</div>
                                <div class="domain-stat-label">D${d}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${weakSpots.length > 0 ? `
                        <button class="btn" onclick="WeakSpotsReview.clearAll()" 
                                style="border-color: #ef4444; color: #ef4444;">
                            Clear All
                        </button>
                    ` : ''}
                </div>
                
                <!-- Filters -->
                ${domains.length > 1 ? `
                    <div class="weak-spots-filter">
                        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" 
                                onclick="WeakSpotsReview.setFilter('all')">
                            All (${weakSpots.length})
                        </button>
                        ${domains.map(d => `
                            <button class="filter-btn ${currentFilter === String(d) ? 'active' : ''}" 
                                    onclick="WeakSpotsReview.setFilter('${d}')"
                                    style="border-color: ${DOMAIN_COLORS[d]}; ${currentFilter === String(d) ? `background: ${DOMAIN_COLORS[d]}; color: #fff;` : `color: ${DOMAIN_COLORS[d]};`}">
                                Domain ${d} (${domainCounts[d]})
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Empty State -->
                ${filteredSpots.length === 0 ? `
                    <div class="weak-spots-empty">
                        <div class="empty-icon">🎉</div>
                        <h3 class="empty-title">
                            ${weakSpots.length === 0 ? 'No Weak Spots!' : 'No items in this filter'}
                        </h3>
                        <p class="empty-message">
                            ${weakSpots.length === 0 
                                ? 'Start studying lessons and mark items you need to review.'
                                : 'Try selecting a different domain filter.'}
                        </p>
                        ${weakSpots.length === 0 ? `
                            <button class="btn btn-primary" onclick="showAllLessons()" style="margin-top: 20px;">
                                📚 Start Learning
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
                
                <!-- Review Cards -->
                <div id="weak-spots-list">
                    ${filteredSpots.map(spot => renderReviewCard(spot)).join('')}
                </div>
                
                <!-- Almost Done Message -->
                ${filteredSpots.length > 0 && filteredSpots.length <= 3 ? `
                    <div class="almost-done-message">
                        <p>Almost there! Just ${filteredSpots.length} more to master! 💪</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Update app state
        if (window.APP) {
            window.APP.state.currentView = 'weak-spots-review';
        }
        
        // Initialize listeners
        initReviewCardListeners();
    }
    
    /**
     * Render a single review card
     */
    function renderReviewCard(spot) {
        const isRevealed = revealedCards.has(spot.id);
        
        return `
            <div class="review-card" data-spot-id="${spot.id}">
                <div class="review-card-source">
                    <span class="review-card-badge">
                        ${spot.lessonId} • Section ${spot.sectionIndex + 1}
                    </span>
                    <button class="review-card-close" onclick="WeakSpotsReview.removeSpot('${spot.id}')" title="Remove from review list">
                        ✕
                    </button>
                </div>
                
                <div class="review-card-content" onclick="WeakSpotsReview.toggleReveal('${spot.id}')">
                    <div style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                        <span style="font-size: 20px;">⚠️</span>
                        <div style="flex: 1;">
                            <p style="color: #fafafa; margin: 0; font-weight: 500; font-size: 16px; line-height: 1.5;">
                                ${escapeHtmlSafe(spot.mistake.mistake)}
                            </p>
                            ${!isRevealed ? `
                                <p style="color: #6366f1; margin: 8px 0 0 0; font-size: 14px;">
                                    Click to reveal explanation →
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                ${isRevealed ? `
                    <div class="review-card-explanation" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #3f3f46;">
                        <div style="margin-bottom: 16px;">
                            <p style="color: #ef4444; font-weight: 600; margin: 0 0 6px 0; font-size: 14px;">
                                ❌ Why this is wrong:
                            </p>
                            <p style="color: #d4d4d8; margin: 0; line-height: 1.6; padding-left: 20px;">
                                ${escapeHtmlSafe(spot.mistake.why_wrong || 'No explanation provided.')}
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="color: #10b981; font-weight: 600; margin: 0 0 6px 0; font-size: 14px;">
                                ✅ Correct understanding:
                            </p>
                            <p style="color: #d4d4d8; margin: 0; line-height: 1.6; padding-left: 20px;">
                                ${escapeHtmlSafe(spot.mistake.correct || 'Review the correct concept.')}
                            </p>
                        </div>
                        
                        <div class="review-card-actions">
                            <button class="btn-hide" onclick="WeakSpotsReview.toggleReveal('${spot.id}')">
                                Hide
                            </button>
                            <button class="btn-mastered" onclick="WeakSpotsReview.markMastered('${spot.id}')">
                                ✓ Got it! Mark as Mastered
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Escape HTML safely
     */
    function escapeHtmlSafe(str) {
        if (!str) return '';
        if (typeof window.escapeHtml === 'function') {
            return window.escapeHtml(str);
        }
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Initialize listeners for review cards
     */
    function initReviewCardListeners() {
        // Listeners are handled via onclick attributes for simplicity
    }
    
    /**
     * Set the filter and re-render
     */
    function setFilter(filter) {
        currentFilter = filter;
        showWeakSpotsReview();
    }
    
    /**
     * Toggle reveal state of a card
     */
    function toggleReveal(spotId) {
        if (revealedCards.has(spotId)) {
            revealedCards.delete(spotId);
        } else {
            revealedCards.add(spotId);
        }
        
        // Re-render just this card
        const cardElement = document.querySelector(`[data-spot-id="${spotId}"]`);
        if (cardElement) {
            const lessons = getAllLessons();
            const weakSpots = window.MemoryHooks ? window.MemoryHooks.getWeakSpotDetails(lessons) : [];
            const spot = weakSpots.find(s => s.id === spotId);
            
            if (spot) {
                cardElement.outerHTML = renderReviewCard(spot);
            }
        }
    }
    
    /**
     * Mark a spot as mastered and remove from list
     */
    function markMastered(spotId) {
        if (window.MemoryHooks) {
            window.MemoryHooks.markAsMastered(spotId);
        }
        
        // Remove card with animation
        const cardElement = document.querySelector(`[data-spot-id="${spotId}"]`);
        if (cardElement) {
            cardElement.style.transition = 'all 0.3s ease';
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                revealedCards.delete(spotId);
                showWeakSpotsReview();
            }, 300);
        }
        
        // Show notification
        if (window.notify) {
            window.notify.success('Marked as mastered! 🎉', 2000);
        }
    }
    
    /**
     * Remove a spot from review list
     */
    function removeSpot(spotId) {
        if (window.MemoryHooks) {
            window.MemoryHooks.resetMistakeStatus(spotId);
        }
        
        // Remove card with animation
        const cardElement = document.querySelector(`[data-spot-id="${spotId}"]`);
        if (cardElement) {
            cardElement.style.transition = 'all 0.3s ease';
            cardElement.style.opacity = '0';
            cardElement.style.height = '0';
            cardElement.style.padding = '0';
            cardElement.style.margin = '0';
            
            setTimeout(() => {
                revealedCards.delete(spotId);
                showWeakSpotsReview();
            }, 300);
        }
    }
    
    /**
     * Clear all weak spots
     */
    function clearAll() {
        if (!confirm('Clear all weak spots? This cannot be undone.')) {
            return;
        }
        
        if (window.MemoryHooks) {
            window.MemoryHooks.clearAllWeakSpots();
        }
        
        revealedCards.clear();
        showWeakSpotsReview();
        
        if (window.notify) {
            window.notify.info('All weak spots cleared', 2000);
        }
    }
    
    /**
     * Get weak spots count for navigation badge
     */
    function getWeakSpotsCount() {
        if (window.MemoryHooks) {
            return window.MemoryHooks.getWeakSpotCount();
        }
        return 0;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.WeakSpotsReview = {
        show: showWeakSpotsReview,
        setFilter,
        toggleReveal,
        markMastered,
        removeSpot,
        clearAll,
        getCount: getWeakSpotsCount
    };
    
    // Also make showWeakSpotsReview globally available
    window.showWeakSpotsReview = showWeakSpotsReview;
    
    console.log('✅ Weak Spots Review system loaded');
    
})();
