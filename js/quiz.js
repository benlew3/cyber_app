// Security+ Platform v11.0 - Quiz Module
// Complete quiz functionality with all features

// Render Quiz View
function renderQuizView() {
    return `
        <div class="container">
            <div class="quiz-container" id="quizContainer">
                <!-- Quiz content will be loaded here -->
            </div>
            <div class="quiz-container hidden" id="quizResults">
                <!-- Results will be shown here -->
            </div>
        </div>
    `;
}

// Start Quiz
function startQuiz(questions) {
    if (!questions || questions.length === 0) {
        questions = APP.content.questions;
    }
    
    APP.state.quizQuestions = questions;
    
    // Apply adaptive learning if enabled
    if (APP.settings.adaptiveLearning) {
        APP.state.quizQuestions = applyAdaptiveLearning(APP.state.quizQuestions);
    }
    
    // Shuffle questions
    APP.state.quizQuestions = shuffleArray(APP.state.quizQuestions);
    
    // Limit to 50 questions for domain quizzes
    if (APP.state.quizQuestions.length > 50) {
        APP.state.quizQuestions = APP.state.quizQuestions.slice(0, 50);
    }
    
    APP.state.currentQuestionIndex = 0;
    APP.state.score = 0;
    
    loadQuestion();
}

// Load Question
function loadQuestion() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    if (!question) {
        showQuizResults();
        return;
    }
    
    const isFlagged = APP.progress.flaggedQuestions.includes(question.id);
    
    container.innerHTML = `
        <div class="question-header">
            <div>
                <span>Question ${APP.state.currentQuestionIndex + 1} of ${APP.state.quizQuestions.length}</span>
                <span class="badge badge-info" style="margin-left: 1rem;">
                    Domain ${question.domain}
                </span>
            </div>
            <button class="btn ${isFlagged ? 'btn-danger' : 'btn-warning'}" 
                    onclick="toggleFlag('${question.id}')">
                🚩 ${isFlagged ? 'Flagged' : 'Flag'}
            </button>
        </div>
        
        <div class="question-text">
            ${question.question || question.text}
        </div>
        
        <div class="options" id="optionsContainer">
            ${(question.options || []).map((option, index) => `
                <div class="option" 
                     data-index="${index}"
                     onclick="selectOption(${index})">
                    ${String.fromCharCode(65 + index)}. ${option}
                </div>
            `).join('')}
        </div>
        
        <div class="explanation hidden" id="explanationBox">
            <strong>Explanation:</strong>
            <p>${question.explanation}</p>
        </div>
        
        <div class="text-center mt-2">
            <button class="btn btn-primary" id="submitBtn" onclick="submitAnswer()">
                Submit Answer
            </button>
            <button class="btn btn-success hidden" id="nextBtn" onclick="nextQuestion()">
                Next Question →
            </button>
            <button class="btn btn-secondary" onclick="skipQuestion()">
                Skip Question
            </button>
        </div>
    `;
    
    APP.state.selectedAnswer = null;
}

// Select Option
function selectOption(index) {
    if (document.getElementById('submitBtn')?.classList.contains('hidden')) {
        return; // Already submitted
    }
    
    // Clear previous selection
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection
    const option = document.querySelector(`.option[data-index="${index}"]`);
    if (option) {
        option.classList.add('selected');
        APP.state.selectedAnswer = index;
    }
}

// Submit Answer
function submitAnswer() {
    if (APP.state.selectedAnswer === null) {
        alert('Please select an answer');
        return;
    }
    
    const question = APP.state.quizQuestions[APP.state.currentQuestionIndex];
    const correctIndex = question.correct ?? question.correct_answer ?? 0;
    const isCorrect = APP.state.selectedAnswer === correctIndex;
    
    // Show correct/incorrect
    document.querySelectorAll('.option').forEach((opt, index) => {
        opt.classList.add('disabled');
        if (index === correctIndex) {
            opt.classList.add('correct');
        } else if (index === APP.state.selectedAnswer && !isCorrect) {
            opt.classList.add('incorrect');
        }
    });
    
    // Update score
    if (isCorrect) {
        APP.state.score++;
    } else {
        // Track wrong answer
        if (!APP.progress.wrongAnswers.find(w => w.id === question.id)) {
            APP.progress.wrongAnswers.push({
                id: question.id,
                domain: question.domain
            });
        }
    }
    
    // Track as completed
    if (!APP.progress.completedQuestions.find(q => q.id === question.id)) {
        APP.progress.completedQuestions.push({
            id: question.id,
            correct: isCorrect
        });
    }
    
    // Show explanation if immediate feedback
    if (APP.settings.immediateFeedback) {
        document.getElementById('explanationBox')?.classList.remove('hidden');
    }
    
    // Update buttons
    document.getElementById('submitBtn')?.classList.add('hidden');
    document.getElementById('nextBtn')?.classList.remove('hidden');
    
    saveProgress();
}

// Skip Question
function skipQuestion() {
    APP.state.currentQuestionIndex++;
    loadQuestion();
}

// Next Question
function nextQuestion() {
    APP.state.currentQuestionIndex++;
    loadQuestion();
}

// Toggle Flag
function toggleFlag(questionId) {
    const index = APP.progress.flaggedQuestions.indexOf(questionId);
    if (index > -1) {
        APP.progress.flaggedQuestions.splice(index, 1);
    } else {
        APP.progress.flaggedQuestions.push(questionId);
    }
    saveProgress();
    loadQuestion();
    updateFlaggedCount();
}

// Show Quiz Results
function showQuizResults() {
    const container = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('quizResults');
    
    if (container) container.classList.add('hidden');
    if (!resultsContainer) return;
    
    const percentage = Math.round((APP.state.score / APP.state.quizQuestions.length) * 100);
    const passed = percentage >= 85;
    
    // Determine quiz type for appropriate messaging
    const quizType = APP.state.quizType || 'practice';
    
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = `
        <h2 class="text-center mb-2">
            ${quizType === 'lesson' ? 'Lesson Quiz' : 'Quiz'} Complete!
        </h2>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" style="color: ${passed ? 'var(--success)' : 'var(--warning)'}">
                    ${percentage}%
                </div>
                <div class="stat-label">Final Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${APP.state.score}/${APP.state.quizQuestions.length}</div>
                <div class="stat-label">Correct Answers</div>
            </div>
        </div>
        
        <div class="text-center mt-2">
            <div class="badge ${passed ? 'badge-success' : 'badge-warning'}" 
                 style="font-size: 1.2rem; padding: 0.5rem 1.5rem;">
                ${passed ? '✅ PASSED' : '⚠️ NEEDS IMPROVEMENT'}
            </div>
        </div>
        
        ${!passed ? `
            <div class="alert alert-warning mt-2">
                <h4>📚 Study Recommendations</h4>
                <ul style="text-align: left; margin-top: 1rem;">
                    <li>Review flagged questions (${APP.progress.flaggedQuestions.length} items)</li>
                    <li>Focus on weak domains</li>
                    <li>Try practice simulations</li>
                    <li>Use flash card mode for memorization</li>
                    <li>Complete remedial exercises</li>
                </ul>
                <div class="text-center mt-2">
                    <button class="btn btn-warning" onclick="showRemedialDashboard()">
                        Go to Remedial Study →
                    </button>
                </div>
            </div>
        ` : ''}
        
        <div class="wrong-answers mt-2">
            <h3>Review Wrong Answers</h3>
            ${getWrongAnswersForReview()}
        </div>
        
        <div class="text-center mt-2">
            <button class="btn btn-secondary" onclick="showView('dashboard')">
                Back to Dashboard
            </button>
            ${quizType === 'lesson' ? `
                <button class="btn btn-secondary" onclick="backToLesson()">
                    Back to Lesson
                </button>
            ` : ''}
            <button class="btn btn-primary" onclick="retryQuiz()">
                Try Again
            </button>
        </div>
    `;
    
    // Reset quiz type
    APP.state.quizType = null;
}

// Get Wrong Answers for Review
function getWrongAnswersForReview() {
    const wrongInThisQuiz = APP.state.quizQuestions.filter((q, index) => {
        const completed = APP.progress.completedQuestions.find(c => c.id === q.id);
        return completed && !completed.correct;
    });
    
    if (wrongInThisQuiz.length === 0) {
        return '<p>Perfect score! No wrong answers to review.</p>';
    }
    
    return `
        <div class="wrong-answers-list">
            ${wrongInThisQuiz.slice(0, 5).map(q => `
                <div class="wrong-answer-item">
                    <strong>Q: ${q.question}</strong>
                    <p>Correct Answer: ${q.options[q.correct || q.correct_answer || 0]}</p>
                    <button class="btn btn-sm btn-secondary" onclick="addToFlagged('${q.id}')">
                        🚩 Flag for Review
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// Show Flagged Questions
function showFlaggedQuestions() {
    if (APP.progress.flaggedQuestions.length === 0) {
        alert('No flagged questions. Flag questions during quizzes to review them later.');
        return;
    }
    
    const flaggedQuestions = APP.content.questions.filter(q => 
        APP.progress.flaggedQuestions.includes(q.id)
    );
    
    APP.state.quizType = 'flagged';
    showView('quiz', { questions: flaggedQuestions });
}

// Practice Exam
function startPracticeExam() {
    // Create exam with proper domain weighting
    const examQuestions = [];
    
    DOMAINS.forEach(domain => {
        const domainQuestions = APP.content.questions.filter(q => q.domain === domain.id);
        const count = Math.floor(90 * domain.weight);
        const selected = shuffleArray([...domainQuestions]).slice(0, count);
        examQuestions.push(...selected);
    });
    
    APP.state.quizQuestions = shuffleArray(examQuestions).slice(0, 90);
    APP.state.quizType = 'exam';
    showView('quiz', { questions: APP.state.quizQuestions });
}

// Utility Functions
function applyAdaptiveLearning(questions) {
    const weakQuestions = questions.filter(q => 
        APP.progress.wrongAnswers.find(w => w.id === q.id)
    );
    
    const otherQuestions = questions.filter(q => 
        !APP.progress.wrongAnswers.find(w => w.id === q.id)
    );
    
    // Mix weak questions more frequently (appear 3x more)
    const adapted = [];
    
    // Add weak questions multiple times
    for (let i = 0; i < 3; i++) {
        adapted.push(...weakQuestions);
    }
    
    // Add other questions
    adapted.push(...otherQuestions);
    
    return shuffleArray(adapted);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function retryQuiz() {
    startQuiz(APP.state.quizQuestions);
}

function backToLesson() {
    if (APP.state.currentLesson) {
        showView('lesson-viewer', { lessonId: APP.state.currentLesson });
    }
}

function addToFlagged(questionId) {
    if (!APP.progress.flaggedQuestions.includes(questionId)) {
        APP.progress.flaggedQuestions.push(questionId);
        saveProgress();
        updateFlaggedCount();
        alert('Question flagged for review');
    }
}

function updateFlaggedCount() {
    const count = document.getElementById('flaggedCount');
    if (count) count.textContent = APP.progress.flaggedQuestions.length;
}

function saveProgress() {
    try {
        localStorage.setItem('securityPlusProgress', JSON.stringify(APP.progress));
        localStorage.setItem('securityPlusSettings', JSON.stringify(APP.settings));
    } catch (error) {
        console.error('Could not save progress:', error);
    }
}

function calculateWeakSpots() {
    const weakDomains = [];
    const domainErrors = {};
    
    APP.progress.wrongAnswers.forEach(wrong => {
        domainErrors[wrong.domain] = (domainErrors[wrong.domain] || 0) + 1;
    });
    
    Object.entries(domainErrors).forEach(([domain, count]) => {
        if (count >= 3) weakDomains.push(parseInt(domain));
    });
    
    return weakDomains;
}

function calculateStats() {
    const completed = APP.progress.completedQuestions.length;
    const correct = APP.progress.completedQuestions.filter(q => q.correct).length;
    
    return {
        completed: completed,
        correctRate: completed > 0 ? Math.round((correct / completed) * 100) : 0,
        flagged: APP.progress.flaggedQuestions.length,
        weakSpots: calculateWeakSpots().length
    };
}

// Export functions
window.selectOption = selectOption;
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.toggleFlag = toggleFlag;
window.showFlaggedQuestions = showFlaggedQuestions;
window.startPracticeExam = startPracticeExam;
window.retryQuiz = retryQuiz;
window.backToLesson = backToLesson;
window.addToFlagged = addToFlagged;