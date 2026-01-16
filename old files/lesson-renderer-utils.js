/**
 * Phase 3: Defensive Renderer Utilities
 * 
 * These utilities handle structural variations in lesson JSON data
 * to ensure consistent rendering regardless of schema differences.
 * 
 * Use these functions in enhanced-lesson-viewer.js to gracefully
 * handle both Pattern A (D1/D2) and Pattern B (D3/D4/D5) lessons.
 */

// =============================================================================
// LESSON TITLES LOOKUP (for converting string IDs to full objects)
// =============================================================================
const LESSON_LOOKUP = {
    "D1-LESSON-001": { title: "Security Controls Fundamentals", domain: 1 },
    "D1-LESSON-002": { title: "CIA Triad Fundamentals", domain: 1 },
    "D1-LESSON-003": { title: "Authentication Methods", domain: 1 },
    "D1-LESSON-004": { title: "Cryptographic Fundamentals", domain: 1 },
    "D1-LESSON-005": { title: "Zero Trust Architecture", domain: 1 },
    "D1-LESSON-006": { title: "Physical Security Controls", domain: 1 },
    "D1-LESSON-007": { title: "Deception Technologies", domain: 1 },
    "D1-LESSON-008": { title: "Change Management", domain: 1 },
    "D2-LESSON-001": { title: "Threat Actors & Motivations", domain: 2 },
    "D2-LESSON-002": { title: "Threat Vectors & Attack Surfaces", domain: 2 },
    "D2-LESSON-003": { title: "Social Engineering", domain: 2 },
    "D2-LESSON-004": { title: "Malware Types", domain: 2 },
    "D2-LESSON-005": { title: "Network Attacks", domain: 2 },
    "D2-LESSON-006": { title: "Application Attacks", domain: 2 },
    "D2-LESSON-007": { title: "Vulnerability Management", domain: 2 },
    "D2-LESSON-008": { title: "Indicators of Compromise", domain: 2 },
    "D2-LESSON-009": { title: "Hardening & Configurations", domain: 2 },
    "D2-LESSON-010": { title: "Mitigation Techniques", domain: 2 },
    "D2-LESSON-011": { title: "Attack Frameworks", domain: 2 },
    "D2-LESSON-012": { title: "Security Assessments", domain: 2 },
    "D3-LESSON-001": { title: "Security Architecture Concepts", domain: 3 },
    "D3-LESSON-002": { title: "Infrastructure Security", domain: 3 },
    "D3-LESSON-003": { title: "Network Security", domain: 3 },
    "D3-LESSON-004": { title: "Wireless Security", domain: 3 },
    "D3-LESSON-005": { title: "Cloud Security", domain: 3 },
    "D3-LESSON-006": { title: "Cryptography", domain: 3 },
    "D3-LESSON-007": { title: "Resilience & Recovery", domain: 3 },
    "D3-LESSON-008": { title: "Data Protection", domain: 3 },
    "D4-LESSON-001": { title: "Security Monitoring", domain: 4 },
    "D4-LESSON-002": { title: "Incident Response", domain: 4 },
    "D4-LESSON-003": { title: "Digital Forensics", domain: 4 },
    "D4-LESSON-004": { title: "Vulnerability Management", domain: 4 },
    "D4-LESSON-005": { title: "Identity & Access Management", domain: 4 },
    "D4-LESSON-006": { title: "Data Protection", domain: 4 },
    "D4-LESSON-007": { title: "Security Automation", domain: 4 },
    "D5-LESSON-001": { title: "Security Governance", domain: 5 },
    "D5-LESSON-002": { title: "Risk Management", domain: 5 },
    "D5-LESSON-003": { title: "Third-Party Risk Management", domain: 5 },
    "D5-LESSON-004": { title: "Security Compliance", domain: 5 },
    "D5-LESSON-005": { title: "Audits & Assessments", domain: 5 },
    "D5-LESSON-006": { title: "Security Awareness", domain: 5 },
};

// =============================================================================
// WHY IT MATTERS - Handles string OR object format
// =============================================================================

/**
 * Normalizes why_it_matters to always return an object
 * @param {string|object} wim - The why_it_matters field from introduction
 * @returns {object} - Normalized object with career_impact, business_connection, exam_relevance
 */
function normalizeWhyItMatters(wim) {
    if (!wim) {
        return null;
    }
    
    if (typeof wim === 'string') {
        // Convert string to object format
        return {
            career_impact: wim,
            business_connection: '',
            exam_relevance: ''
        };
    }
    
    if (typeof wim === 'object') {
        // Normalize keys (some lessons use real_world_connection vs business_connection)
        return {
            career_impact: wim.career_impact || '',
            business_connection: wim.business_connection || wim.real_world_connection || '',
            exam_relevance: wim.exam_relevance || ''
        };
    }
    
    return null;
}

/**
 * Renders why_it_matters section with consistent HTML output
 * @param {string|object} wim - The why_it_matters field
 * @returns {string} - HTML string
 */
function renderWhyItMatters(wim) {
    const normalized = normalizeWhyItMatters(wim);
    
    if (!normalized) {
        return '';
    }
    
    // If only career_impact has content (converted from string), show simple format
    if (normalized.career_impact && !normalized.business_connection && !normalized.exam_relevance) {
        return `
            <div class="why-it-matters simple">
                <p>${escapeHtml(normalized.career_impact)}</p>
            </div>
        `;
    }
    
    // Full format with all three sections
    let html = '<div class="why-it-matters detailed">';
    
    if (normalized.career_impact) {
        html += `
            <div class="wim-section career">
                <h4>🎯 Career Impact</h4>
                <p>${escapeHtml(normalized.career_impact)}</p>
            </div>
        `;
    }
    
    if (normalized.business_connection) {
        html += `
            <div class="wim-section business">
                <h4>🏢 Business Connection</h4>
                <p>${escapeHtml(normalized.business_connection)}</p>
            </div>
        `;
    }
    
    if (normalized.exam_relevance) {
        html += `
            <div class="wim-section exam">
                <h4>📝 Exam Relevance</h4>
                <p>${escapeHtml(normalized.exam_relevance)}</p>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// =============================================================================
// SKILL TREE - Handles string arrays OR object arrays
// =============================================================================

/**
 * Normalizes a skill tree node (prerequisite or unlock) to object format
 * @param {string|object} node - Either a lesson ID string or object with lesson_id
 * @returns {object} - Normalized object with lesson_id, title, why_needed/connection
 */
function normalizeSkillTreeNode(node, type = 'prerequisite') {
    if (!node) return null;
    
    // Already an object
    if (typeof node === 'object') {
        return {
            lesson_id: node.lesson_id || '',
            title: node.title || LESSON_LOOKUP[node.lesson_id]?.title || node.lesson_id,
            reason: type === 'prerequisite' 
                ? (node.why_needed || 'Provides foundational concepts')
                : (node.connection || 'Builds on concepts from this lesson')
        };
    }
    
    // String - lesson ID only
    if (typeof node === 'string') {
        const lookup = LESSON_LOOKUP[node];
        return {
            lesson_id: node,
            title: lookup?.title || node,
            reason: type === 'prerequisite'
                ? 'Provides foundational concepts'
                : 'Builds on concepts from this lesson'
        };
    }
    
    return null;
}

/**
 * Normalizes entire skill_tree object
 * @param {object} skillTree - The skill_tree field from lesson
 * @returns {object} - Normalized skill tree with consistent structure
 */
function normalizeSkillTree(skillTree) {
    if (!skillTree) {
        return { prerequisites: [], unlocks: [], cascade_learning: [] };
    }
    
    const prerequisites = (skillTree.prerequisites || [])
        .map(p => normalizeSkillTreeNode(p, 'prerequisite'))
        .filter(p => p !== null);
    
    const unlocks = (skillTree.unlocks || [])
        .map(u => normalizeSkillTreeNode(u, 'unlock'))
        .filter(u => u !== null);
    
    let cascadeLearning = [];
    if (skillTree.cascade_learning) {
        if (Array.isArray(skillTree.cascade_learning)) {
            cascadeLearning = skillTree.cascade_learning;
        } else if (typeof skillTree.cascade_learning === 'object') {
            // Handle object format: { this_lesson_establishes: [], concepts_used_later: {} }
            cascadeLearning = skillTree.cascade_learning.this_lesson_establishes || [];
        }
    }
    
    return {
        position: skillTree.position || null,
        prerequisites,
        unlocks,
        cascade_learning: cascadeLearning
    };
}

/**
 * Renders skill tree visualization
 * @param {object} skillTree - The skill_tree field from lesson
 * @param {string} currentLessonId - Current lesson's ID
 * @returns {string} - HTML string
 */
function renderSkillTree(skillTree, currentLessonId) {
    const normalized = normalizeSkillTree(skillTree);
    
    let html = '<div class="skill-tree-container">';
    
    // Prerequisites
    if (normalized.prerequisites.length > 0) {
        html += '<div class="skill-tree-section prerequisites">';
        html += '<h4>📚 Prerequisites</h4>';
        html += '<ul>';
        normalized.prerequisites.forEach(prereq => {
            const domain = LESSON_LOOKUP[prereq.lesson_id]?.domain || 1;
            html += `
                <li class="skill-node" data-lesson="${prereq.lesson_id}">
                    <span class="node-badge domain-${domain}">${prereq.lesson_id}</span>
                    <span class="node-title">${escapeHtml(prereq.title)}</span>
                    ${prereq.reason ? `<span class="node-reason">${escapeHtml(prereq.reason)}</span>` : ''}
                </li>
            `;
        });
        html += '</ul></div>';
    }
    
    // Current lesson
    html += `
        <div class="skill-tree-section current">
            <div class="current-lesson-node">
                <span class="node-badge current">📍 Current</span>
                <span class="node-title">${currentLessonId}</span>
            </div>
        </div>
    `;
    
    // Unlocks
    if (normalized.unlocks.length > 0) {
        html += '<div class="skill-tree-section unlocks">';
        html += '<h4>🔓 Unlocks</h4>';
        html += '<ul>';
        normalized.unlocks.forEach(unlock => {
            const domain = LESSON_LOOKUP[unlock.lesson_id]?.domain || 1;
            html += `
                <li class="skill-node" data-lesson="${unlock.lesson_id}">
                    <span class="node-badge domain-${domain}">${unlock.lesson_id}</span>
                    <span class="node-title">${escapeHtml(unlock.title)}</span>
                    ${unlock.reason ? `<span class="node-reason">${escapeHtml(unlock.reason)}</span>` : ''}
                </li>
            `;
        });
        html += '</ul></div>';
    }
    
    html += '</div>';
    return html;
}

// =============================================================================
// MEMORY HOOKS - Handles singular vs plural keys
// =============================================================================

/**
 * Normalizes memory_hooks to consistent plural keys
 * @param {object} hooks - The memory_hooks field from section
 * @returns {object} - Normalized with mnemonics, analogies, common_mistakes arrays
 */
function normalizeMemoryHooks(hooks) {
    if (!hooks) return null;
    
    const normalized = {
        mnemonics: [],
        analogies: [],
        common_mistakes: []
    };
    
    // Handle mnemonics (singular or plural)
    if (hooks.mnemonics) {
        normalized.mnemonics = Array.isArray(hooks.mnemonics) ? hooks.mnemonics : [hooks.mnemonics];
    } else if (hooks.mnemonic) {
        normalized.mnemonics = Array.isArray(hooks.mnemonic) ? hooks.mnemonic : [hooks.mnemonic];
    }
    
    // Handle analogies (singular or plural)
    if (hooks.analogies) {
        normalized.analogies = Array.isArray(hooks.analogies) ? hooks.analogies : [hooks.analogies];
    } else if (hooks.analogy) {
        normalized.analogies = Array.isArray(hooks.analogy) ? hooks.analogy : [hooks.analogy];
    }
    
    // Handle common_mistakes
    if (hooks.common_mistakes) {
        const mistakes = Array.isArray(hooks.common_mistakes) ? hooks.common_mistakes : [hooks.common_mistakes];
        normalized.common_mistakes = mistakes.map(m => {
            if (typeof m === 'string') return m;
            if (typeof m === 'object') {
                return m.mistake ? `${m.mistake}${m.correction ? ' → ' + m.correction : ''}` : JSON.stringify(m);
            }
            return String(m);
        });
    }
    
    // Check for any special keys (mnemonic_nist_csf, radius_vs_tacacs, etc.)
    Object.keys(hooks).forEach(key => {
        if (!['mnemonics', 'mnemonic', 'analogies', 'analogy', 'common_mistakes'].includes(key)) {
            // Add as a mnemonic with label
            const value = hooks[key];
            if (typeof value === 'string') {
                normalized.mnemonics.push(`${key.replace(/_/g, ' ')}: ${value}`);
            }
        }
    });
    
    // Return null if empty
    if (normalized.mnemonics.length === 0 && 
        normalized.analogies.length === 0 && 
        normalized.common_mistakes.length === 0) {
        return null;
    }
    
    return normalized;
}

/**
 * Renders memory hooks section
 * @param {object} hooks - The memory_hooks field
 * @returns {string} - HTML string
 */
function renderMemoryHooks(hooks) {
    const normalized = normalizeMemoryHooks(hooks);
    if (!normalized) return '';
    
    let html = '<div class="memory-hooks">';
    
    if (normalized.mnemonics.length > 0) {
        html += '<div class="hook-section mnemonics">';
        html += '<h5>🧠 Memory Aids</h5>';
        html += '<ul>';
        normalized.mnemonics.forEach(m => {
            html += `<li>${escapeHtml(m)}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (normalized.analogies.length > 0) {
        html += '<div class="hook-section analogies">';
        html += '<h5>💡 Analogies</h5>';
        html += '<ul>';
        normalized.analogies.forEach(a => {
            html += `<li>${escapeHtml(a)}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (normalized.common_mistakes.length > 0) {
        html += '<div class="hook-section mistakes">';
        html += '<h5>⚠️ Common Mistakes</h5>';
        html += '<ul>';
        normalized.common_mistakes.forEach(m => {
            html += `<li>${escapeHtml(m)}</li>`;
        });
        html += '</ul></div>';
    }
    
    html += '</div>';
    return html;
}

// =============================================================================
// GLOSSARY TERMS - Handles varying key sets
// =============================================================================

/**
 * Normalizes glossary term to consistent format
 * @param {object} term - Glossary term object
 * @returns {object} - Normalized term with all possible fields
 */
function normalizeGlossaryTerm(term) {
    if (!term) return null;
    
    return {
        term: term.term || '',
        definition: term.definition || '',
        also_known_as: term.also_known_as || [],
        examples: term.examples || [],
        exam_note: term.exam_note || ''
    };
}

/**
 * Renders glossary terms section
 * @param {array} terms - Array of glossary term objects
 * @returns {string} - HTML string
 */
function renderGlossaryTerms(terms) {
    if (!terms || !Array.isArray(terms) || terms.length === 0) {
        return '';
    }
    
    let html = '<div class="glossary-terms">';
    html += '<h4>📖 Key Terms</h4>';
    html += '<dl>';
    
    terms.forEach(t => {
        const term = normalizeGlossaryTerm(t);
        if (term && term.term) {
            html += `<dt>${escapeHtml(term.term)}</dt>`;
            html += '<dd>';
            html += `<p class="definition">${escapeHtml(term.definition)}</p>`;
            
            if (term.also_known_as && term.also_known_as.length > 0) {
                html += `<p class="aka"><em>Also known as:</em> ${term.also_known_as.map(escapeHtml).join(', ')}</p>`;
            }
            
            if (term.examples && term.examples.length > 0) {
                html += `<p class="examples"><em>Examples:</em> ${term.examples.map(escapeHtml).join(', ')}</p>`;
            }
            
            if (term.exam_note) {
                html += `<p class="exam-note">📝 <em>${escapeHtml(term.exam_note)}</em></p>`;
            }
            
            html += '</dd>';
        }
    });
    
    html += '</dl></div>';
    return html;
}

// =============================================================================
// REAL WORLD EXAMPLE - Handles varying structures
// =============================================================================

/**
 * Normalizes real world example to consistent format
 * @param {object} example - Real world example object
 * @returns {object} - Normalized example
 */
function normalizeRealWorldExample(example) {
    if (!example) return null;
    
    // Handle the two main formats:
    // Format A: { scenario, company, application }
    // Format B: { scenario, company, situation, controls_implemented, outcome }
    
    return {
        scenario: example.scenario || '',
        company: example.company || '',
        details: example.application || example.situation || '',
        controls: example.controls_implemented || example.controls_by_type || null,
        outcome: example.outcome || example.result || ''
    };
}

/**
 * Renders real world example section
 * @param {object} example - Real world example object
 * @returns {string} - HTML string
 */
function renderRealWorldExample(example) {
    const normalized = normalizeRealWorldExample(example);
    if (!normalized || !normalized.scenario) return '';
    
    let html = '<div class="real-world-example">';
    html += '<h4>🌍 Real-World Example</h4>';
    
    if (normalized.company) {
        html += `<p class="company"><strong>${escapeHtml(normalized.company)}</strong></p>`;
    }
    
    html += `<p class="scenario">${escapeHtml(normalized.scenario)}</p>`;
    
    if (normalized.details) {
        html += `<p class="details">${escapeHtml(normalized.details)}</p>`;
    }
    
    if (normalized.controls) {
        if (typeof normalized.controls === 'object' && !Array.isArray(normalized.controls)) {
            html += '<div class="controls"><strong>Controls:</strong><ul>';
            Object.entries(normalized.controls).forEach(([key, value]) => {
                html += `<li><em>${escapeHtml(key)}:</em> ${escapeHtml(String(value))}</li>`;
            });
            html += '</ul></div>';
        } else if (Array.isArray(normalized.controls)) {
            html += `<div class="controls"><strong>Controls:</strong><ul>`;
            normalized.controls.forEach(c => {
                html += `<li>${escapeHtml(String(c))}</li>`;
            });
            html += '</ul></div>';
        }
    }
    
    if (normalized.outcome) {
        html += `<p class="outcome"><strong>Outcome:</strong> ${escapeHtml(normalized.outcome)}</p>`;
    }
    
    html += '</div>';
    return html;
}

// =============================================================================
// KNOWLEDGE CHECK - Consistent rendering
// =============================================================================

/**
 * Renders knowledge check quiz
 * @param {object} check - Knowledge check object
 * @param {string} sectionId - Section identifier for unique IDs
 * @returns {string} - HTML string
 */
function renderKnowledgeCheck(check, sectionId) {
    if (!check || !check.question) return '';
    
    const uniqueId = `kc-${sectionId}-${Date.now()}`;
    
    let html = `<div class="knowledge-check" id="${uniqueId}">`;
    html += '<h4>✅ Knowledge Check</h4>';
    html += `<p class="question">${escapeHtml(check.question)}</p>`;
    
    html += '<div class="options">';
    (check.options || []).forEach((opt, idx) => {
        const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
        html += `
            <label class="option" data-correct="${idx === check.correct}">
                <input type="radio" name="${uniqueId}" value="${idx}">
                <span class="option-letter">${optionLetter}</span>
                <span class="option-text">${escapeHtml(opt)}</span>
            </label>
        `;
    });
    html += '</div>';
    
    html += `
        <div class="feedback hidden">
            <p class="explanation">${escapeHtml(check.explanation || '')}</p>
        </div>
        <button class="check-answer-btn" onclick="checkKnowledgeAnswer('${uniqueId}', ${check.correct})">
            Check Answer
        </button>
    `;
    
    html += '</div>';
    return html;
}

// =============================================================================
// SUMMARY - Ensure all fields present
// =============================================================================

/**
 * Normalizes summary to consistent format
 * @param {object} summary - Summary object
 * @returns {object} - Normalized summary
 */
function normalizeSummary(summary) {
    if (!summary) return { key_takeaways: [], exam_essentials: [], connection_to_next: '' };
    
    return {
        key_takeaways: summary.key_takeaways || [],
        exam_essentials: summary.exam_essentials || [],
        connection_to_next: summary.connection_to_next || '',
        career_connections: summary.career_connections || null
    };
}

// =============================================================================
// HTML ESCAPE UTILITY
// =============================================================================

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') {
        str = String(str || '');
    }
    
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}

// =============================================================================
// DYNAMIC CONTENT RENDERER - Handles any JSON structure
// =============================================================================

/**
 * Recursively renders any JSON structure to HTML
 * Useful for core_concepts with varying structures
 * @param {any} content - Any JSON content
 * @param {number} depth - Current nesting depth
 * @returns {string} - HTML string
 */
function renderDynamicContent(content, depth = 0) {
    if (content === null || content === undefined) {
        return '';
    }
    
    // String or number
    if (typeof content === 'string' || typeof content === 'number') {
        return `<span class="value">${escapeHtml(String(content))}</span>`;
    }
    
    // Boolean
    if (typeof content === 'boolean') {
        return `<span class="value boolean">${content ? '✓' : '✗'}</span>`;
    }
    
    // Array
    if (Array.isArray(content)) {
        if (content.length === 0) return '';
        
        // Check if it's an array of simple values or objects
        const isSimple = content.every(item => 
            typeof item === 'string' || typeof item === 'number'
        );
        
        if (isSimple) {
            return `<ul class="simple-list">${content.map(item => 
                `<li>${escapeHtml(String(item))}</li>`
            ).join('')}</ul>`;
        }
        
        // Array of objects - render as list or table depending on structure
        return `<div class="complex-list">${content.map(item => 
            `<div class="list-item">${renderDynamicContent(item, depth + 1)}</div>`
        ).join('')}</div>`;
    }
    
    // Object
    if (typeof content === 'object') {
        const entries = Object.entries(content);
        if (entries.length === 0) return '';
        
        let html = '<div class="object-content">';
        
        entries.forEach(([key, value]) => {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            
            // Skip rendering empty values
            if (value === null || value === undefined || 
                (Array.isArray(value) && value.length === 0) ||
                (typeof value === 'object' && Object.keys(value).length === 0)) {
                return;
            }
            
            html += `<div class="field depth-${depth}">`;
            html += `<span class="field-label">${escapeHtml(formattedKey)}:</span>`;
            html += `<span class="field-value">${renderDynamicContent(value, depth + 1)}</span>`;
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }
    
    return '';
}

// =============================================================================
// EXPORT FOR USE IN BROWSER
// =============================================================================

// Make functions globally available if in browser
if (typeof window !== 'undefined') {
    window.LessonRenderer = {
        normalizeWhyItMatters,
        renderWhyItMatters,
        normalizeSkillTreeNode,
        normalizeSkillTree,
        renderSkillTree,
        normalizeMemoryHooks,
        renderMemoryHooks,
        normalizeGlossaryTerm,
        renderGlossaryTerms,
        normalizeRealWorldExample,
        renderRealWorldExample,
        renderKnowledgeCheck,
        normalizeSummary,
        escapeHtml,
        renderDynamicContent,
        LESSON_LOOKUP
    };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        normalizeWhyItMatters,
        renderWhyItMatters,
        normalizeSkillTreeNode,
        normalizeSkillTree,
        renderSkillTree,
        normalizeMemoryHooks,
        renderMemoryHooks,
        normalizeGlossaryTerm,
        renderGlossaryTerms,
        normalizeRealWorldExample,
        renderRealWorldExample,
        renderKnowledgeCheck,
        normalizeSummary,
        escapeHtml,
        renderDynamicContent,
        LESSON_LOOKUP
    };
}
