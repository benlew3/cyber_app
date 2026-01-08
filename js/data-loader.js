// ================================================
// DATA LOADER MODULE - Security+ Platform v33
// Loads all external JSON content (lessons, simulations, questions, remediation)
// ================================================

(function() {
    'use strict';

    console.log('📦 Data Loader Module initializing...');

    // ================================================
    // FILE MANIFEST - All content files to load
    // ================================================
    const FILE_MANIFEST = {
        questionBank: 'data/securityplus_sy0701_expanded_questionbank.json',
        
        lessons: [
            // Domain 1
            'data/D1-LESSON-001_Security_Controls_Fundamentals.json',
            'data/D1-LESSON-002_CIA_Triad_Fundamentals.json',
            'data/D1-LESSON-003_Authentication_Methods.json',
            'data/D1-LESSON-004_Cryptographic_Fundamentals.json',
            'data/D1-LESSON-005_Zero_Trust_Architecture.json',
            'data/D1-LESSON-006_Physical_Security_Controls.json',
            'data/D1-LESSON-007_Deception_Technologies.json',
            'data/D1-LESSON-008_Change_Management.json',
            // Domain 2
            'data/D2-LESSON-001_Threat_Actors_Motivations.json',
            'data/D2-LESSON-002_Threat_Vectors_Attack_Surfaces.json',
            'data/D2-LESSON-003_Social_Engineering.json',
            'data/D2-LESSON-004_Malware_Types.json',
            'data/D2-LESSON-005_Network_Attacks.json',
            'data/D2-LESSON-006_Application_Attacks.json',
            'data/D2-LESSON-007_Vulnerability_Management.json',
            'data/D2-LESSON-008_Indicators_Detection.json',
            'data/D2-LESSON-009_Hardening_Configurations.json',
            'data/D2-LESSON-010_Mitigation_Techniques.json',
            'data/D2-LESSON-011_Attack_Frameworks.json',
            'data/D2-LESSON-012_Security_Assessments.json',
            // Domain 3
            'data/D3-LESSON-001_Security_Architecture_Concepts.json',
            'data/D3-LESSON-002_Infrastructure_Security.json',
            'data/D3-LESSON-003_Network_Security.json',
            'data/D3-LESSON-004_Wireless_Security.json',
            'data/D3-LESSON-005_Cloud_Security.json',
            'data/D3-LESSON-006_Cryptography.json',
            'data/D3-LESSON-007_Resilience_Recovery.json',
            'data/D3-LESSON-008_Data_Protection.json',
            // Domain 4
            'data/D4-LESSON-001_Security_Monitoring.json',
            'data/D4-LESSON-002_Incident_Response.json',
            'data/D4-LESSON-003_Digital_Forensics.json',
            'data/D4-LESSON-004_Vulnerability_Management.json',
            'data/D4-LESSON-005_Identity_Access_Management.json',
            'data/D4-LESSON-006_Data_Protection.json',
            'data/D4-LESSON-007_Security_Automation.json',
            // Domain 5
            'data/D5-LESSON-001_Security_Governance.json',
            'data/D5-LESSON-002_Risk_Management.json',
            'data/D5-LESSON-003_Third_Party_Risk.json',
            'data/D5-LESSON-004_Security_Compliance.json',
            'data/D5-LESSON-005_Audits_Assessments.json',
            'data/D5-LESSON-006_Security_Awareness.json'
        ],
        
        simulations: [
            // Domain 1
            'data/D1-SIM-001_Security_Controls.json',
            'data/D1-SIM-002_Security_Concepts.json',
            'data/D1-SIM-003_Encryption_Emergency.json',
            'data/D1-SIM-004_Zero_Trust_Migration.json',
            'data/D1-SIM-005_Gap_Analysis.json',
            // Domain 2
            'data/D2-SIM-001_Phishing_Campaign.json',
            'data/D2-SIM-002_Vulnerability_Management.json',
            'data/D2-SIM-003_Ransomware_Response.json',
            'data/D2-SIM-004_Supply_Chain.json',
            'data/D2-SIM-005_Attack_Surface.json',
            // Domain 3
            'data/D3-SIM-001_Cloud_Security.json',
            'data/D3-SIM-002_Zero_Trust.json',
            'data/D3-SIM-003_Data_Protection.json',
            'data/D3-SIM-004_Infrastructure_Hardening.json',
            'data/D3-SIM-005_Resilience_Recovery.json',
            // Domain 4
            'data/D4-SIM-001_SOC_Operations.json',
            'data/D4-SIM-002_Incident_Response.json',
            'data/D4-SIM-003_Vulnerability_Management.json',
            'data/D4-SIM-004_IAM.json',
            'data/D4-SIM-005_Security_Automation.json',
            // Domain 5
            'data/D5-SIM-001_Security_Governance.json',
            'data/D5-SIM-002_Risk_Management.json',
            'data/D5-SIM-003_Third_Party_Risk.json',
            'data/D5-SIM-004_Compliance_Audit.json',
            'data/D5-SIM-005_Security_Program.json'
        ],
        
        remediation: [
            // Domain 1
            'data/D1-REM-001_Policy_Fundamentals.json',
            'data/D1-REM-002_Authentication_Access.json',
            'data/D1-REM-003_Cryptography_Clinic.json',
            // Domain 2
            'data/D2-REM-001_Know_Your_Enemy.json',
            'data/D2-REM-002_Malware_Menagerie.json',
            'data/D2-REM-003_Vulnerability_Deep_Dive.json',
            // Domain 3
            'data/D3-REM-001_Cloud_Fundamentals.json',
            'data/D3-REM-002_Network_Security.json',
            'data/D3-REM-003_Cryptography.json',
            // Domain 4
            'data/D4-REM-001_Log_Analysis.json',
            'data/D4-REM-002_Incident_Response.json',
            'data/D4-REM-003_IAM_Concepts.json',
            // Domain 5
            'data/D5-REM-001_Policy_Governance_Fundamentals.json',
            'data/D5-REM-002_Risk_Assessment_Basics.json',
            'data/D5-REM-003_Compliance_Concepts.json'
        ]
    };

    // ================================================
    // DATA LOADER CLASS
    // ================================================
    class DataLoader {
        constructor() {
            this.loaded = {
                questions: [],
                lessons: [],
                simulations: [],
                remediation: [],
                glossary: {}
            };
            this.loadStatus = {
                total: 0,
                completed: 0,
                failed: 0,
                errors: []
            };
            this.useEmbeddedFallback = false;
        }

        // Load a single JSON file with error handling
        async loadJSON(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return await response.json();
            } catch (error) {
                console.warn(`⚠️ Failed to load ${url}:`, error.message);
                this.loadStatus.failed++;
                this.loadStatus.errors.push({ url, error: error.message });
                return null;
            }
        }

        // Load all questions from question bank
        async loadQuestions() {
            console.log('📚 Loading question bank...');
            const data = await this.loadJSON(FILE_MANIFEST.questionBank);
            
            if (data && data.domains) {
                data.domains.forEach(domain => {
                    if (domain.questions) {
                        domain.questions.forEach(q => {
                            this.loaded.questions.push({
                                ...q,
                                domain: domain.domain_id
                            });
                        });
                    }
                });
                console.log(`✅ Loaded ${this.loaded.questions.length} questions`);
            } else {
                console.warn('⚠️ Question bank not loaded, using embedded questions');
                this.useEmbeddedFallback = true;
            }
            
            this.loadStatus.completed++;
            return this.loaded.questions;
        }

        // Load all lessons
        async loadLessons() {
            console.log('📖 Loading lessons...');
            const promises = FILE_MANIFEST.lessons.map(url => this.loadJSON(url));
            const results = await Promise.all(promises);
            
            // Initialize lessonData storage for enhanced viewer
            if (!window.APP.content.lessonData) {
                window.APP.content.lessonData = {};
            }
            
            results.forEach(data => {
                if (data) {
                    const lessonId = data.lesson_id || data.id;
                    
                    // Store FULL enhanced data for the enhanced lesson viewer
                    window.APP.content.lessonData[lessonId] = data;
                    
                    // Normalize lesson structure for basic viewer compatibility
                    const lesson = {
                        id: lessonId,
                        title: data.title,
                        domain: data.domain,
                        objectives: data.objectives_covered || [],
                        duration: data.estimated_duration || '30-45 min',
                        difficulty: data.difficulty || 'intermediate',
                        content: {
                            introduction: data.introduction?.hook || data.introduction || '',
                            learningGoals: data.introduction?.learning_goals || data.learning_goals || [],
                            whyItMatters: data.introduction?.why_it_matters || '',
                            sections: (data.sections || []).map(s => ({
                                title: s.title,
                                content: s.content,
                                keyPoints: s.key_points || [],
                                examTips: s.exam_tips || [],
                                realWorldExample: s.real_world_example || null,
                                glossaryTerms: s.glossary_terms || [],
                                knowledgeCheck: s.knowledge_check || null
                            })),
                            keyPoints: data.key_takeaways || [],
                            examTips: data.exam_tips || []
                        }
                    };
                    
                    this.loaded.lessons.push(lesson);
                    
                    // Extract glossary terms
                    if (data.sections) {
                        data.sections.forEach(section => {
                            if (section.glossary_terms) {
                                section.glossary_terms.forEach(term => {
                                    this.loaded.glossary[term.term] = term.definition;
                                });
                            }
                        });
                    }
                }
            });
            
            // Sort lessons by domain and ID
            this.loaded.lessons.sort((a, b) => {
                if (a.domain !== b.domain) return a.domain - b.domain;
                return a.id.localeCompare(b.id);
            });
            
            console.log(`✅ Loaded ${this.loaded.lessons.length} lessons with enhanced data`);
            this.loadStatus.completed += FILE_MANIFEST.lessons.length;
            return this.loaded.lessons;
        }

        // Load all simulations
        async loadSimulations() {
            console.log('🎮 Loading simulations...');
            const promises = FILE_MANIFEST.simulations.map(url => this.loadJSON(url));
            const results = await Promise.all(promises);
            
            results.forEach(data => {
                if (data) {
                    // Normalize simulation structure
                    const simulation = {
                        id: data.scenario_id || data.id,
                        title: data.title,
                        domain: data.domain,
                        difficulty: data.difficulty || 'intermediate',
                        duration: `${data.time_estimate_minutes || 45} min`,
                        role: data.role,
                        organization: data.organization,
                        scenario: data.scenario_introduction,
                        learningObjectives: data.learning_objectives || [],
                        decisionPoints: (data.decision_points || []).map(dp => ({
                            id: dp.id,
                            sequence: dp.sequence,
                            title: dp.title,
                            situation: dp.situation,
                            question: dp.question || dp.situation,
                            options: (dp.options || []).map(opt => ({
                                id: opt.id,
                                text: opt.text,
                                feedback: opt.feedback,
                                isOptimal: opt.is_optimal,
                                points: opt.is_optimal ? 25 : (opt.points || 5),
                                consequences: opt.consequences,
                                learningNote: opt.learning_note
                            })),
                            hints: dp.hints || [],
                            artifact: dp.artifact || null
                        })),
                        summaryPoints: data.summary_points || data.debrief?.key_lessons || [],
                        scoring: data.scoring || {
                            passingScore: 175,
                            maxScore: 250
                        }
                    };
                    
                    this.loaded.simulations.push(simulation);
                }
            });
            
            // Sort simulations by domain and ID
            this.loaded.simulations.sort((a, b) => {
                if (a.domain !== b.domain) return a.domain - b.domain;
                return a.id.localeCompare(b.id);
            });
            
            console.log(`✅ Loaded ${this.loaded.simulations.length} simulations`);
            this.loadStatus.completed += FILE_MANIFEST.simulations.length;
            return this.loaded.simulations;
        }

        // Load all remediation scenarios
        async loadRemediation() {
            console.log('🔧 Loading remediation scenarios...');
            const promises = FILE_MANIFEST.remediation.map(url => this.loadJSON(url));
            const results = await Promise.all(promises);
            
            results.forEach(data => {
                if (data) {
                    const scenario = data.scenario || data;
                    
                    // Normalize remediation structure
                    const remediation = {
                        id: scenario.id || data.id,
                        title: scenario.title || data.title,
                        domain: parseInt(scenario.id?.match(/D(\d)/)?.[1] || scenario.domain || 1),
                        difficulty: scenario.difficulty || 'intermediate',
                        duration: scenario.estimated_duration || '30-40 min',
                        focus: scenario.targets_weakness || scenario.topics_covered || [],
                        role: scenario.role || 'Security Analyst',
                        overview: scenario.overview || {},
                        companyContext: scenario.company_context || {},
                        artifacts: scenario.artifacts || [],
                        decisionPoints: (scenario.decision_points || []).map(dp => ({
                            id: dp.id,
                            sequence: dp.sequence,
                            title: dp.title,
                            context: dp.context,
                            question: dp.question,
                            options: (dp.options || []).map(opt => ({
                                id: opt.id,
                                text: opt.text,
                                isCorrect: opt.is_correct,
                                points: opt.points || (opt.is_correct ? 25 : 5),
                                feedback: opt.feedback,
                                consequence: opt.consequence
                            })),
                            hints: dp.hints || []
                        })),
                        remediationFocus: scenario.remediation_focus || ''
                    };
                    
                    this.loaded.remediation.push(remediation);
                }
            });
            
            // Sort by domain and ID
            this.loaded.remediation.sort((a, b) => {
                if (a.domain !== b.domain) return a.domain - b.domain;
                return a.id.localeCompare(b.id);
            });
            
            console.log(`✅ Loaded ${this.loaded.remediation.length} remediation scenarios`);
            this.loadStatus.completed += FILE_MANIFEST.remediation.length;
            return this.loaded.remediation;
        }

        // Load all data
        async loadAll(progressCallback) {
            this.loadStatus.total = 1 + FILE_MANIFEST.lessons.length + 
                                    FILE_MANIFEST.simulations.length + 
                                    FILE_MANIFEST.remediation.length;
            
            console.log('🚀 Starting full data load...');
            console.log(`📊 Total files to load: ${this.loadStatus.total}`);
            
            const updateProgress = () => {
                const percent = Math.round((this.loadStatus.completed / this.loadStatus.total) * 100);
                if (progressCallback) progressCallback(percent, this.loadStatus);
            };
            
            // Load in parallel for speed
            await Promise.all([
                this.loadQuestions().then(() => updateProgress()),
                this.loadLessons().then(() => updateProgress()),
                this.loadSimulations().then(() => updateProgress()),
                this.loadRemediation().then(() => updateProgress())
            ]);
            
            console.log('════════════════════════════════════════');
            console.log('📦 DATA LOAD COMPLETE');
            console.log(`✅ Questions: ${this.loaded.questions.length}`);
            console.log(`✅ Lessons: ${this.loaded.lessons.length}`);
            console.log(`✅ Simulations: ${this.loaded.simulations.length}`);
            console.log(`✅ Remediation: ${this.loaded.remediation.length}`);
            console.log(`✅ Glossary Terms: ${Object.keys(this.loaded.glossary).length}`);
            if (this.loadStatus.failed > 0) {
                console.warn(`⚠️ Failed: ${this.loadStatus.failed} files`);
            }
            console.log('════════════════════════════════════════');
            
            return this.loaded;
        }

        // Get loaded data
        getData() {
            return this.loaded;
        }

        // Check if external data loaded successfully
        hasExternalData() {
            return this.loaded.questions.length > 0 && 
                   this.loaded.lessons.length > 0 &&
                   this.loaded.simulations.length > 0;
        }
    }

    // ================================================
    // EXPORT TO GLOBAL SCOPE
    // ================================================
    window.DataLoader = DataLoader;
    window.FILE_MANIFEST = FILE_MANIFEST;
    
    console.log('✅ Data Loader Module ready');

})();
