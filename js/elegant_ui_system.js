// ================================================
// ELEGANT UI SYSTEM - ENHANCEMENTS ONLY
// Adds theme toggle, notifications, animations
// Does NOT override any core app.js functions
// ================================================

(function() {
    'use strict';
    
    console.log('🎨 Loading Elegant UI System...');

    // ================================================
    // THEME SYSTEM
    // ================================================
    const ThemeManager = {
        currentTheme: 'dark',
        
        init() {
            // Load saved theme or default to dark
            this.currentTheme = localStorage.getItem('securityPlusTheme') || 'dark';
            this.apply(this.currentTheme);
            this.createToggleButton();
            this.setupKeyboardShortcut();
            console.log(`🎨 Theme initialized: ${this.currentTheme}`);
        },
        
        apply(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.setAttribute('data-theme', theme);
            this.currentTheme = theme;
            localStorage.setItem('securityPlusTheme', theme);
            
            // Update toggle button icon if it exists
            const btn = document.getElementById('theme-toggle-btn');
            if (btn) {
                btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
                btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            }
        },
        
        toggle() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.apply(newTheme);
            Notify.show(`Switched to ${newTheme} mode`, 'info');
        },
        
        createToggleButton() {
            // Remove existing button if any
            const existing = document.getElementById('theme-toggle-btn');
            if (existing) existing.remove();
            
            const btn = document.createElement('button');
            btn.id = 'theme-toggle-btn';
            btn.className = 'theme-toggle-btn';
            btn.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            btn.title = this.currentTheme === 'dark' ? 'Switch to Light Mode (Ctrl+/)' : 'Switch to Dark Mode (Ctrl+/)';
            btn.onclick = () => this.toggle();
            
            document.body.appendChild(btn);
        },
        
        setupKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === '/') {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }
    };

    // ================================================
    // NOTIFICATION SYSTEM
    // ================================================
    const Notify = {
        container: null,
        
        init() {
            // Create notification container
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
            console.log('🔔 Notification system initialized');
        },
        
        show(message, type = 'info', duration = 3000) {
            if (!this.container) this.init();
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            notification.innerHTML = `
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.remove()">×</button>
            `;
            
            this.container.appendChild(notification);
            
            // Trigger animation
            requestAnimationFrame(() => {
                notification.classList.add('notification-show');
            });
            
            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    notification.classList.remove('notification-show');
                    notification.classList.add('notification-hide');
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }
            
            return notification;
        },
        
        success(message, duration) { return this.show(message, 'success', duration); },
        error(message, duration) { return this.show(message, 'error', duration); },
        warning(message, duration) { return this.show(message, 'warning', duration); },
        info(message, duration) { return this.show(message, 'info', duration); }
    };

    // ================================================
    // ANIMATION HELPERS
    // ================================================
    const Animate = {
        // Add fade-in animation to element
        fadeIn(element, duration = 300) {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease`;
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        },
        
        // Add slide-up animation to element
        slideUp(element, duration = 300) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        },
        
        // Animate multiple elements with stagger
        staggerIn(selector, delay = 100) {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 300ms ease, transform 300ms ease';
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, i * delay);
            });
        },
        
        // Pulse animation for attention
        pulse(element) {
            element.classList.add('pulse-animation');
            setTimeout(() => element.classList.remove('pulse-animation'), 600);
        }
    };

    // ================================================
    // UI ENHANCEMENT HELPERS
    // ================================================
    const UIHelpers = {
        // Enhance buttons with ripple effect
        addRippleEffect() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn, .domain-card, .lesson-card, .sim-card');
                if (!btn) return;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        },
        
        // Add smooth scroll behavior
        enableSmoothScroll() {
            document.documentElement.style.scrollBehavior = 'smooth';
        },
        
        // Enhance focus states for accessibility
        enhanceFocusStates() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },
        
        // Auto-animate new content when views change
        observeContentChanges() {
            const content = document.getElementById('content');
            if (!content) return;
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Animate cards when they appear
                        setTimeout(() => {
                            Animate.staggerIn('.domain-card, .lesson-card, .stat-card, .sim-card', 50);
                        }, 50);
                    }
                });
            });
            
            observer.observe(content, { childList: true, subtree: false });
        }
    };

    // ================================================
    // PROGRESS ENHANCEMENT HELPERS
    // ================================================
    const ProgressHelpers = {
        // Calculate overall progress percentage
        calculateOverallProgress() {
            if (!window.APP) return 0;
            
            const progress = window.APP.progress;
            const totalItems = 
                (window.ALL_LESSONS?.length || 0) + 
                (window.ALL_SIMULATIONS?.length || 0) + 
                (window.ALL_REMEDIATION?.length || 0) + 
                (window.ALL_PBQS?.length || 0);
            
            if (totalItems === 0) return 0;
            
            const completedItems = 
                (progress.completedLessons?.length || 0) + 
                (progress.completedSimulations?.length || 0) + 
                (progress.completedRemediation?.length || 0) + 
                (progress.completedPBQs?.length || 0);
            
            return Math.round((completedItems / totalItems) * 100);
        },
        
        // Calculate domain-specific progress
        calculateDomainProgress(domainId) {
            if (!window.APP || !window.ALL_LESSONS) return 0;
            
            const progress = window.APP.progress;
            
            const domainLessons = window.ALL_LESSONS.filter(l => l.domain === domainId);
            const domainSims = window.ALL_SIMULATIONS?.filter(s => s.domain === domainId) || [];
            const domainRem = window.ALL_REMEDIATION?.filter(r => r.domain === domainId) || [];
            
            const totalDomainItems = domainLessons.length + domainSims.length + domainRem.length;
            if (totalDomainItems === 0) return 0;
            
            const completedLessons = progress.completedLessons?.filter(id => 
                domainLessons.some(l => l.id === id)
            ).length || 0;
            
            const completedSims = progress.completedSimulations?.filter(id =>
                domainSims.some(s => s.id === id)
            ).length || 0;
            
            const completedRem = progress.completedRemediation?.filter(id =>
                domainRem.some(r => r.id === id)
            ).length || 0;
            
            return Math.round(((completedLessons + completedSims + completedRem) / totalDomainItems) * 100);
        },
        
        // Get last activity info
        getLastActivity() {
            if (!window.APP) return null;
            return window.APP.progress.lastActivity || null;
        }
    };

    // ================================================
    // INJECT ENHANCED STYLES
    // ================================================
    function injectEnhancedStyles() {
        if (document.getElementById('elegant-ui-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'elegant-ui-styles';
        style.textContent = `
            /* Theme Toggle Button */
            .theme-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: var(--bg-elevated, #27272a);
                color: var(--text-primary, #fafafa);
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .theme-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0,0,0,0.4);
            }
            
            /* Notification Container */
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            }
            
            /* Notification Styles */
            .notification {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 18px;
                border-radius: 10px;
                background: var(--bg-elevated, #27272a);
                border: 1px solid var(--border-color, #3f3f46);
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transform: translateX(120%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification-show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-hide {
                transform: translateX(120%);
                opacity: 0;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-warning {
                border-left: 4px solid #f59e0b;
            }
            
            .notification-info {
                border-left: 4px solid #6366f1;
            }
            
            .notification-icon {
                font-size: 1.2rem;
            }
            
            .notification-message {
                flex: 1;
                color: var(--text-primary, #fafafa);
                font-size: 0.95rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted, #71717a);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0 4px;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: var(--text-primary, #fafafa);
            }
            
            /* Ripple Effect */
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Pulse Animation */
            .pulse-animation {
                animation: pulse 0.6s ease;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* Enhanced Focus States for Keyboard Navigation */
            .keyboard-navigation *:focus {
                outline: 2px solid #6366f1 !important;
                outline-offset: 2px !important;
            }
            
            /* Smooth Fade-in Animation Class */
            .animate-fadeIn {
                animation: fadeIn 0.3s ease forwards;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Slide Up Animation Class */
            .animate-slideUp {
                animation: slideUp 0.3s ease forwards;
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Light Theme Overrides */
            [data-theme="light"] {
                --bg-primary: #ffffff;
                --bg-surface: #f4f4f5;
                --bg-elevated: #e4e4e7;
                --text-primary: #18181b;
                --text-secondary: #52525b;
                --text-muted: #71717a;
                --border-color: #d4d4d8;
            }
            
            [data-theme="light"] body {
                background: #ffffff !important;
                color: #18181b !important;
            }
            
            [data-theme="light"] .container {
                background: #ffffff;
            }
            
            [data-theme="light"] .domain-card,
            [data-theme="light"] .lesson-card,
            [data-theme="light"] .stat-card,
            [data-theme="light"] .card {
                background: #f4f4f5 !important;
                border-color: #d4d4d8 !important;
            }
            
            [data-theme="light"] .domain-card:hover,
            [data-theme="light"] .lesson-card:hover {
                background: #e4e4e7 !important;
            }
            
            [data-theme="light"] .btn {
                background: #e4e4e7;
                color: #18181b;
                border-color: #d4d4d8;
            }
            
            [data-theme="light"] .btn-primary {
                background: #6366f1;
                color: #ffffff;
            }
            
            [data-theme="light"] .page-title,
            [data-theme="light"] h1, 
            [data-theme="light"] h2, 
            [data-theme="light"] h3 {
                color: #18181b !important;
            }
            
            [data-theme="light"] .simulation-section,
            [data-theme="light"] .lesson-section {
                background: #f4f4f5 !important;
                border-color: #d4d4d8 !important;
            }
            
            [data-theme="light"] pre,
            [data-theme="light"] code {
                background: #e4e4e7 !important;
            }
            
            [data-theme="light"] .quiz-option,
            [data-theme="light"] .decision-option {
                background: #f4f4f5 !important;
                border-color: #d4d4d8 !important;
            }
            
            [data-theme="light"] .quiz-option:hover,
            [data-theme="light"] .decision-option:hover {
                background: #e4e4e7 !important;
            }
            
            [data-theme="light"] input,
            [data-theme="light"] select,
            [data-theme="light"] textarea {
                background: #ffffff !important;
                border-color: #d4d4d8 !important;
                color: #18181b !important;
            }
            
            [data-theme="light"] .theme-toggle-btn {
                background: #18181b;
                color: #fafafa;
            }
            
            [data-theme="light"] .notification {
                background: #ffffff;
                border-color: #d4d4d8;
            }
            
            [data-theme="light"] .notification-message {
                color: #18181b;
            }
            
            /* Ensure cards have position relative for ripple */
            .domain-card, .lesson-card, .btn, .sim-card {
                position: relative;
                overflow: hidden;
            }
            
            /* Enhanced card hover effects */
            .domain-card, .lesson-card, .sim-card {
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }
            
            .domain-card:hover, .lesson-card:hover, .sim-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
            
            /* Mobile responsive for theme toggle */
            @media (max-width: 768px) {
                .theme-toggle-btn {
                    bottom: 15px;
                    right: 15px;
                    width: 45px;
                    height: 45px;
                    font-size: 1.3rem;
                }
                
                .notification-container {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('💄 Elegant UI styles injected');
    }

    // ================================================
    // ENHANCED SAVE PROGRESS (wraps existing)
    // ================================================
    function enhanceSaveProgress() {
        // Store original saveProgress if it exists
        const originalSaveProgress = window.saveProgress;
        
        window.saveProgress = function() {
            // Call original if it exists
            if (typeof originalSaveProgress === 'function') {
                originalSaveProgress();
            } else if (window.APP) {
                // Fallback save logic
                localStorage.setItem('securityPlusProgress_v33', JSON.stringify(window.APP.progress));
            }
            
            // Show notification
            Notify.success('Progress saved!', 2000);
        };
    }

    // ================================================
    // INITIALIZE ELEGANT UI
    // ================================================
    function initElegantUI() {
        console.log('🎨 Initializing Elegant UI enhancements...');
        
        // Inject styles first
        injectEnhancedStyles();
        
        // Initialize theme
        ThemeManager.init();
        
        // Initialize notifications
        Notify.init();
        
        // Enable UI enhancements
        UIHelpers.enableSmoothScroll();
        UIHelpers.enhanceFocusStates();
        UIHelpers.addRippleEffect();
        
        // Observe content changes for animations
        setTimeout(() => {
            UIHelpers.observeContentChanges();
        }, 500);
        
        // Enhance saveProgress with notifications
        enhanceSaveProgress();
        
        console.log('✨ Elegant UI System Ready!');
        console.log('   - Theme: ' + ThemeManager.currentTheme);
        console.log('   - Keyboard shortcut: Ctrl+/ to toggle theme');
    }

    // ================================================
    // EXPORT TO GLOBAL SCOPE
    // ================================================
    window.ElegantUI = {
        theme: ThemeManager,
        notify: Notify,
        animate: Animate,
        helpers: UIHelpers,
        progress: ProgressHelpers,
        
        // Convenience methods
        toggleTheme: () => ThemeManager.toggle(),
        showNotification: (msg, type, duration) => Notify.show(msg, type, duration),
        
        // Re-initialize (useful after major DOM changes)
        refresh() {
            ThemeManager.createToggleButton();
            UIHelpers.observeContentChanges();
        }
    };
    
    // Also expose Notify directly for convenience
    window.notify = Notify;

    // ================================================
    // AUTO-INITIALIZE
    // ================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initElegantUI);
    } else {
        // DOM already loaded
        initElegantUI();
    }

})();
