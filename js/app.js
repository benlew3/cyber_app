// Security+ Platform v12 - Production Version
// Based on the working emergency fix, now with full features

console.log('Security+ Platform v12 starting...');

// Global state
const APP = {
    version: '12.0',
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
        currentQuestionIndex: 0,
        score: 0,
        quizQuestions: []
    },
    progress: {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: []
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

// Initialize when page loads
window.addEventListener('load', async () => {
    console.log('Page loaded, initializing platform...');
    
    // Load data files
    await loadDataFiles();
    
    // Force hide loading screens
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
        // Load questions
        const qResponse = await fetch('data/questions.json');
        APP.content.questions = await qResponse.json();
        console.log(`✓ Loaded ${APP.content.questions.length} questions`);
        
        // Load simulations
        const sResponse = await fetch('data/simulations.json');
        APP.content.simulations = await sResponse.json();
        console.log(`✓ Loaded ${APP.content.simulations.length} simulations`);
        
        // Load other files (optional)
        try {
            const lResponse = await fetch('data/lessons.json');
            APP.content.lessons = await lResponse.json();
        } catch (e) { console.log('Lessons file optional'); }
        
        try {
            const pResponse = await fetch('data/pbqs.json');
            APP.content.pbqs = await pResponse.json();
        } catch (e) { console.log('PBQs file optional'); }
        
        try {
            const gResponse = await fetch('data/glossary.json');
            APP.content.glossary = await gResponse.json();
        } catch (e) { console.log('Glossary file optional'); }
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Hide any loading screens
function hideLoadingScreens() {
    // Hide anything that might be a loading screen
    const selectors = [
        '#loading', '#loading-screen', '#loadingScreen', '.loading-screen',
        '[id*="loading"]', '[class*="loading"]'
    ];
    
    selectors.forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(elem => {
                if (elem && elem.textContent && elem.textContent.includes('Loading')) {
                    elem.style.display = 'none';
                }
            });
        } catch (e) {}
    });
    
    // Show main containers
    ['#mainApp', '#main-app', '#app', 'main'].forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(elem => {
                elem.style.display = 'block';
            });
        } catch (e) {}
    });
}

// Initialize the platform interface
function initializePlatform() {
    console.log('Initializing platform interface...');
    
    // Find the main container
    const container = findContentContainer();
    
    if (!container) {
        console.error('No container found!');
        return;
    }
    
    // Add styles
    injectStyles();
    
    // Load saved progress
    loadProgress();
    
    // Show dashboard
    showView('dashboard');
}

// Find the best container for our content
function findContentContainer() {
    return document.getElementById('content') ||
           document.getElementById('main-content') ||
           document.querySelector('main') ||
           document.querySelector('.content') ||
           document.querySelector('#mainApp') ||
           document.querySelector('.main-content') ||
           document.querySelector('[id*="content"]') ||
           document.body;
}

// Inject necessary styles
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
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
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 30px;
        }
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
        .domain-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
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
        .nav-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
    `;
    document.head.appendChild(style);
}

// Show different views
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
        case 'quiz':
            showQuiz(container, params);
            break;
        case 'simulations':
            showSimulations(container, params.domainId);
            break;
        default:
            showDashboard(container);
    }
}

// Show main dashboard
function showDashboard(container) {
    const stats = calculateStats();
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="platform-header">Security+ Training Platform</h1>
            
            <div class="nav-bar">
                <button class="btn" onclick="showView('dashboard')">🏠 Dashboard</button>
                <button class="btn btn-secondary" onclick="startPracticeExam()">📋 Practice Exam</button>
                <button class="btn btn-secondary" onclick="showAllSimulations()">🎮 All Simulations</button>
            </div>
            
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
            </div>
            
            <h2>Select a Domain to Study:</h2>
            
            <div class="domain-grid">
                ${DOMAINS.map(domain => `
                    <div class="domain-card" style="--color: ${domain.color};" 
                         onclick="showView('domain-menu', {domainId: ${domain.id}})">
                        <div class="domain-icon">${domain.icon}</div>
                        <h3>Domain ${domain.id}</h3>
                        <p><strong>${domain.name}</strong></p>
                        <p style="color: #a1a1aa;">Weight: ${(domain.weight * 100).toFixed(0)}% of exam</p>
                        <p style="color: #a1a1aa;">
                            ${APP.content.questions.filter(q => q.domain === domain.id).length} questions
                        </p>
                        <button class="btn" onclick="event.stopPropagation(); showView('domain-menu', {domainId: ${domain.id}})">
                            Open Learning Menu
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show domain learning menu
function showDomainMenu(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const domainSims = APP.content.simulations.filter(s => s.domain === domainId);
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('dashboard')">← Back to Dashboard</button>
            </div>
            
            <h1 style="color: ${domain.color};">
                ${domain.icon} Domain ${domain.id}: ${domain.name}
            </h1>
            <p>Choose your learning activity:</p>
            
            <div class="learning-menu">
                <div class="menu-item" onclick="showView('simulations', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">🎮</div>
                    <h3>Simulations</h3>
                    <p>${domainSims.length} scenarios</p>
                </div>
                
                <div class="menu-item" onclick="alert('Lessons coming soon!')">
                    <div style="font-size: 2rem;">📚</div>
                    <h3>Lesson Guides</h3>
                    <p>Structured learning</p>
                </div>
                
                <div class="menu-item" onclick="startDomainQuiz(${domainId})">
                    <div style="font-size: 2rem;">📝</div>
                    <h3>Main Quiz</h3>
                    <p>${domainQuestions.length} questions</p>
                </div>
                
                <div class="menu-item" onclick="alert('Remedial coming soon!')">
                    <div style="font-size: 2rem;">🔧</div>
                    <h3>Remedial Study</h3>
                    <p>Weak areas</p>
                </div>
                
                <div class="menu-item" onclick="alert('PBQs coming soon!')">
                    <div style="font-size: 2rem;">📊</div>
                    <h3>PBQs</h3>
                    <p>Performance tasks</p>
                </div>
                
                <div class="menu-item" onclick="alert('Flash cards coming soon!')">
                    <div style="font-size: 2rem;">🎴</div>
                    <h3>Flash Cards</h3>
                    <p>Quick review</p>
                </div>
                
                <div class="menu-item" onclick="showGlossary(${domainId})">
                    <div style="font-size: 2rem;">📖</div>
                    <h3>Glossary</h3>
                    <p>Key terms</p>
                </div>
            </div>
        </div>
    `;
}

// Show quiz
function showQuiz(container, params) {
    const questions = params.questions || APP.content.questions;
    APP.state.quizQuestions = questions.slice(0, 50); // Limit to 50
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    
    showQuestion(container);
}

// Show current question
function showQuestion(container) {
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    if (!question) {
        showQuizResults(container);
        return;
    }
    
    container = container || findContentContainer();
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="quiz-container">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <span>Question ${APP.state.currentQuestionIndex + 1} of ${APP.state.quizQuestions.length}</span>
                    <span>Score: ${APP.state.score}</span>
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
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn" id="submitBtn" onclick="submitAnswer()">
                        Submit Answer
                    </button>
                    <button class="btn btn-secondary" onclick="showView('dashboard')">
                        Exit Quiz
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Show simulations
function showSimulations(container, domainId) {
    const simulations = domainId 
        ? APP.content.simulations.filter(s => s.domain === domainId)
        : APP.content.simulations;
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('dashboard')">← Back</button>
            </div>
            
            <h1>🎮 Simulations ${domainId ? `- Domain ${domainId}` : ''}</h1>
            <p>${simulations.length} simulations available</p>
            
            <div class="domain-grid">
                ${simulations.slice(0, 20).map(sim => `
                    <div class="domain-card">
                        <h3>${sim.title}</h3>
                        <p style="color: #a1a1aa;">${sim.scenario || 'Interactive scenario'}</p>
                        <button class="btn" onclick="alert('Simulation: ${sim.title}')">
                            Start Simulation
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show quiz results
function showQuizResults(container) {
    const percentage = Math.round((APP.state.score / APP.state.quizQuestions.length) * 100);
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="quiz-container" style="text-align: center;">
                <h2>Quiz Complete!</h2>
                <div class="stat-value" style="font-size: 3rem; margin: 20px;">
                    ${percentage}%
                </div>
                <p>You scored ${APP.state.score} out of ${APP.state.quizQuestions.length}</p>
                <button class="btn" onclick="showView('dashboard')">
                    Back to Dashboard
                </button>
            </div>
        </div>
    `;
    
    saveProgress();
}

// Show glossary
function showGlossary(domainId) {
    const container = findContentContainer();
    const terms = APP.content.glossary[domainId] || [];
    
    container.innerHTML = `
        <div class="platform-container">
            <div class="nav-bar">
                <button class="btn btn-secondary" onclick="showView('domain-menu', {domainId: ${domainId}})">
                    ← Back
                </button>
            </div>
            
            <h1>📖 Glossary - Domain ${domainId}</h1>
            
            <div style="display: grid; gap: 15px; margin-top: 20px;">
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

// Quiz functions
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
    
    if (APP.state.selectedOption === correct) {
        APP.state.score++;
        document.getElementById(`opt-${APP.state.selectedOption}`).classList.add('correct');
    } else {
        document.getElementById(`opt-${APP.state.selectedOption}`).classList.add('incorrect');
        document.getElementById(`opt-${correct}`).classList.add('correct');
    }
    
    setTimeout(() => {
        APP.state.currentQuestionIndex++;
        APP.state.selectedOption = undefined;
        showQuestion();
    }, 1500);
}

// Helper functions
function startDomainQuiz(domainId) {
    const questions = APP.content.questions.filter(q => q.domain === domainId);
    showView('quiz', { questions });
}

function startPracticeExam() {
    alert('Practice exam: 90 questions, 90 minutes\nComing soon!');
}

function showAllSimulations() {
    showView('simulations');
}

function calculateStats() {
    const completed = APP.progress.completedQuestions.length;
    const correct = APP.progress.completedQuestions.filter(q => q.correct).length;
    
    return {
        completed: completed,
        accuracy: completed > 0 ? Math.round((correct / completed) * 100) : 0
    };
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('securityPlusProgress');
        if (saved) {
            APP.progress = JSON.parse(saved);
        }
    } catch (e) {}
}

function saveProgress() {
    try {
        localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
    } catch (e) {}
}

// Global functions
window.showView = showView;
window.selectOption = selectOption;
window.submitAnswer = submitAnswer;
window.startDomainQuiz = startDomainQuiz;
window.startPracticeExam = startPracticeExam;
window.showAllSimulations = showAllSimulations;
window.showGlossary = showGlossary;

console.log('Platform v12 ready!');
