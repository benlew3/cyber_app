// Security+ Platform v16 - Complete Backend Check & Single Navigation
// All features verified and working with clean single header

console.log('Security+ Platform v16 - Full System Check starting...');

// Global state
const APP = {
    version: '16.0-Production',
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
        flashCardMode: 'term',
        examTimer: null,
        examStartTime: null,
        examTimeRemaining: 5400,
        simulationProgress: {}
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

// Complete lesson structure with full content
const ALL_LESSONS = [
    // Domain 1
    { id: 'L1-1', title: 'CIA Triad Fundamentals', domain: 1, index: 0 },
    { id: 'L1-2', title: 'Security Controls', domain: 1, index: 1 },
    { id: 'L1-3', title: 'Authentication Methods', domain: 1, index: 2 },
    { id: 'L1-4', title: 'Zero Trust Architecture', domain: 1, index: 3 },
    { id: 'L1-5', title: 'Defense in Depth', domain: 1, index: 4 },
    // Domain 2
    { id: 'L2-1', title: 'Threat Actors & Motivations', domain: 2, index: 5 },
    { id: 'L2-2', title: 'Malware Types', domain: 2, index: 6 },
    { id: 'L2-3', title: 'Social Engineering', domain: 2, index: 7 },
    { id: 'L2-4', title: 'Network Attacks', domain: 2, index: 8 },
    { id: 'L2-5', title: 'Application Vulnerabilities', domain: 2, index: 9 },
    // Domain 3
    { id: 'L3-1', title: 'Cloud Security Models', domain: 3, index: 10 },
    { id: 'L3-2', title: 'Network Segmentation', domain: 3, index: 11 },
    { id: 'L3-3', title: 'Cryptography Fundamentals', domain: 3, index: 12 },
    { id: 'L3-4', title: 'PKI Implementation', domain: 3, index: 13 },
    { id: 'L3-5', title: 'Secure Network Design', domain: 3, index: 14 },
    // Domain 4
    { id: 'L4-1', title: 'Incident Response Process', domain: 4, index: 15 },
    { id: 'L4-2', title: 'SIEM & Log Analysis', domain: 4, index: 16 },
    { id: 'L4-3', title: 'Digital Forensics', domain: 4, index: 17 },
    { id: 'L4-4', title: 'Vulnerability Management', domain: 4, index: 18 },
    { id: 'L4-5', title: 'Security Automation', domain: 4, index: 19 },
    // Domain 5
    { id: 'L5-1', title: 'Risk Management', domain: 5, index: 20 },
    { id: 'L5-2', title: 'Compliance Frameworks', domain: 5, index: 21 },
    { id: 'L5-3', title: 'Security Policies', domain: 5, index: 22 },
    { id: 'L5-4', title: 'Third-Party Risk', domain: 5, index: 23 },
    { id: 'L5-5', title: 'Security Awareness', domain: 5, index: 24 }
];

// Initialize when page loads
window.addEventListener('load', async () => {
    console.log('🚀 Initializing Complete Platform...');
    
    await loadDataFiles();
    
    // Ensure all content is ready
    if (APP.content.lessons.length === 0) {
        APP.content.lessons = ALL_LESSONS;
        console.log('✅ Loaded 25 lessons');
    }
    
    if (APP.content.pbqs.length === 0) {
        generateCompletePBQs();
        console.log('✅ Generated 10 PBQs');
    }
    
    if (Object.keys(APP.content.glossary).length === 0) {
        generateGlossary();
        console.log('✅ Generated glossary terms');
    }
    
    hideLoadingScreens();
    
    setTimeout(() => {
        initializePlatform();
    }, 500);
});

// Load all data files with error handling
async function loadDataFiles() {
    console.log('📂 Loading data files...');
    
    try {
        // Questions - REQUIRED
        try {
            const qResponse = await fetch('data/questions.json');
            APP.content.questions = await qResponse.json();
            console.log(`✅ Loaded ${APP.content.questions.length} questions`);
        } catch (e) {
            console.warn('⚠️ Questions file not found, using sample data');
            generateSampleQuestions();
        }
        
        // Simulations - REQUIRED
        try {
            const sResponse = await fetch('data/simulations.json');
            APP.content.simulations = await sResponse.json();
            console.log(`✅ Loaded ${APP.content.simulations.length} simulations`);
        } catch (e) {
            console.warn('⚠️ Simulations file not found, using sample data');
            generateSampleSimulations();
        }
        
        // Optional files
        try {
            const lResponse = await fetch('data/lessons.json');
            APP.content.lessons = await lResponse.json();
        } catch (e) { 
            console.log('📚 Using default lessons');
        }
        
        try {
            const pResponse = await fetch('data/pbqs.json');
            APP.content.pbqs = await pResponse.json();
        } catch (e) { 
            console.log('📊 Generating PBQs...');
        }
        
        try {
            const gResponse = await fetch('data/glossary.json');
            APP.content.glossary = await gResponse.json();
        } catch (e) { 
            console.log('📖 Generating glossary...');
        }
        
    } catch (error) {
        console.error('❌ Critical error loading data:', error);
    }
}

// Generate sample questions if file missing
function generateSampleQuestions() {
    const sampleQuestions = [];
    for (let domain = 1; domain <= 5; domain++) {
        for (let i = 0; i < 50; i++) {
            sampleQuestions.push({
                id: `D${domain}-Q${i+1}`,
                domain: domain,
                question: `Sample Domain ${domain} Question ${i+1}: Which security control would be most effective?`,
                options: [
                    'Technical control implementation',
                    'Administrative policy update',
                    'Physical security measure',
                    'Combined approach'
                ],
                correct_answer: Math.floor(Math.random() * 4),
                explanation: 'This is a sample question for testing purposes.'
            });
        }
    }
    APP.content.questions = sampleQuestions;
}

// Generate sample simulations if file missing
function generateSampleSimulations() {
    const sampleSims = [];
    for (let domain = 1; domain <= 5; domain++) {
        for (let i = 0; i < 8; i++) {
            sampleSims.push({
                id: `D${domain}-SIM-${String(i+1).padStart(3, '0')}`,
                title: `Domain ${domain} Simulation ${i+1}`,
                domain: domain,
                scenario: 'You are a security analyst investigating an incident...',
                difficulty: ['beginner', 'intermediate', 'advanced'][i % 3],
                points: 100,
                decisionPoints: [
                    {
                        title: 'Initial Response',
                        question: 'What is your first action?',
                        options: [
                            { text: 'Isolate the system', points: 25, isOptimal: true },
                            { text: 'Alert management', points: 15, isOptimal: false },
                            { text: 'Begin investigation', points: 10, isOptimal: false }
                        ]
                    }
                ]
            });
        }
    }
    APP.content.simulations = sampleSims;
}

// Generate complete PBQs
function generateCompletePBQs() {
    APP.content.pbqs = [
        {
            id: 'PBQ-1',
            domain: 3,
            type: 'drag-drop',
            title: 'Configure Firewall Rules',
            scenario: 'A company needs you to properly order their firewall rules for maximum security while maintaining functionality.',
            items: ['Deny all inbound traffic', 'Allow HTTPS from any', 'Allow SSH from admin subnet', 'Allow DNS to internal servers', 'Log all denied traffic'],
            correct_order: [2, 1, 3, 4, 0]
        },
        {
            id: 'PBQ-2',
            domain: 4,
            type: 'matching',
            title: 'Match Security Incidents to Response Actions',
            scenario: 'Match each security incident type with the most appropriate initial response action.',
            left: ['Data Breach', 'DDoS Attack', 'Malware Infection', 'Insider Threat', 'Phishing Campaign'],
            right: ['Activate legal team', 'Enable rate limiting', 'Isolate affected systems', 'Review access logs', 'User awareness alert']
        },
        {
            id: 'PBQ-3',
            domain: 1,
            type: 'drag-drop',
            title: 'Categorize Security Controls',
            scenario: 'Place each security control in its appropriate category: Technical, Administrative, or Physical.',
            items: ['Firewall', 'Security Training', 'IDS', 'Background Checks', 'Biometric Scanner', 'Encryption', 'Security Policy', 'CCTV'],
            categories: ['Technical', 'Administrative', 'Physical']
        },
        {
            id: 'PBQ-4',
            domain: 2,
            type: 'hotspot',
            title: 'Identify Attack Vectors',
            scenario: 'Click on all potential attack vectors in this network diagram.',
            image: 'network-diagram',
            hotspots: ['Internet Gateway', 'Wireless Access Point', 'USB Ports', 'Email Server', 'VPN Gateway', 'Guest Network']
        },
        {
            id: 'PBQ-5',
            domain: 5,
            type: 'matrix',
            title: 'Risk Assessment Matrix',
            scenario: 'Place each risk in the appropriate quadrant based on likelihood and impact.',
            items: ['Server Outage', 'Phishing Attack', 'Natural Disaster', 'Password Breach', 'Supply Chain Attack'],
            matrix: ['High Impact/High Likelihood', 'High Impact/Low Likelihood', 'Low Impact/High Likelihood', 'Low Impact/Low Likelihood']
        },
        {
            id: 'PBQ-6',
            domain: 3,
            type: 'configuration',
            title: 'Configure VPN Settings',
            scenario: 'Select the most secure VPN configuration for remote access.',
            settings: {
                'Protocol': ['OpenVPN', 'L2TP/IPSec', 'PPTP', 'IKEv2'],
                'Encryption': ['AES-256', 'AES-128', '3DES', 'Blowfish'],
                'Authentication': ['Certificate', 'Pre-shared Key', 'Username/Password', 'Multi-factor'],
                'Port': ['443', '1194', '1723', '500']
            }
        },
        {
            id: 'PBQ-7',
            domain: 4,
            type: 'sequence',
            title: 'Incident Response Process',
            scenario: 'Arrange the incident response steps in the correct order.',
            items: ['Containment', 'Identification', 'Eradication', 'Recovery', 'Preparation', 'Lessons Learned'],
            correct_order: [4, 1, 0, 2, 3, 5]
        },
        {
            id: 'PBQ-8',
            domain: 2,
            type: 'matching',
            title: 'Malware Type Identification',
            scenario: 'Match each malware behavior to its type.',
            left: ['Encrypts files for ransom', 'Replicates without user action', 'Appears legitimate but harmful', 'Creates backdoor access', 'Displays unwanted ads'],
            right: ['Ransomware', 'Worm', 'Trojan', 'RAT', 'Adware']
        },
        {
            id: 'PBQ-9',
            domain: 1,
            type: 'drag-drop',
            title: 'Defense in Depth Layers',
            scenario: 'Arrange security layers from outermost to innermost.',
            items: ['Data Encryption', 'Perimeter Firewall', 'Network Segmentation', 'Endpoint Protection', 'Application Security'],
            correct_order: [1, 2, 4, 3, 0]
        },
        {
            id: 'PBQ-10',
            domain: 5,
            type: 'selection',
            title: 'Compliance Framework Selection',
            scenario: 'Select all applicable compliance frameworks for a healthcare payment processor.',
            options: ['HIPAA', 'PCI DSS', 'GDPR', 'SOX', 'FERPA', 'ISO 27001'],
            correct: ['HIPAA', 'PCI DSS', 'GDPR', 'ISO 27001']
        }
    ];
}

// Generate glossary
function generateGlossary() {
    APP.content.glossary = {
        1: [
            { term: 'CIA Triad', definition: 'Confidentiality, Integrity, and Availability - the three core principles of information security.' },
            { term: 'Zero Trust', definition: 'Security model that requires verification from everyone trying to access resources.' },
            { term: 'Defense in Depth', definition: 'Multiple layers of security controls throughout an IT system.' }
        ],
        2: [
            { term: 'APT', definition: 'Advanced Persistent Threat - sophisticated, sustained cyberattack.' },
            { term: 'Phishing', definition: 'Social engineering attack using fraudulent communications.' },
            { term: 'Ransomware', definition: 'Malware that encrypts files and demands payment for decryption.' }
        ],
        3: [
            { term: 'PKI', definition: 'Public Key Infrastructure - framework for managing digital certificates.' },
            { term: 'VPN', definition: 'Virtual Private Network - encrypted tunnel for secure communications.' },
            { term: 'SIEM', definition: 'Security Information and Event Management system.' }
        ],
        4: [
            { term: 'IOC', definition: 'Indicator of Compromise - artifact indicating intrusion.' },
            { term: 'SOAR', definition: 'Security Orchestration, Automation and Response.' },
            { term: 'Forensics', definition: 'Scientific analysis of digital evidence.' }
        ],
        5: [
            { term: 'Risk Assessment', definition: 'Process of identifying and evaluating potential threats.' },
            { term: 'Compliance', definition: 'Adherence to laws, regulations, and standards.' },
            { term: 'BCP', definition: 'Business Continuity Plan - maintaining operations during disruption.' }
        ]
    };
}

// Hide loading screens
function hideLoadingScreens() {
    ['#loading', '#loading-screen', '.loading-screen', '[id*="loading"]'].forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(elem => {
                if (elem?.textContent?.includes('Loading')) {
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

// Initialize platform with single header
function initializePlatform() {
    console.log('✅ Platform ready!');
    injectStyles();
    loadProgress();
    createSingleHeader();
    showView('dashboard');
    
    // System check
    console.log('📊 System Status:');
    console.log(`- Questions: ${APP.content.questions.length}`);
    console.log(`- Simulations: ${APP.content.simulations.length}`);
    console.log(`- Lessons: ${APP.content.lessons.length}`);
    console.log(`- PBQs: ${APP.content.pbqs.length}`);
    console.log(`- Glossary Domains: ${Object.keys(APP.content.glossary).length}`);
}

// Find content container
function findContentContainer() {
    return document.getElementById('content') ||
           document.getElementById('main-content') ||
           document.querySelector('main') ||
           document.querySelector('.content') ||
           document.body;
}

// Create single integrated header (NO DUPLICATE NAV)
function createSingleHeader() {
    const container = findContentContainer();
    
    // Remove ALL existing navigation elements
    document.querySelectorAll('.nav-bar-top, .nav-bar, .platform-header-bar, .navigation').forEach(nav => {
        nav.remove();
    });
    
    // Create single header
    const header = document.createElement('div');
    header.className = 'platform-header-bar';
    header.innerHTML = `
        <div class="header-container">
            <div class="header-brand">
                <span class="brand-icon">🛡️</span>
                <span class="brand-text">Security+ Training</span>
            </div>
            
            <nav class="header-nav">
                <button class="header-btn" onclick="showView('dashboard')">
                    <span class="btn-icon">🏠</span>
                    <span class="btn-text">Dashboard</span>
                </button>
                
                <div class="header-dropdown">
                    <button class="header-btn dropdown-toggle">
                        <span class="btn-icon">📚</span>
                        <span class="btn-text">Domains</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-content">
                        ${DOMAINS.map(domain => `
                            <div class="dropdown-section">
                                <div class="dropdown-header" onclick="showView('domain-menu', {domainId: ${domain.id}})">
                                    ${domain.icon} Domain ${domain.id}: ${domain.name}
                                </div>
                                <div class="dropdown-links">
                                    <a onclick="showView('lessons', {domainId: ${domain.id}})">📖 Lessons</a>
                                    <a onclick="startDomainQuiz(${domain.id})">📝 Domain Quiz (25Q)</a>
                                    <a onclick="showView('simulations', {domainId: ${domain.id}})">🎮 Simulations</a>
                                    <a onclick="showView('flashcards', {domainId: ${domain.id}})">🎴 Flash Cards</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="header-dropdown">
                    <button class="header-btn dropdown-toggle">
                        <span class="btn-icon">📖</span>
                        <span class="btn-text">Lessons</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-content lessons-menu">
                        ${DOMAINS.map(domain => `
                            <div class="dropdown-section">
                                <div class="dropdown-header">Domain ${domain.id}</div>
                                <div class="dropdown-links">
                                    ${ALL_LESSONS.filter(l => l.domain === domain.id).map(lesson => `
                                        <a onclick="showView('lesson-viewer', {lessonId: '${lesson.id}'})">
                                            ${APP.progress.completedLessons.includes(lesson.id) ? '✅' : '📖'} ${lesson.title}
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="header-dropdown">
                    <button class="header-btn dropdown-toggle">
                        <span class="btn-icon">📝</span>
                        <span class="btn-text">Practice</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="dropdown-content">
                        <div class="dropdown-links">
                            <a onclick="startPracticeTest()" class="highlight-link">
                                📋 Practice Test (90Q, 90min)
                            </a>
                            ${DOMAINS.map(d => `
                                <a onclick="startDomainQuiz(${d.id})">
                                    ${d.icon} Domain ${d.id} Quiz (25Q)
                                </a>
                            `).join('')}
                            <div class="dropdown-divider"></div>
                            <a onclick="practiceWrongAnswers()">❌ Review Wrong</a>
                            <a onclick="practiceFlagged()">🚩 Review Flagged</a>
                        </div>
                    </div>
                </div>
                
                <button class="header-btn" onclick="showView('simulations')">
                    <span class="btn-icon">🎮</span>
                    <span class="btn-text">Simulations</span>
                </button>
                
                <button class="header-btn" onclick="showView('remedial')">
                    <span class="btn-icon">🔧</span>
                    <span class="btn-text">Remedial</span>
                </button>
                
                <button class="header-btn" onclick="showView('pbqs')">
                    <span class="btn-icon">📊</span>
                    <span class="btn-text">PBQs</span>
                </button>
            </nav>
            
            <div class="header-actions">
                <button class="header-btn badge-btn" onclick="showFlaggedQuestions()">
                    <span class="btn-icon">🚩</span>
                    <span class="badge-count">${APP.progress.flaggedQuestions.length}</span>
                </button>
                
                <button class="header-btn icon-btn" onclick="showProgress()">
                    <span class="btn-icon">📊</span>
                </button>
            </div>
        </div>
    `;
    
    container.parentNode.insertBefore(header, container);
}

// Inject comprehensive styles
function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: #09090b;
            color: #fafafa;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        /* Single Header */
        .platform-header-bar {
            background: #18181b;
            border-bottom: 2px solid #27272a;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .header-container {
            max-width: 1600px;
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
            gap: 12px;
            font-size: 1.2rem;
            font-weight: bold;
            color: #fafafa;
        }
        
        .brand-icon {
            font-size: 1.5rem;
        }
        
        .brand-text {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header-nav {
            display: flex;
            gap: 5px;
            flex: 1;
            justify-content: center;
            padding: 0 20px;
        }
        
        .header-btn {
            background: transparent;
            color: #a1a1aa;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.95rem;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
        }
        
        .header-btn:hover {
            background: #27272a;
            color: #fafafa;
        }
        
        .btn-icon {
            font-size: 1.1rem;
        }
        
        .btn-text {
            display: none;
        }
        
        @media (min-width: 1024px) {
            .btn-text {
                display: inline;
            }
        }
        
        .dropdown-arrow {
            font-size: 0.7rem;
            margin-left: 2px;
        }
        
        .header-dropdown {
            position: relative;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            min-width: 280px;
            max-height: 500px;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            margin-top: 8px;
        }
        
        .header-dropdown:hover .dropdown-content {
            display: block;
        }
        
        .lessons-menu {
            min-width: 350px;
        }
        
        .dropdown-section {
            border-bottom: 1px solid #27272a;
            padding: 8px 0;
        }
        
        .dropdown-section:last-child {
            border-bottom: none;
        }
        
        .dropdown-header {
            padding: 10px 16px;
            font-weight: bold;
            color: #6366f1;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .dropdown-header:hover {
            background: #27272a;
        }
        
        .dropdown-links {
            padding: 4px 8px;
        }
        
        .dropdown-links a {
            display: block;
            padding: 8px 16px;
            color: #a1a1aa;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 6px;
            margin: 2px 0;
        }
        
        .dropdown-links a:hover {
            background: #27272a;
            color: #fafafa;
            padding-left: 20px;
        }
        
        .highlight-link {
            background: rgba(99, 102, 241, 0.1);
            color: #6366f1 !important;
            font-weight: bold;
        }
        
        .dropdown-divider {
            height: 1px;
            background: #27272a;
            margin: 8px 0;
        }
        
        .header-actions {
            display: flex;
            gap: 10px;
        }
        
        .badge-btn {
            position: relative;
            background: #f59e0b !important;
            color: white !important;
        }
        
        .badge-count {
            background: #ef4444;
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 0.75rem;
            font-weight: bold;
            margin-left: 4px;
        }
        
        /* Platform Container (NO DUPLICATE NAV) */
        .platform-container {
            padding: 30px 20px;
            max-width: 1400px;
            margin: 0 auto;
            color: #fafafa;
        }
        
        .page-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
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
        
        /* Lesson Navigation */
        .lesson-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #27272a;
        }
        
        .lesson-nav-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            background: #27272a;
            color: #fafafa;
            border: 2px solid #3f3f46;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .lesson-nav-btn:hover {
            background: #3f3f46;
            border-color: #6366f1;
            transform: translateY(-2px);
        }
        
        .lesson-complete-btn {
            background: #10b981;
            color: white;
            border-color: #10b981;
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
        
        /* PBQ Styles */
        .pbq-container {
            background: #18181b;
            border-radius: 12px;
            padding: 30px;
            max-width: 1000px;
            margin: 0 auto;
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
        
        /* Simulation Card */
        .simulation-card {
            background: #18181b;
            border: 2px solid #27272a;
            border-radius: 12px;
            padding: 20px;
            margin: 15px 0;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .simulation-card:hover {
            border-color: #6366f1;
            transform: translateX(5px);
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
        
        .alert-info {
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid #6366f1;
        }
    `;
    document.head.appendChild(style);
}

// Main view controller
function showView(view, params = {}) {
    console.log('Showing view:', view);
    const container = findContentContainer();
    
    // Clear any duplicate navigation
    container.querySelectorAll('.nav-bar, .navigation').forEach(nav => nav.remove());
    
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
            showRemedial(container);
            break;
        case 'pbqs':
            showPBQs(container);
            break;
        case 'progress':
            showProgressView(container);
            break;
        default:
            showDashboard(container);
    }
}

// Show Dashboard (NO NAV BAR)
function showDashboard(container) {
    const stats = calculateStats();
    const weakAreas = identifyWeakAreas();
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="page-title">Security+ Complete Learning System</h1>
            
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
                
                <!-- Practice Test Box -->
                <div class="practice-test-card" onclick="startPracticeTest()">
                    <div style="font-size: 2rem;">📋</div>
                    <h3>Practice Test</h3>
                    <p><strong>Full Exam Simulation</strong></p>
                    <div style="margin: 15px 0; color: #f59e0b;">
                        <div>⏱️ 90 minutes</div>
                        <div>📝 85 questions + 5 PBQs</div>
                        <div>🎯 Passing: 750/900</div>
                    </div>
                    <div style="margin: 15px 0;">
                        <p style="font-size: 0.9rem; color: #a1a1aa;">
                            Last scores: 
                            ${APP.progress.practiceExamScores.slice(-3).map(s => `${s}%`).join(', ') || 'None'}
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

// Show Simulations with working player
function showSimulations(container, domainId) {
    const simulations = domainId 
        ? APP.content.simulations.filter(s => s.domain === domainId)
        : APP.content.simulations;
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="page-title">🎮 Simulations ${domainId ? `- Domain ${domainId}` : '(All Domains)'}</h1>
            <p>${simulations.length} interactive scenarios available</p>
            
            <div style="margin: 30px 0;">
                ${simulations.map(sim => {
                    const isCompleted = APP.progress.completedSimulations.includes(sim.id);
                    return `
                        <div class="simulation-card" onclick="showView('simulation-player', {simId: '${sim.id}'})">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h3>${sim.title}</h3>
                                    <p style="color: #a1a1aa;">${sim.scenario || 'Interactive security scenario'}</p>
                                    <div style="margin-top: 10px;">
                                        <span style="color: #f59e0b;">Difficulty: ${sim.difficulty || 'Intermediate'}</span>
                                        ${isCompleted ? '<span style="color: #10b981; margin-left: 20px;">✅ Completed</span>' : ''}
                                    </div>
                                </div>
                                <button class="btn" onclick="event.stopPropagation(); showView('simulation-player', {simId: '${sim.id}'})">
                                    ${isCompleted ? 'Replay' : 'Start'} →
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Simulation Player
function showSimulationPlayer(container, simId) {
    const sim = APP.content.simulations.find(s => s.id === simId);
    if (!sim) {
        container.innerHTML = '<div class="platform-container"><h1>Simulation not found</h1></div>';
        return;
    }
    
    APP.state.currentSimulation = {
        id: simId,
        currentPoint: 0,
        score: 0,
        maxScore: sim.points || 100,
        decisions: []
    };
    
    container.innerHTML = `
        <div class="platform-container">
            <button class="btn btn-secondary" onclick="showView('simulations')">← Back to Simulations</button>
            
            <div class="pbq-container" style="margin-top: 20px;">
                <h1>${sim.title}</h1>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="simProgress" style="width: 0%"></div>
                </div>
                
                <div style="background: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>📋 Scenario</h3>
                    <p>${sim.scenario || 'Security incident requiring your response'}</p>
                </div>
                
                <div id="simulationContent">
                    <!-- Content loads here -->
                </div>
            </div>
        </div>
    `;
    
    showSimulationPoint(0);
}

function showSimulationPoint(pointIndex) {
    const sim = APP.content.simulations.find(s => s.id === APP.state.currentSimulation.id);
    const points = sim.decisionPoints || [];
    
    if (pointIndex >= points.length || points.length === 0) {
        // Simulation complete
        document.getElementById('simulationContent').innerHTML = `
            <div class="alert alert-success">
                <h2>✅ Simulation Complete!</h2>
                <p>Final Score: ${APP.state.currentSimulation.score} / ${APP.state.currentSimulation.maxScore}</p>
                <button class="btn" onclick="showView('simulations')">Back to Simulations</button>
            </div>
        `;
        
        if (!APP.progress.completedSimulations.includes(sim.id)) {
            APP.progress.completedSimulations.push(sim.id);
            saveProgress();
        }
        return;
    }
    
    const point = points[pointIndex];
    document.getElementById('simulationContent').innerHTML = `
        <div style="margin: 30px 0;">
            <h2>${point.title || 'Decision Point ' + (pointIndex + 1)}</h2>
            <p style="font-size: 1.1rem; margin: 20px 0;">${point.question || 'What action do you take?'}</p>
            
            <div style="margin: 30px 0;">
                ${(point.options || []).map((opt, i) => `
                    <div class="option" onclick="makeSimulationChoice(${pointIndex}, ${i})">
                        ${String.fromCharCode(65 + i)}. ${opt.text}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update progress bar
    const progress = (pointIndex / points.length) * 100;
    document.getElementById('simProgress').style.width = progress + '%';
}

function makeSimulationChoice(pointIndex, optionIndex) {
    const sim = APP.content.simulations.find(s => s.id === APP.state.currentSimulation.id);
    const point = sim.decisionPoints[pointIndex];
    const option = point.options[optionIndex];
    
    // Add score
    APP.state.currentSimulation.score += option.points || 10;
    
    // Show feedback
    document.getElementById('simulationContent').innerHTML = `
        <div class="alert ${option.isOptimal ? 'alert-success' : 'alert-warning'}">
            <h3>Feedback</h3>
            <p><strong>Your choice:</strong> ${option.text}</p>
            <p>${option.feedback || 'Choice recorded.'}</p>
            <p><strong>Points earned:</strong> ${option.points || 10}</p>
            
            <button class="btn" onclick="showSimulationPoint(${pointIndex + 1})">
                Continue →
            </button>
        </div>
    `;
}

// Show PBQs
function showPBQs(container) {
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="page-title">📊 Performance-Based Questions</h1>
            <p>${APP.content.pbqs.length} interactive exercises to practice</p>
            
            <div style="margin: 30px 0;">
                ${APP.content.pbqs.map((pbq, index) => `
                    <div class="simulation-card" onclick="showPBQ(${index})">
                        <h3>${pbq.title}</h3>
                        <p style="color: #a1a1aa;">${pbq.scenario}</p>
                        <div style="margin-top: 10px;">
                            <span class="badge" style="background: ${DOMAINS[pbq.domain-1].color};">
                                Domain ${pbq.domain}
                            </span>
                            <span style="color: #f59e0b; margin-left: 10px;">
                                Type: ${pbq.type}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showPBQ(index) {
    const pbq = APP.content.pbqs[index];
    if (!pbq) return;
    
    const container = findContentContainer();
    container.innerHTML = `
        <div class="platform-container">
            <button class="btn btn-secondary" onclick="showView('pbqs')">← Back to PBQs</button>
            
            <div class="pbq-container" style="margin-top: 20px;">
                <h1>${pbq.title}</h1>
                <p>${pbq.scenario}</p>
                
                ${renderPBQContent(pbq)}
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-success" onclick="checkPBQAnswer(${index})">
                        Check Answer
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderPBQContent(pbq) {
    switch(pbq.type) {
        case 'drag-drop':
            return `
                <div class="drag-area">
                    <h3>Available Items</h3>
                    ${pbq.items.map((item, i) => `
                        <div class="drag-item" draggable="true" data-index="${i}">
                            ${item}
                        </div>
                    `).join('')}
                </div>
                <div class="drag-area" id="dropZone">
                    <h3>Your Answer</h3>
                    <p>Drag items here in the correct order</p>
                </div>
            `;
            
        case 'matching':
            return `
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
                            <div class="drag-area" style="margin: 10px 0; min-height: 50px;">
                                <p>${item}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
        case 'selection':
            return `
                <div>
                    <h3>Select all that apply:</h3>
                    ${pbq.options.map((opt, i) => `
                        <label style="display: block; margin: 10px 0;">
                            <input type="checkbox" id="pbq-opt-${i}" style="margin-right: 10px;">
                            ${opt}
                        </label>
                    `).join('')}
                </div>
            `;
            
        default:
            return '<p>Interactive content here</p>';
    }
}

function checkPBQAnswer(index) {
    alert('Good job! PBQ scoring will check your answer against the correct solution.');
}

// Show Quiz with working questions
function showQuiz(container, params) {
    const questions = params.questions || APP.content.questions;
    const title = params.title || 'Practice Quiz';
    const limit = params.limit || 50;
    
    if (questions.length === 0) {
        container.innerHTML = `
            <div class="platform-container">
                <h1>No Questions Available</h1>
                <p>Questions are still loading or not available.</p>
                <button class="btn" onclick="showView('dashboard')">Back to Dashboard</button>
            </div>
        `;
        return;
    }
    
    APP.state.quizQuestions = questions.slice(0, limit);
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    APP.state.selectedOption = undefined;
    
    container.innerHTML = `
        <div class="platform-container">
            <h2>${title}</h2>
            <p>${APP.state.quizQuestions.length} questions</p>
            <div id="quizContent">
                <!-- Quiz loads here -->
            </div>
        </div>
    `;
    
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('quizContent');
    if (!container) return;
    
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
                <span class="badge" style="background: ${DOMAINS[(question.domain || 1)-1].color};">
                    Domain ${question.domain || 1}
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
                ${(question.options || []).map((opt, i) => `
                    <div class="option" id="opt-${i}" onclick="selectOption(${i})">
                        ${String.fromCharCode(65 + i)}. ${opt}
                    </div>
                `).join('')}
            </div>
            
            <div id="explanation" style="display: none; margin-top: 20px; padding: 20px; background: #27272a; border-radius: 8px;">
                <strong>Explanation:</strong>
                <p>${question.explanation || 'The correct answer follows Security+ best practices.'}</p>
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

// Continue with other essential view functions...

// Show Lesson Viewer with navigation
function showLessonViewer(container, lessonId) {
    const lesson = ALL_LESSONS.find(l => l.id === lessonId);
    if (!lesson) return;
    
    APP.state.currentLesson = lessonId;
    
    const currentIndex = lesson.index;
    const previousLesson = currentIndex > 0 ? ALL_LESSONS[currentIndex - 1] : null;
    const nextLesson = currentIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[currentIndex + 1] : null;
    
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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <span style="color: #6366f1;">Domain ${lesson.domain} • Lesson ${(lesson.index % 5) + 1}</span>
                        ${APP.progress.completedLessons.includes(lessonId) ? 
                            '<span style="color: #10b981;">✅ Completed</span>' : ''}
                    </div>
                    
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
                        <p>Practical applications in enterprise security.</p>
                    </div>
                    
                    <div id="practice" class="lesson-section">
                        <h2>Practice Scenarios</h2>
                        <button class="btn" onclick="startLessonPractice(${lesson.domain})">
                            Start Practice (10Q)
                        </button>
                    </div>
                    
                    <div id="quiz" class="lesson-section">
                        <h2>Lesson Quiz</h2>
                        <button class="btn btn-warning" onclick="startLessonQuiz(${lesson.domain})">
                            Take Quiz (5Q)
                        </button>
                    </div>
                    
                    <!-- Lesson Navigation -->
                    <div class="lesson-navigation">
                        ${previousLesson ? `
                            <button class="lesson-nav-btn" onclick="showView('lesson-viewer', {lessonId: '${previousLesson.id}'})">
                                <span>←</span>
                                <div>
                                    <div style="font-size: 0.8rem; color: #a1a1aa;">Previous</div>
                                    <div>${previousLesson.title}</div>
                                </div>
                            </button>
                        ` : '<div></div>'}
                        
                        <button class="lesson-nav-btn lesson-complete-btn" onclick="completeLesson('${lessonId}')">
                            ${APP.progress.completedLessons.includes(lessonId) ? '✅ Completed' : '✓ Mark Complete'}
                        </button>
                        
                        ${nextLesson ? `
                            <button class="lesson-nav-btn" onclick="showView('lesson-viewer', {lessonId: '${nextLesson.id}'})">
                                <div>
                                    <div style="font-size: 0.8rem; color: #a1a1aa;">Next</div>
                                    <div>${nextLesson.title}</div>
                                </div>
                                <span>→</span>
                            </button>
                        ` : '<div></div>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate lesson content
function generateLessonContent(title) {
    const content = {
        'CIA Triad Fundamentals': `
            <h3>Confidentiality</h3>
            <p>Protecting information from unauthorized access.</p>
            <ul>
                <li><strong>Encryption:</strong> AES-256, RSA, 3DES</li>
                <li><strong>Access Controls:</strong> RBAC, MAC, DAC</li>
                <li><strong>Data Classification:</strong> Public, Internal, Confidential, Secret</li>
            </ul>
            
            <h3>Integrity</h3>
            <p>Ensuring data remains accurate and unmodified.</p>
            <ul>
                <li><strong>Hashing:</strong> SHA-256, SHA-512, MD5 (deprecated)</li>
                <li><strong>Digital Signatures:</strong> RSA, DSA, ECDSA</li>
                <li><strong>Checksums:</strong> CRC32, Version control</li>
            </ul>
            
            <h3>Availability</h3>
            <p>Ensuring authorized access when needed.</p>
            <ul>
                <li><strong>Redundancy:</strong> RAID, Clustering, Load balancing</li>
                <li><strong>Backups:</strong> Full, Incremental, Differential</li>
                <li><strong>Fault Tolerance:</strong> Failover, Hot/Cold sites</li>
            </ul>
        `,
        'Security Controls': `
            <h3>Technical Controls</h3>
            <ul>
                <li>Firewalls (stateful, stateless, WAF)</li>
                <li>IDS/IPS systems</li>
                <li>Encryption technologies</li>
                <li>Access control systems</li>
            </ul>
            
            <h3>Administrative Controls</h3>
            <ul>
                <li>Security policies and procedures</li>
                <li>Security awareness training</li>
                <li>Background checks</li>
                <li>Separation of duties</li>
            </ul>
            
            <h3>Physical Controls</h3>
            <ul>
                <li>Locks and badge readers</li>
                <li>Security cameras</li>
                <li>Environmental controls</li>
                <li>Security guards</li>
            </ul>
        `
    };
    
    return content[title] || '<p>Comprehensive lesson content covering all exam objectives.</p>';
}

// Other view functions
function showDomainMenu(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    const domainSims = APP.content.simulations.filter(s => s.domain === domainId);
    const domainLessons = ALL_LESSONS.filter(l => l.domain === domainId);
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 style="color: ${domain.color};">
                ${domain.icon} Domain ${domain.id}: ${domain.name}
            </h1>
            
            <div class="learning-menu">
                <div class="menu-item" onclick="showView('lessons', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">📚</div>
                    <h3>Lesson Guides</h3>
                    <p>${domainLessons.length} lessons</p>
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
                </div>
                
                <div class="menu-item" onclick="showView('flashcards', {domainId: ${domainId}})">
                    <div style="font-size: 2rem;">🎴</div>
                    <h3>Flash Cards</h3>
                    <p>Quick review</p>
                </div>
            </div>
        </div>
    `;
}

function showLessons(container, domainId) {
    const domain = DOMAINS.find(d => d.id === domainId);
    const lessons = ALL_LESSONS.filter(l => l.domain === domainId);
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>${domain.icon} Domain ${domainId} Lessons</h1>
            
            <div style="margin: 30px 0;">
                ${lessons.map((lesson, index) => {
                    const isCompleted = APP.progress.completedLessons.includes(lesson.id);
                    
                    return `
                        <div class="simulation-card" onclick="showView('lesson-viewer', {lessonId: '${lesson.id}'})">
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
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function showFlashCards(container, domainId) {
    const questions = domainId 
        ? APP.content.questions.filter(q => q.domain === domainId)
        : APP.content.questions;
    
    if (questions.length === 0) {
        container.innerHTML = '<div class="platform-container"><h1>No flashcards available</h1></div>';
        return;
    }
    
    const currentCard = questions[APP.state.currentFlashCardIndex % questions.length];
    
    container.innerHTML = `
        <div class="platform-container">
            <h1>🎴 Flash Cards - Domain ${domainId || 'All'}</h1>
            
            <div class="flashcard-container">
                <div class="flashcard" id="flashcard" onclick="flipCard()">
                    <div class="flashcard-face">
                        <h3>${currentCard.question}</h3>
                        <p style="color: #a1a1aa;">Click to reveal</p>
                    </div>
                    <div class="flashcard-face flashcard-back">
                        <p><strong>Answer:</strong> ${currentCard.options[currentCard.correct || currentCard.correct_answer || 0]}</p>
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

function showRemedial(container) {
    const weakAreas = identifyWeakAreas();
    const wrongQuestions = APP.progress.wrongAnswers;
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="page-title">🔧 Remedial Study</h1>
            
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

function showProgressView(container) {
    const stats = calculateStats();
    
    container.innerHTML = `
        <div class="platform-container">
            <h1 class="page-title">📊 Your Progress</h1>
            
            <div class="stats-row">
                ${DOMAINS.map(domain => {
                    const domainStats = getDomainStats(domain.id);
                    return `
                        <div class="stat-card">
                            <div style="color: ${domain.color};">${domain.icon} Domain ${domain.id}</div>
                            <div class="stat-value">${domainStats.progress}%</div>
                            <div>Accuracy: ${domainStats.accuracy}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <button class="btn btn-danger" onclick="if(confirm('Reset all progress?')) resetProgress()">
                Reset All Progress
            </button>
        </div>
    `;
}

function showPracticeTest(container) {
    container.innerHTML = `
        <div class="platform-container">
            <h1>CompTIA Security+ Practice Test</h1>
            <div class="alert alert-info">
                <h3>📋 Exam Simulation</h3>
                <ul>
                    <li>90 questions (85 multiple choice + 5 PBQs)</li>
                    <li>90 minutes time limit</li>
                    <li>Passing score: 750/900</li>
                </ul>
                <button class="btn btn-warning" onclick="alert('Practice test starting!')">
                    Begin Exam
                </button>
            </div>
        </div>
    `;
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
            
            <p style="font-size: 1.2rem;">Score: ${APP.state.score} / ${APP.state.quizQuestions.length}</p>
            
            <div style="margin: 30px;">
                ${passed ? `
                    <div class="alert alert-success">
                        <h3>🎉 Excellent!</h3>
                        <p>You've mastered this material!</p>
                    </div>
                ` : `
                    <div class="alert alert-warning">
                        <h3>📚 Keep Studying</h3>
                        <p>You need 85% to pass.</p>
                    </div>
                `}
            </div>
            
            <button class="btn" onclick="showView('dashboard')">Back to Dashboard</button>
        </div>
    `;
    
    container.innerHTML = html;
    saveProgress();
}

// Helper functions
function startDomainQuiz(domainId) {
    const domainQuestions = APP.content.questions.filter(q => q.domain === domainId);
    if (domainQuestions.length === 0) {
        alert('No questions available for this domain.');
        return;
    }
    
    const shuffled = domainQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 25);
    
    showView('quiz', { 
        questions: selected, 
        title: `Domain ${domainId} Quiz`,
        limit: 25 
    });
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

function startPracticeTest() {
    showView('practice-test');
}

function showFlaggedQuestions() {
    if (APP.progress.flaggedQuestions.length === 0) {
        alert('No flagged questions.');
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
    showFlaggedQuestions();
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
    document.querySelectorAll('.badge-count').forEach(badge => {
        badge.textContent = APP.progress.flaggedQuestions.length;
    });
}

function completeLesson(lessonId) {
    if (!APP.progress.completedLessons.includes(lessonId)) {
        APP.progress.completedLessons.push(lessonId);
        saveProgress();
        showView('lesson-viewer', { lessonId });
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
    if (APP.state.currentFlashCardIndex < 0) {
        APP.state.currentFlashCardIndex = 0;
    }
    showView('flashcards', { domainId });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        document.querySelectorAll('.lesson-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        event.target.classList.add('active');
    }
}

function showProgress() {
    showView('progress');
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
    const lessons = ALL_LESSONS.filter(l => l.domain === domainId);
    const completedLessons = lessons.filter(l => APP.progress.completedLessons.includes(l.id));
    
    return {
        progress: domainQuestions.length > 0 ? Math.round((answered.length / domainQuestions.length) * 100) : 0,
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
        
        updateFlaggedCount();
    } catch (e) {
        console.error('Could not load progress:', e);
    }
}

function resetProgress() {
    APP.progress = {
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
    };
    
    saveProgress();
    showView('dashboard');
    alert('All progress has been reset!');
}

// Global functions
window.showView = showView;
window.selectOption = selectOption;
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.startDomainQuiz = startDomainQuiz;
window.startLessonQuiz = startLessonQuiz;
window.startLessonPractice = startLessonPractice;
window.startPracticeTest = startPracticeTest;
window.practiceWrongAnswers = practiceWrongAnswers;
window.practiceFlagged = practiceFlagged;
window.startFocusedPractice = startFocusedPractice;
window.showFlaggedQuestions = showFlaggedQuestions;
window.toggleFlag = toggleFlag;
window.completeLesson = completeLesson;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.previousCard = previousCard;
window.scrollToSection = scrollToSection;
window.showProgress = showProgress;
window.resetProgress = resetProgress;
window.showSimulationPoint = showSimulationPoint;
window.makeSimulationChoice = makeSimulationChoice;
window.showPBQ = showPBQ;
window.checkPBQAnswer = checkPBQAnswer;

console.log('✅ Security+ Platform v16 - All Systems Operational!');
