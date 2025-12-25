// Security+ Platform v19 - GitHub Pages Fixed Version
// Fixed syntax errors and compatibility issues

console.log('Security+ Platform v19 GHPages - Starting...');

// Global state with safe initialization
const APP = {
    version: '19.0-GHPages-Fixed',
    initialized: false,
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
        selectedOption: undefined,
        examTimer: null,
        examTimeRemaining: 5400,
        simulationProgress: {}
    },
    progress: {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: [],
        completedLessons: [],
        completedSimulations: [],
        domainScores: {1: [], 2: [], 3: [], 4: [], 5: []},
        practiceExamScores: []
    }
};

// Make APP globally available immediately
window.APP = APP;

// Domain configuration
const DOMAINS = [
    { id: 1, name: 'General Security Concepts', weight: 0.12, color: '#6366f1', icon: '🔒' },
    { id: 2, name: 'Threats, Vulnerabilities & Mitigations', weight: 0.22, color: '#f59e0b', icon: '⚠️' },
    { id: 3, name: 'Security Architecture', weight: 0.18, color: '#10b981', icon: '🏗️' },
    { id: 4, name: 'Security Operations', weight: 0.28, color: '#8b5cf6', icon: '🛡️' },
    { id: 5, name: 'Security Program Management', weight: 0.20, color: '#ec4899', icon: '📊' }
];

// Complete 41-lesson structure
const ALL_LESSONS = [
    // Domain 1 (8 lessons)
    { id: 'D1-LESSON-001', title: 'Security Controls Fundamentals', domain: 1, index: 0 },
    { id: 'D1-LESSON-002', title: 'CIA Triad Fundamentals', domain: 1, index: 1 },
    { id: 'D1-LESSON-003', title: 'Authentication Methods', domain: 1, index: 2 },
    { id: 'D1-LESSON-004', title: 'Cryptographic Fundamentals', domain: 1, index: 3 },
    { id: 'D1-LESSON-005', title: 'Zero Trust Architecture', domain: 1, index: 4 },
    { id: 'D1-LESSON-006', title: 'Physical Security Controls', domain: 1, index: 5 },
    { id: 'D1-LESSON-007', title: 'Deception Technologies', domain: 1, index: 6 },
    { id: 'D1-LESSON-008', title: 'Change Management', domain: 1, index: 7 },
    
    // Domain 2 (12 lessons)
    { id: 'D2-LESSON-001', title: 'Threat Actors & Motivations', domain: 2, index: 8 },
    { id: 'D2-LESSON-002', title: 'Threat Vectors & Attack Surfaces', domain: 2, index: 9 },
    { id: 'D2-LESSON-003', title: 'Social Engineering', domain: 2, index: 10 },
    { id: 'D2-LESSON-004', title: 'Malware Types', domain: 2, index: 11 },
    { id: 'D2-LESSON-005', title: 'Network Attacks', domain: 2, index: 12 },
    { id: 'D2-LESSON-006', title: 'Application Attacks', domain: 2, index: 13 },
    { id: 'D2-LESSON-007', title: 'Vulnerability Management', domain: 2, index: 14 },
    { id: 'D2-LESSON-008', title: 'Indicators of Compromise', domain: 2, index: 15 },
    { id: 'D2-LESSON-009', title: 'Hardening & Configurations', domain: 2, index: 16 },
    { id: 'D2-LESSON-010', title: 'Mitigation Techniques', domain: 2, index: 17 },
    { id: 'D2-LESSON-011', title: 'Attack Frameworks', domain: 2, index: 18 },
    { id: 'D2-LESSON-012', title: 'Security Assessments', domain: 2, index: 19 },
    
    // Domain 3 (8 lessons)
    { id: 'D3-LESSON-001', title: 'Security Architecture Concepts', domain: 3, index: 20 },
    { id: 'D3-LESSON-002', title: 'Infrastructure Security', domain: 3, index: 21 },
    { id: 'D3-LESSON-003', title: 'Network Security', domain: 3, index: 22 },
    { id: 'D3-LESSON-004', title: 'Wireless Security', domain: 3, index: 23 },
    { id: 'D3-LESSON-005', title: 'Cloud Security', domain: 3, index: 24 },
    { id: 'D3-LESSON-006', title: 'Cryptography', domain: 3, index: 25 },
    { id: 'D3-LESSON-007', title: 'Resilience & Recovery', domain: 3, index: 26 },
    { id: 'D3-LESSON-008', title: 'Data Protection', domain: 3, index: 27 },
    
    // Domain 4 (7 lessons)
    { id: 'D4-LESSON-001', title: 'Security Monitoring', domain: 4, index: 28 },
    { id: 'D4-LESSON-002', title: 'Incident Response', domain: 4, index: 29 },
    { id: 'D4-LESSON-003', title: 'Digital Forensics', domain: 4, index: 30 },
    { id: 'D4-LESSON-004', title: 'Vulnerability Management', domain: 4, index: 31 },
    { id: 'D4-LESSON-005', title: 'Identity & Access Management', domain: 4, index: 32 },
    { id: 'D4-LESSON-006', title: 'Data Protection', domain: 4, index: 33 },
    { id: 'D4-LESSON-007', title: 'Security Automation', domain: 4, index: 34 },
    
    // Domain 5 (6 lessons)
    { id: 'D5-LESSON-001', title: 'Security Governance', domain: 5, index: 35 },
    { id: 'D5-LESSON-002', title: 'Risk Management', domain: 5, index: 36 },
    { id: 'D5-LESSON-003', title: 'Third-Party Risk Management', domain: 5, index: 37 },
    { id: 'D5-LESSON-004', title: 'Security Compliance', domain: 5, index: 38 },
    { id: 'D5-LESSON-005', title: 'Audits & Assessments', domain: 5, index: 39 },
    { id: 'D5-LESSON-006', title: 'Security Awareness', domain: 5, index: 40 }
];

// All simulations (25 total)
const ALL_SIMULATIONS = [
    // Domain 1
    { id: 'D1-SIM-001', title: 'Security Controls Implementation', domain: 1, scenario: 'Implement layered security controls for a financial institution.' },
    { id: 'D1-SIM-002', title: 'Security Concepts Application', domain: 1, scenario: 'Apply CIA triad principles to protect healthcare data.' },
    { id: 'D1-SIM-003', title: 'Encryption Emergency Response', domain: 1, scenario: 'Respond to a cryptographic key compromise incident.' },
    { id: 'D1-SIM-004', title: 'Zero Trust Migration', domain: 1, scenario: 'Plan and execute a zero trust architecture migration.' },
    { id: 'D1-SIM-005', title: 'Security Gap Analysis', domain: 1, scenario: 'Identify and remediate security control gaps.' },
    
    // Domain 2
    { id: 'D2-SIM-001', title: 'Phishing Campaign Response', domain: 2, scenario: 'Detect and respond to a sophisticated phishing attack.' },
    { id: 'D2-SIM-002', title: 'Vulnerability Management', domain: 2, scenario: 'Prioritize and patch critical vulnerabilities.' },
    { id: 'D2-SIM-003', title: 'Ransomware Response', domain: 2, scenario: 'Handle an active ransomware infection.' },
    { id: 'D2-SIM-004', title: 'Supply Chain Security', domain: 2, scenario: 'Assess and mitigate supply chain risks.' },
    { id: 'D2-SIM-005', title: 'Attack Surface Analysis', domain: 2, scenario: 'Map and reduce organizational attack surface.' },
    
    // Domain 3
    { id: 'D3-SIM-001', title: 'Cloud Security Architecture', domain: 3, scenario: 'Design secure cloud infrastructure.' },
    { id: 'D3-SIM-002', title: 'Zero Trust Implementation', domain: 3, scenario: 'Implement zero trust network architecture.' },
    { id: 'D3-SIM-003', title: 'Data Protection Strategy', domain: 3, scenario: 'Create comprehensive data protection plan.' },
    { id: 'D3-SIM-004', title: 'Infrastructure Hardening', domain: 3, scenario: 'Harden critical infrastructure components.' },
    { id: 'D3-SIM-005', title: 'Resilience & Recovery Planning', domain: 3, scenario: 'Build disaster recovery capabilities.' },
    
    // Domain 4
    { id: 'D4-SIM-001', title: 'SOC Operations', domain: 4, scenario: 'Run security operations center activities.' },
    { id: 'D4-SIM-002', title: 'Incident Response Scenario', domain: 4, scenario: 'Execute incident response procedures.' },
    { id: 'D4-SIM-003', title: 'Vulnerability Assessment', domain: 4, scenario: 'Conduct comprehensive vulnerability assessment.' },
    { id: 'D4-SIM-004', title: 'IAM Implementation', domain: 4, scenario: 'Deploy identity management solution.' },
    { id: 'D4-SIM-005', title: 'Security Automation', domain: 4, scenario: 'Automate security operations tasks.' },
    
    // Domain 5
    { id: 'D5-SIM-001', title: 'Security Governance Framework', domain: 5, scenario: 'Establish security governance structure.' },
    { id: 'D5-SIM-002', title: 'Risk Management Process', domain: 5, scenario: 'Perform enterprise risk assessment.' },
    { id: 'D5-SIM-003', title: 'Third-Party Risk Assessment', domain: 5, scenario: 'Evaluate vendor security posture.' },
    { id: 'D5-SIM-004', title: 'Compliance Audit', domain: 5, scenario: 'Prepare for regulatory audit.' },
    { id: 'D5-SIM-005', title: 'Security Program Development', domain: 5, scenario: 'Build security awareness program.' }
];

// Initialize when DOM is ready with error handling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    setTimeout(initializeApp, 100);
}

// Ensure required containers exist (helps on GitHub Pages when HTML differs)
function ensureMainContainers() {
    try {
        let main = document.getElementById('main-content');
        if (!main) {
            main = document.createElement('div');
            main.id = 'main-content';
            // Make visible by default so we never get a blank page
            main.style.display = 'block';
            main.style.opacity = '1';
            document.body.appendChild(main);
        }

        let content = document.getElementById('content');
        if (!content) {
            content = document.createElement('div');
            content.id = 'content';
            main.appendChild(content);
        }

        // Optional loading screen (only create if missing)
        let loading = document.getElementById('loading-screen');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loading-screen';
            loading.style.display = 'none';
            document.body.insertBefore(loading, document.body.firstChild);
        }
    } catch (e) {
        console.warn('ensureMainContainers failed:', e);
    }
}

// Initialize application with comprehensive error handling
function initializeApp() {
    try {
        console.log('🚀 Initializing Application...');

        // Make sure expected DOM nodes exist
        ensureMainContainers();
        
        // AGGRESSIVE removal of colored nav
        removeColoredNav();
        
        // Set interval with error handling
        const removalInterval = setInterval(() => {
            try {
                removeColoredNav();
            } catch (e) {
                console.warn('Error removing colored nav:', e);
            }
        }, 100);
        
        // Stop removing after 10 seconds to save resources
        setTimeout(() => {
            clearInterval(removalInterval);
        }, 10000);
        
        // Set up mutation observer with error handling
        if (document.body) {
            try {
                const observer = new MutationObserver(() => {
                    try {
                        removeColoredNav();
                    } catch (e) {
                        // Silent fail
                    }
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            } catch (e) {
                console.warn('Could not set up MutationObserver:', e);
            }
        }
        
        // Load data
        loadData();
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Initialize platform with delay
        setTimeout(() => {
            try {
                injectStyles();
                createHeader();
                showView('dashboard');
                loadProgress();
                
                // Mark as initialized AFTER everything loads successfully
                APP.initialized = true;
                window.APP = APP;
                console.log('✅ Platform initialized successfully!');
                
            } catch (e) {
                console.error('Error initializing platform:', e);
                // Fallback: show basic dashboard
                fallbackDashboard();
            }
        }, 200);
        
    } catch (error) {
        console.error('Critical initialization error:', error);
        fallbackDashboard();
    }
}

// AGGRESSIVE colored nav removal with error handling
function removeColoredNav() {
    try {
        // Find and remove ANY element that looks like the colored nav
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(elem => {
            try {
                if (!elem || !elem.parentNode) return; // Skip if element is invalid
                
                const style = elem.getAttribute ? elem.getAttribute('style') : '';
                const className = (typeof elem.className === 'string') ? elem.className : '';
                const text = elem.textContent || '';
                const html = elem.innerHTML || '';
                
                // Check if this is the colored nav
                const isColoredNav = (
                    // Style checks
                    (style && (
                        style.includes('linear-gradient') ||
                        style.includes('background: linear') ||
                        style.includes('#6366f1') ||
                        style.includes('rgb(99, 102, 241)')
                    )) ||
                    // Content checks
                    text.includes('Security+ SY0-701') ||
                    (html && html.includes('Dashboard') && html.includes('Quiz') && html.includes('Simulations') && html.includes('PBQs')) ||
                    // Class checks
                    className.includes('colored-nav') ||
                    className.includes('top-nav')
                );
                
                if (isColoredNav) {
                    // Check if it's NOT our clean header
                    const isOurHeader = (
                        (elem.classList && elem.classList.contains('platform-header-bar')) ||
                        (elem.closest && elem.closest('.platform-header-bar'))
                    );
                    
                    if (!isOurHeader) {
                        elem.remove();
                    }
                }
            } catch (e) {
                // Silently skip problematic elements
            }
        });
        
        // Also hide any element with colored backgrounds that's not our header
        const styledElements = document.querySelectorAll('[style*="background"]');
        styledElements.forEach(elem => {
            try {
                if (elem && elem.style && elem.style.background && 
                    elem.style.background.includes('linear-gradient') &&
                    (!elem.classList || !elem.classList.contains('platform-header-bar'))) {
                    elem.style.display = 'none';
                }
            } catch (e) {
                // Silently skip
            }
        });
    } catch (error) {
        console.warn('Error in removeColoredNav:', error);
    }
}

// Load data with error handling
function loadData() {
    try {
        // Load simulations
        APP.content.simulations = ALL_SIMULATIONS || [];
        console.log(`✅ Loaded ${APP.content.simulations.length} simulations`);
        
        // Load lessons
        APP.content.lessons = ALL_LESSONS || [];
        console.log(`✅ Loaded ${APP.content.lessons.length} lessons`);
        
        // Generate sample questions
        generateSampleQuestions();
    } catch (error) {
        console.error('Error loading data:', error);
        // Set defaults
        APP.content.simulations = [];
        APP.content.lessons = [];
        APP.content.questions = [];
    }
}

// Generate sample questions with error handling
function generateSampleQuestions() {
    try {
        const questions = [];
        for (let domain = 1; domain <= 5; domain++) {
            for (let i = 0; i < 50; i++) {
                questions.push({
                    id: `D${domain}-Q${i+1}`,
                    domain: domain,
                    question: `Domain ${domain} Question ${i+1}: Which security control would be most effective?`,
                    options: [
                        'Technical control implementation',
                        'Administrative policy update',
                        'Physical security measure',
                        'Combined layered approach'
                    ],
                    correct_answer: Math.floor(Math.random() * 4),
                    explanation: 'This demonstrates proper security control selection.'
                });
            }
        }
        APP.content.questions = questions;
        console.log(`✅ Generated ${questions.length} sample questions`);
    } catch (error) {
        console.error('Error generating questions:', error);
        APP.content.questions = [];
    }
}

// Hide loading screen with error handling
function hideLoadingScreen() {
    try {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
            setTimeout(() => {
                mainContent.classList.add('visible');
            }, 100);
        }
        
    } catch (error) {
        console.warn('Error hiding loading screen:', error);
        // Force hide
        try {
            const loading = document.getElementById('loading-screen');
            if (loading) loading.style.display = 'none';
            const main = document.getElementById('main-content');
            if (main) {
                main.style.display = 'block';
                main.style.opacity = '1';
            }
        } catch (e) {}
    }
}

// Create clean header with error handling
function createHeader() {
    try {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }
        
        // Remove any existing headers
        const existingHeaders = document.querySelectorAll('.platform-header-bar');
        existingHeaders.forEach(h => {
            try {
                h.remove();
            } catch (e) {}
        });
        
        // Create our clean header
        const header = document.createElement('div');
        header.className = 'platform-header-bar';
        
        // Build header HTML with safe values
        const flagCount = (APP.progress && APP.progress.flaggedQuestions) ? 
                         APP.progress.flaggedQuestions.length : 0;
        
        header.innerHTML = `
            <div class="header-container">
                <div class="header-brand">
                    <span>🛡️</span>
                    <span>Security+ Training</span>
                </div>
                
                <nav class="header-nav">
                    <button class="header-btn" onclick="safeShowView('dashboard')">
                        🏠 Dashboard
                    </button>
                    
                    <div class="header-dropdown">
                        <button class="header-btn">📚 Domains ▼</button>
                        <div class="dropdown-content">
                            ${DOMAINS.map(d => `
                                <a onclick="safeShowView('domain-menu', {domainId: ${d.id}})">
                                    ${d.icon} Domain ${d.id}: ${d.name}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="header-dropdown">
                        <button class="header-btn">📖 Lessons ▼</button>
                        <div class="dropdown-content lessons-dropdown">
                            ${DOMAINS.map(d => {
                                const lessons = ALL_LESSONS.filter(l => l.domain === d.id);
                                return `
                                    <div class="dropdown-section">
                                        <div class="dropdown-header">Domain ${d.id}</div>
                                        ${lessons.map(l => `
                                            <a onclick="safeShowView('lesson-viewer', {lessonId: '${l.id}'})">
                                                ${l.title}
                                            </a>
                                        `).join('')}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <button class="header-btn" onclick="safeShowView('simulations')">
                        🎮 Simulations
                    </button>
                    
                    <button class="header-btn" onclick="safeShowView('quiz')">
                        📝 Quiz
                    </button>
                    
                    <button class="header-btn" onclick="safeShowView('remedial')">
                        🔧 Remedial
                    </button>
                </nav>
                
                <div class="header-actions">
                    <span class="flag-count">🚩 ${flagCount}</span>
                </div>
            </div>
        `;
        
        mainContent.insertBefore(header, mainContent.firstChild);
        
        // Create content container if it doesn't exist
        let content = document.getElementById('content');
        if (!content) {
            content = document.createElement('div');
            content.id = 'content';
            mainContent.appendChild(content);
        }
        
        // Mark header as loaded
        setTimeout(() => {
            header.classList.add('loaded');
        }, 100);
        
    } catch (error) {
        console.error('Error creating header:', error);
    }
}

// Inject clean styles with error handling
function injectStyles() {
    try {
        // Remove existing problem styles
        document.querySelectorAll('style').forEach(s => {
            if (s.textContent && 
                (s.textContent.includes('linear-gradient') || 
                 s.textContent.includes('#6366f1'))) {
                s.remove();
            }
        });
        
        const style = document.createElement('style');
        style.textContent = `
            /* Hide colored nav */
            [style*="linear-gradient"],
            [style*="Security+ SY0-701"],
            .colored-nav,
            .top-nav {
                display: none !important;
            }
            
            /* Base styles */
            body {
                background: #09090b;
                color: #fafafa;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            
            /* Clean header */
            .platform-header-bar {
                background: #18181b;
                border-bottom: 1px solid #27272a;
                position: sticky;
                top: 0;
                z-index: 1000;
            }
            
            .header-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 60px;
            }
            
            .header-brand {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #fafafa;
                font-weight: bold;
                font-size: 1.1rem;
            }
            
            .header-nav {
                display: flex;
                gap: 10px;
                flex: 1;
                justify-content: center;
            }
            
            .header-btn {
                background: transparent;
                color: #a1a1aa;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.95rem;
            }
            
            .header-btn:hover {
                background: #27272a;
                color: #fafafa;
            }
            
            .header-dropdown {
                position: relative;
            }
            
            .dropdown-content {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: #18181b;
                border: 1px solid #27272a;
                border-radius: 8px;
                min-width: 250px;
                max-height: 400px;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                margin-top: 5px;
            }
            
            .header-dropdown:hover .dropdown-content {
                display: block;
            }
            
            .lessons-dropdown {
                min-width: 350px;
            }
            
            .dropdown-content a {
                display: block;
                padding: 10px 16px;
                color: #a1a1aa;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .dropdown-content a:hover {
                background: #27272a;
                color: #fafafa;
            }
            
            .dropdown-section {
                border-bottom: 1px solid #27272a;
                padding: 8px 0;
            }
            
            .dropdown-section:last-child {
                border-bottom: none;
            }
            
            .dropdown-header {
                padding: 8px 16px;
                font-weight: bold;
                color: #fafafa;
                border-bottom: 1px solid #27272a;
            }
            
            .flag-count {
                background: #27272a;
                padding: 8px 16px;
                border-radius: 6px;
                color: #fafafa;
            }
            
            /* Content */
            .platform-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 30px 20px;
            }
            
            .back-btn {
                background: #27272a;
                color: #fafafa;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                margin-bottom: 20px;
                transition: all 0.3s;
            }
            
            .back-btn:hover {
                background: #3f3f46;
            }
            
            /* Cards and grids */
            .domain-grid,
            .learning-menu {
                display: grid;
                gap: 20px;
                margin: 30px 0;
            }
            
            .domain-grid {
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            }
            
            .learning-menu {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }
            
            .domain-card,
            .menu-card,
            .lesson-card,
            .simulation-card,
            .stat-card {
                background: #18181b;
                border: 1px solid #27272a;
                border-radius: 8px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .domain-card:hover,
            .menu-card:hover,
            .lesson-card:hover,
            .simulation-card:hover {
                border-color: #3f3f46;
                transform: translateY(-2px);
            }
            
            /* Typography */
            .page-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 10px;
                color: #fafafa;
            }
            
            .page-subtitle {
                color: #a1a1aa;
                margin-bottom: 30px;
            }
            
            /* Buttons */
            .btn {
                background: #27272a;
                color: #fafafa;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .btn:hover {
                background: #3f3f46;
            }
            
            .btn-primary {
                background: #3f3f46;
            }
            
            .btn-success {
                background: #10b981;
            }
            
            /* Progress bar */
            .progress-bar {
                height: 8px;
                background: #27272a;
                border-radius: 4px;
                overflow: hidden;
                margin: 10px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: #3f3f46;
                transition: width 0.3s;
            }
            
            /* Lesson viewer */
            .lesson-viewer {
                display: grid;
                grid-template-columns: 250px 1fr;
                gap: 20px;
            }
            
            @media (max-width: 768px) {
                .lesson-viewer {
                    grid-template-columns: 1fr;
                }
                
                .header-nav {
                    display: none;
                }
            }
            
            .lesson-sidebar {
                background: #18181b;
                border-radius: 8px;
                padding: 20px;
                height: fit-content;
            }
            
            .sidebar-item {
                padding: 10px;
                margin: 5px 0;
                border-radius: 6px;
                cursor: pointer;
                color: #a1a1aa;
                transition: all 0.3s;
            }
            
            .sidebar-item:hover,
            .sidebar-item.active {
                background: #27272a;
                color: #fafafa;
            }
            
            .lesson-content {
                background: #18181b;
                border-radius: 8px;
                padding: 30px;
            }
            
            .lesson-section {
                margin-bottom: 40px;
            }
            
            .lesson-section h2 {
                color: #fafafa;
                margin-bottom: 20px;
            }
            
            .lesson-section h3 {
                color: #fafafa;
                margin: 20px 0 10px 0;
            }
            
            .lesson-navigation {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 50px;
                padding-top: 30px;
                border-top: 1px solid #27272a;
                gap: 20px;
            }
            
            /* Grids */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            
            .stat-card {
                text-align: center;
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .stat-label {
                color: #a1a1aa;
            }
            
            /* Other elements */
            .lesson-list,
            .simulation-grid {
                display: grid;
                gap: 15px;
                margin: 30px 0;
            }
            
            .lesson-card,
            .simulation-card {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            
            .lesson-status {
                font-size: 1.5rem;
            }
            
            .lesson-info,
            .sim-info {
                flex: 1;
            }
            
            .domain-icon,
            .menu-icon {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .domain-stats {
                display: flex;
                gap: 15px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #27272a;
                color: #a1a1aa;
                font-size: 0.9rem;
            }
            
            .sim-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #27272a;
            }
            
            .nav-btn {
                background: #27272a;
                color: #fafafa;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .nav-btn:hover {
                background: #3f3f46;
            }
        `;
        
        document.head.appendChild(style);
    } catch (error) {
        console.error('Error injecting styles:', error);
    }
}

// Safe view switcher with error handling
function safeShowView(view, params = {}) {
    try {
        showView(view, params);
    } catch (error) {
        console.error(`Error showing view ${view}:`, error);
        // Fallback to dashboard
        try {
            showView('dashboard');
        } catch (e) {
            fallbackDashboard();
        }
    }
}

// Main view controller with error handling
function showView(view, params = {}) {
    try {
        const content = document.getElementById('content');
        if (!content) {
            console.error('Content container not found');
            fallbackDashboard();
            return;
        }
        
        // Always remove colored navs when changing views
        removeColoredNav();
        
        switch(view) {
            case 'dashboard':
                showDashboard(content);
                break;
            case 'domain-menu':
                if (params.domainId) {
                    showDomainMenu(content, params.domainId);
                } else {
                    showDashboard(content);
                }
                break;
            case 'lessons':
                if (params.domainId) {
                    showLessonsList(content, params.domainId);
                } else {
                    showDashboard(content);
                }
                break;
            case 'lesson-viewer':
                if (params.lessonId) {
                    showLessonViewer(content, params.lessonId);
                } else {
                    showDashboard(content);
                }
                break;
            case 'simulations':
                showSimulations(content, params.domainId);
                break;
            case 'quiz':
                showQuiz(content, params);
                break;
            case 'remedial':
                showRemedial(content);
                break;
            default:
                showDashboard(content);
        }
    } catch (error) {
        console.error('Error in showView:', error);
        fallbackDashboard();
    }
}

// Fallback dashboard for critical errors
function fallbackDashboard() {
    try {
        let content = document.getElementById('content');
        if (!content) {
            // Try to create it
            const main = document.getElementById('main-content');
            if (main) {
                const newContent = document.createElement('div');
                newContent.id = 'content';
                main.appendChild(newContent);
                content = newContent;
            } else {
                console.error('Cannot find or create content container');
                return;
            }
        }
        
        content.innerHTML = `
            <div style="padding: 20px; color: #fafafa; background: #09090b;">
                <h1>Security+ Training Platform</h1>
                <p>Welcome to the training platform. Some features may be limited.</p>
                <button onclick="location.reload()" style="padding: 10px; margin-top: 20px; background: #27272a; color: #fafafa; border: none; border-radius: 6px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    } catch (e) {
        console.error('Critical error - cannot display fallback');
    }
}

// Show Dashboard with error handling
function showDashboard(container) {
    try {
        const completedLessons = (APP.progress && APP.progress.completedLessons) ? 
                                APP.progress.completedLessons.length : 0;
        const completedSims = (APP.progress && APP.progress.completedSimulations) ? 
                             APP.progress.completedSimulations.length : 0;
        const flaggedCount = (APP.progress && APP.progress.flaggedQuestions) ? 
                            APP.progress.flaggedQuestions.length : 0;
        
        container.innerHTML = `
            <div class="platform-container">
                <h1 class="page-title">Security+ Training Platform</h1>
                <p class="page-subtitle">Complete training for CompTIA Security+ SY0-701 certification</p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">250</div>
                        <div class="stat-label">Questions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${completedLessons}/41</div>
                        <div class="stat-label">Lessons</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${completedSims}/25</div>
                        <div class="stat-label">Simulations</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${flaggedCount}</div>
                        <div class="stat-label">Flagged</div>
                    </div>
                </div>
                
                <h2 style="margin-top: 40px; margin-bottom: 20px;">Select a Domain:</h2>
                
                <div class="domain-grid">
                    ${DOMAINS.map(domain => {
                        const lessons = ALL_LESSONS.filter(l => l.domain === domain.id);
                        const sims = ALL_SIMULATIONS.filter(s => s.domain === domain.id);
                        const completed = APP.progress.completedLessons ? 
                            lessons.filter(l => APP.progress.completedLessons.includes(l.id)).length : 0;
                        const progressPercent = lessons.length > 0 ? 
                            Math.round((completed/lessons.length)*100) : 0;
                        
                        return `
                            <div class="domain-card" onclick="safeShowView('domain-menu', {domainId: ${domain.id}})">
                                <div class="domain-icon">${domain.icon}</div>
                                <div class="domain-title">Domain ${domain.id}</div>
                                <div class="domain-subtitle">${domain.name}</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <div class="domain-stats">
                                    <span>${lessons.length} Lessons</span>
                                    <span>${sims.length} Simulations</span>
                                    <span>${Math.round(domain.weight * 100)}% Weight</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    
                    <div class="domain-card" onclick="safeAlert('Practice Test Coming Soon')">
                        <div class="domain-icon">📋</div>
                        <div class="domain-title">Practice Test</div>
                        <div class="domain-subtitle">Full Exam Simulation</div>
                        <div class="domain-stats">
                            <span>90 Questions</span>
                            <span>90 Minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing dashboard:', error);
        container.innerHTML = '<div class="platform-container"><h1>Dashboard</h1><p>Error loading dashboard</p></div>';
    }
}

// Show Domain Menu with error handling
function showDomainMenu(container, domainId) {
    try {
        const domain = DOMAINS.find(d => d.id === domainId);
        if (!domain) {
            console.error('Domain not found:', domainId);
            showDashboard(container);
            return;
        }
        
        const lessons = ALL_LESSONS.filter(l => l.domain === domainId);
        const sims = ALL_SIMULATIONS.filter(s => s.domain === domainId);
        
        container.innerHTML = `
            <div class="platform-container">
                <button class="back-btn" onclick="safeShowView('dashboard')">
                    ← Back to Dashboard
                </button>
                
                <h1 class="page-title">${domain.icon} Domain ${domain.id}: ${domain.name}</h1>
                <p class="page-subtitle">Choose your learning path</p>
                
                <div class="learning-menu">
                    <div class="menu-card" onclick="safeShowView('lessons', {domainId: ${domainId}})">
                        <div class="menu-icon">📚</div>
                        <h3>Lessons</h3>
                        <p>${lessons.length} topics</p>
                    </div>
                    
                    <div class="menu-card" onclick="safeShowView('simulations', {domainId: ${domainId}})">
                        <div class="menu-icon">🎮</div>
                        <h3>Simulations</h3>
                        <p>${sims.length} scenarios</p>
                    </div>
                    
                    <div class="menu-card" onclick="safeAlert('Domain Quiz Coming Soon')">
                        <div class="menu-icon">📝</div>
                        <h3>Domain Quiz</h3>
                        <p>25 questions</p>
                    </div>
                    
                    <div class="menu-card" onclick="safeAlert('Flash Cards Coming Soon')">
                        <div class="menu-icon">🎴</div>
                        <h3>Flash Cards</h3>
                        <p>Quick review</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing domain menu:', error);
        showDashboard(container);
    }
}

// Show Lessons List
function showLessonsList(container, domainId) {
    try {
        const domain = DOMAINS.find(d => d.id === domainId);
        if (!domain) {
            showDashboard(container);
            return;
        }
        
        const lessons = ALL_LESSONS.filter(l => l.domain === domainId);
        
        container.innerHTML = `
            <div class="platform-container">
                <button class="back-btn" onclick="safeShowView('domain-menu', {domainId: ${domainId}})">
                    ← Back to ${domain.name}
                </button>
                
                <h1 class="page-title">${domain.icon} Domain ${domainId} Lessons</h1>
                <p class="page-subtitle">${lessons.length} comprehensive lessons</p>
                
                <div class="lesson-list">
                    ${lessons.map(lesson => {
                        const isCompleted = APP.progress.completedLessons && 
                                          APP.progress.completedLessons.includes(lesson.id);
                        
                        return `
                            <div class="lesson-card" onclick="safeShowView('lesson-viewer', {lessonId: '${lesson.id}'})">
                                <div class="lesson-status">
                                    ${isCompleted ? '✅' : '📖'}
                                </div>
                                <div class="lesson-info">
                                    <div class="lesson-title">${lesson.title}</div>
                                    <div class="lesson-meta">
                                        ${isCompleted ? 'Completed' : 'Not started'} • 45-55 minutes
                                    </div>
                                </div>
                                <button class="btn">
                                    ${isCompleted ? 'Review' : 'Start'} →
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing lessons list:', error);
        showDashboard(container);
    }
}

// Show Lesson Viewer
function showLessonViewer(container, lessonId) {
    try {
        const lesson = ALL_LESSONS.find(l => l.id === lessonId);
        if (!lesson) {
            console.error('Lesson not found:', lessonId);
            showDashboard(container);
            return;
        }
        
        container.innerHTML = `
            <div class="platform-container">
                <button class="back-btn" onclick="safeShowView('lessons', {domainId: ${lesson.domain}})">
                    ← Back to Lessons
                </button>
                
                <h1 class="page-title">${lesson.title}</h1>
                <p class="page-subtitle">Domain ${lesson.domain} • Estimated time: 45-55 minutes</p>
                
                <div class="lesson-content" style="background: #18181b; border-radius: 8px; padding: 30px;">
                    <h2>Introduction</h2>
                    <p>Welcome to ${lesson.title}. This lesson covers essential concepts for the Security+ certification.</p>
                    
                    <h2 style="margin-top: 30px;">Key Concepts</h2>
                    <p>This lesson covers fundamental principles and best practices.</p>
                    
                    <h2 style="margin-top: 30px;">Practice Questions</h2>
                    <button class="btn" onclick="safeAlert('Practice quiz coming soon')">
                        Start Practice Quiz
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing lesson viewer:', error);
        showDashboard(container);
    }
}

// Show Simulations
function showSimulations(container, domainId) {
    try {
        const simulations = domainId 
            ? ALL_SIMULATIONS.filter(s => s.domain === domainId)
            : ALL_SIMULATIONS;
        
        const domain = domainId ? DOMAINS.find(d => d.id === domainId) : null;
        
        const backButton = domainId 
            ? `<button class="back-btn" onclick="safeShowView('domain-menu', {domainId: ${domainId}})">← Back to ${domain ? domain.name : 'Domain'}</button>`
            : `<button class="back-btn" onclick="safeShowView('dashboard')">← Back to Dashboard</button>`;
        
        container.innerHTML = `
            <div class="platform-container">
                ${backButton}
                
                <h1 class="page-title">🎮 Simulations ${domainId ? `- Domain ${domainId}` : '(All Domains)'}</h1>
                <p class="page-subtitle">${simulations.length} interactive scenarios</p>
                
                <div class="simulation-grid">
                    ${simulations.map(sim => {
                        const isCompleted = APP.progress.completedSimulations && 
                                          APP.progress.completedSimulations.includes(sim.id);
                        
                        return `
                            <div class="simulation-card" onclick="safeAlert('Simulation: ${sim.title}')">
                                <div class="sim-title">${sim.title}</div>
                                <div class="sim-scenario">${sim.scenario}</div>
                                <div class="sim-footer">
                                    <span class="sim-status">
                                        ${isCompleted ? '✅ Completed' : '⚪ Not started'}
                                    </span>
                                    <button class="btn">
                                        ${isCompleted ? 'Replay' : 'Start'} →
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing simulations:', error);
        showDashboard(container);
    }
}

// Show Quiz
function showQuiz(container, params) {
    try {
        container.innerHTML = `
            <div class="platform-container">
                <button class="back-btn" onclick="safeShowView('dashboard')">
                    ← Back
                </button>
                
                <h1 class="page-title">📝 Practice Quiz</h1>
                <p class="page-subtitle">Select a domain to practice</p>
                
                <div class="learning-menu">
                    ${DOMAINS.map(d => `
                        <div class="menu-card" onclick="safeAlert('Domain ${d.id} Quiz Coming Soon')">
                            <div class="menu-icon">${d.icon}</div>
                            <h3>Domain ${d.id}</h3>
                            <p>25 questions</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing quiz:', error);
        showDashboard(container);
    }
}

// Show Remedial
function showRemedial(container) {
    try {
        container.innerHTML = `
            <div class="platform-container">
                <button class="back-btn" onclick="safeShowView('dashboard')">
                    ← Back
                </button>
                
                <h1 class="page-title">🔧 Remedial Study</h1>
                <p class="page-subtitle">Focus on areas that need improvement</p>
                
                <div class="learning-menu">
                    <div class="menu-card" onclick="safeAlert('Review wrong answers')">
                        <div class="menu-icon">❌</div>
                        <h3>Wrong Answers</h3>
                        <p>Review mistakes</p>
                    </div>
                    
                    <div class="menu-card" onclick="safeAlert('Review flagged items')">
                        <div class="menu-icon">🚩</div>
                        <h3>Flagged Items</h3>
                        <p>0 questions</p>
                    </div>
                    
                    <div class="menu-card" onclick="safeAlert('Practice weak areas')">
                        <div class="menu-icon">🎯</div>
                        <h3>Weak Areas</h3>
                        <p>Targeted practice</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error showing remedial:', error);
        showDashboard(container);
    }
}

// Safe alert function
function safeAlert(message) {
    try {
        alert(message);
    } catch (e) {
        console.log('Alert:', message);
    }
}

// Save/Load Progress
function saveProgress() {
    try {
        if (APP && APP.progress) {
            localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
        }
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('securityPlusProgress');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                APP.progress = Object.assign(APP.progress, parsed);
            }
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

// Global functions
window.safeShowView = safeShowView;
window.safeAlert = safeAlert;
window.showView = safeShowView;

// Log successful load
console.log('✅ Security+ Platform v19 GHPages Fixed - Ready!');
console.log('✅ All syntax errors fixed');
console.log('✅ GitHub Pages compatible');
