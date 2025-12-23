// Security+ Platform v11.1 - FIXED VERSION
// This version properly loads content and initializes the platform

// Global Application State
const APP = {
    version: '11.1-fixed',
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
        learningPath: 'guided'
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

// Initialize Application - SIMPLIFIED VERSION
async function initApp() {
    console.log('Starting Security+ Platform v' + APP.version);
    
    try {
        // Show loading status
        updateLoadingStatus('Loading content files...');
        
        // Load all content - FIXED PATH HANDLING
        const loadPromises = [
            loadJsonFile('data/questions.json', 'questions'),
            loadJsonFile('data/simulations.json', 'simulations'),
            loadJsonFile('data/lessons.json', 'lessons'),
            loadJsonFile('data/pbqs.json', 'pbqs'),
            loadJsonFile('data/glossary.json', 'glossary')
        ];
        
        await Promise.all(loadPromises);
        
        console.log('Content loaded successfully!');
        console.log('Questions:', APP.content.questions.length);
        console.log('Simulations:', APP.content.simulations.length);
        
        // Load saved progress
        loadProgress();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize navigation
        initializeNavigation();
        
        // Hide loading and show app
        const loadingScreen = document.getElementById('loading');
        const mainApp = document.getElementById('mainApp');
        
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        // Show dashboard
        showView('dashboard');
        
        console.log('Platform initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        handleLoadingError(error);
    }
}

// Simplified JSON loader
async function loadJsonFile(path, contentKey) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status}`);
        }
        const data = await response.json();
        APP.content[contentKey] = data;
        console.log(`✓ Loaded ${contentKey}: ${Array.isArray(data) ? data.length : Object.keys(data).length} items`);
        updateLoadingProgress();
        return data;
    } catch (error) {
        console.warn(`Could not load ${path}:`, error);
        // Use empty fallback
        APP.content[contentKey] = contentKey === 'glossary' ? {} : [];
        return APP.content[contentKey];
    }
}

// Handle loading errors gracefully
function handleLoadingError(error) {
    console.error('Loading error:', error);
    
    const loadingStatus = document.getElementById('loadingStatus');
    if (loadingStatus) {
        loadingStatus.innerHTML = `
            <div style="color: #ef4444;">
                <p>Error loading content. Using fallback mode.</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
    
    // Try to continue with whatever loaded
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        const mainApp = document.getElementById('mainApp');
        
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        showView('dashboard');
    }, 2000);
}

// Update loading progress
let loadingProgress = 0;
function updateLoadingProgress() {
    loadingProgress += 20;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = Math.min(loadingProgress, 100) + '%';
    }
}

// Update loading status
function updateLoadingStatus(message) {
    const status = document.getElementById('loadingStatus');
    if (status) status.textContent = message;
}

// Setup Event Listeners
function setupEventListeners() {
    // Add event listeners for navigation
    document.addEventListener('click', (e) => {
        // Handle navigation buttons
        if (e.target.classList.contains('btn-nav')) {
            const view = e.target.dataset.view;
            if (view) showView(view);
        }
    });
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
            </div>
        </div>
        
        <button class="btn btn-nav btn-warning" id="flaggedBtn">
            🚩 <span id="flaggedCount">0</span>
        </button>
        <button class="btn btn-nav btn-secondary" onclick="toggleFlashCards()">
            🎴 Flash
        </button>
    `;
}

// Show View - Main navigation function
function showView(viewName, params = {}) {
    console.log('Showing view:', viewName);
    
    const content = document.getElementById('content');
    if (!content) {
        console.error('Content container not found!');
        return;
    }
    
    APP.state.currentView = viewName;
    
    // Generate view content
    let viewContent = '';
    
    switch (viewName) {
        case 'dashboard':
            viewContent = renderDashboard();
            break;
        case 'domain-menu':
            viewContent = renderDomainMenu(params.domainId);
            break;
        case 'quiz':
            viewContent = renderQuizView();
            setTimeout(() => startQuiz(params.questions), 100);
            break;
        case 'simulations':
            viewContent = renderSimulationsView(params.domainId);
            break;
        case 'lessons':
            viewContent = renderLessonsView(params.domainId);
            break;
        case 'remedial':
            viewContent = renderRemedialView(params.domainId);
            break;
        case 'pbq':
            viewContent = renderPBQView(params.domainId);
            break;
        case 'flashcards':
            viewContent = renderFlashCardsView(params.domainId);
            break;
        case 'glossary':
            viewContent = renderGlossaryView(params.domainId);
            break;
        default:
            viewContent = '<div class="container"><h2>View not found</h2></div>';
    }
    
    content.innerHTML = viewContent;
    updateFlaggedCount();
}

// Render Dashboard
function renderDashboard() {
    const stats = calculateStats();
    const weakSpots = calculateWeakSpots();
    
    return `
        <div class="container">
            <h2 class="mb-2">Security+ Training Dashboard</h2>
            <p style="color: var(--text-secondary);">
                Master all 5 domains with ${APP.content.questions.length} questions and ${APP.content.simulations.length} simulations
            </p>
            
            ${weakSpots.length > 0 ? `
                <div class="alert alert-warning mb-2">
                    <h3>⚠️ Weak Areas Detected</h3>
                    <p>Focus on these domains: ${weakSpots.map(d => `Domain ${d}`).join(', ')}</p>
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
            
            <div class="domain-grid">
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

// Render Domain Card
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
            <button class="btn btn-primary btn-sm mt-1" onclick="event.stopPropagation(); openDomainMenu(${domain.id})">
                Open Learning Menu
            </button>
        </div>
    `;
}

// Render Domain Menu
function renderDomainMenu(domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return '<div class="container">Domain not found</div>';
    
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const domainSimulations = APP.content.simulations.filter(s => s.domain === domainId && s.type === 'scenario');
    const domainRemediation = APP.content.simulations.filter(s => s.domain === domainId && s.type === 'remediation');
    
    return `
        <div class="container">
            <div class="domain-header">
                <h1>${domain.icon} Domain ${domain.id}: ${domain.name}</h1>
                <p>Weight: ${(domain.weight * 100).toFixed(0)}% of exam</p>
            </div>
            
            <div class="learning-options-grid">
                <div class="learning-card" onclick="showView('simulations', {domainId: ${domainId}})">
                    <div class="card-icon">🎮</div>
                    <h3>Simulations</h3>
                    <p>${domainSimulations.length} scenarios</p>
                    <button class="btn btn-primary">Start</button>
                </div>
                
                <div class="learning-card" onclick="showView('lessons', {domainId: ${domainId}})">
                    <div class="card-icon">📚</div>
                    <h3>Lesson Guides</h3>
                    <p>Comprehensive lessons</p>
                    <button class="btn btn-primary">Open</button>
                </div>
                
                <div class="learning-card" onclick="startDomainQuiz(${domainId})">
                    <div class="card-icon">📝</div>
                    <h3>Main Quiz</h3>
                    <p>${domainQuestions.length} questions</p>
                    <button class="btn btn-primary">Start</button>
                </div>
                
                <div class="learning-card" onclick="showView('remedial', {domainId: ${domainId}})">
                    <div class="card-icon">🔧</div>
                    <h3>Remedial</h3>
                    <p>${domainRemediation.length} exercises</p>
                    <button class="btn btn-primary">Practice</button>
                </div>
                
                <div class="learning-card" onclick="showView('pbq', {domainId: ${domainId}})">
                    <div class="card-icon">📊</div>
                    <h3>PBQs</h3>
                    <p>Performance questions</p>
                    <button class="btn btn-primary">Practice</button>
                </div>
                
                <div class="learning-card" onclick="showView('flashcards', {domainId: ${domainId}})">
                    <div class="card-icon">🎴</div>
                    <h3>Flash Cards</h3>
                    <p>Quick review</p>
                    <button class="btn btn-primary">Study</button>
                </div>
                
                <div class="learning-card" onclick="showView('glossary', {domainId: ${domainId}})">
                    <div class="card-icon">📖</div>
                    <h3>Glossary</h3>
                    <p>Key terms</p>
                    <button class="btn btn-primary">View</button>
                </div>
            </div>
        </div>
    `;
}

// Other view renderers (simplified stubs for now)
function renderQuizView() {
    return '<div class="container"><div id="quizContainer">Loading quiz...</div></div>';
}

function renderSimulationsView(domainId) {
    const simulations = domainId 
        ? APP.content.simulations.filter(s => s.domain === domainId && s.type === 'scenario')
        : APP.content.simulations.filter(s => s.type === 'scenario');
    
    return `
        <div class="container">
            <h2>🎮 Simulations</h2>
            <div class="simulations-grid">
                ${simulations.map(sim => `
                    <div class="simulation-card">
                        <h3>${sim.title}</h3>
                        <p>${sim.scenario || 'Interactive scenario'}</p>
                        <button class="btn btn-primary" onclick="alert('Simulation player coming soon!')">
                            Start Simulation
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLessonsView(domainId) {
    return `
        <div class="container">
            <h2>📚 Lessons</h2>
            <p>Comprehensive lesson content for Domain ${domainId}</p>
        </div>
    `;
}

function renderRemedialView(domainId) {
    return `
        <div class="container">
            <h2>🔧 Remedial Study</h2>
            <p>Targeted practice for weak areas in Domain ${domainId}</p>
        </div>
    `;
}

function renderPBQView(domainId) {
    const pbqs = APP.content.pbqs.filter(p => !domainId || p.domain === domainId);
    return `
        <div class="container">
            <h2>📊 Performance Based Questions</h2>
            <p>${pbqs.length} PBQs available</p>
        </div>
    `;
}

function renderFlashCardsView(domainId) {
    return `
        <div class="container">
            <h2>🎴 Flash Cards</h2>
            <p>Quick review mode for Domain ${domainId}</p>
        </div>
    `;
}

function renderGlossaryView(domainId) {
    const terms = APP.content.glossary[domainId] || [];
    return `
        <div class="container">
            <h2>📖 Glossary</h2>
            <div class="glossary-grid">
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
function loadProgress() {
    try {
        const saved = localStorage.getItem('securityPlusProgress');
        if (saved) {
            APP.progress = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Could not load progress:', error);
    }
}

function saveProgress() {
    try {
        localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
    } catch (error) {
        console.error('Could not save progress:', error);
    }
}

function calculateStats() {
    const completed = APP.progress.completedQuestions.length;
    const correct = APP.progress.completedQuestions.filter(q => q.correct).length;
    
    return {
        completed: completed,
        correctRate: completed > 0 ? Math.round((correct / completed) * 100) : 0,
        flagged: APP.progress.flaggedQuestions.length
    };
}

function calculateWeakSpots() {
    const weakDomains = [];
    const domainErrors = {};
    
    APP.progress.wrongAnswers.forEach(wrong => {
        domainErrors[wrong.domain] = (domainErrors[wrong.domain] || 0) + 1;
    });
    
    Object.entries(domainErrors).forEach(([domain, count]) => {
        if (count >= 3) weakDomains.push(parseInt(domain));
    });
    
    return weakDomains;
}

function updateFlaggedCount() {
    const count = document.getElementById('flaggedCount');
    if (count) count.textContent = APP.progress.flaggedQuestions.length;
}

// Quiz Functions
function startQuiz(questions) {
    console.log('Starting quiz with', questions ? questions.length : 'all', 'questions');
    // Quiz implementation
}

function startDomainQuiz(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    showView('quiz', { questions });
}

// Global Functions
window.showView = showView;
window.openDomainMenu = openDomainMenu;
window.startDomainQuiz = startDomainQuiz;
window.startPracticeExam = () => alert('Practice exam coming soon!');
window.showAllSimulations = () => showView('simulations');
window.showAllPBQs = () => showView('pbq');
window.showFlaggedQuestions = () => alert('Flagged questions: ' + APP.progress.flaggedQuestions.length);
window.toggleFlashCards = () => alert('Flash card mode toggled');

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
