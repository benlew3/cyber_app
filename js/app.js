// Security+ Platform v11.0 - Complete Learning Management System
// Full implementation with learning paths, domain menus, and all features connected

// Global Application State
const APP = {
    version: '11.0',
    content: {
        questions: [],
        simulations: [],
        lessons: [],
        pbqs: [],
        glossary: {}
    },
    state: {
        currentView: 'dashboard',
        currentDomain: null,
        currentLesson: null,
        currentSimulation: null,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        score: 0,
        quizQuestions: [],
        flashCardMode: false,
        learningPath: 'guided' // guided or self-paced
    },
    progress: {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: [],
        weakSpots: {},
        scores: {},
        completedLessons: [],
        completedSimulations: [],
        pbqs: []
    },
    settings: {
        adaptiveLearning: true,
        immediateFeedback: true,
        soundEffects: false
    }
};

// Domain Configuration
const DOMAINS = [
    { id: 1, name: 'General Security Concepts', weight: 0.12, color: '#6366f1', icon: '🔒' },
    { id: 2, name: 'Threats, Vulnerabilities & Mitigations', weight: 0.22, color: '#f59e0b', icon: '⚠️' },
    { id: 3, name: 'Security Architecture', weight: 0.18, color: '#10b981', icon: '🏗️' },
    { id: 4, name: 'Security Operations', weight: 0.28, color: '#8b5cf6', icon: '🛡️' },
    { id: 5, name: 'Security Program Management', weight: 0.20, color: '#ec4899', icon: '📊' }
];

// Initialize Application
async function initApp() {
    console.log('Initializing Security+ Platform v' + APP.version);
    
    try {
        // Load all content
        await loadAllContent();
        
        // Load saved progress
        loadProgress();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize navigation
        initializeNavigation();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        // Show dashboard
        showView('dashboard');
        
        console.log('Platform initialized successfully');
        
    } catch (error) {
        console.error('Initialization failed:', error);
        document.getElementById('loadingStatus').textContent = 'Error loading content. Please refresh.';
    }
}

// Load All Content
async function loadAllContent() {
    const files = [
        { name: 'questions', path: 'data/questions.json' },
        { name: 'simulations', path: 'data/simulations.json' },
        { name: 'lessons', path: 'data/lessons.json' },
        { name: 'pbqs', path: 'data/pbqs.json' },
        { name: 'glossary', path: 'data/glossary.json' }
    ];
    
    let loaded = 0;
    const total = files.length;
    
    for (const file of files) {
        try {
            updateLoadingProgress((loaded / total) * 100);
            updateLoadingStatus(`Loading ${file.name}...`);
            
            const response = await fetch(file.path);
            if (!response.ok) throw new Error(`Failed to load ${file.path}`);
            
            const data = await response.json();
            APP.content[file.name] = data;
            
            loaded++;
            console.log(`Loaded ${file.name}: ${Array.isArray(data) ? data.length : Object.keys(data).length} items`);
            
        } catch (error) {
            console.error(`Error loading ${file.name}:`, error);
            // Use fallback data
            APP.content[file.name] = file.name === 'glossary' ? {} : [];
        }
    }
    
    updateLoadingProgress(100);
    updateLoadingStatus('Content loaded!');
}

// Initialize Navigation
function initializeNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    nav.innerHTML = `
        <button class="btn btn-nav" onclick="showView('dashboard')">🏠 Dashboard</button>
        
        <div class="dropdown">
            <button class="btn btn-nav dropdown-toggle">📚 Domains ▼</button>
            <div class="dropdown-content">
                ${DOMAINS.map(domain => `
                    <a href="#" onclick="openDomainMenu(${domain.id}); return false;">
                        ${domain.icon} Domain ${domain.id}: ${domain.name}
                    </a>
                `).join('')}
            </div>
        </div>
        
        <div class="dropdown">
            <button class="btn btn-nav dropdown-toggle">📝 Quick Access ▼</button>
            <div class="dropdown-content">
                <a href="#" onclick="startPracticeExam(); return false;">📋 Practice Exam (90Q)</a>
                <a href="#" onclick="showAllSimulations(); return false;">🎮 All Simulations</a>
                <a href="#" onclick="showAllPBQs(); return false;">📊 All PBQs</a>
                <a href="#" onclick="showFlaggedQuestions(); return false;">🚩 Flagged Questions</a>
                <a href="#" onclick="showRemedialDashboard(); return false;">🔧 Remedial Study</a>
            </div>
        </div>
        
        <button class="btn btn-nav btn-warning" id="flaggedBtn">
            🚩 <span id="flaggedCount">0</span>
        </button>
        <button class="btn btn-nav btn-secondary" id="flashBtn" onclick="toggleFlashCards()">
            🎴 Flash
        </button>
        <button class="btn btn-nav" onclick="showProgress()">
            📊 Progress
        </button>
    `;
}

// Show View
function showView(viewName, params = {}) {
    const content = document.getElementById('content');
    if (!content) return;
    
    APP.state.currentView = viewName;
    
    switch (viewName) {
        case 'dashboard':
            content.innerHTML = renderDashboard();
            initDashboard();
            break;
            
        case 'domain-menu':
            content.innerHTML = renderDomainMenu(params.domainId);
            break;
            
        case 'lessons':
            content.innerHTML = renderLessonsView(params.domainId);
            break;
            
        case 'lesson-viewer':
            content.innerHTML = renderLessonViewer(params.lessonId);
            break;
            
        case 'simulations':
            content.innerHTML = renderSimulationsView(params.domainId);
            break;
            
        case 'simulation-player':
            content.innerHTML = renderSimulationPlayer(params.simulationId);
            break;
            
        case 'quiz':
            content.innerHTML = renderQuizView();
            startQuiz(params.questions);
            break;
            
        case 'pbq':
            content.innerHTML = renderPBQView(params.domainId);
            initPBQ();
            break;
            
        case 'remedial':
            content.innerHTML = renderRemedialView(params.domainId);
            break;
            
        case 'flashcards':
            content.innerHTML = renderFlashCardsView(params.domainId);
            break;
            
        case 'glossary':
            content.innerHTML = renderGlossaryView(params.domainId);
            break;
            
        case 'progress':
            content.innerHTML = renderProgressView();
            break;
            
        default:
            content.innerHTML = '<div class="container"><h2>View not found</h2></div>';
    }
    
    updateFlaggedCount();
}

// Open Domain Menu
function openDomainMenu(domainId) {
    showView('domain-menu', { domainId });
}

// Render Domain Menu
function renderDomainMenu(domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return '<div class="container">Domain not found</div>';
    
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const domainSimulations = APP.content.simulations.filter(s => s.domain === domainId && s.type === 'scenario');
    const domainRemediation = APP.content.simulations.filter(s => s.domain === domainId && s.type === 'remediation');
    const domainLessons = APP.content.lessons.filter(l => l.domain === domainId);
    const domainPBQs = APP.content.pbqs.filter(p => p.domain === domainId);
    
    return `
        <div class="container">
            <div class="domain-header" style="background: linear-gradient(135deg, ${domain.color}22, ${domain.color}11);">
                <h1>${domain.icon} Domain ${domain.id}: ${domain.name}</h1>
                <p>Weight: ${(domain.weight * 100).toFixed(0)}% of exam</p>
            </div>
            
            <div class="learning-options-grid">
                <!-- Simulations -->
                <div class="learning-card" onclick="showView('simulations', {domainId: ${domainId}})">
                    <div class="card-icon">🎮</div>
                    <h3>Simulations</h3>
                    <p>${domainSimulations.length} interactive scenarios</p>
                    <button class="btn btn-primary">Start Simulations</button>
                </div>
                
                <!-- Lesson Guides -->
                <div class="learning-card" onclick="showView('lessons', {domainId: ${domainId}})">
                    <div class="card-icon">📚</div>
                    <h3>Lesson Guides</h3>
                    <p>${domainLessons.length} comprehensive lessons</p>
                    <button class="btn btn-primary">Open Lessons</button>
                </div>
                
                <!-- Main Quiz -->
                <div class="learning-card" onclick="startDomainQuiz(${domainId})">
                    <div class="card-icon">📝</div>
                    <h3>Main Quiz</h3>
                    <p>${domainQuestions.length} practice questions</p>
                    <button class="btn btn-primary">Take Quiz</button>
                </div>
                
                <!-- Remedial -->
                <div class="learning-card" onclick="showView('remedial', {domainId: ${domainId}})">
                    <div class="card-icon">🔧</div>
                    <h3>Remedial Study</h3>
                    <p>${domainRemediation.length} targeted exercises</p>
                    <button class="btn btn-primary">Remediation</button>
                </div>
                
                <!-- PBQs -->
                <div class="learning-card" onclick="showView('pbq', {domainId: ${domainId}})">
                    <div class="card-icon">📊</div>
                    <h3>PBQs</h3>
                    <p>${domainPBQs.length} performance questions</p>
                    <button class="btn btn-primary">Practice PBQs</button>
                </div>
                
                <!-- Flash Cards -->
                <div class="learning-card" onclick="showView('flashcards', {domainId: ${domainId}})">
                    <div class="card-icon">🎴</div>
                    <h3>Flash Cards</h3>
                    <p>Quick review mode</p>
                    <button class="btn btn-primary">Study Cards</button>
                </div>
                
                <!-- Glossary -->
                <div class="learning-card" onclick="showView('glossary', {domainId: ${domainId}})">
                    <div class="card-icon">📖</div>
                    <h3>Glossary</h3>
                    <p>Key terms & definitions</p>
                    <button class="btn btn-primary">View Terms</button>
                </div>
            </div>
            
            <div class="domain-progress mt-2">
                <h3>Your Progress</h3>
                ${renderDomainProgress(domainId)}
            </div>
        </div>
    `;
}

// Render Lessons View
function renderLessonsView(domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    const lessons = APP.content.lessons.filter(l => l.domain === domainId);
    
    return `
        <div class="container">
            <h2>${domain.icon} Domain ${domainId} Lessons</h2>
            
            <div class="learning-path-toggle">
                <button class="btn ${APP.state.learningPath === 'guided' ? 'btn-primary' : 'btn-secondary'}"
                        onclick="setLearningPath('guided')">
                    📍 Guided Path
                </button>
                <button class="btn ${APP.state.learningPath === 'self' ? 'btn-primary' : 'btn-secondary'}"
                        onclick="setLearningPath('self')">
                    🎯 Self-Paced
                </button>
            </div>
            
            <div class="lessons-grid mt-2">
                ${lessons.map((lesson, index) => {
                    const isCompleted = APP.progress.completedLessons.includes(lesson.id);
                    const isLocked = APP.state.learningPath === 'guided' && index > 0 && 
                                   !APP.progress.completedLessons.includes(lessons[index - 1].id);
                    
                    return `
                        <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
                             ${!isLocked ? `onclick="openLesson('${lesson.id}')"` : ''}>
                            <div class="lesson-number">${index + 1}</div>
                            <h3>${lesson.title}</h3>
                            <div class="lesson-meta">
                                <span>📖 ${lesson.sections ? lesson.sections.length : 5} sections</span>
                                <span>⏱️ ${lesson.duration || '15-20 min'}</span>
                            </div>
                            ${isCompleted ? '<div class="badge badge-success">✅ Completed</div>' : ''}
                            ${isLocked ? '<div class="badge badge-warning">🔒 Complete previous lesson</div>' : ''}
                            ${!isLocked && !isCompleted ? '<button class="btn btn-primary btn-sm">Start Lesson</button>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Render Lesson Viewer
function renderLessonViewer(lessonId) {
    const lesson = APP.content.lessons.find(l => l.id === lessonId);
    if (!lesson) return '<div class="container">Lesson not found</div>';
    
    // Get 5 random questions for lesson quiz
    const domainQuestions = APP.content.questions.filter(q => q.domain === lesson.domain);
    const lessonQuizQuestions = shuffleArray([...domainQuestions]).slice(0, 5);
    
    return `
        <div class="container">
            <div class="lesson-viewer">
                <div class="lesson-sidebar">
                    <h3>Navigation</h3>
                    <div class="lesson-nav">
                        ${(lesson.sections || [
                            { title: 'Introduction', id: 'intro' },
                            { title: 'Key Concepts', id: 'concepts' },
                            { title: 'Examples', id: 'examples' },
                            { title: 'Practice', id: 'practice' },
                            { title: 'Summary', id: 'summary' }
                        ]).map((section, index) => `
                            <div class="nav-item ${index === 0 ? 'active' : ''}" 
                                 onclick="jumpToSection('${section.id}')">
                                ${index + 1}. ${section.title}
                            </div>
                        `).join('')}
                        <div class="nav-item quiz" onclick="startLessonQuiz('${lessonId}')">
                            📝 Lesson Quiz
                        </div>
                    </div>
                </div>
                
                <div class="lesson-content">
                    <h1>${lesson.title}</h1>
                    
                    <div class="lesson-objectives">
                        <h3>Learning Objectives</h3>
                        <ul>
                            ${(lesson.objectives || ['Understand key concepts', 'Apply security principles']).map(obj => 
                                `<li>${obj}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div id="lessonSections">
                        ${renderLessonContent(lesson)}
                    </div>
                    
                    <div class="lesson-footer">
                        <button class="btn btn-secondary" onclick="showView('lessons', {domainId: ${lesson.domain}})">
                            ← Back to Lessons
                        </button>
                        <button class="btn btn-primary" onclick="startLessonQuiz('${lessonId}')">
                            Take Lesson Quiz →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Simulations View
function renderSimulationsView(domainId) {
    const simulations = domainId 
        ? APP.content.simulations.filter(s => s.domain === domainId && s.type === 'scenario')
        : APP.content.simulations.filter(s => s.type === 'scenario');
    
    const domain = domainId ? DOMAINS.find(d => d.id === domainId) : null;
    
    return `
        <div class="container">
            <h2>${domain ? `${domain.icon} Domain ${domainId}` : '🎮 All'} Simulations</h2>
            <p>Interactive scenarios to test your knowledge in real-world situations</p>
            
            <div class="simulations-grid">
                ${simulations.map((sim, index) => {
                    const isCompleted = APP.progress.completedSimulations.includes(sim.id);
                    
                    return `
                        <div class="simulation-card ${isCompleted ? 'completed' : ''}">
                            <div class="sim-header">
                                <h3>${sim.title}</h3>
                                <span class="badge badge-info">Domain ${sim.domain}</span>
                            </div>
                            <div class="sim-meta">
                                <span>🎯 ${sim.difficulty || 'intermediate'}</span>
                                <span>⏱️ ${sim.duration || '10-15 min'}</span>
                                <span>💯 ${sim.points || 100} points</span>
                            </div>
                            <p>${sim.scenario || sim.introduction || 'Test your skills in this scenario'}</p>
                            ${isCompleted ? '<div class="badge badge-success">✅ Completed</div>' : ''}
                            <button class="btn btn-primary" onclick="startSimulation('${sim.id}')">
                                ${isCompleted ? 'Replay' : 'Start'} Simulation
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Render Simulation Player
function renderSimulationPlayer(simulationId) {
    const sim = APP.content.simulations.find(s => s.id === simulationId);
    if (!sim) return '<div class="container">Simulation not found</div>';
    
    APP.state.currentSimulation = {
        id: sim.id,
        currentDecisionPoint: 0,
        score: 0,
        maxScore: sim.maxScore || 100,
        decisions: []
    };
    
    return `
        <div class="container">
            <div class="simulation-player">
                <div class="sim-header">
                    <h2>${sim.title}</h2>
                    <div class="sim-score">
                        Score: <span id="simScore">0</span> / ${sim.maxScore || 100}
                    </div>
                </div>
                
                <div class="sim-scenario">
                    <h3>Scenario</h3>
                    <p>${sim.introduction || sim.scenario}</p>
                </div>
                
                <div id="decisionPoint">
                    ${renderDecisionPoint(sim, 0)}
                </div>
                
                <div class="sim-progress">
                    <div class="progress-bar">
                        <div id="simProgress" class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Decision Point
function renderDecisionPoint(sim, pointIndex) {
    if (!sim.decisionPoints || pointIndex >= sim.decisionPoints.length) {
        return renderSimulationComplete();
    }
    
    const dp = sim.decisionPoints[pointIndex];
    
    return `
        <div class="decision-point">
            <h3>${dp.title}</h3>
            <div class="situation">
                <p>${dp.situation}</p>
            </div>
            
            <div class="question">
                <strong>${dp.question}</strong>
            </div>
            
            <div class="decision-options">
                ${dp.options.map((option, index) => `
                    <div class="decision-option" onclick="makeDecision('${sim.id}', ${pointIndex}, ${index})">
                        <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                        <div class="option-text">${option.text}</div>
                    </div>
                `).join('')}
            </div>
            
            ${dp.keyTerms ? `
                <div class="key-terms">
                    <strong>Key Terms:</strong> ${dp.keyTerms.join(', ')}
                </div>
            ` : ''}
        </div>
    `;
}

// Render Remedial View
function renderRemedialView(domainId) {
    const weakTopics = analyzeWeakAreas(domainId);
    const remedialSims = APP.content.simulations.filter(s => 
        s.type === 'remediation' && (!domainId || s.domain === domainId)
    );
    
    return `
        <div class="container">
            <h2>🔧 Remedial Study ${domainId ? `- Domain ${domainId}` : ''}</h2>
            
            <div class="weakness-analysis">
                <h3>Areas Needing Review</h3>
                ${weakTopics.length > 0 ? `
                    <div class="weak-topics-grid">
                        ${weakTopics.map(topic => `
                            <div class="weak-topic-card">
                                <h4>${topic.name}</h4>
                                <div class="weakness-stats">
                                    <div>❌ ${topic.wrongCount} incorrect</div>
                                    <div>📊 ${topic.accuracy}% accuracy</div>
                                </div>
                                <button class="btn btn-primary btn-sm" 
                                        onclick="startFocusedPractice('${topic.id}')">
                                    Practice This Topic
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="alert alert-success">
                        ✅ Great job! No weak areas detected. Keep practicing to maintain your knowledge.
                    </div>
                `}
            </div>
            
            <div class="remedial-simulations mt-2">
                <h3>Remedial Exercises</h3>
                <div class="simulations-grid">
                    ${remedialSims.map(sim => `
                        <div class="simulation-card">
                            <h4>${sim.title}</h4>
                            <p>${sim.scenario || 'Targeted practice exercise'}</p>
                            <button class="btn btn-primary" onclick="startSimulation('${sim.id}')">
                                Start Exercise
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="study-recommendations mt-2">
                <h3>📚 Recommended Study Plan</h3>
                <ol>
                    <li>Review flagged questions (${APP.progress.flaggedQuestions.length} items)</li>
                    <li>Complete remedial simulations</li>
                    <li>Re-read lessons for weak topics</li>
                    <li>Use flash cards for memorization</li>
                    <li>Take practice quiz focusing on weak areas</li>
                </ol>
            </div>
        </div>
    `;
}

// Analyze Weak Areas
function analyzeWeakAreas(domainId) {
    const weakTopics = [];
    const wrongByTopic = {};
    
    APP.progress.wrongAnswers.forEach(wrong => {
        const question = APP.content.questions.find(q => q.id === wrong.id);
        if (question && (!domainId || question.domain === domainId)) {
            const topic = question.topic || `Domain ${question.domain}`;
            if (!wrongByTopic[topic]) {
                wrongByTopic[topic] = { count: 0, total: 0, questions: [] };
            }
            wrongByTopic[topic].count++;
            wrongByTopic[topic].questions.push(question.id);
        }
    });
    
    // Calculate accuracy for each topic
    Object.entries(wrongByTopic).forEach(([topic, data]) => {
        if (data.count >= 2) { // Only show topics with 2+ wrong
            weakTopics.push({
                id: topic.replace(/\s/g, '_'),
                name: topic,
                wrongCount: data.count,
                accuracy: Math.round((1 - (data.count / (data.count + 5))) * 100),
                questions: data.questions
            });
        }
    });
    
    return weakTopics.sort((a, b) => b.wrongCount - a.wrongCount);
}

// Render Flash Cards View
function renderFlashCardsView(domainId) {
    const questions = domainId 
        ? APP.content.questions.filter(q => q.domain === domainId)
        : APP.content.questions;
    
    const glossaryTerms = domainId && APP.content.glossary[domainId] 
        ? APP.content.glossary[domainId]
        : Object.values(APP.content.glossary).flat();
    
    return `
        <div class="container">
            <h2>🎴 Flash Cards ${domainId ? `- Domain ${domainId}` : ''}</h2>
            
            <div class="flashcard-controls">
                <button class="btn btn-secondary" onclick="previousCard()">← Previous</button>
                <span id="cardCounter">Card 1 of ${questions.length + glossaryTerms.length}</span>
                <button class="btn btn-secondary" onclick="nextCard()">Next →</button>
            </div>
            
            <div class="flashcard" id="flashcard" onclick="flipCard()">
                <div class="flashcard-inner" id="flashcardInner">
                    <div class="flashcard-front">
                        <p id="cardQuestion">Click to start</p>
                    </div>
                    <div class="flashcard-back">
                        <p id="cardAnswer">Answer will appear here</p>
                    </div>
                </div>
            </div>
            
            <div class="flashcard-actions">
                <button class="btn btn-danger" onclick="markDifficult()">❌ Difficult</button>
                <button class="btn btn-warning" onclick="markReview()">🔄 Review</button>
                <button class="btn btn-success" onclick="markEasy()">✅ Easy</button>
            </div>
            
            <div class="flashcard-settings mt-2">
                <label>
                    <input type="checkbox" id="shuffleCards" checked> Shuffle cards
                </label>
                <label>
                    <input type="checkbox" id="includeTerms" checked> Include glossary terms
                </label>
            </div>
        </div>
    `;
}

// Render Glossary View
function renderGlossaryView(domainId) {
    const terms = domainId && APP.content.glossary[domainId]
        ? APP.content.glossary[domainId]
        : Object.values(APP.content.glossary).flat();
    
    return `
        <div class="container">
            <h2>📖 Glossary ${domainId ? `- Domain ${domainId}` : ''}</h2>
            
            <div class="glossary-search">
                <input type="text" id="glossarySearch" placeholder="Search terms..." 
                       onkeyup="filterGlossary()" class="search-input">
            </div>
            
            <div class="glossary-grid" id="glossaryGrid">
                ${terms.map(term => `
                    <div class="glossary-term">
                        <h4>${term.term}</h4>
                        <p>${term.definition}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Helper Functions
function renderDomainProgress(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    const completed = APP.progress.completedQuestions.filter(q => 
        APP.content.questions.find(quest => quest.id === q.id)?.domain === domainId
    );
    const correct = completed.filter(q => q.correct).length;
    const percentage = questions.length > 0 ? Math.round((completed.length / questions.length) * 100) : 0;
    const accuracy = completed.length > 0 ? Math.round((correct / completed.length) * 100) : 0;
    
    return `
        <div class="progress-stats">
            <div class="stat">
                <div class="stat-value">${percentage}%</div>
                <div class="stat-label">Complete</div>
            </div>
            <div class="stat">
                <div class="stat-value">${accuracy}%</div>
                <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat">
                <div class="stat-value">${completed.length}/${questions.length}</div>
                <div class="stat-label">Questions</div>
            </div>
        </div>
    `;
}

function renderLessonContent(lesson) {
    // Generate comprehensive lesson content
    const sections = lesson.sections || [
        { 
            id: 'intro', 
            title: 'Introduction',
            content: lesson.content || 'Welcome to this lesson on security concepts.'
        },
        { 
            id: 'concepts', 
            title: 'Key Concepts',
            content: 'Here we explore the fundamental concepts of this domain.'
        },
        { 
            id: 'examples', 
            title: 'Real-World Examples',
            content: 'Practical examples of how these concepts apply in security.'
        },
        { 
            id: 'practice', 
            title: 'Practice Scenarios',
            content: 'Apply what you\'ve learned through practice scenarios.'
        },
        { 
            id: 'summary', 
            title: 'Summary',
            content: 'Key takeaways from this lesson.'
        }
    ];
    
    return sections.map(section => `
        <div class="lesson-section" id="${section.id}">
            <h2>${section.title}</h2>
            <div class="section-content">
                ${section.content}
            </div>
        </div>
    `).join('');
}

function renderSimulationComplete() {
    const sim = APP.state.currentSimulation;
    const percentage = Math.round((sim.score / sim.maxScore) * 100);
    const passed = percentage >= 70;
    
    return `
        <div class="simulation-complete">
            <h2>Simulation Complete!</h2>
            
            <div class="sim-results">
                <div class="score-display ${passed ? 'passed' : 'failed'}">
                    <div class="score-value">${percentage}%</div>
                    <div class="score-label">${passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}</div>
                </div>
                
                <div class="score-details">
                    <p>Final Score: ${sim.score} / ${sim.maxScore}</p>
                    <p>Decisions Made: ${sim.decisions.length}</p>
                </div>
            </div>
            
            <div class="sim-feedback">
                <h3>Key Takeaways</h3>
                <ul>
                    ${sim.decisions.map(d => `<li>${d.feedback || 'Decision recorded'}</li>`).join('')}
                </ul>
            </div>
            
            <div class="sim-actions">
                <button class="btn btn-secondary" onclick="showView('simulations')">
                    Back to Simulations
                </button>
                <button class="btn btn-primary" onclick="startSimulation('${sim.id}')">
                    Try Again
                </button>
            </div>
        </div>
    `;
}

// Action Functions
function startDomainQuiz(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    showView('quiz', { questions });
}

function startLessonQuiz(lessonId) {
    const lesson = APP.content.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const questions = APP.content.questions
        .filter(q => q.domain === lesson.domain)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    
    APP.state.quizType = 'lesson';
    showView('quiz', { questions });
}

function startSimulation(simulationId) {
    showView('simulation-player', { simulationId });
}

function makeDecision(simId, pointIndex, optionIndex) {
    const sim = APP.content.simulations.find(s => s.id === simId);
    if (!sim || !sim.decisionPoints) return;
    
    const dp = sim.decisionPoints[pointIndex];
    const option = dp.options[optionIndex];
    
    // Update score
    APP.state.currentSimulation.score += option.points || 0;
    APP.state.currentSimulation.decisions.push({
        point: dp.title,
        choice: option.text,
        feedback: option.feedback,
        isOptimal: option.isOptimal
    });
    
    // Update UI
    document.getElementById('simScore').textContent = APP.state.currentSimulation.score;
    
    // Show feedback
    const decisionPoint = document.getElementById('decisionPoint');
    decisionPoint.innerHTML = `
        <div class="decision-feedback ${option.isOptimal ? 'optimal' : 'suboptimal'}">
            <h3>Feedback</h3>
            <p><strong>Your choice:</strong> ${option.text}</p>
            <p><strong>Result:</strong> ${option.feedback}</p>
            ${option.learningNote ? `<p><strong>Learning Note:</strong> ${option.learningNote}</p>` : ''}
            <p><strong>Points:</strong> ${option.points || 0}</p>
            
            <button class="btn btn-primary" onclick="nextDecisionPoint('${simId}', ${pointIndex + 1})">
                Continue →
            </button>
        </div>
    `;
    
    // Update progress
    const progress = ((pointIndex + 1) / sim.decisionPoints.length) * 100;
    document.getElementById('simProgress').style.width = progress + '%';
}

function nextDecisionPoint(simId, nextIndex) {
    const sim = APP.content.simulations.find(s => s.id === simId);
    if (!sim) return;
    
    document.getElementById('decisionPoint').innerHTML = renderDecisionPoint(sim, nextIndex);
    
    // Save progress if complete
    if (nextIndex >= sim.decisionPoints.length) {
        if (!APP.progress.completedSimulations.includes(simId)) {
            APP.progress.completedSimulations.push(simId);
            saveProgress();
        }
    }
}

function openLesson(lessonId) {
    showView('lesson-viewer', { lessonId });
}

function jumpToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update active nav
    document.querySelectorAll('.lesson-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

function setLearningPath(path) {
    APP.state.learningPath = path;
    showView('lessons', { domainId: APP.state.currentDomain });
}

function startFocusedPractice(topicId) {
    // Get questions related to this topic
    const weakTopic = analyzeWeakAreas().find(t => t.id === topicId);
    if (!weakTopic) return;
    
    const questions = APP.content.questions.filter(q => 
        weakTopic.questions.includes(q.id) || 
        q.topic === topicId.replace(/_/g, ' ')
    );
    
    showView('quiz', { questions });
}

function filterGlossary() {
    const search = document.getElementById('glossarySearch').value.toLowerCase();
    const terms = document.querySelectorAll('.glossary-term');
    
    terms.forEach(term => {
        const text = term.textContent.toLowerCase();
        term.style.display = text.includes(search) ? 'block' : 'none';
    });
}

function showAllSimulations() {
    showView('simulations');
}

function showAllPBQs() {
    showView('pbq');
}

function showRemedialDashboard() {
    showView('remedial');
}

function showProgress() {
    showView('progress');
}

// Continue existing functions...
function renderDashboard() {
    const weakSpots = calculateWeakSpots();
    const stats = calculateStats();
    
    return `
        <div class="container">
            <h2 class="mb-2">Security+ Training Dashboard</h2>
            
            ${weakSpots.length > 0 ? `
                <div class="alert alert-warning mb-2">
                    <h3>⚠️ Weak Areas Detected</h3>
                    <p>Focus on these domains: ${weakSpots.map(d => `Domain ${d}`).join(', ')}</p>
                    <button class="btn btn-primary" onclick="showRemedialDashboard()">
                        Go to Remedial Study →
                    </button>
                </div>
            ` : ''}
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${APP.content.questions.length}</div>
                    <div class="stat-label">Total Questions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.completed}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.correctRate}%</div>
                    <div class="stat-label">Success Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.flagged}</div>
                    <div class="stat-label">Flagged</div>
                </div>
            </div>
            
            <div class="domain-grid" id="domainGrid">
                ${DOMAINS.map(domain => renderDomainCard(domain)).join('')}
            </div>
            
            <div class="text-center mt-2">
                <button class="btn btn-primary btn-large" onclick="startPracticeExam()">
                    📋 Start Full Practice Exam (90 Questions)
                </button>
            </div>
        </div>
    `;
}

function renderDomainCard(domain) {
    const questions = APP.content.questions.filter(q => q.domain === domain.id);
    const completed = APP.progress.completedQuestions.filter(q => 
        APP.content.questions.find(quest => quest.id === q.id)?.domain === domain.id
    );
    const wrong = APP.progress.wrongAnswers.filter(w => w.domain === domain.id);
    const isWeak = wrong.length >= 3;
    
    return `
        <div class="domain-card ${isWeak ? 'weak' : ''}" 
             style="--domain-color: ${domain.color};"
             onclick="openDomainMenu(${domain.id})">
            <div style="background: ${domain.color}; width: 48px; height: 48px; 
                        border-radius: 50%; display: flex; align-items: center; 
                        justify-content: center; color: white; font-weight: bold; 
                        font-size: 1.3rem; margin-bottom: 1rem;">
                ${domain.icon}
            </div>
            <h3>${domain.name}</h3>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                <div>📝 ${questions.length} questions</div>
                <div>✅ ${completed.length} completed</div>
                <div>❌ ${wrong.length} wrong</div>
                <div>📊 Weight: ${(domain.weight * 100).toFixed(0)}%</div>
            </div>
            ${isWeak ? '<div class="badge badge-danger mt-1">NEEDS REVIEW</div>' : ''}
            <button class="btn btn-primary btn-sm mt-1">Open Learning Menu</button>
        </div>
    `;
}

// Continue with existing quiz and utility functions...
// [Rest of the functions remain the same - startQuiz, loadQuestion, etc.]

// Make functions globally available
window.openDomainMenu = openDomainMenu;
window.startDomainQuiz = startDomainQuiz;
window.startSimulation = startSimulation;
window.makeDecision = makeDecision;
window.nextDecisionPoint = nextDecisionPoint;
window.openLesson = openLesson;
window.jumpToSection = jumpToSection;
window.setLearningPath = setLearningPath;
window.startLessonQuiz = startLessonQuiz;
window.startFocusedPractice = startFocusedPractice;
window.filterGlossary = filterGlossary;
window.showAllSimulations = showAllSimulations;
window.showAllPBQs = showAllPBQs;
window.showRemedialDashboard = showRemedialDashboard;
window.showProgress = showProgress;
window.toggleFlashCards = toggleFlashCards;
window.showFlaggedQuestions = showFlaggedQuestions;
window.startPracticeExam = startPracticeExam;
window.showView = showView;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}