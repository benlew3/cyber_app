// ================================================
// DATA LOADER - Security+ Platform v34
// ================================================
// Loads external JSON content from the data/ folder structure:
//   /data/lessons/       - D*-LESSON-*.json (41 files)
//   /data/simulations/   - D*-SIM-*.json (26 files)
//   /data/remediation/   - D*-REM-*.json (15 files)
//   /data/questions/     - questions.json, pbqs.json
//   /data/tools/         - TOOL-LAB-*.json, LINUX-GUIDE-*.json
// ================================================

class DataLoader {
    constructor(options = {}) {
        this.basePath = options.basePath || './data';
        
        this.loadedData = {
            questions: [],
            lessons: [],
            simulations: [],
            remediation: [],
            tools: [],
            pbqs: [],
            glossary: {}
        };
        
        this.errors = [];
        this.loaded = false;
    }

    // ================================================
    // FILE DEFINITIONS
    // ================================================
    
    getLessonFiles() {
        return [
            // Domain 1 - General Security Concepts (8 lessons)
            'D1-LESSON-001_Security_Controls_Fundamentals.json',
            'D1-LESSON-002_CIA_Triad_Fundamentals.json',
            'D1-LESSON-003_Authentication_Methods.json',
            'D1-LESSON-004_Cryptographic_Fundamentals.json',
            'D1-LESSON-005_Zero_Trust_Architecture.json',
            'D1-LESSON-006_Physical_Security_Controls.json',
            'D1-LESSON-007_Deception_Technologies.json',
            'D1-LESSON-008_Change_Management.json',
            
            // Domain 2 - Threats, Vulnerabilities & Mitigations (12 lessons)
            'D2-LESSON-001_Threat_Actors_Motivations.json',
            'D2-LESSON-002_Threat_Vectors_Attack_Surfaces.json',
            'D2-LESSON-003_Social_Engineering.json',
            'D2-LESSON-004_Malware_Types.json',
            'D2-LESSON-005_Network_Attacks.json',
            'D2-LESSON-006_Application_Attacks.json',
            'D2-LESSON-007_Vulnerability_Management.json',
            'D2-LESSON-008_Indicators_Detection.json',
            'D2-LESSON-009_Hardening_Configurations.json',
            'D2-LESSON-010_Mitigation_Techniques.json',
            'D2-LESSON-011_Attack_Frameworks.json',
            'D2-LESSON-012_Security_Assessments.json',
            
            // Domain 3 - Security Architecture (8 lessons)
            'D3-LESSON-001_Security_Architecture_Concepts.json',
            'D3-LESSON-002_Infrastructure_Security.json',
            'D3-LESSON-003_Network_Security.json',
            'D3-LESSON-004_Wireless_Security.json',
            'D3-LESSON-005_Cloud_Security.json',
            'D3-LESSON-006_Cryptography.json',
            'D3-LESSON-007_Resilience_Recovery.json',
            'D3-LESSON-008_Data_Protection.json',
            
            // Domain 4 - Security Operations (7 lessons)
            'D4-LESSON-001_Security_Monitoring.json',
            'D4-LESSON-002_Incident_Response.json',
            'D4-LESSON-003_Digital_Forensics.json',
            'D4-LESSON-004_Vulnerability_Management.json',
            'D4-LESSON-005_Identity_Access_Management.json',
            'D4-LESSON-006_Data_Protection.json',
            'D4-LESSON-007_Security_Automation.json',
            
            // Domain 5 - Security Program Management (6 lessons)
            'D5-LESSON-001_Security_Governance.json',
            'D5-LESSON-002_Risk_Management.json',
            'D5-LESSON-003_Third_Party_Risk.json',
            'D5-LESSON-004_Security_Compliance.json',
            'D5-LESSON-005_Audits_Assessments.json',
            'D5-LESSON-006_Security_Awareness.json'
        ];
    }
    
    getSimulationFiles() {
        return [
            // Domain 1 (5 simulations)
            'D1-SIM-001_Security_Controls.json',
            'D1-SIM-002_Security_Concepts.json',
            'D1-SIM-003_Encryption_Emergency.json',
            'D1-SIM-004_Zero_Trust_Migration.json',
            'D1-SIM-005_Gap_Analysis.json',
            // Domain 2 (6 simulations)
            'D2-SIM-001_Phishing_Campaign.json',
            'D2-SIM-002_Vulnerability_Management.json',
            'D2-SIM-003_Ransomware_Response.json',
            'D2-SIM-004_Supply_Chain.json',
            'D2-SIM-005_Attack_Surface.json',
            'D2-SIM-006_Attribution_Puzzle.json',
            // Domain 3 (5 simulations)
            'D3-SIM-001_Cloud_Security.json',
            'D3-SIM-002_Zero_Trust.json',
            'D3-SIM-003_Data_Protection.json',
            'D3-SIM-004_Infrastructure_Hardening.json',
            'D3-SIM-005_Resilience_Recovery.json',
            // Domain 4 (5 simulations)
            'D4-SIM-001_SOC_Operations.json',
            'D4-SIM-002_Incident_Response.json',
            'D4-SIM-003_Vulnerability_Management.json',
            'D4-SIM-004_IAM.json',
            'D4-SIM-005_Security_Automation.json',
            // Domain 5 (5 simulations)
            'D5-SIM-001_Security_Governance.json',
            'D5-SIM-002_Risk_Management.json',
            'D5-SIM-003_Third_Party_Risk.json',
            'D5-SIM-004_Compliance_Audit.json',
            'D5-SIM-005_Security_Program.json'
        ];
    }
    
    getRemediationFiles() {
        return [
            'D1-REM-001_Policy_Fundamentals.json',
            'D1-REM-002_Authentication_Access.json',
            'D1-REM-003_Cryptography_Clinic.json',
            'D2-REM-001_Know_Your_Enemy.json',
            'D2-REM-002_Malware_Menagerie.json',
            'D2-REM-003_Vulnerability_Deep_Dive.json',
            'D3-REM-001_Cloud_Fundamentals.json',
            'D3-REM-002_Network_Security.json',
            'D3-REM-003_Cryptography.json',
            'D4-REM-001_Log_Analysis.json',
            'D4-REM-002_Incident_Response.json',
            'D4-REM-003_IAM_Concepts.json',
            'D5-REM-001_Policy_Governance_Fundamentals.json',
            'D5-REM-002_Risk_Assessment_Basics.json',
            'D5-REM-003_Compliance_Concepts.json'
        ];
    }
    
    getToolFiles() {
        return [
            'LINUX-GUIDE-001_Linux_Security_Fundamentals.json',
            'TOOL-LAB-001_Wireshark.json',
            'TOOL-LAB-002_Nmap.json',
            'TOOL-LAB-003_Splunk.json',
            'TOOL-LAB-004_Hashcat.json',
            'TOOL-LAB-005_Burp_Suite.json',
            'TOOL-LAB-006_Volatility.json',
            'TOOL-LAB-007_Autopsy.json',
            'TOOL-LAB-008_YARA.json',
            'TOOL-LAB-009_TheHive.json',
            'TOOL-LAB-010_Sysmon.json',
            'TOOL-LAB-011_OpenVAS.json',
            'TOOL-LAB-012_MISP.json',
            'TOOL-LAB-013_Sigma.json'
        ];
    }

    // ================================================
    // LOADING METHODS
    // ================================================

    async loadAll(progressCallback = null) {
        const totalSteps = 6;
        let currentStep = 0;
        
        const updateProgress = (status) => {
            currentStep++;
            const percent = Math.round((currentStep / totalSteps) * 100);
            if (progressCallback) progressCallback(percent, status);
        };
        
        try {
            console.log('📦 DataLoader v34 starting...');
            
            await this.loadLessons();
            updateProgress('Lessons loaded');
            
            await this.loadSimulations();
            updateProgress('Simulations loaded');
            
            await this.loadRemediation();
            updateProgress('Remediation loaded');
            
            await this.loadQuestions();
            updateProgress('Questions loaded');
            
            await this.loadPBQs();
            updateProgress('PBQs loaded');
            
            await this.loadGlossary();
            updateProgress('Glossary loaded');
            
            this.loaded = true;
            
            console.log('═══════════════════════════════════════════════');
            console.log('📦 DataLoader Summary:');
            console.log(`   ✅ Lessons: ${this.loadedData.lessons.length}`);
            console.log(`   ✅ Simulations: ${this.loadedData.simulations.length}`);
            console.log(`   ✅ Remediation: ${this.loadedData.remediation.length}`);
            console.log(`   ✅ Questions: ${this.loadedData.questions.length}`);
            console.log(`   ✅ PBQs: ${this.loadedData.pbqs.length}`);
            console.log(`   ✅ Glossary: ${Object.keys(this.loadedData.glossary).length} terms`);
            console.log('═══════════════════════════════════════════════');
            
            if (this.errors.length > 0) {
                console.warn(`   ⚠️ ${this.errors.length} files could not be loaded`);
            }
            
            return this.loadedData;
            
        } catch (error) {
            console.error('DataLoader error:', error);
            return this.loadedData;
        }
    }

    async loadLessons() {
        const files = this.getLessonFiles();
        const lessons = [];
        
        for (const file of files) {
            try {
                const response = await fetch(`${this.basePath}/lessons/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    // Normalize the id field
                    if (!data.id && data.lesson_id) data.id = data.lesson_id;
                    lessons.push(data);
                } else {
                    this.errors.push({ type: 'lesson', file, error: `HTTP ${response.status}` });
                }
            } catch (error) {
                this.errors.push({ type: 'lesson', file, error: error.message });
            }
        }
        
        this.loadedData.lessons = lessons;
        
        // Extract glossary terms from lessons
        lessons.forEach(lesson => {
            if (lesson.sections) {
                lesson.sections.forEach(section => {
                    if (section.glossary_terms && Array.isArray(section.glossary_terms)) {
                        section.glossary_terms.forEach(term => {
                            if (term.term) {
                                const key = term.term.toLowerCase().trim();
                                this.loadedData.glossary[key] = {
                                    term: term.term,
                                    definition: term.definition || '',
                                    exam_note: term.exam_note || '',
                                    domain: lesson.domain,
                                    lesson_id: lesson.id || lesson.lesson_id
                                };
                            }
                        });
                    }
                });
            }
        });
        
        return lessons;
    }

    async loadSimulations() {
        const files = this.getSimulationFiles();
        const simulations = [];
        
        for (const file of files) {
            try {
                const response = await fetch(`${this.basePath}/simulations/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    // Normalize decision points field
                    if (!data.decisionPoints && data.decision_points) {
                        data.decisionPoints = data.decision_points;
                    }
                    if (!data.decision_points && data.decisionPoints) {
                        data.decision_points = data.decisionPoints;
                    }
                    simulations.push(data);
                } else {
                    this.errors.push({ type: 'simulation', file, error: `HTTP ${response.status}` });
                }
            } catch (error) {
                this.errors.push({ type: 'simulation', file, error: error.message });
            }
        }
        
        this.loadedData.simulations = simulations;
        return simulations;
    }

    async loadRemediation() {
        const files = this.getRemediationFiles();
        const remediation = [];
        
        for (const file of files) {
            try {
                const response = await fetch(`${this.basePath}/remediation/${file}`);
                if (response.ok) {
                    const data = await response.json();
                    remediation.push(data);
                } else {
                    this.errors.push({ type: 'remediation', file, error: `HTTP ${response.status}` });
                }
            } catch (error) {
                this.errors.push({ type: 'remediation', file, error: error.message });
            }
        }
        
        this.loadedData.remediation = remediation;
        return remediation;
    }

    async loadQuestions() {
        const questionSources = [
            `${this.basePath}/questions/questions.json`,
            `${this.basePath}/questions/securityplus_sy0701_expanded_questionbank.json`
        ];
        
        for (const url of questionSources) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    this.loadedData.questions = Array.isArray(data) ? data : (data.questions || []);
                    if (this.loadedData.questions.length > 0) {
                        console.log(`   📝 Loaded ${this.loadedData.questions.length} questions`);
                        return this.loadedData.questions;
                    }
                }
            } catch (e) {
                // Try next source
            }
        }
        
        this.errors.push({ type: 'questions', file: 'questions.json', error: 'Not found' });
        return [];
    }

    async loadPBQs() {
        try {
            const response = await fetch(`${this.basePath}/questions/pbqs.json`);
            if (response.ok) {
                const data = await response.json();
                this.loadedData.pbqs = Array.isArray(data) ? data : (data.pbqs || []);
            }
        } catch (error) {
            this.errors.push({ type: 'pbqs', file: 'pbqs.json', error: error.message });
        }
        return this.loadedData.pbqs;
    }

    async loadGlossary() {
        try {
            const response = await fetch(`${this.basePath}/lessons/glossary.json`);
            if (response.ok) {
                const data = await response.json();
                // Merge with glossary extracted from lessons
                if (Array.isArray(data)) {
                    data.forEach(term => {
                        if (term.term) {
                            const key = term.term.toLowerCase().trim();
                            this.loadedData.glossary[key] = term;
                        }
                    });
                } else if (typeof data === 'object') {
                    Object.assign(this.loadedData.glossary, data);
                }
            }
        } catch (e) {
            // Glossary is optional - terms are also extracted from lessons
        }
        return this.loadedData.glossary;
    }

    // ================================================
    // UTILITY METHODS
    // ================================================

    hasExternalData() {
        return this.loadedData.lessons.length > 0 || 
               this.loadedData.simulations.length > 0 ||
               this.loadedData.questions.length > 0;
    }

    getLessonById(lessonId) {
        return this.loadedData.lessons.find(l => 
            l.id === lessonId || l.lesson_id === lessonId
        );
    }

    getSimulationById(simId) {
        return this.loadedData.simulations.find(s => s.id === simId);
    }

    getQuestionsByDomain(domain) {
        return this.loadedData.questions.filter(q => q.domain === domain);
    }

    getRemediationByDomain(domain) {
        return this.loadedData.remediation.filter(r => r.domain === domain);
    }

    getErrors() {
        return this.errors;
    }
}

// Export for use
window.DataLoader = DataLoader;

console.log('✅ DataLoader v34 ready');
