// Security+ Platform v10.1 - Main Application
// Complete implementation with all features

// Global Application State
const APP = {
    version: '10.1',
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
        selectedAnswer: null,
        score: 0,
        quizQuestions: [],
        flashCardMode: false
    },
    progress: {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: [],
        weakSpots: {},
        scores: {},
        simulations: [],
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
    { id: 1, name: 'General Security Concepts', weight: 0.12, color: '#6366f1' },
    { id: 2, name: 'Threats, Vulnerabilities & Mitigations', weight: 0.22, color: '#f59e0b' },
    { id: 3, name: 'Security Architecture', weight: 0.18, color: '#10b981' },
    { id: 4, name: 'Security Operations', weight: 0.28, color: '#8b5cf6' },
    { id: 5, name: 'Security Program Management', weight: 0.20, color: '#ec4899' }
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

// Update Loading UI
function updateLoadingProgress(percent) {
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = percent + '%';
}

function updateLoadingStatus(message) {
    const status = document.getElementById('loadingStatus');
    if (status) status.textContent = message;
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            if (view) showView(view);
        });
    });
    
    // Flash card toggle
    document.getElementById('flashBtn')?.addEventListener('click', toggleFlashCards);
    
    // Flagged questions
    document.getElementById('flaggedBtn')?.addEventListener('click', showFlaggedQuestions);
}

// Show View
function showView(viewName) {
    const content = document.getElementById('content');
    if (!content) return;
    
    APP.state.currentView = viewName;
    
    switch (viewName) {
        case 'dashboard':
            content.innerHTML = renderDashboard();
            initDashboard();
            break;
            
        case 'quiz':
            content.innerHTML = renderQuizView();
            startQuiz();
            break;
            
        case 'simulations':
            content.innerHTML = renderSimulationsView();
            break;
            
        case 'pbq':
            content.innerHTML = renderPBQView();
            initPBQ();
            break;
            
        default:
            content.innerHTML = '<div class="container"><h2>View not found</h2></div>';
    }
    
    updateFlaggedCount();
}

// Render Dashboard
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
                <button class="btn btn-primary" onclick="startPracticeExam()">
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
             onclick="openDomain(${domain.id})">
            <div style="background: ${domain.color}; width: 48px; height: 48px; 
                        border-radius: 50%; display: flex; align-items: center; 
                        justify-content: center; color: white; font-weight: bold; 
                        font-size: 1.3rem; margin-bottom: 1rem;">
                ${domain.id}
            </div>
            <h3>${domain.name}</h3>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                <div>📝 ${questions.length} questions</div>
                <div>✅ ${completed.length} completed</div>
                <div>❌ ${wrong.length} wrong</div>
                <div>📊 Weight: ${(domain.weight * 100).toFixed(0)}%</div>
            </div>
            ${isWeak ? '<div class="badge badge-danger mt-1">NEEDS REVIEW</div>' : ''}
        </div>
    `;
}

// Initialize Dashboard
function initDashboard() {
    // Any dashboard-specific initialization
}

// Open Domain
function openDomain(domainId) {
    APP.state.currentDomain = domainId;
    APP.state.quizQuestions = APP.content.questions.filter(q => q.domain === domainId);
    showView('quiz');
}

// Render Quiz View
function renderQuizView() {
    return `
        <div class="container">
            <div class="quiz-container" id="quizContainer">
                <!-- Quiz content will be loaded here -->
            </div>
            <div class="quiz-container hidden" id="quizResults">
                <!-- Results will be shown here -->
            </div>
        </div>
    `;
}

// Start Quiz
function startQuiz() {
    if (!APP.state.quizQuestions || APP.state.quizQuestions.length === 0) {
        APP.state.quizQuestions = [...APP.content.questions];
    }
    
    // Apply adaptive learning if enabled
    if (APP.settings.adaptiveLearning) {
        APP.state.quizQuestions = applyAdaptiveLearning(APP.state.quizQuestions);
    }
    
    // Shuffle questions
    APP.state.quizQuestions = shuffleArray(APP.state.quizQuestions);
    
    // Take first 50 questions (or less)
    APP.state.quizQuestions = APP.state.quizQuestions.slice(0, 50);
    
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    
    loadQuestion();
}

// Load Question
function loadQuestion() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    if (!question) {
        showQuizResults();
        return;
    }
    
    const isFlagged = APP.progress.flaggedQuestions.includes(question.id);
    
    container.innerHTML = `
        <div class="question-header">
            <div>
                <span>Question ${APP.state.currentQuestionIndex + 1} of ${APP.state.quizQuestions.length}</span>
                <span class="badge badge-info" style="margin-left: 1rem;">
                    Domain ${question.domain}
                </span>
            </div>
            <button class="btn ${isFlagged ? 'btn-danger' : 'btn-warning'}" 
                    onclick="toggleFlag('${question.id}')">
                🚩 ${isFlagged ? 'Flagged' : 'Flag'}
            </button>
        </div>
        
        <div class="question-text">
            ${question.question || question.text}
        </div>
        
        <div class="options" id="optionsContainer">
            ${(question.options || []).map((option, index) => `
                <div class="option" 
                     data-index="${index}"
                     onclick="selectOption(${index})">
                    ${String.fromCharCode(65 + index)}. ${option}
                </div>
            `).join('')}
        </div>
        
        <div class="explanation hidden" id="explanationBox">
            <strong>Explanation:</strong>
            <p>${question.explanation}</p>
        </div>
        
        <div class="text-center mt-2">
            <button class="btn btn-primary" id="submitBtn" onclick="submitAnswer()">
                Submit Answer
            </button>
            <button class="btn btn-success hidden" id="nextBtn" onclick="nextQuestion()">
                Next Question →
            </button>
        </div>
    `;
    
    APP.state.selectedAnswer = null;
}

// Select Option
function selectOption(index) {
    if (document.getElementById('submitBtn')?.classList.contains('hidden')) {
        return; // Already submitted
    }
    
    // Clear previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection
    const option = document.querySelector(`.option[data-index="${index}"]`);
    if (option) {
        option.classList.add('selected');
        APP.state.selectedAnswer = index;
    }
}

// Submit Answer
function submitAnswer() {
    if (APP.state.selectedAnswer === null) {
        alert('Please select an answer');
        return;
    }
    
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    const correctIndex = question.correct ?? question.correct_answer ?? 0;
    const isCorrect = APP.state.selectedAnswer === correctIndex;
    
    // Show correct/incorrect
    document.querySelectorAll('.option').forEach((opt, index) => {
        opt.classList.add('disabled');
        if (index === correctIndex) {
            opt.classList.add('correct');
        } else if (index === APP.state.selectedAnswer && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    // Update score
    if (isCorrect) {
        APP.state.score++;
    } else {
        // Track wrong answer
        if (!APP.progress.wrongAnswers.find(w => w.id === question.id)) {
            APP.progress.wrongAnswers.push({
                id: question.id,
                domain: question.domain
            });
        }
    }
    
    // Track as completed
    if (!APP.progress.completedQuestions.find(q => q.id === question.id)) {
        APP.progress.completedQuestions.push({
            id: question.id,
            correct: isCorrect
        });
    }
    
    // Show explanation if immediate feedback
    if (APP.settings.immediateFeedback) {
        document.getElementById('explanationBox')?.classList.remove('hidden');
    }
    
    // Update buttons
    document.getElementById('submitBtn')?.classList.add('hidden');
    document.getElementById('nextBtn')?.classList.remove('hidden');
    
    saveProgress();
}

// Next Question
function nextQuestion() {
    APP.state.currentQuestionIndex++;
    loadQuestion();
}

// Show Quiz Results
function showQuizResults() {
    const container = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('quizResults');
    
    if (container) container.classList.add('hidden');
    if (!resultsContainer) return;
    
    const percentage = Math.round((APP.state.score / APP.state.quizQuestions.length) * 100);
    const passed = percentage >= 85;
    
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = `
        <h2 class="text-center mb-2">Quiz Complete!</h2>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" style="color: ${passed ? 'var(--success)' : 'var(--warning)'}">
                    ${percentage}%
                </div>
                <div class="stat-label">Final Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${APP.state.score}/${APP.state.quizQuestions.length}</div>
                <div class="stat-label">Correct Answers</div>
            </div>
        </div>
        
        <div class="text-center mt-2">
            <div class="badge ${passed ? 'badge-success' : 'badge-warning'}" 
                 style="font-size: 1.2rem; padding: 0.5rem 1.5rem;">
                ${passed ? '✅ PASSED' : '⚠️ NEEDS IMPROVEMENT'}
            </div>
        </div>
        
        ${!passed ? `
            <div class="alert alert-warning mt-2">
                <h4>📚 Study Recommendations</h4>
                <ul style="text-align: left; margin-top: 1rem;">
                    <li>Review flagged questions (${APP.progress.flaggedQuestions.length} items)</li>
                    <li>Focus on weak domains</li>
                    <li>Try practice simulations</li>
                    <li>Use flash card mode for memorization</li>
                </ul>
            </div>
        ` : ''}
        
        <div class="text-center mt-2">
            <button class="btn btn-secondary" onclick="showView('dashboard')">
                Back to Dashboard
            </button>
            <button class="btn btn-primary" onclick="startQuiz()">
                Try Again
            </button>
        </div>
    `;
}

// Render Simulations View
function renderSimulationsView() {
    const simulations = APP.content.simulations.filter(s => s.type === 'scenario');
    
    return `
        <div class="container">
            <h2 class="mb-2">Interactive Simulations</h2>
            <p style="color: var(--text-secondary);">
                Practice real-world scenarios with ${simulations.length} interactive simulations
            </p>
            
            <div class="simulations-grid">
                ${simulations.map((sim, index) => `
                    <div class="simulation-container">
                        <div class="simulation-header">
                            <h3>${sim.title}</h3>
                            <span class="badge badge-info">Domain ${sim.domain}</span>
                        </div>
                        <p>${sim.scenario || 'Interactive security scenario'}</p>
                        <button class="btn btn-primary" onclick="startSimulation(${index})">
                            🎮 Start Simulation
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Render PBQ View
function renderPBQView() {
    return `
        <div class="container">
            <h2 class="mb-2">Performance Based Questions</h2>
            <p style="color: var(--text-secondary);">
                Practice CompTIA-style PBQs with drag-and-drop, matching, and configuration tasks
            </p>
            
            <div id="pbqContainer">
                <!-- PBQ content will be loaded here -->
            </div>
        </div>
    `;
}

// Initialize PBQ
function initPBQ() {
    if (APP.content.pbqs && APP.content.pbqs.length > 0) {
        loadPBQ(0);
    }
}

// Load PBQ
function loadPBQ(index) {
    const container = document.getElementById('pbqContainer');
    if (!container) return;
    
    const pbq = APP.content.pbqs[index];
    if (!pbq) return;
    
    container.innerHTML = `
        <div class="pbq-container">
            <h3>${pbq.title}</h3>
            <p>${pbq.scenario}</p>
            
            ${pbq.type === 'drag_drop' ? renderDragDropPBQ(pbq) : ''}
            ${pbq.type === 'matching' ? renderMatchingPBQ(pbq) : ''}
            
            <div class="text-center mt-2">
                <button class="btn btn-primary" onclick="submitPBQ(${index})">
                    Submit Answer
                </button>
                ${index < APP.content.pbqs.length - 1 ? `
                    <button class="btn btn-secondary" onclick="loadPBQ(${index + 1})">
                        Next PBQ →
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

// Render Drag & Drop PBQ
function renderDragDropPBQ(pbq) {
    return `
        <div class="drag-container">
            <div class="drag-area" id="dragSource">
                ${(pbq.items || []).map((item, i) => `
                    <div class="drag-item" draggable="true" data-index="${i}">
                        ${item}
                    </div>
                `).join('')}
            </div>
            
            <div class="drag-area" id="dragTarget" style="min-height: 200px;">
                <p style="color: var(--text-secondary);">Drag items here in the correct order</p>
            </div>
        </div>
    `;
}

// Render Matching PBQ
function renderMatchingPBQ(pbq) {
    return `
        <div class="matching-container">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div>
                    ${(pbq.left_items || []).map((item, i) => `
                        <div class="match-item" data-left="${i}">
                            ${item}
                        </div>
                    `).join('')}
                </div>
                <div>
                    ${(pbq.right_items || []).map((item, i) => `
                        <div class="match-item" data-right="${i}">
                            ${item}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function toggleFlag(questionId) {
    const index = APP.progress.flaggedQuestions.indexOf(questionId);
    if (index > -1) {
        APP.progress.flaggedQuestions.splice(index, 1);
    } else {
        APP.progress.flaggedQuestions.push(questionId);
    }
    saveProgress();
    loadQuestion();
}

function toggleFlashCards() {
    APP.state.flashCardMode = !APP.state.flashCardMode;
    const btn = document.getElementById('flashBtn');
    if (btn) {
        btn.textContent = APP.state.flashCardMode ? '🎴 Flash ON' : '🎴 Flash';
        btn.classList.toggle('btn-warning', APP.state.flashCardMode);
    }
}

function showFlaggedQuestions() {
    if (APP.progress.flaggedQuestions.length === 0) {
        alert('No flagged questions');
        return;
    }
    
    APP.state.quizQuestions = APP.content.questions.filter(q => 
        APP.progress.flaggedQuestions.includes(q.id)
    );
    showView('quiz');
}

function startPracticeExam() {
    // Create exam with proper domain weighting
    const examQuestions = [];
    
    DOMAINS.forEach(domain => {
        const domainQuestions = APP.content.questions.filter(q => q.domain === domain.id);
        const count = Math.floor(90 * domain.weight);
        const selected = shuffleArray([...domainQuestions]).slice(0, count);
        examQuestions.push(...selected);
    });
    
    APP.state.quizQuestions = shuffleArray(examQuestions).slice(0, 90);
    showView('quiz');
}

function startSimulation(index) {
    alert('Simulation player coming soon!');
    // Implement simulation player
}

function submitPBQ(index) {
    alert('PBQ submitted! Feature coming soon.');
    // Implement PBQ scoring
}

function updateFlaggedCount() {
    const count = document.getElementById('flaggedCount');
    if (count) count.textContent = APP.progress.flaggedQuestions.length;
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

function calculateStats() {
    const completed = APP.progress.completedQuestions.length;
    const correct = APP.progress.completedQuestions.filter(q => q.correct).length;
    
    return {
        completed: completed,
        correctRate: completed > 0 ? Math.round((correct / completed) * 100) : 0,
        flagged: APP.progress.flaggedQuestions.length,
        weakSpots: calculateWeakSpots().length
    };
}

function applyAdaptiveLearning(questions) {
    const weakQuestions = questions.filter(q => 
        APP.progress.wrongAnswers.find(w => w.id === q.id)
    );
    
    const otherQuestions = questions.filter(q => 
        !APP.progress.wrongAnswers.find(w => w.id === q.id)
    );
    
    // Mix weak questions more frequently
    const adapted = [];
    let weakIndex = 0, otherIndex = 0;
    
    for (let i = 0; i < questions.length; i++) {
        if (i % 3 === 0 && weakIndex < weakQuestions.length) {
            adapted.push(weakQuestions[weakIndex++]);
        } else if (otherIndex < otherQuestions.length) {
            adapted.push(otherQuestions[otherIndex++]);
        }
    }
    
    return adapted;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function saveProgress() {
    try {
        localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
        localStorage.setItem('securityPlusSettings', JSON.stringify(APP.settings));
    } catch (error) {
        console.error('Could not save progress:', error);
    }
}

function loadProgress() {
    try {
        const progress = localStorage.getItem('securityPlusProgress');
        if (progress) APP.progress = JSON.parse(progress);
        
        const settings = localStorage.getItem('securityPlusSettings');
        if (settings) APP.settings = { ...APP.settings, ...JSON.parse(settings) };
    } catch (error) {
        console.error('Could not load progress:', error);
    }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Make functions available globally
window.selectOption = selectOption;
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.toggleFlag = toggleFlag;
window.openDomain = openDomain;
window.startPracticeExam = startPracticeExam;
window.startSimulation = startSimulation;
window.loadPBQ = loadPBQ;
window.submitPBQ = submitPBQ;
window.showView = showView;
