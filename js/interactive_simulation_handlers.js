// ================================================
// INTERACTIVE SIMULATION HANDLERS
// User interactions and command processing
// ================================================

// Terminal Command Handlers
function executeTerminalCommand(cmd) {
    const input = cmd || document.getElementById('terminal-input').value;
    const output = document.getElementById('terminal-history');
    const terminalInput = document.getElementById('terminal-input');
    
    if (!input) return;
    
    // Clear input field
    if (terminalInput) terminalInput.value = '';
    
    // Add command to history
    output.innerHTML += `<div style="color: #10b981;">$ ${input}</div>`;
    
    // Record action
    simEngine.recordAction('terminal_command', { command: input });
    
    // Process commands
    const response = processTerminalCommand(input);
    
    // Display response
    output.innerHTML += `<div style="color: #0f0; margin-bottom: 10px;">${response}</div>`;
    
    // Auto-scroll to bottom
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Add to command history
    addToCommandHistory(input);
}

function processTerminalCommand(cmd) {
    const commands = {
        'help': `Available commands:
  nmap           - Network scanning
  netstat        - Network connections
  ps             - Process list
  kill           - Terminate process
  iptables       - Firewall rules
  tail           - View log files
  tcpdump        - Packet capture
  find           - Search files
  systemctl      - Service management
  whoami         - Current user
  clear          - Clear terminal`,
        
        'whoami': 'analyst (Security Operations Team)',
        
        'nmap': `Starting Nmap scan...
Host: 192.168.1.105 (INFECTED)
  Ports: 22/tcp (SSH), 80/tcp (HTTP), 443/tcp (HTTPS), 4444/tcp (BACKDOOR - SUSPICIOUS)
Host: 185.234.67.89 (EXTERNAL ATTACKER)
  Multiple connection attempts detected
Host: 192.168.1.10 (Web Server)
  Ports: 80/tcp, 443/tcp - HIGH TRAFFIC`,
        
        'netstat': `Active connections:
Proto  Local Address         Foreign Address       State
tcp    192.168.1.10:80      185.234.67.89:45123   ESTABLISHED (SUSPICIOUS)
tcp    192.168.1.105:4444   185.234.67.89:31337   ESTABLISHED (MALICIOUS)
tcp    192.168.1.50:22      192.168.1.10:52341    ESTABLISHED
tcp    192.168.1.10:443     103.75.201.4:8080     TIME_WAIT (SUSPICIOUS)`,
        
        'ps': `PID   USER     COMMAND
1     root     /sbin/init
523   root     /usr/sbin/sshd
1247  www-data /usr/bin/apache2
5823  root     /tmp/.hidden/cryptominer (MALICIOUS - HIGH CPU)
5901  root     /usr/bin/python3 /tmp/backdoor.py (MALICIOUS)
6234  analyst  bash`,
        
        'kill': 'Usage: kill -9 <PID>  (e.g., kill -9 5823)',
        
        'iptables': `Current firewall rules:
Chain INPUT (policy ACCEPT)
  ACCEPT     tcp  --  anywhere  anywhere  tcp dpt:22
  ACCEPT     tcp  --  anywhere  anywhere  tcp dpt:80
  ACCEPT     tcp  --  anywhere  anywhere  tcp dpt:443
  
⚠️ No rules blocking suspicious IPs!`,
        
        'tail': `==> /var/log/auth.log <==
Failed password for root from 185.234.67.89
Failed password for admin from 185.234.67.89
Accepted publickey for analyst from 192.168.1.10
New session opened for user www-data
ALERT: Privilege escalation detected!`,
        
        'tcpdump': `Capturing packets...
14:45:23.123456 IP 192.168.1.105.4444 > 185.234.67.89.31337: PSH ACK (C2 TRAFFIC)
14:45:24.234567 IP 192.168.1.10.443 > 103.75.201.4.8080: PSH ACK (DATA EXFILTRATION)
14:45:25.345678 IP 185.234.67.89.45123 > 192.168.1.10.22: SYN (SCAN ATTEMPT)`,
        
        'systemctl': `● apache2.service - Active: running
● ssh.service - Active: running
● mysql.service - Active: running (high load)
● firewall.service - Active: running (needs configuration)
● antivirus.service - Active: running (alerts pending)`,
        
        'find': `Suspicious files found:
/tmp/.hidden/cryptominer
/tmp/backdoor.py
/var/www/html/shell.php
/home/user/.ssh/authorized_keys (modified recently)
/etc/cron.d/suspicious_job`
    };
    
    // Handle specific kill commands
    if (cmd.startsWith('kill -9 ')) {
        const pid = cmd.split(' ')[2];
        if (pid === '5823' || pid === '5901') {
            simEngine.recordAction('correct_identification', { action: 'killed_malicious_process' });
            return `Process ${pid} terminated successfully.\n✅ Malicious process eliminated!`;
        }
        return `Process ${pid} terminated.`;
    }
    
    // Handle nmap with specific IPs
    if (cmd.startsWith('nmap ')) {
        const target = cmd.split(' ').pop();
        return `Scanning ${target}...\nScan complete. ${target === '192.168.1.105' ? 'INFECTED HOST CONFIRMED' : 'Host scanned'}`;
    }
    
    // Handle iptables rules
    if (cmd.startsWith('iptables -A ')) {
        simEngine.recordAction('security_best_practice', { action: 'firewall_rule_added' });
        return `Firewall rule added successfully.\n✅ Security improved!`;
    }
    
    // Default response
    return commands[cmd.split(' ')[0]] || `Command not found: ${cmd}\nType 'help' for available commands.`;
}

function clearTerminal() {
    const history = document.getElementById('terminal-history');
    if (history) history.innerHTML = '';
}

function addToCommandHistory(cmd) {
    const historyContent = document.getElementById('history-content');
    if (historyContent) {
        const timestamp = new Date().toLocaleTimeString();
        historyContent.innerHTML += `<div>${timestamp} - ${cmd}</div>`;
        document.getElementById('command-history').style.display = 'block';
    }
}

// Network Element Handlers
function examineNetworkElement(element) {
    const details = {
        'internet': 'External network - Multiple attack attempts detected from 185.234.67.89',
        'firewall': 'Firewall operational but rules need updating. No blocking of malicious IPs.',
        'webserver': '⚠️ INFECTED - Backdoor shell detected. Suspicious outbound connections active.',
        'mailserver': '⚠️ SUSPICIOUS - Unusual SMTP traffic patterns. Possible spam relay.',
        'database': 'Database secure but experiencing high query volume.',
        'workstation3': '⚠️ COMPROMISED - Cryptominer process running. CPU at 95%.',
        'dns': 'DNS server operational. Some suspicious domain lookups detected.'
    };
    
    alert(details[element] || 'No additional information available.');
    simEngine.recordAction('investigation', { examined: element });
}

// Threat Handlers
function investigateThreat(threatId) {
    simEngine.recordAction('investigation', { threat: threatId });
    alert(`Investigating threat ${threatId}...\nGathering additional forensic data.`);
}

function containThreat(threatId) {
    simEngine.recordAction('correct_identification', { contained: threatId });
    alert(`Threat ${threatId} contained successfully!\n✅ Immediate danger mitigated.`);
}

function analyzeThreat(threatId) {
    simEngine.recordAction('investigation', { analyzed: threatId });
    alert(`Analyzing threat ${threatId}...\nGenerating detailed threat report.`);
}

// SIEM Handlers
function investigateEvent(eventId) {
    simEngine.recordAction('investigation', { event: eventId });
    alert(`Investigating event ${eventId}...\nCorrelating with other security events.`);
}

function dismissEvent(eventId) {
    const row = document.querySelector(`tr[data-event="${eventId}"]`);
    if (row) row.style.opacity = '0.5';
}

function filterSIEMEvents(severity) {
    const events = document.querySelectorAll('.siem-event');
    events.forEach(event => {
        if (severity === 'all' || event.dataset.severity === severity) {
            event.style.display = '';
        } else {
            event.style.display = 'none';
        }
    });
}

function refreshSIEM() {
    alert('SIEM data refreshed!\nNew events may be available.');
}

// Firewall Handlers
function addFirewallRule() {
    const action = document.getElementById('rule-action').value;
    const protocol = document.getElementById('rule-protocol').value;
    const source = document.getElementById('rule-source').value;
    const dest = document.getElementById('rule-dest').value;
    const port = document.getElementById('rule-port').value;
    
    if (!source || !dest) {
        alert('Please specify source and destination!');
        return;
    }
    
    simEngine.recordAction('security_best_practice', { 
        action: 'firewall_rule_added',
        rule: `${action} ${protocol} from ${source} to ${dest} port ${port}`
    });
    
    alert(`✅ Firewall rule added successfully!\n${action} ${protocol} from ${source} to ${dest}`);
    
    // Clear inputs
    document.getElementById('rule-source').value = '';
    document.getElementById('rule-dest').value = '';
    document.getElementById('rule-port').value = '';
}

function quickBlockIP(ip) {
    simEngine.recordAction('correct_identification', { blocked: ip });
    alert(`✅ IP ${ip} blocked successfully!\nMalicious traffic from this source is now denied.`);
}

function editRule(ruleId) {
    alert(`Edit rule ${ruleId} - Feature coming soon`);
}

function toggleRule(ruleId) {
    alert(`Rule ${ruleId} toggled`);
}

function deleteRule(ruleId) {
    if (confirm(`Delete rule ${ruleId}?`)) {
        alert(`Rule ${ruleId} deleted`);
    }
}

function backupRules() {
    alert('Firewall rules backed up successfully!');
}

function applyRules() {
    simEngine.recordAction('security_best_practice', { action: 'firewall_rules_applied' });
    alert('✅ Firewall rules applied successfully!\nNetwork is now more secure.');
}

// Tool Switching
function switchTool(toolType) {
    // Update tab styles
    document.querySelectorAll('.tool-tab').forEach(tab => {
        tab.style.background = '#27272a';
    });
    document.getElementById(`tool-tab-${toolType}`).style.background = '#6366f1';
    
    // Update content
    document.getElementById('tool-content').innerHTML = getToolContent(toolType);
}

// Log Filtering
function filterLogs(level) {
    const entries = document.querySelectorAll('.log-entry');
    entries.forEach(entry => {
        if (level === 'all' || entry.dataset.level === level) {
            entry.style.display = '';
        } else {
            entry.style.display = 'none';
        }
    });
}

function exportLogs() {
    alert('Logs exported to /tmp/incident_logs.txt');
    simEngine.recordAction('evidence_collected', { type: 'logs' });
}

// Task Progress
function updateTaskProgress() {
    const tasks = document.querySelectorAll('#task-checklist input[type="checkbox"]');
    const completed = document.querySelectorAll('#task-checklist input[type="checkbox"]:checked');
    
    const progress = (completed.length / tasks.length) * 100;
    document.getElementById('task-progress').style.width = progress + '%';
    document.getElementById('task-count').textContent = completed.length;
    
    // Record progress
    if (completed.length > 0) {
        simEngine.recordAction('task_completed', { count: completed.length });
    }
}

// Stage Navigation
function proceedToNextStage() {
    simEngine.recordAction('stage_complete', { stage: simEngine.currentStage });
    const result = simEngine.nextStage();
    
    if (result === 'complete') {
        showInteractiveResults();
    } else {
        showSimulationStage();
    }
}

// Analysis Submission
function submitVisualAnalysis() {
    // Collect answers
    const q1 = document.getElementById('analysis-q1').value;
    const systems = document.querySelectorAll('input[type="checkbox"]:checked');
    const q3 = document.getElementById('analysis-q3').value;
    const q4 = document.getElementById('analysis-q4').value;
    
    // Score based on correct answers
    if (q1 === 'malware' || q1 === 'web') {
        simEngine.recordAction('correct_identification', { question: 'attack_vector' });
    }
    
    if (systems.length >= 2) {
        simEngine.recordAction('proper_tool_usage', { identified: systems.length });
    }
    
    if (q3 && q3.length > 20) {
        simEngine.recordAction('investigation', { analysis_provided: true });
    }
    
    if (q4 === 'isolate' || q4 === 'block') {
        simEngine.recordAction('security_best_practice', { containment: q4 });
    }
    
    proceedToNextStage();
}

// Tool Stage Submission
function submitToolStage() {
    const tasks = document.querySelectorAll('#task-checklist input:checked');
    const completionRate = (tasks.length / 6) * 100;
    
    if (completionRate === 100) {
        simEngine.recordAction('efficient_solution', { allTasksComplete: true });
    } else if (completionRate >= 60) {
        simEngine.recordAction('security_best_practice', { tasksComplete: tasks.length });
    } else {
        simEngine.recordAction('missed_vulnerability', { tasksComplete: tasks.length });
    }
    
    proceedToNextStage();
}

// Report Submission
function submitReport() {
    const form = document.getElementById('incident-report');
    const formData = new FormData(form);
    
    // Check if key fields are filled
    let fieldsCompleted = 0;
    for (let [key, value] of formData.entries()) {
        if (value && value.length > 10) fieldsCompleted++;
    }
    
    if (fieldsCompleted >= 5) {
        simEngine.recordAction('efficient_solution', { report_complete: true });
    }
    
    simEngine.recordAction('report_submitted', { timestamp: Date.now() });
    proceedToNextStage();
}

// Show Results
function showInteractiveResults() {
    const results = simEngine.getFinalResults();
    const content = document.getElementById('content');
    
    // Save progress
    if (results.percentage >= 70) {
        if (!APP.progress.completedSimulations.includes(simEngine.currentSimulation.id)) {
            APP.progress.completedSimulations.push(simEngine.currentSimulation.id);
            saveProgress();
        }
    }
    
    content.innerHTML = `
        <div class="container">
            <div class="simulation-container" style="max-width: 1000px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 3rem;">🎉 Simulation Complete!</h1>
                    <h2 style="color: #6366f1; margin-top: 10px;">
                        ${simEngine.currentSimulation.title || 'Security Incident Response'}
                    </h2>
                </div>
                
                <!-- Score Display -->
                <div style="background: linear-gradient(135deg, #18181b, #1e1e2e); 
                            border-radius: 16px; padding: 40px; margin-bottom: 30px; text-align: center;
                            border: 2px solid ${results.percentage >= 70 ? '#10b981' : '#ef4444'};">
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
                                gap: 30px; margin-bottom: 30px;">
                        <div>
                            <div style="font-size: 4rem; font-weight: bold; color: #6366f1;">
                                ${results.score}
                            </div>
                            <div style="color: #71717a; font-size: 1.1rem;">Points Earned</div>
                        </div>
                        <div>
                            <div style="font-size: 4rem; font-weight: bold; 
                                        color: ${results.percentage >= 70 ? '#10b981' : '#f59e0b'};">
                                ${results.percentage}%
                            </div>
                            <div style="color: #71717a; font-size: 1.1rem;">Success Rate</div>
                        </div>
                        <div>
                            <div style="font-size: 4rem; font-weight: bold; 
                                        color: ${results.grade === 'A' || results.grade === 'B' ? '#10b981' : '#f59e0b'};">
                                ${results.grade}
                            </div>
                            <div style="color: #71717a; font-size: 1.1rem;">Grade</div>
                        </div>
                    </div>
                    
                    <div style="font-size: 1.8rem; font-weight: bold; 
                                color: ${results.percentage >= 70 ? '#10b981' : '#ef4444'};">
                        ${results.percentage >= 70 ? '✅ PASSED - Well Done!' : '❌ NEEDS IMPROVEMENT'}
                    </div>
                </div>
                
                <!-- Performance Analysis -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="color: #6366f1; margin-bottom: 20px;">📊 Performance Analysis</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                        <div>
                            <div style="color: #71717a; margin-bottom: 5px;">Time Spent</div>
                            <div style="font-size: 1.5rem; color: #fafafa;">
                                ${Math.floor(results.timeSpent / 60)} minutes ${results.timeSpent % 60} seconds
                            </div>
                        </div>
                        <div>
                            <div style="color: #71717a; margin-bottom: 5px;">Actions Taken</div>
                            <div style="font-size: 1.5rem; color: #fafafa;">${results.actions.length}</div>
                        </div>
                    </div>
                    
                    <!-- Action Breakdown -->
                    <div style="background: #27272a; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                        <h4 style="color: #fafafa; margin-bottom: 10px;">Action Summary</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${getActionSummary(results.actions).map(item => `
                                <span style="background: #18181b; padding: 5px 10px; border-radius: 4px; 
                                            border: 1px solid #3f3f46;">
                                    ${item.type}: ${item.count}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Feedback -->
                    <div>
                        <h4 style="color: #fafafa; margin-bottom: 15px;">💡 Feedback & Recommendations</h4>
                        <ul style="line-height: 2; color: #a1a1aa;">
                            ${results.feedback.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <!-- Skill Assessment -->
                <div style="background: #18181b; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                    <h3 style="color: #6366f1; margin-bottom: 20px;">🎯 Skill Assessment</h3>
                    <div style="display: grid; gap: 15px;">
                        ${generateSkillAssessment(results).map(skill => `
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span style="color: #fafafa;">${skill.name}</span>
                                    <span style="color: #71717a;">${skill.score}%</span>
                                </div>
                                <div style="background: #27272a; border-radius: 4px; padding: 3px;">
                                    <div style="background: ${skill.color}; width: ${skill.score}%; 
                                                height: 6px; border-radius: 2px;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary" 
                            onclick="startInteractiveSimulation('${simEngine.currentSimulation.id}')"
                            style="padding: 12px 30px;">
                        🔄 Retry Simulation
                    </button>
                    <button class="btn" onclick="showAllSimulations()" 
                            style="padding: 12px 30px; background: #27272a;">
                        📋 More Simulations
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

// Helper Functions
function getActionSummary(actions) {
    const summary = {};
    actions.forEach(action => {
        summary[action.action] = (summary[action.action] || 0) + 1;
    });
    
    return Object.keys(summary).map(key => ({
        type: key.replace(/_/g, ' '),
        count: summary[key]
    }));
}

function generateSkillAssessment(results) {
    const baseScore = results.percentage;
    return [
        { name: 'Threat Identification', score: Math.min(100, baseScore + 10), color: '#10b981' },
        { name: 'Incident Containment', score: Math.min(100, baseScore + 5), color: '#6366f1' },
        { name: 'Tool Proficiency', score: baseScore, color: '#8b5cf6' },
        { name: 'Evidence Collection', score: Math.max(50, baseScore - 5), color: '#f59e0b' },
        { name: 'Documentation', score: Math.max(40, baseScore - 10), color: '#ec4899' }
    ];
}

// Exit Confirmation
function confirmExitSimulation() {
    const message = simEngine.currentStage > 0 
        ? `Are you sure you want to exit? You've completed ${simEngine.currentStage} of ${simEngine.currentSimulation.stages.length} stages. Your progress will be lost.`
        : 'Are you sure you want to exit? Your progress will be lost.';
    
    if (confirm(message)) {
        showAllSimulations();
    }
}

// Export all functions
window.executeTerminalCommand = executeTerminalCommand;
window.processTerminalCommand = processTerminalCommand;
window.clearTerminal = clearTerminal;
window.examineNetworkElement = examineNetworkElement;
window.investigateThreat = investigateThreat;
window.containThreat = containThreat;
window.analyzeThreat = analyzeThreat;
window.investigateEvent = investigateEvent;
window.dismissEvent = dismissEvent;
window.filterSIEMEvents = filterSIEMEvents;
window.refreshSIEM = refreshSIEM;
window.addFirewallRule = addFirewallRule;
window.quickBlockIP = quickBlockIP;
window.editRule = editRule;
window.toggleRule = toggleRule;
window.deleteRule = deleteRule;
window.backupRules = backupRules;
window.applyRules = applyRules;
window.switchTool = switchTool;
window.filterLogs = filterLogs;
window.exportLogs = exportLogs;
window.updateTaskProgress = updateTaskProgress;
window.proceedToNextStage = proceedToNextStage;
window.submitVisualAnalysis = submitVisualAnalysis;
window.submitToolStage = submitToolStage;
window.submitReport = submitReport;
window.showInteractiveResults = showInteractiveResults;
window.confirmExitSimulation = confirmExitSimulation;
