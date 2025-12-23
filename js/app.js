// Security+ Platform v14 - Enhanced with all requested features
// Unlocked lessons, dropdown navigation, domain quiz fixes, practice test

console.log('Security+ Platform v14 - Enhanced LMS starting...');

// Global state
const APP = {
    version: '14.0-Enhanced',
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
        flashCardMode: 'term',
        examTimer: null,
        examStartTime: null,
        examTimeRemaining: 5400 // 90 minutes in seconds
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
        domainScores: {1: [], 2: [], 3: [], 4: [], 5: []},
        practiceExamScores: []
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
    console.log('Initializing Enhanced LMS...');
    
    // Load data files
    await loadDataFiles();
    
    // Generate lessons if not loaded
    if (APP.content.lessons.length === 0) {
        generateLessons();
    }
    
    // Generate PBQs if not loaded
    if (APP.content.pbqs.length === 0) {
        generatePBQs();
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

// Generate lessons
function generateLessons() {
    APP.content.lessons = [];
    Object.values(LESSON_TEMPLATES).forEach(domainLessons => {
        APP.content.lessons.push(...domainLessons);
    });
}

// Generate comprehensive PBQs
function generatePBQs() {
    APP.content.pbqs = [
        {
            id: 'PBQ-1',
            domain: 3,
            type: 'drag-drop',
            title: 'Configure Firewall Rules',
            scenario: 'Arrange these firewall rules in the correct order for proper security.',
            items: ['Deny all inbound traffic', 'Allow HTTPS from any', 'Allow SSH from admin subnet', 'Allow DNS to internal servers'],
            correct_order: [2, 1, 3, 0]
        },
        {
            id: 'PBQ-2',
            domain: 4,
            type: 'matching',
            title: 'Match Security Incidents to Response',
            scenario: 'Match each security incident type to the appropriate response action.',
            left: ['Data Breach', 'DDoS Attack', 'Malware Infection', 'Insider Threat'],
            right: ['Activate legal team', 'Enable rate limiting', 'Isolate system', 'Review access logs']
        },
        {
            id: 'PBQ-3',
            domain: 1,
            type: 'drag-drop',
            title: 'Security Control Implementation',
            scenario: 'Place security controls in the correct categories.',
            items: ['Firewall', 'Security Training', 'IDS', 'Background Checks', 'Encryption'],
            categories: ['Technical', 'Administrative', 'Physical']
        },
        {
            id: 'PBQ-4',
            domain: 2,
            type: 'hotspot',
            title: 'Identify Attack Vectors',
            scenario: 'Click on all potential attack vectors in this network diagram.',
            image: 'network-diagram',
            hotspots: ['Internet Gateway', 'Wireless AP', 'USB Ports', 'Email Server']
        },
        {
            id: 'PBQ-5',
            domain: 5,
            type: 'drag-drop',
            title: 'Risk Assessment Matrix',
            scenario: 'Place risks in the appropriate quadrant based on likelihood and impact.',
            items: ['Server Outage', 'Phishing Attack', 'Natural Disaster', 'Password Breach'],
            matrix: ['High Impact/High Likelihood', 'High Impact/Low Likelihood', 'Low Impact/High Likelihood', 'Low Impact/Low Likelihood']
        },
        {
            id: 'PBQ-6',
            domain: 3,
            type: 'configuration',
            title: 'Configure VPN Settings',
            scenario: 'Select the appropriate VPN configuration for secure remote access.',
            options: ['Protocol', 'Encryption', 'Authentication', 'Port'],
            choices: [['OpenVPN', 'L2TP', 'PPTP'], ['AES-256', 'AES-128', '3DES'], ['Certificate', 'PSK', 'Username/Password'], ['443', '1194', '1723']]
        },
        {
            id: 'PBQ-7',
            domain: 4,
            type: 'sequence',
            title: 'Incident Response Steps',
            scenario: 'Arrange the incident response steps in the correct order.',
            items: ['Containment', 'Identification', 'Eradication', 'Recovery', 'Preparation', 'Lessons Learned'],
            correct_order: [4, 1, 0, 2, 3, 5]
        },
        {
            id: 'PBQ-8',
            domain: 2,
            type: 'matching',
            title: 'Match Malware Types',
            scenario: 'Match each malware description to its type.',
            left: ['Encrypts files for ransom', 'Replicates without user action', 'Appears legitimate', 'Creates backdoor'],
            right: ['Ransomware', 'Worm', 'Trojan', 'RAT']
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
    initializeNavigation();
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

// Initialize Navigation with Dropdowns
function initializeNavigation() {
    const container = findContentContainer();
    
    // Create navigation if it doesn't exist
    let nav = document.querySelector('.nav-bar-top');
    if (!nav) {
        nav = document.createElement('div');
        nav.className = 'nav-bar-top';
        container.parentNode.insertBefore(nav, container);
    }
    
    nav.innerHTML = `
        <div class="nav-container">
            <button class="nav-btn" onclick="showView('dashboard')">
                🏠 Dashboard
            </button>
            
            <div class="nav-dropdown">
                <button class="nav-btn dropdown-toggle">📚 Domains ▼</button>
                <div class="dropdown-menu">
                    ${DOMAINS.map(domain => `
                        <div class="dropdown-section">
                            <div class="dropdown-header" onclick="showView('domain-menu', {domainId: ${domain.id}})">
                                ${domain.icon} Domain ${domain.id}: ${domain.name}
                            </div>
                            <div class="dropdown-items">
                                <a onclick="showView('lessons', {domainId: ${domain.id}})">📖 Lessons</a>
                                <a onclick="startDomainQuiz(${domain.id})">📝 Domain Quiz (25Q)</a>
                                <a onclick="showView('simulations', {domainId: ${domain.id}})">🎮 Simulations</a>
                                <a onclick="showView('flashcards', {domainId: ${domain.id}})">🎴 Flash Cards</a>
                                <a onclick="showView('glossary', {domainId: ${domain.id}})">📖 Glossary</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="nav-dropdown">
                <button class="nav-btn dropdown-toggle">📖 Lessons ▼</button>
                <div class="dropdown-menu">
                    ${DOMAINS.map(domain => `
                        <div class="dropdown-section">
                            <div class="dropdown-header">Domain ${domain.id}</div>
                            <div class="dropdown-items">
                                ${(LESSON_TEMPLATES[domain.id] || []).map(lesson => `
                                    <a onclick="showView('lesson-viewer', {lessonId: '${lesson.id}'})">
                                        ${lesson.title}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="nav-dropdown">
                <button class="nav-btn dropdown-toggle">📝 Practice ▼</button>
                <div class="dropdown-menu">
                    <div class="dropdown-items">
                        <a onclick="startPracticeTest()">📋 Practice Test (90Q, 90min)</a>
                        ${DOMAINS.map(domain => `
                            <a onclick="startDomainQuiz(${domain.id})">
                                ${domain.icon} Domain ${domain.id} Quiz (25Q)
                            </a>
                        `).join('')}
                        <a onclick="practiceWrongAnswers()">❌ Review Wrong Answers</a>
                        <a onclick="practiceFlagged()">🚩 Review Flagged</a>
                    </div>
                </div>
            </div>
            
            <div class="nav-dropdown">
                <button class="nav-btn dropdown-toggle">🎮 Simulations ▼</button>
                <div class="dropdown-menu">
                    <div class="dropdown-items">
                        <a onclick="showView('simulations')">All Simulations</a>
                        ${DOMAINS.map(domain => `
                            <a onclick="showView('simulations', {domainId: ${domain.id}})">
                                ${domain.icon} Domain ${domain.id} Sims
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <button class="nav-btn" onclick="showView('remedial')">
                🔧 Remedial
            </button>
            
            <button class="nav-btn badge-btn" onclick="showFlaggedQuestions()">
                🚩 <span id="flaggedCount">${APP.progress.flaggedQuestions.length}</span>
            </button>
        </div>
    `;
}

// Inject comprehensive styles
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Top Navigation Bar */
        .nav-bar-top {
            background: #18181b;
            border-bottom: 2px solid #27272a;
            padding: 10px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            margin-bottom: 20px;
        }
        
        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .nav-btn {
            background: #27272a;
            color: #fafafa;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.95rem;
            transition: all 0.3s;
        }
        
        .nav-btn:hover {
            background: #3f3f46;
        }
        
        .badge-btn {
            background: #f59e0b;
        }
        
        .nav-dropdown {
            position: relative;
        }
        
        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 8px;
            min-width: 280px;
            max-height: 500px;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            margin-top: 5px;
        }
        
        .nav-dropdown:hover .dropdown-menu {
            display: block;
        }
        
        .dropdown-section {
            border-bottom: 1px solid #27272a;
        }
        
        .dropdown-section:last-child {
            border-bottom: none;
        }
        
        .dropdown-header {
            padding: 12px 16px;
            font-weight: bold;
            color: #6366f1;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .dropdown-header:hover {
            background: #27272a;
        }
        
        .dropdown-items {
            padding: 8px 0;
        }
        
        .dropdown-items a {
            display: block;
            padding: 8px 24px;
            color: #a1a1aa;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .dropdown-items a:hover {
            background: #27272a;
            color: #fafafa;
        }
        
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
        
        /* Domain Grid with 6th Practice Test Box */
        .domain-grid-plus {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .domain-card, .practice-test-card {
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
        
        .practice-test-card {
            background: linear-gradient(135deg, #18181b, #1f1f23);
            border-color: #f59e0b;
        }
        
        .practice-test-card:hover {
            transform: translateY(-4px);
            border-color: #f59e0b;
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
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
        
        @media (max-width: 768px) {
            .lesson-viewer {
                grid-template-columns: 1fr;
            }
        }
        
        .lesson-sidebar {
            background: #18181b;
            border-radius: 12px;
            padding: 20px;
            height: fit-content;
            position: sticky;
            top: 80px;
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
        
        /* Practice Test Timer */
        .exam-timer {
            position: fixed;
            top: 80px;
            right: 20px;
            background: #18181b;
            border: 2px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 100;
        }
        
        .exam-timer.warning {
            border-color: #ef4444;
            color: #ef4444;
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
        
        .btn-secondary { background: #27272a; }
        .btn-success { background: #10b981; }
        .btn-warning { background: #f59e0b; }
        .btn-danger { background: #ef4444; }
        .btn-small { padding: 8px 16px; font-size: 0.9rem; }
        
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
        case 'practice-test':
            showPracticeTest(container);
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

// Dashboard with Practice Test box
function showDashboard(container) {
    const stats = calculateStats();
    const weakAreas = identifyWeakAreas();
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="platform-header">Security+ Complete Learning System</h1>
            
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
            
            <h2>Select Study Area:</h2>
            
            <div class="domain-grid-plus">
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
                
                <!-- Practice Test Box (6th) -->
                <div class="practice-test-card" onclick="startPracticeTest()">
                    <div style="font-size: 2rem;">📋</div>
                    <h3>Practice Test</h3>
                    <p><strong>Full Exam Simulation</strong></p>
                    <div style="margin: 15px 0; color: #f59e0b;">
                        <div>⏱️ 90 minutes</div>
                        <div>📝 85 questions + 5 PBQs</div>
                        <div>🎯 Passing score: 750/900</div>
                    </div>
                    <div style="margin: 15px 0;">
                        <p style="font-size: 0.9rem; color: #a1a1aa;">
                            Last scores: 
                            ${APP.progress.practiceExamScores.slice(-3).map(s => `${s}%`).join(', ') || 'None yet'}
                        </p>
                    </div>
                    <button class="btn btn-warning" style="width: 100%;">
                        Start Practice Test
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Domain Menu with Domain Quiz label
function showDomainMenu(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const domainSims = APP.content.simulations.filter(s => s.domain === domainId);
    const domainLessons = LESSON_TEMPLATES[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
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
                    <h3>Domain Quiz</h3>
                    <p>25 random questions</p>
                    <div style="color: #f59e0b;">Test Knowledge</div>
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

// Lessons view - ALL UNLOCKED
function showLessons(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    const lessons = LESSON_TEMPLATES[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>${domain.icon} Domain ${domainId} Lessons</h1>
            <p>All lessons are available - jump to any topic you need!</p>
            
            <div style="margin: 30px 0;">
                ${lessons.map((lesson, index) => {
                    const isCompleted = APP.progress.completedLessons.includes(lesson.id);
                    
                    return `
                        <div class="domain-card" style="margin: 15px 0;"
                             onclick="showView('lesson-viewer', {lessonId: '${lesson.id}'})">
                            <div style="display: flex; align-items: center; gap: 20px;">
                                <div style="font-size: 2rem;">
                                    ${isCompleted ? '✅' : '📖'}
                                </div>
                                <div style="flex: 1;">
                                    <h3>Lesson ${index + 1}: ${lesson.title}</h3>
                                    <p style="color: #a1a1aa;">
                                        ${isCompleted ? 'Completed - Click to review' : 'Ready to start'}
                                    </p>
                                </div>
                                <button class="btn ${isCompleted ? 'btn-success' : ''}">
                                    ${isCompleted ? 'Review' : 'Start'} Lesson
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="alert alert-success">
                <h3>📚 Learning Tips</h3>
                <p>• All lessons are unlocked - learn at your own pace</p>
                <p>• Review completed lessons anytime</p>
                <p>• Take the lesson quiz to test understanding</p>
            </div>
        </div>
    `;
}

// Practice Test with Timer
function startPracticeTest() {
    showView('practice-test');
}

function showPracticeTest(container) {
    // Create exam: 5 PBQs + 85 regular questions
    const pbqs = APP.content.pbqs.slice(0, 5);
    const regularQuestions = [];
    
    // Get proper distribution of questions by domain
    DOMAINS.forEach(domain => {
        const domainQuestions = APP.content.questions.filter(q => q.domain === domain.id);
        const count = Math.floor(85 * domain.weight);
        const shuffled = domainQuestions.sort(() => Math.random() - 0.5);
        regularQuestions.push(...shuffled.slice(0, count));
    });
    
    // Fill to exactly 85 if needed
    while (regularQuestions.length < 85) {
        const randomQ = APP.content.questions[Math.floor(Math.random() * APP.content.questions.length)];
        if (!regularQuestions.find(q => q.id === randomQ.id)) {
            regularQuestions.push(randomQ);
        }
    }
    
    // Combine PBQs first (like real exam), then regular questions
    APP.state.quizQuestions = [...pbqs.map(p => ({...p, isPBQ: true})), ...regularQuestions];
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    APP.state.examStartTime = Date.now();
    APP.state.examTimeRemaining = 5400; // 90 minutes
    
    // Start timer
    startExamTimer();
    
    container.innerHTML = `
        <div class="exam-timer" id="examTimer">
            Time: 90:00
        </div>
        
        <div class="platform-container">
            <h1>CompTIA Security+ Practice Test</h1>
            <div class="alert alert-warning">
                <h3>📋 Exam Instructions</h3>
                <ul>
                    <li>90 questions total (5 PBQs + 85 multiple choice)</li>
                    <li>90 minutes time limit</li>
                    <li>Passing score: 750/900 (83%)</li>
                    <li>PBQs are presented first (like the real exam)</li>
                    <li>You can flag questions for review</li>
                </ul>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-warning" onclick="beginExam()">
                        Begin Exam
                    </button>
                </div>
            </div>
        </div>
    `;
}

function beginExam() {
    showExamQuestion();
}

function showExamQuestion() {
    const container = findContentContainer();
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    
    if (!question) {
        endPracticeTest();
        return;
    }
    
    if (question.isPBQ) {
        // Show PBQ
        container.innerHTML = `
            <div class="exam-timer" id="examTimer">
                Time: --:--
            </div>
            
            <div class="platform-container">
                <div class="pbq-container">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Question ${APP.state.currentQuestionIndex + 1} of 90 (PBQ)</span>
                        <button class="btn btn-warning btn-small" onclick="flagExamQuestion()">
                            🚩 Flag
                        </button>
                    </div>
                    
                    <h2>${question.title}</h2>
                    <p>${question.scenario}</p>
                    
                    ${renderPBQContent(question)}
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-secondary" onclick="previousExamQuestion()">
                            ← Previous
                        </button>
                        <button class="btn btn-primary" onclick="nextExamQuestion()">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Show regular question
        const isFlagged = APP.progress.flaggedQuestions.includes(question.id);
        
        container.innerHTML = `
            <div class="exam-timer" id="examTimer">
                Time: --:--
            </div>
            
            <div class="platform-container">
                <div class="quiz-container">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Question ${APP.state.currentQuestionIndex + 1} of 90</span>
                        <button class="btn ${isFlagged ? 'btn-danger' : 'btn-warning'} btn-small" 
                                onclick="flagExamQuestion()">
                            ${isFlagged ? '🚩 Flagged' : '🏳️ Flag'}
                        </button>
                    </div>
                    
                    <div class="question-text">
                        ${question.question}
                    </div>
                    
                    <div id="options">
                        ${question.options.map((opt, i) => `
                            <div class="option" id="opt-${i}" onclick="selectExamOption(${i})">
                                ${String.fromCharCode(65 + i)}. ${opt}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-secondary" onclick="previousExamQuestion()">
                            ← Previous
                        </button>
                        <button class="btn btn-primary" onclick="nextExamQuestion()">
                            Next →
                        </button>
                        <button class="btn btn-success" onclick="endPracticeTest()">
                            Submit Exam
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Restore selected answer if any
        if (question.selectedAnswer !== undefined) {
            selectExamOption(question.selectedAnswer);
        }
    }
}

function renderPBQContent(pbq) {
    if (pbq.type === 'drag-drop') {
        return `
            <div class="drag-area">
                <h3>Available Items</h3>
                ${pbq.items.map((item, i) => `
                    <div class="drag-item" draggable="true">
                        ${item}
                    </div>
                `).join('')}
            </div>
            <div class="drag-area">
                <h3>Your Answer</h3>
                <p>Drag items here in the correct order</p>
            </div>
        `;
    }
    return '<p>PBQ content here</p>';
}

function selectExamOption(index) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    document.getElementById(`opt-${index}`).classList.add('selected');
    
    // Store answer
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    question.selectedAnswer = index;
}

function nextExamQuestion() {
    APP.state.currentQuestionIndex++;
    showExamQuestion();
}

function previousExamQuestion() {
    if (APP.state.currentQuestionIndex > 0) {
        APP.state.currentQuestionIndex--;
        showExamQuestion();
    }
}

function flagExamQuestion() {
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    if (question && !question.isPBQ) {
        toggleFlag(question.id);
    }
    showExamQuestion();
}

function startExamTimer() {
    APP.state.examTimer = setInterval(() => {
        APP.state.examTimeRemaining--;
        
        const minutes = Math.floor(APP.state.examTimeRemaining / 60);
        const seconds = APP.state.examTimeRemaining % 60;
        
        const timerElement = document.getElementById('examTimer');
        if (timerElement) {
            timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (APP.state.examTimeRemaining < 600) { // Less than 10 minutes
                timerElement.classList.add('warning');
            }
        }
        
        if (APP.state.examTimeRemaining <= 0) {
            endPracticeTest();
        }
    }, 1000);
}

function endPracticeTest() {
    // Stop timer
    if (APP.state.examTimer) {
        clearInterval(APP.state.examTimer);
        APP.state.examTimer = null;
    }
    
    // Calculate score
    let correct = 0;
    let pbqScore = 0;
    
    APP.state.quizQuestions.forEach(q => {
        if (q.isPBQ) {
            // Simple PBQ scoring
            pbqScore += 10; // Assume partial credit
        } else if (q.selectedAnswer !== undefined) {
            const correctAnswer = q.correct || q.correct_answer || 0;
            if (q.selectedAnswer === correctAnswer) {
                correct++;
            }
        }
    });
    
    // CompTIA uses 100-900 scale
    const rawScore = ((correct / 85) * 800) + pbqScore;
    const scaledScore = Math.round(100 + rawScore);
    const passed = scaledScore >= 750;
    
    // Save score
    APP.progress.practiceExamScores.push(Math.round((correct / 85) * 100));
    if (APP.progress.practiceExamScores.length > 10) {
        APP.progress.practiceExamScores.shift();
    }
    saveProgress();
    
    // Show results
    const container = findContentContainer();
    container.innerHTML = `
        <div class="platform-container">
            <div class="quiz-container" style="text-align: center;">
                <h2>Practice Test Complete!</h2>
                
                <div class="stat-value" style="font-size: 5rem; margin: 30px; color: ${passed ? '#10b981' : '#ef4444'};">
                    ${scaledScore}/900
                </div>
                
                <div style="font-size: 2rem; margin: 20px; color: ${passed ? '#10b981' : '#ef4444'};">
                    ${passed ? '✅ PASSED' : '❌ FAILED'}
                </div>
                
                <p style="font-size: 1.2rem;">
                    You answered ${correct} out of 85 questions correctly<br>
                    Time used: ${90 - Math.floor(APP.state.examTimeRemaining / 60)} minutes
                </p>
                
                <div style="margin: 30px;">
                    ${passed ? `
                        <div class="alert alert-success">
                            <h3>🎉 Congratulations!</h3>
                            <p>You're ready for the Security+ exam!</p>
                        </div>
                    ` : `
                        <div class="alert alert-warning">
                            <h3>📚 Keep Studying</h3>
                            <p>You need 750 to pass. Review weak areas and try again.</p>
                        </div>
                    `}
                </div>
                
                <div>
                    <button class="btn" onclick="showView('dashboard')">
                        Back to Dashboard
                    </button>
                    <button class="btn btn-secondary" onclick="reviewExamAnswers()">
                        Review Answers
                    </button>
                    <button class="btn btn-warning" onclick="startPracticeTest()">
                        Retake Test
                    </button>
                </div>
            </div>
        </div>
    `;
}

function reviewExamAnswers() {
    alert('Answer review coming soon! This would show all questions with explanations.');
}

// Domain Quiz - 25 random questions
function startDomainQuiz(domainId) {
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const shuffled = domainQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 25);
    
    showView('quiz', { 
        questions: selected, 
        title: `Domain ${domainId} Quiz`,
        limit: 25 
    });
}

// Show Flagged Questions
function showFlaggedQuestions() {
    if (APP.progress.flaggedQuestions.length === 0) {
        alert('No flagged questions. Flag questions during quizzes to review them later.');
        return;
    }
    
    const flaggedQuestions = APP.content.questions.filter(q => 
        APP.progress.flaggedQuestions.includes(q.id)
    );
    
    showView('quiz', { 
        questions: flaggedQuestions,
        title: 'Flagged Questions Review'
    });
}

// Additional required functions (continue from previous...)
function showLessonViewer(container, lessonId) {
    const lesson = LESSON_TEMPLATES[Object.keys(LESSON_TEMPLATES).find(key => 
        LESSON_TEMPLATES[key].find(l => l.id === lessonId)
    )]?.find(l => l.id === lessonId);
    
    if (!lesson) return;
    
    APP.state.currentLesson = lessonId;
    
    container.innerHTML = `
        <div class="platform-container">
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
                        <p>This lesson covers essential concepts in ${lesson.title}.</p>
                    </div>
                    
                    <div id="concepts" class="lesson-section">
                        <h2>Key Concepts</h2>
                        ${generateLessonContent(lesson.title)}
                    </div>
                    
                    <div id="examples" class="lesson-section">
                        <h2>Real-World Examples</h2>
                        <p>Practical applications of these concepts in enterprise security.</p>
                    </div>
                    
                    <div id="practice" class="lesson-section">
                        <h2>Practice Scenarios</h2>
                        <button class="btn" onclick="startLessonPractice(${lesson.domain})">
                            Start Practice Questions
                        </button>
                    </div>
                    
                    <div id="quiz" class="lesson-section">
                        <h2>Lesson Quiz</h2>
                        <button class="btn btn-warning" onclick="startLessonQuiz(${lesson.domain})">
                            Take Lesson Quiz (5 Questions)
                        </button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-success" onclick="completeLesson('${lessonId}')">
                            ✓ Mark Lesson Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Continue with other view functions...
function showQuiz(container, params) {
    const questions = params.questions || APP.content.questions;
    const title = params.title || 'Practice Quiz';
    const limit = params.limit || 50;
    
    APP.state.quizQuestions = questions.slice(0, limit);
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    
    container.innerHTML = `
        <div class="platform-container">
            <h2>${title}</h2>
            <p>${APP.state.quizQuestions.length} questions</p>
            <div id="quizContent">
                <!-- Quiz will load here -->
            </div>
        </div>
    `;
    
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('quizContent') || findContentContainer();
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    
    if (!question) {
        showQuizResults(container);
        return;
    }
    
    const isFlagged = APP.progress.flaggedQuestions.includes(question.id);
    
    container.innerHTML = `
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
    `;
}

// Helper functions
function generateLessonContent(title) {
    const content = {
        'CIA Triad Fundamentals': `
            <h3>Confidentiality</h3>
            <p>Protecting information from unauthorized access.</p>
            <ul>
                <li>Encryption (AES-256, RSA)</li>
                <li>Access controls (RBAC, MAC, DAC)</li>
                <li>Data classification</li>
            </ul>
            
            <h3>Integrity</h3>
            <p>Ensuring data accuracy and preventing unauthorized modification.</p>
            <ul>
                <li>Hashing (SHA-256, SHA-512)</li>
                <li>Digital signatures</li>
                <li>Version control</li>
            </ul>
            
            <h3>Availability</h3>
            <p>Ensuring authorized users can access resources when needed.</p>
            <ul>
                <li>Redundancy and failover</li>
                <li>Backup strategies</li>
                <li>DDoS protection</li>
            </ul>
        `
    };
    
    return content[title] || '<p>Comprehensive lesson content for this topic.</p>';
}

// Continue with remaining functions
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
    
    document.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));
    
    if (isCorrect) {
        APP.state.score++;
        document.getElementById(`opt-${APP.state.selectedOption}`).classList.add('correct');
    } else {
        document.getElementById(`opt-${APP.state.selectedOption}`).classList.add('incorrect');
        document.getElementById(`opt-${correct}`).classList.add('correct');
        
        if (!APP.progress.wrongAnswers.find(w => w.id === question.id)) {
            APP.progress.wrongAnswers.push({
                id: question.id,
                domain: question.domain
            });
        }
    }
    
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
    
    if (!APP.progress.completedQuestions.find(q => q.id === question.id)) {
        APP.progress.completedQuestions.push({
            id: question.id,
            correct: isCorrect,
            domain: question.domain
        });
    }
    
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
    
    const html = `
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
                        <p>You've mastered this material!</p>
                    </div>
                ` : `
                    <div class="alert alert-warning">
                        <h3>📚 Keep Studying</h3>
                        <p>You need 85% to pass. Review and try again.</p>
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
            </div>
        </div>
    `;
    
    if (container.id === 'quizContent') {
        container.innerHTML = html;
    } else {
        container.innerHTML = `<div class="platform-container">${html}</div>`;
    }
    
    saveProgress();
}

// Implement remaining view functions (simulations, flashcards, etc.)
function showSimulations(container, domainId) {
    const simulations = domainId 
        ? APP.content.simulations.filter(s => s.domain === domainId)
        : APP.content.simulations;
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>🎮 Simulations ${domainId ? `- Domain ${domainId}` : '(All Domains)'}</h1>
            <p>${simulations.length} interactive scenarios available</p>
            
            <div class="domain-grid-plus">
                ${simulations.slice(0, 30).map(sim => `
                    <div class="domain-card">
                        <h3>${sim.title}</h3>
                        <p style="color: #a1a1aa;">${sim.scenario || 'Interactive scenario'}</p>
                        <button class="btn" onclick="alert('Simulation player coming soon!')">
                            Start Simulation
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showFlashCards(container, domainId) {
    const questions = domainId 
        ? APP.content.questions.filter(q => q.domain === domainId)
        : APP.content.questions;
    
    const currentCard = questions[APP.state.currentFlashCardIndex % questions.length];
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>🎴 Flash Cards - Domain ${domainId || 'All'}</h1>
            
            <div class="flashcard-container">
                <div class="flashcard" id="flashcard" onclick="flipCard()">
                    <div class="flashcard-face">
                        <h3>${currentCard.question}</h3>
                        <p style="color: #a1a1aa; margin-top: 20px;">Click to reveal answer</p>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <p><strong>Answer:</strong> ${currentCard.options[currentCard.correct || 0]}</p>
                        <p>${currentCard.explanation || ''}</p>
                    </div>
                </div>
            </div>
            
            <div class="flashcard-controls">
                <button class="btn btn-secondary" onclick="previousCard(${domainId})">← Previous</button>
                <span>Card ${(APP.state.currentFlashCardIndex % questions.length) + 1} of ${questions.length}</span>
                <button class="btn btn-secondary" onclick="nextCard(${domainId})">Next →</button>
            </div>
        </div>
    `;
}

function showRemedial(container, domainId) {
    const weakAreas = identifyWeakAreas();
    const wrongQuestions = APP.progress.wrongAnswers;
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>🔧 Remedial Study</h1>
            
            <div class="alert alert-warning">
                <h3>Your Weak Areas</h3>
                ${weakAreas.length > 0 ? 
                    `<p>Focus on: ${weakAreas.map(d => `Domain ${d}`).join(', ')}</p>` :
                    '<p>No significant weak areas detected.</p>'
                }
            </div>
            
            <div class="learning-menu">
                <div class="menu-item" onclick="practiceWrongAnswers()">
                    <div style="font-size: 2rem;">❌</div>
                    <h3>Wrong Answers</h3>
                    <p>${wrongQuestions.length} to review</p>
                </div>
                
                <div class="menu-item" onclick="practiceFlagged()">
                    <div style="font-size: 2rem;">🚩</div>
                    <h3>Flagged Questions</h3>
                    <p>${APP.progress.flaggedQuestions.length} flagged</p>
                </div>
                
                <div class="menu-item" onclick="startFocusedPractice()">
                    <div style="font-size: 2rem;">🎯</div>
                    <h3>Focused Practice</h3>
                    <p>Target weak domains</p>
                </div>
            </div>
        </div>
    `;
}

function showPBQ(container, domainId) {
    const pbqs = domainId 
        ? APP.content.pbqs.filter(p => p.domain === domainId)
        : APP.content.pbqs;
    
    if (pbqs.length === 0) {
        container.innerHTML = `
            <div class="platform-container">
                <h1>📊 Performance-Based Questions</h1>
                <p>No PBQs available for this domain.</p>
            </div>
        `;
        return;
    }
    
    const pbq = pbqs[0];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="pbq-container">
                <h1>${pbq.title}</h1>
                <p>${pbq.scenario}</p>
                ${renderPBQContent(pbq)}
                <button class="btn btn-success" onclick="alert('PBQ checking coming soon!')">
                    Check Answer
                </button>
            </div>
        </div>
    `;
}

function showGlossary(container, domainId) {
    const terms = APP.content.glossary[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>📖 Glossary - Domain ${domainId}</h1>
            
            <div style="display: grid; gap: 15px;">
                ${terms.map(term => `
                    <div style="background: #18181b; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #6366f1;">${term.term}</h3>
                        <p>${term.definition}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showSimulationPlayer(container, simId) {
    alert('Simulation player coming soon!');
}

function showDomainAnalytics(domainId) {
    const stats = getDomainStats(domainId);
    const container = findContentContainer();
    
    container.innerHTML = `
        <div class="platform-container">
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
        </div>
    `;
}

// Utility functions
function toggleFlag(questionId) {
    const index = APP.progress.flaggedQuestions.indexOf(questionId);
    
    if (index > -1) {
        APP.progress.flaggedQuestions.splice(index, 1);
    } else {
        APP.progress.flaggedQuestions.push(questionId);
    }
    
    saveProgress();
    updateFlaggedCount();
}

function updateFlaggedCount() {
    const count = document.getElementById('flaggedCount');
    if (count) count.textContent = APP.progress.flaggedQuestions.length;
}

function completeLesson(lessonId) {
    if (!APP.progress.completedLessons.includes(lessonId)) {
        APP.progress.completedLessons.push(lessonId);
        saveProgress();
        alert('Lesson marked as complete!');
    }
}

function startLessonQuiz(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    const shuffled = questions.sort(() => Math.random() - 0.5);
    showView('quiz', { 
        questions: shuffled.slice(0, 5),
        title: 'Lesson Quiz',
        limit: 5
    });
}

function startLessonPractice(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    const shuffled = questions.sort(() => Math.random() - 0.5);
    showView('quiz', { 
        questions: shuffled.slice(0, 10),
        title: 'Practice Questions',
        limit: 10
    });
}

function practiceWrongAnswers() {
    const wrongIds = APP.progress.wrongAnswers.map(w => w.id);
    const questions = APP.content.questions.filter(q => wrongIds.includes(q.id));
    
    if (questions.length === 0) {
        alert('No wrong answers to practice!');
        return;
    }
    
    showView('quiz', { 
        questions,
        title: 'Wrong Answer Review'
    });
}

function practiceFlagged() {
    const questions = APP.content.questions.filter(q => 
        APP.progress.flaggedQuestions.includes(q.id)
    );
    
    if (questions.length === 0) {
        alert('No flagged questions!');
        return;
    }
    
    showView('quiz', { 
        questions,
        title: 'Flagged Questions Review'
    });
}

function startFocusedPractice() {
    const weakAreas = identifyWeakAreas();
    if (weakAreas.length === 0) {
        alert('No weak areas identified!');
        return;
    }
    
    const questions = APP.content.questions.filter(q => weakAreas.includes(q.domain));
    showView('quiz', { 
        questions: questions.sort(() => Math.random() - 0.5).slice(0, 30),
        title: 'Focused Practice',
        limit: 30
    });
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

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        
        document.querySelectorAll('.lesson-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.classList.add('active');
    }
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
        const domainWrong = APP.progress.wrongAnswers.filter(w => w.domain === domain.id);
        if (domainWrong.length >= 5) {
            weakDomains.push(domain.id);
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
            APP.state.currentFlashCardIndex = state.currentFlashCardIndex || 0;
        }
    } catch (e) {
        console.error('Could not load progress:', e);
    }
}

// Global functions
window.showView = showView;
window.selectOption = selectOption;
window.selectExamOption = selectExamOption;
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.nextExamQuestion = nextExamQuestion;
window.previousExamQuestion = previousExamQuestion;
window.flagExamQuestion = flagExamQuestion;
window.startDomainQuiz = startDomainQuiz;
window.startLessonQuiz = startLessonQuiz;
window.startLessonPractice = startLessonPractice;
window.startPracticeTest = startPracticeTest;
window.beginExam = beginExam;
window.endPracticeTest = endPracticeTest;
window.reviewExamAnswers = reviewExamAnswers;
window.practiceWrongAnswers = practiceWrongAnswers;
window.practiceFlagged = practiceFlagged;
window.startFocusedPractice = startFocusedPractice;
window.showFlaggedQuestions = showFlaggedQuestions;
window.toggleFlag = toggleFlag;
window.completeLesson = completeLesson;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.previousCard = previousCard;
window.showGlossary = showGlossary;
window.showDomainAnalytics = showDomainAnalytics;
window.scrollToSection = scrollToSection;

console.log('Security+ Platform v14 Enhanced ready!');
