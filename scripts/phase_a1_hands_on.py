#!/usr/bin/env python3
"""
Phase A1: Add hands_on_activity to D1/D2 lessons
Creates contextually appropriate hands-on exercises for each lesson topic
"""

import json
import os

HANDS_ON_ACTIVITIES = {
    "D1-LESSON-002": {
        "title": "CIA Triad Impact Analysis",
        "objective": "Analyze security incidents to identify which CIA triad components were affected",
        "scenario": "You're a security analyst at Meridian Financial reviewing recent security incidents. For each incident, identify the primary CIA component(s) affected and recommend controls.",
        "steps": [
            "Read each incident description carefully",
            "Identify whether Confidentiality, Integrity, or Availability was primarily affected",
            "Note any secondary impacts to other CIA components",
            "Recommend a control that would have prevented or mitigated the incident"
        ],
        "exercises": [
            {
                "incident": "Customer database was accessed by unauthorized employee who sold data to competitors",
                "primary_impact": "Confidentiality",
                "secondary_impact": "Could affect Integrity if data was modified",
                "recommended_control": "Role-based access control (RBAC) with least privilege"
            },
            {
                "incident": "Ransomware encrypted all file servers, business operations halted for 3 days",
                "primary_impact": "Availability",
                "secondary_impact": "Integrity compromised if files were modified before encryption",
                "recommended_control": "Offline backups with tested recovery procedures"
            },
            {
                "incident": "Attacker modified wire transfer amounts in the banking application database",
                "primary_impact": "Integrity",
                "secondary_impact": "Could affect Confidentiality if attacker accessed other data",
                "recommended_control": "Database integrity monitoring and transaction logging"
            },
            {
                "incident": "DDoS attack overwhelmed the e-commerce website during Black Friday",
                "primary_impact": "Availability",
                "secondary_impact": "None directly",
                "recommended_control": "DDoS mitigation service and CDN"
            }
        ],
        "expected_outcome": "Correctly identify CIA impacts for 3/4 scenarios with appropriate control recommendations",
        "reflection_questions": [
            "Which CIA component is most critical for a hospital? A bank? A news website?",
            "Can a single incident affect all three CIA components simultaneously?",
            "How do you prioritize when CIA components conflict (e.g., availability vs confidentiality)?"
        ]
    },
    
    "D1-LESSON-003": {
        "title": "Authentication Method Selection",
        "objective": "Select appropriate authentication methods for different security scenarios",
        "scenario": "You're designing authentication systems for different applications at TechCorp. Match the right authentication approach to each use case.",
        "steps": [
            "Review each application's security requirements",
            "Consider user population and risk level",
            "Select authentication factors (something you know/have/are)",
            "Justify your choice based on security and usability"
        ],
        "exercises": [
            {
                "application": "Employee email access from corporate laptops",
                "risk_level": "Medium",
                "recommended_auth": "Password + certificate (on laptop)",
                "reasoning": "Certificate provides seamless second factor for managed devices"
            },
            {
                "application": "Admin access to cloud infrastructure",
                "risk_level": "Critical",
                "recommended_auth": "Password + hardware token + IP restriction",
                "reasoning": "Highest privilege requires strongest authentication"
            },
            {
                "application": "Customer mobile banking app",
                "risk_level": "High",
                "recommended_auth": "Password/PIN + biometric + device binding",
                "reasoning": "Balances security with mobile user experience"
            },
            {
                "application": "Public WiFi guest access",
                "risk_level": "Low",
                "recommended_auth": "Captive portal with email/SMS verification",
                "reasoning": "Accountability without excessive friction for temporary access"
            }
        ],
        "expected_outcome": "Propose appropriate MFA combinations with sound security reasoning",
        "reflection_questions": [
            "When is single-factor authentication acceptable?",
            "How do you balance security with user experience?",
            "What makes hardware tokens more secure than SMS OTP?"
        ]
    },
    
    "D1-LESSON-004": {
        "title": "Cryptographic Algorithm Selection",
        "objective": "Select appropriate cryptographic algorithms for different use cases",
        "scenario": "As a security engineer at SecureData Inc., you need to recommend cryptographic solutions for various business needs.",
        "steps": [
            "Identify the security requirement (confidentiality, integrity, authentication)",
            "Consider performance requirements and constraints",
            "Select appropriate algorithm type and key size",
            "Document any implementation considerations"
        ],
        "exercises": [
            {
                "requirement": "Encrypt customer data at rest in database",
                "recommended": "AES-256",
                "type": "Symmetric encryption",
                "reasoning": "Fast, strong, suitable for large data volumes"
            },
            {
                "requirement": "Verify software updates haven't been tampered with",
                "recommended": "SHA-256 hash + RSA/ECDSA signature",
                "type": "Hashing + Digital signature",
                "reasoning": "Hash ensures integrity, signature proves authenticity"
            },
            {
                "requirement": "Secure key exchange over untrusted network",
                "recommended": "ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)",
                "type": "Asymmetric key exchange",
                "reasoning": "Perfect forward secrecy, efficient key agreement"
            },
            {
                "requirement": "Store user passwords securely",
                "recommended": "bcrypt or Argon2",
                "type": "Password hashing",
                "reasoning": "Slow by design, includes salt, resists GPU attacks"
            }
        ],
        "expected_outcome": "Match security requirements to appropriate cryptographic solutions",
        "reflection_questions": [
            "Why can't you use AES for digital signatures?",
            "What's the difference between hashing and encryption?",
            "Why are password hashes different from regular cryptographic hashes?"
        ]
    },
    
    "D1-LESSON-005": {
        "title": "Zero Trust Architecture Design",
        "objective": "Apply Zero Trust principles to redesign a traditional network",
        "scenario": "Pinnacle Insurance is migrating from perimeter-based security to Zero Trust. Design the new architecture.",
        "steps": [
            "Identify current trust assumptions that need to change",
            "Define identity verification requirements",
            "Design micro-segmentation strategy",
            "Plan continuous verification mechanisms"
        ],
        "exercises": [
            {
                "current_state": "VPN grants full network access to employees",
                "zero_trust_design": "Identity-aware proxy grants access to specific applications only",
                "principle": "Least privilege access"
            },
            {
                "current_state": "Internal servers trust all internal traffic",
                "zero_trust_design": "All server-to-server communication requires mutual TLS authentication",
                "principle": "Never trust, always verify"
            },
            {
                "current_state": "Once authenticated, session lasts 8 hours",
                "zero_trust_design": "Continuous authentication with risk-based session evaluation",
                "principle": "Continuous verification"
            },
            {
                "current_state": "Flat network with minimal segmentation",
                "zero_trust_design": "Micro-segmented network with identity-based policies",
                "principle": "Assume breach, minimize blast radius"
            }
        ],
        "expected_outcome": "Create a Zero Trust migration plan addressing all four scenarios",
        "reflection_questions": [
            "What's the biggest challenge in Zero Trust adoption?",
            "How does Zero Trust change the role of the network perimeter?",
            "Can Zero Trust work with legacy applications?"
        ]
    },
    
    "D1-LESSON-006": {
        "title": "Physical Security Assessment",
        "objective": "Evaluate physical security controls at a facility",
        "scenario": "Conduct a physical security assessment of NexaTech's new data center.",
        "steps": [
            "Review each security layer from perimeter to rack",
            "Identify control type (deterrent, preventive, detective, corrective)",
            "Assess effectiveness and identify gaps",
            "Recommend improvements"
        ],
        "exercises": [
            {
                "layer": "Perimeter",
                "existing_controls": "Chain-link fence, security signage",
                "gap": "No intrusion detection on fence",
                "recommendation": "Add fence vibration sensors and CCTV"
            },
            {
                "layer": "Building Entry",
                "existing_controls": "Badge reader, security guard",
                "gap": "Tailgating possible",
                "recommendation": "Add mantrap/airlock entry, anti-tailgating sensors"
            },
            {
                "layer": "Server Room",
                "existing_controls": "Badge + PIN entry",
                "gap": "No biometric verification",
                "recommendation": "Add biometric authentication for high-security areas"
            },
            {
                "layer": "Rack Level",
                "existing_controls": "Standard rack locks",
                "gap": "No individual access logging",
                "recommendation": "Smart locks with access logging per rack"
            }
        ],
        "expected_outcome": "Complete layered security assessment with actionable recommendations",
        "reflection_questions": [
            "How does defense-in-depth apply to physical security?",
            "What's more important: deterrence or detection?",
            "How do you balance physical security with operational efficiency?"
        ]
    },
    
    "D1-LESSON-007": {
        "title": "Deception Technology Deployment",
        "objective": "Design a deception-based detection strategy",
        "scenario": "Deploy honeypots and honeytokens to detect attackers in GlobalRetail's network.",
        "steps": [
            "Identify high-value assets attackers would target",
            "Design decoys that appear legitimate",
            "Plan alerting and response procedures",
            "Ensure deceptions don't impact legitimate operations"
        ],
        "exercises": [
            {
                "asset_to_protect": "Customer database",
                "deception": "Honeypot database server with fake customer data",
                "placement": "Same network segment as real database",
                "alert_trigger": "Any connection attempt to honeypot"
            },
            {
                "asset_to_protect": "Admin credentials",
                "deception": "Honeytoken admin account in Active Directory",
                "placement": "Visible in directory but never used legitimately",
                "alert_trigger": "Any authentication attempt with this account"
            },
            {
                "asset_to_protect": "Source code repository",
                "deception": "Fake repository with enticing name (e.g., 'crypto-keys')",
                "placement": "Accessible from developer network",
                "alert_trigger": "Any clone or access attempt"
            },
            {
                "asset_to_protect": "Financial documents",
                "deception": "Canary documents with tracking (e.g., 'Q4_Financials.xlsx')",
                "placement": "File shares likely to be browsed by attackers",
                "alert_trigger": "Document opened or exfiltrated"
            }
        ],
        "expected_outcome": "Deploy complementary deception technologies targeting different attack stages",
        "reflection_questions": [
            "How do you make honeypots believable to attackers?",
            "What's the risk of honeypots being used as attack platforms?",
            "How do you avoid alert fatigue from deception technologies?"
        ]
    },
    
    "D1-LESSON-008": {
        "title": "Change Management Process Design",
        "objective": "Establish a security-focused change management process",
        "scenario": "Create change management procedures for Apex Healthcare's IT infrastructure.",
        "steps": [
            "Define change categories and approval requirements",
            "Establish security review checkpoints",
            "Design rollback procedures",
            "Create documentation requirements"
        ],
        "exercises": [
            {
                "change_type": "Emergency security patch",
                "approval_required": "Security lead + on-call manager",
                "security_review": "Abbreviated - verify patch authenticity and target systems",
                "rollback_plan": "System snapshot before deployment"
            },
            {
                "change_type": "New application deployment",
                "approval_required": "CAB (Change Advisory Board)",
                "security_review": "Full security assessment, penetration test, code review",
                "rollback_plan": "Documented removal procedure, data migration reversal"
            },
            {
                "change_type": "Firewall rule modification",
                "approval_required": "Network security team + requestor's manager",
                "security_review": "Rule analysis, least privilege verification, expiration date",
                "rollback_plan": "Previous rule configuration backup"
            },
            {
                "change_type": "User access modification",
                "approval_required": "Data owner + user's manager",
                "security_review": "Verify business need, check for privilege creep",
                "rollback_plan": "Access removal procedure documented"
            }
        ],
        "expected_outcome": "Create risk-appropriate change procedures for different change types",
        "reflection_questions": [
            "How do you balance speed and security in emergency changes?",
            "What role does documentation play in change management?",
            "How do you prevent 'change fatigue' in approval processes?"
        ]
    },
    
    "D2-LESSON-001": {
        "title": "Threat Actor Profiling",
        "objective": "Profile threat actors based on their characteristics and behaviors",
        "scenario": "As a threat intelligence analyst at CyberDefend, profile threat actors from incident data.",
        "steps": [
            "Analyze attack indicators and techniques",
            "Identify likely threat actor category",
            "Assess motivation and capability",
            "Predict future targeting and tactics"
        ],
        "exercises": [
            {
                "indicators": "Sophisticated malware, long dwell time, targets defense contractors, exfiltrates technical docs",
                "actor_type": "Nation-state (APT)",
                "motivation": "Espionage - stealing military/technical secrets",
                "capability": "High - custom tools, patient, well-resourced"
            },
            {
                "indicators": "Ransomware deployment, cryptocurrency demands, targets healthcare during COVID",
                "actor_type": "Organized crime",
                "motivation": "Financial gain",
                "capability": "Medium-High - uses RaaS, opportunistic targeting"
            },
            {
                "indicators": "Website defacement, leaked employee emails, posted on social media",
                "actor_type": "Hacktivist",
                "motivation": "Ideological - embarrass target organization",
                "capability": "Low-Medium - uses available tools, seeks publicity"
            },
            {
                "indicators": "Data exfiltration right before employee resignation, accessed only their projects",
                "actor_type": "Insider threat",
                "motivation": "Personal gain - taking work to competitor",
                "capability": "High access, low sophistication needed"
            }
        ],
        "expected_outcome": "Accurately profile threat actors and predict their likely behaviors",
        "reflection_questions": [
            "How does threat actor motivation affect defense strategy?",
            "Can the same indicators point to different actor types?",
            "How do you attribute attacks when actors try to mislead?"
        ]
    },
    
    "D2-LESSON-002": {
        "title": "Attack Surface Mapping",
        "objective": "Map and reduce an organization's attack surface",
        "scenario": "Conduct attack surface analysis for CloudFirst Technologies.",
        "steps": [
            "Inventory all external-facing assets",
            "Identify potential entry points",
            "Assess risk level of each surface",
            "Recommend attack surface reduction measures"
        ],
        "exercises": [
            {
                "surface": "Public website (marketing)",
                "entry_points": "Web forms, CMS admin panel, third-party plugins",
                "risk": "Medium - limited data, but could pivot to internal",
                "reduction": "WAF, remove unused plugins, separate hosting from corp network"
            },
            {
                "surface": "Employee VPN",
                "entry_points": "VPN gateway, authentication system",
                "risk": "High - direct path to internal network",
                "reduction": "MFA required, split tunneling disabled, device compliance checks"
            },
            {
                "surface": "Cloud SaaS applications",
                "entry_points": "OAuth connections, API integrations, admin consoles",
                "risk": "High - contains sensitive business data",
                "reduction": "SSO integration, access reviews, API security monitoring"
            },
            {
                "surface": "Email system",
                "entry_points": "Inbound email (phishing), attachments, links",
                "risk": "Critical - primary initial access vector",
                "reduction": "Email filtering, attachment sandboxing, link rewriting, training"
            }
        ],
        "expected_outcome": "Complete attack surface inventory with prioritized reduction recommendations",
        "reflection_questions": [
            "How does cloud adoption change attack surface?",
            "What's the relationship between attack surface and risk?",
            "Can you ever fully eliminate attack surface?"
        ]
    },
    
    "D2-LESSON-003": {
        "title": "Social Engineering Recognition",
        "objective": "Identify and respond to social engineering attempts",
        "scenario": "Review suspicious communications reported by employees at SecureTech.",
        "steps": [
            "Analyze each communication for red flags",
            "Identify the social engineering technique used",
            "Assess the threat level",
            "Recommend appropriate response"
        ],
        "exercises": [
            {
                "communication": "Email from 'IT Support' asking to click link to update password immediately or lose access",
                "technique": "Phishing + Urgency + Authority",
                "red_flags": "Generic greeting, urgent demand, suspicious link, threatening consequence",
                "response": "Report to security, do not click, verify with IT through known channels"
            },
            {
                "communication": "Phone call from 'bank' asking to verify account by providing card number",
                "technique": "Vishing + Pretexting",
                "red_flags": "Inbound call requesting sensitive data, can't verify caller identity",
                "response": "Hang up, call bank directly using number on card"
            },
            {
                "communication": "LinkedIn message from recruiter with job offer PDF attachment",
                "technique": "Spear phishing + Pretexting",
                "red_flags": "Unsolicited attachment, too-good-to-be-true offer, new LinkedIn profile",
                "response": "Don't open attachment, verify recruiter through company website"
            },
            {
                "communication": "USB drive found in parking lot labeled 'Salary Data 2024'",
                "technique": "Baiting",
                "red_flags": "Found media, enticing label designed to encourage insertion",
                "response": "Do not insert, turn in to security team for analysis"
            }
        ],
        "expected_outcome": "Correctly identify social engineering techniques and appropriate responses",
        "reflection_questions": [
            "Why is social engineering so effective despite awareness training?",
            "How do you verify legitimate requests from suspicious ones?",
            "What makes certain people more susceptible to social engineering?"
        ]
    },
    
    "D2-LESSON-004": {
        "title": "Malware Classification Exercise",
        "objective": "Classify malware based on behavior descriptions",
        "scenario": "You're a SOC analyst reviewing EDR alerts. Classify each suspicious behavior.",
        "steps": [
            "Read each behavior description carefully",
            "Identify key indicators: propagation, user action, purpose",
            "Classify the malware type",
            "Recommend containment approach"
        ],
        "exercises": [
            {
                "behavior": "Code attached to Word document executes when opened, infects other Office files on the system",
                "classification": "Virus",
                "key_indicators": "Needs host file, requires user action, spreads to similar files",
                "containment": "Isolate system, scan all Office documents"
            },
            {
                "behavior": "Malware spreads across network shares exploiting SMB vulnerability, no user interaction",
                "classification": "Worm",
                "key_indicators": "Self-replicating, no user action, exploits vulnerability",
                "containment": "Network segmentation, patch SMB, isolate infected segments"
            },
            {
                "behavior": "Free game download installs hidden program providing attacker remote control",
                "classification": "Trojan (RAT)",
                "key_indicators": "Disguised as legitimate, user installed, provides backdoor",
                "containment": "Remove application, check for persistence mechanisms"
            },
            {
                "behavior": "PowerShell scripts running in memory, no files written to disk, using WMI for persistence",
                "classification": "Fileless malware",
                "key_indicators": "Memory-only, uses legitimate tools, evades file-based AV",
                "containment": "Memory forensics, kill processes, remove WMI persistence"
            },
            {
                "behavior": "All files encrypted with .locked extension, ransom note demands Bitcoin payment",
                "classification": "Crypto Ransomware",
                "key_indicators": "Encrypts files, demands payment, may threaten data leak",
                "containment": "Isolate immediately, preserve evidence, assess backup options"
            }
        ],
        "expected_outcome": "Correctly classify 4/5 malware types with appropriate containment",
        "reflection_questions": [
            "Which malware types are hardest to detect and why?",
            "How does malware classification affect incident response?",
            "Why is the virus vs worm distinction important?"
        ]
    },
    
    "D2-LESSON-005": {
        "title": "Network Attack Pattern Analysis",
        "objective": "Identify network attacks from traffic patterns and logs",
        "scenario": "Analyze network logs at Coastal Community Bank to identify attack types.",
        "steps": [
            "Review traffic patterns and anomalies",
            "Identify the attack type",
            "Determine impact and scope",
            "Recommend immediate mitigation"
        ],
        "exercises": [
            {
                "pattern": "Massive traffic spike from 50,000+ unique IPs targeting port 443",
                "attack": "DDoS - Distributed Denial of Service",
                "impact": "Service unavailability, legitimate users blocked",
                "mitigation": "Engage DDoS mitigation service, rate limiting"
            },
            {
                "pattern": "ARP table shows gateway MAC changed to unknown device",
                "attack": "ARP Spoofing/Poisoning",
                "impact": "Man-in-the-middle position, traffic interception possible",
                "mitigation": "Static ARP entries for critical systems, port security"
            },
            {
                "pattern": "DNS queries for bank.com returning different IP than expected",
                "attack": "DNS Spoofing/Poisoning",
                "impact": "Users redirected to attacker-controlled server",
                "mitigation": "DNSSEC validation, flush DNS cache, verify DNS servers"
            },
            {
                "pattern": "Single IP sending thousands of SYN packets, never completing handshake",
                "attack": "SYN Flood (DoS)",
                "impact": "Server connection table exhausted",
                "mitigation": "SYN cookies, rate limiting, firewall rules"
            }
        ],
        "expected_outcome": "Identify attack types and implement appropriate mitigations",
        "reflection_questions": [
            "How do you distinguish DoS from DDoS in real-time?",
            "Why is ARP poisoning particularly dangerous on LANs?",
            "What makes volumetric attacks difficult to mitigate locally?"
        ]
    },
    
    "D2-LESSON-006": {
        "title": "Application Vulnerability Identification",
        "objective": "Identify application vulnerabilities in code and inputs",
        "scenario": "Conduct security code review at NexaTech Solutions.",
        "steps": [
            "Review each code snippet or input pattern",
            "Identify the vulnerability type",
            "Explain why it's vulnerable",
            "Recommend the fix"
        ],
        "exercises": [
            {
                "code": "query = \"SELECT * FROM users WHERE id = \" + userId",
                "vulnerability": "SQL Injection",
                "explanation": "User input directly concatenated into SQL query",
                "fix": "Use parameterized queries/prepared statements"
            },
            {
                "code": "<div>Welcome, ${userName}</div>",
                "vulnerability": "Cross-Site Scripting (XSS)",
                "explanation": "User input rendered as HTML without encoding",
                "fix": "HTML encode all user-supplied output"
            },
            {
                "code": "char buffer[10]; strcpy(buffer, userInput);",
                "vulnerability": "Buffer Overflow",
                "explanation": "No bounds checking on input copied to fixed buffer",
                "fix": "Use strncpy with size limit, or safe string functions"
            },
            {
                "code": "Transfer form with hidden field for amount, no server validation",
                "vulnerability": "Parameter Tampering + Missing Server Validation",
                "explanation": "Client-side values can be modified before submission",
                "fix": "Validate all inputs server-side, don't trust hidden fields"
            }
        ],
        "expected_outcome": "Identify vulnerabilities and recommend secure alternatives",
        "reflection_questions": [
            "Why is input validation alone not sufficient for SQL injection?",
            "What's the difference between reflected and stored XSS?",
            "Why are buffer overflows less common in modern languages?"
        ]
    },
    
    "D2-LESSON-007": {
        "title": "Vulnerability Prioritization Exercise",
        "objective": "Prioritize vulnerabilities using risk-based approach",
        "scenario": "Your scan found 500 vulnerabilities. Prioritize these 5 critical findings.",
        "steps": [
            "Review CVSS score and characteristics",
            "Consider asset criticality and exposure",
            "Factor in exploit availability",
            "Assign remediation priority and timeframe"
        ],
        "exercises": [
            {
                "vuln": "CVSS 9.8 RCE on internet-facing web server",
                "asset": "Customer portal",
                "exploit_available": "Yes, actively exploited",
                "priority": "1 - Critical",
                "timeframe": "24 hours"
            },
            {
                "vuln": "CVSS 7.5 SQL injection on internal HR application",
                "asset": "HR system with PII",
                "exploit_available": "PoC available",
                "priority": "2 - High",
                "timeframe": "7 days"
            },
            {
                "vuln": "CVSS 9.0 RCE but no patch available",
                "asset": "Legacy manufacturing system",
                "exploit_available": "Yes",
                "priority": "2 - High (compensating controls)",
                "timeframe": "Immediate mitigations, patch when available"
            },
            {
                "vuln": "CVSS 4.0 information disclosure",
                "asset": "Development server",
                "exploit_available": "No",
                "priority": "4 - Low",
                "timeframe": "30 days"
            }
        ],
        "expected_outcome": "Create prioritized remediation plan with business justification",
        "reflection_questions": [
            "When would you patch a CVSS 7.0 before a CVSS 9.0?",
            "How do you handle critical vulnerabilities with no patch?",
            "What role does threat intelligence play in prioritization?"
        ]
    },
    
    "D2-LESSON-008": {
        "title": "IOC Analysis and Detection",
        "objective": "Extract and operationalize indicators of compromise",
        "scenario": "Threat intel report received about APT targeting your industry. Extract and deploy IOCs.",
        "steps": [
            "Extract indicators from threat report",
            "Categorize each indicator type",
            "Determine detection method",
            "Plan operationalization"
        ],
        "exercises": [
            {
                "indicator": "185.234.72.15",
                "type": "Network IOC - IP Address",
                "detection": "Firewall logs, SIEM correlation",
                "action": "Block at perimeter, alert on historical connections"
            },
            {
                "indicator": "evil.malware-domain.com",
                "type": "Network IOC - Domain",
                "detection": "DNS logs, proxy logs",
                "action": "DNS sinkhole, proxy block, historical query search"
            },
            {
                "indicator": "SHA256: a1b2c3d4e5f6...",
                "type": "Host IOC - File Hash",
                "detection": "EDR file monitoring, YARA rules",
                "action": "EDR block, scan endpoints for presence"
            },
            {
                "indicator": "Unusual PowerShell execution at 3AM accessing finance shares",
                "type": "Behavioral IOA",
                "detection": "UEBA, behavioral analytics, SIEM rules",
                "action": "Create detection rule, baseline normal behavior"
            }
        ],
        "expected_outcome": "Successfully extract, categorize, and operationalize IOCs",
        "reflection_questions": [
            "Why are behavioral indicators often more valuable than static IOCs?",
            "How quickly do IOCs become stale?",
            "What's the risk of false positives when deploying IOCs?"
        ]
    },
    
    "D2-LESSON-009": {
        "title": "System Hardening Checklist",
        "objective": "Create a hardening plan for server deployment",
        "scenario": "NexaTech is deploying a new Linux web server. Create hardening checklist.",
        "steps": [
            "Identify services to disable",
            "Define secure configuration settings",
            "Plan account and access controls",
            "Specify monitoring requirements"
        ],
        "exercises": [
            {
                "category": "Service Hardening",
                "items": [
                    "Disable telnet, use SSH only",
                    "Remove unused packages (FTP, SNMP if not needed)",
                    "Disable USB storage mounting"
                ]
            },
            {
                "category": "Access Control",
                "items": [
                    "Disable root SSH login",
                    "Implement SSH key authentication",
                    "Configure sudo with least privilege",
                    "Set account lockout policies"
                ]
            },
            {
                "category": "Network Hardening",
                "items": [
                    "Enable host-based firewall (iptables/nftables)",
                    "Disable IPv6 if not used",
                    "Configure TLS 1.2+ only"
                ]
            },
            {
                "category": "Monitoring & Logging",
                "items": [
                    "Enable auditd for system call logging",
                    "Configure syslog forwarding to SIEM",
                    "Enable login attempt logging"
                ]
            }
        ],
        "expected_outcome": "Complete hardening checklist ready for implementation",
        "reflection_questions": [
            "How do you balance hardening with operational needs?",
            "What's the role of CIS Benchmarks in hardening?",
            "How do you maintain hardening over time as systems change?"
        ]
    },
    
    "D2-LESSON-010": {
        "title": "Mitigation Strategy Selection",
        "objective": "Match attacks with appropriate mitigation techniques",
        "scenario": "Select the most effective mitigation for each attack scenario.",
        "steps": [
            "Analyze the attack scenario",
            "Consider available mitigation options",
            "Select most effective mitigation",
            "Plan implementation"
        ],
        "exercises": [
            {
                "attack": "Ransomware spreading via lateral movement",
                "mitigation": "Network segmentation + endpoint isolation",
                "reasoning": "Limits spread to affected segment, contains blast radius"
            },
            {
                "attack": "SQL injection on production web application",
                "mitigation": "WAF (immediate) + code fix (permanent)",
                "reasoning": "WAF blocks attack patterns while code is being fixed"
            },
            {
                "attack": "Zero-day exploit with no vendor patch",
                "mitigation": "Compensating controls: network isolation, increased monitoring, disable vulnerable feature",
                "reasoning": "Reduce exposure until patch available"
            },
            {
                "attack": "Credential stuffing against login page",
                "mitigation": "Rate limiting + CAPTCHA + MFA requirement",
                "reasoning": "Multiple layers slow attack and require legitimate user verification"
            }
        ],
        "expected_outcome": "Select appropriate mitigations with sound reasoning",
        "reflection_questions": [
            "When is quarantine more appropriate than blocking?",
            "How do you decide between accepting risk vs implementing compensating controls?",
            "What role does monitoring play in mitigation?"
        ]
    },
    
    "D2-LESSON-011": {
        "title": "MITRE ATT&CK Mapping",
        "objective": "Map an attack scenario to MITRE ATT&CK framework",
        "scenario": "Map each phase of an APT attack to ATT&CK tactics and techniques.",
        "steps": [
            "Read the attack narrative",
            "Identify distinct attack phases",
            "Map each phase to ATT&CK tactic",
            "Identify specific techniques used"
        ],
        "exercises": [
            {
                "phase": "Attacker sent phishing email with malicious Word attachment",
                "tactic": "Initial Access",
                "technique": "T1566.001 - Spearphishing Attachment"
            },
            {
                "phase": "Malware established connection to command and control server",
                "tactic": "Command and Control",
                "technique": "T1071.001 - Application Layer Protocol: Web"
            },
            {
                "phase": "Attacker used Mimikatz to dump credentials from memory",
                "tactic": "Credential Access",
                "technique": "T1003.001 - LSASS Memory"
            },
            {
                "phase": "Moved laterally to domain controller using stolen credentials",
                "tactic": "Lateral Movement",
                "technique": "T1021.001 - Remote Desktop Protocol"
            },
            {
                "phase": "Compressed sensitive files and exfiltrated over HTTPS",
                "tactic": "Exfiltration",
                "technique": "T1041 - Exfiltration Over C2 Channel"
            }
        ],
        "expected_outcome": "Complete ATT&CK mapping for all attack phases",
        "reflection_questions": [
            "How does ATT&CK mapping help detection engineering?",
            "What's the difference between tactics and techniques?",
            "How can you use ATT&CK for security gap analysis?"
        ]
    },
    
    "D2-LESSON-012": {
        "title": "Assessment Type Selection",
        "objective": "Select appropriate assessment type for different objectives",
        "scenario": "As a security consultant, recommend the right assessment for each client need.",
        "steps": [
            "Review client's security objective",
            "Consider scope, resources, and timeline",
            "Recommend assessment type",
            "Define key rules of engagement"
        ],
        "exercises": [
            {
                "objective": "Find all known vulnerabilities across network",
                "assessment": "Vulnerability Scan",
                "reasoning": "Automated, comprehensive, identifies known vulnerabilities efficiently"
            },
            {
                "objective": "Determine if an attacker could breach the perimeter",
                "assessment": "Penetration Test",
                "reasoning": "Manual testing attempts actual exploitation, validates controls"
            },
            {
                "objective": "Test security team's detection and response capabilities",
                "assessment": "Red Team Exercise",
                "reasoning": "Adversarial simulation tests people, process, and technology"
            },
            {
                "objective": "Verify compliance with security policy requirements",
                "assessment": "Security Audit",
                "reasoning": "Checklist-based validation that controls exist and function"
            }
        ],
        "expected_outcome": "Match objectives with appropriate assessment types",
        "reflection_questions": [
            "When is a vulnerability scan insufficient?",
            "What makes red team different from penetration testing?",
            "Why are rules of engagement critical for any assessment?"
        ]
    }
}


def add_hands_on_activities(data_dir):
    """Add hands_on_activity to lessons that are missing them"""
    
    print("=" * 80)
    print("PHASE A1: Adding hands_on_activity to D1/D2 lessons")
    print("=" * 80)
    
    added = 0
    skipped = 0
    
    for lesson_id, activity in HANDS_ON_ACTIVITIES.items():
        # Find the file
        for filename in os.listdir(data_dir):
            if lesson_id in filename and filename.endswith('.json'):
                filepath = os.path.join(data_dir, filename)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    lesson = json.load(f)
                
                # Only add if missing
                if not lesson.get('hands_on_activity'):
                    lesson['hands_on_activity'] = activity
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(lesson, f, indent=2, ensure_ascii=False)
                    
                    print(f"✅ {lesson_id}: Added hands_on_activity - {activity['title']}")
                    added += 1
                else:
                    print(f"⏭️  {lesson_id}: Already has hands_on_activity")
                    skipped += 1
                
                break
    
    print("\n" + "=" * 80)
    print(f"Phase A1 Complete: {added} added, {skipped} skipped")
    print("=" * 80)


if __name__ == '__main__':
    data_dir = '/home/claude/security-plus-platform/data'
    add_hands_on_activities(data_dir)
