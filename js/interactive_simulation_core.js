// ================================================
// INTERACTIVE SIMULATION SYSTEM - CORE ENGINE
// Professional Security+ Training with Visual Elements
// ================================================

// This replaces basic simulations with interactive tools and visual displays

// ================================================
// SIMULATION ENGINE CLASS
// ================================================

class InteractiveSimulationEngine {
    constructor() {
        this.currentSimulation = null;
        this.currentStage = 0;
        this.userActions = [];
        this.score = 0;
        this.maxScore = 100;
        this.startTime = null;
        this.tools = {
            terminal: null,
            siem: null,
            networkDiagram: null,
            logAnalyzer: null
        };
    }

    async init(simId, simData) {
        this.currentSimulation = simData;
        this.currentStage = 0;
        this.userActions = [];
        this.score = 0;
        this.startTime = Date.now();
        
        // Handle different data formats - convert decision_points to stages if needed
        if (!simData.stages) {
            if (simData.decision_points && simData.decision_points.length > 0) {
                // Convert decision_points format to stages format
                simData.stages = this.convertDecisionPointsToStages(simData);
            } else if (simData.steps && simData.steps.length > 0) {
                // Convert old steps format
                simData.stages = this.convertStepsToStages(simData);
            } else {
                // Generate default stages
                simData.stages = this.generateDefaultStages(simData);
            }
        }
        
        return true;
    }

    // Convert decision_points format (from JSON files) to interactive stages
    convertDecisionPointsToStages(simData) {
        const stages = [];
        
        // Add briefing stage
        stages.push({
            type: 'briefing',
            title: simData.title || 'Security Scenario Briefing',
            content: simData.scenario_introduction || simData.scenario || 'A security situation requires your attention.',
            organization: simData.organization,
            learning_objectives: simData.learning_objectives,
            duration: '2-3 minutes'
        });
        
        // Convert each decision point to an interactive stage
        simData.decision_points.forEach((dp, index) => {
            stages.push({
                type: 'decision',
                title: dp.title || `Decision Point ${index + 1}`,
                situation: dp.situation,
                question: dp.question || 'What do you do?',
                options: dp.options,
                key_terms: dp.key_terms,
                duration: '3-5 minutes'
            });
        });
        
        // Add summary/report stage
        stages.push({
            type: 'report',
            title: 'Scenario Summary',
            content: 'Review your decisions and their outcomes',
            summary_points: simData.summary_points,
            duration: '2 minutes'
        });
        
        return stages;
    }

    // Convert old steps format to stages
    convertStepsToStages(simData) {
        const stages = [];
        
        // Add briefing
        stages.push({
            type: 'briefing',
            title: simData.title || 'Security Scenario',
            content: simData.scenario || 'A security situation requires your attention.',
            duration: '2 minutes'
        });
        
        // Convert steps to decision stages
        simData.steps.forEach((step, index) => {
            stages.push({
                type: 'decision',
                title: `Step ${index + 1}`,
                situation: step.situation,
                question: step.question,
                options: step.options.map(opt => ({
                    id: opt.id || String.fromCharCode(97 + step.options.indexOf(opt)),
                    text: opt.text,
                    is_optimal: opt.correct,
                    feedback: opt.feedback || (opt.correct ? 'Correct!' : 'Not the best choice.'),
                    points: opt.points || (opt.correct ? 25 : 5)
                }))
            });
        });
        
        return stages;
    }

    generateDefaultStages(simData) {
        return [
            {
                type: 'briefing',
                title: 'Security Incident Briefing',
                content: simData.scenario || 'A security incident requires your attention.',
                duration: '2-3 minutes'
            },
            {
                type: 'visual_analysis', 
                title: 'Visual Analysis',
                content: 'Analyze the network topology and identify threats',
                visualType: 'network_diagram',
                duration: '5 minutes'
            },
            {
                type: 'interactive_tool',
                title: 'Investigation & Response',
                content: 'Use security tools to investigate and respond',
                toolType: 'terminal',
                duration: '10-15 minutes'
            },
            {
                type: 'report',
                title: 'Final Report',
                content: 'Document your findings and recommendations',
                duration: '5 minutes'
            }
        ];
    }

    getCurrentStage() {
        if (!this.currentSimulation || !this.currentSimulation.stages) return null;
        return this.currentSimulation.stages[this.currentStage];
    }

    nextStage() {
        this.currentStage++;
        if (this.currentStage >= this.currentSimulation.stages.length) {
            return 'complete';
        }
        return 'continue';
    }

    recordAction(action, details) {
        this.userActions.push({
            timestamp: Date.now() - this.startTime,
            stage: this.currentStage,
            action: action,
            details: details
        });
        
        this.calculateScoreImpact(action, details);
    }

    calculateScoreImpact(action, details) {
        const scoringRules = {
            'correct_identification': 10,
            'proper_tool_usage': 5,
            'efficient_solution': 15,
            'security_best_practice': 10,
            'missed_vulnerability': -5,
            'incorrect_action': -10,
            'task_completed': 8,
            'evidence_collected': 5
        };
        
        if (scoringRules[action]) {
            this.score += scoringRules[action];
            this.score = Math.max(0, Math.min(this.maxScore, this.score));
        }
    }

    getFinalResults() {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
        const percentage = Math.round((this.score / this.maxScore) * 100);
        
        return {
            score: this.score,
            maxScore: this.maxScore,
            percentage: percentage,
            grade: this.calculateGrade(percentage),
            timeSpent: timeSpent,
            actions: this.userActions,
            feedback: this.generateFeedback(percentage)
        };
    }

    calculateGrade(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }

    generateFeedback(percentage) {
        const feedback = [];
        
        if (percentage >= 90) {
            feedback.push("Excellent work! You demonstrated expert-level security skills.");
            feedback.push("Your threat identification was accurate and timely.");
        } else if (percentage >= 70) {
            feedback.push("Good performance! You handled the incident effectively.");
            feedback.push("Consider reviewing advanced response techniques.");
        } else {
            feedback.push("Review incident response procedures and try again.");
            feedback.push("Focus on threat identification and containment strategies.");
        }
        
        // Add specific feedback based on actions
        const actionTypes = {};
        this.userActions.forEach(action => {
            actionTypes[action.action] = (actionTypes[action.action] || 0) + 1;
        });
        
        if (!actionTypes['evidence_collected']) {
            feedback.push("Remember to collect forensic evidence during incidents.");
        }
        
        if (!actionTypes['security_best_practice']) {
            feedback.push("Always follow security best practices in your response.");
        }
        
        return feedback;
    }
}

// Global instance
let simEngine = new InteractiveSimulationEngine();

// ================================================
// VISUAL COMPONENTS
// ================================================

class VisualComponents {
    static createNetworkDiagram(data) {
        const threats = data.threats || {};
        const status = data.status || {};
        
        return `
            <div class="network-diagram" style="background: #1a1a2e; border-radius: 8px; padding: 20px; position: relative; min-height: 500px;">
                <h3 style="color: #6366f1; margin-bottom: 20px;">🌐 Network Topology Analysis</h3>
                
                <div style="position: relative; height: 450px;">
                    <!-- Internet/External -->
                    <div class="network-element clickable" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); 
                                                         background: ${threats.internet ? '#7f1d1d' : '#27272a'}; 
                                                         padding: 15px 25px; border-radius: 8px; cursor: pointer;
                                                         border: 2px solid ${threats.internet ? '#ef4444' : '#3f3f46'};"
                         onclick="examineNetworkElement('internet')"
                         title="Click to examine">
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem;">🌐</div>
                            <div style="font-weight: bold;">Internet</div>
                            ${threats.internet ? '<span style="color: #ef4444; font-size: 1.2rem;">⚠️ THREAT</span>' : '<span style="color: #10b981;">✓</span>'}
                        </div>
                    </div>
                    
                    <!-- Firewall -->
                    <div class="network-element clickable" style="position: absolute; top: 120px; left: 50%; transform: translateX(-50%);
                                                         background: ${status.firewall === 'compromised' ? '#7f1d1d' : '#27272a'};
                                                         padding: 15px 25px; border-radius: 8px; cursor: pointer;
                                                         border: 2px solid ${status.firewall === 'compromised' ? '#ef4444' : '#10b981'};"
                         onclick="examineNetworkElement('firewall')">
                        <div style="text-align: center;">
                            <div style="font-size: 2.5rem;">🛡️</div>
                            <div style="font-weight: bold;">Firewall</div>
                            <div style="margin-top: 5px;">
                                ${status.firewall === 'compromised' ? 
                                  '<span style="color: #ef4444;">🔴 COMPROMISED</span>' : 
                                  '<span style="color: #10b981;">🟢 ACTIVE</span>'}
                            </div>
                        </div>
                    </div>
                    
                    <!-- DMZ Zone -->
                    <div style="position: absolute; top: 220px; left: 10%; right: 10%; 
                                border: 2px dashed #6366f1; border-radius: 8px; padding: 15px;
                                background: rgba(99, 102, 241, 0.05);">
                        <div style="color: #6366f1; font-weight: bold; margin-bottom: 10px;">DMZ - Demilitarized Zone</div>
                        
                        <div style="display: flex; justify-content: space-around;">
                            <!-- Web Server -->
                            <div class="network-element clickable" 
                                 style="background: ${status.webserver === 'infected' ? '#7f1d1d' : '#27272a'}; 
                                        padding: 10px 15px; border-radius: 6px; cursor: pointer;
                                        border: 2px solid ${status.webserver === 'infected' ? '#ef4444' : '#3f3f46'};"
                                 onclick="examineNetworkElement('webserver')">
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem;">🖥️</div>
                                    <div style="font-size: 0.9rem;">Web Server</div>
                                    ${status.webserver === 'infected' ? 
                                      '<span style="color: #ef4444; font-size: 0.8rem;">INFECTED</span>' : 
                                      '<span style="color: #10b981; font-size: 0.8rem;">OK</span>'}
                                </div>
                            </div>
                            
                            <!-- Mail Server -->
                            <div class="network-element clickable" 
                                 style="background: ${status.mailserver === 'suspicious' ? '#78350f' : '#27272a'}; 
                                        padding: 10px 15px; border-radius: 6px; cursor: pointer;
                                        border: 2px solid ${status.mailserver === 'suspicious' ? '#f59e0b' : '#3f3f46'};"
                                 onclick="examineNetworkElement('mailserver')">
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem;">📧</div>
                                    <div style="font-size: 0.9rem;">Mail Server</div>
                                    ${status.mailserver === 'suspicious' ? 
                                      '<span style="color: #f59e0b; font-size: 0.8rem;">SUSPICIOUS</span>' : 
                                      '<span style="color: #10b981; font-size: 0.8rem;">OK</span>'}
                                </div>
                            </div>
                            
                            <!-- DNS Server -->
                            <div class="network-element clickable" 
                                 style="background: #27272a; padding: 10px 15px; 
                                        border-radius: 6px; cursor: pointer; border: 2px solid #3f3f46;"
                                 onclick="examineNetworkElement('dns')">
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem;">🔍</div>
                                    <div style="font-size: 0.9rem;">DNS Server</div>
                                    <span style="color: #10b981; font-size: 0.8rem;">OK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Internal Network -->
                    <div style="position: absolute; bottom: 20px; left: 10%; right: 10%; 
                                border: 2px solid #10b981; border-radius: 8px; padding: 15px;
                                background: rgba(16, 185, 129, 0.05);">
                        <div style="color: #10b981; font-weight: bold; margin-bottom: 10px;">Internal Network - Secure Zone</div>
                        
                        <div style="display: flex; justify-content: space-between;">
                            <!-- Workstations -->
                            ${Array.from({length: 4}, (_, i) => `
                                <div class="network-element clickable" 
                                     style="background: ${i === 2 ? '#7f1d1d' : '#27272a'}; 
                                            padding: 8px; border-radius: 4px; cursor: pointer;
                                            border: 2px solid ${i === 2 ? '#ef4444' : '#3f3f46'};"
                                     onclick="examineNetworkElement('workstation${i+1}')"
                                     title="Workstation ${i+1}">
                                    <div style="text-align: center;">
                                        <div style="font-size: 1.5rem;">💻</div>
                                        <div style="font-size: 0.8rem;">WS${i+1}</div>
                                        ${i === 2 ? '<span style="color: #ef4444; font-size: 0.7rem;">!</span>' : ''}
                                    </div>
                                </div>
                            `).join('')}
                            
                            <!-- Database Server -->
                            <div class="network-element clickable" 
                                 style="background: #27272a; padding: 8px; 
                                        border-radius: 4px; cursor: pointer; border: 2px solid #3f3f46;"
                                 onclick="examineNetworkElement('database')">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem;">🗄️</div>
                                    <div style="font-size: 0.8rem;">Database</div>
                                    <span style="color: #10b981; font-size: 0.7rem;">✓</span>
                                </div>
                            </div>
                            
                            <!-- File Server -->
                            <div class="network-element clickable" 
                                 style="background: #27272a; padding: 8px; 
                                        border-radius: 4px; cursor: pointer; border: 2px solid #3f3f46;"
                                 onclick="examineNetworkElement('fileserver')">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem;">📁</div>
                                    <div style="font-size: 0.8rem;">Files</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Legend -->
                <div style="margin-top: 20px; padding: 10px; background: #27272a; border-radius: 6px;">
                    <div style="display: flex; justify-content: space-around; font-size: 0.9rem;">
                        <span><span style="color: #ef4444;">🔴</span> Compromised</span>
                        <span><span style="color: #f59e0b;">🟡</span> Suspicious</span>
                        <span><span style="color: #10b981;">🟢</span> Secure</span>
                        <span>Click any element to investigate</span>
                    </div>
                </div>
            </div>
        `;
    }

    static createThreatVisualization(threats) {
        return `
            <div class="threat-viz" style="background: #1a1a2e; border-radius: 8px; padding: 20px;">
                <h3 style="color: #ef4444; margin-bottom: 20px;">🚨 Active Threat Detection</h3>
                
                <div style="display: grid; gap: 15px;">
                    ${threats.map((threat, i) => `
                        <div class="threat-card hoverable" 
                             style="background: #27272a; 
                                    border-left: 4px solid ${
                                        threat.severity === 'critical' ? '#ef4444' : 
                                        threat.severity === 'high' ? '#f59e0b' : '#fbbf24'
                                    };
                                    padding: 15px; border-radius: 4px; cursor: pointer;
                                    transition: all 0.3s;"
                             onclick="investigateThreat('${threat.id}')"
                             onmouseover="this.style.background='#3f3f46'"
                             onmouseout="this.style.background='#27272a'">
                            
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div style="flex: 1;">
                                    <div style="font-weight: bold; color: #fafafa; margin-bottom: 8px;">
                                        ${threat.type}
                                    </div>
                                    <div style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 8px;">
                                        <span style="color: #6366f1;">Source:</span> ${threat.source}<br>
                                        <span style="color: #6366f1;">Target:</span> ${threat.target}
                                    </div>
                                    <div style="color: #71717a; font-size: 0.85rem;">
                                        ${threat.description || 'Click to investigate'}
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="background: ${
                                        threat.severity === 'critical' ? '#ef4444' : 
                                        threat.severity === 'high' ? '#f59e0b' : '#fbbf24'
                                    }; color: #000; padding: 4px 8px; border-radius: 4px; 
                                                font-size: 0.8rem; font-weight: bold; margin-bottom: 5px;">
                                        ${threat.severity.toUpperCase()}
                                    </div>
                                    <div style="color: #71717a; font-size: 0.8rem;">
                                        ${threat.timestamp}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #3f3f46;">
                                <button onclick="event.stopPropagation(); containThreat('${threat.id}')" 
                                        style="padding: 4px 12px; background: #6366f1; color: white; 
                                               border: none; border-radius: 4px; margin-right: 8px; cursor: pointer;">
                                    Contain
                                </button>
                                <button onclick="event.stopPropagation(); analyzeThreat('${threat.id}')" 
                                        style="padding: 4px 12px; background: #27272a; color: #fafafa; 
                                               border: 1px solid #3f3f46; border-radius: 4px; cursor: pointer;">
                                    Analyze
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    static createLogViewer(logs) {
        return `
            <div class="log-viewer" style="background: #0a0a0a; border: 1px solid #27272a; border-radius: 8px; padding: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="color: #10b981; margin: 0;">📜 System Logs - Real-time Feed</h4>
                    <div>
                        <button onclick="filterLogs('all')" class="log-filter-btn" 
                                style="padding: 5px 10px; background: #27272a; color: #fafafa; 
                                       border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;">
                            All
                        </button>
                        <button onclick="filterLogs('error')" class="log-filter-btn"
                                style="padding: 5px 10px; background: #27272a; color: #ef4444; 
                                       border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;">
                            Errors
                        </button>
                        <button onclick="filterLogs('warning')" class="log-filter-btn"
                                style="padding: 5px 10px; background: #27272a; color: #f59e0b; 
                                       border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;">
                            Warnings
                        </button>
                        <button onclick="exportLogs()" 
                                style="padding: 5px 10px; background: #6366f1; color: white; 
                                       border: none; border-radius: 4px; cursor: pointer;">
                            Export
                        </button>
                    </div>
                </div>
                
                <div class="log-content" id="log-content" 
                     style="max-height: 300px; overflow-y: auto; font-family: 'Courier New', monospace; font-size: 0.9rem;">
                    ${logs.map(log => `
                        <div class="log-entry" data-level="${log.level}" 
                             style="margin-bottom: 5px; padding: 5px; 
                                    background: ${
                                        log.level === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                                        log.level === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                                    };">
                            <span style="color: #71717a;">${log.timestamp}</span>
                            <span style="color: ${
                                log.level === 'error' ? '#ef4444' : 
                                log.level === 'warning' ? '#f59e0b' : 
                                log.level === 'success' ? '#10b981' : '#6366f1'
                            };">
                                [${log.level.toUpperCase()}]
                            </span>
                            <span style="color: #fafafa;">${log.message}</span>
                            ${log.source ? `<span style="color: #71717a;"> (${log.source})</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <!-- Auto-scroll indicator -->
                <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between;">
                    <label style="color: #71717a; font-size: 0.9rem;">
                        <input type="checkbox" id="auto-scroll" checked> Auto-scroll
                    </label>
                    <span style="color: #71717a; font-size: 0.9rem;">
                        <span id="log-count">${logs.length}</span> entries
                    </span>
                </div>
            </div>
        `;
    }
}

// Export for use in other files
window.InteractiveSimulationEngine = InteractiveSimulationEngine;
window.VisualComponents = VisualComponents;
window.simEngine = simEngine;
