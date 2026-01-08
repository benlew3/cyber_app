// ================================================
// ENHANCED LESSON VIEWER - Security+ Platform v33
// Features: Flowcharts, Career Relevance, Skill Trees,
// Collapsible Sections, Micro-Quizzes, Progress Tracking
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

    // ================================================
    // MAIN RENDER FUNCTION
    // ================================================

    function showEnhancedLesson(lessonId) {
        const content = document.getElementById('content');
        
        // Find lesson in ALL_LESSONS or load from enhanced data
        let lesson = ALL_LESSONS.find(l => l.id === lessonId);
        if (!lesson) {
            console.error('Lesson not found:', lessonId);
            return;
        }

        // Try to load enhanced lesson data
        const enhancedData = APP.content.lessonData?.[lessonId];
        if (enhancedData) {
            lesson = { ...lesson, ...enhancedData };
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

        // Build the enhanced lesson view
        content.innerHTML = `
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
                                    ${lesson.difficulty.toUpperCase()}
                                </span>
                            ` : ''}
                            ${isCompleted ? '<span class="meta-item completed">✅ Completed</span>' : ''}
                            ${window.NotesSystem ? window.NotesSystem.renderNoteButton('lesson', lessonId, lesson.title) : ''}
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
                    
                    <!-- Summary Section -->
                    ${renderSummary(lesson)}
                    
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
                    <span class="toc-text">Introduction</span>
                </a>
            </li>
        `;
        
        // Skill Tree
        if (lesson.skill_tree) {
            html += `
                <li class="toc-item" data-section="skill-tree">
                    <a href="#section-skill-tree" onclick="scrollToSection('skill-tree'); return false;">
                        <span class="toc-icon">🌳</span>
                        <span class="toc-text">Learning Path</span>
                    </a>
                </li>
            `;
        }
        
        // Main sections
        sections.forEach((section, index) => {
            const sectionId = section.section_id || `section-${index}`;
            html += `
                <li class="toc-item" data-section="${sectionId}">
                    <a href="#${sectionId}" onclick="scrollToSection('${sectionId}'); return false;">
                        <span class="toc-number">${index + 1}</span>
                        <span class="toc-text">${escapeHtml(section.title)}</span>
                        <span class="toc-status" id="toc-status-${sectionId}"></span>
                    </a>
                </li>
            `;
        });
        
        // Summary
        html += `
            <li class="toc-item" data-section="summary">
                <a href="#section-summary" onclick="scrollToSection('summary'); return false;">
                    <span class="toc-icon">📝</span>
                    <span class="toc-text">Summary</span>
                </a>
            </li>
        `;
        
        // Quiz & Practice
        html += `
            <li class="toc-item toc-locked" data-section="practice" id="toc-practice">
                <a href="#section-practice" onclick="scrollToSection('practice'); return false;">
                    <span class="toc-icon">🎯</span>
                    <span class="toc-text">Quiz & Practice</span>
                    <span class="toc-lock">🔒</span>
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
                <span class="relevance-label">Who uses this:</span>
                <div class="relevance-badges">
                    ${roles.map(([roleKey, roleData]) => {
                        const role = CAREER_ROLES[roleKey];
                        if (!role) return '';
                        
                        const relevanceClass = roleData.relevance === 'critical' ? 'critical' : 
                                              roleData.relevance === 'high' ? 'high' : 'medium';
                        
                        return `
                            <button class="career-badge ${relevanceClass}" 
                                    onclick="showCareerDetail('${roleKey}')"
                                    title="${role.name}: ${roleData.relevance} relevance - ${roleData.percentage_of_job || ''}">
                                <span class="badge-icon">${role.icon}</span>
                                <span class="badge-name">${role.shortName}</span>
                                ${roleData.relevance === 'critical' ? '<span class="badge-star">★</span>' : ''}
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
                        <p>${formatContent(intro.hook)}</p>
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
                
                ${intro.why_it_matters ? `
                    <div class="why-matters-box collapsible" data-expanded="false">
                        <button class="collapsible-header why-matters-header" onclick="toggleCollapsible(this)">
                            <div class="header-left">
                                <h3>💡 Why This Matters</h3>
                                <span class="expand-hint">Click to expand</span>
                            </div>
                            <span class="collapse-icon">▶</span>
                        </button>
                        <div class="collapsible-content">
                            ${typeof intro.why_it_matters === 'string' ? `
                                <div class="matter-item">
                                    <p>${escapeHtml(intro.why_it_matters)}</p>
                                </div>
                            ` : `
                                ${intro.why_it_matters.career_impact ? `
                                    <div class="matter-item">
                                        <strong>Career Impact:</strong>
                                        <p>${escapeHtml(intro.why_it_matters.career_impact)}</p>
                                    </div>
                                ` : ''}
                                ${intro.why_it_matters.real_world_connection ? `
                                    <div class="matter-item">
                                        <strong>Real-World Connection:</strong>
                                        <p>${escapeHtml(intro.why_it_matters.real_world_connection)}</p>
                                    </div>
                                ` : ''}
                                ${intro.why_it_matters.exam_relevance ? `
                                    <div class="matter-item">
                                        <strong>Exam Relevance:</strong>
                                        <p>${escapeHtml(intro.why_it_matters.exam_relevance)}</p>
                                    </div>
                                ` : ''}
                            `}
                        </div>
                    </div>
                ` : ''}
            </section>
        `;
    }

    // ================================================
    // SKILL TREE VISUALIZATION
    // ================================================

    function renderSkillTreeMini(lesson) {
        if (!lesson.skill_tree) return '';
        
        const unlocks = lesson.skill_tree.unlocks || [];
        if (unlocks.length === 0) return '';
        
        // Helper to get unlock info
        const getUnlockInfo = (u) => {
            if (typeof u === 'string') {
                const lessonData = window.ALL_LESSONS ? window.ALL_LESSONS.find(l => l.id === u) : null;
                return { id: u, title: lessonData ? lessonData.title : u };
            } else if (typeof u === 'object' && u !== null) {
                return { id: u.lesson_id || u.id || '', title: u.title || u.lesson_id || '' };
            }
            return { id: '', title: '' };
        };
        
        const validUnlocks = unlocks
            .filter(u => {
                if (typeof u === 'string') return u.trim() !== '';
                if (typeof u === 'object' && u !== null) return u.lesson_id || u.id || u.title;
                return false;
            })
            .map(u => getUnlockInfo(u));
        
        if (validUnlocks.length === 0) return '';
        
        return `
            <div class="skill-tree-mini">
                <div class="mini-title">This Unlocks</div>
                ${validUnlocks.slice(0, 2).map(info => `
                    <div class="mini-unlock" onclick="showEnhancedLesson('${info.id}')">
                        <span class="mini-icon">→</span>
                        <span class="mini-text">${escapeHtml(info.title)}</span>
                    </div>
                `).join('')}
                ${validUnlocks.length > 2 ? `<div class="mini-more">+${validUnlocks.length - 2} more</div>` : ''}
            </div>
        `;
    }

    function renderSkillTreeFull(lesson) {
        if (!lesson.skill_tree) return '';
        
        const st = lesson.skill_tree;
        
        // Helper to get prerequisite/unlock display info
        const getNodeInfo = (node) => {
            if (typeof node === 'string') {
                // Look up the title from ALL_LESSONS if available
                const lessonData = window.ALL_LESSONS ? window.ALL_LESSONS.find(l => l.id === node) : null;
                return { 
                    id: node, 
                    title: lessonData ? lessonData.title : node,
                    connection: ''
                };
            } else if (typeof node === 'object' && node !== null) {
                return { 
                    id: node.lesson_id || node.id || '', 
                    title: node.title || node.lesson_id || node.id || '',
                    connection: node.connection || node.why_needed || ''
                };
            }
            return { id: '', title: '', connection: '' };
        };
        
        // Filter and process prerequisites
        const validPrereqs = (st.prerequisites || [])
            .filter(p => {
                if (typeof p === 'string') return p.trim() !== '';
                if (typeof p === 'object' && p !== null) return p.lesson_id || p.id || p.title;
                return false;
            })
            .map(p => getNodeInfo(p));
        
        // Filter and process unlocks
        const validUnlocks = (st.unlocks || [])
            .filter(u => {
                if (typeof u === 'string') return u.trim() !== '';
                if (typeof u === 'object' && u !== null) return u.lesson_id || u.id || u.title;
                return false;
            })
            .map(u => getNodeInfo(u));
        
        return `
            <section class="lesson-section skill-tree-section" id="section-skill-tree">
                <div class="collapsible" data-expanded="true">
                    <button class="collapsible-header" onclick="toggleCollapsible(this)">
                        <h2>🌳 Learning Path & Connections</h2>
                        <span class="collapse-icon">▼</span>
                    </button>
                    <div class="collapsible-content">
                        <div class="skill-tree-visual">
                            <!-- Prerequisites - Only show if there are valid ones -->
                            ${validPrereqs.length > 0 ? `
                                <div class="tree-column prereqs">
                                    <h4>Prerequisites</h4>
                                    ${validPrereqs.map(info => `
                                        <div class="tree-node prereq" onclick="showEnhancedLesson('${info.id}')" 
                                             title="${escapeHtml(info.connection)}">
                                            ${escapeHtml(info.title)}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="tree-arrow">→</div>
                            ` : ''}
                            
                            <!-- Current Lesson -->
                            <div class="tree-column current">
                                <h4>Current Lesson</h4>
                                <div class="tree-node current-node">
                                    <strong>${escapeHtml(lesson.title)}</strong>
                                    ${st.position ? `<span class="node-tier">${st.position.tier}</span>` : ''}
                                </div>
                            </div>
                            
                            <!-- Unlocks - Only show if there are valid ones -->
                            ${validUnlocks.length > 0 ? `
                                <div class="tree-arrow">→</div>
                                <div class="tree-column unlocks">
                                    <h4>Unlocks</h4>
                                    ${validUnlocks.map(info => `
                                        <div class="tree-node unlock" onclick="showEnhancedLesson('${info.id}')" 
                                             title="${escapeHtml(info.connection)}">
                                            <span class="node-title">${escapeHtml(info.title)}</span>
                                            ${info.connection ? `<span class="node-hint">${escapeHtml(info.connection)}</span>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Cross-Domain Connections -->
                        ${st.related_concepts && st.related_concepts.length > 0 ? `
                            <div class="cross-domain-section">
                                <h4>🔗 Cross-Domain Connections</h4>
                                <div class="cross-domain-grid">
                                    ${st.related_concepts.map(rc => `
                                        <div class="cross-domain-card" onclick="showEnhancedLesson('${rc.lesson}')">
                                            <span class="cd-topic">${escapeHtml(rc.topic)}</span>
                                            <span class="cd-relationship">${escapeHtml(rc.relationship)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Builds Toward -->
                        ${st.builds_toward && st.builds_toward.length > 0 ? `
                            <div class="builds-toward-section">
                                <h4>🎓 Builds Toward</h4>
                                <div class="builds-toward-list">
                                    ${st.builds_toward.map(b => `
                                        <span class="build-badge">${escapeHtml(b)}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </section>
        `;
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
                    
                    ${renderSectionContent(section, sectionId, index)}
                    
                    ${renderDeepDive(section)}
                    
                    ${renderCareerSpotlight(section)}
                    
                    ${renderMemoryHooks(section)}
                    
                    ${renderMicroQuizzes(section, sectionId, index)}
                    
                    ${renderSectionKeyPoints(section)}
                    
                    <div class="section-complete-bar" id="complete-bar-${sectionId}">
                        <button class="mark-complete-btn ${isCompleted ? 'completed' : ''}" 
                                onclick="markSectionComplete('${sectionId}', ${index})">
                            ${isCompleted ? '✅ Section Completed' : 'Mark Section Complete'}
                        </button>
                    </div>
                </section>
            `;
        }).join('');
    }

    // ================================================
    // SECTION CONTENT
    // ================================================

    function renderSectionContent(section, sectionId, index) {
        const content = section.content || {};
        
        let html = '';
        
        // Overview
        if (content.overview) {
            html += `<div class="content-overview">${formatContent(content.overview)}</div>`;
        }
        
        // Core Concepts with Flowchart potential
        if (content.core_concepts) {
            html += renderCoreConcepts(content.core_concepts, sectionId);
        }
        
        // Classification Framework (for controls lesson)
        if (content.classification_framework) {
            html += renderFlowchart(content.classification_framework);
        }
        
        // Exam Traps
        if (content.exam_traps) {
            html += renderExamTraps(content.exam_traps);
        }
        
        return html;
    }

    function renderCoreConcepts(concepts, sectionId) {
        return `
            <div class="core-concepts">
                ${concepts.map((concept, cIndex) => {
                    // Check if concept has any content beyond just the name
                    const hasContent = checkConceptHasContent(concept);
                    
                    if (!hasContent) {
                        // Just render as a simple label, not collapsible
                        return `
                            <div class="concept-card concept-simple">
                                <div class="concept-header-simple">
                                    <h3>${escapeHtml(concept.concept || concept.name || 'Concept')}</h3>
                                </div>
                            </div>
                        `;
                    }
                    
                    return `
                        <div class="concept-card collapsible" data-expanded="${cIndex === 0 ? 'true' : 'false'}">
                            <button class="collapsible-header concept-header" onclick="toggleCollapsible(this)">
                                <h3>${escapeHtml(concept.concept || concept.name || 'Concept')}</h3>
                                <span class="collapse-icon">${cIndex === 0 ? '▼' : '▶'}</span>
                            </button>
                            <div class="collapsible-content concept-content">
                                ${renderConceptContent(concept)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    function checkConceptHasContent(concept) {
        // Check if concept has any meaningful content
        const skipKeys = ['concept', 'name', 'id', 'section_id'];
        for (const key of Object.keys(concept)) {
            if (skipKeys.includes(key)) continue;
            const val = concept[key];
            if (val !== null && val !== undefined && val !== '') {
                if (typeof val === 'string' && val.trim() !== '') return true;
                if (typeof val === 'object') return true;
            }
        }
        return false;
    }
    
    function renderConceptContent(concept) {
        let html = '';
        const skipKeys = ['concept', 'name', 'id', 'section_id'];
        
        // First, handle known structured fields
        if (concept.definition) {
            html += `<p class="concept-definition">${escapeHtml(concept.definition)}</p>`;
        }
        
        if (concept.how_it_works) {
            html += `
                <div class="how-it-works">
                    <h4>How It Works</h4>
                    <p>${escapeHtml(concept.how_it_works.mechanism || concept.how_it_works)}</p>
                    ${concept.how_it_works.example_flow ? `
                        <div class="example-flow">
                            <strong>Example Flow:</strong>
                            <div class="flow-diagram">
                                ${renderFlowDiagram(concept.how_it_works.example_flow)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        if (concept.examples && Array.isArray(concept.examples) && concept.examples.length > 0) {
            html += `
                <div class="examples-grid">
                    <h4>Examples</h4>
                    <div class="examples-list">
                        ${concept.examples.map(ex => `
                            <div class="example-item">
                                <strong>${escapeHtml(ex.control || ex.name || ex.example || '')}</strong>
                                <p>${escapeHtml(ex.function || ex.description || '')}</p>
                                ${ex.implementation ? `<span class="impl-note">${escapeHtml(ex.implementation)}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (concept.what_would_happen_if) {
            html += `
                <div class="what-if-box">
                    <h4>⚠️ What Would Happen If...</h4>
                    <p class="what-if-scenario">${escapeHtml(concept.what_would_happen_if.scenario || '')}</p>
                    <p class="what-if-consequence">${escapeHtml(concept.what_would_happen_if.consequence || '')}</p>
                    ${concept.what_would_happen_if.real_example ? `
                        <div class="real-example">
                            <strong>Real Example:</strong> ${escapeHtml(concept.what_would_happen_if.real_example)}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Now handle any other fields dynamically
        const handledKeys = ['concept', 'name', 'id', 'section_id', 'definition', 'how_it_works', 'examples', 'what_would_happen_if'];
        
        for (const [key, value] of Object.entries(concept)) {
            if (handledKeys.includes(key)) continue;
            if (value === null || value === undefined || value === '') continue;
            
            const formattedKey = formatKeyName(key);
            
            if (typeof value === 'string') {
                html += `
                    <div class="concept-field">
                        <strong>${formattedKey}:</strong>
                        <span>${escapeHtml(value)}</span>
                    </div>
                `;
            } else if (Array.isArray(value)) {
                html += renderArrayField(formattedKey, value);
            } else if (typeof value === 'object') {
                html += renderObjectField(formattedKey, value);
            }
        }
        
        return html || '<p class="no-content">No additional details available.</p>';
    }
    
    function formatKeyName(key) {
        // Convert snake_case or camelCase to Title Case
        return key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
    
    function renderArrayField(label, arr) {
        if (!arr || arr.length === 0) return '';
        
        // Check if array contains objects or primitives
        const firstItem = arr[0];
        
        if (typeof firstItem === 'string') {
            return `
                <div class="concept-field array-field">
                    <strong>${label}:</strong>
                    <ul class="simple-list">
                        ${arr.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else if (typeof firstItem === 'object') {
            // Render as a table or list of cards
            const keys = Object.keys(firstItem);
            
            if (keys.length <= 4) {
                // Render as table
                return `
                    <div class="concept-field table-field">
                        <strong>${label}:</strong>
                        <table class="concept-table">
                            <thead>
                                <tr>${keys.map(k => `<th>${formatKeyName(k)}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${arr.map(item => `
                                    <tr>${keys.map(k => `<td>${escapeHtml(item[k] || '')}</td>`).join('')}</tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                // Render as cards
                return `
                    <div class="concept-field cards-field">
                        <strong>${label}:</strong>
                        <div class="mini-cards">
                            ${arr.map(item => `
                                <div class="mini-card">
                                    ${Object.entries(item).map(([k, v]) => `
                                        <div class="mini-card-row">
                                            <span class="mini-label">${formatKeyName(k)}:</span>
                                            <span class="mini-value">${escapeHtml(v || '')}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
        
        return '';
    }
    
    function renderObjectField(label, obj) {
        if (!obj || Object.keys(obj).length === 0) return '';
        
        return `
            <div class="concept-field object-field">
                <strong>${label}:</strong>
                <div class="object-content">
                    ${Object.entries(obj).map(([k, v]) => {
                        if (typeof v === 'object' && v !== null) {
                            if (Array.isArray(v)) {
                                return renderArrayField(formatKeyName(k), v);
                            }
                            return `
                                <div class="nested-object">
                                    <span class="nested-label">${formatKeyName(k)}:</span>
                                    <div class="nested-values">
                                        ${Object.entries(v).map(([nk, nv]) => `
                                            <span class="nested-item"><em>${formatKeyName(nk)}:</em> ${escapeHtml(nv || '')}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }
                        return `
                            <div class="object-row">
                                <span class="obj-label">${formatKeyName(k)}:</span>
                                <span class="obj-value">${escapeHtml(v || '')}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderFlowDiagram(flowText) {
        // Convert arrow-separated text into visual flow
        const steps = flowText.split('→').map(s => s.trim());
        
        return `
            <div class="visual-flow">
                ${steps.map((step, i) => `
                    <div class="flow-step">
                        <div class="step-content">${escapeHtml(step)}</div>
                    </div>
                    ${i < steps.length - 1 ? '<div class="flow-arrow">→</div>' : ''}
                `).join('')}
            </div>
        `;
    }

    function renderFlowchart(framework) {
        if (!framework || !framework.decision_tree) return '';
        
        return `
            <div class="flowchart-container">
                <h4>📊 Decision Flowchart</h4>
                <div class="flowchart">
                    ${framework.decision_tree.map((step, i) => `
                        <div class="flowchart-step">
                            <div class="step-number">${step.step || i + 1}</div>
                            <div class="step-question">${escapeHtml(step.question || '')}</div>
                            <div class="step-branches">
                                <div class="branch yes">
                                    <span class="branch-label">Yes →</span>
                                    <span class="branch-result">${escapeHtml(step.if_yes || '')}</span>
                                </div>
                                <div class="branch no">
                                    <span class="branch-label">No →</span>
                                    <span class="branch-result">${escapeHtml(step.if_no || '')}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ================================================
    // DEEP DIVE SECTION
    // ================================================

    function renderDeepDive(section) {
        if (!section.deep_dive) return '';
        
        const dd = section.deep_dive;
        
        return `
            <div class="deep-dive-section collapsible" data-expanded="false">
                <button class="collapsible-header deep-dive-header" onclick="toggleCollapsible(this)">
                    <h4>🔬 ${escapeHtml(dd.title || 'Technical Deep Dive')}</h4>
                    <span class="collapse-icon">▶</span>
                </button>
                <div class="collapsible-content deep-dive-content">
                    ${dd.content ? renderDeepDiveContent(dd.content) : ''}
                </div>
            </div>
        `;
    }

    function renderDeepDiveContent(content) {
        let html = '';
        
        // Classification methodology
        if (content.classification_methodology) {
            const cm = content.classification_methodology;
            html += `
                <div class="methodology-section">
                    <h5>${escapeHtml(cm.description || '')}</h5>
                    ${cm.steps ? `
                        <div class="methodology-steps">
                            ${cm.steps.map(step => `
                                <div class="method-step">
                                    <span class="step-num">Step ${step.step}</span>
                                    <p class="step-question">${escapeHtml(step.question)}</p>
                                    <div class="step-outcomes">
                                        <span class="outcome yes">If Yes: ${escapeHtml(step.if_yes)}</span>
                                        <span class="outcome no">If No: ${escapeHtml(step.if_no)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        // Control mapping matrix
        if (content.control_mapping_matrix) {
            const matrix = content.control_mapping_matrix;
            html += `
                <div class="matrix-section">
                    <h5>${escapeHtml(matrix.description || 'Control Mapping')}</h5>
                    <table class="mapping-table">
                        <thead>
                            <tr>
                                <th>Control</th>
                                <th>Category</th>
                                <th>Rationale</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${matrix.matrix.map(row => `
                                <tr>
                                    <td>${escapeHtml(row.control)}</td>
                                    <td><span class="category-badge">${escapeHtml(row.category)}</span></td>
                                    <td>${escapeHtml(row.rationale)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        return html;
    }

    // ================================================
    // CAREER SPOTLIGHT
    // ================================================

    function renderCareerSpotlight(section) {
        if (!section.career_spotlight) return '';
        
        const cs = section.career_spotlight;
        const role = CAREER_ROLES[cs.role] || { icon: '👤', name: cs.role, color: '#6366f1' };
        
        return `
            <div class="career-spotlight collapsible" data-expanded="false">
                <button class="collapsible-header spotlight-header" onclick="toggleCollapsible(this)" 
                        style="border-left-color: ${role.color}">
                    <h4>${role.icon} Career Spotlight: ${escapeHtml(cs.title || role.name)}</h4>
                    <span class="collapse-icon">▶</span>
                </button>
                <div class="collapsible-content spotlight-content">
                    ${cs.scenario ? `
                        <div class="scenario-walkthrough">
                            <div class="scenario-header">
                                <span class="scenario-time">${escapeHtml(cs.scenario.time || '')}</span>
                                <span class="scenario-role">${role.name}</span>
                            </div>
                            <p class="scenario-situation">${escapeHtml(cs.scenario.situation || '')}</p>
                            
                            ${cs.scenario.your_actions ? `
                                <div class="action-steps">
                                    <h5>Your Actions:</h5>
                                    ${cs.scenario.your_actions.map(action => `
                                        <div class="action-step">
                                            <span class="action-num">Step ${action.step}</span>
                                            <strong>${escapeHtml(action.action)}</strong>
                                            <p>${escapeHtml(action.details)}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            ${cs.scenario.outcome ? `
                                <div class="scenario-outcome">
                                    <strong>Outcome:</strong> ${escapeHtml(cs.scenario.outcome)}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${cs.skills_demonstrated ? `
                        <div class="skills-demonstrated">
                            <strong>Skills Demonstrated:</strong>
                            <div class="skills-tags">
                                ${cs.skills_demonstrated.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ================================================
    // MEMORY HOOKS
    // ================================================

    function renderMemoryHooks(section) {
        if (!section.memory_hooks) return '';
        
        const mh = section.memory_hooks;
        
        return `
            <div class="memory-hooks collapsible" data-expanded="false">
                <button class="collapsible-header memory-header" onclick="toggleCollapsible(this)">
                    <h4>🧠 Memory Hooks</h4>
                    <span class="collapse-icon">▶</span>
                </button>
                <div class="collapsible-content memory-content">
                    ${mh.mnemonic ? `
                        <div class="mnemonic-box">
                            <strong>Mnemonic:</strong>
                            <span class="mnemonic">${escapeHtml(mh.mnemonic)}</span>
                            ${mh.alternative_mnemonic ? `
                                <br><span class="alt-mnemonic">${escapeHtml(mh.alternative_mnemonic)}</span>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${mh.analogy ? `
                        <div class="analogy-box">
                            <strong>Analogy: ${escapeHtml(mh.analogy.concept || '')}</strong>
                            ${mh.analogy.mapping ? `
                                <div class="analogy-mapping">
                                    ${mh.analogy.mapping.map(m => `
                                        <div class="analogy-item">
                                            <span class="analogy-category">${escapeHtml(m.category)}</span>
                                            <span class="analogy-equals">=</span>
                                            <span class="analogy-equivalent">${escapeHtml(m.restaurant_equivalent || m.equivalent || '')}</span>
                                            <p class="analogy-explanation">${escapeHtml(m.explanation || '')}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${mh.common_mistakes ? `
                        <div class="common-mistakes">
                            <strong>⚠️ Common Mistakes:</strong>
                            ${mh.common_mistakes.map(cm => `
                                <div class="mistake-item">
                                    <p class="mistake">${escapeHtml(cm.mistake)}</p>
                                    <p class="why-wrong"><strong>Why wrong:</strong> ${escapeHtml(cm.why_wrong)}</p>
                                    <p class="correct-approach"><strong>Correct:</strong> ${escapeHtml(cm.correct_approach)}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // ================================================
    // MICRO QUIZZES
    // ================================================

    function renderMicroQuizzes(section, sectionId, sectionIndex) {
        const microChecks = section.micro_checks || [];
        if (microChecks.length === 0) return '';
        
        return `
            <div class="micro-quiz-section" id="micro-quiz-${sectionId}">
                <h4>🎯 Quick Check</h4>
                ${microChecks.map((check, qIndex) => {
                    const quizId = `${sectionId}-q${qIndex}`;
                    const isCompleted = LessonState.completedMicroQuizzes.has(quizId);
                    
                    return `
                        <div class="micro-quiz ${isCompleted ? 'completed' : ''}" id="quiz-${quizId}">
                            <p class="quiz-question">${escapeHtml(check.question)}</p>
                            
                            ${check.type === 'fill_in_blank' ? `
                                <div class="fill-blank-input">
                                    <input type="text" id="input-${quizId}" placeholder="Your answer..." 
                                           ${isCompleted ? 'disabled' : ''}>
                                    <button onclick="checkMicroQuiz('${quizId}', '${escapeHtml(check.answer)}', 'fill_in_blank')"
                                            ${isCompleted ? 'disabled' : ''}>
                                        Check
                                    </button>
                                </div>
                            ` : check.type === 'quick_recall' || check.type === 'classification' ? `
                                <div class="reveal-answer">
                                    <button onclick="revealAnswer('${quizId}')" id="reveal-btn-${quizId}"
                                            ${isCompleted ? 'style="display:none"' : ''}>
                                        Reveal Answer
                                    </button>
                                    <div class="answer-reveal" id="answer-${quizId}" 
                                         style="${isCompleted ? '' : 'display:none'}">
                                        <strong>Answer:</strong> ${escapeHtml(check.answer)}
                                        <button onclick="markMicroQuizComplete('${quizId}')" 
                                                class="got-it-btn" ${isCompleted ? 'style="display:none"' : ''}>
                                            ✓ Got It
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${check.hint ? `
                                <p class="quiz-hint" id="hint-${quizId}" style="display:none">
                                    💡 Hint: ${escapeHtml(check.hint)}
                                </p>
                                <button class="hint-btn" onclick="document.getElementById('hint-${quizId}').style.display='block'; this.style.display='none'">
                                    Show Hint
                                </button>
                            ` : ''}
                            
                            <div class="quiz-feedback" id="feedback-${quizId}"></div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // ================================================
    // SECTION KEY POINTS
    // ================================================

    function renderSectionKeyPoints(section) {
        const keyPoints = section.key_points || [];
        const mustRemember = section.must_remember_for_exam || [];
        
        if (keyPoints.length === 0 && mustRemember.length === 0) return '';
        
        return `
            <div class="section-key-points">
                ${keyPoints.length > 0 ? `
                    <div class="key-points-box">
                        <h4>📌 Key Points</h4>
                        <ul>
                            ${keyPoints.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${mustRemember.length > 0 ? `
                    <div class="exam-must-remember">
                        <h4>⭐ Must Remember for Exam</h4>
                        ${mustRemember.map(mr => `
                            <div class="must-remember-item">
                                <p class="fact">${escapeHtml(mr.fact)}</p>
                                <p class="why-tested">Why tested: ${escapeHtml(mr.why_tested)}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    function renderExamTraps(traps) {
        if (!traps || traps.length === 0) return '';
        
        return `
            <div class="exam-traps">
                <h4>⚠️ Exam Traps to Avoid</h4>
                ${traps.map(trap => `
                    <div class="trap-item">
                        <p class="trap-trap">${escapeHtml(trap.trap)}</p>
                        <p class="trap-reality"><strong>Reality:</strong> ${escapeHtml(trap.reality)}</p>
                        <p class="trap-tip"><strong>Exam Tip:</strong> ${escapeHtml(trap.exam_tip)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ================================================
    // SUMMARY SECTION
    // ================================================

    function renderSummary(lesson) {
        const summary = lesson.summary || {};
        
        return `
            <section class="lesson-section summary-section" id="section-summary">
                <h2>📝 Summary</h2>
                
                ${summary.key_takeaways ? `
                    <div class="takeaways-box">
                        <h4>Key Takeaways</h4>
                        <ul>
                            ${summary.key_takeaways.map(kt => `<li>${escapeHtml(kt)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${summary.exam_essentials ? `
                    <div class="exam-essentials-box">
                        <h4>🎯 Exam Essentials</h4>
                        <ul>
                            ${summary.exam_essentials.map(ee => `<li>${escapeHtml(ee)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${summary.career_connections ? `
                    <div class="career-connections">
                        <h4>💼 Career Connections</h4>
                        <div class="career-grid">
                            ${Object.entries(summary.career_connections).map(([role, connection]) => {
                                const roleInfo = CAREER_ROLES[role] || { icon: '👤', name: role };
                                return `
                                    <div class="career-connection-card">
                                        <span class="cc-role">${roleInfo.icon} ${roleInfo.name}</span>
                                        <p class="cc-text">${escapeHtml(connection)}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${summary.connection_to_next ? `
                    <div class="next-connection">
                        <h4>➡️ What's Next</h4>
                        <p>${escapeHtml(summary.connection_to_next)}</p>
                    </div>
                ` : ''}
            </section>
        `;
    }

    // ================================================
    // UNLOCK SECTION (Quiz & Simulations)
    // ================================================

    function renderUnlockSection(lesson, lessonId) {
        const sections = lesson.sections || [];
        const totalSections = sections.length;
        const relatedContent = lesson.related_content || {};
        
        return `
            <section class="lesson-section unlock-section" id="section-practice">
                <div class="unlock-gate" id="unlock-gate">
                    <div class="lock-icon">🔒</div>
                    <h3>Complete All Sections to Unlock</h3>
                    <p>Finish reading and complete the micro-quizzes in each section to access practice materials.</p>
                    <div class="unlock-progress">
                        <div class="unlock-bar">
                            <div class="unlock-fill" id="unlock-fill" style="width: 0%"></div>
                        </div>
                        <span class="unlock-text" id="unlock-text">0 / ${totalSections} sections</span>
                    </div>
                </div>
                
                <div class="unlocked-content" id="unlocked-content" style="display: none;">
                    <h3>🎉 Practice Materials Unlocked!</h3>
                    <div class="practice-options">
                        ${relatedContent.simulations && relatedContent.simulations.length > 0 ? `
                            <div class="practice-card simulation-card" onclick="startSimulation('${relatedContent.simulations[0]}')">
                                <span class="practice-icon">🎮</span>
                                <h4>Interactive Simulation</h4>
                                <p>Apply what you've learned in a realistic scenario</p>
                                <span class="practice-id">${relatedContent.simulations[0]}</span>
                            </div>
                        ` : ''}
                        
                        <div class="practice-card quiz-card" onclick="startDomainQuiz(${lesson.domain})">
                            <span class="practice-icon">📝</span>
                            <h4>Domain Quiz</h4>
                            <p>Test your knowledge with exam-style questions</p>
                            <span class="practice-id">Domain ${lesson.domain}</span>
                        </div>
                        
                        ${relatedContent.remediation && relatedContent.remediation.length > 0 ? `
                            <div class="practice-card remediation-card" onclick="startRemediation('${relatedContent.remediation[0]}')">
                                <span class="practice-icon">🔧</span>
                                <h4>Extra Practice</h4>
                                <p>Targeted exercises for this topic</p>
                                <span class="practice-id">${relatedContent.remediation[0]}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    ${relatedContent.next_lesson ? `
                        <div class="next-lesson-prompt">
                            <p>Ready to continue?</p>
                            <button class="btn btn-primary" onclick="showEnhancedLesson('${relatedContent.next_lesson}')">
                                Next Lesson →
                            </button>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    }

    // ================================================
    // INTERACTION HANDLERS
    // ================================================

    function initializeLessonInteractions(lesson) {
        // Track scroll for TOC highlighting
        window.addEventListener('scroll', debounce(handleScroll, 100));
        
        // Check unlock status
        checkUnlockStatus();
    }

    window.scrollToSection = function(sectionId) {
        const element = document.getElementById(`section-${sectionId}`) || document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.toggleCollapsible = function(header) {
        const collapsible = header.closest('.collapsible');
        const isExpanded = collapsible.dataset.expanded === 'true';
        
        collapsible.dataset.expanded = !isExpanded;
        const icon = header.querySelector('.collapse-icon');
        if (icon) {
            icon.textContent = isExpanded ? '▶' : '▼';
        }
        
        const content = collapsible.querySelector('.collapsible-content');
        if (content) {
            content.style.display = isExpanded ? 'none' : 'block';
        }
    };

    window.markSectionComplete = function(sectionId, index) {
        LessonState.completedSections.add(sectionId);
        
        // Save to localStorage
        const lessonId = LessonState.currentLesson.lesson_id || LessonState.currentLesson.id;
        localStorage.setItem(
            `lesson_sections_${lessonId}`,
            JSON.stringify([...LessonState.completedSections])
        );
        
        // Update UI
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('completed');
        
        const btn = section?.querySelector('.mark-complete-btn');
        if (btn) {
            btn.classList.add('completed');
            btn.textContent = '✅ Section Completed';
        }
        
        const tocStatus = document.getElementById(`toc-status-${sectionId}`);
        if (tocStatus) tocStatus.textContent = '✓';
        
        updateProgress();
        checkUnlockStatus();
    };

    window.checkMicroQuiz = function(quizId, correctAnswer, type) {
        const input = document.getElementById(`input-${quizId}`);
        const feedback = document.getElementById(`feedback-${quizId}`);
        
        if (!input || !feedback) return;
        
        const userAnswer = input.value.trim().toLowerCase();
        const correct = correctAnswer.toLowerCase();
        
        // Check if answer contains key terms
        const isCorrect = correct.split(/[,;()]/).some(term => 
            userAnswer.includes(term.trim().toLowerCase())
        );
        
        if (isCorrect) {
            feedback.innerHTML = '<span class="correct">✅ Correct!</span>';
            feedback.className = 'quiz-feedback correct';
            markMicroQuizComplete(quizId);
            input.disabled = true;
        } else {
            feedback.innerHTML = `<span class="incorrect">❌ Not quite. The answer is: ${escapeHtml(correctAnswer)}</span>`;
            feedback.className = 'quiz-feedback incorrect';
        }
    };

    window.revealAnswer = function(quizId) {
        const answerDiv = document.getElementById(`answer-${quizId}`);
        const revealBtn = document.getElementById(`reveal-btn-${quizId}`);
        
        if (answerDiv) answerDiv.style.display = 'block';
        if (revealBtn) revealBtn.style.display = 'none';
    };

    window.markMicroQuizComplete = function(quizId) {
        LessonState.completedMicroQuizzes.add(quizId);
        
        const lessonId = LessonState.currentLesson.lesson_id || LessonState.currentLesson.id;
        localStorage.setItem(
            `lesson_quizzes_${lessonId}`,
            JSON.stringify([...LessonState.completedMicroQuizzes])
        );
        
        const quizDiv = document.getElementById(`quiz-${quizId}`);
        if (quizDiv) quizDiv.classList.add('completed');
        
        // Hide got it button
        const gotItBtn = quizDiv?.querySelector('.got-it-btn');
        if (gotItBtn) gotItBtn.style.display = 'none';
        
        updateProgress();
        checkUnlockStatus();
    };

    window.showCareerDetail = function(roleKey) {
        const lesson = LessonState.currentLesson;
        if (!lesson.role_relevance || !lesson.role_relevance[roleKey]) return;
        
        const roleData = lesson.role_relevance[roleKey];
        const role = CAREER_ROLES[roleKey];
        
        // Create modal with role details
        const modal = document.createElement('div');
        modal.className = 'career-modal-overlay';
        modal.innerHTML = `
            <div class="career-modal">
                <button class="modal-close" onclick="this.closest('.career-modal-overlay').remove()">×</button>
                <h2>${role.icon} ${role.name}</h2>
                <div class="modal-relevance">
                    <span class="relevance-level ${roleData.relevance}">${roleData.relevance.toUpperCase()}</span>
                    <span class="job-percentage">${roleData.percentage_of_job || ''} of daily work</span>
                </div>
                <p class="daily-usage">${roleData.daily_usage || ''}</p>
                
                ${roleData.specific_tasks ? `
                    <div class="modal-tasks">
                        <h4>Specific Tasks</h4>
                        <ul>${roleData.specific_tasks.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                
                ${roleData.tools_youll_use ? `
                    <div class="modal-tools">
                        <h4>Tools You'll Use</h4>
                        <div class="tools-list">
                            ${roleData.tools_youll_use.map(t => `<span class="tool-tag">${escapeHtml(t)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    };

    function updateProgress() {
        const lesson = LessonState.currentLesson;
        if (!lesson) return;
        
        const sections = lesson.sections || [];
        const totalSections = sections.length;
        const completedCount = LessonState.completedSections.size;
        const percentage = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;
        
        // Update progress circle
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.setAttribute('stroke-dasharray', `${percentage}, 100`);
        }
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
        
        // Update unlock progress
        const unlockFill = document.getElementById('unlock-fill');
        const unlockText = document.getElementById('unlock-text');
        
        if (unlockFill) unlockFill.style.width = `${percentage}%`;
        if (unlockText) unlockText.textContent = `${completedCount} / ${totalSections} sections`;
    }

    function checkUnlockStatus() {
        const lesson = LessonState.currentLesson;
        if (!lesson) return;
        
        const sections = lesson.sections || [];
        const allCompleted = sections.every((s, i) => {
            const sectionId = s.section_id || `section-${i}`;
            return LessonState.completedSections.has(sectionId);
        });
        
        const gate = document.getElementById('unlock-gate');
        const content = document.getElementById('unlocked-content');
        const tocPractice = document.getElementById('toc-practice');
        
        if (allCompleted || sections.length === 0) {
            if (gate) gate.style.display = 'none';
            if (content) content.style.display = 'block';
            if (tocPractice) {
                tocPractice.classList.remove('toc-locked');
                const lock = tocPractice.querySelector('.toc-lock');
                if (lock) lock.style.display = 'none';
            }
            
            // Mark lesson as completed in progress
            const lessonId = lesson.lesson_id || lesson.id;
            if (!APP.progress.completedLessons.includes(lessonId)) {
                APP.progress.completedLessons.push(lessonId);
                if (typeof saveProgress === 'function') saveProgress();
            }
        }
    }

    function handleScroll() {
        // Highlight current section in TOC
        const sections = document.querySelectorAll('.lesson-section');
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150) {
                current = section.id;
            }
        });
        
        // Update TOC highlighting
        document.querySelectorAll('.toc-item').forEach(item => {
            const sectionId = item.dataset.section;
            if (current.includes(sectionId) || current === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ================================================
    // STYLES INJECTION
    // ================================================

    function injectEnhancedLessonStyles() {
        if (document.getElementById('enhanced-lesson-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'enhanced-lesson-styles';
        styles.textContent = `
            /* Enhanced Lesson Container */
            .enhanced-lesson-container {
                display: grid;
                grid-template-columns: 260px 1fr;
                gap: 0;
                min-height: 100vh;
                max-width: 1600px;
                margin: 0 auto;
            }
            
            /* Sidebar */
            .lesson-sidebar {
                position: sticky;
                top: 70px;
                height: calc(100vh - 70px);
                background: #18181b;
                border-right: 1px solid #27272a;
                padding: 20px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            
            .sidebar-header {
                margin-bottom: 20px;
            }
            
            .back-btn-small {
                background: transparent;
                border: 1px solid #3f3f46;
                color: #a1a1aa;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.85rem;
                width: 100%;
                text-align: left;
            }
            
            .back-btn-small:hover {
                border-color: #6366f1;
                color: #fafafa;
            }
            
            /* Progress Circle */
            .sidebar-progress {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #27272a;
                margin-bottom: 20px;
            }
            
            .progress-circle {
                width: 80px;
                height: 80px;
                margin: 0 auto 10px;
                position: relative;
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
                transition: stroke-dasharray 0.5s;
            }
            
            .progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.2rem;
                font-weight: bold;
                color: #fafafa;
            }
            
            .progress-label {
                color: #71717a;
                font-size: 0.85rem;
            }
            
            /* TOC */
            .sidebar-nav {
                flex: 1;
            }
            
            .toc-title {
                font-size: 0.75rem;
                text-transform: uppercase;
                color: #71717a;
                margin-bottom: 10px;
                letter-spacing: 0.05em;
            }
            
            .toc-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .toc-item {
                margin-bottom: 4px;
            }
            
            .toc-item a {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 10px;
                border-radius: 6px;
                color: #a1a1aa;
                text-decoration: none;
                font-size: 0.9rem;
                transition: all 0.2s;
            }
            
            .toc-item a:hover {
                background: #27272a;
                color: #fafafa;
            }
            
            .toc-item.active a {
                background: rgba(99, 102, 241, 0.1);
                color: #6366f1;
                border-left: 2px solid #6366f1;
            }
            
            .toc-item.toc-locked a {
                opacity: 0.5;
            }
            
            .toc-number {
                width: 20px;
                height: 20px;
                background: #27272a;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
            }
            
            .toc-status {
                margin-left: auto;
                color: #10b981;
            }
            
            .toc-lock {
                margin-left: auto;
                font-size: 0.7rem;
            }
            
            /* Skill Tree Mini */
            .skill-tree-mini {
                padding-top: 20px;
                border-top: 1px solid #27272a;
            }
            
            .mini-title {
                font-size: 0.75rem;
                color: #71717a;
                margin-bottom: 10px;
            }
            
            .mini-unlock {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px;
                background: #27272a;
                border-radius: 6px;
                margin-bottom: 6px;
                cursor: pointer;
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            .mini-unlock:hover {
                background: #3f3f46;
                color: #fafafa;
            }
            
            .mini-more {
                font-size: 0.8rem;
                color: #6366f1;
                padding: 4px 8px;
            }
            
            /* Main Content */
            .lesson-main {
                padding: 30px 40px;
                max-width: 900px;
            }
            
            /* Lesson Header */
            .lesson-header {
                margin-bottom: 40px;
            }
            
            .lesson-breadcrumb {
                font-size: 0.85rem;
                color: #71717a;
                margin-bottom: 10px;
            }
            
            .lesson-title {
                font-size: 2.2rem;
                font-weight: 700;
                margin-bottom: 10px;
                color: #fafafa;
            }
            
            .lesson-subtitle {
                font-size: 1.1rem;
                color: #a1a1aa;
                margin-bottom: 20px;
            }
            
            .lesson-meta-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .meta-item {
                font-size: 0.9rem;
                color: #71717a;
            }
            
            .meta-item.completed {
                color: #10b981;
            }
            
            /* Difficulty badges in lesson header - combined for specificity */
            .meta-item.difficulty-beginner {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 0.8rem;
                background: #10b981;
                color: #ffffff !important;
            }
            
            .meta-item.difficulty-intermediate {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 0.8rem;
                background: #f59e0b;
                color: #ffffff !important;
            }
            
            .meta-item.difficulty-advanced {
                display: inline-block;
                padding: 4px 10px;
                border-radius: 4px;
                font-weight: 600;
                font-size: 0.8rem;
                background: #ef4444;
                color: #ffffff !important;
            }
            
            /* Career Relevance Bar */
            .career-relevance-bar {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: #18181b;
                border-radius: 8px;
                margin-bottom: 20px;
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
                gap: 5px;
                padding: 6px 12px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .career-badge:hover {
                transform: translateY(-2px);
                border-color: #6366f1;
            }
            
            .career-badge.critical {
                border-color: #6366f1;
                background: rgba(99, 102, 241, 0.1);
            }
            
            .career-badge.high {
                border-color: #10b981;
                background: rgba(16, 185, 129, 0.1);
            }
            
            .badge-icon { font-size: 1rem; }
            .badge-name { font-size: 0.85rem; color: #fafafa; }
            .badge-star { color: #f59e0b; }
            
            /* Sections */
            .lesson-section {
                margin-bottom: 40px;
                padding: 30px;
                background: #18181b;
                border-radius: 12px;
                border: 1px solid #27272a;
            }
            
            .lesson-section.completed {
                border-color: #10b981;
            }
            
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .section-header h2 {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 1.5rem;
                color: #fafafa;
            }
            
            .section-number {
                width: 32px;
                height: 32px;
                background: #6366f1;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
            }
            
            .section-time {
                color: #71717a;
                font-size: 0.9rem;
            }
            
            /* Collapsible */
            .collapsible {
                margin-bottom: 20px;
            }
            
            .collapsible-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: #27272a;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                color: #fafafa;
                text-align: left;
            }
            
            .collapsible-header h3,
            .collapsible-header h4 {
                margin: 0;
                font-size: 1.1rem;
            }
            
            .collapse-icon {
                color: #71717a;
                transition: transform 0.2s;
            }
            
            /* Why It Matters special styling */
            .why-matters-header {
                background: linear-gradient(135deg, #27272a, #1f1f23);
                border: 1px solid #3f3f46;
                transition: all 0.2s;
            }
            
            .why-matters-header:hover {
                border-color: #6366f1;
                background: linear-gradient(135deg, #2d2d35, #252530);
            }
            
            .header-left {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            
            .expand-hint {
                font-size: 0.75rem;
                color: #6366f1;
                font-weight: normal;
                opacity: 0.8;
            }
            
            .collapsible[data-expanded="true"] .expand-hint {
                display: none;
            }
            
            .collapsible[data-expanded="false"] .collapsible-content {
                display: none;
            }
            
            .collapsible-content {
                padding: 20px;
                border: 1px solid #27272a;
                border-top: none;
                border-radius: 0 0 8px 8px;
            }
            
            /* Core Concepts */
            .concept-card {
                margin-bottom: 15px;
            }
            
            .concept-header {
                background: linear-gradient(135deg, #27272a, #1f1f23);
            }
            
            .concept-definition {
                font-size: 1.05rem;
                line-height: 1.7;
                color: #e4e4e7;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(99, 102, 241, 0.05);
                border-left: 3px solid #6366f1;
                border-radius: 4px;
            }
            
            /* Simple concept (no dropdown) */
            .concept-simple {
                background: #18181b;
                border: 1px solid #27272a;
                border-radius: 8px;
                margin-bottom: 15px;
            }
            
            .concept-header-simple {
                padding: 15px;
            }
            
            .concept-header-simple h3 {
                margin: 0;
                color: #fafafa;
                font-size: 1rem;
            }
            
            /* Dynamic concept fields */
            .concept-field {
                margin: 15px 0;
                padding: 12px 15px;
                background: #1f1f23;
                border-radius: 8px;
                border-left: 3px solid #3f3f46;
            }
            
            .concept-field > strong {
                display: block;
                color: #a1a1aa;
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }
            
            .concept-field > span {
                color: #e4e4e7;
                line-height: 1.6;
            }
            
            /* Simple list */
            .simple-list {
                margin: 0;
                padding-left: 20px;
                color: #e4e4e7;
            }
            
            .simple-list li {
                margin: 5px 0;
            }
            
            /* Concept table */
            .concept-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 0.9rem;
            }
            
            .concept-table th {
                background: #27272a;
                color: #a1a1aa;
                padding: 10px 12px;
                text-align: left;
                font-weight: 600;
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .concept-table td {
                padding: 10px 12px;
                border-bottom: 1px solid #27272a;
                color: #e4e4e7;
            }
            
            .concept-table tr:last-child td {
                border-bottom: none;
            }
            
            .concept-table tr:hover td {
                background: rgba(99, 102, 241, 0.05);
            }
            
            /* Mini cards for array items */
            .mini-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                margin-top: 10px;
            }
            
            .mini-card {
                background: #18181b;
                border: 1px solid #27272a;
                border-radius: 8px;
                padding: 12px;
            }
            
            .mini-card-row {
                margin: 6px 0;
            }
            
            .mini-label {
                color: #71717a;
                font-size: 0.8rem;
            }
            
            .mini-value {
                color: #e4e4e7;
                display: block;
                margin-top: 2px;
            }
            
            /* Object content */
            .object-content {
                margin-top: 10px;
            }
            
            .object-row {
                display: flex;
                gap: 10px;
                padding: 8px 0;
                border-bottom: 1px solid #27272a;
            }
            
            .object-row:last-child {
                border-bottom: none;
            }
            
            .obj-label {
                color: #71717a;
                min-width: 120px;
                font-size: 0.9rem;
            }
            
            .obj-value {
                color: #e4e4e7;
                flex: 1;
            }
            
            /* Nested objects */
            .nested-object {
                padding: 10px 0;
                border-bottom: 1px solid #27272a;
            }
            
            .nested-object:last-child {
                border-bottom: none;
            }
            
            .nested-label {
                color: #a1a1aa;
                font-weight: 600;
                display: block;
                margin-bottom: 8px;
            }
            
            .nested-values {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .nested-item {
                color: #e4e4e7;
                font-size: 0.9rem;
            }
            
            .nested-item em {
                color: #71717a;
                font-style: normal;
            }
            
            /* No content message */
            .no-content {
                color: #71717a;
                font-style: italic;
                text-align: center;
                padding: 20px;
            }
            
            .how-it-works {
                margin: 20px 0;
                padding: 20px;
                background: #1f1f23;
                border-radius: 8px;
            }
            
            .how-it-works h4 {
                color: #6366f1;
                margin-bottom: 10px;
            }
            
            /* Flow Diagram */
            .visual-flow {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 10px;
                margin-top: 15px;
                padding: 15px;
                background: #18181b;
                border-radius: 8px;
                overflow-x: auto;
            }
            
            .flow-step {
                background: #27272a;
                padding: 10px 15px;
                border-radius: 6px;
                border: 1px solid #3f3f46;
                font-size: 0.9rem;
                color: #e4e4e7;
            }
            
            .flow-arrow {
                color: #6366f1;
                font-size: 1.2rem;
            }
            
            /* Examples Grid */
            .examples-grid {
                margin-top: 20px;
            }
            
            .examples-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 15px;
            }
            
            .example-item {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
                border: 1px solid #27272a;
            }
            
            .example-item strong {
                color: #6366f1;
            }
            
            .example-item p {
                margin: 8px 0;
                color: #a1a1aa;
                font-size: 0.9rem;
            }
            
            .impl-note {
                font-size: 0.8rem;
                color: #71717a;
                font-style: italic;
            }
            
            /* What If Box */
            .what-if-box {
                margin-top: 20px;
                padding: 20px;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 8px;
            }
            
            .what-if-box h4 {
                color: #ef4444;
                margin-bottom: 10px;
            }
            
            .what-if-scenario {
                font-style: italic;
                color: #e4e4e7;
            }
            
            .what-if-consequence {
                color: #fca5a5;
                margin: 10px 0;
            }
            
            .real-example {
                margin-top: 15px;
                padding: 10px;
                background: rgba(0,0,0,0.2);
                border-radius: 6px;
                font-size: 0.9rem;
                color: #a1a1aa;
            }
            
            /* Skill Tree Full */
            .skill-tree-visual {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                overflow-x: auto;
                padding: 20px 0;
            }
            
            .tree-column {
                min-width: 200px;
            }
            
            .tree-column h4 {
                font-size: 0.85rem;
                color: #71717a;
                margin-bottom: 10px;
                text-align: center;
            }
            
            .tree-node {
                padding: 12px 15px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .tree-node:hover {
                border-color: #6366f1;
                transform: translateY(-2px);
            }
            
            .tree-node.current-node {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-color: #6366f1;
            }
            
            .tree-arrow {
                font-size: 2rem;
                color: #6366f1;
                align-self: center;
            }
            
            .node-title {
                display: block;
                color: #fafafa;
                font-size: 0.9rem;
            }
            
            .node-hint {
                display: block;
                font-size: 0.75rem;
                color: #a1a1aa;
                margin-top: 5px;
            }
            
            .node-tier {
                display: block;
                font-size: 0.75rem;
                color: rgba(255,255,255,0.7);
                margin-top: 5px;
            }
            
            /* Cross Domain */
            .cross-domain-section {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #27272a;
            }
            
            .cross-domain-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .cross-domain-card {
                padding: 15px;
                background: #1f1f23;
                border: 1px solid #27272a;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .cross-domain-card:hover {
                border-color: #6366f1;
                transform: translateY(-2px);
            }
            
            .cd-topic {
                display: block;
                color: #6366f1;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .cd-relationship {
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            /* Builds Toward */
            .builds-toward-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            
            .build-badge {
                padding: 8px 15px;
                background: rgba(99, 102, 241, 0.1);
                border: 1px solid rgba(99, 102, 241, 0.3);
                border-radius: 20px;
                font-size: 0.85rem;
                color: #a5b4fc;
            }
            
            /* Career Spotlight */
            .career-spotlight {
                border-left: 4px solid #6366f1;
            }
            
            .spotlight-header {
                background: linear-gradient(135deg, #27272a, #1f1f23);
            }
            
            .scenario-walkthrough {
                padding: 20px;
            }
            
            .scenario-header {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .scenario-time {
                padding: 4px 10px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            .scenario-role {
                padding: 4px 10px;
                background: rgba(99, 102, 241, 0.1);
                border-radius: 4px;
                font-size: 0.85rem;
                color: #6366f1;
            }
            
            .scenario-situation {
                font-size: 1rem;
                line-height: 1.7;
                color: #e4e4e7;
                margin-bottom: 20px;
            }
            
            .action-steps {
                margin: 20px 0;
            }
            
            .action-step {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
            }
            
            .action-num {
                padding: 4px 10px;
                background: #6366f1;
                border-radius: 4px;
                font-size: 0.8rem;
                height: fit-content;
            }
            
            .action-step strong {
                display: block;
                color: #fafafa;
                margin-bottom: 5px;
            }
            
            .action-step p {
                color: #a1a1aa;
                font-size: 0.9rem;
                margin: 0;
            }
            
            .scenario-outcome {
                padding: 15px;
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                border-radius: 8px;
                color: #10b981;
            }
            
            .skills-demonstrated {
                margin-top: 20px;
            }
            
            .skills-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }
            
            .skill-tag {
                padding: 5px 12px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            /* Memory Hooks */
            .memory-hooks {
                border-left: 4px solid #f59e0b;
            }
            
            .mnemonic-box {
                padding: 15px;
                background: rgba(245, 158, 11, 0.1);
                border-radius: 8px;
                margin-bottom: 15px;
            }
            
            .mnemonic {
                font-size: 1.2rem;
                font-weight: bold;
                color: #f59e0b;
            }
            
            .alt-mnemonic {
                color: #a1a1aa;
                font-size: 0.9rem;
            }
            
            .analogy-box {
                margin-top: 15px;
            }
            
            .analogy-mapping {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .analogy-item {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
            }
            
            .analogy-category {
                color: #6366f1;
                font-weight: bold;
            }
            
            .analogy-equals {
                margin: 0 8px;
                color: #71717a;
            }
            
            .analogy-equivalent {
                color: #f59e0b;
            }
            
            .analogy-explanation {
                margin-top: 8px;
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            .common-mistakes {
                margin-top: 20px;
            }
            
            .mistake-item {
                padding: 15px;
                background: rgba(239, 68, 68, 0.05);
                border: 1px solid rgba(239, 68, 68, 0.2);
                border-radius: 8px;
                margin-top: 10px;
            }
            
            .mistake {
                color: #ef4444;
                font-weight: 500;
            }
            
            .why-wrong, .correct-approach {
                font-size: 0.9rem;
                color: #a1a1aa;
                margin-top: 8px;
            }
            
            /* Micro Quiz */
            .micro-quiz-section {
                margin-top: 30px;
                padding: 20px;
                background: rgba(99, 102, 241, 0.05);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 8px;
            }
            
            .micro-quiz-section h4 {
                color: #6366f1;
                margin-bottom: 15px;
            }
            
            .micro-quiz {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
                margin-bottom: 15px;
            }
            
            .micro-quiz.completed {
                border: 1px solid #10b981;
            }
            
            .quiz-question {
                font-size: 1rem;
                color: #e4e4e7;
                margin-bottom: 15px;
            }
            
            .fill-blank-input {
                display: flex;
                gap: 10px;
            }
            
            .fill-blank-input input {
                flex: 1;
                padding: 10px 15px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 6px;
                color: #fafafa;
            }
            
            .fill-blank-input button,
            .reveal-answer button,
            .got-it-btn {
                padding: 10px 20px;
                background: #6366f1;
                border: none;
                border-radius: 6px;
                color: white;
                cursor: pointer;
            }
            
            .fill-blank-input button:hover,
            .reveal-answer button:hover {
                background: #4f46e5;
            }
            
            .answer-reveal {
                padding: 15px;
                background: #27272a;
                border-radius: 6px;
                margin-top: 10px;
            }
            
            .got-it-btn {
                margin-left: 15px;
                background: #10b981;
            }
            
            .quiz-hint {
                font-size: 0.9rem;
                color: #f59e0b;
                background: rgba(245, 158, 11, 0.1);
                padding: 10px;
                border-radius: 6px;
                margin-top: 10px;
            }
            
            .hint-btn {
                background: transparent;
                border: 1px solid #3f3f46;
                color: #a1a1aa;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.8rem;
                cursor: pointer;
                margin-top: 10px;
            }
            
            .quiz-feedback {
                margin-top: 10px;
                padding: 10px;
                border-radius: 6px;
            }
            
            .quiz-feedback.correct {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }
            
            .quiz-feedback.incorrect {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            
            /* Key Points */
            .section-key-points {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #27272a;
            }
            
            .key-points-box, .exam-essentials-box {
                padding: 20px;
                background: #1f1f23;
                border-radius: 8px;
                margin-bottom: 15px;
            }
            
            .key-points-box {
                border-left: 4px solid #6366f1;
            }
            
            .exam-essentials-box {
                border-left: 4px solid #f59e0b;
            }
            
            .exam-must-remember {
                padding: 20px;
                background: rgba(245, 158, 11, 0.05);
                border: 1px solid rgba(245, 158, 11, 0.2);
                border-radius: 8px;
            }
            
            .must-remember-item {
                padding: 10px 0;
                border-bottom: 1px solid #27272a;
            }
            
            .must-remember-item:last-child {
                border-bottom: none;
            }
            
            .must-remember-item .fact {
                color: #f59e0b;
                font-weight: 500;
            }
            
            .must-remember-item .why-tested {
                font-size: 0.85rem;
                color: #a1a1aa;
                margin-top: 5px;
            }
            
            /* Section Complete */
            .section-complete-bar {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #27272a;
                text-align: center;
            }
            
            .mark-complete-btn {
                padding: 12px 30px;
                background: #27272a;
                border: 1px solid #3f3f46;
                border-radius: 8px;
                color: #a1a1aa;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s;
            }
            
            .mark-complete-btn:hover {
                background: #6366f1;
                border-color: #6366f1;
                color: white;
            }
            
            .mark-complete-btn.completed {
                background: #10b981;
                border-color: #10b981;
                color: white;
            }
            
            /* Unlock Section */
            .unlock-section {
                text-align: center;
            }
            
            .unlock-gate {
                padding: 40px;
            }
            
            .lock-icon {
                font-size: 3rem;
                margin-bottom: 20px;
            }
            
            .unlock-gate h3 {
                color: #fafafa;
                margin-bottom: 10px;
            }
            
            .unlock-gate p {
                color: #a1a1aa;
                margin-bottom: 20px;
            }
            
            .unlock-progress {
                max-width: 300px;
                margin: 0 auto;
            }
            
            .unlock-bar {
                height: 8px;
                background: #27272a;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .unlock-fill {
                height: 100%;
                background: linear-gradient(90deg, #6366f1, #8b5cf6);
                transition: width 0.5s;
            }
            
            .unlock-text {
                color: #71717a;
                font-size: 0.9rem;
            }
            
            .unlocked-content h3 {
                color: #10b981;
                margin-bottom: 25px;
            }
            
            .practice-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .practice-card {
                padding: 25px;
                background: #1f1f23;
                border: 1px solid #27272a;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }
            
            .practice-card:hover {
                transform: translateY(-4px);
                border-color: #6366f1;
            }
            
            .practice-icon {
                font-size: 2.5rem;
                display: block;
                margin-bottom: 15px;
            }
            
            .practice-card h4 {
                color: #fafafa;
                margin-bottom: 8px;
            }
            
            .practice-card p {
                color: #a1a1aa;
                font-size: 0.9rem;
                margin-bottom: 10px;
            }
            
            .practice-id {
                font-size: 0.8rem;
                color: #71717a;
            }
            
            .next-lesson-prompt {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #27272a;
            }
            
            .next-lesson-prompt p {
                color: #a1a1aa;
                margin-bottom: 15px;
            }
            
            /* Bottom Navigation */
            .lesson-bottom-nav {
                display: flex;
                justify-content: space-between;
                gap: 20px;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 1px solid #27272a;
            }
            
            .lesson-bottom-nav .nav-btn {
                flex: 1;
                max-width: 300px;
                padding: 15px 20px;
                background: #18181b;
                border: 1px solid #27272a;
                border-radius: 8px;
                cursor: pointer;
                text-align: left;
                transition: all 0.2s;
            }
            
            .lesson-bottom-nav .nav-btn:hover {
                border-color: #6366f1;
                transform: translateY(-2px);
            }
            
            .lesson-bottom-nav .nav-btn.home {
                max-width: 150px;
                text-align: center;
            }
            
            .nav-direction {
                display: block;
                font-size: 0.85rem;
                color: #6366f1;
                margin-bottom: 5px;
            }
            
            .nav-title {
                display: block;
                color: #fafafa;
                font-size: 0.95rem;
            }
            
            .nav-placeholder {
                flex: 1;
                max-width: 300px;
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
                z-index: 9999;
                padding: 20px;
            }
            
            .career-modal {
                background: #18181b;
                border-radius: 16px;
                padding: 30px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            }
            
            .career-modal h2 {
                margin-bottom: 15px;
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: transparent;
                border: none;
                color: #a1a1aa;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .modal-relevance {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .relevance-level {
                padding: 5px 12px;
                border-radius: 4px;
                font-size: 0.85rem;
                font-weight: bold;
            }
            
            .relevance-level.critical {
                background: rgba(99, 102, 241, 0.2);
                color: #6366f1;
            }
            
            .relevance-level.high {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
            }
            
            .job-percentage {
                color: #a1a1aa;
            }
            
            .daily-usage {
                color: #e4e4e7;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .modal-tasks, .modal-tools {
                margin-top: 20px;
            }
            
            .modal-tasks h4, .modal-tools h4 {
                color: #71717a;
                font-size: 0.9rem;
                margin-bottom: 10px;
            }
            
            .modal-tasks ul {
                list-style: disc;
                padding-left: 20px;
                color: #a1a1aa;
            }
            
            .tools-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .tool-tag {
                padding: 5px 12px;
                background: #27272a;
                border-radius: 4px;
                font-size: 0.85rem;
                color: #a1a1aa;
            }
            
            /* Deep Dive */
            .deep-dive-section {
                border-left: 4px solid #8b5cf6;
            }
            
            .methodology-steps {
                margin-top: 15px;
            }
            
            .method-step {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            
            .step-num {
                padding: 4px 10px;
                background: #8b5cf6;
                border-radius: 4px;
                font-size: 0.8rem;
                margin-right: 10px;
            }
            
            .step-question {
                color: #e4e4e7;
                margin: 10px 0;
            }
            
            .step-outcomes {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .outcome {
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.85rem;
            }
            
            .outcome.yes {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }
            
            .outcome.no {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            
            /* Mapping Table */
            .mapping-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            
            .mapping-table th,
            .mapping-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #27272a;
            }
            
            .mapping-table th {
                background: #1f1f23;
                color: #a1a1aa;
                font-weight: 500;
            }
            
            .mapping-table td {
                color: #e4e4e7;
            }
            
            .category-badge {
                padding: 4px 10px;
                background: #6366f1;
                border-radius: 4px;
                font-size: 0.8rem;
            }
            
            /* Flowchart */
            .flowchart-container {
                margin: 20px 0;
                padding: 20px;
                background: #1f1f23;
                border-radius: 8px;
            }
            
            .flowchart {
                margin-top: 15px;
            }
            
            .flowchart-step {
                padding: 15px;
                background: #27272a;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid #6366f1;
            }
            
            .flowchart-step .step-number {
                display: inline-block;
                width: 28px;
                height: 28px;
                background: #6366f1;
                border-radius: 50%;
                text-align: center;
                line-height: 28px;
                margin-right: 10px;
            }
            
            .flowchart-step .step-question {
                font-weight: 500;
                color: #fafafa;
            }
            
            .step-branches {
                display: flex;
                gap: 20px;
                margin-top: 15px;
                margin-left: 38px;
            }
            
            .branch {
                flex: 1;
                padding: 10px;
                border-radius: 6px;
            }
            
            .branch.yes {
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            
            .branch.no {
                background: rgba(107, 114, 128, 0.1);
                border: 1px solid rgba(107, 114, 128, 0.3);
            }
            
            .branch-label {
                font-weight: 500;
                color: #10b981;
            }
            
            .branch.no .branch-label {
                color: #9ca3af;
            }
            
            .branch-result {
                display: block;
                font-size: 0.9rem;
                color: #a1a1aa;
                margin-top: 5px;
            }
            
            /* Introduction Specific */
            .intro-hook {
                font-size: 1.1rem;
                line-height: 1.8;
                color: #e4e4e7;
                margin-bottom: 25px;
            }
            
            .learning-goals-box {
                padding: 20px;
                background: rgba(99, 102, 241, 0.05);
                border: 1px solid rgba(99, 102, 241, 0.2);
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .goals-list {
                list-style: none;
                padding: 0;
                margin: 15px 0 0;
            }
            
            .goals-list li {
                padding: 8px 0 8px 30px;
                position: relative;
                color: #e4e4e7;
            }
            
            .goals-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #6366f1;
            }
            
            .why-matters-box, .exam-weight-box {
                margin-bottom: 20px;
            }
            
            .matter-item {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            
            .matter-item strong {
                color: #6366f1;
            }
            
            .exam-weight-content {
                display: flex;
                gap: 20px;
                margin: 15px 0;
            }
            
            .weight-domain, .weight-questions {
                padding: 8px 15px;
                background: #27272a;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .high-yield-topics ul {
                margin-top: 10px;
                padding-left: 20px;
            }
            
            .high-yield-topics li {
                color: #f59e0b;
                margin-bottom: 5px;
            }
            
            /* Summary Section */
            .takeaways-box, .exam-essentials-box {
                margin-bottom: 20px;
            }
            
            .takeaways-box ul, .exam-essentials-box ul {
                margin: 15px 0 0;
                padding-left: 20px;
            }
            
            .takeaways-box li, .exam-essentials-box li {
                margin-bottom: 10px;
                color: #e4e4e7;
                line-height: 1.6;
            }
            
            .career-connections {
                margin-top: 25px;
            }
            
            .career-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .career-connection-card {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
                border: 1px solid #27272a;
            }
            
            .cc-role {
                display: block;
                color: #6366f1;
                font-weight: 500;
                margin-bottom: 8px;
            }
            
            .cc-text {
                font-size: 0.9rem;
                color: #a1a1aa;
                margin: 0;
            }
            
            .next-connection {
                margin-top: 25px;
                padding: 20px;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border-radius: 8px;
                border: 1px solid rgba(99, 102, 241, 0.2);
            }
            
            .next-connection h4 {
                color: #6366f1;
                margin-bottom: 10px;
            }
            
            .next-connection p {
                color: #e4e4e7;
                line-height: 1.7;
                margin: 0;
            }
            
            /* Exam Traps */
            .exam-traps {
                margin: 20px 0;
                padding: 20px;
                background: rgba(239, 68, 68, 0.05);
                border: 1px solid rgba(239, 68, 68, 0.2);
                border-radius: 8px;
            }
            
            .exam-traps h4 {
                color: #ef4444;
                margin-bottom: 15px;
            }
            
            .trap-item {
                padding: 15px;
                background: #1f1f23;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            
            .trap-trap {
                color: #ef4444;
                font-weight: 500;
            }
            
            .trap-reality, .trap-tip {
                font-size: 0.9rem;
                color: #a1a1aa;
                margin-top: 8px;
            }
            
            /* Responsive */
            @media (max-width: 1024px) {
                .enhanced-lesson-container {
                    grid-template-columns: 1fr;
                }
                
                .lesson-sidebar {
                    position: fixed;
                    left: -280px;
                    top: 70px;
                    width: 260px;
                    z-index: 100;
                    transition: left 0.3s;
                }
                
                .lesson-sidebar.open {
                    left: 0;
                }
                
                .lesson-main {
                    padding: 20px;
                }
                
                .skill-tree-visual {
                    flex-direction: column;
                    align-items: center;
                }
                
                .tree-column {
                    width: 100%;
                    max-width: 300px;
                    text-align: center;
                }
                
                .tree-column h4 {
                    text-align: center;
                }
                
                .tree-node {
                    text-align: center;
                }
                
                .tree-arrow {
                    transform: rotate(90deg);
                    margin: 10px 0;
                }
                
                .cross-domain-grid {
                    grid-template-columns: 1fr;
                }
                
                .builds-toward-list {
                    justify-content: center;
                }
            }
            
            @media (max-width: 640px) {
                .lesson-bottom-nav {
                    flex-direction: column;
                }
                
                .lesson-bottom-nav .nav-btn {
                    max-width: none;
                }
                
                .practice-options {
                    grid-template-columns: 1fr;
                }
            }
            
            /* ================================================
               LIGHT MODE
               ================================================ */
            
            [data-theme="light"] .lesson-sidebar {
                background: #ffffff;
                border-right-color: #e2e8f0;
            }
            
            [data-theme="light"] .back-btn-small {
                border-color: #e2e8f0;
                color: #64748b;
            }
            
            [data-theme="light"] .back-btn-small:hover {
                color: #0f172a;
            }
            
            [data-theme="light"] .progress-bg {
                stroke: #e2e8f0;
            }
            
            [data-theme="light"] .progress-text {
                color: #0f172a;
            }
            
            [data-theme="light"] .toc-item a {
                color: #64748b;
            }
            
            [data-theme="light"] .toc-item a:hover {
                background: #f1f5f9;
                color: #0f172a;
            }
            
            [data-theme="light"] .toc-item.active a {
                background: rgba(99, 102, 241, 0.1);
            }
            
            [data-theme="light"] .toc-number {
                background: #e2e8f0;
                color: #475569;
            }
            
            [data-theme="light"] .mini-unlock {
                background: #f1f5f9;
                color: #475569;
            }
            
            [data-theme="light"] .mini-unlock:hover {
                background: #e2e8f0;
                color: #0f172a;
            }
            
            [data-theme="light"] .lesson-title {
                color: #0f172a;
            }
            
            [data-theme="light"] .lesson-subtitle {
                color: #64748b;
            }
            
            [data-theme="light"] .meta-item {
                color: #64748b;
            }
            
            [data-theme="light"] .career-relevance-bar {
                background: #f8fafc;
            }
            
            [data-theme="light"] .career-badge {
                background: #ffffff;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .badge-name {
                color: #334155;
            }
            
            [data-theme="light"] .lesson-section {
                background: #ffffff;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .section-header h2 {
                color: #0f172a;
            }
            
            [data-theme="light"] .collapsible-header {
                background: #f1f5f9;
                color: #0f172a;
            }
            
            [data-theme="light"] .why-matters-header {
                background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
                border-color: #cbd5e1;
            }
            
            [data-theme="light"] .why-matters-header:hover {
                border-color: #6366f1;
                background: linear-gradient(135deg, #e2e8f0, #d1d5db);
            }
            
            [data-theme="light"] .expand-hint {
                color: #6366f1;
            }
            
            [data-theme="light"] .collapsible-content {
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .concept-definition {
                background: rgba(99, 102, 241, 0.05);
                color: #334155;
            }
            
            [data-theme="light"] .concept-simple {
                background: #ffffff;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .concept-header-simple h3 {
                color: #0f172a;
            }
            
            [data-theme="light"] .concept-field {
                background: #f8fafc;
                border-left-color: #cbd5e1;
            }
            
            [data-theme="light"] .concept-field > strong {
                color: #64748b;
            }
            
            [data-theme="light"] .concept-field > span,
            [data-theme="light"] .simple-list,
            [data-theme="light"] .obj-value,
            [data-theme="light"] .mini-value,
            [data-theme="light"] .nested-item {
                color: #334155;
            }
            
            [data-theme="light"] .concept-table th {
                background: #f1f5f9;
                color: #64748b;
            }
            
            [data-theme="light"] .concept-table td {
                border-bottom-color: #e2e8f0;
                color: #334155;
            }
            
            [data-theme="light"] .concept-table tr:hover td {
                background: rgba(99, 102, 241, 0.05);
            }
            
            [data-theme="light"] .mini-card {
                background: #ffffff;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .object-row,
            [data-theme="light"] .nested-object {
                border-bottom-color: #e2e8f0;
            }
            
            [data-theme="light"] .obj-label,
            [data-theme="light"] .mini-label,
            [data-theme="light"] .nested-item em {
                color: #64748b;
            }
            
            [data-theme="light"] .how-it-works,
            [data-theme="light"] .example-item,
            [data-theme="light"] .action-step,
            [data-theme="light"] .method-step,
            [data-theme="light"] .analogy-item,
            [data-theme="light"] .career-connection-card,
            [data-theme="light"] .trap-item,
            [data-theme="light"] .must-remember-item,
            [data-theme="light"] .micro-quiz,
            [data-theme="light"] .key-points-box,
            [data-theme="light"] .exam-essentials-box,
            [data-theme="light"] .flowchart-container,
            [data-theme="light"] .practice-card {
                background: #f8fafc;
            }
            
            [data-theme="light"] .visual-flow,
            [data-theme="light"] .answer-reveal {
                background: #f1f5f9;
            }
            
            [data-theme="light"] .flow-step {
                background: #ffffff;
                border-color: #e2e8f0;
                color: #334155;
            }
            
            [data-theme="light"] .tree-node {
                background: #f8fafc;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .node-title {
                color: #0f172a;
            }
            
            [data-theme="light"] .cross-domain-card {
                background: #f8fafc;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .scenario-situation,
            [data-theme="light"] .concept-content p,
            [data-theme="light"] .daily-usage,
            [data-theme="light"] .intro-hook,
            [data-theme="light"] .goals-list li,
            [data-theme="light"] .takeaways-box li,
            [data-theme="light"] .exam-essentials-box li,
            [data-theme="light"] .quiz-question,
            [data-theme="light"] .next-connection p {
                color: #334155;
            }
            
            [data-theme="light"] .mark-complete-btn {
                background: #f1f5f9;
                border-color: #e2e8f0;
                color: #64748b;
            }
            
            [data-theme="light"] .mark-complete-btn:hover {
                background: #6366f1;
                color: white;
            }
            
            [data-theme="light"] .unlock-bar {
                background: #e2e8f0;
            }
            
            [data-theme="light"] .lesson-bottom-nav .nav-btn {
                background: #ffffff;
                border-color: #e2e8f0;
            }
            
            [data-theme="light"] .nav-title {
                color: #0f172a;
            }
            
            [data-theme="light"] .career-modal {
                background: #ffffff;
            }
            
            [data-theme="light"] .mapping-table th {
                background: #f1f5f9;
            }
            
            [data-theme="light"] .mapping-table td {
                color: #334155;
            }
            
            [data-theme="light"] .fill-blank-input input {
                background: #ffffff;
                border-color: #e2e8f0;
                color: #0f172a;
            }
        `;
        
        document.head.appendChild(styles);
    }

    // ================================================
    // HELPER FUNCTIONS
    // ================================================

    function formatContent(text) {
        if (!text) return '';
        // Basic formatting - escape HTML then convert line breaks
        let formatted = escapeHtml(text);
        formatted = formatted.replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }

    function escapeHtml(text) {
        if (!text) return '';
        if (typeof text !== 'string') return String(text);
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ================================================
    // EXPORTS
    // ================================================

    window.showEnhancedLesson = showEnhancedLesson;
    window.EnhancedLessonViewer = {
        show: showEnhancedLesson,
        state: LessonState,
        CAREER_ROLES
    };

    console.log('✅ Enhanced Lesson Viewer loaded');

})();
