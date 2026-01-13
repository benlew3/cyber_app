/**
 * App.js Patches for Memory Hooks Integration
 * Security+ Training Platform
 * 
 * This file patches the main app.js to:
 * 1. Add "Weak Spots Review" to navigation
 * 2. Integrate memory hooks rendering in lesson sections
 * 
 * Load this AFTER app.js and the memory hooks modules
 */

(function() {
    'use strict';
    
    console.log('🔧 Memory Hooks patches loading...');
    
    // Wait for DOM and app to be ready
    function waitForApp(callback, maxAttempts = 50) {
        let attempts = 0;
        const check = setInterval(() => {
            attempts++;
            if (window.APP && document.getElementById('content')) {
                clearInterval(check);
                console.log('🔧 App ready, applying Memory Hooks patches...');
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(check);
                console.error('Memory Hooks patches: Timeout waiting for APP');
            }
        }, 100);
    }
    
    // Main initialization
    function applyPatches() {
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 1: Add Weak Spots Review to Navigation Header
    // ═══════════════════════════════════════════════════════════════════════════
    
    const originalCreateHeader = window.createHeader;
    
    window.createHeader = function() {
        console.log('Creating navigation header with Weak Spots button...');
        
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        // Remove existing header
        const existingHeader = document.querySelector('.header-bar');
        if (existingHeader) existingHeader.remove();
        
        // Get weak spots count
        const weakSpotsCount = window.MemoryHooks ? window.MemoryHooks.getWeakSpotCount() : 0;
        const badgeHtml = weakSpotsCount > 0 
            ? `<span class="nav-badge">${weakSpotsCount}</span>` 
            : '';
        
        const header = document.createElement('div');
        header.className = 'header-bar';
        header.innerHTML = `
            <div class="header-brand">
                <span>🛡️</span>
                <span>Security+ v34</span>
            </div>
            <nav class="header-nav">
                <button class="nav-btn" onclick="showDashboard()">🏠 Dashboard</button>
                <button class="nav-btn" onclick="showAllLessons()">📚 Lessons</button>
                <button class="nav-btn" onclick="showAllSimulations()">🎮 Simulations</button>
                <button class="nav-btn" onclick="showAllRemediation()">🔧 Remediation</button>
                <button class="nav-btn" onclick="showAllPBQs()">🖥️ PBQs</button>
                <button class="nav-btn" onclick="showQuizMenu()">📝 Quiz</button>
                <button class="nav-btn" onclick="showGlossary()">📖 Glossary</button>
                <button class="nav-btn" onclick="showWeakSpotsReview()">
                    📚 Weak Spots${badgeHtml}
                </button>
                <button class="nav-btn" onclick="showSecurityTools()">🛠️ Tools</button>
                <button class="nav-btn" onclick="showLinuxSetup()">🐧 Linux</button>
                <button class="nav-btn" onclick="showCareerQuiz()">🎯 Career Quiz</button>
                <button class="nav-btn" onclick="showPracticeExam()">📋 Exam</button>
                <button class="nav-btn" onclick="NotesSystem.showAllNotes()">🗒️ Notes</button>
            </nav>
        `;
        
        mainContent.insertBefore(header, mainContent.firstChild);
        console.log('✅ Header created with Weak Spots button');
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 2: Enhance Lesson Section Rendering with Memory Hooks
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Render memory hooks for a section
     */
    function renderMemoryHooksSection(section, lessonId, sectionIndex) {
        if (!window.MemoryHooks) return '';
        
        const memoryHooks = section.memory_hooks || section.memoryHooks;
        if (!memoryHooks) return '';
        
        return window.MemoryHooks.render(memoryHooks, lessonId, sectionIndex);
    }
    
    /**
     * Initialize memory hooks after lesson renders
     */
    function initLessonMemoryHooks() {
        if (window.MemoryHooks) {
            window.MemoryHooks.initListeners(document.getElementById('content'));
        }
    }
    
    // Store reference to original showLessonViewer
    const originalShowLessonViewer = window.showLessonViewer;
    
    // Override showLessonViewer to add memory hooks initialization
    window.showLessonViewer = function(lessonId) {
        // Call original function
        if (originalShowLessonViewer) {
            originalShowLessonViewer(lessonId);
        }
        
        // After a short delay, initialize memory hooks
        setTimeout(initLessonMemoryHooks, 100);
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 3: Add Memory Hooks to Enhanced Lesson Viewer
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Watch for enhanced lesson viewer and patch it
    const checkEnhancedViewer = setInterval(function() {
        if (window.showEnhancedLesson && !window.showEnhancedLesson._memoryHooksPatched) {
            const originalShowEnhancedLesson = window.showEnhancedLesson;
            
            window.showEnhancedLesson = function(lessonId) {
                // Call original
                originalShowEnhancedLesson(lessonId);
                
                // Initialize memory hooks after render
                setTimeout(function() {
                    // Try to inject memory hooks into sections
                    const lesson = window.APP?.content?.lessonData?.[lessonId];
                    if (lesson && lesson.sections) {
                        lesson.sections.forEach((section, idx) => {
                            const memoryHooks = section.memory_hooks || section.memoryHooks;
                            if (memoryHooks && window.MemoryHooks) {
                                // Find the section container in DOM
                                const sectionElements = document.querySelectorAll('.lesson-section, .editorial-section');
                                if (sectionElements[idx]) {
                                    // Check if memory hooks already exist
                                    if (!sectionElements[idx].querySelector('.memory-hooks-section')) {
                                        const html = window.MemoryHooks.render(memoryHooks, lessonId, idx);
                                        if (html) {
                                            const container = document.createElement('div');
                                            container.innerHTML = html;
                                            sectionElements[idx].appendChild(container.firstElementChild);
                                        }
                                    }
                                }
                            }
                        });
                        
                        // Initialize all listeners
                        initLessonMemoryHooks();
                    }
                }, 200);
            };
            
            window.showEnhancedLesson._memoryHooksPatched = true;
            console.log('✅ Enhanced lesson viewer patched for memory hooks');
            clearInterval(checkEnhancedViewer);
        }
    }, 500);
    
    // Clear check after 10 seconds to avoid infinite loop
    setTimeout(function() {
        clearInterval(checkEnhancedViewer);
    }, 10000);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 4: Add to Dashboard Quick Actions
    // ═══════════════════════════════════════════════════════════════════════════
    
    const originalShowDashboard = window.showDashboard;
    
    window.showDashboard = function() {
        // Call original
        if (originalShowDashboard) {
            originalShowDashboard();
        }
        
        // Add weak spots widget after render
        setTimeout(function() {
            const weakSpotsCount = window.MemoryHooks ? window.MemoryHooks.getWeakSpotCount() : 0;
            
            if (weakSpotsCount > 0) {
                // Find the container to add the widget
                const container = document.querySelector('.container');
                const progressPanel = container?.querySelector('.progress-data, .exam-readiness-panel, .weak-areas-panel');
                
                if (container && !container.querySelector('.weak-spots-widget')) {
                    const widget = document.createElement('div');
                    widget.className = 'weak-spots-widget';
                    widget.innerHTML = `
                        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h3 style="color: #ef4444; margin: 0 0 4px 0; font-size: 18px;">📚 ${weakSpotsCount} Items Need Review</h3>
                                    <p style="color: #a1a1aa; margin: 0; font-size: 14px;">
                                        You've marked these items from Memory Hooks as needing more study
                                    </p>
                                </div>
                                <button class="btn" onclick="showWeakSpotsReview()" 
                                        style="background: #ef4444; color: white; border: none;">
                                    Review Now →
                                </button>
                            </div>
                        </div>
                    `;
                    
                    // Insert after weak areas or at top of content
                    if (progressPanel) {
                        progressPanel.parentNode.insertBefore(widget, progressPanel.nextSibling);
                    } else {
                        const title = container.querySelector('.page-title');
                        if (title && title.nextElementSibling) {
                            title.parentNode.insertBefore(widget, title.nextElementSibling.nextSibling);
                        }
                    }
                }
            }
        }, 100);
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 5: Enhance markLessonComplete to track memory hooks
    // ═══════════════════════════════════════════════════════════════════════════
    
    const originalMarkLessonComplete = window.markLessonComplete;
    
    window.markLessonComplete = function(lessonId) {
        // Call original
        if (originalMarkLessonComplete) {
            originalMarkLessonComplete(lessonId);
        }
        
        // Check for weak spots in this lesson
        if (window.MemoryHooksIntegration) {
            window.MemoryHooksIntegration.onLessonComplete(lessonId);
        }
        
        // Update navigation badge
        if (window.MemoryHooksIntegration) {
            window.MemoryHooksIntegration.updateBadge();
        }
    };
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Make showWeakSpotsReview globally available
    // ═══════════════════════════════════════════════════════════════════════════
    
    if (!window.showWeakSpotsReview && window.WeakSpotsReview) {
        window.showWeakSpotsReview = window.WeakSpotsReview.show;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Refresh header after patches applied
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Refresh header if it exists
    setTimeout(function() {
        if (document.querySelector('.header-bar')) {
            if (typeof window.createHeader === 'function') {
                window.createHeader();
            }
        }
    }, 500);
    
    console.log('✅ Memory Hooks patches applied successfully');
    
    } // End of applyPatches function
    
    // Start when app is ready
    waitForApp(applyPatches);
    
})();
