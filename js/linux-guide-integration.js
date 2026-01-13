/**
 * Linux Guide Integration Patch
 * Security+ Training Platform
 * 
 * ENHANCES the existing Linux page (keeps Kali, Ubuntu, Parrot, SIFT)
 * and ADDS Debian/AlmaLinux detailed guides as additional content.
 * 
 * Does NOT replace existing content - only adds to it!
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 1: Enhance showLinuxSetup to add Debian/AlmaLinux content
    // ═══════════════════════════════════════════════════════════════════════════
    
    function patchShowLinuxSetup() {
        const originalShowLinuxSetup = window.showLinuxSetup;
        
        if (typeof originalShowLinuxSetup !== 'function') {
            console.warn('showLinuxSetup not found, skipping patch');
            return;
        }
        
        window.showLinuxSetup = function() {
            // Call original function first
            originalShowLinuxSetup();
            
            // Then enhance with additional content after a short delay
            setTimeout(enhanceLinuxPage, 100);
        };
        
        console.log('✅ showLinuxSetup enhanced (original content preserved)');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Enhance the Linux page with additional distros and deep dive section
    // ═══════════════════════════════════════════════════════════════════════════
    
    function enhanceLinuxPage() {
        const content = document.getElementById('content');
        if (!content) return;
        
        // Check if already enhanced
        if (content.querySelector('.linux-enhanced-section')) return;
        
        // Find the distro-cards container to add Debian/AlmaLinux
        const distroCardsContainer = content.querySelector('.distro-cards');
        if (distroCardsContainer) {
            // Add Debian card
            const debianCard = document.createElement('div');
            debianCard.className = 'distro-card';
            debianCard.style.cssText = 'background: #27272a; border-radius: 8px; padding: 20px;';
            debianCard.innerHTML = `
                <h3 style="color: #fafafa; margin-bottom: 10px;">🔷 Debian</h3>
                <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">The universal operating system. Rock-solid stability, basis for Kali & Ubuntu.</p>
                <a href="https://www.debian.org/distrib/" target="_blank" style="color: #6366f1;">Download →</a>
            `;
            distroCardsContainer.appendChild(debianCard);
            
            // Add AlmaLinux card
            const almaCard = document.createElement('div');
            almaCard.className = 'distro-card';
            almaCard.style.cssText = 'background: #27272a; border-radius: 8px; padding: 20px;';
            almaCard.innerHTML = `
                <h3 style="color: #fafafa; margin-bottom: 10px;">🔴 AlmaLinux</h3>
                <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">Enterprise Linux for production servers. RHEL-compatible, free & community-driven.</p>
                <a href="https://almalinux.org/get-almalinux/" target="_blank" style="color: #6366f1;">Download →</a>
            `;
            distroCardsContainer.appendChild(almaCard);
            
            // Add Rocky Linux card
            const rockyCard = document.createElement('div');
            rockyCard.className = 'distro-card';
            rockyCard.style.cssText = 'background: #27272a; border-radius: 8px; padding: 20px;';
            rockyCard.innerHTML = `
                <h3 style="color: #fafafa; margin-bottom: 10px;">🟢 Rocky Linux</h3>
                <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">Another RHEL-compatible option. Founded by CentOS co-founder.</p>
                <a href="https://rockylinux.org/download" target="_blank" style="color: #6366f1;">Download →</a>
            `;
            distroCardsContainer.appendChild(rockyCard);
        }
        
        // Find the container to add the deep dive section
        const container = content.querySelector('.container');
        if (!container) return;
        
        // Find the last linux-section to insert after it
        const sections = container.querySelectorAll('.linux-section');
        const lastSection = sections[sections.length - 1];
        
        // Create Deep Dive Guides section
        const deepDiveSection = document.createElement('div');
        deepDiveSection.className = 'linux-section linux-enhanced-section';
        deepDiveSection.style.cssText = 'background: linear-gradient(135deg, #18181b, #1e1b4b); border: 1px solid #4f46e5; border-radius: 12px; padding: 25px; margin-bottom: 25px;';
        deepDiveSection.innerHTML = `
            <h2 style="color: #a78bfa; margin-bottom: 15px;">📖 Deep Dive Guides</h2>
            <p style="color: #a1a1aa; margin-bottom: 20px;">
                Comprehensive command references with distro-specific syntax for Debian-based (apt) and RHEL-based (dnf/yum) systems.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                <!-- Debian Deep Dive Card -->
                <div style="background: #27272a; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s;" 
                     onclick="window.LinuxGuide?.show?.('debian')" 
                     onmouseover="this.style.borderColor='#60a5fa'; this.style.transform='translateY(-2px)'" 
                     onmouseout="this.style.borderColor='#3b82f6'; this.style.transform='translateY(0)'">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="font-size: 2rem;">🔷</span>
                        <div>
                            <h3 style="color: #fafafa; margin: 0;">Debian/Ubuntu Guide</h3>
                            <span style="color: #3b82f6; font-size: 0.85rem;">apt-based systems</span>
                        </div>
                    </div>
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">
                        Covers Debian, Ubuntu, Kali, Mint, and other apt-based distributions.
                    </p>
                    <ul style="color: #71717a; font-size: 0.85rem; margin: 0; padding-left: 20px;">
                        <li>VM setup walkthrough</li>
                        <li>Package management (apt)</li>
                        <li>User & permission management</li>
                        <li>Network configuration</li>
                        <li>Security hardening</li>
                    </ul>
                </div>
                
                <!-- AlmaLinux Deep Dive Card -->
                <div style="background: #27272a; border: 1px solid #ef4444; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s;" 
                     onclick="window.LinuxGuide?.show?.('almalinux')" 
                     onmouseover="this.style.borderColor='#f87171'; this.style.transform='translateY(-2px)'" 
                     onmouseout="this.style.borderColor='#ef4444'; this.style.transform='translateY(0)'">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="font-size: 2rem;">🔴</span>
                        <div>
                            <h3 style="color: #fafafa; margin: 0;">AlmaLinux/RHEL Guide</h3>
                            <span style="color: #ef4444; font-size: 0.85rem;">dnf/yum-based systems</span>
                        </div>
                    </div>
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">
                        Covers AlmaLinux, Rocky Linux, RHEL, CentOS, and Fedora.
                    </p>
                    <ul style="color: #71717a; font-size: 0.85rem; margin: 0; padding-left: 20px;">
                        <li>VM setup walkthrough</li>
                        <li>Package management (dnf/yum)</li>
                        <li>SELinux configuration</li>
                        <li>Firewalld management</li>
                        <li>Enterprise hardening</li>
                    </ul>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #27272a50; border-radius: 8px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <span style="color: #a1a1aa;">💡 Quick access:</span>
                <button onclick="window.LinuxGuide?.show?.()" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                    Open Full Guide
                </button>
                <button onclick="window.LinuxGuide?.showQuickReference?.()" style="background: #27272a; color: #fafafa; border: 1px solid #3f3f46; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                    Quick Reference Card
                </button>
                <span style="color: #71717a; font-size: 0.85rem;">or press <kbd style="background: #3f3f46; padding: 2px 6px; border-radius: 4px;">Ctrl+Shift+L</kbd></span>
            </div>
        `;
        
        // Insert the deep dive section
        if (lastSection && lastSection.parentNode) {
            lastSection.parentNode.insertBefore(deepDiveSection, lastSection.nextSibling);
        } else {
            container.appendChild(deepDiveSection);
        }
        
        // Add distro family comparison section
        const comparisonSection = document.createElement('div');
        comparisonSection.className = 'linux-section linux-enhanced-section';
        comparisonSection.style.cssText = 'background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;';
        comparisonSection.innerHTML = `
            <h2 style="color: #10b981; margin-bottom: 20px;">🔄 Distro Family Comparison</h2>
            <p style="color: #a1a1aa; margin-bottom: 20px;">Understanding the two major Linux families helps you transfer skills between distributions.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                <div style="background: #27272a; border-radius: 8px; padding: 20px;">
                    <h3 style="color: #3b82f6; margin-bottom: 15px;">Debian Family (apt)</h3>
                    <ul style="color: #a1a1aa; font-size: 0.9rem; padding-left: 20px; margin: 0;">
                        <li><strong style="color: #fafafa;">Debian</strong> - The stable foundation</li>
                        <li><strong style="color: #fafafa;">Ubuntu</strong> - User-friendly, great docs</li>
                        <li><strong style="color: #fafafa;">Kali</strong> - Penetration testing</li>
                        <li><strong style="color: #fafafa;">Parrot</strong> - Security & privacy</li>
                        <li><strong style="color: #fafafa;">Linux Mint</strong> - Desktop focused</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 10px; background: #18181b; border-radius: 6px;">
                        <code style="color: #10b981; font-size: 0.85rem;">sudo apt update && sudo apt upgrade</code>
                    </div>
                </div>
                
                <div style="background: #27272a; border-radius: 8px; padding: 20px;">
                    <h3 style="color: #ef4444; margin-bottom: 15px;">RHEL Family (dnf/yum)</h3>
                    <ul style="color: #a1a1aa; font-size: 0.9rem; padding-left: 20px; margin: 0;">
                        <li><strong style="color: #fafafa;">RHEL</strong> - Enterprise standard</li>
                        <li><strong style="color: #fafafa;">AlmaLinux</strong> - Free RHEL clone</li>
                        <li><strong style="color: #fafafa;">Rocky Linux</strong> - Community RHEL</li>
                        <li><strong style="color: #fafafa;">CentOS Stream</strong> - RHEL preview</li>
                        <li><strong style="color: #fafafa;">Fedora</strong> - Cutting edge</li>
                    </ul>
                    <div style="margin-top: 15px; padding: 10px; background: #18181b; border-radius: 6px;">
                        <code style="color: #10b981; font-size: 0.85rem;">sudo dnf update && sudo dnf upgrade</code>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #27272a50; border-radius: 8px;">
                <p style="color: #a1a1aa; margin: 0; font-size: 0.9rem;">
                    <strong style="color: #f59e0b;">💡 Pro Tip:</strong> Most Security+ exam questions use generic Linux commands that work on both families. 
                    The main differences are package management (<code style="background: #18181b; padding: 2px 4px; border-radius: 3px;">apt</code> vs <code style="background: #18181b; padding: 2px 4px; border-radius: 3px;">dnf</code>) 
                    and service management (<code style="background: #18181b; padding: 2px 4px; border-radius: 3px;">systemctl</code> works on both).
                </p>
            </div>
        `;
        
        // Insert comparison section after deep dive
        deepDiveSection.parentNode.insertBefore(comparisonSection, deepDiveSection.nextSibling);
        
        console.log('✅ Linux page enhanced with additional distros and deep dive guides');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 2: Add Linux Guide button to navigation header
    // ═══════════════════════════════════════════════════════════════════════════
    
    function patchNavigation() {
        // The existing nav already has a Linux button - we don't need to add another
        // But we can add a "Deep Dive" indicator or tooltip
        const linuxBtn = document.querySelector('[onclick*="showLinuxSetup"]');
        if (linuxBtn && !linuxBtn.dataset.enhanced) {
            linuxBtn.dataset.enhanced = 'true';
            linuxBtn.title = 'Linux Setup & Deep Dive Guides (Ctrl+Shift+L for quick access)';
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 3: Add Linux Guide card to dashboard
    // ═══════════════════════════════════════════════════════════════════════════
    
    function patchDashboard() {
        const content = document.getElementById('content');
        if (!content) return;
        
        // Check if we're on the dashboard
        const dashboardTitle = content.querySelector('.page-title, h1');
        if (!dashboardTitle || !dashboardTitle.textContent.includes('Security+')) return;
        
        // Check if already added
        if (content.querySelector('.linux-deep-dive-widget')) return;
        
        // Find a good place to add the widget (after domain cards or in a sidebar)
        const statsGrid = content.querySelector('.stats-grid, .dashboard-stats');
        if (statsGrid) {
            const widget = document.createElement('div');
            widget.className = 'linux-deep-dive-widget stat-card';
            widget.style.cssText = 'background: linear-gradient(135deg, #1e1b4b, #18181b); border: 1px solid #4f46e5; cursor: pointer;';
            widget.onclick = () => window.LinuxGuide?.show?.();
            widget.innerHTML = `
                <div class="stat-icon">🐧</div>
                <div class="stat-info">
                    <span class="stat-value" style="font-size: 1.2rem;">Deep Dive</span>
                    <span class="stat-label">Linux Guides</span>
                </div>
            `;
            statsGrid.appendChild(widget);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Patch 4: Add keyboard shortcut
    // ═══════════════════════════════════════════════════════════════════════════
    
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L opens Linux Guide directly
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
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Initialize all patches
    // ═══════════════════════════════════════════════════════════════════════════
    
    function initialize() {
        console.log('🐧 Applying Linux Guide enhancements...');
        
        // Apply patches
        patchShowLinuxSetup();
        patchNavigation();
        setupKeyboardShortcut();
        
        // Initial dashboard patch attempt
        setTimeout(patchDashboard, 500);
        
        // Re-apply patches when DOM changes (SPA navigation)
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(patchNavigation, 100);
                    setTimeout(patchDashboard, 200);
                    
                    // Check if Linux page was just loaded
                    const content = document.getElementById('content');
                    if (content && content.querySelector('.linux-sections') && !content.querySelector('.linux-enhanced-section')) {
                        setTimeout(enhanceLinuxPage, 100);
                    }
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log('✅ Linux Guide integration complete');
        console.log('📝 Existing content preserved: Kali, Ubuntu, Parrot, SIFT, commands, VM setup');
        console.log('➕ Added: Debian, AlmaLinux, Rocky Linux cards + Deep Dive section');
        console.log('💡 Tip: Press Ctrl+Shift+L to open detailed Linux Guide');
    }
    
    // Start when app is ready
    waitForApp(initialize);
    
    // Add styles for the integration elements
    const style = document.createElement('style');
    style.textContent = `
        /* Deep Dive Widget */
        .linux-deep-dive-widget {
            transition: all 0.2s ease;
        }
        
        .linux-deep-dive-widget:hover {
            transform: translateY(-2px);
            border-color: #6366f1 !important;
        }
        
        /* Enhanced distro cards */
        .distro-card:hover {
            background: #3f3f46 !important;
            transform: translateY(-2px);
            transition: all 0.2s ease;
        }
        
        /* Keyboard hint styling */
        kbd {
            background: #3f3f46;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            border: 1px solid #52525b;
        }
    `;
    document.head.appendChild(style);
    
})();
