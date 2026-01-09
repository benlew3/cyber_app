#!/usr/bin/env python3
"""
Phase A2: Add what_would_you_do decision scenarios to D1/D2 lessons
Creates contextually appropriate decision-based scenarios for each lesson
"""

import json
import os

WHAT_WOULD_YOU_DO = {
    "D1-LESSON-002": {
        "scenario": "You're the security lead at Meridian Hospital. The CEO wants to deploy a new patient portal that allows patients to view test results online. The development team says they can have it live in 2 weeks, but a full security review would take 4 weeks.",
        "context": "The hospital's competitors already offer patient portals. There's pressure to launch quickly, but patient health data (PHI) would be exposed if breached.",
        "question": "How do you balance the CIA triad requirements with business pressure?",
        "options": [
            {
                "id": "a",
                "text": "Launch in 2 weeks - availability and business needs come first",
                "is_best": False,
                "feedback": "Launching without security review puts patient data confidentiality at severe risk. Healthcare breaches average $10.9M and trigger regulatory penalties.",
                "consequences": "Portal launches with SQL injection vulnerability. 50,000 patient records exposed within 3 months."
            },
            {
                "id": "b",
                "text": "Delay to 4 weeks for full security review, communicate timeline to stakeholders",
                "is_best": True,
                "feedback": "Correct! Confidentiality of PHI must be prioritized. A 2-week delay is minor compared to breach costs. Communicate the risk clearly to leadership.",
                "consequences": "Portal launches securely. No incidents. Patients trust the hospital with their data."
            },
            {
                "id": "c",
                "text": "Launch in 2 weeks with limited features, complete review on remaining features",
                "is_best": False,
                "feedback": "Partial launches still expose attack surface. If authentication or core data access isn't reviewed, the 'limited' features could still lead to breach.",
                "consequences": "Limited portal still has authentication flaws. Attackers compromise patient accounts."
            },
            {
                "id": "d",
                "text": "Refuse to approve any launch until a 12-week comprehensive audit is complete",
                "is_best": False,
                "feedback": "While security-focused, this is excessive and damages security's credibility. A proportionate 4-week review addresses real risks without unnecessary delay.",
                "consequences": "Business loses patience, launches without security approval. Relationship with security team damaged."
            }
        ],
        "key_lesson": "The CIA triad requires balance, but for healthcare, confidentiality of patient data must be prioritized. Communicate risks clearly and propose reasonable timelines that address real threats."
    },
    
    "D1-LESSON-003": {
        "scenario": "GlobalFinance is implementing MFA for all employees. The CISO wants hardware tokens for everyone. The CFO says tokens cost too much and SMS OTP is 'good enough.' Users complain any MFA is too inconvenient.",
        "context": "Budget is constrained. A recent competitor was breached via credential stuffing attack. Employees work from home and office.",
        "question": "What MFA strategy do you recommend?",
        "options": [
            {
                "id": "a",
                "text": "SMS OTP for everyone - it's better than nothing and meets budget",
                "is_best": False,
                "feedback": "SMS is vulnerable to SIM swapping and SS7 attacks. For a financial institution, this provides inadequate protection against sophisticated attackers.",
                "consequences": "Attacker uses SIM swap to intercept CFO's SMS codes, gains access to financial systems."
            },
            {
                "id": "b",
                "text": "Hardware tokens for privileged users, authenticator app for standard users",
                "is_best": True,
                "feedback": "Correct! Risk-based approach: strongest protection for highest-risk accounts, strong but cost-effective protection for others. Authenticator apps are free and more secure than SMS.",
                "consequences": "Credential stuffing attacks blocked. Privileged accounts have extra protection. Budget stays reasonable."
            },
            {
                "id": "c",
                "text": "Hardware tokens for everyone, no exceptions",
                "is_best": False,
                "feedback": "While most secure, ignoring budget constraints damages security's credibility and may result in no MFA at all if budget is denied.",
                "consequences": "CFO rejects proposal. Project stalls. Organization remains vulnerable."
            },
            {
                "id": "d",
                "text": "Let users choose their preferred MFA method",
                "is_best": False,
                "feedback": "User choice leads to weakest options being selected. Security requirements should drive MFA selection, not user preference.",
                "consequences": "Most users choose SMS. Security posture inconsistent. Attackers target users with weakest MFA."
            }
        ],
        "key_lesson": "Apply risk-based authentication: strongest factors for highest-risk accounts, strong and practical factors for everyone else. Balance security with budget and usability."
    },
    
    "D1-LESSON-004": {
        "scenario": "You're designing encryption for SecureHealth's new mobile app. The app stores patient data locally for offline access. Development team wants to use MD5 for password hashing because 'it's fast' and AES-128 for data encryption because 'it's good enough.'",
        "context": "The app will store PHI. Users expect the app to work offline in areas with poor connectivity. Performance on older phones is a concern.",
        "question": "What cryptographic approach do you recommend?",
        "options": [
            {
                "id": "a",
                "text": "Accept the team's proposal - MD5 and AES-128 will work fine",
                "is_best": False,
                "feedback": "MD5 is cryptographically broken and should never be used for passwords. Fast hashing is actually bad for passwords because it enables brute force attacks.",
                "consequences": "Password database leaked. MD5 hashes cracked in hours. All patient accounts compromised."
            },
            {
                "id": "b",
                "text": "Require bcrypt/Argon2 for passwords, AES-256 for data encryption",
                "is_best": True,
                "feedback": "Correct! Password hashing must be slow (bcrypt/Argon2) to resist brute force. AES-256 provides appropriate protection for PHI. Performance impact is minimal on modern devices.",
                "consequences": "App launches securely. Even if device is stolen, data remains protected."
            },
            {
                "id": "c",
                "text": "Use SHA-256 for passwords since it's not broken like MD5",
                "is_best": False,
                "feedback": "SHA-256 is a fast hash, not designed for passwords. Fast = bad for passwords because attackers can try billions of guesses quickly. Need purpose-built password hashing.",
                "consequences": "SHA-256 password hashes cracked with GPU farm in days."
            },
            {
                "id": "d",
                "text": "Don't store any data locally - require constant connectivity",
                "is_best": False,
                "feedback": "This ignores the legitimate business requirement for offline access. Security should enable business needs, not block them.",
                "consequences": "App unusable in rural areas. Patients can't access their data when needed most."
            }
        ],
        "key_lesson": "Use cryptographic algorithms for their intended purpose: slow password hashing (bcrypt/Argon2) for passwords, strong symmetric encryption (AES-256) for data at rest."
    },
    
    "D1-LESSON-005": {
        "scenario": "Pinnacle Insurance is planning Zero Trust migration. The network team says 'we already have a firewall and VPN - that's zero trust.' The application team wants to wait until all apps are modernized. The CISO wants everything done in 6 months.",
        "context": "Current architecture: perimeter firewall, VPN for remote access, flat internal network, mix of legacy and modern applications.",
        "question": "How do you approach Zero Trust implementation?",
        "options": [
            {
                "id": "a",
                "text": "Agree with network team - existing perimeter is sufficient",
                "is_best": False,
                "feedback": "Perimeter security is the opposite of Zero Trust. VPN grants broad access once connected, and flat networks allow lateral movement. This misunderstands Zero Trust fundamentals.",
                "consequences": "Attacker compromises one system, moves laterally across flat network, exfiltrates data."
            },
            {
                "id": "b",
                "text": "Wait for application modernization before starting Zero Trust",
                "is_best": False,
                "feedback": "Zero Trust can be implemented incrementally alongside legacy systems. Waiting indefinitely leaves the organization vulnerable.",
                "consequences": "Modernization takes years. Organization breached while waiting for 'perfect' implementation."
            },
            {
                "id": "c",
                "text": "Phased approach: start with identity (MFA everywhere), then network segmentation, then application-level controls",
                "is_best": True,
                "feedback": "Correct! Zero Trust is a journey. Start with identity verification (immediate impact), add network micro-segmentation, then implement application-aware policies. Include legacy systems with compensating controls.",
                "consequences": "Immediate security improvement. Gradual transition. Legacy apps protected with available controls while modernization continues."
            },
            {
                "id": "d",
                "text": "Implement complete Zero Trust in 6 months as CISO requested",
                "is_best": False,
                "feedback": "6 months is unrealistic for complete Zero Trust transformation. Setting unrealistic expectations leads to shortcuts or project failure.",
                "consequences": "Project fails to meet deadline. Leadership loses confidence. Zero Trust initiative abandoned."
            }
        ],
        "key_lesson": "Zero Trust is a journey, not a destination. Implement incrementally: identity first, then network segmentation, then application controls. Include legacy systems with compensating controls."
    },
    
    "D1-LESSON-006": {
        "scenario": "You're assessing physical security at DataVault's new data center. The building has badge access at the main entrance, but you observe: employees holding doors for others, cleaning staff using propped-open side doors, and server room badges working 24/7 for all IT staff.",
        "context": "The data center hosts financial and healthcare data for multiple clients. Compliance audits are scheduled next quarter.",
        "question": "What physical security issues do you prioritize?",
        "options": [
            {
                "id": "a",
                "text": "Focus only on the server room - that's where the valuable data is",
                "is_best": False,
                "feedback": "Defense in depth requires multiple layers. If outer layers fail, server room is the last defense. Tailgating and propped doors bypass all access controls.",
                "consequences": "Unauthorized person tailgates into building, accesses server room during off-hours using stolen badge."
            },
            {
                "id": "b",
                "text": "Address all issues: anti-tailgating controls, eliminate propped doors, implement time-based server room access",
                "is_best": True,
                "feedback": "Correct! Physical security requires layered controls. Anti-tailgating (mantraps, sensors), door prop alarms, and least-privilege time-based access all work together.",
                "consequences": "Multiple layers of control implemented. Attempted intrusion detected and stopped at building entry."
            },
            {
                "id": "c",
                "text": "Install cameras everywhere - that will deter bad behavior",
                "is_best": False,
                "feedback": "Cameras are detective controls, not preventive. They record incidents but don't stop them. You need controls that actually prevent unauthorized access.",
                "consequences": "Camera footage shows unauthorized access after the fact. Data already stolen."
            },
            {
                "id": "d",
                "text": "Implement strict policies and train employees - technology can't fix behavior",
                "is_best": False,
                "feedback": "Training alone is insufficient. Technical controls (mantraps, door sensors) enforce policy. People will take shortcuts without enforcement mechanisms.",
                "consequences": "Employees trained but continue holding doors for politeness. Policy exists but isn't enforced."
            }
        ],
        "key_lesson": "Physical security requires layered controls (defense in depth) and technical enforcement of policies. Training alone is insufficient - design systems that make violations difficult."
    },
    
    "D1-LESSON-007": {
        "scenario": "Your SOC is overwhelmed with alerts. The security team proposes deploying honeypots across the network. The IT team is concerned honeypots could be exploited to attack production systems. Legal is worried about entrapment issues.",
        "context": "Current detection relies on signature-based tools with high false positive rates. You've had two undetected breaches in the past year.",
        "question": "How do you address the concerns and implement deception technology?",
        "options": [
            {
                "id": "a",
                "text": "Skip honeypots due to the concerns - too risky",
                "is_best": False,
                "feedback": "Deception technologies provide high-fidelity alerts (any interaction is suspicious). The concerns are addressable with proper implementation.",
                "consequences": "Third breach occurs. Attacker dwells for 200+ days undetected. Traditional tools continue failing."
            },
            {
                "id": "b",
                "text": "Deploy honeypots with network isolation, no real data, monitored 24/7, and legal approval for authorized use policy",
                "is_best": True,
                "feedback": "Correct! Address each concern: network isolation prevents pivot attacks, no real data limits exposure, monitoring ensures alerts are actioned, legal policy clarifies authorized use.",
                "consequences": "Honeypot alerts on attacker reconnaissance within hours of breach. Incident contained quickly."
            },
            {
                "id": "c",
                "text": "Deploy production-like honeypots with real data for maximum realism",
                "is_best": False,
                "feedback": "Real data in honeypots creates unnecessary risk. Attackers don't need real data to be detected - any interaction with the honeypot is suspicious regardless of data authenticity.",
                "consequences": "Attacker compromises honeypot, finds real customer data, exfiltrates it."
            },
            {
                "id": "d",
                "text": "Replace all detection tools with honeypots",
                "is_best": False,
                "feedback": "Deception complements other detection methods, it doesn't replace them. You still need signature detection, behavioral analysis, and other tools.",
                "consequences": "Signature-based attacks succeed because those tools were removed. Honeypots only catch exploring attackers."
            }
        ],
        "key_lesson": "Deception technologies provide high-fidelity detection but must be implemented carefully: isolated from production, containing no real sensitive data, monitored actively, with clear legal authorization."
    },
    
    "D1-LESSON-008": {
        "scenario": "It's Friday at 4 PM. A critical zero-day vulnerability is announced affecting your VPN appliance. The vendor released an emergency patch. Your change management policy requires CAB approval (next meeting: Monday), testing in non-prod (3 days), and a scheduled maintenance window (next Saturday).",
        "context": "The vulnerability is being actively exploited in the wild. Your VPN is internet-facing and serves 2,000 remote employees.",
        "question": "How do you handle this emergency change?",
        "options": [
            {
                "id": "a",
                "text": "Follow normal change process - wait for Monday CAB meeting",
                "is_best": False,
                "feedback": "Active exploitation + internet-facing + 3+ day wait = high probability of compromise. Change processes should have emergency provisions.",
                "consequences": "Organization compromised Sunday morning. Attackers in network before patch applied."
            },
            {
                "id": "b",
                "text": "Invoke emergency change process: CISO approval, abbreviated testing, immediate deployment with rollback plan",
                "is_best": True,
                "feedback": "Correct! Emergency changes bypass normal CAB for critical security issues. Get appropriate executive approval, verify patch authenticity, create rollback plan, deploy immediately.",
                "consequences": "Patch applied Friday evening. Attack attempts logged but blocked. Full documentation completed Monday."
            },
            {
                "id": "c",
                "text": "Apply the patch immediately without any approval or testing",
                "is_best": False,
                "feedback": "Even emergency changes need some process: verify patch is authentic (not attacker-supplied), have rollback plan, get appropriate approval. 'No process' creates new risks.",
                "consequences": "Patch applied but causes VPN outage. No rollback plan. 2,000 employees unable to work remotely over weekend."
            },
            {
                "id": "d",
                "text": "Disable the VPN until Monday when proper change process can be followed",
                "is_best": False,
                "feedback": "This trades one availability impact (potential breach) for a certain one (disabling remote access). Better to fix the problem than disable the service.",
                "consequences": "2,000 employees unable to work. Business operations severely impacted. Customers affected."
            }
        ],
        "key_lesson": "Change management processes must include emergency provisions for critical security issues. Document after the fact, but act quickly with appropriate authorization when active threats exist."
    },
    
    "D2-LESSON-001": {
        "scenario": "Your threat intelligence team identifies two potential threats: (1) A hacktivist group has tweeted threats against your industry, and (2) Threat intel indicates an APT group known for stealing trade secrets is targeting companies in your sector. Budget allows addressing only one thoroughly.",
        "context": "Your company develops proprietary manufacturing processes worth billions. You're also a visible brand that has received negative press recently.",
        "question": "Which threat do you prioritize resources against?",
        "options": [
            {
                "id": "a",
                "text": "Prioritize hacktivists - they've made public threats and are more immediate",
                "is_best": False,
                "feedback": "Hacktivists are typically lower capability and seek publicity, not long-term access. Their threats are often unfulfilled. APTs are patient and devastating.",
                "consequences": "Focus on hacktivist defense. APT quietly establishes persistence. Trade secrets exfiltrated over 6 months."
            },
            {
                "id": "b",
                "text": "Prioritize APT defense - nation-state threats to intellectual property are existential",
                "is_best": True,
                "feedback": "Correct! APT groups targeting trade secrets represent existential threat to a manufacturing company. They're patient, sophisticated, and persistent. Hacktivists typically cause embarrassment, not destruction.",
                "consequences": "Enhanced detection catches APT reconnaissance. Attack disrupted before data exfiltration."
            },
            {
                "id": "c",
                "text": "Split resources 50/50 between both threats",
                "is_best": False,
                "feedback": "Splitting limited resources means neither threat is addressed adequately. Prioritization based on impact and likelihood is essential.",
                "consequences": "Defenses inadequate for both. APT succeeds due to insufficient monitoring."
            },
            {
                "id": "d",
                "text": "Ignore both - your existing controls should handle any threat",
                "is_best": False,
                "feedback": "Threat-informed defense improves control effectiveness. Different threat actors require different detection and response strategies.",
                "consequences": "Generic controls miss APT techniques. Breach occurs and goes undetected."
            }
        ],
        "key_lesson": "Prioritize threats based on capability, intent, and potential impact to your specific organization. Nation-state APTs targeting your core assets deserve more resources than opportunistic hacktivists."
    },
    
    "D2-LESSON-002": {
        "scenario": "Your attack surface assessment reveals: (1) 50 internet-facing web applications, (2) 200 SaaS applications with SSO integration, (3) Legacy VPN that's been 'scheduled for replacement' for 2 years, (4) Employee personal devices accessing email. Budget allows hardening only two areas this quarter.",
        "context": "Recent breaches in your industry came through VPN vulnerabilities (40%) and SaaS misconfigurations (35%).",
        "question": "Which attack surfaces do you prioritize?",
        "options": [
            {
                "id": "a",
                "text": "Web applications - you have the most of them",
                "is_best": False,
                "feedback": "Quantity isn't the only factor. Threat intelligence shows VPN and SaaS are higher-risk vectors in your industry. Prioritize based on threat data.",
                "consequences": "Web apps hardened but breach occurs through legacy VPN, matching industry pattern."
            },
            {
                "id": "b",
                "text": "Legacy VPN and SaaS applications - they match the industry threat pattern",
                "is_best": True,
                "feedback": "Correct! Threat-informed prioritization focuses on attack vectors actually being exploited. VPN (40%) and SaaS (35%) represent 75% of industry breaches.",
                "consequences": "VPN replaced with Zero Trust solution. SaaS configurations audited. Attack surface significantly reduced."
            },
            {
                "id": "c",
                "text": "Personal devices - BYOD is uncontrolled and risky",
                "is_best": False,
                "feedback": "While BYOD has risks, it's not the leading attack vector in your industry. Address the threats most likely to be exploited first.",
                "consequences": "BYOD controls implemented but breach occurs through unpatched VPN."
            },
            {
                "id": "d",
                "text": "Wait until budget allows addressing all four areas",
                "is_best": False,
                "feedback": "Waiting leaves known vulnerabilities exposed. Prioritize and act now, then address remaining areas in future quarters.",
                "consequences": "Breach occurs while waiting for complete funding. Could have been prevented with available budget."
            }
        ],
        "key_lesson": "Use threat intelligence to prioritize attack surface reduction. Focus on vectors actually being exploited in your industry, not just the largest or most visible surfaces."
    },
    
    "D2-LESSON-003": {
        "scenario": "An employee reports receiving a call from 'IT Support' asking them to install remote access software to fix a problem. The caller knew the employee's name, department, and that they'd submitted a help desk ticket last week. The employee is unsure if it was legitimate.",
        "context": "Your help desk does sometimes call users. The caller ID showed your company's main number. The employee didn't install anything yet.",
        "question": "How do you handle this situation?",
        "options": [
            {
                "id": "a",
                "text": "It's probably legitimate - help desk calls users all the time",
                "is_best": False,
                "feedback": "Attackers research targets (OSINT) and spoof caller ID. The specific knowledge makes this MORE suspicious, not less - it shows reconnaissance.",
                "consequences": "Employee calls back 'IT' at the number they provided. Attacker gains remote access."
            },
            {
                "id": "b",
                "text": "Verify by calling the help desk directly using the number from the company directory, not any number the caller provided",
                "is_best": True,
                "feedback": "Correct! Always verify through known-good channels. Call the help desk using the official number to confirm they initiated the call. This defeats caller ID spoofing.",
                "consequences": "Help desk confirms they never called. Vishing attempt identified. Security alert sent to all employees."
            },
            {
                "id": "c",
                "text": "Ask the caller security questions to verify they're really IT",
                "is_best": False,
                "feedback": "Attackers may have researched answers to common security questions. The person being verified shouldn't control the verification process.",
                "consequences": "Attacker passes security questions using information from LinkedIn and company website. Attack proceeds."
            },
            {
                "id": "d",
                "text": "Block all help desk calls to users - it's too risky",
                "is_best": False,
                "feedback": "This overreacts and harms legitimate IT operations. The solution is verification procedures, not eliminating helpful communication.",
                "consequences": "IT support effectiveness degraded. User satisfaction drops. Shadow IT increases."
            }
        ],
        "key_lesson": "Verify suspicious communications through known-good channels (official directory, internal website) - never through information provided by the suspicious contact. Caller ID can be spoofed."
    },
    
    "D2-LESSON-004": {
        "scenario": "Your EDR alerts on a workstation: PowerShell executing encoded commands, no malicious files on disk, legitimate Windows tools (WMI, certutil) being used unusually, data being staged in temp folder. The user is a finance manager with access to sensitive data.",
        "context": "The behavior started 30 minutes ago. The finance manager claims they didn't do anything unusual.",
        "question": "What type of attack is this and how do you respond?",
        "options": [
            {
                "id": "a",
                "text": "Run antivirus scan - it will find and remove the malware",
                "is_best": False,
                "feedback": "This is fileless malware operating in memory using legitimate tools. Traditional AV scans for files - there are no malicious files to find.",
                "consequences": "AV scan finds nothing. Attacker continues operating. Data exfiltrated while you scan."
            },
            {
                "id": "b",
                "text": "Fileless malware - isolate the system immediately and capture memory for forensics",
                "is_best": True,
                "feedback": "Correct! The indicators (memory-only, using legitimate tools, no files) clearly indicate fileless/living-off-the-land attack. Network isolation stops exfiltration. Memory capture preserves evidence.",
                "consequences": "System isolated within minutes. Memory forensics reveals full attack chain. Threat contained."
            },
            {
                "id": "c",
                "text": "Reboot the system to clear the malware from memory",
                "is_best": False,
                "feedback": "Reboot destroys forensic evidence and may trigger persistence mechanisms. The attacker may have established persistence that survives reboot.",
                "consequences": "Memory evidence lost. WMI persistence mechanism survives reboot. Attack continues."
            },
            {
                "id": "d",
                "text": "Wait and monitor to understand what the attacker is doing",
                "is_best": False,
                "feedback": "Data staging indicates imminent exfiltration. Waiting means losing sensitive financial data. Act immediately when exfiltration is indicated.",
                "consequences": "While monitoring, attacker completes exfiltration. Sensitive financial data lost."
            }
        ],
        "key_lesson": "Fileless malware operates in memory using legitimate tools - traditional file-based AV won't detect it. Isolate immediately, capture memory for forensics, and investigate persistence mechanisms."
    },
    
    "D2-LESSON-005": {
        "scenario": "Your e-commerce site is experiencing slowness on Black Friday (peak sales day). Monitoring shows: traffic 10x normal, 70% from a single country where you don't sell products, mostly hitting the search function repeatedly, real customers can barely complete purchases.",
        "context": "Every minute of downtime costs approximately $50,000 in lost revenue. Your infrastructure is cloud-hosted with auto-scaling enabled.",
        "question": "What's happening and how do you respond?",
        "options": [
            {
                "id": "a",
                "text": "Auto-scaling will handle it - just wait for more capacity to spin up",
                "is_best": False,
                "feedback": "This appears to be an application-layer DDoS targeting search. Scaling adds cost but doesn't solve the problem - attack traffic scales with your infrastructure.",
                "consequences": "Auto-scaling costs explode. Attack traffic consumes new capacity. Real customers still can't purchase."
            },
            {
                "id": "b",
                "text": "Application-layer DDoS - implement geo-blocking for non-customer countries and rate limiting on search",
                "is_best": True,
                "feedback": "Correct! L7 DDoS targets specific application functions. Geo-blocking reduces attack volume (70%), rate limiting protects search function, real customers from selling countries can purchase.",
                "consequences": "Attack traffic drops 70%. Search rate-limited. Real customers complete purchases. Revenue protected."
            },
            {
                "id": "c",
                "text": "Take the site offline until the attack stops",
                "is_best": False,
                "feedback": "This achieves the attacker's goal for them. Black Friday revenue lost. There are better mitigations available.",
                "consequences": "Site offline for 4 hours. $12M+ revenue lost. Attacker wins."
            },
            {
                "id": "d",
                "text": "Block the top attacking IP addresses at the firewall",
                "is_best": False,
                "feedback": "DDoS uses many IP addresses. Blocking individual IPs is ineffective - attackers have thousands more. Need pattern-based blocking.",
                "consequences": "You block 100 IPs. Attack continues from 10,000 others. Whack-a-mole ineffective."
            }
        ],
        "key_lesson": "Application-layer DDoS requires application-aware mitigation: geo-blocking, rate limiting, CAPTCHA for suspicious patterns. IP blocking alone is ineffective against distributed attacks."
    },
    
    "D2-LESSON-006": {
        "scenario": "A penetration tester reports finding SQL injection on your customer login page. They demonstrate bypassing authentication with ' OR '1'='1. The application handles credit card data. Go-live is scheduled for next week.",
        "context": "The development team says fixing it properly requires 3 weeks to implement parameterized queries throughout the application. The business is pressuring for on-time launch.",
        "question": "How do you handle this critical vulnerability?",
        "options": [
            {
                "id": "a",
                "text": "Launch on time - implement input filtering as a quick fix",
                "is_best": False,
                "feedback": "Input filtering/blacklisting is bypassable. SQL injection with credit card data = PCI violation and breach risk. This is not acceptable for launch.",
                "consequences": "Attacker bypasses filter with encoding tricks. 100,000 credit cards stolen. PCI fines, lawsuits, brand damage."
            },
            {
                "id": "b",
                "text": "Delay launch, implement WAF immediately as compensating control while code is fixed properly",
                "is_best": True,
                "feedback": "Correct! WAF provides immediate protection while parameterized queries are implemented properly. Delay is necessary - SQL injection with payment data cannot be accepted.",
                "consequences": "Launch delayed 3 weeks. WAF blocks attack attempts during fix. Application launches securely."
            },
            {
                "id": "c",
                "text": "Launch on time with enhanced monitoring to detect exploitation",
                "is_best": False,
                "feedback": "Detective controls don't prevent data theft. By the time you detect SQL injection exploitation, data is already stolen. Prevention required.",
                "consequences": "SQL injection exploited. Monitoring alerts after 10,000 records stolen."
            },
            {
                "id": "d",
                "text": "Remove the login page and require all customers to call in",
                "is_best": False,
                "feedback": "This overreaction destroys the business case for the application. Fix the vulnerability, don't eliminate the functionality.",
                "consequences": "No customers use phone-only system. Application project canceled. Development investment lost."
            }
        ],
        "key_lesson": "SQL injection with sensitive data (PCI, PHI) is a showstopper. Use WAF as immediate compensating control while implementing proper fix (parameterized queries). Never launch with known critical vulnerabilities."
    },
    
    "D2-LESSON-007": {
        "scenario": "Your vulnerability scan shows 2,000 findings. Management wants them all fixed in 30 days. Your team can realistically fix 200/month. The highest-CVSS finding (9.8) is on an internal legacy system. A CVSS 7.5 finding is on your internet-facing payment portal.",
        "context": "Resources are limited. The legacy system processes internal reports only. The payment portal handles $10M/month in transactions.",
        "question": "How do you approach vulnerability prioritization?",
        "options": [
            {
                "id": "a",
                "text": "Fix by CVSS score - highest scores first (start with the 9.8)",
                "is_best": False,
                "feedback": "CVSS alone ignores context. The 9.8 is internal-only; the 7.5 is internet-facing with payment data. Asset criticality and exposure must factor into prioritization.",
                "consequences": "Fix internal system while payment portal exploited. $10M in transactions at risk."
            },
            {
                "id": "b",
                "text": "Risk-based prioritization: internet-facing + payment data + CVSS together. Fix payment portal first.",
                "is_best": True,
                "feedback": "Correct! Risk = likelihood × impact. Internet-facing (higher likelihood) × payment data (higher impact) makes the 7.5 higher actual risk than the internal 9.8.",
                "consequences": "Payment portal secured first. Risk reduced where exposure and impact are highest."
            },
            {
                "id": "c",
                "text": "Promise to fix all 2,000 in 30 days since management requested it",
                "is_best": False,
                "feedback": "Promising impossible outcomes destroys credibility. Set realistic expectations and prioritize effectively with available resources.",
                "consequences": "Team burns out trying to meet impossible goal. Quality suffers. Critical vulnerabilities missed."
            },
            {
                "id": "d",
                "text": "Fix only the internet-facing vulnerabilities - ignore internal systems",
                "is_best": False,
                "feedback": "Internal systems matter too - attackers who breach the perimeter will target them. Prioritize internet-facing first, but don't ignore internal risks.",
                "consequences": "External systems secured but attacker pivots from phishing compromise to vulnerable internal systems."
            }
        ],
        "key_lesson": "Risk-based prioritization considers CVSS + asset value + exposure + threat intelligence. Don't blindly follow CVSS scores - a 7.5 on internet-facing critical assets may be higher risk than a 9.8 on isolated internal systems."
    },
    
    "D2-LESSON-008": {
        "scenario": "Threat intel reports that an APT group is targeting your industry using: 3 malicious IP addresses, 2 domains, 5 file hashes, and a behavioral pattern of 'PowerShell downloading files from cloud storage during off-hours.' Your SIEM can accept IOCs but has basic behavioral detection.",
        "context": "The APT is known to rotate infrastructure frequently. Your SOC monitors alerts but doesn't proactively hunt.",
        "question": "How do you operationalize this threat intelligence?",
        "options": [
            {
                "id": "a",
                "text": "Block all the IPs and domains at the firewall - quick and effective",
                "is_best": False,
                "feedback": "APTs rotate infrastructure. Blocking only the listed IPs/domains provides short-term protection. You're missing file hashes and behavioral detection entirely.",
                "consequences": "APT switches to new infrastructure. Your blocks are outdated within days. Attack proceeds undetected."
            },
            {
                "id": "b",
                "text": "Import all IOCs to SIEM, create behavioral detection rule for PowerShell pattern, brief SOC analysts on campaign TTPs",
                "is_best": True,
                "feedback": "Correct! Comprehensive approach: static IOCs for immediate detection, behavioral rules for persistence (don't rely on rotating infrastructure), analyst awareness for human pattern recognition.",
                "consequences": "Static IOCs catch initial attempts. Behavioral rule detects variant using new infrastructure. Analyst recognizes related activity."
            },
            {
                "id": "c",
                "text": "Focus only on file hashes - those are the most reliable indicators",
                "is_best": False,
                "feedback": "File hashes change easily (recompile malware). Network indicators and especially behavioral patterns provide more persistent detection value.",
                "consequences": "APT modifies malware. Hashes no longer match. Network and behavioral indicators would have caught them."
            },
            {
                "id": "d",
                "text": "Wait for automatic integration from your threat intel platform",
                "is_best": False,
                "feedback": "Time-sensitive intel requires immediate action. Automation is great for bulk IOCs, but actionable campaign intel needs prompt manual integration, especially behavioral rules.",
                "consequences": "Two-day delay in integration. APT establishes persistence before IOCs active."
            }
        ],
        "key_lesson": "Operationalize threat intel comprehensively: static IOCs for immediate detection, behavioral rules for persistence, and analyst awareness for pattern recognition. Behavioral indicators often outlast infrastructure IOCs."
    },
    
    "D2-LESSON-009": {
        "scenario": "You're implementing hardening standards at a manufacturing company. The IT team pushes back: 'These servers have run fine for 5 years. Hardening will break our production applications. We can't afford downtime.'",
        "context": "The servers run Windows Server 2012 (end of life), have 50+ unnecessary services running, and haven't been patched in 18 months. They control manufacturing equipment.",
        "question": "How do you address resistance while achieving security?",
        "options": [
            {
                "id": "a",
                "text": "Accept the risk - they know the systems better than security does",
                "is_best": False,
                "feedback": "Unpatched, EOL systems with unnecessary services are high risk. IT familiarity doesn't reduce vulnerability to attack. Security must advocate for necessary changes.",
                "consequences": "Systems compromised via known vulnerability. Manufacturing down for days. 'IT said it was fine' doesn't help recovery."
            },
            {
                "id": "b",
                "text": "Phased approach: test in lab, create rollback plan, schedule during maintenance window, start with quick wins",
                "is_best": True,
                "feedback": "Correct! Address IT concerns (testing, rollback, timing) while achieving security goals. Start with low-risk changes to build trust. Collaboration beats confrontation.",
                "consequences": "Hardening tested safely. Issues found and fixed in lab. Production changes successful. IT team becomes security ally."
            },
            {
                "id": "c",
                "text": "Escalate to executive management to force compliance",
                "is_best": False,
                "feedback": "Escalation without attempting collaboration damages relationships. Even if you win, IT becomes resistant to future security initiatives.",
                "consequences": "Political battle. Even if you win, IT team hostile. Future security projects face resistance."
            },
            {
                "id": "d",
                "text": "Implement all hardening immediately during next maintenance window",
                "is_best": False,
                "feedback": "Forced changes without testing on production manufacturing systems risks operational impact. Manufacturing downtime may cost more than a security incident.",
                "consequences": "Hardening breaks manufacturing application. Production down for 8 hours. IT blames security."
            }
        ],
        "key_lesson": "Effective hardening requires collaboration. Address operational concerns through testing, rollback plans, and proper change management. Security through partnership beats security through force."
    },
    
    "D2-LESSON-010": {
        "scenario": "A critical zero-day vulnerability is announced in your VPN appliance. Actively exploited in the wild. Vendor patch available but requires 4-hour maintenance window. Your VPN serves 5,000 remote workers. No maintenance window scheduled for 5 days.",
        "context": "Your organization has strict change management. The CISO is traveling internationally. It's Tuesday afternoon.",
        "question": "How do you mitigate this actively exploited zero-day?",
        "options": [
            {
                "id": "a",
                "text": "Wait for scheduled maintenance window - change management exists for a reason",
                "is_best": False,
                "feedback": "5 days wait with active exploitation is unacceptable. Change management should have emergency provisions for critical security issues.",
                "consequences": "Organization breached on day 3. Attackers pivot to internal network. 'We were waiting for maintenance window' doesn't satisfy anyone."
            },
            {
                "id": "b",
                "text": "Invoke emergency change: implement compensating controls now (IP allowlist, enhanced monitoring, MFA verification), schedule emergency patch tonight",
                "is_best": True,
                "feedback": "Correct! Layered immediate response: compensating controls reduce exposure now, emergency patch application tonight. Document emergency change afterward.",
                "consequences": "Compensating controls block exploit attempts. Patch applied overnight with minimal impact. Attack thwarted."
            },
            {
                "id": "c",
                "text": "Disable the VPN until patch can be properly scheduled",
                "is_best": False,
                "feedback": "Disabling VPN for 5+ days impacts 5,000 workers. This trades a potential security issue for a certain operational disaster. Better solutions exist.",
                "consequences": "5,000 workers unable to access systems. Business operations severely impacted. Customers affected."
            },
            {
                "id": "d",
                "text": "Apply patch immediately without any approval process",
                "is_best": False,
                "feedback": "Even emergency changes need some process: verify patch authenticity, have rollback plan, notify stakeholders. 'No process' creates new risks.",
                "consequences": "Patch applied but causes compatibility issue. No rollback plan. VPN down for hours."
            }
        ],
        "key_lesson": "Emergency changes for critical vulnerabilities require: immediate compensating controls to reduce exposure, expedited patching with rollback plan, and documentation after the fact. Don't let process prevent necessary security action."
    },
    
    "D2-LESSON-011": {
        "scenario": "Your CISO asks you to assess detection coverage against ransomware. You have SIEM, EDR, and network monitoring. You pull a MITRE ATT&CK mapping for recent ransomware groups and find coverage gaps in: Initial Access (T1566-Phishing), Credential Access (T1003-Credential Dumping), and Lateral Movement (T1021-Remote Services).",
        "context": "Budget is limited. You can improve detection in one area this quarter.",
        "question": "Which detection gap do you prioritize?",
        "options": [
            {
                "id": "a",
                "text": "Initial Access (Phishing) - stop them at the door",
                "is_best": False,
                "feedback": "While prevention is ideal, phishing will occasionally succeed despite controls. Defense-in-depth requires detection throughout the kill chain, not just at entry.",
                "consequences": "Phishing detection improved, but attacker gets through with sophisticated lure. No detection of subsequent activity."
            },
            {
                "id": "b",
                "text": "Credential Access - credential theft precedes lateral movement and ransomware deployment",
                "is_best": True,
                "feedback": "Correct! Credential theft is a chokepoint in ransomware attacks. Detecting credential dumping (Mimikatz, LSASS access) catches attackers after initial access but before they can spread.",
                "consequences": "Credential dumping attempt detected. Incident contained to single system. Ransomware deployment prevented."
            },
            {
                "id": "c",
                "text": "Lateral Movement - that's closest to ransomware deployment",
                "is_best": False,
                "feedback": "By lateral movement, attackers have credentials and are spreading. Detection here is valuable but catching credential theft earlier provides more response time.",
                "consequences": "Lateral movement detected but attacker already has domain admin credentials. Containment difficult."
            },
            {
                "id": "d",
                "text": "Fix all three equally - spreading resources across gaps",
                "is_best": False,
                "feedback": "Limited budget spread across three areas means none are done well. Prioritize the highest-value detection gap.",
                "consequences": "All three areas slightly improved. None reach effective detection threshold. Attack succeeds through weakest point."
            }
        ],
        "key_lesson": "Use ATT&CK to prioritize detection investments. Identify chokepoints where most attack paths converge. Credential access is a common chokepoint - nearly all ransomware attacks require credential theft."
    },
    
    "D2-LESSON-012": {
        "scenario": "A client asks for a 'security assessment' of their network. During scoping, you learn: they've never had a vulnerability scan, don't have an asset inventory, have a compliance audit in 2 weeks, and want 'a pentest like the big companies get' with a 5-day timeline and $10,000 budget.",
        "context": "You're a security consultant. The client seems to expect a full penetration test will solve their security concerns.",
        "question": "What assessment approach do you recommend?",
        "options": [
            {
                "id": "a",
                "text": "Perform the penetration test they requested - client knows what they want",
                "is_best": False,
                "feedback": "Pentesting without asset inventory or baseline scanning is inefficient. You'll spend pentest time discovering what a scan would find faster. They need crawl before run.",
                "consequences": "Pentest time spent on discovery. Limited exploitation testing. Client pays premium rates for vulnerability scanning work."
            },
            {
                "id": "b",
                "text": "Start with asset discovery and vulnerability scanning, use remaining time for targeted testing of critical findings",
                "is_best": True,
                "feedback": "Correct! Build foundation first. Asset discovery + vulnerability scan provides comprehensive view efficiently. Targeted testing of critical findings maximizes value. Documentation supports compliance audit.",
                "consequences": "Complete picture of assets and vulnerabilities. Critical issues tested and confirmed. Documentation ready for compliance audit."
            },
            {
                "id": "c",
                "text": "Decline the engagement - they're not mature enough for security assessment",
                "is_best": False,
                "feedback": "Every organization needs to start somewhere. Proper scoping and expectation setting helps clients improve. Declining doesn't help their security.",
                "consequences": "Client hires less ethical consultant who delivers inappropriate assessment. Client's security doesn't improve."
            },
            {
                "id": "d",
                "text": "Recommend a 6-month security program instead of a point-in-time assessment",
                "is_best": False,
                "feedback": "While a program would be beneficial, it doesn't address immediate needs (compliance audit in 2 weeks). Start with what they need now, then propose ongoing work.",
                "consequences": "Client goes elsewhere for immediate need. You lose opportunity to help and build relationship."
            }
        ],
        "key_lesson": "Match assessment type to organizational maturity. Organizations without asset inventory or vulnerability baselines need scanning before penetration testing. Build the foundation, then test it."
    }
}


def add_what_would_you_do(data_dir):
    """Add what_would_you_do to lessons that are missing them"""
    
    print("=" * 80)
    print("PHASE A2: Adding what_would_you_do to D1/D2 lessons")
    print("=" * 80)
    
    added = 0
    skipped = 0
    
    for lesson_id, scenario in WHAT_WOULD_YOU_DO.items():
        # Find the file
        for filename in os.listdir(data_dir):
            if lesson_id in filename and filename.endswith('.json'):
                filepath = os.path.join(data_dir, filename)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    lesson = json.load(f)
                
                # Only add if missing
                if not lesson.get('what_would_you_do'):
                    lesson['what_would_you_do'] = scenario
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        json.dump(lesson, f, indent=2, ensure_ascii=False)
                    
                    print(f"✅ {lesson_id}: Added what_would_you_do scenario")
                    added += 1
                else:
                    print(f"⏭️  {lesson_id}: Already has what_would_you_do")
                    skipped += 1
                
                break
    
    print("\n" + "=" * 80)
    print(f"Phase A2 Complete: {added} added, {skipped} skipped")
    print("=" * 80)


if __name__ == '__main__':
    data_dir = '/home/claude/security-plus-platform/data'
    add_what_would_you_do(data_dir)
