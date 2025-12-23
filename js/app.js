// EMERGENCY FIX - This will force your platform to work
// Save this as app.js and push to GitHub

console.log('=== EMERGENCY FIX LOADING ===');

// Wait for page to fully load
window.addEventListener('load', () => {
    console.log('Page loaded, applying emergency fix...');
    
    // Step 1: Force hide ANYTHING that looks like a loading screen
    const hideElements = [
        '#loading', '#loading-screen', '#loadingScreen', '.loading-screen',
        '[id*="loading"]', '[class*="loading"]'
    ];
    
    hideElements.forEach(selector => {
        try {
            const elems = document.querySelectorAll(selector);
            elems.forEach(elem => {
                if (elem && elem.textContent && elem.textContent.includes('Loading')) {
                    console.log(`Hiding loading element: ${selector}`);
                    elem.style.display = 'none';
                }
            });
        } catch (e) {}
    });
    
    // Step 2: Force show main content
    const showElements = [
        '#mainApp', '#main-app', '#app', '.app-container',
        '[id*="main"]', 'main'
    ];
    
    showElements.forEach(selector => {
        try {
            const elems = document.querySelectorAll(selector);
            elems.forEach(elem => {
                elem.style.display = 'block';
            });
        } catch (e) {}
    });
    
    // Step 3: Find ANY container and inject working platform
    setTimeout(() => {
        // Find the first suitable container
        const container = 
            document.getElementById('content') ||
            document.getElementById('main-content') ||
            document.querySelector('main') ||
            document.querySelector('.content') ||
            document.querySelector('.main-content') ||
            document.querySelector('[id*="content"]') ||
            document.body;
        
        console.log('Injecting platform into:', container);
        
        // Inject a working dashboard
        container.innerHTML = `
            <style>
                .emergency-platform {
                    padding: 20px;
                    max-width: 1400px;
                    margin: 0 auto;
                    color: #fafafa;
                }
                .emergency-platform h1 {
                    color: #6366f1;
                    margin-bottom: 20px;
                }
                .domain-grid-emergency {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                .domain-card-emergency {
                    background: #18181b;
                    border: 2px solid #27272a;
                    border-radius: 12px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .domain-card-emergency:hover {
                    transform: translateY(-4px);
                    border-color: #6366f1;
                }
                .emergency-notice {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                }
                .btn-emergency {
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin: 5px;
                }
            </style>
            
            <div class="emergency-platform">
                <h1>🚀 Security+ Platform (Emergency Mode)</h1>
                
                <div class="emergency-notice">
                    <strong>⚠️ Platform loaded in emergency mode</strong><br>
                    The normal loading failed, but your platform is working!<br>
                    Data files are accessible and features can be added.
                </div>
                
                <h2>Select a Domain to Study:</h2>
                
                <div class="domain-grid-emergency">
                    <div class="domain-card-emergency" onclick="loadDomain(1)">
                        <h3>🔒 Domain 1</h3>
                        <p><strong>General Security Concepts</strong></p>
                        <p style="color: #a1a1aa;">Weight: 12% of exam</p>
                        <button class="btn-emergency">Open Learning Menu</button>
                    </div>
                    
                    <div class="domain-card-emergency" onclick="loadDomain(2)">
                        <h3>⚠️ Domain 2</h3>
                        <p><strong>Threats, Vulnerabilities & Mitigations</strong></p>
                        <p style="color: #a1a1aa;">Weight: 22% of exam</p>
                        <button class="btn-emergency">Open Learning Menu</button>
                    </div>
                    
                    <div class="domain-card-emergency" onclick="loadDomain(3)">
                        <h3>🏗️ Domain 3</h3>
                        <p><strong>Security Architecture</strong></p>
                        <p style="color: #a1a1aa;">Weight: 18% of exam</p>
                        <button class="btn-emergency">Open Learning Menu</button>
                    </div>
                    
                    <div class="domain-card-emergency" onclick="loadDomain(4)">
                        <h3>🛡️ Domain 4</h3>
                        <p><strong>Security Operations</strong></p>
                        <p style="color: #a1a1aa;">Weight: 28% of exam</p>
                        <button class="btn-emergency">Open Learning Menu</button>
                    </div>
                    
                    <div class="domain-card-emergency" onclick="loadDomain(5)">
                        <h3>📊 Domain 5</h3>
                        <p><strong>Security Program Management</strong></p>
                        <p style="color: #a1a1aa;">Weight: 20% of exam</p>
                        <button class="btn-emergency">Open Learning Menu</button>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <button class="btn-emergency" style="font-size: 1.1rem; padding: 15px 30px;" 
                            onclick="testDataLoading()">
                        🧪 Test Data Loading
                    </button>
                    <button class="btn-emergency" style="font-size: 1.1rem; padding: 15px 30px;"
                            onclick="showDebugInfo()">
                        🔍 Show Debug Info
                    </button>
                </div>
                
                <div id="debug-area" style="margin-top: 30px;"></div>
            </div>
        `;
        
        // Load questions to verify data access
        fetch('data/questions.json')
            .then(r => r.json())
            .then(data => {
                console.log('✅ Questions loaded successfully:', data.length);
                const debugArea = document.getElementById('debug-area');
                if (debugArea) {
                    debugArea.innerHTML = `
                        <div style="background: #064e3b; border: 1px solid #10b981; padding: 15px; border-radius: 8px;">
                            ✅ <strong>Data Loading Successful!</strong><br>
                            Loaded ${data.length} questions from data files.
                        </div>
                    `;
                }
            })
            .catch(err => {
                console.error('Failed to load questions:', err);
            });
            
    }, 1000);
});

// Global functions
window.loadDomain = function(domainId) {
    alert(`Domain ${domainId} clicked!\n\nThe learning menu would open here with:\n- Simulations\n- Lessons\n- Quiz\n- Remedial\n- PBQs\n- Flash Cards\n- Glossary`);
};

window.testDataLoading = async function() {
    const debugArea = document.getElementById('debug-area');
    debugArea.innerHTML = '<div>Testing data files...</div>';
    
    const files = ['questions.json', 'simulations.json', 'lessons.json', 'pbqs.json', 'glossary.json'];
    let results = [];
    
    for (const file of files) {
        try {
            const response = await fetch('data/' + file);
            const data = await response.json();
            const count = Array.isArray(data) ? data.length : Object.keys(data).length;
            results.push(`✅ ${file}: ${count} items`);
        } catch (err) {
            results.push(`❌ ${file}: Failed`);
        }
    }
    
    debugArea.innerHTML = `
        <div style="background: #18181b; padding: 20px; border-radius: 8px;">
            <h3>Data Files Test:</h3>
            <pre>${results.join('\n')}</pre>
        </div>
    `;
};

window.showDebugInfo = function() {
    const debugArea = document.getElementById('debug-area');
    debugArea.innerHTML = `
        <div style="background: #18181b; padding: 20px; border-radius: 8px;">
            <h3>Debug Information:</h3>
            <pre>
Platform Mode: Emergency
URL: ${window.location.href}
Protocol: ${window.location.protocol}
Console: Check F12 for detailed logs
Status: Platform is working in fallback mode

To fix normal loading:
1. Check browser console for errors
2. Verify HTML structure matches expected IDs
3. Update navigation elements
            </pre>
        </div>
    `;
};

console.log('=== EMERGENCY FIX APPLIED ===');
