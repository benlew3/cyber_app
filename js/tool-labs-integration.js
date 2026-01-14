/**
 * Tool Labs Integration Patch
 * Security+ Training Platform v34
 * 
 * This patch enhances the existing Security Tools page by:
 * 1. Adding "🔬 Start Lab" buttons to tools that have labs
 * 2. Integrating Tool Labs viewer directly
 * 3. Making projects accessible from the tool cards
 */

(function() {
    'use strict';
    
    // ===========================================
    // TOOL LABS DATA
    // ===========================================
    
    var toolLabsData = {
        'wireshark': {
            labId: 'TOOL-LAB-001',
            icon: '🦈',
            projects: [
                { id: 'project-1', title: 'Your First Capture: HTTP Traffic Analysis', difficulty: 'beginner', time: '30-45 min' },
                { id: 'project-2', title: 'Analyzing a Suspicious PCAP File', difficulty: 'intermediate', time: '45-60 min' },
                { id: 'project-3', title: 'Network Forensics Challenge', difficulty: 'advanced', time: '60-90 min' }
            ]
        },
        'nmap': {
            labId: 'TOOL-LAB-002',
            icon: '🗺️',
            projects: [
                { id: 'project-1', title: 'Basic Network Reconnaissance', difficulty: 'beginner', time: '30-45 min' },
                { id: 'project-2', title: 'Network Discovery and Host Enumeration', difficulty: 'intermediate', time: '45-60 min' },
                { id: 'project-3', title: 'Vulnerability Scanning with NSE', difficulty: 'advanced', time: '60-90 min' }
            ]
        },
        'splunk': {
            labId: 'TOOL-LAB-003',
            icon: '📊',
            projects: [
                { id: 'project-1', title: 'Introduction to SPL Search', difficulty: 'beginner', time: '45-60 min' },
                { id: 'project-2', title: 'Security Log Analysis', difficulty: 'intermediate', time: '60-90 min' },
                { id: 'project-3', title: 'Building Security Dashboards and Alerts', difficulty: 'advanced', time: '90-120 min' }
            ]
        },
        'hashcat': {
            labId: 'TOOL-LAB-004',
            icon: '🔓',
            projects: [
                { id: 'project-1', title: 'Cracking Your First Hash', difficulty: 'beginner', time: '30-45 min' },
                { id: 'project-2', title: 'Advanced Attack Techniques', difficulty: 'intermediate', time: '60-90 min' },
                { id: 'project-3', title: 'Real-World Hash Cracking Challenge', difficulty: 'advanced', time: '60-90 min' }
            ]
        },
        'burp suite': {
            labId: 'TOOL-LAB-005',
            icon: '🕷️',
            projects: [
                { id: 'project-1', title: 'Intercepting and Analyzing Traffic', difficulty: 'beginner', time: '45-60 min' },
                { id: 'project-2', title: 'Finding SQL Injection', difficulty: 'intermediate', time: '60-90 min' },
                { id: 'project-3', title: 'Automated Testing with Intruder', difficulty: 'advanced', time: '60-90 min' }
            ]
        }
    };
    
    // Progress tracking
    var progress = loadProgress();
    
    function loadProgress() {
        try {
            return JSON.parse(localStorage.getItem('toolLabsProgress') || '{}');
        } catch (e) {
            return {};
        }
    }
    
    function saveProgress() {
        try {
            localStorage.setItem('toolLabsProgress', JSON.stringify(progress));
        } catch (e) {
            console.warn('Could not save progress');
        }
    }
    
    function isProjectComplete(labId, projectId) {
        return progress[labId] && 
               progress[labId].projects && 
               progress[labId].projects[projectId] && 
               progress[labId].projects[projectId].completed;
    }
    
    function getCompletedCount(labId) {
        if (!progress[labId] || !progress[labId].projects) return 0;
        return Object.keys(progress[labId].projects).filter(function(p) {
            return progress[labId].projects[p].completed;
        }).length;
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // ===========================================
    // ENHANCE EXISTING TOOLS PAGE
    // ===========================================
    
    function enhanceToolsPage() {
        // Find all tool cards on the page
        var toolCards = document.querySelectorAll('.tool-card, [class*="tool"]');
        
        toolCards.forEach(function(card) {
            var cardText = card.textContent.toLowerCase();
            
            // Check if this tool has a lab
            Object.keys(toolLabsData).forEach(function(toolName) {
                if (cardText.includes(toolName) && !card.querySelector('.lab-badge')) {
                    var labInfo = toolLabsData[toolName];
                    var completedCount = getCompletedCount(labInfo.labId);
                    
                    // Add lab badge
                    var badge = document.createElement('div');
                    badge.className = 'lab-badge';
                    badge.style.cssText = 'background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 5px; margin-top: 8px;';
                    badge.innerHTML = '🔬 Lab Available' + (completedCount > 0 ? ' <span style="background: #10b981; padding: 1px 6px; border-radius: 4px; margin-left: 4px;">' + completedCount + '/3</span>' : '');
                    
                    // Add "Start Lab" button
                    var labBtn = document.createElement('button');
                    labBtn.className = 'start-lab-btn';
                    labBtn.style.cssText = 'background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; margin-top: 10px; display: block; width: 100%; transition: all 0.2s;';
                    labBtn.textContent = '🔬 Start Lab - Build Portfolio Projects';
                    labBtn.onclick = function(e) {
                        e.stopPropagation();
                        showToolLabModal(toolName, labInfo);
                    };
                    labBtn.onmouseenter = function() { this.style.background = '#059669'; };
                    labBtn.onmouseleave = function() { this.style.background = '#10b981'; };
                    
                    // Find the "Visit Website" link and add button after it
                    var visitLink = card.querySelector('a[href*="Visit"], a:last-child, .visit-link');
                    if (visitLink) {
                        visitLink.parentNode.insertBefore(labBtn, visitLink.nextSibling);
                    } else {
                        card.appendChild(labBtn);
                    }
                    
                    // Add badge near the title
                    var title = card.querySelector('h3, h4, .tool-name, strong');
                    if (title) {
                        title.parentNode.insertBefore(badge, title.nextSibling);
                    }
                }
            });
        });
    }
    
    // ===========================================
    // TOOL LAB MODAL
    // ===========================================
    
    function showToolLabModal(toolName, labInfo) {
        // Remove existing modal if any
        var existingModal = document.getElementById('tool-lab-modal');
        if (existingModal) existingModal.remove();
        
        var completedCount = getCompletedCount(labInfo.labId);
        
        var projectsHtml = labInfo.projects.map(function(project, idx) {
            var isComplete = isProjectComplete(labInfo.labId, project.id);
            var diffColor = project.difficulty === 'advanced' ? '#ef4444' : project.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';
            
            return '\
                <div class="lab-project-card" style="background: #27272a; border: 1px solid #3f3f46; border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.2s;" onclick="ToolLabsIntegration.startProject(\'' + labInfo.labId + '\', ' + idx + ')">\
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">\
                        <span style="background: ' + diffColor + '; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">' + project.difficulty + '</span>\
                        ' + (isComplete ? '<span style="color: #10b981; font-size: 0.85rem;">✓ Done</span>' : '') + '\
                    </div>\
                    <h4 style="color: #fafafa; margin: 0 0 5px 0; font-size: 0.95rem;">' + escapeHtml(project.title) + '</h4>\
                    <span style="color: #71717a; font-size: 0.8rem;">⏱️ ' + project.time + '</span>\
                </div>\
            ';
        }).join('');
        
        var modal = document.createElement('div');
        modal.id = 'tool-lab-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; box-sizing: border-box;';
        modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = '\
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 16px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;">\
                <div style="padding: 25px; border-bottom: 1px solid #27272a;">\
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">\
                        <div>\
                            <span style="font-size: 2rem;">' + labInfo.icon + '</span>\
                            <h2 style="color: #fafafa; margin: 10px 0 5px 0; text-transform: capitalize;">' + escapeHtml(toolName) + ' Lab</h2>\
                            <p style="color: #a1a1aa; margin: 0;">Build portfolio-ready projects</p>\
                        </div>\
                        <button onclick="this.closest(\'#tool-lab-modal\').remove()" style="background: #27272a; color: #a1a1aa; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.2rem;">×</button>\
                    </div>\
                    ' + (completedCount > 0 ? '<div style="margin-top: 15px; background: #10b98120; border: 1px solid #10b981; border-radius: 8px; padding: 10px;"><span style="color: #10b981;">🎯 Progress: ' + completedCount + '/3 projects completed</span></div>' : '') + '\
                </div>\
                \
                <div style="padding: 25px;">\
                    <h3 style="color: #fafafa; margin: 0 0 15px 0;">🎯 Mini-Projects</h3>\
                    <p style="color: #71717a; margin: 0 0 15px 0; font-size: 0.9rem;">Complete these hands-on projects to build real skills and portfolio pieces</p>\
                    <div style="display: flex; flex-direction: column; gap: 12px;">\
                        ' + projectsHtml + '\
                    </div>\
                </div>\
                \
                <div style="padding: 0 25px 25px 25px;">\
                    <div style="background: #27272a; border-radius: 8px; padding: 15px;">\
                        <h4 style="color: #f59e0b; margin: 0 0 10px 0;">💼 Portfolio Tips</h4>\
                        <ul style="color: #a1a1aa; margin: 0; padding-left: 20px; font-size: 0.85rem;">\
                            <li>Document your findings with screenshots</li>\
                            <li>Write up your methodology</li>\
                            <li>Save to GitHub or personal site</li>\
                            <li>Reference in interviews</li>\
                        </ul>\
                    </div>\
                </div>\
            </div>\
        ';
        
        document.body.appendChild(modal);
        
        // Add hover effects
        setTimeout(function() {
            var cards = modal.querySelectorAll('.lab-project-card');
            cards.forEach(function(card) {
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
    }
    
    // ===========================================
    // PROJECT VIEWER (Full Screen)
    // ===========================================
    
    function startProject(labId, projectIndex) {
        // Close modal first
        var modal = document.getElementById('tool-lab-modal');
        if (modal) modal.remove();
        
        // Load full lab data if available
        var labFileName = getLabFileName(labId);
        
        fetch('data/' + labFileName)
            .then(function(response) {
                if (!response.ok) throw new Error('Lab not found');
                return response.json();
            })
            .then(function(data) {
                renderFullProject(data, projectIndex);
            })
            .catch(function(err) {
                console.error('Error loading lab:', err);
                // Fallback - show basic project info
                showBasicProjectView(labId, projectIndex);
            });
    }
    
    function getLabFileName(labId) {
        var mapping = {
            'TOOL-LAB-001': 'TOOL-LAB-001_Wireshark.json',
            'TOOL-LAB-002': 'TOOL-LAB-002_Nmap.json',
            'TOOL-LAB-003': 'TOOL-LAB-003_Splunk.json',
            'TOOL-LAB-004': 'TOOL-LAB-004_Hashcat.json',
            'TOOL-LAB-005': 'TOOL-LAB-005_Burp_Suite.json'
        };
        return mapping[labId] || '';
    }
    
    function renderFullProject(labData, projectIndex) {
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        var labId = labData.lab_id || '';
        var toolName = escapeHtml(labData.tool_name || '');
        var project = labData.mini_projects[projectIndex];
        if (!project) return;
        
        var projectId = project.project_id || '';
        var isComplete = isProjectComplete(labId, projectId);
        
        // Learning objectives
        var objectives = project.learning_objectives || [];
        var objectivesHtml = objectives.map(function(obj) {
            return '<li>' + escapeHtml(obj) + '</li>';
        }).join('');
        
        // Tasks
        var tasks = project.tasks || [];
        var tasksHtml = tasks.map(function(task, idx) {
            var hints = task.hints || [];
            var hintsHtml = hints.map(function(h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('');
            
            return '\
                <div style="background: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 15px;">\
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">\
                        <span style="background: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">' + (idx + 1) + '</span>\
                        <h4 style="color: #fafafa; margin: 0;">' + escapeHtml(task.title || '') + '</h4>\
                    </div>\
                    <div style="background: #18181b; border-radius: 6px; padding: 15px; margin-bottom: 15px;">\
                        <pre style="color: #a1a1aa; margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;">' + escapeHtml(task.instructions || '') + '</pre>\
                    </div>\
                    ' + (hints.length > 0 ? '\
                    <details style="margin-bottom: 10px;">\
                        <summary style="color: #f59e0b; cursor: pointer; padding: 5px 0;">💡 Show Hints</summary>\
                        <ul style="color: #a1a1aa; margin: 10px 0 0 0; padding-left: 20px;">' + hintsHtml + '</ul>\
                    </details>' : '') + '\
                    <div style="background: #10b98120; border-left: 3px solid #10b981; padding: 10px 15px; border-radius: 0 6px 6px 0;">\
                        <strong style="color: #10b981;">Expected Result:</strong>\
                        <span style="color: #a1a1aa;"> ' + escapeHtml(task.expected_result || '') + '</span>\
                    </div>\
                </div>\
            ';
        }).join('');
        
        // Challenge questions
        var challenges = project.challenge_questions || [];
        var challengesHtml = challenges.map(function(c, idx) {
            return '\
                <div style="background: #27272a; border-radius: 6px; padding: 15px; margin-bottom: 10px;">\
                    <p style="color: #fafafa; margin: 0 0 10px 0;"><strong>Q' + (idx + 1) + ':</strong> ' + escapeHtml(c.question || '') + '</p>\
                    <details>\
                        <summary style="color: #6366f1; cursor: pointer;">Show Answer</summary>\
                        <p style="color: #10b981; margin: 10px 0 5px 0;">' + escapeHtml(c.answer || '') + '</p>\
                        <p style="color: #71717a; margin: 0; font-size: 0.9rem;">' + escapeHtml(c.explanation || '') + '</p>\
                    </details>\
                </div>\
            ';
        }).join('');
        
        // Takeaways
        var takeaways = project.takeaways || [];
        var takeawaysHtml = takeaways.map(function(t) {
            return '<li>' + escapeHtml(t) + '</li>';
        }).join('');
        
        content.innerHTML = '\
            <div class="container" style="max-width: 900px; margin: 0 auto; padding: 20px;">\
                <button onclick="showSecurityTools()" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to Tools</button>\
                \
                <div style="margin-bottom: 30px;">\
                    <span style="color: #71717a;">' + toolName + ' Lab • Project ' + (projectIndex + 1) + ' of 3</span>\
                    <h1 style="color: #fafafa; margin: 5px 0 15px 0; font-size: 1.8rem;">' + escapeHtml(project.title || '') + '</h1>\
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">\
                        <span style="background: ' + (project.difficulty === 'advanced' ? '#ef4444' : project.difficulty === 'intermediate' ? '#f59e0b' : '#10b981') + '; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase;">' + (project.difficulty || 'beginner') + '</span>\
                        <span style="background: #27272a; color: #a1a1aa; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem;">⏱️ ' + (project.estimated_time || '') + '</span>\
                        ' + (isComplete ? '<span style="background: #10b98120; color: #10b981; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem;">✓ Completed</span>' : '') + '\
                    </div>\
                    <div style="background: #1e1b4b; border: 1px solid #4f46e5; border-radius: 8px; padding: 15px;">\
                        <strong style="color: #a78bfa;">📋 Scenario:</strong>\
                        <p style="color: #a1a1aa; margin: 10px 0 0 0;">' + escapeHtml(project.scenario || '') + '</p>\
                    </div>\
                </div>\
                \
                <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">\
                    <h3 style="color: #fafafa; margin: 0 0 15px 0;">🎯 What You\'ll Learn</h3>\
                    <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">' + objectivesHtml + '</ul>\
                </div>\
                \
                <div style="background: #f59e0b20; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 30px;">\
                    <strong style="color: #f59e0b;">💼 Portfolio Tip:</strong>\
                    <span style="color: #a1a1aa;"> Document your process with screenshots. This makes a great portfolio piece showing hands-on security skills!</span>\
                </div>\
                \
                <h2 style="color: #fafafa; margin-bottom: 20px;">📝 Tasks</h2>\
                ' + tasksHtml + '\
                \
                ' + (challenges.length > 0 ? '\
                <div style="margin-top: 30px;">\
                    <h2 style="color: #fafafa; margin-bottom: 20px;">❓ Challenge Questions</h2>\
                    ' + challengesHtml + '\
                </div>' : '') + '\
                \
                ' + (takeaways.length > 0 ? '\
                <div style="background: #10b98120; border: 1px solid #10b981; border-radius: 12px; padding: 20px; margin-top: 30px;">\
                    <h3 style="color: #10b981; margin: 0 0 15px 0;">🎓 Key Takeaways</h3>\
                    <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">' + takeawaysHtml + '</ul>\
                </div>' : '') + '\
                \
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; flex-wrap: wrap; gap: 15px;">\
                    <div style="display: flex; gap: 10px;">\
                        ' + (projectIndex > 0 ? '<button onclick="ToolLabsIntegration.startProject(\'' + labId + '\', ' + (projectIndex - 1) + ')" style="background: #27272a; color: #fafafa; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">← Previous Project</button>' : '') + '\
                        ' + (projectIndex < 2 ? '<button onclick="ToolLabsIntegration.startProject(\'' + labId + '\', ' + (projectIndex + 1) + ')" style="background: #27272a; color: #fafafa; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Next Project →</button>' : '') + '\
                    </div>\
                    <button onclick="ToolLabsIntegration.toggleComplete(\'' + labId + '\', \'' + projectId + '\')" style="background: ' + (isComplete ? '#27272a' : '#10b981') + '; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 1rem;">\
                        ' + (isComplete ? '↻ Mark Incomplete' : '✓ Mark Complete') + '\
                    </button>\
                </div>\
            </div>\
        ';
    }
    
    function showBasicProjectView(labId, projectIndex) {
        // Fallback if JSON not available
        var toolName = labId.replace('TOOL-LAB-00', '').replace('1', 'Wireshark').replace('2', 'Nmap').replace('3', 'Splunk').replace('4', 'Hashcat').replace('5', 'Burp Suite');
        
        var content = document.getElementById('content');
        if (!content) return;
        
        content.innerHTML = '\
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">\
                <h1 style="color: #fafafa;">Lab Content Loading...</h1>\
                <p style="color: #a1a1aa;">Please ensure the lab JSON files are in the data/ folder.</p>\
                <button onclick="showSecurityTools()" style="background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-top: 20px;">Back to Tools</button>\
            </div>\
        ';
    }
    
    function toggleComplete(labId, projectId) {
        if (!progress[labId]) progress[labId] = { projects: {} };
        
        if (isProjectComplete(labId, projectId)) {
            delete progress[labId].projects[projectId];
        } else {
            progress[labId].projects[projectId] = { completed: true, date: new Date().toISOString() };
        }
        
        saveProgress();
        
        // Reload the project view
        var labFileName = getLabFileName(labId);
        fetch('data/' + labFileName)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                var projectIndex = data.mini_projects.findIndex(function(p) {
                    return p.project_id === projectId;
                });
                if (projectIndex >= 0) {
                    renderFullProject(data, projectIndex);
                }
            });
    }
    
    // ===========================================
    // OBSERVER TO AUTO-ENHANCE TOOLS PAGE
    // ===========================================
    
    function setupObserver() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    var content = document.getElementById('content');
                    if (content) {
                        var contentText = content.textContent.toLowerCase();
                        // Check if Tools page is loaded
                        if (contentText.includes('security tools') || 
                            contentText.includes('siem & log') ||
                            contentText.includes('endpoint detection') ||
                            contentText.includes('network security')) {
                            setTimeout(enhanceToolsPage, 100);
                        }
                    }
                }
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // ===========================================
    // INITIALIZE
    // ===========================================
    
    function init() {
        setupObserver();
        
        // Initial enhancement if tools page already loaded
        setTimeout(enhanceToolsPage, 500);
        
        console.log('✅ Tool Labs Integration loaded - Labs will appear on Security Tools page');
    }
    
    // Public API
    window.ToolLabsIntegration = {
        enhance: enhanceToolsPage,
        showLabModal: showToolLabModal,
        startProject: startProject,
        toggleComplete: toggleComplete
    };
    
    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
