// Security+ Platform - MINIMAL WORKING VERSION
// This simplified version will help identify the issue

console.log('App.js loaded - starting initialization...');

// Simple state
const APP = {
    content: {
        questions: [],
        simulations: [],
        lessons: [],
        pbqs: [],
        glossary: {}
    }
};

// Load and start immediately
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    
    // Try to load one file as a test
    try {
        console.log('Fetching questions.json...');
        const response = await fetch('data/questions.json');
        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Questions loaded:', data.length);
            APP.content.questions = data;
        }
    } catch (error) {
        console.error('Error loading questions:', error);
    }
    
    // Force hide loading and show content
    console.log('Hiding loading screen...');
    
    // Try multiple possible IDs for the loading screen
    ['loading', 'loading-screen', 'loadingScreen'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            console.log(`Found loading element with ID: ${id}`);
            elem.style.display = 'none';
        }
    });
    
    // Try multiple possible IDs for the main app
    ['mainApp', 'main-app', 'app', 'content'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            console.log(`Found main element with ID: ${id}`);
            elem.style.display = 'block';
        }
    });
    
    // Find the content area and add something
    const content = document.getElementById('content') || 
                   document.getElementById('main-content') ||
                   document.querySelector('.content') ||
                   document.querySelector('main');
    
    if (content) {
        console.log('Content area found, adding dashboard...');
        content.innerHTML = `
            <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
                <h1 style="color: #6366f1;">Security+ Platform Loaded!</h1>
                <p>Questions loaded: ${APP.content.questions.length}</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px;">
                    ${[1,2,3,4,5].map(i => `
                        <div style="background: #18181b; padding: 20px; border-radius: 12px; border: 2px solid #27272a; cursor: pointer;"
                             onclick="alert('Domain ${i} clicked!')">
                            <h3>Domain ${i}</h3>
                            <p style="color: #a1a1aa;">Click to open menu</p>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #18181b; border-radius: 8px;">
                    <h3>Debug Info:</h3>
                    <pre style="color: #10b981;">
Questions loaded: ${APP.content.questions.length}
Platform working: YES
Click any domain to test
                    </pre>
                </div>
            </div>
        `;
    } else {
        console.error('No content area found!');
        // Try to add content to body as last resort
        document.body.innerHTML += '<div style="padding: 20px; color: white;"><h1>Platform loaded but no content area found</h1></div>';
    }
});

// Log all errors
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.message, e.filename, e.lineno);
});

console.log('App.js setup complete');
