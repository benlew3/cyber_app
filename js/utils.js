// ================================================
// UTILITY FUNCTIONS - Security+ Platform
// HTML Escaping and Content Sanitization
// Version: 2.0 - Enhanced for readability
// ================================================
// CRITICAL: This file MUST load FIRST before any other JS files
// It provides the escapeHtml function needed to safely render content

/**
 * Escape HTML special characters to prevent XSS and render code examples as text
 * This is CRITICAL for displaying educational content about attacks (XSS, SQL injection, etc.)
 * @param {string|any} text - The text to escape
 * @returns {string} - HTML-safe escaped string
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    if (typeof text !== 'string') text = String(text);
    
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    return text.replace(/[&<>"'`=\/]/g, char => htmlEntities[char]);
}

/**
 * Format content with enhanced markdown support for educational content
 * Handles bold definitions, lists, code blocks, and proper spacing
 * @param {string} content - Raw content with potential markdown
 * @returns {string} - HTML-formatted string (safe)
 */
function formatContent(content) {
    if (!content) return '';
    
    // First escape HTML to prevent XSS
    let html = escapeHtml(content);
    
    // === BOLD TEXT ===
    // **text** or __text__ → <strong>
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="definition-term">$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong class="definition-term">$1</strong>');
    
    // === INLINE CODE ===
    // `code` → styled code element
    html = html.replace(/`([^`]+)`/g, 
        '<code class="inline-code">$1</code>');
    
    // === CODE BLOCKS ===
    // ```code``` → pre block
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, function(match, lang, code) {
        return `<pre class="code-block"><code>${code.trim()}</code></pre>`;
    });
    
    // === LISTS ===
    // Process bullet points: lines starting with • or -
    // Group consecutive bullet points into proper <ul> lists
    const lines = html.split('\n');
    let inList = false;
    let processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const bulletMatch = line.match(/^[•\-]\s*(.+)$/);
        
        if (bulletMatch) {
            if (!inList) {
                processedLines.push('<ul class="content-list">');
                inList = true;
            }
            processedLines.push(`<li>${bulletMatch[1]}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            processedLines.push(line);
        }
    }
    if (inList) {
        processedLines.push('</ul>');
    }
    html = processedLines.join('\n');
    
    // === PARAGRAPHS ===
    // Double line breaks → new paragraph
    html = html.replace(/\n\n+/g, '</p><p class="content-para">');
    
    // Single line breaks within paragraphs
    html = html.replace(/\n/g, '<br>');
    
    // Clean up empty paragraphs
    html = html.replace(/<p class="content-para"><\/p>/g, '');
    html = html.replace(/<p class="content-para"><br>/g, '<p class="content-para">');
    
    // Wrap in paragraph if not already
    if (!html.startsWith('<ul') && !html.startsWith('<pre') && !html.startsWith('<p')) {
        html = '<p class="content-para">' + html + '</p>';
    }
    
    return html;
}

/**
 * Format a simple text string (single line, no complex formatting)
 * Used for titles, labels, short descriptions
 */
function formatSimple(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    // Just handle bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    return html;
}

/**
 * Safely render a value - escapes if string, returns empty for null/undefined
 * @param {any} value - Value to render
 * @param {string} defaultValue - Default if null/undefined
 * @returns {string} - Safe string
 */
function safeRender(value, defaultValue = '') {
    if (value === null || value === undefined) return defaultValue;
    return escapeHtml(String(value));
}

/**
 * Safely get nested property from object
 * @param {object} obj - Object to access
 * @param {string} path - Dot-notation path (e.g., 'user.name')
 * @param {any} defaultValue - Default if not found
 * @returns {any} - Value or default
 */
function safeGet(obj, path, defaultValue = '') {
    try {
        return path.split('.').reduce((o, k) => (o || {})[k], obj) ?? defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Make all functions globally available
window.escapeHtml = escapeHtml;
window.formatContent = formatContent;
window.formatSimple = formatSimple;
window.safeRender = safeRender;
window.safeGet = safeGet;
window.formatDuration = formatDuration;

console.log('✅ Utils.js v2.0 loaded - Enhanced content formatting available');
