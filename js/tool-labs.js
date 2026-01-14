/**
 * Tool Labs Integration v4
 * Adds "🔬 Start Lab →" link to tool cards in the Tools section
 * 
 * Works by finding "Visit Website →" links and adding lab links next to them
 */

(function() {
    'use strict';

    // =============================================
    // TOOL TO LAB MAPPING
    // =============================================
    
    const toolLabsMap = {
        // Exact matches (lowercase)
        'splunk': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', name: 'Splunk' },
        'wireshark': { id: 'TOOL-LAB-001', file: 'TOOL-LAB-001_Wireshark.json', name: 'Wireshark' },
        'nmap': { id: 'TOOL-LAB-002', file: 'TOOL-LAB-002_Nmap.json', name: 'Nmap' },
        'hashcat': { id: 'TOOL-LAB-004', file: 'TOOL-LAB-004_Hashcat.json', name: 'Hashcat' },
        'burp suite': { id: 'TOOL-LAB-005', file: 'TOOL-LAB-005_Burp_Suite.json', name: 'Burp Suite' },
        'burp': { id: 'TOOL-LAB-005', file: 'TOOL-LAB-005_Burp_Suite.json', name: 'Burp Suite' },
        'volatility': { id: 'TOOL-LAB-006', file: 'TOOL-LAB-006_Volatility.json', name: 'Volatility' },
        'autopsy': { id: 'TOOL-LAB-007', file: 'TOOL-LAB-007_Autopsy.json', name: 'Autopsy' },
        'yara': { id: 'TOOL-LAB-008', file: 'TOOL-LAB-008_YARA.json', name: 'YARA' },
        'thehive': { id: 'TOOL-LAB-009', file: 'TOOL-LAB-009_TheHive.json', name: 'TheHive' },
        'the hive': { id: 'TOOL-LAB-009', file: 'TOOL-LAB-009_TheHive.json', name: 'TheHive' },
        'sysmon': { id: 'TOOL-LAB-010', file: 'TOOL-LAB-010_Sysmon.json', name: 'Sysmon' },
        'openvas': { id: 'TOOL-LAB-011', file: 'TOOL-LAB-011_OpenVAS.json', name: 'OpenVAS' },
        'greenbone': { id: 'TOOL-LAB-011', file: 'TOOL-LAB-011_OpenVAS.json', name: 'OpenVAS' },
        'misp': { id: 'TOOL-LAB-012', file: 'TOOL-LAB-012_MISP.json', name: 'MISP' },
        'sigma': { id: 'TOOL-LAB-013', file: 'TOOL-LAB-013_Sigma.json', name: 'Sigma' },
        // Similar tools that can use related labs
        'elastic': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', name: 'Splunk', note: 'SIEM concepts' },
        'elk': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', name: 'Splunk', note: 'SIEM concepts' },
        'qradar': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', name: 'Splunk', note: 'SIEM concepts' },
        'microsoft sentinel': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', name: 'Splunk', note: 'SIEM concepts' },
        'sentinel': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', name: 'Splunk', note: 'SIEM concepts' },
        'nessus': { id: 'TOOL-LAB-011', file: 'TOOL-LAB-011_OpenVAS.json', name: 'OpenVAS', note: 'Vuln scanning' },
        'zap': { id: 'TOOL-LAB-005', file: 'TOOL-LAB-005_Burp_Suite.json', name: 'Burp Suite', note: 'Web security' },
        'owasp zap': { id: 'TOOL-LAB-005', file: 'TOOL-LAB-005_Burp_Suite.json', name: 'Burp Suite', note: 'Web security' },
        'metasploit': { id: 'TOOL-LAB-002', file: 'TOOL-LAB-002_Nmap.json', name: 'Nmap', note: 'Recon concepts' },
        'crowdstrike': { id: 'TOOL-LAB-010', file: 'TOOL-LAB-010_Sysmon.json', name: 'Sysmon', note: 'EDR concepts' },
        'sentinelone': { id: 'TOOL-LAB-010', file: 'TOOL-LAB-010_Sysmon.json', name: 'Sysmon', note: 'EDR concepts' },
        'carbon black': { id: 'TOOL-LAB-010', file: 'TOOL-LAB-010_Sysmon.json', name: 'Sysmon', note: 'EDR concepts' },
    };

    // Progress tracking
    let labProgress = {};

    function loadProgress() {
        try { 
            labProgress = JSON.parse(localStorage.getItem('toolLabsProgress') || '{}'); 
        } catch (e) { 
            labProgress = {}; 
        }
    }

    function saveProgress() {
        try { 
            localStorage.setItem('toolLabsProgress', JSON.stringify(labProgress)); 
        } catch (e) {}
    }

    function getCompletedCount(labId) {
        if (!labProgress[labId]?.projects) return 0;
        return Object.values(labProgress[labId].projects).filter(p => p.completed).length;
    }

    function isProjectComplete(labId, projectId) {
        return labProgress[labId]?.projects?.[projectId]?.completed || false;
    }

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // =============================================
    // FIND AND ENHANCE TOOL CARDS
    // =============================================
    
    function enhanceToolCards() {
        loadProgress();
        
        // Find all "Visit Website" links
        const websiteLinks = document.querySelectorAll('a');
        let enhancedCount = 0;
        
        websiteLinks.forEach(link => {
            const linkText = link.textContent.trim().toLowerCase();
            
            // Check if this is a "Visit Website" link
            if (linkText.includes('visit website') || linkText.includes('website →')) {
                // Find the parent card
                const card = link.closest('div[style*="background"], div[class*="card"], div[style*="border"]') || link.parentElement?.parentElement;
                if (!card) return;
                
                // Check if already enhanced
                if (card.querySelector('.tool-lab-link')) return;
                
                // Get tool name from the card
                const cardText = card.textContent.toLowerCase();
                const toolName = findMatchingTool(cardText);
                
                if (toolName && toolLabsMap[toolName]) {
                    const labInfo = toolLabsMap[toolName];
                    const completed = getCompletedCount(labInfo.id);
                    
                    // Create lab link
                    const labLink = document.createElement('a');
                    labLink.className = 'tool-lab-link';
                    labLink.href = '#';
                    labLink.style.cssText = 'display:block;color:#10b981;text-decoration:none;margin-top:8px;font-size:0.9rem;';
                    
                    let linkContent = '🔬 Start Lab';
                    if (completed > 0) {
                        linkContent += ` <span style="color:#6366f1;">(${completed}/3 ✓)</span>`;
                    }
                    if (labInfo.note) {
                        linkContent += ` <span style="color:#71717a;font-size:0.8rem;">(${labInfo.note})</span>`;
                    }
                    linkContent += ' →';
                    
                    labLink.innerHTML = linkContent;
                    
                    labLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLabModal(labInfo.id, labInfo.file, labInfo.name);
                    });
                    
                    labLink.addEventListener('mouseenter', () => {
                        labLink.style.color = '#34d399';
                    });
                    labLink.addEventListener('mouseleave', () => {
                        labLink.style.color = '#10b981';
                    });
                    
                    // Insert after the website link
                    link.parentNode.insertBefore(labLink, link.nextSibling);
                    enhancedCount++;
                }
            }
        });
        
        if (enhancedCount > 0) {
            console.log(`✅ Added lab links to ${enhancedCount} tool cards`);
        }
    }

    function findMatchingTool(cardText) {
        // Check for exact tool name matches
        const toolNames = Object.keys(toolLabsMap);
        
        // Sort by length (longest first) to match "Microsoft Sentinel" before "Sentinel"
        toolNames.sort((a, b) => b.length - a.length);
        
        for (const toolName of toolNames) {
            if (cardText.includes(toolName)) {
                return toolName;
            }
        }
        return null;
    }

    // =============================================
    // LAB MODAL
    // =============================================
    
    function createModal() {
        if (document.getElementById('tool-lab-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'tool-lab-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 100000;
            overflow-y: auto;
        `;
        
        const content = document.createElement('div');
        content.id = 'tool-lab-content';
        content.style.cssText = 'max-width: 1000px; margin: 0 auto; padding: 20px;';
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Close handlers
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeLabModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLabModal();
        });
    }

    function openLabModal(labId, labFile, toolName) {
        createModal();
        loadProgress();
        
        const modal = document.getElementById('tool-lab-modal');
        const content = document.getElementById('tool-lab-content');
        
        content.innerHTML = `
            <div style="text-align: center; padding: 80px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">⏳</div>
                <p style="color: #a1a1aa;">Loading ${escapeHtml(toolName)} lab...</p>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        fetch('data/' + labFile)
            .then(r => {
                if (!r.ok) throw new Error('Lab file not found');
                return r.json();
            })
            .then(data => {
                window._currentLabData = data;
                window._currentLabId = labId;
                renderLabOverview(data, labId);
            })
            .catch(err => {
                console.error('Error loading lab:', err);
                content.innerHTML = `
                    <div style="text-align: center; padding: 80px;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                        <h2 style="color: #fafafa; margin-bottom: 15px;">Lab Not Found</h2>
                        <p style="color: #a1a1aa; margin-bottom: 10px;">Could not load: <code style="background: #27272a; padding: 2px 8px; border-radius: 4px;">data/${escapeHtml(labFile)}</code></p>
                        <p style="color: #71717a; margin-bottom: 25px;">Make sure the lab JSON files are in your data/ folder.</p>
                        <button onclick="closeLabModal()" style="background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1rem;">Close</button>
                    </div>
                `;
            });
    }

    function closeLabModal() {
        const modal = document.getElementById('tool-lab-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function renderLabOverview(data, labId) {
        const content = document.getElementById('tool-lab-content');
        const completed = getCompletedCount(labId);
        
        const projectsHtml = (data.mini_projects || []).map((p, idx) => {
            const isComplete = isProjectComplete(labId, p.project_id);
            const diffColor = p.difficulty === 'advanced' ? '#ef4444' : p.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';
            
            return `
                <div class="lab-project" data-index="${idx}" style="background: #27272a; border: 1px solid #3f3f46; border-radius: 10px; padding: 20px; cursor: pointer; transition: all 0.2s; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="background: ${diffColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">${escapeHtml(p.difficulty)}</span>
                        ${isComplete ? '<span style="color: #10b981; font-weight: 500;">✓ Completed</span>' : '<span style="color: #71717a;">Not started</span>'}
                    </div>
                    <h3 style="color: #fafafa; margin: 0 0 8px 0; font-size: 1.1rem;">${escapeHtml(p.title)}</h3>
                    <p style="color: #a1a1aa; margin: 0 0 10px 0; font-size: 0.9rem;">${escapeHtml((p.description || p.scenario || '').substring(0, 120))}...</p>
                    <div style="color: #71717a; font-size: 0.85rem;">⏱️ ${escapeHtml(p.estimated_time)}</div>
                </div>
            `;
        }).join('');

        const conceptsHtml = (data.core_concepts || []).slice(0, 4).map(c => `
            <div style="background: #27272a; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <h4 style="color: #fafafa; margin: 0 0 8px 0; font-size: 0.95rem;">${escapeHtml(c.title)}</h4>
                <p style="color: #a1a1aa; margin: 0; font-size: 0.85rem;">${escapeHtml(c.explanation)}</p>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="background: #09090b; border-radius: 12px;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #27272a;">
                    <div>
                        <h1 style="color: #fafafa; margin: 0; font-size: 1.6rem;">🔬 ${escapeHtml(data.tool_name)} Lab</h1>
                        <p style="color: #a1a1aa; margin: 5px 0 0 0; font-size: 0.9rem;">${escapeHtml(data.overview?.tagline || '')}</p>
                    </div>
                    <button onclick="closeLabModal()" style="background: #27272a; color: #fafafa; border: none; width: 44px; height: 44px; border-radius: 8px; cursor: pointer; font-size: 1.3rem;">✕</button>
                </div>
                
                <!-- Overview -->
                <div style="padding: 25px;">
                    ${data.overview ? `
                        <p style="color: #a1a1aa; margin: 0 0 20px 0; line-height: 1.6;">${escapeHtml(data.overview.description)}</p>
                        <div style="display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap; align-items: center;">
                            <a href="${escapeHtml(data.overview.official_site || '#')}" target="_blank" style="color: #6366f1; text-decoration: none;">🌐 Official Site →</a>
                            <a href="${escapeHtml(data.overview.download_url || '#')}" target="_blank" style="color: #10b981; text-decoration: none;">⬇️ Download →</a>
                            <span style="color: #71717a;">📊 Progress: ${completed}/3 projects</span>
                        </div>
                    ` : ''}
                    
                    <div style="display: grid; grid-template-columns: 1fr 320px; gap: 30px;">
                        <!-- Projects -->
                        <div>
                            <h2 style="color: #fafafa; margin: 0 0 20px 0; font-size: 1.2rem;">🎯 Mini-Projects</h2>
                            ${projectsHtml}
                        </div>
                        
                        <!-- Sidebar -->
                        <div>
                            <h2 style="color: #fafafa; margin: 0 0 15px 0; font-size: 1.1rem;">📚 Key Concepts</h2>
                            ${conceptsHtml}
                            
                            <div style="margin-top: 25px;">
                                <button onclick="openProject(0)" style="background: #10b981; color: white; border: none; padding: 14px; border-radius: 8px; width: 100%; cursor: pointer; font-size: 0.95rem; font-weight: 500; margin-bottom: 10px;">▶️ Start First Project</button>
                                <button onclick="showCheatSheet()" style="background: #27272a; color: #fafafa; border: none; padding: 12px; border-radius: 8px; width: 100%; cursor: pointer; font-size: 0.9rem;">📋 View Cheat Sheet</button>
                            </div>
                            
                            <div style="background: #1e1b4b; border: 1px solid #4f46e5; border-radius: 10px; padding: 15px; margin-top: 20px;">
                                <h4 style="color: #a78bfa; margin: 0 0 8px 0; font-size: 0.9rem;">💼 Portfolio Tip</h4>
                                <p style="color: #a1a1aa; margin: 0; font-size: 0.85rem;">Document your work with screenshots. These projects make great portfolio pieces!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add click handlers for project cards
        document.querySelectorAll('.lab-project').forEach(card => {
            card.addEventListener('click', () => {
                openProject(parseInt(card.dataset.index));
            });
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = '#6366f1';
                card.style.transform = 'translateX(5px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '#3f3f46';
                card.style.transform = 'translateX(0)';
            });
        });
    }

    // =============================================
    // PROJECT VIEW
    // =============================================
    
    window.openProject = function(projectIndex) {
        const data = window._currentLabData;
        const labId = window._currentLabId;
        if (!data?.mini_projects?.[projectIndex]) return;
        
        const project = data.mini_projects[projectIndex];
        const content = document.getElementById('tool-lab-content');
        const isComplete = isProjectComplete(labId, project.project_id);
        const diffColor = project.difficulty === 'advanced' ? '#ef4444' : project.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';

        const tasksHtml = (project.tasks || []).map((task, idx) => {
            const hintsHtml = task.hints?.length ? `
                <details style="margin: 12px 0;">
                    <summary style="color: #f59e0b; cursor: pointer; font-size: 0.9rem;">💡 Show Hints</summary>
                    <ul style="color: #a1a1aa; margin: 10px 0 0 0; padding-left: 20px; font-size: 0.9rem;">
                        ${task.hints.map(h => `<li>${escapeHtml(h)}</li>`).join('')}
                    </ul>
                </details>
            ` : '';
            
            return `
                <div style="background: #27272a; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                        <span style="background: #6366f1; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${idx + 1}</span>
                        <h4 style="color: #fafafa; margin: 0;">${escapeHtml(task.title)}</h4>
                    </div>
                    <div style="background: #18181b; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <pre style="color: #a1a1aa; margin: 0; white-space: pre-wrap; font-family: 'SF Mono', Monaco, monospace; font-size: 0.9rem; line-height: 1.5;">${escapeHtml(task.instructions)}</pre>
                    </div>
                    ${hintsHtml}
                    <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; padding: 12px 15px; border-radius: 0 8px 8px 0;">
                        <strong style="color: #10b981;">Expected Result:</strong>
                        <span style="color: #a1a1aa;"> ${escapeHtml(task.expected_result)}</span>
                    </div>
                </div>
            `;
        }).join('');

        const challengesHtml = (project.challenge_questions || []).map((q, idx) => `
            <div style="background: #27272a; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <p style="color: #fafafa; margin: 0 0 10px 0;"><strong>Q${idx + 1}:</strong> ${escapeHtml(q.question)}</p>
                <details>
                    <summary style="color: #6366f1; cursor: pointer;">Show Answer</summary>
                    <p style="color: #10b981; margin: 10px 0 5px 0;">${escapeHtml(q.answer)}</p>
                    <p style="color: #71717a; margin: 0; font-size: 0.9rem;">${escapeHtml(q.explanation)}</p>
                </details>
            </div>
        `).join('');

        const takeawaysHtml = project.takeaways?.length ? `
            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 10px; padding: 20px; margin-top: 30px;">
                <h3 style="color: #10b981; margin: 0 0 12px 0;">🎓 Key Takeaways</h3>
                <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">
                    ${project.takeaways.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        content.innerHTML = `
            <div style="background: #09090b; border-radius: 12px;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #27272a;">
                    <div>
                        <button onclick="renderLabOverview(window._currentLabData, window._currentLabId)" style="background: none; border: none; color: #6366f1; cursor: pointer; padding: 0; font-size: 0.9rem; margin-bottom: 8px;">← Back to ${escapeHtml(data.tool_name)}</button>
                        <h1 style="color: #fafafa; margin: 0; font-size: 1.4rem;">${escapeHtml(project.title)}</h1>
                    </div>
                    <button onclick="closeLabModal()" style="background: #27272a; color: #fafafa; border: none; width: 44px; height: 44px; border-radius: 8px; cursor: pointer; font-size: 1.3rem;">✕</button>
                </div>
                
                <div style="padding: 25px;">
                    <!-- Meta -->
                    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 25px;">
                        <span style="background: ${diffColor}; color: white; padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; text-transform: uppercase; font-weight: 500;">${escapeHtml(project.difficulty)}</span>
                        <span style="background: #27272a; color: #a1a1aa; padding: 6px 14px; border-radius: 6px; font-size: 0.85rem;">⏱️ ${escapeHtml(project.estimated_time)}</span>
                        ${isComplete ? '<span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 14px; border-radius: 6px; font-size: 0.85rem;">✓ Completed</span>' : ''}
                    </div>
                    
                    <!-- Scenario -->
                    <div style="background: #1e1b4b; border: 1px solid #4f46e5; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                        <strong style="color: #a78bfa;">📋 Scenario:</strong>
                        <p style="color: #c4b5fd; margin: 10px 0 0 0; line-height: 1.6;">${escapeHtml(project.scenario)}</p>
                    </div>
                    
                    <!-- Learning Objectives -->
                    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                        <h3 style="color: #fafafa; margin: 0 0 12px 0;">🎯 What You'll Learn</h3>
                        <ul style="color: #a1a1aa; margin: 0; padding-left: 20px; line-height: 1.8;">
                            ${(project.learning_objectives || []).map(o => `<li>${escapeHtml(o)}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <!-- Tasks -->
                    <h2 style="color: #fafafa; margin: 0 0 20px 0;">📝 Tasks</h2>
                    ${tasksHtml}
                    
                    <!-- Challenge Questions -->
                    ${challengesHtml ? `<h2 style="color: #fafafa; margin: 35px 0 15px 0;">❓ Challenge Questions</h2>${challengesHtml}` : ''}
                    
                    <!-- Takeaways -->
                    ${takeawaysHtml}
                    
                    <!-- Navigation -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid #27272a; flex-wrap: wrap; gap: 15px;">
                        <div style="display: flex; gap: 10px;">
                            ${projectIndex > 0 ? `<button onclick="openProject(${projectIndex - 1})" style="background: #27272a; color: #fafafa; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer;">← Previous Project</button>` : ''}
                            ${projectIndex < 2 ? `<button onclick="openProject(${projectIndex + 1})" style="background: #27272a; color: #fafafa; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer;">Next Project →</button>` : ''}
                        </div>
                        <button onclick="toggleComplete('${project.project_id}', ${projectIndex})" style="background: ${isComplete ? '#27272a' : '#10b981'}; color: white; border: none; padding: 14px 28px; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 500;">
                            ${isComplete ? '↻ Mark Incomplete' : '✓ Mark Complete'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Scroll to top of modal
        document.getElementById('tool-lab-modal').scrollTop = 0;
    };

    window.toggleComplete = function(projectId, projectIndex) {
        const labId = window._currentLabId;
        
        if (!labProgress[labId]) labProgress[labId] = { projects: {} };
        if (!labProgress[labId].projects) labProgress[labId].projects = {};
        
        if (isProjectComplete(labId, projectId)) {
            delete labProgress[labId].projects[projectId];
        } else {
            labProgress[labId].projects[projectId] = { completed: true, date: new Date().toISOString() };
        }
        
        saveProgress();
        openProject(projectIndex);
        
        // Update the lab link on the tool card
        setTimeout(() => enhanceToolCards(), 100);
    };

    // =============================================
    // CHEAT SHEET
    // =============================================
    
    window.showCheatSheet = function() {
        const data = window._currentLabData;
        const labId = window._currentLabId;
        if (!data?.cheat_sheet) {
            alert('Cheat sheet not available for this lab');
            return;
        }
        
        const content = document.getElementById('tool-lab-content');
        
        const sectionsHtml = (data.cheat_sheet.sections || []).map(section => `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #fafafa; margin: 0 0 15px 0;">${escapeHtml(section.title)}</h3>
                <table style="width: 100%; border-collapse: collapse; background: #18181b; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background: #27272a;">
                            <th style="padding: 14px; text-align: left; color: #fafafa; font-weight: 500;">Command</th>
                            <th style="padding: 14px; text-align: left; color: #fafafa; font-weight: 500;">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${section.commands.map(cmd => `
                            <tr>
                                <td style="padding: 12px 14px; border-bottom: 1px solid #27272a; font-family: 'SF Mono', Monaco, monospace; color: #10b981; font-size: 0.9rem;">${escapeHtml(cmd.command)}</td>
                                <td style="padding: 12px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa;">${escapeHtml(cmd.description)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `).join('');
        
        content.innerHTML = `
            <div style="background: #09090b; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #27272a;">
                    <div>
                        <button onclick="renderLabOverview(window._currentLabData, window._currentLabId)" style="background: none; border: none; color: #6366f1; cursor: pointer; padding: 0; font-size: 0.9rem; margin-bottom: 8px;">← Back to ${escapeHtml(data.tool_name)}</button>
                        <h1 style="color: #fafafa; margin: 0; font-size: 1.4rem;">📋 ${escapeHtml(data.tool_name)} Cheat Sheet</h1>
                    </div>
                    <button onclick="closeLabModal()" style="background: #27272a; color: #fafafa; border: none; width: 44px; height: 44px; border-radius: 8px; cursor: pointer; font-size: 1.3rem;">✕</button>
                </div>
                <div style="padding: 25px;">
                    ${sectionsHtml}
                </div>
            </div>
        `;
        
        document.getElementById('tool-lab-modal').scrollTop = 0;
    };

    // =============================================
    // EXPORTS & INITIALIZATION
    // =============================================
    
    window.enhanceToolCards = enhanceToolCards;
    window.closeLabModal = closeLabModal;
    
    // Watch for DOM changes (for SPA navigation)
    const observer = new MutationObserver((mutations) => {
        const hasChanges = mutations.some(m => m.addedNodes.length > 0);
        if (hasChanges) {
            setTimeout(enhanceToolCards, 150);
        }
    });
    
    function init() {
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial enhancement
        setTimeout(enhanceToolCards, 300);
        
        // Re-run periodically in case of dynamic content
        setInterval(enhanceToolCards, 2000);
        
        console.log('✅ Tool Labs loaded - Lab links will appear on tool cards');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
