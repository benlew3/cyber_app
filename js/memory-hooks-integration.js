/**
 * Memory Hooks Integration for Lesson Viewer
 * Security+ Training Platform
 * 
 * This module integrates the Interactive Memory Hooks system
 * with the existing lesson viewer (both basic and enhanced)
 */

(function() {
    'use strict';
    
    /**
     * Render memory hooks for a lesson section
     * Call this from your lesson viewer after rendering section content
     * 
     * @param {Object} section - The section object containing memory_hooks
     * @param {string} lessonId - The lesson ID (e.g., "D1-LESSON-001")
     * @param {number} sectionIndex - The index of the section
     * @returns {string} HTML string for memory hooks
     */
    function renderSectionMemoryHooks(section, lessonId, sectionIndex) {
        if (!window.MemoryHooks) {
            console.warn('MemoryHooks module not loaded');
            return '';
        }
        
        const memoryHooks = section.memory_hooks || section.memoryHooks;
        if (!memoryHooks) return '';
        
        return window.MemoryHooks.render(memoryHooks, lessonId, sectionIndex);
    }
    
    /**
     * Initialize memory hooks listeners after DOM update
     * Call this after inserting memory hooks HTML into the DOM
     * 
     * @param {HTMLElement} container - Optional container to scope listener initialization
     */
    function initMemoryHooksInSection(container) {
        if (!window.MemoryHooks) {
            console.warn('MemoryHooks module not loaded');
            return;
        }
        
        window.MemoryHooks.initListeners(container);
    }
    
    /**
     * Helper to render a collapsible panel for memory hooks
     * (Alternative display style)
     */
    function renderMemoryHooksPanel(section, lessonId, sectionIndex) {
        const memoryHooks = section.memory_hooks || section.memoryHooks;
        if (!memoryHooks) return '';
        
        const { mnemonic, analogy, common_mistakes = [] } = memoryHooks;
        if (!mnemonic && !analogy && common_mistakes.length === 0) return '';
        
        const content = window.MemoryHooks 
            ? window.MemoryHooks.render(memoryHooks, lessonId, sectionIndex)
            : '';
        
        return `
            <div class="collapsible-panel memory-hooks-panel" data-panel="memory-hooks-${sectionIndex}">
                <div class="collapsible-header" onclick="toggleMemoryHooksPanel(this)">
                    <span class="collapsible-title">
                        <span>🧠</span> Memory Hooks
                        ${common_mistakes.length > 0 ? `<span class="badge">${common_mistakes.length} mistakes</span>` : ''}
                    </span>
                    <span class="collapsible-toggle">▼</span>
                </div>
                <div class="collapsible-content" style="display: none;">
                    ${content}
                </div>
            </div>
        `;
    }
    
    /**
     * Toggle collapsible panel
     */
    window.toggleMemoryHooksPanel = function(header) {
        const panel = header.closest('.collapsible-panel');
        const content = panel.querySelector('.collapsible-content');
        const toggle = panel.querySelector('.collapsible-toggle');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.style.transform = 'rotate(180deg)';
            
            // Initialize listeners when panel is opened
            initMemoryHooksInSection(content);
        } else {
            content.style.display = 'none';
            toggle.style.transform = 'rotate(0deg)';
        }
    };
    
    /**
     * Inject memory hooks into an existing lesson section element
     * 
     * @param {HTMLElement} sectionElement - The DOM element of the section
     * @param {Object} section - The section data
     * @param {string} lessonId - The lesson ID
     * @param {number} sectionIndex - The section index
     */
    function injectMemoryHooks(sectionElement, section, lessonId, sectionIndex) {
        const memoryHooks = section.memory_hooks || section.memoryHooks;
        if (!memoryHooks || !window.MemoryHooks) return;
        
        const html = window.MemoryHooks.render(memoryHooks, lessonId, sectionIndex);
        if (!html) return;
        
        // Find insertion point (after main content, before knowledge check)
        const knowledgeCheck = sectionElement.querySelector('.knowledge-check');
        const container = document.createElement('div');
        container.innerHTML = html;
        
        if (knowledgeCheck) {
            sectionElement.insertBefore(container.firstElementChild, knowledgeCheck);
        } else {
            sectionElement.appendChild(container.firstElementChild);
        }
        
        // Initialize listeners
        initMemoryHooksInSection(sectionElement);
    }
    
    /**
     * Update navigation badge with weak spots count
     */
    function updateWeakSpotsBadge() {
        const count = window.MemoryHooks ? window.MemoryHooks.getWeakSpotCount() : 0;
        
        // Find existing badge or create one
        let badge = document.querySelector('.nav-weak-spots-badge');
        
        if (count > 0) {
            if (!badge) {
                // Try to add badge to navigation
                const navBtn = document.querySelector('[onclick*="showWeakSpotsReview"]');
                if (navBtn) {
                    badge = document.createElement('span');
                    badge.className = 'nav-badge nav-weak-spots-badge';
                    navBtn.appendChild(badge);
                }
            }
            
            if (badge) {
                badge.textContent = count;
                badge.classList.remove('empty');
            }
        } else if (badge) {
            badge.classList.add('empty');
        }
    }
    
    /**
     * Hook into lesson completion to track weak spots
     */
    function onLessonComplete(lessonId) {
        updateWeakSpotsBadge();
        
        // Check if there are weak spots for this lesson
        if (window.MemoryHooks) {
            const weakSpots = window.MemoryHooks.getAllWeakSpots();
            const lessonWeakSpots = [...weakSpots].filter(id => id.startsWith(lessonId));
            
            if (lessonWeakSpots.length > 0 && window.notify) {
                window.notify.warning(
                    `You have ${lessonWeakSpots.length} item(s) to review in this lesson`,
                    3000
                );
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Auto-initialization
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Update badge on page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateWeakSpotsBadge, 1000);
    });
    
    // Update badge periodically (for SPA navigation)
    setInterval(updateWeakSpotsBadge, 5000);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.MemoryHooksIntegration = {
        renderSection: renderSectionMemoryHooks,
        renderPanel: renderMemoryHooksPanel,
        initListeners: initMemoryHooksInSection,
        inject: injectMemoryHooks,
        updateBadge: updateWeakSpotsBadge,
        onLessonComplete
    };
    
    console.log('✅ Memory Hooks Integration loaded');
    
})();
