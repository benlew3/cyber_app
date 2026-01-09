// ================================================
// DATA LOADER MODULE - Security+ Platform v33
// Loads external JSON content via Content Manifest
// ================================================

(function() {
    'use strict';

    console.log('📦 Data Loader Module initializing...');

    // Ensure Global App Structure
    window.APP = window.APP || {};
    window.APP.content = window.APP.content || {
        lessons: [],
        lessonData: {}, // Critical for Deep Dive content
        simulations: [],
        remediation: [],
        questions: [],
        glossary: {}
    };

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
        }

        // Helper: Load a single JSON file
        async loadJSON(url) {
            try {
                // Handle cases where the manifest just has the filename
                const fullPath = url.includes('/') ? url : `data/${url}`;
                const response = await fetch(fullPath);
                
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

        // 1. Load Lessons & Normalize Data
        async loadLessons() {
            console.log('📖 Loading lessons from Manifest...');
            if (!window.CONTENT_MANIFEST || !window.CONTENT_MANIFEST.lessons) {
                console.error("❌ CONTENT_MANIFEST.lessons not found");
                return [];
            }

            const promises = window.CONTENT_MANIFEST.lessons.map(url => this.loadJSON(url));
            const results = await Promise.all(promises);
            
            results.forEach(data => {
                if (data) {
                    const lessonId = data.lesson_id || data.id;
                    
                    // A. Store FULL enhanced data for the Lesson Viewer
                    window.APP.content.lessonData[lessonId] = data;
                    
                    // B. Create Summary Object for Dashboard (Backward Compatibility)
                    const lessonSummary = {
                        id: lessonId,
                        title: data.title,
                        domain: data.domain,
                        objectives: data.objectives_covered || data.objectives || [],
                        duration: data.estimated_duration || '30-45 min',
                        difficulty: data.difficulty || 'intermediate',
                        // Create a lightweight content object for previews
                        content: {
                            introduction: data.introduction?.hook || data.introduction || '',
                            learningGoals: data.introduction?.learning_goals || data.learning_goals || [],
                            sections: (data.sections || []).map(s => ({
                                title: s.title,
                                keyPoints: s.key_points || []
                            }))
                        }
                    };
                    
                    this.loaded.lessons.push(lessonSummary);
                    
                    // C. Extract Glossary Terms
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
            
            // Sort by Domain then ID
            this.loaded.lessons.sort((a, b) => {
                if (a.domain !== b.domain) return a.domain - b.domain;
                return a.id.localeCompare(b.id);
            });
            
            window.APP.content.lessons = this.loaded.lessons;
            window.APP.content.glossary = { ...window.APP.content.glossary, ...this.loaded.glossary };
            
            this.loadStatus.completed += window.CONTENT_MANIFEST.lessons.length;
            return this.loaded.lessons;
        }

        // 2. Load Simulations & Normalize
        async loadSimulations() {
            console.log('🎮 Loading simulations...');
            if (!window.CONTENT_MANIFEST || !window.CONTENT_MANIFEST.simulations) return [];

            const promises = window.CONTENT_MANIFEST.simulations.map(url => this.loadJSON(url));
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
                        decisionPoints: data.decision_points || [], // Keep full data
                        scoring: data.scoring || { passingScore: 175, maxScore: 250 }
                    };
                    
                    this.loaded.simulations.push(simulation);
                }
            });
            
            this.loaded.simulations.sort((a, b) => (a.domain - b.domain) || a.id.localeCompare(b.id));
            window.APP.content.simulations = this.loaded.simulations;
            
            this.loadStatus.completed += window.CONTENT_MANIFEST.simulations.length;
            return this.loaded.simulations;
        }

        // 3. Load Remediation
        async loadRemediation() {
            console.log('🔧 Loading remediation...');
            if (!window.CONTENT_MANIFEST || !window.CONTENT_MANIFEST.remediation) return [];

            const promises = window.CONTENT_MANIFEST.remediation.map(url => this.loadJSON(url));
            const results = await Promise.all(promises);
            
            results.forEach(data => {
                if (data) {
                    const scenario = data.scenario || data;
                    const remediation = {
                        id: scenario.id || data.id,
                        title: scenario.title || data.title,
                        domain: parseInt(scenario.id?.match(/D(\d)/)?.[1] || scenario.domain || 1),
                        difficulty: scenario.difficulty || 'intermediate',
                        focus: scenario.targets_weakness || [],
                        decisionPoints: scenario.decision_points || []
                    };
                    this.loaded.remediation.push(remediation);
                }
            });
            
            window.APP.content.remediation = this.loaded.remediation;
            this.loadStatus.completed += window.CONTENT_MANIFEST.remediation.length;
            return this.loaded.remediation;
        }

        // 4. Load Static Data (Questions, etc.)
        async loadStaticData() {
            // Questions
            const qData = await this.loadJSON('data/questions.json');
            if (qData) {
                const questions = qData.questions || qData;
                this.loaded.questions = questions;
                window.APP.content.questions = questions;
            }

            // PBQs
            const pbqData = await this.loadJSON('data/pbqs.json');
            if (pbqData) {
                window.APP.content.pbqs = pbqData;
            }
        }

        // MASTER LOAD FUNCTION
        async loadAll() {
            console.log('🚀 Starting Full Data Load...');
            const startTime = performance.now();
            
            // Calculate total files for progress tracking
            if (window.CONTENT_MANIFEST) {
                this.loadStatus.total = 
                    (window.CONTENT_MANIFEST.lessons?.length || 0) + 
                    (window.CONTENT_MANIFEST.simulations?.length || 0) + 
                    (window.CONTENT_MANIFEST.remediation?.length || 0) + 2; // + questions & pbqs
            }

            // Parallel Execution
            await Promise.all([
                this.loadLessons(),
                this.loadSimulations(),
                this.loadRemediation(),
                this.loadStaticData()
            ]);

            const endTime = performance.now();
            console.log(`✅ DATA LOAD COMPLETE in ${(endTime - startTime).toFixed(2)}ms`);
            console.log(`   - Lessons: ${this.loaded.lessons.length}`);
            console.log(`   - Simulations: ${this.loaded.simulations.length}`);
            console.log(`   - Questions: ${this.loaded.questions.length}`);

            // Dispatch Ready Event for React & App
            window.dispatchEvent(new CustomEvent('app-data-ready', { 
                detail: window.APP.content 
            }));

            // Auto-start app if function exists
            if (typeof window.startApp === 'function') {
                window.startApp();
            }

            return this.loaded;
        }
    }

    // Initialize and Run
    window.DataLoader = new DataLoader();
    document.addEventListener('DOMContentLoaded', () => {
        // Wait briefly for Manifest to be sure
        setTimeout(() => window.DataLoader.loadAll(), 50);
    });

})();
