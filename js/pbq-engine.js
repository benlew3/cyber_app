// ================================================
// INTERACTIVE PBQ ENGINE - Security+ Platform v32
// Performance-Based Questions with full interactivity
// ================================================

(function() {
    'use strict';

    console.log('🎯 PBQ Engine initializing...');

    // ================================================
    // PBQ DATA - Full interactive scenarios
    // ================================================
    const PBQ_SCENARIOS = {
        // ==========================================
        // DOMAIN 1: General Security Concepts
        // ==========================================
        'PBQ-D1-001': {
            id: 'PBQ-D1-001',
            title: 'Configure Firewall Rules',
            domain: 1,
            type: 'drag-drop',
            difficulty: 'medium',
            timeLimit: 600, // 10 minutes
            scenario: `You are configuring a firewall for a web server that needs to:
• Allow inbound HTTPS (port 443) from any source
• Allow inbound SSH (port 22) only from the management network (10.0.1.0/24)
• Allow outbound DNS (port 53) to corporate DNS servers
• Block all other traffic

Drag the firewall rules into the correct order. Remember: firewall rules are processed top-to-bottom, and the first matching rule applies.`,
            instructions: 'Drag rules from the left panel to the right panel in the correct order (top = highest priority).',
            items: [
                { id: 'rule1', text: 'ALLOW TCP 443 FROM any TO webserver', category: 'allow', correct_position: 1 },
                { id: 'rule2', text: 'ALLOW TCP 22 FROM 10.0.1.0/24 TO webserver', category: 'allow', correct_position: 2 },
                { id: 'rule3', text: 'ALLOW UDP 53 FROM webserver TO dns-servers', category: 'allow', correct_position: 3 },
                { id: 'rule4', text: 'DENY ALL FROM any TO any', category: 'deny', correct_position: 4 },
                { id: 'rule5', text: 'ALLOW TCP 22 FROM any TO webserver', category: 'wrong', correct_position: -1 },
                { id: 'rule6', text: 'ALLOW ALL FROM webserver TO any', category: 'wrong', correct_position: -1 }
            ],
            solution: ['rule1', 'rule2', 'rule3', 'rule4'],
            explanation: `The correct order is:
1. Allow HTTPS (443) - Web traffic must be accessible
2. Allow SSH from management network only - Restricts admin access
3. Allow outbound DNS - Server needs name resolution
4. Deny all - Default deny blocks everything else

The incorrect rules would create security vulnerabilities:
• Allowing SSH from any source exposes the server to brute force attacks
• Allowing all outbound traffic could enable data exfiltration`,
            points: 100
        },

        'PBQ-D1-003': {
            id: 'PBQ-D1-003',
            title: 'Configure Multi-Factor Authentication',
            domain: 1,
            type: 'configuration',
            difficulty: 'easy',
            timeLimit: 480,
            scenario: `Your organization is implementing MFA for VPN access. Configure the authentication settings according to these security requirements:
• Password minimum length: 12 characters
• Password complexity: uppercase, lowercase, numbers, and special characters required
• Account lockout after 5 failed attempts
• Lockout duration: 30 minutes
• Session timeout: 15 minutes of inactivity
• MFA method: Time-based OTP (TOTP)`,
            instructions: 'Configure each setting to match the security requirements.',
            fields: [
                { id: 'pwd_length', label: 'Password Minimum Length', type: 'number', min: 8, max: 32, correct: 12 },
                { id: 'pwd_upper', label: 'Require Uppercase', type: 'checkbox', correct: true },
                { id: 'pwd_lower', label: 'Require Lowercase', type: 'checkbox', correct: true },
                { id: 'pwd_number', label: 'Require Numbers', type: 'checkbox', correct: true },
                { id: 'pwd_special', label: 'Require Special Characters', type: 'checkbox', correct: true },
                { id: 'lockout_threshold', label: 'Account Lockout Threshold', type: 'number', min: 1, max: 10, correct: 5 },
                { id: 'lockout_duration', label: 'Lockout Duration (minutes)', type: 'number', min: 5, max: 60, correct: 30 },
                { id: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', min: 5, max: 60, correct: 15 },
                { id: 'mfa_method', label: 'MFA Method', type: 'select', options: ['SMS OTP', 'Email OTP', 'TOTP App', 'Hardware Token', 'Push Notification'], correct: 'TOTP App' }
            ],
            explanation: `These settings align with security best practices:
• 12-character minimum provides adequate entropy
• Full complexity requirements prevent simple passwords
• 5 attempts before lockout balances security with usability
• 30-minute lockout deters brute force without excessive user impact
• 15-minute timeout protects unattended sessions
• TOTP is preferred over SMS (which is vulnerable to SIM swapping)`,
            points: 100
        },

        'PBQ-D1-004': {
            id: 'PBQ-D1-004',
            title: 'Match Encryption Algorithms',
            domain: 1,
            type: 'matching',
            difficulty: 'medium',
            timeLimit: 420,
            scenario: `Match each encryption algorithm or protocol with its correct classification and use case.`,
            instructions: 'Draw lines to connect each item on the left with its matching description on the right.',
            leftItems: [
                { id: 'aes', text: 'AES-256' },
                { id: 'rsa', text: 'RSA' },
                { id: 'sha256', text: 'SHA-256' },
                { id: 'ecdh', text: 'ECDH' },
                { id: 'bcrypt', text: 'bcrypt' }
            ],
            rightItems: [
                { id: 'symmetric', text: 'Symmetric encryption for data at rest' },
                { id: 'asymmetric', text: 'Asymmetric encryption for key exchange' },
                { id: 'hashing', text: 'Hashing algorithm for integrity verification' },
                { id: 'keyexchange', text: 'Elliptic curve key agreement protocol' },
                { id: 'password', text: 'Password hashing with salt and work factor' }
            ],
            correctMatches: {
                'aes': 'symmetric',
                'rsa': 'asymmetric',
                'sha256': 'hashing',
                'ecdh': 'keyexchange',
                'bcrypt': 'password'
            },
            explanation: `Correct matches:
• AES-256: Symmetric encryption - uses same key for encrypt/decrypt, ideal for bulk data
• RSA: Asymmetric encryption - uses public/private key pairs, often for key exchange
• SHA-256: Hashing - one-way function for integrity checks, not encryption
• ECDH: Key exchange - allows two parties to establish shared secret over insecure channel
• bcrypt: Password hashing - designed specifically for passwords with built-in salting`,
            points: 100
        },

        'PBQ-D1-006': {
            id: 'PBQ-D1-006',
            title: 'Physical Security Assessment',
            domain: 1,
            type: 'hotspot',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Review the data center floor plan below. Identify ALL security vulnerabilities by clicking on them. The facility should have proper physical security controls for a Tier 3 data center.`,
            instructions: 'Click on each area that represents a security vulnerability. You must find at least 4 of 6 vulnerabilities to pass.',
            image: 'datacenter', // Will render SVG
            hotspots: [
                { id: 'hs1', x: 15, y: 20, width: 12, height: 15, label: 'Unlocked Server Cabinet', 
                  explanation: 'Server cabinets should be locked to prevent unauthorized physical access.' },
                { id: 'hs2', x: 70, y: 15, width: 15, height: 12, label: 'Window in Server Room',
                  explanation: 'Windows in server rooms create vulnerabilities - visual access and potential break-in point.' },
                { id: 'hs3', x: 40, y: 75, width: 20, height: 15, label: 'Propped Open Door',
                  explanation: 'Fire doors should never be propped open - defeats access control and fire containment.' },
                { id: 'hs4', x: 85, y: 60, width: 10, height: 20, label: 'Missing Camera Coverage',
                  explanation: 'Blind spots in camera coverage allow unauthorized activity to go undetected.' },
                { id: 'hs5', x: 5, y: 50, width: 10, height: 15, label: 'Tailgating Entrance',
                  explanation: 'Single-door entry without mantrap allows tailgating attacks.' },
                { id: 'hs6', x: 50, y: 40, width: 15, height: 12, label: 'Unsecured Network Cables',
                  explanation: 'Exposed network cables can be tapped or disconnected by unauthorized persons.' }
            ],
            requiredCorrect: 4,
            points: 100
        },

        // ==========================================
        // DOMAIN 2: Threats & Vulnerabilities
        // ==========================================
        'PBQ-D2-001': {
            id: 'PBQ-D2-001',
            title: 'Identify Attack Vectors',
            domain: 2,
            type: 'hotspot',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Analyze this network diagram showing a corporate environment. Identify potential attack vectors that a threat actor could exploit.`,
            instructions: 'Click on each component or connection that represents a potential attack vector.',
            image: 'network',
            hotspots: [
                { id: 'av1', x: 10, y: 10, width: 15, height: 15, label: 'Unpatched Web Server',
                  explanation: 'Public-facing web servers are prime targets. Without patching, known vulnerabilities can be exploited.' },
                { id: 'av2', x: 50, y: 5, width: 20, height: 12, label: 'Open WiFi Network',
                  explanation: 'Open wireless networks allow anyone to connect and potentially access internal resources.' },
                { id: 'av3', x: 80, y: 30, width: 15, height: 15, label: 'Legacy System',
                  explanation: 'Legacy systems often run unsupported software with unpatched vulnerabilities.' },
                { id: 'av4', x: 30, y: 50, width: 18, height: 15, label: 'Email Gateway',
                  explanation: 'Email is the primary vector for phishing, malware delivery, and social engineering.' },
                { id: 'av5', x: 60, y: 70, width: 15, height: 15, label: 'VPN Endpoint',
                  explanation: 'VPN endpoints can be targeted for credential stuffing or vulnerability exploitation.' }
            ],
            requiredCorrect: 3,
            points: 100
        },

        'PBQ-D2-002': {
            id: 'PBQ-D2-002',
            title: 'Analyze Phishing Email',
            domain: 2,
            type: 'analysis',
            difficulty: 'easy',
            timeLimit: 420,
            scenario: `A user forwarded this suspicious email to the security team. Analyze the email and identify ALL indicators of phishing.`,
            instructions: 'Click on each element that indicates this is a phishing attempt.',
            emailContent: {
                from: 'security@amaz0n-support.com',
                to: 'user@company.com',
                subject: 'URGENT: Your Account Will Be Suspended!!!',
                date: 'December 28, 2024 2:47 AM',
                body: `Dear Valued Customer,

We have detected unusual activity on your Amazon account. Your account will be SUSPENDED within 24 hours unless you verify your information immediately.

Click here to verify: http://amaz0n-secure.tk/verify?id=8x7df

Please have your credit card ready for verification.

Best regards,
Amazon Security Team

---
This email was sent to user@company.com. To unsubscribe, click here.`,
                indicators: [
                    { id: 'ind1', element: 'from', text: 'Sender domain "amaz0n-support.com"', explanation: 'Spoofed domain using zero instead of "o" - not legitimate Amazon domain.' },
                    { id: 'ind2', element: 'subject', text: 'URGENT with excessive punctuation', explanation: 'Creating false urgency is a classic social engineering tactic.' },
                    { id: 'ind3', element: 'time', text: 'Sent at 2:47 AM', explanation: 'Unusual sending time may indicate automated phishing campaign from different timezone.' },
                    { id: 'ind4', element: 'link', text: 'Suspicious .tk domain link', explanation: '.tk is a free domain often used for phishing. Legitimate Amazon uses amazon.com.' },
                    { id: 'ind5', element: 'request', text: 'Requesting credit card information', explanation: 'Legitimate companies never ask for credit card verification via email.' },
                    { id: 'ind6', element: 'greeting', text: 'Generic "Dear Valued Customer"', explanation: 'Legitimate Amazon emails use your actual name from your account.' }
                ]
            },
            requiredCorrect: 4,
            points: 100
        },

        // ==========================================
        // DOMAIN 3: Security Architecture
        // ==========================================
        'PBQ-D3-001': {
            id: 'PBQ-D3-001',
            title: 'Network Segmentation Design',
            domain: 3,
            type: 'drag-drop',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `Design a secure network architecture by placing systems in the correct network zones. The organization has:
• Public-facing web servers
• Internal application servers
• Database servers with PII
• Employee workstations
• Management/admin systems`,
            instructions: 'Drag each system type to its appropriate network zone.',
            zones: [
                { id: 'dmz', name: 'DMZ', description: 'Publicly accessible systems' },
                { id: 'internal', name: 'Internal Network', description: 'Standard business systems' },
                { id: 'restricted', name: 'Restricted Zone', description: 'Sensitive data systems' },
                { id: 'management', name: 'Management Network', description: 'Administrative access only' }
            ],
            items: [
                { id: 'web', text: 'Web Servers', correctZone: 'dmz' },
                { id: 'app', text: 'Application Servers', correctZone: 'internal' },
                { id: 'db', text: 'Database Servers (PII)', correctZone: 'restricted' },
                { id: 'workstations', text: 'Employee Workstations', correctZone: 'internal' },
                { id: 'admin', text: 'Admin Jump Servers', correctZone: 'management' },
                { id: 'siem', text: 'SIEM/Log Servers', correctZone: 'management' },
                { id: 'dns', text: 'External DNS', correctZone: 'dmz' },
                { id: 'backup', text: 'Backup Systems', correctZone: 'restricted' }
            ],
            explanation: `Proper network segmentation:
• DMZ: Public-facing systems that need internet access (web servers, external DNS)
• Internal: Regular business operations (workstations, app servers)
• Restricted: Sensitive data requiring additional controls (databases, backups)
• Management: Admin systems isolated from regular traffic (jump servers, SIEM)`,
            points: 100
        },

        // ==========================================
        // DOMAIN 4: Security Operations
        // ==========================================
        'PBQ-D4-001': {
            id: 'PBQ-D4-001',
            title: 'SIEM Log Analysis',
            domain: 4,
            type: 'analysis',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `Analyze the following SIEM alerts and log entries. Determine what type of attack is occurring and identify the appropriate response actions.`,
            instructions: 'Review the logs, then answer the questions below.',
            logs: [
                { time: '14:23:01', source: '10.0.1.50', event: 'Failed login attempt', user: 'admin', details: 'Invalid password' },
                { time: '14:23:02', source: '10.0.1.50', event: 'Failed login attempt', user: 'admin', details: 'Invalid password' },
                { time: '14:23:03', source: '10.0.1.50', event: 'Failed login attempt', user: 'administrator', details: 'Invalid password' },
                { time: '14:23:05', source: '10.0.1.50', event: 'Failed login attempt', user: 'root', details: 'Invalid password' },
                { time: '14:23:07', source: '10.0.1.50', event: 'Failed login attempt', user: 'sysadmin', details: 'Invalid password' },
                { time: '14:23:45', source: '10.0.1.50', event: 'Successful login', user: 'svc_backup', details: 'Login successful' },
                { time: '14:24:12', source: '10.0.1.50', event: 'Privilege escalation', user: 'svc_backup', details: 'Added to local admins' },
                { time: '14:25:30', source: '10.0.1.50', event: 'New scheduled task', user: 'svc_backup', details: 'Task: SystemUpdate.exe' }
            ],
            questions: [
                { 
                    id: 'q1', 
                    question: 'What type of attack is this?',
                    options: ['DDoS Attack', 'Password Spraying/Brute Force', 'SQL Injection', 'Phishing'],
                    correct: 1,
                    explanation: 'Multiple failed logins with different usernames from same source indicates password spraying.'
                },
                {
                    id: 'q2',
                    question: 'What indicates the attack was successful?',
                    options: ['The failed login attempts', 'The successful login as svc_backup', 'The source IP address', 'The time stamps'],
                    correct: 1,
                    explanation: 'After failed attempts, attacker successfully logged in as svc_backup service account.'
                },
                {
                    id: 'q3',
                    question: 'What is the attacker trying to establish?',
                    options: ['Network connectivity', 'Persistence mechanism', 'Data exfiltration', 'Lateral movement'],
                    correct: 1,
                    explanation: 'Creating a scheduled task is a common persistence technique to maintain access.'
                },
                {
                    id: 'q4',
                    question: 'What is the FIRST response action?',
                    options: ['Format the server', 'Disable the svc_backup account', 'Call law enforcement', 'Send email to staff'],
                    correct: 1,
                    explanation: 'Immediately disable the compromised account to prevent further malicious activity.'
                }
            ],
            points: 100
        },

        // ==========================================
        // DOMAIN 5: Security Program Management
        // ==========================================
        'PBQ-D5-001': {
            id: 'PBQ-D5-001',
            title: 'Risk Assessment Matrix',
            domain: 5,
            type: 'matrix',
            difficulty: 'medium',
            timeLimit: 540,
            scenario: `Complete the risk assessment matrix for the following identified risks. Calculate the risk score (Likelihood × Impact) and determine the appropriate risk treatment.`,
            instructions: 'For each risk, select the likelihood, impact, and appropriate treatment strategy.',
            risks: [
                { 
                    id: 'risk1', 
                    name: 'Ransomware Attack',
                    description: 'Malware encrypts critical business data',
                    correctLikelihood: 4,
                    correctImpact: 5,
                    correctTreatment: 'mitigate'
                },
                { 
                    id: 'risk2', 
                    name: 'Employee Data Theft',
                    description: 'Insider threat stealing customer PII',
                    correctLikelihood: 3,
                    correctImpact: 4,
                    correctTreatment: 'mitigate'
                },
                { 
                    id: 'risk3', 
                    name: 'Natural Disaster',
                    description: 'Earthquake damages primary data center',
                    correctLikelihood: 1,
                    correctImpact: 5,
                    correctTreatment: 'transfer'
                },
                { 
                    id: 'risk4', 
                    name: 'Social Media Defacement',
                    description: 'Company social media account compromised',
                    correctLikelihood: 3,
                    correctImpact: 2,
                    correctTreatment: 'accept'
                }
            ],
            likelihoodScale: ['1 - Rare', '2 - Unlikely', '3 - Possible', '4 - Likely', '5 - Almost Certain'],
            impactScale: ['1 - Negligible', '2 - Minor', '3 - Moderate', '4 - Major', '5 - Catastrophic'],
            treatments: [
                { id: 'mitigate', name: 'Mitigate', description: 'Implement controls to reduce risk' },
                { id: 'transfer', name: 'Transfer', description: 'Transfer risk via insurance or contract' },
                { id: 'accept', name: 'Accept', description: 'Accept the risk without additional controls' },
                { id: 'avoid', name: 'Avoid', description: 'Eliminate the risk by removing the activity' }
            ],
            explanation: `Risk treatment decisions:
• Ransomware (High risk 20): Mitigate - implement backups, EDR, training
• Data Theft (High risk 12): Mitigate - implement DLP, access controls, monitoring
• Natural Disaster (Medium risk 5): Transfer - purchase business interruption insurance
• Social Media (Low risk 6): Accept - low impact, monitoring is sufficient`,
            points: 100
        },

        // ==========================================
        // ADDITIONAL DOMAIN 1 PBQs
        // ==========================================
        'PBQ-D1-002': {
            id: 'PBQ-D1-002',
            title: 'Implement Access Controls',
            domain: 1,
            type: 'configuration',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `You are configuring Role-Based Access Control (RBAC) for a healthcare application. The system must comply with HIPAA requirements. Configure access levels for each role according to the principle of least privilege.

Roles to configure:
• Receptionist: Schedule appointments, view patient demographics
• Nurse: View/update vital signs, view medications, view patient records
• Doctor: Full patient record access, prescribe medications, order tests
• Administrator: User management only, no patient data access`,
            instructions: 'Set the appropriate permission level for each role and resource combination.',
            fields: [
                { id: 'recept_demo', label: 'Receptionist → Patient Demographics', type: 'select', 
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'Read Only' },
                { id: 'recept_medical', label: 'Receptionist → Medical Records', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'No Access' },
                { id: 'nurse_vitals', label: 'Nurse → Vital Signs', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'Read/Write' },
                { id: 'nurse_meds', label: 'Nurse → Medications', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'Read Only' },
                { id: 'doctor_records', label: 'Doctor → Patient Records', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'Full Control' },
                { id: 'doctor_prescribe', label: 'Doctor → Prescriptions', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'Read/Write' },
                { id: 'admin_users', label: 'Administrator → User Management', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'Full Control' },
                { id: 'admin_patient', label: 'Administrator → Patient Data', type: 'select',
                  options: ['No Access', 'Read Only', 'Read/Write', 'Full Control'], correct: 'No Access' }
            ],
            explanation: `RBAC with least privilege:
• Receptionists need demographics for scheduling but not medical records
• Nurses update vitals but only view (not modify) medication lists
• Doctors need full access to provide care
• Admins manage users but should never access patient data (separation of duties)
This configuration satisfies HIPAA's minimum necessary standard.`,
            points: 100
        },

        'PBQ-D1-005': {
            id: 'PBQ-D1-005',
            title: 'Zero Trust Architecture Design',
            domain: 1,
            type: 'drag-drop',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `Your organization is implementing Zero Trust Architecture. Place each security component in its correct architectural layer.

Zero Trust Principles:
• Never trust, always verify
• Assume breach
• Verify explicitly
• Use least privilege access`,
            instructions: 'Drag each security component to its correct Zero Trust layer.',
            zones: [
                { id: 'identity', name: 'Identity Layer', description: 'Who is requesting access?' },
                { id: 'device', name: 'Device Layer', description: 'What device is being used?' },
                { id: 'network', name: 'Network Layer', description: 'How is traffic controlled?' },
                { id: 'application', name: 'Application Layer', description: 'What app/data is accessed?' },
                { id: 'data', name: 'Data Layer', description: 'How is data protected?' }
            ],
            items: [
                { id: 'mfa', text: 'Multi-Factor Authentication', correctZone: 'identity' },
                { id: 'sso', text: 'Single Sign-On (SSO)', correctZone: 'identity' },
                { id: 'edr', text: 'Endpoint Detection & Response', correctZone: 'device' },
                { id: 'mdm', text: 'Mobile Device Management', correctZone: 'device' },
                { id: 'microseg', text: 'Micro-segmentation', correctZone: 'network' },
                { id: 'sdp', text: 'Software-Defined Perimeter', correctZone: 'network' },
                { id: 'casb', text: 'Cloud Access Security Broker', correctZone: 'application' },
                { id: 'waf', text: 'Web Application Firewall', correctZone: 'application' },
                { id: 'dlp', text: 'Data Loss Prevention', correctZone: 'data' },
                { id: 'encryption', text: 'Data Encryption', correctZone: 'data' }
            ],
            explanation: `Zero Trust layers:
• Identity: MFA and SSO verify the user's identity before any access
• Device: EDR and MDM ensure device health and compliance
• Network: Micro-segmentation and SDP limit lateral movement
• Application: CASB and WAF protect application access
• Data: DLP and encryption protect the actual data assets`,
            points: 100
        },

        // ==========================================
        // ADDITIONAL DOMAIN 2 PBQs
        // ==========================================
        'PBQ-D2-003': {
            id: 'PBQ-D2-003',
            title: 'Malware Classification',
            domain: 2,
            type: 'matching',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Match each malware sample description with its correct classification type.`,
            instructions: 'Draw lines to connect each malware behavior with its type.',
            leftItems: [
                { id: 'm1', text: 'Encrypts files and demands Bitcoin payment' },
                { id: 'm2', text: 'Replicates across network shares without user action' },
                { id: 'm3', text: 'Appears to be a game but installs keylogger' },
                { id: 'm4', text: 'Hides in boot sector, survives OS reinstall' },
                { id: 'm5', text: 'Captures banking credentials from browser' }
            ],
            rightItems: [
                { id: 't1', text: 'Ransomware' },
                { id: 't2', text: 'Worm' },
                { id: 't3', text: 'Trojan' },
                { id: 't4', text: 'Rootkit' },
                { id: 't5', text: 'Spyware' }
            ],
            correctMatches: {
                'm1': 't1',
                'm2': 't2',
                'm3': 't3',
                'm4': 't4',
                'm5': 't5'
            },
            explanation: `Malware classification:
• Ransomware: Encrypts data and demands payment for decryption key
• Worm: Self-replicating malware that spreads without user interaction
• Trojan: Malicious software disguised as legitimate application
• Rootkit: Hides deep in system (boot sector/kernel) for persistence
• Spyware: Monitors user activity and steals sensitive information`,
            points: 100
        },

        'PBQ-D2-004': {
            id: 'PBQ-D2-004',
            title: 'Incident Timeline Reconstruction',
            domain: 2,
            type: 'drag-drop',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `A security breach has occurred. Based on the evidence collected, arrange the attack stages in the correct chronological order according to the Cyber Kill Chain.

Evidence found:
• Malicious email with PDF attachment sent to finance team
• C2 beacon traffic to external IP detected
• Lateral movement to file server observed
• Exfiltration of customer database
• Malware established persistence via scheduled task
• Initial payload executed when PDF opened`,
            instructions: 'Drag the attack stages into chronological order (top = first).',
            items: [
                { id: 's1', text: '1. Reconnaissance: Attacker researches finance team emails', correct_position: 1 },
                { id: 's2', text: '2. Weaponization: Malicious PDF created with exploit', correct_position: 2 },
                { id: 's3', text: '3. Delivery: Phishing email sent to finance team', correct_position: 3 },
                { id: 's4', text: '4. Exploitation: PDF exploit executes payload', correct_position: 4 },
                { id: 's5', text: '5. Installation: Malware creates scheduled task', correct_position: 5 },
                { id: 's6', text: '6. Command & Control: Beacon connects to C2 server', correct_position: 6 },
                { id: 's7', text: '7. Actions on Objectives: Data exfiltration occurs', correct_position: 7 }
            ],
            solution: ['s1', 's2', 's3', 's4', 's5', 's6', 's7'],
            explanation: `The Cyber Kill Chain stages:
1. Reconnaissance: Attacker gathers information about targets
2. Weaponization: Creating the malicious payload
3. Delivery: Transmitting the weapon to target (phishing)
4. Exploitation: Triggering the vulnerability
5. Installation: Establishing persistence
6. C2: Maintaining remote control
7. Actions: Achieving the attacker's goal (data theft)

Understanding this chain helps identify where to break the attack.`,
            points: 100
        },

        'PBQ-D2-005': {
            id: 'PBQ-D2-005',
            title: 'Vulnerability Prioritization',
            domain: 2,
            type: 'matrix',
            difficulty: 'medium',
            timeLimit: 540,
            scenario: `Your vulnerability scanner found the following issues. Prioritize remediation using CVSS scores and business context. Assign severity and determine the remediation timeline.`,
            instructions: 'For each vulnerability, select the severity level and appropriate remediation timeline.',
            risks: [
                { 
                    id: 'vuln1', 
                    name: 'SQL Injection in Public Web App',
                    description: 'CVSS 9.8 - Customer-facing payment portal',
                    correctLikelihood: 5,
                    correctImpact: 5,
                    correctTreatment: 'critical'
                },
                { 
                    id: 'vuln2', 
                    name: 'Missing Patches on Internal Workstation',
                    description: 'CVSS 7.5 - Standard employee laptop',
                    correctLikelihood: 3,
                    correctImpact: 3,
                    correctTreatment: 'high'
                },
                { 
                    id: 'vuln3', 
                    name: 'SSL Certificate Expiring',
                    description: 'Internal application, expires in 30 days',
                    correctLikelihood: 2,
                    correctImpact: 2,
                    correctTreatment: 'medium'
                },
                { 
                    id: 'vuln4', 
                    name: 'Weak Password on Test Server',
                    description: 'Isolated test environment, no production data',
                    correctLikelihood: 2,
                    correctImpact: 1,
                    correctTreatment: 'low'
                }
            ],
            likelihoodScale: ['1 - Rare', '2 - Unlikely', '3 - Possible', '4 - Likely', '5 - Almost Certain'],
            impactScale: ['1 - Negligible', '2 - Minor', '3 - Moderate', '4 - Major', '5 - Catastrophic'],
            treatments: [
                { id: 'critical', name: 'Critical (24hr)', description: 'Immediate remediation required' },
                { id: 'high', name: 'High (7 days)', description: 'Remediate within one week' },
                { id: 'medium', name: 'Medium (30 days)', description: 'Remediate within one month' },
                { id: 'low', name: 'Low (90 days)', description: 'Remediate within quarter' }
            ],
            explanation: `Vulnerability prioritization factors:
• SQL Injection on public payment portal: Critical - direct path to breach + financial data
• Missing patches on workstation: High - potential entry point but not directly exposed
• Expiring SSL cert: Medium - planned remediation, internal only
• Weak password on test server: Low - isolated environment, minimal risk

Always consider CVSS score + asset criticality + exposure level.`,
            points: 100
        },

        // ==========================================
        // ADDITIONAL DOMAIN 3 PBQs
        // ==========================================
        'PBQ-D3-002': {
            id: 'PBQ-D3-002',
            title: 'Cloud Security Configuration',
            domain: 3,
            type: 'configuration',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `You are securing an AWS S3 bucket that will store sensitive customer documents. Configure the security settings according to best practices.

Requirements:
• Documents must be encrypted at rest
• Only authenticated users from your organization should access
• All access must be logged
• Public access must be blocked
• Data should be recoverable if accidentally deleted`,
            instructions: 'Configure each S3 bucket security setting appropriately.',
            fields: [
                { id: 'encryption', label: 'Server-Side Encryption', type: 'select',
                  options: ['Disabled', 'SSE-S3 (S3 Managed Keys)', 'SSE-KMS (AWS KMS Keys)', 'SSE-C (Customer Keys)'], 
                  correct: 'SSE-KMS (AWS KMS Keys)' },
                { id: 'public_access', label: 'Block Public Access', type: 'checkbox', correct: true },
                { id: 'versioning', label: 'Bucket Versioning', type: 'checkbox', correct: true },
                { id: 'logging', label: 'Server Access Logging', type: 'checkbox', correct: true },
                { id: 'mfa_delete', label: 'MFA Delete', type: 'checkbox', correct: true },
                { id: 'lifecycle', label: 'Lifecycle Rules for Old Versions', type: 'select',
                  options: ['No lifecycle rules', 'Delete after 30 days', 'Move to Glacier after 90 days', 'Delete after 365 days'],
                  correct: 'Move to Glacier after 90 days' },
                { id: 'replication', label: 'Cross-Region Replication', type: 'checkbox', correct: true },
                { id: 'object_lock', label: 'Object Lock (WORM)', type: 'select',
                  options: ['Disabled', 'Governance Mode', 'Compliance Mode'],
                  correct: 'Governance Mode' }
            ],
            explanation: `S3 security best practices:
• SSE-KMS: Provides encryption with audit trail via CloudTrail
• Block Public Access: Prevents accidental public exposure
• Versioning: Enables recovery from deletions/overwrites
• Access Logging: Required for compliance and forensics
• MFA Delete: Prevents unauthorized deletion of versions
• Glacier Lifecycle: Cost-effective long-term storage
• Cross-Region Replication: Disaster recovery
• Object Lock (Governance): WORM protection with admin override`,
            points: 100
        },

        'PBQ-D3-003': {
            id: 'PBQ-D3-003',
            title: 'Cryptographic Implementation',
            domain: 3,
            type: 'matching',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Match each cryptographic use case with the most appropriate algorithm or protocol.`,
            instructions: 'Connect each security requirement with the correct cryptographic solution.',
            leftItems: [
                { id: 'c1', text: 'Encrypting data at rest on a hard drive' },
                { id: 'c2', text: 'Secure key exchange over insecure network' },
                { id: 'c3', text: 'Verifying file integrity after download' },
                { id: 'c4', text: 'Securing web traffic (HTTPS)' },
                { id: 'c5', text: 'Storing user passwords in database' },
                { id: 'c6', text: 'Digital signatures for code signing' }
            ],
            rightItems: [
                { id: 'a1', text: 'AES-256' },
                { id: 'a2', text: 'Diffie-Hellman / ECDH' },
                { id: 'a3', text: 'SHA-256' },
                { id: 'a4', text: 'TLS 1.3' },
                { id: 'a5', text: 'bcrypt / Argon2' },
                { id: 'a6', text: 'RSA / ECDSA' }
            ],
            correctMatches: {
                'c1': 'a1',
                'c2': 'a2',
                'c3': 'a3',
                'c4': 'a4',
                'c5': 'a5',
                'c6': 'a6'
            },
            explanation: `Cryptographic solutions by use case:
• Data at rest → AES-256: Fast symmetric encryption for bulk data
• Key exchange → DH/ECDH: Establishes shared secret over public channel
• Integrity verification → SHA-256: One-way hash detects modifications
• Web traffic → TLS 1.3: Protocol combining multiple crypto primitives
• Password storage → bcrypt/Argon2: Slow hashing defeats brute force
• Digital signatures → RSA/ECDSA: Asymmetric crypto for non-repudiation`,
            points: 100
        },

        'PBQ-D3-004': {
            id: 'PBQ-D3-004',
            title: 'Wireless Security Audit',
            domain: 3,
            type: 'hotspot',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Review the wireless network configuration diagram. Identify ALL security issues that need to be addressed.`,
            instructions: 'Click on each element that represents a security vulnerability. Find at least 4 of 6 issues.',
            image: 'wireless',
            hotspots: [
                { id: 'w1', x: 10, y: 10, width: 20, height: 15, label: 'WEP Encryption',
                  explanation: 'WEP is deprecated and easily cracked. Use WPA3 or WPA2-Enterprise.' },
                { id: 'w2', x: 45, y: 8, width: 25, height: 12, label: 'Default SSID "NETGEAR"',
                  explanation: 'Default SSIDs reveal equipment type and suggest default credentials may be in use.' },
                { id: 'w3', x: 75, y: 15, width: 18, height: 15, label: 'Hidden Network',
                  explanation: 'Hidden SSIDs provide false security; devices broadcast probes revealing the network.' },
                { id: 'w4', x: 15, y: 50, width: 20, height: 15, label: 'Guest on Same VLAN',
                  explanation: 'Guest network shares VLAN with corporate - needs isolation.' },
                { id: 'w5', x: 55, y: 55, width: 22, height: 15, label: 'No 802.1X',
                  explanation: 'Using PSK instead of 802.1X enterprise authentication lacks individual accountability.' },
                { id: 'w6', x: 80, y: 60, width: 15, height: 18, label: 'Rogue AP Detected',
                  explanation: 'Unauthorized access point creates security bypass and potential evil twin attack.' }
            ],
            requiredCorrect: 4,
            points: 100
        },

        // ==========================================
        // ADDITIONAL DOMAIN 4 PBQs
        // ==========================================
        'PBQ-D4-002': {
            id: 'PBQ-D4-002',
            title: 'Incident Response Procedure',
            domain: 4,
            type: 'drag-drop',
            difficulty: 'medium',
            timeLimit: 540,
            scenario: `A malware outbreak has been detected on multiple systems. Arrange the incident response steps in the correct order according to NIST SP 800-61.`,
            instructions: 'Drag the incident response steps into the correct sequence.',
            items: [
                { id: 'ir1', text: '1. Preparation: Verify IR team readiness and tools', correct_position: 1 },
                { id: 'ir2', text: '2. Detection: SIEM alerts on suspicious activity', correct_position: 2 },
                { id: 'ir3', text: '3. Analysis: Determine scope and impact', correct_position: 3 },
                { id: 'ir4', text: '4. Containment: Isolate affected systems', correct_position: 4 },
                { id: 'ir5', text: '5. Eradication: Remove malware and artifacts', correct_position: 5 },
                { id: 'ir6', text: '6. Recovery: Restore systems from clean backups', correct_position: 6 },
                { id: 'ir7', text: '7. Lessons Learned: Document and improve', correct_position: 7 }
            ],
            solution: ['ir1', 'ir2', 'ir3', 'ir4', 'ir5', 'ir6', 'ir7'],
            explanation: `NIST Incident Response phases:
1. Preparation: Have plans, tools, and training ready BEFORE incidents
2. Detection & Analysis: Identify and understand the incident
3. Containment: Stop the spread while preserving evidence
4. Eradication: Remove the threat completely
5. Recovery: Restore normal operations safely
6. Post-Incident: Learn and improve for next time

Note: Containment before eradication - don't tip off attacker!`,
            points: 100
        },

        'PBQ-D4-003': {
            id: 'PBQ-D4-003',
            title: 'Digital Forensics Evidence Handling',
            domain: 4,
            type: 'drag-drop',
            difficulty: 'hard',
            timeLimit: 540,
            scenario: `You've been called to collect digital evidence from a compromised workstation. Arrange the forensic procedures in the correct order to maintain evidence integrity and chain of custody.`,
            instructions: 'Drag the forensic steps into the correct order for evidence collection.',
            items: [
                { id: 'f1', text: '1. Document scene with photos and notes', correct_position: 1 },
                { id: 'f2', text: '2. Capture volatile memory (RAM dump)', correct_position: 2 },
                { id: 'f3', text: '3. Capture network connections state', correct_position: 3 },
                { id: 'f4', text: '4. Create forensic disk image (bit-for-bit)', correct_position: 4 },
                { id: 'f5', text: '5. Generate hash of original and image', correct_position: 5 },
                { id: 'f6', text: '6. Secure original evidence in evidence bag', correct_position: 6 },
                { id: 'f7', text: '7. Complete chain of custody documentation', correct_position: 7 },
                { id: 'wrong1', text: 'Power off system immediately', correct_position: -1 },
                { id: 'wrong2', text: 'Run antivirus scan on system', correct_position: -1 }
            ],
            solution: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
            explanation: `Forensic evidence collection order of volatility:
1. Document first - establish baseline evidence
2. RAM capture - most volatile, lost on power off
3. Network state - connections reveal C2 communication
4. Disk image - create forensic copy, never work on original
5. Hash verification - proves image integrity in court
6. Secure original - maintain chain of custody
7. Documentation - legal requirement for evidence

NEVER: Power off (loses RAM) or run AV (modifies evidence)`,
            points: 100
        },

        'PBQ-D4-004': {
            id: 'PBQ-D4-004',
            title: 'Identity Management Configuration',
            domain: 4,
            type: 'configuration',
            difficulty: 'medium',
            timeLimit: 540,
            scenario: `Configure the Identity Provider (IdP) settings for your organization's Single Sign-On (SSO) system according to security best practices and compliance requirements.`,
            instructions: 'Set each identity management configuration option.',
            fields: [
                { id: 'session_timeout', label: 'Session Timeout (minutes)', type: 'number', 
                  min: 5, max: 480, correct: 60 },
                { id: 'mfa_required', label: 'Require MFA for All Users', type: 'checkbox', correct: true },
                { id: 'mfa_method', label: 'Primary MFA Method', type: 'select',
                  options: ['SMS OTP', 'Email OTP', 'Authenticator App', 'Hardware Token'],
                  correct: 'Authenticator App' },
                { id: 'pwd_expiry', label: 'Password Expiration (days)', type: 'number',
                  min: 0, max: 365, correct: 90 },
                { id: 'pwd_history', label: 'Password History (remember last N)', type: 'number',
                  min: 0, max: 24, correct: 12 },
                { id: 'failed_attempts', label: 'Account Lockout After', type: 'number',
                  min: 3, max: 10, correct: 5 },
                { id: 'lockout_duration', label: 'Lockout Duration (minutes)', type: 'number',
                  min: 5, max: 60, correct: 15 },
                { id: 'risk_auth', label: 'Risk-Based Authentication', type: 'checkbox', correct: true },
                { id: 'device_trust', label: 'Require Trusted Device', type: 'checkbox', correct: true }
            ],
            explanation: `IdP security configuration:
• 60-min session: Balances security with user experience
• MFA required: Essential for preventing credential theft
• Authenticator app: More secure than SMS (SIM swapping risk)
• 90-day password expiry: NIST now recommends longer/no expiry with MFA
• 12 password history: Prevents password reuse cycles
• 5 failed attempts: Industry standard lockout threshold
• 15-min lockout: Deters brute force without excessive user impact
• Risk-based auth: Adapts to threat signals (new location, device)
• Device trust: Ensures managed/compliant devices only`,
            points: 100
        },

        // ==========================================
        // ADDITIONAL DOMAIN 5 PBQs
        // ==========================================
        'PBQ-D5-002': {
            id: 'PBQ-D5-002',
            title: 'Compliance Framework Mapping',
            domain: 5,
            type: 'matching',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Match each compliance requirement or regulation with the correct framework or standard.`,
            instructions: 'Connect each requirement scenario with the applicable compliance framework.',
            leftItems: [
                { id: 'r1', text: 'Credit card payment processing security' },
                { id: 'r2', text: 'Protected health information privacy' },
                { id: 'r3', text: 'EU personal data protection' },
                { id: 'r4', text: 'US federal information systems' },
                { id: 'r5', text: 'Financial services cybersecurity (NY)' },
                { id: 'r6', text: 'Publicly traded company financial controls' }
            ],
            rightItems: [
                { id: 'f1', text: 'PCI DSS' },
                { id: 'f2', text: 'HIPAA' },
                { id: 'f3', text: 'GDPR' },
                { id: 'f4', text: 'FedRAMP / NIST 800-53' },
                { id: 'f5', text: 'NYDFS 23 NYCRR 500' },
                { id: 'f6', text: 'SOX' }
            ],
            correctMatches: {
                'r1': 'f1',
                'r2': 'f2',
                'r3': 'f3',
                'r4': 'f4',
                'r5': 'f5',
                'r6': 'f6'
            },
            explanation: `Compliance frameworks by scope:
• PCI DSS: Payment Card Industry - any organization processing cards
• HIPAA: Healthcare - covered entities and business associates
• GDPR: EU residents' data - applies globally if processing EU data
• FedRAMP/NIST: US federal systems and cloud services
• NYDFS: NY financial institutions - strict cybersecurity rules
• SOX: Sarbanes-Oxley - public companies' financial controls`,
            points: 100
        },

        'PBQ-D5-003': {
            id: 'PBQ-D5-003',
            title: 'Third-Party Vendor Risk Assessment',
            domain: 5,
            type: 'analysis',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `Review the vendor security assessment results and determine the appropriate risk level and required actions for each vendor.`,
            instructions: 'Analyze each vendor profile and answer the risk assessment questions.',
            logs: [
                { time: 'Vendor A', source: 'CloudPayments Inc', event: 'SOC 2 Type II', user: 'High', details: 'Processes credit cards' },
                { time: 'Vendor B', source: 'MarketingCo', event: 'No certifications', user: 'Low', details: 'Email marketing only' },
                { time: 'Vendor C', source: 'DataAnalytics Ltd', event: 'ISO 27001', user: 'High', details: 'Accesses customer PII' },
                { time: 'Vendor D', source: 'OfficeSupplies', event: 'N/A', user: 'None', details: 'No data access' }
            ],
            questions: [
                { 
                    id: 'q1', 
                    question: 'Which vendor poses the HIGHEST inherent risk?',
                    options: ['CloudPayments Inc', 'MarketingCo', 'DataAnalytics Ltd', 'OfficeSupplies'],
                    correct: 0,
                    explanation: 'CloudPayments processes payment card data - highest regulatory and financial risk.'
                },
                {
                    id: 'q2',
                    question: 'Which vendor requires immediate security review?',
                    options: ['CloudPayments Inc', 'MarketingCo', 'DataAnalytics Ltd', 'OfficeSupplies'],
                    correct: 2,
                    explanation: 'DataAnalytics accesses PII but only has ISO 27001 - need to verify data handling practices.'
                },
                {
                    id: 'q3',
                    question: 'What should be required from MarketingCo?',
                    options: ['SOC 2 report', 'Penetration test results', 'Security questionnaire', 'No additional requirements'],
                    correct: 2,
                    explanation: 'Low risk vendor - security questionnaire is proportionate due diligence.'
                },
                {
                    id: 'q4',
                    question: 'How often should CloudPayments be reassessed?',
                    options: ['Monthly', 'Quarterly', 'Annually', 'Every 2 years'],
                    correct: 1,
                    explanation: 'Critical vendors processing sensitive data require quarterly reviews minimum.'
                }
            ],
            points: 100
        },

        'PBQ-D5-004': {
            id: 'PBQ-D5-004',
            title: 'Security Policy Development',
            domain: 5,
            type: 'drag-drop',
            difficulty: 'medium',
            timeLimit: 540,
            scenario: `Your organization needs to establish a security policy hierarchy. Arrange the policy documents from highest level (strategic) to lowest level (operational).`,
            instructions: 'Drag policy documents into order from top (highest authority) to bottom (most specific).',
            items: [
                { id: 'p1', text: 'Information Security Policy (Board approved)', correct_position: 1 },
                { id: 'p2', text: 'Security Standards (Technology requirements)', correct_position: 2 },
                { id: 'p3', text: 'Security Procedures (Step-by-step guides)', correct_position: 3 },
                { id: 'p4', text: 'Security Guidelines (Recommendations)', correct_position: 4 },
                { id: 'p5', text: 'Work Instructions (Specific task details)', correct_position: 5 }
            ],
            solution: ['p1', 'p2', 'p3', 'p4', 'p5'],
            explanation: `Policy hierarchy (top to bottom):
1. Policy: High-level, board-approved, states "what" and "why"
2. Standards: Mandatory requirements, specific and measurable
3. Procedures: Step-by-step instructions, "how to" comply
4. Guidelines: Recommended practices, flexible implementation
5. Work Instructions: Detailed task-level documentation

Each level provides more specific detail for implementation.`,
            points: 100
        },

        // ==========================================
        // COMPLETING ALL 30 PBQs - 7 MORE SCENARIOS
        // ==========================================

        'PBQ-D2-006': {
            id: 'PBQ-D2-006',
            title: 'Threat Intelligence Analysis',
            domain: 2,
            type: 'analysis',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `Your threat intelligence feed has flagged several Indicators of Compromise (IoCs). Analyze the intelligence report and determine the appropriate response for each indicator.`,
            instructions: 'Review the threat intelligence data and answer the analysis questions.',
            logs: [
                { time: 'IoC-001', source: '185.220.101.42', event: 'Known C2 Server', user: 'Critical', details: 'Tor exit node, APT29 infrastructure' },
                { time: 'IoC-002', source: 'evil-update.com', event: 'Malicious Domain', user: 'High', details: 'Typosquat of legitimate software site' },
                { time: 'IoC-003', source: 'a1b2c3d4e5f6...', event: 'File Hash (SHA256)', user: 'High', details: 'Emotet malware variant' },
                { time: 'IoC-004', source: 'admin@company.org', event: 'Compromised Email', user: 'Medium', details: 'Used in BEC campaign' },
                { time: 'IoC-005', source: 'CVE-2024-1234', event: 'Active Exploitation', user: 'Critical', details: 'RCE in web framework, patch available' }
            ],
            questions: [
                {
                    id: 'q1',
                    question: 'Which IoC requires immediate network blocking?',
                    options: ['IoC-001 (C2 Server IP)', 'IoC-002 (Malicious Domain)', 'IoC-004 (Compromised Email)', 'All of the above'],
                    correct: 3,
                    explanation: 'All network-based IoCs (IP, domain, email sender) should be blocked immediately to prevent C2 communication and further compromise.'
                },
                {
                    id: 'q2',
                    question: 'What action should be taken for IoC-003 (file hash)?',
                    options: ['Block at firewall', 'Add to EDR blocklist', 'Ignore - hashes change frequently', 'Report to law enforcement'],
                    correct: 1,
                    explanation: 'File hashes should be added to EDR/antivirus blocklists to detect and prevent execution of known malware.'
                },
                {
                    id: 'q3',
                    question: 'What is the priority response for IoC-005 (CVE)?',
                    options: ['Monitor only', 'Schedule patch for next maintenance window', 'Emergency patch immediately', 'Disable affected service permanently'],
                    correct: 2,
                    explanation: 'Critical CVEs with active exploitation and available patches require emergency patching - the vulnerability is being actively exploited.'
                },
                {
                    id: 'q4',
                    question: 'Which threat intelligence sharing standard would you use to distribute these IoCs?',
                    options: ['CVSS', 'STIX/TAXII', 'NIST CSF', 'ISO 27001'],
                    correct: 1,
                    explanation: 'STIX (Structured Threat Information eXpression) and TAXII (Trusted Automated eXchange of Intelligence Information) are standards for sharing threat intelligence and IoCs.'
                }
            ],
            points: 100
        },

        'PBQ-D3-005': {
            id: 'PBQ-D3-005',
            title: 'PKI Certificate Management',
            domain: 3,
            type: 'configuration',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `You are configuring the Public Key Infrastructure (PKI) for your organization's certificate authority. Set up the certificate parameters according to security best practices.

Requirements:
• Web server certificates for public-facing sites
• Code signing certificates for internal applications  
• User certificates for email encryption
• Must support certificate revocation`,
            instructions: 'Configure each PKI setting according to best practices.',
            fields: [
                { id: 'key_size', label: 'RSA Key Size (bits)', type: 'select',
                  options: ['1024', '2048', '3072', '4096'], correct: '4096' },
                { id: 'hash_algo', label: 'Signature Hash Algorithm', type: 'select',
                  options: ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'], correct: 'SHA-256' },
                { id: 'web_validity', label: 'Web Server Cert Validity (days)', type: 'number',
                  min: 30, max: 825, correct: 398 },
                { id: 'code_validity', label: 'Code Signing Cert Validity (days)', type: 'number',
                  min: 365, max: 1825, correct: 1095 },
                { id: 'ocsp_enabled', label: 'Enable OCSP Responder', type: 'checkbox', correct: true },
                { id: 'crl_enabled', label: 'Publish CRL', type: 'checkbox', correct: true },
                { id: 'crl_interval', label: 'CRL Publication Interval (hours)', type: 'number',
                  min: 1, max: 168, correct: 24 },
                { id: 'key_escrow', label: 'Enable Key Escrow for Encryption Certs', type: 'checkbox', correct: true },
                { id: 'hsm_storage', label: 'Store CA Keys in HSM', type: 'checkbox', correct: true },
                { id: 'ct_logging', label: 'Certificate Transparency Logging', type: 'checkbox', correct: true }
            ],
            explanation: `PKI best practices:
• 4096-bit RSA: Provides long-term security (2048 minimum, 4096 recommended)
• SHA-256: SHA-1 is deprecated, SHA-256 is current standard
• 398-day web certs: Maximum allowed by browsers since 2020
• 3-year code signing: Longer validity for stable internal apps
• OCSP + CRL: Both revocation methods for compatibility
• 24-hour CRL: Balances freshness with server load
• Key escrow: Required for encryption certs (recovery), NOT for signing
• HSM: Hardware Security Module protects CA private keys
• CT Logging: Required for public certificates, aids detection`,
            points: 100
        },

        'PBQ-D3-006': {
            id: 'PBQ-D3-006',
            title: 'Secure Network Architecture',
            domain: 3,
            type: 'hotspot',
            difficulty: 'hard',
            timeLimit: 540,
            scenario: `Review the proposed network architecture diagram. Identify ALL security issues that violate best practices or create vulnerabilities.`,
            instructions: 'Click on each element that represents a security vulnerability or misconfiguration. Find at least 5 of 7 issues.',
            image: 'network',
            hotspots: [
                { id: 'n1', x: 10, y: 8, width: 22, height: 12, label: 'Database in DMZ',
                  explanation: 'Databases should NEVER be in the DMZ. They belong in a protected internal network segment.' },
                { id: 'n2', x: 43, y: 18, width: 14, height: 10, label: 'Single Firewall',
                  explanation: 'Single firewall creates single point of failure. Use redundant firewalls or defense in depth.' },
                { id: 'n3', x: 70, y: 8, width: 20, height: 12, label: 'Flat Internal Network',
                  explanation: 'Internal network should be segmented (VLANs, micro-segmentation) to limit lateral movement.' },
                { id: 'n4', x: 15, y: 35, width: 18, height: 12, label: 'No IDS/IPS',
                  explanation: 'Network lacks intrusion detection/prevention between zones. Add IDS/IPS at key chokepoints.' },
                { id: 'n5', x: 50, y: 45, width: 20, height: 15, label: 'Direct Internet Access',
                  explanation: 'Workstations have direct internet access bypassing proxy. All traffic should go through web proxy.' },
                { id: 'n6', x: 75, y: 55, width: 18, height: 15, label: 'Unencrypted Backup Traffic',
                  explanation: 'Backup traffic to offsite should be encrypted. Unencrypted backups expose sensitive data.' },
                { id: 'n7', x: 25, y: 60, width: 22, height: 12, label: 'Management VLAN Shared',
                  explanation: 'Management interfaces share VLAN with user traffic. Isolate management plane completely.' }
            ],
            requiredCorrect: 5,
            points: 100
        },

        'PBQ-D4-005': {
            id: 'PBQ-D4-005',
            title: 'Security Alert Triage',
            domain: 4,
            type: 'drag-drop',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Your SOC has received multiple security alerts. Prioritize them in order of severity and required response time. Consider potential business impact and threat severity.`,
            instructions: 'Drag the alerts into priority order (top = highest priority, respond first).',
            items: [
                { id: 'a1', text: '🔴 CRITICAL: Active ransomware encryption detected on file server', correct_position: 1 },
                { id: 'a2', text: '🔴 CRITICAL: Successful admin login from foreign IP at 3 AM', correct_position: 2 },
                { id: 'a3', text: '🟠 HIGH: Multiple failed login attempts on domain controller', correct_position: 3 },
                { id: 'a4', text: '🟠 HIGH: Outbound connection to known C2 IP blocked by firewall', correct_position: 4 },
                { id: 'a5', text: '🟡 MEDIUM: Antivirus quarantined malware on user workstation', correct_position: 5 },
                { id: 'a6', text: '🟡 MEDIUM: SSL certificate expiring in 14 days', correct_position: 6 },
                { id: 'a7', text: '🟢 LOW: User reported suspicious email (already deleted)', correct_position: 7 }
            ],
            solution: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'],
            explanation: `Alert triage priority rationale:
1. Active ransomware: Immediate containment needed to stop encryption spread
2. Suspicious admin login: Potential account compromise, high privilege
3. Failed DC logins: Could indicate brute force attack on critical system
4. Blocked C2: Connection was blocked, but indicates compromised host
5. Quarantined malware: Threat neutralized, but investigate infection vector
6. Expiring certificate: Planned maintenance, not immediate threat
7. Deleted suspicious email: Low priority - user already took action

Key principle: Active threats > Potential threats > Contained threats > Maintenance`,
            points: 100
        },

        'PBQ-D4-006': {
            id: 'PBQ-D4-006',
            title: 'User Access Review',
            domain: 4,
            type: 'configuration',
            difficulty: 'medium',
            timeLimit: 540,
            scenario: `You are conducting a quarterly user access review. For each user, determine the appropriate access action based on their current role and the principle of least privilege.

Current access levels:
• Level 1: Read-only access to public resources
• Level 2: Read/write access to department resources
• Level 3: Admin access to department systems
• Level 4: Domain admin / full system access`,
            instructions: 'Select the appropriate action for each user account.',
            fields: [
                { id: 'user1', label: 'John Smith - Terminated 2 weeks ago (Level 4)', type: 'select',
                  options: ['No change', 'Reduce to Level 1', 'Disable immediately', 'Delete account'], 
                  correct: 'Disable immediately' },
                { id: 'user2', label: 'Jane Doe - Transferred from IT to HR (Level 3 IT Admin)', type: 'select',
                  options: ['No change', 'Reduce to Level 2 HR', 'Reduce to Level 1', 'Disable account'],
                  correct: 'Reduce to Level 2 HR' },
                { id: 'user3', label: 'Bob Wilson - Contractor project ended, new project starting (Level 2)', type: 'select',
                  options: ['No change', 'Reduce to Level 1', 'Disable until new project', 'Delete account'],
                  correct: 'Disable until new project' },
                { id: 'user4', label: 'Alice Brown - Promoted to IT Manager (Level 2)', type: 'select',
                  options: ['No change', 'Elevate to Level 3', 'Elevate to Level 4', 'Reduce to Level 1'],
                  correct: 'Elevate to Level 3' },
                { id: 'user5', label: 'Service Account - Legacy app decommissioned (Level 3)', type: 'select',
                  options: ['No change', 'Reduce to Level 1', 'Disable immediately', 'Delete account'],
                  correct: 'Delete account' },
                { id: 'user6', label: 'CEO - Has Level 4 domain admin access', type: 'select',
                  options: ['No change - CEO needs full access', 'Reduce to Level 2', 'Reduce to Level 1', 'Create separate admin account'],
                  correct: 'Create separate admin account' }
            ],
            explanation: `Access review decisions:
• Terminated employee: Disable immediately (don't delete for audit trail)
• Department transfer: Adjust access to new role only
• Contractor between projects: Disable until new project starts
• Promotion: Grant appropriate access for new role
• Decommissioned service account: Delete - no longer needed
• Executive with admin: Separate admin account - don't mix daily/admin access

Principle of least privilege: Users should have minimum access needed for their role.`,
            points: 100
        },

        'PBQ-D5-005': {
            id: 'PBQ-D5-005',
            title: 'Business Impact Analysis',
            domain: 5,
            type: 'matrix',
            difficulty: 'hard',
            timeLimit: 600,
            scenario: `Conduct a Business Impact Analysis (BIA) for the organization's critical systems. Determine the impact level and recovery priorities for each system.`,
            instructions: 'For each system, assess the business impact and set the appropriate recovery time objective.',
            risks: [
                { 
                    id: 'sys1', 
                    name: 'E-commerce Website',
                    description: 'Customer-facing sales platform - $50K/hour revenue',
                    correctLikelihood: 5,
                    correctImpact: 5,
                    correctTreatment: 'rto1'
                },
                { 
                    id: 'sys2', 
                    name: 'Email System',
                    description: 'Employee communication and external correspondence',
                    correctLikelihood: 4,
                    correctImpact: 4,
                    correctTreatment: 'rto4'
                },
                { 
                    id: 'sys3', 
                    name: 'HR Database',
                    description: 'Employee records, payroll processing (runs weekly)',
                    correctLikelihood: 3,
                    correctImpact: 3,
                    correctTreatment: 'rto24'
                },
                { 
                    id: 'sys4', 
                    name: 'Development Environment',
                    description: 'Internal dev/test servers, no customer data',
                    correctLikelihood: 2,
                    correctImpact: 2,
                    correctTreatment: 'rto72'
                }
            ],
            likelihoodScale: ['1 - Negligible', '2 - Minor', '3 - Moderate', '4 - Major', '5 - Critical'],
            impactScale: ['1 - Minimal ($)', '2 - Low ($$)', '3 - Medium ($$$)', '4 - High ($$$$)', '5 - Severe ($$$$$)'],
            treatments: [
                { id: 'rto1', name: 'RTO: 1 hour', description: 'Hot standby, immediate failover' },
                { id: 'rto4', name: 'RTO: 4 hours', description: 'Warm standby, quick recovery' },
                { id: 'rto24', name: 'RTO: 24 hours', description: 'Cold standby, next business day' },
                { id: 'rto72', name: 'RTO: 72 hours', description: 'Rebuild from backup' }
            ],
            explanation: `BIA recovery priority rationale:
• E-commerce (RTO 1hr): Direct revenue impact, customer-facing, competitive risk
• Email (RTO 4hr): Critical for operations but can tolerate brief outage
• HR Database (RTO 24hr): Important but weekly processing, day+ acceptable
• Dev Environment (RTO 72hr): Internal only, can rebuild from code repos

Key BIA metrics:
• RTO (Recovery Time Objective): Max acceptable downtime
• RPO (Recovery Point Objective): Max acceptable data loss
• MTPD (Maximum Tolerable Period of Disruption): Business survival threshold`,
            points: 100
        },

        'PBQ-D5-006': {
            id: 'PBQ-D5-006',
            title: 'Security Metrics & KPIs',
            domain: 5,
            type: 'matching',
            difficulty: 'medium',
            timeLimit: 480,
            scenario: `Match each security metric with its correct category and purpose for executive reporting.`,
            instructions: 'Connect each security metric with its appropriate category.',
            leftItems: [
                { id: 'm1', text: 'Mean Time to Detect (MTTD)' },
                { id: 'm2', text: 'Patch compliance percentage' },
                { id: 'm3', text: 'Phishing click rate' },
                { id: 'm4', text: 'Cost per incident' },
                { id: 'm5', text: 'Vulnerability scan coverage' },
                { id: 'm6', text: 'Security training completion rate' }
            ],
            rightItems: [
                { id: 'c1', text: 'Incident Response Effectiveness' },
                { id: 'c2', text: 'Vulnerability Management' },
                { id: 'c3', text: 'Security Awareness' },
                { id: 'c4', text: 'Financial/ROI Metrics' },
                { id: 'c5', text: 'Asset Coverage' },
                { id: 'c6', text: 'Human Risk Factor' }
            ],
            correctMatches: {
                'm1': 'c1',
                'm2': 'c2',
                'm3': 'c6',
                'm4': 'c4',
                'm5': 'c5',
                'm6': 'c3'
            },
            explanation: `Security metrics categories:
• MTTD → Incident Response: Measures detection capability speed
• Patch compliance → Vulnerability Management: Shows remediation progress
• Phishing click rate → Human Risk: Indicates susceptibility to social engineering
• Cost per incident → Financial: Demonstrates security ROI and budget justification
• Scan coverage → Asset Coverage: Shows visibility into environment
• Training completion → Security Awareness: Measures program participation

Effective security programs track metrics across all categories for balanced reporting.`,
            points: 100
        }
    };

    // ================================================
    // PBQ ENGINE CLASS
    // ================================================
    class PBQEngine {
        constructor() {
            this.currentPBQ = null;
            this.userAnswers = {};
            this.startTime = null;
            this.timerInterval = null;
            this.score = 0;
            this.draggedItem = null;
            this.matches = {};
            this.clickedHotspots = [];
        }

        // Get PBQ scenario data
        getScenario(pbqId) {
            return PBQ_SCENARIOS[pbqId] || null;
        }

        // Generate consistent PBQ header with notes button
        renderPBQHeader() {
            const pbq = this.currentPBQ;
            const notesBtn = window.NotesSystem 
                ? window.NotesSystem.renderNoteButton('pbq', pbq.id, pbq.title) 
                : '';
            
            return `
                <div class="pbq-header">
                    <button class="back-btn" onclick="window.PBQEngine.exit()">← Exit PBQ</button>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        ${notesBtn}
                        <div class="pbq-timer-container">
                            <span>⏱️ Time: </span>
                            <span id="pbq-timer" style="font-weight: bold; font-family: monospace; color: #10b981;">--:--</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Start a PBQ
        start(pbqId) {
            // Scroll to top when starting PBQ
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            const scenario = this.getScenario(pbqId);
            if (!scenario) {
                // Fall back to generic PBQ from ALL_PBQS
                const basicPBQ = window.ALL_PBQS?.find(p => p.id === pbqId);
                if (basicPBQ) {
                    this.showGenericPBQ(basicPBQ);
                    return;
                }
                console.error('PBQ not found:', pbqId);
                return;
            }

            this.currentPBQ = scenario;
            this.userAnswers = {};
            this.matches = {};
            this.clickedHotspots = [];
            this.startTime = Date.now();
            this.score = 0;

            // Start timer if time limit exists
            if (scenario.timeLimit) {
                this.startTimer(scenario.timeLimit);
            }

            // Render based on type
            switch (scenario.type) {
                case 'drag-drop':
                    this.renderDragDrop();
                    break;
                case 'configuration':
                    this.renderConfiguration();
                    break;
                case 'matching':
                    this.renderMatching();
                    break;
                case 'hotspot':
                    this.renderHotspot();
                    break;
                case 'analysis':
                    this.renderAnalysis();
                    break;
                case 'matrix':
                    this.renderMatrix();
                    break;
                default:
                    this.showGenericPBQ(scenario);
            }
        }

        // Timer functions
        startTimer(seconds) {
            this.stopTimer();
            let remaining = seconds;
            
            const updateDisplay = () => {
                const mins = Math.floor(remaining / 60);
                const secs = remaining % 60;
                const timerEl = document.getElementById('pbq-timer');
                if (timerEl) {
                    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                    if (remaining <= 60) {
                        timerEl.style.color = '#ef4444';
                    } else if (remaining <= 180) {
                        timerEl.style.color = '#f59e0b';
                    }
                }
            };

            updateDisplay();
            this.timerInterval = setInterval(() => {
                remaining--;
                updateDisplay();
                if (remaining <= 0) {
                    this.stopTimer();
                    this.submitPBQ(true);
                }
            }, 1000);
        }

        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        }

        // ================================================
        // DRAG-DROP RENDERER
        // ================================================
        renderDragDrop() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            // Check if this is a zones-based drag-drop or ordered list
            if (pbq.zones) {
                this.renderZonesDragDrop();
                return;
            }
            
            // Shuffle items for display
            const shuffledItems = [...pbq.items].sort(() => Math.random() - 0.5);
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">🎯 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="drag-drop-container">
                        <div class="drag-source-panel">
                            <h3>Available Items</h3>
                            <div id="source-items" class="drag-item-list">
                                ${shuffledItems.map(item => `
                                    <div class="drag-item" draggable="true" data-id="${item.id}">
                                        ${escapeHtml(item.text)}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="drag-target-panel">
                            <h3>Drop Zone (Order: Top = First)</h3>
                            <div id="target-zone" class="drop-zone">
                                <p class="drop-placeholder">Drag items here in the correct order</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn" onclick="window.PBQEngine.resetDragDrop()">Reset</button>
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Answer</button>
                    </div>
                </div>
            `;

            this.initDragDropListeners();
            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        renderZonesDragDrop() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            // Shuffle items for display
            const shuffledItems = [...pbq.items].sort(() => Math.random() - 0.5);
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">🎯 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="zones-drag-container">
                        <div class="zones-source-panel">
                            <h3>Items to Categorize</h3>
                            <div id="source-items" class="drag-item-list">
                                ${shuffledItems.map(item => `
                                    <div class="drag-item zone-item" draggable="true" data-id="${item.id}">
                                        ${escapeHtml(item.text)}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="zones-target-panel">
                            <h3>Drop Zones</h3>
                            <div class="zones-grid">
                                ${pbq.zones.map(zone => `
                                    <div class="zone-container">
                                        <div class="zone-header">
                                            <strong>${escapeHtml(zone.name)}</strong>
                                            <span class="zone-desc">${escapeHtml(zone.description)}</span>
                                        </div>
                                        <div class="zone-drop" id="zone-${zone.id}" data-zone="${zone.id}">
                                            <p class="zone-placeholder">Drop items here</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn" onclick="window.PBQEngine.resetZonesDragDrop()">Reset</button>
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Answer</button>
                    </div>
                </div>
            `;

            this.initZonesDragDropListeners();
            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        initZonesDragDropListeners() {
            const items = document.querySelectorAll('.zone-item');
            const zones = document.querySelectorAll('.zone-drop');
            const sourceItems = document.getElementById('source-items');
            
            this.zoneAssignments = {}; // Track item -> zone assignments

            items.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    this.draggedItem = e.target;
                    e.target.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    this.draggedItem = null;
                });
            });

            // Zone drop handlers
            zones.forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    zone.classList.add('zone-drag-over');
                });

                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('zone-drag-over');
                });

                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    zone.classList.remove('zone-drag-over');
                    
                    if (this.draggedItem) {
                        const placeholder = zone.querySelector('.zone-placeholder');
                        if (placeholder) placeholder.remove();
                        
                        zone.appendChild(this.draggedItem);
                        const itemId = this.draggedItem.dataset.id;
                        const zoneId = zone.dataset.zone;
                        this.zoneAssignments[itemId] = zoneId;
                    }
                });
            });

            // Allow dragging back to source
            sourceItems.addEventListener('dragover', (e) => {
                e.preventDefault();
                sourceItems.classList.add('drag-over');
            });

            sourceItems.addEventListener('dragleave', () => {
                sourceItems.classList.remove('drag-over');
            });

            sourceItems.addEventListener('drop', (e) => {
                e.preventDefault();
                sourceItems.classList.remove('drag-over');
                if (this.draggedItem) {
                    sourceItems.appendChild(this.draggedItem);
                    const itemId = this.draggedItem.dataset.id;
                    delete this.zoneAssignments[itemId];
                    
                    // Restore placeholder if zone is empty
                    const zones = document.querySelectorAll('.zone-drop');
                    zones.forEach(zone => {
                        if (zone.querySelectorAll('.zone-item').length === 0) {
                            if (!zone.querySelector('.zone-placeholder')) {
                                zone.innerHTML = '<p class="zone-placeholder">Drop items here</p>';
                            }
                        }
                    });
                }
            });
        }

        resetZonesDragDrop() {
            const sourceItems = document.getElementById('source-items');
            const allItems = document.querySelectorAll('.zone-item');
            
            allItems.forEach(item => sourceItems.appendChild(item));
            this.zoneAssignments = {};
            
            // Restore placeholders
            const zones = document.querySelectorAll('.zone-drop');
            zones.forEach(zone => {
                zone.innerHTML = '<p class="zone-placeholder">Drop items here</p>';
            });
        }

        initDragDropListeners() {
            const items = document.querySelectorAll('.drag-item');
            const targetZone = document.getElementById('target-zone');
            const sourceItems = document.getElementById('source-items');

            items.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    this.draggedItem = e.target;
                    e.target.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    this.draggedItem = null;
                });
            });

            // Target zone
            targetZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                targetZone.classList.add('drag-over');
            });

            targetZone.addEventListener('dragleave', () => {
                targetZone.classList.remove('drag-over');
            });

            targetZone.addEventListener('drop', (e) => {
                e.preventDefault();
                targetZone.classList.remove('drag-over');
                
                if (this.draggedItem) {
                    // Remove placeholder
                    const placeholder = targetZone.querySelector('.drop-placeholder');
                    if (placeholder) placeholder.remove();
                    
                    targetZone.appendChild(this.draggedItem);
                    this.updateDropOrder(targetZone);
                }
            });

            // Allow dragging back to source
            sourceItems.addEventListener('dragover', (e) => {
                e.preventDefault();
                sourceItems.classList.add('drag-over');
            });

            sourceItems.addEventListener('dragleave', () => {
                sourceItems.classList.remove('drag-over');
            });

            sourceItems.addEventListener('drop', (e) => {
                e.preventDefault();
                sourceItems.classList.remove('drag-over');
                if (this.draggedItem && this.draggedItem.parentElement !== sourceItems) {
                    sourceItems.appendChild(this.draggedItem);
                    this.updateDropOrder(document.getElementById('target-zone'));
                }
            });

            // Allow reordering within target zone
            targetZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingItem = document.querySelector('.dragging');
                if (!draggingItem) return;
                
                const siblings = [...targetZone.querySelectorAll('.drag-item:not(.dragging)')];
                const nextSibling = siblings.find(sibling => {
                    const rect = sibling.getBoundingClientRect();
                    return e.clientY < rect.top + rect.height / 2;
                });
                
                if (nextSibling) {
                    targetZone.insertBefore(draggingItem, nextSibling);
                }
            });
        }

        updateDropOrder(targetZone) {
            const items = targetZone.querySelectorAll('.drag-item');
            items.forEach((item, index) => {
                item.setAttribute('data-order', index + 1);
            });
        }

        resetDragDrop() {
            const sourceItems = document.getElementById('source-items');
            const targetZone = document.getElementById('target-zone');
            
            // Move all items back to source
            const items = targetZone.querySelectorAll('.drag-item');
            items.forEach(item => sourceItems.appendChild(item));
            
            // Restore placeholder
            if (!targetZone.querySelector('.drop-placeholder')) {
                targetZone.innerHTML = '<p class="drop-placeholder">Drag items here in the correct order</p>';
            }
        }

        // ================================================
        // CONFIGURATION RENDERER
        // ================================================
        renderConfiguration() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">⚙️ ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="config-panel">
                        <h3>Security Configuration Settings</h3>
                        <div class="config-form">
                            ${pbq.fields.map(field => this.renderConfigField(field)).join('')}
                        </div>
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn" onclick="window.PBQEngine.resetConfig()">Reset to Defaults</button>
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Configuration</button>
                    </div>
                </div>
            `;

            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        renderConfigField(field) {
            let input = '';
            
            switch (field.type) {
                case 'number':
                    input = `<input type="number" id="config-${field.id}" 
                                   min="${field.min}" max="${field.max}" 
                                   value="${field.min}" 
                                   class="config-input">`;
                    break;
                case 'checkbox':
                    input = `<input type="checkbox" id="config-${field.id}" class="config-checkbox">`;
                    break;
                case 'select':
                    input = `<select id="config-${field.id}" class="config-select">
                                ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                             </select>`;
                    break;
            }
            
            return `
                <div class="config-field">
                    <label for="config-${field.id}">${escapeHtml(field.label)}</label>
                    ${input}
                </div>
            `;
        }

        resetConfig() {
            const pbq = this.currentPBQ;
            pbq.fields.forEach(field => {
                const el = document.getElementById(`config-${field.id}`);
                if (el) {
                    if (field.type === 'checkbox') {
                        el.checked = false;
                    } else if (field.type === 'number') {
                        el.value = field.min;
                    } else {
                        el.selectedIndex = 0;
                    }
                }
            });
        }

        // ================================================
        // MATCHING RENDERER
        // ================================================
        renderMatching() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            // Shuffle right items
            const shuffledRight = [...pbq.rightItems].sort(() => Math.random() - 0.5);
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">🔗 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="matching-container">
                        <svg id="matching-lines" class="matching-svg"></svg>
                        
                        <div class="matching-left">
                            ${pbq.leftItems.map(item => `
                                <div class="match-item match-left" data-id="${item.id}" onclick="window.PBQEngine.selectMatchItem(this, 'left')">
                                    <span class="match-dot left-dot"></span>
                                    ${escapeHtml(item.text)}
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="matching-right">
                            ${shuffledRight.map(item => `
                                <div class="match-item match-right" data-id="${item.id}" onclick="window.PBQEngine.selectMatchItem(this, 'right')">
                                    ${escapeHtml(item.text)}
                                    <span class="match-dot right-dot"></span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn" onclick="window.PBQEngine.resetMatching()">Clear Matches</button>
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Matches</button>
                    </div>
                </div>
            `;

            this.matches = {};
            this.selectedLeft = null;
            this.selectedRight = null;
            
            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        selectMatchItem(element, side) {
            if (side === 'left') {
                // Deselect previous left
                document.querySelectorAll('.match-left.selected').forEach(el => el.classList.remove('selected'));
                element.classList.add('selected');
                this.selectedLeft = element.dataset.id;
            } else {
                // Deselect previous right
                document.querySelectorAll('.match-right.selected').forEach(el => el.classList.remove('selected'));
                element.classList.add('selected');
                this.selectedRight = element.dataset.id;
            }

            // If both selected, create match
            if (this.selectedLeft && this.selectedRight) {
                this.createMatch(this.selectedLeft, this.selectedRight);
                this.selectedLeft = null;
                this.selectedRight = null;
                document.querySelectorAll('.match-item.selected').forEach(el => el.classList.remove('selected'));
            }
        }

        createMatch(leftId, rightId) {
            // Remove existing match for this left item
            if (this.matches[leftId]) {
                const oldRightId = this.matches[leftId];
                const oldRightEl = document.querySelector(`.match-right[data-id="${oldRightId}"]`);
                if (oldRightEl) oldRightEl.classList.remove('matched');
            }

            // Create new match
            this.matches[leftId] = rightId;
            
            // Update UI
            const leftEl = document.querySelector(`.match-left[data-id="${leftId}"]`);
            const rightEl = document.querySelector(`.match-right[data-id="${rightId}"]`);
            if (leftEl) leftEl.classList.add('matched');
            if (rightEl) rightEl.classList.add('matched');

            this.drawMatchLines();
        }

        drawMatchLines() {
            const svg = document.getElementById('matching-lines');
            const container = document.querySelector('.matching-container');
            if (!svg || !container) return;

            const containerRect = container.getBoundingClientRect();
            svg.innerHTML = '';
            svg.setAttribute('width', containerRect.width);
            svg.setAttribute('height', containerRect.height);

            Object.entries(this.matches).forEach(([leftId, rightId]) => {
                const leftEl = document.querySelector(`.match-left[data-id="${leftId}"] .left-dot`);
                const rightEl = document.querySelector(`.match-right[data-id="${rightId}"] .right-dot`);
                
                if (leftEl && rightEl) {
                    const leftRect = leftEl.getBoundingClientRect();
                    const rightRect = rightEl.getBoundingClientRect();
                    
                    const x1 = leftRect.right - containerRect.left;
                    const y1 = leftRect.top + leftRect.height/2 - containerRect.top;
                    const x2 = rightRect.left - containerRect.left;
                    const y2 = rightRect.top + rightRect.height/2 - containerRect.top;
                    
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('stroke', '#6366f1');
                    line.setAttribute('stroke-width', '2');
                    svg.appendChild(line);
                }
            });
        }

        resetMatching() {
            this.matches = {};
            this.selectedLeft = null;
            this.selectedRight = null;
            document.querySelectorAll('.match-item').forEach(el => {
                el.classList.remove('selected', 'matched');
            });
            const svg = document.getElementById('matching-lines');
            if (svg) svg.innerHTML = '';
        }

        // ================================================
        // HOTSPOT RENDERER
        // ================================================
        renderHotspot() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">🎯 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="hotspot-container" id="hotspot-container">
                        ${this.renderHotspotImage(pbq)}
                    </div>
                    
                    <div class="hotspot-status">
                        <span>Vulnerabilities found: </span>
                        <span id="found-count">0</span> / ${pbq.requiredCorrect} required
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn" onclick="window.PBQEngine.resetHotspots()">Reset Selections</button>
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Findings</button>
                    </div>
                </div>
            `;

            this.clickedHotspots = [];
            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        renderHotspotImage(pbq) {
            if (pbq.image === 'datacenter') {
                return this.renderDatacenterSVG(pbq.hotspots);
            } else if (pbq.image === 'network') {
                return this.renderNetworkSVG(pbq.hotspots);
            } else if (pbq.image === 'wireless') {
                return this.renderWirelessSVG(pbq.hotspots);
            }
            return '<div class="hotspot-placeholder">Image not available</div>';
        }

        renderDatacenterSVG(hotspots) {
            return `
                <svg viewBox="0 0 100 100" class="hotspot-svg" id="hotspot-svg">
                    <!-- Background -->
                    <rect x="0" y="0" width="100" height="100" fill="#1e1e2e"/>
                    
                    <!-- Room outline -->
                    <rect x="5" y="5" width="90" height="90" fill="none" stroke="#3f3f46" stroke-width="0.5"/>
                    
                    <!-- Server racks -->
                    <rect x="10" y="15" width="20" height="30" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="20" y="32" text-anchor="middle" fill="#a1a1aa" font-size="3">Servers</text>
                    
                    <rect x="35" y="15" width="20" height="30" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="45" y="32" text-anchor="middle" fill="#a1a1aa" font-size="3">Servers</text>
                    
                    <!-- Network closet -->
                    <rect x="60" y="15" width="15" height="20" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="67" y="27" text-anchor="middle" fill="#a1a1aa" font-size="2.5">Network</text>
                    
                    <!-- Window (vulnerability) -->
                    <rect x="70" y="8" width="15" height="8" fill="#1e3a5f" stroke="#3b82f6" stroke-width="0.3"/>
                    <text x="77" y="13" text-anchor="middle" fill="#60a5fa" font-size="2">Window</text>
                    
                    <!-- Doors -->
                    <rect x="40" y="85" width="20" height="8" fill="#3f3f46" stroke="#52525b" stroke-width="0.3"/>
                    <text x="50" y="90" text-anchor="middle" fill="#a1a1aa" font-size="2.5">Entry Door</text>
                    
                    <!-- Fire door (propped) -->
                    <rect x="85" y="40" width="8" height="15" fill="#7f1d1d" stroke="#ef4444" stroke-width="0.3"/>
                    <text x="89" y="49" text-anchor="middle" fill="#fca5a5" font-size="2" transform="rotate(90, 89, 49)">Fire</text>
                    
                    <!-- Cameras -->
                    <circle cx="8" cy="8" r="2" fill="#10b981"/>
                    <circle cx="92" cy="8" r="2" fill="#10b981"/>
                    <circle cx="8" cy="92" r="2" fill="#10b981"/>
                    
                    <!-- Missing camera area indicator -->
                    <rect x="80" y="55" width="15" height="25" fill="none" stroke="#ef4444" stroke-dasharray="1" stroke-width="0.2" opacity="0.5"/>
                    
                    <!-- Cable runs -->
                    <line x1="30" y1="45" x2="55" y2="45" stroke="#f59e0b" stroke-width="0.5"/>
                    <line x1="55" y1="45" x2="55" y2="35" stroke="#f59e0b" stroke-width="0.5"/>
                    
                    <!-- Entry area -->
                    <rect x="2" y="45" width="12" height="20" fill="#18181b" stroke="#3f3f46" stroke-width="0.3"/>
                    <text x="8" y="56" text-anchor="middle" fill="#a1a1aa" font-size="2">Entry</text>
                    
                    <!-- Clickable hotspot overlays (invisible) -->
                    ${hotspots.map(hs => `
                        <rect x="${hs.x}" y="${hs.y}" width="${hs.width}" height="${hs.height}" 
                              fill="transparent" class="hotspot-area" data-id="${hs.id}"
                              onclick="window.PBQEngine.clickHotspot('${hs.id}')"
                              style="cursor: pointer;"/>
                    `).join('')}
                </svg>
            `;
        }

        renderNetworkSVG(hotspots) {
            return `
                <svg viewBox="0 0 100 80" class="hotspot-svg" id="hotspot-svg">
                    <!-- Background -->
                    <rect x="0" y="0" width="100" height="80" fill="#1e1e2e"/>
                    
                    <!-- Internet Cloud -->
                    <ellipse cx="50" cy="8" rx="20" ry="6" fill="#3b82f6" opacity="0.3"/>
                    <text x="50" y="10" text-anchor="middle" fill="#60a5fa" font-size="3">Internet</text>
                    
                    <!-- Firewall -->
                    <rect x="43" y="18" width="14" height="8" fill="#27272a" stroke="#10b981" stroke-width="0.5"/>
                    <text x="50" y="24" text-anchor="middle" fill="#10b981" font-size="2.5">Firewall</text>
                    
                    <!-- Web Server -->
                    <rect x="8" y="8" width="18" height="12" fill="#27272a" stroke="#ef4444" stroke-width="0.5"/>
                    <text x="17" y="15" text-anchor="middle" fill="#fca5a5" font-size="2.5">Web Server</text>
                    <text x="17" y="18" text-anchor="middle" fill="#71717a" font-size="1.5">(unpatched)</text>
                    
                    <!-- WiFi -->
                    <circle cx="60" cy="8" r="5" fill="none" stroke="#f59e0b" stroke-width="0.3"/>
                    <text x="60" y="9" text-anchor="middle" fill="#fbbf24" font-size="2">WiFi</text>
                    <text x="60" y="12" text-anchor="middle" fill="#71717a" font-size="1.2">Open</text>
                    
                    <!-- Router -->
                    <rect x="43" y="32" width="14" height="6" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="50" y="36" text-anchor="middle" fill="#a1a1aa" font-size="2">Router</text>
                    
                    <!-- Internal Switch -->
                    <rect x="43" y="44" width="14" height="6" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="50" y="48" text-anchor="middle" fill="#a1a1aa" font-size="2">Switch</text>
                    
                    <!-- Legacy System -->
                    <rect x="75" y="28" width="18" height="12" fill="#27272a" stroke="#f59e0b" stroke-width="0.5"/>
                    <text x="84" y="34" text-anchor="middle" fill="#fbbf24" font-size="2.5">Legacy</text>
                    <text x="84" y="38" text-anchor="middle" fill="#71717a" font-size="1.5">Win XP</text>
                    
                    <!-- Email Gateway -->
                    <rect x="28" y="48" width="14" height="10" fill="#27272a" stroke="#8b5cf6" stroke-width="0.5"/>
                    <text x="35" y="54" text-anchor="middle" fill="#a78bfa" font-size="2">Email</text>
                    <text x="35" y="57" text-anchor="middle" fill="#a78bfa" font-size="2">Gateway</text>
                    
                    <!-- Workstations -->
                    <rect x="15" y="60" width="18" height="10" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="24" y="67" text-anchor="middle" fill="#a1a1aa" font-size="2.5">Workstations</text>
                    
                    <!-- VPN -->
                    <rect x="58" y="68" width="14" height="8" fill="#27272a" stroke="#6366f1" stroke-width="0.5"/>
                    <text x="65" y="73" text-anchor="middle" fill="#818cf8" font-size="2.5">VPN</text>
                    
                    <!-- Database -->
                    <rect x="75" y="55" width="18" height="12" fill="#27272a" stroke="#52525b" stroke-width="0.3"/>
                    <text x="84" y="63" text-anchor="middle" fill="#a1a1aa" font-size="2.5">Database</text>
                    
                    <!-- Connection lines -->
                    <line x1="50" y1="14" x2="50" y2="18" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="50" y1="26" x2="50" y2="32" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="50" y1="38" x2="50" y2="44" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="50" y1="50" x2="50" y2="55" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="26" y1="14" x2="43" y2="22" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="57" y1="22" x2="75" y2="34" stroke="#52525b" stroke-width="0.3"/>
                    
                    <!-- Hotspot overlays -->
                    ${hotspots.map(hs => `
                        <rect x="${hs.x}" y="${hs.y}" width="${hs.width}" height="${hs.height}" 
                              fill="transparent" class="hotspot-area" data-id="${hs.id}"
                              onclick="window.PBQEngine.clickHotspot('${hs.id}')"
                              style="cursor: pointer;"/>
                    `).join('')}
                </svg>
            `;
        }

        renderWirelessSVG(hotspots) {
            return `
                <svg viewBox="0 0 100 80" class="hotspot-svg" id="hotspot-svg">
                    <!-- Background -->
                    <rect x="0" y="0" width="100" height="80" fill="#1e1e2e"/>
                    
                    <!-- Title -->
                    <text x="50" y="6" text-anchor="middle" fill="#a1a1aa" font-size="3">Wireless Network Configuration</text>
                    
                    <!-- Corporate Router -->
                    <rect x="40" y="35" width="20" height="10" fill="#27272a" stroke="#10b981" stroke-width="0.5"/>
                    <text x="50" y="41" text-anchor="middle" fill="#10b981" font-size="2.5">Core Router</text>
                    
                    <!-- Access Point 1 - WEP (vulnerable) -->
                    <circle cx="20" cy="18" r="8" fill="#27272a" stroke="#ef4444" stroke-width="0.5"/>
                    <text x="20" y="17" text-anchor="middle" fill="#fca5a5" font-size="2">AP-1</text>
                    <text x="20" y="21" text-anchor="middle" fill="#ef4444" font-size="1.5">WEP</text>
                    
                    <!-- Wireless waves from AP1 -->
                    <path d="M 28 18 Q 32 15, 32 18 Q 32 21, 28 18" fill="none" stroke="#ef4444" stroke-width="0.3" opacity="0.5"/>
                    
                    <!-- Access Point 2 - Default SSID (vulnerable) -->
                    <circle cx="55" cy="15" r="8" fill="#27272a" stroke="#f59e0b" stroke-width="0.5"/>
                    <text x="55" y="14" text-anchor="middle" fill="#fbbf24" font-size="2">AP-2</text>
                    <text x="55" y="18" text-anchor="middle" fill="#f59e0b" font-size="1.3">NETGEAR</text>
                    
                    <!-- Access Point 3 - Hidden SSID (vulnerable) -->
                    <circle cx="85" cy="22" r="8" fill="#27272a" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="1"/>
                    <text x="85" y="21" text-anchor="middle" fill="#a1a1aa" font-size="2">AP-3</text>
                    <text x="85" y="25" text-anchor="middle" fill="#71717a" font-size="1.3">[Hidden]</text>
                    
                    <!-- Guest Network - Same VLAN (vulnerable) -->
                    <rect x="10" y="50" width="25" height="12" fill="#27272a" stroke="#f59e0b" stroke-width="0.5"/>
                    <text x="22" y="56" text-anchor="middle" fill="#fbbf24" font-size="2">Guest WiFi</text>
                    <text x="22" y="60" text-anchor="middle" fill="#71717a" font-size="1.3">VLAN 10</text>
                    
                    <!-- Corporate Network -->
                    <rect x="38" y="50" width="25" height="12" fill="#27272a" stroke="#10b981" stroke-width="0.5"/>
                    <text x="50" y="56" text-anchor="middle" fill="#10b981" font-size="2">Corporate</text>
                    <text x="50" y="60" text-anchor="middle" fill="#71717a" font-size="1.3">VLAN 10</text>
                    
                    <!-- Auth Server - No 802.1X (vulnerable) -->
                    <rect x="52" y="55" width="20" height="15" fill="#27272a" stroke="#f59e0b" stroke-width="0.5"/>
                    <text x="62" y="62" text-anchor="middle" fill="#fbbf24" font-size="2">Auth</text>
                    <text x="62" y="66" text-anchor="middle" fill="#71717a" font-size="1.3">PSK Only</text>
                    
                    <!-- Rogue AP (vulnerable) -->
                    <circle cx="88" cy="65" r="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="0.5"/>
                    <text x="88" y="64" text-anchor="middle" fill="#ef4444" font-size="1.8">Rogue</text>
                    <text x="88" y="68" text-anchor="middle" fill="#fca5a5" font-size="1.3">AP</text>
                    
                    <!-- Connection lines -->
                    <line x1="20" y1="26" x2="40" y2="38" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="55" y1="23" x2="50" y2="35" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="85" y1="30" x2="60" y2="38" stroke="#52525b" stroke-width="0.3" stroke-dasharray="1"/>
                    <line x1="22" y1="50" x2="40" y2="42" stroke="#52525b" stroke-width="0.3"/>
                    <line x1="50" y1="45" x2="50" y2="50" stroke="#52525b" stroke-width="0.3"/>
                    
                    <!-- Legend -->
                    <rect x="2" y="72" width="4" height="3" fill="#10b981"/>
                    <text x="8" y="75" fill="#a1a1aa" font-size="2">Secure</text>
                    <rect x="25" y="72" width="4" height="3" fill="#f59e0b"/>
                    <text x="31" y="75" fill="#a1a1aa" font-size="2">Warning</text>
                    <rect x="50" y="72" width="4" height="3" fill="#ef4444"/>
                    <text x="56" y="75" fill="#a1a1aa" font-size="2">Critical</text>
                    
                    <!-- Hotspot overlays -->
                    ${hotspots.map(hs => `
                        <rect x="${hs.x}" y="${hs.y}" width="${hs.width}" height="${hs.height}" 
                              fill="transparent" class="hotspot-area" data-id="${hs.id}"
                              onclick="window.PBQEngine.clickHotspot('${hs.id}')"
                              style="cursor: pointer;"/>
                    `).join('')}
                </svg>
            `;
        }

        clickHotspot(hotspotId) {
            const pbq = this.currentPBQ;
            const hotspot = pbq.hotspots.find(h => h.id === hotspotId);
            if (!hotspot) return;

            const isAlreadyClicked = this.clickedHotspots.includes(hotspotId);
            
            if (isAlreadyClicked) {
                // Deselect
                this.clickedHotspots = this.clickedHotspots.filter(id => id !== hotspotId);
            } else {
                // Select
                this.clickedHotspots.push(hotspotId);
            }

            // Update visual
            const svg = document.getElementById('hotspot-svg');
            const overlay = svg.querySelector(`[data-id="${hotspotId}"]`);
            if (overlay) {
                overlay.setAttribute('fill', isAlreadyClicked ? 'transparent' : 'rgba(239, 68, 68, 0.3)');
                overlay.setAttribute('stroke', isAlreadyClicked ? 'none' : '#ef4444');
                overlay.setAttribute('stroke-width', isAlreadyClicked ? '0' : '0.5');
            }

            // Update count
            document.getElementById('found-count').textContent = this.clickedHotspots.length;
        }

        resetHotspots() {
            this.clickedHotspots = [];
            document.querySelectorAll('.hotspot-area').forEach(el => {
                el.setAttribute('fill', 'transparent');
                el.setAttribute('stroke', 'none');
            });
            document.getElementById('found-count').textContent = '0';
        }

        // ================================================
        // ANALYSIS RENDERER
        // ================================================
        renderAnalysis() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            if (pbq.emailContent) {
                this.renderEmailAnalysis(pbq);
            } else if (pbq.logs) {
                this.renderLogAnalysis(pbq);
            }
        }

        renderEmailAnalysis(pbq) {
            const content = document.getElementById('content');
            const email = pbq.emailContent;
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">🔍 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="email-analysis-container">
                        <div class="email-display">
                            <div class="email-header-row" data-indicator="from" onclick="window.PBQEngine.toggleIndicator('ind1')">
                                <strong>From:</strong> <span class="email-from">${escapeHtml(email.from)}</span>
                            </div>
                            <div class="email-header-row">
                                <strong>To:</strong> ${escapeHtml(email.to)}
                            </div>
                            <div class="email-header-row" data-indicator="subject" onclick="window.PBQEngine.toggleIndicator('ind2')">
                                <strong>Subject:</strong> <span class="email-subject">${escapeHtml(email.subject)}</span>
                            </div>
                            <div class="email-header-row" data-indicator="time" onclick="window.PBQEngine.toggleIndicator('ind3')">
                                <strong>Date:</strong> <span class="email-date">${escapeHtml(email.date)}</span>
                            </div>
                            <div class="email-body">
                                ${email.body.split('\n').map(line => {
                                    if (line.includes('http://')) {
                                        return `<p data-indicator="link" onclick="window.PBQEngine.toggleIndicator('ind4')" class="clickable-line">${escapeHtml(line)}</p>`;
                                    } else if (line.toLowerCase().includes('credit card')) {
                                        return `<p data-indicator="request" onclick="window.PBQEngine.toggleIndicator('ind5')" class="clickable-line">${escapeHtml(line)}</p>`;
                                    } else if (line.includes('Dear Valued Customer')) {
                                        return `<p data-indicator="greeting" onclick="window.PBQEngine.toggleIndicator('ind6')" class="clickable-line">${escapeHtml(line)}</p>`;
                                    }
                                    return `<p>${escapeHtml(line)}</p>`;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div class="indicators-panel">
                            <h4>Identified Phishing Indicators:</h4>
                            <div id="selected-indicators">
                                <p class="no-indicators">Click on suspicious elements in the email</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="hotspot-status">
                        <span>Indicators found: </span>
                        <span id="found-count">0</span> / ${pbq.requiredCorrect} required
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn" onclick="window.PBQEngine.resetAnalysis()">Clear Selections</button>
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Analysis</button>
                    </div>
                </div>
            `;

            this.clickedHotspots = [];
            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        toggleIndicator(indicatorId) {
            const pbq = this.currentPBQ;
            const indicator = pbq.emailContent.indicators.find(i => i.id === indicatorId);
            if (!indicator) return;

            const isSelected = this.clickedHotspots.includes(indicatorId);
            
            if (isSelected) {
                this.clickedHotspots = this.clickedHotspots.filter(id => id !== indicatorId);
            } else {
                this.clickedHotspots.push(indicatorId);
            }

            this.updateIndicatorsDisplay();
        }

        updateIndicatorsDisplay() {
            const pbq = this.currentPBQ;
            const container = document.getElementById('selected-indicators');
            
            if (this.clickedHotspots.length === 0) {
                container.innerHTML = '<p class="no-indicators">Click on suspicious elements in the email</p>';
            } else {
                container.innerHTML = this.clickedHotspots.map(id => {
                    const indicator = pbq.emailContent.indicators.find(i => i.id === id);
                    return `<div class="indicator-tag">${escapeHtml(indicator.text)} <span onclick="window.PBQEngine.toggleIndicator('${id}')" style="cursor: pointer;">×</span></div>`;
                }).join('');
            }

            // Highlight selected elements
            document.querySelectorAll('.email-header-row, .clickable-line').forEach(el => {
                el.classList.remove('indicator-selected');
            });
            
            this.clickedHotspots.forEach(id => {
                const indicator = pbq.emailContent.indicators.find(i => i.id === id);
                if (indicator) {
                    const el = document.querySelector(`[data-indicator="${indicator.element}"]`);
                    if (el) el.classList.add('indicator-selected');
                }
            });

            document.getElementById('found-count').textContent = this.clickedHotspots.length;
        }

        resetAnalysis() {
            this.clickedHotspots = [];
            this.updateIndicatorsDisplay();
        }

        renderLogAnalysis(pbq) {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">📊 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="log-viewer">
                        <div class="log-header">
                            <span>Time</span>
                            <span>Source</span>
                            <span>Event</span>
                            <span>User</span>
                            <span>Details</span>
                        </div>
                        ${pbq.logs.map(log => `
                            <div class="log-entry ${log.event.includes('Failed') ? 'log-warning' : log.event.includes('Successful') ? 'log-success' : log.event.includes('escalation') || log.event.includes('scheduled') ? 'log-danger' : ''}">
                                <span>${log.time}</span>
                                <span>${log.source}</span>
                                <span>${log.event}</span>
                                <span>${log.user}</span>
                                <span>${log.details}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="analysis-questions">
                        ${pbq.questions.map((q, idx) => `
                            <div class="analysis-question">
                                <p><strong>Question ${idx + 1}:</strong> ${escapeHtml(q.question)}</p>
                                <div class="question-options">
                                    ${q.options.map((opt, optIdx) => `
                                        <label class="option-label">
                                            <input type="radio" name="q${idx}" value="${optIdx}" onchange="window.PBQEngine.selectAnalysisAnswer(${idx}, ${optIdx})">
                                            ${escapeHtml(opt)}
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Analysis</button>
                    </div>
                </div>
            `;

            this.userAnswers = {};
            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        selectAnalysisAnswer(questionIdx, optionIdx) {
            this.userAnswers[questionIdx] = optionIdx;
        }

        // ================================================
        // MATRIX RENDERER
        // ================================================
        renderMatrix() {
            const pbq = this.currentPBQ;
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <div class="container">
                    ${this.renderPBQHeader()}
                    
                    <h1 class="page-title">📋 ${escapeHtml(pbq.title)}</h1>
                    <div class="pbq-scenario">${escapeHtml(pbq.scenario)}</div>
                    <p class="pbq-instructions"><strong>Instructions:</strong> ${escapeHtml(pbq.instructions)}</p>
                    
                    <div class="risk-matrix-container">
                        ${pbq.risks.map((risk, idx) => `
                            <div class="risk-row">
                                <div class="risk-info">
                                    <strong>${escapeHtml(risk.name)}</strong>
                                    <p>${escapeHtml(risk.description)}</p>
                                </div>
                                <div class="risk-controls">
                                    <div class="risk-field">
                                        <label>Likelihood:</label>
                                        <select id="likelihood-${idx}" onchange="window.PBQEngine.updateRiskScore(${idx})">
                                            <option value="">Select...</option>
                                            ${pbq.likelihoodScale.map((l, i) => `<option value="${i+1}">${l}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="risk-field">
                                        <label>Impact:</label>
                                        <select id="impact-${idx}" onchange="window.PBQEngine.updateRiskScore(${idx})">
                                            <option value="">Select...</option>
                                            ${pbq.impactScale.map((i, idx) => `<option value="${idx+1}">${i}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="risk-field">
                                        <label>Score:</label>
                                        <span id="score-${idx}" class="risk-score">--</span>
                                    </div>
                                    <div class="risk-field">
                                        <label>Treatment:</label>
                                        <select id="treatment-${idx}">
                                            <option value="">Select...</option>
                                            ${pbq.treatments.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="pbq-actions">
                        <button class="btn btn-primary" onclick="window.PBQEngine.submitPBQ()">Submit Assessment</button>
                    </div>
                </div>
            `;

            if (pbq.timeLimit) this.startTimer(pbq.timeLimit);
        }

        updateRiskScore(riskIdx) {
            const likelihood = parseInt(document.getElementById(`likelihood-${riskIdx}`).value) || 0;
            const impact = parseInt(document.getElementById(`impact-${riskIdx}`).value) || 0;
            const score = likelihood * impact;
            
            const scoreEl = document.getElementById(`score-${riskIdx}`);
            scoreEl.textContent = score || '--';
            
            // Color code
            if (score >= 15) {
                scoreEl.style.color = '#ef4444';
            } else if (score >= 8) {
                scoreEl.style.color = '#f59e0b';
            } else if (score > 0) {
                scoreEl.style.color = '#10b981';
            }
        }

        // ================================================
        // SUBMISSION & SCORING
        // ================================================
        submitPBQ(timedOut = false) {
            this.stopTimer();
            const pbq = this.currentPBQ;
            let score = 0;
            let feedback = [];
            let totalPossible = pbq.points || 100;

            switch (pbq.type) {
                case 'drag-drop':
                    const result = this.scoreDragDrop();
                    score = result.score;
                    feedback = result.feedback;
                    break;
                case 'configuration':
                    const configResult = this.scoreConfiguration();
                    score = configResult.score;
                    feedback = configResult.feedback;
                    break;
                case 'matching':
                    const matchResult = this.scoreMatching();
                    score = matchResult.score;
                    feedback = matchResult.feedback;
                    break;
                case 'hotspot':
                    const hsResult = this.scoreHotspot();
                    score = hsResult.score;
                    feedback = hsResult.feedback;
                    break;
                case 'analysis':
                    const analysisResult = this.scoreAnalysis();
                    score = analysisResult.score;
                    feedback = analysisResult.feedback;
                    break;
                case 'matrix':
                    const matrixResult = this.scoreMatrix();
                    score = matrixResult.score;
                    feedback = matrixResult.feedback;
                    break;
            }

            this.showResults(score, totalPossible, feedback, timedOut);
        }

        scoreDragDrop() {
            const pbq = this.currentPBQ;
            
            // Check if zones-based or ordered
            if (pbq.zones) {
                return this.scoreZonesDragDrop();
            }
            
            const targetZone = document.getElementById('target-zone');
            const placedItems = targetZone.querySelectorAll('.drag-item');
            
            let correct = 0;
            let feedback = [];

            // Check if placed items match solution in order
            if (placedItems.length === pbq.solution.length) {
                placedItems.forEach((item, idx) => {
                    if (item.dataset.id === pbq.solution[idx]) {
                        correct++;
                        feedback.push({ correct: true, text: `Position ${idx + 1}: Correct` });
                    } else {
                        feedback.push({ correct: false, text: `Position ${idx + 1}: Should be "${pbq.items.find(i => i.id === pbq.solution[idx])?.text}"` });
                    }
                });
            } else {
                feedback.push({ correct: false, text: `Expected ${pbq.solution.length} items, but ${placedItems.length} were placed` });
            }

            const score = Math.round((correct / pbq.solution.length) * pbq.points);
            return { score, feedback };
        }

        scoreZonesDragDrop() {
            const pbq = this.currentPBQ;
            let correct = 0;
            let feedback = [];
            
            pbq.items.forEach(item => {
                const assignedZone = this.zoneAssignments[item.id];
                const correctZone = item.correctZone;
                
                if (assignedZone === correctZone) {
                    correct++;
                    const zoneName = pbq.zones.find(z => z.id === correctZone)?.name || correctZone;
                    feedback.push({ correct: true, text: `${item.text}: Correctly placed in ${zoneName}` });
                } else if (assignedZone) {
                    const zoneName = pbq.zones.find(z => z.id === correctZone)?.name || correctZone;
                    feedback.push({ correct: false, text: `${item.text}: Should be in "${zoneName}"` });
                } else {
                    feedback.push({ correct: false, text: `${item.text}: Not placed in any zone` });
                }
            });

            const score = Math.round((correct / pbq.items.length) * pbq.points);
            return { score, feedback };
        }

        scoreConfiguration() {
            const pbq = this.currentPBQ;
            let correct = 0;
            let feedback = [];

            pbq.fields.forEach(field => {
                const el = document.getElementById(`config-${field.id}`);
                let value;
                
                if (field.type === 'checkbox') {
                    value = el.checked;
                } else if (field.type === 'number') {
                    value = parseInt(el.value);
                } else {
                    value = el.value;
                }

                if (value === field.correct) {
                    correct++;
                    feedback.push({ correct: true, text: `${field.label}: Correct` });
                } else {
                    feedback.push({ correct: false, text: `${field.label}: Should be "${field.correct}"` });
                }
            });

            const score = Math.round((correct / pbq.fields.length) * pbq.points);
            return { score, feedback };
        }

        scoreMatching() {
            const pbq = this.currentPBQ;
            let correct = 0;
            let feedback = [];

            Object.entries(pbq.correctMatches).forEach(([leftId, rightId]) => {
                if (this.matches[leftId] === rightId) {
                    correct++;
                    const leftItem = pbq.leftItems.find(i => i.id === leftId);
                    feedback.push({ correct: true, text: `${leftItem.text}: Correctly matched` });
                } else {
                    const leftItem = pbq.leftItems.find(i => i.id === leftId);
                    const correctRight = pbq.rightItems.find(i => i.id === rightId);
                    feedback.push({ correct: false, text: `${leftItem.text}: Should match "${correctRight.text}"` });
                }
            });

            const score = Math.round((correct / Object.keys(pbq.correctMatches).length) * pbq.points);
            return { score, feedback };
        }

        scoreHotspot() {
            const pbq = this.currentPBQ;
            let correct = 0;
            let feedback = [];

            pbq.hotspots.forEach(hs => {
                if (this.clickedHotspots.includes(hs.id)) {
                    correct++;
                    feedback.push({ correct: true, text: `Found: ${hs.label}` });
                } else {
                    feedback.push({ correct: false, text: `Missed: ${hs.label} - ${hs.explanation}` });
                }
            });

            // Check for false positives (clicked items that aren't hotspots)
            const falsePositives = this.clickedHotspots.filter(id => !pbq.hotspots.find(h => h.id === id));
            falsePositives.forEach(() => {
                feedback.push({ correct: false, text: 'False positive: Clicked on non-vulnerable area' });
            });

            const score = Math.round((correct / pbq.hotspots.length) * pbq.points);
            return { score, feedback };
        }

        scoreAnalysis() {
            const pbq = this.currentPBQ;
            let feedback = [];
            let score = 0;

            if (pbq.emailContent) {
                // Email analysis
                const totalIndicators = pbq.emailContent.indicators.length;
                let correct = 0;

                pbq.emailContent.indicators.forEach(ind => {
                    if (this.clickedHotspots.includes(ind.id)) {
                        correct++;
                        feedback.push({ correct: true, text: `Identified: ${ind.text}` });
                    } else {
                        feedback.push({ correct: false, text: `Missed: ${ind.text} - ${ind.explanation}` });
                    }
                });

                score = Math.round((correct / totalIndicators) * pbq.points);
            } else if (pbq.questions) {
                // Log analysis
                let correct = 0;
                pbq.questions.forEach((q, idx) => {
                    if (this.userAnswers[idx] === q.correct) {
                        correct++;
                        feedback.push({ correct: true, text: `Q${idx + 1}: Correct - ${q.explanation}` });
                    } else {
                        feedback.push({ correct: false, text: `Q${idx + 1}: Incorrect - ${q.explanation}` });
                    }
                });

                score = Math.round((correct / pbq.questions.length) * pbq.points);
            }

            return { score, feedback };
        }

        scoreMatrix() {
            const pbq = this.currentPBQ;
            let correct = 0;
            let feedback = [];
            let totalChecks = pbq.risks.length * 3; // likelihood, impact, treatment for each

            pbq.risks.forEach((risk, idx) => {
                const likelihood = parseInt(document.getElementById(`likelihood-${idx}`).value);
                const impact = parseInt(document.getElementById(`impact-${idx}`).value);
                const treatment = document.getElementById(`treatment-${idx}`).value;

                if (likelihood === risk.correctLikelihood) {
                    correct++;
                } else {
                    feedback.push({ correct: false, text: `${risk.name}: Likelihood should be ${risk.correctLikelihood}` });
                }

                if (impact === risk.correctImpact) {
                    correct++;
                } else {
                    feedback.push({ correct: false, text: `${risk.name}: Impact should be ${risk.correctImpact}` });
                }

                if (treatment === risk.correctTreatment) {
                    correct++;
                    feedback.push({ correct: true, text: `${risk.name}: Treatment correctly identified as "${risk.correctTreatment}"` });
                } else {
                    feedback.push({ correct: false, text: `${risk.name}: Treatment should be "${risk.correctTreatment}"` });
                }
            });

            const score = Math.round((correct / totalChecks) * pbq.points);
            return { score, feedback };
        }

        showResults(score, totalPossible, feedback, timedOut) {
            const pbq = this.currentPBQ;
            const percentage = Math.round((score / totalPossible) * 100);
            const passed = percentage >= 70;

            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="container">
                    <div class="pbq-results">
                        <h1>${timedOut ? '⏰ Time\'s Up!' : passed ? '🎉 PBQ Complete!' : '📚 Review Needed'}</h1>
                        
                        <div class="score-display ${passed ? 'passed' : 'failed'}">
                            <div class="score-value">${score}/${totalPossible}</div>
                            <div class="score-percentage">${percentage}%</div>
                        </div>
                        
                        <p class="result-message">
                            ${passed ? 'Great job! You demonstrated competency in this area.' : 'You need 70% to pass. Review the feedback and try again.'}
                        </p>
                        
                        <div class="feedback-section">
                            <h3>Detailed Feedback</h3>
                            ${feedback.map(f => `
                                <div class="feedback-item ${f.correct ? 'correct' : 'incorrect'}">
                                    ${f.correct ? '✅' : '❌'} ${escapeHtml(f.text)}
                                </div>
                            `).join('')}
                        </div>
                        
                        ${pbq.explanation ? `
                            <div class="explanation-section">
                                <h3>Explanation</h3>
                                <p>${escapeHtml(pbq.explanation)}</p>
                            </div>
                        ` : ''}
                        
                        <div class="pbq-actions">
                            <button class="btn" onclick="window.PBQEngine.start('${pbq.id}')">Try Again</button>
                            <button class="btn btn-primary" onclick="showAllPBQs()">All PBQs</button>
                            <button class="btn" onclick="showDashboard()">Dashboard</button>
                        </div>
                    </div>
                </div>
            `;

            // Save to progress
            if (passed && !APP.progress.completedPBQs.includes(pbq.id)) {
                APP.progress.completedPBQs.push(pbq.id);
                saveProgress();
            }
        }

        showGenericPBQ(pbq) {
            const content = document.getElementById('content');
            content.innerHTML = `
                <div class="container">
                    <button class="back-btn" onclick="showAllPBQs()">← Back to PBQs</button>
                    
                    <div class="pbq-placeholder">
                        <h1>🎯 ${escapeHtml(pbq.title)}</h1>
                        <p class="pbq-type-badge">${escapeHtml(pbq.type)} • Domain ${pbq.domain}</p>
                        
                        <div class="coming-soon-message">
                            <p>This PBQ type (${escapeHtml(pbq.type)}) is coming soon!</p>
                            <p>Check out the other interactive PBQs available.</p>
                        </div>
                        
                        <button class="btn btn-primary" onclick="showAllPBQs()">View Available PBQs</button>
                    </div>
                </div>
            `;
        }

        exit() {
            this.stopTimer();
            if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                showAllPBQs();
            }
        }
    }

    // ================================================
    // INJECT PBQ STYLES
    // ================================================
    const pbqStyles = document.createElement('style');
    pbqStyles.textContent = `
        .pbq-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .pbq-timer-container {
            background: #18181b;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 1.1rem;
        }
        
        .pbq-scenario {
            background: #18181b;
            border-left: 4px solid #6366f1;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
            line-height: 1.8;
            white-space: pre-line;
        }
        
        .pbq-instructions {
            color: #a1a1aa;
            margin-bottom: 30px;
        }
        
        /* Drag Drop Styles */
        .drag-drop-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }
        
        .drag-source-panel, .drag-target-panel {
            background: #18181b;
            border-radius: 12px;
            padding: 20px;
        }
        
        .drag-source-panel h3, .drag-target-panel h3 {
            margin-bottom: 15px;
            color: #a1a1aa;
        }
        
        .drag-item-list, .drop-zone {
            min-height: 200px;
        }
        
        .drag-item {
            background: #27272a;
            border: 1px solid #3f3f46;
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 6px;
            cursor: grab;
            transition: all 0.2s;
        }
        
        .drag-item:hover {
            border-color: #6366f1;
            background: #2d2d35;
        }
        
        .drag-item.dragging {
            opacity: 0.5;
            cursor: grabbing;
        }
        
        .drop-zone {
            border: 2px dashed #3f3f46;
            border-radius: 8px;
            padding: 15px;
            min-height: 250px;
        }
        
        .drop-zone.drag-over {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
        }
        
        .drop-placeholder {
            color: #71717a;
            text-align: center;
            padding: 40px;
        }
        
        /* Zones Drag Drop Styles */
        .zones-drag-container {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
            margin: 30px 0;
        }
        
        .zones-source-panel {
            background: #18181b;
            border-radius: 12px;
            padding: 20px;
        }
        
        .zones-source-panel h3 {
            margin-bottom: 15px;
            color: #a1a1aa;
        }
        
        .zones-target-panel h3 {
            margin-bottom: 15px;
            color: #a1a1aa;
        }
        
        .zones-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .zone-container {
            background: #18181b;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .zone-header {
            background: #27272a;
            padding: 12px 15px;
            border-bottom: 1px solid #3f3f46;
        }
        
        .zone-header strong {
            display: block;
            color: #6366f1;
            margin-bottom: 4px;
        }
        
        .zone-desc {
            font-size: 0.85rem;
            color: #71717a;
        }
        
        .zone-drop {
            min-height: 120px;
            padding: 10px;
            border: 2px dashed transparent;
            transition: all 0.2s;
        }
        
        .zone-drop.zone-drag-over {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.1);
        }
        
        .zone-placeholder {
            color: #52525b;
            text-align: center;
            padding: 30px 10px;
            font-size: 0.9rem;
        }
        
        .zone-item {
            font-size: 0.9rem;
            padding: 10px 12px;
        }
        
        @media (max-width: 900px) {
            .zones-drag-container {
                grid-template-columns: 1fr;
            }
            
            .zones-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* Configuration Styles */
        .config-panel {
            background: #18181b;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .config-form {
            display: grid;
            gap: 20px;
            margin-top: 20px;
        }
        
        .config-field {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #27272a;
            border-radius: 8px;
        }
        
        .config-field label {
            font-weight: 500;
        }
        
        .config-input, .config-select {
            background: #18181b;
            color: #fafafa;
            border: 1px solid #3f3f46;
            padding: 8px 12px;
            border-radius: 6px;
            min-width: 150px;
        }
        
        .config-checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        /* Matching Styles */
        .matching-container {
            position: relative;
            display: flex;
            justify-content: space-between;
            gap: 100px;
            margin: 30px 0;
            padding: 20px;
            background: #18181b;
            border-radius: 12px;
        }
        
        .matching-svg {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        }
        
        .matching-left, .matching-right {
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 2;
        }
        
        .match-item {
            background: #27272a;
            border: 2px solid #3f3f46;
            padding: 15px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .match-item:hover {
            border-color: #6366f1;
        }
        
        .match-item.selected {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.2);
        }
        
        .match-item.matched {
            border-color: #10b981;
        }
        
        .match-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #3f3f46;
        }
        
        .match-item.matched .match-dot {
            background: #10b981;
        }
        
        /* Hotspot Styles */
        .hotspot-container {
            background: #18181b;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .hotspot-svg {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            display: block;
        }
        
        .hotspot-area:hover {
            fill: rgba(99, 102, 241, 0.2) !important;
        }
        
        .hotspot-status {
            text-align: center;
            font-size: 1.1rem;
            color: #a1a1aa;
            margin: 20px 0;
        }
        
        #found-count {
            color: #10b981;
            font-weight: bold;
        }
        
        /* Email Analysis Styles */
        .email-analysis-container {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        
        .email-display {
            background: #fff;
            color: #1a1a1a;
            border-radius: 8px;
            padding: 20px;
        }
        
        .email-header-row {
            padding: 8px 0;
            border-bottom: 1px solid #e5e5e5;
            cursor: pointer;
        }
        
        .email-header-row:hover {
            background: #f5f5f5;
        }
        
        .email-body {
            padding: 20px 0;
            line-height: 1.8;
        }
        
        .email-body p {
            margin: 8px 0;
        }
        
        .clickable-line {
            cursor: pointer;
            padding: 5px;
            margin: -5px;
            border-radius: 4px;
        }
        
        .clickable-line:hover {
            background: #f5f5f5;
        }
        
        .indicator-selected {
            background: #fef2f2 !important;
            border-left: 3px solid #ef4444;
            padding-left: 10px;
        }
        
        .indicators-panel {
            background: #18181b;
            border-radius: 8px;
            padding: 20px;
        }
        
        .indicator-tag {
            background: #27272a;
            padding: 10px 15px;
            border-radius: 6px;
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .no-indicators {
            color: #71717a;
            font-style: italic;
        }
        
        /* Log Analysis Styles */
        .log-viewer {
            background: #0d1117;
            border-radius: 8px;
            padding: 15px;
            font-family: monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            margin: 20px 0;
        }
        
        .log-header, .log-entry {
            display: grid;
            grid-template-columns: 80px 100px 180px 100px 1fr;
            gap: 15px;
            padding: 10px;
        }
        
        .log-header {
            border-bottom: 1px solid #30363d;
            color: #8b949e;
            font-weight: bold;
        }
        
        .log-entry {
            border-bottom: 1px solid #21262d;
        }
        
        .log-warning {
            color: #f59e0b;
        }
        
        .log-success {
            color: #10b981;
        }
        
        .log-danger {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
        
        .analysis-questions {
            margin: 30px 0;
        }
        
        .analysis-question {
            background: #18181b;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        
        .question-options {
            margin-top: 15px;
        }
        
        .option-label {
            display: block;
            padding: 12px 15px;
            margin: 8px 0;
            background: #27272a;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .option-label:hover {
            background: #2d2d35;
        }
        
        .option-label input {
            margin-right: 12px;
        }
        
        /* Risk Matrix Styles */
        .risk-matrix-container {
            margin: 30px 0;
        }
        
        .risk-row {
            background: #18181b;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 20px;
            align-items: center;
        }
        
        .risk-info p {
            color: #a1a1aa;
            margin-top: 8px;
        }
        
        .risk-controls {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .risk-field {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .risk-field label {
            font-size: 0.85rem;
            color: #71717a;
        }
        
        .risk-field select {
            background: #27272a;
            color: #fafafa;
            border: 1px solid #3f3f46;
            padding: 8px 12px;
            border-radius: 6px;
        }
        
        .risk-score {
            font-size: 1.5rem;
            font-weight: bold;
            color: #71717a;
        }
        
        /* PBQ Actions */
        .pbq-actions {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
        }
        
        /* Results Styles */
        .pbq-results {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .score-display {
            margin: 30px 0;
            padding: 30px;
            border-radius: 12px;
        }
        
        .score-display.passed {
            background: linear-gradient(135deg, #064e3b, #065f46);
            border: 2px solid #10b981;
        }
        
        .score-display.failed {
            background: linear-gradient(135deg, #7f1d1d, #991b1b);
            border: 2px solid #ef4444;
        }
        
        .score-value {
            font-size: 3rem;
            font-weight: bold;
        }
        
        .score-percentage {
            font-size: 1.5rem;
            opacity: 0.8;
        }
        
        .result-message {
            font-size: 1.1rem;
            color: #a1a1aa;
            margin: 20px 0;
        }
        
        .feedback-section, .explanation-section {
            background: #18181b;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            text-align: left;
        }
        
        .feedback-item {
            padding: 10px 15px;
            margin: 8px 0;
            border-radius: 6px;
        }
        
        .feedback-item.correct {
            background: rgba(16, 185, 129, 0.1);
            color: #34d399;
        }
        
        .feedback-item.incorrect {
            background: rgba(239, 68, 68, 0.1);
            color: #f87171;
        }
        
        .explanation-section {
            border-left: 4px solid #6366f1;
            white-space: pre-line;
            line-height: 1.8;
        }
        
        .pbq-placeholder {
            text-align: center;
            padding: 60px 20px;
        }
        
        .pbq-type-badge {
            color: #6366f1;
            font-size: 1.1rem;
            margin: 15px 0;
        }
        
        .coming-soon-message {
            background: #18181b;
            padding: 40px;
            border-radius: 12px;
            margin: 30px 0;
            color: #a1a1aa;
        }
        
        @media (max-width: 768px) {
            .drag-drop-container,
            .email-analysis-container,
            .matching-container {
                grid-template-columns: 1fr;
            }
            
            .risk-row {
                grid-template-columns: 1fr;
            }
            
            .log-header, .log-entry {
                font-size: 0.75rem;
                grid-template-columns: 60px 80px 140px 80px 1fr;
            }
        }
    `;
    document.head.appendChild(pbqStyles);

    // ================================================
    // EXPORT TO GLOBAL SCOPE
    // ================================================
    const engine = new PBQEngine();
    window.PBQEngine = engine;
    window.PBQ_SCENARIOS = PBQ_SCENARIOS;

    console.log('✅ PBQ Engine ready with', Object.keys(PBQ_SCENARIOS).length, 'interactive scenarios');

})();
