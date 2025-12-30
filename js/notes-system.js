// ================================================
// NOTES SYSTEM - Security+ Platform v32
// Personal notes with localStorage persistence
// ================================================

(function() {
    'use strict';

    console.log('📝 Notes System initializing...');

    // ================================================
    // NOTES DATA STRUCTURE
    // ================================================
    
    const NOTES_STORAGE_KEY = 'securityPlusNotes_v1';
    
    // Notes stored as: { noteId: { id, contentType, contentId, title, text, created, updated, tags } }
    let notesData = {};
    
    // ================================================
    // STORAGE FUNCTIONS
    // ================================================
    
    function loadNotes() {
        try {
            const saved = localStorage.getItem(NOTES_STORAGE_KEY);
            if (saved) {
                notesData = JSON.parse(saved);
                console.log(`📝 Loaded ${Object.keys(notesData).length} notes`);
            }
        } catch (e) {
            console.error('Failed to load notes:', e);
            notesData = {};
        }
        return notesData;
    }
    
    function saveNotes() {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesData));
            console.log('📝 Notes saved');
            return true;
        } catch (e) {
            console.error('Failed to save notes:', e);
            return false;
        }
    }
    
    function generateNoteId() {
        return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // ================================================
    // NOTE CRUD OPERATIONS
    // ================================================
    
    /**
     * Add a new note
     * @param {string} contentType - 'lesson', 'simulation', 'pbq', 'quiz', 'general'
     * @param {string} contentId - ID of the content item (e.g., 'D1-LESSON-001')
     * @param {string} contentTitle - Title of the content for display
     * @param {string} text - Note text
     * @param {Array} tags - Optional tags
     */
    function addNote(contentType, contentId, contentTitle, text, tags = []) {
        const noteId = generateNoteId();
        const now = new Date().toISOString();
        
        notesData[noteId] = {
            id: noteId,
            contentType: contentType,
            contentId: contentId,
            contentTitle: contentTitle,
            text: text,
            tags: tags,
            created: now,
            updated: now
        };
        
        saveNotes();
        showNotification('Note saved!', 'success');
        return noteId;
    }
    
    /**
     * Update an existing note
     */
    function updateNote(noteId, text, tags = null) {
        if (!notesData[noteId]) {
            console.error('Note not found:', noteId);
            return false;
        }
        
        notesData[noteId].text = text;
        notesData[noteId].updated = new Date().toISOString();
        if (tags !== null) {
            notesData[noteId].tags = tags;
        }
        
        saveNotes();
        showNotification('Note updated!', 'success');
        return true;
    }
    
    /**
     * Delete a note
     */
    function deleteNote(noteId) {
        if (!notesData[noteId]) {
            console.error('Note not found:', noteId);
            return false;
        }
        
        delete notesData[noteId];
        saveNotes();
        showNotification('Note deleted', 'info');
        return true;
    }
    
    /**
     * Get all notes for a specific content item
     */
    function getNotesForContent(contentId) {
        return Object.values(notesData).filter(note => note.contentId === contentId);
    }
    
    /**
     * Get all notes of a specific type
     */
    function getNotesByType(contentType) {
        return Object.values(notesData).filter(note => note.contentType === contentType);
    }
    
    /**
     * Get all notes
     */
    function getAllNotes() {
        return Object.values(notesData).sort((a, b) => 
            new Date(b.updated) - new Date(a.updated)
        );
    }
    
    /**
     * Search notes
     */
    function searchNotes(query) {
        const lowerQuery = query.toLowerCase();
        return Object.values(notesData).filter(note => 
            note.text.toLowerCase().includes(lowerQuery) ||
            note.contentTitle.toLowerCase().includes(lowerQuery) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
    
    /**
     * Export all notes as JSON
     */
    function exportNotes() {
        const dataStr = JSON.stringify(notesData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-plus-notes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Notes exported!', 'success');
    }
    
    /**
     * Import notes from JSON
     */
    function importNotes(jsonString, merge = true) {
        try {
            const imported = JSON.parse(jsonString);
            
            if (merge) {
                // Merge with existing notes
                Object.assign(notesData, imported);
            } else {
                // Replace all notes
                notesData = imported;
            }
            
            saveNotes();
            showNotification(`Imported ${Object.keys(imported).length} notes!`, 'success');
            return true;
        } catch (e) {
            console.error('Failed to import notes:', e);
            showNotification('Failed to import notes', 'error');
            return false;
        }
    }
    
    // ================================================
    // UI COMPONENTS
    // ================================================
    
    /**
     * Render note button for any content
     */
    function renderNoteButton(contentType, contentId, contentTitle) {
        const existingNotes = getNotesForContent(contentId);
        const noteCount = existingNotes.length;
        
        return `
            <button class="note-btn ${noteCount > 0 ? 'has-notes' : ''}" 
                    onclick="NotesSystem.openNoteModal('${contentType}', '${contentId}', '${escapeHtml(contentTitle)}')"
                    title="${noteCount > 0 ? `${noteCount} note(s)` : 'Add note'}">
                📝 ${noteCount > 0 ? `(${noteCount})` : 'Note'}
            </button>
        `;
    }
    
    /**
     * Open note modal for adding/viewing notes
     */
    function openNoteModal(contentType, contentId, contentTitle) {
        const existingNotes = getNotesForContent(contentId);
        
        const modal = document.createElement('div');
        modal.className = 'note-modal-overlay';
        modal.id = 'note-modal';
        modal.innerHTML = `
            <div class="note-modal">
                <div class="note-modal-header">
                    <h2>📝 Notes</h2>
                    <button class="note-modal-close" onclick="NotesSystem.closeNoteModal()">×</button>
                </div>
                
                <div class="note-modal-content-info">
                    <span class="note-content-type">${contentType.toUpperCase()}</span>
                    <span class="note-content-title">${escapeHtml(contentTitle)}</span>
                </div>
                
                <div class="note-add-section">
                    <h3>Add New Note</h3>
                    <textarea id="new-note-text" class="note-textarea" 
                              placeholder="Write your note here... (key concepts, exam tips, personal reminders)"
                              rows="4"></textarea>
                    <div class="note-tags-input">
                        <input type="text" id="new-note-tags" class="note-input" 
                               placeholder="Tags (comma-separated): exam-tip, review, important">
                    </div>
                    <button class="btn btn-primary" 
                            onclick="NotesSystem.saveNewNote('${contentType}', '${contentId}', '${escapeHtml(contentTitle)}')">
                        💾 Save Note
                    </button>
                </div>
                
                ${existingNotes.length > 0 ? `
                    <div class="note-existing-section">
                        <h3>Existing Notes (${existingNotes.length})</h3>
                        <div class="note-list">
                            ${existingNotes.map(note => renderNoteCard(note)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus on textarea
        setTimeout(() => {
            document.getElementById('new-note-text')?.focus();
        }, 100);
    }
    
    /**
     * Render a single note card
     */
    function renderNoteCard(note) {
        const created = new Date(note.created).toLocaleDateString();
        const updated = new Date(note.updated).toLocaleDateString();
        
        return `
            <div class="note-card" data-note-id="${note.id}">
                <div class="note-card-header">
                    <span class="note-date">${created}${updated !== created ? ` (edited ${updated})` : ''}</span>
                    <div class="note-actions">
                        <button class="note-action-btn" onclick="NotesSystem.editNote('${note.id}')" title="Edit">✏️</button>
                        <button class="note-action-btn" onclick="NotesSystem.confirmDeleteNote('${note.id}')" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="note-card-text" id="note-text-${note.id}">${escapeHtml(note.text)}</div>
                ${note.tags.length > 0 ? `
                    <div class="note-card-tags">
                        ${note.tags.map(tag => `<span class="note-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Save new note from modal
     */
    function saveNewNote(contentType, contentId, contentTitle) {
        const textEl = document.getElementById('new-note-text');
        const tagsEl = document.getElementById('new-note-tags');
        
        const text = textEl.value.trim();
        if (!text) {
            showNotification('Please enter note text', 'warning');
            return;
        }
        
        const tags = tagsEl.value.split(',').map(t => t.trim()).filter(t => t);
        
        addNote(contentType, contentId, contentTitle, text, tags);
        closeNoteModal();
        
        // Refresh if on notes page
        if (APP.state.currentView === 'notes') {
            showAllNotes();
        }
    }
    
    /**
     * Edit existing note
     */
    function editNote(noteId) {
        const note = notesData[noteId];
        if (!note) return;
        
        const textDiv = document.getElementById(`note-text-${noteId}`);
        const card = textDiv.closest('.note-card');
        
        // Replace text with textarea
        textDiv.innerHTML = `
            <textarea id="edit-note-${noteId}" class="note-textarea" rows="4">${escapeHtml(note.text)}</textarea>
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button class="btn btn-primary btn-sm" onclick="NotesSystem.saveEditedNote('${noteId}')">Save</button>
                <button class="btn btn-sm" onclick="NotesSystem.cancelEdit('${noteId}')">Cancel</button>
            </div>
        `;
        
        document.getElementById(`edit-note-${noteId}`).focus();
    }
    
    /**
     * Save edited note
     */
    function saveEditedNote(noteId) {
        const textarea = document.getElementById(`edit-note-${noteId}`);
        const text = textarea.value.trim();
        
        if (!text) {
            showNotification('Note cannot be empty', 'warning');
            return;
        }
        
        updateNote(noteId, text);
        
        // Refresh the note card
        const textDiv = document.getElementById(`note-text-${noteId}`);
        textDiv.innerHTML = escapeHtml(text);
    }
    
    /**
     * Cancel edit
     */
    function cancelEdit(noteId) {
        const note = notesData[noteId];
        if (!note) return;
        
        const textDiv = document.getElementById(`note-text-${noteId}`);
        textDiv.innerHTML = escapeHtml(note.text);
    }
    
    /**
     * Confirm delete note
     */
    function confirmDeleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            deleteNote(noteId);
            
            // Remove card from DOM
            const card = document.querySelector(`[data-note-id="${noteId}"]`);
            if (card) {
                card.remove();
            }
            
            // Update count in modal header if exists
            const existingSection = document.querySelector('.note-existing-section h3');
            if (existingSection) {
                const remainingNotes = document.querySelectorAll('.note-card').length;
                if (remainingNotes === 0) {
                    document.querySelector('.note-existing-section')?.remove();
                } else {
                    existingSection.textContent = `Existing Notes (${remainingNotes})`;
                }
            }
        }
    }
    
    /**
     * Close note modal
     */
    function closeNoteModal() {
        const modal = document.getElementById('note-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    // ================================================
    // ALL NOTES VIEW
    // ================================================
    
    /**
     * Show all notes page
     */
    function showAllNotes() {
        const content = document.getElementById('content');
        const allNotes = getAllNotes();
        
        // Group notes by content type
        const grouped = {
            lesson: getNotesByType('lesson'),
            simulation: getNotesByType('simulation'),
            pbq: getNotesByType('pbq'),
            quiz: getNotesByType('quiz'),
            general: getNotesByType('general')
        };
        
        content.innerHTML = `
            <div class="container">
                <button class="back-btn" onclick="showDashboard()">← Back</button>
                
                <div class="notes-header">
                    <h1 class="page-title">📝 My Study Notes</h1>
                    <div class="notes-stats">
                        <span>${allNotes.length} total notes</span>
                    </div>
                </div>
                
                <div class="notes-toolbar">
                    <div class="notes-search">
                        <input type="text" id="notes-search-input" class="search-input" 
                               placeholder="Search notes..." 
                               oninput="NotesSystem.filterNotes(this.value)">
                    </div>
                    <div class="notes-actions">
                        <button class="btn" onclick="NotesSystem.openQuickNote()">
                            ➕ Quick Note
                        </button>
                        <button class="btn" onclick="NotesSystem.exportNotes()">
                            📤 Export
                        </button>
                        <button class="btn" onclick="NotesSystem.showImportDialog()">
                            📥 Import
                        </button>
                    </div>
                </div>
                
                <div class="notes-filter-bar">
                    <button class="filter-btn active" data-filter="all" onclick="NotesSystem.filterByType('all')">
                        All (${allNotes.length})
                    </button>
                    <button class="filter-btn" data-filter="lesson" onclick="NotesSystem.filterByType('lesson')">
                        📚 Lessons (${grouped.lesson.length})
                    </button>
                    <button class="filter-btn" data-filter="simulation" onclick="NotesSystem.filterByType('simulation')">
                        🎮 Simulations (${grouped.simulation.length})
                    </button>
                    <button class="filter-btn" data-filter="pbq" onclick="NotesSystem.filterByType('pbq')">
                        🖥️ PBQs (${grouped.pbq.length})
                    </button>
                    <button class="filter-btn" data-filter="quiz" onclick="NotesSystem.filterByType('quiz')">
                        ❓ Quizzes (${grouped.quiz.length})
                    </button>
                    <button class="filter-btn" data-filter="general" onclick="NotesSystem.filterByType('general')">
                        📋 General (${grouped.general.length})
                    </button>
                </div>
                
                <div id="notes-container" class="notes-grid">
                    ${allNotes.length === 0 ? `
                        <div class="notes-empty">
                            <div class="notes-empty-icon">📝</div>
                            <h3>No notes yet</h3>
                            <p>Start taking notes while studying to track key concepts and exam tips!</p>
                            <button class="btn btn-primary" onclick="NotesSystem.openQuickNote()">
                                Create Your First Note
                            </button>
                        </div>
                    ` : allNotes.map(note => renderFullNoteCard(note)).join('')}
                </div>
            </div>
        `;
        
        APP.state.currentView = 'notes';
    }
    
    /**
     * Render full note card for all notes view
     */
    function renderFullNoteCard(note) {
        const created = new Date(note.created).toLocaleDateString();
        const updated = new Date(note.updated).toLocaleDateString();
        const typeIcon = {
            lesson: '📚',
            simulation: '🎮',
            pbq: '🖥️',
            quiz: '❓',
            general: '📋'
        }[note.contentType] || '📝';
        
        return `
            <div class="full-note-card" data-note-id="${note.id}" data-type="${note.contentType}">
                <div class="full-note-header">
                    <div class="full-note-type">
                        <span class="type-icon">${typeIcon}</span>
                        <span class="type-label">${note.contentType}</span>
                    </div>
                    <div class="note-actions">
                        <button class="note-action-btn" onclick="NotesSystem.editNoteInline('${note.id}')" title="Edit">✏️</button>
                        <button class="note-action-btn" onclick="NotesSystem.confirmDeleteNote('${note.id}'); NotesSystem.showAllNotes();" title="Delete">🗑️</button>
                    </div>
                </div>
                
                <div class="full-note-content-link" onclick="NotesSystem.goToContent('${note.contentType}', '${note.contentId}')">
                    ${escapeHtml(note.contentTitle)}
                </div>
                
                <div class="full-note-text" id="note-text-${note.id}">
                    ${escapeHtml(note.text)}
                </div>
                
                ${note.tags.length > 0 ? `
                    <div class="full-note-tags">
                        ${note.tags.map(tag => `<span class="note-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="full-note-footer">
                    <span class="note-date">${created}${updated !== created ? ` • Edited ${updated}` : ''}</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Filter notes by search query
     */
    function filterNotes(query) {
        const container = document.getElementById('notes-container');
        const cards = container.querySelectorAll('.full-note-card');
        
        if (!query.trim()) {
            cards.forEach(card => card.style.display = '');
            return;
        }
        
        const results = searchNotes(query);
        const resultIds = results.map(n => n.id);
        
        cards.forEach(card => {
            const noteId = card.dataset.noteId;
            card.style.display = resultIds.includes(noteId) ? '' : 'none';
        });
    }
    
    /**
     * Filter notes by type
     */
    function filterByType(type) {
        const container = document.getElementById('notes-container');
        const cards = container.querySelectorAll('.full-note-card');
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === type);
        });
        
        cards.forEach(card => {
            if (type === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.type === type ? '' : 'none';
            }
        });
    }
    
    /**
     * Navigate to content from note
     */
    function goToContent(contentType, contentId) {
        switch(contentType) {
            case 'lesson':
                if (typeof showLessonViewer === 'function') {
                    showLessonViewer(contentId);
                }
                break;
            case 'simulation':
                if (typeof startSimulation === 'function') {
                    startSimulation(contentId);
                }
                break;
            case 'pbq':
                if (typeof startPBQ === 'function') {
                    startPBQ(contentId);
                }
                break;
            default:
                console.log('Cannot navigate to:', contentType, contentId);
        }
    }
    
    /**
     * Open quick note dialog (general note)
     */
    function openQuickNote() {
        const modal = document.createElement('div');
        modal.className = 'note-modal-overlay';
        modal.id = 'note-modal';
        modal.innerHTML = `
            <div class="note-modal">
                <div class="note-modal-header">
                    <h2>📝 Quick Note</h2>
                    <button class="note-modal-close" onclick="NotesSystem.closeNoteModal()">×</button>
                </div>
                
                <div class="note-add-section">
                    <div class="note-quick-title">
                        <input type="text" id="quick-note-title" class="note-input" 
                               placeholder="Note title (e.g., 'Exam Tips for Domain 2')">
                    </div>
                    <textarea id="new-note-text" class="note-textarea" 
                              placeholder="Write your note here..."
                              rows="6"></textarea>
                    <div class="note-tags-input">
                        <input type="text" id="new-note-tags" class="note-input" 
                               placeholder="Tags (comma-separated): exam-tip, review, important">
                    </div>
                    <button class="btn btn-primary" onclick="NotesSystem.saveQuickNote()">
                        💾 Save Note
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.getElementById('quick-note-title')?.focus();
    }
    
    /**
     * Save quick note
     */
    function saveQuickNote() {
        const titleEl = document.getElementById('quick-note-title');
        const textEl = document.getElementById('new-note-text');
        const tagsEl = document.getElementById('new-note-tags');
        
        const title = titleEl.value.trim() || 'General Note';
        const text = textEl.value.trim();
        
        if (!text) {
            showNotification('Please enter note text', 'warning');
            return;
        }
        
        const tags = tagsEl.value.split(',').map(t => t.trim()).filter(t => t);
        
        addNote('general', 'general', title, text, tags);
        closeNoteModal();
        
        if (APP.state.currentView === 'notes') {
            showAllNotes();
        }
    }
    
    /**
     * Edit note inline (full card view)
     */
    function editNoteInline(noteId) {
        const note = notesData[noteId];
        if (!note) return;
        
        const textDiv = document.getElementById(`note-text-${noteId}`);
        
        textDiv.innerHTML = `
            <textarea id="edit-note-${noteId}" class="note-textarea" rows="4">${escapeHtml(note.text)}</textarea>
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button class="btn btn-primary btn-sm" onclick="NotesSystem.saveEditedNote('${noteId}')">Save</button>
                <button class="btn btn-sm" onclick="NotesSystem.cancelEditInline('${noteId}')">Cancel</button>
            </div>
        `;
        
        document.getElementById(`edit-note-${noteId}`).focus();
    }
    
    /**
     * Cancel inline edit
     */
    function cancelEditInline(noteId) {
        const note = notesData[noteId];
        if (!note) return;
        
        const textDiv = document.getElementById(`note-text-${noteId}`);
        textDiv.innerHTML = escapeHtml(note.text);
    }
    
    /**
     * Show import dialog
     */
    function showImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'note-modal-overlay';
        modal.id = 'note-modal';
        modal.innerHTML = `
            <div class="note-modal">
                <div class="note-modal-header">
                    <h2>📥 Import Notes</h2>
                    <button class="note-modal-close" onclick="NotesSystem.closeNoteModal()">×</button>
                </div>
                
                <div class="note-add-section">
                    <p style="color: #a1a1aa; margin-bottom: 15px;">
                        Select a previously exported JSON file to import your notes.
                    </p>
                    <input type="file" id="import-file" accept=".json" 
                           onchange="NotesSystem.handleImportFile(this.files[0])">
                    
                    <div style="margin-top: 20px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="import-merge" checked>
                            <span>Merge with existing notes (uncheck to replace all)</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    /**
     * Handle import file
     */
    function handleImportFile(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const merge = document.getElementById('import-merge').checked;
            if (importNotes(e.target.result, merge)) {
                closeNoteModal();
                if (APP.state.currentView === 'notes') {
                    showAllNotes();
                }
            }
        };
        reader.readAsText(file);
    }
    
    // ================================================
    // HELPER FUNCTIONS
    // ================================================
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.showNotification) {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `note-notification note-notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ================================================
    // INJECT STYLES
    // ================================================
    
    const notesStyles = document.createElement('style');
    notesStyles.textContent = `
        /* Note Button */
        .note-btn {
            background: #27272a;
            border: 1px solid #3f3f46;
            color: #a1a1aa;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        
        .note-btn:hover {
            background: #3f3f46;
            border-color: #6366f1;
            color: #fafafa;
        }
        
        .note-btn.has-notes {
            border-color: #6366f1;
            color: #6366f1;
        }
        
        /* Modal Overlay */
        .note-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        }
        
        /* Modal */
        .note-modal {
            background: #18181b;
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }
        
        .note-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #27272a;
            position: sticky;
            top: 0;
            background: #18181b;
            z-index: 1;
        }
        
        .note-modal-header h2 {
            margin: 0;
            font-size: 1.3rem;
        }
        
        .note-modal-close {
            background: none;
            border: none;
            color: #71717a;
            font-size: 1.8rem;
            cursor: pointer;
            line-height: 1;
            padding: 0;
        }
        
        .note-modal-close:hover {
            color: #fafafa;
        }
        
        .note-modal-content-info {
            padding: 15px 25px;
            background: #27272a;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .note-content-type {
            background: #6366f1;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .note-content-title {
            color: #fafafa;
            font-weight: 500;
        }
        
        .note-add-section {
            padding: 25px;
        }
        
        .note-add-section h3 {
            margin: 0 0 15px 0;
            font-size: 1rem;
            color: #a1a1aa;
        }
        
        .note-textarea {
            width: 100%;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 8px;
            padding: 15px;
            color: #fafafa;
            font-size: 0.95rem;
            line-height: 1.6;
            resize: vertical;
            font-family: inherit;
        }
        
        .note-textarea:focus {
            outline: none;
            border-color: #6366f1;
        }
        
        .note-input {
            width: 100%;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 8px;
            padding: 12px 15px;
            color: #fafafa;
            font-size: 0.95rem;
        }
        
        .note-input:focus {
            outline: none;
            border-color: #6366f1;
        }
        
        .note-tags-input {
            margin: 15px 0;
        }
        
        .note-existing-section {
            padding: 0 25px 25px;
            border-top: 1px solid #27272a;
        }
        
        .note-existing-section h3 {
            margin: 20px 0 15px 0;
            font-size: 1rem;
            color: #a1a1aa;
        }
        
        .note-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .note-card {
            background: #27272a;
            border-radius: 8px;
            padding: 15px;
        }
        
        .note-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .note-date {
            color: #71717a;
            font-size: 0.8rem;
        }
        
        .note-actions {
            display: flex;
            gap: 5px;
        }
        
        .note-action-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .note-action-btn:hover {
            background: #3f3f46;
        }
        
        .note-card-text {
            color: #e4e4e7;
            line-height: 1.6;
            white-space: pre-wrap;
        }
        
        .note-card-tags {
            margin-top: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .note-tag {
            background: rgba(99, 102, 241, 0.2);
            color: #a5b4fc;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
        }
        
        /* All Notes Page */
        .notes-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .notes-stats {
            color: #71717a;
        }
        
        .notes-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .notes-search {
            flex: 1;
            min-width: 200px;
        }
        
        .search-input {
            width: 100%;
            background: #27272a;
            border: 1px solid #3f3f46;
            border-radius: 8px;
            padding: 12px 15px;
            color: #fafafa;
            font-size: 0.95rem;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #6366f1;
        }
        
        .notes-actions {
            display: flex;
            gap: 10px;
        }
        
        .notes-filter-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            background: #27272a;
            border: 1px solid #3f3f46;
            color: #a1a1aa;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        
        .filter-btn:hover {
            border-color: #6366f1;
            color: #fafafa;
        }
        
        .filter-btn.active {
            background: #6366f1;
            border-color: #6366f1;
            color: white;
        }
        
        .notes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .notes-empty {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            background: #18181b;
            border-radius: 12px;
        }
        
        .notes-empty-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .notes-empty h3 {
            margin: 0 0 10px 0;
            color: #fafafa;
        }
        
        .notes-empty p {
            color: #71717a;
            margin-bottom: 20px;
        }
        
        /* Full Note Card */
        .full-note-card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
        }
        
        .full-note-card:hover {
            border-color: #3f3f46;
        }
        
        .full-note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .full-note-type {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .type-icon {
            font-size: 1.2rem;
        }
        
        .type-label {
            color: #71717a;
            font-size: 0.8rem;
            text-transform: uppercase;
        }
        
        .full-note-content-link {
            color: #6366f1;
            font-weight: 500;
            margin-bottom: 12px;
            cursor: pointer;
        }
        
        .full-note-content-link:hover {
            text-decoration: underline;
        }
        
        .full-note-text {
            color: #e4e4e7;
            line-height: 1.7;
            white-space: pre-wrap;
            margin-bottom: 15px;
        }
        
        .full-note-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 15px;
        }
        
        .full-note-footer {
            padding-top: 12px;
            border-top: 1px solid #27272a;
        }
        
        /* Notification */
        .note-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s;
            z-index: 10000;
        }
        
        .note-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .note-notification-success {
            background: linear-gradient(135deg, #059669, #10b981);
        }
        
        .note-notification-error {
            background: linear-gradient(135deg, #dc2626, #ef4444);
        }
        
        .note-notification-warning {
            background: linear-gradient(135deg, #d97706, #f59e0b);
        }
        
        .note-notification-info {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
        }
        
        .note-quick-title {
            margin-bottom: 15px;
        }
        
        .btn-sm {
            padding: 6px 12px;
            font-size: 0.85rem;
        }
        
        @media (max-width: 768px) {
            .notes-toolbar {
                flex-direction: column;
            }
            
            .notes-search {
                width: 100%;
            }
            
            .notes-actions {
                width: 100%;
                justify-content: center;
            }
            
            .notes-grid {
                grid-template-columns: 1fr;
            }
            
            .note-modal {
                max-height: 90vh;
            }
        }
    `;
    document.head.appendChild(notesStyles);
    
    // ================================================
    // INITIALIZATION
    // ================================================
    
    // Load notes on startup
    loadNotes();
    
    // ================================================
    // EXPORT TO GLOBAL SCOPE
    // ================================================
    
    window.NotesSystem = {
        // Data access
        loadNotes,
        saveNotes,
        getAllNotes,
        getNotesForContent,
        getNotesByType,
        searchNotes,
        
        // CRUD
        addNote,
        updateNote,
        deleteNote,
        
        // Import/Export
        exportNotes,
        importNotes,
        
        // UI
        renderNoteButton,
        openNoteModal,
        closeNoteModal,
        saveNewNote,
        editNote,
        saveEditedNote,
        cancelEdit,
        confirmDeleteNote,
        
        // All Notes View
        showAllNotes,
        filterNotes,
        filterByType,
        goToContent,
        
        // Quick Note
        openQuickNote,
        saveQuickNote,
        
        // Inline editing
        editNoteInline,
        cancelEditInline,
        
        // Import dialog
        showImportDialog,
        handleImportFile
    };
    
    console.log('✅ Notes System ready');
    console.log(`   📝 ${Object.keys(notesData).length} notes loaded`);

})();
