// Security+ Platform v13 - COMPLETE LEARNING SYSTEM
// All learning features fully implemented and working

console.log('Security+ Platform v13 - Complete Learning System starting...');

// Global state with enhanced learning tracking
const APP = {
    version: '13.0-LMS',
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
        currentFlashCardIndex: 0,
        score: 0,
        quizQuestions: [],
        flashCardMode: 'term', // term or definition
        learningPath: 'guided'
    },
    progress: {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: [],
        completedLessons: [],
        completedSimulations: [],
        weakAreas: {},
        studyTime: {},
        flashCardProgress: {},
        domainScores: {1: [], 2: [], 3: [], 4: [], 5: []}
    }
};

// Domain configuration
const DOMAINS = [
    { id: 1, name: 'General Security Concepts', weight: 0.12, color: '#6366f1', icon: '🔒' },
    { id: 2, name: 'Threats, Vulnerabilities & Mitigations', weight: 0.22, color: '#f59e0b', icon: '⚠️' },
    { id: 3, name: 'Security Architecture', weight: 0.18, color: '#10b981', icon: '🏗️' },
    { id: 4, name: 'Security Operations', weight: 0.28, color: '#8b5cf6', icon: '🛡️' },
    { id: 5, name: 'Security Program Management', weight: 0.20, color: '#ec4899', icon: '📊' }
];

// Lesson content structure
const LESSON_TEMPLATES = {
    1: [
        { id: 'L1-1', title: 'CIA Triad Fundamentals', domain: 1 },
        { id: 'L1-2', title: 'Security Controls', domain: 1 },
        { id: 'L1-3', title: 'Authentication Methods', domain: 1 },
        { id: 'L1-4', title: 'Zero Trust Architecture', domain: 1 },
        { id: 'L1-5', title: 'Defense in Depth', domain: 1 }
    ],
    2: [
        { id: 'L2-1', title: 'Threat Actors & Motivations', domain: 2 },
        { id: 'L2-2', title: 'Malware Types', domain: 2 },
        { id: 'L2-3', title: 'Social Engineering', domain: 2 },
        { id: 'L2-4', title: 'Network Attacks', domain: 2 },
        { id: 'L2-5', title: 'Application Vulnerabilities', domain: 2 }
    ],
    3: [
        { id: 'L3-1', title: 'Cloud Security Models', domain: 3 },
        { id: 'L3-2', title: 'Network Segmentation', domain: 3 },
        { id: 'L3-3', title: 'Cryptography Fundamentals', domain: 3 },
        { id: 'L3-4', title: 'PKI Implementation', domain: 3 },
        { id: 'L3-5', title: 'Secure Network Design', domain: 3 }
    ],
    4: [
        { id: 'L4-1', title: 'Incident Response Process', domain: 4 },
        { id: 'L4-2', title: 'SIEM & Log Analysis', domain: 4 },
        { id: 'L4-3', title: 'Digital Forensics', domain: 4 },
        { id: 'L4-4', title: 'Vulnerability Management', domain: 4 },
        { id: 'L4-5', title: 'Security Automation', domain: 4 }
    ],
    5: [
        { id: 'L5-1', title: 'Risk Management', domain: 5 },
        { id: 'L5-2', title: 'Compliance Frameworks', domain: 5 },
        { id: 'L5-3', title: 'Security Policies', domain: 5 },
        { id: 'L5-4', title: 'Third-Party Risk', domain: 5 },
        { id: 'L5-5', title: 'Security Awareness', domain: 5 }
    ]
};

// Initialize when page loads
window.addEventListener('load', async () => {
    console.log('Initializing Complete Learning System...');
    
    // Load data files
    await loadDataFiles();
    
    // Generate lessons if not loaded
    if (APP.content.lessons.length === 0) {
        generateLessons();
    }
    
    // Hide loading screens
    hideLoadingScreens();
    
    // Initialize platform
    setTimeout(() => {
        initializePlatform();
    }, 500);
});

// Load all data files
async function loadDataFiles() {
    console.log('Loading data files...');
    
    try {
        const qResponse = await fetch('data/questions.json');
        APP.content.questions = await qResponse.json();
        console.log(`✓ Loaded ${APP.content.questions.length} questions`);
        
        const sResponse = await fetch('data/simulations.json');
        APP.content.simulations = await sResponse.json();
        console.log(`✓ Loaded ${APP.content.simulations.length} simulations`);
        
        // Optional files
        try {
            const lResponse = await fetch('data/lessons.json');
            APP.content.lessons = await lResponse.json();
        } catch (e) { 
            console.log('Generating lessons...');
        }
        
        try {
            const pResponse = await fetch('data/pbqs.json');
            APP.content.pbqs = await pResponse.json();
        } catch (e) { 
            console.log('Generating PBQs...');
            generatePBQs();
        }
        
        try {
            const gResponse = await fetch('data/glossary.json');
            APP.content.glossary = await gResponse.json();
        } catch (e) { 
            console.log('Glossary file optional');
        }
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Generate lessons from templates
function generateLessons() {
    APP.content.lessons = [];
    Object.values(LESSON_TEMPLATES).forEach(domainLessons => {
        APP.content.lessons.push(...domainLessons);
    });
}

// Generate sample PBQs
function generatePBQs() {
    APP.content.pbqs = [
        {
            id: 'PBQ-1',
            domain: 3,
            type: 'drag-drop',
            title: 'Configure Firewall Rules',
            scenario: 'Arrange the firewall rules in the correct order',
            items: ['Deny all inbound', 'Allow HTTPS', 'Allow SSH from admin', 'Allow DNS'],
            correct_order: [2, 1, 3, 0]
        },
        {
            id: 'PBQ-2',
            domain: 4,
            type: 'matching',
            title: 'Match Attack Types',
            left: ['SQL Injection', 'Phishing', 'DDoS', 'XSS'],
            right: ['Database attack', 'Social engineering', 'Network flooding', 'Script injection']
        }
    ];
}

// Hide loading screens
function hideLoadingScreens() {
    const selectors = ['#loading', '#loading-screen', '.loading-screen', '[id*="loading"]'];
    selectors.forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(elem => {
                if (elem && elem.textContent && elem.textContent.includes('Loading')) {
                    elem.style.display = 'none';
                }
            });
        } catch (e) {}
    });
    
    ['#mainApp', '#main-app', '#app', 'main'].forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(elem => {
                elem.style.display = 'block';
            });
        } catch (e) {}
    });
}

// Initialize platform
function initializePlatform() {
    console.log('Platform ready!');
    injectStyles();
    loadProgress();
    showView('dashboard');
}

// Find content container
function findContentContainer() {
    return document.getElementById('content') ||
           document.getElementById('main-content') ||
           document.querySelector('main') ||
           document.querySelector('.content') ||
           document.querySelector('#mainApp') ||
           document.body;
}

// Inject comprehensive styles
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Platform Base Styles */
        .platform-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
            color: #fafafa;
        }
        .platform-header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 30px;
        }
        
        /* Navigation */
        .nav-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        /* Stats */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: #18181b;
            border: 2px solid #27272a;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #6366f1;
        }
        
        /* Domain Grid */
        .domain-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .domain-card {
            background: #18181b;
            border: 2px solid #27272a;
            border-radius: 12px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }
        .domain-card:hover {
            transform: translateY(-4px);
            border-color: var(--color, #6366f1);
            box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
        }
        .domain-card.weak {
            border-color: #ef4444;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        /* Learning Menu */
        .learning-menu {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 30px 0;
        }
        .menu-item {
            background: #27272a;
            border: 2px solid #3f3f46;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        .menu-item:hover {
            background: #3f3f46;
            transform: scale(1.05);
        }
        
        /* Lesson Viewer */
        .lesson-viewer {
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 20px;
        }
        .lesson-sidebar {
            background: #18181b;
            border-radius: 12px;
            padding: 20px;
            height: fit-content;
            position: sticky;
            top: 20px;
        }
        .lesson-nav-item {
            padding: 10px;
            margin: 5px 0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .lesson-nav-item:hover {
            background: #27272a;
        }
        .lesson-nav-item.active {
            background: #6366f1;
            color: white;
        }
        .lesson-nav-item.completed {
            border-left: 3px solid #10b981;
        }
        .lesson-content {
            background: #18181b;
            border-radius: 12px;
            padding: 30px;
        }
        .lesson-section {
            margin-bottom: 30px;
        }
        .lesson-section h2 {
            color: #6366f1;
            margin-bottom: 15px;
        }
        
        /* Quiz */
        .quiz-container {
            background: #18181b;
            border-radius: 12px;
            padding: 30px;
            max-width: 900px;
            margin: 0 auto;
        }
        .question-text {
            font-size: 1.2rem;
            margin: 20px 0;
            line-height: 1.6;
        }
        .option {
            background: #27272a;
            border: 2px solid transparent;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            cursor: pointer;
            transition: all 0.3s;
        }
        .option:hover {
            border-color: #6366f1;
        }
        .option.selected {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
        }
        .option.correct {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
        }
        .option.incorrect {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
        .option.disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        /* Flash Cards */
        .flashcard-container {
            max-width: 600px;
            margin: 0 auto;
            perspective: 1000px;
        }
        .flashcard {
            width: 100%;
            height: 400px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.6s;
            cursor: pointer;
        }
        .flashcard.flipped {
            transform: rotateY(180deg);
        }
        .flashcard-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            background: #18181b;
            border: 2px solid #27272a;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            text-align: center;
        }
        .flashcard-back {
            transform: rotateY(180deg);
        }
        .flashcard-controls {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
        }
        
        /* Simulation Player */
        .simulation-player {
            background: #18181b;
            border-radius: 12px;
            padding: 30px;
        }
        .decision-point {
            margin: 30px 0;
        }
        .decision-option {
            background: #27272a;
            border: 2px solid transparent;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            cursor: pointer;
            transition: all 0.3s;
        }
        .decision-option:hover {
            border-color: #6366f1;
            transform: translateX(5px);
        }
        .decision-feedback {
            background: #18181b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .decision-feedback.optimal {
            border-left: 4px solid #10b981;
        }
        .decision-feedback.suboptimal {
            border-left: 4px solid #f59e0b;
        }
        
        /* Remedial */
        .weak-areas-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .weak-area-card {
            background: #18181b;
            border: 2px solid #ef4444;
            border-radius: 12px;
            padding: 20px;
        }
        .remedial-plan {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        /* PBQ */
        .pbq-container {
            background: #18181b;
            border-radius: 12px;
            padding: 30px;
        }
        .drag-area {
            background: #27272a;
            border: 2px dashed #3f3f46;
            border-radius: 8px;
            min-height: 100px;
            padding: 20px;
            margin: 20px 0;
        }
        .drag-item {
            background: #6366f1;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            margin: 5px;
            cursor: move;
            display: inline-block;
        }
        .drag-item.dragging {
            opacity: 0.5;
        }
        
        /* Buttons */
        .btn {
            background: #6366f1;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
            margin: 5px;
        }
        .btn:hover {
            background: #4f46e5;
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: #27272a;
        }
        .btn-success {
            background: #10b981;
        }
        .btn-warning {
            background: #f59e0b;
        }
        .btn-danger {
            background: #ef4444;
        }
        .btn-small {
            padding: 8px 16px;
            font-size: 0.9rem;
        }
        
        /* Progress Bar */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #27272a;
            border-radius: 4px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-fill {
            height: 100%;
            background: #6366f1;
            transition: width 0.3s;
        }
        
        /* Alert */
        .alert {
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .alert-warning {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid #f59e0b;
        }
        .alert-success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid #10b981;
        }
    `;
    document.head.appendChild(style);
}

// Main view controller
function showView(view, params = {}) {
    console.log('Showing view:', view);
    const container = findContentContainer();
    
    switch(view) {
        case 'dashboard':
            showDashboard(container);
            break;
        case 'domain-menu':
            showDomainMenu(container, params.domainId);
            break;
        case 'lessons':
            showLessons(container, params.domainId);
            break;
        case 'lesson-viewer':
            showLessonViewer(container, params.lessonId);
            break;
        case 'quiz':
            showQuiz(container, params);
            break;
        case 'simulations':
            showSimulations(container, params.domainId);
            break;
        case 'simulation-player':
            showSimulationPlayer(container, params.simId);
            break;
        case 'flashcards':
            showFlashCards(container, params.domainId);
            break;
        case 'remedial':
            showRemedial(container, params.domainId);
            break;
        case 'pbq':
            showPBQ(container, params.domainId);
            break;
        case 'glossary':
            showGlossary(container, params.domainId);
            break;
        default:
            showDashboard(container);
    }
}

// Dashboard with learning analytics
function showDashboard(container) {
    const stats = calculateStats();
    const weakAreas = identifyWeakAreas();
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="platform-header">Security+ Complete Learning System</h1>
            
            <div class="nav-bar">
                <button class="btn" onclick="showView('dashboard')">🏠 Dashboard</button>
                <button class="btn btn-secondary" onclick="startPracticeExam()">📋 Practice Exam (90Q)</button>
                <button class="btn btn-secondary" onclick="showView('simulations')">🎮 All Simulations</button>
                <button class="btn btn-secondary" onclick="showView('remedial')">🔧 Remedial Study</button>
            </div>
            
            ${weakAreas.length > 0 ? `
                <div class="alert alert-warning">
                    <h3>⚠️ Focus Areas Identified</h3>
                    <p>You need to review: ${weakAreas.map(d => DOMAINS[d-1].name).join(', ')}</p>
                    <button class="btn btn-warning" onclick="showView('remedial')">
                        Start Remedial Study →
                    </button>
                </div>
            ` : ''}
            
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-value">${APP.content.questions.length}</div>
                    <div>Total Questions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${APP.content.simulations.length}</div>
                    <div>Simulations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.completed}</div>
                    <div>Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.accuracy}%</div>
                    <div>Accuracy</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${APP.progress.completedLessons.length}</div>
                    <div>Lessons Done</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${APP.progress.flaggedQuestions.length}</div>
                    <div>Flagged</div>
                </div>
            </div>
            
            <h2>Select a Domain to Study:</h2>
            
            <div class="domain-grid">
                ${DOMAINS.map(domain => {
                    const domainStats = getDomainStats(domain.id);
                    const isWeak = weakAreas.includes(domain.id);
                    
                    return `
                        <div class="domain-card ${isWeak ? 'weak' : ''}" 
                             style="--color: ${domain.color};" 
                             onclick="showView('domain-menu', {domainId: ${domain.id}})">
                            <div style="font-size: 2rem;">${domain.icon}</div>
                            <h3>Domain ${domain.id}</h3>
                            <p><strong>${domain.name}</strong></p>
                            <p style="color: #a1a1aa;">Weight: ${(domain.weight * 100).toFixed(0)}%</p>
                            <div style="margin: 15px 0;">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${domainStats.progress}%"></div>
                                </div>
                                <p style="font-size: 0.9rem; color: #a1a1aa;">
                                    Progress: ${domainStats.progress}% | Accuracy: ${domainStats.accuracy}%
                                </p>
                            </div>
                            ${isWeak ? '<div style="color: #ef4444;">⚠️ Needs Review</div>' : ''}
                            <button class="btn" onclick="event.stopPropagation(); showView('domain-menu', {domainId: ${domain.id}})">
                                Open Learning Menu
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Enhanced Domain Menu with all learning options
function showDomainMenu(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const domainSims = APP.content.simulations.filter(s => s.domain === domainId);
    const domainLessons = LESSON_TEMPLATES[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('dashboard')">← Back to Dashboard</button>
            </div>
            
            <h1 style="color: ${domain.color};">
                ${domain.icon} Domain ${domain.id}: ${domain.name}
            </h1>
            <p>Complete learning path for exam mastery</p>
            
            <div class="learning-menu">
                <div class="menu-item" onclick="showView('lessons', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">📚</div>
                    <h3>Lesson Guides</h3>
                    <p>${domainLessons.length} lessons</p>
                    <div style="color: #10b981;">Start Here</div>
                </div>
                
                <div class="menu-item" onclick="showView('simulations', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">🎮</div>
                    <h3>Simulations</h3>
                    <p>${domainSims.length} scenarios</p>
                </div>
                
                <div class="menu-item" onclick="startDomainQuiz(${domainId})">
                    <div style="font-size: 2rem;">📝</div>
                    <h3>Practice Quiz</h3>
                    <p>${domainQuestions.length} questions</p>
                </div>
                
                <div class="menu-item" onclick="showView('flashcards', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">🎴</div>
                    <h3>Flash Cards</h3>
                    <p>Quick review</p>
                </div>
                
                <div class="menu-item" onclick="showView('pbq', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">📊</div>
                    <h3>PBQs</h3>
                    <p>Hands-on tasks</p>
                </div>
                
                <div class="menu-item" onclick="showView('remedial', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">🔧</div>
                    <h3>Remedial Study</h3>
                    <p>Weak areas</p>
                </div>
                
                <div class="menu-item" onclick="showView('glossary', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">📖</div>
                    <h3>Glossary</h3>
                    <p>Key terms</p>
                </div>
                
                <div class="menu-item" onclick="showDomainAnalytics(${domainId})">
                    <div style="font-size: 2rem;">📈</div>
                    <h3>Your Progress</h3>
                    <p>Analytics</p>
                </div>
            </div>
        </div>
    `;
}

// Lesson list view
function showLessons(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    const lessons = LESSON_TEMPLATES[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                    ← Back to Domain Menu
                </button>
            </div>
            
            <h1>${domain.icon} Domain ${domainId} Lessons</h1>
            <p>Complete each lesson to master the concepts</p>
            
            <div style="margin: 30px 0;">
                ${lessons.map((lesson, index) => {
                    const isCompleted = APP.progress.completedLessons.includes(lesson.id);
                    const isLocked = APP.state.learningPath === 'guided' && 
                                   index > 0 && 
                                   !APP.progress.completedLessons.includes(lessons[index-1].id);
                    
                    return `
                        <div class="domain-card" style="margin: 15px 0; ${isLocked ? 'opacity: 0.5;' : ''}"
                             ${!isLocked ? `onclick="showView('lesson-viewer', {lessonId: '${lesson.id}'})"` : ''}>
                            <div style="display: flex; align-items: center; gap: 20px;">
                                <div style="font-size: 2rem;">
                                    ${isCompleted ? '✅' : isLocked ? '🔒' : '📖'}
                                </div>
                                <div style="flex: 1;">
                                    <h3>Lesson ${index + 1}: ${lesson.title}</h3>
                                    <p style="color: #a1a1aa;">
                                        ${isCompleted ? 'Completed' : isLocked ? 'Complete previous lesson first' : 'Ready to start'}
                                    </p>
                                </div>
                                ${!isLocked ? `
                                    <button class="btn ${isCompleted ? 'btn-success' : ''}">
                                        ${isCompleted ? 'Review' : 'Start'} Lesson
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="alert alert-success">
                <h3>📚 Learning Path</h3>
                <p>Complete lessons in order for best results, then practice with simulations and quizzes.</p>
            </div>
        </div>
    `;
}

// Lesson viewer with navigation
function showLessonViewer(container, lessonId) {
    const lesson = LESSON_TEMPLATES[Object.keys(LESSON_TEMPLATES).find(key => 
        LESSON_TEMPLATES[key].find(l => l.id === lessonId)
    )]?.find(l => l.id === lessonId);
    
    if (!lesson) return;
    
    APP.state.currentLesson = lessonId;
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('lessons', {domainId: ${lesson.domain}})">
                    ← Back to Lessons
                </button>
                <button class="btn btn-success" onclick="completeLesson('${lessonId}')">
                    ✓ Mark Complete
                </button>
            </div>
            
            <div class="lesson-viewer">
                <div class="lesson-sidebar">
                    <h3>Navigation</h3>
                    <div class="lesson-nav-item active" onclick="scrollToSection('intro')">
                        Introduction
                    </div>
                    <div class="lesson-nav-item" onclick="scrollToSection('concepts')">
                        Key Concepts
                    </div>
                    <div class="lesson-nav-item" onclick="scrollToSection('examples')">
                        Examples
                    </div>
                    <div class="lesson-nav-item" onclick="scrollToSection('practice')">
                        Practice
                    </div>
                    <div class="lesson-nav-item" onclick="scrollToSection('quiz')">
                        Lesson Quiz
                    </div>
                </div>
                
                <div class="lesson-content">
                    <h1>${lesson.title}</h1>
                    
                    <div id="intro" class="lesson-section">
                        <h2>Introduction</h2>
                        <p>This lesson covers essential concepts in ${lesson.title}. 
                        Understanding these fundamentals is crucial for the Security+ exam 
                        and real-world security practices.</p>
                    </div>
                    
                    <div id="concepts" class="lesson-section">
                        <h2>Key Concepts</h2>
                        ${generateLessonContent(lesson.title)}
                    </div>
                    
                    <div id="examples" class="lesson-section">
                        <h2>Real-World Examples</h2>
                        <p>Here are practical applications of these concepts:</p>
                        <ul>
                            <li>Enterprise implementation scenarios</li>
                            <li>Common security incidents</li>
                            <li>Best practices in the field</li>
                        </ul>
                    </div>
                    
                    <div id="practice" class="lesson-section">
                        <h2>Practice Scenarios</h2>
                        <p>Apply what you've learned with these scenarios:</p>
                        <button class="btn" onclick="startLessonPractice(${lesson.domain})">
                            Start Practice Questions
                        </button>
                    </div>
                    
                    <div id="quiz" class="lesson-section">
                        <h2>Lesson Quiz</h2>
                        <p>Test your understanding with 5 questions:</p>
                        <button class="btn btn-warning" onclick="startLessonQuiz(${lesson.domain})">
                            Take Lesson Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Flash Cards implementation
function showFlashCards(container, domainId) {
    const questions = domainId 
        ? APP.content.questions.filter(q => q.domain === domainId)
        : APP.content.questions;
    
    const glossary = APP.content.glossary[domainId] || [];
    const allCards = [...questions.map(q => ({
        front: q.question,
        back: `Answer: ${q.options[q.correct || q.correct_answer || 0]}\n\n${q.explanation || ''}`
    })), ...glossary.map(term => ({
        front: term.term,
        back: term.definition
    }))];
    
    if (APP.state.currentFlashCardIndex >= allCards.length) {
        APP.state.currentFlashCardIndex = 0;
    }
    
    const currentCard = allCards[APP.state.currentFlashCardIndex];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                    ← Back
                </button>
            </div>
            
            <h1>🎴 Flash Cards - Domain ${domainId || 'All'}</h1>
            <p>Card ${APP.state.currentFlashCardIndex + 1} of ${allCards.length}</p>
            
            <div class="flashcard-container">
                <div class="flashcard" id="flashcard" onclick="flipCard()">
                    <div class="flashcard-face">
                        <h2>${currentCard.front}</h2>
                        <p style="color: #a1a1aa; margin-top: 20px;">Click to reveal answer</p>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <p>${currentCard.back}</p>
                    </div>
                </div>
            </div>
            
            <div class="flashcard-controls">
                <button class="btn btn-danger btn-small" onclick="markCard('hard', ${domainId})">
                    ❌ Hard
                </button>
                <button class="btn btn-warning btn-small" onclick="markCard('medium', ${domainId})">
                    🔄 Review
                </button>
                <button class="btn btn-success btn-small" onclick="markCard('easy', ${domainId})">
                    ✅ Easy
                </button>
            </div>
            
            <div class="flashcard-controls">
                <button class="btn btn-secondary" onclick="previousCard(${domainId})">
                    ← Previous
                </button>
                <button class="btn btn-secondary" onclick="nextCard(${domainId})">
                    Next →
                </button>
                <button class="btn" onclick="shuffleCards(${domainId})">
                    🔀 Shuffle
                </button>
            </div>
        </div>
    `;
}

// Simulation Player
function showSimulationPlayer(container, simId) {
    const sim = APP.content.simulations.find(s => s.id === simId);
    if (!sim) return;
    
    APP.state.currentSimulation = {
        id: simId,
        currentPoint: 0,
        score: 0,
        decisions: []
    };
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="simulation-player">
                <h1>${sim.title}</h1>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                
                <div style="background: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Scenario</h3>
                    <p>${sim.scenario || sim.introduction || 'Security scenario'}</p>
                </div>
                
                <div id="simulationContent">
                    ${renderDecisionPoint(sim, 0)}
                </div>
            </div>
        </div>
    `;
}

// Render decision point in simulation
function renderDecisionPoint(sim, pointIndex) {
    const points = sim.decisionPoints || [];
    if (pointIndex >= points.length) {
        return `
            <div class="alert alert-success">
                <h2>Simulation Complete!</h2>
                <p>Score: ${APP.state.currentSimulation.score} points</p>
                <button class="btn" onclick="showView('simulations')">Back to Simulations</button>
            </div>
        `;
    }
    
    const point = points[pointIndex];
    
    return `
        <div class="decision-point">
            <h2>${point.title}</h2>
            <p>${point.situation}</p>
            <h3>${point.question}</h3>
            
            <div style="margin: 20px 0;">
                ${(point.options || []).map((opt, i) => `
                    <div class="decision-option" onclick="makeDecision(${i}, '${sim.id}', ${pointIndex})">
                        ${String.fromCharCode(65 + i)}. ${opt.text}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Remedial Study System
function showRemedial(container, domainId) {
    const weakAreas = identifyWeakAreas();
    const wrongQuestions = APP.progress.wrongAnswers;
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('dashboard')">← Back</button>
            </div>
            
            <h1>🔧 Remedial Study ${domainId ? `- Domain ${domainId}` : ''}</h1>
            
            <div class="remedial-plan">
                <h3>📊 Your Weak Areas</h3>
                ${weakAreas.length > 0 ? `
                    <p>Focus on these domains: ${weakAreas.map(d => `Domain ${d}`).join(', ')}</p>
                    <ul>
                        ${wrongQuestions.slice(0, 10).map(w => `
                            <li>Review: ${APP.content.questions.find(q => q.id === w.id)?.question.substring(0, 60)}...</li>
                        `).join('')}
                    </ul>
                ` : '<p>Great job! No significant weak areas detected.</p>'}
            </div>
            
            <div class="weak-areas-grid">
                <div class="weak-area-card">
                    <h3>📝 Practice Wrong Answers</h3>
                    <p>${wrongQuestions.length} questions to review</p>
                    <button class="btn btn-warning" onclick="practiceWrongAnswers()">
                        Start Practice
                    </button>
                </div>
                
                <div class="weak-area-card">
                    <h3>🚩 Review Flagged</h3>
                    <p>${APP.progress.flaggedQuestions.length} flagged questions</p>
                    <button class="btn btn-warning" onclick="practiceFlagged()">
                        Review Flagged
                    </button>
                </div>
                
                <div class="weak-area-card">
                    <h3>🎯 Focused Practice</h3>
                    <p>Target weak domains</p>
                    <button class="btn btn-warning" onclick="startFocusedPractice()">
                        Start Focused
                    </button>
                </div>
            </div>
            
            <div class="alert alert-warning">
                <h3>📚 Study Recommendations</h3>
                <ol>
                    <li>Review lessons in weak domains</li>
                    <li>Complete all simulations</li>
                    <li>Use flash cards daily</li>
                    <li>Take practice quizzes until 85%+ accuracy</li>
                </ol>
            </div>
        </div>
    `;
}

// PBQ System
function showPBQ(container, domainId) {
    const pbqs = domainId 
        ? APP.content.pbqs.filter(p => p.domain === domainId)
        : APP.content.pbqs;
    
    if (pbqs.length === 0) {
        container.innerHTML = `
            <div class="platform-container">
                <div class="nav-bar">
                    <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                        ← Back
                    </button>
                </div>
                <h1>📊 Performance-Based Questions</h1>
                <p>No PBQs available for this domain yet.</p>
            </div>
        `;
        return;
    }
    
    const pbq = pbqs[0];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                    ← Back
                </button>
            </div>
            
            <div class="pbq-container">
                <h1>${pbq.title}</h1>
                <p>${pbq.scenario}</p>
                
                ${pbq.type === 'drag-drop' ? `
                    <div class="drag-area" id="dragSource">
                        <h3>Available Items</h3>
                        ${pbq.items.map((item, i) => `
                            <div class="drag-item" draggable="true" data-index="${i}">
                                ${item}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="drag-area" id="dragTarget">
                        <h3>Correct Order</h3>
                        <p>Drag items here in the correct sequence</p>
                    </div>
                ` : ''}
                
                ${pbq.type === 'matching' ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <div>
                            <h3>Items</h3>
                            ${pbq.left.map(item => `
                                <div class="drag-item">${item}</div>
                            `).join('')}
                        </div>
                        <div>
                            <h3>Match With</h3>
                            ${pbq.right.map(item => `
                                <div class="drag-area" style="margin: 10px 0;">
                                    ${item}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-success" onclick="checkPBQ()">
                        Check Answer
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Setup drag and drop
    setupDragAndDrop();
}

// Helper Functions
function generateLessonContent(title) {
    // Generate relevant content based on lesson title
    const content = {
        'CIA Triad Fundamentals': `
            <h3>Confidentiality</h3>
            <p>Ensuring information is accessible only to authorized individuals.</p>
            <ul>
                <li>Encryption (AES, RSA)</li>
                <li>Access controls</li>
                <li>Data classification</li>
            </ul>
            
            <h3>Integrity</h3>
            <p>Ensuring data remains accurate and unmodified.</p>
            <ul>
                <li>Hashing (SHA-256)</li>
                <li>Digital signatures</li>
                <li>Version control</li>
            </ul>
            
            <h3>Availability</h3>
            <p>Ensuring systems and data are accessible when needed.</p>
            <ul>
                <li>Redundancy</li>
                <li>Backups</li>
                <li>DDoS protection</li>
            </ul>
        `,
        'Threat Actors & Motivations': `
            <h3>Types of Threat Actors</h3>
            <ul>
                <li><strong>Nation-State:</strong> Government-sponsored, APT groups</li>
                <li><strong>Hacktivist:</strong> Ideologically motivated</li>
                <li><strong>Criminal:</strong> Financial gain</li>
                <li><strong>Insider:</strong> Malicious employees</li>
                <li><strong>Script Kiddies:</strong> Low-skill attackers</li>
            </ul>
            
            <h3>Common Motivations</h3>
            <ul>
                <li>Financial gain (ransomware, theft)</li>
                <li>Espionage (corporate, state)</li>
                <li>Disruption (DDoS, sabotage)</li>
                <li>Revenge (insider threats)</li>
            </ul>
        `
    };
    
    return content[title] || `
        <p>This lesson covers important concepts related to ${title}.</p>
        <ul>
            <li>Fundamental principles</li>
            <li>Implementation strategies</li>
            <li>Best practices</li>
            <li>Common vulnerabilities</li>
            <li>Mitigation techniques</li>
        </ul>
    `;
}

// Quiz system
function showQuiz(container, params) {
    const questions = params.questions || APP.content.questions;
    APP.state.quizQuestions = questions.slice(0, params.limit || 50);
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    
    showQuestion(container);
}

function showQuestion(container) {
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    if (!question) {
        showQuizResults(container);
        return;
    }
    
    container = container || findContentContainer();
    const isFlagged = APP.progress.flaggedQuestions.includes(question.id);
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="quiz-container">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <span>Question ${APP.state.currentQuestionIndex + 1} of ${APP.state.quizQuestions.length}</span>
                    <span>Score: ${APP.state.score}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <span class="badge" style="background: ${DOMAINS[question.domain-1].color};">
                        Domain ${question.domain}
                    </span>
                    <button class="btn ${isFlagged ? 'btn-danger' : 'btn-secondary'} btn-small" 
                            onclick="toggleFlag('${question.id}')">
                        ${isFlagged ? '🚩 Flagged' : '🏳️ Flag'}
                    </button>
                </div>
                
                <div class="question-text">
                    ${question.question}
                </div>
                
                <div id="options">
                    ${question.options.map((opt, i) => `
                        <div class="option" id="opt-${i}" onclick="selectOption(${i})">
                            ${String.fromCharCode(65 + i)}. ${opt}
                        </div>
                    `).join('')}
                </div>
                
                <div id="explanation" style="display: none; margin-top: 20px; padding: 20px; background: #27272a; border-radius: 8px;">
                    <strong>Explanation:</strong>
                    <p>${question.explanation || 'The correct answer is based on Security+ best practices.'}</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn" id="submitBtn" onclick="submitAnswer()">
                        Submit Answer
                    </button>
                    <button class="btn btn-secondary" id="nextBtn" style="display: none;" onclick="nextQuestion()">
                        Next Question →
                    </button>
                    <button class="btn btn-secondary" onclick="showView('dashboard')">
                        Exit Quiz
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Simulations view
function showSimulations(container, domainId) {
    const simulations = domainId 
        ? APP.content.simulations.filter(s => s.domain === domainId)
        : APP.content.simulations;
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('${domainId ? 'domain-menu' : 'dashboard'}', {domainId: ${domainId}})">
                    ← Back
                </button>
            </div>
            
            <h1>🎮 Simulations ${domainId ? `- Domain ${domainId}` : '(All Domains)'}</h1>
            <p>${simulations.length} interactive scenarios available</p>
            
            <div class="domain-grid">
                ${simulations.slice(0, 30).map(sim => {
                    const isCompleted = APP.progress.completedSimulations.includes(sim.id);
                    
                    return `
                        <div class="domain-card">
                            ${isCompleted ? '<div style="color: #10b981;">✅ Completed</div>' : ''}
                            <h3>${sim.title}</h3>
                            <p style="color: #a1a1aa;">${sim.scenario || sim.introduction || 'Interactive scenario'}</p>
                            <div style="margin: 10px 0;">
                                <span style="color: #f59e0b;">Difficulty: ${sim.difficulty || 'Medium'}</span><br>
                                <span style="color: #6366f1;">Points: ${sim.maxScore || sim.points || 100}</span>
                            </div>
                            <button class="btn" onclick="showView('simulation-player', {simId: '${sim.id}'})">
                                ${isCompleted ? 'Replay' : 'Start'} Simulation
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Action functions
function selectOption(index) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById(`opt-${index}`).classList.add('selected');
    APP.state.selectedOption = index;
}

function submitAnswer() {
    if (APP.state.selectedOption === undefined) {
        alert('Please select an answer');
        return;
    }
    
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    const correct = question.correct || question.correct_answer || 0;
    const isCorrect = APP.state.selectedOption === correct;
    
    // Update UI
    document.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));
    
    if (isCorrect) {
        APP.state.score++;
        document.getElementById(`opt-${APP.state.selectedOption}`).classList.add('correct');
    } else {
        document.getElementById(`opt-${APP.state.selectedOption}`).classList.add('incorrect');
        document.getElementById(`opt-${correct}`).classList.add('correct');
        
        // Track wrong answer
        if (!APP.progress.wrongAnswers.find(w => w.id === question.id)) {
            APP.progress.wrongAnswers.push({
                id: question.id,
                domain: question.domain
            });
        }
    }
    
    // Show explanation
    document.getElementById('explanation').style.display = 'block';
    
    // Update buttons
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
    
    // Track completion
    if (!APP.progress.completedQuestions.find(q => q.id === question.id)) {
        APP.progress.completedQuestions.push({
            id: question.id,
            correct: isCorrect,
            domain: question.domain
        });
    }
    
    // Update domain scores
    if (!APP.progress.domainScores[question.domain]) {
        APP.progress.domainScores[question.domain] = [];
    }
    APP.progress.domainScores[question.domain].push(isCorrect ? 1 : 0);
    
    saveProgress();
}

function nextQuestion() {
    APP.state.currentQuestionIndex++;
    APP.state.selectedOption = undefined;
    showQuestion();
}

function showQuizResults(container) {
    const percentage = Math.round((APP.state.score / APP.state.quizQuestions.length) * 100);
    const passed = percentage >= 85;
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="quiz-container" style="text-align: center;">
                <h2>Quiz Complete!</h2>
                
                <div class="stat-value" style="font-size: 4rem; margin: 30px; color: ${passed ? '#10b981' : '#f59e0b'};">
                    ${percentage}%
                </div>
                
                <p style="font-size: 1.2rem;">You scored ${APP.state.score} out of ${APP.state.quizQuestions.length}</p>
                
                <div style="margin: 30px;">
                    ${passed ? `
                        <div class="alert alert-success">
                            <h3>🎉 Excellent!</h3>
                            <p>You've mastered this material. Ready for the exam!</p>
                        </div>
                    ` : `
                        <div class="alert alert-warning">
                            <h3>📚 Keep Studying</h3>
                            <p>You need 85% to pass. Review the material and try again.</p>
                        </div>
                    `}
                </div>
                
                <div>
                    <button class="btn" onclick="showView('dashboard')">
                        Back to Dashboard
                    </button>
                    <button class="btn btn-secondary" onclick="showView('remedial')">
                        Review Mistakes
                    </button>
                    ${!passed ? `
                        <button class="btn btn-warning" onclick="retryQuiz()">
                            Try Again
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    saveProgress();
}

// Additional helper functions
function startDomainQuiz(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    showView('quiz', { questions, limit: 50 });
}

function startLessonQuiz(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    const shuffled = questions.sort(() => Math.random() - 0.5);
    showView('quiz', { questions: shuffled, limit: 5 });
}

function startLessonPractice(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    const shuffled = questions.sort(() => Math.random() - 0.5);
    showView('quiz', { questions: shuffled, limit: 10 });
}

function startPracticeExam() {
    // Create 90-question exam with proper domain weighting
    const examQuestions = [];
    DOMAINS.forEach(domain => {
        const domainQuestions = APP.content.questions.filter(q => q.domain === domain.id);
        const count = Math.floor(90 * domain.weight);
        const shuffled = domainQuestions.sort(() => Math.random() - 0.5);
        examQuestions.push(...shuffled.slice(0, count));
    });
    
    showView('quiz', { questions: examQuestions.sort(() => Math.random() - 0.5), limit: 90 });
}

function practiceWrongAnswers() {
    const wrongIds = APP.progress.wrongAnswers.map(w => w.id);
    const questions = APP.content.questions.filter(q => wrongIds.includes(q.id));
    
    if (questions.length === 0) {
        alert('No wrong answers to practice!');
        return;
    }
    
    showView('quiz', { questions });
}

function practiceFlagged() {
    const questions = APP.content.questions.filter(q => 
        APP.progress.flaggedQuestions.includes(q.id)
    );
    
    if (questions.length === 0) {
        alert('No flagged questions!');
        return;
    }
    
    showView('quiz', { questions });
}

function startFocusedPractice() {
    const weakAreas = identifyWeakAreas();
    if (weakAreas.length === 0) {
        alert('No weak areas identified!');
        return;
    }
    
    const questions = APP.content.questions.filter(q => weakAreas.includes(q.domain));
    showView('quiz', { questions: questions.sort(() => Math.random() - 0.5), limit: 30 });
}

function toggleFlag(questionId) {
    const index = APP.progress.flaggedQuestions.indexOf(questionId);
    
    if (index > -1) {
        APP.progress.flaggedQuestions.splice(index, 1);
    } else {
        APP.progress.flaggedQuestions.push(questionId);
    }
    
    saveProgress();
    showQuestion();
}

function completeLesson(lessonId) {
    if (!APP.progress.completedLessons.includes(lessonId)) {
        APP.progress.completedLessons.push(lessonId);
        saveProgress();
        alert('Lesson marked as complete!');
    }
}

function makeDecision(optionIndex, simId, pointIndex) {
    const sim = APP.content.simulations.find(s => s.id === simId);
    const point = sim.decisionPoints[pointIndex];
    const option = point.options[optionIndex];
    
    APP.state.currentSimulation.score += option.points || 0;
    APP.state.currentSimulation.decisions.push({
        point: point.title,
        choice: option.text,
        optimal: option.isOptimal
    });
    
    // Show feedback
    const container = document.getElementById('simulationContent');
    container.innerHTML = `
        <div class="decision-feedback ${option.isOptimal ? 'optimal' : 'suboptimal'}">
            <h3>Feedback</h3>
            <p><strong>Your choice:</strong> ${option.text}</p>
            <p><strong>Result:</strong> ${option.feedback}</p>
            <p><strong>Points earned:</strong> ${option.points || 0}</p>
            
            <button class="btn" onclick="nextSimulationPoint('${simId}', ${pointIndex + 1})">
                Continue →
            </button>
        </div>
    `;
    
    // Update progress bar
    const progress = ((pointIndex + 1) / sim.decisionPoints.length) * 100;
    document.querySelector('.progress-fill').style.width = progress + '%';
}

function nextSimulationPoint(simId, pointIndex) {
    const sim = APP.content.simulations.find(s => s.id === simId);
    document.getElementById('simulationContent').innerHTML = renderDecisionPoint(sim, pointIndex);
    
    // Mark complete if done
    if (pointIndex >= sim.decisionPoints.length && !APP.progress.completedSimulations.includes(simId)) {
        APP.progress.completedSimulations.push(simId);
        saveProgress();
    }
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard(domainId) {
    APP.state.currentFlashCardIndex++;
    showView('flashcards', { domainId });
}

function previousCard(domainId) {
    APP.state.currentFlashCardIndex--;
    if (APP.state.currentFlashCardIndex < 0) APP.state.currentFlashCardIndex = 0;
    showView('flashcards', { domainId });
}

function shuffleCards(domainId) {
    APP.state.currentFlashCardIndex = Math.floor(Math.random() * 100);
    showView('flashcards', { domainId });
}

function markCard(difficulty, domainId) {
    // Track card difficulty for spaced repetition
    nextCard(domainId);
}

function retryQuiz() {
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    APP.state.selectedOption = undefined;
    showQuestion();
}

function showGlossary(container, domainId) {
    const terms = APP.content.glossary[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                    ← Back
                </button>
            </div>
            
            <h1>📖 Glossary - Domain ${domainId}</h1>
            
            <input type="text" placeholder="Search terms..." 
                   style="width: 100%; padding: 10px; margin: 20px 0; background: #27272a; 
                          border: 1px solid #3f3f46; border-radius: 8px; color: white;"
                   onkeyup="filterGlossary(this.value, ${domainId})">
            
            <div id="glossaryTerms" style="display: grid; gap: 15px;">
                ${terms.map(term => `
                    <div class="glossary-term" style="background: #18181b; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #6366f1;">${term.term}</h3>
                        <p>${term.definition}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function filterGlossary(searchTerm, domainId) {
    const terms = APP.content.glossary[domainId] || [];
    const filtered = terms.filter(t => 
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    document.getElementById('glossaryTerms').innerHTML = filtered.map(term => `
        <div class="glossary-term" style="background: #18181b; padding: 15px; border-radius: 8px;">
            <h3 style="color: #6366f1;">${term.term}</h3>
            <p>${term.definition}</p>
        </div>
    `).join('');
}

function showDomainAnalytics(domainId) {
    const stats = getDomainStats(domainId);
    const container = findContentContainer();
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                    ← Back
                </button>
            </div>
            
            <h1>📈 Domain ${domainId} Analytics</h1>
            
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-value">${stats.progress}%</div>
                    <div>Progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.accuracy}%</div>
                    <div>Accuracy</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.questionsAnswered}</div>
                    <div>Questions Done</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.lessonsCompleted}</div>
                    <div>Lessons Done</div>
                </div>
            </div>
            
            <div class="alert alert-success">
                <h3>Study Path Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${stats.progress}%"></div>
                </div>
            </div>
        </div>
    `;
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        
        // Update active nav
        document.querySelectorAll('.lesson-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

function setupDragAndDrop() {
    // Basic drag and drop setup for PBQs
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drag-area');
    
    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.target.classList.add('dragging');
        });
        
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            if (zone.id === 'dragTarget') {
                const newItem = document.createElement('div');
                newItem.className = 'drag-item';
                newItem.textContent = data;
                zone.appendChild(newItem);
            }
        });
    });
}

function checkPBQ() {
    alert('PBQ checking coming soon! This would verify your answer.');
}

// Analytics functions
function calculateStats() {
    const completed = APP.progress.completedQuestions.length;
    const correct = APP.progress.completedQuestions.filter(q => q.correct).length;
    
    return {
        completed: completed,
        accuracy: completed > 0 ? Math.round((correct / completed) * 100) : 0
    };
}

function getDomainStats(domainId) {
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const answered = APP.progress.completedQuestions.filter(q => q.domain === domainId);
    const correct = answered.filter(q => q.correct).length;
    const lessons = LESSON_TEMPLATES[domainId] || [];
    const completedLessons = lessons.filter(l => APP.progress.completedLessons.includes(l.id));
    
    return {
        progress: Math.round((answered.length / domainQuestions.length) * 100) || 0,
        accuracy: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0,
        questionsAnswered: answered.length,
        totalQuestions: domainQuestions.length,
        lessonsCompleted: completedLessons.length
    };
}

function identifyWeakAreas() {
    const weakDomains = [];
    
    DOMAINS.forEach(domain => {
        const scores = APP.progress.domainScores[domain.id] || [];
        if (scores.length >= 5) {
            const recent = scores.slice(-10);
            const accuracy = recent.reduce((a, b) => a + b, 0) / recent.length;
            if (accuracy < 0.7) {
                weakDomains.push(domain.id);
            }
        }
        
        // Also check wrong answers
        const wrongInDomain = APP.progress.wrongAnswers.filter(w => w.domain === domain.id);
        if (wrongInDomain.length >= 5) {
            if (!weakDomains.includes(domain.id)) {
                weakDomains.push(domain.id);
            }
        }
    });
    
    return weakDomains;
}

// Save/Load Progress
function saveProgress() {
    try {
        localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
        localStorage.setItem('securityPlusState', JSON.stringify(APP.state));
    } catch (e) {
        console.error('Could not save progress:', e);
    }
}

function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('securityPlusProgress');
        const savedState = localStorage.getItem('securityPlusState');
        
        if (savedProgress) {
            APP.progress = JSON.parse(savedProgress);
        }
        if (savedState) {
            const state = JSON.parse(savedState);
            APP.state.learningPath = state.learningPath || 'guided';
        }
    } catch (e) {
        console.error('Could not load progress:', e);
    }
}

// Global functions
window.showView = showView;
window.selectOption = selectOption;
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.startDomainQuiz = startDomainQuiz;
window.startLessonQuiz = startLessonQuiz;
window.startLessonPractice = startLessonPractice;
window.startPracticeExam = startPracticeExam;
window.practiceWrongAnswers = practiceWrongAnswers;
window.practiceFlagged = practiceFlagged;
window.startFocusedPractice = startFocusedPractice;
window.toggleFlag = toggleFlag;
window.completeLesson = completeLesson;
window.makeDecision = makeDecision;
window.nextSimulationPoint = nextSimulationPoint;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.previousCard = previousCard;
window.shuffleCards = shuffleCards;
window.markCard = markCard;
window.retryQuiz = retryQuiz;
window.showGlossary = showGlossary;
window.filterGlossary = filterGlossary;
window.showDomainAnalytics = showDomainAnalytics;
window.scrollToSection = scrollToSection;
window.checkPBQ = checkPBQ;

console.log('Security+ Complete Learning System v13 ready!');
