/**
 * Linux Guide Integration Patch
 * Security+ Training Platform
 * 
 * Patches app.js to integrate the Linux Security Guide
 * into the main navigation and dashboard.
 */

(function() {
    'use strict';
    
    console.log('🐧 Linux Guide Integration loading...');
    
    // Wait for DOM and app to be ready
    function waitForApp(callback, maxAttempts = 50) {
        let attempts = 0;
        const check = setInterval(() => {
            attempts++;
            if (window.APP && document.getElementById('content')) {
                clearInterval(check);
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(check);
                console.error('Linux Guide Integration: Timeout waiting for APP');
            }
        }, 100);
    }
    
    // Patch 1: Add Linux Guide button to navigation header
    function patchNavigation() {
        const nav = document.querySelector('.app-nav, .main-nav, nav');
        if (!nav) {
            // Create navigation if it doesn't exist
            const header = document.querySelector('header, .header, .app-header');
            if (header) {
                const linuxBtn = createLinuxButton();
                header.appendChild(linuxBtn);
            }
            return;
        }
        
        // Check if button already exists
        if (nav.querySelector('.linux-guide-btn')) return;
        
        const linuxBtn = createLinuxButton();
        nav.appendChild(linuxBtn);
    }
    
    // Create the Linux Guide button element
    function createLinuxButton() {
        const btn = document.createElement('button');
        btn.className = 'linux-guide-btn nav-btn';
        btn.innerHTML = `
            <span class="linux-icon">🐧</span>
            <span class="linux-label">Linux Guide</span>
        `;
        btn.onclick = () => {
            if (window.LinuxGuide && window.LinuxGuide.show) {
                window.LinuxGuide.show();
            } else if (window.showLinuxSetup) {
                window.showLinuxSetup();
            } else {
                console.error('Linux Guide not loaded');
                alert('Linux Guide is loading... Please try again.');
            }
        };
        btn.title = 'Open Linux Security Guide';
        return btn;
    }
    
    // Patch 2: Add Linux Guide card to dashboard
    function patchDashboard() {
        // Look for existing resource cards or create new section
        const dashboard = document.querySelector('.dashboard, .hub-container, #dashboard');
        if (!dashboard) return;
        
        // Check if Linux card already exists
        if (dashboard.querySelector('.linux-guide-card')) return;
        
        // Find resource section or create one
        let resourceSection = dashboard.querySelector('.resources-section, .study-tools-section');
        
        if (!resourceSection) {
            // Look for a place to add the card
            const cardsContainer = dashboard.querySelector('.domain-cards, .cards-container');
            if (cardsContainer && !cardsContainer.querySelector('.linux-guide-card')) {
                const linuxCard = createLinuxCard();
                cardsContainer.appendChild(linuxCard);
            }
        } else if (!resourceSection.querySelector('.linux-guide-card')) {
            const linuxCard = createLinuxCard();
            resourceSection.appendChild(linuxCard);
        }
    }
    
    // Create the Linux Guide dashboard card
    function createLinuxCard() {
        const card = document.createElement('div');
        card.className = 'linux-guide-card resource-card';
        card.innerHTML = `
            <div class="card-icon">🐧</div>
            <div class="card-content">
                <h3 class="card-title">Linux Security Guide</h3>
                <p class="card-description">
                    Master Linux fundamentals with hands-on commands for Debian and AlmaLinux. 
                    Essential for Security+ and real-world operations.
                </p>
                <div class="card-tags">
                    <span class="tag tag-debian">Debian</span>
                    <span class="tag tag-almalinux">AlmaLinux</span>
                </div>
            </div>
            <div class="card-action">
                <button class="btn btn-secondary" onclick="window.LinuxGuide?.show() || window.showLinuxSetup?.()">
                    Open Guide →
                </button>
            </div>
        `;
        card.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                if (window.LinuxGuide && window.LinuxGuide.show) {
                    window.LinuxGuide.show();
                } else if (window.showLinuxSetup) {
                    window.showLinuxSetup();
                }
            }
        };
        return card;
    }
    
    // Patch 3: Override showDomainHub to include Linux Guide
    function patchShowDomainHub() {
        if (!window.APP || !window.APP.showDomainHub) return;
        
        const originalShowDomainHub = window.APP.showDomainHub.bind(window.APP);
        
        window.APP.showDomainHub = function() {
            originalShowDomainHub();
            
            // Add Linux Guide card after a short delay to ensure DOM is ready
            setTimeout(() => {
                addLinuxGuideToHub();
            }, 100);
        };
    }
    
    // Add Linux Guide section to the hub
    function addLinuxGuideToHub() {
        const content = document.getElementById('content');
        if (!content) return;
        
        // Check if already added
        if (content.querySelector('.linux-hub-section')) return;
        
        // Find the container where we want to add it
        const container = content.querySelector('.container, .hub-content, .domain-hub');
        if (!container) return;
        
        // Create Linux Guide section
        const section = document.createElement('section');
        section.className = 'linux-hub-section';
        section.innerHTML = `
            <div class="section-header">
                <h2>🐧 Linux Security Fundamentals</h2>
                <span class="section-badge">Hands-On Lab</span>
            </div>
            <div class="linux-hub-card" onclick="window.LinuxGuide?.show() || window.showLinuxSetup?.()">
                <div class="card-visual">
                    <div class="distro-icons">
                        <span class="distro-icon debian-icon" title="Debian">🔵</span>
                        <span class="distro-icon almalinux-icon" title="AlmaLinux">🔴</span>
                    </div>
                </div>
                <div class="card-body">
                    <h3>Linux Command Reference & Lab Setup</h3>
                    <p>
                        Master essential Linux commands for security operations. 
                        Includes VM setup guides, command reference, and hands-on exercises 
                        for both Debian-based and RHEL-based distributions.
                    </p>
                    <div class="topics-preview">
                        <span class="topic">VM Setup</span>
                        <span class="topic">File Permissions</span>
                        <span class="topic">User Management</span>
                        <span class="topic">Network Config</span>
                        <span class="topic">Security Hardening</span>
                    </div>
                </div>
                <div class="card-action">
                    <span class="open-guide-btn">Open Guide →</span>
                </div>
            </div>
        `;
        
        // Insert before footer or at end
        const footer = container.querySelector('.footer, .hub-footer');
        if (footer) {
            container.insertBefore(section, footer);
        } else {
            container.appendChild(section);
        }
    }
    
    // Patch 4: Add keyboard shortcut
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L opens Linux Guide
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                if (window.LinuxGuide && window.LinuxGuide.show) {
                    window.LinuxGuide.show();
                } else if (window.showLinuxSetup) {
                    window.showLinuxSetup();
                }
            }
        });
    }
    
    // Initialize all patches
    function initialize() {
        console.log('🐧 Applying Linux Guide patches...');
        
        // Apply patches
        patchNavigation();
        patchShowDomainHub();
        setupKeyboardShortcut();
        
        // Initial dashboard patch attempt
        setTimeout(patchDashboard, 500);
        
        // Re-apply navigation patch when DOM changes (SPA navigation)
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(patchNavigation, 100);
                    setTimeout(patchDashboard, 200);
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log('✅ Linux Guide integration complete');
        console.log('💡 Tip: Press Ctrl+Shift+L to open Linux Guide');
    }
    
    // Start when app is ready
    waitForApp(initialize);
    
    // Add styles for the integration elements
    const style = document.createElement('style');
    style.textContent = `
        /* Linux Guide Navigation Button */
        .linux-guide-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: linear-gradient(135deg, #2563eb20, #7c3aed20);
            border: 1px solid #3b82f640;
            border-radius: 8px;
            color: #e0e7ff;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .linux-guide-btn:hover {
            background: linear-gradient(135deg, #2563eb40, #7c3aed40);
            border-color: #3b82f680;
            transform: translateY(-1px);
        }
        
        .linux-guide-btn .linux-icon {
            font-size: 1.1rem;
        }
        
        /* Linux Hub Section */
        .linux-hub-section {
            margin: 2rem 0;
            padding: 0;
        }
        
        .linux-hub-section .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1rem;
        }
        
        .linux-hub-section .section-header h2 {
            font-size: 1.4rem;
            font-weight: 600;
            color: #fafafa;
            margin: 0;
        }
        
        .linux-hub-section .section-badge {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .linux-hub-card {
            background: linear-gradient(135deg, #1e1e24, #252530);
            border: 1px solid #3f3f46;
            border-radius: 16px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 1.5rem;
            align-items: center;
        }
        
        .linux-hub-card:hover {
            border-color: #6366f1;
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
        }
        
        .linux-hub-card .card-visual {
            width: 80px;
            height: 80px;
            background: #27272a;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .linux-hub-card .distro-icons {
            display: flex;
            gap: 8px;
            font-size: 1.8rem;
        }
        
        .linux-hub-card .card-body h3 {
            font-size: 1.2rem;
            font-weight: 600;
            color: #fafafa;
            margin: 0 0 0.5rem 0;
        }
        
        .linux-hub-card .card-body p {
            color: #a1a1aa;
            font-size: 0.95rem;
            margin: 0 0 1rem 0;
            line-height: 1.6;
        }
        
        .linux-hub-card .topics-preview {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .linux-hub-card .topic {
            background: #27272a;
            color: #d4d4d8;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
        }
        
        .linux-hub-card .card-action {
            text-align: center;
        }
        
        .linux-hub-card .open-guide-btn {
            color: #818cf8;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .linux-hub-card:hover .open-guide-btn {
            color: #a5b4fc;
        }
        
        /* Linux Guide Dashboard Card */
        .linux-guide-card {
            background: linear-gradient(135deg, #1e1e24, #252530);
            border: 1px solid #3f3f46;
            border-radius: 12px;
            padding: 1.25rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .linux-guide-card:hover {
            border-color: #3b82f6;
            transform: translateY(-2px);
        }
        
        .linux-guide-card .card-icon {
            font-size: 2rem;
            margin-bottom: 0.75rem;
        }
        
        .linux-guide-card .card-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #fafafa;
            margin: 0 0 0.5rem 0;
        }
        
        .linux-guide-card .card-description {
            color: #a1a1aa;
            font-size: 0.9rem;
            margin: 0 0 0.75rem 0;
            line-height: 1.5;
        }
        
        .linux-guide-card .card-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 1rem;
        }
        
        .linux-guide-card .tag {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .linux-guide-card .tag-debian {
            background: #2563eb30;
            color: #60a5fa;
        }
        
        .linux-guide-card .tag-almalinux {
            background: #dc262630;
            color: #f87171;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .linux-hub-card {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .linux-hub-card .card-visual {
                margin: 0 auto;
            }
            
            .linux-hub-card .topics-preview {
                justify-content: center;
            }
            
            .linux-guide-btn .linux-label {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
})();
