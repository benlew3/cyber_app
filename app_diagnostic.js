// Security+ Platform v11.0 - DIAGNOSTIC VERSION
// This version includes detailed error logging to help identify loading issues

// Global Application State
const APP = {
    version: '11.0-diagnostic',
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

// Initialize Application
async function initApp() {
    console.log('=== DIAGNOSTIC MODE ===');
    console.log('Initializing Security+ Platform v' + APP.version);
    console.log('Current URL:', window.location.href);
    console.log('Base path:', window.location.pathname);
    
    try {
        // Load all content with detailed logging
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
        
        console.log('✅ Platform initialized successfully');
        
    } catch (error) {
        console.error('❌ INITIALIZATION FAILED:', error);
        console.error('Stack trace:', error.stack);
        
        // Show error to user
        const loadingStatus = document.getElementById('loadingStatus');
        if (loadingStatus) {
            loadingStatus.innerHTML = `
                <div style="color: #ef4444; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; margin: 20px;">
                    <h3>⚠️ Loading Error</h3>
                    <p>Could not load content files. Please check:</p>
                    <ol style="text-align: left;">
                        <li>All data/*.json files are uploaded</li>
                        <li>Files are in the correct location</li>
                        <li>No syntax errors in JSON files</li>
                    </ol>
                    <p style="margin-top: 10px;">Check browser console (F12) for details</p>
                    <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Retry Loading
                    </button>
                </div>
            `;
        }
    }
}

// Load All Content with Detailed Logging
async function loadAllContent() {
    console.log('📁 Starting to load content files...');
    
    const files = [
        { name: 'questions', path: 'data/questions.json', required: true },
        { name: 'simulations', path: 'data/simulations.json', required: true },
        { name: 'lessons', path: 'data/lessons.json', required: false },
        { name: 'pbqs', path: 'data/pbqs.json', required: false },
        { name: 'glossary', path: 'data/glossary.json', required: false }
    ];
    
    let loaded = 0;
    const total = files.length;
    let hasErrors = false;
    
    for (const file of files) {
        try {
            updateLoadingProgress((loaded / total) * 100);
            updateLoadingStatus(`Loading ${file.name}...`);
            
            console.log(`📄 Attempting to load: ${file.path}`);
            
            const response = await fetch(file.path);
            
            console.log(`   Response status: ${response.status} ${response.statusText}`);
            console.log(`   Content-Type: ${response.headers.get('Content-Type')}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            console.log(`   Received ${text.length} characters`);
            
            // Try to parse JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error(`   ❌ JSON Parse Error in ${file.name}:`, parseError.message);
                console.log(`   First 200 chars of response:`, text.substring(0, 200));
                throw new Error(`Invalid JSON in ${file.path}: ${parseError.message}`);
            }
            
            APP.content[file.name] = data;
            
            loaded++;
            const itemCount = Array.isArray(data) ? data.length : Object.keys(data).length;
            console.log(`   ✅ Loaded ${file.name}: ${itemCount} items`);
            
        } catch (error) {
            console.error(`❌ Error loading ${file.name}:`, error);
            
            if (file.required) {
                hasErrors = true;
                console.error(`   This is a REQUIRED file - cannot continue without it`);
                
                // Create sample data for testing
                if (file.name === 'questions') {
                    console.log('   Creating sample questions for testing...');
                    APP.content.questions = createSampleQuestions();
                } else if (file.name === 'simulations') {
                    console.log('   Creating sample simulations for testing...');
                    APP.content.simulations = createSampleSimulations();
                }
            } else {
                console.warn(`   This is an optional file - continuing without it`);
                APP.content[file.name] = file.name === 'glossary' ? {} : [];
            }
        }
    }
    
    updateLoadingProgress(100);
    
    // Summary
    console.log('📊 Content Loading Summary:');
    console.log(`   Questions: ${APP.content.questions.length}`);
    console.log(`   Simulations: ${APP.content.simulations.length}`);
    console.log(`   Lessons: ${APP.content.lessons.length}`);
    console.log(`   PBQs: ${APP.content.pbqs.length}`);
    console.log(`   Glossary entries: ${Object.keys(APP.content.glossary).length}`);
    
    if (APP.content.questions.length === 0 && APP.content.simulations.length === 0) {
        throw new Error('No content loaded - cannot start platform');
    }
    
    updateLoadingStatus('Content loaded!');
}

// Create Sample Questions for Testing
function createSampleQuestions() {
    console.log('Creating 10 sample questions for testing...');
    const questions = [];
    for (let i = 1; i <= 10; i++) {
        questions.push({
            id: `TEST-Q${i}`,
            domain: ((i - 1) % 5) + 1,
            question: `Sample Question ${i}: This is a test question to verify the platform works.`,
            options: [
                'Option A - Test answer',
                'Option B - Test answer',
                'Option C - Test answer',
                'Option D - Test answer'
            ],
            correct: 0,
            explanation: 'This is a sample question for testing purposes.'
        });
    }
    return questions;
}

// Create Sample Simulations for Testing
function createSampleSimulations() {
    console.log('Creating 5 sample simulations for testing...');
    const simulations = [];
    for (let i = 1; i <= 5; i++) {
        simulations.push({
            id: `TEST-SIM${i}`,
            domain: i,
            type: 'scenario',
            title: `Test Simulation ${i}`,
            scenario: 'This is a test simulation to verify the platform works.',
            difficulty: 'intermediate',
            points: 100,
            decisionPoints: [
                {
                    title: 'Test Decision',
                    situation: 'Test situation',
                    question: 'What would you do?',
                    options: [
                        { text: 'Option A', points: 10, feedback: 'Good choice', isOptimal: true },
                        { text: 'Option B', points: 5, feedback: 'Okay choice', isOptimal: false }
                    ]
                }
            ]
        });
    }
    return simulations;
}

// Update Loading UI
function updateLoadingProgress(percent) {
    const fill = document.getElementById('progressFill');
    if (fill) {
        fill.style.width = percent + '%';
        console.log(`Progress: ${percent.toFixed(0)}%`);
    }
}

function updateLoadingStatus(message) {
    const status = document.getElementById('loadingStatus');
    if (status) status.textContent = message;
    console.log(`Status: ${message}`);
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation buttons
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            if (view) showView(view);
        });
    });
    
    console.log('Event listeners setup complete');
}

// Initialize Navigation
function initializeNavigation() {
    console.log('Initializing navigation...');
    // Navigation setup code here
}

// Basic showView function for testing
function showView(viewName) {
    console.log(`Showing view: ${viewName}`);
    const content = document.getElementById('content');
    if (!content) {
        console.error('Content container not found!');
        return;
    }
    
    content.innerHTML = `
        <div class="container">
            <h2>Dashboard</h2>
            <p>Platform loaded successfully!</p>
            <div class="alert alert-success">
                <h3>✅ Diagnostic Results:</h3>
                <ul>
                    <li>Questions loaded: ${APP.content.questions.length}</li>
                    <li>Simulations loaded: ${APP.content.simulations.length}</li>
                    <li>Platform version: ${APP.version}</li>
                </ul>
                <p>Check browser console (F12) for detailed diagnostic information.</p>
            </div>
        </div>
    `;
}

// Continue with remaining functions...
function loadProgress() {
    console.log('Loading saved progress...');
    try {
        const saved = localStorage.getItem('securityPlusProgress');
        if (saved) {
            APP.progress = JSON.parse(saved);
            console.log('Progress loaded from localStorage');
        }
    } catch (error) {
        console.error('Could not load saved progress:', error);
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Make debugging functions globally available
window.APP = APP;
window.debugPlatform = function() {
    console.log('=== PLATFORM DEBUG INFO ===');
    console.log('APP State:', APP);
    console.log('Questions loaded:', APP.content.questions.length);
    console.log('Simulations loaded:', APP.content.simulations.length);
    console.log('Current URL:', window.location.href);
    console.log('=========================');
};

console.log('📌 Type debugPlatform() in console for diagnostic info');
