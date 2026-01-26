// ================================================
// ENHANCED LESSON VIEWER - Security+ Platform v34
// ================================================
// Supports NEW lesson format (D3/D4/D5 style)
// Features:
// - All deep-dive sections as collapsible accordions
// - Clear dropdown indicators (chevrons)
// - Natural reading flow
// - Tool lab availability indicators
// ================================================

(function() {
    'use strict';

    // ================================================
    // STATE MANAGEMENT
    // ================================================
    
    const LessonState = {
        currentLesson: null,
        completedSections: new Set(),
        completedMicroQuizzes: new Set(),
        expandedSections: new Set(),
        scrollPosition: 0,
        quizUnlocked: false
    };

    // Career role icons and colors
    const CAREER_ROLES = {
        soc_analyst: { 
            icon: '🔍', 
            name: 'SOC Analyst', 
            color: '#6366f1',
            shortName: 'SOC'
        },
        incident_responder: { 
            icon: '🚨', 
            name: 'Incident Responder', 
            color: '#ef4444',
            shortName: 'IR'
        },
        security_engineer: { 
            icon: '⚙️', 
            name: 'Security Engineer', 
            color: '#10b981',
            shortName: 'Eng'
        },
        grc_analyst: { 
            icon: '📋', 
            name: 'GRC Analyst', 
            color: '#f59e0b',
            shortName: 'GRC'
        },
        penetration_tester: { 
            icon: '🎯', 
            name: 'Penetration Tester', 
            color: '#8b5cf6',
            shortName: 'PenTest'
        }
    };

    // Tool labs mapping - which lessons have associated tool labs
    const TOOL_LABS = {
        'D3-LESSON-003': { tool: 'Wireshark', labId: 'wireshark-101' },
        'D3-LESSON-004': { tool: 'Aircrack-ng', labId: 'wireless-security' },
        'D4-LESSON-001': { tool: 'Splunk', labId: 'splunk-101' },
        'D4-LESSON-002': { tool: 'Volatility', labId: 'memory-forensics' },
        'D4-LESSON-003': { tool: 'Autopsy', labId: 'disk-forensics' },
        'D4-LESSON-004': { tool: 'Nessus/OpenVAS', labId: 'vuln-scanning' },
        'D2-LESSON-005': { tool: 'Nmap', labId: 'nmap-101' },
        'D2-LESSON-006': { tool: 'Burp Suite', labId: 'burp-101' },
        'D2-LESSON-012': { tool: 'Metasploit', labId: 'metasploit-101' }
    };

    // ================================================
    // MAIN RENDER FUNCTION
    // ================================================

    function showEnhancedLesson(lessonId) {
        console.log('🎓 showEnhancedLesson called for:', lessonId);
        
        const content = document.getElementById('content');
        
        // Find lesson in ALL_LESSONS
        let lesson = ALL_LESSONS.find(l => l.id === lessonId);
        if (!lesson) {
            console.error('Lesson not found:', lessonId);
            return;
        }

        // Always render directly - app.js showLessonViewer handles the loading screen
        renderFullLesson(lessonId, lesson);
    }
    
    function renderFullLesson(lessonId, lesson) {
        console.log('🔨 renderFullLesson called for:', lessonId);
        const content = document.getElementById('content');
        
        // v34: Try to load enhanced lesson data from multiple sources
        // Check lessonData cache (populated by data-loader)
        const enhancedData = APP.content.lessonData?.[lessonId] || 
                            APP.content.lessonData?.[lesson.lesson_id];
        
        if (enhancedData) {
            // Merge enhanced data into lesson
            lesson = { ...lesson, ...enhancedData };
            console.log(`✅ Loaded enhanced data for ${lessonId}`, {
                hasSections: !!lesson.sections,
                hasMemoryHooks: !!lesson.sections?.[0]?.memory_hooks,
                hasRoleRelevance: !!lesson.role_relevance
            });
        } else {
            console.log(`ℹ️ No enhanced data found in lessonData cache for ${lessonId}, using ALL_LESSONS data`);
        }

        LessonState.currentLesson = lesson;
        LessonState.completedSections = new Set(
            JSON.parse(localStorage.getItem(`lesson_sections_${lessonId}`) || '[]')
        );
        LessonState.completedMicroQuizzes = new Set(
            JSON.parse(localStorage.getItem(`lesson_quizzes_${lessonId}`) || '[]')
        );
        
        // Check if already completed
        const isCompleted = APP.progress.completedLessons.includes(lessonId);
        
        // Get navigation context
        const prevLesson = getPreviousLesson(lessonId);
        const nextLesson = getNextLesson(lessonId);
        const domainLessons = ALL_LESSONS.filter(l => l.domain === lesson.domain);
        const currentIndex = domainLessons.findIndex(l => l.id === lessonId);

        // Check for available tool lab
        const toolLab = TOOL_LABS[lessonId];
        
        // Domain colors
        const domainColors = {
            1: '#6366f1',
            2: '#f59e0b', 
            3: '#10b981',
            4: '#8b5cf6',
            5: '#ec4899'
        };
        const color = domainColors[lesson.domain] || '#6366f1';

        // Build the enhanced lesson view with loading overlay
        content.innerHTML = `
            <!-- Loading Overlay - blocks interaction until fully loaded -->
            <div class="lesson-loading-overlay" id="lesson-loading-overlay">
                <div class="overlay-content">
                    <div class="overlay-spinner" style="border-top-color: ${color};"></div>
                    <p>Preparing lesson...</p>
                </div>
            </div>
            
            <div class="enhanced-lesson-container">
                <!-- Sidebar Navigation -->
                <aside class="lesson-sidebar">
                    <div class="sidebar-header">
                        <button class="back-btn-small" onclick="showDomainLessons(${lesson.domain})">
                            ← Domain ${lesson.domain}
                        </button>
                    </div>
                    
                    <div class="sidebar-progress">
                        <div class="progress-circle" id="lesson-progress-circle">
                            <svg viewBox="0 0 36 36">
                                <path class="progress-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                                <path class="progress-fill" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            </svg>
                            <span class="progress-text">0%</span>
                        </div>
                        <span class="progress-label">Progress</span>
                    </div>
                    
                    <nav class="sidebar-nav" id="lesson-toc">
                        <div class="toc-title">Contents</div>
                        ${renderTableOfContents(lesson)}
                    </nav>
                    
                    <div class="sidebar-footer">
                        ${renderSkillTreeMini(lesson)}
                    </div>
                </aside>

                <!-- Main Content Area -->
                <main class="lesson-main">
                    <!-- Tool Lab Banner (if available) -->
                    ${toolLab ? renderToolLabBanner(toolLab, lessonId) : ''}
                    
                    <!-- Lesson Header -->
                    <header class="lesson-header">
                        <div class="lesson-breadcrumb">
                            Domain ${lesson.domain} › Lesson ${currentIndex + 1} of ${domainLessons.length}
                        </div>
                        <h1 class="lesson-title">${escapeHtml(lesson.title)}</h1>
                        ${lesson.subtitle ? `<p class="lesson-subtitle">${escapeHtml(lesson.subtitle)}</p>` : ''}
                        
                        <div class="lesson-meta-bar">
                            ${lesson.objectives_covered ? `
                                <span class="meta-item">📍 Objectives: ${lesson.objectives_covered.join(', ')}</span>
                            ` : ''}
                            ${lesson.difficulty ? `
                                <span class="meta-item difficulty-${lesson.difficulty}">
                                    ${lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                                </span>
                            ` : ''}
                            ${isCompleted ? '<span class="meta-item completed">✅ Completed</span>' : ''}
                        </div>
                        
                        <!-- Career Relevance Bar -->
                        ${renderCareerRelevanceBar(lesson)}
                    </header>

                    <!-- Introduction Section -->
                    ${renderIntroduction(lesson)}
                    
                    <!-- Skill Tree Visualization -->
                    ${renderSkillTreeFull(lesson)}
                    
                    <!-- Main Sections -->
                    <div class="lesson-sections" id="lesson-sections">
                        ${renderAllSections(lesson)}
                    </div>
                    
                    <!-- Hands-On Activity (if exists) -->
                    ${renderHandsOnActivity(lesson)}
                    
                    <!-- Summary Section -->
                    ${renderSummary(lesson)}
                    
                    <!-- Tool Lab CTA (if available) -->
                    ${toolLab ? renderToolLabCTA(toolLab, lessonId) : ''}
                    
                    <!-- Quiz & Simulation Unlock Section -->
                    ${renderUnlockSection(lesson, lessonId)}
                    
                    <!-- Bottom Navigation -->
                    <nav class="lesson-bottom-nav">
                        ${prevLesson ? `
                            <button class="nav-btn prev" onclick="showEnhancedLesson('${prevLesson.id}')">
                                <span class="nav-direction">← Previous</span>
                                <span class="nav-title">${escapeHtml(prevLesson.title)}</span>
                            </button>
                        ` : '<div class="nav-placeholder"></div>'}
                        
                        <button class="nav-btn home" onclick="showDomainLessons(${lesson.domain})">
                            📚 All Lessons
                        </button>
                        
                        ${nextLesson ? `
                            <button class="nav-btn next" onclick="showEnhancedLesson('${nextLesson.id}')">
                                <span class="nav-direction">Next →</span>
                                <span class="nav-title">${escapeHtml(nextLesson.title)}</span>
                            </button>
                        ` : '<div class="nav-placeholder"></div>'}
                    </nav>
                </main>
            </div>
        `;

        // Initialize interactions
        initializeLessonInteractions(lesson);
        updateProgress();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Inject styles if not already present
        injectEnhancedLessonStyles();
        
        // Remove loading overlay after everything is rendered and painted
        // Use requestIdleCallback or fallback to ensure browser is done with layout
        const removeOverlay = () => {
            const overlay = document.getElementById('lesson-loading-overlay');
            if (overlay) {
                overlay.classList.add('fade-out');
                setTimeout(() => {
                    overlay.remove();
                    console.log('✅ Lesson fully loaded and ready');
                }, 300);
            }
        };
        
        // Wait for next animation frame + idle time to ensure full render
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Additional delay to ensure all content is painted
                setTimeout(removeOverlay, 500);
            });
        });
    }

    // ================================================
    // TOOL LAB COMPONENTS
    // ================================================

    function renderToolLabBanner(toolLab, lessonId) {
        return `
            <div class="tool-lab-banner">
                <div class="tool-lab-icon">🔧</div>
                <div class="tool-lab-info">
                    <strong>Hands-On Lab Available!</strong>
                    <span>Practice with ${escapeHtml(toolLab.tool)} after this lesson</span>
                </div>
                <button class="tool-lab-btn" onclick="window.ToolLabs?.startLab('${toolLab.labId}')">
                    Go to Lab →
                </button>
            </div>
        `;
    }

    function renderToolLabCTA(toolLab, lessonId) {
        return `
            <section class="tool-lab-cta-section">
                <div class="tool-lab-cta">
                    <div class="cta-icon">🛠️</div>
                    <div class="cta-content">
                        <h3>Ready to Practice?</h3>
                        <p>Apply what you've learned with a hands-on <strong>${escapeHtml(toolLab.tool)}</strong> lab.</p>
                        <p class="cta-benefit">Build real skills that employers value.</p>
                    </div>
                    <button class="cta-btn" onclick="window.ToolLabs?.startLab('${toolLab.labId}')">
                        🚀 Start ${escapeHtml(toolLab.tool)} Lab
                    </button>
                </div>
            </section>
        `;
    }

    // ================================================
    // TABLE OF CONTENTS
    // ================================================

    function renderTableOfContents(lesson) {
        const sections = lesson.sections || [];
        let html = '<ul class="toc-list">';
        
        // Introduction
        html += `
            <li class="toc-item" data-section="intro">
                <a href="#section-intro" onclick="scrollToSection('intro'); return false;">
                    <span class="toc-icon">📖</span>
                    Introduction
                </a>
            </li>
        `;
        
        // Skill Tree
        if (lesson.skill_tree) {
            html += `
                <li class="toc-item" data-section="skill-tree">
                    <a href="#section-skill-tree" onclick="scrollToSection('skill-tree'); return false;">
                        <span class="toc-icon">🌳</span>
                        Learning Path
                    </a>
                </li>
            `;
        }
        
        // Main sections
        sections.forEach((section, index) => {
            const sectionId = section.section_id || `section-${index}`;
            const isCompleted = LessonState.completedSections.has(sectionId);
            
            html += `
                <li class="toc-item ${isCompleted ? 'completed' : ''}" data-section="${sectionId}">
                    <a href="#${sectionId}" onclick="scrollToSection('${sectionId}'); return false;">
                        <span class="toc-number">${index + 1}</span>
                        ${escapeHtml(section.title)}
                        ${isCompleted ? '<span class="toc-check">✓</span>' : ''}
                    </a>
                </li>
            `;
        });
        
        // Summary
        html += `
            <li class="toc-item" data-section="summary">
                <a href="#section-summary" onclick="scrollToSection('summary'); return false;">
                    <span class="toc-icon">📋</span>
                    Summary
                </a>
            </li>
        `;
        
        html += '</ul>';
        return html;
    }

    // ================================================
    // CAREER RELEVANCE BAR
    // ================================================

    function renderCareerRelevanceBar(lesson) {
        if (!lesson.role_relevance) return '';
        
        const roles = Object.entries(lesson.role_relevance);
        
        return `
            <div class="career-relevance-bar">
                <span class="relevance-label">Career Relevance:</span>
                <div class="relevance-badges">
                    ${roles.map(([roleKey, roleData]) => {
                        const role = CAREER_ROLES[roleKey];
                        if (!role) return '';
                        
                        // NEW format uses "importance", fallback to "relevance"
                        const level = roleData.importance || roleData.relevance || 'medium';
                        const levelClass = level === 'critical' ? 'critical' : 
                                          level === 'high' ? 'high' : 
                                          level === 'low' ? 'low' : 'medium';
                        
                        return `
                            <button class="career-badge ${levelClass}" 
                                    onclick="showCareerDetail('${roleKey}')"
                                    title="Click for ${role.name} details">
                                <span class="badge-icon">${role.icon}</span>
                                <span class="badge-name">${role.shortName}</span>
                                ${level === 'critical' ? '<span class="badge-star">★</span>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // ================================================
    // INTRODUCTION SECTION
    // ================================================

    function renderIntroduction(lesson) {
        const intro = lesson.introduction || {};
        
        return `
            <section class="lesson-section intro-section" id="section-intro">
                ${intro.hook ? `
                    <div class="intro-hook">
                        ${formatContent(intro.hook)}
                    </div>
                ` : ''}
                
                ${intro.learning_goals ? `
                    <div class="learning-goals-box">
                        <h3>🎯 Learning Goals</h3>
                        <ul class="goals-list">
                            ${intro.learning_goals.map(goal => `
                                <li>${escapeHtml(goal)}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${intro.why_it_matters ? renderWhyItMatters(intro.why_it_matters) : ''}
                
                ${intro.exam_weight ? renderExamWeight(intro.exam_weight) : ''}
            </section>
        `;
    }

    function renderWhyItMatters(whyItMatters) {
        // Handle string format (simple) vs object format (detailed)
        if (typeof whyItMatters === 'string') {
            return `
                <div class="accordion-section" data-expanded="false">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        <span class="accordion-icon">▶</span>
                        <h3>💡 Why This Matters</h3>
                        <span class="accordion-hint">Click to expand</span>
                    </button>
                    <div class="accordion-content">
                        <p>${escapeHtml(whyItMatters)}</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="accordion-section" data-expanded="false">
                <button class="accordion-header" onclick="toggleAccordion(this)">
                    <span class="accordion-icon">▶</span>
                    <h3>💡 Why This Matters</h3>
                    <span class="accordion-hint">Click to expand</span>
                </button>
                <div class="accordion-content">
                    ${whyItMatters.career_impact ? `
                        <div class="matter-item">
                            <strong>🎯 Career Impact:</strong>
                            <p>${escapeHtml(whyItMatters.career_impact)}</p>
                        </div>
                    ` : ''}
                    ${whyItMatters.business_connection ? `
                        <div class="matter-item">
                            <strong>💼 Business Connection:</strong>
                            <p>${escapeHtml(whyItMatters.business_connection)}</p>
                        </div>
                    ` : ''}
                    ${whyItMatters.exam_relevance ? `
                        <div class="matter-item">
                            <strong>📝 Exam Relevance:</strong>
                            <p>${escapeHtml(whyItMatters.exam_relevance)}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    function renderExamWeight(examWeight) {
        return `
            <div class="exam-weight-box">
                <h4>📊 Exam Weight</h4>
                <div class="exam-weight-details">
                    ${examWeight.percentage ? `<span class="weight-item"><strong>Weight:</strong> ${escapeHtml(examWeight.percentage)}</span>` : ''}
                    ${examWeight.question_count ? `<span class="weight-item"><strong>Est. Questions:</strong> ${escapeHtml(examWeight.question_count)}</span>` : ''}
                    ${examWeight.estimated_questions ? `<span class="weight-item"><strong>Est. Questions:</strong> ${escapeHtml(examWeight.estimated_questions)}</span>` : ''}
                </div>
                ${examWeight.question_types ? `
                    <div class="question-types">
                        <strong>Question Types:</strong>
                        <div class="type-tags">
                            ${examWeight.question_types.map(t => `<span class="type-tag">${escapeHtml(t)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                ${examWeight.high_yield_topics ? `
                    <div class="high-yield-topics">
                        <strong>🔥 High-Yield Topics:</strong>
                        <div class="yield-tags">
                            ${examWeight.high_yield_topics.map(t => `<span class="yield-tag">${escapeHtml(t)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ================================================
    // SKILL TREE VISUALIZATION
    // ================================================

    function renderSkillTreeMini(lesson) {
        const st = lesson.skill_tree;
        if (!st) return '';
        
        const prereqs = st.prerequisites || [];
        const unlocks = st.unlocks || [];
        
        return `
            <div class="skill-tree-mini">
                <h4>📚 Learning Path</h4>
                ${prereqs.length > 0 ? `
                    <div class="mini-prereqs">
                        <span class="mini-label">Requires:</span>
                        ${prereqs.slice(0, 2).map(p => {
                            const title = typeof p === 'string' ? p : p.title || p.lesson_id || p;
                            return `<span class="mini-node prereq">${escapeHtml(title)}</span>`;
                        }).join('')}
                    </div>
                ` : ''}
                <div class="mini-current">
                    <span class="mini-node current">📍 Current</span>
                </div>
                ${unlocks.length > 0 ? `
                    <div class="mini-unlocks">
                        <span class="mini-label">Unlocks:</span>
                        ${unlocks.slice(0, 2).map(u => {
                            const title = typeof u === 'string' ? u : u.title || u.lesson_id || u;
                            return `<span class="mini-node unlock">${escapeHtml(title)}</span>`;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderSkillTreeFull(lesson) {
        const st = lesson.skill_tree;
        if (!st) return '';
        
        return `
            <section class="lesson-section" id="section-skill-tree">
                <div class="accordion-section" data-expanded="false">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        <span class="accordion-icon">▶</span>
                        <h3>🌳 Learning Path & Connections</h3>
                        <span class="accordion-hint">Click to expand</span>
                    </button>
                    <div class="accordion-content">
                        ${renderSkillTreeContent(st, lesson)}
                    </div>
                </div>
            </section>
        `;
    }

    function renderSkillTreeContent(st, lesson) {
        // Get prerequisites with resolved info
        const prereqs = (st.prerequisites || []).map(p => {
            if (typeof p === 'string') {
                const found = ALL_LESSONS.find(l => l.id === p);
                return { id: p, title: found?.title || p };
            }
            return { id: p.lesson_id || p.id || '', title: p.title || p.lesson_id || '', why: p.why_needed || '' };
        });
        
        // Get unlocks with resolved info
        const unlocks = (st.unlocks || []).map(u => {
            if (typeof u === 'string') {
                const found = ALL_LESSONS.find(l => l.id === u);
                return { id: u, title: found?.title || u };
            }
            return { id: u.lesson_id || u.id || '', title: u.title || u.lesson_id || '', connection: u.connection || '' };
        });

        let html = '<div class="skill-tree-full">';
        
        // Visual tree
        html += '<div class="skill-tree-visual">';
        
        // Prerequisites column
        if (prereqs.length > 0) {
            html += `
                <div class="tree-column prereqs">
                    <h4>Prerequisites</h4>
                    ${prereqs.map(p => `
                        <div class="tree-node prereq" onclick="showEnhancedLesson('${p.id}')" title="${escapeHtml(p.why || '')}">
                            <span class="node-title">${escapeHtml(p.title)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="tree-arrow">→</div>
            `;
        }
        
        // Current lesson
        html += `
            <div class="tree-column current">
                <div class="tree-node current">
                    <span class="node-badge">Current</span>
                    <span class="node-title">${escapeHtml(lesson.title)}</span>
                </div>
            </div>
        `;
        
        // Unlocks column
        if (unlocks.length > 0) {
            html += `
                <div class="tree-arrow">→</div>
                <div class="tree-column unlocks">
                    <h4>Unlocks</h4>
                    ${unlocks.map(u => `
                        <div class="tree-node unlock" onclick="showEnhancedLesson('${u.id}')" title="${escapeHtml(u.connection || '')}">
                            <span class="node-title">${escapeHtml(u.title)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        html += '</div>'; // end skill-tree-visual
        
        // Cascade learning info
        if (st.cascade_learning) {
            html += renderCascadeLearning(st.cascade_learning);
        }
        
        // Builds toward (certifications, etc.)
        if (st.builds_toward && st.builds_toward.length > 0) {
            html += `
                <div class="builds-toward-section">
                    <h4>🎓 Builds Toward</h4>
                    <div class="builds-toward-list">
                        ${st.builds_toward.map(b => `<span class="build-badge">${escapeHtml(b)}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        html += '</div>'; // end skill-tree-full
        
        return html;
    }

    function renderCascadeLearning(cl) {
        let html = '<div class="cascade-learning">';
        
        if (cl.this_lesson_establishes && cl.this_lesson_establishes.length > 0) {
            html += `
                <div class="cascade-block">
                    <strong>📌 This Lesson Establishes:</strong>
                    <ul>${cl.this_lesson_establishes.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
                </div>
            `;
        }
        
        if (cl.builds_on) {
            html += '<div class="cascade-block"><strong>🔗 Builds On:</strong><ul>';
            if (Array.isArray(cl.builds_on)) {
                cl.builds_on.forEach(b => {
                    html += `<li><strong>${escapeHtml(b.lesson || '')}</strong>: ${escapeHtml(b.concepts?.join(', ') || '')}</li>`;
                });
            } else if (typeof cl.builds_on === 'object') {
                Object.entries(cl.builds_on).forEach(([k, v]) => {
                    html += `<li><strong>${escapeHtml(k)}</strong>: ${escapeHtml(v)}</li>`;
                });
            }
            html += '</ul></div>';
        }
        
        if (cl.enables) {
            html += '<div class="cascade-block"><strong>➡️ Enables:</strong><ul>';
            cl.enables.forEach(e => {
                html += `<li><strong>${escapeHtml(e.lesson || '')}</strong>: ${escapeHtml(e.concepts?.join(', ') || '')}</li>`;
            });
            html += '</ul></div>';
        }
        
        html += '</div>';
        return html;
    }

    // ================================================
    // MAIN SECTIONS RENDERER
    // ================================================

    function renderAllSections(lesson) {
        const sections = lesson.sections || [];
        
        return sections.map((section, index) => {
            const sectionId = section.section_id || `section-${index}`;
            const isCompleted = LessonState.completedSections.has(sectionId);
            
            return `
                <section class="lesson-section main-section ${isCompleted ? 'completed' : ''}" 
                         id="${sectionId}" 
                         data-section-index="${index}">
                    
                    <div class="section-header">
                        <h2>
                            <span class="section-number">${index + 1}</span>
                            ${escapeHtml(section.title)}
                        </h2>
                    </div>
                    
                    <!-- Main Content (always visible) -->
                    ${renderSectionContent(section)}
                    
                    <!-- Key Points (always visible) -->
                    ${renderKeyPoints(section)}
                    
                    <!-- Deep Dive Accordions (collapsed by default) -->
                    <div class="deep-dive-accordions">
                        ${renderMemoryHooksAccordion(section)}
                        ${renderRealWorldExampleAccordion(section)}
                        ${renderWhatWouldHappenIfAccordion(section)}
                        ${renderGlossaryTermsAccordion(section)}
                    </div>
                    
                    <!-- Knowledge Check (interactive) -->
                    ${renderKnowledgeCheck(section, sectionId)}
                    
                    <!-- Must Remember for Exam -->
                    ${renderMustRemember(section)}
                    
                    <!-- Section Complete Button -->
                    <div class="section-complete-bar">
                        <button class="mark-complete-btn ${isCompleted ? 'completed' : ''}" 
                                onclick="markSectionComplete('${sectionId}', ${index})">
                            ${isCompleted ? '✅ Section Completed' : '☐ Mark Section Complete'}
                        </button>
                    </div>
                </section>
            `;
        }).join('');
    }

    // ================================================
    // SECTION CONTENT
    // ================================================

    function renderSectionContent(section) {
        // Handle string content (D5 style)
        if (typeof section.content === 'string') {
            return `<div class="section-content">${formatMarkdown(section.content)}</div>`;
        }
        
        const content = section.content || {};
        let html = '<div class="section-content">';
        
        // Overview
        if (content.overview) {
            html += `<div class="content-overview">${formatContent(content.overview)}</div>`;
        }
        
        // Core Concepts
        if (content.core_concepts && content.core_concepts.length > 0) {
            html += renderCoreConcepts(content.core_concepts);
        }
        
        html += '</div>';
        return html;
    }

    function renderCoreConcepts(concepts) {
        return `
            <div class="core-concepts">
                ${concepts.map((concept, index) => renderConcept(concept, index)).join('')}
            </div>
        `;
    }

    function renderConcept(concept, index) {
        const name = concept.concept || concept.name || `Concept ${index + 1}`;
        const hasDetails = hasConceptDetails(concept);
        
        if (!hasDetails) {
            return `
                <div class="concept-card simple">
                    <h4>${escapeHtml(name)}</h4>
                </div>
            `;
        }
        
        return `
            <div class="concept-card accordion-section" data-expanded="false">
                <button class="accordion-header concept-header" onclick="toggleAccordion(this)">
                    <span class="accordion-icon">▶</span>
                    <h4>${escapeHtml(name)}</h4>
                    <span class="accordion-hint">Click to expand</span>
                </button>
                <div class="accordion-content concept-details">
                    ${renderConceptDetails(concept)}
                </div>
            </div>
        `;
    }

    function hasConceptDetails(concept) {
        const skipKeys = ['concept', 'name'];
        return Object.keys(concept).some(key => !skipKeys.includes(key) && concept[key]);
    }

    function renderConceptDetails(concept) {
        let html = '';
        
        if (concept.definition) {
            html += `<p class="concept-definition">${escapeHtml(concept.definition)}</p>`;
        }
        
        if (concept.how_it_works) {
            const howItWorks = typeof concept.how_it_works === 'string' 
                ? concept.how_it_works 
                : concept.how_it_works.mechanism || '';
            html += `
                <div class="how-it-works">
                    <strong>How It Works:</strong>
                    <p>${escapeHtml(howItWorks)}</p>
                </div>
            `;
        }
        
        if (concept.examples && concept.examples.length > 0) {
            html += `
                <div class="concept-examples">
                    <strong>Examples:</strong>
                    <ul>
                        ${concept.examples.map(ex => {
                            if (typeof ex === 'string') return `<li>${escapeHtml(ex)}</li>`;
                            return `<li><strong>${escapeHtml(ex.name || ex.control || '')}</strong>: ${escapeHtml(ex.description || ex.function || '')}</li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Handle other dynamic fields
        const handled = ['concept', 'name', 'definition', 'how_it_works', 'examples'];
        Object.entries(concept).forEach(([key, value]) => {
            if (handled.includes(key) || !value) return;
            html += renderDynamicField(key, value);
        });
        
        return html || '<p>No additional details.</p>';
    }

    function renderDynamicField(key, value) {
        const label = formatKeyName(key);
        
        if (typeof value === 'string') {
            return `<div class="dynamic-field"><strong>${label}:</strong> ${escapeHtml(value)}</div>`;
        }
        
        if (Array.isArray(value)) {
            if (value.length === 0) return '';
            if (typeof value[0] === 'string') {
                return `
                    <div class="dynamic-field">
                        <strong>${label}:</strong>
                        <ul>${value.map(v => `<li>${escapeHtml(v)}</li>`).join('')}</ul>
                    </div>
                `;
            }
            // Array of objects - render as mini cards
            return `
                <div class="dynamic-field">
                    <strong>${label}:</strong>
                    <div class="mini-cards">
                        ${value.map(item => `
                            <div class="mini-card">
                                ${Object.entries(item).map(([k, v]) => `
                                    <div><em>${formatKeyName(k)}:</em> ${escapeHtml(v || '')}</div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (typeof value === 'object') {
            return `
                <div class="dynamic-field">
                    <strong>${label}:</strong>
                    <div class="nested-object">
                        ${Object.entries(value).map(([k, v]) => `
                            <div><em>${formatKeyName(k)}:</em> ${escapeHtml(v || '')}</div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return '';
    }

    function formatKeyName(key) {
        return key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
    }

    // ================================================
    // KEY POINTS (Always Visible)
    // ================================================

    function renderKeyPoints(section) {
        if (!section.key_points || section.key_points.length === 0) return '';
        
        return `
            <div class="key-points-box">
                <h4>📌 Key Points</h4>
                <ul>
                    ${section.key_points.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // ================================================
    // MEMORY HOOKS ACCORDION (NEW FORMAT)
    // ================================================

    function renderMemoryHooksAccordion(section) {
        if (!section.memory_hooks) return '';
        
        const mh = section.memory_hooks;
        
        // Check if we have any content
        const hasMnemonics = (mh.mnemonics && mh.mnemonics.length > 0) || mh.mnemonic;
        const hasAnalogies = (mh.analogies && mh.analogies.length > 0) || mh.analogy;
        const hasCommonMistakes = mh.common_mistakes && mh.common_mistakes.length > 0;
        
        if (!hasMnemonics && !hasAnalogies && !hasCommonMistakes) return '';
        
        // Count items for hint
        let itemCount = 0;
        if (hasMnemonics) itemCount += (mh.mnemonics?.length || 1);
        if (hasAnalogies) itemCount += (mh.analogies?.length || 1);
        if (hasCommonMistakes) itemCount += mh.common_mistakes.length;
        
        return `
            <div class="accordion-section deep-dive" data-expanded="false">
                <button class="accordion-header" onclick="toggleAccordion(this)">
                    <span class="accordion-icon">▶</span>
                    <h4>🧠 Memory Hooks</h4>
                    <span class="accordion-badge">${itemCount} items</span>
                    <span class="accordion-hint">Study aids & exam tips</span>
                </button>
                <div class="accordion-content">
                    ${renderMnemonicsContent(mh)}
                    ${renderAnalogiesContent(mh)}
                    ${renderCommonMistakesContent(mh)}
                </div>
            </div>
        `;
    }

    function renderMnemonicsContent(mh) {
        // NEW FORMAT: mnemonics is array of {name, expansion, usage}
        if (mh.mnemonics && Array.isArray(mh.mnemonics) && mh.mnemonics.length > 0) {
            return `
                <div class="memory-section mnemonics">
                    <h5>📝 Mnemonics</h5>
                    <div class="mnemonic-cards">
                        ${mh.mnemonics.map(m => `
                            <div class="mnemonic-card">
                                <div class="mnemonic-name">${escapeHtml(m.name)}</div>
                                <div class="mnemonic-expansion">${escapeHtml(m.expansion)}</div>
                                ${m.usage ? `<div class="mnemonic-usage">💡 ${escapeHtml(m.usage)}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // OLD FORMAT fallback: mnemonic is a string
        if (mh.mnemonic) {
            return `
                <div class="memory-section mnemonics">
                    <h5>📝 Mnemonic</h5>
                    <div class="mnemonic-card">
                        <div class="mnemonic-text">${escapeHtml(mh.mnemonic)}</div>
                        ${mh.alternative_mnemonic ? `<div class="mnemonic-alt">Or: ${escapeHtml(mh.alternative_mnemonic)}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        return '';
    }

    function renderAnalogiesContent(mh) {
        // NEW FORMAT: analogies is array of {concept, analogy, why_it_works}
        if (mh.analogies && Array.isArray(mh.analogies) && mh.analogies.length > 0) {
            return `
                <div class="memory-section analogies">
                    <h5>🔗 Analogies</h5>
                    <div class="analogy-cards">
                        ${mh.analogies.map(a => `
                            <div class="analogy-card">
                                <div class="analogy-concept">${escapeHtml(a.concept)}</div>
                                <div class="analogy-comparison">
                                    <span class="analogy-equals">≈</span>
                                    <span class="analogy-text">${escapeHtml(a.analogy)}</span>
                                </div>
                                ${a.why_it_works ? `
                                    <div class="analogy-why">
                                        <strong>Why it works:</strong> ${escapeHtml(a.why_it_works)}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // OBJECT FORMAT with optional mapping array
        if (mh.analogy && typeof mh.analogy === 'object') {
            const concept = mh.analogy.concept || '';
            const explanation = mh.analogy.explanation || '';
            const mapping = mh.analogy.mapping || [];
            
            let mappingHtml = '';
            if (mapping.length > 0) {
                mappingHtml = `
                    <div class="analogy-mapping">
                        ${mapping.map(m => `
                            <div class="mapping-item">
                                <strong>${escapeHtml(m.category || m.type || m.item || '')}</strong>
                                <span class="mapping-equiv">→ ${escapeHtml(m.restaurant_equivalent || m.home_equivalent || m.equivalent || m.analogy || '')}</span>
                                ${m.explanation ? `<span class="mapping-explain">(${escapeHtml(m.explanation)})</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            return `
                <div class="memory-section analogies">
                    <div class="analogy-card">
                        <div class="analogy-label">
                            <span>💡</span> Think of it like...
                        </div>
                        ${concept ? `<p class="analogy-concept-text">${escapeHtml(concept)}</p>` : ''}
                        ${explanation ? `<p class="analogy-text">${escapeHtml(explanation)}</p>` : ''}
                        ${mappingHtml}
                    </div>
                </div>
            `;
        }
        
        return '';
    }

    function renderCommonMistakesContent(mh) {
        if (!mh.common_mistakes || mh.common_mistakes.length === 0) return '';
        
        return `
            <div class="memory-section common-mistakes">
                <h5>⚠️ Common Mistakes</h5>
                <div class="mistake-cards">
                    ${mh.common_mistakes.map(cm => `
                        <div class="mistake-card">
                            <div class="mistake-wrong">
                                <span class="mistake-x">✗</span>
                                <span>${escapeHtml(cm.mistake)}</span>
                            </div>
                            <div class="mistake-right">
                                <span class="mistake-check">✓</span>
                                <span>${escapeHtml(cm.correction || cm.correct_approach || cm.why_wrong || '')}</span>
                            </div>
                            ${cm.exam_trap ? `
                                <div class="exam-trap-note">
                                    <span class="trap-icon">📝</span>
                                    <span>Exam trap: ${escapeHtml(cm.exam_trap)}</span>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ================================================
    // REAL WORLD EXAMPLE ACCORDION
    // ================================================

    function renderRealWorldExampleAccordion(section) {
        if (!section.real_world_example) return '';
        
        const rwe = section.real_world_example;
        
        return `
            <div class="accordion-section deep-dive" data-expanded="false">
                <button class="accordion-header" onclick="toggleAccordion(this)">
                    <span class="accordion-icon">▶</span>
                    <h4>🏢 Real-World Example${rwe.company ? `: ${escapeHtml(rwe.company)}` : ''}</h4>
                    <span class="accordion-hint">See it in action</span>
                </button>
                <div class="accordion-content">
                    <div class="real-world-content">
                        ${rwe.scenario ? `
                            <div class="rwe-scenario">
                                <strong>📋 Scenario:</strong>
                                <p>${escapeHtml(rwe.scenario)}</p>
                            </div>
                        ` : ''}
                        ${rwe.application ? `
                            <div class="rwe-application">
                                <strong>⚡ Application:</strong>
                                <p>${escapeHtml(rwe.application)}</p>
                            </div>
                        ` : ''}
                        ${rwe.outcome ? `
                            <div class="rwe-outcome">
                                <strong>✅ Outcome:</strong>
                                <p>${escapeHtml(rwe.outcome)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ================================================
    // WHAT WOULD HAPPEN IF ACCORDION
    // ================================================

    function renderWhatWouldHappenIfAccordion(section) {
        let scenarios = [];
        
        // Handle array format (NEW) or single object
        if (Array.isArray(section.what_would_happen_if)) {
            scenarios = section.what_would_happen_if;
        } else if (section.what_would_happen_if && typeof section.what_would_happen_if === 'object') {
            scenarios = [section.what_would_happen_if];
        }
        
        if (scenarios.length === 0) return '';
        
        return `
            <div class="accordion-section deep-dive" data-expanded="false">
                <button class="accordion-header" onclick="toggleAccordion(this)">
                    <span class="accordion-icon">▶</span>
                    <h4>⚠️ What Would Happen If...</h4>
                    <span class="accordion-badge">${scenarios.length} scenario${scenarios.length > 1 ? 's' : ''}</span>
                    <span class="accordion-hint">Understand consequences</span>
                </button>
                <div class="accordion-content">
                    <div class="wwhi-scenarios">
                        ${scenarios.map(s => `
                            <div class="wwhi-card">
                                <div class="wwhi-situation">
                                    <strong>Situation:</strong>
                                    <p>${escapeHtml(s.situation || s.scenario || '')}</p>
                                </div>
                                <div class="wwhi-consequence">
                                    <strong>Consequence:</strong>
                                    <p>${escapeHtml(s.consequence || '')}</p>
                                </div>
                                ${s.lesson ? `
                                    <div class="wwhi-lesson">
                                        <strong>💡 Lesson:</strong>
                                        <p>${escapeHtml(s.lesson)}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ================================================
    // GLOSSARY TERMS ACCORDION
    // ================================================

    function renderGlossaryTermsAccordion(section) {
        if (!section.glossary_terms || section.glossary_terms.length === 0) return '';
        
        return `
            <div class="accordion-section deep-dive" data-expanded="false">
                <button class="accordion-header" onclick="toggleAccordion(this)">
                    <span class="accordion-icon">▶</span>
                    <h4>📖 Key Terms</h4>
                    <span class="accordion-badge">${section.glossary_terms.length} terms</span>
                    <span class="accordion-hint">Definitions</span>
                </button>
                <div class="accordion-content">
                    <div class="glossary-grid">
                        ${section.glossary_terms.map(term => `
                            <div class="glossary-card">
                                <div class="glossary-term">${escapeHtml(term.term)}</div>
                                <div class="glossary-definition">${escapeHtml(term.definition)}</div>
                                ${term.exam_note ? `
                                    <div class="glossary-exam-note">
                                        <span class="exam-icon">📝</span>
                                        ${escapeHtml(term.exam_note)}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // ================================================
    // KNOWLEDGE CHECK
    // ================================================

    function renderKnowledgeCheck(section, sectionId) {
        if (!section.knowledge_check) return '';
        
        const kc = section.knowledge_check;
        const checkId = `kc-${sectionId}`;
        
        return `
            <div class="knowledge-check-box" id="${checkId}">
                <h4>🎯 Knowledge Check</h4>
                <div class="kc-question">${escapeHtml(kc.question)}</div>
                <div class="kc-options" id="options-${checkId}">
                    ${kc.options.map((opt, i) => `
                        <button class="kc-option" 
                                onclick="handleKnowledgeCheck('${checkId}', ${i}, ${kc.correct}, this)"
                                data-index="${i}">
                            <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                            <span class="option-text">${escapeHtml(opt)}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="kc-feedback" id="feedback-${checkId}" style="display: none;"></div>
            </div>
        `;
    }

    // ================================================
    // MUST REMEMBER FOR EXAM
    // ================================================

    function renderMustRemember(section) {
        if (!section.must_remember_for_exam || section.must_remember_for_exam.length === 0) return '';
        
        return `
            <div class="must-remember-box">
                <h4>⭐ Must Remember for Exam</h4>
                <div class="must-remember-items">
                    ${section.must_remember_for_exam.map(mr => `
                        <div class="must-remember-item">
                            <div class="mr-fact">${escapeHtml(mr.fact || mr.point || mr)}</div>
                            ${mr.why_tested ? `<div class="mr-why">Why tested: ${escapeHtml(mr.why_tested)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ================================================
    // HANDS-ON ACTIVITY
    // ================================================

    function renderHandsOnActivity(lesson) {
        if (!lesson.hands_on_activity) return '';
        
        const activity = lesson.hands_on_activity;
        
        return `
            <section class="lesson-section hands-on-section">
                <div class="accordion-section" data-expanded="false">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        <span class="accordion-icon">▶</span>
                        <h3>🛠️ Hands-On Activity${activity.title ? `: ${escapeHtml(activity.title)}` : ''}</h3>
                        <span class="accordion-hint">Practice exercise</span>
                    </button>
                    <div class="accordion-content">
                        ${activity.scenario ? `<p class="activity-scenario">${escapeHtml(activity.scenario)}</p>` : ''}
                        ${activity.steps ? `
                            <div class="activity-steps">
                                <h5>Steps:</h5>
                                <ol>
                                    ${activity.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
                                </ol>
                            </div>
                        ` : ''}
                        ${activity.expected_outcome ? `
                            <div class="activity-outcome">
                                <strong>Expected Outcome:</strong>
                                <p>${escapeHtml(activity.expected_outcome)}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </section>
        `;
    }

    // ================================================
    // SUMMARY SECTION
    // ================================================

    function renderSummary(lesson) {
        const summary = lesson.summary || {};
        
        const takeaways = summary.key_takeaways || [];
        const examEssentials = summary.exam_essentials || [];
        const commonTraps = summary.common_exam_traps || [];
        const nextConnection = summary.connection_to_next || '';
        
        if (takeaways.length === 0 && examEssentials.length === 0) return '';
        
        return `
            <section class="lesson-section summary-section" id="section-summary">
                <h2>📋 Summary</h2>
                
                ${takeaways.length > 0 ? `
                    <div class="takeaways-box">
                        <h3>Key Takeaways</h3>
                        <ul>
                            ${takeaways.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${examEssentials.length > 0 ? `
                    <div class="exam-essentials-box">
                        <h3>⭐ Exam Essentials</h3>
                        <ul>
                            ${examEssentials.map(e => `<li>${escapeHtml(e)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${commonTraps.length > 0 ? `
                    <div class="accordion-section" data-expanded="false">
                        <button class="accordion-header" onclick="toggleAccordion(this)">
                            <span class="accordion-icon">▶</span>
                            <h4>⚠️ Common Exam Traps</h4>
                            <span class="accordion-badge">${commonTraps.length} traps</span>
                        </button>
                        <div class="accordion-content">
                            <ul class="traps-list">
                                ${commonTraps.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                ` : ''}
                
                ${nextConnection ? `
                    <div class="next-connection">
                        <h4>🔗 What's Next</h4>
                        <p>${escapeHtml(nextConnection)}</p>
                    </div>
                ` : ''}
            </section>
        `;
    }

    // ================================================
    // UNLOCK SECTION
    // ================================================

    function renderUnlockSection(lesson, lessonId) {
        const related = lesson.related_content || {};
        const hasSimulation = related.simulations && related.simulations.length > 0;
        
        return `
            <section class="lesson-section unlock-section">
                <h3>🎮 Ready to Practice?</h3>
                <p>Test your understanding with interactive activities.</p>
                
                <div class="unlock-buttons">
                    <button class="unlock-btn quiz-btn" onclick="startQuiz(${lesson.domain})">
                        📝 Take Domain ${lesson.domain} Quiz
                    </button>
                    
                    ${hasSimulation ? `
                        <button class="unlock-btn sim-btn" onclick="startSimulation('${related.simulations[0]}')">
                            🎯 Start Simulation
                        </button>
                    ` : ''}
                </div>
            </section>
        `;
    }

    // ================================================
    // NAVIGATION HELPERS
    // ================================================

    function getPreviousLesson(currentId) {
        const currentLesson = ALL_LESSONS.find(l => l.id === currentId);
        if (!currentLesson) return null;
        
        const domainLessons = ALL_LESSONS.filter(l => l.domain === currentLesson.domain);
        const currentIndex = domainLessons.findIndex(l => l.id === currentId);
        
        return currentIndex > 0 ? domainLessons[currentIndex - 1] : null;
    }

    function getNextLesson(currentId) {
        const currentLesson = ALL_LESSONS.find(l => l.id === currentId);
        if (!currentLesson) return null;
        
        const domainLessons = ALL_LESSONS.filter(l => l.domain === currentLesson.domain);
        const currentIndex = domainLessons.findIndex(l => l.id === currentId);
        
        return currentIndex < domainLessons.length - 1 ? domainLessons[currentIndex + 1] : null;
    }

    // ================================================
    // ACCORDION TOGGLE
    // ================================================

    window.toggleAccordion = function(button) {
        const accordion = button.closest('.accordion-section');
        const content = accordion.querySelector('.accordion-content');
        const icon = button.querySelector('.accordion-icon');
        const isExpanded = accordion.dataset.expanded === 'true';
        
        // Toggle state
        accordion.dataset.expanded = !isExpanded;
        
        // Update icon
        icon.textContent = isExpanded ? '▶' : '▼';
        
        // Animate content
        if (isExpanded) {
            content.style.maxHeight = '0';
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
        } else {
            content.style.maxHeight = content.scrollHeight + 40 + 'px';
            content.style.paddingTop = '15px';
            content.style.paddingBottom = '15px';
        }
    };

    // ================================================
    // KNOWLEDGE CHECK HANDLER
    // ================================================

    window.handleKnowledgeCheck = function(checkId, selected, correct, button) {
        const section = findSectionByCheckId(checkId);
        const kc = section?.knowledge_check;
        
        const container = document.getElementById(`options-${checkId}`);
        const feedback = document.getElementById(`feedback-${checkId}`);
        const options = container.querySelectorAll('.kc-option');
        
        // Disable all options and mark correct/incorrect
        options.forEach((opt, i) => {
            opt.disabled = true;
            opt.classList.add('disabled');
            if (i === correct) {
                opt.classList.add('correct');
            } else if (i === selected && selected !== correct) {
                opt.classList.add('incorrect');
            }
        });
        
        // Build feedback HTML
        let feedbackHtml = '';
        
        if (selected === correct) {
            feedbackHtml = `
                <div class="feedback-correct">
                    <strong>✓ Correct!</strong>
                    <p>${escapeHtml(kc?.explanation || '')}</p>
                </div>
            `;
        } else {
            feedbackHtml = `
                <div class="feedback-incorrect">
                    <strong>✗ Incorrect</strong>
                    <p>${escapeHtml(kc?.explanation || '')}</p>
                </div>
            `;
            
            // Show wrong answer analysis if available
            if (kc?.wrong_answer_analysis) {
                const waa = kc.wrong_answer_analysis;
                let reason = '';
                
                // Handle object format (keyed by index) or array format
                if (Array.isArray(waa)) {
                    const wrongItem = waa.find(w => w.option === selected);
                    reason = wrongItem?.why_wrong || wrongItem?.why_tempting || '';
                } else if (typeof waa === 'object') {
                    reason = waa[selected] || waa[String(selected)] || '';
                }
                
                if (reason) {
                    feedbackHtml += `
                        <div class="wrong-analysis">
                            <strong>Why "${escapeHtml(kc.options[selected])}" is wrong:</strong>
                            <p>${escapeHtml(reason)}</p>
                        </div>
                    `;
                }
            }
        }
        
        feedback.innerHTML = feedbackHtml;
        feedback.style.display = 'block';
    };

    function findSectionByCheckId(checkId) {
        const sectionId = checkId.replace('kc-', '');
        const lesson = LessonState.currentLesson;
        return lesson?.sections?.find(s => s.section_id === sectionId);
    }

    // ================================================
    // SECTION COMPLETION
    // ================================================

    window.markSectionComplete = function(sectionId, index) {
        const lessonId = LessonState.currentLesson?.lesson_id || LessonState.currentLesson?.id;
        
        if (LessonState.completedSections.has(sectionId)) {
            LessonState.completedSections.delete(sectionId);
        } else {
            LessonState.completedSections.add(sectionId);
        }
        
        // Save to localStorage
        localStorage.setItem(
            `lesson_sections_${lessonId}`,
            JSON.stringify([...LessonState.completedSections])
        );
        
        // Update UI
        const section = document.getElementById(sectionId);
        const btn = section?.querySelector('.mark-complete-btn');
        const tocItem = document.querySelector(`.toc-item[data-section="${sectionId}"]`);
        
        const isNowCompleted = LessonState.completedSections.has(sectionId);
        
        if (section) section.classList.toggle('completed', isNowCompleted);
        if (btn) {
            btn.classList.toggle('completed', isNowCompleted);
            btn.textContent = isNowCompleted ? '✅ Section Completed' : '☐ Mark Section Complete';
        }
        if (tocItem) tocItem.classList.toggle('completed', isNowCompleted);
        
        updateProgress();
    };

    // ================================================
    // SCROLL TO SECTION
    // ================================================

    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId) || document.getElementById(`section-${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ================================================
    // CAREER DETAIL MODAL
    // ================================================

    window.showCareerDetail = function(roleKey) {
        const lesson = LessonState.currentLesson;
        const roleData = lesson?.role_relevance?.[roleKey];
        const role = CAREER_ROLES[roleKey];
        
        if (!roleData || !role) return;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'career-modal-overlay';
        modal.innerHTML = `
            <div class="career-modal">
                <button class="modal-close" onclick="this.closest('.career-modal-overlay').remove()">×</button>
                <div class="modal-header" style="border-left: 4px solid ${role.color}">
                    <span class="modal-icon">${role.icon}</span>
                    <h3>${role.name}</h3>
                </div>
                <div class="modal-content">
                    <div class="modal-stat">
                        <strong>Importance:</strong> 
                        <span class="importance-badge ${roleData.importance || roleData.relevance}">${roleData.importance || roleData.relevance}</span>
                    </div>
                    
                    ${roleData.daily_tasks ? `
                        <div class="modal-section">
                            <strong>Daily Tasks:</strong>
                            <ul>${roleData.daily_tasks.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    
                    ${roleData.real_scenario ? `
                        <div class="modal-section">
                            <strong>Real Scenario:</strong>
                            <p class="real-scenario-text">${escapeHtml(roleData.real_scenario)}</p>
                        </div>
                    ` : ''}
                    
                    ${roleData.tools_youll_use ? `
                        <div class="modal-section">
                            <strong>Tools You'll Use:</strong>
                            <div class="tools-tags">
                                ${roleData.tools_youll_use.map(t => `<span class="tool-tag">${escapeHtml(t)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Close on Escape
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    };

    // ================================================
    // PROGRESS TRACKING
    // ================================================

    function initializeLessonInteractions(lesson) {
        // Intersection observer for TOC highlighting
        const sections = document.querySelectorAll('.main-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    highlightTocItem(entry.target.id);
                }
            });
        }, { threshold: 0.3 });
        
        sections.forEach(section => observer.observe(section));
    }

    function highlightTocItem(sectionId) {
        document.querySelectorAll('.toc-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });
    }

    function updateProgress() {
        const totalSections = LessonState.currentLesson?.sections?.length || 1;
        const completedCount = LessonState.completedSections.size;
        const percentage = Math.round((completedCount / totalSections) * 100);
        
        const progressCircle = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressCircle) {
            progressCircle.style.strokeDasharray = `${percentage}, 100`;
        }
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }

    // ================================================
    // HELPER FUNCTIONS
    // ================================================

    function formatContent(text) {
        if (!text) return '';
        let formatted = escapeHtml(text);
        formatted = formatted.replace(/\n\n/g, '</p><p>');
        formatted = formatted.replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }

    function formatMarkdown(text) {
        if (!text) return '';
        
        let html = escapeHtml(text);
        
        // Bold
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        // Italic
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        return `<p>${html}</p>`;
    }

    function escapeHtml(text) {
        if (!text) return '';
        if (typeof text !== 'string') return String(text);
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ================================================
    // STYLES INJECTION
    // ================================================

    function injectEnhancedLessonStyles() {
        if (document.getElementById('enhanced-lesson-styles-v34')) return;
        
        const styles = document.createElement('style');
        styles.id = 'enhanced-lesson-styles-v34';
        styles.textContent = `
            /* ================================================
               ENHANCED LESSON VIEWER STYLES v34
               All accordions collapsed by default with clear indicators
               ================================================ */
            
            /* Accordion System */
            .accordion-section {
                margin: 15px 0;
                border: 1px solid #27272a;
                border-radius: 8px;
                overflow: hidden;
                background: #18181b;
            }
            
            .accordion-section.deep-dive {
                border-left: 3px solid #6366f1;
            }
            
            .accordion-header {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px 20px;
                background: #1f1f23;
                border: none;
                cursor: pointer;
                text-align: left;
                color: #fafafa;
                transition: background 0.2s ease;
            }
            
            .accordion-header:hover {
                background: #27272a;
            }
            
            .accordion-icon {
                font-size: 12px;
                color: #6366f1;
                transition: transform 0.2s ease;
                flex-shrink: 0;
            }
            
            .accordion-header h3,
            .accordion-header h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
                flex-grow: 1;
            }
            
            .accordion-hint {
                font-size: 0.8rem;
                color: #71717a;
                font-weight: normal;
            }
            
            .accordion-badge {
                background: #27272a;
                color: #a1a1aa;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .accordion-content {
                max-height: 0;
                overflow: hidden;
                padding: 0 20px;
                transition: max-height 0.3s ease, padding 0.3s ease;
                background: #18181b;
            }
            
            .accordion-section[data-expanded="true"] .accordion-content {
                max-height: 2000px;
                padding: 15px 20px;
            }
            
            .accordion-section[data-expanded="true"] .accordion-icon {
                transform: rotate(90deg);
            }
            
            /* Tool Lab Banner */
            .tool-lab-banner {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 12px 20px;
                background: linear-gradient(135deg, #1e3a5f, #1e1e3f);
                border: 1px solid #3b82f6;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .tool-lab-icon {
                font-size: 24px;
            }
            
            .tool-lab-info {
                flex-grow: 1;
            }
            
            .tool-lab-info strong {
                display: block;
                color: #60a5fa;
            }
            
            .tool-lab-info span {
                font-size: 0.9rem;
                color: #94a3b8;
            }
            
            .tool-lab-btn {
                padding: 8px 16px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.2s;
            }
            
            .tool-lab-btn:hover {
                background: #2563eb;
            }
            
            /* Tool Lab CTA Section */
            .tool-lab-cta {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 25px;
                background: linear-gradient(135deg, #1e3a5f, #1e1e3f);
                border: 2px solid #3b82f6;
                border-radius: 12px;
                margin: 30px 0;
            }
            
            .cta-icon {
                font-size: 48px;
            }
            
            .cta-content {
                flex-grow: 1;
            }
            
            .cta-content h3 {
                margin: 0 0 5px 0;
                color: #60a5fa;
            }
            
            .cta-content p {
                margin: 0;
                color: #cbd5e1;
            }
            
            .cta-benefit {
                font-size: 0.9rem;
                color: #94a3b8 !important;
                margin-top: 5px !important;
            }
            
            .cta-btn {
                padding: 12px 24px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.2s;
            }
            
            .cta-btn:hover {
                background: #2563eb;
                transform: translateY(-2px);
            }
            
            /* Memory Hooks Sections */
            .memory-section {
                margin-bottom: 20px;
            }
            
            .memory-section h5 {
                margin: 0 0 12px 0;
                color: #a1a1aa;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .mnemonic-cards,
            .analogy-cards,
            .mistake-cards {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .mnemonic-card,
            .analogy-card,
            .mistake-card {
                padding: 15px;
                background: #27272a;
                border-radius: 8px;
                border-left: 3px solid #6366f1;
            }
            
            .mnemonic-name {
                font-weight: 600;
                color: #fafafa;
                font-size: 1.1rem;
                margin-bottom: 5px;
            }
            
            .mnemonic-expansion {
                color: #a1a1aa;
                margin-bottom: 8px;
            }
            
            .mnemonic-usage {
                font-size: 0.85rem;
                color: #6366f1;
            }
            
            .analogy-label {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #ec4899;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .analogy-label span {
                font-size: 1.2rem;
            }
            
            .analogy-concept {
                font-weight: 600;
                color: #fafafa;
                margin-bottom: 8px;
            }
            
            .analogy-concept-text {
                color: #fafafa;
                font-weight: 500;
                margin-bottom: 10px;
            }
            
            .analogy-comparison {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #1f1f23;
                border-radius: 6px;
                margin-bottom: 10px;
            }
            
            .analogy-equals {
                color: #6366f1;
                font-size: 1.5rem;
            }
            
            .analogy-text {
                color: #e4e4e7;
            }
            
            .analogy-why {
                font-size: 0.9rem;
                color: #a1a1aa;
            }
            
            /* Analogy Mapping */
            .analogy-mapping {
                margin-top: 12px;
                padding: 12px;
                background: #1f1f23;
                border-radius: 6px;
            }
            
            .mapping-item {
                padding: 8px 0;
                border-bottom: 1px solid #27272a;
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: baseline;
            }
            
            .mapping-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            
            .mapping-item strong {
                color: #93c5fd;
                min-width: 100px;
            }
            
            .mapping-equiv {
                color: #e4e4e7;
            }
            
            .mapping-explain {
                color: #71717a;
                font-size: 0.9rem;
                font-style: italic;
            }
            
            .mistake-wrong {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: 10px;
                color: #fca5a5;
            }
            
            .mistake-x {
                color: #ef4444;
                font-weight: bold;
            }
            
            .mistake-right {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                color: #86efac;
            }
            
            .mistake-check {
                color: #10b981;
                font-weight: bold;
            }
            
            .exam-trap-note {
                margin-top: 10px;
                padding: 8px 12px;
                background: #1f1f23;
                border-radius: 6px;
                font-size: 0.85rem;
                color: #f59e0b;
            }
            
            /* Real World Example */
            .real-world-content {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .rwe-scenario,
            .rwe-application,
            .rwe-outcome {
                padding: 12px;
                background: #27272a;
                border-radius: 6px;
            }
            
            .rwe-scenario strong,
            .rwe-application strong,
            .rwe-outcome strong {
                color: #a1a1aa;
                font-size: 0.85rem;
            }
            
            .rwe-outcome {
                border-left: 3px solid #10b981;
            }
            
            /* What Would Happen If */
            .wwhi-scenarios {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .wwhi-card {
                padding: 15px;
                background: #27272a;
                border-radius: 8px;
                border-left: 3px solid #f59e0b;
            }
            
            .wwhi-situation,
            .wwhi-consequence,
            .wwhi-lesson {
                margin-bottom: 10px;
            }
            
            .wwhi-consequence {
                color: #fca5a5;
            }
            
            .wwhi-lesson {
                color: #86efac;
                margin-bottom: 0;
            }
            
            /* Glossary */
            .glossary-grid {
                display: grid;
                gap: 15px;
            }
            
            .glossary-card {
                padding: 15px;
                background: #27272a;
                border-radius: 8px;
            }
            
            .glossary-term {
                font-weight: 600;
                color: #6366f1;
                margin-bottom: 5px;
            }
            
            .glossary-definition {
                color: #e4e4e7;
                margin-bottom: 8px;
            }
            
            .glossary-exam-note {
                font-size: 0.85rem;
                color: #f59e0b;
                padding-top: 8px;
                border-top: 1px solid #3f3f46;
            }
            
            /* Knowledge Check */
            .knowledge-check-box {
                margin: 20px 0;
                padding: 20px;
                background: #1f1f23;
                border-radius: 10px;
                border: 1px solid #27272a;
            }
            
            .knowledge-check-box h4 {
                margin: 0 0 15px 0;
                color: #fafafa;
            }
            
            .kc-question {
                font-size: 1.05rem;
                color: #e4e4e7;
                margin-bottom: 15px;
                line-height: 1.5;
            }
            
            .kc-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .kc-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 15px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 8px;
                cursor: pointer;
                text-align: left;
                color: #e4e4e7;
                transition: all 0.2s;
            }
            
            .kc-option:hover:not(.disabled) {
                background: #3f3f46;
                border-color: #6366f1;
            }
            
            .kc-option.correct {
                background: rgba(16, 185, 129, 0.2);
                border-color: #10b981;
            }
            
            .kc-option.incorrect {
                background: rgba(239, 68, 68, 0.2);
                border-color: #ef4444;
            }
            
            .kc-option.disabled {
                cursor: default;
                opacity: 0.7;
            }
            
            .option-letter {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #3f3f46;
                border-radius: 50%;
                font-weight: 600;
                font-size: 0.9rem;
                flex-shrink: 0;
            }
            
            .kc-feedback {
                margin-top: 15px;
                padding: 15px;
                border-radius: 8px;
            }
            
            .feedback-correct {
                background: rgba(16, 185, 129, 0.1);
                border-left: 3px solid #10b981;
                padding: 15px;
                border-radius: 6px;
            }
            
            .feedback-correct strong {
                color: #10b981;
            }
            
            .feedback-incorrect {
                background: rgba(239, 68, 68, 0.1);
                border-left: 3px solid #ef4444;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 10px;
            }
            
            .feedback-incorrect strong {
                color: #ef4444;
            }
            
            .wrong-analysis {
                background: #27272a;
                padding: 12px;
                border-radius: 6px;
                margin-top: 10px;
            }
            
            .wrong-analysis strong {
                color: #f59e0b;
            }
            
            /* Must Remember */
            .must-remember-box {
                margin: 20px 0;
                padding: 20px;
                background: linear-gradient(135deg, #1e1e3f, #1e3a5f);
                border: 1px solid #6366f1;
                border-radius: 10px;
            }
            
            .must-remember-box h4 {
                margin: 0 0 15px 0;
                color: #fcd34d;
            }
            
            .must-remember-item {
                padding: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                margin-bottom: 10px;
            }
            
            .must-remember-item:last-child {
                margin-bottom: 0;
            }
            
            .mr-fact {
                color: #fafafa;
                font-weight: 500;
                margin-bottom: 5px;
            }
            
            .mr-why {
                font-size: 0.85rem;
                color: #94a3b8;
            }
            
            /* Key Points Box */
            .key-points-box {
                margin: 20px 0;
                padding: 20px;
                background: #1f1f23;
                border-radius: 10px;
                border-left: 4px solid #6366f1;
            }
            
            .key-points-box h4 {
                margin: 0 0 12px 0;
                color: #fafafa;
            }
            
            .key-points-box ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .key-points-box li {
                color: #e4e4e7;
                margin-bottom: 8px;
            }
            
            /* Career Badge Styles */
            .career-relevance-bar {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-top: 15px;
                flex-wrap: wrap;
            }
            
            .relevance-label {
                color: #71717a;
                font-size: 0.9rem;
            }
            
            .relevance-badges {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .career-badge {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 20px;
                cursor: pointer;
                color: #e4e4e7;
                font-size: 0.85rem;
                transition: all 0.2s;
            }
            
            .career-badge:hover {
                background: #3f3f46;
                transform: translateY(-1px);
            }
            
            .career-badge.critical {
                border-color: #ef4444;
                background: rgba(239, 68, 68, 0.1);
            }
            
            .career-badge.high {
                border-color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
            }
            
            .badge-star {
                color: #fcd34d;
            }
            
            /* Career Modal */
            .career-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
            }
            
            .career-modal {
                background: #18181b;
                border-radius: 12px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: #71717a;
                font-size: 24px;
                cursor: pointer;
            }
            
            .modal-close:hover {
                color: #fafafa;
            }
            
            .modal-header {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                background: #1f1f23;
            }
            
            .modal-icon {
                font-size: 32px;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #fafafa;
            }
            
            .modal-content {
                padding: 20px;
            }
            
            .modal-stat {
                margin-bottom: 15px;
            }
            
            .importance-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: 500;
                text-transform: capitalize;
            }
            
            .importance-badge.critical {
                background: rgba(239, 68, 68, 0.2);
                color: #fca5a5;
            }
            
            .importance-badge.high {
                background: rgba(245, 158, 11, 0.2);
                color: #fcd34d;
            }
            
            .importance-badge.medium {
                background: rgba(99, 102, 241, 0.2);
                color: #a5b4fc;
            }
            
            .modal-section {
                margin-bottom: 20px;
            }
            
            .modal-section strong {
                display: block;
                color: #a1a1aa;
                margin-bottom: 8px;
                font-size: 0.85rem;
                text-transform: uppercase;
            }
            
            .modal-section ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .modal-section li {
                color: #e4e4e7;
                margin-bottom: 5px;
            }
            
            .real-scenario-text {
                padding: 12px;
                background: #27272a;
                border-radius: 6px;
                color: #e4e4e7;
                font-style: italic;
            }
            
            .tools-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .tool-tag {
                padding: 4px 10px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #a5b4fc;
            }
            
            /* Loading Overlay - blocks interaction until lesson is ready */
            .lesson-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(9, 9, 11, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.3s ease;
            }
            
            .lesson-loading-overlay.fade-out {
                opacity: 0;
                pointer-events: none;
            }
            
            .overlay-content {
                text-align: center;
            }
            
            .overlay-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #27272a;
                border-top-color: #6366f1;
                border-radius: 50%;
                margin: 0 auto 16px;
                animation: spin 1s linear infinite;
            }
            
            .overlay-content p {
                color: #a1a1aa;
                font-size: 1rem;
                margin: 0;
            }
            
            /* Loading Screen */
            .lesson-loading-screen {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 80vh;
                background: #09090b;
            }
            
            .loading-content {
                text-align: center;
                padding: 40px;
                max-width: 400px;
            }
            
            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid #27272a;
                border-top-color: #6366f1;
                border-radius: 50%;
                margin: 0 auto 24px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            .loading-domain {
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 8px;
            }
            
            .loading-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #fafafa;
                margin: 0 0 16px 0;
            }
            
            .loading-status {
                color: #71717a;
                font-size: 0.95rem;
                margin: 0 0 20px 0;
            }
            
            .loading-progress {
                width: 200px;
                height: 4px;
                background: #27272a;
                border-radius: 2px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .loading-progress-bar {
                width: 30%;
                height: 100%;
                border-radius: 2px;
                animation: loading-progress 1.5s ease-in-out infinite;
            }
            
            @keyframes loading-progress {
                0% { transform: translateX(-100%); width: 30%; }
                50% { width: 60%; }
                100% { transform: translateX(400%); width: 30%; }
            }
            
            /* Layout */
            .enhanced-lesson-container {
                display: grid;
                grid-template-columns: 260px 1fr;
                min-height: 100vh;
                width: 100%;
                max-width: 100%;
                overflow-x: hidden;
            }
            
            .lesson-sidebar {
                position: sticky;
                top: 0;
                height: 100vh;
                overflow-y: auto;
                background: #0f0f10;
                border-right: 1px solid #27272a;
                padding: 20px;
            }
            
            .lesson-main {
                padding: 30px 0;
                width: 80%;
                max-width: 1000px;
                margin: 0 auto;
                box-sizing: border-box;
            }
            
            /* Progress Circle */
            .sidebar-progress {
                text-align: center;
                margin: 20px 0;
            }
            
            .progress-circle {
                width: 80px;
                height: 80px;
                margin: 0 auto;
            }
            
            .progress-circle svg {
                transform: rotate(-90deg);
            }
            
            .progress-bg {
                fill: none;
                stroke: #27272a;
                stroke-width: 3;
            }
            
            .progress-fill {
                fill: none;
                stroke: #6366f1;
                stroke-width: 3;
                stroke-linecap: round;
                transition: stroke-dasharray 0.3s;
            }
            
            .progress-text {
                position: relative;
                top: -55px;
                font-weight: 600;
                color: #fafafa;
            }
            
            .progress-label {
                display: block;
                color: #71717a;
                font-size: 0.85rem;
            }
            
            /* TOC */
            .toc-title {
                color: #71717a;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 15px;
            }
            
            .toc-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .toc-item a {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                color: #a1a1aa;
                text-decoration: none;
                border-radius: 6px;
                font-size: 0.9rem;
                transition: all 0.2s;
            }
            
            .toc-item a:hover {
                background: #1f1f23;
                color: #fafafa;
            }
            
            .toc-item.active a {
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
            }
            
            .toc-item.completed a {
                color: #10b981;
            }
            
            .toc-number {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #27272a;
                border-radius: 50%;
                font-size: 0.75rem;
                font-weight: 600;
            }
            
            .toc-check {
                margin-left: auto;
                color: #10b981;
            }
            
            /* Lesson Header */
            .lesson-header {
                margin-bottom: 30px;
            }
            
            .lesson-breadcrumb {
                color: #71717a;
                font-size: 0.85rem;
                margin-bottom: 10px;
            }
            
            .lesson-title {
                font-size: 2rem;
                font-weight: 700;
                color: #fafafa;
                margin: 0 0 10px 0;
            }
            
            .lesson-subtitle {
                color: #a1a1aa;
                font-size: 1.1rem;
                margin: 0 0 15px 0;
            }
            
            .lesson-meta-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }
            
            .meta-item {
                padding: 4px 12px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            .meta-item.completed {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }
            
            .difficulty-beginner {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }
            
            .difficulty-intermediate {
                background: rgba(245, 158, 11, 0.1);
                color: #f59e0b;
            }
            
            .difficulty-advanced {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            
            /* Sections */
            .lesson-section {
                margin-bottom: 40px;
            }
            
            .section-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .section-header h2 {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0;
                font-size: 1.5rem;
                color: #fafafa;
            }
            
            .section-number {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #6366f1;
                border-radius: 50%;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .section-time {
                color: #71717a;
                font-size: 0.85rem;
            }
            
            /* Mark Complete Button */
            .section-complete-bar {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #27272a;
            }
            
            .mark-complete-btn {
                padding: 10px 20px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 8px;
                color: #a1a1aa;
                cursor: pointer;
                font-size: 0.95rem;
                transition: all 0.2s;
            }
            
            .mark-complete-btn:hover {
                background: #3f3f46;
                color: #fafafa;
            }
            
            .mark-complete-btn.completed {
                background: rgba(16, 185, 129, 0.1);
                border-color: #10b981;
                color: #10b981;
            }
            
            /* Bottom Navigation */
            .lesson-bottom-nav {
                display: flex;
                gap: 15px;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #27272a;
            }
            
            .nav-btn {
                flex: 1;
                padding: 15px 20px;
                background: #1f1f23;
                border: 1px solid #27272a;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
            }
            
            .nav-btn:hover {
                background: #27272a;
                border-color: #6366f1;
            }
            
            .nav-btn.home {
                flex: 0 0 auto;
                text-align: center;
            }
            
            .nav-direction {
                display: block;
                color: #71717a;
                font-size: 0.85rem;
                margin-bottom: 5px;
            }
            
            .nav-title {
                color: #fafafa;
                font-weight: 500;
            }
            
            .nav-placeholder {
                flex: 1;
            }
            
            /* Exam Weight */
            .exam-weight-box {
                padding: 20px;
                background: #1f1f23;
                border-radius: 10px;
                margin-top: 20px;
            }
            
            .exam-weight-box h4 {
                margin: 0 0 15px 0;
            }
            
            .exam-weight-details {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .weight-item {
                padding: 8px 12px;
                background: #27272a;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .type-tags,
            .yield-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 8px;
            }
            
            .type-tag,
            .yield-tag {
                padding: 4px 10px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.85rem;
            }
            
            .yield-tag {
                background: rgba(245, 158, 11, 0.1);
                color: #fcd34d;
            }
            
            /* Skill Tree */
            .skill-tree-full {
                padding: 10px 0;
            }
            
            .skill-tree-visual {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                margin-bottom: 25px;
                flex-wrap: wrap;
            }
            
            .tree-column {
                flex: 1;
                min-width: 150px;
            }
            
            .tree-column h4 {
                margin: 0 0 10px 0;
                color: #71717a;
                font-size: 0.85rem;
            }
            
            .tree-node {
                padding: 12px;
                background: #27272a;
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .tree-node:hover {
                background: #3f3f46;
            }
            
            .tree-node.current {
                background: linear-gradient(135deg, #4f46e5, #6366f1);
                cursor: default;
            }
            
            .tree-node.prereq {
                border-left: 3px solid #f59e0b;
            }
            
            .tree-node.unlock {
                border-left: 3px solid #10b981;
            }
            
            .node-badge {
                display: inline-block;
                padding: 2px 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                font-size: 0.75rem;
                margin-bottom: 5px;
            }
            
            .node-title {
                display: block;
                font-weight: 500;
                color: #fafafa;
            }
            
            .tree-arrow {
                color: #6366f1;
                font-size: 1.5rem;
                padding-top: 30px;
            }
            
            .cascade-learning {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #27272a;
            }
            
            .cascade-block {
                margin-bottom: 15px;
            }
            
            .cascade-block strong {
                display: block;
                color: #a1a1aa;
                margin-bottom: 8px;
            }
            
            .cascade-block ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .cascade-block li {
                color: #e4e4e7;
                margin-bottom: 5px;
            }
            
            .builds-toward-section {
                margin-top: 20px;
            }
            
            .builds-toward-section h4 {
                margin: 0 0 10px 0;
                color: #a1a1aa;
            }
            
            .builds-toward-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .build-badge {
                padding: 6px 12px;
                background: linear-gradient(135deg, #1e1e3f, #1e3a5f);
                border: 1px solid #6366f1;
                border-radius: 20px;
                font-size: 0.85rem;
                color: #a5b4fc;
            }
            
            /* Unlock Section */
            .unlock-section {
                text-align: center;
                padding: 40px;
                background: #1f1f23;
                border-radius: 12px;
            }
            
            .unlock-section h3 {
                margin: 0 0 10px 0;
                color: #fafafa;
            }
            
            .unlock-section p {
                color: #a1a1aa;
                margin-bottom: 20px;
            }
            
            .unlock-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .unlock-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 1rem;
                transition: all 0.2s;
            }
            
            .quiz-btn {
                background: #6366f1;
                color: white;
            }
            
            .quiz-btn:hover {
                background: #4f46e5;
            }
            
            .sim-btn {
                background: #10b981;
                color: white;
            }
            
            .sim-btn:hover {
                background: #059669;
            }
            
            /* Summary Section */
            .takeaways-box,
            .exam-essentials-box {
                padding: 20px;
                background: #1f1f23;
                border-radius: 10px;
                margin-bottom: 20px;
            }
            
            .takeaways-box h3,
            .exam-essentials-box h3 {
                margin: 0 0 15px 0;
            }
            
            .takeaways-box ul,
            .exam-essentials-box ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .takeaways-box li,
            .exam-essentials-box li {
                color: #e4e4e7;
                margin-bottom: 8px;
            }
            
            .exam-essentials-box {
                border-left: 4px solid #fcd34d;
            }
            
            .next-connection {
                padding: 20px;
                background: linear-gradient(135deg, #1e1e3f, #1e3a5f);
                border-radius: 10px;
                margin-top: 20px;
            }
            
            .next-connection h4 {
                margin: 0 0 10px 0;
                color: #60a5fa;
            }
            
            /* Mini Skill Tree (Sidebar) */
            .skill-tree-mini {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
            }
            
            .skill-tree-mini h4 {
                margin: 0 0 12px 0;
                color: #a1a1aa;
                font-size: 0.85rem;
            }
            
            .mini-prereqs,
            .mini-unlocks {
                margin-bottom: 10px;
            }
            
            .mini-label {
                display: block;
                color: #71717a;
                font-size: 0.75rem;
                margin-bottom: 5px;
            }
            
            .mini-node {
                display: inline-block;
                padding: 4px 8px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.8rem;
                color: #a1a1aa;
                margin-right: 5px;
                margin-bottom: 5px;
            }
            
            .mini-node.current {
                background: #6366f1;
                color: white;
            }
            
            /* Core Concepts */
            .core-concepts {
                margin: 20px 0;
            }
            
            .concept-card {
                margin-bottom: 15px;
            }
            
            .concept-card.simple {
                padding: 15px;
                background: #27272a;
                border-radius: 8px;
            }
            
            .concept-card.simple h4 {
                margin: 0;
                color: #fafafa;
            }
            
            .concept-header h4 {
                margin: 0;
            }
            
            .concept-details {
                color: #e4e4e7;
            }
            
            .concept-definition {
                padding: 12px;
                background: rgba(99, 102, 241, 0.1);
                border-left: 3px solid #6366f1;
                border-radius: 4px;
                margin-bottom: 15px;
            }
            
            .how-it-works,
            .concept-examples {
                margin-bottom: 15px;
            }
            
            .how-it-works strong,
            .concept-examples strong {
                display: block;
                color: #a1a1aa;
                margin-bottom: 8px;
            }
            
            .dynamic-field {
                margin-bottom: 12px;
            }
            
            .dynamic-field strong {
                color: #a1a1aa;
            }
            
            .mini-cards {
                display: grid;
                gap: 10px;
                margin-top: 8px;
            }
            
            .mini-card {
                padding: 12px;
                background: #27272a;
                border-radius: 6px;
            }
            
            .mini-card div {
                margin-bottom: 5px;
            }
            
            .mini-card em {
                color: #71717a;
            }
            
            /* Introduction */
            .intro-hook {
                font-size: 1.1rem;
                color: #e4e4e7;
                line-height: 1.7;
                margin-bottom: 25px;
                padding: 20px;
                background: #1f1f23;
                border-left: 4px solid #6366f1;
                border-radius: 4px;
            }
            
            .learning-goals-box {
                padding: 20px;
                background: #1f1f23;
                border-radius: 10px;
                margin-bottom: 20px;
            }
            
            .learning-goals-box h3 {
                margin: 0 0 15px 0;
            }
            
            .goals-list {
                margin: 0;
                padding-left: 20px;
            }
            
            .goals-list li {
                color: #e4e4e7;
                margin-bottom: 8px;
            }
            
            /* Matter Items */
            .matter-item {
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #27272a;
            }
            
            .matter-item:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
            
            .matter-item strong {
                color: #a1a1aa;
            }
            
            .matter-item p {
                margin: 8px 0 0 0;
                color: #e4e4e7;
            }
            
            /* Responsive */
            @media (max-width: 900px) {
                .enhanced-lesson-container {
                    grid-template-columns: 1fr;
                    width: 100%;
                    max-width: 100%;
                    margin: 0;
                }
                
                .lesson-sidebar {
                    display: none;
                }
                
                .lesson-main {
                    width: 100%;
                    max-width: 100%;
                    padding: 20px 16px;
                    margin: 0;
                    box-sizing: border-box;
                }
                
                .skill-tree-visual {
                    flex-direction: column;
                }
                
                .tree-arrow {
                    transform: rotate(90deg);
                    padding: 10px 0;
                }
            }
            
            @media (max-width: 480px) {
                .lesson-main {
                    padding: 16px;
                    width: 100%;
                    max-width: 100%;
                }
                
                .lesson-title {
                    font-size: 1.4rem;
                }
                
                .section-title {
                    font-size: 1.1rem;
                }
                
                .accordion-header h3,
                .accordion-header h4 {
                    font-size: 1rem;
                }
            }
            
            /* ============================================
               LIGHT MODE - Complete Override
               ============================================ */
            
            /* ACCORDION SECTIONS */
            [data-theme="light"] .accordion-section {
                background: #ffffff !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .accordion-header {
                background: #f5f5f5 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .accordion-header:hover {
                background: #eeeeee !important;
            }
            
            [data-theme="light"] .accordion-header h3,
            [data-theme="light"] .accordion-header h4 {
                color: #111111 !important;
            }
            
            [data-theme="light"] .accordion-hint {
                color: #555555 !important;
            }
            
            [data-theme="light"] .accordion-badge {
                background: #e0e0e0 !important;
                color: #555555 !important;
            }
            
            [data-theme="light"] .accordion-content {
                background: #ffffff !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .accordion-content p,
            [data-theme="light"] .accordion-content li,
            [data-theme="light"] .accordion-content span {
                color: #111111 !important;
            }
            
            /* MEMORY HOOKS */
            [data-theme="light"] .memory-hooks-section,
            [data-theme="light"] .memory-section {
                background: #ffffff !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .memory-section h4,
            [data-theme="light"] .memory-section h5 {
                color: #000000 !important;
            }
            
            /* MNEMONIC, ANALOGY, MISTAKE CARDS */
            [data-theme="light"] .mnemonic-card,
            [data-theme="light"] .analogy-card,
            [data-theme="light"] .mistake-card {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .mnemonic-name,
            [data-theme="light"] .analogy-concept,
            [data-theme="light"] .analogy-concept-text {
                color: #000000 !important;
            }
            
            [data-theme="light"] .mnemonic-expansion,
            [data-theme="light"] .analogy-why {
                color: #555555 !important;
            }
            
            [data-theme="light"] .mnemonic-usage {
                color: #4f46e5 !important;
            }
            
            [data-theme="light"] .analogy-label {
                color: #ec4899 !important;
            }
            
            [data-theme="light"] .analogy-comparison {
                background: #eeeeee !important;
            }
            
            [data-theme="light"] .analogy-text {
                color: #111111 !important;
            }
            
            /* ANALOGY MAPPING */
            [data-theme="light"] .analogy-mapping {
                background: #ffffff !important;
                border: 1px solid #e0e0e0 !important;
            }
            
            [data-theme="light"] .mapping-item {
                color: #111111 !important;
                border-bottom-color: #f0f0f0 !important;
            }
            
            [data-theme="light"] .mapping-item strong {
                color: #2563eb !important;
            }
            
            [data-theme="light"] .mapping-equiv {
                color: #333333 !important;
            }
            
            [data-theme="light"] .mapping-explain {
                color: #555555 !important;
            }
            
            /* COMMON MISTAKES */
            [data-theme="light"] .common-mistakes {
                background: #ffffff !important;
            }
            
            [data-theme="light"] .mistake-wrong {
                color: #dc2626 !important;
            }
            
            [data-theme="light"] .mistake-right {
                color: #059669 !important;
            }
            
            [data-theme="light"] .exam-trap-note {
                background: #fffbeb !important;
                color: #b45309 !important;
            }
            
            /* EXAM WEIGHT BOX */
            [data-theme="light"] .exam-weight-box {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .exam-weight-box h4 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .weight-item {
                background: #ffffff !important;
                border: 1px solid #e0e0e0 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .type-tag {
                background: #e0e0e0 !important;
                color: #333333 !important;
            }
            
            [data-theme="light"] .yield-tag {
                background: #fef3c7 !important;
                color: #92400e !important;
            }
            
            /* SKILL TREE */
            [data-theme="light"] .tree-node {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .tree-node:hover {
                background: #eeeeee !important;
            }
            
            [data-theme="light"] .tree-node.current {
                background: linear-gradient(135deg, #6366f1, #818cf8) !important;
                color: #ffffff !important;
            }
            
            [data-theme="light"] .tree-column h4 {
                color: #555555 !important;
            }
            
            [data-theme="light"] .node-title {
                color: #111111 !important;
            }
            
            [data-theme="light"] .tree-node.current .node-title {
                color: #ffffff !important;
            }
            
            /* TOOL LAB BANNER */
            [data-theme="light"] .tool-lab-banner {
                background: linear-gradient(135deg, #dbeafe, #e0e7ff) !important;
                border-color: #93c5fd !important;
                color: #1e40af !important;
            }
            
            [data-theme="light"] .tool-lab-info {
                color: #1e40af !important;
            }
            
            /* ROLE CARDS */
            [data-theme="light"] .role-card {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .role-card h4 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .role-tasks li {
                color: #111111 !important;
            }
            
            /* CONSEQUENCE CARDS */
            [data-theme="light"] .consequence-card {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
                color: #111111 !important;
            }
            
            /* INTERACTIVE MISTAKES */
            [data-theme="light"] .mistake-item {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .mistake-item[data-expanded="true"] {
                background: #ffffff !important;
            }
            
            [data-theme="light"] .mistake-header {
                background: #f5f5f5 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .mistake-header:hover {
                background: #eeeeee !important;
            }
            
            [data-theme="light"] .mistake-content {
                background: #ffffff !important;
                color: #111111 !important;
            }
            
            /* NAVIGATION */
            [data-theme="light"] .nav-arrow {
                color: #555555 !important;
            }
            
            [data-theme="light"] .nav-label {
                color: #555555 !important;
            }
            
            [data-theme="light"] .nav-title {
                color: #111111 !important;
            }
            
            /* GENERIC OVERRIDES */
            [data-theme="light"] .enhanced-lesson-viewer {
                background: #ffffff !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .enhanced-lesson-viewer h1,
            [data-theme="light"] .enhanced-lesson-viewer h2,
            [data-theme="light"] .enhanced-lesson-viewer h3,
            [data-theme="light"] .enhanced-lesson-viewer h4,
            [data-theme="light"] .enhanced-lesson-viewer h5 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .enhanced-lesson-viewer p,
            [data-theme="light"] .enhanced-lesson-viewer li {
                color: #111111 !important;
            }
            
            /* INTRO SECTION / INTRO HOOK */
            [data-theme="light"] .intro-section,
            [data-theme="light"] .intro-hook,
            [data-theme="light"] .why-matters-box {
                background: #f5f5f5 !important;
                color: #111111 !important;
                border-left-color: #6366f1 !important;
            }
            
            [data-theme="light"] .intro-section p,
            [data-theme="light"] .intro-hook p,
            [data-theme="light"] .why-matters-box p {
                color: #111111 !important;
            }
            
            /* LEARNING GOALS / LEARNING GOALS BOX */
            [data-theme="light"] .learning-goals,
            [data-theme="light"] .learning-goals-box {
                background: #ffffff !important;
                border: 1px solid #e0e0e0 !important;
                border-left: 4px solid #10b981 !important;
            }
            
            [data-theme="light"] .learning-goals h3,
            [data-theme="light"] .learning-goals-box h3 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .learning-goals li,
            [data-theme="light"] .learning-goals-box li,
            [data-theme="light"] .goals-list li {
                color: #111111 !important;
                border-bottom-color: #f0f0f0 !important;
            }
            
            /* MATTER ITEMS (Why This Matters content) */
            [data-theme="light"] .matter-item {
                border-bottom-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .matter-item strong {
                color: #555555 !important;
            }
            
            [data-theme="light"] .matter-item p {
                color: #111111 !important;
            }
            
            /* KEY POINTS BOX */
            [data-theme="light"] .key-points-box {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .key-points-box strong {
                color: #000000 !important;
            }
            
            [data-theme="light"] .key-points-box li {
                color: #111111 !important;
            }
            
            /* EXAM TIPS BOX */
            [data-theme="light"] .exam-tips-box {
                background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%) !important;
                border-color: #c7d2fe !important;
            }
            
            [data-theme="light"] .exam-tips-box strong {
                color: #4f46e5 !important;
            }
            
            [data-theme="light"] .exam-tips-box li {
                color: #111111 !important;
            }
            
            /* REAL WORLD BOX */
            [data-theme="light"] .real-world-box {
                background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%) !important;
                border-color: #fde047 !important;
            }
            
            [data-theme="light"] .real-world-box strong {
                color: #a16207 !important;
            }
            
            [data-theme="light"] .real-world-box p {
                color: #422006 !important;
            }
            
            /* RETENTION BOX */
            [data-theme="light"] .retention-box {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .retention-box h4 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .retention-box li {
                color: #111111 !important;
            }
            
            /* SUMMARY SECTION - Key Takeaways, Exam Essentials, What's Next */
            [data-theme="light"] .summary-section {
                background: #ffffff !important;
            }
            
            [data-theme="light"] .takeaways-box {
                background: #f5f5f5 !important;
                border: 1px solid #e0e0e0 !important;
            }
            
            [data-theme="light"] .takeaways-box h3 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .takeaways-box li {
                color: #111111 !important;
            }
            
            [data-theme="light"] .exam-essentials-box {
                background: #fffbeb !important;
                border: 1px solid #fde047 !important;
                border-left: 4px solid #f59e0b !important;
            }
            
            [data-theme="light"] .exam-essentials-box h3 {
                color: #92400e !important;
            }
            
            [data-theme="light"] .exam-essentials-box li {
                color: #111111 !important;
            }
            
            [data-theme="light"] .next-connection {
                background: linear-gradient(135deg, #dbeafe, #e0e7ff) !important;
                border: 1px solid #93c5fd !important;
            }
            
            [data-theme="light"] .next-connection h4 {
                color: #1e40af !important;
            }
            
            [data-theme="light"] .next-connection p {
                color: #1e3a8a !important;
            }
            
            /* SKILL TREE MINI (Sidebar) */
            [data-theme="light"] .skill-tree-mini {
                background: #f5f5f5 !important;
                border: 1px solid #e0e0e0 !important;
            }
            
            [data-theme="light"] .skill-tree-mini h4 {
                color: #555555 !important;
            }
            
            [data-theme="light"] .mini-label {
                color: #555555 !important;
            }
            
            [data-theme="light"] .mini-node {
                background: #ffffff !important;
                border-color: #e0e0e0 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .mini-node.current {
                background: #6366f1 !important;
                color: #ffffff !important;
            }
            
            /* LEARNING PATH SECTION (Sidebar) */
            [data-theme="light"] .learning-path-box {
                background: #f5f5f5 !important;
                border: 1px solid #e0e0e0 !important;
            }
            
            [data-theme="light"] .path-requires,
            [data-theme="light"] .path-unlocks {
                color: #555555 !important;
            }
            
            [data-theme="light"] .path-item {
                background: #ffffff !important;
                border-color: #e0e0e0 !important;
                color: #111111 !important;
            }
            
            /* LESSON SECTION BORDERS */
            [data-theme="light"] .lesson-section {
                border-bottom-color: #f0f0f0 !important;
            }
            
            /* LAYOUT - SIDEBAR AND MAIN */
            [data-theme="light"] .lesson-sidebar {
                background: #ffffff !important;
                border-right-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .lesson-main {
                background: #f5f5f5 !important;
            }
            
            [data-theme="light"] .enhanced-lesson-container {
                background: #f5f5f5 !important;
            }
            
            /* LOADING SCREEN - Light Mode */
            [data-theme="light"] .lesson-loading-screen {
                background: #f5f5f5 !important;
            }
            
            [data-theme="light"] .lesson-loading-overlay {
                background: rgba(245, 245, 245, 0.98) !important;
            }
            
            [data-theme="light"] .overlay-spinner {
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .overlay-content p {
                color: #555555 !important;
            }
            
            [data-theme="light"] .loading-spinner {
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .loading-title {
                color: #000000 !important;
            }
            
            [data-theme="light"] .loading-status {
                color: #555555 !important;
            }
            
            [data-theme="light"] .loading-progress {
                background: #e0e0e0 !important;
            }
            
            /* SIDEBAR ITEMS */
            [data-theme="light"] .sidebar-title {
                color: #000000 !important;
            }
            
            [data-theme="light"] .sidebar-section h4 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .nav-item {
                color: #555555 !important;
            }
            
            [data-theme="light"] .nav-item:hover {
                background: #f5f5f5 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .nav-item.active {
                background: #f0f0f0 !important;
                color: #111111 !important;
                border-left-color: #6366f1 !important;
            }
            
            [data-theme="light"] .nav-item.active span {
                color: #6366f1 !important;
            }
            
            /* PROGRESS CIRCLE */
            [data-theme="light"] .progress-bg {
                stroke: #e0e0e0 !important;
            }
            
            [data-theme="light"] .progress-label {
                color: #555555 !important;
            }
            
            /* LEARNING PATH SECTION */
            [data-theme="light"] .learning-path-section {
                background: #f5f5f5 !important;
                border-color: #e0e0e0 !important;
            }
            
            [data-theme="light"] .path-label {
                color: #555555 !important;
            }
            
            [data-theme="light"] .path-item {
                background: #ffffff !important;
                border-color: #e0e0e0 !important;
                color: #111111 !important;
            }
            
            [data-theme="light"] .current-badge {
                background: #6366f1 !important;
                color: #ffffff !important;
            }
            
            /* HEADER AREA */
            [data-theme="light"] .lesson-header h1 {
                color: #000000 !important;
            }
            
            [data-theme="light"] .lesson-subtitle {
                color: #333333 !important;
            }
            
            [data-theme="light"] .breadcrumb {
                color: #555555 !important;
            }
            
            [data-theme="light"] .meta-badges span {
                color: #555555 !important;
            }
            
            /* INLINE STYLE OVERRIDES */
            [data-theme="light"] [style*="background: #27272a"],
            [data-theme="light"] [style*="background:#27272a"],
            [data-theme="light"] [style*="background: #1f1f23"],
            [data-theme="light"] [style*="background:#1f1f23"],
            [data-theme="light"] [style*="background: #18181b"],
            [data-theme="light"] [style*="background:#18181b"],
            [data-theme="light"] [style*="background: #141416"],
            [data-theme="light"] [style*="background:#141416"] {
                background: #f5f5f5 !important;
            }
            
            [data-theme="light"] [style*="color: #fafafa"],
            [data-theme="light"] [style*="color:#fafafa"],
            [data-theme="light"] [style*="color: #e4e4e7"],
            [data-theme="light"] [style*="color:#e4e4e7"],
            [data-theme="light"] [style*="color: #a1a1aa"],
            [data-theme="light"] [style*="color:#a1a1aa"] {
                color: #111111 !important;
            }
        `;
        
        document.head.appendChild(styles);
    }

    // ================================================
    // EXPORTS
    // ================================================

    window.showEnhancedLesson = showEnhancedLesson;
    window.renderFullLesson = renderFullLesson; // Export for app.js to call directly
    window.EnhancedLessonViewer = {
        show: showEnhancedLesson,
        renderContent: renderFullLesson,
        state: LessonState,
        CAREER_ROLES,
        TOOL_LABS
    };

    console.log('✅ Enhanced Lesson Viewer v34 loaded (NEW format, accordion deep-dives)');

})();
