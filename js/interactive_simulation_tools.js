// ================================================
// INTERACTIVE SIMULATION TOOLS
// Terminal, SIEM, Firewall, and Other Security Tools
// ================================================

class InteractiveTools {
    // Create interactive terminal
    static createTerminal(scenario) {
        return `
            <div class="terminal-container" style="background: #000; border: 2px solid #27272a; border-radius: 8px; overflow: hidden;">
                <!-- Terminal Header -->
                <div class="terminal-header" style="background: #27272a; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 8px;">
                        <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%;"></div>
                        <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></div>
                        <div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></div>
                    </div>
                    <div style="color: #71717a; font-family: monospace;">
                        Terminal - ${scenario.hostname || 'security-ws01'} - ${scenario.user || 'analyst'}@${scenario.ip || '192.168.1.50'}
                    </div>
                    <div>
                        <button onclick="clearTerminal()" style="padding: 2px 8px; background: #18181b; color: #71717a; border: none; border-radius: 4px; cursor: pointer;">Clear</button>
                    </div>
                </div>
                
                <!-- Terminal Body -->
                <div class="terminal-body" id="terminal-output" 
                     style="padding: 15px; font-family: 'Courier New', monospace; color: #0f0; 
                            background: #000; min-height: 400px; max-height: 400px; overflow-y: auto;">
                    <div>Last login: ${new Date().toLocaleString()} from ${scenario.lastLogin || '10.0.0.5'}</div>
                    <div>${scenario.welcomeMessage || 'Security Operations Terminal - Incident Response Mode Active'}</div>
                    <div style="color: #f59e0b;">⚠️ ALERT: Security incident detected. Investigate and respond.</div>
                    <div>Type 'help' for available commands or use quick commands below.</div>
                    <br/>
                    <div id="terminal-history"></div>
                </div>
                
                <!-- Terminal Input -->
                <div class="terminal-input-area" style="background: #0a0a0a; padding: 10px; border-top: 1px solid #27272a;">
                    <div style="display: flex; align-items: center;">
                        <span style="color: #10b981; margin-right: 10px; font-family: monospace;">
                            ${scenario.prompt || 'analyst@security:~$'}
                        </span>
                        <input type="text" id="terminal-input" 
                               style="flex: 1; background: transparent; border: none; color: #0f0; 
                                      font-family: 'Courier New', monospace; outline: none; font-size: 14px;"
                               onkeypress="if(event.key === 'Enter') executeTerminalCommand()"
                               placeholder="Enter command..."
                               autocomplete="off">
                    </div>
                </div>
            </div>
            
            <!-- Quick Commands -->
            <div style="margin-top: 15px; padding: 15px; background: #18181b; border-radius: 8px;">
                <h4 style="color: #6366f1; margin-bottom: 10px;">🚀 Quick Commands</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px;">
                    <button onclick="executeTerminalCommand('nmap -sV 192.168.1.0/24')" class="quick-cmd-btn">
                        Network Scan
                    </button>
                    <button onclick="executeTerminalCommand('netstat -tulpn')" class="quick-cmd-btn">
                        Active Connections
                    </button>
                    <button onclick="executeTerminalCommand('ps aux | grep suspicious')" class="quick-cmd-btn">
                        Check Processes
                    </button>
                    <button onclick="executeTerminalCommand('tail -f /var/log/auth.log')" class="quick-cmd-btn">
                        Auth Logs
                    </button>
                    <button onclick="executeTerminalCommand('iptables -L -n')" class="quick-cmd-btn">
                        Firewall Rules
                    </button>
                    <button onclick="executeTerminalCommand('tcpdump -i any -n')" class="quick-cmd-btn">
                        Packet Capture
                    </button>
                    <button onclick="executeTerminalCommand('find / -name "*.sh" -mtime -7')" class="quick-cmd-btn">
                        Recent Scripts
                    </button>
                    <button onclick="executeTerminalCommand('systemctl status')" class="quick-cmd-btn">
                        Service Status
                    </button>
                </div>
            </div>
            
            <style>
                .quick-cmd-btn {
                    padding: 8px 12px;
                    background: #27272a;
                    color: #fafafa;
                    border: 1px solid #3f3f46;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                .quick-cmd-btn:hover {
                    background: #3f3f46;
                    border-color: #6366f1;
                }
            </style>
        `;
    }

    // Create SIEM Dashboard
    static createSIEM(data) {
        return `
            <div class="siem-container" style="background: #18181b; border-radius: 8px; padding: 20px;">
                <!-- SIEM Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: #6366f1; margin: 0;">📊 SIEM Dashboard - Security Event Management</h3>
                    <div style="display: flex; gap: 10px;">
                        <select id="siem-filter" onchange="filterSIEMEvents(this.value)" 
                                style="padding: 5px; background: #27272a; color: #fafafa; 
                                       border: 1px solid #3f3f46; border-radius: 4px;">
                            <option value="all">All Events</option>
                            <option value="critical">Critical Only</option>
                            <option value="high">High Priority</option>
                            <option value="anomaly">Anomalies</option>
                            <option value="authentication">Authentication</option>
                            <option value="network">Network</option>
                        </select>
                        <button onclick="refreshSIEM()" style="padding: 5px 15px; background: #6366f1; 
                                                               color: white; border: none; border-radius: 4px; cursor: pointer;">
                            🔄 Refresh
                        </button>
                    </div>
                </div>
                
                <!-- Alert Statistics -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: #27272a; padding: 15px; border-radius: 8px; text-align: center; 
                                border-left: 4px solid #ef4444;">
                        <div style="color: #ef4444; font-size: 2.5rem; font-weight: bold;">${data.stats?.critical || 3}</div>
                        <div style="color: #71717a; font-size: 0.9rem;">Critical Alerts</div>
                    </div>
                    <div style="background: #27272a; padding: 15px; border-radius: 8px; text-align: center;
                                border-left: 4px solid #f59e0b;">
                        <div style="color: #f59e0b; font-size: 2.5rem; font-weight: bold;">${data.stats?.high || 7}</div>
                        <div style="color: #71717a; font-size: 0.9rem;">High Priority</div>
                    </div>
                    <div style="background: #27272a; padding: 15px; border-radius: 8px; text-align: center;
                                border-left: 4px solid #fbbf24;">
                        <div style="color: #fbbf24; font-size: 2.5rem; font-weight: bold;">${data.stats?.medium || 15}</div>
                        <div style="color: #71717a; font-size: 0.9rem;">Medium Priority</div>
                    </div>
                    <div style="background: #27272a; padding: 15px; border-radius: 8px; text-align: center;
                                border-left: 4px solid #10b981;">
                        <div style="color: #10b981; font-size: 2.5rem; font-weight: bold;">${data.stats?.investigated || 2}</div>
                        <div style="color: #71717a; font-size: 0.9rem;">Investigated</div>
                    </div>
                </div>
                
                <!-- Event Timeline -->
                <div style="background: #0a0a0a; border-radius: 8px; padding: 15px; max-height: 400px; overflow-y: auto;">
                    <h4 style="color: #fafafa; margin-bottom: 15px;">Event Timeline</h4>
                    <table style="width: 100%; color: #fafafa; font-size: 0.9rem;">
                        <thead>
                            <tr style="border-bottom: 2px solid #27272a;">
                                <th style="text-align: left; padding: 8px; color: #71717a;">Time</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Severity</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Event Type</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Source</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Description</th>
                                <th style="text-align: center; padding: 8px; color: #71717a;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="siem-events">
                            ${(data.events || generateSIEMEvents()).map((event, i) => `
                                <tr class="siem-event" data-severity="${event.severity}" 
                                    style="border-bottom: 1px solid #1a1a1a; transition: background 0.3s;"
                                    onmouseover="this.style.background='#1a1a1a'" 
                                    onmouseout="this.style.background='transparent'">
                                    <td style="padding: 8px; font-size: 0.85rem; color: #a1a1aa;">${event.timestamp}</td>
                                    <td style="padding: 8px;">
                                        <span style="background: ${
                                            event.severity === 'critical' ? '#ef4444' : 
                                            event.severity === 'high' ? '#f59e0b' : 
                                            event.severity === 'medium' ? '#fbbf24' : '#6366f1'
                                        }; color: #000; padding: 2px 6px; border-radius: 4px; 
                                                     font-size: 0.75rem; font-weight: bold;">
                                            ${event.severity.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style="padding: 8px; font-size: 0.85rem;">${event.type}</td>
                                    <td style="padding: 8px; font-size: 0.85rem; color: #6366f1;">${event.source}</td>
                                    <td style="padding: 8px; font-size: 0.85rem;">${event.description}</td>
                                    <td style="padding: 8px; text-align: center;">
                                        <button onclick="investigateEvent('${event.id}')" 
                                                style="padding: 4px 8px; background: #6366f1; color: white; 
                                                       border: none; border-radius: 4px; cursor: pointer; 
                                                       margin-right: 4px; font-size: 0.8rem;">
                                            Investigate
                                        </button>
                                        <button onclick="dismissEvent('${event.id}')" 
                                                style="padding: 4px 8px; background: #27272a; color: #71717a; 
                                                       border: 1px solid #3f3f46; border-radius: 4px; 
                                                       cursor: pointer; font-size: 0.8rem;">
                                            Dismiss
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Correlation Rules -->
                <div style="margin-top: 20px; padding: 15px; background: #27272a; border-radius: 8px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">🔗 Correlation Rules & Patterns</h4>
                    <div style="display: grid; gap: 10px;">
                        ${(data.correlations || generateCorrelations()).map(rule => `
                            <div style="padding: 12px; background: #18181b; border-left: 3px solid #6366f1; 
                                        border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: bold; color: #fafafa;">${rule.name}</div>
                                    <div style="color: #71717a; font-size: 0.9rem; margin-top: 5px;">${rule.description}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #6366f1; font-size: 0.9rem;">
                                        Confidence: ${rule.confidence}%
                                    </div>
                                    <div style="color: #71717a; font-size: 0.85rem;">
                                        ${rule.eventCount} events
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Create Firewall Rule Editor
    static createFirewallEditor(rules) {
        return `
            <div class="firewall-editor" style="background: #18181b; border-radius: 8px; padding: 20px;">
                <h3 style="color: #6366f1; margin-bottom: 20px;">🛡️ Firewall Rules Configuration</h3>
                
                <!-- Current Rules -->
                <div style="background: #0a0a0a; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="color: #10b981; margin: 0;">Active Firewall Rules</h4>
                        <div>
                            <button onclick="backupRules()" style="padding: 5px 12px; background: #27272a; 
                                                                   color: #fafafa; border: 1px solid #3f3f46; 
                                                                   border-radius: 4px; margin-right: 8px; cursor: pointer;">
                                Backup Rules
                            </button>
                            <button onclick="applyRules()" style="padding: 5px 12px; background: #10b981; 
                                                                  color: white; border: none; border-radius: 4px; cursor: pointer;">
                                Apply Changes
                            </button>
                        </div>
                    </div>
                    
                    <table style="width: 100%; color: #fafafa; font-size: 0.9rem;">
                        <thead>
                            <tr style="border-bottom: 2px solid #27272a;">
                                <th style="text-align: left; padding: 8px; color: #71717a;">Priority</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Action</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Protocol</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Source</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Destination</th>
                                <th style="text-align: left; padding: 8px; color: #71717a;">Port</th>
                                <th style="text-align: center; padding: 8px; color: #71717a;">Status</th>
                                <th style="text-align: center; padding: 8px; color: #71717a;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="firewall-rules">
                            ${(rules || generateFirewallRules()).map((rule, i) => `
                                <tr style="border-bottom: 1px solid #1a1a1a;">
                                    <td style="padding: 8px;">${rule.priority || i + 1}</td>
                                    <td style="padding: 8px;">
                                        <span style="color: ${rule.action === 'ALLOW' ? '#10b981' : '#ef4444'}; font-weight: bold;">
                                            ${rule.action}
                                        </span>
                                    </td>
                                    <td style="padding: 8px;">${rule.protocol}</td>
                                    <td style="padding: 8px; font-size: 0.85rem;">${rule.source}</td>
                                    <td style="padding: 8px; font-size: 0.85rem;">${rule.destination}</td>
                                    <td style="padding: 8px;">${rule.port}</td>
                                    <td style="padding: 8px; text-align: center;">
                                        <span style="color: ${rule.enabled ? '#10b981' : '#71717a'};">
                                            ${rule.enabled ? '✓ Active' : '✗ Disabled'}
                                        </span>
                                    </td>
                                    <td style="padding: 8px; text-align: center;">
                                        <button onclick="editRule(${rule.id || i})" 
                                                style="padding: 2px 6px; background: #27272a; color: #6366f1; 
                                                       border: none; border-radius: 4px; margin-right: 4px; 
                                                       cursor: pointer; font-size: 0.8rem;">
                                            Edit
                                        </button>
                                        <button onclick="toggleRule(${rule.id || i})" 
                                                style="padding: 2px 6px; background: #27272a; 
                                                       color: ${rule.enabled ? '#f59e0b' : '#10b981'}; 
                                                       border: none; border-radius: 4px; margin-right: 4px; 
                                                       cursor: pointer; font-size: 0.8rem;">
                                            ${rule.enabled ? 'Disable' : 'Enable'}
                                        </button>
                                        <button onclick="deleteRule(${rule.id || i})" 
                                                style="padding: 2px 6px; background: #27272a; color: #ef4444; 
                                                       border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Add New Rule -->
                <div style="background: #27272a; border-radius: 8px; padding: 15px;">
                    <h4 style="color: #6366f1; margin-bottom: 15px;">➕ Add New Rule</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                        <select id="rule-action" style="padding: 8px; background: #18181b; color: #fafafa; 
                                                        border: 1px solid #3f3f46; border-radius: 4px;">
                            <option value="DENY">DENY (Block)</option>
                            <option value="ALLOW">ALLOW (Permit)</option>
                        </select>
                        <select id="rule-protocol" style="padding: 8px; background: #18181b; color: #fafafa; 
                                                          border: 1px solid #3f3f46; border-radius: 4px;">
                            <option value="TCP">TCP</option>
                            <option value="UDP">UDP</option>
                            <option value="ICMP">ICMP</option>
                            <option value="ANY">ANY</option>
                        </select>
                        <input type="text" id="rule-source" placeholder="Source IP/CIDR" 
                               style="padding: 8px; background: #18181b; color: #fafafa; 
                                      border: 1px solid #3f3f46; border-radius: 4px;">
                        <input type="text" id="rule-dest" placeholder="Dest IP/CIDR" 
                               style="padding: 8px; background: #18181b; color: #fafafa; 
                                      border: 1px solid #3f3f46; border-radius: 4px;">
                        <input type="text" id="rule-port" placeholder="Port(s) e.g., 80,443" 
                               style="padding: 8px; background: #18181b; color: #fafafa; 
                                      border: 1px solid #3f3f46; border-radius: 4px;">
                        <button onclick="addFirewallRule()" style="padding: 8px 16px; background: #6366f1; 
                                                                   color: white; border: none; border-radius: 4px; 
                                                                   cursor: pointer; font-weight: bold;">
                            Add Rule
                        </button>
                    </div>
                    
                    <!-- Quick Block IPs -->
                    <div style="margin-top: 15px;">
                        <h5 style="color: #ef4444; margin-bottom: 10px;">⚡ Quick Block - Suspicious IPs</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <button onclick="quickBlockIP('185.234.67.89')" class="quick-block-btn">
                                Block 185.234.67.89
                            </button>
                            <button onclick="quickBlockIP('45.142.212.0/24')" class="quick-block-btn">
                                Block 45.142.212.0/24
                            </button>
                            <button onclick="quickBlockIP('103.75.201.4')" class="quick-block-btn">
                                Block 103.75.201.4
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .quick-block-btn {
                    padding: 6px 12px;
                    background: #7f1d1d;
                    color: #ef4444;
                    border: 1px solid #ef4444;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.3s;
                }
                .quick-block-btn:hover {
                    background: #ef4444;
                    color: #000;
                }
            </style>
        `;
    }
}

// Helper functions to generate sample data
function generateSIEMEvents() {
    return [
        { 
            id: 'E001', 
            timestamp: '14:32:15', 
            severity: 'critical', 
            type: 'Malware Detection', 
            source: '192.168.1.105', 
            description: 'Cryptominer process detected on workstation'
        },
        { 
            id: 'E002', 
            timestamp: '14:35:21', 
            severity: 'critical', 
            type: 'Data Exfiltration', 
            source: 'Web Server', 
            description: 'Large outbound data transfer to suspicious IP'
        },
        { 
            id: 'E003', 
            timestamp: '14:28:42', 
            severity: 'high', 
            type: 'Brute Force', 
            source: '185.234.67.89', 
            description: 'Multiple failed SSH login attempts'
        },
        { 
            id: 'E004', 
            timestamp: '14:40:15', 
            severity: 'medium', 
            type: 'Privilege Escalation', 
            source: '192.168.1.50', 
            description: 'Sudo usage by non-admin user'
        }
    ];
}

function generateCorrelations() {
    return [
        { 
            name: 'APT Campaign Pattern', 
            description: 'Multiple indicators match known APT group tactics', 
            confidence: 85, 
            eventCount: 12 
        },
        { 
            name: 'Lateral Movement Detected', 
            description: 'Sequential authentication attempts across multiple systems', 
            confidence: 72, 
            eventCount: 8 
        },
        { 
            name: 'Data Staging Activity', 
            description: 'Files being collected and compressed in temp directories', 
            confidence: 68, 
            eventCount: 5 
        }
    ];
}

function generateFirewallRules() {
    return [
        { id: 1, priority: 1, action: 'DENY', protocol: 'ANY', source: '185.234.67.89', destination: 'ANY', port: 'ANY', enabled: true },
        { id: 2, priority: 2, action: 'ALLOW', protocol: 'TCP', source: 'ANY', destination: '192.168.1.10', port: '80,443', enabled: true },
        { id: 3, priority: 3, action: 'ALLOW', protocol: 'TCP', source: '192.168.1.0/24', destination: 'ANY', port: '53', enabled: true },
        { id: 4, priority: 4, action: 'DENY', protocol: 'TCP', source: 'ANY', destination: 'ANY', port: '445', enabled: false },
        { id: 5, priority: 5, action: 'ALLOW', protocol: 'ICMP', source: '192.168.1.0/24', destination: '192.168.1.0/24', port: '-', enabled: true }
    ];
}

// Export for use in other files
window.InteractiveTools = InteractiveTools;
window.generateSIEMEvents = generateSIEMEvents;
window.generateCorrelations = generateCorrelations;
window.generateFirewallRules = generateFirewallRules;
