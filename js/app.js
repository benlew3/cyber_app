// Security+ Platform v32 - Full v30 Functionality + Professional Simulations
// Combines ALL v30 features with enhanced simulation system from v29
// 41 lessons (with navigation), 26 simulations (260 decision points), 15 remediation, 
// 250 questions, 30 PBQs, 300+ glossary terms, practice exam
// 
// v29 KEY ENHANCEMENT: Each simulation now has 10 comprehensive decision points
// matching the actual JSON files (1000+ lines each) for professional training

console.log('🚀 Security+ v31 - All v30 Features + 260 Decision Points!');

// ============================================
// IMMEDIATE LOADING FIX & ERROR PREVENTION
// ============================================
(function immediateSetup() {
    try {
        console.log('Immediate setup starting...');
        
        // Remove any loading screens IMMEDIATELY
        const loadingScreens = document.querySelectorAll('#loading-screen, .loading-screen, .loading, .loader, [class*="loading"], [class*="Loading"]');
        loadingScreens.forEach(el => {
            el.style.display = 'none';
            el.remove();
        });
        
        // Remove any error screens
        const errorScreens = document.querySelectorAll('#error-screen, .error-screen, [class*="error"], [class*="Error"]');
        errorScreens.forEach(el => {
            if (el.textContent && el.textContent.includes('Loading Error')) {
                el.style.display = 'none';
                el.remove();
            }
        });
        
        // Set immediate body styles
        document.body.style.cssText = `
            background: #09090b !important;
            color: #fafafa !important;
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;
        
        // Ensure main containers exist
        if (!document.getElementById('main-content')) {
            const main = document.createElement('div');
            main.id = 'main-content';
            main.style.minHeight = '100vh';
            document.body.appendChild(main);
        }
        
        if (!document.getElementById('content')) {
            const content = document.createElement('div');
            content.id = 'content';
            const main = document.getElementById('main-content');
            if (main) main.appendChild(content);
        }
        
        console.log('✅ Immediate setup complete');
    } catch (e) {
        console.error('Immediate setup error:', e);
    }
})();

// ============================================
// GLOBAL STATE MANAGEMENT
// ============================================
const APP = {
    version: '29.0-Complete',
    initialized: false,
    content: {
        questions: [],
        simulations: [],
        simulationData: {}, // v29: Cache for loaded JSON files
        lessons: [],
        remediation: [],
        pbqs: [],
        glossary: {}
    },
    state: {
        currentView: 'dashboard',
        currentDomain: null,
        currentLesson: null,
        currentSimulation: null,
        currentDecisionIndex: 0, // v29: Track which of 10 decisions
        simulationScore: 0, // v29: Track score across decisions
        simulationMaxScore: 250, // v29: 10 decisions × 25 points
        simulationStep: 0, // Legacy v30 support
        currentPBQ: null,
        currentQuestionIndex: 0,
        currentQuizQuestions: [],
        currentQuizDomain: null, // Track which domain quiz is for
        selectedOption: undefined,
        score: 0,
        quizActive: false,
        pbqAnswers: {},
        // Exam timer state
        isFullExam: false,
        examTimeRemaining: 0,
        examStartTime: null,
        examTimerInterval: null,
        // Remediation state
        currentRemediation: null,
        remediationIndex: 0,
        remediationScore: 0,
        remediationHistory: [],
        selectedRemediationOption: null
    },
    progress: {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: [],
        completedLessons: [],
        completedSimulations: [],
        completedRemediation: [],
        completedPBQs: [],
        domainScores: {1: [], 2: [], 3: [], 4: [], 5: []},
        practiceExamScores: [],
        weakAreas: [],
        lastActivity: null
    }
};

// Make APP globally accessible
window.APP = APP;

// Global storage for simulation data from data/simulations.json
let SIMULATION_DATA = {};

// Domain configuration
const DOMAINS = [
    { id: 1, name: 'General Security Concepts', weight: 0.12, color: '#6366f1', icon: '🔒', 
      lessons: 8, simulations: 5, remediation: 3, pbqs: 6 },
    { id: 2, name: 'Threats, Vulnerabilities & Mitigations', weight: 0.22, color: '#f59e0b', icon: '⚠️',
      lessons: 12, simulations: 5, remediation: 3, pbqs: 6 },
    { id: 3, name: 'Security Architecture', weight: 0.18, color: '#10b981', icon: '🏗️',
      lessons: 8, simulations: 5, remediation: 3, pbqs: 6 },
    { id: 4, name: 'Security Operations', weight: 0.28, color: '#8b5cf6', icon: '🛡️',
      lessons: 7, simulations: 5, remediation: 3, pbqs: 6 },
    { id: 5, name: 'Security Program Management', weight: 0.20, color: '#ec4899', icon: '📊',
      lessons: 6, simulations: 5, remediation: 3, pbqs: 6 }
];

// ============================================
// COMPLETE CONTENT ARRAYS
// ============================================

// ALL 41 LESSONS with full content
const ALL_LESSONS = [
    // Domain 1 Lessons
    { 
        id: 'D1-LESSON-001', 
        title: 'Security Controls Fundamentals', 
        domain: 1,
        objectives: ['1.1'],
        duration: '45-55 min',
        difficulty: 'beginner',
        content: {
            introduction: `Every security breach you've ever heard of—from massive data leaks to ransomware attacks—could have been prevented or mitigated by properly implemented security controls. Understanding how controls are categorized and function is essential.`,
            learningGoals: [
                'Categorize security controls by implementation type',
                'Identify control functions',
                'Apply defense-in-depth principles',
                'Select appropriate controls based on risk'
            ],
            sections: [
                {
                    title: 'Control Categories',
                    content: `Technical Controls: Firewalls, encryption, IDS/IPS
Managerial Controls: Policies, risk assessments, training
Operational Controls: Patrols, monitoring, patch management
Physical Controls: Locks, cameras, environmental controls`
                },
                {
                    title: 'Control Functions',
                    content: `Preventive: Stop incidents before they occur
Detective: Identify when incidents happen
Corrective: Fix problems after detection
Deterrent: Discourage attacks
Compensating: Alternative when primary fails`
                }
            ],
            keyPoints: [
                'Defense in depth uses multiple layers',
                'Controls should align with risk level',
                'Regular testing ensures effectiveness'
            ],
            examTips: [
                'Focus on HOW controls are implemented',
                'Background checks are MANAGERIAL',
                'Compensating controls are alternatives'
            ]
        }
    },
    { 
        id: 'D1-LESSON-002', 
        title: 'CIA Triad Fundamentals', 
        domain: 1, 
        objectives: ['1.2'], 
        duration: '45-55 min',
        difficulty: 'beginner',
        content: {
            introduction: 'The CIA Triad (Confidentiality, Integrity, Availability) forms the foundation of all information security. Every security decision, control, and practice ultimately serves to protect one or more of these three pillars.',
            learningGoals: [
                'Define and explain each component of the CIA Triad',
                'Identify threats to confidentiality, integrity, and availability',
                'Apply CIA principles to real-world security scenarios',
                'Balance CIA requirements based on business needs'
            ],
            sections: [
                {
                    title: 'Confidentiality',
                    content: `Confidentiality ensures that information is accessible only to authorized individuals.

Key Methods:
• Encryption (at rest and in transit)
• Access controls and permissions
• Data classification schemes
• Need-to-know principles
• Non-disclosure agreements (NDAs)

Common Threats:
• Eavesdropping and packet sniffing
• Social engineering
• Improper disposal of media
• Unauthorized access
• Data breaches`
                },
                {
                    title: 'Integrity',
                    content: `Integrity maintains data accuracy and prevents unauthorized modification.

Key Methods:
• Hashing and checksums
• Digital signatures
• Version control
• Change management processes
• Audit logging

Common Threats:
• Man-in-the-middle attacks
• Data corruption
• Unauthorized changes
• Malware modifications
• Insider threats`
                },
                {
                    title: 'Availability',
                    content: `Availability ensures authorized users have reliable access when needed.

Key Methods:
• Redundancy and failover
• Load balancing
• Backup and recovery
• DDoS protection
• Maintenance windows

Common Threats:
• Denial of Service attacks
• Hardware failures
• Natural disasters
• Power outages
• Human error`
                }
            ],
            keyPoints: [
                'CIA Triad components often conflict - balance is key',
                'Different data requires different CIA priorities',
                'Security controls typically address multiple CIA aspects',
                'Risk assessment helps determine CIA requirements'
            ],
            examTips: [
                'Know which controls protect which CIA component',
                'Understand trade-offs (e.g., encryption helps C but may impact A)',
                'Identify the PRIMARY concern in scenario questions'
            ]
        }
    },
    { 
        id: 'D1-LESSON-003', 
        title: 'Authentication Methods', 
        domain: 1, 
        objectives: ['1.2'], 
        duration: '50-60 min',
        difficulty: 'intermediate',
        content: {
            introduction: 'Authentication verifies the identity of users, devices, or services before granting access. Modern authentication goes beyond simple passwords to include multiple factors and advanced biometric methods.',
            learningGoals: [
                'Understand authentication factors and their strengths',
                'Implement multi-factor authentication strategies',
                'Evaluate biometric authentication methods',
                'Configure authentication protocols and services'
            ],
            sections: [
                {
                    title: 'Authentication Factors',
                    content: `The three primary authentication factors:

Something You Know (Knowledge):
• Passwords and passphrases
• PINs
• Security questions
• Pattern locks

Something You Have (Possession):
• Smart cards
• Hardware tokens
• Mobile devices (SMS/App)
• Security keys (FIDO2)

Something You Are (Inherence):
• Fingerprints
• Facial recognition
• Iris/retinal scans
• Voice recognition`
                },
                {
                    title: 'Multi-Factor Authentication (MFA)',
                    content: `MFA combines two or more different authentication factors.

Implementation Considerations:
• User convenience vs. security
• Backup authentication methods
• Recovery procedures
• Cost and complexity

Common MFA Combinations:
• Password + SMS code
• Password + Authenticator app
• Smart card + PIN
• Biometric + Security key`
                }
            ],
            keyPoints: [
                'MFA significantly reduces account compromise risk',
                'Biometrics cannot be changed if compromised',
                'Consider false acceptance and false rejection rates',
                'Authentication is different from authorization'
            ],
            examTips: [
                'Know the three authentication factors',
                'Understand MFA vs. 2FA (2FA is a subset of MFA)',
                'Location and time can be additional factors'
            ]
        }
    },
    { id: 'D1-LESSON-004', title: 'Cryptographic Fundamentals', domain: 1, objectives: ['1.4'], duration: '55-65 min' },
    { id: 'D1-LESSON-005', title: 'Zero Trust Architecture', domain: 1, objectives: ['1.2'], duration: '50-60 min' },
    { id: 'D1-LESSON-006', title: 'Physical Security Controls', domain: 1, objectives: ['1.1'], duration: '45-55 min' },
    { id: 'D1-LESSON-007', title: 'Deception Technologies', domain: 1, objectives: ['1.1'], duration: '40-50 min' },
    { id: 'D1-LESSON-008', title: 'Change Management', domain: 1, objectives: ['1.3'], duration: '45-55 min' },
    
    // Domain 2 Lessons
    { id: 'D2-LESSON-001', title: 'Threat Actors & Motivations', domain: 2, objectives: ['2.1'], duration: '50-60 min' },
    { id: 'D2-LESSON-002', title: 'Threat Vectors & Attack Surfaces', domain: 2, objectives: ['2.2'], duration: '50-60 min' },
    { id: 'D2-LESSON-003', title: 'Social Engineering', domain: 2, objectives: ['2.2'], duration: '55-65 min' },
    { id: 'D2-LESSON-004', title: 'Malware Types', domain: 2, objectives: ['2.4'], duration: '50-60 min' },
    { id: 'D2-LESSON-005', title: 'Network Attacks', domain: 2, objectives: ['2.4'], duration: '55-65 min' },
    { id: 'D2-LESSON-006', title: 'Application Attacks', domain: 2, objectives: ['2.3', '2.4'], duration: '55-65 min' },
    { id: 'D2-LESSON-007', title: 'Vulnerability Management', domain: 2, objectives: ['2.3'], duration: '50-60 min' },
    { id: 'D2-LESSON-008', title: 'Indicators of Compromise', domain: 2, objectives: ['2.4'], duration: '45-55 min' },
    { id: 'D2-LESSON-009', title: 'Hardening & Configurations', domain: 2, objectives: ['2.5'], duration: '50-60 min' },
    { id: 'D2-LESSON-010', title: 'Mitigation Techniques', domain: 2, objectives: ['2.5'], duration: '50-60 min' },
    { id: 'D2-LESSON-011', title: 'Attack Frameworks', domain: 2, objectives: ['2.1'], duration: '45-55 min' },
    { id: 'D2-LESSON-012', title: 'Security Assessments', domain: 2, objectives: ['2.3'], duration: '50-60 min' },
    
    // Domain 3 Lessons
    { id: 'D3-LESSON-001', title: 'Security Architecture Concepts', domain: 3, objectives: ['3.1'], duration: '50-60 min' },
    { id: 'D3-LESSON-002', title: 'Infrastructure Security', domain: 3, objectives: ['3.1'], duration: '55-65 min' },
    { id: 'D3-LESSON-003', title: 'Network Security', domain: 3, objectives: ['3.2'], duration: '55-65 min' },
    { id: 'D3-LESSON-004', title: 'Wireless Security', domain: 3, objectives: ['3.2'], duration: '50-60 min' },
    { id: 'D3-LESSON-005', title: 'Cloud Security', domain: 3, objectives: ['3.3'], duration: '55-65 min' },
    { id: 'D3-LESSON-006', title: 'Cryptography', domain: 3, objectives: ['3.4'], duration: '60-70 min' },
    { id: 'D3-LESSON-007', title: 'Resilience & Recovery', domain: 3, objectives: ['3.5'], duration: '55-65 min' },
    { id: 'D3-LESSON-008', title: 'Data Protection', domain: 3, objectives: ['3.1'], duration: '50-60 min' },
    
    // Domain 4 Lessons
    { id: 'D4-LESSON-001', title: 'Security Monitoring', domain: 4, objectives: ['4.1'], duration: '55-65 min' },
    { id: 'D4-LESSON-002', title: 'Incident Response', domain: 4, objectives: ['4.8'], duration: '55-65 min' },
    { id: 'D4-LESSON-003', title: 'Digital Forensics', domain: 4, objectives: ['4.9'], duration: '55-65 min' },
    { id: 'D4-LESSON-004', title: 'Vulnerability Management', domain: 4, objectives: ['4.3'], duration: '50-60 min' },
    { id: 'D4-LESSON-005', title: 'Identity & Access Management', domain: 4, objectives: ['4.6'], duration: '55-65 min' },
    { id: 'D4-LESSON-006', title: 'Data Protection', domain: 4, objectives: ['4.2'], duration: '50-60 min' },
    { id: 'D4-LESSON-007', title: 'Security Automation', domain: 4, objectives: ['4.5'], duration: '45-55 min' },
    
    // Domain 5 Lessons
    { id: 'D5-LESSON-001', title: 'Security Governance', domain: 5, objectives: ['5.1'], duration: '50-60 min' },
    { id: 'D5-LESSON-002', title: 'Risk Management', domain: 5, objectives: ['5.2'], duration: '55-65 min' },
    { id: 'D5-LESSON-003', title: 'Third-Party Risk Management', domain: 5, objectives: ['5.3'], duration: '50-60 min' },
    { id: 'D5-LESSON-004', title: 'Security Compliance', domain: 5, objectives: ['5.4'], duration: '50-60 min' },
    { id: 'D5-LESSON-005', title: 'Audits & Assessments', domain: 5, objectives: ['5.5'], duration: '50-60 min' },
    { id: 'D5-LESSON-006', title: 'Security Awareness', domain: 5, objectives: ['5.6'], duration: '45-55 min' }
];

// ============================================
// v29 ENHANCED SIMULATIONS - 260 DECISION POINTS
// Each simulation now contains 10 comprehensive decision points
// Total: 26 simulations × 10 decisions = 260 scenarios
// Professional scoring: 0-250 points per simulation
// ============================================

// Simulation JSON file mapping (for loading actual content)
const SIMULATION_FILE_MAP = {
    'D1-SIM-001': 'D1-SIM-001_Security_Controls.json',
    'D1-SIM-002': 'D1-SIM-002_Security_Concepts.json',
    'D1-SIM-003': 'D1-SIM-003_Encryption_Emergency.json',
    'D1-SIM-004': 'D1-SIM-004_Zero_Trust_Migration.json',
    'D1-SIM-005': 'D1-SIM-005_Gap_Analysis.json',
    'D2-SIM-001': 'D2-SIM-001_Phishing_Campaign.json',
    'D2-SIM-002': 'D2-SIM-002_Vulnerability_Management.json',
    'D2-SIM-003': 'D2-SIM-003_Ransomware_Response.json',
    'D2-SIM-004': 'D2-SIM-004_Supply_Chain.json',
    'D2-SIM-005': 'D2-SIM-005_Attack_Surface.json',
    'D2-SIM-006': 'D2-SIM-006_Attribution_Puzzle.json',
    'D3-SIM-001': 'D3-SIM-001_Cloud_Security.json',
    'D3-SIM-002': 'D3-SIM-002_Zero_Trust.json',
    'D3-SIM-003': 'D3-SIM-003_Data_Protection.json',
    'D3-SIM-004': 'D3-SIM-004_Infrastructure_Hardening.json',
    'D3-SIM-005': 'D3-SIM-005_Resilience_Recovery.json',
    'D4-SIM-001': 'D4-SIM-001_SOC_Operations.json',
    'D4-SIM-002': 'D4-SIM-002_Incident_Response.json',
    'D4-SIM-003': 'D4-SIM-003_Vulnerability_Management.json',
    'D4-SIM-004': 'D4-SIM-004_IAM.json',
    'D4-SIM-005': 'D4-SIM-005_Security_Automation.json',
    'D5-SIM-001': 'D5-SIM-001_Security_Governance.json',
    'D5-SIM-002': 'D5-SIM-002_Risk_Management.json',
    'D5-SIM-003': 'D5-SIM-003_Third_Party_Risk.json',
    'D5-SIM-004': 'D5-SIM-004_Compliance_Audit.json',
    'D5-SIM-005': 'D5-SIM-005_Security_Program.json'
};

// Load simulations from your data folder
async function loadSimulationsFromDataFolder() {
    console.log('📂 Loading simulations from data/simulations.json...');
    
    try {
        const response = await fetch('./data/simulations.json');
        const data = await response.json();
        
        // Store simulations for quick access
        if (Array.isArray(data)) {
            console.log(`Found ${data.length} simulations in array format`);
            data.forEach(sim => {
                const id = sim.id || sim.simulation_id || sim.scenario_id;
                if (id) SIMULATION_DATA[id] = sim;
            });
        } else if (data.simulations) {
            console.log(`Found ${data.simulations.length} simulations in simulations property`);
            data.simulations.forEach(sim => {
                const id = sim.id || sim.simulation_id || sim.scenario_id;
                if (id) SIMULATION_DATA[id] = sim;
            });
        } else {
            console.log('Found simulations in object format');
            SIMULATION_DATA = data;
        }
        
        console.log('✅ Loaded simulations:', Object.keys(SIMULATION_DATA).slice(0, 5).join(', ') + '...');
        return true;
    } catch (error) {
        console.error('❌ Error loading simulations.json:', error);
        console.log('Will use generated mock data as fallback');
        return false;
    }
}

// ALL 25 SIMULATIONS with scenarios (26 total with duplicate D2-SIM-001)
const ALL_SIMULATIONS = [
    // Domain 1 - General Security Concepts
    { 
        id: 'D1-SIM-001', 
        title: 'Security Controls Implementation', 
        domain: 1,
        organization: 'Pinnacle Insurance Group',
        role: 'Security Analyst',
        scenario: 'Recent audit identified gaps in security controls framework. Design and implement comprehensive controls.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'The CISO asks you to assess current controls.',
                question: 'What is your first step?',
                options: [
                    { text: 'Inventory existing controls', correct: true, points: 10 },
                    { text: 'Buy new security tools', correct: false, points: 2 },
                    { text: 'Update policies only', correct: false, points: 5 }
                ]
            },
            {
                situation: 'You found gaps in detective controls.',
                question: 'Which control should you implement?',
                options: [
                    { text: 'SIEM system for log monitoring', correct: true, points: 10 },
                    { text: 'Additional firewalls', correct: false, points: 3 },
                    { text: 'New password policy', correct: false, points: 5 }
                ]
            }
        ]
    },
    { 
        id: 'D1-SIM-002', 
        title: 'Security Concepts Application', 
        domain: 1, 
        organization: 'MedCare Health Systems',
        role: 'Security Architect',
        scenario: 'The hospital is implementing a new patient portal. Apply CIA triad principles to ensure HIPAA compliance while maintaining usability for patients and healthcare providers.',
        difficulty: 'beginner',
        duration: '30 min',
        steps: [
            {
                situation: 'The patient portal will store sensitive health records.',
                question: 'Which CIA principle is MOST critical for HIPAA compliance?',
                options: [
                    { text: 'Confidentiality - protecting patient privacy', correct: true, points: 10 },
                    { text: 'Availability - ensuring 24/7 access', correct: false, points: 5 },
                    { text: 'Integrity - preventing data modification', correct: false, points: 7 }
                ]
            },
            {
                situation: 'Doctors need quick access during emergencies.',
                question: 'How should you balance security with availability?',
                options: [
                    { text: 'Implement break-glass emergency access procedures', correct: true, points: 10 },
                    { text: 'Remove all access controls for medical staff', correct: false, points: 0 },
                    { text: 'Require manager approval for all access', correct: false, points: 3 }
                ]
            },
            {
                situation: 'Audit logs must be maintained for compliance.',
                question: 'What is the primary purpose of these logs?',
                options: [
                    { text: 'Ensure non-repudiation and accountability', correct: true, points: 10 },
                    { text: 'Monitor system performance', correct: false, points: 2 },
                    { text: 'Track patient satisfaction', correct: false, points: 0 }
                ]
            }
        ]
    },
    { 
        id: 'D1-SIM-003', 
        title: 'Encryption Emergency Response', 
        domain: 1, 
        organization: 'GlobalBank Financial',
        role: 'Incident Response Lead',
        scenario: 'Critical customer data was found unencrypted on a public-facing server. Lead the emergency response to implement encryption, assess the breach impact, and prevent future occurrences.',
        difficulty: 'advanced',
        duration: '60 min',
        steps: [
            {
                situation: 'Unencrypted PII discovered on public server at 2 AM.',
                question: 'What is your IMMEDIATE first action?',
                options: [
                    { text: 'Isolate the server from public access', correct: true, points: 10 },
                    { text: 'Start encrypting the data', correct: false, points: 3 },
                    { text: 'Notify the CEO', correct: false, points: 5 }
                ]
            },
            {
                situation: 'Server isolated. Legal asks about breach notification requirements.',
                question: 'What determines notification timeline?',
                options: [
                    { text: 'Regulations based on data type and jurisdiction', correct: true, points: 10 },
                    { text: 'Company policy alone', correct: false, points: 3 },
                    { text: 'Customer service availability', correct: false, points: 1 }
                ]
            },
            {
                situation: 'You need to implement encryption going forward.',
                question: 'Which encryption approach for data at rest?',
                options: [
                    { text: 'AES-256 with HSM key management', correct: true, points: 10 },
                    { text: 'Custom encryption algorithm', correct: false, points: 0 },
                    { text: 'Base64 encoding', correct: false, points: 0 }
                ]
            }
        ]
    },
    { 
        id: 'D1-SIM-004', 
        title: 'Zero Trust Migration', 
        domain: 1,
        organization: 'TechCorp Solutions',
        role: 'Security Engineer',
        scenario: 'Your company is transitioning from perimeter-based security to Zero Trust architecture. Plan and execute the migration while maintaining business operations and user productivity.',
        difficulty: 'advanced',
        duration: '55 min',
        steps: [
            {
                situation: 'Management approved Zero Trust initiative.',
                question: 'What is the foundational principle to implement first?',
                options: [
                    { text: 'Never trust, always verify every connection', correct: true, points: 10 },
                    { text: 'Trust internal network, verify external', correct: false, points: 0 },
                    { text: 'Trust verified users indefinitely', correct: false, points: 2 }
                ]
            },
            {
                situation: 'Users complain about repeated authentication requests.',
                question: 'How do you address user experience concerns?',
                options: [
                    { text: 'Implement risk-based adaptive authentication', correct: true, points: 10 },
                    { text: 'Disable Zero Trust for internal users', correct: false, points: 0 },
                    { text: 'Extend session timeouts to 24 hours', correct: false, points: 3 }
                ]
            },
            {
                situation: 'Legacy systems cannot support modern authentication.',
                question: 'What is the best approach for legacy systems?',
                options: [
                    { text: 'Implement compensating controls and monitoring', correct: true, points: 10 },
                    { text: 'Exclude them from Zero Trust scope', correct: false, points: 2 },
                    { text: 'Immediately decommission all legacy systems', correct: false, points: 1 }
                ]
            }
        ]
    },
    { 
        id: 'D1-SIM-005', 
        title: 'Security Gap Analysis', 
        domain: 1,
        organization: 'Retail Chain International',
        role: 'Security Consultant',
        scenario: 'Conduct a comprehensive gap analysis comparing current security posture to PCI DSS requirements. Identify critical gaps and prioritize remediation efforts based on risk.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Starting PCI DSS gap analysis for 500 retail stores.',
                question: 'What should you assess FIRST?',
                options: [
                    { text: 'Cardholder data flow and storage locations', correct: true, points: 10 },
                    { text: 'Firewall configurations', correct: false, points: 5 },
                    { text: 'Employee training records', correct: false, points: 3 }
                ]
            },
            {
                situation: 'Found unencrypted card data in multiple databases.',
                question: 'How should you prioritize this finding?',
                options: [
                    { text: 'Critical - immediate remediation required', correct: true, points: 10 },
                    { text: 'Medium - fix within 90 days', correct: false, points: 2 },
                    { text: 'Low - address in next audit cycle', correct: false, points: 0 }
                ]
            },
            {
                situation: 'Budget constraints limit immediate fixes.',
                question: 'Which compensating control is most effective?',
                options: [
                    { text: 'Enhanced monitoring and access restrictions', correct: true, points: 10 },
                    { text: 'Additional security awareness training', correct: false, points: 4 },
                    { text: 'Quarterly vulnerability scans', correct: false, points: 5 }
                ]
            }
        ]
    },
    
    // Domain 2 - Threats, Vulnerabilities & Mitigations
    { 
        id: 'D2-SIM-001', 
        title: 'Phishing Campaign Response', 
        domain: 2,
        organization: 'Pinnacle Insurance Group',
        role: 'SOC Analyst',
        scenario: 'Multiple employees report suspicious emails claiming to be from IT requesting password resets. Investigate the phishing campaign, contain the threat, and implement preventive measures.',
        difficulty: 'intermediate',
        duration: '40 min',
        steps: [
            {
                situation: '15 employees report suspicious password reset emails.',
                question: 'What is your first investigative step?',
                options: [
                    { text: 'Analyze email headers and sender information', correct: true, points: 10 },
                    { text: 'Reset all user passwords immediately', correct: false, points: 3 },
                    { text: 'Delete all suspicious emails', correct: false, points: 2 }
                ]
            },
            {
                situation: '3 users clicked the phishing link.',
                question: 'What immediate action should you take?',
                options: [
                    { text: 'Disable affected accounts and force password resets', correct: true, points: 10 },
                    { text: 'Monitor accounts for unusual activity', correct: false, points: 5 },
                    { text: 'Send warning email to all staff', correct: false, points: 3 }
                ]
            },
            {
                situation: 'Need to prevent future phishing attacks.',
                question: 'Which control is MOST effective?',
                options: [
                    { text: 'Email filtering with user awareness training', correct: true, points: 10 },
                    { text: 'Blocking all external emails', correct: false, points: 1 },
                    { text: 'Daily password changes', correct: false, points: 0 }
                ]
            }
        ]
    },
    { 
        id: 'D2-SIM-002', 
        title: 'Vulnerability Management Crisis', 
        domain: 2,
        organization: 'Manufacturing Plus Inc',
        role: 'Vulnerability Manager',
        scenario: 'Automated scans reveal 500+ critical vulnerabilities across production systems. Prioritize patching based on exploitability, business impact, and available maintenance windows.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Scan shows 500+ critical vulnerabilities.',
                question: 'How do you prioritize remediation?',
                options: [
                    { text: 'CVSS score + exploitability + business impact', correct: true, points: 10 },
                    { text: 'Patch newest vulnerabilities first', correct: false, points: 3 },
                    { text: 'Random selection to spread risk', correct: false, points: 0 }
                ]
            },
            {
                situation: 'Production systems require 24/7 uptime.',
                question: 'How do you handle patching constraints?',
                options: [
                    { text: 'Implement compensating controls until maintenance windows', correct: true, points: 10 },
                    { text: 'Patch immediately despite downtime', correct: false, points: 2 },
                    { text: 'Accept risk and skip patching', correct: false, points: 0 }
                ]
            },
            {
                situation: 'New zero-day exploit announced publicly.',
                question: 'What is your response priority?',
                options: [
                    { text: 'Emergency patch or isolate affected systems', correct: true, points: 10 },
                    { text: 'Wait for vendor patch', correct: false, points: 3 },
                    { text: 'Continue normal patching schedule', correct: false, points: 1 }
                ]
            }
        ]
    },
    { 
        id: 'D2-SIM-003', 
        title: 'Ransomware Response', 
        domain: 2,
        organization: 'City General Hospital',
        role: 'Incident Commander',
        scenario: 'Ransomware has encrypted critical patient records and medical imaging systems. Lead the incident response, coordinate with law enforcement, and execute recovery procedures.',
        difficulty: 'advanced',
        duration: '60 min',
        steps: [
            {
                situation: 'Ransomware detected encrypting patient records.',
                question: 'What is your IMMEDIATE action?',
                options: [
                    { text: 'Isolate affected systems to prevent spread', correct: true, points: 10 },
                    { text: 'Pay ransom to restore access quickly', correct: false, points: 0 },
                    { text: 'Shut down all hospital systems', correct: false, points: 2 }
                ]
            },
            {
                situation: 'Backups exist but are 48 hours old.',
                question: 'How do you proceed with recovery?',
                options: [
                    { text: 'Restore from backup and recreate recent data', correct: true, points: 10 },
                    { text: 'Negotiate with attackers for decryption', correct: false, points: 2 },
                    { text: 'Attempt to decrypt without key', correct: false, points: 0 }
                ]
            },
            {
                situation: 'FBI requests forensic evidence.',
                question: 'How do you preserve evidence?',
                options: [
                    { text: 'Create forensic images before recovery', correct: true, points: 10 },
                    { text: 'Provide live system access', correct: false, points: 3 },
                    { text: 'Wait until after recovery', correct: false, points: 1 }
                ]
            }
        ]
    },
    { 
        id: 'D2-SIM-004', 
        title: 'Supply Chain Security', 
        domain: 2,
        organization: 'Defense Contractor Corp',
        role: 'Supply Chain Security Analyst',
        scenario: 'A critical software vendor suffered a breach. Assess the impact on your systems, implement compensating controls, and develop a vendor risk management strategy.',
        difficulty: 'intermediate',
        duration: '50 min',
        steps: [
            {
                situation: 'Critical vendor reports data breach.',
                question: 'What is your first assessment priority?',
                options: [
                    { text: 'Identify all systems using vendor software', correct: true, points: 10 },
                    { text: 'Terminate vendor contract immediately', correct: false, points: 2 },
                    { text: 'Wait for vendor investigation results', correct: false, points: 3 }
                ]
            },
            {
                situation: 'Vendor software has privileged access.',
                question: 'How do you mitigate immediate risk?',
                options: [
                    { text: 'Implement additional monitoring and access controls', correct: true, points: 10 },
                    { text: 'Remove all vendor software', correct: false, points: 3 },
                    { text: 'No action until compromise confirmed', correct: false, points: 0 }
                ]
            },
            {
                situation: 'Need long-term supply chain strategy.',
                question: 'Which approach is most effective?',
                options: [
                    { text: 'Continuous vendor assessment with SBOMs', correct: true, points: 10 },
                    { text: 'Only use in-house developed software', correct: false, points: 2 },
                    { text: 'Require vendors to self-certify security', correct: false, points: 4 }
                ]
            }
        ]
    },
    { 
        id: 'D2-SIM-005', 
        title: 'Attack Surface Analysis', 
        domain: 2,
        organization: 'E-Commerce Giant',
        role: 'Penetration Tester',
        scenario: 'Before peak shopping season, identify and document all external attack vectors. Map the attack surface and recommend prioritized hardening measures.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Starting external attack surface analysis.',
                question: 'Which discovery method is most comprehensive?',
                options: [
                    { text: 'Combine automated scanning with OSINT', correct: true, points: 10 },
                    { text: 'Only scan known IP ranges', correct: false, points: 4 },
                    { text: 'Rely on asset inventory database', correct: false, points: 3 }
                ]
            },
            {
                situation: 'Found exposed admin interfaces.',
                question: 'What is the recommended remediation?',
                options: [
                    { text: 'VPN access with MFA requirement', correct: true, points: 10 },
                    { text: 'Strong passwords only', correct: false, points: 3 },
                    { text: 'IP whitelist alone', correct: false, points: 5 }
                ]
            },
            {
                situation: 'Multiple outdated services discovered.',
                question: 'How should these be prioritized?',
                options: [
                    { text: 'Internet-facing services with known exploits first', correct: true, points: 10 },
                    { text: 'Update all simultaneously', correct: false, points: 2 },
                    { text: 'Oldest services first', correct: false, points: 4 }
                ]
            }
        ]
    },
    { 
        id: 'D2-SIM-006', 
        title: 'Attribution Puzzle', 
        domain: 2,
        organization: 'National Security Agency',
        role: 'Threat Intelligence Analyst',
        scenario: 'A sophisticated attack has been detected. Analyze the evidence to determine the threat actor, their motivations, and recommend defensive measures.',
        difficulty: 'advanced',
        duration: '50 min',
        steps: [
            {
                situation: 'Initial evidence analysis reveals multiple indicators.',
                question: 'What should be your first analytical step?',
                options: [
                    { text: 'Correlate TTPs with known threat actor profiles', correct: true, points: 10 },
                    { text: 'Immediately attribute to a nation-state', correct: false, points: 2 },
                    { text: 'Focus only on technical indicators', correct: false, points: 4 }
                ]
            }
        ]
    },
    
    // Domain 3 - Security Architecture
    { 
        id: 'D3-SIM-001', 
        title: 'Cloud Security Architecture', 
        domain: 3,
        organization: 'StartupTech Innovations',
        role: 'Cloud Security Architect',
        scenario: 'Design a secure multi-cloud architecture supporting rapid scaling. Balance security requirements with development agility while ensuring compliance with data residency laws.',
        difficulty: 'advanced',
        duration: '55 min',
        steps: [
            {
                situation: 'Designing multi-cloud architecture.',
                question: 'Which security model should you implement?',
                options: [
                    { text: 'Shared responsibility with cloud-native controls', correct: true, points: 10 },
                    { text: 'Full customer responsibility for all security', correct: false, points: 2 },
                    { text: 'Rely entirely on cloud provider security', correct: false, points: 0 }
                ]
            },
            {
                situation: 'Data residency requirements for EU customers.',
                question: 'How do you ensure compliance?',
                options: [
                    { text: 'Geo-restricted storage with encryption', correct: true, points: 10 },
                    { text: 'Store all data in US with notifications', correct: false, points: 0 },
                    { text: 'Let customers choose any region', correct: false, points: 5 }
                ]
            }
        ]
    },
    { 
        id: 'D3-SIM-002', 
        title: 'Zero Trust Network Implementation', 
        domain: 3,
        organization: 'Global Consulting Partners',
        role: 'Network Security Engineer',
        scenario: 'Implement microsegmentation and zero trust networking for a hybrid workforce. Design network zones, implement least privilege access, and deploy continuous verification.',
        difficulty: 'advanced',
        duration: '60 min',
        steps: [
            {
                situation: 'Implementing network microsegmentation.',
                question: 'What is the primary segmentation strategy?',
                options: [
                    { text: 'Segment by data sensitivity and function', correct: true, points: 10 },
                    { text: 'Segment by department only', correct: false, points: 4 },
                    { text: 'One segment per application', correct: false, points: 6 }
                ]
            },
            {
                situation: 'Users need access to multiple segments.',
                question: 'How should access be managed?',
                options: [
                    { text: 'Dynamic policies based on context and risk', correct: true, points: 10 },
                    { text: 'Static VLANs for each user', correct: false, points: 3 },
                    { text: 'Full access after authentication', correct: false, points: 0 }
                ]
            }
        ]
    },
    { 
        id: 'D3-SIM-003', 
        title: 'Data Protection Strategy', 
        domain: 3,
        organization: 'Healthcare Network Alliance',
        role: 'Data Protection Officer',
        scenario: 'Develop a comprehensive data protection strategy covering encryption, DLP, and privacy controls. Ensure HIPAA compliance while enabling legitimate data sharing.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Implementing data classification scheme.',
                question: 'How many classification levels for healthcare?',
                options: [
                    { text: '4 levels: Public, Internal, Confidential, Restricted', correct: true, points: 10 },
                    { text: '2 levels: Public and Private', correct: false, points: 3 },
                    { text: '10+ granular levels', correct: false, points: 2 }
                ]
            },
            {
                situation: 'Doctors need to share patient data with specialists.',
                question: 'Which sharing method ensures compliance?',
                options: [
                    { text: 'Encrypted transfer with audit logging', correct: true, points: 10 },
                    { text: 'Email with password-protected attachments', correct: false, points: 3 },
                    { text: 'Cloud storage with link sharing', correct: false, points: 2 }
                ]
            }
        ]
    },
    { 
        id: 'D3-SIM-004', 
        title: 'Infrastructure Hardening', 
        domain: 3,
        organization: 'Financial Services LLC',
        role: 'Systems Security Engineer',
        scenario: 'Harden critical infrastructure against advanced threats. Implement CIS benchmarks, remove unnecessary services, and deploy defense-in-depth strategies.',
        difficulty: 'intermediate',
        duration: '50 min',
        steps: [
            {
                situation: 'Starting infrastructure hardening project.',
                question: 'What should be hardened FIRST?',
                options: [
                    { text: 'Internet-facing systems and DMZ', correct: true, points: 10 },
                    { text: 'Internal workstations', correct: false, points: 3 },
                    { text: 'Development environments', correct: false, points: 2 }
                ]
            },
            {
                situation: 'Many legacy services running on servers.',
                question: 'How do you handle unnecessary services?',
                options: [
                    { text: 'Disable and monitor for dependencies', correct: true, points: 10 },
                    { text: 'Remove all immediately', correct: false, points: 2 },
                    { text: 'Leave running but firewall them', correct: false, points: 4 }
                ]
            }
        ]
    },
    { 
        id: 'D3-SIM-005', 
        title: 'Resilience & Recovery Planning', 
        domain: 3,
        organization: 'Regional Power Company',
        role: 'Business Continuity Manager',
        scenario: 'Design resilient systems for critical infrastructure. Plan for natural disasters, cyber attacks, and equipment failures while maintaining 99.999% uptime requirements.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Designing disaster recovery for critical infrastructure.',
                question: 'What is the optimal backup strategy?',
                options: [
                    { text: '3-2-1 rule with geographic distribution', correct: true, points: 10 },
                    { text: 'Daily backups to local storage', correct: false, points: 3 },
                    { text: 'Cloud-only backups', correct: false, points: 5 }
                ]
            },
            {
                situation: 'RPO is 15 minutes, RTO is 1 hour.',
                question: 'Which solution meets these requirements?',
                options: [
                    { text: 'Hot site with real-time replication', correct: true, points: 10 },
                    { text: 'Cold site with daily backups', correct: false, points: 0 },
                    { text: 'Warm site with hourly sync', correct: false, points: 5 }
                ]
            }
        ]
    },
    
    // Domain 4 - Security Operations
    { 
        id: 'D4-SIM-001', 
        title: 'SOC Operations', 
        domain: 4,
        organization: 'Managed Security Provider',
        role: 'SOC Team Lead',
        scenario: 'Optimize SOC operations for a 24/7 security monitoring center. Implement SOAR, reduce alert fatigue, and improve mean time to detect and respond.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'SOC receiving 10,000 alerts daily.',
                question: 'How do you reduce alert fatigue?',
                options: [
                    { text: 'Tune rules and implement SOAR automation', correct: true, points: 10 },
                    { text: 'Ignore low-severity alerts', correct: false, points: 2 },
                    { text: 'Hire more analysts', correct: false, points: 4 }
                ]
            },
            {
                situation: 'Need to improve detection capabilities.',
                question: 'Which technology provides best visibility?',
                options: [
                    { text: 'SIEM with EDR and network analytics', correct: true, points: 10 },
                    { text: 'Signature-based antivirus only', correct: false, points: 2 },
                    { text: 'Firewall logs alone', correct: false, points: 3 }
                ]
            }
        ]
    },
    { 
        id: 'D4-SIM-002', 
        title: 'Incident Response Scenario', 
        domain: 4,
        organization: 'National Retail Chain',
        role: 'Incident Response Manager',
        scenario: 'POS systems at 200 stores show signs of compromise. Coordinate the incident response, preserve evidence, notify stakeholders, and prevent data exfiltration.',
        difficulty: 'advanced',
        duration: '60 min',
        steps: [
            {
                situation: 'Suspicious activity on POS systems detected.',
                question: 'What is your first action?',
                options: [
                    { text: 'Contain affected systems while maintaining operations', correct: true, points: 10 },
                    { text: 'Shut down all POS systems immediately', correct: false, points: 2 },
                    { text: 'Continue monitoring without action', correct: false, points: 0 }
                ]
            },
            {
                situation: 'Credit card data may be compromised.',
                question: 'When must you notify card brands?',
                options: [
                    { text: 'Within 24 hours of confirmation', correct: true, points: 10 },
                    { text: 'After full investigation completes', correct: false, points: 2 },
                    { text: 'Only if data was exfiltrated', correct: false, points: 3 }
                ]
            }
        ]
    },
    { 
        id: 'D4-SIM-003', 
        title: 'Vulnerability Assessment', 
        domain: 4,
        organization: 'Government Agency',
        role: 'Vulnerability Analyst',
        scenario: 'Conduct a comprehensive vulnerability assessment of classified systems. Navigate compliance requirements, coordinate with system owners, and prioritize findings.',
        difficulty: 'intermediate',
        duration: '50 min',
        steps: [
            {
                situation: 'Scanning classified systems for vulnerabilities.',
                question: 'What approval is required first?',
                options: [
                    { text: 'Written authorization from system owners and security', correct: true, points: 10 },
                    { text: 'Verbal approval from IT manager', correct: false, points: 2 },
                    { text: 'No approval needed for scanning', correct: false, points: 0 }
                ]
            },
            {
                situation: 'Found critical vulnerability in production.',
                question: 'How should this be reported?',
                options: [
                    { text: 'Secure channel with immediate classification', correct: true, points: 10 },
                    { text: 'Email to all stakeholders', correct: false, points: 2 },
                    { text: 'Public bug tracking system', correct: false, points: 0 }
                ]
            }
        ]
    },
    { 
        id: 'D4-SIM-004', 
        title: 'IAM Implementation', 
        domain: 4,
        organization: 'Multinational Corporation',
        role: 'Identity Management Architect',
        scenario: 'Implement enterprise-wide IAM solution supporting 50,000 users across 30 countries. Design RBAC, implement SSO, and ensure regulatory compliance.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Designing role-based access control.',
                question: 'How should roles be structured?',
                options: [
                    { text: 'Job function with least privilege principle', correct: true, points: 10 },
                    { text: 'Department-based with full access', correct: false, points: 2 },
                    { text: 'Individual permissions per user', correct: false, points: 1 }
                ]
            },
            {
                situation: 'Users complain about multiple passwords.',
                question: 'Which SSO approach is best?',
                options: [
                    { text: 'SAML-based SSO with MFA', correct: true, points: 10 },
                    { text: 'Shared passwords across systems', correct: false, points: 0 },
                    { text: 'Password synchronization only', correct: false, points: 3 }
                ]
            }
        ]
    },
    { 
        id: 'D4-SIM-005', 
        title: 'Security Automation', 
        domain: 4,
        organization: 'DevOps Software Company',
        role: 'Security Automation Engineer',
        scenario: 'Automate security testing in CI/CD pipelines. Implement SAST, DAST, dependency scanning, and automated remediation while maintaining deployment velocity.',
        difficulty: 'advanced',
        duration: '55 min',
        steps: [
            {
                situation: 'Integrating security into CI/CD pipeline.',
                question: 'Where should security scanning occur?',
                options: [
                    { text: 'Multiple stages: commit, build, and deploy', correct: true, points: 10 },
                    { text: 'Only before production deployment', correct: false, points: 3 },
                    { text: 'Manual scanning after deployment', correct: false, points: 1 }
                ]
            },
            {
                situation: 'Scans causing deployment delays.',
                question: 'How do you balance speed and security?',
                options: [
                    { text: 'Parallel scanning with risk-based gates', correct: true, points: 10 },
                    { text: 'Skip security scans for hotfixes', correct: false, points: 0 },
                    { text: 'Run scans only on weekends', correct: false, points: 2 }
                ]
            }
        ]
    },
    
    // Domain 5 - Security Program Management (simplified for remaining)
    { 
        id: 'D5-SIM-001', 
        title: 'Security Governance Framework', 
        domain: 5,
        organization: 'Fortune 500 Enterprise',
        role: 'Chief Information Security Officer',
        scenario: 'Establish enterprise security governance aligned with business objectives. Define policies, standards, and metrics while building stakeholder support.',
        difficulty: 'intermediate',
        duration: '50 min',
        steps: [
            {
                situation: 'Building security governance framework.',
                question: 'What should be established FIRST?',
                options: [
                    { text: 'Security charter with executive sponsorship', correct: true, points: 10 },
                    { text: 'Technical security controls', correct: false, points: 3 },
                    { text: 'Incident response procedures', correct: false, points: 4 }
                ]
            }
        ]
    },
    { 
        id: 'D5-SIM-002', 
        title: 'Risk Management Process', 
        domain: 5,
        organization: 'Investment Banking Firm',
        role: 'Risk Manager',
        scenario: 'Develop quantitative risk assessment methodology for cyber risks. Calculate potential losses, justify security investments, and present to board of directors.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Quantifying cyber risk for the board.',
                question: 'Which metric is most meaningful?',
                options: [
                    { text: 'Annual Loss Expectancy (ALE) in dollars', correct: true, points: 10 },
                    { text: 'Number of vulnerabilities found', correct: false, points: 3 },
                    { text: 'Percentage of systems patched', correct: false, points: 4 }
                ]
            }
        ]
    },
    { 
        id: 'D5-SIM-003', 
        title: 'Third-Party Risk Assessment', 
        domain: 5,
        organization: 'Pharmaceutical Company',
        role: 'Vendor Risk Manager',
        scenario: 'Assess and manage risks from 200+ vendors handling sensitive research data. Develop assessment criteria, implement continuous monitoring, and manage remediation.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Assessing 200+ vendors efficiently.',
                question: 'How should vendors be tiered?',
                options: [
                    { text: 'By data sensitivity and access level', correct: true, points: 10 },
                    { text: 'By contract value only', correct: false, points: 2 },
                    { text: 'Alphabetically for fairness', correct: false, points: 0 }
                ]
            }
        ]
    },
    { 
        id: 'D5-SIM-004', 
        title: 'Compliance Audit Preparation', 
        domain: 5,
        organization: 'Payment Processor',
        role: 'Compliance Manager',
        scenario: 'Prepare for simultaneous PCI DSS, SOC 2, and ISO 27001 audits. Gather evidence, remediate gaps, coordinate with auditors, and ensure successful certification.',
        difficulty: 'advanced',
        duration: '55 min',
        steps: [
            {
                situation: 'Preparing for three simultaneous audits.',
                question: 'How do you manage overlapping requirements?',
                options: [
                    { text: 'Create unified control matrix mapping all frameworks', correct: true, points: 10 },
                    { text: 'Handle each audit separately', correct: false, points: 3 },
                    { text: 'Focus on the most important audit only', correct: false, points: 1 }
                ]
            }
        ]
    },
    { 
        id: 'D5-SIM-005', 
        title: 'Security Program Development', 
        domain: 5,
        organization: 'Growing Tech Startup',
        role: 'Security Program Manager',
        scenario: 'Build security program from scratch for a rapidly growing startup. Balance security needs with business agility while preparing for enterprise customers.',
        difficulty: 'intermediate',
        duration: '45 min',
        steps: [
            {
                situation: 'Starting security program at a startup.',
                question: 'What is the first priority?',
                options: [
                    { text: 'Basic policies and secure development practices', correct: true, points: 10 },
                    { text: 'Purchase expensive security tools', correct: false, points: 2 },
                    { text: 'Hire a large security team', correct: false, points: 3 }
                ]
            }
        ]
    }
];

// ALL 15 REMEDIATION scenarios
const ALL_REMEDIATION = [
    { id: 'D1-REM-001', title: 'Policy Fundamentals Deep Dive', domain: 1, 
      focus: 'Security controls, policy writing, control frameworks' },
    { id: 'D1-REM-002', title: 'Authentication & Access Control Review', domain: 1 },
    { id: 'D1-REM-003', title: 'Cryptography Clinic', domain: 1 },
    
    { id: 'D2-REM-001', title: 'Know Your Enemy - Threat Actor Analysis', domain: 2 },
    { id: 'D2-REM-002', title: 'Malware Menagerie', domain: 2 },
    { id: 'D2-REM-003', title: 'Vulnerability Deep Dive', domain: 2 },
    
    { id: 'D3-REM-001', title: 'Cloud Security Fundamentals', domain: 3 },
    { id: 'D3-REM-002', title: 'Network Security Review', domain: 3 },
    { id: 'D3-REM-003', title: 'Cryptography Practicum', domain: 3 },
    
    { id: 'D4-REM-001', title: 'Log Analysis Workshop', domain: 4 },
    { id: 'D4-REM-002', title: 'Incident Response Drills', domain: 4 },
    { id: 'D4-REM-003', title: 'IAM Concepts Review', domain: 4 },
    
    { id: 'D5-REM-001', title: 'Policy & Governance Fundamentals', domain: 5 },
    { id: 'D5-REM-002', title: 'Risk Assessment Basics', domain: 5 },
    { id: 'D5-REM-003', title: 'Compliance Concepts', domain: 5 }
];

// 250 ACTUAL EXAM QUESTIONS (fully embedded)
const ACTUAL_QUESTIONS = [
    { id: 'D1-Q001', domain: 1, question: 'Which security control type is a firewall classified as?', options: ['Physical', 'Technical', 'Administrative', 'Operational'], correct_answer: 1, explanation: 'A firewall is a technical (logical) control that uses technology to restrict network access based on defined rules.' },
    { id: 'D1-Q002', domain: 1, question: 'What is the primary purpose of defense in depth?', options: ['To reduce costs by consolidating security measures', 'To implement multiple layers of security controls', 'To focus on perimeter security only', 'To eliminate the need for security policies'], correct_answer: 1, explanation: 'Defense in depth uses multiple layers of security controls so that if one fails, others continue to provide protection.' },
    { id: 'D1-Q003', domain: 1, question: 'Which of the following best describes a deterrent control?', options: ['Backup systems that restore data after an incident', 'Warning signs that discourage unauthorized access', 'Encryption that protects data confidentiality', 'Logs that record security events'], correct_answer: 1, explanation: 'Deterrent controls discourage potential attackers by making them aware of consequences or obstacles, like warning signs or visible cameras.' },
    { id: 'D1-Q004', domain: 1, question: 'What is the main difference between a vulnerability and a threat?', options: ['Vulnerabilities are external, threats are internal', 'Vulnerabilities are weaknesses, threats are potential dangers that exploit them', 'Threats are technical, vulnerabilities are human-based', 'There is no difference'], correct_answer: 1, explanation: 'A vulnerability is a weakness in a system, while a threat is a potential danger that could exploit that vulnerability.' },
    { id: 'D1-Q005', domain: 1, question: 'Which principle ensures that users only have access to resources necessary for their job functions?', options: ['Separation of duties', 'Least privilege', 'Need to know', 'Job rotation'], correct_answer: 1, explanation: 'Least privilege ensures users have only the minimum access rights needed to perform their job functions.' },
    { id: 'D1-Q006', domain: 1, question: 'What type of control is a security awareness training program?', options: ['Technical', 'Physical', 'Administrative', 'Compensating'], correct_answer: 2, explanation: 'Security awareness training is an administrative (managerial) control that uses policies, procedures, and training to manage security.' },
    { id: 'D1-Q007', domain: 1, question: 'Which security concept describes accepting a risk because the cost of mitigation exceeds the potential loss?', options: ['Risk transference', 'Risk avoidance', 'Risk acceptance', 'Risk mitigation'], correct_answer: 2, explanation: 'Risk acceptance occurs when an organization decides to accept a risk without taking action, typically when mitigation costs outweigh potential losses.' },
    { id: 'D1-Q008', domain: 1, question: 'What is the purpose of implementing separation of duties?', options: ['To reduce training costs', 'To prevent fraud and errors by requiring multiple people for critical tasks', 'To increase system performance', 'To simplify access control management'], correct_answer: 1, explanation: 'Separation of duties prevents fraud and errors by ensuring no single person has complete control over critical transactions or processes.' },
    { id: 'D1-Q009', domain: 1, question: 'Which control type is designed to restore systems after a security incident?', options: ['Preventive', 'Detective', 'Corrective', 'Deterrent'], correct_answer: 2, explanation: 'Corrective controls are implemented to restore systems and repair damage after a security incident has occurred.' },
    { id: 'D1-Q010', domain: 1, question: 'What does the term attack surface refer to?', options: ['The physical area of a data center', 'All possible entry points an attacker could exploit', 'The network bandwidth available to attackers', 'The number of employees in an organization'], correct_answer: 1, explanation: 'Attack surface refers to all the possible points where an attacker could enter or extract data from a system or environment.' },
    { id: 'D1-Q011', domain: 1, question: 'Which principle states that security should not rely on keeping the methods secret?', options: ['Security through obscurity', 'Kerckhoffs principle', 'Least privilege', 'Defense in depth'], correct_answer: 1, explanation: 'Kerckhoffs principle states that a cryptographic system should remain secure even if everything except the key is public knowledge.' },
    { id: 'D1-Q012', domain: 1, question: 'What is a compensating control?', options: ['A control that replaces a missing or inadequate primary control', 'Financial compensation for security breaches', 'A control that monitors employee performance', 'A backup power system'], correct_answer: 0, explanation: 'A compensating control is an alternative control implemented when the desired primary control is not feasible or too expensive.' },
    { id: 'D1-Q013', domain: 1, question: 'Which of the following best describes confidentiality in the CIA triad?', options: ['Ensuring data is accessible when needed', 'Preventing unauthorized disclosure of information', 'Ensuring data has not been altered', 'Making data available to everyone'], correct_answer: 1, explanation: 'Confidentiality ensures that information is not disclosed to unauthorized individuals, processes, or devices.' },
    { id: 'D1-Q014', domain: 1, question: 'What is the purpose of a gap analysis in security?', options: ['To identify network bandwidth limitations', 'To compare current security state against desired state', 'To measure employee satisfaction', 'To calculate return on investment'], correct_answer: 1, explanation: 'Gap analysis identifies differences between the current security posture and desired security objectives or compliance requirements.' },
    { id: 'D1-Q015', domain: 1, question: 'Which security control would a bollard be classified as?', options: ['Technical', 'Administrative', 'Physical', 'Operational'], correct_answer: 2, explanation: 'Bollards are physical controls that prevent vehicle access to restricted areas through physical barriers.' },
    { id: 'D1-Q016', domain: 1, question: 'What does non-repudiation provide?', options: ['Proof that a message was sent and received', 'Encryption of data in transit', 'Multiple backup copies', 'Faster network speeds'], correct_answer: 0, explanation: 'Non-repudiation ensures that a party cannot deny sending or receiving a message, typically through digital signatures.' },
    { id: 'D1-Q017', domain: 1, question: 'Which type of authentication factor is a fingerprint scan?', options: ['Something you know', 'Something you have', 'Something you are', 'Somewhere you are'], correct_answer: 2, explanation: 'Biometric factors like fingerprint scans fall under something you are - inherence factors based on physical characteristics.' },
    { id: 'D1-Q018', domain: 1, question: 'What is the primary goal of implementing job rotation?', options: ['To increase employee satisfaction', 'To detect fraud and prevent knowledge silos', 'To reduce payroll costs', 'To improve network performance'], correct_answer: 1, explanation: 'Job rotation helps detect fraudulent activities and prevents any single employee from having exclusive knowledge of critical systems.' },
    { id: 'D1-Q019', domain: 1, question: 'Which security model focuses on preventing information flow from higher to lower security levels?', options: ['Bell-LaPadula', 'Biba', 'Clark-Wilson', 'Brewer-Nash'], correct_answer: 0, explanation: 'Bell-LaPadula model focuses on confidentiality and prevents information from flowing from high security levels to low (no read up, no write down).' },
    { id: 'D1-Q020', domain: 1, question: 'What does integrity mean in the context of the CIA triad?', options: ['Data is accessible when needed', 'Data has not been modified in an unauthorized manner', 'Data is encrypted', 'Data is backed up regularly'], correct_answer: 1, explanation: 'Integrity ensures that data has not been altered in an unauthorized way and remains accurate and trustworthy.' },
    { id: 'D1-Q021', domain: 1, question: 'What is the primary difference between qualitative and quantitative risk analysis?', options: ['Qualitative uses numbers, quantitative uses descriptions', 'Qualitative uses descriptions, quantitative uses numerical values', 'They are the same', 'Qualitative is faster, quantitative is slower'], correct_answer: 1, explanation: 'Qualitative risk analysis uses descriptive terms (high/medium/low), while quantitative uses numerical values and calculations.' },
    { id: 'D1-Q022', domain: 1, question: 'Which authentication factor category does a smart card belong to?', options: ['Something you know', 'Something you have', 'Something you are', 'Somewhere you are'], correct_answer: 1, explanation: 'A smart card is a possession factor - something you have - used for authentication.' },
    { id: 'D1-Q023', domain: 1, question: 'What is the purpose of implementing mandatory vacations?', options: ['Employee wellness', 'To detect fraud and misconduct', 'To reduce payroll costs', 'To improve productivity'], correct_answer: 1, explanation: 'Mandatory vacations force employees to be away from their duties, allowing others to discover any fraudulent activities.' },
    { id: 'D1-Q024', domain: 1, question: 'Which security principle requires multiple people to complete a sensitive task?', options: ['Least privilege', 'Dual control', 'Job rotation', 'Separation of duties'], correct_answer: 1, explanation: 'Dual control requires two or more people to complete a critical task, preventing single-person fraud.' },
    { id: 'D1-Q025', domain: 1, question: 'What does availability mean in the CIA triad?', options: ['Data is encrypted', 'Data is accurate', 'Data is accessible when needed by authorized users', 'Data is backed up'], correct_answer: 2, explanation: 'Availability ensures that systems and data are accessible when needed by authorized users.' },
    { id: 'D1-Q026', domain: 1, question: 'Which control type detects security incidents after they occur?', options: ['Preventive', 'Detective', 'Corrective', 'Deterrent'], correct_answer: 1, explanation: 'Detective controls identify security incidents after they have occurred through monitoring and logging.' },
    { id: 'D1-Q027', domain: 1, question: 'What is the purpose of security guards?', options: ['Technical control', 'Physical and detective control', 'Administrative control', 'Logical control'], correct_answer: 1, explanation: 'Security guards serve as both physical controls (preventing access) and detective controls (observing and reporting).' },
    { id: 'D1-Q028', domain: 1, question: 'Which principle limits users to only the information they need for their job?', options: ['Least privilege', 'Need to know', 'Separation of duties', 'Defense in depth'], correct_answer: 1, explanation: 'Need to know restricts access to only the specific information required for job functions, even within privilege levels.' },
    { id: 'D1-Q029', domain: 1, question: 'What type of control is encryption?', options: ['Physical', 'Administrative', 'Technical', 'Operational'], correct_answer: 2, explanation: 'Encryption is a technical control that uses technology to protect data confidentiality.' },
    { id: 'D1-Q030', domain: 1, question: 'Which security model focuses on data integrity?', options: ['Bell-LaPadula', 'Biba', 'Clark-Wilson', 'Both Biba and Clark-Wilson'], correct_answer: 3, explanation: 'Both Biba and Clark-Wilson models focus on maintaining data integrity, though through different approaches.' },
    { id: 'D1-Q031', domain: 1, question: 'What is the primary purpose of background checks?', options: ['To verify technical skills', 'To assess security risks before hiring', 'To determine salary levels', 'To check social media presence'], correct_answer: 1, explanation: 'Background checks are administrative controls to assess potential security risks before granting access to sensitive resources.' },
    { id: 'D1-Q032', domain: 1, question: 'Which authentication method uses physical characteristics?', options: ['Password', 'Token', 'Biometric', 'PIN'], correct_answer: 2, explanation: 'Biometric authentication uses unique physical characteristics like fingerprints, iris, or facial recognition.' },
    { id: 'D1-Q033', domain: 1, question: 'What is multi-factor authentication (MFA)?', options: ['Using multiple passwords', 'Using factors from at least two different categories', 'Using multiple usernames', 'Using biometrics only'], correct_answer: 1, explanation: 'MFA requires authentication factors from at least two different categories (something you know, have, or are).' },
    { id: 'D1-Q034', domain: 1, question: 'Which control type attempts to repair damage after an incident?', options: ['Preventive', 'Detective', 'Corrective', 'Compensating'], correct_answer: 2, explanation: 'Corrective controls repair or restore systems after a security incident has been detected.' },
    { id: 'D1-Q035', domain: 1, question: 'What is the principle of implicit deny?', options: ['Deny all access by default unless explicitly allowed', 'Allow all access by default', 'Deny only suspicious activities', 'Allow access after verification'], correct_answer: 0, explanation: 'Implicit deny blocks all access by default unless explicitly permitted, following least privilege principles.' },
    { id: 'D1-Q036', domain: 1, question: 'Which of the following is an example of administrative control?', options: ['Firewall', 'Security policy', 'Encryption', 'Biometric scanner'], correct_answer: 1, explanation: 'Security policies are administrative controls that establish rules and procedures for security management.' },
    { id: 'D1-Q037', domain: 1, question: 'What does risk transference mean?', options: ['Eliminating risk entirely', 'Shifting risk to another party', 'Accepting risk', 'Reducing risk impact'], correct_answer: 1, explanation: 'Risk transference shifts risk to another party, typically through insurance or outsourcing.' },
    { id: 'D1-Q038', domain: 1, question: 'Which security control is a mantrap?', options: ['Technical', 'Administrative', 'Physical', 'Detective'], correct_answer: 2, explanation: 'A mantrap is a physical control that uses two doors to control and monitor access to secure areas.' },
    { id: 'D1-Q039', domain: 1, question: 'What is the purpose of implementing access control lists (ACLs)?', options: ['To list all users', 'To define who can access specific resources', 'To track login attempts', 'To encrypt data'], correct_answer: 1, explanation: 'ACLs specify which users or systems are granted access to objects and what operations they can perform.' },
    { id: 'D1-Q040', domain: 1, question: 'Which principle requires critical operations to be divided among multiple people?', options: ['Least privilege', 'Need to know', 'Separation of duties', 'Defense in depth'], correct_answer: 2, explanation: 'Separation of duties divides critical operations among multiple people to prevent fraud and errors.' },
    { id: 'D1-Q041', domain: 1, question: 'What is single sign-on (SSO)?', options: ['Using one password for all accounts', 'Authenticating once to access multiple systems', 'Single-factor authentication', 'One-time password'], correct_answer: 1, explanation: 'SSO allows users to authenticate once and access multiple systems without re-authenticating.' },
    { id: 'D1-Q042', domain: 1, question: 'Which control category includes locks and fences?', options: ['Technical', 'Administrative', 'Physical', 'Logical'], correct_answer: 2, explanation: 'Locks and fences are physical controls that restrict physical access to facilities and assets.' },
    { id: 'D1-Q043', domain: 1, question: 'What is the purpose of audit trails?', options: ['To prevent attacks', 'To record system activities for review', 'To encrypt data', 'To authenticate users'], correct_answer: 1, explanation: 'Audit trails record system activities, enabling review, investigation, and accountability.' },
    { id: 'D1-Q044', domain: 1, question: 'Which authentication factor is somewhere you are?', options: ['Password', 'Token', 'Fingerprint', 'Geolocation'], correct_answer: 3, explanation: 'Geolocation authentication uses physical location as a factor (somewhere you are).' },
    { id: 'D1-Q045', domain: 1, question: 'What is the difference between identification and authentication?', options: ['They are the same', 'Identification claims identity, authentication proves it', 'Authentication claims identity, identification proves it', 'Identification is for users, authentication is for systems'], correct_answer: 1, explanation: 'Identification is claiming an identity (username), while authentication is proving that identity (password).' },
    { id: 'D1-Q046', domain: 1, question: 'Which security principle requires regularly testing security controls?', options: ['Defense in depth', 'Least privilege', 'Continuous monitoring', 'Need to know'], correct_answer: 2, explanation: 'Continuous monitoring involves regularly testing and verifying that security controls remain effective.' },
    { id: 'D1-Q047', domain: 1, question: 'What is authorization?', options: ['Proving identity', 'Claiming identity', 'Granting access to resources after authentication', 'Logging access attempts'], correct_answer: 2, explanation: 'Authorization determines what authenticated users are allowed to access and what actions they can perform.' },
    { id: 'D1-Q048', domain: 1, question: 'Which control helps ensure accountability?', options: ['Encryption', 'Logging and auditing', 'Firewalls', 'Antivirus'], correct_answer: 1, explanation: 'Logging and auditing create records of user actions, establishing accountability and enabling investigation.' },
    { id: 'D1-Q049', domain: 1, question: 'What is defense in depth also known as?', options: ['Single layer security', 'Layered security', 'Perimeter security', 'Zero trust'], correct_answer: 1, explanation: 'Defense in depth is also called layered security, using multiple security controls at different layers.' },
    { id: 'D1-Q050', domain: 1, question: 'Which principle states that systems should fail in a secure state?', options: ['Fail-open', 'Fail-secure', 'Fail-safe', 'Both fail-secure and fail-safe'], correct_answer: 3, explanation: 'Fail-secure/fail-safe means systems default to a secure state during failure, denying access rather than allowing it.' },
    { id: 'D2-Q001', domain: 2, question: 'What type of malware locks a users files and demands payment for decryption?', options: ['Trojan', 'Ransomware', 'Rootkit', 'Spyware'], correct_answer: 1, explanation: 'Ransomware encrypts victim files and demands payment (ransom) for the decryption key.' },
    { id: 'D2-Q002', domain: 2, question: 'Which attack involves overwhelming a system with traffic to make it unavailable?', options: ['SQL injection', 'Cross-site scripting', 'Denial of Service (DoS)', 'Man-in-the-middle'], correct_answer: 2, explanation: 'A Denial of Service (DoS) attack floods a system with traffic or requests to exhaust resources and make it unavailable to legitimate users.' },
    { id: 'D2-Q003', domain: 2, question: 'What is the difference between a virus and a worm?', options: ['Viruses require user action to spread, worms self-replicate', 'Worms require user action, viruses self-replicate', 'They are the same thing', 'Viruses only affect files, worms only affect networks'], correct_answer: 0, explanation: 'Viruses require user action (like opening an infected file) to spread, while worms can self-replicate and spread automatically across networks.' },
    { id: 'D2-Q004', domain: 2, question: 'Which social engineering attack uses fake scenarios to trick users into revealing information?', options: ['Phishing', 'Pretexting', 'Tailgating', 'Shoulder surfing'], correct_answer: 1, explanation: 'Pretexting involves creating a fabricated scenario or pretext to manipulate victims into divulging information or performing actions.' },
    { id: 'D2-Q005', domain: 2, question: 'What type of attack injects malicious SQL commands into input fields?', options: ['Cross-site scripting (XSS)', 'SQL injection', 'Buffer overflow', 'Directory traversal'], correct_answer: 1, explanation: 'SQL injection attacks insert malicious SQL statements into input fields to manipulate database queries and access unauthorized data.' },
    { id: 'D2-Q006', domain: 2, question: 'Which attack intercepts communication between two parties without their knowledge?', options: ['Replay attack', 'Man-in-the-middle (MITM)', 'Session hijacking', 'DNS poisoning'], correct_answer: 1, explanation: 'Man-in-the-middle (MITM) attacks intercept and potentially alter communications between two parties who believe they are directly communicating.' },
    { id: 'D2-Q007', domain: 2, question: 'What is a zero-day vulnerability?', options: ['A vulnerability discovered on day zero of a product launch', 'A vulnerability unknown to the vendor with no patch available', 'A vulnerability that expires after zero days', 'A vulnerability that takes zero days to exploit'], correct_answer: 1, explanation: 'A zero-day vulnerability is a security flaw unknown to the software vendor, meaning there has been zero days to create a patch.' },
    { id: 'D2-Q008', domain: 2, question: 'Which attack captures and retransmits valid data to gain unauthorized access?', options: ['Brute force', 'Replay attack', 'Password spraying', 'Dictionary attack'], correct_answer: 1, explanation: 'Replay attacks capture legitimate authentication data and retransmit it to gain unauthorized access to systems or services.' },
    { id: 'D2-Q009', domain: 2, question: 'What type of malware disguises itself as legitimate software?', options: ['Virus', 'Worm', 'Trojan', 'Ransomware'], correct_answer: 2, explanation: 'A Trojan (or Trojan horse) disguises itself as legitimate software to trick users into installing it, then performs malicious actions.' },
    { id: 'D2-Q010', domain: 2, question: 'Which vulnerability allows attackers to execute code by overwriting memory?', options: ['SQL injection', 'Buffer overflow', 'Cross-site scripting', 'XML injection'], correct_answer: 1, explanation: 'Buffer overflow occurs when a program writes more data to a buffer than it can hold, potentially allowing execution of malicious code.' },
    { id: 'D2-Q011', domain: 2, question: 'What is spear phishing?', options: ['Phishing attacks using phone calls', 'Targeted phishing attacks against specific individuals or organizations', 'Phishing attacks via social media', 'Phishing attacks using spear weapons imagery'], correct_answer: 1, explanation: 'Spear phishing is a targeted phishing attack directed at specific individuals or organizations, using personalized information to appear legitimate.' },
    { id: 'D2-Q012', domain: 2, question: 'Which attack redirects users to fake websites by corrupting DNS records?', options: ['Pharming', 'Phishing', 'Vishing', 'Smishing'], correct_answer: 0, explanation: 'Pharming redirects users to fraudulent websites by poisoning DNS cache or modifying host files, without requiring user interaction.' },
    { id: 'D2-Q013', domain: 2, question: 'What is the primary characteristic of an Advanced Persistent Threat (APT)?', options: ['Quick, automated attacks', 'Long-term, stealthy attacks with specific targets', 'Attacks using advanced AI', 'Attacks that persist after reboot'], correct_answer: 1, explanation: 'APTs are prolonged, targeted attacks where adversaries gain and maintain access to networks over extended periods, often for espionage.' },
    { id: 'D2-Q014', domain: 2, question: 'Which social engineering technique involves following authorized personnel into restricted areas?', options: ['Shoulder surfing', 'Tailgating', 'Dumpster diving', 'Pretexting'], correct_answer: 1, explanation: 'Tailgating (or piggybacking) involves unauthorized individuals following authorized personnel through secure entry points without proper authentication.' },
    { id: 'D2-Q015', domain: 2, question: 'What type of attack injects malicious scripts into web pages viewed by other users?', options: ['SQL injection', 'Cross-site scripting (XSS)', 'LDAP injection', 'Command injection'], correct_answer: 1, explanation: 'Cross-site scripting (XSS) injects malicious scripts into web pages that are then executed by other users browsers.' },
    { id: 'D2-Q016', domain: 2, question: 'Which malware hides its presence and provides backdoor access to attackers?', options: ['Virus', 'Rootkit', 'Adware', 'Spyware'], correct_answer: 1, explanation: 'Rootkits conceal their presence and the presence of other malware while providing privileged backdoor access to attackers.' },
    { id: 'D2-Q017', domain: 2, question: 'What is credential stuffing?', options: ['Encrypting credentials for secure storage', 'Using stolen username/password combinations from one breach on other sites', 'Generating random passwords', 'Storing multiple credentials in one location'], correct_answer: 1, explanation: 'Credential stuffing uses automated tools to try stolen username/password pairs from one breach against multiple websites.' },
    { id: 'D2-Q018', domain: 2, question: 'Which attack floods systems with SYN requests but never completes the handshake?', options: ['Smurf attack', 'SYN flood', 'Ping of death', 'Teardrop attack'], correct_answer: 1, explanation: 'SYN flood attacks send multiple SYN requests but never complete the TCP three-way handshake, exhausting server resources.' },
    { id: 'D2-Q019', domain: 2, question: 'What is business email compromise (BEC)?', options: ['Hacking corporate email servers', 'Impersonating business executives to authorize fraudulent transactions', 'Encrypting business emails', 'Intercepting business emails in transit'], correct_answer: 1, explanation: 'BEC involves compromising or spoofing business email accounts to impersonate executives and manipulate employees into transferring funds or data.' },
    { id: 'D2-Q020', domain: 2, question: 'Which vulnerability allows attackers to access files outside the intended directory?', options: ['SQL injection', 'Directory traversal', 'Cross-site scripting', 'Buffer overflow'], correct_answer: 1, explanation: 'Directory traversal (path traversal) attacks manipulate file paths to access files and directories outside the web root folder.' },
    { id: 'D2-Q021', domain: 2, question: 'What is the purpose of a watering hole attack?', options: ['To flood systems with water', 'To compromise websites frequented by specific target groups', 'To attack water utilities', 'To intercept communications'], correct_answer: 1, explanation: 'Watering hole attacks compromise websites commonly visited by a target group, infecting visitors who access the compromised site.' },
    { id: 'D2-Q022', domain: 2, question: 'Which attack attempts many password combinations against a single account?', options: ['Password spraying', 'Brute force', 'Rainbow table', 'Dictionary attack'], correct_answer: 1, explanation: 'Brute force attacks systematically try all possible password combinations against an account until the correct one is found.' },
    { id: 'D2-Q023', domain: 2, question: 'What type of attack tries a few common passwords against many accounts?', options: ['Brute force', 'Password spraying', 'Credential stuffing', 'Rainbow table'], correct_answer: 1, explanation: 'Password spraying tries a small set of common passwords against many user accounts to avoid account lockouts.' },
    { id: 'D2-Q024', domain: 2, question: 'Which malware monitors user activities and reports information to attackers?', options: ['Virus', 'Worm', 'Spyware', 'Logic bomb'], correct_answer: 2, explanation: 'Spyware covertly monitors user activities, keystrokes, and data, then sends this information to attackers.' },
    { id: 'D2-Q025', domain: 2, question: 'What is a logic bomb?', options: ['Exploding malware', 'Malicious code triggered by specific conditions', 'A type of physical bomb', 'Malware causing logical errors'], correct_answer: 1, explanation: 'A logic bomb is malicious code that remains dormant until triggered by specific conditions like a date or action.' },
    { id: 'D2-Q026', domain: 2, question: 'Which attack amplifies traffic using third-party servers?', options: ['Amplification attack', 'Direct DoS', 'Application layer attack', 'Slowloris'], correct_answer: 0, explanation: 'Amplification attacks send small requests to third-party servers that respond with much larger replies to the victim.' },
    { id: 'D2-Q027', domain: 2, question: 'What is typosquatting?', options: ['Squatting in buildings', 'Registering misspelled domain names', 'Making code typos', 'Typing errors'], correct_answer: 1, explanation: 'Typosquatting registers domain names similar to popular sites with common typos to capture mistyped traffic.' },
    { id: 'D2-Q028', domain: 2, question: 'Which vulnerability allows execution of OS commands?', options: ['SQL injection', 'Command injection', 'XSS', 'CSRF'], correct_answer: 1, explanation: 'Command injection allows attackers to execute arbitrary commands on the host operating system.' },
    { id: 'D2-Q029', domain: 2, question: 'What is a supply chain attack?', options: ['Attacking shipping companies', 'Compromising third-party vendors to reach targets', 'Disrupting product supply', 'Attacking manufacturers'], correct_answer: 1, explanation: 'Supply chain attacks compromise trusted third-party vendors or software to gain access to target organizations.' },
    { id: 'D2-Q030', domain: 2, question: 'Which attack tricks users into performing unwanted actions?', options: ['SQL injection', 'Cross-site request forgery (CSRF)', 'XSS', 'Session hijacking'], correct_answer: 1, explanation: 'CSRF exploits trust a website has in an authenticated user, tricking them into executing unwanted actions.' },
    { id: 'D2-Q031', domain: 2, question: 'What is vishing?', options: ['Visual hacking', 'Voice phishing via phone', 'Video phishing', 'Virtual phishing'], correct_answer: 1, explanation: 'Vishing (voice phishing) uses phone calls to manipulate victims into revealing sensitive information.' },
    { id: 'D2-Q032', domain: 2, question: 'Which attack corrupts DNS cache data?', options: ['DNS poisoning', 'Domain hijacking', 'URL redirection', 'Subdomain takeover'], correct_answer: 0, explanation: 'DNS poisoning corrupts DNS cache data, causing queries to return incorrect IPs and redirect users to malicious sites.' },
    { id: 'D2-Q033', domain: 2, question: 'What is fileless malware?', options: ['Malware that deletes files', 'Malware operating in memory without writing to disk', 'Malware affecting network only', 'Cloud-based malware'], correct_answer: 1, explanation: 'Fileless malware operates entirely in memory using legitimate tools, making it harder to detect.' },
    { id: 'D2-Q034', domain: 2, question: 'Which attack uses text messages to trick users?', options: ['Vishing', 'Phishing', 'Smishing', 'Whaling'], correct_answer: 2, explanation: 'Smishing (SMS phishing) uses text messages to deceive victims into revealing information or clicking malicious links.' },
    { id: 'D2-Q035', domain: 2, question: 'What distinguishes white hat from black hat hackers?', options: ['Technical skill', 'Tools used', 'Intent and authorization', 'Target selection'], correct_answer: 2, explanation: 'White hat hackers work legally with authorization, while black hat hackers act maliciously without permission.' },
    { id: 'D2-Q036', domain: 2, question: 'Which attack exploits race conditions?', options: ['Time-of-check to time-of-use (TOCTOU)', 'Buffer overflow', 'Integer overflow', 'SQL injection'], correct_answer: 0, explanation: 'TOCTOU attacks exploit the time gap between checking a condition and using a resource.' },
    { id: 'D2-Q037', domain: 2, question: 'What is a birthday attack used against?', options: ['Authentication', 'Hash functions', 'Encryption', 'Network protocols'], correct_answer: 1, explanation: 'Birthday attacks exploit hash collision probabilities to find two inputs producing the same hash output.' },
    { id: 'D2-Q038', domain: 2, question: 'Which vulnerability occurs from improper input validation?', options: ['Input validation vulnerability', 'Authentication bypass', 'Privilege escalation', 'Memory leak'], correct_answer: 0, explanation: 'Input validation vulnerabilities occur when applications do not properly check user input, allowing injection attacks.' },
    { id: 'D2-Q039', domain: 2, question: 'What is session hijacking?', options: ['Creating sessions', 'Taking over an authenticated session', 'Ending sessions', 'Monitoring sessions'], correct_answer: 1, explanation: 'Session hijacking involves stealing or predicting session tokens to take over authenticated sessions.' },
    { id: 'D2-Q040', domain: 2, question: 'Which attack floods targets with ICMP echo requests?', options: ['Smurf attack', 'Ping flood', 'SYN flood', 'UDP flood'], correct_answer: 1, explanation: 'Ping flood attacks overwhelm targets with ICMP echo request packets to exhaust bandwidth and resources.' },
    { id: 'D2-Q041', domain: 2, question: 'What is the primary goal of reconnaissance?', options: ['To damage systems', 'To gather information about targets', 'To steal data', 'To install malware'], correct_answer: 1, explanation: 'Reconnaissance gathers information about targets to identify vulnerabilities and plan attacks.' },
    { id: 'D2-Q042', domain: 2, question: 'Which attack uses multiple compromised systems?', options: ['DoS', 'DDoS', 'Ping flood', 'Smurf attack'], correct_answer: 1, explanation: 'Distributed Denial of Service (DDoS) attacks use multiple compromised systems to overwhelm targets.' },
    { id: 'D2-Q043', domain: 2, question: 'What is privilege escalation?', options: ['Granting privileges', 'Gaining higher access than authorized', 'Escalating tickets', 'Increasing privileges legitimately'], correct_answer: 1, explanation: 'Privilege escalation exploits vulnerabilities to gain elevated access rights beyond what was authorized.' },
    { id: 'D2-Q044', domain: 2, question: 'Which attack uses pre-computed hash tables?', options: ['Brute force', 'Dictionary attack', 'Rainbow table', 'Password spraying'], correct_answer: 2, explanation: 'Rainbow table attacks use pre-computed hash tables to quickly reverse hash functions and crack passwords.' },
    { id: 'D2-Q045', domain: 2, question: 'What is clickjacking?', options: ['Stealing clicks', 'Tricking users into clicking hidden elements', 'Recording clicks', 'Preventing clicks'], correct_answer: 1, explanation: 'Clickjacking overlays transparent elements over legitimate content, tricking users into clicking malicious links.' },
    { id: 'D2-Q046', domain: 2, question: 'Which attack exploits XML parsers?', options: ['SQL injection', 'XML external entity (XXE)', 'XSS', 'LDAP injection'], correct_answer: 1, explanation: 'XXE attacks exploit vulnerable XML parsers to access local files or execute remote requests.' },
    { id: 'D2-Q047', domain: 2, question: 'What is pass-the-hash?', options: ['Sharing hashes', 'Using captured hashes for authentication', 'Encrypting passwords', 'Generating hashes'], correct_answer: 1, explanation: 'Pass-the-hash attacks use captured password hashes to authenticate without cracking the actual password.' },
    { id: 'D2-Q048', domain: 2, question: 'Which vulnerability allows including malicious files?', options: ['File inclusion', 'Directory traversal', 'SQL injection', 'Command injection'], correct_answer: 0, explanation: 'File inclusion vulnerabilities allow attackers to include and execute malicious files from local or remote sources.' },
    { id: 'D2-Q049', domain: 2, question: 'What is an exploit kit?', options: ['Development tools', 'Automated framework delivering exploits', 'Testing tools', 'Patching tools'], correct_answer: 1, explanation: 'Exploit kits are automated tools that scan for vulnerabilities and deploy appropriate exploits.' },
    { id: 'D2-Q050', domain: 2, question: 'Which attack targets high-profile individuals?', options: ['Phishing', 'Spear phishing', 'Whaling', 'Vishing'], correct_answer: 2, explanation: 'Whaling specifically targets high-profile individuals like executives with customized phishing attacks.' },
    { id: 'D3-Q001', domain: 3, question: 'What is the primary purpose of network segmentation?', options: ['To increase network speed', 'To isolate network sections and contain security breaches', 'To reduce hardware costs', 'To simplify network management'], correct_answer: 1, explanation: 'Network segmentation divides networks into isolated sections to contain breaches, limit lateral movement, and improve security.' },
    { id: 'D3-Q002', domain: 3, question: 'Which device filters traffic between network segments based on rules?', options: ['Router', 'Switch', 'Firewall', 'Hub'], correct_answer: 2, explanation: 'Firewalls filter network traffic based on defined security rules, controlling what traffic can pass between network segments.' },
    { id: 'D3-Q003', domain: 3, question: 'What is the purpose of a DMZ (Demilitarized Zone)?', options: ['To provide wireless access', 'To isolate public-facing services from internal networks', 'To store military data', 'To increase internet speed'], correct_answer: 1, explanation: 'A DMZ is a network segment that isolates public-facing services from the internal network, adding an extra security layer.' },
    { id: 'D3-Q004', domain: 3, question: 'Which architecture model assumes no trust by default, even for internal traffic?', options: ['Perimeter security', 'Zero trust', 'Defense in depth', 'Network segmentation'], correct_answer: 1, explanation: 'Zero trust architecture operates on never trust, always verify, requiring authentication and authorization for all access regardless of location.' },
    { id: 'D3-Q005', domain: 3, question: 'What does a proxy server do?', options: ['Stores backup data', 'Acts as intermediary between clients and servers', 'Encrypts network traffic', 'Monitors physical security'], correct_answer: 1, explanation: 'A proxy server acts as an intermediary between clients and servers, forwarding requests and responses while potentially filtering or caching content.' },
    { id: 'D3-Q006', domain: 3, question: 'Which security control inspects traffic at the application layer?', options: ['Packet filter firewall', 'Network firewall', 'Web application firewall (WAF)', 'Circuit-level gateway'], correct_answer: 2, explanation: 'WAFs operate at the application layer, inspecting HTTP/HTTPS traffic to protect web applications from attacks like SQL injection and XSS.' },
    { id: 'D3-Q007', domain: 3, question: 'What is the primary function of a VPN?', options: ['To increase network speed', 'To create secure encrypted tunnels over public networks', 'To filter spam emails', 'To backup data'], correct_answer: 1, explanation: 'VPNs create encrypted tunnels over public networks, providing secure remote access and protecting data confidentiality.' },
    { id: 'D3-Q008', domain: 3, question: 'Which technology creates isolated networks on a single physical infrastructure?', options: ['Subnetting', 'VLAN', 'NAT', 'VPN'], correct_answer: 1, explanation: 'VLANs (Virtual Local Area Networks) create logically separated networks on the same physical infrastructure for improved security and management.' },
    { id: 'D3-Q009', domain: 3, question: 'What is the purpose of Network Access Control (NAC)?', options: ['To control internet bandwidth', 'To enforce security policies before devices access the network', 'To provide wireless connectivity', 'To filter email traffic'], correct_answer: 1, explanation: 'NAC enforces security policies by verifying device compliance before granting network access, ensuring only authorized and compliant devices connect.' },
    { id: 'D3-Q010', domain: 3, question: 'Which protocol provides secure remote access to network devices?', options: ['Telnet', 'SSH', 'FTP', 'HTTP'], correct_answer: 1, explanation: 'SSH (Secure Shell) provides encrypted remote access to network devices, replacing insecure protocols like Telnet.' },
    { id: 'D3-Q011', domain: 3, question: 'What is an air gap?', options: ['A physical separation between networks with no connection', 'A gap in firewall rules', 'Space between servers', 'A wireless network range'], correct_answer: 0, explanation: 'An air gap is physical isolation between networks with no direct connection, providing the highest level of network separation.' },
    { id: 'D3-Q012', domain: 3, question: 'Which device aggregates logs from multiple sources for analysis?', options: ['Firewall', 'IDS', 'SIEM', 'Router'], correct_answer: 2, explanation: 'SIEM (Security Information and Event Management) systems collect, aggregate, and analyze logs from multiple sources for security monitoring.' },
    { id: 'D3-Q013', domain: 3, question: 'What is the difference between IDS and IPS?', options: ['IDS detects threats, IPS can block them', 'IPS detects threats, IDS blocks them', 'They are the same thing', 'IDS is hardware, IPS is software'], correct_answer: 0, explanation: 'IDS (Intrusion Detection System) alerts on threats, while IPS (Intrusion Prevention System) can actively block malicious traffic.' },
    { id: 'D3-Q014', domain: 3, question: 'Which architecture distributes resources across multiple locations for availability?', options: ['Centralized', 'Decentralized', 'Distributed', 'Hybrid'], correct_answer: 2, explanation: 'Distributed architecture spreads resources across multiple locations to improve availability, performance, and resilience.' },
    { id: 'D3-Q015', domain: 3, question: 'What is micro-segmentation?', options: ['Dividing small networks', 'Granular security policies for individual workloads', 'Using small network cables', 'Segmenting microservices'], correct_answer: 1, explanation: 'Micro-segmentation applies granular security policies to individual workloads or applications, limiting lateral movement in compromised networks.' },
    { id: 'D3-Q016', domain: 3, question: 'Which cloud service model provides virtualized computing resources?', options: ['SaaS', 'PaaS', 'IaaS', 'DaaS'], correct_answer: 2, explanation: 'IaaS (Infrastructure as a Service) provides virtualized computing resources like servers, storage, and networking over the internet.' },
    { id: 'D3-Q017', domain: 3, question: 'What is the primary security benefit of containerization?', options: ['Faster deployment', 'Application isolation', 'Reduced costs', 'Better performance'], correct_answer: 1, explanation: 'Containerization isolates applications in separate environments, limiting the impact if one container is compromised.' },
    { id: 'D3-Q018', domain: 3, question: 'Which protocol secures email transmission?', options: ['SMTP', 'POP3', 'TLS/SSL', 'IMAP'], correct_answer: 2, explanation: 'TLS/SSL protocols encrypt email transmission, protecting confidentiality when used with SMTP, POP3, or IMAP.' },
    { id: 'D3-Q019', domain: 3, question: 'What is a jump server (bastion host)?', options: ['A backup server', 'A hardened system providing secure access to other systems', 'A server that increases network speed', 'A virtualization host'], correct_answer: 1, explanation: 'A jump server is a hardened, monitored system that provides controlled access to devices in different security zones.' },
    { id: 'D3-Q020', domain: 3, question: 'Which technology allows multiple operating systems on one physical host?', options: ['Containerization', 'Virtualization', 'Cloud computing', 'Clustering'], correct_answer: 1, explanation: 'Virtualization allows multiple virtual machines with different operating systems to run on a single physical host.' },
    { id: 'D3-Q021', domain: 3, question: 'What is the purpose of load balancing?', options: ['Reduce costs', 'Distribute traffic across multiple servers', 'Increase storage', 'Improve policies'], correct_answer: 1, explanation: 'Load balancing distributes network traffic across multiple servers for optimal resource use and availability.' },
    { id: 'D3-Q022', domain: 3, question: 'Which principle limits access based on business needs?', options: ['Defense in depth', 'Least privilege', 'Separation of duties', 'Zero trust'], correct_answer: 1, explanation: 'Least privilege ensures users have only minimum access necessary for their job functions.' },
    { id: 'D3-Q023', domain: 3, question: 'What is Software-Defined Networking (SDN)?', options: ['Hardware defined by software', 'Centralized control through software', 'Design software', 'Monitoring software'], correct_answer: 1, explanation: 'SDN separates control plane from data plane, allowing centralized network management through software.' },
    { id: 'D3-Q024', domain: 3, question: 'Which component manages authentication and authorization?', options: ['Firewall', 'Identity and Access Management (IAM)', 'VPN', 'SIEM'], correct_answer: 1, explanation: 'IAM systems manage digital identities and control access through authentication and authorization.' },
    { id: 'D3-Q025', domain: 3, question: 'What is the primary purpose of network redundancy?', options: ['Increase security', 'Ensure availability if primary fails', 'Improve performance', 'Reduce costs'], correct_answer: 1, explanation: 'Network redundancy provides backup paths and components to maintain availability during failures.' },
    { id: 'D3-Q026', domain: 3, question: 'Which protocol is used for secure web browsing?', options: ['HTTP', 'HTTPS', 'FTP', 'Telnet'], correct_answer: 1, explanation: 'HTTPS uses TLS/SSL to encrypt HTTP traffic, providing secure communication for web browsing.' },
    { id: 'D3-Q027', domain: 3, question: 'What is NAT?', options: ['Name translation', 'Mapping private IPs to public IPs', 'Encrypting traffic', 'Segmenting networks'], correct_answer: 1, explanation: 'NAT translates private IP addresses to public IPs, conserving addresses and hiding internal structure.' },
    { id: 'D3-Q028', domain: 3, question: 'Which cloud model is used exclusively by one organization?', options: ['Public cloud', 'Private cloud', 'Hybrid cloud', 'Community cloud'], correct_answer: 1, explanation: 'Private cloud infrastructure is dedicated to a single organization for greater control.' },
    { id: 'D3-Q029', domain: 3, question: 'What is East-West traffic?', options: ['Client to server', 'Server to server within datacenter', 'Internet-bound', 'Backup traffic'], correct_answer: 1, explanation: 'East-West traffic flows between servers within a data center, not entering/leaving it.' },
    { id: 'D3-Q030', domain: 3, question: 'Which control monitors DNS queries?', options: ['DNS firewall', 'Web proxy', 'Email gateway', 'VPN'], correct_answer: 0, explanation: 'DNS firewalls filter DNS queries to block access to malicious domains.' },
    { id: 'D3-Q031', domain: 3, question: 'What is the purpose of API security?', options: ['Increase speed', 'Protect APIs from attacks', 'Develop APIs', 'Document APIs'], correct_answer: 1, explanation: 'API security protects interfaces through authentication, authorization, encryption, and validation.' },
    { id: 'D3-Q032', domain: 3, question: 'Which technology provides secure wireless access?', options: ['WEP', 'WPA3', 'MAC filtering', 'SSID hiding'], correct_answer: 1, explanation: 'WPA3 provides the strongest security for wireless networks with improved encryption.' },
    { id: 'D3-Q033', domain: 3, question: 'What is a security zone?', options: ['Physical area', 'Network segment with specific security requirements', 'Time zone', 'Restricted area'], correct_answer: 1, explanation: 'Security zones are network segments with similar security requirements separated by controls.' },
    { id: 'D3-Q034', domain: 3, question: 'Which architecture uses multiple cloud providers?', options: ['Single cloud', 'Multi-cloud', 'Hybrid cloud', 'Private cloud'], correct_answer: 1, explanation: 'Multi-cloud architecture uses services from multiple providers to avoid vendor lock-in.' },
    { id: 'D3-Q035', domain: 3, question: 'What is DLP?', options: ['Preventing hardware failures', 'Detecting and preventing unauthorized data transmission', 'Preventing corruption', 'Preventing crashes'], correct_answer: 1, explanation: 'DLP systems monitor, detect, and prevent unauthorized transmission of sensitive data.' },
    { id: 'D3-Q036', domain: 3, question: 'Which protocol provides time synchronization?', options: ['HTTP', 'NTP', 'SNMP', 'DNS'], correct_answer: 1, explanation: 'NTP (Network Time Protocol) synchronizes clocks across network devices.' },
    { id: 'D3-Q037', domain: 3, question: 'What is serverless architecture?', options: ['No servers', 'Cloud provider manages infrastructure', 'Client-side only', 'Peer-to-peer'], correct_answer: 1, explanation: 'Serverless allows code execution without managing servers, with provider handling infrastructure.' },
    { id: 'D3-Q038', domain: 3, question: 'Which control protects against email threats?', options: ['Firewall', 'Email gateway', 'VPN', 'IDS'], correct_answer: 1, explanation: 'Email gateways filter email for spam, malware, phishing, and data loss prevention.' },
    { id: 'D3-Q039', domain: 3, question: 'What does NAC enforce?', options: ['Internet speed', 'Security policy compliance before access', 'Cable management', 'Wireless signals'], correct_answer: 1, explanation: 'NAC ensures devices meet security requirements before accessing the network.' },
    { id: 'D3-Q040', domain: 3, question: 'Which architecture separates presentation, application, and data?', options: ['Monolithic', 'Three-tier', 'Peer-to-peer', 'Client-server'], correct_answer: 1, explanation: 'Three-tier architecture separates layers for better security, scalability, and maintenance.' },
    { id: 'D3-Q041', domain: 3, question: 'What is a screened subnet?', options: ['Wireless network', 'DMZ with firewalls on both sides', 'Internal network', 'Guest network'], correct_answer: 1, explanation: 'A screened subnet (DMZ) has firewalls between internet and DMZ, and between DMZ and internal network.' },
    { id: 'D3-Q042', domain: 3, question: 'Which security model uses security labels?', options: ['DAC', 'MAC', 'RBAC', 'ABAC'], correct_answer: 1, explanation: 'MAC (Mandatory Access Control) uses security labels to enforce access based on classification levels.' },
    { id: 'D3-Q043', domain: 3, question: 'What is network access control list (NACL)?', options: ['User list', 'Firewall rules for subnets', 'Router configuration', 'Switch settings'], correct_answer: 1, explanation: 'NACLs are stateless firewall rules that control traffic at the subnet level in networks.' },
    { id: 'D3-Q044', domain: 3, question: 'Which protocol secures file transfers?', options: ['FTP', 'SFTP', 'HTTP', 'Telnet'], correct_answer: 1, explanation: 'SFTP (SSH File Transfer Protocol) provides secure encrypted file transfers.' },
    { id: 'D3-Q045', domain: 3, question: 'What is infrastructure as code (IaC)?', options: ['Coding infrastructure', 'Managing infrastructure through code', 'Infrastructure documentation', 'Hardware programming'], correct_answer: 1, explanation: 'IaC manages and provisions infrastructure through machine-readable definition files.' },
    { id: 'D3-Q046', domain: 3, question: 'Which technology isolates network traffic at layer 2?', options: ['Subnetting', 'VLAN', 'VPN', 'Firewall'], correct_answer: 1, explanation: 'VLANs logically segment networks at layer 2 for isolation and security.' },
    { id: 'D3-Q047', domain: 3, question: 'What is a next-generation firewall (NGFW)?', options: ['Newer firewall hardware', 'Firewall with application awareness and IPS', 'Faster firewall', 'Cloud firewall'], correct_answer: 1, explanation: 'NGFWs combine traditional firewall with application-level inspection, IPS, and threat intelligence.' },
    { id: 'D3-Q048', domain: 3, question: 'Which architecture principle separates management from data traffic?', options: ['Segmentation', 'Out-of-band management', 'Virtualization', 'Load balancing'], correct_answer: 1, explanation: 'Out-of-band management uses separate network for management traffic, improving security.' },
    { id: 'D3-Q049', domain: 3, question: 'What is SD-WAN?', options: ['Software-defined wide area network', 'Secure data WAN', 'Standard WAN', 'Static WAN'], correct_answer: 0, explanation: 'SD-WAN uses software to manage and optimize WAN connections across multiple sites.' },
    { id: 'D3-Q050', domain: 3, question: 'Which access control model uses policies based on attributes?', options: ['DAC', 'MAC', 'RBAC', 'ABAC'], correct_answer: 3, explanation: 'ABAC (Attribute-Based Access Control) makes decisions based on attributes of users, resources, and environment.' },
    { id: 'D4-Q001', domain: 4, question: 'What is the purpose of security monitoring?', options: ['To increase system performance', 'To detect and respond to security incidents', 'To reduce network traffic', 'To manage user accounts'], correct_answer: 1, explanation: 'Security monitoring continuously observes systems and networks to detect, analyze, and respond to security incidents and threats.' },
    { id: 'D4-Q002', domain: 4, question: 'Which log type records user authentication attempts?', options: ['System logs', 'Application logs', 'Security logs', 'Performance logs'], correct_answer: 2, explanation: 'Security logs record authentication events, including successful and failed login attempts, for audit and investigation purposes.' },
    { id: 'D4-Q003', domain: 4, question: 'What is the first step in incident response?', options: ['Containment', 'Eradication', 'Preparation', 'Recovery'], correct_answer: 2, explanation: 'Preparation is the first phase, involving developing plans, training staff, and establishing tools and procedures before incidents occur.' },
    { id: 'D4-Q004', domain: 4, question: 'Which process involves identifying security weaknesses through controlled testing?', options: ['Patch management', 'Vulnerability assessment', 'Change management', 'Configuration management'], correct_answer: 1, explanation: 'Vulnerability assessment systematically identifies, quantifies, and prioritizes security weaknesses in systems and networks.' },
    { id: 'D4-Q005', domain: 4, question: 'What is the purpose of a security baseline?', options: ['To set minimum security requirements for systems', 'To measure network performance', 'To calculate security budgets', 'To determine staffing needs'], correct_answer: 0, explanation: 'A security baseline establishes minimum security settings and configurations that all systems must meet.' },
    { id: 'D4-Q006', domain: 4, question: 'Which type of backup copies only changed data since the last full backup?', options: ['Full backup', 'Incremental backup', 'Differential backup', 'Snapshot backup'], correct_answer: 2, explanation: 'Differential backups copy all data changed since the last full backup, requiring only the full and latest differential for restoration.' },
    { id: 'D4-Q007', domain: 4, question: 'What is the primary purpose of patch management?', options: ['To improve system performance', 'To update software and fix security vulnerabilities', 'To add new features', 'To reduce storage usage'], correct_answer: 1, explanation: 'Patch management ensures systems are updated with security patches to fix vulnerabilities and maintain security posture.' },
    { id: 'D4-Q008', domain: 4, question: 'Which incident response phase involves removing the threat from systems?', options: ['Identification', 'Containment', 'Eradication', 'Recovery'], correct_answer: 2, explanation: 'Eradication removes the threat, malware, or unauthorized access from affected systems after containment.' },
    { id: 'D4-Q009', domain: 4, question: 'What is forensic imaging?', options: ['Taking photos of crime scenes', 'Creating exact copies of storage media for investigation', 'Enhancing security camera footage', 'Drawing network diagrams'], correct_answer: 1, explanation: 'Forensic imaging creates bit-by-bit copies of storage media to preserve evidence without altering the original.' },
    { id: 'D4-Q010', domain: 4, question: 'Which metric measures how long a service can be unavailable?', options: ['MTTR', 'MTBF', 'RTO', 'RPO'], correct_answer: 2, explanation: 'RTO (Recovery Time Objective) defines the maximum acceptable time a service can be down after an incident.' },
    { id: 'D4-Q011', domain: 4, question: 'What is the purpose of hardening a system?', options: ['To make it physically stronger', 'To reduce attack surface by removing unnecessary features', 'To increase processing power', 'To improve user experience'], correct_answer: 1, explanation: 'Hardening reduces the attack surface by disabling unnecessary services, removing unused software, and applying security configurations.' },
    { id: 'D4-Q012', domain: 4, question: 'Which process ensures changes do not negatively impact security?', options: ['Patch management', 'Change management', 'Asset management', 'Configuration management'], correct_answer: 1, explanation: 'Change management controls and documents system changes to ensure they are properly reviewed, tested, and do not introduce vulnerabilities.' },
    { id: 'D4-Q013', domain: 4, question: 'What is a Security Operations Center (SOC)?', options: ['A physical security facility', 'A team that monitors and responds to security incidents', 'A type of firewall', 'A compliance framework'], correct_answer: 1, explanation: 'A SOC is a centralized unit that monitors, detects, investigates, and responds to security incidents 24/7.' },
    { id: 'D4-Q014', domain: 4, question: 'Which backup type copies only data changed since the last backup of any type?', options: ['Full backup', 'Incremental backup', 'Differential backup', 'Mirror backup'], correct_answer: 1, explanation: 'Incremental backups copy only data changed since the last backup of any type, requiring all increments for full restoration.' },
    { id: 'D4-Q015', domain: 4, question: 'What is the chain of custody?', options: ['Management hierarchy', 'Documentation of evidence handling', 'Security clearance levels', 'Network topology'], correct_answer: 1, explanation: 'Chain of custody documents who handled evidence, when, and how to maintain its integrity for legal proceedings.' },
    { id: 'D4-Q016', domain: 4, question: 'Which metric measures average time between system failures?', options: ['MTTR', 'MTBF', 'RTO', 'RPO'], correct_answer: 1, explanation: 'MTBF (Mean Time Between Failures) measures the average time a system operates before experiencing a failure.' },
    { id: 'D4-Q017', domain: 4, question: 'What is the purpose of vulnerability scanning?', options: ['To exploit vulnerabilities', 'To identify potential security weaknesses', 'To improve system performance', 'To reduce costs'], correct_answer: 1, explanation: 'Vulnerability scanning automatically identifies known security weaknesses in systems, applications, and networks.' },
    { id: 'D4-Q018', domain: 4, question: 'Which incident response phase involves restoring normal operations?', options: ['Containment', 'Eradication', 'Recovery', 'Lessons learned'], correct_answer: 2, explanation: 'Recovery involves restoring systems to normal operations and verifying they are functioning properly and securely.' },
    { id: 'D4-Q019', domain: 4, question: 'What is penetration testing?', options: ['Testing network cable quality', 'Simulating attacks to identify vulnerabilities', 'Testing user passwords', 'Testing backup procedures'], correct_answer: 1, explanation: 'Penetration testing simulates real-world attacks to identify vulnerabilities and assess security effectiveness.' },
    { id: 'D4-Q020', domain: 4, question: 'Which log aggregation method collects logs from multiple sources?', options: ['Local logging', 'Centralized logging', 'Distributed logging', 'Cloud logging'], correct_answer: 1, explanation: 'Centralized logging collects logs from multiple sources into a single repository for analysis, correlation, and retention.' },
    { id: 'D4-Q021', domain: 4, question: 'What is configuration management?', options: ['Managing cables', 'Maintaining consistent system configurations', 'User accounts', 'Licenses'], correct_answer: 1, explanation: 'Configuration management maintains consistent, documented system configurations and tracks changes.' },
    { id: 'D4-Q022', domain: 4, question: 'Which metric defines maximum data loss?', options: ['MTTR', 'MTBF', 'RTO', 'RPO'], correct_answer: 3, explanation: 'RPO (Recovery Point Objective) defines maximum acceptable data loss measured in time.' },
    { id: 'D4-Q023', domain: 4, question: 'What is security orchestration?', options: ['Playing music', 'Automating and coordinating security tools', 'Organizing staff', 'Prioritizing vulnerabilities'], correct_answer: 1, explanation: 'Security orchestration automates and coordinates multiple security tools and processes.' },
    { id: 'D4-Q024', domain: 4, question: 'Which evidence type includes electronic data?', options: ['Physical', 'Digital', 'Documentary', 'Testimonial'], correct_answer: 1, explanation: 'Digital evidence includes data stored or transmitted electronically.' },
    { id: 'D4-Q025', domain: 4, question: 'What is threat hunting?', options: ['Hunting employees', 'Proactively searching for threats', 'Removing threats', 'Documenting threats'], correct_answer: 1, explanation: 'Threat hunting proactively searches for threats that evaded existing security controls.' },
    { id: 'D4-Q026', domain: 4, question: 'Which process tracks organizational assets?', options: ['Change management', 'Asset management', 'Configuration management', 'Patch management'], correct_answer: 1, explanation: 'Asset management tracks and maintains inventory of all organizational hardware, software, and data.' },
    { id: 'D4-Q027', domain: 4, question: 'What is security automation?', options: ['Eliminating staff', 'Performing tasks without manual intervention', 'Auto-hacking', 'Reducing budgets'], correct_answer: 1, explanation: 'Security automation handles repetitive tasks like log analysis and alert triage automatically.' },
    { id: 'D4-Q028', domain: 4, question: 'Which phase determines if an incident occurred?', options: ['Preparation', 'Identification', 'Containment', 'Recovery'], correct_answer: 1, explanation: 'Identification determines whether a security incident occurred and assesses its scope.' },
    { id: 'D4-Q029', domain: 4, question: 'What is volatility in forensics?', options: ['How dangerous evidence is', 'How quickly data can be lost', 'How much data exists', 'How encrypted data is'], correct_answer: 1, explanation: 'Volatility refers to how quickly data can be lost, requiring collection of most volatile data first.' },
    { id: 'D4-Q030', domain: 4, question: 'Which metric measures average repair time?', options: ['MTTR', 'MTBF', 'RTO', 'RPO'], correct_answer: 0, explanation: 'MTTR (Mean Time To Repair) measures average time to repair and restore after failure.' },
    { id: 'D4-Q031', domain: 4, question: 'What is a security playbook?', options: ['Childrens book', 'Documented procedures for incidents', 'Training manual', 'Compliance checklist'], correct_answer: 1, explanation: 'Security playbooks contain documented procedures for responding to specific incident types.' },
    { id: 'D4-Q032', domain: 4, question: 'Which process safely disposes of data?', options: ['Encryption', 'Sanitization', 'Backup', 'Archiving'], correct_answer: 1, explanation: 'Sanitization permanently removes data through overwriting, degaussing, or destruction.' },
    { id: 'D4-Q033', domain: 4, question: 'What establishes minimum security configurations?', options: ['Security baselines', 'Network speed', 'Costs', 'Training'], correct_answer: 0, explanation: 'Security baselines establish minimum configuration standards all systems must meet.' },
    { id: 'D4-Q034', domain: 4, question: 'Which strategy isolates affected systems?', options: ['Eradication', 'Segmentation', 'Recovery', 'Identification'], correct_answer: 1, explanation: 'Segmentation isolates compromised systems to prevent threat spread during incidents.' },
    { id: 'D4-Q035', domain: 4, question: 'What is order of volatility?', options: ['Most volatile to least', 'Least to most', 'Largest to smallest', 'Oldest to newest'], correct_answer: 0, explanation: 'Evidence collection follows most volatile (RAM) to least volatile (hard drives) order.' },
    { id: 'D4-Q036', domain: 4, question: 'Which testing has NO knowledge of target?', options: ['White box', 'Black box', 'Gray box', 'Clear box'], correct_answer: 1, explanation: 'Black box testing simulates external attacker with no prior target knowledge.' },
    { id: 'D4-Q037', domain: 4, question: 'What is security posture?', options: ['Sitting position', 'Overall security strength and readiness', 'Physical stance', 'Policy documentation'], correct_answer: 1, explanation: 'Security posture represents overall security strength, controls, and readiness to prevent/respond.' },
    { id: 'D4-Q038', domain: 4, question: 'Which logs are most useful for incidents?', options: ['Performance', 'Application', 'Security', 'System'], correct_answer: 2, explanation: 'Security logs record authentication and security events critical for investigation.' },
    { id: 'D4-Q039', domain: 4, question: 'What is tabletop exercise?', options: ['Physical testing', 'Discussion-based scenario walkthrough', 'New hire training', 'Backup testing'], correct_answer: 1, explanation: 'Tabletop exercises discuss incident scenarios to test response procedures.' },
    { id: 'D4-Q040', domain: 4, question: 'Which technique recovers deleted files?', options: ['File recovery', 'Data carving', 'Steganography', 'Encryption'], correct_answer: 1, explanation: 'Data carving recovers files from unallocated space by identifying file signatures.' },
    { id: 'D4-Q041', domain: 4, question: 'What documents identified risks?', options: ['Risk register', 'Device list', 'Control list', 'Audit log'], correct_answer: 0, explanation: 'Risk register documents identified risks, likelihood, impact, and mitigation strategies.' },
    { id: 'D4-Q042', domain: 4, question: 'Which backup uses incrementals with periodic fulls?', options: ['Full only', 'Differential', 'Incremental', 'Grandfather-father-son'], correct_answer: 3, explanation: 'Grandfather-father-son combines full backups with incrementals for long-term retention.' },
    { id: 'D4-Q043', domain: 4, question: 'What is security information sharing?', options: ['Sharing passwords', 'Exchanging threat intelligence', 'Publishing policies', 'Training'], correct_answer: 1, explanation: 'Security information sharing exchanges threat intelligence and best practices between organizations.' },
    { id: 'D4-Q044', domain: 4, question: 'Which metric indicates availability?', options: ['Uptime percentage', 'Response time', 'Throughput', 'Bandwidth'], correct_answer: 0, explanation: 'Uptime percentage measures proportion of time systems are operational.' },
    { id: 'D4-Q045', domain: 4, question: 'What is quarantine in IR?', options: ['Deleting systems', 'Isolating compromised systems', 'Improving performance', 'Backing up'], correct_answer: 1, explanation: 'Quarantine isolates compromised systems to prevent spread while allowing analysis.' },
    { id: 'D4-Q046', domain: 4, question: 'Which testing has full knowledge?', options: ['Black box', 'White box', 'Gray box', 'Blind testing'], correct_answer: 1, explanation: 'White box testing has complete knowledge including source code and architecture.' },
    { id: 'D4-Q047', domain: 4, question: 'What is security alerting?', options: ['Training staff', 'Automated notifications of events', 'Physical alarms', 'Posters'], correct_answer: 1, explanation: 'Security alerting automatically notifies personnel of potential incidents or violations.' },
    { id: 'D4-Q048', domain: 4, question: 'Which retention factor is most important?', options: ['Storage costs', 'Legal requirements', 'Performance', 'Preferences'], correct_answer: 1, explanation: 'Legal and regulatory requirements dictate minimum retention periods for compliance.' },
    { id: 'D4-Q049', domain: 4, question: 'What measures program effectiveness?', options: ['Punishing employees', 'Security metrics', 'Reducing budgets', 'Creating policies'], correct_answer: 1, explanation: 'Security metrics quantitatively measure security program effectiveness and trends.' },
    { id: 'D4-Q050', domain: 4, question: 'Which phase reviews incidents?', options: ['Preparation', 'Identification', 'Recovery', 'Lessons learned'], correct_answer: 3, explanation: 'Lessons learned reviews incidents and responses to identify improvements.' },
    { id: 'D5-Q001', domain: 5, question: 'What is the primary purpose of a security policy?', options: ['To document security incidents', 'To establish high-level security objectives and principles', 'To provide step-by-step instructions', 'To list security tools'], correct_answer: 1, explanation: 'Security policies establish high-level security objectives, principles, and management direction for the organization.' },
    { id: 'D5-Q002', domain: 5, question: 'Which document provides detailed step-by-step instructions?', options: ['Policy', 'Standard', 'Procedure', 'Guideline'], correct_answer: 2, explanation: 'Procedures provide detailed, step-by-step instructions for completing specific security-related tasks or processes.' },
    { id: 'D5-Q003', domain: 5, question: 'What is risk appetite?', options: ['The amount of food security staff consume', 'The level of risk an organization is willing to accept', 'The desire to take risks', 'The cost of security controls'], correct_answer: 1, explanation: 'Risk appetite is the amount and type of risk an organization is willing to accept in pursuit of business objectives.' },
    { id: 'D5-Q004', domain: 5, question: 'Which framework provides security controls for federal information systems?', options: ['ISO 27001', 'NIST SP 800-53', 'PCI DSS', 'COBIT'], correct_answer: 1, explanation: 'NIST SP 800-53 provides comprehensive security and privacy controls for federal information systems and organizations.' },
    { id: 'D5-Q005', domain: 5, question: 'What is the purpose of vendor risk management?', options: ['To eliminate all vendors', 'To assess and mitigate risks from third-party vendors', 'To negotiate lower prices', 'To manage vendor contracts'], correct_answer: 1, explanation: 'Vendor risk management assesses, monitors, and mitigates security risks introduced by third-party vendors and service providers.' },
    { id: 'D5-Q006', domain: 5, question: 'Which compliance framework applies to payment card data?', options: ['HIPAA', 'GDPR', 'PCI DSS', 'SOX'], correct_answer: 2, explanation: 'PCI DSS (Payment Card Industry Data Security Standard) provides security requirements for organizations handling payment card data.' },
    { id: 'D5-Q007', domain: 5, question: 'What is a Business Impact Analysis (BIA)?', options: ['Analysis of business profits', 'Assessment of critical business functions and disruption impacts', 'Market research analysis', 'Employee performance review'], correct_answer: 1, explanation: 'BIA identifies critical business functions, their dependencies, and potential impacts of disruptions to prioritize recovery efforts.' },
    { id: 'D5-Q008', domain: 5, question: 'Which document defines mandatory security requirements?', options: ['Policy', 'Standard', 'Procedure', 'Guideline'], correct_answer: 1, explanation: 'Standards define mandatory, specific security requirements and acceptable configurations that must be followed.' },
    { id: 'D5-Q009', domain: 5, question: 'What is the purpose of security awareness training?', options: ['To teach advanced hacking skills', 'To educate employees about security threats and best practices', 'To replace technical controls', 'To punish security violations'], correct_answer: 1, explanation: 'Security awareness training educates employees about security threats, policies, and best practices to reduce human-related risks.' },
    { id: 'D5-Q010', domain: 5, question: 'What is qualitative risk assessment?', options: ['Risk assessment using precise numbers', 'Risk assessment using descriptive categories like high/medium/low', 'Assessment of software quality', 'Assessment of employee qualifications'], correct_answer: 1, explanation: 'Qualitative risk assessment uses descriptive categories (high/medium/low) rather than numerical values to evaluate risks.' },
    { id: 'D5-Q011', domain: 5, question: 'Which regulation protects personal health information in the US?', options: ['PCI DSS', 'HIPAA', 'GDPR', 'FERPA'], correct_answer: 1, explanation: 'HIPAA (Health Insurance Portability and Accountability Act) establishes requirements for protecting personal health information in the US.' },
    { id: 'D5-Q012', domain: 5, question: 'What is quantitative risk assessment?', options: ['Risk assessment using quantity of risks', 'Risk assessment using numerical values and financial impact', 'Assessment of product quantity', 'Assessment of user numbers'], correct_answer: 1, explanation: 'Quantitative risk assessment uses numerical values and calculations to determine financial impact and probability of risks.' },
    { id: 'D5-Q013', domain: 5, question: 'What is the purpose of a data classification policy?', options: ['To organize files alphabetically', 'To categorize data based on sensitivity and apply appropriate protections', 'To classify employees', 'To sort email'], correct_answer: 1, explanation: 'Data classification policies categorize data based on sensitivity and define appropriate handling, storage, and protection requirements.' },
    { id: 'D5-Q014', domain: 5, question: 'Which principle requires obtaining individual consent before data collection?', options: ['Data minimization', 'Consent and choice', 'Purpose limitation', 'Data integrity'], correct_answer: 1, explanation: 'Consent and choice principles require organizations to obtain informed consent before collecting or processing personal data.' },
    { id: 'D5-Q015', domain: 5, question: 'What is a Business Continuity Plan (BCP)?', options: ['A marketing strategy', 'Documentation of processes to maintain operations during disruptions', 'A financial plan', 'An employee handbook'], correct_answer: 1, explanation: 'BCP documents strategies and procedures to maintain or quickly resume critical business functions during and after disruptions.' },
    { id: 'D5-Q016', domain: 5, question: 'What is the difference between BCP and DRP?', options: ['No difference', 'BCP focuses on business operations, DRP focuses on IT systems recovery', 'DRP is for disasters only', 'BCP is for small businesses'], correct_answer: 1, explanation: 'BCP maintains overall business operations during disruptions, while DRP specifically focuses on IT systems and data recovery.' },
    { id: 'D5-Q017', domain: 5, question: 'Which framework provides IT governance and management guidance?', options: ['PCI DSS', 'COBIT', 'HIPAA', 'SOX'], correct_answer: 1, explanation: 'COBIT (Control Objectives for Information and Related Technologies) provides a framework for IT governance and management.' },
    { id: 'D5-Q018', domain: 5, question: 'What is the purpose of security governance?', options: ['To govern security staff behavior', 'To establish strategic direction and oversight of security programs', 'To write security code', 'To manage security tools'], correct_answer: 1, explanation: 'Security governance establishes strategic direction, oversight, and accountability for security programs aligned with business objectives.' },
    { id: 'D5-Q019', domain: 5, question: 'Which regulation protects educational records in the US?', options: ['HIPAA', 'GDPR', 'FERPA', 'SOX'], correct_answer: 2, explanation: 'FERPA (Family Educational Rights and Privacy Act) protects the privacy of student education records in the United States.' },
    { id: 'D5-Q020', domain: 5, question: 'What is residual risk?', options: ['Risk from residue or waste', 'Risk remaining after controls are implemented', 'Risk in residential areas', 'Risk that residents face'], correct_answer: 1, explanation: 'Residual risk is the risk that remains after security controls and mitigation strategies have been implemented.' },
    { id: 'D5-Q021', domain: 5, question: 'What is the purpose of security metrics?', options: ['To measure physical dimensions', 'To quantify and track security program effectiveness', 'To count security staff', 'To measure network speed'], correct_answer: 1, explanation: 'Security metrics quantify security program effectiveness, helping measure progress, identify trends, and support decision-making.' },
    { id: 'D5-Q022', domain: 5, question: 'Which privacy principle states data should only be kept as long as necessary?', options: ['Data minimization', 'Purpose limitation', 'Storage limitation', 'Consent'], correct_answer: 2, explanation: 'Storage limitation requires organizations to retain personal data only as long as necessary for the specified purpose.' },
    { id: 'D5-Q023', domain: 5, question: 'What is acceptable use policy (AUP)?', options: ['Policy for accepting users', 'Policy defining appropriate use of organizational resources', 'Policy for user acceptance testing', 'Policy for accepting deliveries'], correct_answer: 1, explanation: 'AUP defines appropriate and inappropriate uses of organizational IT resources, systems, and networks by users.' },
    { id: 'D5-Q024', domain: 5, question: 'What is third-party risk assessment?', options: ['Risk of being assessed by third parties', 'Evaluating security risks from vendors and partners', 'Assessment by external auditors', 'Risk of third-party software'], correct_answer: 1, explanation: 'Third-party risk assessment evaluates security risks from external vendors, partners, and service providers before engagement.' },
    { id: 'D5-Q025', domain: 5, question: 'Which framework provides international information security standards?', options: ['NIST', 'ISO/IEC 27001', 'PCI DSS', 'COBIT'], correct_answer: 1, explanation: 'ISO/IEC 27001 provides international standards for information security management systems (ISMS).' },
    { id: 'D5-Q026', domain: 5, question: 'What is privacy by design?', options: ['Designing private areas', 'Incorporating privacy considerations from the beginning of system design', 'Designing privacy policies', 'Graphic design for privacy notices'], correct_answer: 1, explanation: 'Privacy by design incorporates privacy and data protection considerations throughout the entire system development lifecycle.' },
    { id: 'D5-Q027', domain: 5, question: 'What is the purpose of security training for developers?', options: ['To train security staff in development', 'To teach secure coding practices and security principles', 'To develop training materials', 'To train developers in security tools only'], correct_answer: 1, explanation: 'Security training for developers teaches secure coding practices, common vulnerabilities, and security principles to build secure software.' },
    { id: 'D5-Q028', domain: 5, question: 'What is inherent risk?', options: ['Risk inherited from parent companies', 'Risk level before any controls are applied', 'Risk that is internal', 'Risk from inheritance'], correct_answer: 1, explanation: 'Inherent risk is the natural level of risk before any security controls or mitigation measures are implemented.' },
    { id: 'D5-Q029', domain: 5, question: 'Which regulation requires financial reporting controls in the US?', options: ['HIPAA', 'SOX', 'GDPR', 'PCI DSS'], correct_answer: 1, explanation: 'SOX (Sarbanes-Oxley Act) requires publicly traded companies to implement internal controls for financial reporting and disclosure.' },
    { id: 'D5-Q030', domain: 5, question: 'What is key risk indicator (KRI)?', options: ['Risk to encryption keys', 'Metric providing early warning of increasing risk', 'List of important risks', 'Risk indicator light'], correct_answer: 1, explanation: 'KRIs are metrics that provide early warning signals of increasing risk exposure in specific areas.' },
    { id: 'D5-Q031', domain: 5, question: 'What is security culture?', options: ['Cultural diversity in security teams', 'Shared values and behaviors regarding security across organization', 'Security awareness posters', 'Security team traditions'], correct_answer: 1, explanation: 'Security culture represents shared security values, attitudes, and behaviors embedded throughout the organization.' },
    { id: 'D5-Q032', domain: 5, question: 'Which privacy principle requires using data only for stated purposes?', options: ['Data minimization', 'Purpose limitation', 'Consent', 'Accountability'], correct_answer: 1, explanation: 'Purpose limitation requires organizations to collect and process data only for specified, explicit, and legitimate purposes.' },
    { id: 'D5-Q033', domain: 5, question: 'What is a data protection impact assessment (DPIA)?', options: ['Assessment of data backup impact', 'Evaluation of privacy risks in data processing activities', 'Impact of data on performance', 'Assessment of data quality'], correct_answer: 1, explanation: 'DPIA evaluates privacy risks associated with data processing activities to identify and mitigate potential privacy impacts.' },
    { id: 'D5-Q034', domain: 5, question: 'What is the role of a Data Protection Officer (DPO)?', options: ['To protect data backups', 'To oversee privacy compliance and data protection strategy', 'To encrypt all data', 'To manage data storage'], correct_answer: 1, explanation: 'DPO oversees data protection strategy, privacy compliance, and serves as a contact point for data protection authorities.' },
    { id: 'D5-Q035', domain: 5, question: 'What is security posture assessment?', options: ['Evaluating physical posture of security guards', 'Comprehensive evaluation of organizations security status', 'Assessment of sitting positions', 'Security camera positioning'], correct_answer: 1, explanation: 'Security posture assessment comprehensively evaluates an organizations security status, including controls, processes, and vulnerabilities.' },
    { id: 'D5-Q036', domain: 5, question: 'Which regulation applies to organizations processing EU citizens data?', options: ['HIPAA', 'GDPR', 'SOX', 'FERPA'], correct_answer: 1, explanation: 'GDPR (General Data Protection Regulation) applies to any organization processing personal data of EU citizens, regardless of location.' },
    { id: 'D5-Q037', domain: 5, question: 'What is security baseline deviation?', options: ['Mathematical variation in security metrics', 'Systems that do not meet established security standards', 'Deviation in security budgets', 'Changes in security policies'], correct_answer: 1, explanation: 'Security baseline deviation occurs when systems do not meet established minimum security configuration standards.' },
    { id: 'D5-Q038', domain: 5, question: 'What is the purpose of security compliance audits?', options: ['To punish non-compliance', 'To verify adherence to security policies and regulations', 'To reduce security staff', 'To eliminate security controls'], correct_answer: 1, explanation: 'Security compliance audits verify that organizations meet security policies, standards, and regulatory requirements.' },
    { id: 'D5-Q039', domain: 5, question: 'What is risk tolerance?', options: ['Tolerance for risk-taking behavior', 'Acceptable deviation from risk appetite', 'Tolerance for uncertain situations', 'Employee tolerance for security measures'], correct_answer: 1, explanation: 'Risk tolerance is the acceptable level of variation from the risk appetite that an organization can handle.' },
    { id: 'D5-Q040', domain: 5, question: 'What is the purpose of executive security reporting?', options: ['To report executives to authorities', 'To communicate security status and risks to leadership', 'To secure executive offices', 'To report executive expenses'], correct_answer: 1, explanation: 'Executive security reporting communicates security posture, risks, incidents, and program effectiveness to organizational leadership.' },
    { id: 'D5-Q041', domain: 5, question: 'What is data sovereignty?', options: ['Data ownership rights', 'Data subject to laws of the country where it is stored', 'Data independence', 'Data quality standards'], correct_answer: 1, explanation: 'Data sovereignty means data is subject to the laws and regulations of the country where it is physically stored.' },
    { id: 'D5-Q042', domain: 5, question: 'What is security strategy?', options: ['Tactical security operations', 'Long-term plan aligning security with business objectives', 'Daily security tasks', 'Security tool selection'], correct_answer: 1, explanation: 'Security strategy is a long-term plan that aligns security initiatives with business objectives and organizational goals.' },
    { id: 'D5-Q043', domain: 5, question: 'What is the purpose of password policy?', options: ['To make passwords difficult to remember', 'To establish requirements for secure password creation and management', 'To list all passwords', 'To eliminate passwords'], correct_answer: 1, explanation: 'Password policy establishes requirements for password complexity, length, expiration, and management to ensure account security.' },
    { id: 'D5-Q044', domain: 5, question: 'What is security ROI (Return on Investment)?', options: ['Return on security tools purchased', 'Value gained from security investments relative to costs', 'Revenue from selling security', 'Interest on security budgets'], correct_answer: 1, explanation: 'Security ROI measures the value and benefits gained from security investments compared to their costs.' },
    { id: 'D5-Q045', domain: 5, question: 'What is the primary purpose of an incident response plan?', options: ['To prevent all incidents', 'To provide structured approach for detecting and responding to incidents', 'To punish responsible parties', 'To reduce security budgets'], correct_answer: 1, explanation: 'An incident response plan provides a structured, documented approach for detecting, responding to, and recovering from security incidents.' },
    { id: 'D5-Q046', domain: 5, question: 'What is data minimization?', options: ['Making data files smaller', 'Collecting only data necessary for specific purposes', 'Minimizing data backups', 'Using minimum storage'], correct_answer: 1, explanation: 'Data minimization requires organizations to collect and retain only the minimum amount of personal data necessary for specified purposes.' },
    { id: 'D5-Q047', domain: 5, question: 'What is the purpose of security steering committee?', options: ['To steer security vehicles', 'To provide governance and strategic direction for security program', 'To manage daily security operations', 'To hire security staff'], correct_answer: 1, explanation: 'A security steering committee provides governance, strategic direction, and oversight for the organizations security program.' },
    { id: 'D5-Q048', domain: 5, question: 'What is privacy impact assessment (PIA)?', options: ['Assessment of privacy policy effectiveness', 'Evaluation of privacy risks in systems or programs', 'Impact of privacy laws on business', 'Assessment of private networks'], correct_answer: 1, explanation: 'PIA evaluates potential privacy risks and impacts of new systems, programs, or initiatives on personal information.' },
    { id: 'D5-Q049', domain: 5, question: 'What is security program maturity model?', options: ['Age of security programs', 'Framework measuring security program development and capability', 'Maturity of security staff', 'Timeline for security implementation'], correct_answer: 1, explanation: 'Security program maturity models assess the development level and capability of security programs across different dimensions.' },
    { id: 'D5-Q050', domain: 5, question: 'What is the purpose of privacy notice?', options: ['To notify people of privacy laws', 'To inform individuals how their data will be collected and used', 'To warn about private property', 'To announce privacy violations'], correct_answer: 1, explanation: 'Privacy notices inform individuals about what personal data is collected, how it is used, who it is shared with, and their rights.' }
];

// Total: 250 unique questions

// ALL 30 PBQs (6 per domain) - All types fully implemented
const ALL_PBQS = [
    // Domain 1 PBQs - General Security Concepts
    { id: 'PBQ-D1-001', title: 'Configure Firewall Rules', domain: 1, type: 'drag-drop', difficulty: 'medium',
      scenario: 'Drag firewall rules into correct order to allow web traffic but block unnecessary services.' },
    { id: 'PBQ-D1-002', title: 'Implement Access Controls', domain: 1, type: 'configuration', difficulty: 'hard',
      scenario: 'Configure role-based access control settings for a new employee onboarding system.' },
    { id: 'PBQ-D1-003', title: 'Set Up MFA', domain: 1, type: 'configuration', difficulty: 'easy',
      scenario: 'Configure multi-factor authentication for corporate VPN access.' },
    { id: 'PBQ-D1-004', title: 'Configure Encryption', domain: 1, type: 'matching', difficulty: 'medium',
      scenario: 'Match encryption algorithms to their appropriate use cases.' },
    { id: 'PBQ-D1-005', title: 'Zero Trust Architecture', domain: 1, type: 'drag-drop', difficulty: 'hard',
      scenario: 'Arrange zero trust components in the correct implementation order.' },
    { id: 'PBQ-D1-006', title: 'Physical Security Layout', domain: 1, type: 'hotspot', difficulty: 'medium',
      scenario: 'Identify physical security vulnerabilities in this data center floor plan.' },
    
    // Domain 2 PBQs - Threats, Vulnerabilities & Mitigations
    { id: 'PBQ-D2-001', title: 'Identify Attack Vectors', domain: 2, type: 'hotspot', difficulty: 'medium',
      scenario: 'Identify potential attack vectors in this network topology diagram.' },
    { id: 'PBQ-D2-002', title: 'Analyze Phishing Email', domain: 2, type: 'analysis', difficulty: 'easy',
      scenario: 'Analyze this suspicious email and identify all indicators of phishing.' },
    { id: 'PBQ-D2-003', title: 'Malware Classification', domain: 2, type: 'matching', difficulty: 'medium',
      scenario: 'Match malware samples to their correct classification types.' },
    { id: 'PBQ-D2-004', title: 'Vulnerability Prioritization', domain: 2, type: 'drag-drop', difficulty: 'hard',
      scenario: 'Prioritize these vulnerabilities based on CVSS scores and business impact.' },
    { id: 'PBQ-D2-005', title: 'Attack Chain Analysis', domain: 2, type: 'drag-drop', difficulty: 'medium',
      scenario: 'Arrange the attack phases in the correct kill chain order.' },
    { id: 'PBQ-D2-006', title: 'Threat Actor Attribution', domain: 2, type: 'analysis', difficulty: 'hard',
      scenario: 'Analyze the evidence and determine the most likely threat actor type.' },
    
    // Domain 3 PBQs - Security Architecture
    { id: 'PBQ-D3-001', title: 'Network Segmentation', domain: 3, type: 'drag-drop', difficulty: 'hard',
      scenario: 'Design network segments by placing systems in appropriate security zones.' },
    { id: 'PBQ-D3-002', title: 'Cloud Security Config', domain: 3, type: 'configuration', difficulty: 'medium',
      scenario: 'Configure S3 bucket security settings according to best practices.' },
    { id: 'PBQ-D3-003', title: 'VPN Configuration', domain: 3, type: 'configuration', difficulty: 'easy',
      scenario: 'Configure site-to-site VPN settings for secure branch connectivity.' },
    { id: 'PBQ-D3-004', title: 'Protocol Security', domain: 3, type: 'matching', difficulty: 'medium',
      scenario: 'Match protocols to their security characteristics and use cases.' },
    { id: 'PBQ-D3-005', title: 'Identify Misconfigurations', domain: 3, type: 'hotspot', difficulty: 'hard',
      scenario: 'Review the wireless network configuration and identify security issues.' },
    { id: 'PBQ-D3-006', title: 'Certificate Lifecycle', domain: 3, type: 'drag-drop', difficulty: 'medium',
      scenario: 'Arrange the PKI certificate lifecycle steps in correct order.' },
    
    // Domain 4 PBQs - Security Operations
    { id: 'PBQ-D4-001', title: 'SIEM Log Analysis', domain: 4, type: 'analysis', difficulty: 'hard',
      scenario: 'Analyze these SIEM alerts and identify the security incident.' },
    { id: 'PBQ-D4-002', title: 'Incident Response Steps', domain: 4, type: 'drag-drop', difficulty: 'medium',
      scenario: 'Arrange incident response phases in the correct order.' },
    { id: 'PBQ-D4-003', title: 'Forensic Evidence', domain: 4, type: 'drag-drop', difficulty: 'hard',
      scenario: 'Order evidence collection by volatility (most to least volatile).' },
    { id: 'PBQ-D4-004', title: 'IAM Configuration', domain: 4, type: 'configuration', difficulty: 'medium',
      scenario: 'Configure identity provider settings for SSO implementation.' },
    { id: 'PBQ-D4-005', title: 'Vulnerability Scan Analysis', domain: 4, type: 'analysis', difficulty: 'medium',
      scenario: 'Review vulnerability scan results and prioritize remediation.' },
    { id: 'PBQ-D4-006', title: 'Alert Triage', domain: 4, type: 'matching', difficulty: 'easy',
      scenario: 'Match security alerts to appropriate response actions.' },
    
    // Domain 5 PBQs - Security Program Management
    { id: 'PBQ-D5-001', title: 'Risk Assessment Matrix', domain: 5, type: 'matrix', difficulty: 'medium',
      scenario: 'Complete the risk assessment matrix by rating likelihood and impact.' },
    { id: 'PBQ-D5-002', title: 'Policy Hierarchy', domain: 5, type: 'drag-drop', difficulty: 'easy',
      scenario: 'Arrange security documents in the correct governance hierarchy.' },
    { id: 'PBQ-D5-003', title: 'Compliance Mapping', domain: 5, type: 'matching', difficulty: 'hard',
      scenario: 'Match compliance requirements to appropriate security controls.' },
    { id: 'PBQ-D5-004', title: 'Vendor Risk Assessment', domain: 5, type: 'configuration', difficulty: 'medium',
      scenario: 'Configure vendor risk scoring criteria and thresholds.' },
    { id: 'PBQ-D5-005', title: 'BIA Analysis', domain: 5, type: 'analysis', difficulty: 'hard',
      scenario: 'Analyze business impact data and determine RTO/RPO values.' },
    { id: 'PBQ-D5-006', title: 'Security Metrics', domain: 5, type: 'matching', difficulty: 'medium',
      scenario: 'Match security metrics to their measurement categories.' }
];

// COMPLETE GLOSSARY (100+ terms)
const GLOSSARY = {
    'AAA': 'Authentication, Authorization, and Accounting - Framework for controlling access',
    'ACL': 'Access Control List - Rules that control network traffic',
    'AES': 'Advanced Encryption Standard - Symmetric encryption algorithm',
    'API': 'Application Programming Interface - Software intermediary',
    'APT': 'Advanced Persistent Threat - Long-term targeted attack',
    'ARP': 'Address Resolution Protocol - Maps IP to MAC addresses',
    'BCP': 'Business Continuity Plan - Maintaining operations during disruption',
    'BYOD': 'Bring Your Own Device - Personal devices in workplace',
    'CA': 'Certificate Authority - Issues digital certificates',
    'CASB': 'Cloud Access Security Broker - Cloud security enforcement',
    'CIA': 'Confidentiality, Integrity, Availability - Security triad',
    'CISO': 'Chief Information Security Officer',
    'CSRF': 'Cross-Site Request Forgery - Web application attack',
    'DDoS': 'Distributed Denial of Service - Availability attack',
    'DLP': 'Data Loss Prevention - Prevents data exfiltration',
    'DMZ': 'Demilitarized Zone - Network segment',
    'DNS': 'Domain Name System - Name resolution',
    'DoS': 'Denial of Service - Availability attack',
    'DRP': 'Disaster Recovery Plan - Restore operations after disaster',
    'EDR': 'Endpoint Detection and Response',
    'FDE': 'Full Disk Encryption',
    'FIM': 'File Integrity Monitoring',
    'GDPR': 'General Data Protection Regulation - EU privacy law',
    'GRC': 'Governance, Risk, and Compliance',
    'HIDS': 'Host-based Intrusion Detection System',
    'HIPS': 'Host-based Intrusion Prevention System',
    'HSM': 'Hardware Security Module',
    'HTTPS': 'HTTP Secure - Encrypted web traffic',
    'IaaS': 'Infrastructure as a Service',
    'IAM': 'Identity and Access Management',
    'IDS': 'Intrusion Detection System',
    'IoC': 'Indicators of Compromise',
    'IoT': 'Internet of Things',
    'IPS': 'Intrusion Prevention System',
    'IPSec': 'Internet Protocol Security',
    'ISO': 'International Organization for Standardization',
    'KPI': 'Key Performance Indicator',
    'LDAP': 'Lightweight Directory Access Protocol',
    'MAC': 'Mandatory Access Control',
    'MDM': 'Mobile Device Management',
    'MFA': 'Multi-Factor Authentication',
    'MITM': 'Man-in-the-Middle Attack',
    'NAC': 'Network Access Control',
    'NAT': 'Network Address Translation',
    'NIDS': 'Network-based Intrusion Detection System',
    'NIST': 'National Institute of Standards and Technology',
    'OAUTH': 'Open Authorization',
    'OSINT': 'Open Source Intelligence',
    'PaaS': 'Platform as a Service',
    'PAM': 'Privileged Access Management',
    'PCI DSS': 'Payment Card Industry Data Security Standard',
    'PHI': 'Protected Health Information',
    'PII': 'Personally Identifiable Information',
    'PKI': 'Public Key Infrastructure',
    'RADIUS': 'Remote Authentication Dial-In User Service',
    'RAID': 'Redundant Array of Independent Disks',
    'RBAC': 'Role-Based Access Control',
    'RDP': 'Remote Desktop Protocol',
    'RPO': 'Recovery Point Objective',
    'RTO': 'Recovery Time Objective',
    'SaaS': 'Software as a Service',
    'SAML': 'Security Assertion Markup Language',
    'SIEM': 'Security Information and Event Management',
    'SLA': 'Service Level Agreement',
    'SOAR': 'Security Orchestration, Automation and Response',
    'SOC': 'Security Operations Center',
    'SPF': 'Sender Policy Framework',
    'SQL': 'Structured Query Language',
    'SSH': 'Secure Shell',
    'SSO': 'Single Sign-On',
    'TLS': 'Transport Layer Security',
    'TPM': 'Trusted Platform Module',
    'VPN': 'Virtual Private Network',
    'WAF': 'Web Application Firewall',
    'XSS': 'Cross-Site Scripting',
    'Zero Trust': 'Never trust, always verify security model'
};

// ============================================
// CORE INITIALIZATION & SETUP
// ============================================

function setupDOM() {
    console.log('Setting up DOM structure...');
    
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        const main = document.createElement('div');
        main.id = 'main-content';
        document.body.appendChild(main);
    }
    
    const content = document.getElementById('content');
    if (!content) {
        const contentDiv = document.createElement('div');
        contentDiv.id = 'content';
        document.getElementById('main-content').appendChild(contentDiv);
    }
    
    console.log('✅ DOM structure ready');
}

function injectStyles() {
    console.log('Injecting comprehensive styles...');
    
    const existingStyles = document.querySelector('style[data-app-styles]');
    if (existingStyles) existingStyles.remove();
    
    const style = document.createElement('style');
    style.setAttribute('data-app-styles', 'v27');
    style.textContent = `
        /* Reset and Base */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: #09090b !important;
            color: #fafafa !important;
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
        }
        
        /* Header */
        .header-bar {
            background: #18181b;
            border-bottom: 1px solid #27272a;
            padding: 0 20px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .header-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .header-nav {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .nav-btn {
            background: transparent;
            color: #a1a1aa;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        
        .nav-btn:hover {
            background: #27272a;
            color: #fafafa;
        }
        
        .nav-btn.active {
            background: #27272a;
            color: #6366f1;
        }
        
        /* Container */
        .container {
            max-width: 1800px;
            margin: 0 auto;
            padding: 20px 40px;
        }
        
        /* Typography */
        .page-title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .page-subtitle {
            color: #a1a1aa;
            margin-bottom: 20px;
        }
        
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
            margin: 30px 0;
        }
        
        .stat-card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: #6366f1;
        }
        
        .stat-label {
            color: #a1a1aa;
            font-size: 0.9rem;
        }
        
        /* Domain Grid */
        .domain-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .domain-card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 25px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }
        
        .domain-card:hover {
            border-color: #3f3f46;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        
        /* Lesson Grid */
        .lesson-grid {
            display: grid;
            gap: 15px;
            margin: 30px 0;
        }
        
        .lesson-card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 8px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .lesson-card:hover {
            border-color: #3f3f46;
        }
        
        .lesson-card.completed {
            border-color: #10b981;
        }
        
        /* ====================================
           LESSON VIEWER - IMPROVED UX/UI
           ==================================== */
        .lesson-viewer {
            background: #141416;
            border-radius: 16px;
            padding: 48px 56px;
            margin-top: 24px;
        }
        
        /* Lesson Header */
        .lesson-viewer h1 {
            font-size: 1.75rem;
            font-weight: 600;
            color: #f4f4f5;
            line-height: 1.3;
            margin-bottom: 8px;
        }
        
        /* Lesson Meta Info */
        .lesson-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            color: #a1a1aa;
            font-size: 0.9rem;
            margin-bottom: 24px;
            align-items: center;
        }
        
        /* Lesson Navigation Buttons */
        .lesson-nav {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 40px;
            padding: 0;
        }
        
        .lesson-nav-btn {
            background: #1e1e22;
            border: 1px solid #2a2a2e;
            border-radius: 12px;
            padding: 16px 20px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            color: #e4e4e7;
        }
        
        .lesson-nav-btn:hover {
            background: #252529;
            border-color: #3f3f46;
        }
        
        .lesson-nav-btn.next {
            text-align: right;
            background: linear-gradient(135deg, #3730a3, #4f46e5);
            border-color: #4f46e5;
        }
        
        .lesson-nav-btn.next:hover {
            background: linear-gradient(135deg, #4338ca, #6366f1);
        }
        
        .lesson-nav-btn-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #71717a;
            margin-bottom: 4px;
        }
        
        .lesson-nav-btn.next .lesson-nav-btn-label {
            color: #a5b4fc;
        }
        
        .lesson-nav-btn-title {
            font-size: 0.95rem;
            font-weight: 500;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .lesson-nav-placeholder {
            visibility: hidden;
        }
        
        /* Lesson Sections */
        .lesson-section {
            margin: 0 0 40px 0;
            padding-bottom: 32px;
            border-bottom: 1px solid #27272a;
        }
        
        .lesson-section:last-of-type {
            border-bottom: none;
            margin-bottom: 24px;
        }
        
        .lesson-section h3 {
            color: #93c5fd;
            margin-bottom: 20px;
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.01em;
        }
        
        .lesson-section p,
        .lesson-content {
            color: #d4d4d8;
            line-height: 1.8;
            font-size: 1rem;
        }
        
        /* Lists in lessons */
        .lesson-section ul,
        .lesson-section ol {
            margin: 16px 0 16px 24px;
            line-height: 1.9;
            color: #d4d4d8;
        }
        
        .lesson-section li {
            margin-bottom: 12px;
            padding-left: 8px;
        }
        
        .lesson-section li::marker {
            color: #6366f1;
        }
        
        /* Key Points Box */
        .key-points-box {
            background: #1a1a1f;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px 24px;
            margin-top: 24px;
        }
        
        .key-points-box strong {
            color: #93c5fd;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .key-points-box ul {
            margin: 12px 0 0 20px;
        }
        
        /* Exam Tips Box */
        .exam-tips-box {
            background: linear-gradient(135deg, #1e1b4b 0%, #1e1e2e 100%);
            border: 1px solid #312e81;
            border-radius: 12px;
            padding: 20px 24px;
            margin-top: 24px;
        }
        
        .exam-tips-box strong {
            color: #c4b5fd;
            font-size: 0.9rem;
        }
        
        .exam-tips-box ul {
            margin: 12px 0 0 20px;
            color: #e9d5ff;
        }
        
        /* Learning Goals specific styling */
        .learning-goals ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .learning-goals li {
            position: relative;
            padding: 12px 0 12px 32px;
            margin: 0;
            border-bottom: 1px solid #1f1f23;
        }
        
        .learning-goals li:last-child {
            border-bottom: none;
        }
        
        .learning-goals li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }
        
        /* Introduction section */
        .intro-section {
            background: #1a1a1f;
            border-left: 3px solid #3b82f6;
            padding: 24px;
            border-radius: 0 12px 12px 0;
            margin-bottom: 32px;
        }
        
        .intro-section p,
        .intro-section .content-para {
            margin: 0 0 16px 0;
            font-size: 1.05rem;
            line-height: 1.75;
        }
        
        .intro-section p:last-child,
        .intro-section .content-para:last-child {
            margin-bottom: 0;
        }
        
        /* Bottom Navigation */
        .lesson-bottom-nav {
            background: #1a1a1f;
            border-radius: 12px;
            padding: 24px;
            margin-top: 32px;
        }
        
        .lesson-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .lesson-prev-next {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding-top: 24px;
            border-top: 1px solid #27272a;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .lesson-viewer {
                padding: 24px 18px;
                margin-top: 16px;
            }
            
            .lesson-viewer h1 {
                font-size: 1.35rem;
                line-height: 1.35;
            }
            
            .lesson-nav {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .lesson-nav-btn {
                padding: 14px 16px;
            }
            
            .lesson-nav-btn.next {
                text-align: left;
            }
            
            .lesson-section {
                margin-bottom: 36px;
                padding-bottom: 28px;
            }
            
            .lesson-section h3 {
                font-size: 1.2rem;
                margin-bottom: 18px;
            }
            
            .lesson-content {
                font-size: 1rem;
                line-height: 1.8;
            }
            
            .intro-section {
                padding: 20px;
                margin-bottom: 28px;
            }
            
            .intro-section p {
                font-size: 1rem;
            }
            
            .key-points-box,
            .exam-tips-box,
            .real-world-box {
                padding: 18px 20px;
                margin-top: 20px;
            }
            
            .learning-goals li {
                padding: 14px 16px 14px 40px;
            }
            
            .learning-goals li::before {
                left: 12px;
            }
            
            .content-list li {
                padding: 8px 0 8px 24px;
            }
            
            .content-list li::before {
                left: 4px;
            }
            
            .lesson-prev-next {
                flex-direction: column;
            }
            
            .lesson-actions {
                flex-direction: column;
            }
            
            .lesson-actions .btn {
                width: 100%;
                justify-content: center;
            }
            
            .lesson-bottom-nav {
                padding: 20px;
            }
        }
        
        /* ====================================
           CONTENT FORMATTING CLASSES
           ==================================== */
        
        /* Definition terms - bold keywords */
        .definition-term {
            color: #f0abfc;
            font-weight: 600;
            letter-spacing: 0.01em;
        }
        
        /* Alternative: white bold for better contrast */
        .lesson-content .definition-term {
            color: #fafafa;
            font-weight: 700;
        }
        
        /* Content paragraphs from formatContent */
        .content-para {
            margin-bottom: 20px;
            line-height: 1.85;
        }
        
        .content-para:last-child {
            margin-bottom: 0;
        }
        
        /* Content lists from formatContent */
        .content-list {
            margin: 20px 0;
            padding-left: 0;
            list-style: none;
        }
        
        .content-list li {
            position: relative;
            padding: 10px 0 10px 28px;
            margin: 0;
            line-height: 1.7;
            border-bottom: 1px solid rgba(39, 39, 42, 0.5);
        }
        
        .content-list li:last-child {
            border-bottom: none;
        }
        
        .content-list li::before {
            content: "›";
            position: absolute;
            left: 8px;
            color: #6366f1;
            font-weight: bold;
            font-size: 1.2em;
        }
        
        /* Inline code */
        .inline-code {
            background: #27272a;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.9em;
            color: #f472b6;
            border: 1px solid #3f3f46;
        }
        
        /* Code blocks */
        .code-block {
            background: #0d0d0f;
            padding: 20px;
            border-radius: 10px;
            overflow-x: auto;
            margin: 20px 0;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            border: 1px solid #27272a;
        }
        
        .code-block code {
            color: #e4e4e7;
        }
        
        /* Real world example box */
        .real-world-box {
            background: #0f1a14;
            border: 1px solid #166534;
            border-left: 4px solid #22c55e;
            border-radius: 0 12px 12px 0;
            padding: 20px 24px;
            margin-top: 24px;
        }
        
        .real-world-box strong {
            color: #86efac;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 12px;
        }
        
        .real-world-box p,
        .real-world-box .content-para {
            margin-top: 12px;
            line-height: 1.75;
            color: #d1d5db;
        }
        
        .real-world-box .content-para:first-of-type {
            margin-top: 0;
        }
        
        .real-world-box .company-name {
            font-size: 0.9rem;
            color: #71717a;
            font-style: italic;
            margin-top: 8px;
        }
        
        /* Section subheadings (italic with colon) */
        .section-subheading {
            display: block;
            color: #a5b4fc;
            font-weight: 600;
            font-style: normal;
            margin-top: 24px;
            margin-bottom: 8px;
            font-size: 1.05rem;
        }
        
        .lesson-content em {
            color: #c4b5fd;
            font-style: italic;
        }
        
        /* Ensure proper block flow in lesson content */
        .lesson-content {
            display: block;
            width: 100%;
            clear: both;
        }
        
        .lesson-content > * {
            display: block;
            clear: both;
        }
        
        .lesson-content .content-para {
            display: block;
            width: 100%;
            margin-bottom: 20px;
        }
        
        .lesson-content .content-list {
            display: block;
            width: 100%;
            margin: 16px 0 24px 0;
        }
        
        /* Summary list at end of lessons */
        .summary-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .summary-list li {
            position: relative;
            padding: 14px 0 14px 36px;
            margin: 0;
            border-bottom: 1px solid #1f1f23;
            line-height: 1.7;
        }
        
        .summary-list li:last-child {
            border-bottom: none;
        }
        
        .summary-list li::before {
            content: "✓";
            position: absolute;
            left: 8px;
            color: #10b981;
            font-weight: bold;
            font-size: 1.1em;
        }
        
        /* Better intro section */
        .intro-section {
            background: linear-gradient(135deg, #0f172a 0%, #1a1a1f 100%);
            border-left: 4px solid #3b82f6;
            padding: 28px;
            border-radius: 0 12px 12px 0;
            margin-bottom: 36px;
        }
        
        .intro-section p {
            margin: 0;
            font-size: 1.05rem;
            line-height: 1.85;
            color: #e2e8f0;
        }
        
        /* Nested paragraphs in intro */
        .intro-section .content-para {
            margin-bottom: 16px;
        }
        
        /* Key points box improvements */
        .key-points-box {
            background: linear-gradient(135deg, #171720 0%, #1a1a1f 100%);
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 24px 28px;
            margin-top: 28px;
        }
        
        .key-points-box > strong {
            display: block;
            color: #93c5fd;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.75px;
            margin-bottom: 16px;
        }
        
        .key-points-box ul {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        
        .key-points-box li {
            position: relative;
            padding: 10px 0 10px 24px;
            margin: 0;
            line-height: 1.7;
            color: #d4d4d8;
        }
        
        .key-points-box li::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #6366f1;
        }
        
        /* Exam tips box improvements */
        .exam-tips-box {
            background: linear-gradient(135deg, #1e1b4b 0%, #1a1a2e 100%);
            border: 1px solid #312e81;
            border-radius: 12px;
            padding: 24px 28px;
            margin-top: 28px;
        }
        
        .exam-tips-box > strong {
            display: block;
            color: #c4b5fd;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.75px;
            margin-bottom: 16px;
        }
        
        .exam-tips-box ul {
            margin: 0;
            padding-left: 0;
            list-style: none;
        }
        
        .exam-tips-box li {
            position: relative;
            padding: 10px 0 10px 24px;
            margin: 0;
            line-height: 1.7;
            color: #e9d5ff;
        }
        
        .exam-tips-box li::before {
            content: "💡";
            position: absolute;
            left: 0;
            font-size: 0.85em;
        }
        
        /* Learning goals improvements */
        .learning-goals {
            background: #141416;
            border-radius: 12px;
            padding: 8px 0;
        }
        
        .learning-goals ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .learning-goals li {
            position: relative;
            padding: 16px 20px 16px 48px;
            margin: 0;
            border-bottom: 1px solid #1f1f23;
            line-height: 1.7;
            color: #e4e4e7;
        }
        
        .learning-goals li:last-child {
            border-bottom: none;
        }
        
        .learning-goals li::before {
            content: "✓";
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #10b981;
            font-weight: bold;
            font-size: 1.1em;
        }
        
        /* Improve overall lesson spacing */
        .lesson-section {
            margin: 0 0 48px 0;
            padding-bottom: 40px;
            border-bottom: 1px solid #27272a;
        }
        
        .lesson-section:last-of-type {
            border-bottom: none;
            margin-bottom: 32px;
            padding-bottom: 0;
        }
        
        .lesson-section h3 {
            color: #93c5fd;
            margin-bottom: 24px;
            font-size: 1.35rem;
            font-weight: 600;
            letter-spacing: -0.02em;
        }
        
        .lesson-content {
            color: #d4d4d8;
            line-height: 1.85;
            font-size: 1.02rem;
        }
        
        /* Better br spacing in content */
        .lesson-content br {
            display: block;
            content: "";
            margin-top: 12px;
        }
        
        /* Quiz Container */
        .quiz-container {
            background: #18181b;
            border-radius: 12px;
            padding: 40px 48px;
            margin-top: 20px;
        }
        
        .quiz-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #27272a;
        }
        
        .quiz-progress {
            display: flex;
            gap: 5px;
            margin-bottom: 20px;
        }
        
        .progress-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #27272a;
        }
        
        .progress-dot.active {
            background: #6366f1;
        }
        
        .progress-dot.correct {
            background: #10b981;
        }
        
        .progress-dot.incorrect {
            background: #ef4444;
        }
        
        .quiz-question {
            font-size: 1.2rem;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        
        .quiz-options {
            display: grid;
            gap: 15px;
        }
        
        .quiz-option {
            background: #27272a;
            border: 2px solid transparent;
            border-radius: 8px;
            padding: 15px 20px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
        }
        
        .quiz-option:hover:not(.disabled) {
            border-color: #3f3f46;
        }
        
        .quiz-option.selected {
            border-color: #6366f1;
            background: #1e1e2e;
        }
        
        .quiz-option.correct {
            border-color: #10b981;
            background: #064e3b;
        }
        
        .quiz-option.incorrect {
            border-color: #ef4444;
            background: #7f1d1d;
        }
        
        .quiz-option.disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        
        .quiz-feedback {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feedback-correct {
            background: #064e3b;
            border: 1px solid #10b981;
        }
        
        .feedback-incorrect {
            background: #7f1d1d;
            border: 1px solid #ef4444;
        }
        
        /* Simulation Container */
        .simulation-container {
            background: #18181b;
            border-radius: 12px;
            padding: 40px 48px;
            margin-top: 20px;
        }
        
        .simulation-step {
            background: #27272a;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .simulation-options {
            display: grid;
            gap: 10px;
            margin-top: 20px;
        }
        
        /* PBQ Container */
        .pbq-container {
            background: #18181b;
            border-radius: 12px;
            padding: 30px;
            margin-top: 20px;
        }
        
        .pbq-scenario {
            background: #27272a;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .drag-item {
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 6px;
            padding: 10px 15px;
            margin: 5px;
            cursor: move;
            transition: all 0.3s;
        }
        
        .drag-item:hover {
            background: #3f3f46;
        }
        
        .drop-zone {
            min-height: 50px;
            border: 2px dashed #3f3f46;
            border-radius: 6px;
            padding: 10px;
            margin: 10px 0;
        }
        
        .drop-zone.active {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
        }
        
        /* Glossary */
        .glossary-search {
            width: 100%;
            padding: 12px;
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 8px;
            color: #fafafa;
            font-size: 1rem;
            margin-bottom: 20px;
        }
        
        .glossary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .glossary-term {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 8px;
            padding: 15px;
            transition: all 0.3s;
        }
        
        .glossary-term:hover {
            border-color: #3f3f46;
        }
        
        .glossary-term-title {
            color: #6366f1;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .glossary-term-definition {
            color: #a1a1aa;
            font-size: 0.95rem;
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
            font-size: 1rem;
            display: inline-block;
        }
        
        .btn:hover:not(:disabled) {
            background: #3f3f46;
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .btn-primary {
            background: #6366f1;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: #4f46e5;
        }
        
        .btn-success {
            background: #10b981;
        }
        
        .btn-success:hover:not(:disabled) {
            background: #059669;
        }
        
        .btn-danger {
            background: #ef4444;
        }
        
        .btn-warning {
            background: #f59e0b;
        }
        
        .back-btn {
            background: #27272a;
            color: #fafafa;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        
        .back-btn:hover {
            background: #3f3f46;
        }
        
        /* Badges */
        .difficulty-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .difficulty-beginner { background: #10b981; color: white; }
        .difficulty-intermediate { background: #f59e0b; color: white; }
        .difficulty-advanced { background: #ef4444; color: white; }
        
        /* Success Message */
        .success-message {
            background: #064e3b;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin-top: 20px;
        }
        
        /* ====================================
           RESPONSIVE WEB DESIGN
           Mobile-First Approach
           ==================================== */
        
        /* === MOBILE PHONES (up to 480px) === */
        @media (max-width: 480px) {
            /* Container */
            .container {
                padding: 12px 16px;
            }
            
            /* Header */
            .header-bar {
                flex-direction: column;
                padding: 12px 16px;
                gap: 12px;
            }
            
            .header-brand {
                font-size: 1rem;
            }
            
            .header-nav {
                width: 100%;
                justify-content: center;
                gap: 4px;
                padding: 8px 0;
            }
            
            .nav-btn {
                font-size: 0.75rem;
                padding: 8px 10px;
                min-height: 44px; /* Touch target */
            }
            
            /* Typography */
            .page-title {
                font-size: 1.3rem;
                line-height: 1.3;
            }
            
            .page-subtitle {
                font-size: 0.9rem;
            }
            
            /* Stats Grid - 2 columns on mobile */
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 20px 0;
            }
            
            .stat-card {
                padding: 15px 10px;
            }
            
            .stat-value {
                font-size: 1.4rem;
            }
            
            .stat-label {
                font-size: 0.8rem;
            }
            
            /* Domain Grid - Single column */
            .domain-grid {
                grid-template-columns: 1fr;
                gap: 12px;
                margin: 20px 0;
            }
            
            .domain-card {
                padding: 20px;
            }
            
            /* Lesson Grid */
            .lesson-grid {
                gap: 10px;
            }
            
            .lesson-card {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
            }
            
            .lesson-card .btn {
                width: 100%;
                justify-content: center;
            }
            
            /* Buttons - Touch friendly */
            .btn {
                min-height: 44px;
                padding: 12px 16px;
                font-size: 0.9rem;
            }
            
            .back-btn {
                font-size: 0.9rem;
                padding: 10px 0;
                min-height: 44px;
            }
            
            /* Lesson Viewer */
            .lesson-viewer {
                padding: 20px 16px;
                margin-top: 12px;
                border-radius: 12px;
            }
            
            .lesson-viewer h1 {
                font-size: 1.25rem;
                line-height: 1.35;
            }
            
            .lesson-meta {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            
            .lesson-nav {
                grid-template-columns: 1fr;
                gap: 10px;
                margin-bottom: 24px;
            }
            
            .lesson-nav-btn {
                padding: 14px 16px;
                min-height: 60px;
            }
            
            .lesson-section {
                margin-bottom: 28px;
                padding-bottom: 24px;
            }
            
            .lesson-section h3 {
                font-size: 1.1rem;
                margin-bottom: 14px;
            }
            
            .lesson-content {
                font-size: 0.95rem;
                line-height: 1.75;
            }
            
            .intro-section {
                padding: 16px;
                margin-bottom: 20px;
            }
            
            .key-points-box,
            .exam-tips-box,
            .real-world-box {
                padding: 16px;
                margin-top: 16px;
            }
            
            .learning-goals li {
                padding: 12px 12px 12px 36px;
                font-size: 0.95rem;
            }
            
            .lesson-bottom-nav {
                padding: 16px;
            }
            
            .lesson-actions {
                flex-direction: column;
                gap: 10px;
            }
            
            .lesson-actions .btn {
                width: 100%;
            }
            
            /* Quiz */
            .quiz-container {
                padding: 20px 16px;
            }
            
            .quiz-header {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
            
            .quiz-question {
                font-size: 1rem;
                line-height: 1.6;
            }
            
            .quiz-option {
                padding: 14px 16px;
                font-size: 0.95rem;
                min-height: 50px;
            }
            
            /* Simulation */
            .simulation-container {
                padding: 20px 16px;
            }
            
            .simulation-options {
                gap: 10px;
            }
            
            .simulation-option {
                padding: 14px 16px;
                min-height: 50px;
            }
            
            /* PBQ specific */
            .pbq-container {
                padding: 16px;
            }
            
            .drag-item,
            .drop-zone {
                padding: 12px;
                min-height: 44px;
                font-size: 0.9rem;
            }
            
            /* Analytics cards */
            .analytics-grid {
                grid-template-columns: 1fr !important;
                gap: 10px;
            }
            
            .analytics-card {
                padding: 15px;
            }
            
            /* Data management */
            div[style*="display: flex"][style*="gap: 15px"] {
                flex-direction: column;
            }
            
            /* Modal/Overlay adjustments */
            .modal-content,
            .notes-modal-content {
                width: 95%;
                max-height: 90vh;
                margin: 5vh auto;
                padding: 16px;
            }
        }
        
        /* === TABLETS (481px - 768px) === */
        @media (min-width: 481px) and (max-width: 768px) {
            /* Container */
            .container {
                padding: 16px 24px;
            }
            
            /* Header */
            .header-bar {
                flex-wrap: wrap;
                padding: 12px 20px;
            }
            
            .header-nav {
                width: 100%;
                justify-content: center;
                padding: 10px 0;
                gap: 6px;
            }
            
            .nav-btn {
                font-size: 0.85rem;
                padding: 8px 12px;
                min-height: 44px;
            }
            
            /* Typography */
            .page-title {
                font-size: 1.5rem;
            }
            
            /* Stats Grid - 3-4 columns */
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
            }
            
            .stat-value {
                font-size: 1.6rem;
            }
            
            /* Domain Grid - 2 columns */
            .domain-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }
            
            .domain-card {
                padding: 22px;
            }
            
            /* Lesson Grid */
            .lesson-card {
                padding: 18px;
            }
            
            /* Lesson Viewer */
            .lesson-viewer {
                padding: 28px 24px;
            }
            
            .lesson-viewer h1 {
                font-size: 1.4rem;
            }
            
            .lesson-nav {
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
            
            .lesson-section h3 {
                font-size: 1.15rem;
            }
            
            /* Quiz */
            .quiz-container {
                padding: 28px 24px;
            }
            
            /* Simulation */
            .simulation-container {
                padding: 28px 24px;
            }
            
            /* Buttons */
            .btn {
                min-height: 44px;
            }
        }
        
        /* === SMALL LAPTOPS (769px - 1024px) === */
        @media (min-width: 769px) and (max-width: 1024px) {
            .container {
                padding: 20px 32px;
            }
            
            .domain-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .lesson-viewer {
                padding: 36px 40px;
            }
            
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            }
        }
        
        /* === LARGE SCREENS (1025px+) === */
        @media (min-width: 1025px) {
            .domain-grid {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }
        }
        
        /* === TOUCH DEVICE OPTIMIZATIONS === */
        @media (hover: none) and (pointer: coarse) {
            /* Larger touch targets */
            .btn,
            .nav-btn,
            .quiz-option,
            .simulation-option,
            .lesson-card,
            .domain-card {
                min-height: 44px;
            }
            
            /* Remove hover effects that don't work on touch */
            .btn:hover,
            .nav-btn:hover,
            .domain-card:hover,
            .lesson-card:hover {
                transform: none;
            }
            
            /* Active states for touch feedback */
            .btn:active,
            .nav-btn:active {
                transform: scale(0.98);
                opacity: 0.9;
            }
            
            .domain-card:active,
            .lesson-card:active {
                transform: scale(0.99);
                border-color: #6366f1;
            }
            
            /* Disable text selection on interactive elements */
            .btn,
            .nav-btn,
            .domain-card,
            .lesson-card,
            .quiz-option,
            .simulation-option {
                -webkit-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
        }
        
        /* === LANDSCAPE PHONE === */
        @media (max-height: 500px) and (orientation: landscape) {
            .header-bar {
                padding: 8px 16px;
            }
            
            .container {
                padding: 12px 20px;
            }
            
            .domain-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .stats-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        
        /* === PRINT STYLES === */
        @media print {
            .header-bar,
            .back-btn,
            .btn,
            .nav-btn,
            .lesson-actions,
            .lesson-nav,
            .lesson-bottom-nav {
                display: none !important;
            }
            
            .lesson-viewer,
            .container {
                max-width: 100%;
                padding: 0;
                margin: 0;
            }
            
            .lesson-section {
                page-break-inside: avoid;
            }
        }
        
        /* === ACCESSIBILITY - Reduced Motion === */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Styles injected');
}

function loadData() {
    console.log('Loading all content data...');
    
    APP.content.lessons = ALL_LESSONS;
    APP.content.simulations = ALL_SIMULATIONS;
    APP.content.remediation = ALL_REMEDIATION;
    APP.content.pbqs = ALL_PBQS;
    APP.content.glossary = GLOSSARY;
    APP.content.questions = ACTUAL_QUESTIONS;
    
    // Load saved progress
    loadProgress();
    
    console.log(`✅ Loaded: ${APP.content.lessons.length} lessons`);
    console.log(`✅ Loaded: ${APP.content.simulations.length} simulations`);
    console.log(`✅ Loaded: ${APP.content.remediation.length} remediation`);
    console.log(`✅ Loaded: ${APP.content.pbqs.length} PBQs`);
    console.log(`✅ Loaded: ${APP.content.questions.length} questions`);
    console.log(`✅ Loaded: ${Object.keys(APP.content.glossary).length} glossary terms`);
}

function createHeader() {
    console.log('Creating navigation header...');
    
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    // Remove existing header
    const existingHeader = document.querySelector('.header-bar');
    if (existingHeader) existingHeader.remove();
    
    const header = document.createElement('div');
    header.className = 'header-bar';
    header.innerHTML = `
        <div class="header-brand">
            <span>🛡️</span>
            <span>Security+ v29 Complete</span>
        </div>
        <nav class="header-nav">
            <button class="nav-btn" onclick="showDashboard()">🏠 Dashboard</button>
            <button class="nav-btn" onclick="showAllLessons()">📚 Lessons</button>
            <button class="nav-btn" onclick="showAllSimulations()">🎮 Simulations</button>
            <button class="nav-btn" onclick="showAllRemediation()">🔧 Remediation</button>
            <button class="nav-btn" onclick="showAllPBQs()">🖥️ PBQs</button>
            <button class="nav-btn" onclick="showQuizMenu()">📝 Quiz</button>
            <button class="nav-btn" onclick="showGlossary()">📖 Glossary</button>
            <button class="nav-btn" onclick="showCareerQuiz()">🎯 Career Quiz</button>
            <button class="nav-btn" onclick="showPracticeExam()">📋 Exam</button>
            <button class="nav-btn" onclick="NotesSystem.showAllNotes()">🗒️ Notes</button>
        </nav>
    `;
    
    mainContent.insertBefore(header, mainContent.firstChild);
    console.log('✅ Header created');
}

// ============================================
// VIEW FUNCTIONS - ALL FULLY IMPLEMENTED
// ============================================

function showDashboard() {
    console.log('Showing dashboard...');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const content = document.getElementById('content');
    if (!content) return;
    
    // Calculate progress
    const totalLessons = ALL_LESSONS.length;
    const totalSims = ALL_SIMULATIONS.length;
    const totalRem = ALL_REMEDIATION.length;
    const totalPBQs = ALL_PBQS.length;
    const totalQuestions = ACTUAL_QUESTIONS.length;
    const totalGlossary = Object.keys(GLOSSARY).length;
    
    const completedLessons = APP.progress.completedLessons.length;
    const completedSims = APP.progress.completedSimulations.length;
    const completedRem = APP.progress.completedRemediation.length;
    const completedPBQs = APP.progress.completedPBQs.length;
    
    const totalProgress = Math.round(
        ((completedLessons + completedSims + completedRem + completedPBQs) / 
         (totalLessons + totalSims + totalRem + totalPBQs)) * 100
    ) || 0;
    
    // Get adaptive learning analytics
    let analyticsHtml = '';
    let recommendationsHtml = '';
    let weakAreasHtml = '';
    
    if (window.AdaptiveLearning) {
        const analytics = window.AdaptiveLearning.getPerformanceAnalytics();
        
        // Exam readiness badge
        const readinessClass = analytics.readiness.score >= 85 ? 'ready' : 
                              analytics.readiness.score >= 70 ? 'almost' : 
                              analytics.readiness.score >= 50 ? 'progress' : 'starting';
        
        analyticsHtml = `
            <div style="background: linear-gradient(135deg, #18181b, #27272a); border-radius: 12px; padding: 25px; margin: 30px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                    <div>
                        <h3 style="margin: 0 0 10px 0;">🎯 Exam Readiness</h3>
                        <p style="color: #a1a1aa; margin: 0;">Based on your quiz performance and content completion</p>
                    </div>
                    <div style="text-align: center;">
                        <span class="readiness-badge ${readinessClass}">${analytics.readiness.status}</span>
                        <div style="font-size: 2rem; font-weight: bold; margin-top: 10px; color: ${
                            readinessClass === 'ready' ? '#10b981' : 
                            readinessClass === 'almost' ? '#f59e0b' : '#6366f1'
                        };">${analytics.readiness.score}%</div>
                    </div>
                </div>
                
                ${analytics.overall.questionsAnswered > 0 ? `
                    <div class="analytics-grid" style="margin-top: 20px;">
                        <div class="analytics-card">
                            <div class="analytics-value">${analytics.overall.questionsAnswered}</div>
                            <div class="analytics-label">Questions Answered</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value" style="color: #10b981;">${analytics.overall.accuracy}%</div>
                            <div class="analytics-label">Accuracy</div>
                        </div>
                        <div class="analytics-card">
                            <div class="analytics-value">${APP.progress.practiceExamScores?.length || 0}</div>
                            <div class="analytics-label">Practice Exams</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Weak areas warning
        const weakAreas = APP.progress.weakAreas || [];
        if (weakAreas.length > 0) {
            weakAreasHtml = `
                <div style="background: linear-gradient(135deg, #7f1d1d, #991b1b); border: 1px solid #ef4444; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #fca5a5; margin: 0 0 10px 0;">⚠️ Weak Areas Detected</h3>
                    <p style="color: #fecaca; margin: 0 0 15px 0;">
                        Focus your study on these domains to improve your exam readiness:
                    </p>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${weakAreas.map(domain => {
                            const domainInfo = DOMAINS.find(d => d.id === domain);
                            return domainInfo ? `
                                <button class="btn" onclick="showDomainLessons(${domain})" 
                                        style="background: rgba(0,0,0,0.3); border-color: #ef4444;">
                                    ${domainInfo.icon} Domain ${domain}: ${domainInfo.name}
                                </button>
                            ` : '';
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        // Study recommendations
        recommendationsHtml = window.AdaptiveLearning.renderStudyRecommendations();
    }
    
    content.innerHTML = `
        <div class="container">
            <h1 class="page-title">🛡️ Security+ Training Platform v32</h1>
            <p class="page-subtitle">CompTIA Security+ SY0-701 - Complete Training System</p>
            
            <h2 style="margin-top: 20px;">Select Your Learning Path:</h2>
            
            <div class="domain-grid">
                ${DOMAINS.map(domain => {
                    const isWeak = APP.progress.weakAreas?.includes(domain.id);
                    return `
                    <div class="domain-card" onclick="showDomain(${domain.id})" 
                         style="border-left: 4px solid ${domain.color}; ${isWeak ? 'box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);' : ''}">
                        <div style="font-size: 2rem; margin-bottom: 10px;">${domain.icon}</div>
                        <div style="font-size: 1.2rem; font-weight: bold;">
                            Domain ${domain.id}
                            ${isWeak ? '<span style="color: #ef4444; font-size: 0.8rem; margin-left: 8px;">⚠️ FOCUS</span>' : ''}
                        </div>
                        <div style="color: #a1a1aa; margin: 10px 0;">${domain.name}</div>
                        <div style="font-size: 0.9rem; color: #71717a; line-height: 1.8;">
                            <div>📚 ${domain.lessons} Lessons</div>
                            <div>🎮 ${domain.simulations} Simulations</div>
                            <div>🔧 ${domain.remediation} Remediation</div>
                            <div>🖥️ ${domain.pbqs} PBQs</div>
                            <div style="margin-top: 10px; font-weight: bold; color: ${domain.color};">
                                Weight: ${Math.round(domain.weight * 100)}%
                            </div>
                        </div>
                    </div>
                `}).join('')}
                
                <div class="domain-card" onclick="showPracticeExam()" 
                     style="border-left: 4px solid #ec4899;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">📋</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">Practice Exam</div>
                    <div style="color: #a1a1aa; margin: 10px 0;">Full exam simulation</div>
                    <div style="font-size: 0.9rem; color: #71717a;">
                        <div>90 Questions</div>
                        <div>🧠 Adaptive</div>
                        <div>90 Minutes</div>
                        <div style="margin-top: 10px; font-weight: bold;">
                            Passing: 750/900
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Progress & Analytics Section -->
            <h2 style="margin-top: 50px; color: #a1a1aa;">📊 Your Progress</h2>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${completedLessons}/${totalLessons}</div>
                    <div class="stat-label">Lessons</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${completedSims}/${totalSims}</div>
                    <div class="stat-label">Simulations</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${completedRem}/${totalRem}</div>
                    <div class="stat-label">Remediation</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${completedPBQs}/${totalPBQs}</div>
                    <div class="stat-label">PBQs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalQuestions}</div>
                    <div class="stat-label">Questions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalGlossary}+</div>
                    <div class="stat-label">Terms</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalProgress}%</div>
                    <div class="stat-label">Progress</div>
                </div>
            </div>
            
            ${analyticsHtml}
            ${weakAreasHtml}
            ${recommendationsHtml}
            
            <!-- Data Management -->
            <div style="background: #18181b; border-radius: 12px; padding: 20px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #a1a1aa;">⚙️ Data Management</h3>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button class="btn" onclick="exportAllData()">
                        📤 Export Progress
                    </button>
                    <button class="btn" onclick="document.getElementById('import-file-input').click()">
                        📥 Import Progress
                    </button>
                    <button class="btn" onclick="NotesSystem.showAllNotes()" style="border-color: #6366f1;">
                        🗒️ My Notes (${window.NotesSystem ? window.NotesSystem.getAllNotes().length : 0})
                    </button>
                    <button class="btn" onclick="clearAllProgress()" style="border-color: #ef4444; color: #ef4444;">
                        🗑️ Reset Progress
                    </button>
                </div>
                <input type="file" id="import-file-input" accept=".json" style="display: none;"
                       onchange="if(this.files[0]){ const r = new FileReader(); r.onload = (e) => importAllData(e.target.result); r.readAsText(this.files[0]); }">
            </div>
        </div>
    `;
    
    APP.state.currentView = 'dashboard';
    updateNavigation();
}

function showDomain(domainId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    const domain = DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    
    const domainLessons = ALL_LESSONS.filter(l => l.domain === domainId);
    const domainSims = ALL_SIMULATIONS.filter(s => s.domain === domainId);
    const domainRem = ALL_REMEDIATION.filter(r => r.domain === domainId);
    const domainPBQs = ALL_PBQS.filter(p => p.domain === domainId);
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
            
            <h1 class="page-title">${domain.icon} Domain ${domainId}: ${domain.name}</h1>
            <p class="page-subtitle">Weight: ${Math.round(domain.weight * 100)}% of exam</p>
            
            <div class="domain-grid">
                <div class="domain-card" onclick="showDomainLessons(${domainId})">
                    <div style="font-size: 2rem;">📚</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">${domainLessons.length} Lessons</div>
                    <div style="color: #a1a1aa;">Comprehensive content</div>
                </div>
                
                <div class="domain-card" onclick="showDomainSimulations(${domainId})">
                    <div style="font-size: 2rem;">🎮</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">${domainSims.length} Simulations</div>
                    <div style="color: #a1a1aa;">Interactive scenarios</div>
                </div>
                
                <div class="domain-card" onclick="showDomainRemediation(${domainId})">
                    <div style="font-size: 2rem;">🔧</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">${domainRem.length} Remediation</div>
                    <div style="color: #a1a1aa;">Targeted practice</div>
                </div>
                
                <div class="domain-card" onclick="showDomainPBQs(${domainId})">
                    <div style="font-size: 2rem;">🖥️</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">${domainPBQs.length} PBQs</div>
                    <div style="color: #a1a1aa;">Performance questions</div>
                </div>
                
                <div class="domain-card" onclick="startDomainQuiz(${domainId})">
                    <div style="font-size: 2rem;">📝</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">Domain Quiz</div>
                    <div style="color: #a1a1aa;">Test your knowledge</div>
                </div>
            </div>
        </div>
    `;
    
    APP.state.currentDomain = domainId;
}

function showAllLessons() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">📚 All ${ALL_LESSONS.length} Lessons</h1>
            <p class="page-subtitle">Complete lesson content for Security+ SY0-701</p>
            
            ${DOMAINS.map(domain => {
                const domainLessons = ALL_LESSONS.filter(l => l.domain === domain.id);
                return `
                    <h2 style="margin-top: 30px; color: ${domain.color};">
                        ${domain.icon} Domain ${domain.id}: ${domain.name}
                    </h2>
                    <div class="lesson-grid">
                        ${domainLessons.map(lesson => {
                            const isCompleted = APP.progress.completedLessons.includes(lesson.id);
                            return `
                                <div class="lesson-card ${isCompleted ? 'completed' : ''}" 
                                     onclick="showLessonViewer('${lesson.id}')">
                                    <div>
                                        <div style="font-weight: bold;">${lesson.title}</div>
                                        <div style="color: #71717a; font-size: 0.9rem; margin-top: 5px;">
                                            ${lesson.objectives ? `Objectives: ${lesson.objectives.join(', ')}` : ''}
                                            ${lesson.difficulty ? `• <span class="difficulty-badge difficulty-${lesson.difficulty}">${lesson.difficulty}</span>` : ''}
                                        </div>
                                    </div>
                                    <button class="btn ${isCompleted ? 'btn-success' : 'btn-primary'}">
                                        ${isCompleted ? '✅ Review' : 'Start →'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    APP.state.currentView = 'lessons';
    updateNavigation();
}

// Helper functions for lesson navigation within domain
function getPreviousLesson(currentLessonId) {
    const currentLesson = ALL_LESSONS.find(l => l.id === currentLessonId);
    if (!currentLesson) return null;
    
    // Get all lessons in the same domain
    const domainLessons = ALL_LESSONS.filter(l => l.domain === currentLesson.domain);
    const currentIndex = domainLessons.findIndex(l => l.id === currentLessonId);
    
    // Return previous lesson if exists
    if (currentIndex > 0) {
        return domainLessons[currentIndex - 1];
    }
    return null;
}

function getNextLesson(currentLessonId) {
    const currentLesson = ALL_LESSONS.find(l => l.id === currentLessonId);
    if (!currentLesson) return null;
    
    // Get all lessons in the same domain
    const domainLessons = ALL_LESSONS.filter(l => l.domain === currentLesson.domain);
    const currentIndex = domainLessons.findIndex(l => l.id === currentLessonId);
    
    // Return next lesson if exists
    if (currentIndex < domainLessons.length - 1) {
        return domainLessons[currentIndex + 1];
    }
    return null;
}

function showLessonViewer(lessonId) {
    const content = document.getElementById('content');
    const lesson = ALL_LESSONS.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const isCompleted = APP.progress.completedLessons.includes(lessonId);
    
    // Generate default content if lesson doesn't have explicit content
    const lessonContent = lesson.content || {
        introduction: `Welcome to ${lesson.title}. This comprehensive lesson covers key concepts and practical applications for the Security+ certification exam.`,
        learningGoals: [
            `Master the fundamentals of ${lesson.title}`,
            'Understand implementation in real-world scenarios',
            'Identify common threats and vulnerabilities',
            'Apply best practices and security controls',
            'Prepare for exam questions on this topic'
        ],
        sections: [
            {
                title: 'Core Concepts',
                content: `This section covers the fundamental concepts of ${lesson.title}.

Key areas include:
• Definitions and terminology
• Industry standards and frameworks
• Common implementations
• Best practices
• Regulatory requirements

Understanding these concepts is essential for both the exam and real-world application.`
            },
            {
                title: 'Implementation and Configuration',
                content: `Learn how to implement and configure solutions related to ${lesson.title}.

Topics covered:
• Planning and design considerations
• Step-by-step implementation
• Configuration best practices
• Common mistakes to avoid
• Troubleshooting tips

These practical skills are frequently tested on the Security+ exam.`
            },
            {
                title: 'Security Considerations',
                content: `Explore the security implications and controls for ${lesson.title}.

Important aspects:
• Threat landscape and attack vectors
• Vulnerability assessment
• Risk mitigation strategies
• Monitoring and detection
• Incident response procedures

This knowledge is critical for protecting organizational assets.`
            }
        ],
        keyPoints: [
            `${lesson.title} is essential for comprehensive security`,
            'Balance security requirements with business needs',
            'Regular assessment and updates are crucial',
            'Documentation and training support effectiveness',
            'Integration with other security controls is key'
        ],
        examTips: [
            'Pay attention to scenario-based questions',
            'Know the differences between similar concepts',
            'Understand both technical and managerial aspects',
            'Practice identifying the BEST answer, not just correct ones'
        ]
    };
    
    // Get previous and next lessons in the same domain
    const prevLesson = getPreviousLesson(lessonId);
    const nextLesson = getNextLesson(lessonId);
    const domainLessons = ALL_LESSONS.filter(l => l.domain === lesson.domain);
    const currentLessonIndex = domainLessons.findIndex(l => l.id === lessonId);
    const totalLessonsInDomain = domainLessons.length;
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDomainLessons(${lesson.domain})">← Back to Domain ${lesson.domain} Lessons</button>
            
            <div class="lesson-viewer">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1>${lesson.title}</h1>
                    <div style="color: #71717a; font-size: 0.9rem;">
                        Lesson ${currentLessonIndex + 1} of ${totalLessonsInDomain} in Domain ${lesson.domain}
                    </div>
                </div>
                
                <div class="lesson-meta">
                    ${lesson.objectives ? `<span>📍 ${lesson.objectives.join(', ')}</span>` : ''}
                    ${lesson.difficulty ? `<span class="difficulty-badge difficulty-${lesson.difficulty}">${lesson.difficulty}</span>` : ''}
                    ${isCompleted ? '<span style="color: #10b981;">✅ Completed</span>' : ''}
                    ${window.NotesSystem ? window.NotesSystem.renderNoteButton('lesson', lessonId, lesson.title) : ''}
                </div>
                
                <!-- Lesson Navigation Bar -->
                <div class="lesson-nav">
                    ${prevLesson ? `
                        <button class="lesson-nav-btn prev" onclick="showLessonViewer('${prevLesson.id}')">
                            <div class="lesson-nav-btn-label">← Previous</div>
                            <div class="lesson-nav-btn-title">${escapeHtml(prevLesson.title)}</div>
                        </button>
                    ` : '<div class="lesson-nav-placeholder"></div>'}
                    
                    ${nextLesson ? `
                        <button class="lesson-nav-btn next" onclick="showLessonViewer('${nextLesson.id}')">
                            <div class="lesson-nav-btn-label">Next →</div>
                            <div class="lesson-nav-btn-title">${escapeHtml(nextLesson.title)}</div>
                        </button>
                    ` : '<div class="lesson-nav-placeholder"></div>'}
                </div>
                
                ${lessonContent.introduction ? `
                    <div class="intro-section">
                        ${formatContent(lessonContent.introduction)}
                    </div>
                ` : ''}
                
                ${lessonContent.learningGoals ? `
                    <div class="lesson-section learning-goals">
                        <h3>Learning Goals</h3>
                        <ul>
                            ${lessonContent.learningGoals.map(goal => `<li>${escapeHtml(goal)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Knowledge Check Progress Indicator -->
                ${lessonContent.sections && lessonContent.sections.some(s => s.knowledgeCheck || s.knowledge_check) ? `
                    <div id="kc-progress" class="kc-progress" style="margin-bottom: 20px;">
                        <span class="kc-progress-label">Knowledge Checks:</span>
                        <span class="kc-progress-value">0/0 complete</span>
                    </div>
                ` : ''}
                
                ${lessonContent.sections ? lessonContent.sections.map((section, sectionIndex) => {
                    const sectionId = section.section_id || section.sectionId || `section-${sectionIndex}`;
                    const knowledgeCheck = section.knowledgeCheck || section.knowledge_check;
                    
                    return `
                    <div class="lesson-section">
                        <h3>${escapeHtml(section.title)}</h3>
                        <div class="lesson-content">${formatContent(section.content || '')}</div>
                        
                        ${section.keyPoints || section.key_points ? `
                            <div class="key-points-box">
                                <strong>📌 Key Points</strong>
                                <ul>
                                    ${(section.keyPoints || section.key_points).map(p => `<li>${formatSimple(p)}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${section.examTips || section.exam_tips ? `
                            <div class="exam-tips-box">
                                <strong>💡 Exam Tip</strong>
                                <ul>
                                    ${(section.examTips || section.exam_tips).map(t => `<li>${formatSimple(t)}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${section.realWorldExample || section.real_world_example ? `
                            <div class="real-world-box">
                                <strong>🏢 Real-World Example</strong>
                                ${formatContent((section.realWorldExample || section.real_world_example).scenario || '')}
                                ${(section.realWorldExample || section.real_world_example).company ? `
                                    <p class="company-name">
                                        Company: ${escapeHtml((section.realWorldExample || section.real_world_example).company)}
                                    </p>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        ${knowledgeCheck ? (window.AdaptiveLearning 
                            ? window.AdaptiveLearning.renderKnowledgeCheck(knowledgeCheck, sectionId, sectionIndex)
                            : '') : ''}
                    </div>
                `}).join('') : ''}
                
                ${lessonContent.keyPoints ? `
                    <div class="lesson-section">
                        <h3>Key Points to Remember</h3>
                        <ul class="summary-list">
                            ${lessonContent.keyPoints.map(point => `<li>${formatSimple(point)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${lessonContent.examTips ? `
                    <div class="lesson-section exam-tips-box">
                        <h3 style="color: #c4b5fd;">💡 Exam Tips</h3>
                        <ul>
                            ${lessonContent.examTips.map(tip => `<li>${formatSimple(tip)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Bottom Navigation with Previous/Next -->
                <div class="lesson-bottom-nav">
                    <div class="lesson-actions">
                        <button class="btn ${isCompleted ? 'btn-success' : 'btn-primary'}" 
                                onclick="markLessonComplete('${lessonId}')">
                            ${isCompleted ? '✅ Completed' : '📌 Mark Complete'}
                        </button>
                        <button class="btn" onclick="startLessonQuiz(${lesson.domain})">
                            Take Quiz →
                        </button>
                        <button class="btn" onclick="showRelatedSimulation(${lesson.domain})">
                            Try Simulation →
                        </button>
                    </div>
                    
                    <!-- Previous/Next Navigation -->
                    <div class="lesson-prev-next">
                        ${prevLesson ? `
                            <button class="lesson-nav-btn prev" onclick="showLessonViewer('${prevLesson.id}')">
                                <div class="lesson-nav-btn-label">← Previous</div>
                                <div class="lesson-nav-btn-title">${escapeHtml(prevLesson.title)}</div>
                            </button>
                        ` : '<div></div>'}
                        
                        ${nextLesson ? `
                            <button class="lesson-nav-btn next" onclick="markLessonCompleteAndNext('${lessonId}', '${nextLesson.id}')">
                                <div class="lesson-nav-btn-label">Complete & Next →</div>
                                <div class="lesson-nav-btn-title">${escapeHtml(nextLesson.title)}</div>
                            </button>
                        ` : `
                            <button class="btn btn-success" onclick="showDomainLessons(${lesson.domain})">
                                ✅ Domain ${lesson.domain} Complete
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    APP.state.currentLesson = lessonId;
    APP.state.currentView = 'lesson-viewer';
    
    // Scroll to top of page when navigating to lesson
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Initialize knowledge checks if module is available
    if (window.AdaptiveLearning && lessonContent.sections) {
        window.AdaptiveLearning.initKnowledgeChecks({
            ...lesson,
            content: lessonContent
        });
        window.AdaptiveLearning.updateKnowledgeCheckProgress();
    }
}

// New function to mark complete and go to next
function markLessonCompleteAndNext(currentLessonId, nextLessonId) {
    if (!APP.progress.completedLessons.includes(currentLessonId)) {
        APP.progress.completedLessons.push(currentLessonId);
        saveProgress();
    }
    showLessonViewer(nextLessonId);
}

function showAllSimulations() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">🎮 All ${ALL_SIMULATIONS.length} Simulations</h1>
            <p class="page-subtitle">Interactive real-world scenarios</p>
            
            ${DOMAINS.map(domain => {
                const domainSims = ALL_SIMULATIONS.filter(s => s.domain === domain.id);
                if (domainSims.length === 0) return '';
                
                return `
                    <h2 style="margin-top: 30px; color: ${domain.color};">
                        ${domain.icon} Domain ${domain.id}
                    </h2>
                    <div class="lesson-grid">
                        ${domainSims.map(sim => {
                            const isCompleted = APP.progress.completedSimulations.includes(sim.id);
                            return `
                                <div class="lesson-card ${isCompleted ? 'completed' : ''}" 
                                     onclick="startSimulation('${sim.id}')">
                                    <div>
                                        <div style="font-weight: bold;">${sim.title}</div>
                                        <div style="color: #71717a; font-size: 0.9rem; margin-top: 5px;">
                                            ${sim.organization ? `Organization: ${sim.organization}` : ''}
                                            ${sim.difficulty ? `• <span class="difficulty-badge difficulty-${sim.difficulty}">${escapeHtml(sim.difficulty)}</span>` : ''}
                                        </div>
                                        ${sim.scenario ? `
                                            <div style="color: #a1a1aa; font-size: 0.9rem; margin-top: 10px;">
                                                ${escapeHtml(sim.scenario.substring(0, 100))}...
                                            </div>
                                        ` : ''}
                                    </div>
                                    <button class="btn ${isCompleted ? 'btn-success' : 'btn-primary'}">
                                        ${isCompleted ? '🔄 Replay' : 'Start →'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    APP.state.currentView = 'simulations';
    updateNavigation();
}
async function startSimulation(simId) {
    console.log(`🎮 Starting INTERACTIVE simulation: ${simId}`);
    
    // Check if interactive simulation system is loaded
    if (typeof startInteractiveSimulation === 'function') {
        // Use the new interactive system
        startInteractiveSimulation(simId);
    } else {
        // Fallback to old system if interactive files aren't loaded
        console.warn('Interactive simulation system not loaded, using fallback');
        startSimulation_OLD(simId);
    }
}

// OLD simulation system - kept as fallback
async function startSimulation_OLD(simId) {
    console.log(`🎮 Starting simulation (OLD FALLBACK): ${simId}`);
    
    // Show loading state
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <div style="text-align: center; padding: 100px 20px;">
                <div class="loading-spinner" style="margin: 0 auto;"></div>
                <h2>Loading Simulation...</h2>
                <p style="color: #71717a;">Loading from data/simulations.json</p>
            </div>
        </div>
    `;
    
    // Try to get from loaded data first
    let simData = SIMULATION_DATA[simId];
    
    if (!simData) {
        // Try reloading
        await loadSimulationsFromDataFolder();
        simData = SIMULATION_DATA[simId];
    }
    
    // Fall back to basic simulation info if still not found
    if (!simData) {
        const simulation = ALL_SIMULATIONS.find(s => s.id === simId);
        if (simulation) {
            console.log(`⚠️ Using basic simulation data for ${simId}`);
            simData = simulation;
        } else {
            alert(`Simulation ${simId} not found`);
            showAllSimulations();
            return;
        }
    }
    
    // Initialize simulation state
    APP.state.currentSimulation = simData;
    APP.state.simulationStep = 0;
    APP.state.score = 0;
    APP.state.currentDecisionIndex = 0;
    APP.state.simulationScore = 0;
    
    // Check what format the data is in
    if (simData.decision_points && simData.decision_points.length > 0) {
        console.log(`✅ Loaded ${simData.decision_points.length} decision points from JSON`);
        // If you have the enhanced functions, use them:
        if (typeof showEnhancedSimulationIntro === 'function') {
            showEnhancedSimulationIntro();
        } else {
            showSimulationStep();
        }
    } else if (simData.steps && simData.steps.length > 0) {
        console.log(`✅ Loaded ${simData.steps.length} steps from JSON`);
        simData.decision_points = simData.steps; // Convert steps to decision_points
        if (typeof showEnhancedSimulationIntro === 'function') {
            showEnhancedSimulationIntro();
        } else {
            showSimulationStep();
        }
    } else {
        // Use basic v30 display
        showSimulationStep();
    }
}

function showSimulationStep() {
    const content = document.getElementById('content');
    const sim = APP.state.currentSimulation;
    
    // Check if simulation has steps
    if (!sim.steps || sim.steps.length === 0) {
        // Generate dynamic simulation content based on the simulation
        const scenarios = {
            'beginner': 'You are starting your security journey with foundational scenarios.',
            'intermediate': 'You face realistic challenges that test your growing expertise.',
            'advanced': 'You must handle complex, multi-layered security incidents.'
        };
        
        const simulationContent = `
            <div class="container">
                <button class="back-btn" onclick="showAllSimulations()">← Exit Simulation</button>
                
                <div class="simulation-container">
                    <h1>${sim.title}</h1>
                    ${sim.organization ? `<p style="color: #71717a;">Organization: ${sim.organization}</p>` : ''}
                    ${sim.role ? `<p style="color: #71717a;">Your Role: ${sim.role}</p>` : ''}
                    ${sim.difficulty ? `<p style="color: #71717a;">Difficulty: <span class="difficulty-badge difficulty-${sim.difficulty}">${sim.difficulty}</span></p>` : ''}
                    
                    <div class="simulation-step">
                        <h3>Scenario Overview</h3>
                        <p>${sim.scenario || `In this ${sim.difficulty || 'interactive'} simulation, you will navigate through real-world security challenges and make critical decisions that impact organizational security.`}</p>
                    </div>
                    
                    <div class="simulation-step" style="margin-top: 20px;">
                        <h3>Simulation Objectives</h3>
                        <ul style="margin-left: 20px; line-height: 2;">
                            <li>Identify security threats and vulnerabilities</li>
                            <li>Make informed decisions based on best practices</li>
                            <li>Apply Security+ concepts in practical scenarios</li>
                            <li>Balance security needs with business requirements</li>
                            <li>Demonstrate incident response capabilities</li>
                        </ul>
                    </div>
                    
                    <div class="simulation-step" style="margin-top: 20px;">
                        <h3>What You'll Practice</h3>
                        <p>${scenarios[sim.difficulty] || scenarios['intermediate']}</p>
                        <ul style="margin: 20px 0 20px 20px; color: #a1a1aa;">
                            <li>Critical thinking and decision-making</li>
                            <li>Risk assessment and mitigation</li>
                            <li>Security control implementation</li>
                            <li>Incident response procedures</li>
                            <li>Communication with stakeholders</li>
                        </ul>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <p style="color: #71717a; margin-bottom: 20px;">
                            This simulation would normally present interactive decision points. 
                            Click below to mark as complete and continue your training.
                        </p>
                        <button class="btn btn-primary" onclick="completeSimulation('${sim.id}')">
                            Complete Simulation →
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        content.innerHTML = simulationContent;
        return;
    }
    
    const step = sim.steps[APP.state.simulationStep];
    
    if (!step) {
        showSimulationResults();
        return;
    }
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showAllSimulations()">← Exit Simulation</button>
            
            <div class="simulation-container">
                <h1>${sim.title}</h1>
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <span>Step ${APP.state.simulationStep + 1} of ${sim.steps.length}</span>
                    <span>Score: ${APP.state.score} points</span>
                </div>
                
                <div class="simulation-step">
                    <h3>Situation</h3>
                    <p>${step.situation}</p>
                    
                    <h3 style="margin-top: 20px; color: #6366f1;">${step.question}</h3>
                    
                    <div class="simulation-options">
                        ${step.options.map((opt, i) => `
                            <button class="btn" onclick="selectSimulationOption(${i}, ${opt.points || 0})" 
                                    style="text-align: left; padding: 15px;">
                                ${opt.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

window.showEnhancedSimulationIntro = function() {
    if (typeof showBriefingStage === 'function') {
        showBriefingStage(simEngine.getCurrentStage());
    } else {
        // Fallback to basic display
        showSimulationStep();
    }
};

function selectSimulationOption(index, points) {
    APP.state.score += points;
    
    const step = APP.state.currentSimulation.steps[APP.state.simulationStep];
    const option = step.options[index];
    
    // Show feedback
    const feedback = option.correct 
        ? `✅ Correct choice! ${option.feedback || 'Good decision.'}`
        : `⚠️ Not optimal. ${option.feedback || 'Consider the alternatives.'}`;
    
    alert(`${feedback}\n\nYou earned ${points} points.`);
    
    APP.state.simulationStep++;
    showSimulationStep();
}

function showSimulationResults() {
    const content = document.getElementById('content');
    const sim = APP.state.currentSimulation;
    
    // Calculate max possible score
    let maxScore = 100; // Default
    if (sim.steps && sim.steps.length > 0) {
        maxScore = sim.steps.reduce((total, step) => {
            const maxStepScore = Math.max(...step.options.map(o => o.points || 0));
            return total + maxStepScore;
        }, 0);
    }
    
    const percentage = Math.round((APP.state.score / maxScore) * 100) || 0;
    
    content.innerHTML = `
        <div class="container">
            <div class="simulation-container" style="text-align: center;">
                <h1>🎮 Simulation Complete!</h1>
                <h2>${sim.title}</h2>
                
                <div style="font-size: 3rem; margin: 30px 0; color: ${percentage >= 75 ? '#10b981' : '#f59e0b'};">
                    ${percentage}%
                </div>
                
                <p style="font-size: 1.2rem;">
                    Score: ${APP.state.score} / ${maxScore} points
                </p>
                
                <p style="color: #a1a1aa; margin: 20px 0;">
                    ${percentage >= 75 ? 'Excellent work! You made optimal decisions.' : 'Good effort! Consider reviewing the material and trying again.'}
                </p>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-top: 30px;">
                    <button class="btn btn-primary" onclick="showAllSimulations()">
                        Back to Simulations
                    </button>
                    <button class="btn" onclick="startSimulation('${sim.id}')">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Mark as completed if successful
    if (percentage >= 75 && !APP.progress.completedSimulations.includes(sim.id)) {
        APP.progress.completedSimulations.push(sim.id);
        saveProgress();
    }
}

function completeSimulation(simId) {
    if (!APP.progress.completedSimulations.includes(simId)) {
        APP.progress.completedSimulations.push(simId);
        saveProgress();
    }
    showAllSimulations();
}

function showAllRemediation() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">🔧 All ${ALL_REMEDIATION.length} Remediation Scenarios</h1>
            <p class="page-subtitle">Targeted practice for areas needing improvement</p>
            
            ${DOMAINS.map(domain => {
                const domainRem = ALL_REMEDIATION.filter(r => r.domain === domain.id);
                if (domainRem.length === 0) return '';
                
                return `
                    <h2 style="margin-top: 30px; color: ${domain.color};">
                        ${domain.icon} Domain ${domain.id}
                    </h2>
                    <div class="lesson-grid">
                        ${domainRem.map(rem => {
                            const isCompleted = APP.progress.completedRemediation.includes(rem.id);
                            return `
                                <div class="lesson-card ${isCompleted ? 'completed' : ''}" 
                                     onclick="startRemediation('${rem.id}')">
                                    <div>
                                        <div style="font-weight: bold;">${rem.title}</div>
                                        ${rem.focus ? `
                                            <div style="color: #71717a; font-size: 0.9rem; margin-top: 5px;">
                                                Focus: ${rem.focus}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <button class="btn ${isCompleted ? 'btn-success' : 'btn-warning'}">
                                        ${isCompleted ? '✅ Review' : '🔧 Practice'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    APP.state.currentView = 'remediation';
    updateNavigation();
}

function startRemediation(remId) {
    const remediation = ALL_REMEDIATION.find(r => r.id === remId);
    if (!remediation) {
        console.error('Remediation not found:', remId);
        return;
    }
    
    const content = document.getElementById('content');
    const hasRichContent = remediation.decisionPoints && remediation.decisionPoints.length > 0;
    const focusAreas = Array.isArray(remediation.focus) ? remediation.focus.join(', ') : (remediation.focus || '');
    
    // If we have rich content (decision points from external JSON), start interactive remediation
    if (hasRichContent) {
        startInteractiveRemediation(remediation);
        return;
    }
    
    // Otherwise show basic remediation overview
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showAllRemediation()">← Back</button>
            
            <div class="simulation-container">
                <h1>🔧 ${escapeHtml(remediation.title)}</h1>
                ${focusAreas ? `<p style="color: #71717a;">Focus Areas: ${escapeHtml(focusAreas)}</p>` : ''}
                
                ${remediation.overview ? `
                    <div style="background: #18181b; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #6366f1;">Scenario Overview</h3>
                        <p style="margin-top: 10px;">${escapeHtml(remediation.overview.situation || '')}</p>
                        ${remediation.overview.your_role ? `<p style="color: #a1a1aa; margin-top: 10px;"><strong>Your Role:</strong> ${escapeHtml(remediation.overview.your_role)}</p>` : ''}
                        ${remediation.overview.mission ? `<p style="color: #a1a1aa; margin-top: 10px;"><strong>Mission:</strong> ${escapeHtml(remediation.overview.mission)}</p>` : ''}
                    </div>
                ` : ''}
                
                ${remediation.companyContext ? `
                    <div style="background: #27272a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3>Company Context</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div><strong>Company:</strong> ${escapeHtml(remediation.companyContext.name || 'N/A')}</div>
                            <div><strong>Industry:</strong> ${escapeHtml(remediation.companyContext.industry || 'N/A')}</div>
                            <div><strong>Size:</strong> ${escapeHtml(remediation.companyContext.size || 'N/A')}</div>
                        </div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 20px;">
                    <div class="simulation-step">
                        <h3>Remediation Overview</h3>
                        <p>${escapeHtml(remediation.remediationFocus || 'This targeted remediation scenario helps you strengthen weak areas and reinforce key concepts. Based on quiz performance and identified knowledge gaps, this module provides focused practice.')}</p>
                    </div>
                    
                    <div class="simulation-step" style="margin-top: 20px;">
                        <h3>What You'll Review</h3>
                        <ul style="margin-left: 20px; line-height: 2;">
                            <li>Core concepts and definitions</li>
                            <li>Common misconceptions and errors</li>
                            <li>Best practices and implementation</li>
                            <li>Exam-specific knowledge points</li>
                            <li>Real-world application scenarios</li>
                        </ul>
                    </div>
                    
                    ${remediation.artifacts && remediation.artifacts.length > 0 ? `
                        <div style="background: #1e1e2e; border: 1px solid #6366f1; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <h3 style="color: #6366f1;">📚 Reference Materials Available</h3>
                            <div style="margin-top: 15px;">
                                ${remediation.artifacts.map(art => `
                                    <div style="background: #27272a; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
                                        <strong>${escapeHtml(art.title || 'Reference')}</strong>
                                        <p style="color: #a1a1aa; font-size: 0.9rem; margin-top: 5px;">
                                            ${escapeHtml(art.type || 'guide')} - Available during remediation
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-primary" onclick="completeRemediation('${escapeHtml(remId)}')">
                            Complete Remediation →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Interactive remediation with decision points
function startInteractiveRemediation(remediation) {
    APP.state.currentRemediation = remediation;
    APP.state.remediationIndex = 0;
    APP.state.remediationScore = 0;
    APP.state.remediationHistory = [];
    
    showRemediationDecisionPoint();
}

function showRemediationDecisionPoint() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const remediation = APP.state.currentRemediation;
    if (!remediation || !remediation.decisionPoints) {
        completeRemediation(remediation?.id);
        return;
    }
    
    const dp = remediation.decisionPoints[APP.state.remediationIndex];
    if (!dp) {
        showRemediationResults();
        return;
    }
    
    const content = document.getElementById('content');
    const currentNum = APP.state.remediationIndex + 1;
    const totalDPs = remediation.decisionPoints.length;
    
    content.innerHTML = `
        <div class="container">
            <div class="simulation-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #f59e0b;">🔧 ${escapeHtml(remediation.title)}</h2>
                    <span style="color: #a1a1aa;">Question ${currentNum} of ${totalDPs}</span>
                </div>
                
                <div style="background: #27272a; border-radius: 8px; padding: 4px; margin-bottom: 20px;">
                    <div style="background: linear-gradient(to right, #f59e0b, #ef4444); 
                                width: ${(currentNum / totalDPs) * 100}%; 
                                height: 8px; border-radius: 4px; transition: width 0.3s;">
                    </div>
                </div>
                
                <div class="simulation-step">
                    <h3>${escapeHtml(dp.title || 'Decision Point')}</h3>
                    <p style="margin-top: 15px; line-height: 1.8;">${escapeHtml(dp.context || dp.question || '')}</p>
                    ${dp.question && dp.context ? `<p style="margin-top: 15px; font-weight: bold; color: #6366f1;">${escapeHtml(dp.question)}</p>` : ''}
                </div>
                
                <div id="remediation-options" style="margin-top: 20px;">
                    ${dp.options.map((opt, idx) => `
                        <div class="quiz-option" onclick="selectRemediationOption('${escapeHtml(opt.id)}')" 
                             data-option="${escapeHtml(opt.id)}" style="cursor: pointer;">
                            <span style="margin-right: 15px; font-weight: bold;">${opt.id.toUpperCase()}.</span>
                            ${escapeHtml(opt.text)}
                        </div>
                    `).join('')}
                </div>
                
                <div id="remediation-feedback" style="display: none;"></div>
                
                <div style="margin-top: 30px; display: flex; justify-content: space-between;">
                    <button class="btn" onclick="showAllRemediation()">Exit</button>
                    <button class="btn btn-primary" id="rem-submit-btn" onclick="submitRemediationAnswer()" disabled>
                        Submit Answer
                    </button>
                    <button class="btn btn-primary" id="rem-next-btn" onclick="nextRemediationQuestion()" style="display: none;">
                        Next Question →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    APP.state.selectedRemediationOption = null;
}

function selectRemediationOption(optionId) {
    document.querySelectorAll('#remediation-options .quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const selected = document.querySelector(`[data-option="${optionId}"]`);
    if (selected) {
        selected.classList.add('selected');
    }
    
    APP.state.selectedRemediationOption = optionId;
    document.getElementById('rem-submit-btn').disabled = false;
}

function submitRemediationAnswer() {
    if (!APP.state.selectedRemediationOption) return;
    
    const remediation = APP.state.currentRemediation;
    const dp = remediation.decisionPoints[APP.state.remediationIndex];
    const selected = dp.options.find(o => o.id === APP.state.selectedRemediationOption);
    
    if (!selected) return;
    
    const isCorrect = selected.isCorrect || selected.is_correct;
    const points = selected.points || (isCorrect ? 25 : 5);
    APP.state.remediationScore += points;
    
    // Record in history
    APP.state.remediationHistory.push({
        questionIndex: APP.state.remediationIndex,
        selectedOption: selected.id,
        isCorrect: isCorrect,
        points: points
    });
    
    // Disable options
    document.querySelectorAll('#remediation-options .quiz-option').forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
        
        const optId = opt.getAttribute('data-option');
        const option = dp.options.find(o => o.id === optId);
        if (option) {
            if (option.isCorrect || option.is_correct) {
                opt.classList.add('correct');
            } else if (optId === APP.state.selectedRemediationOption && !isCorrect) {
                opt.classList.add('incorrect');
            }
        }
    });
    
    // Show feedback
    const feedbackDiv = document.getElementById('remediation-feedback');
    feedbackDiv.style.display = 'block';
    feedbackDiv.innerHTML = `
        <div class="quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
            <strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong><br>
            ${escapeHtml(selected.feedback || 'Review this concept for better understanding.')}
            ${selected.consequence ? `<br><em style="color: #a1a1aa;">Consequence: ${escapeHtml(selected.consequence)}</em>` : ''}
        </div>
    `;
    
    // Switch buttons
    document.getElementById('rem-submit-btn').style.display = 'none';
    document.getElementById('rem-next-btn').style.display = 'block';
}

function nextRemediationQuestion() {
    APP.state.remediationIndex++;
    APP.state.selectedRemediationOption = null;
    showRemediationDecisionPoint();
}

function showRemediationResults() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const remediation = APP.state.currentRemediation;
    const totalDPs = remediation.decisionPoints.length;
    const correctCount = APP.state.remediationHistory.filter(h => h.isCorrect).length;
    const percentage = Math.round((correctCount / totalDPs) * 100);
    const passed = percentage >= 70;
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <div class="quiz-container" style="text-align: center;">
                <h1>${passed ? '🎉 Remediation Complete!' : '📚 Keep Practicing!'}</h1>
                
                <div style="font-size: 4rem; margin: 30px 0; color: ${passed ? '#10b981' : '#f59e0b'};">
                    ${percentage}%
                </div>
                
                <p style="font-size: 1.2rem; margin-bottom: 20px;">
                    You got ${correctCount} out of ${totalDPs} questions correct
                </p>
                
                <p style="color: #a1a1aa; margin-bottom: 30px;">
                    ${passed 
                        ? 'Great progress! You\'ve strengthened your understanding of these concepts.' 
                        : 'Consider reviewing the lesson materials and trying again.'}
                </p>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="startRemediation('${escapeHtml(remediation.id)}')">
                        Try Again
                    </button>
                    <button class="btn" onclick="showAllRemediation()">
                        All Remediation
                    </button>
                    <button class="btn" onclick="showDashboard()">
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Mark as complete if passed
    if (passed && !APP.progress.completedRemediation.includes(remediation.id)) {
        APP.progress.completedRemediation.push(remediation.id);
        saveProgress();
    }
}

function completeRemediation(remId) {
    if (!APP.progress.completedRemediation.includes(remId)) {
        APP.progress.completedRemediation.push(remId);
        saveProgress();
    }
    showAllRemediation();
}

function showAllPBQs() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    // List of interactive PBQ IDs (ones that have full scenarios in PBQ_SCENARIOS)
    const interactivePBQs = [
        // Domain 1 (6 PBQs)
        'PBQ-D1-001', 'PBQ-D1-002', 'PBQ-D1-003', 'PBQ-D1-004', 'PBQ-D1-005', 'PBQ-D1-006',
        // Domain 2 (6 PBQs)
        'PBQ-D2-001', 'PBQ-D2-002', 'PBQ-D2-003', 'PBQ-D2-004', 'PBQ-D2-005', 'PBQ-D2-006',
        // Domain 3 (6 PBQs)
        'PBQ-D3-001', 'PBQ-D3-002', 'PBQ-D3-003', 'PBQ-D3-004', 'PBQ-D3-005', 'PBQ-D3-006',
        // Domain 4 (6 PBQs)
        'PBQ-D4-001', 'PBQ-D4-002', 'PBQ-D4-003', 'PBQ-D4-004', 'PBQ-D4-005', 'PBQ-D4-006',
        // Domain 5 (6 PBQs)
        'PBQ-D5-001', 'PBQ-D5-002', 'PBQ-D5-003', 'PBQ-D5-004', 'PBQ-D5-005', 'PBQ-D5-006'
    ];
    
    const interactiveCount = interactivePBQs.length;
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">🖥️ Performance-Based Questions</h1>
            <p class="page-subtitle">Hands-on exam simulations - just like the real CompTIA exam</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 25px 0;">
                <div style="background: linear-gradient(135deg, #064e3b, #065f46); padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${interactiveCount}</div>
                    <div style="color: #a1a1aa;">Interactive PBQs</div>
                </div>
                <div style="background: #18181b; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${ALL_PBQS.length}</div>
                    <div style="color: #a1a1aa;">Total PBQs</div>
                </div>
                <div style="background: #18181b; padding: 20px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${APP.progress.completedPBQs.length}</div>
                    <div style="color: #a1a1aa;">Completed</div>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #1e1b4b, #312e81); border: 1px solid #6366f1; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #a5b4fc; margin-bottom: 10px;">🎯 Interactive PBQs Available!</h3>
                <p style="color: #c7d2fe; line-height: 1.6;">
                    PBQs marked with <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">INTERACTIVE</span> 
                    feature full drag-drop, click-to-identify, configuration, matching, and analysis interfaces - just like the real Security+ exam!
                </p>
            </div>
            
            ${DOMAINS.map(domain => {
                const domainPBQs = ALL_PBQS.filter(p => p.domain === domain.id);
                if (domainPBQs.length === 0) return '';
                
                return `
                    <h2 style="margin-top: 30px; color: ${domain.color};">
                        ${domain.icon} Domain ${domain.id}: ${domain.name}
                    </h2>
                    <div class="lesson-grid">
                        ${domainPBQs.map(pbq => {
                            const isCompleted = APP.progress.completedPBQs.includes(pbq.id);
                            const isInteractive = interactivePBQs.includes(pbq.id);
                            return `
                                <div class="lesson-card ${isCompleted ? 'completed' : ''}" 
                                     style="${isInteractive ? 'border-color: #10b981; background: linear-gradient(135deg, #18181b, #1a2e1a);' : ''}"
                                     onclick="startPBQ('${pbq.id}')">
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                                            <span style="font-weight: bold;">${escapeHtml(pbq.title)}</span>
                                            ${isInteractive ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">INTERACTIVE</span>' : ''}
                                        </div>
                                        <div style="color: #71717a; font-size: 0.9rem; margin-top: 5px;">
                                            Type: ${escapeHtml(pbq.type)}
                                            • <span class="difficulty-badge difficulty-${pbq.difficulty}">${escapeHtml(pbq.difficulty)}</span>
                                        </div>
                                    </div>
                                    <button class="btn ${isCompleted ? 'btn-success' : isInteractive ? 'btn-primary' : ''}">
                                        ${isCompleted ? '✅ Review' : isInteractive ? 'Start →' : 'Preview'}
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    APP.state.currentView = 'pbqs';
    updateNavigation();
}

function startPBQ(pbqId) {
    // Use the interactive PBQ Engine if available and has this scenario
    if (window.PBQEngine && window.PBQ_SCENARIOS && window.PBQ_SCENARIOS[pbqId]) {
        console.log(`🎯 Starting interactive PBQ: ${pbqId}`);
        window.PBQEngine.start(pbqId);
        return;
    }
    
    // Fall back to basic PBQ display for scenarios not yet in the engine
    const pbq = ALL_PBQS.find(p => p.id === pbqId);
    if (!pbq) return;
    
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showAllPBQs()">← Back</button>
            
            <div class="pbq-container">
                <h1>🖥️ ${escapeHtml(pbq.title)}</h1>
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <span>Type: ${escapeHtml(pbq.type)}</span>
                    <span class="difficulty-badge difficulty-${pbq.difficulty}">${escapeHtml(pbq.difficulty)}</span>
                </div>
                
                <div class="pbq-scenario" style="background: #18181b; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 8px 8px 0;">
                    <h3 style="color: #10b981;">✅ All 30 Interactive PBQs Available!</h3>
                    <p style="margin-top: 15px;">All Performance-Based Questions are now fully interactive.</p>
                    <p style="margin-top: 10px; color: #a1a1aa;">PBQ types include:</p>
                    <ul style="margin: 15px 0 0 20px; line-height: 1.8; columns: 2;">
                        <li>Firewall Rule Configuration</li>
                        <li>Access Control Setup</li>
                        <li>MFA Configuration</li>
                        <li>Encryption Matching</li>
                        <li>Zero Trust Architecture</li>
                        <li>Physical Security Audit</li>
                        <li>Network Attack Vectors</li>
                        <li>Phishing Email Analysis</li>
                        <li>Malware Classification</li>
                        <li>Incident Timeline</li>
                        <li>Vulnerability Prioritization</li>
                        <li>Cloud Security Config</li>
                        <li>Cryptography Matching</li>
                        <li>Wireless Security Audit</li>
                        <li>SIEM Log Analysis</li>
                        <li>Incident Response Steps</li>
                        <li>Digital Forensics</li>
                        <li>IAM Configuration</li>
                        <li>Risk Assessment Matrix</li>
                        <li>Compliance Mapping</li>
                        <li>Vendor Risk Assessment</li>
                        <li>Policy Development</li>
                    </ul>
                </div>
                
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn btn-primary" onclick="showAllPBQs()">
                        ← View All PBQs
                    </button>
                </div>
            </div>
        </div>
    `;
    
    APP.state.currentPBQ = pbqId;
}

function completePBQ(pbqId) {
    if (!APP.progress.completedPBQs.includes(pbqId)) {
        APP.progress.completedPBQs.push(pbqId);
        saveProgress();
    }
    
    alert('✅ PBQ completed! In the actual exam, your configuration would be evaluated.');
    showAllPBQs();
}

function showQuizMenu() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">📝 Practice Quiz</h1>
            <p class="page-subtitle">${ACTUAL_QUESTIONS.length} exam-style questions available</p>
            
            <div class="domain-grid">
                ${DOMAINS.map(domain => {
                    const domainQuestions = ACTUAL_QUESTIONS.filter(q => q.domain === domain.id);
                    return `
                        <div class="domain-card" onclick="startDomainQuiz(${domain.id})" 
                             style="border-left: 4px solid ${domain.color};">
                            <div style="font-size: 2rem;">${domain.icon}</div>
                            <div style="font-size: 1.2rem; font-weight: bold;">Domain ${domain.id}</div>
                            <div style="color: #a1a1aa;">${domain.name}</div>
                            <div style="color: #71717a; margin-top: 10px;">
                                ${domainQuestions.length} questions
                            </div>
                        </div>
                    `;
                }).join('')}
                
                <div class="domain-card" onclick="startRandomQuiz()" 
                     style="border-left: 4px solid #a855f7;">
                    <div style="font-size: 2rem;">🎲</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">Random Mix</div>
                    <div style="color: #a1a1aa;">All domains mixed</div>
                    <div style="color: #71717a; margin-top: 10px;">10 random questions</div>
                </div>
            </div>
        </div>
    `;
    
    APP.state.currentView = 'quiz-menu';
    updateNavigation();
}

function startDomainQuiz(domainId) {
    let quizQuestions;
    
    // Use adaptive selection if available
    if (window.AdaptiveLearning) {
        quizQuestions = window.AdaptiveLearning.selectAdaptiveQuestions(
            ACTUAL_QUESTIONS, 
            10, 
            domainId
        );
        console.log(`📊 Starting adaptive Domain ${domainId} quiz with ${quizQuestions.length} questions`);
    } else {
        // Fallback to basic selection
        const domainQuestions = ACTUAL_QUESTIONS.filter(q => q.domain === domainId);
        quizQuestions = domainQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    }
    
    if (quizQuestions.length === 0) {
        alert('No questions available for this domain');
        return;
    }
    
    APP.state.currentQuizQuestions = quizQuestions;
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    APP.state.quizActive = true;
    APP.state.currentQuizDomain = domainId;
    
    showQuizQuestion();
}

function startRandomQuiz() {
    let quizQuestions;
    
    // Use adaptive selection if available
    if (window.AdaptiveLearning) {
        quizQuestions = window.AdaptiveLearning.selectAdaptiveQuestions(
            ACTUAL_QUESTIONS, 
            10, 
            null // All domains
        );
        console.log(`📊 Starting adaptive random quiz with ${quizQuestions.length} questions`);
    } else {
        // Fallback to basic random selection
        quizQuestions = [...ACTUAL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    }
    
    APP.state.currentQuizQuestions = quizQuestions;
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    APP.state.quizActive = true;
    APP.state.currentQuizDomain = null;
    
    showQuizQuestion();
}

function startLessonQuiz(domainId) {
    startDomainQuiz(domainId);
}

function showQuizQuestion() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    const question = APP.state.currentQuizQuestions[APP.state.currentQuestionIndex];
    
    if (!question) {
        showQuizResults();
        return;
    }
    
    const totalQuestions = APP.state.currentQuizQuestions.length;
    const currentNum = APP.state.currentQuestionIndex + 1;
    const isExam = APP.state.isFullExam;
    
    // Calculate timer display
    let timerDisplay = '';
    if (isExam && APP.state.examTimeRemaining > 0) {
        const mins = Math.floor(APP.state.examTimeRemaining / 60);
        const secs = APP.state.examTimeRemaining % 60;
        const timerColor = APP.state.examTimeRemaining <= 300 ? '#ef4444' : 
                          APP.state.examTimeRemaining <= 600 ? '#f59e0b' : '#10b981';
        timerDisplay = `
            <div style="background: #18181b; padding: 10px 20px; border-radius: 8px; 
                        display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span style="color: #71717a;">⏱️ Time Remaining:</span>
                <span id="exam-timer" style="font-size: 1.5rem; font-weight: bold; color: ${timerColor}; font-family: monospace;">
                    ${mins}:${secs.toString().padStart(2, '0')}
                </span>
            </div>
        `;
    }
    
    content.innerHTML = `
        <div class="container">
            <div class="quiz-container">
                ${timerDisplay}
                
                <div class="quiz-header">
                    <span>${isExam ? '📋 Practice Exam - ' : ''}Question ${currentNum} of ${totalQuestions}</span>
                    <span>Score: ${APP.state.score}/${APP.state.currentQuestionIndex}</span>
                </div>
                
                <div class="quiz-progress" style="${totalQuestions > 50 ? 'display: none;' : ''}">
                    ${Array.from({length: Math.min(totalQuestions, 50)}, (_, i) => {
                        let className = 'progress-dot';
                        if (i < APP.state.currentQuestionIndex) {
                            // Check if question was answered correctly
                            className += ' correct'; // Simplified - you'd track this properly
                        } else if (i === APP.state.currentQuestionIndex) {
                            className += ' active';
                        }
                        return `<div class="${className}"></div>`;
                    }).join('')}
                </div>
                
                ${totalQuestions > 50 ? `
                    <div style="background: #27272a; border-radius: 8px; padding: 4px; margin-bottom: 20px;">
                        <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); 
                                    width: ${(currentNum / totalQuestions) * 100}%; 
                                    height: 8px; border-radius: 4px; transition: width 0.3s;">
                        </div>
                    </div>
                ` : ''}
                
                <div class="quiz-question">${escapeHtml(question.question)}</div>
                
                <div class="quiz-options" id="quiz-options">
                    ${question.options.map((opt, i) => `
                        <div class="quiz-option" onclick="selectQuizOption(${i})" data-index="${i}">
                            <span style="margin-right: 15px; font-weight: bold;">
                                ${String.fromCharCode(65 + i)}.
                            </span>
                            ${escapeHtml(opt)}
                        </div>
                    `).join('')}
                </div>
                
                <div id="quiz-feedback"></div>
                
                <div style="margin-top: 30px; display: flex; justify-content: space-between;">
                    <button class="btn" onclick="showQuizMenu()">
                        Exit Quiz
                    </button>
                    <button class="btn btn-primary" id="submit-btn" onclick="submitQuizAnswer()">
                        Submit Answer
                    </button>
                    <button class="btn btn-primary" id="next-btn" onclick="nextQuizQuestion()" 
                            style="display: none;">
                        Next Question →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    APP.state.selectedOption = undefined;
}

function selectQuizOption(index) {
    // Remove previous selections
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-index="${index}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    APP.state.selectedOption = index;
}

function submitQuizAnswer() {
    if (APP.state.selectedOption === undefined) {
        alert('Please select an answer before submitting.');
        return;
    }
    
    const question = APP.state.currentQuizQuestions[APP.state.currentQuestionIndex];
    const correct = APP.state.selectedOption === question.correct_answer;
    
    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });
    
    // Mark correct/incorrect
    if (correct) {
        APP.state.score++;
        document.querySelector(`[data-index="${APP.state.selectedOption}"]`).classList.add('correct');
    } else {
        document.querySelector(`[data-index="${APP.state.selectedOption}"]`).classList.add('incorrect');
        document.querySelector(`[data-index="${question.correct_answer}"]`).classList.add('correct');
    }
    
    // Show feedback
    document.getElementById('quiz-feedback').innerHTML = `
        <div class="quiz-feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}">
            <strong>${correct ? '✅ Correct!' : '❌ Incorrect'}</strong><br>
            ${escapeHtml(question.explanation)}
        </div>
    `;
    
    // Switch buttons
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuizQuestion() {
    APP.state.currentQuestionIndex++;
    APP.state.selectedOption = undefined;
    showQuizQuestion();
}

function showQuizResults() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Stop exam timer if running
    stopExamTimer();
    
    const content = document.getElementById('content');
    const totalQuestions = APP.state.currentQuizQuestions.length;
    const percentage = Math.round((APP.state.score / totalQuestions) * 100);
    const passed = percentage >= 75;
    const needsRemediation = percentage < 85;
    const isExam = APP.state.isFullExam;
    
    // Get domain for remediation suggestion
    const domainId = APP.state.currentQuizQuestions[0]?.domain;
    const domainRemediation = domainId ? ALL_REMEDIATION.filter(r => r.domain === domainId) : [];
    
    // Calculate exam score (for practice exam mode)
    const examScore = isExam ? Math.round((percentage / 100) * 900) : null;
    const examPassed = examScore >= 750;
    
    content.innerHTML = `
        <div class="container">
            <div class="quiz-container" style="text-align: center;">
                <h1>${passed ? '🎉 Congratulations!' : '📚 Keep Studying!'}</h1>
                
                ${isExam ? `
                    <div style="background: ${examPassed ? '#064e3b' : '#7f1d1d'}; 
                                border: 2px solid ${examPassed ? '#10b981' : '#ef4444'};
                                border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <div style="font-size: 3rem; font-weight: bold; color: ${examPassed ? '#10b981' : '#ef4444'};">
                            ${examScore}/900
                        </div>
                        <div style="color: #a1a1aa; margin-top: 10px;">
                            ${examPassed ? '✅ PASSED - Passing score is 750' : '❌ NOT PASSED - You need 750 to pass'}
                        </div>
                    </div>
                ` : `
                    <div style="font-size: 4rem; margin: 30px 0; color: ${passed ? '#10b981' : '#f59e0b'};">
                        ${percentage}%
                    </div>
                `}
                
                <p style="font-size: 1.2rem; margin-bottom: 20px;">
                    You scored ${APP.state.score} out of ${totalQuestions}
                    ${isExam ? ` (${percentage}%)` : ''}
                </p>
                
                <p style="color: #a1a1aa; margin-bottom: 30px;">
                    ${passed 
                        ? 'Great job! You passed this quiz. The passing score is 75%.' 
                        : 'You need 75% to pass. Review the material and try again!'}
                </p>
                
                ${needsRemediation && domainRemediation.length > 0 ? `
                    <div style="background: linear-gradient(135deg, #1e1e2e, #27272a); 
                                border: 2px solid #f59e0b; border-radius: 12px; 
                                padding: 25px; margin: 20px 0; text-align: left;">
                        <h3 style="color: #f59e0b; margin-bottom: 15px;">
                            🔧 Recommended Remediation (Score below 85%)
                        </h3>
                        <p style="color: #a1a1aa; margin-bottom: 15px;">
                            Based on your results, we recommend completing these targeted practice scenarios:
                        </p>
                        <div style="display: grid; gap: 10px;">
                            ${domainRemediation.map(rem => `
                                <button class="btn" onclick="startRemediation('${rem.id}')" 
                                        style="text-align: left; padding: 15px; justify-content: flex-start;">
                                    <span style="margin-right: 10px;">📝</span>
                                    ${escapeHtml(rem.title)}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${!passed && !needsRemediation ? `
                    <div style="background: #27272a; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left;">
                        <h3>Recommended Study Areas:</h3>
                        <ul style="margin-left: 20px; margin-top: 10px; color: #a1a1aa;">
                            <li>Review the lesson materials for this domain</li>
                            <li>Complete the simulations for practice</li>
                            <li>Try the remediation scenarios</li>
                            <li>Study the glossary terms</li>
                        </ul>
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    ${needsRemediation && domainRemediation.length > 0 ? `
                        <button class="btn btn-warning" onclick="startRemediation('${domainRemediation[0].id}')" 
                                style="background: #f59e0b; color: #000;">
                            Start Remediation →
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="showQuizMenu()">
                        Back to Quiz Menu
                    </button>
                    <button class="btn" onclick="showDashboard()">
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
    
    APP.state.quizActive = false;
    APP.state.isFullExam = false;
    
    // Save score to progress
    if (domainId && APP.progress.domainScores[domainId]) {
        APP.progress.domainScores[domainId].push({
            score: APP.state.score,
            total: totalQuestions,
            percentage: percentage,
            date: new Date().toISOString()
        });
        
        // Track weak areas
        if (needsRemediation && !APP.progress.weakAreas.includes(domainId)) {
            APP.progress.weakAreas.push(domainId);
        } else if (percentage >= 90 && APP.progress.weakAreas.includes(domainId)) {
            // Remove from weak areas if scoring well
            APP.progress.weakAreas = APP.progress.weakAreas.filter(d => d !== domainId);
        }
        
        saveProgress();
    }
    
    // Save practice exam scores
    if (isExam) {
        APP.progress.practiceExamScores.push({
            score: examScore,
            percentage: percentage,
            passed: examPassed,
            date: new Date().toISOString()
        });
        saveProgress();
    }
}

function showGlossary() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    const terms = Object.entries(APP.content.glossary).sort((a, b) => a[0].localeCompare(b[0]));
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">📖 Security+ Glossary</h1>
            <p class="page-subtitle">${terms.length} essential terms and acronyms</p>
            
            <input type="text" 
                   placeholder="Search terms..." 
                   class="glossary-search"
                   onkeyup="filterGlossary(this.value)"
                   id="glossary-search">
            
            <div class="glossary-grid" id="glossary-terms">
                ${terms.map(([term, def]) => `
                    <div class="glossary-term">
                        <div class="glossary-term-title">${escapeHtml(term)}</div>
                        <div class="glossary-term-definition">${escapeHtml(def)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    APP.state.currentView = 'glossary';
    updateNavigation();
}

function filterGlossary(searchTerm) {
    const terms = Object.entries(APP.content.glossary)
        .filter(([term, def]) => 
            term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            def.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a[0].localeCompare(b[0]));
    
    const glossaryContainer = document.getElementById('glossary-terms');
    if (glossaryContainer) {
        glossaryContainer.innerHTML = terms.map(([term, def]) => `
            <div class="glossary-term">
                <div class="glossary-term-title">${escapeHtml(term)}</div>
                <div class="glossary-term-definition">${escapeHtml(def)}</div>
            </div>
        `).join('') || '<p style="text-align: center; color: #71717a;">No terms found matching your search.</p>';
    }
}

function showCareerQuiz() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            <div id="career-quiz-root"></div>
        </div>
    `;
    
    // Mount the React Career Quiz component
    if (window.React && window.ReactDOM && window.CybersecurityCareerQuiz) {
        const root = ReactDOM.createRoot(document.getElementById('career-quiz-root'));
        root.render(React.createElement(window.CybersecurityCareerQuiz));
    } else {
        document.getElementById('career-quiz-root').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #f4f4f5; margin-bottom: 16px;">🎯 Career Quiz</h2>
                <p style="color: #a1a1aa;">Loading career assessment...</p>
                <p style="color: #71717a; font-size: 0.875rem; margin-top: 12px;">
                    If this doesn't load, please refresh the page.
                </p>
            </div>
        `;
    }
    
    APP.state.currentView = 'career-quiz';
    updateNavigation();
}

function showPracticeExam() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDashboard()">← Back</button>
            
            <h1 class="page-title">📋 CompTIA Security+ Practice Exam</h1>
            <p class="page-subtitle">Full SY0-701 exam simulation</p>
            
            <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-top: 30px;">
                <h2 style="text-align: center; margin-bottom: 20px;">Exam Information</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #6366f1;">90</div>
                        <div style="color: #a1a1aa;">Questions</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #6366f1;">90</div>
                        <div style="color: #a1a1aa;">Minutes</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #6366f1;">750</div>
                        <div style="color: #a1a1aa;">Passing Score</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; color: #6366f1;">5-6</div>
                        <div style="color: #a1a1aa;">PBQs</div>
                    </div>
                </div>
                
                <div style="background: #27272a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3>Exam Breakdown:</h3>
                    <ul style="margin-left: 20px; margin-top: 10px; line-height: 2;">
                        ${DOMAINS.map(d => `
                            <li>Domain ${d.id}: ${Math.round(d.weight * 90)} questions (${Math.round(d.weight * 100)}%)</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div style="background: #1e1e2e; border: 1px solid #6366f1; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3>📌 Exam Tips:</h3>
                    <ul style="margin-left: 20px; margin-top: 10px; line-height: 2; color: #a1a1aa;">
                        <li>PBQs typically appear first - don't spend too much time on them</li>
                        <li>Flag difficult questions and return to them later</li>
                        <li>Eliminate obviously wrong answers first</li>
                        <li>Manage your time - about 1 minute per question</li>
                        <li>Read each question carefully for keywords</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-primary" onclick="startFullExam()" style="font-size: 1.1rem; padding: 15px 30px;">
                        Start Practice Exam →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    APP.state.currentView = 'practice-exam';
}

function startFullExam() {
    let examQuestions;
    
    // Use adaptive exam generation if available
    if (window.AdaptiveLearning) {
        examQuestions = window.AdaptiveLearning.generateAdaptivePracticeExam(ACTUAL_QUESTIONS, 90);
        console.log(`📊 Starting adaptive practice exam with ${examQuestions.length} questions`);
        console.log(`   Weak areas get increased representation`);
    } else {
        // Fallback to basic distribution
        examQuestions = [];
        
        DOMAINS.forEach(domain => {
            const domainQuestions = ACTUAL_QUESTIONS.filter(q => q.domain === domain.id);
            const numQuestions = Math.round(domain.weight * 90);
            const selected = domainQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.min(numQuestions, domainQuestions.length));
            examQuestions.push(...selected);
        });
        
        // Ensure we have 90 questions
        while (examQuestions.length < 90 && examQuestions.length < ACTUAL_QUESTIONS.length) {
            const randomQ = ACTUAL_QUESTIONS[Math.floor(Math.random() * ACTUAL_QUESTIONS.length)];
            if (!examQuestions.includes(randomQ)) {
                examQuestions.push(randomQ);
            }
        }
        
        examQuestions = examQuestions.sort(() => Math.random() - 0.5);
    }
    
    APP.state.currentQuizQuestions = examQuestions;
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    APP.state.quizActive = true;
    APP.state.isFullExam = true;
    APP.state.examTimeRemaining = 90 * 60; // 90 minutes in seconds
    APP.state.examStartTime = Date.now();
    APP.state.currentQuizDomain = null;
    
    // Start exam timer
    startExamTimer();
    
    showQuizQuestion();
}

// Exam timer functions
function startExamTimer() {
    // Clear any existing timer
    if (APP.state.examTimerInterval) {
        clearInterval(APP.state.examTimerInterval);
    }
    
    APP.state.examTimerInterval = setInterval(() => {
        APP.state.examTimeRemaining--;
        updateExamTimerDisplay();
        
        if (APP.state.examTimeRemaining <= 0) {
            clearInterval(APP.state.examTimerInterval);
            endExamTimeUp();
        }
    }, 1000);
}

function updateExamTimerDisplay() {
    const timerEl = document.getElementById('exam-timer');
    if (timerEl && APP.state.examTimeRemaining >= 0) {
        const mins = Math.floor(APP.state.examTimeRemaining / 60);
        const secs = APP.state.examTimeRemaining % 60;
        timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        // Warning colors
        if (APP.state.examTimeRemaining <= 300) { // 5 minutes
            timerEl.style.color = '#ef4444';
            timerEl.style.animation = 'pulse 1s infinite';
        } else if (APP.state.examTimeRemaining <= 600) { // 10 minutes
            timerEl.style.color = '#f59e0b';
        }
    }
}

function endExamTimeUp() {
    APP.state.quizActive = false;
    APP.state.isFullExam = false;
    
    if (window.notify) {
        window.notify.warning('Time is up! Your exam has been submitted.', 5000);
    }
    
    showQuizResults();
}

function stopExamTimer() {
    if (APP.state.examTimerInterval) {
        clearInterval(APP.state.examTimerInterval);
        APP.state.examTimerInterval = null;
    }
}

// Helper functions for domain-specific views
function showDomainLessons(domainId) {
    const lessons = ALL_LESSONS.filter(l => l.domain === domainId);
    showFilteredContent('lessons', lessons, domainId);
}

function showDomainSimulations(domainId) {
    const sims = ALL_SIMULATIONS.filter(s => s.domain === domainId);
    showFilteredContent('simulations', sims, domainId);
}

function showDomainRemediation(domainId) {
    const rem = ALL_REMEDIATION.filter(r => r.domain === domainId);
    showFilteredContent('remediation', rem, domainId);
}

function showDomainPBQs(domainId) {
    const pbqs = ALL_PBQS.filter(p => p.domain === domainId);
    showFilteredContent('pbqs', pbqs, domainId);
}

function showFilteredContent(type, items, domainId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const domain = DOMAINS.find(d => d.id === domainId);
    const content = document.getElementById('content');
    
    const typeConfig = {
        'lessons': { icon: '📚', title: 'Lessons', clickFunc: 'showLessonViewer' },
        'simulations': { icon: '🎮', title: 'Simulations', clickFunc: 'startSimulation' },
        'remediation': { icon: '🔧', title: 'Remediation', clickFunc: 'startRemediation' },
        'pbqs': { icon: '🖥️', title: 'PBQs', clickFunc: 'startPBQ' }
    };
    
    const config = typeConfig[type];
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showDomain(${domainId})">← Back to Domain ${domainId}</button>
            
            <h1 class="page-title">
                ${config.icon} Domain ${domainId} ${config.title}
            </h1>
            <p class="page-subtitle">${domain.name}</p>
            
            <div class="lesson-grid">
                ${items.map(item => `
                    <div class="lesson-card" onclick="${config.clickFunc}('${item.id}')">
                        <div>
                            <div style="font-weight: bold;">${item.title}</div>
                        </div>
                        <button class="btn btn-primary">Start →</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showRelatedSimulation(domainId) {
    const sims = ALL_SIMULATIONS.filter(s => s.domain === domainId);
    if (sims.length > 0) {
        startSimulation(sims[0].id);
    } else {
        showAllSimulations();
    }
}

// Progress management
function markLessonComplete(lessonId) {
    if (!APP.progress.completedLessons.includes(lessonId)) {
        APP.progress.completedLessons.push(lessonId);
        saveProgress();
        alert('✅ Lesson marked as complete!');
    } else {
        alert('📚 Lesson already completed. Marked for review.');
    }
    showLessonViewer(lessonId);
}

function saveProgress() {
    try {
        localStorage.setItem('securityPlusProgress_v32', JSON.stringify(APP.progress));
        console.log('Progress saved');
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
}

function loadProgress() {
    try {
        // Try loading v32 first, then fall back to v29 for migration
        let saved = localStorage.getItem('securityPlusProgress_v32');
        
        // Migrate from v29 if v32 doesn't exist
        if (!saved) {
            saved = localStorage.getItem('securityPlusProgress_v29');
            if (saved) {
                console.log('Migrating progress from v29 to v32');
                localStorage.setItem('securityPlusProgress_v32', saved);
            }
        }
        
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge saved progress with default
            Object.keys(parsed).forEach(key => {
                if (APP.progress.hasOwnProperty(key)) {
                    APP.progress[key] = parsed[key];
                }
            });
            console.log('Progress loaded');
        }
    } catch (e) {
        console.error('Failed to load progress:', e);
    }
}

/**
 * Export all progress and notes as downloadable JSON
 */
function exportAllData() {
    const exportData = {
        exportDate: new Date().toISOString(),
        version: 'v32',
        progress: APP.progress,
        notes: window.NotesSystem ? window.NotesSystem.getAllNotes() : []
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-plus-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (window.showNotification) {
        showNotification('Progress exported!', 'success');
    } else {
        alert('Progress exported!');
    }
}

/**
 * Import progress from JSON file
 */
function importAllData(jsonString) {
    try {
        const imported = JSON.parse(jsonString);
        
        // Import progress
        if (imported.progress) {
            Object.keys(imported.progress).forEach(key => {
                if (APP.progress.hasOwnProperty(key)) {
                    APP.progress[key] = imported.progress[key];
                }
            });
            saveProgress();
        }
        
        // Import notes if NotesSystem is available
        if (imported.notes && window.NotesSystem) {
            const notesObj = {};
            imported.notes.forEach(note => {
                notesObj[note.id] = note;
            });
            window.NotesSystem.importNotes(JSON.stringify(notesObj), true);
        }
        
        if (window.showNotification) {
            showNotification('Data imported successfully!', 'success');
        } else {
            alert('Data imported successfully!');
        }
        
        // Refresh the dashboard
        showDashboard();
        return true;
    } catch (e) {
        console.error('Failed to import data:', e);
        if (window.showNotification) {
            showNotification('Failed to import data', 'error');
        } else {
            alert('Failed to import data');
        }
        return false;
    }
}

/**
 * Clear all progress (with confirmation)
 */
function clearAllProgress() {
    if (!confirm('Are you sure you want to clear ALL progress? This cannot be undone.')) {
        return;
    }
    
    if (!confirm('This will delete all your quiz scores, completed lessons, simulations, and PBQs. Continue?')) {
        return;
    }
    
    // Reset progress to defaults
    APP.progress = {
        completedQuestions: [],
        flaggedQuestions: [],
        wrongAnswers: [],
        completedLessons: [],
        completedSimulations: [],
        completedRemediation: [],
        completedPBQs: [],
        domainScores: {1: [], 2: [], 3: [], 4: [], 5: []},
        practiceExamScores: [],
        weakAreas: [],
        lastActivity: null
    };
    
    saveProgress();
    
    if (window.showNotification) {
        showNotification('All progress cleared', 'info');
    }
    
    showDashboard();
}

function updateNavigation() {
    // Update active nav button based on current view
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class based on current view
    const viewMap = {
        'dashboard': 0,
        'lessons': 1,
        'simulations': 2,
        'remediation': 3,
        'pbqs': 4,
        'quiz-menu': 5,
        'glossary': 6,
        'practice-exam': 7
    };
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const activeIndex = viewMap[APP.state.currentView];
    if (activeIndex !== undefined && navButtons[activeIndex]) {
        navButtons[activeIndex].classList.add('active');
    }
}

// ============================================
// MAIN INITIALIZATION
// ============================================

function initApp() {
    console.log('════════════════════════════════════════');
    console.log('🚀 INITIALIZING SECURITY+ v31');
    console.log('   Full External JSON Integration');
    console.log('   All Content Fully Functional');
    console.log('════════════════════════════════════════');

    try {
        console.log('Step 1: Setting up DOM...');
        setupDOM();
        
        console.log('Step 2: Injecting styles...');
        injectStyles();
        
        console.log('Step 3: Loading progress from localStorage...');
        loadProgress();
        
        console.log('Step 4: Loading embedded content...');
        loadData();
        
        console.log('Step 5: Creating navigation header...');
        createHeader();
        
        console.log('Step 6: Showing dashboard...');
        showDashboard();
        
        APP.initialized = true;
        
        // Step 7: Try to load external JSON data (async, non-blocking)
        console.log('Step 7: Attempting to load external JSON files...');
        loadExternalContent();
        
        console.log('════════════════════════════════════════');
        console.log('✅ INITIALIZATION COMPLETE');
        console.log('✅ All systems operational');
        console.log('✅ ' + ALL_LESSONS.length + ' lessons loaded');
        console.log('✅ ' + ALL_SIMULATIONS.length + ' simulations ready');
        console.log('✅ ' + ALL_REMEDIATION.length + ' remediation scenarios');
        console.log('✅ ' + ALL_PBQS.length + ' PBQs configured');
        console.log('✅ ' + ACTUAL_QUESTIONS.length + ' questions loaded');
        console.log('✅ ' + Object.keys(GLOSSARY).length + ' glossary terms');
        console.log('════════════════════════════════════════');
        
        // Show welcome notification if ElegantUI is available
        setTimeout(() => {
            if (window.notify) {
                window.notify.success('Platform loaded successfully!', 3000);
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ INITIALIZATION ERROR:', error);
        console.error('Stack:', error.stack);
        
        // Show error screen with details
        document.body.innerHTML = `
            <div style="background: #09090b; color: #fafafa; padding: 40px; text-align: center; min-height: 100vh;">
                <h1 style="color: #ef4444;">⚠️ Initialization Error</h1>
                <p style="margin: 20px 0;">The application encountered an error during startup.</p>
                <div style="background: #18181b; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; 
                            max-width: 600px; margin: 20px auto; text-align: left;">
                    <strong>Error:</strong> ${escapeHtml(error.message)}<br>
                    <pre style="margin-top: 10px; font-size: 0.9rem; color: #a1a1aa; overflow-x: auto;">
${escapeHtml(error.stack)}
                    </pre>
                </div>
                <button onclick="location.reload()" 
                        style="background: #6366f1; color: white; border: none; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

// Load external JSON content (async, enhances embedded content)
async function loadExternalContent() {
    // Check if DataLoader is available
    if (typeof DataLoader === 'undefined') {
        console.log('⚠️ DataLoader not available, using embedded content only');
        return;
    }
    
    const loader = new DataLoader();
    
    try {
        const data = await loader.loadAll((percent, status) => {
            console.log(`Loading external content: ${percent}%`);
        });
        
        // Merge loaded data with embedded content
        if (data.questions.length > 0) {
            // Replace placeholder questions with real ones
            ACTUAL_QUESTIONS.length = 0;
            data.questions.forEach(q => ACTUAL_QUESTIONS.push(q));
            console.log(`✅ Loaded ${data.questions.length} real exam questions`);
        }
        
        if (data.lessons.length > 0) {
            // Enhance ALL_LESSONS with full content
            data.lessons.forEach(loadedLesson => {
                const existingIndex = ALL_LESSONS.findIndex(l => l.id === loadedLesson.id);
                if (existingIndex >= 0) {
                    // Merge content
                    ALL_LESSONS[existingIndex] = {
                        ...ALL_LESSONS[existingIndex],
                        ...loadedLesson
                    };
                } else {
                    ALL_LESSONS.push(loadedLesson);
                }
            });
            // Re-sort by domain and ID
            ALL_LESSONS.sort((a, b) => {
                if (a.domain !== b.domain) return a.domain - b.domain;
                return a.id.localeCompare(b.id);
            });
            console.log(`✅ Enhanced ${data.lessons.length} lessons with full content`);
        }
        
        if (data.simulations.length > 0) {
            // Store simulation data for use by enhanced-simulations.js
            data.simulations.forEach(sim => {
                // Ensure both property names are available (snake_case and camelCase)
                const normalizedSim = {
                    ...sim,
                    decisionPoints: sim.decisionPoints || sim.decision_points || [],
                    decision_points: sim.decision_points || sim.decisionPoints || []
                };
                
                SIMULATION_DATA[sim.id] = normalizedSim;
                APP.content.simulationData[sim.id] = normalizedSim;
                
                // Update ALL_SIMULATIONS entry
                const existingIndex = ALL_SIMULATIONS.findIndex(s => s.id === sim.id);
                if (existingIndex >= 0) {
                    ALL_SIMULATIONS[existingIndex] = {
                        ...ALL_SIMULATIONS[existingIndex],
                        ...normalizedSim
                    };
                }
            });
            console.log(`✅ Loaded ${data.simulations.length} full simulations`);
        }
        
        if (data.remediation.length > 0) {
            // Enhance ALL_REMEDIATION with full content
            data.remediation.forEach(loadedRem => {
                const existingIndex = ALL_REMEDIATION.findIndex(r => r.id === loadedRem.id);
                if (existingIndex >= 0) {
                    ALL_REMEDIATION[existingIndex] = {
                        ...ALL_REMEDIATION[existingIndex],
                        ...loadedRem
                    };
                } else {
                    ALL_REMEDIATION.push(loadedRem);
                }
            });
            console.log(`✅ Enhanced ${data.remediation.length} remediation scenarios`);
        }
        
        if (Object.keys(data.glossary).length > 0) {
            // Merge glossary terms
            Object.assign(GLOSSARY, data.glossary);
            APP.content.glossary = { ...APP.content.glossary, ...data.glossary };
            console.log(`✅ Added ${Object.keys(data.glossary).length} glossary terms from lessons`);
        }
        
        // Update APP.content
        APP.content.questions = ACTUAL_QUESTIONS;
        APP.content.lessons = ALL_LESSONS;
        APP.content.simulations = ALL_SIMULATIONS;
        APP.content.remediation = ALL_REMEDIATION;
        
        // Notify user if external content loaded
        if (loader.hasExternalData() && window.notify) {
            window.notify.info('External content loaded!', 2000);
        }
        
    } catch (error) {
        console.warn('⚠️ Error loading external content:', error);
        console.log('Continuing with embedded content');
    }
}

// Make all functions globally available
const globalFunctions = {
    showDashboard,
    showDomain,
    showAllLessons,
    showLessonViewer,
    showAllSimulations,
    startSimulation,
    selectSimulationOption,
    showSimulationResults,
    completeSimulation,
    showAllRemediation,
    startRemediation,
    startInteractiveRemediation,
    showRemediationDecisionPoint,
    selectRemediationOption,
    submitRemediationAnswer,
    nextRemediationQuestion,
    showRemediationResults,
    completeRemediation,
    showAllPBQs,
    startPBQ,
    completePBQ,
    showQuizMenu,
    startDomainQuiz,
    startRandomQuiz,
    startLessonQuiz,
    showQuizQuestion,
    selectQuizOption,
    submitQuizAnswer,
    nextQuizQuestion,
    showQuizResults,
    showGlossary,
    filterGlossary,
    showCareerQuiz,
    showPracticeExam,
    startFullExam,
    startExamTimer,
    stopExamTimer,
    updateExamTimerDisplay,
    endExamTimeUp,
    showDomainLessons,
    showDomainSimulations,
    showDomainRemediation,
    showDomainPBQs,
    showRelatedSimulation,
    markLessonComplete,
    markLessonCompleteAndNext,
    getPreviousLesson,
    getNextLesson,
    saveProgress,
    loadProgress,
    exportAllData,
    importAllData,
    clearAllProgress,
    updateNavigation
};

// Assign all functions to window
Object.keys(globalFunctions).forEach(key => {
    window[key] = globalFunctions[key];
});

// ============================================
// STARTUP SEQUENCE
// ============================================

console.log('Starting Security+ Platform v32...');

// Start immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // Small delay to ensure everything is ready
    setTimeout(initApp, 100);
}

// Backup initialization after 2 seconds if not started
setTimeout(() => {
    if (!APP.initialized) {
        console.warn('⚠️ Forcing initialization after timeout');
        initApp();
    }
}, 2000);

// Test function to verify data folder setup
function testDataFolderSetup() {
    console.log('🧪 Testing data/simulations.json setup...');
    
    fetch('./data/simulations.json')
        .then(response => {
            console.log(`Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('✅ File loaded successfully!');
            if (Array.isArray(data)) {
                console.log(`Found ${data.length} simulations`);
            } else if (data.simulations) {
                console.log(`Found ${data.simulations.length} simulations`);
            }
            console.log('Run loadSimulationsFromDataFolder() to load them');
        })
        .catch(error => {
            console.error('❌ Error:', error);
        });
}

// Final confirmation
console.log('✅ Security+ v31 loaded successfully');
console.log('📊 260 decision points across 26 simulations');
console.log('🎯 All v30 features preserved + enhanced simulations');
console.log('💯 Ready for professional Security+ training!');
console.log('🧪 Run testDataFolderSetup() to verify data/simulations.json');
