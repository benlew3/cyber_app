// ================================================
// ADAPTIVE LEARNING & KNOWLEDGE CHECK MODULE
// Security+ Platform v31
// ================================================

(function() {
    'use strict';

    console.log('🧠 Adaptive Learning Module initializing...');

    // ================================================
    // ADAPTIVE QUESTION SELECTION
    // ================================================
    
    /**
     * Selects questions with adaptive weighting based on weak areas
     * @param {Array} questionPool - All available questions
     * @param {number} count - Number of questions to select
     * @param {number|null} domainFilter - Optional domain to filter by
     * @returns {Array} Selected questions with adaptive weighting
     */
    function selectAdaptiveQuestions(questionPool, count, domainFilter = null) {
        if (!questionPool || questionPool.length === 0) {
            console.warn('No questions in pool');
            return [];
        }

        // Get weak areas from progress
        const weakAreas = APP.progress.weakAreas || [];
        const wrongAnswerDomains = getWrongAnswerDomains();
        
        // Filter by domain if specified
        let availableQuestions = domainFilter 
            ? questionPool.filter(q => q.domain === domainFilter)
            : [...questionPool];
        
        if (availableQuestions.length === 0) {
            console.warn('No questions available after filtering');
            return [];
        }

        // If we have no weak areas, use standard random selection
        if (weakAreas.length === 0 && wrongAnswerDomains.length === 0) {
            return shuffleArray(availableQuestions).slice(0, count);
        }

        // Calculate weights for each question
        const weightedQuestions = availableQuestions.map(q => {
            let weight = 1; // Base weight
            
            // Triple weight for weak area domains
            if (weakAreas.includes(q.domain)) {
                weight *= 3;
            }
            
            // Double weight for domains with wrong answers
            if (wrongAnswerDomains.includes(q.domain)) {
                weight *= 2;
            }
            
            // Reduce weight for previously answered correctly
            if (APP.progress.completedQuestions.includes(q.id)) {
                weight *= 0.5;
            }
            
            // Increase weight for previously wrong answers
            if (APP.progress.wrongAnswers.includes(q.id)) {
                weight *= 2.5;
            }
            
            return { question: q, weight };
        });

        // Weighted random selection
        const selected = weightedRandomSelect(weightedQuestions, count);
        
        console.log(`📊 Adaptive selection: ${selected.length} questions`);
        console.log(`   Weak areas: ${weakAreas.join(', ') || 'none'}`);
        console.log(`   Wrong answer domains: ${wrongAnswerDomains.join(', ') || 'none'}`);
        
        return selected;
    }

    /**
     * Get domains where user has most wrong answers
     */
    function getWrongAnswerDomains() {
        const wrongAnswers = APP.progress.wrongAnswers || [];
        const domainCounts = {};
        
        // Count wrong answers per domain
        wrongAnswers.forEach(qId => {
            // Extract domain from question ID (e.g., "D1-Q001" -> 1)
            const match = qId.match(/D(\d)/);
            if (match) {
                const domain = parseInt(match[1]);
                domainCounts[domain] = (domainCounts[domain] || 0) + 1;
            }
        });
        
        // Return domains with 3+ wrong answers
        return Object.entries(domainCounts)
            .filter(([_, count]) => count >= 3)
            .map(([domain, _]) => parseInt(domain));
    }

    /**
     * Weighted random selection algorithm
     */
    function weightedRandomSelect(weightedItems, count) {
        const selected = [];
        const remaining = [...weightedItems];
        
        while (selected.length < count && remaining.length > 0) {
            // Calculate total weight
            const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
            
            // Random value within total weight
            let random = Math.random() * totalWeight;
            
            // Find the item this random value falls into
            for (let i = 0; i < remaining.length; i++) {
                random -= remaining[i].weight;
                if (random <= 0) {
                    selected.push(remaining[i].question);
                    remaining.splice(i, 1);
                    break;
                }
            }
        }
        
        return selected;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ================================================
    // ADAPTIVE PRACTICE EXAM
    // ================================================

    /**
     * Generate adaptive practice exam with domain weighting
     * CompTIA weights + adaptive adjustments
     */
    function generateAdaptivePracticeExam(questionPool, totalQuestions = 90) {
        const weakAreas = APP.progress.weakAreas || [];
        
        // Base CompTIA domain weights
        const baseWeights = {
            1: 0.12, // General Security Concepts
            2: 0.22, // Threats, Vulnerabilities & Mitigations
            3: 0.18, // Security Architecture
            4: 0.28, // Security Operations
            5: 0.20  // Security Program Management
        };
        
        // Adjust weights based on weak areas (increase weak areas by 50%)
        const adjustedWeights = { ...baseWeights };
        let totalAdjustment = 0;
        
        weakAreas.forEach(domain => {
            const increase = adjustedWeights[domain] * 0.5;
            adjustedWeights[domain] += increase;
            totalAdjustment += increase;
        });
        
        // Normalize weights to sum to 1
        const totalWeight = Object.values(adjustedWeights).reduce((a, b) => a + b, 0);
        Object.keys(adjustedWeights).forEach(domain => {
            adjustedWeights[domain] /= totalWeight;
        });
        
        console.log('📊 Adaptive exam weights:', adjustedWeights);
        
        // Calculate questions per domain
        const questionsPerDomain = {};
        let assigned = 0;
        
        Object.entries(adjustedWeights).forEach(([domain, weight]) => {
            questionsPerDomain[domain] = Math.round(totalQuestions * weight);
            assigned += questionsPerDomain[domain];
        });
        
        // Adjust for rounding errors
        if (assigned !== totalQuestions) {
            const diff = totalQuestions - assigned;
            const maxDomain = Object.entries(questionsPerDomain)
                .sort((a, b) => b[1] - a[1])[0][0];
            questionsPerDomain[maxDomain] += diff;
        }
        
        // Select questions for each domain
        const examQuestions = [];
        
        Object.entries(questionsPerDomain).forEach(([domain, count]) => {
            const domainQuestions = selectAdaptiveQuestions(
                questionPool, 
                count, 
                parseInt(domain)
            );
            examQuestions.push(...domainQuestions);
        });
        
        // Final shuffle
        return shuffleArray(examQuestions);
    }

    // ================================================
    // KNOWLEDGE CHECK SYSTEM
    // ================================================

    /**
     * Track knowledge check progress
     */
    const knowledgeCheckState = {
        currentLesson: null,
        sectionChecks: {}, // { sectionId: { answered: bool, correct: bool } }
        totalChecks: 0,
        correctChecks: 0
    };

    /**
     * Render a knowledge check within a lesson section
     */
    function renderKnowledgeCheck(check, sectionId, sectionIndex) {
        if (!check || !check.question) return '';
        
        const checkId = `kc-${sectionId || sectionIndex}`;
        
        return `
            <div class="knowledge-check" id="${checkId}" data-section="${sectionId}">
                <div class="kc-header">
                    <span class="kc-icon">🧠</span>
                    <span class="kc-title">Knowledge Check</span>
                </div>
                
                <div class="kc-question">
                    ${escapeHtml(check.question)}
                </div>
                
                <div class="kc-options" id="${checkId}-options">
                    ${check.options.map((option, idx) => `
                        <div class="kc-option" 
                             data-index="${idx}" 
                             data-correct="${idx === check.correct}"
                             onclick="window.AdaptiveLearning.selectKnowledgeCheckOption('${checkId}', ${idx}, ${check.correct})">
                            <span class="kc-option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span class="kc-option-text">${escapeHtml(option)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="kc-feedback" id="${checkId}-feedback" style="display: none;">
                    <div class="kc-feedback-icon"></div>
                    <div class="kc-feedback-text"></div>
                </div>
                
                <div class="kc-explanation" id="${checkId}-explanation" style="display: none;">
                    <strong>Explanation:</strong> ${escapeHtml(check.explanation || 'Review the section content for more details.')}
                </div>
            </div>
        `;
    }

    /**
     * Handle knowledge check option selection
     */
    function selectKnowledgeCheckOption(checkId, selectedIndex, correctIndex) {
        const optionsContainer = document.getElementById(`${checkId}-options`);
        const feedbackDiv = document.getElementById(`${checkId}-feedback`);
        const explanationDiv = document.getElementById(`${checkId}-explanation`);
        
        if (!optionsContainer || optionsContainer.classList.contains('answered')) {
            return; // Already answered
        }
        
        // Mark as answered
        optionsContainer.classList.add('answered');
        
        const isCorrect = selectedIndex === correctIndex;
        
        // Update option styles
        const options = optionsContainer.querySelectorAll('.kc-option');
        options.forEach((opt, idx) => {
            opt.classList.add('disabled');
            if (idx === correctIndex) {
                opt.classList.add('correct');
            } else if (idx === selectedIndex && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });
        
        // Show feedback
        feedbackDiv.style.display = 'block';
        feedbackDiv.innerHTML = `
            <div class="kc-feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="kc-feedback-text">
                ${isCorrect ? 'Correct! Well done.' : 'Not quite. Review the explanation below.'}
            </div>
        `;
        feedbackDiv.className = `kc-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        // Show explanation
        explanationDiv.style.display = 'block';
        
        // Track progress
        const checkElement = document.getElementById(checkId);
        const sectionId = checkElement?.dataset.section;
        if (sectionId) {
            knowledgeCheckState.sectionChecks[sectionId] = {
                answered: true,
                correct: isCorrect
            };
        }
        
        knowledgeCheckState.totalChecks++;
        if (isCorrect) {
            knowledgeCheckState.correctChecks++;
        }
        
        // Update lesson progress display
        updateKnowledgeCheckProgress();
        
        // Track in weak areas if wrong
        if (!isCorrect && knowledgeCheckState.currentLesson) {
            const domain = knowledgeCheckState.currentLesson.domain;
            if (domain && !APP.progress.weakAreas.includes(domain)) {
                // Add to weak areas if multiple wrong in same domain
                const domainWrong = Object.values(knowledgeCheckState.sectionChecks)
                    .filter(s => s.answered && !s.correct).length;
                if (domainWrong >= 2) {
                    APP.progress.weakAreas.push(domain);
                    saveProgress();
                    console.log(`📉 Domain ${domain} added to weak areas`);
                }
            }
        }
    }

    /**
     * Update knowledge check progress indicator
     */
    function updateKnowledgeCheckProgress() {
        const progressEl = document.getElementById('kc-progress');
        if (!progressEl) return;
        
        const answered = Object.values(knowledgeCheckState.sectionChecks).filter(s => s.answered).length;
        const correct = Object.values(knowledgeCheckState.sectionChecks).filter(s => s.correct).length;
        const total = Object.keys(knowledgeCheckState.sectionChecks).length;
        
        progressEl.innerHTML = `
            <span class="kc-progress-label">Knowledge Checks:</span>
            <span class="kc-progress-value">${correct}/${answered} correct</span>
            ${answered === total ? '<span class="kc-progress-complete">✓ All Complete</span>' : ''}
        `;
    }

    /**
     * Initialize knowledge check state for a lesson
     */
    function initKnowledgeChecks(lesson) {
        knowledgeCheckState.currentLesson = lesson;
        knowledgeCheckState.sectionChecks = {};
        knowledgeCheckState.totalChecks = 0;
        knowledgeCheckState.correctChecks = 0;
        
        // Pre-populate section IDs
        if (lesson.content?.sections) {
            lesson.content.sections.forEach((section, idx) => {
                if (section.knowledgeCheck || section.knowledge_check) {
                    const sectionId = section.section_id || section.sectionId || `section-${idx}`;
                    knowledgeCheckState.sectionChecks[sectionId] = {
                        answered: false,
                        correct: false
                    };
                }
            });
        }
    }

    // ================================================
    // STUDY RECOMMENDATIONS
    // ================================================

    /**
     * Generate personalized study recommendations
     */
    function getStudyRecommendations() {
        const weakAreas = APP.progress.weakAreas || [];
        const domainScores = APP.progress.domainScores || {};
        const wrongAnswers = APP.progress.wrongAnswers || [];
        
        const recommendations = [];
        
        // Recommend based on weak areas
        weakAreas.forEach(domain => {
            const domainInfo = DOMAINS.find(d => d.id === domain);
            if (domainInfo) {
                recommendations.push({
                    type: 'weak-area',
                    priority: 'high',
                    domain: domain,
                    title: `Focus on Domain ${domain}: ${domainInfo.name}`,
                    description: 'Quiz scores below 85% indicate this area needs more study.',
                    action: 'Review lessons and complete remediation scenarios',
                    actionFn: `showDomainLessons(${domain})`
                });
            }
        });
        
        // Recommend based on domain scores
        Object.entries(domainScores).forEach(([domain, scores]) => {
            if (scores.length >= 2) {
                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (avgScore < 70 && !weakAreas.includes(parseInt(domain))) {
                    const domainInfo = DOMAINS.find(d => d.id === parseInt(domain));
                    recommendations.push({
                        type: 'low-score',
                        priority: 'medium',
                        domain: parseInt(domain),
                        title: `Improve Domain ${domain} Performance`,
                        description: `Average score: ${Math.round(avgScore)}%. Target: 85%+`,
                        action: 'Take more quizzes and review lessons',
                        actionFn: `startDomainQuiz(${domain})`
                    });
                }
            }
        });
        
        // Recommend based on incomplete content
        const completedLessons = APP.progress.completedLessons || [];
        const completedSims = APP.progress.completedSimulations || [];
        
        DOMAINS.forEach(domain => {
            const domainLessons = ALL_LESSONS.filter(l => l.domain === domain.id);
            const domainSims = ALL_SIMULATIONS.filter(s => s.domain === domain.id);
            
            const completedDomainLessons = domainLessons.filter(l => completedLessons.includes(l.id));
            const completedDomainSims = domainSims.filter(s => completedSims.includes(s.id));
            
            if (completedDomainLessons.length < domainLessons.length) {
                recommendations.push({
                    type: 'incomplete',
                    priority: 'low',
                    domain: domain.id,
                    title: `Complete Domain ${domain.id} Lessons`,
                    description: `${completedDomainLessons.length}/${domainLessons.length} lessons completed`,
                    action: 'Continue learning',
                    actionFn: `showDomainLessons(${domain.id})`
                });
            }
        });
        
        // Sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        
        return recommendations.slice(0, 5); // Top 5 recommendations
    }

    /**
     * Render study recommendations panel
     */
    function renderStudyRecommendations() {
        const recommendations = getStudyRecommendations();
        
        if (recommendations.length === 0) {
            return `
                <div class="recommendations-panel">
                    <h3>🎯 Study Recommendations</h3>
                    <p class="no-recommendations">Great job! Keep up the consistent practice across all domains.</p>
                </div>
            `;
        }
        
        return `
            <div class="recommendations-panel">
                <h3>🎯 Personalized Study Recommendations</h3>
                <div class="recommendations-list">
                    ${recommendations.map(rec => `
                        <div class="recommendation-card priority-${rec.priority}">
                            <div class="rec-priority">${rec.priority.toUpperCase()}</div>
                            <div class="rec-content">
                                <div class="rec-title">${escapeHtml(rec.title)}</div>
                                <div class="rec-description">${escapeHtml(rec.description)}</div>
                            </div>
                            <button class="btn btn-sm" onclick="${rec.actionFn}">${escapeHtml(rec.action)}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // ================================================
    // PERFORMANCE ANALYTICS
    // ================================================

    /**
     * Calculate detailed performance analytics
     */
    function getPerformanceAnalytics() {
        const analytics = {
            overall: {
                questionsAnswered: APP.progress.completedQuestions.length,
                correctAnswers: APP.progress.completedQuestions.length - APP.progress.wrongAnswers.length,
                accuracy: 0,
                lessonsCompleted: APP.progress.completedLessons.length,
                simulationsCompleted: APP.progress.completedSimulations.length,
                pbqsCompleted: APP.progress.completedPBQs.length
            },
            byDomain: {},
            trends: {
                improving: [],
                declining: [],
                stable: []
            },
            readiness: {
                score: 0,
                status: 'Not Ready',
                recommendations: []
            }
        };
        
        // Calculate overall accuracy
        if (analytics.overall.questionsAnswered > 0) {
            analytics.overall.accuracy = Math.round(
                (analytics.overall.correctAnswers / analytics.overall.questionsAnswered) * 100
            );
        }
        
        // Calculate by-domain metrics
        DOMAINS.forEach(domain => {
            const domainScores = APP.progress.domainScores[domain.id] || [];
            const domainLessons = ALL_LESSONS.filter(l => l.domain === domain.id);
            const domainSims = ALL_SIMULATIONS.filter(s => s.domain === domain.id);
            
            const completedLessons = domainLessons.filter(l => 
                APP.progress.completedLessons.includes(l.id)
            ).length;
            const completedSims = domainSims.filter(s => 
                APP.progress.completedSimulations.includes(s.id)
            ).length;
            
            analytics.byDomain[domain.id] = {
                name: domain.name,
                weight: domain.weight,
                avgScore: domainScores.length > 0 
                    ? Math.round(domainScores.reduce((a, b) => a + b, 0) / domainScores.length)
                    : 0,
                quizzesTaken: domainScores.length,
                lessonsCompleted: completedLessons,
                totalLessons: domainLessons.length,
                simulationsCompleted: completedSims,
                totalSimulations: domainSims.length,
                isWeakArea: APP.progress.weakAreas.includes(domain.id)
            };
            
            // Determine trend
            if (domainScores.length >= 3) {
                const recent = domainScores.slice(-3);
                const older = domainScores.slice(-6, -3);
                
                if (older.length >= 3) {
                    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
                    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
                    
                    if (recentAvg > olderAvg + 5) {
                        analytics.trends.improving.push(domain.id);
                    } else if (recentAvg < olderAvg - 5) {
                        analytics.trends.declining.push(domain.id);
                    } else {
                        analytics.trends.stable.push(domain.id);
                    }
                }
            }
        });
        
        // Calculate exam readiness
        let readinessScore = 0;
        let maxScore = 0;
        
        Object.entries(analytics.byDomain).forEach(([domainId, data]) => {
            const weight = data.weight * 100;
            maxScore += weight;
            
            // Score based on quiz performance (60% of readiness)
            if (data.avgScore >= 85) {
                readinessScore += weight * 0.6;
            } else if (data.avgScore >= 70) {
                readinessScore += weight * 0.6 * (data.avgScore / 85);
            }
            
            // Score based on content completion (40% of readiness)
            const lessonCompletion = data.totalLessons > 0 
                ? data.lessonsCompleted / data.totalLessons 
                : 0;
            const simCompletion = data.totalSimulations > 0 
                ? data.simulationsCompleted / data.totalSimulations 
                : 0;
            const contentScore = (lessonCompletion * 0.5 + simCompletion * 0.5) * weight * 0.4;
            readinessScore += contentScore;
        });
        
        analytics.readiness.score = Math.round((readinessScore / maxScore) * 100);
        
        if (analytics.readiness.score >= 85) {
            analytics.readiness.status = 'Exam Ready';
        } else if (analytics.readiness.score >= 70) {
            analytics.readiness.status = 'Almost Ready';
        } else if (analytics.readiness.score >= 50) {
            analytics.readiness.status = 'In Progress';
        } else {
            analytics.readiness.status = 'Just Starting';
        }
        
        return analytics;
    }

    // ================================================
    // INJECT STYLES
    // ================================================
    const adaptiveStyles = document.createElement('style');
    adaptiveStyles.textContent = `
        /* Knowledge Check Styles */
        .knowledge-check {
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            border: 1px solid #4f46e5;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .kc-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .kc-icon {
            font-size: 1.5rem;
        }
        
        .kc-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #a5b4fc;
        }
        
        .kc-question {
            font-size: 1.05rem;
            line-height: 1.7;
            margin-bottom: 20px;
            color: #e0e7ff;
        }
        
        .kc-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .kc-option {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 15px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .kc-option:hover:not(.disabled) {
            background: rgba(99, 102, 241, 0.2);
            border-color: #6366f1;
        }
        
        .kc-option.disabled {
            cursor: default;
        }
        
        .kc-option.correct {
            background: rgba(16, 185, 129, 0.2);
            border-color: #10b981;
        }
        
        .kc-option.incorrect {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
        }
        
        .kc-option-letter {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            font-weight: 600;
            flex-shrink: 0;
        }
        
        .kc-option.correct .kc-option-letter {
            background: #10b981;
            color: white;
        }
        
        .kc-option.incorrect .kc-option-letter {
            background: #ef4444;
            color: white;
        }
        
        .kc-option-text {
            line-height: 1.5;
        }
        
        .kc-feedback {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }
        
        .kc-feedback.correct {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid #10b981;
        }
        
        .kc-feedback.incorrect {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid #ef4444;
        }
        
        .kc-feedback-icon {
            font-size: 1.5rem;
        }
        
        .kc-feedback-text {
            font-weight: 500;
        }
        
        .kc-explanation {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            line-height: 1.7;
            color: #c7d2fe;
        }
        
        /* Knowledge Check Progress */
        .kc-progress {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 15px;
            background: #18181b;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        
        .kc-progress-label {
            color: #71717a;
        }
        
        .kc-progress-value {
            color: #6366f1;
            font-weight: 600;
        }
        
        .kc-progress-complete {
            color: #10b981;
            font-weight: 600;
        }
        
        /* Recommendations Panel */
        .recommendations-panel {
            background: #18181b;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .recommendations-panel h3 {
            margin-bottom: 20px;
            color: #fafafa;
        }
        
        .no-recommendations {
            color: #71717a;
            font-style: italic;
        }
        
        .recommendations-list {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .recommendation-card {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #27272a;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .recommendation-card.priority-high {
            border-left-color: #ef4444;
        }
        
        .recommendation-card.priority-medium {
            border-left-color: #f59e0b;
        }
        
        .recommendation-card.priority-low {
            border-left-color: #10b981;
        }
        
        .rec-priority {
            font-size: 0.7rem;
            font-weight: 700;
            padding: 4px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        
        .priority-high .rec-priority {
            background: rgba(239, 68, 68, 0.2);
            color: #f87171;
        }
        
        .priority-medium .rec-priority {
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
        }
        
        .priority-low .rec-priority {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
        }
        
        .rec-content {
            flex: 1;
        }
        
        .rec-title {
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .rec-description {
            font-size: 0.9rem;
            color: #a1a1aa;
        }
        
        .btn-sm {
            padding: 8px 16px;
            font-size: 0.85rem;
        }
        
        /* Analytics Styles */
        .analytics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .analytics-card {
            background: #27272a;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .analytics-value {
            font-size: 2rem;
            font-weight: bold;
            color: #6366f1;
        }
        
        .analytics-label {
            color: #71717a;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .readiness-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .readiness-badge.ready {
            background: linear-gradient(135deg, #064e3b, #065f46);
            color: #34d399;
        }
        
        .readiness-badge.almost {
            background: linear-gradient(135deg, #78350f, #92400e);
            color: #fbbf24;
        }
        
        .readiness-badge.progress {
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            color: #a5b4fc;
        }
        
        .readiness-badge.starting {
            background: linear-gradient(135deg, #18181b, #27272a);
            color: #a1a1aa;
        }
        
        /* Adaptive Learning Responsive Styles */
        @media (max-width: 480px) {
            .recommendation-card {
                flex-direction: column;
                align-items: flex-start;
                padding: 16px;
                gap: 12px;
            }
            
            .recommendation-card .btn {
                width: 100%;
                min-height: 44px;
            }
            
            .kc-container {
                padding: 16px;
                margin: 16px 0;
            }
            
            .kc-question {
                font-size: 1rem;
            }
            
            .kc-option {
                padding: 14px;
                min-height: 48px;
                font-size: 0.95rem;
            }
            
            .kc-feedback {
                padding: 14px;
                font-size: 0.95rem;
            }
            
            .analytics-grid {
                grid-template-columns: 1fr !important;
                gap: 10px;
            }
            
            .analytics-card {
                padding: 14px;
            }
            
            .analytics-value {
                font-size: 1.4rem;
            }
            
            .readiness-badge {
                padding: 6px 12px;
                font-size: 0.8rem;
            }
            
            .kc-progress {
                flex-direction: column;
                gap: 8px;
                text-align: center;
            }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
            .recommendation-card {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .kc-option {
                padding: 12px;
            }
            
            .analytics-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }
        
        /* Touch devices */
        @media (hover: none) and (pointer: coarse) {
            .kc-option,
            .recommendation-card .btn {
                min-height: 48px;
                -webkit-user-select: none;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
            
            .kc-option:active:not(.answered) {
                transform: scale(0.99);
                opacity: 0.9;
            }
        }
    `;
    document.head.appendChild(adaptiveStyles);

    // ================================================
    // EXPORT TO GLOBAL SCOPE
    // ================================================
    window.AdaptiveLearning = {
        selectAdaptiveQuestions,
        generateAdaptivePracticeExam,
        renderKnowledgeCheck,
        selectKnowledgeCheckOption,
        initKnowledgeChecks,
        updateKnowledgeCheckProgress,
        getStudyRecommendations,
        renderStudyRecommendations,
        getPerformanceAnalytics,
        knowledgeCheckState
    };

    console.log('✅ Adaptive Learning Module ready');
    console.log('   - Adaptive question selection (3x weight for weak areas)');
    console.log('   - Knowledge check rendering');
    console.log('   - Study recommendations');
    console.log('   - Performance analytics');

})();
