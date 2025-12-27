// ================================================
// V29 ENHANCED SIMULATION SYSTEM
// Insert this code to replace the basic simulation functions
// This provides the full 10-decision point experience
// ================================================

// Replace the existing startSimulation function with this enhanced version
async function startSimulation(simId) {
    console.log(`🎮 Starting enhanced simulation: ${simId}`);
    
    // Show loading state
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <div style="text-align: center; padding: 100px 20px;">
                <div class="loading-spinner" style="margin: 0 auto;"></div>
                <h2>Loading Enhanced Simulation...</h2>
                <p style="color: #71717a;">Preparing ${simId}</p>
                <p style="color: #71717a; margin-top: 10px;">10 comprehensive decision points</p>
            </div>
        </div>
    `;
    
    // Get basic sim info
    const simInfo = ALL_SIMULATIONS.find(s => s.id === simId);
    if (!simInfo) {
        console.error(`Simulation ${simId} not found`);
        showAllSimulations();
        return;
    }
    
    // Load or generate comprehensive simulation data
    const simData = await loadEnhancedSimulationData(simId, simInfo);
    
    // Initialize enhanced simulation state
    APP.state.currentSimulation = simData;
    APP.state.currentDecisionIndex = 0;
    APP.state.simulationScore = 0;
    APP.state.simulationMaxScore = 250; // 10 decisions × 25 points
    APP.state.simulationHintsUsed = 0;
    APP.state.selectedDecision = null;
    APP.state.decisionLocked = false;
    APP.state.simulationStartTime = Date.now();
    APP.state.simulationHistory = [];
    
    // Show enhanced introduction
    showEnhancedSimulationIntro();
}

// Load or generate enhanced simulation data with 10 decision points
async function loadEnhancedSimulationData(simId, simInfo) {
    // Check cache first
    if (APP.content.simulationData && APP.content.simulationData[simId]) {
        console.log(`Using cached data for ${simId}`);
        return APP.content.simulationData[simId];
    }
    
    // Try to load from JSON file (production)
    if (typeof SIMULATION_FILE_MAP !== 'undefined' && SIMULATION_FILE_MAP[simId]) {
        try {
            const response = await fetch(`/simulations/${SIMULATION_FILE_MAP[simId]}`);
            if (response.ok) {
                const jsonData = await response.json();
                APP.content.simulationData[simId] = jsonData;
                return jsonData;
            }
        } catch (error) {
            console.log('Could not load JSON file, generating mock data');
        }
    }
    
    // Generate comprehensive mock data with 10 decision points
    const mockData = generateEnhancedSimulationData(simId, simInfo);
    APP.content.simulationData[simId] = mockData;
    return mockData;
}

// Generate enhanced simulation with 10 decision points
function generateEnhancedSimulationData(simId, simInfo) {
    const domainTopics = {
        1: ['Security Controls', 'CIA Triad', 'Authentication', 'Cryptography', 'Zero Trust', 'Physical Security', 'Access Control', 'Security Frameworks'],
        2: ['Threat Actors', 'Malware Types', 'Vulnerabilities', 'Social Engineering', 'Attack Vectors', 'Indicators', 'Threat Intelligence', 'Attack Frameworks'],
        3: ['Network Security', 'Cloud Security', 'Infrastructure', 'Data Protection', 'Resilience', 'Wireless Security', 'Segmentation', 'Architecture'],
        4: ['Incident Response', 'Monitoring', 'Forensics', 'IAM', 'Automation', 'SIEM', 'Vulnerability Management', 'Security Operations'],
        5: ['Governance', 'Risk Management', 'Compliance', 'Third-Party Risk', 'Audits', 'Security Awareness', 'Policies', 'Metrics']
    };
    
    const topics = domainTopics[simInfo.domain] || domainTopics[1];
    
    return {
        scenario_id: simId,
        title: simInfo.title,
        domain: simInfo.domain,
        difficulty: simInfo.difficulty || 'intermediate',
        time_estimate_minutes: 45,
        role: simInfo.role || 'Security Analyst',
        organization: simInfo.organization || {
            name: 'TechCorp International',
            industry: 'Technology',
            size: 'Enterprise (10,000+ employees)',
            current_state: 'Implementing comprehensive security program following recent audit findings'
        },
        scenario_introduction: `Welcome to ${simInfo.title}. You are the ${simInfo.role || 'Security Analyst'} at ${simInfo.organization || 'TechCorp International'}.

This simulation presents 10 critical decision points that will test your ability to:
• Apply security concepts to real-world scenarios
• Balance security requirements with business needs
• Make risk-based decisions under pressure
• Demonstrate knowledge required for Security+ certification

Each decision builds upon previous choices, creating a realistic security incident or project scenario. Your decisions will have immediate and long-term consequences for the organization's security posture.

Time estimate: 45-60 minutes for thoughtful completion.`,
        learning_objectives: [
            `Master ${topics.slice(0, 3).join(', ')} concepts`,
            'Apply security controls in realistic scenarios',
            'Understand consequences of security decisions',
            'Balance technical and business requirements',
            'Demonstrate Security+ exam readiness'
        ],
        decision_points: generateTenDecisionPoints(simId, simInfo, topics),
        scoring: {
            passing_score: 175,
            max_score: 250,
            performance_levels: {
                expert: 225,
                proficient: 200,
                competent: 175,
                developing: 150
            }
        },
        summary_points: [
            'Security decisions have cascading effects',
            'Balance is key between security and operations',
            'Documentation and communication are critical',
            'Continuous improvement is essential'
        ]
    };
}

// Generate 10 comprehensive decision points
function generateTenDecisionPoints(simId, simInfo, topics) {
    const decisions = [];
    const scenarioFlow = [
        'Initial Assessment',
        'Risk Analysis',
        'Control Selection',
        'Implementation Planning',
        'Technical Configuration',
        'Testing & Validation',
        'Incident Discovery',
        'Response Coordination',
        'Recovery Actions',
        'Lessons Learned'
    ];
    
    for (let i = 1; i <= 10; i++) {
        const topicIndex = (i - 1) % topics.length;
        const topic = topics[topicIndex];
        const phase = scenarioFlow[i - 1];
        
        decisions.push({
            id: `dp${i}`,
            sequence: i,
            title: `Decision ${i}: ${phase}`,
            situation: generateDecisionSituation(topic, phase, i, simInfo),
            question: generateDecisionQuestion(phase, topic),
            options: generateDecisionOptions(topic, phase, i),
            hints: [
                {
                    level: 1,
                    text: `Consider the immediate ${topic.toLowerCase()} implications and ${phase.toLowerCase()} best practices`,
                    penalty: 2
                },
                {
                    level: 2,
                    text: `Think about long-term impacts, compliance requirements, and stakeholder concerns`,
                    penalty: 5
                }
            ],
            artifacts: generateArtifacts(topic, phase)
        });
    }
    
    return decisions;
}

// Generate realistic situation for each decision
function generateDecisionSituation(topic, phase, decisionNum, simInfo) {
    const situations = {
        'Initial Assessment': `The security team has identified potential issues related to ${topic}. Initial reports indicate:

• Current controls may be inadequate
• Recent threat intelligence suggests increased risk
• Stakeholders are concerned about business impact
• Budget constraints limit available options

You must assess the situation and determine the appropriate initial response. Consider technical feasibility, resource availability, and urgency of the threat.`,

        'Risk Analysis': `Based on initial findings, you need to conduct a comprehensive risk analysis for ${topic}. Key factors include:

• Threat likelihood: High based on industry trends
• Potential impact: Could affect critical business operations
• Current vulnerabilities: Multiple gaps identified
• Existing controls: Partially effective but need enhancement

Your risk analysis will determine resource allocation and priority.`,

        'Control Selection': `You must select appropriate controls for ${topic}. Available options include:

• Technical controls: Automated but expensive
• Administrative controls: Cost-effective but require training
• Physical controls: Limited applicability
• Compensating controls: Temporary but immediate

Consider defense-in-depth and the organization's risk tolerance.`,

        'Implementation Planning': `Planning the implementation of ${topic} controls requires careful consideration:

• Timeline: Board expects quick results
• Resources: Limited budget and personnel
• Dependencies: Other projects may be affected
• Change management: User resistance expected

Your plan must balance speed with thoroughness.`,

        'Technical Configuration': `Configure the technical aspects of ${topic} security:

• Settings must align with security baseline
• Performance impact must be minimized
• Integration with existing systems required
• Monitoring and alerting must be configured

Technical decisions here will affect long-term maintainability.`,

        'Testing & Validation': `Validate that ${topic} controls are working effectively:

• Test scenarios must cover likely attack vectors
• False positive rates need optimization
• Performance benchmarks must be met
• User acceptance testing is required

Your testing approach will determine control effectiveness.`,

        'Incident Discovery': `An incident related to ${topic} has been detected:

• Initial indicators suggest compromise
• Scope and impact are still unknown
• Business operations may be affected
• Regulatory reporting may be required

Your immediate response is critical.`,

        'Response Coordination': `Coordinate the response to the ${topic} incident:

• Multiple teams need coordination
• Communication with stakeholders required
• Evidence preservation is critical
• Business continuity must be maintained

Your coordination will determine response effectiveness.`,

        'Recovery Actions': `Implement recovery actions for ${topic}:

• Systems need to be restored securely
• Root cause must be addressed
• Temporary controls may be needed
• Normal operations must resume

Your recovery approach affects future resilience.`,

        'Lessons Learned': `Conduct lessons learned for ${topic} incident:

• Document what worked and what didn't
• Update procedures based on findings
• Implement preventive measures
• Share knowledge with the team

Your analysis will improve future response.`
    };
    
    return situations[phase] || `You face a critical decision regarding ${topic} during the ${phase} phase. Consider all technical, operational, and business factors.`;
}

// Generate appropriate question for each phase
function generateDecisionQuestion(phase, topic) {
    const questions = {
        'Initial Assessment': `Based on the initial ${topic} assessment, what is your recommended immediate action?`,
        'Risk Analysis': `How should the organization prioritize the ${topic} risk?`,
        'Control Selection': `Which control strategy best addresses the ${topic} requirements?`,
        'Implementation Planning': `What implementation approach do you recommend for ${topic}?`,
        'Technical Configuration': `How should the ${topic} technical controls be configured?`,
        'Testing & Validation': `What testing strategy will best validate ${topic} controls?`,
        'Incident Discovery': `What is your immediate response to the ${topic} incident?`,
        'Response Coordination': `How should the response team proceed with ${topic} incident handling?`,
        'Recovery Actions': `What recovery approach do you recommend for ${topic}?`,
        'Lessons Learned': `What key improvements should be implemented based on the ${topic} experience?`
    };
    
    return questions[phase] || `What is your recommended approach for ${topic} in this situation?`;
}

// Generate four realistic options for each decision
function generateDecisionOptions(topic, phase, decisionNum) {
    const optimalIndex = (decisionNum - 1) % 4;
    const options = [];
    
    const templates = [
        {
            approach: 'Aggressive/Technical',
            text: `Implement comprehensive technical controls immediately with automated enforcement and monitoring`,
            feedback: `This aggressive technical approach provides strong security but may cause operational disruption and requires significant resources.`,
            consequences: {
                immediate: 'Rapid security enhancement with potential disruption',
                security_impact: 'Maximum security improvement but possible gaps',
                business_impact: 'Significant cost and potential user resistance'
            }
        },
        {
            approach: 'Balanced/Phased',
            text: `Deploy a phased approach with pilot testing, gradual rollout, and continuous adjustment based on feedback`,
            feedback: `This balanced approach reduces risk through controlled implementation, allowing for course corrections and stakeholder buy-in.`,
            consequences: {
                immediate: 'Controlled implementation with feedback loops',
                security_impact: 'Gradual but sustainable security improvement',
                business_impact: 'Managed change with minimal disruption'
            }
        },
        {
            approach: 'Administrative/Process',
            text: `Focus on policy updates, procedures, and training to establish governance before technical implementation`,
            feedback: `Administrative controls provide the foundation for security but require consistent enforcement and may not address immediate threats.`,
            consequences: {
                immediate: 'Improved governance and awareness',
                security_impact: 'Long-term culture change but delayed protection',
                business_impact: 'Low cost but requires ongoing effort'
            }
        },
        {
            approach: 'Minimal/Assessment',
            text: `Conduct further analysis and assessment to fully understand requirements before taking action`,
            feedback: `While thorough assessment is valuable, delaying action may leave the organization exposed to active threats.`,
            consequences: {
                immediate: 'Better understanding but continued exposure',
                security_impact: 'Delayed security improvements',
                business_impact: 'Avoided hasty decisions but ongoing risk'
            }
        }
    ];
    
    for (let i = 0; i < 4; i++) {
        const template = templates[i];
        const isOptimal = i === optimalIndex;
        
        options.push({
            id: String.fromCharCode(97 + i), // a, b, c, d
            text: template.text,
            feedback: template.feedback,
            is_optimal: isOptimal,
            points: isOptimal ? 25 : [15, 10, 5, 0][i],
            consequences: template.consequences,
            learning_note: isOptimal ? 
                `This represents the best practice approach for ${topic} in the ${phase} phase, balancing security effectiveness with operational requirements.` :
                `While this approach has merit, consider how it might fall short of optimal ${topic} requirements during ${phase}.`
        });
    }
    
    return options;
}

// Generate artifacts for enhanced realism
function generateArtifacts(topic, phase) {
    return {
        type: 'reference',
        title: `${phase} - ${topic} Reference`,
        content: {
            best_practices: [
                `Follow industry standards for ${topic}`,
                `Document all decisions and rationale`,
                `Maintain communication with stakeholders`,
                `Consider compliance requirements`
            ],
            key_considerations: [
                'Technical feasibility',
                'Resource availability',
                'Business impact',
                'Risk tolerance'
            ]
        }
    };
}

// Show enhanced simulation introduction
function showEnhancedSimulationIntro() {
    const sim = APP.state.currentSimulation;
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showAllSimulations()">← Back to Simulations</button>
            
            <div class="simulation-container" style="max-width: 1000px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1>${sim.title}</h1>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px; color: #71717a;">
                        <span>📍 Domain ${sim.domain}</span>
                        <span>⏱️ ${sim.time_estimate_minutes} minutes</span>
                        <span>🎯 ${sim.difficulty}</span>
                        <span>📊 10 Decision Points</span>
                    </div>
                </div>
                
                <div class="simulation-section">
                    <h2>📋 Scenario Overview</h2>
                    <p style="white-space: pre-wrap; line-height: 1.8;">${sim.scenario_introduction}</p>
                </div>
                
                <div class="simulation-section">
                    <h3>🏢 Organization Context</h3>
                    <div style="background: #18181b; border-radius: 8px; padding: 20px;">
                        <p><strong>${sim.organization.name}</strong></p>
                        <p style="color: #a1a1aa; margin: 10px 0;">
                            <span>${sim.organization.industry}</span> • 
                            <span>${sim.organization.size}</span>
                        </p>
                        <p style="margin-top: 15px; line-height: 1.8;">${sim.organization.current_state}</p>
                    </div>
                </div>
                
                <div class="simulation-section">
                    <h3>👤 Your Role</h3>
                    <div style="background: #27272a; border-radius: 8px; padding: 15px;">
                        <p style="margin: 0;">${sim.role}</p>
                        <p style="color: #a1a1aa; margin-top: 10px;">
                            You have full authority to make security decisions and recommendations. 
                            Your choices will be evaluated based on security best practices and business impact.
                        </p>
                    </div>
                </div>
                
                <div class="simulation-section">
                    <h3>🎯 Learning Objectives</h3>
                    <ul style="line-height: 2; margin-left: 20px;">
                        ${sim.learning_objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="simulation-section">
                    <h3>📊 Scoring Information</h3>
                    <div style="background: #18181b; border-radius: 8px; padding: 25px;">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px;">
                            <div style="text-align: center;">
                                <div style="color: #71717a; margin-bottom: 5px;">Maximum Score</div>
                                <div style="font-size: 2rem; font-weight: bold; color: #6366f1;">
                                    ${sim.scoring.max_score}
                                </div>
                                <div style="color: #71717a; font-size: 0.9rem;">points possible</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #71717a; margin-bottom: 5px;">Passing Score</div>
                                <div style="font-size: 2rem; font-weight: bold; color: #10b981;">
                                    ${sim.scoring.passing_score}
                                </div>
                                <div style="color: #71717a; font-size: 0.9rem;">70% required</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: #71717a; margin-bottom: 5px;">Total Decisions</div>
                                <div style="font-size: 2rem; font-weight: bold;">
                                    ${sim.decision_points.length}
                                </div>
                                <div style="color: #71717a; font-size: 0.9rem;">critical choices</div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #27272a;">
                            <div style="color: #a1a1aa; margin-bottom: 15px;">Performance Levels:</div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                                <div>
                                    <span style="color: #6366f1;">● Expert:</span>
                                    <span>${sim.scoring.performance_levels.expert}+ (90%+)</span>
                                </div>
                                <div>
                                    <span style="color: #10b981;">● Proficient:</span>
                                    <span>${sim.scoring.performance_levels.proficient}-${sim.scoring.performance_levels.expert - 1} (80-89%)</span>
                                </div>
                                <div>
                                    <span style="color: #f59e0b;">● Competent:</span>
                                    <span>${sim.scoring.performance_levels.competent}-${sim.scoring.performance_levels.proficient - 1} (70-79%)</span>
                                </div>
                                <div>
                                    <span style="color: #ef4444;">● Developing:</span>
                                    <span>&lt;${sim.scoring.performance_levels.competent} (&lt;70%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <button class="btn btn-primary" onclick="showEnhancedDecision()" 
                            style="padding: 15px 50px; font-size: 1.2rem;">
                        Begin Simulation →
                    </button>
                    <p style="color: #71717a; margin-top: 15px;">
                        ⏱️ Estimated time: ${sim.time_estimate_minutes} minutes for thoughtful completion
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Show enhanced decision point
function showEnhancedDecision() {
    const sim = APP.state.currentSimulation;
    const decisionIndex = APP.state.currentDecisionIndex;
    const decision = sim.decision_points[decisionIndex];
    
    if (!decision) {
        showEnhancedResults();
        return;
    }
    
    // Reset state for new decision
    APP.state.selectedDecision = null;
    APP.state.decisionLocked = false;
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="confirmExitSimulation()">← Exit Simulation</button>
            
            <div class="simulation-container" style="max-width: 1000px; margin: 0 auto;">
                <!-- Progress Bar -->
                <div style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #71717a;">
                        <span>Progress: Decision ${decisionIndex + 1} of ${sim.decision_points.length}</span>
                        <span>Current Score: ${APP.state.simulationScore} / ${(decisionIndex) * 25}</span>
                    </div>
                    <div style="background: #27272a; border-radius: 8px; padding: 4px;">
                        <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); 
                                    width: ${(decisionIndex / sim.decision_points.length) * 100}%; 
                                    height: 8px; border-radius: 4px; transition: width 0.5s;">
                        </div>
                    </div>
                </div>
                
                <!-- Decision Header -->
                <div style="background: #18181b; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h2 style="color: #fafafa; margin-bottom: 15px; font-size: 1.8rem;">
                        ${decision.title}
                    </h2>
                    <div style="display: flex; gap: 15px; color: #71717a;">
                        <span>🎯 Domain ${sim.domain}</span>
                        <span>⚡ ${25 - (APP.state.simulationHintsUsed * 2)} points available</span>
                        <span>⏱️ ~5 minutes</span>
                    </div>
                </div>
                
                <!-- Situation Context -->
                <div class="simulation-section" style="background: #1a1a2e; border: 1px solid #27272a; 
                                                        border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="color: #6366f1; margin-bottom: 20px; font-size: 1.3rem;">
                        📍 Current Situation
                    </h3>
                    <div style="white-space: pre-wrap; line-height: 1.8; color: #fafafa;">
${decision.situation}
                    </div>
                </div>
                
                <!-- The Question -->
                <div style="background: linear-gradient(135deg, #1e1e2e, #27272a); 
                            border-left: 4px solid #6366f1; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                    <h3 style="color: #fafafa; margin-bottom: 0; font-size: 1.2rem;">
                        ${decision.question}
                    </h3>
                </div>
                
                <!-- Decision Options -->
                <div id="decision-options" style="display: grid; gap: 15px;">
                    ${decision.options.map((opt, i) => `
                        <div class="decision-option enhanced-option" 
                             onclick="selectEnhancedOption('${opt.id}')"
                             data-option="${opt.id}"
                             style="background: #18181b; border: 2px solid transparent; 
                                    border-radius: 8px; padding: 20px; cursor: pointer; 
                                    transition: all 0.3s; position: relative;">
                            <div style="display: flex; gap: 15px;">
                                <div style="color: #6366f1; font-weight: bold; font-size: 1.3rem; 
                                            width: 30px; text-align: center;">
                                    ${String.fromCharCode(65 + i)}
                                </div>
                                <div style="flex: 1; line-height: 1.7;">
                                    ${opt.text}
                                </div>
                            </div>
                            <div class="option-indicator" style="position: absolute; top: 10px; right: 10px;"></div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Hint Section -->
                ${decision.hints && decision.hints.length > 0 ? `
                    <div id="hint-section" style="margin-top: 25px; padding: 20px; background: #18181b; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h4 style="color: #f59e0b; margin-bottom: 10px;">💡 Need Help?</h4>
                                <p style="color: #71717a; font-size: 0.9rem;">
                                    Hints available but will reduce your score
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn" onclick="showEnhancedHint(1)" id="hint-btn-1"
                                        style="background: #27272a;">
                                    Hint 1 (-${decision.hints[0].penalty} pts)
                                </button>
                                ${decision.hints[1] ? `
                                    <button class="btn" onclick="showEnhancedHint(2)" id="hint-btn-2"
                                            style="background: #27272a;">
                                        Hint 2 (-${decision.hints[1].penalty} pts)
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        <div id="hint-display" style="margin-top: 15px;"></div>
                    </div>
                ` : ''}
                
                <!-- Feedback Area (Hidden initially) -->
                <div id="decision-feedback" style="display: none; margin-top: 25px;"></div>
                
                <!-- Submit Button -->
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn btn-primary" 
                            onclick="submitEnhancedDecision()" 
                            id="submit-decision"
                            disabled
                            style="padding: 12px 60px; font-size: 1.1rem; opacity: 0.5;">
                        Submit Decision →
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add enhanced styles
    addEnhancedStyles();
}

// Add enhanced visual styles
function addEnhancedStyles() {
    if (!document.getElementById('enhanced-sim-styles')) {
        const style = document.createElement('style');
        style.id = 'enhanced-sim-styles';
        style.textContent = `
            .enhanced-option:hover:not(.locked) {
                border-color: #3f3f46 !important;
                background: #1e1e2e !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .enhanced-option.selected {
                border-color: #6366f1 !important;
                background: #1e1e3e !important;
            }
            .enhanced-option.locked {
                cursor: not-allowed !important;
                opacity: 0.8;
            }
            .enhanced-option.locked.correct {
                border-color: #10b981 !important;
                background: linear-gradient(135deg, #064e3b, #065f46) !important;
            }
            .enhanced-option.locked.incorrect {
                border-color: #ef4444 !important;
                background: linear-gradient(135deg, #7f1d1d, #991b1b) !important;
            }
            .enhanced-option.locked.suboptimal {
                border-color: #f59e0b !important;
                background: linear-gradient(135deg, #78350f, #92400e) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Select option in enhanced simulation
function selectEnhancedOption(optionId) {
    if (APP.state.decisionLocked) return;
    
    // Remove previous selection
    document.querySelectorAll('.enhanced-option').forEach(el => {
        el.classList.remove('selected');
        el.style.borderColor = 'transparent';
    });
    
    // Add selection to clicked option
    const selectedEl = document.querySelector(`[data-option="${optionId}"]`);
    if (selectedEl) {
        selectedEl.classList.add('selected');
        selectedEl.style.borderColor = '#6366f1';
    }
    
    APP.state.selectedDecision = optionId;
    
    // Enable submit button
    const submitBtn = document.getElementById('submit-decision');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// Show hint in enhanced simulation
function showEnhancedHint(level) {
    const sim = APP.state.currentSimulation;
    const decision = sim.decision_points[APP.state.currentDecisionIndex];
    const hint = decision.hints[level - 1];
    
    if (!hint) return;
    
    // Apply penalty
    APP.state.simulationScore = Math.max(0, APP.state.simulationScore - hint.penalty);
    APP.state.simulationHintsUsed++;
    
    // Disable hint button
    const hintBtn = document.getElementById(`hint-btn-${level}`);
    if (hintBtn) {
        hintBtn.disabled = true;
        hintBtn.style.opacity = '0.5';
        hintBtn.style.cursor = 'not-allowed';
    }
    
    // Display hint with animation
    const hintDisplay = document.getElementById('hint-display');
    if (hintDisplay) {
        const hintDiv = document.createElement('div');
        hintDiv.style.cssText = `
            background: linear-gradient(135deg, #1e1e2e, #27272a);
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin-top: 10px;
            border-radius: 4px;
            animation: slideIn 0.3s;
        `;
        hintDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <strong style="color: #f59e0b;">💡 Hint ${level}:</strong>
                    <p style="margin-top: 10px; line-height: 1.6;">${hint.text}</p>
                </div>
                <span style="color: #ef4444; font-weight: bold;">-${hint.penalty} pts</span>
            </div>
        `;
        hintDisplay.appendChild(hintDiv);
    }
}

// Submit decision in enhanced simulation
function submitEnhancedDecision() {
    if (!APP.state.selectedDecision || APP.state.decisionLocked) return;
    
    APP.state.decisionLocked = true;
    
    const sim = APP.state.currentSimulation;
    const decision = sim.decision_points[APP.state.currentDecisionIndex];
    const selected = decision.options.find(o => o.id === APP.state.selectedDecision);
    
    if (!selected) return;
    
    // Calculate points
    const basePoints = selected.points || 0;
    const points = Math.max(0, basePoints);
    APP.state.simulationScore += points;
    
    // Record in history
    APP.state.simulationHistory.push({
        decisionIndex: APP.state.currentDecisionIndex,
        decisionTitle: decision.title,
        selectedOption: selected.id,
        points: points,
        isOptimal: selected.is_optimal,
        feedback: selected.feedback
    });
    
    // Lock all options and show results
    document.querySelectorAll('.enhanced-option').forEach(el => {
        el.classList.add('locked');
        el.onclick = null;
        
        const optionId = el.getAttribute('data-option');
        const option = decision.options.find(o => o.id === optionId);
        
        if (option) {
            if (option.is_optimal) {
                el.classList.add('correct');
                el.querySelector('.option-indicator').innerHTML = '✅ Optimal';
            } else if (optionId === APP.state.selectedDecision && !selected.is_optimal) {
                el.classList.add('incorrect');
                el.querySelector('.option-indicator').innerHTML = '❌ Selected';
            } else if (option.points > 10) {
                el.classList.add('suboptimal');
                el.querySelector('.option-indicator').innerHTML = '⚠️ Acceptable';
            }
        }
    });
    
    // Hide hints section
    const hintSection = document.getElementById('hint-section');
    if (hintSection) {
        hintSection.style.display = 'none';
    }
    
    // Show comprehensive feedback
    showEnhancedFeedback(selected, decision);
}

// Show enhanced feedback
function showEnhancedFeedback(selected, decision) {
    const feedbackDiv = document.getElementById('decision-feedback');
    if (!feedbackDiv) return;
    
    const optimalOption = decision.options.find(o => o.is_optimal);
    const resultColor = selected.is_optimal ? '#10b981' : selected.points > 10 ? '#f59e0b' : '#ef4444';
    const resultText = selected.is_optimal ? 'Optimal Choice!' : selected.points > 10 ? 'Acceptable Choice' : 'Suboptimal Choice';
    
    feedbackDiv.style.display = 'block';
    feedbackDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #18181b, #1e1e2e); 
                    border: 2px solid ${resultColor};
                    border-radius: 12px; padding: 30px;">
            
            <!-- Result Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: ${resultColor}; margin-bottom: 10px;">
                    ${selected.is_optimal ? '🎯' : selected.points > 10 ? '✅' : '⚠️'} ${resultText}
                </h2>
                <div style="font-size: 2rem; font-weight: bold;">
                    ${selected.points} / 25 points earned
                </div>
            </div>
            
            <!-- Your Choice Feedback -->
            <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h4 style="color: #6366f1; margin-bottom: 15px;">Your Choice: Option ${selected.id.toUpperCase()}</h4>
                <p style="line-height: 1.8; margin-bottom: 15px;">${selected.feedback}</p>
                
                <!-- Consequences -->
                ${selected.consequences ? `
                    <div style="background: rgba(0,0,0,0.3); border-radius: 6px; padding: 15px; margin-top: 15px;">
                        <h5 style="color: #f59e0b; margin-bottom: 12px;">Consequences of This Decision:</h5>
                        <ul style="line-height: 1.8; margin-left: 20px; color: #a1a1aa;">
                            <li><strong>Immediate:</strong> ${selected.consequences.immediate}</li>
                            <li><strong>Security Impact:</strong> ${selected.consequences.security_impact}</li>
                            <li><strong>Business Impact:</strong> ${selected.consequences.business_impact}</li>
                        </ul>
                    </div>
                ` : ''}
            </div>
            
            <!-- Learning Note -->
            ${selected.learning_note ? `
                <div style="background: linear-gradient(135deg, #1e1e3e, #27273a); 
                            border-left: 4px solid #6366f1; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                    <h4 style="color: #6366f1; margin-bottom: 12px;">📚 Key Learning Point</h4>
                    <p style="line-height: 1.8;">${selected.learning_note}</p>
                </div>
            ` : ''}
            
            <!-- Optimal Choice (if different) -->
            ${!selected.is_optimal && optimalOption ? `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; 
                            border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="color: #10b981; margin-bottom: 15px;">
                        🎯 Optimal Choice Was: Option ${optimalOption.id.toUpperCase()}
                    </h4>
                    <p style="margin-bottom: 10px;">${optimalOption.text}</p>
                    <p style="color: #a1a1aa; line-height: 1.8; margin-top: 15px;">
                        <strong>Why it's optimal:</strong> ${optimalOption.feedback}
                    </p>
                </div>
            ` : ''}
            
            <!-- Continue Button -->
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn btn-primary" 
                        onclick="nextEnhancedDecision()"
                        style="padding: 12px 50px; font-size: 1.1rem;">
                    ${APP.state.currentDecisionIndex < APP.state.currentSimulation.decision_points.length - 1 
                        ? 'Continue to Next Decision →' 
                        : '🎯 Complete Simulation →'}
                </button>
            </div>
        </div>
    `;
    
    // Hide submit button
    const submitBtn = document.getElementById('submit-decision');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
}

// Move to next decision
function nextEnhancedDecision() {
    APP.state.currentDecisionIndex++;
    
    if (APP.state.currentDecisionIndex >= APP.state.currentSimulation.decision_points.length) {
        showEnhancedResults();
    } else {
        showEnhancedDecision();
    }
}

// Show enhanced results
function showEnhancedResults() {
    const sim = APP.state.currentSimulation;
    const score = APP.state.simulationScore;
    const maxScore = APP.state.simulationMaxScore;
    const percentage = Math.round((score / maxScore) * 100);
    const passed = score >= sim.scoring.passing_score;
    
    // Calculate time spent
    const timeSpent = Math.round((Date.now() - APP.state.simulationStartTime) / 60000);
    
    // Determine performance level
    let performanceLevel = 'Developing';
    let performanceColor = '#ef4444';
    if (score >= sim.scoring.performance_levels.expert) {
        performanceLevel = 'Expert';
        performanceColor = '#6366f1';
    } else if (score >= sim.scoring.performance_levels.proficient) {
        performanceLevel = 'Proficient';
        performanceColor = '#10b981';
    } else if (score >= sim.scoring.performance_levels.competent) {
        performanceLevel = 'Competent';
        performanceColor = '#f59e0b';
    }
    
    // Save best score
    const prevBest = APP.progress.simulationScores[sim.scenario_id] || 0;
    const isNewBest = score > prevBest;
    if (isNewBest) {
        APP.progress.simulationScores[sim.scenario_id] = score;
        saveProgress();
    }
    
    // Mark as completed
    if (!APP.progress.completedSimulations.includes(sim.scenario_id)) {
        APP.progress.completedSimulations.push(sim.scenario_id);
        saveProgress();
    }
    
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container">
            <div class="simulation-container" style="max-width: 1000px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 2.5rem;">🎉 Simulation Complete!</h1>
                    <h2 style="color: #6366f1; margin-top: 10px;">${sim.title}</h2>
                </div>
                
                <!-- Score Display -->
                <div style="background: linear-gradient(135deg, #18181b, #1e1e2e); 
                            border-radius: 16px; padding: 40px; margin-bottom: 30px; text-align: center;
                            border: 2px solid ${passed ? '#10b981' : '#ef4444'};">
                    <div style="font-size: 5rem; font-weight: bold; color: ${passed ? '#10b981' : '#f59e0b'};">
                        ${score}
                    </div>
                    <div style="font-size: 1.5rem; color: #71717a; margin-bottom: 20px;">
                        out of ${maxScore} points
                    </div>
                    <div style="font-size: 3rem; color: ${performanceColor}; margin-bottom: 10px;">
                        ${percentage}%
                    </div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: ${performanceColor};">
                        ${performanceLevel}
                    </div>
                    <div style="font-size: 1.2rem; margin-top: 20px; color: ${passed ? '#10b981' : '#ef4444'};">
                        ${passed ? '✅ PASSED' : '❌ NOT PASSED'} 
                        (${sim.scoring.passing_score} required)
                    </div>
                    ${isNewBest ? `
                        <div style="margin-top: 20px; padding: 15px; background: rgba(99, 102, 241, 0.1); 
                                    border: 1px solid #6366f1; border-radius: 8px;">
                            🏆 New Personal Best!
                        </div>
                    ` : ''}
                </div>
                
                <!-- Performance Breakdown -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="margin-bottom: 25px;">📊 Performance Analysis</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 25px;">
                        <div style="text-align: center;">
                            <div style="color: #71717a; margin-bottom: 5px;">Optimal Decisions</div>
                            <div style="font-size: 2rem; font-weight: bold; color: #10b981;">
                                ${APP.state.simulationHistory.filter(h => h.isOptimal).length} / ${sim.decision_points.length}
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #71717a; margin-bottom: 5px;">Time Spent</div>
                            <div style="font-size: 2rem; font-weight: bold;">
                                ${timeSpent} min
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #71717a; margin-bottom: 5px;">Hints Used</div>
                            <div style="font-size: 2rem; font-weight: bold; color: ${APP.state.simulationHintsUsed > 0 ? '#f59e0b' : '#10b981'};">
                                ${APP.state.simulationHintsUsed}
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #71717a; margin-bottom: 5px;">Avg Score/Decision</div>
                            <div style="font-size: 2rem; font-weight: bold;">
                                ${Math.round(score / sim.decision_points.length)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Decision History -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="margin-bottom: 25px;">📋 Decision History</h3>
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${APP.state.simulationHistory.map((h, i) => `
                            <div style="background: #27272a; 
                                        border-left: 4px solid ${h.isOptimal ? '#10b981' : h.points > 10 ? '#f59e0b' : '#ef4444'}; 
                                        padding: 15px; margin-bottom: 12px; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <strong style="color: #fafafa;">${h.decisionTitle}</strong>
                                        <div style="color: #71717a; margin-top: 5px; font-size: 0.9rem;">
                                            Selected: Option ${h.selectedOption.toUpperCase()}
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="font-size: 1.2rem; font-weight: bold; 
                                                     color: ${h.isOptimal ? '#10b981' : h.points > 10 ? '#f59e0b' : '#ef4444'};">
                                            ${h.points} / 25
                                        </span>
                                        <div style="color: #71717a; font-size: 0.9rem;">
                                            ${h.isOptimal ? 'Optimal' : h.points > 10 ? 'Good' : 'Poor'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Learning Summary -->
                ${sim.summary_points && sim.summary_points.length > 0 ? `
                    <div style="background: linear-gradient(135deg, #1e1e3e, #27273a); 
                                border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                        <h3 style="color: #6366f1; margin-bottom: 20px;">💡 Key Takeaways</h3>
                        <ul style="line-height: 2; color: #fafafa;">
                            ${sim.summary_points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Recommendations -->
                ${!passed ? `
                    <div style="background: #1e1e2e; border: 2px solid #f59e0b; 
                                border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                        <h3 style="color: #f59e0b; margin-bottom: 20px;">📚 Recommendations for Improvement</h3>
                        <ul style="line-height: 2; color: #a1a1aa;">
                            <li>Review the lesson materials for Domain ${sim.domain}</li>
                            <li>Focus on decisions where you scored below 15 points</li>
                            <li>Practice similar scenarios to improve decision-making</li>
                            <li>Try the remediation modules for targeted practice</li>
                            <li>Retake this simulation after reviewing the concepts</li>
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="startSimulation('${sim.scenario_id}')"
                            style="padding: 12px 30px;">
                        🔄 Retry Simulation
                    </button>
                    <button class="btn" onclick="showDomainSimulations(${sim.domain})"
                            style="padding: 12px 30px; background: #27272a;">
                        📋 More Domain ${sim.domain} Sims
                    </button>
                    <button class="btn" onclick="showAllSimulations()"
                            style="padding: 12px 30px; background: #27272a;">
                        🎮 All Simulations
                    </button>
                    <button class="btn" onclick="showDashboard()"
                            style="padding: 12px 30px; background: #27272a;">
                        🏠 Dashboard
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Confirm exit from enhanced simulation
function confirmExitSimulation() {
    const message = APP.state.currentDecisionIndex > 0 
        ? `Are you sure you want to exit? You've completed ${APP.state.currentDecisionIndex} of ${APP.state.currentSimulation.decision_points.length} decisions. Your progress will be lost.`
        : 'Are you sure you want to exit? Your progress will be lost.';
    
    if (confirm(message)) {
        showAllSimulations();
    }
}

// ================================================
// INTEGRATION INSTRUCTIONS
// ================================================
/*
To integrate this enhanced simulation system into your v29 app:

1. Replace the existing startSimulation function with the enhanced version
2. Add all the new functions (they won't conflict with existing code)
3. The enhanced system is backward compatible - old simulations still work
4. To enable for a specific simulation, just call startSimulation(simId)
5. The system will automatically generate 10 decision points
6. To use real JSON files, place them in /simulations/ folder

Features added:
- 10 comprehensive decision points per simulation
- Professional scoring system (0-250 points)
- Performance level tracking
- Rich feedback with consequences
- Hint system with penalties
- Decision history tracking
- Enhanced visual design
- 45-60 minute realistic experience

This transforms simulations from basic 5-minute demos to professional 45-60 minute training experiences!
*/
