// Notes panel functionality with rich text editing

let notesState = {
  notes: '',
  title: '',
  format: 'rich'
};

function initializeNotes() {
  const editor = document.getElementById('notes-editor');
  const toolbar = document.querySelector('.notes-toolbar');
  const titleInput = document.getElementById('investigation-title');
  
  if (!editor || !toolbar || !titleInput) return;
  
  // Load saved content
  editor.innerHTML = localStorage.getItem('osintrix_notes') || '';
  titleInput.value = localStorage.getItem('osintrix_notes_title') || '';
  
  // Make title input editable
  titleInput.readOnly = false;
  titleInput.spellcheck = true;
  
  // Make panel resizable
  makeNotesResizable();
  
  // Setup event listeners
  setupNotesEvents(editor, toolbar, titleInput);
}

function makeNotesResizable() {
  const panel = document.getElementById('notes-panel');
  const handle = panel.querySelector('.resize-handle');
  
  let isResizing = false;
  let startX, startY, startWidth, startHeight;
  
  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = panel.offsetWidth;
    startHeight = panel.offsetHeight;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
  });
  
  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    if (e.clientX < startX) { // Left resize
      panel.style.width = Math.max(300, startWidth - deltaX) + 'px';
    }
    
    if (e.clientY > startY) { // Bottom resize
      panel.style.height = Math.max(200, startHeight + deltaY) + 'px';
    }
  }
  
  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  }
}

function setupNotesEvents(editor, toolbar, titleInput) {
  // Save title on input
  titleInput.addEventListener('input', () => {
    notesState.title = titleInput.value;
    localStorage.setItem('osintrix_notes_title', titleInput.value);
  });

  // Focus title on click
  titleInput.addEventListener('click', () => {
    titleInput.select();
  });

  // Toolbar buttons
  toolbar.querySelectorAll('.notes-tool').forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      
      if (command === 'createLink') {
        const url = prompt('Enter the URL:');
        if (url) document.execCommand(command, false, url);
      }
      else if (command === 'insertImage') {
        showImageDialog((url) => {
          if (url) {
            // Create image element for better control
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // Insert at cursor position
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
          }
        });
      }
      else if (command.startsWith('h')) {
        document.execCommand('formatBlock', false, command.toUpperCase());
      }
      else {
        document.execCommand(command, false, null);
      }
      
      saveNotes(editor);
    });
  });
  
  // Save on input
  editor.addEventListener('input', () => saveNotes(editor));
  
  // Clear notes
  document.getElementById('clear-notes-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      editor.innerHTML = '';
      titleInput.value = '';
      saveNotes(editor);
      localStorage.removeItem('osintrix_notes_title');
    }
  });
  
  // Export notes
  document.getElementById('export-notes-btn').addEventListener('click', () => exportNotes(editor, titleInput.value));
}

function showImageDialog(callback) {
  const dialog = document.createElement('div');
  dialog.className = 'image-upload-dialog';
  dialog.innerHTML = `
    <h3>Insert Image</h3>
    <input type="text" id="image-url" placeholder="Enter image URL" class="form-control">
    <div class="actions">
      <button class="btn-secondary" id="cancel-image">Cancel</button>
      <button class="btn-primary" id="insert-image">Insert</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  const urlInput = dialog.querySelector('#image-url');
  const insertBtn = dialog.querySelector('#insert-image');
  const cancelBtn = dialog.querySelector('#cancel-image');
  
  insertBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      callback(url);
    }
    document.body.removeChild(dialog);
  });
  
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(dialog);
  });
  
  urlInput.focus();
}

function saveNotes(editor) {
  notesState.notes = editor.innerHTML;
  localStorage.setItem('osintrix_notes', notesState.notes);
}

function exportNotes(editor, title) {
  const content = editor.innerHTML;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Investigation Notes'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
    }
    
    h1, h2, h3 { color: #2D5BFF; }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    a { color: #2D5BFF; }
    
    ul, ol {
      padding-left: 20px;
      margin: 16px 0;
    }
    
    blockquote {
      border-left: 4px solid #2D5BFF;
      margin: 20px 0;
      padding-left: 16px;
      color: #666;
    }
    
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th { background: #f5f5f5; }
    
    @media print {
      body {
        max-width: none;
        margin: 0;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <h1>${title || 'Investigation Notes'}</h1>
  <hr>
  ${content}
  <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
    Generated with OSINTrix Investigation Tool
    <br>
    Date: ${new Date().toLocaleString()}
  </footer>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title || 'investigation-notes'}.html`;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

function addToNotes(text) {
  const editor = document.getElementById('notes-editor');
  if (!editor) return;
  
  const currentContent = editor.innerHTML;
  editor.innerHTML = currentContent + (currentContent ? '<br><br>' : '') + text;
  saveNotes(editor);
}

function getNotes() {
  return notesState.notes;
}

export {
  initializeNotes,
  addToNotes,
  getNotes,
  exportNotes
};