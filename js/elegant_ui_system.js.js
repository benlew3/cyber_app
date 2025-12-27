// ================================================
// APP.JS UPDATES FOR ELEGANT DESIGN SYSTEM
// Key function updates to use new class names
// ================================================

// NOTE: These are the KEY UPDATES needed in your app.js file
// Search for these functions and update them as shown

// ================================================
// UPDATE 1: createHeader() function
// ================================================
function createHeader() {
    const header = document.createElement('header');
    header.className = 'header'; // Use elegant header class
    header.innerHTML = `
        <div class="header-content">
            <div class="logo">Security+</div>
            <nav class="nav">
                <button class="nav-item active" onclick="showDashboard()">Dashboard</button>
                <div class="dropdown">
                    <button class="nav-item dropdown-toggle">Domains</button>
                    <div class="dropdown-content">
                        ${DOMAINS.map((domain, i) => `
                            <a href="#" onclick="showDomainView(${i + 1})">${domain.name}</a>
                        `).join('')}
                    </div>
                </div>
                <button class="nav-item" onclick="showAllSimulations()">Simulations</button>
                <button class="nav-item" onclick="showPracticeExam()">Practice Exam</button>
                <button class="nav-item" onclick="showProgress()">Progress</button>
                <button class="nav-item" onclick="showGlossary()">Glossary</button>
            </nav>
        </div>
    `;
    return header;
}

// ================================================
// UPDATE 2: showDashboard() function
// ================================================
function showDashboard() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container animate-fadeIn">
            <!-- Welcome Section -->
            <div class="mb-6">
                <h1 class="mb-2">Welcome back</h1>
                <p class="text-muted">Continue your Security+ certification journey</p>
            </div>
            
            <!-- Overall Progress Card -->
            <div class="card mb-6">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <h3 class="mb-1">Overall Progress</h3>
                        <p class="text-sm text-muted">${APP.progress.overallProgress}% Complete</p>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold">${APP.progress.totalScore}/100</div>
                        <div class="text-sm text-muted">Points earned</div>
                    </div>
                </div>
                <div class="progress">
                    <div class="progress-bar" style="width: ${APP.progress.overallProgress}%;"></div>
                </div>
            </div>
            
            <!-- Domain Cards Grid -->
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                ${DOMAINS.map((domain, index) => {
                    const domainProgress = APP.progress.domains[index + 1];
                    const isActive = domainProgress?.lessonsViewed > 0;
                    const progressPercent = calculateDomainProgress(index + 1);
                    
                    return `
                        <div class="card domain-card animate-slideUp" style="animation-delay: ${index * 0.1}s;">
                            <div class="card-header">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="card-title">${domain.name}</h3>
                                        <p class="card-subtitle">Domain ${index + 1} • ${domain.examWeight} of exam</p>
                                    </div>
                                    <span class="badge ${isActive ? 'badge-primary' : ''}">
                                        ${isActive ? 'Active' : 'Not Started'}
                                    </span>
                                </div>
                            </div>
                            <div class="mb-4">
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-muted">Progress</span>
                                    <span>${progressPercent}%</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-primary btn-sm" onclick="showDomainView(${index + 1})">
                                    ${isActive ? 'Continue' : 'Start'} Learning
                                </button>
                                <button class="btn btn-ghost btn-sm" onclick="showDomainOverview(${index + 1})">
                                    Overview
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-6">
                <h2 class="mb-4">Quick Actions</h2>
                <div class="flex gap-3 flex-wrap">
                    ${APP.lastActivity.type ? `
                        <button class="btn btn-primary" onclick="continueLearning()">
                            <span>📚</span>
                            Continue: ${APP.lastActivity.title}
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="showAllSimulations()">
                        <span>🎮</span>
                        Start Simulation
                    </button>
                    <button class="btn btn-secondary" onclick="startRandomQuiz()">
                        <span>📝</span>
                        Quick Quiz
                    </button>
                    <button class="btn btn-secondary" onclick="showPracticeExam()">
                        <span>🎯</span>
                        Practice Exam
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Update UI after render
    if (window.ElegantUI) {
        window.ElegantUI.updateUI();
    }
}

// ================================================
// UPDATE 3: showDomainView() function
// ================================================
function showDomainView(domainId) {
    const domain = DOMAINS[domainId - 1];
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container animate-fadeIn">
            <button class="btn btn-ghost mb-4" onclick="showDashboard()">
                ← Back to Dashboard
            </button>
            
            <div class="domain-header card">
                <h1>${domain.name}</h1>
                <p class="text-muted">${domain.description}</p>
                <div class="mt-4">
                    <span class="badge badge-domain-${domainId}">${domain.examWeight} of exam</span>
                </div>
            </div>
            
            <div class="learning-options-grid">
                <div class="learning-card" onclick="showLessons(${domainId})">
                    <div class="card-icon">📚</div>
                    <h3>Lessons</h3>
                    <p class="text-muted">Study comprehensive materials</p>
                    <button class="btn btn-primary btn-sm">View Lessons</button>
                </div>
                
                <div class="learning-card" onclick="showSimulations(${domainId})">
                    <div class="card-icon">🎮</div>
                    <h3>Simulations</h3>
                    <p class="text-muted">Practice real-world scenarios</p>
                    <button class="btn btn-primary btn-sm">Start Simulation</button>
                </div>
                
                <div class="learning-card" onclick="showQuiz(${domainId})">
                    <div class="card-icon">📝</div>
                    <h3>Quizzes</h3>
                    <p class="text-muted">Test your knowledge</p>
                    <button class="btn btn-primary btn-sm">Take Quiz</button>
                </div>
                
                <div class="learning-card" onclick="showFlashcards(${domainId})">
                    <div class="card-icon">🎴</div>
                    <h3>Flashcards</h3>
                    <p class="text-muted">Quick review key terms</p>
                    <button class="btn btn-primary btn-sm">Study Cards</button>
                </div>
            </div>
            
            <div class="domain-progress">
                <h3>Your Progress</h3>
                <div class="progress-stats">
                    <div class="stat">
                        <div class="stat-value">${APP.progress.domains[domainId]?.lessonsCompleted || 0}</div>
                        <div class="stat-label">Lessons Completed</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${APP.progress.domains[domainId]?.simulationsCompleted || 0}</div>
                        <div class="stat-label">Simulations Done</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${APP.progress.domains[domainId]?.quizScore || 0}%</div>
                        <div class="stat-label">Quiz Average</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ================================================
// UPDATE 4: Quiz Question Display
// ================================================
function displayQuestion(question, index, total) {
    return `
        <div class="quiz-container">
            <div class="text-center mb-6">
                <h2>Question ${index + 1} of ${total}</h2>
                <div class="progress mt-3">
                    <div class="progress-bar" style="width: ${((index + 1) / total) * 100}%;"></div>
                </div>
            </div>
            
            <div class="quiz-question">
                <h3>${question.question}</h3>
                
                <div class="quiz-options">
                    ${question.options.map((option, i) => `
                        <div class="quiz-option" onclick="selectQuizOption(${i})" data-option="${i}">
                            <div class="flex items-center gap-3">
                                <div class="option-letter">${String.fromCharCode(65 + i)}</div>
                                <span>${option}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="flex justify-between mt-6">
                <button class="btn btn-ghost" onclick="previousQuestion()" 
                        ${index === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <button class="btn btn-primary" onclick="submitAnswer()">
                    ${index === total - 1 ? 'Finish Quiz' : 'Next Question'} →
                </button>
            </div>
        </div>
    `;
}

// ================================================
// UPDATE 5: Simulation Display with Elegant Cards
// ================================================
function showSimulations(domainId) {
    const simulations = getSimulationsForDomain(domainId);
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container animate-fadeIn">
            <button class="btn btn-ghost mb-4" onclick="showDomainView(${domainId})">
                ← Back to Domain ${domainId}
            </button>
            
            <h1 class="mb-2">Domain ${domainId} Simulations</h1>
            <p class="text-muted mb-6">Practice real-world security scenarios</p>
            
            <div class="simulations-grid">
                ${simulations.map((sim, index) => `
                    <div class="simulation-card ${sim.completed ? 'completed' : ''} animate-slideUp" 
                         style="animation-delay: ${index * 0.1}s;">
                        <h3>${sim.title}</h3>
                        <p class="text-muted">${sim.scenario}</p>
                        
                        <div class="sim-meta">
                            <span class="badge difficulty-${sim.difficulty}">
                                ${sim.difficulty}
                            </span>
                            <span class="text-sm text-muted">${sim.duration}</span>
                        </div>
                        
                        ${sim.completed ? `
                            <div class="mt-4">
                                <div class="text-success font-semibold">✓ Completed</div>
                                <div class="text-sm text-muted">Score: ${sim.score}%</div>
                            </div>
                        ` : ''}
                        
                        <button class="btn btn-primary mt-4" 
                                onclick="startSimulation('${sim.id}')">
                            ${sim.completed ? 'Retry' : 'Start'} Simulation
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ================================================
// UPDATE 6: Show Results with Elegant Score Display
// ================================================
function showQuizResults(score, total, questions) {
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;
    
    return `
        <div class="container animate-fadeIn">
            <div class="text-center">
                <h1 class="mb-6">Quiz Complete!</h1>
                
                <div class="card" style="max-width: 600px; margin: 0 auto;">
                    <div class="score-display ${passed ? 'passed' : 'failed'}">
                        <div class="score-value">${percentage}%</div>
                        <div class="text-lg text-muted mt-2">
                            ${score} out of ${total} correct
                        </div>
                    </div>
                    
                    <div class="mt-6">
                        <div class="badge ${passed ? 'badge-success' : 'badge-warning'}">
                            ${passed ? '✓ PASSED' : '⚠ NEEDS IMPROVEMENT'}
                        </div>
                    </div>
                    
                    ${!passed ? `
                        <div class="alert alert-warning mt-6">
                            <p>A score of 70% or higher is needed to pass. Review the material and try again!</p>
                        </div>
                    ` : ''}
                    
                    <div class="flex gap-3 justify-center mt-6">
                        <button class="btn btn-primary" onclick="reviewQuizAnswers()">
                            Review Answers
                        </button>
                        <button class="btn btn-secondary" onclick="retakeQuiz()">
                            Retake Quiz
                        </button>
                        <button class="btn btn-ghost" onclick="showDashboard()">
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ================================================
// UPDATE 7: Lesson Viewer with Elegant Sidebar
// ================================================
function showLessonContent(lessonId) {
    const lesson = getLessonById(lessonId);
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="container animate-fadeIn">
            <div class="lesson-viewer">
                <!-- Sidebar Navigation -->
                <aside class="lesson-sidebar">
                    <h4 class="mb-4">Lesson Sections</h4>
                    <nav class="lesson-nav">
                        ${lesson.sections.map((section, i) => `
                            <div class="nav-item ${i === 0 ? 'active' : ''}" 
                                 onclick="scrollToSection('section-${i}')">
                                ${i + 1}. ${section.title}
                            </div>
                        `).join('')}
                        <div class="nav-item quiz" onclick="startLessonQuiz('${lessonId}')">
                            Take Quiz →
                        </div>
                    </nav>
                </aside>
                
                <!-- Main Content -->
                <main class="lesson-content">
                    <h1>${lesson.title}</h1>
                    <p class="text-muted mb-6">${lesson.description}</p>
                    
                    <div class="lesson-objectives">
                        <h3>Learning Objectives</h3>
                        <ul>
                            ${lesson.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${lesson.sections.map((section, i) => `
                        <div class="lesson-section" id="section-${i}">
                            <h2>${section.title}</h2>
                            <div>${section.content}</div>
                        </div>
                    `).join('')}
                    
                    <div class="lesson-footer">
                        <button class="btn btn-ghost" onclick="previousLesson()">
                            ← Previous Lesson
                        </button>
                        <button class="btn btn-primary" onclick="nextLesson()">
                            Next Lesson →
                        </button>
                    </div>
                </main>
            </div>
        </div>
    `;
}

// ================================================
// UPDATE 8: Add notification support
// ================================================
function showNotification(message, type = 'info') {
    if (window.notify) {
        window.notify.show(message, type);
    } else {
        // Fallback to alert if elegant system not loaded
        console.log(`[${type}] ${message}`);
    }
}

// Example usage in your functions:
function saveProgress() {
    localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
    showNotification('Progress saved!', 'success');
}

function completeLesson(lessonId) {
    // Your completion logic...
    showNotification('Lesson completed! Great job!', 'success');
}

function submitQuizAnswer() {
    if (isCorrect) {
        showNotification('Correct answer!', 'success');
    } else {
        showNotification('Incorrect. Try again!', 'error');
    }
}

// ================================================
// UPDATE 9: Initialize elegant UI after app loads
// ================================================
// Add this to your initApp() function:
function initApp() {
    // Your existing initialization...
    
    // Apply elegant UI enhancements
    setTimeout(() => {
        if (window.ElegantUI) {
            window.ElegantUI.updateUI();
            console.log('✨ Elegant UI applied');
        }
    }, 100);
    
    // Show welcome notification
    if (window.notify) {
        window.notify.show('Welcome to Security+ Training Platform!', 'info');
    }
}

// ================================================
// ADDITIONAL NOTES:
// ================================================

/*
KEY CHANGES TO MAKE THROUGHOUT YOUR APP.JS:

1. Replace inline styles with classes:
   OLD: style="background: #18181b; padding: 20px;"
   NEW: class="card"

2. Use semantic button classes:
   OLD: <button style="background: #6366f1; color: white;">
   NEW: <button class="btn btn-primary">

3. Use progress bar component:
   OLD: Custom progress HTML
   NEW: <div class="progress"><div class="progress-bar" style="width: X%"></div></div>

4. Use badge classes:
   OLD: <span style="background: rgba(...)">
   NEW: <span class="badge badge-primary">

5. Use utility classes for spacing:
   OLD: style="margin-bottom: 20px"
   NEW: class="mb-4"

6. Add animations to new content:
   class="animate-fadeIn" or "animate-slideUp"

7. Use consistent containers:
   Wrap all main content in: <div class="container">

8. Use card components for all boxes:
   OLD: <div style="background: #27272a">
   NEW: <div class="card">

9. Update form inputs:
   OLD: <input style="...">
   NEW: <input class="form-input">

10. Use the notification system:
    showNotification('Message', 'success/error/warning/info');

The theme toggle will appear automatically in the bottom-right corner!
Users can press Ctrl+/ to toggle between dark and light modes.
*/
