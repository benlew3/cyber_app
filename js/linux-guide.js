/**
 * Linux Guide Viewer Module
 * Security+ Training Platform
 * 
 * Displays the comprehensive Linux guide for Debian and AlmaLinux
 */

(function() {
    'use strict';
    
    // Cache for loaded guide data
    let guideData = null;
    let currentChapter = 0;
    let currentSection = 0;
    
    // Distribution toggle state
    let activeDistro = 'both'; // 'debian', 'almalinux', or 'both'
    
    /**
     * Load the Linux guide JSON
     */
    async function loadGuideData() {
        if (guideData) return guideData;
        
        try {
            const response = await fetch('data/LINUX-GUIDE-001_Linux_Security_Fundamentals.json');
            if (!response.ok) throw new Error('Failed to load Linux guide');
            guideData = await response.json();
            return guideData;
        } catch (error) {
            console.error('Error loading Linux guide:', error);
            return null;
        }
    }
    
    /**
     * Escape HTML for safe display
     */
    function escapeHtml(str) {
        if (!str) return '';
        if (typeof window.escapeHtml === 'function') {
            return window.escapeHtml(str);
        }
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Format code blocks
     */
    function formatCode(code, language = 'bash') {
        return `<pre class="code-block"><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    }
    
    /**
     * Format inline code
     */
    function inlineCode(code) {
        return `<code class="inline-code">${escapeHtml(code)}</code>`;
    }
    
    /**
     * Show the main Linux Setup page
     */
    async function showLinuxGuide() {
        console.log('🐧 Loading Linux Guide...');
        
        const content = document.getElementById('content');
        if (!content) return;
        
        const data = await loadGuideData();
        if (!data) {
            content.innerHTML = `
                <div class="container">
                    <div class="error-message">
                        <h2>⚠️ Error Loading Linux Guide</h2>
                        <p>Could not load the Linux guide data. Please try again.</p>
                        <button class="btn btn-primary" onclick="showLinuxGuide()">Retry</button>
                    </div>
                </div>
            `;
            return;
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        content.innerHTML = `
            <div class="container linux-guide">
                <button class="back-btn" onclick="showDashboard()">← Back to Dashboard</button>
                
                <div class="linux-header">
                    <div class="linux-title">
                        <span class="linux-icon">🐧</span>
                        <div>
                            <h1>${escapeHtml(data.title)}</h1>
                            <p class="linux-subtitle">${escapeHtml(data.description)}</p>
                        </div>
                    </div>
                    
                    <div class="distro-toggle">
                        <button class="distro-btn ${activeDistro === 'both' ? 'active' : ''}" 
                                onclick="LinuxGuide.setDistro('both')">
                            Both
                        </button>
                        <button class="distro-btn debian ${activeDistro === 'debian' ? 'active' : ''}" 
                                onclick="LinuxGuide.setDistro('debian')">
                            🔴 Debian
                        </button>
                        <button class="distro-btn almalinux ${activeDistro === 'almalinux' ? 'active' : ''}" 
                                onclick="LinuxGuide.setDistro('almalinux')">
                            🔵 AlmaLinux
                        </button>
                    </div>
                </div>
                
                <!-- Introduction -->
                <div class="guide-intro">
                    <p>${escapeHtml(data.introduction.overview)}</p>
                    
                    <div class="distro-comparison">
                        <div class="distro-card debian">
                            <h3>🔴 Debian Family</h3>
                            <p>${escapeHtml(data.introduction.why_two_distros.debian_family.description)}</p>
                            <p><strong>Includes:</strong> ${data.introduction.why_two_distros.debian_family.includes.join(', ')}</p>
                            <p><strong>Package Manager:</strong> ${inlineCode(data.introduction.why_two_distros.debian_family.package_manager)}</p>
                        </div>
                        <div class="distro-card almalinux">
                            <h3>🔵 RHEL Family</h3>
                            <p>${escapeHtml(data.introduction.why_two_distros.rhel_family.description)}</p>
                            <p><strong>Includes:</strong> ${data.introduction.why_two_distros.rhel_family.includes.join(', ')}</p>
                            <p><strong>Package Manager:</strong> ${inlineCode(data.introduction.why_two_distros.rhel_family.package_manager)}</p>
                        </div>
                    </div>
                    
                    <div class="exam-relevance">
                        <h4>📚 Security+ Exam Relevance</h4>
                        <ul>
                            ${data.introduction.security_plus_relevance.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <!-- Chapter Navigation -->
                <div class="chapter-nav">
                    <h2>📖 Guide Chapters</h2>
                    <div class="chapter-grid">
                        ${data.chapters.map((chapter, idx) => `
                            <div class="chapter-card" onclick="LinuxGuide.showChapter(${idx})">
                                <span class="chapter-number">${chapter.chapter_id}</span>
                                <h3>${escapeHtml(chapter.title)}</h3>
                                <p class="chapter-sections">${chapter.sections.length} sections</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Quick Reference -->
                <div class="quick-ref-section">
                    <h2>⚡ Quick Reference</h2>
                    <button class="btn btn-outline" onclick="LinuxGuide.showQuickReference()">
                        View Command Quick Reference
                    </button>
                </div>
                
                <!-- Exam Tips -->
                <div class="exam-tips-section">
                    <h2>📝 Exam Tips</h2>
                    <ul class="exam-tips-list">
                        ${data.exam_tips.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        if (window.APP) {
            window.APP.state.currentView = 'linux-setup';
        }
    }
    
    /**
     * Show a specific chapter
     */
    async function showChapter(chapterIndex) {
        const data = await loadGuideData();
        if (!data || !data.chapters[chapterIndex]) return;
        
        currentChapter = chapterIndex;
        const chapter = data.chapters[chapterIndex];
        
        const content = document.getElementById('content');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        content.innerHTML = `
            <div class="container linux-guide">
                <button class="back-btn" onclick="showLinuxGuide()">← Back to Linux Guide</button>
                
                <div class="chapter-header">
                    <span class="chapter-badge">Chapter ${chapter.chapter_id}</span>
                    <h1>${escapeHtml(chapter.title)}</h1>
                    
                    <div class="distro-toggle">
                        <button class="distro-btn ${activeDistro === 'both' ? 'active' : ''}" 
                                onclick="LinuxGuide.setDistro('both'); LinuxGuide.showChapter(${chapterIndex})">
                            Both
                        </button>
                        <button class="distro-btn debian ${activeDistro === 'debian' ? 'active' : ''}" 
                                onclick="LinuxGuide.setDistro('debian'); LinuxGuide.showChapter(${chapterIndex})">
                            🔴 Debian
                        </button>
                        <button class="distro-btn almalinux ${activeDistro === 'almalinux' ? 'active' : ''}" 
                                onclick="LinuxGuide.setDistro('almalinux'); LinuxGuide.showChapter(${chapterIndex})">
                            🔵 AlmaLinux
                        </button>
                    </div>
                </div>
                
                <!-- Section Navigation -->
                <div class="section-nav">
                    ${chapter.sections.map((section, idx) => `
                        <button class="section-nav-btn ${idx === 0 ? 'active' : ''}" 
                                onclick="LinuxGuide.scrollToSection('${section.section_id}')">
                            ${section.section_id} ${escapeHtml(section.title)}
                        </button>
                    `).join('')}
                </div>
                
                <!-- Sections -->
                <div class="chapter-content">
                    ${chapter.sections.map(section => renderSection(section)).join('')}
                </div>
                
                <!-- Chapter Navigation -->
                <div class="chapter-footer-nav">
                    ${chapterIndex > 0 ? `
                        <button class="btn btn-outline" onclick="LinuxGuide.showChapter(${chapterIndex - 1})">
                            ← Previous: ${escapeHtml(data.chapters[chapterIndex - 1].title)}
                        </button>
                    ` : '<div></div>'}
                    
                    ${chapterIndex < data.chapters.length - 1 ? `
                        <button class="btn btn-primary" onclick="LinuxGuide.showChapter(${chapterIndex + 1})">
                            Next: ${escapeHtml(data.chapters[chapterIndex + 1].title)} →
                        </button>
                    ` : `
                        <button class="btn btn-success" onclick="showLinuxGuide()">
                            ✓ Complete Guide
                        </button>
                    `}
                </div>
            </div>
        `;
    }
    
    /**
     * Render a section
     */
    function renderSection(section) {
        let html = `
            <div class="guide-section" id="section-${section.section_id}">
                <h2 class="section-title">
                    <span class="section-id">${section.section_id}</span>
                    ${escapeHtml(section.title)}
                </h2>
                
                <p class="section-intro">${escapeHtml(section.content)}</p>
        `;
        
        // Render commands if present
        if (section.commands) {
            html += renderCommands(section.commands);
        }
        
        // Render navigation commands
        if (section.navigation_commands) {
            html += `<h3>Navigation Commands</h3>`;
            html += renderCommands(section.navigation_commands);
        }
        
        // Render filesystem hierarchy
        if (section.filesystem_hierarchy) {
            html += renderFilesystemHierarchy(section.filesystem_hierarchy);
        }
        
        // Render environment options
        if (section.environment_options) {
            html += renderEnvironmentOptions(section.environment_options);
        }
        
        // Render installation steps
        if (section.installation_steps) {
            html += renderInstallationSteps(section.installation_steps, section);
        }
        
        // Render post-install commands
        if (section.post_install_commands) {
            html += `<h3>Post-Installation Commands</h3>`;
            html += renderPostInstallCommands(section.post_install_commands);
        }
        
        // Render download info
        if (section.download) {
            html += renderDownloadInfo(section.download);
        }
        
        // Render key files
        if (section.key_files) {
            html += renderKeyFiles(section.key_files);
        }
        
        // Render special permissions
        if (section.special_permissions) {
            html += renderSpecialPermissions(section.special_permissions);
        }
        
        // Render permission model
        if (section.permission_model) {
            html += renderPermissionModel(section.permission_model);
        }
        
        // Render numeric permissions
        if (section.numeric_permissions) {
            html += renderNumericPermissions(section.numeric_permissions);
        }
        
        // Render permission commands
        if (section.permission_commands) {
            html += `<h3>Permission Commands</h3>`;
            html += renderCommands(section.permission_commands);
        }
        
        // Render dangerous permissions
        if (section.dangerous_permissions) {
            html += renderDangerousPermissions(section.dangerous_permissions);
        }
        
        // Render user commands
        if (section.user_commands) {
            html += `<h3>User Management Commands</h3>`;
            html += renderCommands(section.user_commands);
        }
        
        // Render group commands
        if (section.group_commands) {
            html += `<h3>Group Management Commands</h3>`;
            html += renderCommands(section.group_commands);
        }
        
        // Render sudo configuration
        if (section.sudoers_file) {
            html += renderSudoersConfig(section.sudoers_file);
        }
        
        // Render systemctl commands
        if (section.systemctl_commands) {
            html += `<h3>systemctl Commands</h3>`;
            html += renderCommands(section.systemctl_commands);
        }
        
        // Render journalctl commands
        if (section.journalctl_commands) {
            html += `<h3>journalctl Commands</h3>`;
            html += renderCommands(section.journalctl_commands);
        }
        
        // Render pipeline examples
        if (section.pipeline_examples) {
            html += renderPipelineExamples(section.pipeline_examples);
        }
        
        // Render tool categories
        if (section.tool_categories) {
            html += renderToolCategories(section.tool_categories);
        }
        
        // Render Debian package commands
        if (section.section_id === '4.1' && section.commands) {
            // Already rendered above
        }
        
        // Render firewall sections
        if (section.debian_ufw) {
            html += renderUFW(section.debian_ufw);
        }
        
        if (section.almalinux_firewalld) {
            html += renderFirewalld(section.almalinux_firewalld);
        }
        
        // Render SSH sections
        if (section.server_hardening) {
            html += renderSSHHardening(section.server_hardening);
        }
        
        // Render log locations
        if (section.log_locations) {
            html += renderLogLocations(section.log_locations);
        }
        
        // Render auth log analysis
        if (section.auth_log_analysis) {
            html += renderLogAnalysis(section.auth_log_analysis);
        }
        
        // Render checklist
        if (section.checklist) {
            html += renderHardeningChecklist(section.checklist);
        }
        
        // Render SELinux
        if (section.selinux) {
            html += renderSELinux(section.selinux);
        }
        
        // Render AppArmor
        if (section.apparmor) {
            html += renderAppArmor(section.apparmor);
        }
        
        // Render lab tasks
        if (section.tasks) {
            html += renderLabTasks(section);
        }
        
        html += `</div>`;
        return html;
    }
    
    /**
     * Render commands
     */
    function renderCommands(commands) {
        return `
            <div class="commands-list">
                ${commands.map(cmd => `
                    <div class="command-item">
                        <div class="command-header">
                            <code class="command-name">${escapeHtml(cmd.command)}</code>
                            <span class="command-desc">${escapeHtml(cmd.description)}</span>
                        </div>
                        ${cmd.examples ? `
                            <div class="command-examples">
                                ${Array.isArray(cmd.examples) 
                                    ? cmd.examples.map(ex => formatCode(ex)).join('')
                                    : formatCode(cmd.examples)
                                }
                            </div>
                        ` : ''}
                        ${cmd.example ? formatCode(cmd.example) : ''}
                        ${cmd.security_use ? `
                            <div class="security-note">
                                <span>🔒</span> ${escapeHtml(cmd.security_use)}
                            </div>
                        ` : ''}
                        ${cmd.security_warning ? `
                            <div class="warning-note">
                                <span>⚠️</span> ${escapeHtml(cmd.security_warning)}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render filesystem hierarchy
     */
    function renderFilesystemHierarchy(hierarchy) {
        return `
            <div class="filesystem-hierarchy">
                <h3>Filesystem Hierarchy</h3>
                <div class="hierarchy-grid">
                    ${hierarchy.map(item => `
                        <div class="hierarchy-item">
                            <code class="path">${escapeHtml(item.path)}</code>
                            <span class="name">${escapeHtml(item.name)}</span>
                            <p class="description">${escapeHtml(item.description)}</p>
                            <p class="security">${escapeHtml(item.security_relevance)}</p>
                            ${item.key_files ? `
                                <div class="key-files">
                                    <strong>Key files:</strong> ${item.key_files.map(f => inlineCode(f)).join(', ')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Render environment options
     */
    function renderEnvironmentOptions(options) {
        return `
            <div class="environment-options">
                <h3>Environment Options</h3>
                ${options.map(opt => `
                    <div class="env-option">
                        <h4>${escapeHtml(opt.type)}</h4>
                        <p><strong>Tools:</strong> ${opt.tools.join(', ')}</p>
                        <div class="pros-cons">
                            <div class="pros">
                                <strong>✓ Pros:</strong>
                                <ul>${opt.pros.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
                            </div>
                            <div class="cons">
                                <strong>✗ Cons:</strong>
                                <ul>${opt.cons.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
                            </div>
                        </div>
                        <p class="recommendation"><strong>💡</strong> ${escapeHtml(opt.recommendation)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render installation steps
     */
    function renderInstallationSteps(steps, section) {
        return `
            <div class="installation-steps">
                <h3>Installation Steps</h3>
                ${steps.map(step => `
                    <div class="install-step">
                        <div class="step-header">
                            <span class="step-number">${step.step}</span>
                            <h4>${escapeHtml(step.title)}</h4>
                        </div>
                        <p>${escapeHtml(step.instructions)}</p>
                        ${step.security_note ? `
                            <div class="security-note">
                                <span>🔒</span> ${escapeHtml(step.security_note)}
                            </div>
                        ` : ''}
                        ${step.warning ? `
                            <div class="warning-note">
                                <span>⚠️</span> ${escapeHtml(step.warning)}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render post-install commands
     */
    function renderPostInstallCommands(commands) {
        return `
            <div class="post-install">
                ${commands.map(cmd => `
                    <div class="post-install-cmd">
                        ${formatCode(cmd.command)}
                        <p class="cmd-desc">${escapeHtml(cmd.description)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render download info
     */
    function renderDownloadInfo(download) {
        return `
            <div class="download-info">
                <h4>📥 Download</h4>
                <p><strong>URL:</strong> <a href="${download.url}" target="_blank">${download.url}</a></p>
                <p><strong>Recommended:</strong> ${inlineCode(download.recommended_image)}</p>
                <p><strong>Size:</strong> ${download.size}</p>
                ${download.note ? `<p class="note">💡 ${escapeHtml(download.note)}</p>` : ''}
            </div>
        `;
    }
    
    /**
     * Render key files table
     */
    function renderKeyFiles(files) {
        return `
            <div class="key-files-section">
                <h3>Key Configuration Files</h3>
                <table class="key-files-table">
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Purpose</th>
                            <th>Security Relevance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${files.map(f => `
                            <tr>
                                <td><code>${escapeHtml(f.file)}</code></td>
                                <td>${escapeHtml(f.description)}</td>
                                <td>${escapeHtml(f.security_note)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    /**
     * Render permission model
     */
    function renderPermissionModel(model) {
        return `
            <div class="permission-model">
                <h3>Permission Model</h3>
                <div class="permission-structure">
                    <code class="big-code">${escapeHtml(model.structure)}</code>
                </div>
                <div class="permission-breakdown">
                    ${model.breakdown.map(b => `
                        <div class="perm-part">
                            <span class="position">Position ${b.position}:</span>
                            <span class="meaning">${escapeHtml(b.meaning)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Render numeric permissions
     */
    function renderNumericPermissions(perms) {
        return `
            <div class="numeric-permissions">
                <h3>Numeric Permissions</h3>
                <p>${escapeHtml(perms.description)}</p>
                <table class="perms-table">
                    <thead>
                        <tr><th>Mode</th><th>Meaning</th></tr>
                    </thead>
                    <tbody>
                        ${perms.common_modes.map(m => `
                            <tr>
                                <td><code>${m.mode}</code></td>
                                <td>${escapeHtml(m.meaning)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    /**
     * Render special permissions
     */
    function renderSpecialPermissions(perms) {
        return `
            <div class="special-permissions">
                <h3>Special Permissions</h3>
                ${perms.map(p => `
                    <div class="special-perm">
                        <h4>${escapeHtml(p.name)}</h4>
                        <p><strong>Numeric:</strong> ${inlineCode(p.numeric)}</p>
                        <p><strong>Symbolic:</strong> ${inlineCode(p.symbolic)}</p>
                        <p>${escapeHtml(p.effect || p.effect_file || '')}</p>
                        ${p.security_concern ? `
                            <div class="warning-note">
                                <span>⚠️</span> ${escapeHtml(p.security_concern)}
                            </div>
                        ` : ''}
                        ${p.audit_command ? `
                            <p><strong>Audit:</strong> ${formatCode(p.audit_command)}</p>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render dangerous permissions
     */
    function renderDangerousPermissions(perms) {
        return `
            <div class="dangerous-permissions">
                <h3>⚠️ Dangerous Permissions to Hunt</h3>
                ${perms.map(p => `
                    <div class="danger-perm">
                        <h4>${escapeHtml(p.pattern)}</h4>
                        <p class="risk">${escapeHtml(p.risk)}</p>
                        ${formatCode(p.find)}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render pipeline examples
     */
    function renderPipelineExamples(examples) {
        return `
            <div class="pipeline-examples">
                <h3>🔗 Pipeline Examples</h3>
                <p>${escapeHtml(examples.description)}</p>
                ${examples.examples.map(ex => `
                    <div class="pipeline-example">
                        ${formatCode(ex.command)}
                        <p class="pipeline-desc">${escapeHtml(ex.description)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render tool categories
     */
    function renderToolCategories(categories) {
        return `
            <div class="tool-categories">
                ${categories.map(cat => `
                    <div class="tool-category">
                        <h3>${escapeHtml(cat.category)}</h3>
                        <table class="tools-table">
                            <thead>
                                <tr>
                                    <th>Tool</th>
                                    <th>Description</th>
                                    <th class="distro-debian ${activeDistro === 'almalinux' ? 'hidden' : ''}">Debian</th>
                                    <th class="distro-alma ${activeDistro === 'debian' ? 'hidden' : ''}">AlmaLinux</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cat.tools.map(tool => `
                                    <tr>
                                        <td><strong>${escapeHtml(tool.name)}</strong></td>
                                        <td>${escapeHtml(tool.description)}</td>
                                        <td class="distro-debian ${activeDistro === 'almalinux' ? 'hidden' : ''}">
                                            <code>${escapeHtml(tool.debian)}</code>
                                        </td>
                                        <td class="distro-alma ${activeDistro === 'debian' ? 'hidden' : ''}">
                                            <code>${escapeHtml(tool.almalinux)}</code>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render UFW section
     */
    function renderUFW(ufw) {
        if (activeDistro === 'almalinux') return '';
        
        return `
            <div class="firewall-section ufw">
                <h3>🔴 ${escapeHtml(ufw.name)} (Debian)</h3>
                <p>${escapeHtml(ufw.description)}</p>
                ${renderCommands(ufw.commands)}
                
                <h4>Typical Setup</h4>
                ${formatCode(ufw.typical_setup.join('\n'))}
            </div>
        `;
    }
    
    /**
     * Render firewalld section
     */
    function renderFirewalld(firewalld) {
        if (activeDistro === 'debian') return '';
        
        return `
            <div class="firewall-section firewalld">
                <h3>🔵 ${escapeHtml(firewalld.name)} (AlmaLinux)</h3>
                <p>${escapeHtml(firewalld.description)}</p>
                ${renderCommands(firewalld.commands)}
                
                <h4>Zones</h4>
                <ul>
                    ${Object.entries(firewalld.zones).map(([zone, desc]) => `
                        <li><strong>${zone}:</strong> ${escapeHtml(desc)}</li>
                    `).join('')}
                </ul>
                
                <h4>Typical Setup</h4>
                ${formatCode(firewalld.typical_setup.join('\n'))}
            </div>
        `;
    }
    
    /**
     * Render SSH hardening
     */
    function renderSSHHardening(config) {
        return `
            <div class="ssh-hardening">
                <h3>🔐 SSH Server Hardening</h3>
                <p><strong>Config file:</strong> ${inlineCode(config.config_file)}</p>
                
                <h4>Recommended Settings</h4>
                <table class="settings-table">
                    <thead>
                        <tr><th>Setting</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        ${config.recommended_settings.map(s => `
                            <tr>
                                <td><code>${escapeHtml(s.setting)}</code></td>
                                <td>${escapeHtml(s.description)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <h4>Apply Changes</h4>
                ${formatCode(config.apply_changes.join('\n'))}
                
                <div class="warning-note">
                    <span>⚠️</span> ${escapeHtml(config.warning)}
                </div>
            </div>
        `;
    }
    
    /**
     * Render log locations
     */
    function renderLogLocations(logs) {
        return `
            <div class="log-locations">
                <h3>📁 Log File Locations</h3>
                <p><strong>Common path:</strong> ${inlineCode(logs.common)}</p>
                
                <table class="logs-table">
                    <thead>
                        <tr><th>Log File</th><th>Content</th><th>Security Use</th></tr>
                    </thead>
                    <tbody>
                        ${logs.key_files.map(f => `
                            <tr>
                                <td><code>${escapeHtml(f.file)}</code></td>
                                <td>${escapeHtml(f.content)}</td>
                                <td>${escapeHtml(f.security_use)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    /**
     * Render log analysis section
     */
    function renderLogAnalysis(analysis) {
        return `
            <div class="log-analysis">
                <h3>🔍 ${escapeHtml(analysis.description)}</h3>
                <p><strong>Debian:</strong> ${inlineCode(analysis.debian_file)}</p>
                <p><strong>AlmaLinux:</strong> ${inlineCode(analysis.almalinux_file)}</p>
                
                <h4>Hunt Queries</h4>
                ${analysis.hunt_queries.map(q => `
                    <div class="hunt-query">
                        <h5>${escapeHtml(q.name)}</h5>
                        ${formatCode(q.command)}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render hardening checklist
     */
    function renderHardeningChecklist(checklist) {
        return `
            <div class="hardening-checklist">
                ${checklist.map(cat => `
                    <div class="checklist-category">
                        <h3>${escapeHtml(cat.category)}</h3>
                        <ul class="checklist-items">
                            ${cat.items.map(item => `
                                <li>
                                    <strong>${escapeHtml(item.item)}</strong>
                                    ${item.command ? formatCode(item.command) : ''}
                                    ${item.debian && (activeDistro !== 'almalinux') ? `
                                        <span class="distro-tag debian">Debian:</span> ${formatCode(item.debian)}
                                    ` : ''}
                                    ${item.almalinux && (activeDistro !== 'debian') ? `
                                        <span class="distro-tag alma">AlmaLinux:</span> ${formatCode(item.almalinux)}
                                    ` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    /**
     * Render SELinux section
     */
    function renderSELinux(selinux) {
        if (activeDistro === 'debian') return '';
        
        return `
            <div class="selinux-section">
                <h3>🔵 SELinux (AlmaLinux/RHEL)</h3>
                <p>${escapeHtml(selinux.description)}</p>
                
                <h4>Modes</h4>
                <ul>
                    ${Object.entries(selinux.modes).map(([mode, desc]) => `
                        <li><strong>${mode}:</strong> ${escapeHtml(desc)}</li>
                    `).join('')}
                </ul>
                
                <h4>Commands</h4>
                ${renderCommands(selinux.commands)}
                
                <div class="best-practice">
                    <span>💡</span> ${escapeHtml(selinux.best_practice)}
                </div>
            </div>
        `;
    }
    
    /**
     * Render AppArmor section
     */
    function renderAppArmor(apparmor) {
        if (activeDistro === 'almalinux') return '';
        
        return `
            <div class="apparmor-section">
                <h3>🔴 AppArmor (Debian/Ubuntu)</h3>
                <p>${escapeHtml(apparmor.description)}</p>
                
                <h4>Modes</h4>
                <ul>
                    ${Object.entries(apparmor.modes).map(([mode, desc]) => `
                        <li><strong>${mode}:</strong> ${escapeHtml(desc)}</li>
                    `).join('')}
                </ul>
                
                <h4>Commands</h4>
                ${renderCommands(apparmor.commands)}
            </div>
        `;
    }
    
    /**
     * Render lab tasks
     */
    function renderLabTasks(section) {
        return `
            <div class="lab-section">
                <div class="lab-header">
                    <h3>🧪 ${escapeHtml(section.title)}</h3>
                    <p><strong>Objective:</strong> ${escapeHtml(section.objective)}</p>
                    <p><strong>Duration:</strong> ${escapeHtml(section.duration)}</p>
                    ${section.scenario ? `<p><strong>Scenario:</strong> ${escapeHtml(section.scenario)}</p>` : ''}
                </div>
                
                <div class="lab-tasks">
                    ${section.tasks.map(task => `
                        <div class="lab-task">
                            <div class="task-header">
                                <span class="task-number">${task.task}</span>
                                <h4>${escapeHtml(task.title)}</h4>
                            </div>
                            
                            ${task.command ? formatCode(task.command) : ''}
                            ${task.commands ? formatCode(task.commands.join('\n')) : ''}
                            ${task.debian && (activeDistro !== 'almalinux') ? `
                                <div class="distro-cmd debian">
                                    <span class="distro-label">Debian:</span>
                                    ${formatCode(Array.isArray(task.debian) ? task.debian.join('\n') : task.debian)}
                                </div>
                            ` : ''}
                            ${task.almalinux && (activeDistro !== 'debian') ? `
                                <div class="distro-cmd alma">
                                    <span class="distro-label">AlmaLinux:</span>
                                    ${formatCode(Array.isArray(task.almalinux) ? task.almalinux.join('\n') : task.almalinux)}
                                </div>
                            ` : ''}
                            
                            ${task.question ? `
                                <p class="task-question"><strong>❓</strong> ${escapeHtml(task.question)}</p>
                            ` : ''}
                            ${task.verify ? `
                                <p class="task-verify"><strong>✓ Verify:</strong> ${escapeHtml(task.verify)}</p>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                
                ${section.success_criteria ? `
                    <div class="success-criteria">
                        <h4>✅ Success Criteria</h4>
                        <ul>
                            ${section.success_criteria.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Render sudoers config
     */
    function renderSudoersConfig(config) {
        return `
            <div class="sudoers-config">
                <h3>Sudoers Configuration</h3>
                <p><strong>Location:</strong> ${inlineCode(config.location)}</p>
                <p><strong>Edit with:</strong> ${inlineCode(config.edit_command)}</p>
                
                <div class="warning-note">
                    <span>⚠️</span> ${escapeHtml(config.warning)}
                </div>
                
                <h4>Format</h4>
                <code class="big-code">${escapeHtml(config.format)}</code>
                
                <h4>Examples</h4>
                <table class="sudoers-table">
                    <thead><tr><th>Line</th><th>Meaning</th></tr></thead>
                    <tbody>
                        ${config.examples.map(ex => `
                            <tr>
                                <td><code>${escapeHtml(ex.line)}</code></td>
                                <td>${escapeHtml(ex.meaning)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <h4>Best Practices</h4>
                <ul>
                    ${config.security_best_practices.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    /**
     * Show quick reference
     */
    async function showQuickReference() {
        const data = await loadGuideData();
        if (!data) return;
        
        const ref = data.quick_reference;
        const content = document.getElementById('content');
        
        content.innerHTML = `
            <div class="container linux-guide">
                <button class="back-btn" onclick="showLinuxGuide()">← Back to Linux Guide</button>
                
                <h1>⚡ Quick Reference</h1>
                
                <div class="quick-ref-grid">
                    <div class="quick-ref-card">
                        <h3>Package Management</h3>
                        <table>
                            <thead><tr><th>Action</th><th>Debian</th><th>AlmaLinux</th></tr></thead>
                            <tbody>
                                ${Object.entries(ref.package_management.debian).map(([action, cmd]) => `
                                    <tr>
                                        <td>${action}</td>
                                        <td><code>${escapeHtml(cmd)}</code></td>
                                        <td><code>${escapeHtml(ref.package_management.almalinux[action])}</code></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="quick-ref-card">
                        <h3>Service Management</h3>
                        <table>
                            <tbody>
                                ${Object.entries(ref.service_management).map(([action, cmd]) => `
                                    <tr>
                                        <td>${action}</td>
                                        <td><code>${escapeHtml(cmd)}</code></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="quick-ref-card">
                        <h3>Firewall</h3>
                        <h4>Debian (UFW)</h4>
                        <table>
                            <tbody>
                                ${Object.entries(ref.firewall.debian_ufw).map(([action, cmd]) => `
                                    <tr><td>${action}</td><td><code>${escapeHtml(cmd)}</code></td></tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <h4>AlmaLinux (firewalld)</h4>
                        <table>
                            <tbody>
                                ${Object.entries(ref.firewall.almalinux_firewalld).map(([action, cmd]) => `
                                    <tr><td>${action}</td><td><code>${escapeHtml(cmd)}</code></td></tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="quick-ref-card">
                        <h3>User Management</h3>
                        <table>
                            <tbody>
                                <tr><td>Add user</td><td><code>${escapeHtml(ref.user_management.add_user)}</code></td></tr>
                                <tr><td>Set password</td><td><code>${escapeHtml(ref.user_management.set_password)}</code></td></tr>
                                <tr><td>Add to sudo (Debian)</td><td><code>${escapeHtml(ref.user_management.add_to_sudo.debian)}</code></td></tr>
                                <tr><td>Add to sudo (Alma)</td><td><code>${escapeHtml(ref.user_management.add_to_sudo.almalinux)}</code></td></tr>
                                <tr><td>Lock user</td><td><code>${escapeHtml(ref.user_management.lock_user)}</code></td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="quick-ref-card">
                        <h3>Essential Paths</h3>
                        <table>
                            <tbody>
                                <tr><td>Logs</td><td><code>${escapeHtml(ref.essential_paths.logs)}</code></td></tr>
                                <tr><td>Auth log (Debian)</td><td><code>${escapeHtml(ref.essential_paths.auth_log.debian)}</code></td></tr>
                                <tr><td>Auth log (Alma)</td><td><code>${escapeHtml(ref.essential_paths.auth_log.almalinux)}</code></td></tr>
                                <tr><td>SSH config</td><td><code>${escapeHtml(ref.essential_paths.ssh_config)}</code></td></tr>
                                <tr><td>Sudoers</td><td><code>${escapeHtml(ref.essential_paths.sudoers)}</code></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Set distribution filter
     */
    function setDistro(distro) {
        activeDistro = distro;
    }
    
    /**
     * Scroll to section
     */
    function scrollToSection(sectionId) {
        const element = document.getElementById(`section-${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Update nav buttons
        document.querySelectorAll('.section-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(sectionId)) {
                btn.classList.add('active');
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.LinuxGuide = {
        show: showLinuxGuide,  // Renamed to avoid confusion
        showChapter,
        showQuickReference,
        setDistro,
        scrollToSection
    };
    
    // NOTE: We do NOT override window.showLinuxGuide here!
    // The original showLinuxGuide() from app.js should remain untouched.
    // Use window.LinuxGuide.show() for the detailed guide view.
    
    console.log('✅ Linux Guide module loaded (window.LinuxGuide.show available)');
    
})();
