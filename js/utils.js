// ================================================
// UTILITY FUNCTIONS - Security+ Platform
// HTML Escaping and Content Sanitization
// Version: 1.0
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
 * Format content with basic markdown-like support while keeping HTML escaped
 * Converts **bold**, *italic*, `code`, and preserves line breaks
 * @param {string} content - Raw content with potential markdown
 * @returns {string} - HTML-formatted string (safe)
 */
function formatContent(content) {
    if (!content) return '';
    
    // First escape HTML to prevent XSS
    let html = escapeHtml(content);
    
    // Then apply markdown-like formatting on the escaped content
    // Bold: **text** or __text__
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, 
        '<code style="background: #27272a; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
    
    // Code blocks: ```code``` (with optional language)
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, function(match, lang, code) {
        return `<pre style="background: #1a1a1a; padding: 15px; border-radius: 8px; overflow-x: auto; margin: 10px 0; font-family: monospace;"><code>${code.trim()}</code></pre>`;
    });
    
    // Double line breaks to paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    
    // Single line breaks
    html = html.replace(/\n/g, '<br>');
    
    // Bullet points (• or -)
    html = html.replace(/^• (.+)$/gm, '<li style="margin-left: 20px;">$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 20px;">$1</li>');
    
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
window.safeRender = safeRender;
window.safeGet = safeGet;
window.formatDuration = formatDuration;

console.log('✅ Utils.js loaded - HTML escaping functions available');
