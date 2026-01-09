#!/usr/bin/env python3
"""
Phase 1: Fix Critical D2 Lessons (D2-LESSON-004 through D2-LESSON-012)
Adds missing: learning_goals, why_it_matters, hands_on_activity, what_would_you_do,
              glossary_terms, real_world_example, exam_tips to sections
"""

import json
import os
from copy import deepcopy

# Content additions for each lesson
LESSON_ENHANCEMENTS = {
    "D2-LESSON-004": {
        "learning_goals": [
            "Classify malware by type, propagation method, and behavior",
            "Distinguish between viruses, worms, trojans, and ransomware",
            "Identify advanced evasion techniques like fileless malware and rootkits",
            "Apply appropriate detection and mitigation strategies for each malware type"
        ],
        "why_it_matters": {
            "career_impact": "SOC analysts spend 45-55% of their time analyzing malware alerts. Understanding malware classification helps you quickly triage threats and communicate effectively with your team.",
            "business_connection": "Ransomware alone caused $20B+ in damages in 2021. Organizations need security professionals who can identify, contain, and prevent malware infections to protect critical assets.",
            "exam_relevance": "Expect 6-8 questions on malware types. Focus on: virus vs worm vs trojan distinctions, ransomware types (crypto/locker), rootkit characteristics, and fileless malware."
        },
        "hands_on_activity": {
            "title": "Malware Classification Exercise",
            "objective": "Practice classifying malware based on behavior descriptions",
            "scenario": "You're a SOC analyst reviewing alerts from your EDR solution. Each alert describes suspicious behavior that you need to classify.",
            "steps": [
                "Read each behavior description carefully",
                "Identify key indicators: propagation method, user action required, primary purpose",
                "Classify each as: Virus, Worm, Trojan, Ransomware, Rootkit, RAT, or Spyware",
                "Document the reasoning for each classification"
            ],
            "exercises": [
                {"description": "Malicious code attached to a Word document that executes when opened and infects other Office files", "answer": "Virus", "reasoning": "Needs host file (Word doc), requires user action (open), infects other files"},
                {"description": "Software spreads across network shares exploiting SMB vulnerability without any user interaction", "answer": "Worm", "reasoning": "Self-replicates, no user action needed, exploits vulnerability"},
                {"description": "Free game download that installs a backdoor allowing remote attacker control", "answer": "RAT/Trojan", "reasoning": "Disguised as legitimate software, provides remote access, user installed it"},
                {"description": "All company files encrypted with ransom note demanding Bitcoin payment", "answer": "Crypto Ransomware", "reasoning": "Encrypts files, demands payment"},
                {"description": "Process hidden from Task Manager, modifies boot sequence to load before Windows", "answer": "Bootkit/Rootkit", "reasoning": "Hides presence, operates at boot level"}
            ],
            "expected_outcome": "Correctly classify 4/5 scenarios with proper reasoning",
            "reflection_questions": [
                "Which malware types are hardest to detect and why?",
                "How would your response differ for a worm vs a trojan infection?",
                "What makes ransomware particularly devastating for organizations?"
            ]
        },
        "what_would_you_do": {
            "scenario": "You're a security analyst at Meridian Manufacturing. Your EDR alerts on a workstation showing: PowerShell executing encoded commands, no malicious files on disk, legitimate Windows tools being used unusually, and data being exfiltrated to an external IP.",
            "context": "The affected user is in the finance department with access to sensitive financial data. The behavior started 30 minutes ago.",
            "question": "What type of malware is this most likely, and what's your immediate response?",
            "options": [
                {
                    "id": "a",
                    "text": "Traditional virus - run antivirus scan and quarantine infected files",
                    "is_best": False,
                    "feedback": "Traditional viruses use file-based infection. This behavior (no files, PowerShell, living-off-the-land) indicates fileless malware that won't be caught by file scanning.",
                    "consequences": "The fileless malware continues operating in memory while you scan for non-existent files. Data exfiltration continues."
                },
                {
                    "id": "b",
                    "text": "Fileless malware - isolate the system and capture memory for analysis",
                    "is_best": True,
                    "feedback": "Correct! The indicators (PowerShell, no files on disk, using legitimate tools) clearly point to fileless malware. Memory capture preserves evidence that would be lost on reboot.",
                    "consequences": "You contain the threat and preserve forensic evidence. Memory analysis reveals the attack chain and IOCs for hunting."
                },
                {
                    "id": "c",
                    "text": "Ransomware preparing to encrypt - immediately shut down the system",
                    "is_best": False,
                    "feedback": "While quick action is good, ransomware typically shows file encryption activity. This shows data exfiltration. Shutdown destroys memory evidence needed to understand the attack.",
                    "consequences": "You lose valuable forensic evidence. The attacker may have already exfiltrated data and could have persistence elsewhere."
                },
                {
                    "id": "d",
                    "text": "Cryptominer - monitor resource usage and block the external IP",
                    "is_best": False,
                    "feedback": "Cryptominers focus on CPU/GPU usage for mining, not data exfiltration. The behavior described shows data theft, not resource hijacking.",
                    "consequences": "You misclassify the threat. Data continues to be stolen while you look for mining activity."
                }
            ],
            "key_lesson": "Fileless malware operates entirely in memory using legitimate system tools (living-off-the-land). Traditional file-based detection fails. Memory forensics and behavior analysis are essential."
        },
        "section_additions": {
            "D2-L004-S01": {
                "glossary_terms": [
                    {"term": "Virus", "definition": "Malware that attaches to legitimate files/programs and requires user action to spread", "exam_note": "Always needs host file AND user action"},
                    {"term": "Worm", "definition": "Self-replicating malware that spreads across networks without user interaction", "exam_note": "Key: NO user action required"},
                    {"term": "Trojan", "definition": "Malware disguised as legitimate software that does NOT self-replicate", "exam_note": "Does NOT self-replicate - common exam trap"},
                    {"term": "RAT", "definition": "Remote Access Trojan - provides attacker with backdoor control of infected system", "exam_note": "Subset of Trojans, enables full remote control"},
                    {"term": "Rootkit", "definition": "Malware designed to hide its presence and maintain persistent access at kernel/boot level", "exam_note": "Operates at kernel level, very difficult to detect"}
                ],
                "real_world_example": {
                    "scenario": "WannaCry Ransomware (2017)",
                    "company": "Global - NHS, FedEx, Maersk affected",
                    "application": "WannaCry was a WORM that used the EternalBlue SMB exploit to spread automatically across networks without user action. It combined worm propagation with ransomware payload, infecting 200,000+ systems in 150 countries within days."
                },
                "exam_tips": [
                    "If a question mentions 'no user action required' - think WORM",
                    "If malware 'attaches to files' or 'requires opening' - think VIRUS",
                    "Trojans NEVER self-replicate - this is the most common exam trap",
                    "RAT is a TYPE of Trojan, not a separate category"
                ]
            },
            "D2-L004-S02": {
                "glossary_terms": [
                    {"term": "Crypto Ransomware", "definition": "Ransomware that encrypts files and demands payment for decryption key", "exam_note": "Most common type - encrypts FILES"},
                    {"term": "Locker Ransomware", "definition": "Ransomware that locks the entire system, preventing access", "exam_note": "Locks SYSTEM, not just files"},
                    {"term": "Double Extortion", "definition": "Ransomware tactic combining encryption with threat to leak stolen data", "exam_note": "Modern tactic - encrypt AND threaten to leak"},
                    {"term": "RaaS", "definition": "Ransomware-as-a-Service - criminal business model where ransomware developers rent their tools to affiliates", "exam_note": "Affiliate model - explains ransomware proliferation"}
                ],
                "real_world_example": {
                    "scenario": "Colonial Pipeline Attack (2021)",
                    "company": "Colonial Pipeline",
                    "application": "DarkSide ransomware shut down the largest US fuel pipeline for 6 days. The company paid $4.4M ransom. This demonstrated how ransomware can impact critical infrastructure and why offline backups and incident response planning are essential."
                },
                "exam_tips": [
                    "Crypto = encrypts files; Locker = locks system - know the difference",
                    "Double extortion is the modern standard - expect questions on it",
                    "Best defense against ransomware: OFFLINE backups (ransomware encrypts connected backups)"
                ]
            },
            "D2-L004-S03": {
                "glossary_terms": [
                    {"term": "Fileless Malware", "definition": "Malware that operates entirely in memory without writing files to disk", "exam_note": "Evades file-based antivirus - key characteristic"},
                    {"term": "Living off the Land", "definition": "Attack technique using legitimate system tools (PowerShell, WMI) for malicious purposes", "exam_note": "Associated with fileless malware"},
                    {"term": "Polymorphic Malware", "definition": "Malware that changes its code signature (via encryption) with each infection", "exam_note": "Changes APPEARANCE, evades signatures"},
                    {"term": "Metamorphic Malware", "definition": "Malware that completely rewrites its code with each infection", "exam_note": "Rewrites CODE itself - more sophisticated than polymorphic"},
                    {"term": "Logic Bomb", "definition": "Malware that triggers based on a specific condition (date, event, action)", "exam_note": "Triggered by CONDITION, not immediate execution"}
                ],
                "real_world_example": {
                    "scenario": "SolarWinds Supply Chain Attack (2020)",
                    "company": "SolarWinds / Multiple Government Agencies",
                    "application": "Attackers inserted malicious code into SolarWinds Orion updates. The malware used fileless techniques, living-off-the-land binaries, and sophisticated evasion to remain undetected for months while compromising 18,000+ organizations including US government agencies."
                },
                "exam_tips": [
                    "Fileless = memory only, evades file-based AV",
                    "Polymorphic changes encryption key; Metamorphic rewrites actual code",
                    "Logic bomb questions often mention 'triggered by date' or 'after employee termination'"
                ]
            },
            "D2-L004-S04": {
                "glossary_terms": [
                    {"term": "PUP", "definition": "Potentially Unwanted Program - software that may not be malicious but impacts security, privacy, or performance", "exam_note": "Gray area - not strictly malware but problematic"},
                    {"term": "Adware", "definition": "Software that displays unwanted advertisements and may track user behavior", "exam_note": "Displays ads, may track browsing"},
                    {"term": "Cryptominer", "definition": "Malware that hijacks system resources to mine cryptocurrency for the attacker", "exam_note": "Uses YOUR resources for THEIR profit"},
                    {"term": "Bloatware", "definition": "Pre-installed unnecessary software that consumes resources and may contain vulnerabilities", "exam_note": "Pre-installed, often on new devices"}
                ],
                "real_world_example": {
                    "scenario": "Coinhive Cryptomining",
                    "company": "Multiple websites compromised",
                    "application": "Coinhive was JavaScript-based cryptomining code injected into thousands of websites. Visitors' browsers would mine cryptocurrency without consent, causing performance issues and increased power consumption. This represented a new threat category blending malware with resource theft."
                },
                "exam_tips": [
                    "Cryptominers are increasingly common - know the resource impact",
                    "PUPs exist in gray area - may come bundled with legitimate software",
                    "Adware often comes with 'free' software downloads"
                ]
            }
        },
        "summary_addition": {
            "connection_to_next": "Now that you understand malware types, the next lesson covers Network Attacks - how attackers use network protocols and vulnerabilities to deliver malware and compromise systems."
        }
    },
    
    "D2-LESSON-005": {
        "learning_goals": [
            "Identify common network-based attacks and their mechanisms",
            "Distinguish between DoS and DDoS attacks and their variants",
            "Recognize man-in-the-middle and on-path attack techniques",
            "Apply appropriate network defenses against each attack type"
        ],
        "why_it_matters": {
            "career_impact": "Network attacks are the foundation of most breaches. SOC analysts review network traffic daily, and understanding attack patterns is essential for threat detection and incident response.",
            "business_connection": "DDoS attacks cost businesses an average of $40,000 per hour in downtime. Network security directly impacts availability, revenue, and customer trust.",
            "exam_relevance": "Expect 5-7 questions on network attacks. Focus on: DoS vs DDoS distinction, ARP poisoning, DNS attacks, and man-in-the-middle techniques."
        },
        "hands_on_activity": {
            "title": "Network Attack Pattern Recognition",
            "objective": "Identify network attacks from traffic patterns and logs",
            "scenario": "You're analyzing network logs and SIEM alerts at Coastal Community Bank. Identify the attack type from each scenario.",
            "steps": [
                "Review each log excerpt or traffic pattern",
                "Identify anomalies indicating attack behavior",
                "Classify the attack type",
                "Recommend immediate mitigation"
            ],
            "exercises": [
                {"description": "Massive traffic spike from thousands of different source IPs, all targeting web server port 443", "answer": "DDoS (Distributed Denial of Service)", "reasoning": "Multiple sources = Distributed; targeting availability"},
                {"description": "ARP table shows gateway MAC address changed to unknown device; users report slow internet", "answer": "ARP Poisoning/Spoofing", "reasoning": "ARP table manipulation enables man-in-the-middle"},
                {"description": "DNS queries for bank.com returning IP address of attacker-controlled server", "answer": "DNS Poisoning/Spoofing", "reasoning": "DNS manipulation redirects traffic"},
                {"description": "Single IP sending SYN packets without completing handshake, exhausting server connections", "answer": "SYN Flood (DoS)", "reasoning": "Single source, exploits TCP handshake"}
            ],
            "expected_outcome": "Correctly identify 3/4 attack types with appropriate mitigations",
            "reflection_questions": [
                "How would you distinguish between a DoS and DDoS attack in real-time?",
                "Why is ARP poisoning particularly dangerous on local networks?",
                "What makes DNS attacks difficult to detect?"
            ]
        },
        "what_would_you_do": {
            "scenario": "You're the on-call security analyst at GlobalRetail Inc. during Black Friday. The e-commerce site becomes unreachable. Initial analysis shows: traffic from 50,000+ unique IPs worldwide, mostly HTTP GET requests, your upstream bandwidth is saturated, and legitimate customers can't access the site.",
            "context": "Black Friday is your biggest revenue day. Every minute of downtime costs approximately $50,000 in lost sales.",
            "question": "What type of attack is this and what's your response priority?",
            "options": [
                {
                    "id": "a",
                    "text": "DoS attack - block the attacking IP address at the firewall",
                    "is_best": False,
                    "feedback": "With 50,000+ source IPs, this is a DDoS not DoS. Blocking individual IPs is ineffective against distributed attacks and would take too long.",
                    "consequences": "You waste critical time trying to block thousands of IPs while the attack continues and revenue loss mounts."
                },
                {
                    "id": "b",
                    "text": "DDoS attack - engage CDN/DDoS mitigation service and implement rate limiting",
                    "is_best": True,
                    "feedback": "Correct! Multiple source IPs indicates DDoS. CDN/DDoS mitigation services can absorb volumetric attacks while rate limiting helps filter malicious traffic.",
                    "consequences": "DDoS mitigation absorbs attack traffic, legitimate customers can access the site through clean pipes, revenue loss is minimized."
                },
                {
                    "id": "c",
                    "text": "Application layer attack - scale up web servers to handle the load",
                    "is_best": False,
                    "feedback": "Scaling won't help when bandwidth is saturated. The traffic can't even reach your servers. This is a volumetric attack requiring upstream mitigation.",
                    "consequences": "You spend money scaling infrastructure that can't receive traffic anyway. Attack continues unabated."
                },
                {
                    "id": "d",
                    "text": "Insider attack - investigate internal network for compromised systems",
                    "is_best": False,
                    "feedback": "Traffic from 50,000+ external IPs clearly indicates external attack. Internal investigation can happen later but won't stop the active attack.",
                    "consequences": "You focus on the wrong problem. The DDoS continues while you investigate internally."
                }
            ],
            "key_lesson": "DDoS attacks require upstream mitigation (CDN, scrubbing services) because the attack saturates your bandwidth before traffic reaches your defenses. Have DDoS mitigation arrangements in place BEFORE you need them."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Network attacks often target applications. The next lesson covers Application Attacks - SQL injection, XSS, and other attacks that exploit software vulnerabilities."
        }
    },
    
    "D2-LESSON-006": {
        "learning_goals": [
            "Identify injection attacks including SQL injection and command injection",
            "Recognize cross-site scripting (XSS) and cross-site request forgery (CSRF)",
            "Understand buffer overflow and memory-based vulnerabilities",
            "Apply secure coding principles to prevent application attacks"
        ],
        "why_it_matters": {
            "career_impact": "Application vulnerabilities are the #1 attack vector. Security engineers and penetration testers must understand these attacks to build and test secure applications.",
            "business_connection": "The average data breach costs $4.45M (2023). Most breaches exploit application vulnerabilities. Secure development practices directly reduce organizational risk.",
            "exam_relevance": "Expect 6-8 questions on application attacks. Focus on: SQL injection types, XSS vs CSRF distinction, buffer overflow basics, and input validation."
        },
        "hands_on_activity": {
            "title": "Injection Attack Identification",
            "objective": "Recognize injection vulnerabilities in code and inputs",
            "scenario": "You're conducting a security code review at NexaTech Solutions. Identify vulnerable patterns.",
            "steps": [
                "Review each code snippet or input example",
                "Identify the vulnerability type",
                "Explain why it's vulnerable",
                "Suggest the fix"
            ],
            "exercises": [
                {"description": "SQL query: SELECT * FROM users WHERE username=' + userInput + '", "answer": "SQL Injection", "reasoning": "User input directly concatenated into SQL query without sanitization"},
                {"description": "Page displays user comment directly: <div>{comment}</div>", "answer": "Cross-Site Scripting (XSS)", "reasoning": "User input rendered as HTML without encoding"},
                {"description": "C code: char buffer[10]; strcpy(buffer, userInput);", "answer": "Buffer Overflow", "reasoning": "No bounds checking on input copied to fixed buffer"},
                {"description": "Bank transfer form with no token verification", "answer": "CSRF", "reasoning": "No verification that request originated from legitimate user session"}
            ],
            "expected_outcome": "Identify 3/4 vulnerabilities with correct fix recommendations",
            "reflection_questions": [
                "Why is input validation not sufficient alone to prevent SQL injection?",
                "How does XSS differ from CSRF in terms of who the victim is?",
                "What makes buffer overflows particularly dangerous?"
            ]
        },
        "what_would_you_do": {
            "scenario": "You're a security consultant reviewing NexaTech's new customer portal. During testing, you enter ' OR '1'='1 in the login username field and successfully bypass authentication, gaining access to all customer accounts.",
            "context": "The portal handles sensitive customer data including payment information. It's scheduled to go live in 2 days.",
            "question": "What vulnerability did you find and what's your recommendation?",
            "options": [
                {
                    "id": "a",
                    "text": "XSS vulnerability - add input encoding before display",
                    "is_best": False,
                    "feedback": "XSS involves script execution in browsers. The ' OR '1'='1 payload is SQL injection syntax that manipulates database queries, not browser scripts.",
                    "consequences": "You misidentify the vulnerability. SQL injection remains unfixed while you implement irrelevant XSS protections."
                },
                {
                    "id": "b",
                    "text": "SQL Injection - halt launch, implement parameterized queries, conduct full security review",
                    "is_best": True,
                    "feedback": "Correct! The ' OR '1'='1 is classic SQL injection. Parameterized queries (prepared statements) prevent SQL injection by separating code from data. A full review is needed as this basic flaw suggests systemic issues.",
                    "consequences": "Launch delayed but customer data protected. Parameterized queries implemented throughout. Full review finds and fixes additional issues."
                },
                {
                    "id": "c",
                    "text": "CSRF vulnerability - implement anti-CSRF tokens on all forms",
                    "is_best": False,
                    "feedback": "CSRF exploits authenticated sessions to perform unwanted actions. This attack bypassed authentication entirely through database manipulation.",
                    "consequences": "You add CSRF tokens to a system that's already compromised at the database level. Attackers can still bypass login."
                },
                {
                    "id": "d",
                    "text": "Weak authentication - implement multi-factor authentication",
                    "is_best": False,
                    "feedback": "While MFA improves security, it doesn't fix SQL injection. An attacker could still manipulate queries to access data even with MFA in place.",
                    "consequences": "MFA implemented but SQL injection unfixed. Attackers find other injection points to extract data."
                }
            ],
            "key_lesson": "SQL injection allows attackers to manipulate database queries. The ONLY reliable fix is parameterized queries (prepared statements) which separate SQL code from user data. Input validation alone is insufficient."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Now that you understand how attacks work, the next lesson covers Vulnerability Management - how to systematically find, prioritize, and remediate vulnerabilities before attackers exploit them."
        }
    },
    
    "D2-LESSON-007": {
        "learning_goals": [
            "Explain the vulnerability management lifecycle",
            "Differentiate between vulnerability scanning and penetration testing",
            "Prioritize vulnerabilities using CVSS and risk-based approaches",
            "Develop remediation strategies based on organizational risk tolerance"
        ],
        "why_it_matters": {
            "career_impact": "Vulnerability management is a core security function. Most organizations have dedicated VM teams, and understanding this process is essential for any security role.",
            "business_connection": "60% of breaches involve unpatched vulnerabilities. Effective vulnerability management directly reduces breach risk and demonstrates due diligence to regulators.",
            "exam_relevance": "Expect 4-6 questions on vulnerability management. Focus on: scan types, CVSS scoring, remediation prioritization, and false positive handling."
        },
        "hands_on_activity": {
            "title": "Vulnerability Prioritization Exercise",
            "objective": "Prioritize vulnerabilities based on risk factors",
            "scenario": "You're the vulnerability analyst at Pinnacle Financial. Your weekly scan found 200 vulnerabilities. Prioritize these 5 critical findings.",
            "steps": [
                "Review each vulnerability's CVSS score and characteristics",
                "Consider the asset's business criticality",
                "Factor in exploit availability and threat intelligence",
                "Assign remediation priority (1-5) and timeframe"
            ],
            "exercises": [
                {"vuln": "CVSS 9.8 RCE on public-facing web server", "asset": "Customer portal", "priority": 1, "reasoning": "Critical score + internet-facing + handles customer data"},
                {"vuln": "CVSS 7.5 SQLi on internal database", "asset": "HR system", "priority": 2, "reasoning": "High score + sensitive data but internal only"},
                {"vuln": "CVSS 4.0 info disclosure", "asset": "Dev server", "priority": 4, "reasoning": "Medium score + non-production"},
                {"vuln": "CVSS 9.0 but no patch available", "asset": "Legacy system", "priority": 3, "reasoning": "Critical but must use compensating controls until patch"}
            ],
            "expected_outcome": "Produce prioritized remediation plan with justifications",
            "reflection_questions": [
                "How does asset criticality affect vulnerability priority?",
                "What do you do when a critical vulnerability has no patch?",
                "How do you balance remediation speed with change management?"
            ]
        },
        "what_would_you_do": {
            "scenario": "Your vulnerability scan shows 500 findings. Management wants everything fixed in 30 days. Your team can realistically remediate 100 vulnerabilities per month. A CVSS 9.8 vulnerability on an internet-facing system has no vendor patch yet.",
            "context": "You have limited resources and competing priorities. The unpatched vulnerability is actively being exploited in the wild.",
            "question": "How do you approach this situation?",
            "options": [
                {
                    "id": "a",
                    "text": "Work overtime to fix all 500 in 30 days as management requested",
                    "is_best": False,
                    "feedback": "Unrealistic goals lead to burnout, mistakes, and still won't be achieved. Security teams must set realistic expectations.",
                    "consequences": "Team burns out, critical vulnerabilities still unfixed among the chaos, management disappointed anyway."
                },
                {
                    "id": "b",
                    "text": "Prioritize by CVSS score alone, fixing highest scores first",
                    "is_best": False,
                    "feedback": "CVSS alone ignores business context. A CVSS 9.0 on an isolated test system matters less than a CVSS 7.0 on your payment processor.",
                    "consequences": "You fix high-CVSS vulnerabilities on low-value assets while exploitable flaws on critical systems wait."
                },
                {
                    "id": "c",
                    "text": "Risk-prioritize combining CVSS + asset value + threat intel; implement compensating controls for unpatched critical",
                    "is_best": True,
                    "feedback": "Correct! Risk-based prioritization focuses limited resources on highest actual risk. Compensating controls (WAF, segmentation, monitoring) mitigate unpatched vulnerabilities.",
                    "consequences": "Critical assets protected first, compensating controls reduce exposure for unpatched systems, management gets realistic timeline."
                },
                {
                    "id": "d",
                    "text": "Accept the risk on the unpatched vulnerability and focus only on patchable issues",
                    "is_best": False,
                    "feedback": "Risk acceptance for an actively exploited CVSS 9.8 on internet-facing systems is not appropriate. Compensating controls are required.",
                    "consequences": "Organization breached through the unpatched vulnerability. 'No patch available' is not an excuse for no action."
                }
            ],
            "key_lesson": "Vulnerability management requires risk-based prioritization combining technical severity (CVSS) with business context (asset value) and threat intelligence (active exploitation). When patches aren't available, implement compensating controls."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Vulnerabilities lead to indicators when exploited. The next lesson covers Indicators of Compromise - how to detect that an attack has occurred or is in progress."
        }
    },
    
    "D2-LESSON-008": {
        "learning_goals": [
            "Define and differentiate IOCs from IOAs",
            "Identify common indicators across network, host, and application layers",
            "Use threat intelligence to enhance detection capabilities",
            "Apply indicator-based detection in security monitoring"
        ],
        "why_it_matters": {
            "career_impact": "SOC analysts work with IOCs daily. Understanding indicators enables faster threat detection, better alert triage, and more effective incident response.",
            "business_connection": "Mean time to detect (MTTD) averages 200+ days. Better IOC detection dramatically reduces breach impact and recovery costs.",
            "exam_relevance": "Expect 4-5 questions on indicators. Focus on: IOC vs IOA distinction, types of indicators, and how threat intel enhances detection."
        },
        "hands_on_activity": {
            "title": "IOC Analysis Exercise",
            "objective": "Identify and categorize indicators of compromise",
            "scenario": "You receive a threat intelligence report about a new malware campaign. Extract and categorize the IOCs.",
            "steps": [
                "Review the threat report",
                "Extract all indicators mentioned",
                "Categorize each as: Network, Host, or Behavioral",
                "Determine how to implement detection for each"
            ],
            "exercises": [
                {"indicator": "185.234.72.15", "type": "Network IOC", "detection": "Firewall block, SIEM alert on connection"},
                {"indicator": "evil.malware-domain.com", "type": "Network IOC", "detection": "DNS sinkhole, proxy block"},
                {"indicator": "SHA256: a1b2c3d4...", "type": "Host IOC", "detection": "EDR file hash alert"},
                {"indicator": "Registry key: HKLM\\Software\\Malware", "type": "Host IOC", "detection": "EDR registry monitor"},
                {"indicator": "Unusual PowerShell execution at 3AM", "type": "Behavioral IOA", "detection": "UEBA, behavioral analytics"}
            ],
            "expected_outcome": "Correctly categorize indicators and specify detection methods",
            "reflection_questions": [
                "Why are behavioral indicators (IOAs) often more valuable than static IOCs?",
                "How quickly do IOCs become stale?",
                "What's the risk of relying solely on IOC-based detection?"
            ]
        },
        "what_would_you_do": {
            "scenario": "You're a SOC analyst and receive threat intel about a new APT campaign targeting your industry. The report includes: 5 malicious IP addresses, 3 domain names, 10 file hashes, and behavioral patterns including 'data staging in %TEMP% folder before exfiltration'.",
            "context": "Your SIEM can ingest IOCs but has limited behavioral detection. The APT is known to rapidly change infrastructure.",
            "question": "How do you operationalize this threat intelligence?",
            "options": [
                {
                    "id": "a",
                    "text": "Add all IPs and domains to firewall block lists immediately",
                    "is_best": False,
                    "feedback": "While blocking is good, APTs rotate infrastructure frequently. You also miss the file hashes and behavioral patterns which may be more persistent.",
                    "consequences": "Initial infrastructure blocked but APT switches to new IPs/domains. You miss subsequent activity."
                },
                {
                    "id": "b",
                    "text": "Import all IOCs into SIEM; create behavioral rule for data staging pattern; brief analysts on campaign TTPs",
                    "is_best": True,
                    "feedback": "Correct! Comprehensive approach: static IOCs for immediate detection, behavioral rules for persistence, analyst awareness for human detection of variations.",
                    "consequences": "Multi-layered detection catches APT activity even when they change infrastructure. Analysts recognize campaign patterns."
                },
                {
                    "id": "c",
                    "text": "Focus only on file hashes since those are most reliable",
                    "is_best": False,
                    "feedback": "File hashes are easily changed by recompiling malware. Network indicators and behavioral patterns often provide better long-term detection value.",
                    "consequences": "APT modifies malware, hashes no longer match. Network and behavioral indicators would have caught the activity."
                },
                {
                    "id": "d",
                    "text": "Wait for your threat intel platform to automatically integrate the IOCs",
                    "is_best": False,
                    "feedback": "Automation is valuable but time-critical threat intel requires immediate action. The behavioral patterns also need manual rule creation.",
                    "consequences": "Delayed response allows APT to establish foothold. Behavioral indicators never operationalized."
                }
            ],
            "key_lesson": "Effective threat intelligence operationalization combines: immediate IOC blocking, SIEM detection rules, behavioral analytics for persistence, and analyst awareness for human pattern recognition."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Detection is only useful if systems are hardened to resist attack. The next lesson covers Hardening and Secure Configuration - how to reduce attack surface and strengthen defenses."
        }
    },
    
    "D2-LESSON-009": {
        "learning_goals": [
            "Apply system hardening principles across different platforms",
            "Implement secure baseline configurations",
            "Remove unnecessary services and reduce attack surface",
            "Validate configurations against security benchmarks"
        ],
        "why_it_matters": {
            "career_impact": "Security engineers spend significant time hardening systems. Understanding secure configuration is essential for building and maintaining secure infrastructure.",
            "business_connection": "Misconfigurations cause 19% of breaches. Proper hardening directly reduces exploitable attack surface and demonstrates compliance with security frameworks.",
            "exam_relevance": "Expect 4-5 questions on hardening. Focus on: attack surface reduction, secure baselines, unnecessary services, and configuration management."
        },
        "hands_on_activity": {
            "title": "Server Hardening Checklist",
            "objective": "Create a hardening plan for a new server deployment",
            "scenario": "NexaTech is deploying a new Linux web server to production. Create a hardening checklist.",
            "steps": [
                "Identify unnecessary services to disable",
                "Define secure configuration settings",
                "Plan account and access controls",
                "Specify monitoring and logging requirements"
            ],
            "exercises": [
                {"category": "Services", "items": ["Disable telnet, use SSH only", "Remove unused packages", "Disable USB storage"]},
                {"category": "Access Control", "items": ["Implement SSH key auth", "Disable root login", "Configure sudo properly"]},
                {"category": "Network", "items": ["Enable host firewall", "Disable IPv6 if unused", "Configure TLS only"]},
                {"category": "Logging", "items": ["Enable auditd", "Configure syslog forwarding", "Monitor auth logs"]}
            ],
            "expected_outcome": "Complete hardening checklist ready for implementation",
            "reflection_questions": [
                "How do you balance security hardening with operational requirements?",
                "What's the role of CIS Benchmarks in hardening?",
                "How do you maintain hardening over time?"
            ]
        },
        "what_would_you_do": {
            "scenario": "You're implementing hardening standards at Meridian Manufacturing. The IT team pushes back saying: 'These servers have worked fine for years. Hardening will break applications and cause downtime.'",
            "context": "The servers haven't been patched in 18 months and run multiple unnecessary services. They host manufacturing control systems.",
            "question": "How do you address this resistance while ensuring security?",
            "options": [
                {
                    "id": "a",
                    "text": "Accept the risk - they know the systems better than you",
                    "is_best": False,
                    "feedback": "18 months without patches and unnecessary services represent significant risk. IT familiarity doesn't reduce vulnerability to attack.",
                    "consequences": "Systems remain vulnerable. When breached, 'IT said it was fine' doesn't help recovery."
                },
                {
                    "id": "b",
                    "text": "Force immediate implementation - security is non-negotiable",
                    "is_best": False,
                    "feedback": "While security is important, forced changes without testing can cause operational issues, especially on manufacturing systems. This creates adversarial relationships.",
                    "consequences": "Hardening breaks applications, production down, IT team hostile to future security initiatives."
                },
                {
                    "id": "c",
                    "text": "Propose phased approach: test hardening in non-prod, create rollback plan, schedule during maintenance window",
                    "is_best": True,
                    "feedback": "Correct! This addresses IT concerns (testing, rollback, timing) while achieving security goals. Collaboration beats confrontation.",
                    "consequences": "Hardening tested safely, issues identified and fixed, production implementation successful, IT team supportive."
                },
                {
                    "id": "d",
                    "text": "Escalate to management to force compliance",
                    "is_best": False,
                    "feedback": "Escalation without attempting collaboration damages relationships. Management may side with operations if you can't address their concerns.",
                    "consequences": "Political battle ensues. Even if you win, IT team becomes actively resistant to security."
                }
            ],
            "key_lesson": "Effective hardening requires collaboration. Address operational concerns through testing, rollback plans, and proper change management. Security through partnership beats security through force."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Hardening reduces attack surface, but some attacks still get through. The next lesson covers Mitigation Techniques - how to respond when attacks occur and minimize damage."
        }
    },
    
    "D2-LESSON-010": {
        "learning_goals": [
            "Select appropriate mitigation techniques for different attack types",
            "Implement defense-in-depth strategies",
            "Apply compensating controls when primary controls are unavailable",
            "Balance security mitigations with operational requirements"
        ],
        "why_it_matters": {
            "career_impact": "Incident responders must quickly identify and apply mitigations during attacks. Knowing the right technique for each situation directly impacts incident outcomes.",
            "business_connection": "Effective mitigation reduces breach impact from millions to thousands. The difference between containing an incident in hours vs days is often proper mitigation knowledge.",
            "exam_relevance": "Expect 4-5 questions on mitigations. Focus on: segmentation, patching strategies, compensating controls, and defense-in-depth."
        },
        "hands_on_activity": {
            "title": "Mitigation Selection Exercise",
            "objective": "Match attacks with appropriate mitigation techniques",
            "scenario": "For each attack scenario, select the most effective mitigation from the options provided.",
            "steps": [
                "Read the attack scenario",
                "Consider available mitigation options",
                "Select the most effective mitigation",
                "Justify your choice"
            ],
            "exercises": [
                {"attack": "Ransomware spreading via lateral movement", "mitigation": "Network segmentation", "reasoning": "Limits spread to affected segment"},
                {"attack": "SQL injection on web application", "mitigation": "WAF + parameterized queries", "reasoning": "WAF provides immediate protection while code is fixed"},
                {"attack": "Zero-day exploit with no patch", "mitigation": "Compensating controls (increased monitoring, network isolation)", "reasoning": "Reduce exposure until patch available"},
                {"attack": "Phishing campaign targeting employees", "mitigation": "Email filtering + security awareness training", "reasoning": "Technical and human controls together"}
            ],
            "expected_outcome": "Correctly match attacks with mitigations and provide sound reasoning",
            "reflection_questions": [
                "When is quarantine more appropriate than blocking?",
                "How do you decide between accepting risk and implementing compensating controls?",
                "What role does monitoring play in mitigation?"
            ]
        },
        "what_would_you_do": {
            "scenario": "A critical vulnerability is announced in your VPN appliance. Vendor patch won't be available for 2 weeks. The VPN is the only way remote employees access internal resources. Exploit code is already public.",
            "context": "500 remote employees depend on VPN access. Alternative access methods don't exist. Business operations would halt without VPN.",
            "question": "How do you mitigate this risk?",
            "options": [
                {
                    "id": "a",
                    "text": "Disable VPN until patch is available - security first",
                    "is_best": False,
                    "feedback": "While secure, this halts business operations for 2 weeks. Security must balance with business needs. There are better options.",
                    "consequences": "Business operations halt, revenue lost, employees unable to work, executive pressure forces VPN back online without mitigations."
                },
                {
                    "id": "b",
                    "text": "Accept the risk - 2 weeks isn't that long",
                    "is_best": False,
                    "feedback": "With public exploit code, 2 weeks is an eternity. Attackers will target vulnerable systems. Risk acceptance is inappropriate here.",
                    "consequences": "Organization breached via VPN exploit. 'We were waiting for the patch' doesn't satisfy regulators or customers."
                },
                {
                    "id": "c",
                    "text": "Implement compensating controls: IP allowlisting, enhanced monitoring, MFA enforcement, IDS signatures for exploit",
                    "is_best": True,
                    "feedback": "Correct! Layered compensating controls significantly reduce risk while maintaining operations. IP allowlisting limits attack surface, monitoring detects attempts, MFA adds authentication layer.",
                    "consequences": "VPN remains operational with reduced risk. Attack attempts detected and blocked. Business continues while waiting for patch."
                },
                {
                    "id": "d",
                    "text": "Immediately deploy alternative remote access solution",
                    "is_best": False,
                    "feedback": "Deploying new infrastructure in emergency mode often creates new vulnerabilities. 2 weeks isn't enough time to properly implement and secure alternatives.",
                    "consequences": "Rushed deployment of alternative creates new security gaps. Users confused, support overwhelmed, security posture actually worse."
                }
            ],
            "key_lesson": "When patches aren't available, compensating controls reduce risk to acceptable levels. Layer multiple controls: reduce attack surface (allowlisting), detect attacks (monitoring/IDS), and add authentication barriers (MFA)."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Understanding mitigations helps when attacks occur. The next lesson covers Attack Frameworks - structured models like MITRE ATT&CK that help us understand, communicate about, and defend against attacks."
        }
    },
    
    "D2-LESSON-011": {
        "learning_goals": [
            "Explain the purpose and structure of MITRE ATT&CK framework",
            "Navigate attack frameworks to understand adversary techniques",
            "Map security controls to framework techniques",
            "Use frameworks for threat hunting and gap analysis"
        ],
        "why_it_matters": {
            "career_impact": "MITRE ATT&CK is the common language of cybersecurity. SOC analysts, threat hunters, and security engineers use it daily for detection, analysis, and communication.",
            "business_connection": "Frameworks enable consistent security communication and measurement. They help organizations identify detection gaps and prioritize security investments.",
            "exam_relevance": "Expect 3-4 questions on frameworks. Focus on: ATT&CK structure (Tactics/Techniques), Cyber Kill Chain phases, and Diamond Model components."
        },
        "hands_on_activity": {
            "title": "ATT&CK Framework Mapping",
            "objective": "Map an attack scenario to MITRE ATT&CK techniques",
            "scenario": "A threat report describes an APT attack. Map each phase to ATT&CK tactics and techniques.",
            "steps": [
                "Read the attack narrative",
                "Identify distinct attack phases",
                "Map each phase to ATT&CK tactic",
                "Identify specific techniques used"
            ],
            "exercises": [
                {"phase": "Sent phishing email with malicious attachment", "tactic": "Initial Access", "technique": "T1566 - Phishing"},
                {"phase": "Malware established connection to C2 server", "tactic": "Command and Control", "technique": "T1071 - Application Layer Protocol"},
                {"phase": "Used Mimikatz to dump credentials", "tactic": "Credential Access", "technique": "T1003 - OS Credential Dumping"},
                {"phase": "Moved to domain controller via RDP", "tactic": "Lateral Movement", "technique": "T1021 - Remote Services"},
                {"phase": "Compressed and exfiltrated data over HTTPS", "tactic": "Exfiltration", "technique": "T1041 - Exfiltration Over C2 Channel"}
            ],
            "expected_outcome": "Complete ATT&CK mapping with tactics and techniques identified",
            "reflection_questions": [
                "How does ATT&CK help with detection engineering?",
                "What's the difference between tactics and techniques?",
                "How can you use ATT&CK for security gap analysis?"
            ]
        },
        "what_would_you_do": {
            "scenario": "Your CISO asks you to assess the organization's detection coverage against ransomware groups. You have access to MITRE ATT&CK and threat intelligence on common ransomware TTPs.",
            "context": "The organization has SIEM, EDR, and network monitoring but isn't sure if these tools detect relevant ransomware techniques.",
            "question": "How do you approach this assessment?",
            "options": [
                {
                    "id": "a",
                    "text": "List all security tools and declare coverage complete",
                    "is_best": False,
                    "feedback": "Having tools doesn't mean having detection. A SIEM without proper rules detects nothing. Coverage must be validated against specific techniques.",
                    "consequences": "False confidence in coverage. Ransomware incident reveals detection gaps that could have been identified."
                },
                {
                    "id": "b",
                    "text": "Map ransomware TTPs to ATT&CK, assess detection capability for each technique, identify gaps",
                    "is_best": True,
                    "feedback": "Correct! ATT&CK provides the framework. Map threat intel to techniques, assess current detection for each, prioritize gaps by likelihood and impact.",
                    "consequences": "Clear picture of coverage and gaps. Prioritized roadmap for detection improvements. CISO can make informed investment decisions."
                },
                {
                    "id": "c",
                    "text": "Focus only on initial access - if we stop them there, nothing else matters",
                    "is_best": False,
                    "feedback": "Defense-in-depth requires detection at multiple phases. Initial access isn't 100% preventable. You need detection throughout the kill chain.",
                    "consequences": "Attacker bypasses initial access detection, moves freely through environment without detection until ransomware detonates."
                },
                {
                    "id": "d",
                    "text": "Run a penetration test to find out what we detect",
                    "is_best": False,
                    "feedback": "While pen tests are valuable, they provide point-in-time results and may not cover all relevant TTPs. Framework-based analysis is more comprehensive.",
                    "consequences": "Pen test covers limited techniques. Gaps in untest techniques remain unknown."
                }
            ],
            "key_lesson": "MITRE ATT&CK enables systematic detection assessment. Map relevant threats to techniques, assess detection capability for each, identify gaps, and prioritize improvements based on threat likelihood and impact."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Frameworks help us understand attacks. The next lesson covers Security Assessments - how to proactively identify vulnerabilities and validate security controls through testing."
        }
    },
    
    "D2-LESSON-012": {
        "learning_goals": [
            "Differentiate between assessment types: vulnerability scans, penetration tests, red team exercises",
            "Select appropriate assessment methods for different objectives",
            "Understand rules of engagement and legal considerations",
            "Interpret assessment results and prioritize remediation"
        ],
        "why_it_matters": {
            "career_impact": "Security assessments validate that controls work. Penetration testers conduct them, security engineers remediate findings, and GRC analysts track compliance.",
            "business_connection": "Assessments identify weaknesses before attackers do. Regular testing is required by most compliance frameworks and demonstrates security due diligence.",
            "exam_relevance": "Expect 4-5 questions on assessments. Focus on: scan vs pentest vs red team distinctions, rules of engagement, and assessment methodologies."
        },
        "hands_on_activity": {
            "title": "Assessment Planning Exercise",
            "objective": "Select appropriate assessment type for different scenarios",
            "scenario": "As a security consultant, recommend the right assessment type for each client need.",
            "steps": [
                "Review the client's objective",
                "Consider scope, resources, and risk tolerance",
                "Recommend assessment type with justification",
                "Define key rules of engagement"
            ],
            "exercises": [
                {"objective": "Find all known vulnerabilities on network", "assessment": "Vulnerability Scan", "reasoning": "Automated, comprehensive, identifies known vulnerabilities"},
                {"objective": "Test if attacker could breach perimeter", "assessment": "Penetration Test", "reasoning": "Manual testing, attempts exploitation, validates controls"},
                {"objective": "Test detection and response capabilities", "assessment": "Red Team Exercise", "reasoning": "Adversarial simulation, tests people/process/technology"},
                {"objective": "Validate compliance with security policy", "assessment": "Security Audit", "reasoning": "Checklist-based, validates controls exist and function"}
            ],
            "expected_outcome": "Correctly match objectives with assessment types",
            "reflection_questions": [
                "When is a vulnerability scan insufficient?",
                "What makes red team different from penetration testing?",
                "Why are rules of engagement critical?"
            ]
        },
        "what_would_you_do": {
            "scenario": "Apex Consulting wants a 'penetration test' of their network. During scoping, you discover they've never had a vulnerability scan, don't have an asset inventory, and want results in 3 days.",
            "context": "Budget is limited. They have a compliance audit in 2 weeks and need documentation of security testing.",
            "question": "What do you recommend?",
            "options": [
                {
                    "id": "a",
                    "text": "Proceed with penetration test as requested - client knows what they need",
                    "is_best": False,
                    "feedback": "Pen testing without asset inventory or baseline scanning is inefficient. You'll spend time discovering what a scan would find faster.",
                    "consequences": "Limited findings in 3 days. Client pays pentest rates for vulnerability discovery. Real exploitation testing doesn't happen."
                },
                {
                    "id": "b",
                    "text": "Start with vulnerability scan + asset discovery, use remaining time for targeted penetration testing of critical findings",
                    "is_best": True,
                    "feedback": "Correct! Proper assessment requires foundation. Scan provides comprehensive baseline efficiently, pentest validates critical issues. This approach maximizes value in limited time.",
                    "consequences": "Complete vulnerability picture, critical findings validated through testing, documentation ready for compliance audit."
                },
                {
                    "id": "c",
                    "text": "Decline the engagement - 3 days isn't enough time",
                    "is_best": False,
                    "feedback": "While timeline is tight, a properly scoped engagement can provide value. Declining doesn't help the client improve security.",
                    "consequences": "Client finds another vendor who may not set proper expectations. Opportunity to guide client toward proper assessment missed."
                },
                {
                    "id": "d",
                    "text": "Perform red team exercise to test their overall security program",
                    "is_best": False,
                    "feedback": "Red team exercises require mature security programs to be valuable. Without basic scanning or asset inventory, they're not ready for red team.",
                    "consequences": "Red team easily succeeds against immature program. Findings too numerous to be actionable. Client overwhelmed."
                }
            ],
            "key_lesson": "Assessment type must match organizational maturity and objectives. Build from foundation: asset inventory → vulnerability scanning → penetration testing → red team. Each level requires the previous to be effective."
        },
        "section_additions": {},
        "summary_addition": {
            "connection_to_next": "Domain 2 complete! You now understand threats, vulnerabilities, and mitigations. Domain 3 covers Security Architecture - how to design secure systems from the ground up."
        }
    }
}

def enhance_lesson(filepath, enhancements):
    """Apply enhancements to a lesson file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lesson = json.load(f)
    
    lesson_id = lesson.get('lesson_id', '')
    
    if lesson_id not in enhancements:
        print(f"  ⏭️  No enhancements defined for {lesson_id}")
        return None
    
    enh = enhancements[lesson_id]
    
    # Add learning_goals to introduction
    if 'learning_goals' in enh:
        if 'introduction' not in lesson:
            lesson['introduction'] = {}
        lesson['introduction']['learning_goals'] = enh['learning_goals']
    
    # Add why_it_matters to introduction
    if 'why_it_matters' in enh:
        if 'introduction' not in lesson:
            lesson['introduction'] = {}
        lesson['introduction']['why_it_matters'] = enh['why_it_matters']
    
    # Add hands_on_activity
    if 'hands_on_activity' in enh:
        lesson['hands_on_activity'] = enh['hands_on_activity']
    
    # Add what_would_you_do
    if 'what_would_you_do' in enh:
        lesson['what_would_you_do'] = enh['what_would_you_do']
    
    # Add section-level enhancements
    if 'section_additions' in enh:
        for section_id, additions in enh['section_additions'].items():
            for section in lesson.get('sections', []):
                if section.get('section_id') == section_id:
                    if 'glossary_terms' in additions:
                        section['glossary_terms'] = additions['glossary_terms']
                    if 'real_world_example' in additions:
                        section['real_world_example'] = additions['real_world_example']
                    if 'exam_tips' in additions:
                        section['exam_tips'] = additions['exam_tips']
    
    # Add connection_to_next to summary
    if 'summary_addition' in enh:
        if 'summary' not in lesson:
            lesson['summary'] = {}
        lesson['summary']['connection_to_next'] = enh['summary_addition']['connection_to_next']
    
    return lesson

def main():
    source_dir = '/mnt/project'
    output_dir = '/home/claude/security-plus-platform/data'
    
    # Files to enhance
    files_to_enhance = [
        'D2-LESSON-004_Malware_Types.json',
        'D2-LESSON-005_Network_Attacks.json',
        'D2-LESSON-006_Application_Attacks.json',
        'D2-LESSON-007_Vulnerability_Management.json',
        'D2-LESSON-008_Indicators_Detection.json',
        'D2-LESSON-009_Hardening_Configurations.json',
        'D2-LESSON-010_Mitigation_Techniques.json',
        'D2-LESSON-011_Attack_Frameworks.json',
        'D2-LESSON-012_Security_Assessments.json',
    ]
    
    print("=" * 70)
    print("PHASE 1: Fixing Critical D2 Lessons")
    print("=" * 70)
    
    for filename in files_to_enhance:
        filepath = os.path.join(source_dir, filename)
        print(f"\n📝 Processing: {filename}")
        
        enhanced = enhance_lesson(filepath, LESSON_ENHANCEMENTS)
        
        if enhanced:
            output_path = os.path.join(output_dir, filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(enhanced, f, indent=2, ensure_ascii=False)
            print(f"  ✅ Enhanced and saved to: {output_path}")
            
            # Report what was added
            lesson_id = enhanced.get('lesson_id', '')
            enh = LESSON_ENHANCEMENTS.get(lesson_id, {})
            additions = []
            if 'learning_goals' in enh:
                additions.append('learning_goals')
            if 'why_it_matters' in enh:
                additions.append('why_it_matters')
            if 'hands_on_activity' in enh:
                additions.append('hands_on_activity')
            if 'what_would_you_do' in enh:
                additions.append('what_would_you_do')
            if 'section_additions' in enh:
                additions.append(f"section enhancements ({len(enh['section_additions'])} sections)")
            if 'summary_addition' in enh:
                additions.append('connection_to_next')
            
            print(f"  📦 Added: {', '.join(additions)}")
    
    print("\n" + "=" * 70)
    print("Phase 1 Complete!")
    print("=" * 70)

if __name__ == '__main__':
    main()
