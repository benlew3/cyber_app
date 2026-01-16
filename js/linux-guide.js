/**
 * Linux Guide Viewer Module
 * Security+ Training Platform v34
 * 
 * Displays the comprehensive Linux guide for Debian and AlmaLinux
 * This module provides the detailed "Deep Dive" guide view.
 * It does NOT override the original showLinuxSetup() from app.js.
 */

(function() {
    'use strict';
    
    // Cache for loaded guide data
    var guideData = null;
    var currentChapter = 0;
    var currentSection = 0;
    
    // Distribution toggle state
    var activeDistro = 'both'; // 'debian', 'almalinux', or 'both'
    
    /**
     * Safe property access - prevents "cannot read property of undefined" errors
     */
    function safeGet(obj, path, defaultValue) {
        if (defaultValue === undefined) defaultValue = '';
        if (!obj) return defaultValue;
        
        var parts = path.split('.');
        var current = obj;
        
        for (var i = 0; i < parts.length; i++) {
            if (current === null || current === undefined) {
                return defaultValue;
            }
            current = current[parts[i]];
        }
        
        return (current !== null && current !== undefined) ? current : defaultValue;
    }
    
    /**
     * Safe array join
     */
    function safeJoin(arr, separator) {
        if (!arr || !Array.isArray(arr)) return '';
        return arr.join(separator || ', ');
    }
    
    /**
     * Safe array map
     */
    function safeMap(arr, fn) {
        if (!arr || !Array.isArray(arr)) return [];
        return arr.map(fn);
    }
    
    /**
     * Load the Linux guide JSON
     */
    function loadGuideData() {
        return new Promise(function(resolve) {
            if (guideData) {
                resolve(guideData);
                return;
            }
            
            // Try multiple paths to support different deployment scenarios
            var paths = [
                'data/tools/LINUX-GUIDE-001_Linux_Security_Fundamentals.json',
                './data/tools/LINUX-GUIDE-001_Linux_Security_Fundamentals.json'
            ];
            
            var tryPath = function(index) {
                if (index >= paths.length) {
                    console.error('Error: Could not load Linux guide from any path');
                    resolve(null);
                    return;
                }
                
                fetch(paths[index])
                    .then(function(response) {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Not found');
                    })
                    .then(function(data) {
                        guideData = data;
                        console.log('✅ Linux guide data loaded from:', paths[index]);
                        resolve(guideData);
                    })
                    .catch(function() {
                        console.warn('Failed to load from:', paths[index]);
                        tryPath(index + 1);
                    });
            };
            
            tryPath(0);
        });
    }
    
    /**
     * Escape HTML for safe display
     */
    function escapeHtml(str) {
        if (!str) return '';
        if (typeof str !== 'string') str = String(str);
        if (typeof window.escapeHtml === 'function') {
            return window.escapeHtml(str);
        }
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    /**
     * Format code blocks
     */
    function formatCode(code, language) {
        if (!language) language = 'bash';
        return '<pre class="code-block"><code class="language-' + language + '">' + escapeHtml(code) + '</code></pre>';
    }
    
    /**
     * Format inline code
     */
    function inlineCode(code) {
        return '<code class="inline-code">' + escapeHtml(code) + '</code>';
    }
    
    /**
     * Show the main Linux Guide page (Deep Dive view)
     */
    function showLinuxGuide(initialDistro) {
        console.log('🐧 Loading Linux Deep Dive Guide...');
        
        if (initialDistro) {
            activeDistro = initialDistro;
        }
        
        var content = document.getElementById('content');
        if (!content) {
            console.error('Content element not found');
            return;
        }
        
        // Show loading state
        content.innerHTML = '<div class="container"><div class="loading-state"><p>Loading Linux Guide...</p></div></div>';
        
        loadGuideData().then(function(data) {
            if (!data) {
                content.innerHTML = '\
                    <div class="container">\
                        <div class="error-message" style="background: #27272a; padding: 30px; border-radius: 12px; text-align: center;">\
                            <h2 style="color: #ef4444;">⚠️ Error Loading Linux Guide</h2>\
                            <p style="color: #a1a1aa;">Could not load the Linux guide data. Please try again.</p>\
                            <button class="btn btn-primary" onclick="LinuxGuide.show()" style="margin-top: 15px; background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Retry</button>\
                            <button class="btn btn-secondary" onclick="showLinuxSetup()" style="margin-top: 15px; margin-left: 10px; background: #27272a; color: white; border: 1px solid #3f3f46; padding: 10px 20px; border-radius: 6px; cursor: pointer;">Back to Linux Setup</button>\
                        </div>\
                    </div>\
                ';
                return;
            }
            
            renderMainGuide(data, content);
        });
    }
    
    /**
     * Render the main guide page
     */
    function renderMainGuide(data, content) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Build HTML safely
        var title = escapeHtml(safeGet(data, 'title', 'Linux Guide'));
        var description = escapeHtml(safeGet(data, 'description', ''));
        var overview = escapeHtml(safeGet(data, 'introduction.overview', ''));
        
        var debianDesc = escapeHtml(safeGet(data, 'introduction.why_two_distros.debian_family.description', ''));
        var debianIncludes = safeJoin(safeGet(data, 'introduction.why_two_distros.debian_family.includes', []), ', ');
        var debianPkg = safeGet(data, 'introduction.why_two_distros.debian_family.package_manager', 'apt');
        
        var rhelDesc = escapeHtml(safeGet(data, 'introduction.why_two_distros.rhel_family.description', ''));
        var rhelIncludes = safeJoin(safeGet(data, 'introduction.why_two_distros.rhel_family.includes', []), ', ');
        var rhelPkg = safeGet(data, 'introduction.why_two_distros.rhel_family.package_manager', 'dnf');
        
        var examRelevance = safeGet(data, 'introduction.security_plus_relevance', []);
        var examRelevanceHtml = safeMap(examRelevance, function(r) {
            return '<li>' + escapeHtml(r) + '</li>';
        }).join('');
        
        var chapters = safeGet(data, 'chapters', []);
        var chaptersHtml = safeMap(chapters, function(chapter, idx) {
            var chapterId = safeGet(chapter, 'chapter_id', idx + 1);
            var chapterTitle = escapeHtml(safeGet(chapter, 'title', 'Chapter ' + (idx + 1)));
            var sectionsCount = safeGet(chapter, 'sections', []).length;
            return '\
                <div class="chapter-card" onclick="LinuxGuide.showChapter(' + idx + ')" style="background: #27272a; border-radius: 8px; padding: 20px; cursor: pointer; transition: all 0.2s;">\
                    <span class="chapter-number" style="color: #6366f1; font-size: 0.9rem;">Chapter ' + chapterId + '</span>\
                    <h3 style="color: #fafafa; margin: 8px 0;">' + chapterTitle + '</h3>\
                    <p class="chapter-sections" style="color: #71717a; font-size: 0.85rem;">' + sectionsCount + ' sections</p>\
                </div>\
            ';
        }).join('');
        
        var examTips = safeGet(data, 'exam_tips', []);
        var examTipsHtml = safeMap(examTips, function(tip) {
            return '<li>' + escapeHtml(tip) + '</li>';
        }).join('');
        
        content.innerHTML = '\
            <div class="container linux-guide">\
                <button class="back-btn" onclick="showLinuxSetup()" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to Linux Setup</button>\
                \
                <div class="linux-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; margin-bottom: 30px;">\
                    <div class="linux-title" style="display: flex; align-items: center; gap: 15px;">\
                        <span class="linux-icon" style="font-size: 3rem;">🐧</span>\
                        <div>\
                            <h1 style="color: #fafafa; margin: 0;">' + title + '</h1>\
                            <p class="linux-subtitle" style="color: #a1a1aa; margin-top: 5px;">' + description + '</p>\
                        </div>\
                    </div>\
                    \
                    <div class="distro-toggle" style="display: flex; gap: 8px;">\
                        <button class="distro-btn ' + (activeDistro === 'both' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'both\')" style="background: ' + (activeDistro === 'both' ? '#6366f1' : '#27272a') + '; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Both</button>\
                        <button class="distro-btn ' + (activeDistro === 'debian' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'debian\')" style="background: ' + (activeDistro === 'debian' ? '#ef4444' : '#27272a') + '; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">🔴 Debian</button>\
                        <button class="distro-btn ' + (activeDistro === 'almalinux' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'almalinux\')" style="background: ' + (activeDistro === 'almalinux' ? '#3b82f6' : '#27272a') + '; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">🔵 AlmaLinux</button>\
                    </div>\
                </div>\
                \
                <!-- Introduction -->\
                <div class="guide-intro" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">\
                    <p style="color: #a1a1aa; margin-bottom: 20px;">' + overview + '</p>\
                    \
                    <div class="distro-comparison" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">\
                        <div class="distro-card debian" style="background: #27272a; border-left: 4px solid #ef4444; border-radius: 8px; padding: 20px;">\
                            <h3 style="color: #ef4444; margin-bottom: 10px;">🔴 Debian Family</h3>\
                            <p style="color: #a1a1aa; font-size: 0.9rem;">' + debianDesc + '</p>\
                            <p style="color: #a1a1aa; font-size: 0.9rem;"><strong style="color: #fafafa;">Includes:</strong> ' + debianIncludes + '</p>\
                            <p style="color: #a1a1aa; font-size: 0.9rem;"><strong style="color: #fafafa;">Package Manager:</strong> ' + inlineCode(debianPkg) + '</p>\
                        </div>\
                        <div class="distro-card almalinux" style="background: #27272a; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px;">\
                            <h3 style="color: #3b82f6; margin-bottom: 10px;">🔵 RHEL Family</h3>\
                            <p style="color: #a1a1aa; font-size: 0.9rem;">' + rhelDesc + '</p>\
                            <p style="color: #a1a1aa; font-size: 0.9rem;"><strong style="color: #fafafa;">Includes:</strong> ' + rhelIncludes + '</p>\
                            <p style="color: #a1a1aa; font-size: 0.9rem;"><strong style="color: #fafafa;">Package Manager:</strong> ' + inlineCode(rhelPkg) + '</p>\
                        </div>\
                    </div>\
                    \
                    <div class="exam-relevance" style="background: #27272a50; border-radius: 8px; padding: 15px;">\
                        <h4 style="color: #f59e0b; margin-bottom: 10px;">📚 Security+ Exam Relevance</h4>\
                        <ul style="color: #a1a1aa; margin: 0; padding-left: 20px;">' + examRelevanceHtml + '</ul>\
                    </div>\
                </div>\
                \
                <!-- Chapter Navigation -->\
                <div class="chapter-nav" style="margin-bottom: 25px;">\
                    <h2 style="color: #fafafa; margin-bottom: 15px;">📖 Guide Chapters</h2>\
                    <div class="chapter-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">' + chaptersHtml + '</div>\
                </div>\
                \
                <!-- Quick Reference -->\
                <div class="quick-ref-section" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">\
                    <h2 style="color: #fafafa; margin-bottom: 15px;">⚡ Quick Reference</h2>\
                    <button class="btn btn-outline" onclick="LinuxGuide.showQuickReference()" style="background: #27272a; color: #fafafa; border: 1px solid #3f3f46; padding: 10px 20px; border-radius: 6px; cursor: pointer;">View Command Quick Reference</button>\
                </div>\
                \
                <!-- Exam Tips -->\
                ' + (examTipsHtml ? '<div class="exam-tips-section" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px;">\
                    <h2 style="color: #fafafa; margin-bottom: 15px;">📝 Exam Tips</h2>\
                    <ul class="exam-tips-list" style="color: #a1a1aa; padding-left: 20px;">' + examTipsHtml + '</ul>\
                </div>' : '') + '\
            </div>\
        ';
        
        if (window.APP && window.APP.state) {
            window.APP.state.currentView = 'linux-guide';
        }
    }
    
    /**
     * Show a specific chapter
     */
    function showChapter(chapterIndex) {
        loadGuideData().then(function(data) {
            if (!data) return;
            
            var chapters = safeGet(data, 'chapters', []);
            if (!chapters[chapterIndex]) {
                console.error('Chapter not found:', chapterIndex);
                return;
            }
            
            currentChapter = chapterIndex;
            var chapter = chapters[chapterIndex];
            
            var content = document.getElementById('content');
            if (!content) return;
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            var chapterId = safeGet(chapter, 'chapter_id', chapterIndex + 1);
            var chapterTitle = escapeHtml(safeGet(chapter, 'title', 'Chapter'));
            var sections = safeGet(chapter, 'sections', []);
            
            // Build section navigation
            var sectionNavHtml = safeMap(sections, function(section) {
                var sectionId = safeGet(section, 'section_id', '');
                var sectionTitle = escapeHtml(safeGet(section, 'title', ''));
                return '<button class="section-nav-btn" onclick="LinuxGuide.scrollToSection(\'' + sectionId + '\')" style="background: #27272a; color: #a1a1aa; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">' + sectionId + '</button>';
            }).join('');
            
            // Build sections content
            var sectionsHtml = safeMap(sections, function(section, sIdx) {
                return renderSection(section, sIdx);
            }).join('');
            
            // Navigation buttons
            var prevBtn = chapterIndex > 0 
                ? '<button class="btn btn-outline" onclick="LinuxGuide.showChapter(' + (chapterIndex - 1) + ')" style="background: #27272a; color: #fafafa; border: 1px solid #3f3f46; padding: 8px 16px; border-radius: 6px; cursor: pointer;">← Previous Chapter</button>'
                : '';
            var nextBtn = chapterIndex < chapters.length - 1
                ? '<button class="btn btn-primary" onclick="LinuxGuide.showChapter(' + (chapterIndex + 1) + ')" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Next Chapter →</button>'
                : '<button class="btn btn-success" onclick="LinuxGuide.show()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">✓ Back to Guide</button>';
            
            content.innerHTML = '\
                <div class="container linux-guide">\
                    <button class="back-btn" onclick="LinuxGuide.show()" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to Linux Guide</button>\
                    \
                    <div class="chapter-header" style="margin-bottom: 25px;">\
                        <span class="chapter-badge" style="background: #6366f1; color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem;">Chapter ' + chapterId + '</span>\
                        <h1 style="color: #fafafa; margin: 15px 0;">' + chapterTitle + '</h1>\
                        \
                        <div class="distro-toggle" style="display: flex; gap: 8px; margin-top: 15px;">\
                            <button class="distro-btn ' + (activeDistro === 'both' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'both\'); LinuxGuide.showChapter(' + chapterIndex + ')" style="background: ' + (activeDistro === 'both' ? '#6366f1' : '#27272a') + '; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Both</button>\
                            <button class="distro-btn ' + (activeDistro === 'debian' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'debian\'); LinuxGuide.showChapter(' + chapterIndex + ')" style="background: ' + (activeDistro === 'debian' ? '#ef4444' : '#27272a') + '; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">🔴 Debian</button>\
                            <button class="distro-btn ' + (activeDistro === 'almalinux' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'almalinux\'); LinuxGuide.showChapter(' + chapterIndex + ')" style="background: ' + (activeDistro === 'almalinux' ? '#3b82f6' : '#27272a') + '; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">🔵 AlmaLinux</button>\
                        </div>\
                    </div>\
                    \
                    <div class="section-nav" style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 15px; margin-bottom: 25px; display: flex; gap: 8px; flex-wrap: wrap;">\
                        <span style="color: #71717a; margin-right: 10px;">Jump to:</span>\
                        ' + sectionNavHtml + '\
                    </div>\
                    \
                    <div class="chapter-sections">' + sectionsHtml + '</div>\
                    \
                    <div class="chapter-nav-buttons" style="display: flex; justify-content: space-between; margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a;">\
                        <div>' + prevBtn + '</div>\
                        <div>' + nextBtn + '</div>\
                    </div>\
                </div>\
            ';
        });
    }
    
    /**
     * Render a single section
     */
    function renderSection(section, sectionIndex) {
        var sectionId = safeGet(section, 'section_id', '');
        var sectionTitle = escapeHtml(safeGet(section, 'title', ''));
        var sectionContent = escapeHtml(safeGet(section, 'content', ''));
        
        var commandsHtml = '';
        var commands = safeGet(section, 'commands', []);
        
        if (commands.length > 0) {
            var commandsContent = safeMap(commands, function(cmd) {
                return renderCommand(cmd);
            }).join('');
            
            commandsHtml = '\
                <div class="commands-section" style="margin-top: 20px;">\
                    <h4 style="color: #10b981; margin-bottom: 15px;">💻 Commands</h4>\
                    ' + commandsContent + '\
                </div>\
            ';
        }
        
        return '\
            <div id="section-' + sectionId + '" class="section-block" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 20px;">\
                <div class="section-header">\
                    <span class="section-id" style="color: #6366f1; font-size: 0.9rem;">' + sectionId + '</span>\
                    <h3 style="color: #fafafa; margin: 8px 0 15px 0;">' + sectionTitle + '</h3>\
                </div>\
                <div class="section-content" style="color: #a1a1aa;">\
                    <p>' + sectionContent + '</p>\
                    ' + commandsHtml + '\
                </div>\
            </div>\
        ';
    }
    
    /**
     * Render a command block
     */
    function renderCommand(cmd) {
        var description = escapeHtml(safeGet(cmd, 'description', ''));
        var debianCmd = safeGet(cmd, 'debian', '');
        var almaCmd = safeGet(cmd, 'almalinux', '');
        var genericCmd = safeGet(cmd, 'command', '');
        var explanation = escapeHtml(safeGet(cmd, 'explanation', ''));
        
        var showDebian = activeDistro === 'both' || activeDistro === 'debian';
        var showAlma = activeDistro === 'both' || activeDistro === 'almalinux';
        
        var commandsHtml = '';
        
        if (genericCmd) {
            // Single command for both distros
            commandsHtml = '<div class="command-box" style="background: #09090b; border-radius: 6px; padding: 15px; margin-top: 10px;"><code style="color: #10b981; font-family: monospace;">' + escapeHtml(genericCmd) + '</code></div>';
        } else {
            // Distro-specific commands
            if (showDebian && debianCmd) {
                commandsHtml += '<div class="command-box debian" style="background: #09090b; border-left: 3px solid #ef4444; border-radius: 6px; padding: 15px; margin-top: 10px;"><span style="color: #ef4444; font-size: 0.8rem;">Debian/Ubuntu:</span><br><code style="color: #10b981; font-family: monospace;">' + escapeHtml(debianCmd) + '</code></div>';
            }
            if (showAlma && almaCmd) {
                commandsHtml += '<div class="command-box almalinux" style="background: #09090b; border-left: 3px solid #3b82f6; border-radius: 6px; padding: 15px; margin-top: 10px;"><span style="color: #3b82f6; font-size: 0.8rem;">AlmaLinux/RHEL:</span><br><code style="color: #10b981; font-family: monospace;">' + escapeHtml(almaCmd) + '</code></div>';
            }
        }
        
        return '\
            <div class="command-entry" style="background: #27272a; border-radius: 8px; padding: 15px; margin-bottom: 15px;">\
                <p style="color: #fafafa; margin-bottom: 5px;"><strong>' + description + '</strong></p>\
                ' + commandsHtml + '\
                ' + (explanation ? '<p style="color: #71717a; font-size: 0.85rem; margin-top: 10px;">💡 ' + explanation + '</p>' : '') + '\
            </div>\
        ';
    }
    
    /**
     * Show quick reference
     */
    function showQuickReference() {
        loadGuideData().then(function(data) {
            if (!data) return;
            
            var content = document.getElementById('content');
            if (!content) return;
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            var quickRef = safeGet(data, 'quick_reference', {});
            var categories = Object.keys(quickRef);
            
            var categoriesHtml = safeMap(categories, function(category) {
                var commands = safeGet(quickRef, category, []);
                var commandsHtml = safeMap(commands, function(cmd) {
                    return renderCommand(cmd);
                }).join('');
                
                return '\
                    <div class="ref-category" style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 20px;">\
                        <h3 style="color: #6366f1; margin-bottom: 15px;">' + escapeHtml(category.replace(/_/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); })) + '</h3>\
                        ' + commandsHtml + '\
                    </div>\
                ';
            }).join('');
            
            content.innerHTML = '\
                <div class="container linux-guide">\
                    <button class="back-btn" onclick="LinuxGuide.show()" style="background: #27272a; color: #fafafa; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px;">← Back to Linux Guide</button>\
                    \
                    <div class="quick-ref-header" style="margin-bottom: 25px;">\
                        <h1 style="color: #fafafa;">⚡ Quick Reference</h1>\
                        <p style="color: #a1a1aa;">Essential Linux commands organized by category</p>\
                        \
                        <div class="distro-toggle" style="display: flex; gap: 8px; margin-top: 15px;">\
                            <button class="distro-btn ' + (activeDistro === 'both' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'both\'); LinuxGuide.showQuickReference()" style="background: ' + (activeDistro === 'both' ? '#6366f1' : '#27272a') + '; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Both</button>\
                            <button class="distro-btn ' + (activeDistro === 'debian' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'debian\'); LinuxGuide.showQuickReference()" style="background: ' + (activeDistro === 'debian' ? '#ef4444' : '#27272a') + '; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🔴 Debian</button>\
                            <button class="distro-btn ' + (activeDistro === 'almalinux' ? 'active' : '') + '" onclick="LinuxGuide.setDistro(\'almalinux\'); LinuxGuide.showQuickReference()" style="background: ' + (activeDistro === 'almalinux' ? '#3b82f6' : '#27272a') + '; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">🔵 AlmaLinux</button>\
                        </div>\
                    </div>\
                    \
                    ' + categoriesHtml + '\
                </div>\
            ';
        });
    }
    
    /**
     * Set active distribution
     */
    function setDistro(distro) {
        activeDistro = distro;
        console.log('Distribution set to:', distro);
    }
    
    /**
     * Scroll to a specific section
     */
    function scrollToSection(sectionId) {
        var element = document.getElementById('section-' + sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Public API - Exposed to window.LinuxGuide
    // ═══════════════════════════════════════════════════════════════════════════
    
    window.LinuxGuide = {
        show: showLinuxGuide,
        showChapter: showChapter,
        showQuickReference: showQuickReference,
        setDistro: setDistro,
        scrollToSection: scrollToSection
    };
    
    // NOTE: We do NOT override window.showLinuxSetup!
    // The original function from app.js remains untouched.
    // Use window.LinuxGuide.show() for the detailed Deep Dive guide.
    
    console.log('✅ Linux Guide module loaded (use LinuxGuide.show() for deep dive)');
    
})();
