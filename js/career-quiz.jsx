const { useState, useMemo } = React;

// Complete career data with match reasons
const careerPaths = {
  soc_analyst: {
    name: "SOC Analyst (Tier 1)",
    shortName: "SOC Analyst",
    category: "Security Operations",
    description: "Front-line defenders monitoring security alerts and responding to threats in real-time.",
    responsibilities: ["Monitor SIEM dashboards", "Triage security alerts", "Investigate incidents", "Document findings", "Escalate threats"],
    dayToDay: "Review 50-100+ alerts daily, investigate suspicious activity, document in ticketing systems, coordinate with IT, work shifts including nights/weekends.",
    salary: { entry: 65000, mid: 85000, bayArea: 95000, senior: 110000 },
    trajectory: "SOC T1 → T2 → T3 → SOC Lead → SOC Manager → Director of SecOps",
    entryDifficulty: "Easier",
    remote: "Mixed",
    interestTags: ["real-time monitoring", "incident investigation", "fast-paced", "shift work", "detective work"],
    skillTags: ["IT support", "troubleshooting", "attention to detail", "documentation", "customer service"],
    matchReasons: {
      interest: ["You enjoy investigative work and solving mysteries", "Fast-paced environments energize you", "Real-time problem solving appeals to you"],
      skills: ["Your troubleshooting experience translates directly", "Documentation skills are essential here", "Customer service background helps with stakeholder communication"]
    }
  },
  security_analyst: {
    name: "Information Security Analyst",
    shortName: "Security Analyst",
    category: "Security Operations",
    description: "General security role monitoring networks, implementing protections, and developing security standards.",
    responsibilities: ["Monitor networks for breaches", "Install security software", "Prepare incident reports", "Develop security standards", "Conduct awareness training"],
    dayToDay: "Review security logs, respond to alerts, coordinate patches with IT, research emerging threats, implement security tools, occasional staff training.",
    salary: { entry: 70000, mid: 95000, bayArea: 125000, senior: 135000 },
    trajectory: "Security Analyst → Senior Analyst → Security Manager → Director → CISO",
    entryDifficulty: "Easier",
    remote: "Mixed",
    interestTags: ["variety", "security monitoring", "tool implementation", "threat research", "standards development"],
    skillTags: ["IT support", "system administration", "documentation", "communication", "analysis"],
    matchReasons: {
      interest: ["You want variety in your daily work", "Building and implementing security appeals to you", "You enjoy both technical and communication tasks"],
      skills: ["Your IT background provides strong foundation", "Analysis skills transfer directly", "Communication abilities help with cross-team work"]
    }
  },
  cyber_specialist: {
    name: "Cybersecurity Specialist",
    shortName: "Cyber Specialist",
    category: "General Security",
    description: "Broad entry-level role covering multiple security functions, common at smaller organizations.",
    responsibilities: ["Implement security controls", "Respond to incidents", "Perform vulnerability assessments", "Maintain documentation", "Support compliance"],
    dayToDay: "Jack-of-all-trades: morning vulnerability scans, afternoon firewall rules, policy updates, phishing reports, compliance documentation.",
    salary: { entry: 62000, mid: 82000, bayArea: 105000, senior: 115000 },
    trajectory: "Specialist → Senior Specialist → Security Analyst → Manager → Director",
    entryDifficulty: "Easier",
    remote: "Mixed",
    interestTags: ["variety", "generalist", "learning breadth", "small teams", "autonomy"],
    skillTags: ["IT support", "adaptability", "self-starter", "documentation", "problem-solving"],
    matchReasons: {
      interest: ["You prefer variety over deep specialization", "Wearing multiple hats appeals to you", "You want broad exposure to security domains"],
      skills: ["Your adaptability is perfect for this role", "General IT knowledge provides foundation", "Self-direction skills valued in smaller teams"]
    }
  },
  grc_analyst: {
    name: "GRC Analyst",
    shortName: "GRC",
    category: "Governance & Compliance",
    description: "Focus on policies, frameworks, audits, and regulatory compliance. Heavy documentation and stakeholder work.",
    responsibilities: ["Conduct risk assessments", "Write security policies", "Prepare for audits", "Track remediation", "Manage vendor assessments"],
    dayToDay: "Review policy documents, meet with control owners, gather audit evidence, update risk registers, prepare compliance reports, coordinate with auditors.",
    salary: { entry: 75000, mid: 100000, bayArea: 115000, senior: 140000 },
    trajectory: "GRC Analyst → Senior → GRC Manager → Director of Risk → VP/CISO",
    entryDifficulty: "Moderate",
    remote: "Highly Remote (60%+)",
    interestTags: ["documentation", "stakeholder communication", "frameworks", "risk analysis", "process improvement", "audits"],
    skillTags: ["project management", "documentation", "stakeholder management", "vendor management", "contract review", "Excel", "presentation"],
    matchReasons: {
      interest: ["You enjoy structured frameworks and processes", "Stakeholder communication energizes you", "Risk analysis and strategic thinking appeal to you"],
      skills: ["Your deal desk experience maps directly to vendor risk assessment", "Contract review skills transfer to policy analysis", "Stakeholder management is a core GRC competency"]
    }
  },
  compliance_analyst: {
    name: "Compliance Analyst",
    shortName: "Compliance",
    category: "Governance & Compliance",
    description: "Ensure organization meets regulatory requirements like HIPAA, PCI-DSS, GDPR through assessments and documentation.",
    responsibilities: ["Monitor regulations", "Conduct gap assessments", "Develop documentation", "Support audits", "Train staff on requirements"],
    dayToDay: "Review regulatory updates, assess compliance gaps, prepare audit documentation, train employees, track compliance tasks to completion.",
    salary: { entry: 68000, mid: 90000, bayArea: 110000, senior: 125000 },
    trajectory: "Compliance Analyst → Senior → Compliance Manager → Director → Chief Compliance Officer",
    entryDifficulty: "Easier",
    remote: "Highly Remote (55%+)",
    interestTags: ["regulations", "documentation", "process", "training others", "attention to detail"],
    skillTags: ["legal knowledge", "documentation", "attention to detail", "communication", "audit experience"],
    matchReasons: {
      interest: ["You find regulations and requirements interesting", "Creating order from complexity appeals to you", "You enjoy ensuring things are done correctly"],
      skills: ["Your attention to detail is essential for compliance", "Documentation skills directly applicable", "Process orientation aligns with compliance work"]
    }
  },
  it_auditor: {
    name: "IT Security Auditor",
    shortName: "IT Auditor",
    category: "Governance & Compliance",
    description: "Evaluate security controls, ensure compliance, identify gaps through systematic audits and testing.",
    responsibilities: ["Plan and execute audits", "Test control effectiveness", "Document findings", "Track remediation", "Present to management"],
    dayToDay: "Review documentation, interview control owners, test security controls, write audit reports, follow up on remediation items.",
    salary: { entry: 75000, mid: 105000, bayArea: 125000, senior: 145000 },
    trajectory: "IT Auditor → Senior Auditor → Audit Manager → IT Audit Director → Chief Audit Executive",
    entryDifficulty: "Moderate",
    remote: "Hybrid (some client travel)",
    interestTags: ["investigation", "evaluation", "finding issues", "documentation", "independence"],
    skillTags: ["audit experience", "accounting", "documentation", "interviewing", "critical thinking"],
    matchReasons: {
      interest: ["You enjoy evaluating systems and finding gaps", "Independent assessment work appeals to you", "You like structured evaluation methodologies"],
      skills: ["Analytical background translates to control testing", "Documentation skills essential for audit reports", "Critical thinking valued in audit work"]
    }
  },
  privacy_analyst: {
    name: "Privacy Analyst",
    shortName: "Privacy",
    category: "Governance & Compliance",
    description: "Focus on data privacy, GDPR/CCPA compliance, and proper handling of personal information.",
    responsibilities: ["Privacy impact assessments", "Manage data subject requests", "Monitor regulations", "Develop privacy policies", "Support audits"],
    dayToDay: "Process privacy requests (DSARs), assess projects for privacy issues, update privacy notices, train employees, ensure data handling compliance.",
    salary: { entry: 72000, mid: 98000, bayArea: 118000, senior: 140000 },
    trajectory: "Privacy Analyst → Senior → Privacy Manager → Chief Privacy Officer",
    entryDifficulty: "Moderate",
    remote: "Highly Remote (60%+)",
    interestTags: ["data protection", "regulations", "advocacy", "policy", "ethics"],
    skillTags: ["legal knowledge", "documentation", "stakeholder communication", "data management", "attention to detail"],
    matchReasons: {
      interest: ["Data protection and privacy rights matter to you", "You care about ethical data handling", "Regulatory interpretation interests you"],
      skills: ["Legal/regulatory knowledge applies directly", "Stakeholder communication essential", "Process documentation skills transfer well"]
    }
  },
  vulnerability_analyst: {
    name: "Vulnerability Management Analyst",
    shortName: "Vuln Analyst",
    category: "Security Operations",
    description: "Identify, track, and help remediate security vulnerabilities across systems and applications.",
    responsibilities: ["Run vulnerability scans", "Analyze and prioritize findings", "Coordinate remediation", "Track SLAs", "Generate reports"],
    dayToDay: "Schedule scans, analyze thousands of findings, create remediation tickets, follow up with system owners, research CVEs, generate trend reports.",
    salary: { entry: 72000, mid: 95000, bayArea: 118000, senior: 125000 },
    trajectory: "Vuln Analyst → Senior → Vuln Manager → Pen Tester or Security Architect",
    entryDifficulty: "Moderate",
    remote: "Highly Remote (65%+)",
    interestTags: ["finding weaknesses", "analysis", "prioritization", "remediation tracking", "research"],
    skillTags: ["data analysis", "prioritization", "communication", "technical aptitude", "project tracking"],
    matchReasons: {
      interest: ["Finding and fixing weaknesses appeals to you", "Systematic scanning and analysis interests you", "You enjoy tracking issues to resolution"],
      skills: ["Data analysis skills apply to scan results", "Project tracking experience relevant", "Technical communication abilities valued"]
    }
  },
  incident_response: {
    name: "Incident Response Analyst",
    shortName: "IR Analyst",
    category: "Security Operations",
    description: "Respond to and investigate security incidents, contain threats, help organizations recover from attacks.",
    responsibilities: ["Respond to incidents", "Contain and eradicate threats", "Collect evidence", "Root cause analysis", "Improve detection"],
    dayToDay: "Quiet: update playbooks, tabletop exercises. Active incidents: intense investigation, evidence collection, stakeholder coordination, long hours.",
    salary: { entry: 78000, mid: 105000, bayArea: 128000, senior: 145000 },
    trajectory: "IR Analyst → Senior IR → IR Lead → IR Manager → Director of IR",
    entryDifficulty: "Harder",
    remote: "Mixed (on-site for major incidents)",
    interestTags: ["crisis response", "investigation", "pressure situations", "forensics", "containment"],
    skillTags: ["calm under pressure", "investigation", "documentation", "communication", "technical troubleshooting"],
    matchReasons: {
      interest: ["You thrive in high-pressure situations", "Crisis response and investigation excite you", "Being the first responder appeals to you"],
      skills: ["Ability to stay calm under pressure is critical", "Investigation skills directly applicable", "Clear communication during crisis valued"]
    }
  },
  threat_intel: {
    name: "Threat Intelligence Analyst",
    shortName: "Threat Intel",
    category: "Intelligence",
    description: "Research and analyze threat actors, tactics, and emerging threats. Blend of research and technical analysis.",
    responsibilities: ["Monitor threat feeds", "Analyze threat actor TTPs", "Write intelligence reports", "Track IOCs", "Support threat hunting"],
    dayToDay: "Review threat feeds, research threat actors, analyze malware at high level, write reports, brief stakeholders on emerging threats.",
    salary: { entry: 75000, mid: 100000, bayArea: 120000, senior: 145000 },
    trajectory: "Threat Intel Analyst → Senior → Lead → Manager → Director",
    entryDifficulty: "Harder",
    remote: "Highly Remote (70%+)",
    interestTags: ["research", "geopolitics", "threat actors", "writing", "analysis", "patterns"],
    skillTags: ["research", "writing", "analysis", "pattern recognition", "critical thinking"],
    matchReasons: {
      interest: ["Deep research and analysis appeal to you", "Understanding adversaries interests you", "You enjoy connecting dots and finding patterns"],
      skills: ["Research skills directly applicable", "Strong writing essential for reports", "Analytical thinking valued for threat assessment"]
    }
  },
  dfir: {
    name: "Digital Forensics Analyst",
    shortName: "DFIR",
    category: "Forensics",
    description: "Investigate breaches, analyze compromised systems, recover evidence for incident response and legal proceedings.",
    responsibilities: ["Acquire digital evidence", "Analyze disk/memory images", "Recover deleted data", "Document chain of custody", "Write forensic reports"],
    dayToDay: "Image drives maintaining chain of custody, analyze file systems, recover evidence, create timelines, write detailed forensic reports.",
    salary: { entry: 72000, mid: 100000, bayArea: 118000, senior: 145000 },
    trajectory: "Forensics Analyst → Senior → Lead → Forensics Manager → Director",
    entryDifficulty: "Harder",
    remote: "Mixed (evidence handling)",
    interestTags: ["investigation", "evidence", "puzzles", "meticulous work", "legal proceedings"],
    skillTags: ["attention to detail", "documentation", "patience", "analytical thinking", "methodical approach"],
    matchReasons: {
      interest: ["Uncovering what happened fascinates you", "Meticulous investigation work appeals to you", "You enjoy piecing together evidence"],
      skills: ["Extreme attention to detail essential", "Documentation skills critical for legal use", "Methodical approach required for forensics"]
    }
  },
  pentester: {
    name: "Junior Penetration Tester",
    shortName: "Pen Tester",
    category: "Offensive Security",
    description: "Ethically hack systems to find vulnerabilities before malicious actors. Creative problem-solving required.",
    responsibilities: ["Conduct authorized pen tests", "Identify and exploit vulnerabilities", "Write technical reports", "Present findings", "Stay current on attacks"],
    dayToDay: "Scope engagements, run reconnaissance, attempt exploitation, document findings meticulously, write professional reports, present to clients.",
    salary: { entry: 80000, mid: 110000, bayArea: 125000, senior: 155000 },
    trajectory: "Jr Pen Tester → Pen Tester → Senior → Lead → Red Team Lead → Director",
    entryDifficulty: "Harder",
    remote: "Mostly Remote",
    interestTags: ["hacking", "breaking things", "creativity", "puzzles", "offensive mindset"],
    skillTags: ["programming", "networking", "problem-solving", "persistence", "technical writing"],
    matchReasons: {
      interest: ["Breaking into systems excites you", "You think like an attacker", "Creative problem-solving is your strength"],
      skills: ["Technical aptitude essential for exploitation", "Programming skills help with custom tools", "Persistence required for complex attacks"]
    }
  },
  security_engineer: {
    name: "Junior Security Engineer",
    shortName: "Security Engineer",
    category: "Engineering",
    description: "Design and implement secure systems, deploy security tools, automate security processes.",
    responsibilities: ["Implement security tools", "Configure firewalls/SIEM", "Automate security processes", "Develop architectures", "Support incident response"],
    dayToDay: "Configure security tools, write automation scripts, deploy new solutions, attend architecture reviews, on-call rotation for security infrastructure.",
    salary: { entry: 90000, mid: 120000, bayArea: 145000, senior: 180000 },
    trajectory: "Jr Security Engineer → Engineer → Senior → Staff → Principal → Director",
    entryDifficulty: "Harder",
    remote: "Highly Remote (70%+)",
    interestTags: ["building", "automation", "architecture", "coding", "infrastructure"],
    skillTags: ["programming", "system administration", "automation", "cloud platforms", "infrastructure"],
    matchReasons: {
      interest: ["Building secure systems excites you", "Automation and efficiency appeal to you", "You prefer creating over monitoring"],
      skills: ["Programming skills directly applicable", "System administration translates to security tools", "Automation experience highly valued"]
    }
  },
  cloud_security: {
    name: "Cloud Security Analyst",
    shortName: "Cloud Security",
    category: "Engineering",
    description: "Secure cloud environments (AWS, Azure, GCP), implement cloud-native controls, ensure cloud compliance.",
    responsibilities: ["Monitor cloud security", "Configure IAM/security groups", "Implement cloud security tools", "Ensure cloud compliance", "Review architectures"],
    dayToDay: "Review cloud configs for misconfigurations, investigate Security Hub findings, implement controls, work with DevOps on secure deployments.",
    salary: { entry: 95000, mid: 125000, bayArea: 150000, senior: 185000 },
    trajectory: "Jr Cloud Security → Cloud Security Engineer → Senior → Architect → Director",
    entryDifficulty: "Harder",
    remote: "Highly Remote (80%+)",
    interestTags: ["cloud", "automation", "modern technology", "DevOps", "infrastructure"],
    skillTags: ["AWS/Azure/GCP", "infrastructure as code", "scripting", "DevOps", "system administration"],
    matchReasons: {
      interest: ["Cloud technology fascinates you", "Modern infrastructure appeals to you", "You want to work with cutting-edge tech"],
      skills: ["Cloud platform experience directly applicable", "IaC skills valuable for security automation", "DevOps background provides foundation"]
    }
  },
  appsec: {
    name: "Application Security Analyst",
    shortName: "AppSec",
    category: "Engineering",
    description: "Secure software applications throughout development. Work with developers to find and fix code vulnerabilities.",
    responsibilities: ["Security code reviews", "Run SAST/DAST scans", "Identify vulnerabilities", "Train developers", "Implement secure SDLC"],
    dayToDay: "Review code for security issues, run SAST/DAST scans, triage findings with developers, participate in threat modeling, train on secure coding.",
    salary: { entry: 85000, mid: 115000, bayArea: 138000, senior: 165000 },
    trajectory: "Jr AppSec → AppSec Engineer → Senior → Lead → AppSec Director",
    entryDifficulty: "Harder",
    remote: "Highly Remote (75%+)",
    interestTags: ["code", "development", "finding bugs", "secure coding", "SDLC"],
    skillTags: ["programming", "software development", "code review", "OWASP knowledge", "communication"],
    matchReasons: {
      interest: ["Finding bugs in code excites you", "Software security appeals to you", "You enjoy working with developers"],
      skills: ["Programming background essential", "Code review experience directly applicable", "Developer empathy helps with communication"]
    }
  },
  iam_analyst: {
    name: "IAM Analyst",
    shortName: "IAM",
    category: "Identity Security",
    description: "Manage user identities and access controls, implement authentication, ensure proper permissions.",
    responsibilities: ["Manage identity platforms", "Implement MFA", "Conduct access reviews", "Configure SSO", "Support privileged access"],
    dayToDay: "Process access requests, configure SSO integrations, quarterly access reviews, troubleshoot authentication, maintain identity platforms.",
    salary: { entry: 78000, mid: 105000, bayArea: 125000, senior: 155000 },
    trajectory: "IAM Analyst → Senior → IAM Engineer → IAM Architect → Director",
    entryDifficulty: "Moderate",
    remote: "Highly Remote (70%+)",
    interestTags: ["access control", "identity", "process", "troubleshooting", "platforms"],
    skillTags: ["IT support", "system administration", "process documentation", "customer service", "scripting"],
    matchReasons: {
      interest: ["Identity and access management interests you", "Process-oriented work appeals to you", "You enjoy platform administration"],
      skills: ["IT support background relevant", "Process documentation skills transfer", "Customer service helps with access requests"]
    }
  },
  network_security: {
    name: "Network Security Administrator",
    shortName: "Network Security",
    category: "Infrastructure",
    description: "Secure network infrastructure including firewalls, VPNs, IDS/IPS, and network segmentation.",
    responsibilities: ["Configure firewalls", "Manage VPNs", "Implement segmentation", "Monitor traffic", "Respond to network incidents"],
    dayToDay: "Configure firewall rules, troubleshoot VPN issues, monitor network traffic, implement security changes, document configurations.",
    salary: { entry: 70000, mid: 95000, bayArea: 115000, senior: 130000 },
    trajectory: "Network Security Admin → Senior → Network Security Engineer → Architect",
    entryDifficulty: "Moderate",
    remote: "Mixed (physical infrastructure)",
    interestTags: ["networking", "infrastructure", "firewalls", "troubleshooting", "architecture"],
    skillTags: ["networking", "troubleshooting", "system administration", "documentation", "CCNA"],
    matchReasons: {
      interest: ["Network infrastructure fascinates you", "Firewall and traffic analysis appeal to you", "You enjoy infrastructure work"],
      skills: ["Networking background directly applicable", "Troubleshooting skills essential", "System admin experience provides foundation"]
    }
  },
  security_awareness: {
    name: "Security Awareness Specialist",
    shortName: "Security Awareness",
    category: "Training",
    description: "Educate organizations about security, develop training programs, run phishing simulations, change culture.",
    responsibilities: ["Develop training content", "Run phishing simulations", "Track program metrics", "Present to employees", "Create campaigns"],
    dayToDay: "Create training materials, run phishing sims, analyze click rates, develop awareness campaigns, present to new hires, report metrics.",
    salary: { entry: 65000, mid: 85000, bayArea: 105000, senior: 120000 },
    trajectory: "Specialist → Senior → Manager → Director of Security Awareness",
    entryDifficulty: "Easier",
    remote: "Highly Remote (75%+)",
    interestTags: ["teaching", "communication", "behavior change", "content creation", "metrics"],
    skillTags: ["training", "presentation", "content creation", "communication", "data analysis", "HR background"],
    matchReasons: {
      interest: ["Teaching and educating others energizes you", "Behavior change and culture interest you", "Content creation appeals to you"],
      skills: ["Training/education background directly applicable", "Presentation skills essential", "Communication abilities highly valued"]
    }
  },
  security_consultant: {
    name: "Security Consultant",
    shortName: "Security Consultant",
    category: "Consulting",
    description: "Advise organizations on security strategy, conduct assessments, help implement improvements across varied clients.",
    responsibilities: ["Conduct assessments", "Develop recommendations", "Write reports", "Present to clients", "Support senior consultants"],
    dayToDay: "Work with clients remotely or on-site, conduct interviews, review documentation, test controls, write reports, present recommendations.",
    salary: { entry: 78000, mid: 110000, bayArea: 125000, senior: 165000 },
    trajectory: "Jr Consultant → Consultant → Senior → Manager → Director → Partner",
    entryDifficulty: "Moderate",
    remote: "Hybrid (client travel)",
    interestTags: ["variety", "client work", "advisory", "travel", "learning quickly"],
    skillTags: ["communication", "consulting", "presentation", "adaptability", "client management"],
    matchReasons: {
      interest: ["Variety of clients and projects appeals to you", "Advisory and strategic work interests you", "You enjoy learning new industries quickly"],
      skills: ["Client management experience transfers", "Presentation skills essential", "Adaptability valued across varied engagements"]
    }
  },
  security_sales: {
    name: "Security Sales Engineer",
    shortName: "Security Sales",
    category: "Sales",
    description: "Combine technical knowledge with sales to help organizations choose security solutions. Highest earning potential.",
    responsibilities: ["Product demonstrations", "Respond to RFPs", "Support account executives", "Build customer relationships", "Present at events"],
    dayToDay: "Demo security products, meet prospects, answer technical questions, help craft proposals, attend conferences, work with sales to close deals.",
    salary: { entry: 95000, mid: 140000, bayArea: 160000, senior: 250000 },
    trajectory: "Sales Engineer → Senior SE → Principal SE → SE Director → VP Sales Engineering",
    entryDifficulty: "Moderate",
    remote: "Hybrid (customer meetings)",
    interestTags: ["sales", "demos", "relationships", "presentations", "high earnings", "competition"],
    skillTags: ["sales", "presentation", "technical aptitude", "relationship building", "deal management"],
    matchReasons: {
      interest: ["Sales cycles and closing deals excite you", "Product demonstrations appeal to you", "High earning potential motivates you"],
      skills: ["Your deal desk experience is directly relevant", "Sales operations background provides foundation", "Relationship skills transfer to customer work"]
    }
  },
  malware_analyst: {
    name: "Malware Analyst",
    shortName: "Malware Analyst",
    category: "Threat Analysis",
    description: "Analyze malicious software to understand behavior and develop defenses. Reverse engineering and deep analysis.",
    responsibilities: ["Analyze malware samples", "Reverse engineer code", "Document behavior", "Extract IOCs", "Write technical reports"],
    dayToDay: "Receive samples, set up analysis environment, run dynamic/static analysis, document findings, extract indicators, write detailed reports.",
    salary: { entry: 75000, mid: 100000, bayArea: 120000, senior: 145000 },
    trajectory: "Jr Malware Analyst → Analyst → Senior → Lead → Research Director",
    entryDifficulty: "Harder",
    remote: "Highly Remote",
    interestTags: ["reverse engineering", "puzzles", "deep analysis", "malware", "research"],
    skillTags: ["programming", "assembly", "reverse engineering", "analysis", "patience"],
    matchReasons: {
      interest: ["Reverse engineering fascinates you", "Deep technical analysis appeals to you", "Understanding how things work excites you"],
      skills: ["Programming skills essential for analysis", "Patience required for complex analysis", "Analytical thinking valued for malware research"]
    }
  },
  data_security: {
    name: "Data Security Analyst",
    shortName: "Data Security",
    category: "Data Protection",
    description: "Protect sensitive data through classification, encryption, DLP, and data governance programs.",
    responsibilities: ["Data classification", "Manage DLP", "Monitor for exfiltration", "Support encryption", "Investigate incidents"],
    dayToDay: "Review DLP alerts, investigate potential leaks, work on classification with business units, configure policies, ensure compliance.",
    salary: { entry: 72000, mid: 95000, bayArea: 118000, senior: 135000 },
    trajectory: "Data Security Analyst → Senior → Data Security Engineer → Manager → Director",
    entryDifficulty: "Moderate",
    remote: "Highly Remote (65%+)",
    interestTags: ["data protection", "classification", "DLP", "investigation", "governance"],
    skillTags: ["data management", "analysis", "communication", "attention to detail", "process"],
    matchReasons: {
      interest: ["Protecting sensitive data matters to you", "Data governance appeals to you", "You enjoy preventing data leaks"],
      skills: ["Data management experience relevant", "Analytical skills apply to DLP investigation", "Process orientation valued for classification"]
    }
  }
};

// ============= COMPREHENSIVE QUESTION BANK =============

const interestQuestions = [
  {
    id: 'int1',
    type: 'multiselect',
    section: 'interest',
    question: "What types of work activities genuinely excite you? (Select ALL that apply)",
    instruction: "Be completely honest - there are no wrong answers. Select everything that sounds appealing.",
    minSelect: 2,
    options: [
      { text: "Investigating incidents and solving mysteries", tags: ["investigation", "detective work", "incident investigation", "puzzles"], careers: { soc_analyst: 3, incident_response: 3, dfir: 3, threat_intel: 2 } },
      { text: "Writing detailed policies, reports, and documentation", tags: ["documentation", "writing", "policy"], careers: { grc_analyst: 3, compliance_analyst: 3, privacy_analyst: 2, it_auditor: 2 } },
      { text: "Building systems and automating processes", tags: ["building", "automation", "infrastructure"], careers: { security_engineer: 3, cloud_security: 3, appsec: 2 } },
      { text: "Breaking into systems to find weaknesses", tags: ["hacking", "offensive mindset", "breaking things"], careers: { pentester: 3 } },
      { text: "Presenting to executives and stakeholders", tags: ["stakeholder communication", "presentation", "advisory"], careers: { grc_analyst: 2, security_sales: 3, security_awareness: 2, security_consultant: 3 } },
      { text: "Researching threat actors and attack trends", tags: ["research", "threat actors", "patterns"], careers: { threat_intel: 3, malware_analyst: 2 } },
      { text: "Configuring firewalls and network devices", tags: ["networking", "infrastructure", "firewalls"], careers: { network_security: 3, security_engineer: 1 } },
      { text: "Managing user access and permissions", tags: ["access control", "identity", "process"], careers: { iam_analyst: 3 } },
      { text: "Teaching and training others", tags: ["teaching", "training others", "behavior change"], careers: { security_awareness: 3, security_consultant: 1 } },
      { text: "Real-time monitoring and rapid response", tags: ["real-time monitoring", "fast-paced", "shift work"], careers: { soc_analyst: 3, incident_response: 2, security_analyst: 2 } },
      { text: "Helping customers solve problems", tags: ["client work", "relationships", "advisory"], careers: { security_sales: 3, security_consultant: 2 } },
      { text: "Conducting audits and evaluating controls", tags: ["evaluation", "audits", "finding issues"], careers: { it_auditor: 3, grc_analyst: 2, compliance_analyst: 2 } },
      { text: "Scanning for and analyzing vulnerabilities", tags: ["finding weaknesses", "analysis", "scanning"], careers: { vulnerability_analyst: 3, pentester: 2 } },
      { text: "Working with cloud platforms (AWS, Azure, GCP)", tags: ["cloud", "modern technology", "DevOps"], careers: { cloud_security: 3, security_engineer: 2 } },
      { text: "Reviewing code for security issues", tags: ["code", "secure coding", "development"], careers: { appsec: 3, security_engineer: 1 } },
      { text: "Analyzing malware and reverse engineering", tags: ["reverse engineering", "malware", "deep analysis"], careers: { malware_analyst: 3, threat_intel: 1, dfir: 1 } },
      { text: "Ensuring data privacy and protection", tags: ["data protection", "ethics", "advocacy"], careers: { privacy_analyst: 3, data_security: 3, compliance_analyst: 1 } },
      { text: "Closing deals and earning commission", tags: ["sales", "high earnings", "competition"], careers: { security_sales: 3 } }
    ]
  },
  {
    id: 'int2',
    type: 'multiselect',
    section: 'interest',
    question: "What work environment characteristics are most important to you? (Select ALL that apply)",
    instruction: "Think about where you do your best work.",
    minSelect: 2,
    options: [
      { text: "Work from home / fully remote", tags: ["remote"], careers: { grc_analyst: 2, security_engineer: 2, threat_intel: 2, cloud_security: 2, privacy_analyst: 2, vulnerability_analyst: 2 } },
      { text: "Predictable hours and work-life balance", tags: ["work-life balance"], careers: { grc_analyst: 2, security_awareness: 2, iam_analyst: 2, compliance_analyst: 2, privacy_analyst: 2 } },
      { text: "Fast-paced, adrenaline-driven work", tags: ["fast-paced", "pressure situations"], careers: { soc_analyst: 2, incident_response: 3, pentester: 1 } },
      { text: "Variety in daily tasks", tags: ["variety", "generalist"], careers: { security_consultant: 3, cyber_specialist: 2, security_analyst: 2 } },
      { text: "Deep specialization in one area", tags: ["specialization"], careers: { pentester: 2, malware_analyst: 2, cloud_security: 2, dfir: 2 } },
      { text: "Working independently with autonomy", tags: ["autonomy", "independence"], careers: { threat_intel: 2, dfir: 2, vulnerability_analyst: 2, cyber_specialist: 1 } },
      { text: "Collaborative team environment", tags: ["collaboration"], careers: { soc_analyst: 2, security_engineer: 2, appsec: 2 } },
      { text: "Client-facing with travel opportunities", tags: ["client work", "travel"], careers: { security_consultant: 3, security_sales: 2, it_auditor: 1 } },
      { text: "Highest possible compensation", tags: ["high earnings"], careers: { security_sales: 3, security_engineer: 2, cloud_security: 2 } },
      { text: "Meaningful work protecting people/organizations", tags: ["mission-driven"], careers: { incident_response: 2, threat_intel: 2, privacy_analyst: 2 } }
    ]
  },
  {
    id: 'int3',
    type: 'ranking',
    section: 'interest',
    question: "Rank these work activities from MOST appealing (#1) to LEAST appealing (#6):",
    instruction: "Drag to reorder or use arrows. Your #1 choice carries the most weight.",
    options: [
      { text: "Monitoring dashboards and responding to alerts in real-time", careers: { soc_analyst: 6, incident_response: 4, security_analyst: 4, data_security: 3 } },
      { text: "Writing reports, policies, and formal documentation", careers: { grc_analyst: 6, threat_intel: 5, dfir: 4, it_auditor: 5, compliance_analyst: 5, privacy_analyst: 4 } },
      { text: "Building tools, writing code, and automating processes", careers: { security_engineer: 6, cloud_security: 5, pentester: 4, appsec: 5, malware_analyst: 4 } },
      { text: "Meeting with stakeholders, presenting, and advising", careers: { grc_analyst: 5, security_sales: 6, security_awareness: 5, security_consultant: 6 } },
      { text: "Deep research, analysis, and pattern recognition", careers: { threat_intel: 6, dfir: 5, vulnerability_analyst: 5, malware_analyst: 5 } },
      { text: "Teaching, training, and changing human behavior", careers: { security_awareness: 6, security_consultant: 3, security_sales: 2 } }
    ]
  },
  {
    id: 'int4',
    type: 'scenario',
    section: 'interest',
    question: "It's 2 PM on a Tuesday. Which scenario sounds most satisfying to you?",
    options: [
      { text: "You just finished presenting a risk assessment to the CISO and received approval for a new security initiative", careers: { grc_analyst: 3, it_auditor: 2, security_consultant: 2 } },
      { text: "You investigated an alert, confirmed it was a real attack, and successfully contained the threat before damage occurred", careers: { soc_analyst: 3, incident_response: 3, security_analyst: 2 } },
      { text: "You discovered a critical vulnerability in a client's system that could have led to a major breach", careers: { pentester: 3, vulnerability_analyst: 2 } },
      { text: "Your automation script just deployed security controls across 500 cloud instances without a single error", careers: { security_engineer: 3, cloud_security: 3 } },
      { text: "You closed a $500K deal helping a company choose the right security solution for their needs", careers: { security_sales: 3 } },
      { text: "You published a threat intelligence report that's being cited across the industry", careers: { threat_intel: 3, malware_analyst: 1 } },
      { text: "Your security awareness program reduced phishing click rates from 25% to 5%", careers: { security_awareness: 3 } },
      { text: "You recovered deleted evidence from a compromised laptop that will be used in court", careers: { dfir: 3, incident_response: 1 } }
    ]
  },
  {
    id: 'int5',
    type: 'scenario',
    section: 'interest',
    question: "Which of these problems would you MOST want to solve?",
    options: [
      { text: "The organization has no consistent security policies and failed their last audit", careers: { grc_analyst: 3, compliance_analyst: 3, it_auditor: 2 } },
      { text: "Attackers are in the network and we need to find them, contain them, and kick them out", careers: { incident_response: 3, soc_analyst: 2, dfir: 2 } },
      { text: "The development team keeps shipping code with the same security vulnerabilities", careers: { appsec: 3, security_engineer: 2 } },
      { text: "Users keep clicking on phishing emails despite multiple warnings", careers: { security_awareness: 3 } },
      { text: "We have thousands of vulnerabilities but no way to prioritize which to fix first", careers: { vulnerability_analyst: 3, grc_analyst: 1 } },
      { text: "The company is moving to the cloud but has no idea how to secure it properly", careers: { cloud_security: 3, security_consultant: 2 } },
      { text: "A new malware strain is spreading and no one understands how it works", careers: { malware_analyst: 3, threat_intel: 2 } },
      { text: "Personal data is being leaked and we don't know where or how", careers: { data_security: 3, privacy_analyst: 2, dfir: 1 } }
    ]
  },
  {
    id: 'int6',
    type: 'ranking',
    section: 'interest',
    question: "Rank what matters MOST to you in a career (#1 = most important):",
    options: [
      { text: "Highest possible salary and earning potential", careers: { security_sales: 6, security_engineer: 4, cloud_security: 4 } },
      { text: "Job security and stable demand", careers: { grc_analyst: 5, iam_analyst: 4, soc_analyst: 4, compliance_analyst: 4, security_analyst: 4 } },
      { text: "Intellectual challenge and continuous learning", careers: { pentester: 5, threat_intel: 5, dfir: 5, security_engineer: 4, malware_analyst: 5 } },
      { text: "Helping and teaching others", careers: { security_awareness: 6, security_consultant: 4, security_sales: 3 } },
      { text: "Work-life balance and predictable schedule", careers: { grc_analyst: 5, security_awareness: 5, iam_analyst: 4, privacy_analyst: 4, compliance_analyst: 4 } },
      { text: "Being on the cutting edge of technology", careers: { pentester: 4, threat_intel: 4, cloud_security: 5, appsec: 4 } }
    ]
  }
];

const skillsQuestions = [
  {
    id: 'skill1',
    type: 'multiselect',
    section: 'skills',
    question: "What skills do you already have from your career or education? (Select ALL that apply)",
    instruction: "Include skills from ANY job, not just IT. Be generous - you likely have more transferable skills than you think.",
    minSelect: 2,
    options: [
      { text: "Technical writing and formal documentation", careers: { grc_analyst: 3, threat_intel: 2, dfir: 2, it_auditor: 2, compliance_analyst: 2, privacy_analyst: 2 } },
      { text: "Public speaking and presentations", careers: { security_sales: 3, security_awareness: 3, grc_analyst: 2, security_consultant: 3 } },
      { text: "Programming or scripting (Python, PowerShell, etc.)", careers: { security_engineer: 3, pentester: 3, cloud_security: 2, appsec: 3, malware_analyst: 2 } },
      { text: "Data analysis (Excel, SQL, reporting)", careers: { threat_intel: 2, grc_analyst: 2, soc_analyst: 2, vulnerability_analyst: 2, data_security: 2 } },
      { text: "Project management and coordination", careers: { grc_analyst: 2, iam_analyst: 2, security_awareness: 1, security_consultant: 2 } },
      { text: "Sales, business development, or account management", careers: { security_sales: 3 } },
      { text: "Teaching, training, or curriculum development", careers: { security_awareness: 3, security_consultant: 1 } },
      { text: "Customer service or client relationship management", careers: { security_sales: 2, grc_analyst: 1, security_consultant: 2, iam_analyst: 1 } },
      { text: "System administration or IT support", careers: { soc_analyst: 3, iam_analyst: 2, network_security: 2, security_analyst: 2, cyber_specialist: 2 } },
      { text: "Cloud platforms (AWS, Azure, GCP)", careers: { cloud_security: 3, security_engineer: 2 } },
      { text: "Network troubleshooting and infrastructure", careers: { network_security: 3, soc_analyst: 1, security_engineer: 1 } },
      { text: "Compliance, audit, or regulatory work", careers: { grc_analyst: 3, it_auditor: 3, compliance_analyst: 3, privacy_analyst: 2 } },
      { text: "Contract negotiation or vendor management", careers: { grc_analyst: 2, security_sales: 1 } },
      { text: "Legal or regulatory interpretation", careers: { privacy_analyst: 3, compliance_analyst: 3, grc_analyst: 1 } },
      { text: "Software development or engineering", careers: { appsec: 3, security_engineer: 2, pentester: 2, malware_analyst: 2 } },
      { text: "Research and investigation", careers: { threat_intel: 3, dfir: 2, vulnerability_analyst: 2 } }
    ]
  },
  {
    id: 'skill2',
    type: 'multiselect',
    section: 'skills',
    question: "Which of these describes your CURRENT or MOST RECENT role? (Select ALL that apply)",
    instruction: "Select all roles/functions you've performed professionally.",
    minSelect: 1,
    options: [
      { text: "Sales, account management, or business development", careers: { security_sales: 3, security_awareness: 1 } },
      { text: "Deal desk, sales operations, or revenue operations", careers: { grc_analyst: 3, security_sales: 2, compliance_analyst: 1 } },
      { text: "Operations, compliance, or process management", careers: { grc_analyst: 3, compliance_analyst: 3, privacy_analyst: 2, it_auditor: 2 } },
      { text: "IT support, help desk, or technical support", careers: { soc_analyst: 3, security_analyst: 2, iam_analyst: 2, cyber_specialist: 2 } },
      { text: "System or network administration", careers: { network_security: 3, soc_analyst: 2, security_engineer: 2, iam_analyst: 2 } },
      { text: "Software development or engineering", careers: { security_engineer: 3, appsec: 3, cloud_security: 2, pentester: 2 } },
      { text: "DevOps, cloud engineering, or SRE", careers: { cloud_security: 3, security_engineer: 2 } },
      { text: "Education, training, or instructional design", careers: { security_awareness: 3 } },
      { text: "Legal, paralegal, or regulatory affairs", careers: { privacy_analyst: 3, compliance_analyst: 2 } },
      { text: "Finance, accounting, or audit", careers: { it_auditor: 3, grc_analyst: 2 } },
      { text: "Project or program management", careers: { grc_analyst: 2, security_consultant: 2 } },
      { text: "Data analysis or business intelligence", careers: { threat_intel: 2, grc_analyst: 2, vulnerability_analyst: 2 } },
      { text: "Marketing or communications", careers: { security_awareness: 2 } },
      { text: "Consulting or professional services", careers: { security_consultant: 3 } },
      { text: "Student or recent graduate with IT coursework", careers: { soc_analyst: 2, cyber_specialist: 2 } }
    ]
  },
  {
    id: 'skill3',
    type: 'scale',
    section: 'skills',
    question: "Rate your current comfort level with these technical areas:",
    instruction: "1 = No experience, 5 = Very comfortable",
    options: [
      { text: "Programming/scripting (Python, PowerShell, Bash)", careersHigh: { security_engineer: 2, pentester: 2, cloud_security: 1, appsec: 2, malware_analyst: 2 }, careersLow: { security_awareness: 1, compliance_analyst: 1, privacy_analyst: 1 } },
      { text: "Networking concepts (TCP/IP, firewalls, VPNs)", careersHigh: { network_security: 2, soc_analyst: 1, security_engineer: 1 }, careersLow: { security_awareness: 1, privacy_analyst: 1 } },
      { text: "Cloud platforms (AWS, Azure, GCP)", careersHigh: { cloud_security: 2, security_engineer: 1 }, careersLow: { compliance_analyst: 1, privacy_analyst: 1 } },
      { text: "Operating systems (Windows, Linux administration)", careersHigh: { soc_analyst: 1, security_engineer: 1, dfir: 1 }, careersLow: { compliance_analyst: 1, privacy_analyst: 1 } },
      { text: "Security frameworks (NIST, ISO 27001, SOC 2)", careersHigh: { grc_analyst: 2, compliance_analyst: 2, it_auditor: 2 }, careersLow: { pentester: 0, malware_analyst: 0 } },
      { text: "Data analysis and Excel/SQL", careersHigh: { grc_analyst: 1, threat_intel: 1, vulnerability_analyst: 1 }, careersLow: {} }
    ]
  },
  {
    id: 'skill4',
    type: 'multiselect',
    section: 'skills',
    question: "Which soft skills are your STRONGEST? (Select your top 5)",
    instruction: "Choose the 5 skills where you truly excel.",
    minSelect: 3,
    maxSelect: 5,
    options: [
      { text: "Written communication and documentation", careers: { grc_analyst: 2, threat_intel: 2, dfir: 2, compliance_analyst: 2, privacy_analyst: 2 } },
      { text: "Verbal communication and presentation", careers: { security_sales: 2, security_awareness: 2, security_consultant: 2 } },
      { text: "Attention to detail and accuracy", careers: { dfir: 2, compliance_analyst: 2, it_auditor: 2, vulnerability_analyst: 1, data_security: 1 } },
      { text: "Problem-solving and troubleshooting", careers: { soc_analyst: 2, incident_response: 2, pentester: 2, security_engineer: 2 } },
      { text: "Staying calm under pressure", careers: { incident_response: 3, soc_analyst: 2 } },
      { text: "Building relationships and networking", careers: { security_sales: 2, security_consultant: 2 } },
      { text: "Teaching and explaining complex topics", careers: { security_awareness: 3, security_consultant: 1 } },
      { text: "Analytical thinking and pattern recognition", careers: { threat_intel: 2, malware_analyst: 2, vulnerability_analyst: 2 } },
      { text: "Project management and organization", careers: { grc_analyst: 2, iam_analyst: 1 } },
      { text: "Creativity and thinking outside the box", careers: { pentester: 2, security_engineer: 1 } },
      { text: "Persistence and patience with complex problems", careers: { dfir: 2, malware_analyst: 2, threat_intel: 1 } },
      { text: "Adapting quickly to new situations", careers: { security_consultant: 2, incident_response: 1, cyber_specialist: 1 } }
    ]
  },
  {
    id: 'skill5',
    type: 'ranking',
    section: 'skills',
    question: "Rank these job functions by how EXPERIENCED you are (#1 = most experienced):",
    options: [
      { text: "Writing formal reports, policies, or documentation", careers: { grc_analyst: 5, compliance_analyst: 5, it_auditor: 4, privacy_analyst: 4, threat_intel: 4 } },
      { text: "Presenting to groups or stakeholders", careers: { security_sales: 5, security_awareness: 5, security_consultant: 4, grc_analyst: 3 } },
      { text: "Technical troubleshooting and problem-solving", careers: { soc_analyst: 5, security_engineer: 4, network_security: 4, incident_response: 4 } },
      { text: "Data analysis, reporting, and metrics", careers: { vulnerability_analyst: 4, grc_analyst: 3, threat_intel: 3, data_security: 3 } },
      { text: "Process improvement and documentation", careers: { grc_analyst: 4, compliance_analyst: 4, iam_analyst: 3, privacy_analyst: 3 } },
      { text: "Customer/client relationship management", careers: { security_sales: 5, security_consultant: 4, security_awareness: 2 } }
    ]
  },
  {
    id: 'skill6',
    type: 'scenario',
    section: 'skills',
    question: "Your manager asks you to lead a project. Which type of project would you feel MOST confident handling?",
    options: [
      { text: "Prepare the organization for an upcoming SOC 2 audit - gather evidence, coordinate with control owners, ensure readiness", careers: { grc_analyst: 3, it_auditor: 2, compliance_analyst: 2 } },
      { text: "Investigate a series of suspicious alerts and determine if they represent a real security incident", careers: { soc_analyst: 3, incident_response: 2, security_analyst: 2 } },
      { text: "Evaluate and select a new security tool, then deploy it across the organization", careers: { security_engineer: 3, security_analyst: 2, cloud_security: 2 } },
      { text: "Create and deliver a security awareness training program for all employees", careers: { security_awareness: 3 } },
      { text: "Conduct a security assessment of a new vendor before we sign a contract with them", careers: { grc_analyst: 2, security_consultant: 2, compliance_analyst: 1 } },
      { text: "Build automation to scan all systems for vulnerabilities and generate weekly reports", careers: { vulnerability_analyst: 2, security_engineer: 2, cloud_security: 1 } },
      { text: "Present a security product demo to a potential customer and answer their technical questions", careers: { security_sales: 3 } },
      { text: "Analyze a new type of malware that was found in our environment and write a report on how it works", careers: { malware_analyst: 3, threat_intel: 2, dfir: 1 } }
    ]
  }
];

const preferenceQuestions = [
  {
    id: 'pref1',
    type: 'single',
    section: 'preference',
    question: "How technical do you want your day-to-day work to be?",
    options: [
      { text: "Minimal technical - focus on business, communication, strategy, and processes", careers: { grc_analyst: 3, security_sales: 2, security_awareness: 3, compliance_analyst: 3, privacy_analyst: 2 } },
      { text: "Balanced - mix of technical tasks and business/communication work", careers: { grc_analyst: 2, iam_analyst: 3, it_auditor: 2, security_consultant: 3, vulnerability_analyst: 2, data_security: 2, security_analyst: 2 } },
      { text: "Primarily technical - hands-on with tools and systems, some stakeholder interaction", careers: { soc_analyst: 3, dfir: 2, threat_intel: 2, network_security: 3, cyber_specialist: 2 } },
      { text: "Deep technical - coding, building, hacking, minimal business interaction", careers: { security_engineer: 3, pentester: 3, cloud_security: 3, appsec: 3, malware_analyst: 3 } }
    ]
  },
  {
    id: 'pref2',
    type: 'single',
    section: 'preference',
    question: "How do you handle stress and high-pressure situations?",
    options: [
      { text: "I prefer steady, predictable work with planned deadlines - I don't perform well under sudden pressure", careers: { grc_analyst: 3, security_awareness: 3, iam_analyst: 2, compliance_analyst: 3, privacy_analyst: 3, vulnerability_analyst: 2 } },
      { text: "I can handle occasional crunch times but need time to recover afterward", careers: { threat_intel: 2, cloud_security: 2, it_auditor: 2, appsec: 2, data_security: 2, security_analyst: 2, cyber_specialist: 2 } },
      { text: "I thrive under pressure - urgent situations bring out my best work", careers: { soc_analyst: 3, incident_response: 3, dfir: 2, pentester: 2 } },
      { text: "I enjoy the pressure of sales cycles, client deadlines, and competitive environments", careers: { security_sales: 3, security_consultant: 2 } }
    ]
  },
  {
    id: 'pref3',
    type: 'single',
    section: 'preference',
    question: "How quickly do you need to transition into cybersecurity?",
    options: [
      { text: "ASAP - I need the most accessible entry point possible, even if it means starting with lower pay", careers: { soc_analyst: 3, security_awareness: 2, compliance_analyst: 2, security_analyst: 3, cyber_specialist: 3 } },
      { text: "Within 6-12 months - I have time for certifications and targeted preparation", careers: { grc_analyst: 3, soc_analyst: 2, iam_analyst: 2, it_auditor: 2, vulnerability_analyst: 2 } },
      { text: "1-2 years - I'm willing to build a strong foundation first for a better position", careers: { cloud_security: 2, security_engineer: 2, dfir: 2, incident_response: 2, appsec: 2 } },
      { text: "No rush - I want to find the absolute best long-term fit even if it takes time", careers: { pentester: 2, threat_intel: 2, security_engineer: 2, malware_analyst: 2 } }
    ]
  },
  {
    id: 'pref4',
    type: 'single',
    section: 'preference',
    question: "What's your priority when it comes to compensation vs. other factors?",
    options: [
      { text: "Maximum earnings - I want the highest possible total compensation", careers: { security_sales: 3, security_engineer: 2, cloud_security: 2 } },
      { text: "High pay balanced with good work-life balance", careers: { grc_analyst: 2, iam_analyst: 2, privacy_analyst: 2, it_auditor: 2, cloud_security: 1 } },
      { text: "I prioritize interesting, challenging work over maximizing pay", careers: { pentester: 2, threat_intel: 2, dfir: 2, malware_analyst: 2 } },
      { text: "Stability and job security matter more than maximizing income", careers: { soc_analyst: 2, compliance_analyst: 2, security_analyst: 2, cyber_specialist: 2 } }
    ]
  },
  {
    id: 'pref5',
    type: 'multiselect',
    section: 'preference',
    question: "What are your absolute NON-NEGOTIABLES for a new career? (Select ALL that apply)",
    instruction: "These will filter out incompatible roles.",
    minSelect: 0,
    options: [
      { text: "Must be fully or mostly remote", filter: "remote", careers: { grc_analyst: 1, security_engineer: 1, threat_intel: 1, cloud_security: 1, privacy_analyst: 1, vulnerability_analyst: 1, malware_analyst: 1 } },
      { text: "Absolutely minimal coding required", filter: "no-code", careers: { grc_analyst: 1, security_awareness: 1, compliance_analyst: 1, privacy_analyst: 1, it_auditor: 1, security_sales: 1 } },
      { text: "No shift work or on-call requirements", filter: "no-shifts", careers: { grc_analyst: 1, security_awareness: 1, compliance_analyst: 1, privacy_analyst: 1, vulnerability_analyst: 1 } },
      { text: "Clear, defined career progression", filter: "career-path", careers: { grc_analyst: 1, soc_analyst: 1, it_auditor: 1, security_engineer: 1 } },
      { text: "Accessible for career changers without IT background", filter: "career-change", careers: { grc_analyst: 1, security_awareness: 1, compliance_analyst: 1, security_sales: 1 } },
      { text: "Highest possible earning potential", filter: "high-pay", careers: { security_sales: 1, security_engineer: 1, cloud_security: 1 } }
    ]
  }
];

const knowledgeQuestions = [
  {
    id: 'know1',
    type: 'scale',
    section: 'knowledge',
    question: "Rate your current knowledge level in these security areas:",
    instruction: "1 = Never heard of it, 3 = Basic understanding, 5 = Could explain it to someone",
    options: [
      { text: "NIST Cybersecurity Framework", careersHigh: { grc_analyst: 2, compliance_analyst: 2, it_auditor: 1 } },
      { text: "SOC 2 compliance requirements", careersHigh: { grc_analyst: 2, compliance_analyst: 2, it_auditor: 2 } },
      { text: "OWASP Top 10 vulnerabilities", careersHigh: { appsec: 2, pentester: 2 } },
      { text: "Incident response procedures", careersHigh: { incident_response: 2, soc_analyst: 1 } },
      { text: "SIEM tools (Splunk, QRadar, etc.)", careersHigh: { soc_analyst: 2, security_analyst: 1 } },
      { text: "Cloud security concepts (AWS/Azure)", careersHigh: { cloud_security: 2, security_engineer: 1 } },
      { text: "Vulnerability scanning tools", careersHigh: { vulnerability_analyst: 2, pentester: 1 } },
      { text: "Data privacy regulations (GDPR, CCPA)", careersHigh: { privacy_analyst: 2, compliance_analyst: 1 } }
    ]
  },
  {
    id: 'know2',
    type: 'multiselect',
    section: 'knowledge',
    question: "Which certifications or training have you completed? (Select ALL that apply)",
    instruction: "Include anything security or IT related.",
    minSelect: 0,
    options: [
      { text: "CompTIA Security+", careers: { soc_analyst: 2, security_analyst: 2, grc_analyst: 1, cyber_specialist: 2 } },
      { text: "CompTIA Network+", careers: { network_security: 2, soc_analyst: 1 } },
      { text: "CompTIA CySA+", careers: { soc_analyst: 2, vulnerability_analyst: 2 } },
      { text: "Google Cybersecurity Certificate", careers: { soc_analyst: 2, security_analyst: 1, cyber_specialist: 1 } },
      { text: "AWS/Azure/GCP certifications", careers: { cloud_security: 3, security_engineer: 2 } },
      { text: "CISA (Certified Information Systems Auditor)", careers: { it_auditor: 3, grc_analyst: 2 } },
      { text: "CISSP or Associate of (ISC)²", careers: { security_engineer: 1, grc_analyst: 1 } },
      { text: "CEH or OSCP", careers: { pentester: 3, vulnerability_analyst: 1 } },
      { text: "Privacy certifications (CIPP, CIPM)", careers: { privacy_analyst: 3 } },
      { text: "None yet, but actively studying", careers: {} }
    ]
  }
];

// Combine all questions
const allQuestions = [...interestQuestions, ...skillsQuestions, ...preferenceQuestions, ...knowledgeQuestions];

// Main Component
window.CybersecurityCareerQuiz = function CybersecurityCareerQuiz() {
  const [stage, setStage] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [rankings, setRankings] = useState({});
  const [multiSelects, setMultiSelects] = useState({});
  const [scales, setScales] = useState({});
  const [results, setResults] = useState(null);

  const totalQuestions = allQuestions.length;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / totalQuestions) * 100;

  // Calculate results with separate interest and skills scores
  const calculateResults = () => {
    const interestScores = {};
    const skillsScores = {};
    Object.keys(careerPaths).forEach(key => {
      interestScores[key] = 0;
      skillsScores[key] = 0;
    });

    // Process all answers
    allQuestions.forEach(q => {
      const isInterest = q.section === 'interest';
      const isSkills = q.section === 'skills' || q.section === 'knowledge';
      const scores = isInterest ? interestScores : skillsScores;

      if (q.type === 'multiselect' && multiSelects[q.id]) {
        multiSelects[q.id].forEach(option => {
          if (option.careers) {
            Object.entries(option.careers).forEach(([career, score]) => {
              if (isInterest) interestScores[career] += score;
              else skillsScores[career] += score;
            });
          }
        });
      }

      if (q.type === 'single' && answers[q.id]?.careers) {
        Object.entries(answers[q.id].careers).forEach(([career, score]) => {
          if (isInterest) interestScores[career] += score;
          else if (isSkills) skillsScores[career] += score;
          else {
            interestScores[career] += score * 0.5;
            skillsScores[career] += score * 0.5;
          }
        });
      }

      if (q.type === 'scenario' && answers[q.id]?.careers) {
        Object.entries(answers[q.id].careers).forEach(([career, score]) => {
          if (isInterest) interestScores[career] += score * 1.5;
          else skillsScores[career] += score * 1.5;
        });
      }

      if (q.type === 'ranking' && rankings[q.id]) {
        rankings[q.id].forEach((option, index) => {
          const weight = rankings[q.id].length - index;
          if (option.careers) {
            Object.entries(option.careers).forEach(([career, baseScore]) => {
              const score = (baseScore / 6) * weight;
              if (isInterest) interestScores[career] += score;
              else skillsScores[career] += score;
            });
          }
        });
      }

      if (q.type === 'scale' && scales[q.id]) {
        Object.entries(scales[q.id]).forEach(([optionText, value]) => {
          const option = q.options.find(o => o.text === optionText);
          if (option?.careersHigh && value >= 4) {
            Object.entries(option.careersHigh).forEach(([career, score]) => {
              skillsScores[career] += score * (value / 5);
            });
          }
        });
      }
    });

    // Calculate max scores and percentages
    const maxInterest = Math.max(...Object.values(interestScores), 1);
    const maxSkills = Math.max(...Object.values(skillsScores), 1);

    const combinedResults = Object.keys(careerPaths).map(key => {
      const interestPct = Math.round((interestScores[key] / maxInterest) * 100);
      const skillsPct = Math.round((skillsScores[key] / maxSkills) * 100);
      const combined = (interestPct * 0.5) + (skillsPct * 0.5);
      
      return {
        key,
        ...careerPaths[key],
        interestScore: interestScores[key],
        skillsScore: skillsScores[key],
        interestPct,
        skillsPct,
        combinedScore: combined
      };
    });

    const sortedByInterest = [...combinedResults].sort((a, b) => b.interestPct - a.interestPct);
    const sortedBySkills = [...combinedResults].sort((a, b) => b.skillsPct - a.skillsPct);
    const sortedByCombined = [...combinedResults].sort((a, b) => b.combinedScore - a.combinedScore);

    setResults({
      topByInterest: sortedByInterest.slice(0, 5),
      topBySkills: sortedBySkills.slice(0, 5),
      allRanked: sortedByCombined,
      top5Combined: sortedByCombined.slice(0, 5)
    });
    setStage('results');
  };

  const handleSingleSelect = (option) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    goToNext();
  };

  const handleMultiSelect = (option) => {
    setMultiSelects(prev => {
      const current = prev[currentQuestion.id] || [];
      const exists = current.find(o => o.text === option.text);
      if (exists) {
        return { ...prev, [currentQuestion.id]: current.filter(o => o.text !== option.text) };
      }
      const maxSelect = currentQuestion.maxSelect || Infinity;
      if (current.length >= maxSelect) return prev;
      return { ...prev, [currentQuestion.id]: [...current, option] };
    });
  };

  const handleScaleChange = (optionText, value) => {
    setScales(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || {}),
        [optionText]: value
      }
    }));
  };

  const moveRankingItem = (fromIndex, direction) => {
    const currentRanking = rankings[currentQuestion.id] || [...currentQuestion.options];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= currentRanking.length) return;
    const newRanking = [...currentRanking];
    [newRanking[fromIndex], newRanking[toIndex]] = [newRanking[toIndex], newRanking[fromIndex]];
    setRankings(prev => ({ ...prev, [currentQuestion.id]: newRanking }));
  };

  const canContinue = () => {
    const q = currentQuestion;
    if (q.type === 'multiselect') {
      const selected = multiSelects[q.id]?.length || 0;
      return selected >= (q.minSelect || 1);
    }
    if (q.type === 'scale') {
      const answered = Object.keys(scales[q.id] || {}).length;
      return answered >= q.options.length;
    }
    if (q.type === 'ranking') return true;
    if (q.type === 'single' || q.type === 'scenario') return !!answers[q.id];
    return true;
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const getSectionName = (section) => {
    const names = {
      interest: 'Your Interests',
      skills: 'Your Skills & Experience',
      preference: 'Work Preferences',
      knowledge: 'Current Knowledge'
    };
    return names[section] || section;
  };

  // INTRO SCREEN
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8 font-sans">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-slate-700/50 shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-4xl">🛡️</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Cybersecurity Career Assessment
              </h1>
              <p className="text-slate-400 text-lg">
                Comprehensive analysis across <span className="text-blue-400 font-medium">22 entry-level paths</span>
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">1</span>
                  Interest Assessment
                </h3>
                <p className="text-slate-400 text-sm">Discover which security domains genuinely excite you through scenarios and activity preferences.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">2</span>
                  Skills & Experience Mapping
                </h3>
                <p className="text-slate-400 text-sm">Identify your transferable skills from your deal desk and sales operations background.</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">3</span>
                  Detailed Results
                </h3>
                <p className="text-slate-400 text-sm">See your Top 5 by Interest, Top 5 by Skills, with explanations of WHY each role matches you.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/20 mb-8">
              <h4 className="text-white font-medium mb-2">What makes this assessment different:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Separate scoring for <span className="text-blue-400">interests</span> vs <span className="text-purple-400">transferable skills</span></li>
                <li>• Specific match reasons explaining WHY you fit each role</li>
                <li>• Realistic salary data with Bay Area adjustments</li>
                <li>• Career trajectory and progression paths</li>
              </ul>
            </div>

            <div className="text-center text-slate-500 text-sm mb-6">
              {totalQuestions} in-depth questions • 12-15 minutes
            </div>

            <button
              onClick={() => setStage('quiz')}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 text-lg"
            >
              Begin Assessment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (stage === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-6 font-sans">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span className="font-medium">{getSectionName(currentQuestion.section)}</span>
              <span>{currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">{currentQuestion.question}</h2>
            {currentQuestion.instruction && (
              <p className="text-slate-400 text-sm mb-6">{currentQuestion.instruction}</p>
            )}

            {/* Multi-select */}
            {currentQuestion.type === 'multiselect' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = multiSelects[currentQuestion.id]?.some(o => o.text === option.text);
                  const atMax = currentQuestion.maxSelect && (multiSelects[currentQuestion.id]?.length || 0) >= currentQuestion.maxSelect;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMultiSelect(option)}
                      disabled={!isSelected && atMax}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                        isSelected 
                          ? 'bg-blue-500/20 border-blue-500/50 text-white' 
                          : atMax
                          ? 'bg-slate-800/30 border-slate-700/50 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </span>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Single select */}
            {(currentQuestion.type === 'single' || currentQuestion.type === 'scenario') && (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSingleSelect(option)}
                    className="w-full text-left p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 text-slate-200 transition-all text-sm"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {/* Ranking */}
            {currentQuestion.type === 'ranking' && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 mb-3">Use arrows to reorder. #1 = most important/appealing.</p>
                {(rankings[currentQuestion.id] || currentQuestion.options).map((option, index) => (
                  <div key={option.text} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{index + 1}</span>
                    <span className="flex-1 text-slate-200 text-sm">{option.text}</span>
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => moveRankingItem(index, 'up')} 
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
                      >▲</button>
                      <button 
                        onClick={() => moveRankingItem(index, 'down')} 
                        disabled={index === (rankings[currentQuestion.id] || currentQuestion.options).length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none"
                      >▼</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Scale */}
            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-200 text-sm mb-3">{option.text}</p>
                    <div className="flex gap-2 justify-between">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleScaleChange(option.text, value)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                            scales[currentQuestion.id]?.[option.text] === value
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>No experience</span>
                      <span>Very comfortable</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Continue button for multi-select, ranking, scale */}
            {(currentQuestion.type === 'multiselect' || currentQuestion.type === 'ranking' || currentQuestion.type === 'scale') && (
              <div className="mt-6">
                <button
                  onClick={goToNext}
                  disabled={!canContinue()}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    canContinue() 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {currentQuestion.type === 'multiselect' 
                    ? `Continue (${multiSelects[currentQuestion.id]?.length || 0} selected)`
                    : 'Continue'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (stage === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center py-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Your Career Assessment Results</h1>
            <p className="text-slate-400">Based on your interests, skills, and preferences</p>
          </div>

          {/* Top 5 by Interest */}
          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-blue-500/30">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">💙</span> Top 5 by Interest Match
            </h2>
            <p className="text-slate-400 text-sm mb-6">Roles that align with what genuinely excites you</p>
            <div className="space-y-4">
              {results.topByInterest.map((career, index) => (
                <div key={career.key} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{career.name}</h3>
                        <p className="text-slate-400 text-sm">{career.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{career.interestPct}%</div>
                      <div className="text-xs text-slate-500">interest match</div>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 mb-3">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Why this matches your interests:</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {career.matchReasons.interest.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-slate-400">Entry: <span className="text-green-400 font-medium">${(career.salary.entry/1000)}K</span></span>
                    <span className="text-slate-400">Bay Area: <span className="text-green-400 font-medium">${(career.salary.bayArea/1000)}K</span></span>
                    <span className="text-slate-400">Entry: <span className="text-amber-400">{career.entryDifficulty}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 by Skills */}
          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-2xl">💜</span> Top 5 by Skills & Experience Match
            </h2>
            <p className="text-slate-400 text-sm mb-6">Roles that leverage your transferable skills and background</p>
            <div className="space-y-4">
              {results.topBySkills.map((career, index) => (
                <div key={career.key} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{career.name}</h3>
                        <p className="text-slate-400 text-sm">{career.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{career.skillsPct}%</div>
                      <div className="text-xs text-slate-500">skills match</div>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4 mb-3">
                    <h4 className="text-sm font-medium text-purple-400 mb-2">Why your background fits:</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {career.matchReasons.skills.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-slate-400">Entry: <span className="text-green-400 font-medium">${(career.salary.entry/1000)}K</span></span>
                    <span className="text-slate-400">Bay Area: <span className="text-green-400 font-medium">${(career.salary.bayArea/1000)}K</span></span>
                    <span className="text-slate-400">Entry: <span className="text-amber-400">{career.entryDifficulty}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Rankings Table */}
          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-1">📊 Complete Career Rankings</h2>
            <p className="text-slate-400 text-sm mb-6">All 22 paths ranked by combined interest + skills compatibility</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left p-3">#</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-center p-3">Interest</th>
                    <th className="text-center p-3">Skills</th>
                    <th className="text-center p-3">Entry $</th>
                    <th className="text-center p-3">Bay Area $</th>
                    <th className="text-center p-3">Senior $</th>
                    <th className="text-left p-3">Entry Level</th>
                    <th className="text-left p-3 hidden lg:table-cell">Career Path</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {results.allRanked.map((career, index) => (
                    <tr key={career.key} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-500">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-medium text-white">{career.shortName}</div>
                        <div className="text-xs text-slate-500">{career.category}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-medium ${career.interestPct >= 70 ? 'text-blue-400' : career.interestPct >= 40 ? 'text-slate-300' : 'text-slate-500'}`}>
                          {career.interestPct}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-medium ${career.skillsPct >= 70 ? 'text-purple-400' : career.skillsPct >= 40 ? 'text-slate-300' : 'text-slate-500'}`}>
                          {career.skillsPct}%
                        </span>
                      </td>
                      <td className="p-3 text-center text-green-400 font-mono">${(career.salary.entry/1000)}K</td>
                      <td className="p-3 text-center text-green-400 font-mono">${(career.salary.bayArea/1000)}K</td>
                      <td className="p-3 text-center text-green-400 font-mono">${(career.salary.senior/1000)}K</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          career.entryDifficulty === 'Easier' ? 'bg-green-500/20 text-green-400' :
                          career.entryDifficulty === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {career.entryDifficulty}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-slate-500 hidden lg:table-cell max-w-xs truncate">{career.trajectory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Retake button */}
          <button
            onClick={() => {
              setStage('intro');
              setCurrentQuestionIndex(0);
              setAnswers({});
              setRankings({});
              setMultiSelects({});
              setScales({});
              setResults(null);
            }}
            className="w-full py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
          >
            ↩ Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return null;
}
