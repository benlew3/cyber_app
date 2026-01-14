/**
 * Tool Labs System v2
 * Security+ Training Platform
 * 
 * Complete hands-on labs system for security tools
 * Call: showToolLabs() to display the labs hub
 */

(function() {
    'use strict';

    // ===========================================
    // TOOL LABS REGISTRY
    // ===========================================
    
    var toolLabs = [
        // Network Analysis
        { id: 'TOOL-LAB-001', name: 'Wireshark', category: 'Network Analysis', icon: '🦈', file: 'TOOL-LAB-001_Wireshark.json', difficulty: 'beginner', roles: ['SOC Analyst', 'Incident Responder'] },
        { id: 'TOOL-LAB-002', name: 'Nmap', category: 'Network Scanning', icon: '🗺️', file: 'TOOL-LAB-002_Nmap.json', difficulty: 'beginner', roles: ['Penetration Tester', 'Security Engineer'] },
        
        // SIEM & Logging
        { id: 'TOOL-LAB-003', name: 'Splunk', category: 'SIEM & Log Analysis', icon: '📊', file: 'TOOL-LAB-003_Splunk.json', difficulty: 'intermediate', roles: ['SOC Analyst', 'Security Engineer'] },
        { id: 'TOOL-LAB-010', name: 'Sysmon', category: 'Windows Logging', icon: '📝', file: 'TOOL-LAB-010_Sysmon.json', difficulty: 'intermediate', roles: ['SOC Analyst', 'Security Engineer'] },
        
        // Password & Crypto
        { id: 'TOOL-LAB-004', name: 'Hashcat', category: 'Password Cracking', icon: '🔓', file: 'TOOL-LAB-004_Hashcat.json', difficulty: 'intermediate', roles: ['Penetration Tester'] },
        
        // Web Security
        { id: 'TOOL-LAB-005', name: 'Burp Suite', category: 'Web Security', icon: '🕷️', file: 'TOOL-LAB-005_Burp_Suite.json', difficulty: 'intermediate', roles: ['Penetration Tester', 'Security Engineer'] },
        
        // Forensics
        { id: 'TOOL-LAB-006', name: 'Volatility', category: 'Memory Forensics', icon: '🧠', file: 'TOOL-LAB-006_Volatility.json', difficulty: 'intermediate', roles: ['Incident Responder', 'SOC Analyst'] },
        { id: 'TOOL-LAB-007', name: 'Autopsy', category: 'Disk Forensics', icon: '🔍', file: 'TOOL-LAB-007_Autopsy.json', difficulty: 'intermediate', roles: ['Incident Responder', 'GRC Analyst'] },
        
        // Detection & Hunting
        { id: 'TOOL-LAB-008', name: 'YARA', category: 'Malware Detection', icon: '🎯', file: 'TOOL-LAB-008_YARA.json', difficulty: 'intermediate', roles: ['SOC Analyst', 'Incident Responder'] },
        
        // Case Management
        { id: 'TOOL-LAB-009', name: 'TheHive', category: 'Case Management', icon: '🐝', file: 'TOOL-LAB-009_TheHive.json', difficulty: 'intermediate', roles: ['SOC Analyst', 'Incident Responder', 'GRC Analyst'] },
        
        // Vulnerability Management
        { id: 'TOOL-LAB-011', name: 'OpenVAS', category: 'Vulnerability Scanning', icon: '🛡️', file: 'TOOL-LAB-011_OpenVAS.json', difficulty: 'intermediate', roles: ['Security Engineer', 'GRC Analyst'] },
        
        // Threat Intel
        { id: 'TOOL-LAB-012', name: 'MISP', category: 'Threat Intelligence', icon: '🌐', file: 'TOOL-LAB-012_MISP.json', difficulty: 'advanced', roles: ['SOC Analyst', 'Incident Responder'] },
        
        // Detection Rules
        { id: 'TOOL-LAB-013', name: 'Sigma', category: 'Detection Rules', icon: '📋', file: 'TOOL-LAB-013_Sigma.json', difficulty: 'intermediate', roles: ['SOC Analyst', 'Security Engineer'] }
    ];

    var categories = [
        { name: 'All', icon: '📚' },
        { name: 'Network Analysis', icon: '🌐' },
        { name: 'SIEM & Log Analysis', icon: '📊' },
        { name: 'Forensics', icon: '🔍' },
        { name: 'Detection & Hunting', icon: '🎯' },
        { name: 'Vulnerability Management', icon: '🛡️' },
        { name: 'Web Security', icon: '🕷️' }
    ];

    var roleFilters = ['All', 'SOC Analyst', 'Incident Responder', 'Security Engineer', 'Penetration Tester', 'GRC Analyst'];

    // Progress tracking
    var labProgress = {};
    
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
        } catch (e) {
            console.warn('Could not save progress');
        }
    }

    function getCompletedCount(labId) {
        if (!labProgress[labId] || !labProgress[labId].projects) return 0;
        return Object.keys(labProgress[labId].projects).filter(function(p) {
            return labProgress[labId].projects[p].completed;
        }).length;
    }

    function isProjectComplete(labId, projectId) {
        return labProgress[labId] && 
               labProgress[labId].projects && 
               labProgress[labId].projects[projectId] && 
               labProgress[labId].projects[projectId].completed;
    }

    function escapeHtml(str) {
        if (!str) return '';
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ===========================================
    // MAIN TOOL LABS HUB
    // ===========================================
    
    function showToolLabs(filterCategory, filterRole) {
        loadProgress();
        filterCategory = filterCategory || 'All';
        filterRole = filterRole || 'All';
        
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Filter labs
        var filteredLabs = toolLabs.filter(function(lab) {
            var catMatch = filterCategory === 'All' || lab.category.indexOf(filterCategory) !== -1 || 
                          (filterCategory === 'Forensics' && (lab.category.indexOf('Forensic') !== -1)) ||
                          (filterCategory === 'Detection & Hunting' && (lab.category.indexOf('Detection') !== -1 || lab.category.indexOf('Malware') !== -1));
            var roleMatch = filterRole === 'All' || lab.roles.indexOf(filterRole) !== -1;
            return catMatch && roleMatch;
        });

        // Calculate stats
        var totalProjects = toolLabs.length * 3;
        var completedProjects = 0;
        toolLabs.forEach(function(lab) {
            completedProjects += getCompletedCount(lab.id);
        });

        // Category pills
        var categoryPills = categories.map(function(cat) {
            var isActive = filterCategory === cat.name;
            return '<button onclick="showToolLabs(\'' + cat.name + '\', \'' + filterRole + '\')" style="' +
                'background: ' + (isActive ? '#6366f1' : '#27272a') + '; ' +
                'color: ' + (isActive ? 'white' : '#a1a1aa') + '; ' +
                'border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; ' +
                'font-size: 0.85rem; white-space: nowrap;">' + cat.icon + ' ' + escapeHtml(cat.name) + '</button>';
        }).join('');

        // Role pills
        var rolePills = roleFilters.map(function(role) {
            var isActive = filterRole === role;
            return '<button onclick="showToolLabs(\'' + filterCategory + '\', \'' + role + '\')" style="' +
                'background: ' + (isActive ? '#10b981' : '#27272a') + '; ' +
                'color: ' + (isActive ? 'white' : '#a1a1aa') + '; ' +
                'border: none; padding: 6px 12px; border-radius: 15px; cursor: pointer; ' +
                'font-size: 0.8rem; white-space: nowrap;">' + escapeHtml(role) + '</button>';
        }).join('');

        // Lab cards
        var labCards = filteredLabs.map(function(lab) {
            var completed = getCompletedCount(lab.id);
            var diffColor = lab.difficulty === 'advanced' ? '#ef4444' : lab.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';
            
            return '\
                <div class="lab-card" onclick="showLabDetail(\'' + lab.id + '\')" style="' +
                    'background: #18181b; border: 1px solid #27272a; border-radius: 12px; ' +
                    'padding: 20px; cursor: pointer; transition: all 0.2s;">\
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">\
                        <span style="font-size: 2rem;">' + lab.icon + '</span>\
                        <div style="text-align: right;">\
                            <span style="background: ' + diffColor + '; color: white; padding: 2px 8px; ' +
                                'border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">' + lab.difficulty + '</span>\
                            ' + (completed > 0 ? '<div style="color: #10b981; font-size: 0.8rem; margin-top: 5px;">✓ ' + completed + '/3</div>' : '') + '\
                        </div>\
                    </div>\
                    <h3 style="color: #fafafa; margin: 0 0 5px 0; font-size: 1.1rem;">' + escapeHtml(lab.name) + '</h3>\
                    <p style="color: #71717a; margin: 0 0 12px 0; font-size: 0.85rem;">' + escapeHtml(lab.category) + '</p>\
                    <div style="display: flex; flex-wrap: wrap; gap: 5px;">' +
                        lab.roles.map(function(role) {
                            return '<span style="background: #27272a; color: #a1a1aa; padding: 3px 8px; ' +
                                'border-radius: 4px; font-size: 0.7rem;">' + escapeHtml(role) + '</span>';
                        }).join('') +
                    '</div>\
                </div>';
        }).join('');

        content.innerHTML = '\
            <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">\
                <!-- Header -->\
                <div style="margin-bottom: 30px;">\
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">\
                        <div>\
                            <h1 style="color: #fafafa; margin: 0; font-size: 1.8rem;">🔬 Tool Labs</h1>\
                            <p style="color: #a1a1aa; margin: 5px 0 0 0;">Hands-on projects to build real security skills</p>\
                        </div>\
                        <div style="background: #27272a; padding: 15px 20px; border-radius: 8px; text-align: center;">\
                            <div style="color: #fafafa; font-size: 1.5rem; font-weight: bold;">' + completedProjects + '/' + totalProjects + '</div>\
                            <div style="color: #71717a; font-size: 0.8rem;">Projects Completed</div>\
                        </div>\
                    </div>\
                </div>\
                \
                <!-- Category Filter -->\
                <div style="margin-bottom: 15px;">\
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; padding-bottom: 10px; overflow-x: auto;">' + categoryPills + '</div>\
                </div>\
                \
                <!-- Role Filter -->\
                <div style="margin-bottom: 25px;">\
                    <div style="color: #71717a; font-size: 0.8rem; margin-bottom: 8px;">Filter by Career Path:</div>\
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">' + rolePills + '</div>\
                </div>\
                \
                <!-- Labs Grid -->\
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">\
                    ' + labCards + '\
                </div>\
                \
                ' + (filteredLabs.length === 0 ? '<div style="text-align: center; padding: 40px; color: #71717a;">No labs match your filters. Try adjusting the category or role.</div>' : '') + '\
                \
                <!-- Info Box -->\
                <div style="background: #1e1b4b; border: 1px solid #4f46e5; border-radius: 12px; padding: 20px; margin-top: 30px;">\
                    <h3 style="color: #a78bfa; margin: 0 0 10px 0;">💼 Build Your Portfolio</h3>\
                    <p style="color: #a1a1aa; margin: 0;">Each lab includes 3 mini-projects designed to produce portfolio-worthy artifacts. Document your work, save screenshots, and add these to your resume to demonstrate hands-on skills to employers.</p>\
                </div>\
            </div>\
        ';

        // Add hover effects
        setTimeout(function() {
            var cards = document.querySelectorAll('.lab-card');
            cards.forEach(function(card) {
                card.addEventListener('mouseenter', function() {
                    this.style.borderColor = '#6366f1';
                    this.style.transform = 'translateY(-3px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.borderColor = '#27272a';
                    this.style.transform = 'translateY(0)';
                });
            });
        }, 50);
    }

    // ===========================================
    // LAB DETAIL VIEW
    // ===========================================
    
    function showLabDetail(labId) {
        loadProgress();
        
        var lab = toolLabs.find(function(l) { return l.id === labId; });
        if (!lab) return;

        // Try to load full lab data
        fetch('data/' + lab.file)
            .then(function(response) {
                if (!response.ok) throw new Error('Not found');
                return response.json();
            })
            .then(function(data) {
                renderLabDetail(lab, data);
            })
            .catch(function(err) {
                console.error('Error loading lab:', err);
                renderLabDetailFallback(lab);
            });
    }

    function renderLabDetail(lab, data) {
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        var completedCount = getCompletedCount(lab.id);
        
        // Projects HTML
        var projectsHtml = '';
        if (data.mini_projects && data.mini_projects.length > 0) {
            projectsHtml = data.mini_projects.map(function(project, idx) {
                var isComplete = isProjectComplete(lab.id, project.project_id);
                var diffColor = project.difficulty === 'advanced' ? '#ef4444' : project.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';
                
                return '\
                    <div class="project-card" onclick="showProject(\'' + lab.id + '\', ' + idx + ')" style="' +
                        'background: #27272a; border: 1px solid #3f3f46; border-radius: 10px; ' +
                        'padding: 20px; cursor: pointer; transition: all 0.2s;">\
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">\
                            <span style="background: ' + diffColor + '; color: white; padding: 3px 10px; ' +
                                'border-radius: 4px; font-size: 0.75rem; text-transform: uppercase;">' + escapeHtml(project.difficulty) + '</span>\
                            ' + (isComplete ? '<span style="color: #10b981;">✓ Completed</span>' : '<span style="color: #71717a;">Not started</span>') + '\
                        </div>\
                        <h4 style="color: #fafafa; margin: 0 0 8px 0;">' + escapeHtml(project.title) + '</h4>\
                        <p style="color: #a1a1aa; margin: 0 0 10px 0; font-size: 0.9rem;">' + escapeHtml(project.description || '').substring(0, 100) + '...</p>\
                        <div style="color: #71717a; font-size: 0.85rem;">⏱️ ' + escapeHtml(project.estimated_time) + '</div>\
                    </div>';
            }).join('');
        }

        // Core concepts HTML
        var conceptsHtml = '';
        if (data.core_concepts && data.core_concepts.length > 0) {
            conceptsHtml = data.core_concepts.map(function(concept) {
                return '\
                    <div style="background: #27272a; border-radius: 8px; padding: 15px; margin-bottom: 10px;">\
                        <h4 style="color: #fafafa; margin: 0 0 8px 0;">' + escapeHtml(concept.title) + '</h4>\
                        <p style="color: #a1a1aa; margin: 0 0 8px 0; font-size: 0.9rem;">' + escapeHtml(concept.explanation) + '</p>\
                        <div style="background: #1e1b4b; border-left: 3px solid #6366f1; padding: 8px 12px; border-radius: 0 6px 6px 0;">\
                            <span style="color: #a78bfa; font-size: 0.85rem;">💡 Exam Tip: </span>\
                            <span style="color: #a1a1aa; font-size: 0.85rem;">' + escapeHtml(concept.exam_tip) + '</span>\
                        </div>\
                    </div>';
            }).join('');
        }

        // Career relevance
        var careerHtml = '';
        if (data.career_relevance) {
            var careers = Object.keys(data.career_relevance);
            careerHtml = careers.map(function(career) {
                var info = data.career_relevance[career];
                var relevanceColor = info.relevance === 'critical' ? '#10b981' : info.relevance === 'high' ? '#6366f1' : info.relevance === 'medium' ? '#f59e0b' : '#71717a';
                var careerName = career.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); });
                return '\
                    <div style="background: #27272a; border-radius: 6px; padding: 12px; margin-bottom: 8px;">\
                        <div style="display: flex; justify-content: space-between; align-items: center;">\
                            <span style="color: #fafafa; font-size: 0.9rem;">' + escapeHtml(careerName) + '</span>\
                            <span style="color: ' + relevanceColor + '; font-size: 0.8rem; text-transform: uppercase;">' + escapeHtml(info.relevance) + '</span>\
                        </div>\
                        <div style="color: #71717a; font-size: 0.8rem; margin-top: 5px;">' + escapeHtml(info.percentage_of_job) + ' of daily work</div>\
                    </div>';
            }).join('');
        }

        content.innerHTML = '\
            <div style="max-width: 1000px; margin: 0 auto; padding: 20px;">\
                <button onclick="showToolLabs()" style="background: #27272a; color: #fafafa; border: none; ' +
                    'padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; ' +
                    'display: inline-flex; align-items: center; gap: 8px;">← Back to Tool Labs</button>\
                \
                <!-- Header -->\
                <div style="display: flex; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;">\
                    <div style="font-size: 4rem;">' + lab.icon + '</div>\
                    <div style="flex: 1; min-width: 250px;">\
                        <h1 style="color: #fafafa; margin: 0 0 5px 0;">' + escapeHtml(data.tool_name || lab.name) + '</h1>\
                        <p style="color: #a1a1aa; margin: 0 0 10px 0;">' + escapeHtml(data.overview ? data.overview.tagline : lab.category) + '</p>\
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">\
                            <span style="background: #6366f1; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem;">' + escapeHtml(lab.category) + '</span>\
                            <span style="background: #27272a; color: #a1a1aa; padding: 4px 12px; border-radius: 4px; font-size: 0.8rem;">Progress: ' + completedCount + '/3</span>\
                        </div>\
                    </div>\
                </div>\
                \
                <!-- Overview -->\
                ' + (data.overview ? '<div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 25px;">\
                    <p style="color: #a1a1aa; margin: 0 0 15px 0;">' + escapeHtml(data.overview.description) + '</p>\
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">\
                        <a href="' + escapeHtml(data.overview.official_site || '#') + '" target="_blank" style="color: #6366f1; text-decoration: none;">🌐 Official Site →</a>\
                        <a href="' + escapeHtml(data.overview.download_url || '#') + '" target="_blank" style="color: #10b981; text-decoration: none;">⬇️ Download →</a>\
                    </div>\
                </div>' : '') + '\
                \
                <div style="display: grid; grid-template-columns: 1fr 300px; gap: 25px;">\
                    <div>\
                        <!-- Mini Projects -->\
                        <h2 style="color: #fafafa; margin: 0 0 15px 0;">🎯 Mini-Projects</h2>\
                        <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">\
                            ' + projectsHtml + '\
                        </div>\
                        \
                        <!-- Core Concepts -->\
                        ' + (conceptsHtml ? '<h2 style="color: #fafafa; margin: 0 0 15px 0;">📚 Core Concepts</h2>' + conceptsHtml : '') + '\
                    </div>\
                    \
                    <div>\
                        <!-- Career Relevance -->\
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">\
                            <h3 style="color: #fafafa; margin: 0 0 15px 0;">💼 Career Relevance</h3>\
                            ' + careerHtml + '\
                        </div>\
                        \
                        <!-- Quick Actions -->\
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px;">\
                            <h3 style="color: #fafafa; margin: 0 0 15px 0;">⚡ Quick Actions</h3>\
                            <button onclick="showProject(\'' + lab.id + '\', 0)" style="' +
                                'background: #10b981; color: white; border: none; padding: 12px; ' +
                                'border-radius: 8px; width: 100%; cursor: pointer; font-size: 0.95rem; margin-bottom: 10px;">Start First Project</button>\
                            <button onclick="showCheatSheet(\'' + lab.id + '\')" style="' +
                                'background: #27272a; color: #fafafa; border: none; padding: 12px; ' +
                                'border-radius: 8px; width: 100%; cursor: pointer; font-size: 0.95rem; margin-bottom: 10px;">📋 View Cheat Sheet</button>\
                            <button onclick="showKnowledgeCheck(\'' + lab.id + '\')" style="' +
                                'background: #27272a; color: #fafafa; border: none; padding: 12px; ' +
                                'border-radius: 8px; width: 100%; cursor: pointer; font-size: 0.95rem;">❓ Knowledge Check</button>\
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
                    this.style.transform = 'translateX(5px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.borderColor = '#3f3f46';
                    this.style.transform = 'translateX(0)';
                });
            });
        }, 50);
    }

    function renderLabDetailFallback(lab) {
        var content = document.getElementById('content');
        if (!content) return;
        
        content.innerHTML = '\
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">\
                <div style="font-size: 4rem; margin-bottom: 20px;">' + lab.icon + '</div>\
                <h1 style="color: #fafafa;">' + escapeHtml(lab.name) + ' Lab</h1>\
                <p style="color: #a1a1aa; margin-bottom: 30px;">Lab content is being loaded. Please ensure the JSON file is in the data/ folder.</p>\
                <p style="color: #71717a; margin-bottom: 30px;">Expected file: data/' + escapeHtml(lab.file) + '</p>\
                <button onclick="showToolLabs()" style="background: #6366f1; color: white; border: none; ' +
                    'padding: 12px 24px; border-radius: 8px; cursor: pointer;">Back to Tool Labs</button>\
            </div>\
        ';
    }

    // ===========================================
    // PROJECT VIEW
    // ===========================================
    
    function showProject(labId, projectIndex) {
        loadProgress();
        
        var lab = toolLabs.find(function(l) { return l.id === labId; });
        if (!lab) return;

        fetch('data/' + lab.file)
            .then(function(response) {
                if (!response.ok) throw new Error('Not found');
                return response.json();
            })
            .then(function(data) {
                renderProject(lab, data, projectIndex);
            })
            .catch(function(err) {
                console.error('Error loading project:', err);
                showLabDetail(labId);
            });
    }

    function renderProject(lab, data, projectIndex) {
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        var project = data.mini_projects[projectIndex];
        if (!project) return;
        
        var projectId = project.project_id;
        var isComplete = isProjectComplete(lab.id, projectId);
        var diffColor = project.difficulty === 'advanced' ? '#ef4444' : project.difficulty === 'intermediate' ? '#f59e0b' : '#10b981';

        // Build tasks HTML
        var tasksHtml = '';
        if (project.tasks && project.tasks.length > 0) {
            tasksHtml = project.tasks.map(function(task, idx) {
                var hintsHtml = '';
                if (task.hints && task.hints.length > 0) {
                    hintsHtml = '<details style="margin: 10px 0;"><summary style="color: #f59e0b; cursor: pointer;">💡 Show Hints</summary>' +
                        '<ul style="color: #a1a1aa; margin: 10px 0 0 0; padding-left: 20px;">' +
                        task.hints.map(function(h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('') +
                        '</ul></details>';
                }
                
                return '\
                    <div style="background: #27272a; border-radius: 10px; padding: 20px; margin-bottom: 15px;">\
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">\
                            <span style="background: #6366f1; color: white; width: 30px; height: 30px; ' +
                                'border-radius: 50%; display: flex; align-items: center; justify-content: center; ' +
                                'font-weight: bold; flex-shrink: 0;">' + (idx + 1) + '</span>\
                            <h4 style="color: #fafafa; margin: 0;">' + escapeHtml(task.title) + '</h4>\
                        </div>\
                        <div style="background: #18181b; border-radius: 8px; padding: 15px; margin-bottom: 15px;">\
                            <pre style="color: #a1a1aa; margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 0.9rem;">' + escapeHtml(task.instructions) + '</pre>\
                        </div>\
                        ' + hintsHtml + '\
                        <div style="background: #10b98120; border-left: 3px solid #10b981; padding: 10px 15px; border-radius: 0 8px 8px 0;">\
                            <strong style="color: #10b981;">Expected Result:</strong>\
                            <span style="color: #a1a1aa;"> ' + escapeHtml(task.expected_result) + '</span>\
                        </div>\
                    </div>';
            }).join('');
        }

        // Challenge questions HTML
        var challengesHtml = '';
        if (project.challenge_questions && project.challenge_questions.length > 0) {
            challengesHtml = project.challenge_questions.map(function(q, idx) {
                return '\
                    <div style="background: #27272a; border-radius: 8px; padding: 15px; margin-bottom: 10px;">\
                        <p style="color: #fafafa; margin: 0 0 10px 0;"><strong>Q' + (idx + 1) + ':</strong> ' + escapeHtml(q.question) + '</p>\
                        <details>\
                            <summary style="color: #6366f1; cursor: pointer;">Show Answer</summary>\
                            <p style="color: #10b981; margin: 10px 0 5px 0;">' + escapeHtml(q.answer) + '</p>\
                            <p style="color: #71717a; margin: 0; font-size: 0.9rem;">' + escapeHtml(q.explanation) + '</p>\
                        </details>\
                    </div>';
            }).join('');
        }

        // Takeaways HTML
        var takeawaysHtml = '';
        if (project.takeaways && project.takeaways.length > 0) {
            takeawaysHtml = '<ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">' +
                project.takeaways.map(function(t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') +
                '</ul>';
        }

        content.innerHTML = '\
            <div style="max-width: 900px; margin: 0 auto; padding: 20px;">\
                <button onclick="showLabDetail(\'' + lab.id + '\')" style="background: #27272a; color: #fafafa; ' +
                    'border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px;">← Back to ' + escapeHtml(lab.name) + '</button>\
                \
                <div style="margin-bottom: 30px;">\
                    <span style="color: #71717a;">' + escapeHtml(lab.name) + ' Lab • Project ' + (projectIndex + 1) + ' of 3</span>\
                    <h1 style="color: #fafafa; margin: 5px 0 15px 0;">' + escapeHtml(project.title) + '</h1>\
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">\
                        <span style="background: ' + diffColor + '; color: white; padding: 5px 12px; ' +
                            'border-radius: 4px; font-size: 0.8rem; text-transform: uppercase;">' + escapeHtml(project.difficulty) + '</span>\
                        <span style="background: #27272a; color: #a1a1aa; padding: 5px 12px; ' +
                            'border-radius: 4px; font-size: 0.8rem;">⏱️ ' + escapeHtml(project.estimated_time) + '</span>\
                        ' + (isComplete ? '<span style="background: #10b98120; color: #10b981; padding: 5px 12px; border-radius: 4px; font-size: 0.8rem;">✓ Completed</span>' : '') + '\
                    </div>\
                    <div style="background: #1e1b4b; border: 1px solid #4f46e5; border-radius: 10px; padding: 15px;">\
                        <strong style="color: #a78bfa;">📋 Scenario:</strong>\
                        <p style="color: #a1a1aa; margin: 10px 0 0 0;">' + escapeHtml(project.scenario) + '</p>\
                    </div>\
                </div>\
                \
                <!-- Learning Objectives -->\
                <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 25px;">\
                    <h3 style="color: #fafafa; margin: 0 0 15px 0;">🎯 What You\'ll Learn</h3>\
                    <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">' +
                        (project.learning_objectives || []).map(function(obj) { return '<li>' + escapeHtml(obj) + '</li>'; }).join('') +
                    '</ul>\
                </div>\
                \
                <!-- Portfolio Tip -->\
                <div style="background: #f59e0b20; border: 1px solid #f59e0b; border-radius: 10px; padding: 15px; margin-bottom: 25px;">\
                    <strong style="color: #f59e0b;">💼 Portfolio Tip:</strong>\
                    <span style="color: #a1a1aa;"> Document your process with screenshots and notes. This makes a great portfolio piece!</span>\
                </div>\
                \
                <!-- Tasks -->\
                <h2 style="color: #fafafa; margin: 0 0 20px 0;">📝 Tasks</h2>\
                ' + tasksHtml + '\
                \
                ' + (challengesHtml ? '\
                <div style="margin-top: 30px;">\
                    <h2 style="color: #fafafa; margin: 0 0 15px 0;">❓ Challenge Questions</h2>\
                    ' + challengesHtml + '\
                </div>' : '') + '\
                \
                ' + (takeawaysHtml ? '\
                <div style="background: #10b98120; border: 1px solid #10b981; border-radius: 12px; padding: 20px; margin-top: 30px;">\
                    <h3 style="color: #10b981; margin: 0 0 15px 0;">🎓 Key Takeaways</h3>\
                    ' + takeawaysHtml + '\
                </div>' : '') + '\
                \
                <!-- Navigation -->\
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; ' +
                    'padding-top: 20px; border-top: 1px solid #27272a; flex-wrap: wrap; gap: 15px;">\
                    <div style="display: flex; gap: 10px;">\
                        ' + (projectIndex > 0 ? '<button onclick="showProject(\'' + lab.id + '\', ' + (projectIndex - 1) + ')" style="background: #27272a; color: #fafafa; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">← Previous</button>' : '') + '\
                        ' + (projectIndex < 2 ? '<button onclick="showProject(\'' + lab.id + '\', ' + (projectIndex + 1) + ')" style="background: #27272a; color: #fafafa; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Next →</button>' : '') + '\
                    </div>\
                    <button onclick="toggleProjectComplete(\'' + lab.id + '\', \'' + projectId + '\', ' + projectIndex + ')" style="' +
                        'background: ' + (isComplete ? '#27272a' : '#10b981') + '; color: white; border: none; ' +
                        'padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1rem;">' +
                        (isComplete ? '↻ Mark Incomplete' : '✓ Mark Complete') + '</button>\
                </div>\
            </div>\
        ';
    }

    function toggleProjectComplete(labId, projectId, projectIndex) {
        if (!labProgress[labId]) {
            labProgress[labId] = { projects: {} };
        }
        if (!labProgress[labId].projects) {
            labProgress[labId].projects = {};
        }

        if (isProjectComplete(labId, projectId)) {
            delete labProgress[labId].projects[projectId];
        } else {
            labProgress[labId].projects[projectId] = {
                completed: true,
                date: new Date().toISOString()
            };
        }

        saveProgress();
        
        // Reload project view
        var lab = toolLabs.find(function(l) { return l.id === labId; });
        if (lab) {
            fetch('data/' + lab.file)
                .then(function(response) { return response.json(); })
                .then(function(data) {
                    renderProject(lab, data, projectIndex);
                });
        }
    }

    // ===========================================
    // CHEAT SHEET VIEW
    // ===========================================
    
    function showCheatSheet(labId) {
        var lab = toolLabs.find(function(l) { return l.id === labId; });
        if (!lab) return;

        fetch('data/' + lab.file)
            .then(function(response) {
                if (!response.ok) throw new Error('Not found');
                return response.json();
            })
            .then(function(data) {
                renderCheatSheet(lab, data);
            })
            .catch(function(err) {
                console.error('Error loading cheat sheet:', err);
                showLabDetail(labId);
            });
    }

    function renderCheatSheet(lab, data) {
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        var sectionsHtml = '';
        if (data.cheat_sheet && data.cheat_sheet.sections) {
            sectionsHtml = data.cheat_sheet.sections.map(function(section) {
                var rowsHtml = section.commands.map(function(cmd) {
                    return '<tr><td style="padding: 10px; border-bottom: 1px solid #27272a; font-family: monospace; color: #10b981;">' + 
                        escapeHtml(cmd.command) + '</td><td style="padding: 10px; border-bottom: 1px solid #27272a; color: #a1a1aa;">' + 
                        escapeHtml(cmd.description) + '</td></tr>';
                }).join('');
                
                return '\
                    <div style="margin-bottom: 25px;">\
                        <h3 style="color: #fafafa; margin: 0 0 15px 0;">' + escapeHtml(section.title) + '</h3>\
                        <table style="width: 100%; border-collapse: collapse; background: #18181b; border-radius: 8px; overflow: hidden;">\
                            <thead><tr style="background: #27272a;">\
                                <th style="padding: 12px; text-align: left; color: #fafafa;">Command</th>\
                                <th style="padding: 12px; text-align: left; color: #fafafa;">Description</th>\
                            </tr></thead>\
                            <tbody>' + rowsHtml + '</tbody>\
                        </table>\
                    </div>';
            }).join('');
        }

        content.innerHTML = '\
            <div style="max-width: 900px; margin: 0 auto; padding: 20px;">\
                <button onclick="showLabDetail(\'' + lab.id + '\')" style="background: #27272a; color: #fafafa; ' +
                    'border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px;">← Back to ' + escapeHtml(lab.name) + '</button>\
                \
                <h1 style="color: #fafafa; margin: 0 0 10px 0;">' + lab.icon + ' ' + escapeHtml(lab.name) + ' Cheat Sheet</h1>\
                <p style="color: #a1a1aa; margin: 0 0 30px 0;">Quick reference for common commands and syntax</p>\
                \
                ' + sectionsHtml + '\
                \
                ' + (!sectionsHtml ? '<p style="color: #71717a; text-align: center;">Cheat sheet not available for this lab yet.</p>' : '') + '\
            </div>\
        ';
    }

    // ===========================================
    // KNOWLEDGE CHECK VIEW
    // ===========================================
    
    function showKnowledgeCheck(labId) {
        var lab = toolLabs.find(function(l) { return l.id === labId; });
        if (!lab) return;

        fetch('data/' + lab.file)
            .then(function(response) {
                if (!response.ok) throw new Error('Not found');
                return response.json();
            })
            .then(function(data) {
                renderKnowledgeCheck(lab, data);
            })
            .catch(function(err) {
                console.error('Error loading knowledge check:', err);
                showLabDetail(labId);
            });
    }

    function renderKnowledgeCheck(lab, data) {
        var content = document.getElementById('content');
        if (!content) return;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        var questionsHtml = '';
        if (data.knowledge_check && data.knowledge_check.length > 0) {
            questionsHtml = data.knowledge_check.map(function(q, idx) {
                var optionsHtml = q.options.map(function(opt, optIdx) {
                    return '<label style="display: block; padding: 12px; margin-bottom: 8px; background: #27272a; ' +
                        'border-radius: 6px; cursor: pointer; transition: all 0.2s;" ' +
                        'onmouseenter="this.style.background=\'#3f3f46\'" onmouseleave="this.style.background=\'#27272a\'">' +
                        '<input type="radio" name="q' + idx + '" value="' + optIdx + '" style="margin-right: 10px;">' +
                        '<span style="color: #fafafa;">' + escapeHtml(opt) + '</span></label>';
                }).join('');
                
                return '\
                    <div class="quiz-question" data-correct="' + q.correct + '" data-explanation="' + escapeHtml(q.explanation) + '" ' +
                        'style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">\
                        <p style="color: #fafafa; margin: 0 0 15px 0; font-weight: 500;">Q' + (idx + 1) + ': ' + escapeHtml(q.question) + '</p>\
                        ' + optionsHtml + '\
                        <div class="feedback" style="display: none; margin-top: 15px; padding: 12px; border-radius: 6px;"></div>\
                    </div>';
            }).join('');
        }

        content.innerHTML = '\
            <div style="max-width: 800px; margin: 0 auto; padding: 20px;">\
                <button onclick="showLabDetail(\'' + lab.id + '\')" style="background: #27272a; color: #fafafa; ' +
                    'border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px;">← Back to ' + escapeHtml(lab.name) + '</button>\
                \
                <h1 style="color: #fafafa; margin: 0 0 10px 0;">❓ ' + escapeHtml(lab.name) + ' Knowledge Check</h1>\
                <p style="color: #a1a1aa; margin: 0 0 30px 0;">Test your understanding of key concepts</p>\
                \
                <div id="quiz-container">\
                    ' + questionsHtml + '\
                </div>\
                \
                ' + (!questionsHtml ? '<p style="color: #71717a; text-align: center;">Knowledge check not available for this lab yet.</p>' : 
                '<button onclick="checkQuizAnswers()" style="background: #6366f1; color: white; border: none; ' +
                    'padding: 14px 28px; border-radius: 8px; cursor: pointer; font-size: 1rem; width: 100%;">Check Answers</button>') + '\
                \
                <div id="quiz-results" style="display: none; margin-top: 20px; padding: 20px; background: #18181b; border-radius: 12px; text-align: center;"></div>\
            </div>\
        ';
    }

    function checkQuizAnswers() {
        var questions = document.querySelectorAll('.quiz-question');
        var correct = 0;
        var total = questions.length;

        questions.forEach(function(q) {
            var correctAnswer = parseInt(q.getAttribute('data-correct'));
            var explanation = q.getAttribute('data-explanation');
            var selected = q.querySelector('input:checked');
            var feedback = q.querySelector('.feedback');
            
            if (selected) {
                var selectedValue = parseInt(selected.value);
                if (selectedValue === correctAnswer) {
                    correct++;
                    feedback.style.background = '#10b98120';
                    feedback.style.borderLeft = '3px solid #10b981';
                    feedback.innerHTML = '<span style="color: #10b981;">✓ Correct!</span> <span style="color: #a1a1aa;">' + explanation + '</span>';
                } else {
                    feedback.style.background = '#ef444420';
                    feedback.style.borderLeft = '3px solid #ef4444';
                    feedback.innerHTML = '<span style="color: #ef4444;">✗ Incorrect.</span> <span style="color: #a1a1aa;">' + explanation + '</span>';
                }
            } else {
                feedback.style.background = '#f59e0b20';
                feedback.style.borderLeft = '3px solid #f59e0b';
                feedback.innerHTML = '<span style="color: #f59e0b;">No answer selected.</span> <span style="color: #a1a1aa;">' + explanation + '</span>';
            }
            feedback.style.display = 'block';
        });

        var resultsDiv = document.getElementById('quiz-results');
        var percentage = Math.round((correct / total) * 100);
        var color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
        
        resultsDiv.innerHTML = '\
            <div style="font-size: 2.5rem; font-weight: bold; color: ' + color + ';">' + percentage + '%</div>\
            <div style="color: #a1a1aa; margin-top: 5px;">' + correct + ' of ' + total + ' correct</div>\
            <div style="color: #fafafa; margin-top: 15px;">' + 
                (percentage >= 80 ? '🎉 Great job!' : percentage >= 60 ? '📚 Review the concepts and try again.' : '💪 Keep studying!') + '</div>';
        resultsDiv.style.display = 'block';
    }

    // ===========================================
    // GLOBAL EXPORTS
    // ===========================================
    
    // Expose functions globally
    window.showToolLabs = showToolLabs;
    window.showLabDetail = showLabDetail;
    window.showProject = showProject;
    window.toggleProjectComplete = toggleProjectComplete;
    window.showCheatSheet = showCheatSheet;
    window.showKnowledgeCheck = showKnowledgeCheck;
    window.checkQuizAnswers = checkQuizAnswers;

    console.log('✅ Tool Labs System loaded. Call showToolLabs() to display.');

})();
