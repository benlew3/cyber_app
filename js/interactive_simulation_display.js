// ================================================
// INTERACTIVE SIMULATION DISPLAY FUNCTIONS
// Stage Management and User Interactions
// ================================================

// Start enhanced interactive simulation
async function startInteractiveSimulation(simId) {
    console.log(`🎮 Starting interactive simulation: ${simId}`);
    
    const content = document.getElementById('content');
    
    // Show loading
    content.innerHTML = `
        <div class="container">
            <div style="text-align: center; padding: 100px 20px;">
                <div class="loading-spinner" style="margin: 0 auto;"></div>
                <h2>Initializing Interactive Simulation...</h2>
                <p style="color: #71717a;">Loading ${simId}</p>
            </div>
        </div>
    `;
    
    // Get simulation data
    let simData = SIMULATION_DATA[simId];
    
    if (!simData) {
        await loadSimulationsFromDataFolder();
        simData = SIMULATION_DATA[simId];
    }
    
    if (!simData) {
        simData = ALL_SIMULATIONS.find(s => s.id === simId);
    }
    
    if (!simData) {
        alert(`Simulation ${simId} not found`);
        showAllSimulations();
        return;
    }
    
    // Initialize the simulation engine
    await simEngine.init(simId, simData);
    
    // Store in APP state
    APP.state.currentSimulation = simData;
    
    // Show first stage
    showSimulationStage();
}

// Show current simulation stage
function showSimulationStage() {
    const stage = simEngine.getCurrentStage();
    
    if (!stage) {
        showInteractiveResults();
        return;
    }
    
    console.log(`Displaying stage ${simEngine.currentStage + 1}: ${stage.type}`);
    
    switch(stage.type) {
        case 'briefing':
            showBriefingStage(stage);
            break;
        case 'visual_analysis':
            showVisualStage(stage);
            break;
        case 'interactive_tool':
            showToolStage(stage);
            break;
        case 'report':
            showReportStage(stage);
            break;
        default:
            showBriefingStage(stage);
    }
}

// Stage 1: Briefing
function showBriefingStage(stage) {
    const sim = simEngine.currentSimulation;
    const content = document.getElementById('content');
    
    // Get incident details based on simulation type
    const incidentDetails = getIncidentDetails(sim);
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="confirmExitSimulation()">← Exit Simulation</button>
            
            <div class="simulation-container" style="max-width: 1200px; margin: 0 auto;">
                <!-- Progress Bar -->
                ${createProgressBar()}
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1>${sim.title || 'Security Incident Response'}</h1>
                    <p style="color: #71717a;">
                        Stage ${simEngine.currentStage + 1} of ${sim.stages.length}: ${stage.title}
                    </p>
                </div>
                
                <!-- Alert Banner -->
                <div style="background: linear-gradient(135deg, #7f1d1d, #991b1b); 
                            border: 2px solid #ef4444; border-radius: 12px; padding: 20px; 
                            margin-bottom: 30px; animation: pulse 2s infinite;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 3rem;">🚨</div>
                        <div>
                            <h2 style="color: #fafafa; margin: 0;">SECURITY INCIDENT DETECTED</h2>
                            <p style="color: #fca5a5; margin: 5px 0;">Immediate response required</p>
                        </div>
                    </div>
                </div>
                
                <!-- Incident Details -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="color: #ef4444; margin-bottom: 20px;">📋 Incident Brief</h3>
                    
                    <div style="background: #0a0a0a; border-left: 4px solid #ef4444; 
                                padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                        <p style="line-height: 1.8; font-size: 1.1rem; color: #fafafa;">
                            ${sim.scenario || incidentDetails.scenario}
                        </p>
                    </div>
                    
                    <!-- Key Information Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                                gap: 20px; margin-top: 30px;">
                        ${incidentDetails.keyInfo.map(info => `
                            <div style="background: #27272a; padding: 15px; border-radius: 8px;
                                        border-left: 3px solid ${info.color || '#6366f1'};">
                                <h4 style="color: ${info.color || '#6366f1'}; margin-bottom: 10px;">
                                    ${info.icon || '📌'} ${info.label}
                                </h4>
                                <p style="color: #fafafa; font-size: 1.1rem;">${info.value}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Initial Indicators -->
                    <div style="margin-top: 30px;">
                        <h3 style="color: #fafafa; margin-bottom: 15px;">🔍 Initial Indicators</h3>
                        <ul style="line-height: 2; color: #a1a1aa;">
                            ${incidentDetails.indicators.map(ind => `
                                <li>${ind}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <!-- Your Mission -->
                    <div style="margin-top: 30px; background: #27272a; padding: 20px; border-radius: 8px;">
                        <h3 style="color: #10b981; margin-bottom: 15px;">🎯 Your Mission</h3>
                        <ol style="line-height: 2; color: #fafafa;">
                            <li>Identify the attack vector and scope of compromise</li>
                            <li>Contain the threat to prevent further damage</li>
                            <li>Investigate and collect forensic evidence</li>
                            <li>Implement remediation measures</li>
                            <li>Document findings and recommendations</li>
                        </ol>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="proceedToNextStage()" 
                            style="padding: 15px 40px; font-size: 1.1rem;">
                        Begin Investigation →
                    </button>
                    <p style="color: #71717a; margin-top: 15px;">
                        ⏱️ Estimated time: ${stage.duration || '20-30 minutes'}
                    </p>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.9; }
                100% { opacity: 1; }
            }
        </style>
    `;
}

// Stage 2: Visual Analysis
function showVisualStage(stage) {
    const content = document.getElementById('content');
    
    // Generate visual data based on simulation
    const visualData = generateVisualData(simEngine.currentSimulation);
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showSimulationStage()">← Back</button>
            
            <div class="simulation-container" style="max-width: 1400px; margin: 0 auto;">
                ${createProgressBar()}
                
                <h2 style="text-align: center; margin-bottom: 30px;">
                    🔍 Visual Analysis - Identify Attack Vectors
                </h2>
                
                <!-- Visual Components Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <!-- Network Diagram -->
                    <div>${VisualComponents.createNetworkDiagram(visualData.network)}</div>
                    
                    <!-- Threat Visualization -->
                    <div>${VisualComponents.createThreatVisualization(visualData.threats)}</div>
                </div>
                
                <!-- Log Viewer -->
                <div style="margin-bottom: 30px;">
                    ${VisualComponents.createLogViewer(visualData.logs)}
                </div>
                
                <!-- Analysis Questions -->
                <div style="background: #18181b; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #6366f1; margin-bottom: 15px;">📊 Analysis Questions</h3>
                    <form id="visual-analysis-form">
                        <div style="display: grid; gap: 15px;">
                            <!-- Question 1 -->
                            <div>
                                <label style="color: #fafafa; font-weight: bold;">
                                    1. What is the primary attack vector?
                                </label>
                                <select id="analysis-q1" class="analysis-input" 
                                        style="width: 100%; padding: 8px; background: #27272a; 
                                               color: #fafafa; border: 1px solid #3f3f46; 
                                               border-radius: 4px; margin-top: 5px;">
                                    <option value="">Select your answer...</option>
                                    <option value="web">Web Application Vulnerability</option>
                                    <option value="phishing">Phishing Email</option>
                                    <option value="malware">Malware Infection</option>
                                    <option value="insider">Insider Threat</option>
                                    <option value="bruteforce">Brute Force Attack</option>
                                    <option value="supply">Supply Chain Compromise</option>
                                </select>
                            </div>
                            
                            <!-- Question 2 -->
                            <div>
                                <label style="color: #fafafa; font-weight: bold;">
                                    2. Which systems show signs of compromise? (Check all that apply)
                                </label>
                                <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                    <label style="color: #a1a1aa;">
                                        <input type="checkbox" id="sys-firewall" value="firewall"> Firewall
                                    </label>
                                    <label style="color: #a1a1aa;">
                                        <input type="checkbox" id="sys-webserver" value="webserver"> Web Server
                                    </label>
                                    <label style="color: #a1a1aa;">
                                        <input type="checkbox" id="sys-database" value="database"> Database
                                    </label>
                                    <label style="color: #a1a1aa;">
                                        <input type="checkbox" id="sys-workstations" value="workstations"> Workstations
                                    </label>
                                    <label style="color: #a1a1aa;">
                                        <input type="checkbox" id="sys-mailserver" value="mailserver"> Mail Server
                                    </label>
                                    <label style="color: #a1a1aa;">
                                        <input type="checkbox" id="sys-dns" value="dns"> DNS Server
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Question 3 -->
                            <div>
                                <label style="color: #fafafa; font-weight: bold;">
                                    3. What is the attacker's likely objective?
                                </label>
                                <textarea id="analysis-q3" class="analysis-input"
                                          style="width: 100%; padding: 8px; background: #27272a; 
                                                 color: #fafafa; border: 1px solid #3f3f46; 
                                                 border-radius: 4px; margin-top: 5px; min-height: 60px;" 
                                          placeholder="Describe the attacker's goal based on the evidence..."></textarea>
                            </div>
                            
                            <!-- Question 4 -->
                            <div>
                                <label style="color: #fafafa; font-weight: bold;">
                                    4. What immediate containment action should be taken?
                                </label>
                                <select id="analysis-q4" class="analysis-input"
                                        style="width: 100%; padding: 8px; background: #27272a; 
                                               color: #fafafa; border: 1px solid #3f3f46; 
                                               border-radius: 4px; margin-top: 5px;">
                                    <option value="">Select your action...</option>
                                    <option value="isolate">Isolate infected systems</option>
                                    <option value="block">Block malicious IPs</option>
                                    <option value="disable">Disable compromised accounts</option>
                                    <option value="shutdown">Shutdown affected services</option>
                                    <option value="monitor">Increase monitoring only</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div style="text-align: center;">
                    <button class="btn btn-primary" onclick="submitVisualAnalysis()" 
                            style="padding: 15px 40px; font-size: 1.1rem;">
                        Submit Analysis & Proceed →
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Stage 3: Interactive Tools
function showToolStage(stage) {
    const content = document.getElementById('content');
    const toolType = stage.toolType || 'terminal';
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showSimulationStage()">← Back</button>
            
            <div class="simulation-container" style="max-width: 1400px; margin: 0 auto;">
                ${createProgressBar()}
                
                <h2 style="text-align: center; margin-bottom: 30px;">
                    🛠️ Investigation & Response - Interactive Tools
                </h2>
                
                <!-- Tool Tabs -->
                <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: center;">
                    <button onclick="switchTool('terminal')" id="tool-tab-terminal" 
                            class="tool-tab ${toolType === 'terminal' ? 'active' : ''}"
                            style="padding: 10px 20px; background: ${toolType === 'terminal' ? '#6366f1' : '#27272a'}; 
                                   color: #fafafa; border: none; border-radius: 4px; cursor: pointer;">
                        🖥️ Terminal
                    </button>
                    <button onclick="switchTool('siem')" id="tool-tab-siem"
                            class="tool-tab ${toolType === 'siem' ? 'active' : ''}"
                            style="padding: 10px 20px; background: ${toolType === 'siem' ? '#6366f1' : '#27272a'}; 
                                   color: #fafafa; border: none; border-radius: 4px; cursor: pointer;">
                        📊 SIEM Dashboard
                    </button>
                    <button onclick="switchTool('firewall')" id="tool-tab-firewall"
                            class="tool-tab ${toolType === 'firewall' ? 'active' : ''}"
                            style="padding: 10px 20px; background: ${toolType === 'firewall' ? '#6366f1' : '#27272a'}; 
                                   color: #fafafa; border: none; border-radius: 4px; cursor: pointer;">
                        🛡️ Firewall Config
                    </button>
                </div>
                
                <!-- Tool Content Area -->
                <div id="tool-content">
                    ${getToolContent(toolType)}
                </div>
                
                <!-- Task Checklist -->
                <div style="background: #18181b; border-radius: 8px; padding: 20px; margin-top: 20px;">
                    <h3 style="color: #6366f1; margin-bottom: 15px;">✅ Required Tasks</h3>
                    
                    <div id="task-checklist">
                        <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="task1" onchange="updateTaskProgress()" style="margin-right: 10px;">
                            <span style="color: #fafafa;">Identify and document all compromised systems</span>
                        </label>
                        <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="task2" onchange="updateTaskProgress()" style="margin-right: 10px;">
                            <span style="color: #fafafa;">Block all malicious IP addresses at the firewall</span>
                        </label>
                        <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="task3" onchange="updateTaskProgress()" style="margin-right: 10px;">
                            <span style="color: #fafafa;">Terminate malicious processes and connections</span>
                        </label>
                        <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="task4" onchange="updateTaskProgress()" style="margin-right: 10px;">
                            <span style="color: #fafafa;">Collect and preserve forensic evidence</span>
                        </label>
                        <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="task5" onchange="updateTaskProgress()" style="margin-right: 10px;">
                            <span style="color: #fafafa;">Update security rules and configurations</span>
                        </label>
                        <label style="display: block; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="task6" onchange="updateTaskProgress()" style="margin-right: 10px;">
                            <span style="color: #fafafa;">Document all actions taken for the report</span>
                        </label>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="margin-top: 20px;">
                        <div style="background: #27272a; border-radius: 4px; padding: 4px;">
                            <div id="task-progress" style="background: #10b981; width: 0%; height: 8px; 
                                                          border-radius: 2px; transition: width 0.3s;"></div>
                        </div>
                        <p style="color: #71717a; margin-top: 10px; text-align: center;">
                            <span id="task-count">0</span> of 6 tasks completed
                        </p>
                    </div>
                </div>
                
                <!-- Command History -->
                <div id="command-history" style="background: #0a0a0a; border-radius: 8px; 
                                                 padding: 15px; margin-top: 20px; display: none;">
                    <h4 style="color: #10b981; margin-bottom: 10px;">📝 Command History</h4>
                    <div id="history-content" style="font-family: monospace; font-size: 0.9rem; color: #71717a;"></div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-primary" onclick="submitToolStage()" 
                            style="padding: 15px 40px; font-size: 1.1rem;">
                        Complete Investigation →
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Stage 4: Report
function showReportStage(stage) {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container">
            <button class="back-btn" onclick="showSimulationStage()">← Back</button>
            
            <div class="simulation-container" style="max-width: 1000px; margin: 0 auto;">
                ${createProgressBar()}
                
                <h2 style="text-align: center; margin-bottom: 30px;">
                    📄 Incident Report - Document Your Findings
                </h2>
                
                <div style="background: #18181b; border-radius: 8px; padding: 30px;">
                    <form id="incident-report">
                        <!-- Executive Summary -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px; font-weight: bold;">
                                Executive Summary
                            </label>
                            <textarea name="summary" style="width: 100%; min-height: 100px; padding: 10px; 
                                                            background: #27272a; color: #fafafa; 
                                                            border: 1px solid #3f3f46; border-radius: 4px;"
                                      placeholder="Provide a brief overview of the incident and response actions taken..."></textarea>
                        </div>
                        
                        <!-- Incident Classification -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                            <div>
                                <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                    Incident Type
                                </label>
                                <select name="incident_type" style="width: 100%; padding: 10px; background: #27272a; 
                                                                    color: #fafafa; border: 1px solid #3f3f46; 
                                                                    border-radius: 4px;">
                                    <option value="">Select type...</option>
                                    <option value="malware">Malware Infection</option>
                                    <option value="ransomware">Ransomware Attack</option>
                                    <option value="data_breach">Data Breach</option>
                                    <option value="apt">Advanced Persistent Threat</option>
                                    <option value="insider">Insider Threat</option>
                                    <option value="ddos">DDoS Attack</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                    Severity Level
                                </label>
                                <select name="severity" style="width: 100%; padding: 10px; background: #27272a; 
                                                               color: #fafafa; border: 1px solid #3f3f46; 
                                                               border-radius: 4px;">
                                    <option value="">Select severity...</option>
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Attack Vector -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                Attack Vector Identified
                            </label>
                            <input type="text" name="attack_vector" 
                                   style="width: 100%; padding: 10px; background: #27272a; 
                                          color: #fafafa; border: 1px solid #3f3f46; border-radius: 4px;"
                                   placeholder="e.g., Phishing email with malicious attachment">
                        </div>
                        
                        <!-- Systems Affected -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                Systems Affected
                            </label>
                            <input type="text" name="systems_affected" 
                                   style="width: 100%; padding: 10px; background: #27272a; 
                                          color: #fafafa; border: 1px solid #3f3f46; border-radius: 4px;"
                                   placeholder="List all compromised systems (e.g., Web Server, Workstation WS3, Database)">
                        </div>
                        
                        <!-- Timeline -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                Incident Timeline
                            </label>
                            <textarea name="timeline" style="width: 100%; min-height: 100px; padding: 10px; 
                                                            background: #27272a; color: #fafafa; 
                                                            border: 1px solid #3f3f46; border-radius: 4px;"
                                      placeholder="Provide timeline of events (detection, containment, eradication, recovery)..."></textarea>
                        </div>
                        
                        <!-- Actions Taken -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                Response Actions Taken
                            </label>
                            <textarea name="actions" style="width: 100%; min-height: 120px; padding: 10px; 
                                                           background: #27272a; color: #fafafa; 
                                                           border: 1px solid #3f3f46; border-radius: 4px;"
                                      placeholder="Detail all containment and remediation actions performed..."></textarea>
                        </div>
                        
                        <!-- Evidence Collected -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                Evidence Collected
                            </label>
                            <textarea name="evidence" style="width: 100%; min-height: 80px; padding: 10px; 
                                                            background: #27272a; color: #fafafa; 
                                                            border: 1px solid #3f3f46; border-radius: 4px;"
                                      placeholder="List all forensic evidence collected (logs, memory dumps, network captures, etc.)"></textarea>
                        </div>
                        
                        <!-- Recommendations -->
                        <div style="margin-bottom: 25px;">
                            <label style="color: #fafafa; display: block; margin-bottom: 8px;">
                                Recommendations
                            </label>
                            <textarea name="recommendations" style="width: 100%; min-height: 100px; padding: 10px; 
                                                                    background: #27272a; color: #fafafa; 
                                                                    border: 1px solid #3f3f46; border-radius: 4px;"
                                      placeholder="Provide recommendations to prevent similar incidents in the future..."></textarea>
                        </div>
                    </form>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-primary" onclick="submitReport()" 
                            style="padding: 15px 40px; font-size: 1.1rem;">
                        Submit Report & Complete Simulation →
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper Functions
function createProgressBar() {
    const progress = ((simEngine.currentStage) / simEngine.currentSimulation.stages.length) * 100;
    return `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #71717a;">
                <span>Stage ${simEngine.currentStage + 1} of ${simEngine.currentSimulation.stages.length}</span>
                <span>${Math.round(progress)}% Complete</span>
            </div>
            <div style="background: #27272a; border-radius: 8px; padding: 4px;">
                <div style="background: linear-gradient(to right, #6366f1, #8b5cf6); 
                            width: ${progress}%; height: 8px; border-radius: 4px; 
                            transition: width 0.5s;"></div>
            </div>
        </div>
    `;
}

function getIncidentDetails(sim) {
    // Generate incident details based on simulation type
    const domain = sim.domain || 1;
    const scenarios = {
        1: {
            scenario: "Multiple security alerts have been triggered across the network. Initial analysis suggests a coordinated attack targeting authentication systems and attempting to establish persistence.",
            keyInfo: [
                { label: "Organization", value: sim.organization || "TechCorp Inc.", icon: "🏢", color: "#6366f1" },
                { label: "Your Role", value: sim.role || "Security Analyst", icon: "👤", color: "#10b981" },
                { label: "Severity", value: "HIGH", icon: "⚠️", color: "#ef4444" },
                { label: "Time Critical", value: "Yes", icon: "⏰", color: "#f59e0b" }
            ],
            indicators: [
                "Unusual authentication attempts from multiple geographic locations",
                "Elevated CPU usage on several production servers",
                "Suspicious outbound connections to unknown IP addresses",
                "Modified system files detected by integrity monitoring",
                "Anomalous database queries accessing sensitive tables"
            ]
        },
        2: {
            scenario: "A sophisticated malware campaign has been detected targeting your organization. Multiple endpoints show signs of infection, and there are indicators of lateral movement within the network.",
            keyInfo: [
                { label: "Attack Type", value: "Ransomware", icon: "🔒", color: "#ef4444" },
                { label: "Systems at Risk", value: "Critical", icon: "💻", color: "#ef4444" },
                { label: "Data Exposure", value: "Possible", icon: "📊", color: "#f59e0b" },
                { label: "Response Time", value: "< 30 min", icon: "⏱️", color: "#f59e0b" }
            ],
            indicators: [
                "Files being encrypted on multiple systems",
                "Command and control communication detected",
                "Privilege escalation attempts observed",
                "Shadow copies being deleted",
                "Ransom note files appearing in directories"
            ]
        },
        // Add more domain-specific scenarios...
    };
    
    return scenarios[domain] || scenarios[1];
}

function generateVisualData(sim) {
    return {
        network: {
            threats: { internet: true },
            status: {
                firewall: 'normal',
                webserver: 'infected',
                mailserver: 'suspicious',
                database: 'normal'
            }
        },
        threats: [
            { 
                id: 'T001', 
                type: 'Malware Detection', 
                source: '192.168.1.105', 
                target: 'Web Server', 
                severity: 'critical', 
                timestamp: new Date().toLocaleTimeString(),
                description: 'Cryptominer process consuming resources'
            },
            { 
                id: 'T002', 
                type: 'Brute Force Attack', 
                source: '185.234.67.89', 
                target: 'SSH Service', 
                severity: 'high', 
                timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
                description: 'Multiple failed login attempts detected'
            },
            { 
                id: 'T003', 
                type: 'Data Exfiltration', 
                source: 'Web Server', 
                target: 'External IP', 
                severity: 'critical', 
                timestamp: new Date(Date.now() - 150000).toLocaleTimeString(),
                description: 'Large data transfer to suspicious destination'
            }
        ],
        logs: [
            { timestamp: new Date(Date.now() - 600000).toLocaleTimeString(), level: 'info', message: 'System startup complete', source: 'system' },
            { timestamp: new Date(Date.now() - 450000).toLocaleTimeString(), level: 'warning', message: 'Failed SSH login from 185.234.67.89', source: 'sshd' },
            { timestamp: new Date(Date.now() - 300000).toLocaleTimeString(), level: 'error', message: 'Malicious process detected: /tmp/.hidden/miner', source: 'antivirus' },
            { timestamp: new Date(Date.now() - 150000).toLocaleTimeString(), level: 'error', message: 'Unusual outbound traffic on port 443', source: 'firewall' },
            { timestamp: new Date().toLocaleTimeString(), level: 'warning', message: 'Database connection spike detected', source: 'database' }
        ]
    };
}

function getToolContent(toolType) {
    switch(toolType) {
        case 'terminal':
            return InteractiveTools.createTerminal({
                hostname: 'sec-analyst-01',
                user: 'analyst',
                ip: '192.168.1.50',
                lastLogin: '192.168.1.10',
                welcomeMessage: 'Incident Response Terminal - Full administrative access granted',
                prompt: 'ir@analyst:~$'
            });
            
        case 'siem':
            return InteractiveTools.createSIEM({
                stats: { critical: 3, high: 7, medium: 15, investigated: 2 },
                events: generateSIEMEvents(),
                correlations: generateCorrelations()
            });
            
        case 'firewall':
            return InteractiveTools.createFirewallEditor(generateFirewallRules());
            
        default:
            return '<p>Tool not available</p>';
    }
}

// Make functions globally available
window.startInteractiveSimulation = startInteractiveSimulation;
window.showSimulationStage = showSimulationStage;
window.showBriefingStage = showBriefingStage;
window.showVisualStage = showVisualStage;
window.showToolStage = showToolStage;
window.showReportStage = showReportStage;
window.createProgressBar = createProgressBar;
window.getIncidentDetails = getIncidentDetails;
window.generateVisualData = generateVisualData;
window.getToolContent = getToolContent;

// Also make the enhanced intro function available (to replace missing function)
window.showEnhancedSimulationIntro = showBriefingStage;
