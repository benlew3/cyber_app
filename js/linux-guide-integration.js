/**
 * Linux Guide Integration Patch - NON-DESTRUCTIVE VERSION
 * Security+ Training Platform v34
 * 
 * This file ONLY ADDS content to the existing Linux page.
 * It does NOT replace or override showLinuxSetup().
 * 
 * Original content preserved:
 * - Kali Linux, Ubuntu Server, Parrot Security, SANS SIFT cards
 * - Essential Commands section
 * - VM Setup Guide section
 * - Learning Resources section
 * 
 * New content added:
 * - Debian, AlmaLinux, Rocky Linux cards (in distro section)
 * - Deep Dive Guides section (at bottom)
 * - Distro Family Comparison section
 */

(function() {
    'use strict';
    
    console.log('🐧 Linux Guide Enhancement loading (non-destructive)...');
    
    // ═══════════════════════════════════════════════════════════════════════════
    // ENHANCEMENT FUNCTION - Adds content to existing Linux page
    // ═══════════════════════════════════════════════════════════════════════════
    
    function enhanceLinuxPage() {
        const content = document.getElementById('content');
        if (!content) return;
        
        // Only enhance if we're on the original Linux page (has .linux-sections from app.js)
        const linuxSections = content.querySelector('.linux-sections');
        if (!linuxSections) return;
        
        // Check if already enhanced - prevent duplicate injection
        if (content.querySelector('.linux-enhanced-marker')) return;
        
        console.log('🐧 Enhancing existing Linux page with additional content...');
        
        // Add marker to prevent re-enhancement
        const marker = document.createElement('div');
        marker.className = 'linux-enhanced-marker';
        marker.style.display = 'none';
        content.appendChild(marker);
        
        // ═══════════════════════════════════════════════════════════════════════
        // 1. Add new distro cards to existing distro-cards container
        // ═══════════════════════════════════════════════════════════════════════
        
        const distroCardsContainer = content.querySelector('.distro-cards');
        if (distroCardsContainer) {
            // Add Debian card
            const debianCard = document.createElement('div');
            debianCard.className = 'distro-card';
            debianCard.style.cssText = 'background: #27272a; border-radius: 8px; padding: 20px;';
            debianCard.innerHTML = `
                <h3 style="color: #fafafa; margin-bottom: 10px;">🔷 Debian</h3>
                <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">The universal OS. Rock-solid stability, basis for Kali & Ubuntu.</p>
                <a href="https://www.debian.org/distrib/" target="_blank" style="color: #6366f1;">Download →</a>
            `;
            distroCardsContainer.appendChild(debianCard);
            
            // Add AlmaLinux card
            const almaCard = document.createElement('div');
            almaCard.className = 'distro-card';
            almaCard.style.cssText = 'background: #27272a; border-radius: 8px; padding: 20px;';
            almaCard.innerHTML = `
                <h3 style="color: #fafafa; margin-bottom: 10px;">🔴 AlmaLinux</h3>
                <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">Enterprise Linux. RHEL-compatible, free & community-driven.</p>
                <a href="https://almalinux.org/get-almalinux/" target="_blank" style="color: #6366f1;">Download →</a>
            `;
            distroCardsContainer.appendChild(almaCard);
            
            // Add Rocky Linux card
            const rockyCard = document.createElement('div');
            rockyCard.className = 'distro-card';
            rockyCard.style.cssText = 'background: #27272a; border-radius: 8px; padding: 20px;';
            rockyCard.innerHTML = `
                <h3 style="color: #fafafa; margin-bottom: 10px;">🟢 Rocky Linux</h3>
                <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 15px;">Community enterprise OS. Founded by CentOS co-founder.</p>
                <a href="https://rockylinux.org/download" target="_blank" style="color: #6366f1;">Download →</a>
            `;
            distroCardsContainer.appendChild(rockyCard);
            
            console.log('   ✅ Added Debian, AlmaLinux, Rocky Linux cards');
        }
        
        // ═══════════════════════════════════════════════════════════════════════
        // 2. Add Distro Family Comparison section
        // ═══════════════════════════════════════════════════════════════════════
        
        const comparisonSection = document.createElement('div');
        comparisonSection.className = 'linux-section linux-enhanced-section';
        comparisonSection.style.cssText = 'background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px;';
        comparisonSection.innerHTML = `
            <h2 style="color: #10b981; margin-bottom: 20px;">🔄 Distro Family Comparison</h2>
            <p style="color: #a1a1aa; margin-bottom: 20px;">Understanding the two major Linux families helps you transfer skills between distributions.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                <div style="background: #27272a; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
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
                
                <div style="background: #27272a; border-radius: 8px; padding: 20px; border-left: 4px solid #ef4444;">
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
                    and firewall tools (<code style="background: #18181b; padding: 2px 4px; border-radius: 3px;">ufw</code> vs <code style="background: #18181b; padding: 2px 4px; border-radius: 3px;">firewalld</code>).
                </p>
            </div>
        `;
        
        // ═══════════════════════════════════════════════════════════════════════
        // 3. Add Deep Dive Guides section (links to detailed guides)
        // ═══════════════════════════════════════════════════════════════════════
        
        const deepDiveSection = document.createElement('div');
        deepDiveSection.className = 'linux-section linux-enhanced-section';
        deepDiveSection.style.cssText = 'background: linear-gradient(135deg, #18181b, #1e1b4b); border: 1px solid #4f46e5; border-radius: 12px; padding: 25px; margin-bottom: 25px;';
        deepDiveSection.innerHTML = `
            <h2 style="color: #a78bfa; margin-bottom: 15px;">📖 Deep Dive Guides</h2>
            <p style="color: #a1a1aa; margin-bottom: 20px;">
                Comprehensive command references with distro-specific syntax. Click to open detailed guides.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                <!-- Debian Deep Dive Card -->
                <div class="deep-dive-card" style="background: #27272a; border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s;"
                     onmouseover="this.style.borderColor='#60a5fa'; this.style.transform='translateY(-2px)'"
                     onmouseout="this.style.borderColor='#3b82f6'; this.style.transform='translateY(0)'">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="font-size: 2rem;">🔷</span>
                        <div>
                            <h3 style="color: #fafafa; margin: 0;">Debian/Ubuntu Guide</h3>
                            <span style="color: #3b82f6; font-size: 0.85rem;">apt-based systems</span>
                        </div>
                    </div>
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 12px;">
                        Covers Debian, Ubuntu, Kali, Mint, and other apt-based distributions.
                    </p>
                    <ul style="color: #71717a; font-size: 0.8rem; margin: 0 0 15px 0; padding-left: 18px;">
                        <li>VM setup walkthrough</li>
                        <li>Package management (apt)</li>
                        <li>User & permission management</li>
                        <li>Security hardening</li>
                    </ul>
                    <button onclick="if(window.LinuxGuide){window.LinuxGuide.show('debian')}else{alert('Deep dive guide loading...')}" 
                            style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%;">
                        Open Debian Guide →
                    </button>
                </div>
                
                <!-- AlmaLinux Deep Dive Card -->
                <div class="deep-dive-card" style="background: #27272a; border: 1px solid #ef4444; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s;"
                     onmouseover="this.style.borderColor='#f87171'; this.style.transform='translateY(-2px)'"
                     onmouseout="this.style.borderColor='#ef4444'; this.style.transform='translateY(0)'">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="font-size: 2rem;">🔴</span>
                        <div>
                            <h3 style="color: #fafafa; margin: 0;">AlmaLinux/RHEL Guide</h3>
                            <span style="color: #ef4444; font-size: 0.85rem;">dnf/yum-based systems</span>
                        </div>
                    </div>
                    <p style="color: #a1a1aa; font-size: 0.9rem; margin-bottom: 12px;">
                        Covers AlmaLinux, Rocky, RHEL, CentOS, and Fedora.
                    </p>
                    <ul style="color: #71717a; font-size: 0.8rem; margin: 0 0 15px 0; padding-left: 18px;">
                        <li>VM setup walkthrough</li>
                        <li>Package management (dnf/yum)</li>
                        <li>SELinux configuration</li>
                        <li>Enterprise hardening</li>
                    </ul>
                    <button onclick="if(window.LinuxGuide){window.LinuxGuide.show('almalinux')}else{alert('Deep dive guide loading...')}" 
                            style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; width: 100%;">
                        Open AlmaLinux Guide →
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 12px; background: #27272a50; border-radius: 8px; text-align: center;">
                <span style="color: #71717a; font-size: 0.85rem;">
                    💡 Keyboard shortcut: Press <kbd style="background: #3f3f46; padding: 2px 8px; border-radius: 4px; border: 1px solid #52525b;">Ctrl+Shift+L</kbd> to open the full Linux reference guide
                </span>
            </div>
        `;
        
        // ═══════════════════════════════════════════════════════════════════════
        // 4. Insert the new sections at the end of linux-sections
        // ═══════════════════════════════════════════════════════════════════════
        
        linuxSections.appendChild(comparisonSection);
        linuxSections.appendChild(deepDiveSection);
        
        console.log('   ✅ Added Distro Family Comparison section');
        console.log('   ✅ Added Deep Dive Guides section');
        console.log('✅ Linux page enhancement complete!');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // KEYBOARD SHORTCUT - Opens detailed Linux Guide
    // ═══════════════════════════════════════════════════════════════════════════
    
    function setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + L opens detailed Linux Guide
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                if (window.LinuxGuide && typeof window.LinuxGuide.show === 'function') {
                    window.LinuxGuide.show();
                } else {
                    // Fallback to regular Linux page
                    if (typeof showLinuxSetup === 'function') {
                        showLinuxSetup();
                    }
                }
            }
        });
        console.log('   ✅ Keyboard shortcut registered (Ctrl+Shift+L)');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // OBSERVER - Watch for page changes to apply enhancements
    // ═══════════════════════════════════════════════════════════════════════════
    
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            // Check if Linux page was just loaded
            const content = document.getElementById('content');
            if (content && content.querySelector('.linux-sections') && !content.querySelector('.linux-enhanced-marker')) {
                // Small delay to ensure original content is fully rendered
                setTimeout(enhanceLinuxPage, 150);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('   ✅ Page observer active');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZE
    // ═══════════════════════════════════════════════════════════════════════════
    
    function initialize() {
        console.log('🐧 Initializing Linux Guide enhancements...');
        
        // Setup observer to watch for Linux page
        setupObserver();
        
        // Setup keyboard shortcut
        setupKeyboardShortcut();
        
        // Try to enhance if already on Linux page
        setTimeout(enhanceLinuxPage, 500);
        
        console.log('✅ Linux Guide Integration ready');
        console.log('📝 Original content will be preserved');
        console.log('➕ New distros + Deep Dive sections will be added');
    }
    
    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STYLES
    // ═══════════════════════════════════════════════════════════════════════════
    
    const style = document.createElement('style');
    style.textContent = `
        .deep-dive-card:hover {
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
        }
        
        .linux-enhanced-section {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        kbd {
            font-family: 'JetBrains Mono', monospace;
        }
    `;
    document.head.appendChild(style);
    
})();
