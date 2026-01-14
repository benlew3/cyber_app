/**
 * Tool Labs Integration v3
 * Security+ Training Platform v34
 * 
 * This script:
 * 1. Adds "🔬 Start Lab" buttons directly under each tool's website link
 * 2. Shows labs in a modal or full-page view
 * 3. Tracks progress with localStorage
 * 
 * INTEGRATION: Just add this script to your app and call:
 * - enhanceToolsWithLabs() after your tools section renders
 * - OR it auto-runs when it detects tool cards
 */

(function() {
    'use strict';

    // =============================================
    // TOOL LABS DATA - Maps tool names to lab files
    // =============================================
    
    var toolLabsMap = {
        'wireshark': { id: 'TOOL-LAB-001', file: 'TOOL-LAB-001_Wireshark.json', icon: '🦈' },
        'nmap': { id: 'TOOL-LAB-002', file: 'TOOL-LAB-002_Nmap.json', icon: '🗺️' },
        'splunk': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', icon: '📊' },
        'hashcat': { id: 'TOOL-LAB-004', file: 'TOOL-LAB-004_Hashcat.json', icon: '🔓' },
        'burp suite': { id: 'TOOL-LAB-005', file: 'TOOL-LAB-005_Burp_Suite.json', icon: '🕷️' },
        'burp': { id: 'TOOL-LAB-005', file: 'TOOL-LAB-005_Burp_Suite.json', icon: '🕷️' },
        'volatility': { id: 'TOOL-LAB-006', file: 'TOOL-LAB-006_Volatility.json', icon: '🧠' },
        'autopsy': { id: 'TOOL-LAB-007', file: 'TOOL-LAB-007_Autopsy.json', icon: '🔍' },
        'yara': { id: 'TOOL-LAB-008', file: 'TOOL-LAB-008_YARA.json', icon: '🎯' },
        'thehive': { id: 'TOOL-LAB-009', file: 'TOOL-LAB-009_TheHive.json', icon: '🐝' },
        'the hive': { id: 'TOOL-LAB-009', file: 'TOOL-LAB-009_TheHive.json', icon: '🐝' },
        'sysmon': { id: 'TOOL-LAB-010', file: 'TOOL-LAB-010_Sysmon.json', icon: '📝' },
        'openvas': { id: 'TOOL-LAB-011', file: 'TOOL-LAB-011_OpenVAS.json', icon: '🛡️' },
        'misp': { id: 'TOOL-LAB-012', file: 'TOOL-LAB-012_MISP.json', icon: '🌐' },
        'sigma': { id: 'TOOL-LAB-013', file: 'TOOL-LAB-013_Sigma.json', icon: '📋' },
        // Common variations
        'nessus': { id: 'TOOL-LAB-011', file: 'TOOL-LAB-011_OpenVAS.json', icon: '🛡️', note: 'Similar to OpenVAS' },
        'elastic': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', icon: '📊', note: 'SIEM concepts apply' },
        'elk': { id: 'TOOL-LAB-003', file: 'TOOL-LAB-003_Splunk.json', icon: '📊', note: 'SIEM concepts apply' }
    };

    var labProgress = {};

    function loadProgress() {
        try { labProgress = JSON.parse(localStorage.getItem('toolLabsProgress') || '{}'); } catch (e) { labProgress = {}; }
    }

    function saveProgress() {
        try { localStorage.setItem('toolLabsProgress', JSON.stringify(labProgress)); } catch (e) {}
    }

    function getCompletedCount(labId) {
        if (!labProgress[labId] || !labProgress[labId].projects) return 0;
        return Object.keys(labProgress[labId].projects).filter(function(p) { 
            return labProgress[labId].projects[p].completed; 
        }).length;
    }

    function isProjectComplete(labId, projectId) {
        return labProgress[labId] && labProgress[labId].projects && 
               labProgress[labId].projects[projectId] && 
               labProgress[labId].projects[projectId].completed;
    }

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // =============================================
    // AUTO-ENHANCE TOOL CARDS
    // =============================================
    
    function enhanceToolsWithLabs() {
        loadProgress();
        
        // Find all tool cards - try multiple selectors
        var toolCards = document.querySelectorAll('.tool-card, [class*="tool"], [data-tool]');
        
        if (toolCards.length === 0) {
            // Try finding cards by looking for links to tool websites
            var allCards = document.querySelectorAll('div, article, section');
            allCards.forEach(function(card) {
                var text = (card.textContent || '').toLowerCase();
                var hasLink = card.querySelector('a[href*="wireshark"], a[href*="nmap"], a[href*="splunk"]');
                
                Object.keys(toolLabsMap).forEach(function(toolName) {
                    if (text.indexOf(toolName) !== -1 || hasLink) {
                        addLabButtonToCard(card, toolName);
                    }
                });
            });
            return;
        }

        toolCards.forEach(function(card) {
            var cardText = (card.textContent || '').toLowerCase();
            var cardDataTool = (card.getAttribute('data-tool') || '').toLowerCase();
            
            // Check if this card matches any tool
            Object.keys(toolLabsMap).forEach(function(toolName) {
                if (cardText.indexOf(toolName) !== -1 || cardDataTool.indexOf(toolName) !== -1) {
                    addLabButtonToCard(card, toolName);
                }
            });
        });
        
        console.log('✅ Tool Labs buttons added to tool cards');
    }

    function addLabButtonToCard(card, toolName) {
        // Don't add button if already exists
        if (card.querySelector('.tool-lab-btn')) return;
        
        var labInfo = toolLabsMap[toolName];
        if (!labInfo) return;
        
        var completed = getCompletedCount(labInfo.id);
        var progressText = completed > 0 ? ' (' + completed + '/3 ✓)' : '';
        
        // Create the lab button
        var btn = document.createElement('button');
        btn.className = 'tool-lab-btn';
        btn.innerHTML = '🔬 Start Lab' + progressText;
        btn.setAttribute('data-lab-id', labInfo.id);
        btn.setAttribute('data-lab-file', labInfo.file);
        btn.style.cssText = 'display:block;width:100%;margin-top:10px;padding:10px 15px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.9rem;font-weight:500;transition:all 0.2s;';
        
        btn.onmouseenter = function() { 
            this.style.transform = 'translateY(-2px)'; 
            this.style.boxShadow = '0 4px 15px rgba(99,102,241,0.4)';
        };
        btn.onmouseleave = function() { 
            this.style.transform = 'translateY(0)'; 
            this.style.boxShadow = 'none';
        };
        
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            openLabModal(labInfo.id, labInfo.file);
        };
        
        // Find the best place to insert - after website link or at end
        var websiteLink = card.querySelector('a[href*="http"], a[target="_blank"]');
        if (websiteLink && websiteLink.parentNode) {
            websiteLink.parentNode.insertBefore(btn, websiteLink.nextSibling);
        } else {
            card.appendChild(btn);
        }
    }

    // =============================================
    // LAB MODAL SYSTEM
    // =============================================
    
    function createModalContainer() {
        if (document.getElementById('tool-lab-modal')) return;
        
        var modal = document.createElement('div');
        modal.id = 'tool-lab-modal';
        modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:100000;overflow-y:auto;';
        
        var container = document.createElement('div');
        container.id = 'tool-lab-modal-content';
        container.style.cssText = 'max-width:1000px;margin:20px auto;padding:20px;';
        
        modal.appendChild(container);
        document.body.appendChild(modal);
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeLabModal();
        });
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeLabModal();
        });
    }

    function openLabModal(labId, labFile) {
        createModalContainer();
        loadProgress();
        
        var modal = document.getElementById('tool-lab-modal');
        var content = document.getElementById('tool-lab-modal-content');
        
        content.innerHTML = '<div style="text-align:center;padding:60px;"><div style="font-size:3rem;margin-bottom:20px;">⏳</div><p style="color:#a1a1aa;">Loading lab...</p></div>';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        fetch('data/' + labFile)
            .then(function(r) { 
                if (!r.ok) throw new Error('Lab file not found'); 
                return r.json(); 
            })
            .then(function(data) {
                renderLabInModal(labId, data);
            })
            .catch(function(err) {
                console.error('Error loading lab:', err);
                content.innerHTML = '<div style="text-align:center;padding:60px;"><div style="font-size:3rem;margin-bottom:20px;">⚠️</div><h2 style="color:#fafafa;">Lab Not Found</h2><p style="color:#a1a1aa;margin-bottom:20px;">Make sure <code style="background:#27272a;padding:2px 8px;border-radius:4px;">data/' + escapeHtml(labFile) + '</code> exists in your project.</p><button onclick="closeLabModal()" style="background:#6366f1;color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;">Close</button></div>';
            });
    }

    function closeLabModal() {
        var modal = document.getElementById('tool-lab-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function renderLabInModal(labId, data) {
        var content = document.getElementById('tool-lab-modal-content');
        var completed = getCompletedCount(labId);
        
        // Projects HTML
        var projectsHtml = (data.mini_projects || []).map(function(p, idx) {
            var isComplete = isProjectComplete(labId, p.project_id);
            var diffColor = p.difficulty === 'advanced' ? '#ef4444' : p.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';
            
            return '<div class="lab-project-card" onclick="openProjectInModal(\'' + labId + '\', \'' + data.tool_name + '\', ' + idx + ')" style="background:#27272a;border:1px solid #3f3f46;border-radius:10px;padding:20px;cursor:pointer;transition:all 0.2s;margin-bottom:15px;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                    '<span style="background:' + diffColor + ';color:white;padding:4px 12px;border-radius:4px;font-size:0.75rem;text-transform:uppercase;">' + escapeHtml(p.difficulty) + '</span>' +
                    (isComplete ? '<span style="color:#10b981;font-weight:500;">✓ Completed</span>' : '<span style="color:#71717a;">Not started</span>') +
                '</div>' +
                '<h3 style="color:#fafafa;margin:0 0 8px 0;font-size:1.1rem;">' + escapeHtml(p.title) + '</h3>' +
                '<p style="color:#a1a1aa;margin:0 0 10px 0;font-size:0.9rem;">' + escapeHtml((p.description || '').substring(0, 120)) + '...</p>' +
                '<div style="color:#71717a;font-size:0.85rem;">⏱️ ' + escapeHtml(p.estimated_time) + '</div>' +
            '</div>';
        }).join('');

        // Core concepts
        var conceptsHtml = (data.core_concepts || []).slice(0, 3).map(function(c) {
            return '<div style="background:#27272a;border-radius:8px;padding:15px;margin-bottom:10px;">' +
                '<h4 style="color:#fafafa;margin:0 0 8px 0;">' + escapeHtml(c.title) + '</h4>' +
                '<p style="color:#a1a1aa;margin:0;font-size:0.9rem;">' + escapeHtml(c.explanation) + '</p>' +
            '</div>';
        }).join('');

        content.innerHTML = '<div style="background:#09090b;border-radius:12px;padding:0;">' +
            // Header with close button
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #27272a;">' +
                '<h1 style="color:#fafafa;margin:0;font-size:1.5rem;">' + escapeHtml(data.tool_name || 'Tool Lab') + '</h1>' +
                '<button onclick="closeLabModal()" style="background:#27272a;color:#fafafa;border:none;width:40px;height:40px;border-radius:8px;cursor:pointer;font-size:1.2rem;">✕</button>' +
            '</div>' +
            
            // Overview
            '<div style="padding:20px;">' +
                (data.overview ? '<p style="color:#a1a1aa;margin:0 0 20px 0;">' + escapeHtml(data.overview.description) + '</p>' +
                '<div style="display:flex;gap:15px;margin-bottom:25px;flex-wrap:wrap;">' +
                    '<a href="' + escapeHtml(data.overview.official_site || '#') + '" target="_blank" style="color:#6366f1;text-decoration:none;">🌐 Official Site →</a>' +
                    '<a href="' + escapeHtml(data.overview.download_url || '#') + '" target="_blank" style="color:#10b981;text-decoration:none;">⬇️ Download →</a>' +
                    '<span style="color:#71717a;">Progress: ' + completed + '/3 projects</span>' +
                '</div>' : '') +
                
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:25px;">' +
                    // Left: Projects
                    '<div>' +
                        '<h2 style="color:#fafafa;margin:0 0 15px 0;font-size:1.2rem;">🎯 Mini-Projects</h2>' +
                        projectsHtml +
                    '</div>' +
                    
                    // Right: Concepts + Actions
                    '<div>' +
                        '<h2 style="color:#fafafa;margin:0 0 15px 0;font-size:1.2rem;">📚 Key Concepts</h2>' +
                        conceptsHtml +
                        
                        '<div style="margin-top:20px;">' +
                            '<button onclick="openProjectInModal(\'' + labId + '\', \'' + escapeHtml(data.tool_name) + '\', 0)" style="background:#10b981;color:white;border:none;padding:12px;border-radius:8px;width:100%;cursor:pointer;font-size:0.95rem;margin-bottom:10px;">▶️ Start First Project</button>' +
                            '<button onclick="showCheatSheetModal(\'' + labId + '\')" style="background:#27272a;color:#fafafa;border:none;padding:12px;border-radius:8px;width:100%;cursor:pointer;font-size:0.95rem;">📋 View Cheat Sheet</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

        // Add hover effects
        setTimeout(function() {
            document.querySelectorAll('.lab-project-card').forEach(function(card) {
                card.addEventListener('mouseenter', function() { 
                    this.style.borderColor = '#6366f1'; 
                    this.style.transform = 'translateX(5px)'; 
                });
                card.addEventListener('mouseleave', function() { 
                    this.style.borderColor = '#3f3f46'; 
                    this.style.transform = 'translateX(0)'; 
                });
            });
        }, 50);

        // Store lab data for project view
        window._currentLabData = data;
    }

    // =============================================
    // PROJECT VIEW IN MODAL
    // =============================================
    
    window.openProjectInModal = function(labId, toolName, projectIndex) {
        var data = window._currentLabData;
        if (!data || !data.mini_projects || !data.mini_projects[projectIndex]) {
            console.error('Project data not found');
            return;
        }
        
        var project = data.mini_projects[projectIndex];
        var content = document.getElementById('tool-lab-modal-content');
        var isComplete = isProjectComplete(labId, project.project_id);
        var diffColor = project.difficulty === 'advanced' ? '#ef4444' : project.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';

        // Tasks HTML
        var tasksHtml = (project.tasks || []).map(function(task, idx) {
            var hintsHtml = (task.hints && task.hints.length) ? 
                '<details style="margin:10px 0;"><summary style="color:#f59e0b;cursor:pointer;">💡 Show Hints</summary>' +
                '<ul style="color:#a1a1aa;margin:10px 0 0 0;padding-left:20px;">' + 
                task.hints.map(function(h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') + 
                '</ul></details>' : '';
            
            return '<div style="background:#27272a;border-radius:10px;padding:20px;margin-bottom:15px;">' +
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">' +
                    '<span style="background:#6366f1;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;">' + (idx + 1) + '</span>' +
                    '<h4 style="color:#fafafa;margin:0;">' + escapeHtml(task.title) + '</h4>' +
                '</div>' +
                '<div style="background:#18181b;border-radius:8px;padding:15px;margin-bottom:15px;">' +
                    '<pre style="color:#a1a1aa;margin:0;white-space:pre-wrap;font-family:monospace;font-size:0.9rem;">' + escapeHtml(task.instructions) + '</pre>' +
                '</div>' +
                hintsHtml +
                '<div style="background:#10b98120;border-left:3px solid #10b981;padding:10px 15px;border-radius:0 8px 8px 0;">' +
                    '<strong style="color:#10b981;">Expected Result:</strong> ' +
                    '<span style="color:#a1a1aa;">' + escapeHtml(task.expected_result) + '</span>' +
                '</div>' +
            '</div>';
        }).join('');

        // Challenge questions
        var challengesHtml = (project.challenge_questions || []).map(function(q, idx) {
            return '<div style="background:#27272a;border-radius:8px;padding:15px;margin-bottom:10px;">' +
                '<p style="color:#fafafa;margin:0 0 10px 0;"><strong>Q' + (idx + 1) + ':</strong> ' + escapeHtml(q.question) + '</p>' +
                '<details><summary style="color:#6366f1;cursor:pointer;">Show Answer</summary>' +
                    '<p style="color:#10b981;margin:10px 0 5px 0;">' + escapeHtml(q.answer) + '</p>' +
                    '<p style="color:#71717a;margin:0;font-size:0.9rem;">' + escapeHtml(q.explanation) + '</p>' +
                '</details>' +
            '</div>';
        }).join('');

        content.innerHTML = '<div style="background:#09090b;border-radius:12px;">' +
            // Header
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #27272a;">' +
                '<div>' +
                    '<button onclick="openLabModal(\'' + labId + '\', \'' + data.lab_id + '.json\')" style="background:none;border:none;color:#6366f1;cursor:pointer;padding:0;margin-bottom:5px;">← Back to ' + escapeHtml(toolName) + '</button>' +
                    '<h1 style="color:#fafafa;margin:0;font-size:1.3rem;">' + escapeHtml(project.title) + '</h1>' +
                '</div>' +
                '<button onclick="closeLabModal()" style="background:#27272a;color:#fafafa;border:none;width:40px;height:40px;border-radius:8px;cursor:pointer;font-size:1.2rem;">✕</button>' +
            '</div>' +
            
            '<div style="padding:20px;">' +
                // Meta
                '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">' +
                    '<span style="background:' + diffColor + ';color:white;padding:5px 12px;border-radius:4px;font-size:0.8rem;text-transform:uppercase;">' + escapeHtml(project.difficulty) + '</span>' +
                    '<span style="background:#27272a;color:#a1a1aa;padding:5px 12px;border-radius:4px;font-size:0.8rem;">⏱️ ' + escapeHtml(project.estimated_time) + '</span>' +
                    (isComplete ? '<span style="background:#10b98120;color:#10b981;padding:5px 12px;border-radius:4px;font-size:0.8rem;">✓ Completed</span>' : '') +
                '</div>' +
                
                // Scenario
                '<div style="background:#1e1b4b;border:1px solid #4f46e5;border-radius:10px;padding:15px;margin-bottom:25px;">' +
                    '<strong style="color:#a78bfa;">📋 Scenario:</strong>' +
                    '<p style="color:#a1a1aa;margin:10px 0 0 0;">' + escapeHtml(project.scenario) + '</p>' +
                '</div>' +
                
                // Learning objectives
                '<div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:15px;margin-bottom:25px;">' +
                    '<h3 style="color:#fafafa;margin:0 0 10px 0;">🎯 What You\'ll Learn</h3>' +
                    '<ul style="color:#a1a1aa;margin:0;padding-left:20px;">' +
                        (project.learning_objectives || []).map(function(o) { return '<li>' + escapeHtml(o) + '</li>'; }).join('') +
                    '</ul>' +
                '</div>' +
                
                // Tasks
                '<h2 style="color:#fafafa;margin:0 0 15px 0;">📝 Tasks</h2>' +
                tasksHtml +
                
                // Challenge questions
                (challengesHtml ? '<h2 style="color:#fafafa;margin:30px 0 15px 0;">❓ Challenge Questions</h2>' + challengesHtml : '') +
                
                // Takeaways
                (project.takeaways && project.takeaways.length ? 
                    '<div style="background:#10b98120;border:1px solid #10b981;border-radius:10px;padding:15px;margin-top:25px;">' +
                        '<h3 style="color:#10b981;margin:0 0 10px 0;">🎓 Key Takeaways</h3>' +
                        '<ul style="color:#a1a1aa;margin:0;padding-left:20px;">' +
                            project.takeaways.map(function(t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') +
                        '</ul>' +
                    '</div>' : '') +
                
                // Navigation
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:30px;padding-top:20px;border-top:1px solid #27272a;flex-wrap:wrap;gap:15px;">' +
                    '<div style="display:flex;gap:10px;">' +
                        (projectIndex > 0 ? '<button onclick="openProjectInModal(\'' + labId + '\', \'' + escapeHtml(toolName) + '\', ' + (projectIndex - 1) + ')" style="background:#27272a;color:#fafafa;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">← Previous</button>' : '') +
                        (projectIndex < 2 ? '<button onclick="openProjectInModal(\'' + labId + '\', \'' + escapeHtml(toolName) + '\', ' + (projectIndex + 1) + ')" style="background:#27272a;color:#fafafa;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;">Next →</button>' : '') +
                    '</div>' +
                    '<button onclick="toggleComplete(\'' + labId + '\', \'' + project.project_id + '\', ' + projectIndex + ', \'' + escapeHtml(toolName) + '\')" style="background:' + (isComplete ? '#27272a' : '#10b981') + ';color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-size:1rem;">' +
                        (isComplete ? '↻ Mark Incomplete' : '✓ Mark Complete') + 
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    };

    window.toggleComplete = function(labId, projectId, projectIndex, toolName) {
        if (!labProgress[labId]) labProgress[labId] = { projects: {} };
        if (!labProgress[labId].projects) labProgress[labId].projects = {};
        
        if (isProjectComplete(labId, projectId)) {
            delete labProgress[labId].projects[projectId];
        } else {
            labProgress[labId].projects[projectId] = { completed: true, date: new Date().toISOString() };
        }
        
        saveProgress();
        openProjectInModal(labId, toolName, projectIndex);
        
        // Update button on tool card
        var btn = document.querySelector('[data-lab-id="' + labId + '"]');
        if (btn) {
            var completed = getCompletedCount(labId);
            var progressText = completed > 0 ? ' (' + completed + '/3 ✓)' : '';
            btn.innerHTML = '🔬 Start Lab' + progressText;
        }
    };

    window.showCheatSheetModal = function(labId) {
        var data = window._currentLabData;
        if (!data || !data.cheat_sheet) {
            alert('Cheat sheet not available');
            return;
        }
        
        var content = document.getElementById('tool-lab-modal-content');
        var sectionsHtml = (data.cheat_sheet.sections || []).map(function(section) {
            return '<div style="margin-bottom:25px;">' +
                '<h3 style="color:#fafafa;margin:0 0 15px 0;">' + escapeHtml(section.title) + '</h3>' +
                '<table style="width:100%;border-collapse:collapse;background:#18181b;border-radius:8px;overflow:hidden;">' +
                    '<thead><tr style="background:#27272a;"><th style="padding:12px;text-align:left;color:#fafafa;">Command</th><th style="padding:12px;text-align:left;color:#fafafa;">Description</th></tr></thead>' +
                    '<tbody>' + section.commands.map(function(cmd) {
                        return '<tr><td style="padding:10px;border-bottom:1px solid #27272a;font-family:monospace;color:#10b981;">' + escapeHtml(cmd.command) + '</td><td style="padding:10px;border-bottom:1px solid #27272a;color:#a1a1aa;">' + escapeHtml(cmd.description) + '</td></tr>';
                    }).join('') + '</tbody>' +
                '</table>' +
            '</div>';
        }).join('');
        
        content.innerHTML = '<div style="background:#09090b;border-radius:12px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid #27272a;">' +
                '<div>' +
                    '<button onclick="renderLabInModal(\'' + labId + '\', window._currentLabData)" style="background:none;border:none;color:#6366f1;cursor:pointer;padding:0;margin-bottom:5px;">← Back</button>' +
                    '<h1 style="color:#fafafa;margin:0;font-size:1.3rem;">📋 ' + escapeHtml(data.tool_name) + ' Cheat Sheet</h1>' +
                '</div>' +
                '<button onclick="closeLabModal()" style="background:#27272a;color:#fafafa;border:none;width:40px;height:40px;border-radius:8px;cursor:pointer;font-size:1.2rem;">✕</button>' +
            '</div>' +
            '<div style="padding:20px;">' + sectionsHtml + '</div>' +
        '</div>';
    };

    // =============================================
    // STANDALONE TOOL LABS PAGE
    // =============================================
    
    window.showToolLabsPage = function() {
        loadProgress();
        
        var content = document.getElementById('content');
        if (!content) {
            alert('Content container not found');
            return;
        }
        
        var labsHtml = Object.keys(toolLabsMap).filter(function(key, idx, arr) {
            // Remove duplicates by checking if this is the first occurrence of this lab ID
            return arr.findIndex(function(k) { return toolLabsMap[k].id === toolLabsMap[key].id; }) === idx;
        }).map(function(toolName) {
            var lab = toolLabsMap[toolName];
            var completed = getCompletedCount(lab.id);
            
            return '<div onclick="openLabModal(\'' + lab.id + '\', \'' + lab.file + '\')" style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:20px;cursor:pointer;transition:all 0.2s;" onmouseenter="this.style.borderColor=\'#6366f1\';this.style.transform=\'translateY(-3px)\'" onmouseleave="this.style.borderColor=\'#27272a\';this.style.transform=\'translateY(0)\'">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                    '<span style="font-size:2rem;">' + lab.icon + '</span>' +
                    (completed > 0 ? '<span style="color:#10b981;font-size:0.85rem;">✓ ' + completed + '/3</span>' : '') +
                '</div>' +
                '<h3 style="color:#fafafa;margin:0 0 5px 0;text-transform:capitalize;">' + escapeHtml(toolName) + '</h3>' +
                '<p style="color:#71717a;margin:0;font-size:0.85rem;">Hands-on lab with 3 projects</p>' +
            '</div>';
        }).join('');
        
        content.innerHTML = '<div style="max-width:1200px;margin:0 auto;padding:20px;">' +
            '<h1 style="color:#fafafa;margin:0 0 10px 0;">🔬 Tool Labs</h1>' +
            '<p style="color:#a1a1aa;margin:0 0 30px 0;">Hands-on projects to build real security skills</p>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;">' + labsHtml + '</div>' +
        '</div>';
    };

    // =============================================
    // EXPORTS & AUTO-INIT
    // =============================================
    
    window.enhanceToolsWithLabs = enhanceToolsWithLabs;
    window.openLabModal = openLabModal;
    window.closeLabModal = closeLabModal;
    window.showToolLabsPage = showToolLabsPage;
    
    // Auto-run when DOM changes (for SPA navigation)
    var observer = new MutationObserver(function(mutations) {
        var hasNewToolCards = mutations.some(function(m) {
            return m.addedNodes.length > 0;
        });
        if (hasNewToolCards) {
            setTimeout(enhanceToolsWithLabs, 100);
        }
    });
    
    // Start observing after DOM ready
    function init() {
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(enhanceToolsWithLabs, 500);
        console.log('✅ Tool Labs Integration loaded');
        console.log('   - Lab buttons will auto-add to tool cards');
        console.log('   - Call showToolLabsPage() for full labs view');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
