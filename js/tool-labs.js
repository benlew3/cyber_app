/**
 * Tool Labs Viewer Module
 * Security+ Training Platform v34
 * 
 * Displays interactive tool labs with mini-projects for hands-on practice.
 */

(function() {
    'use strict';
    
    // Cache for loaded lab data
    var labsData = {};
    var labsList = [
        { id: 'TOOL-LAB-001', name: 'Wireshark', category: 'Network Analysis', icon: '🦈' },
        { id: 'TOOL-LAB-002', name: 'Nmap', category: 'Vulnerability Scanning', icon: '🗺️' },
        { id: 'TOOL-LAB-003', name: 'Splunk', category: 'SIEM / Log Analysis', icon: '📊' },
        { id: 'TOOL-LAB-004', name: 'Hashcat', category: 'Password / Cryptography', icon: '🔓' },
        { id: 'TOOL-LAB-005', name: 'Burp Suite', category: 'Web Security', icon: '🕷️' }
    ];
    
    // Progress tracking
    var progress = loadProgress();
    
    /**
     * Load progress from localStorage
     */
    function loadProgress() {
        try {
            return JSON.parse(localStorage.getItem('toolLabsProgress') || '{}');
        } catch (e) {
            return {};
        }
    }
    
    /**
     * Save progress to localStorage
     */
    function saveProgress() {
        try {
            localStorage.setItem('toolLabsProgress', JSON.stringify(progress));
        } catch (e) {
            console.warn('Could not save progress');
        }
    }
    
    /**
     * Mark project as complete
     */
    function completeProject(labId, projectId) {
        if (!progress[labId]) progress[labId] = { projects: {} };
        progress[labId].projects[projectId] = { completed: true, date: new Date().toISOString() };
        saveProgress();
    }
    
    /**
     * Check if project is complete
     */
    function isProjectComplete(labId, projectId) {
        return progress[labId] && 
               progress[labId].projects && 
               progress[labId].projects[projectId] && 
               progress[labId].projects[projectId].completed;
    }
    
    /**
     * Load lab data
     */
    function loadLabData(labId) {
        return new Promise(function(resolve) {
            if (labsData[labId]) {
                resolve(labsData[labId]);
                return;
            }
            
            var labInfo = labsList.find(function(l) { return l.id === labId; });
            if (!labInfo) {
                resolve(null);
                return;
            }
            
            var filename = labId + '_' + labInfo.name.replace(/ /g, '_') + '.json';
            var paths = [
                'data/' + filename,
                './data/' + filename
            ];
            
            var tryPath = function(index) {
                if (index >= paths.length) {
                    console.error('Could not load lab:', labId);
                    resolve(null);
                    return;
                }
                
                fetch(paths[index])
                    .then(function(response) {
                        if (response.ok) return response.json();
                        throw new Error('Not found');
                    })
                    .then(function(data) {
                        labsData[labId] = data;
                        resolve(data);
                    })
                    .catch(function() {
                        tryPath(index + 1);
                    });
            };
            
            tryPath(0);
        });
    }
    
    /**
     * Escape HTML
     */
    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Get safe property
     */
    function safeGet(obj, path, defaultValue) {
        if (defaultValue === undefined) defaultValue = '';
        if (!obj) return defaultValue;
        var parts = path.split('.');
        var current = obj;
        for (var i = 0; i < parts.length; i++) {
            if (current === null || current === undefined) return defaultValue;
            current = current[parts[i]];
        }
        return (current !== null && current !== undefined) ? current : defaultValue;
    }
    
    /**
     * Show Tool Labs Hub
     */
    function showToolLabs() {
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        var labCardsHtml = labsList.map(function(lab) {
            var completedCount = 0;
            if (progress[lab.id] && progress[lab.id].projects) {
                completedCount = Object.keys(progress[lab.id].projects).filter(function(p) {
                    return progress[lab.id].projects[p].completed;
                }).length;
            }
            
            return '\
                <div class="tool-lab-card" onclick="ToolLabs.showLab(\'' + lab.id + '\')" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; cursor: pointer; transition: all 0.2s;">\
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">\
                        <span style="font-size: 2.5rem;">' + lab.icon + '</span>\
                        <div>\
                            <h3 style="color: #fafafa; margin: 0;">' + escapeHtml(lab.name) + '</h3>\
                            <span style="color: #71717a; font-size: 0.85rem;">' + escapeHtml(lab.category) + '</span>\
                        </div>\
                    </div>\
                    <div style="display: flex; justify-content: space-between; align-items: center;">\
                        <span style="color: #a1a1aa; font-size: 0.9rem;">3 Mini-Projects</span>\
                        ' + (completedCount > 0 ? '<span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">' + completedCount + '/3 Done</span>' : '') + '\
                    </div>\
                </div>\
            ';
        }).join('');
        
        content.innerHTML = '\
            <div class="container">\
                <button class="back-btn" onclick="showSecurityTools()" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to Tools</button>\
                \
                <div style="margin-bottom: 30px;">\
                    <h1 style="color: #fafafa; margin: 0 0 10px 0;">🔬 Tool Labs</h1>\
                    <p style="color: #a1a1aa; margin: 0;">Hands-on mini-projects to master essential security tools</p>\
                </div>\
                \
                <div style="background: linear-gradient(135deg, #1e1b4b, #18181b); border: 1px solid #4f46e5; border-radius: 12px; padding: 20px; margin-bottom: 30px;">\
                    <h3 style="color: #a78bfa; margin: 0 0 10px 0;">📚 How Tool Labs Work</h3>\
                    <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">\
                        <li><strong style="color: #fafafa;">Learn</strong> - Each lab introduces a tool with core concepts</li>\
                        <li><strong style="color: #fafafa;">Practice</strong> - Complete 3 mini-projects (Beginner → Advanced)</li>\
                        <li><strong style="color: #fafafa;">Reference</strong> - Use cheat sheets and external resources</li>\
                        <li><strong style="color: #fafafa;">Verify</strong> - Test your knowledge with quizzes</li>\
                    </ul>\
                </div>\
                \
                <h2 style="color: #fafafa; margin-bottom: 20px;">Available Labs</h2>\
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">\
                    ' + labCardsHtml + '\
                </div>\
                \
                <div style="background: #27272a; border-radius: 12px; padding: 20px; margin-top: 30px;">\
                    <h3 style="color: #f59e0b; margin: 0 0 10px 0;">💡 Tips for Success</h3>\
                    <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">\
                        <li>Set up a lab environment (VMs, Kali Linux) before starting</li>\
                        <li>Follow along with external resources (TryHackMe, HackTheBox)</li>\
                        <li>Only practice on systems you own or have permission to test</li>\
                        <li>Document your findings - this builds real-world skills</li>\
                    </ul>\
                </div>\
            </div>\
        ';
        
        // Add hover effects
        setTimeout(function() {
            var cards = document.querySelectorAll('.tool-lab-card');
            cards.forEach(function(card) {
                card.addEventListener('mouseenter', function() {
                    this.style.borderColor = '#6366f1';
                    this.style.transform = 'translateY(-2px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.borderColor = '#27272a';
                    this.style.transform = 'translateY(0)';
                });
            });
        }, 100);
    }
    
    /**
     * Show individual lab
     */
    function showLab(labId) {
        var content = document.getElementById('content');
        if (!content) return;
        
        content.innerHTML = '<div class="container"><p style="color: #a1a1aa;">Loading lab...</p></div>';
        
        loadLabData(labId).then(function(data) {
            if (!data) {
                content.innerHTML = '<div class="container"><p style="color: #ef4444;">Error loading lab</p><button onclick="ToolLabs.showToolLabs()" style="background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 15px;">Back to Labs</button></div>';
                return;
            }
            
            renderLab(data, content);
        });
    }
    
    /**
     * Render lab page
     */
    function renderLab(data, content) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        var labId = safeGet(data, 'lab_id', '');
        var toolName = escapeHtml(safeGet(data, 'tool_name', 'Tool'));
        var tagline = escapeHtml(safeGet(data, 'overview.tagline', ''));
        var description = escapeHtml(safeGet(data, 'overview.description', ''));
        var license = escapeHtml(safeGet(data, 'overview.license', ''));
        var downloadUrl = safeGet(data, 'overview.download_url', '');
        
        // Career relevance
        var careers = safeGet(data, 'career_relevance', {});
        var careerHtml = Object.keys(careers).map(function(career) {
            var info = careers[career];
            var relevance = safeGet(info, 'relevance', 'medium');
            var color = relevance === 'critical' ? '#ef4444' : relevance === 'high' ? '#f59e0b' : '#10b981';
            return '\
                <div style="background: #27272a; padding: 10px 15px; border-radius: 6px;">\
                    <div style="display: flex; justify-content: space-between; align-items: center;">\
                        <span style="color: #fafafa; text-transform: capitalize;">' + career.replace(/_/g, ' ') + '</span>\
                        <span style="background: ' + color + '20; color: ' + color + '; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">' + relevance + '</span>\
                    </div>\
                </div>\
            ';
        }).join('');
        
        // Mini projects
        var projects = safeGet(data, 'mini_projects', []);
        var projectsHtml = projects.map(function(project, idx) {
            var projectId = safeGet(project, 'project_id', 'project-' + idx);
            var isComplete = isProjectComplete(labId, projectId);
            var difficulty = safeGet(project, 'difficulty', 'beginner');
            var diffColor = difficulty === 'advanced' ? '#ef4444' : difficulty === 'intermediate' ? '#f59e0b' : '#10b981';
            
            return '\
                <div class="project-card" onclick="ToolLabs.showProject(\'' + labId + '\', ' + idx + ')" style="background: #27272a; border: 1px solid #3f3f46; border-radius: 8px; padding: 20px; cursor: pointer; transition: all 0.2s;">\
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">\
                        <span style="background: ' + diffColor + '; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">' + difficulty + '</span>\
                        ' + (isComplete ? '<span style="color: #10b981;">✓ Complete</span>' : '') + '\
                    </div>\
                    <h4 style="color: #fafafa; margin: 0 0 8px 0;">' + escapeHtml(safeGet(project, 'title', '')) + '</h4>\
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin: 0;">' + escapeHtml(safeGet(project, 'description', '')) + '</p>\
                    <div style="margin-top: 12px; color: #71717a; font-size: 0.85rem;">⏱️ ' + escapeHtml(safeGet(project, 'estimated_time', '')) + '</div>\
                </div>\
            ';
        }).join('');
        
        // External resources
        var resources = safeGet(data, 'external_resources', []);
        var resourcesHtml = resources.slice(0, 4).map(function(resource) {
            return '\
                <a href="' + safeGet(resource, 'url', '#') + '" target="_blank" style="display: block; background: #27272a; border-radius: 6px; padding: 15px; text-decoration: none; transition: all 0.2s;">\
                    <div style="display: flex; justify-content: space-between; align-items: center;">\
                        <span style="color: #fafafa;">' + escapeHtml(safeGet(resource, 'name', '')) + '</span>\
                        <span style="color: #71717a; font-size: 0.8rem;">' + escapeHtml(safeGet(resource, 'platform', '')) + '</span>\
                    </div>\
                    <p style="color: #a1a1aa; font-size: 0.85rem; margin: 8px 0 0 0;">' + escapeHtml(safeGet(resource, 'description', '')) + '</p>\
                </a>\
            ';
        }).join('');
        
        content.innerHTML = '\
            <div class="container">\
                <button class="back-btn" onclick="ToolLabs.showToolLabs()" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to Tool Labs</button>\
                \
                <div style="margin-bottom: 30px;">\
                    <h1 style="color: #fafafa; margin: 0 0 5px 0;">' + toolName + '</h1>\
                    <p style="color: #6366f1; font-size: 1.1rem; margin: 0 0 15px 0;">' + tagline + '</p>\
                    <p style="color: #a1a1aa; margin: 0;">' + description + '</p>\
                    <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">\
                        <span style="background: #27272a; color: #a1a1aa; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem;">📄 ' + license + '</span>\
                        <a href="' + downloadUrl + '" target="_blank" style="background: #6366f1; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem; text-decoration: none;">⬇️ Download</a>\
                    </div>\
                </div>\
                \
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 30px;">\
                    <div>\
                        <h2 style="color: #fafafa; margin: 0 0 15px 0;">🎯 Mini-Projects</h2>\
                        <div style="display: flex; flex-direction: column; gap: 15px;">\
                            ' + projectsHtml + '\
                        </div>\
                        \
                        <div style="margin-top: 30px;">\
                            <h2 style="color: #fafafa; margin: 0 0 15px 0;">📚 External Resources</h2>\
                            <div style="display: flex; flex-direction: column; gap: 10px;">\
                                ' + resourcesHtml + '\
                            </div>\
                        </div>\
                    </div>\
                    \
                    <div>\
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">\
                            <h3 style="color: #fafafa; margin: 0 0 15px 0;">Career Relevance</h3>\
                            <div style="display: flex; flex-direction: column; gap: 8px;">\
                                ' + careerHtml + '\
                            </div>\
                        </div>\
                        \
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">\
                            <h3 style="color: #fafafa; margin: 0 0 15px 0;">Quick Actions</h3>\
                            <div style="display: flex; flex-direction: column; gap: 10px;">\
                                <button onclick="ToolLabs.showCheatSheet(\'' + labId + '\')" style="background: #27272a; color: #fafafa; border: 1px solid #3f3f46; padding: 10px; border-radius: 6px; cursor: pointer; text-align: left;">📋 Cheat Sheet</button>\
                                <button onclick="ToolLabs.showKnowledgeCheck(\'' + labId + '\')" style="background: #27272a; color: #fafafa; border: 1px solid #3f3f46; padding: 10px; border-radius: 6px; cursor: pointer; text-align: left;">✅ Knowledge Check</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        ';
        
        // Add hover effects
        setTimeout(function() {
            var cards = document.querySelectorAll('.project-card');
            cards.forEach(function(card) {
                card.addEventListener('mouseenter', function() {
                    this.style.borderColor = '#6366f1';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.borderColor = '#3f3f46';
                });
            });
        }, 100);
    }
    
    /**
     * Show project details
     */
    function showProject(labId, projectIndex) {
        var content = document.getElementById('content');
        if (!content) return;
        
        loadLabData(labId).then(function(data) {
            if (!data) return;
            
            var projects = safeGet(data, 'mini_projects', []);
            var project = projects[projectIndex];
            if (!project) return;
            
            renderProject(data, project, content, projectIndex);
        });
    }
    
    /**
     * Render project page
     */
    function renderProject(labData, project, content, projectIndex) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        var labId = safeGet(labData, 'lab_id', '');
        var toolName = escapeHtml(safeGet(labData, 'tool_name', ''));
        var projectId = safeGet(project, 'project_id', '');
        var projectTitle = escapeHtml(safeGet(project, 'title', ''));
        var scenario = escapeHtml(safeGet(project, 'scenario', ''));
        var isComplete = isProjectComplete(labId, projectId);
        
        // Learning objectives
        var objectives = safeGet(project, 'learning_objectives', []);
        var objectivesHtml = objectives.map(function(obj) {
            return '<li>' + escapeHtml(obj) + '</li>';
        }).join('');
        
        // Tasks
        var tasks = safeGet(project, 'tasks', []);
        var tasksHtml = tasks.map(function(task, idx) {
            var hints = safeGet(task, 'hints', []);
            var hintsHtml = hints.map(function(h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('');
            
            return '\
                <div style="background: #27272a; border-radius: 8px; padding: 20px; margin-bottom: 15px;">\
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">\
                        <span style="background: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">' + (idx + 1) + '</span>\
                        <h4 style="color: #fafafa; margin: 0;">' + escapeHtml(safeGet(task, 'title', '')) + '</h4>\
                    </div>\
                    <div style="background: #18181b; border-radius: 6px; padding: 15px; margin-bottom: 15px;">\
                        <pre style="color: #a1a1aa; margin: 0; white-space: pre-wrap; font-family: monospace;">' + escapeHtml(safeGet(task, 'instructions', '')) + '</pre>\
                    </div>\
                    ' + (hints.length > 0 ? '\
                    <details style="margin-bottom: 10px;">\
                        <summary style="color: #f59e0b; cursor: pointer;">💡 Hints</summary>\
                        <ul style="color: #a1a1aa; margin: 10px 0 0 0; padding-left: 20px;">' + hintsHtml + '</ul>\
                    </details>' : '') + '\
                    <div style="background: #10b98120; border-left: 3px solid #10b981; padding: 10px 15px; border-radius: 0 6px 6px 0;">\
                        <strong style="color: #10b981;">Expected Result:</strong>\
                        <span style="color: #a1a1aa;"> ' + escapeHtml(safeGet(task, 'expected_result', '')) + '</span>\
                    </div>\
                </div>\
            ';
        }).join('');
        
        // Challenge questions
        var challenges = safeGet(project, 'challenge_questions', []);
        var challengesHtml = challenges.map(function(c, idx) {
            return '\
                <div style="background: #27272a; border-radius: 6px; padding: 15px; margin-bottom: 10px;">\
                    <p style="color: #fafafa; margin: 0 0 10px 0;"><strong>Q' + (idx + 1) + ':</strong> ' + escapeHtml(safeGet(c, 'question', '')) + '</p>\
                    <details>\
                        <summary style="color: #6366f1; cursor: pointer;">Show Answer</summary>\
                        <p style="color: #10b981; margin: 10px 0 5px 0;">' + escapeHtml(safeGet(c, 'answer', '')) + '</p>\
                        <p style="color: #71717a; margin: 0; font-size: 0.9rem;">' + escapeHtml(safeGet(c, 'explanation', '')) + '</p>\
                    </details>\
                </div>\
            ';
        }).join('');
        
        // Takeaways
        var takeaways = safeGet(project, 'takeaways', []);
        var takeawaysHtml = takeaways.map(function(t) {
            return '<li>' + escapeHtml(t) + '</li>';
        }).join('');
        
        content.innerHTML = '\
            <div class="container">\
                <button class="back-btn" onclick="ToolLabs.showLab(\'' + labId + '\')" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to ' + toolName + '</button>\
                \
                <div style="margin-bottom: 30px;">\
                    <span style="color: #71717a;">' + toolName + ' Lab</span>\
                    <h1 style="color: #fafafa; margin: 5px 0 15px 0;">' + projectTitle + '</h1>\
                    <div style="background: #1e1b4b; border: 1px solid #4f46e5; border-radius: 8px; padding: 15px;">\
                        <strong style="color: #a78bfa;">📋 Scenario:</strong>\
                        <p style="color: #a1a1aa; margin: 10px 0 0 0;">' + scenario + '</p>\
                    </div>\
                </div>\
                \
                <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">\
                    <h3 style="color: #fafafa; margin: 0 0 15px 0;">🎯 Learning Objectives</h3>\
                    <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">' + objectivesHtml + '</ul>\
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a;">\
                    <div>\
                        ' + (isComplete ? '<span style="color: #10b981;">✅ You completed this project</span>' : '') + '\
                    </div>\
                    <button onclick="ToolLabs.markComplete(\'' + labId + '\', \'' + projectId + '\')" style="background: ' + (isComplete ? '#27272a' : '#10b981') + '; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 1rem;">\
                        ' + (isComplete ? '↻ Mark Incomplete' : '✓ Mark Complete') + '\
                    </button>\
                </div>\
            </div>\
        ';
    }
    
    /**
     * Toggle project completion
     */
    function markComplete(labId, projectId) {
        if (!progress[labId]) progress[labId] = { projects: {} };
        
        if (isProjectComplete(labId, projectId)) {
            delete progress[labId].projects[projectId];
        } else {
            progress[labId].projects[projectId] = { completed: true, date: new Date().toISOString() };
        }
        
        saveProgress();
        
        // Reload current page
        loadLabData(labId).then(function(data) {
            if (data) {
                var projects = safeGet(data, 'mini_projects', []);
                var projectIndex = projects.findIndex(function(p) {
                    return safeGet(p, 'project_id', '') === projectId;
                });
                if (projectIndex >= 0) {
                    showProject(labId, projectIndex);
                }
            }
        });
    }
    
    /**
     * Show cheat sheet
     */
    function showCheatSheet(labId) {
        var content = document.getElementById('content');
        if (!content) return;
        
        loadLabData(labId).then(function(data) {
            if (!data) return;
            
            var toolName = escapeHtml(safeGet(data, 'tool_name', ''));
            var cheatSheet = safeGet(data, 'cheat_sheet', {});
            var sections = safeGet(cheatSheet, 'sections', []);
            
            var sectionsHtml = sections.map(function(section) {
                var commands = safeGet(section, 'commands', []);
                var commandsHtml = commands.map(function(cmd) {
                    return '\
                        <tr>\
                            <td style="padding: 8px 12px; border-bottom: 1px solid #3f3f46;"><code style="background: #18181b; padding: 2px 6px; border-radius: 4px; color: #10b981;">' + escapeHtml(safeGet(cmd, 'command', '')) + '</code></td>\
                            <td style="padding: 8px 12px; border-bottom: 1px solid #3f3f46; color: #a1a1aa;">' + escapeHtml(safeGet(cmd, 'description', '')) + '</td>\
                        </tr>\
                    ';
                }).join('');
                
                return '\
                    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">\
                        <h3 style="color: #6366f1; margin: 0 0 15px 0;">' + escapeHtml(safeGet(section, 'title', '')) + '</h3>\
                        <table style="width: 100%; border-collapse: collapse;">\
                            <thead>\
                                <tr>\
                                    <th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #3f3f46; color: #fafafa;">Command</th>\
                                    <th style="text-align: left; padding: 8px 12px; border-bottom: 2px solid #3f3f46; color: #fafafa;">Description</th>\
                                </tr>\
                            </thead>\
                            <tbody>' + commandsHtml + '</tbody>\
                        </table>\
                    </div>\
                ';
            }).join('');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            content.innerHTML = '\
                <div class="container">\
                    <button class="back-btn" onclick="ToolLabs.showLab(\'' + labId + '\')" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to ' + toolName + '</button>\
                    \
                    <h1 style="color: #fafafa; margin: 0 0 10px 0;">📋 ' + toolName + ' Cheat Sheet</h1>\
                    <p style="color: #a1a1aa; margin: 0 0 30px 0;">Quick reference for common commands and operations</p>\
                    \
                    ' + sectionsHtml + '\
                </div>\
            ';
        });
    }
    
    /**
     * Show knowledge check quiz
     */
    function showKnowledgeCheck(labId) {
        var content = document.getElementById('content');
        if (!content) return;
        
        loadLabData(labId).then(function(data) {
            if (!data) return;
            
            var toolName = escapeHtml(safeGet(data, 'tool_name', ''));
            var questions = safeGet(data, 'knowledge_check', []);
            
            var questionsHtml = questions.map(function(q, idx) {
                var options = safeGet(q, 'options', []);
                var correct = safeGet(q, 'correct', 0);
                
                var optionsHtml = options.map(function(opt, optIdx) {
                    return '\
                        <label style="display: block; background: #27272a; padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;" class="quiz-option" data-question="' + idx + '" data-option="' + optIdx + '" data-correct="' + correct + '">\
                            <input type="radio" name="q' + idx + '" value="' + optIdx + '" style="margin-right: 10px;">\
                            <span style="color: #a1a1aa;">' + escapeHtml(opt) + '</span>\
                        </label>\
                    ';
                }).join('');
                
                return '\
                    <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;" class="quiz-question" data-index="' + idx + '">\
                        <h4 style="color: #fafafa; margin: 0 0 15px 0;">Question ' + (idx + 1) + '</h4>\
                        <p style="color: #a1a1aa; margin: 0 0 15px 0;">' + escapeHtml(safeGet(q, 'question', '')) + '</p>\
                        <div class="options">' + optionsHtml + '</div>\
                        <div class="feedback" style="display: none; margin-top: 15px; padding: 15px; border-radius: 6px;"></div>\
                    </div>\
                ';
            }).join('');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            content.innerHTML = '\
                <div class="container">\
                    <button class="back-btn" onclick="ToolLabs.showLab(\'' + labId + '\')" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to ' + toolName + '</button>\
                    \
                    <h1 style="color: #fafafa; margin: 0 0 10px 0;">✅ ' + toolName + ' Knowledge Check</h1>\
                    <p style="color: #a1a1aa; margin: 0 0 30px 0;">Test your understanding of key concepts</p>\
                    \
                    ' + questionsHtml + '\
                    \
                    <button onclick="ToolLabs.checkAnswers(\'' + labId + '\')" style="background: #6366f1; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-size: 1rem;">Check Answers</button>\
                    \
                    <div id="quiz-results" style="display: none; margin-top: 30px; padding: 20px; background: #18181b; border: 1px solid #27272a; border-radius: 12px;"></div>\
                </div>\
            ';
        });
    }
    
    /**
     * Check quiz answers
     */
    function checkAnswers(labId) {
        loadLabData(labId).then(function(data) {
            if (!data) return;
            
            var questions = safeGet(data, 'knowledge_check', []);
            var correct = 0;
            var total = questions.length;
            
            questions.forEach(function(q, idx) {
                var selected = document.querySelector('input[name="q' + idx + '"]:checked');
                var questionDiv = document.querySelector('.quiz-question[data-index="' + idx + '"]');
                var feedback = questionDiv.querySelector('.feedback');
                var correctAnswer = safeGet(q, 'correct', 0);
                
                if (selected) {
                    var selectedValue = parseInt(selected.value);
                    var isCorrect = selectedValue === correctAnswer;
                    
                    if (isCorrect) {
                        correct++;
                        feedback.style.background = '#10b98120';
                        feedback.style.borderLeft = '3px solid #10b981';
                        feedback.innerHTML = '<span style="color: #10b981;">✓ Correct!</span><p style="color: #a1a1aa; margin: 10px 0 0 0;">' + escapeHtml(safeGet(q, 'explanation', '')) + '</p>';
                    } else {
                        feedback.style.background = '#ef444420';
                        feedback.style.borderLeft = '3px solid #ef4444';
                        feedback.innerHTML = '<span style="color: #ef4444;">✗ Incorrect</span><p style="color: #a1a1aa; margin: 10px 0 0 0;">' + escapeHtml(safeGet(q, 'explanation', '')) + '</p>';
                    }
                } else {
                    feedback.style.background = '#f59e0b20';
                    feedback.style.borderLeft = '3px solid #f59e0b';
                    feedback.innerHTML = '<span style="color: #f59e0b;">⚠ Not answered</span>';
                }
                
                feedback.style.display = 'block';
            });
            
            var percentage = Math.round((correct / total) * 100);
            var resultsDiv = document.getElementById('quiz-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '\
                <h3 style="color: #fafafa; margin: 0 0 10px 0;">Results</h3>\
                <p style="color: #a1a1aa; margin: 0;">You got <strong style="color: ' + (percentage >= 80 ? '#10b981' : '#f59e0b') + ';">' + correct + '/' + total + ' (' + percentage + '%)</strong> correct.</p>\
                ' + (percentage >= 80 ? '<p style="color: #10b981; margin-top: 10px;">🎉 Great job! You have a solid understanding of this tool.</p>' : '<p style="color: #f59e0b; margin-top: 10px;">📚 Review the concepts and try again!</p>') + '\
            ';
            
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Public API
    window.ToolLabs = {
        showToolLabs: showToolLabs,
        showLab: showLab,
        showProject: showProject,
        showCheatSheet: showCheatSheet,
        showKnowledgeCheck: showKnowledgeCheck,
        markComplete: markComplete,
        checkAnswers: checkAnswers
    };
    
    console.log('✅ Tool Labs module loaded');
    
})();
