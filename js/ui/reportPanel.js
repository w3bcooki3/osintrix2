// Report panel functionality

// Initialize report panel
function initializeReportPanel() {
  const reportPanel = document.getElementById('osintrix-report');
  const reportHeader = document.getElementById('osintrix-report-header');
  const maximizeBtn = document.getElementById('osintrix-report-maximize');
  const closeBtn = document.getElementById('osintrix-report-close');
  
  // Only proceed if required elements exist
  if (!reportPanel) return;
  
  // Make report panel draggable if header exists
  if (reportHeader) {
    makePanelDraggable(reportPanel, reportHeader);
  }
  
  // Make report panel resizable
  makeReportPanelResizable(reportPanel);
  
  // Toggle maximized state if button exists
  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', () => {
      reportPanel.classList.toggle('osintrix_report_minimized');
      
      // Update icon
      maximizeBtn.innerHTML = reportPanel.classList.contains('osintrix_report_minimized') ? 
        '<i class="fa fa-maximize"></i>' : 
        '<i class="fa fa-minimize"></i>';
    });
  }
  
  // Close report panel if button exists
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      reportPanel.classList.add('hidden');
    });
  }
  
  // Tab switching
  const tabs = document.querySelectorAll('.osintrix_report_tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all tab content
      document.querySelectorAll('.osintrix_report_tab_content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show the corresponding tab content
      document.querySelector(`.osintrix_report_tab_content[data-content="${tabName}"]`).classList.add('active');
    });
  });
  
  // Rich text editor functionality
  initializeRichTextEditor();
  
  // Timeline functionality
  initializeTimeline();
  
  // Show report panel button in notes panel
  const notesPanel = document.getElementById('notes-panel');
  if (notesPanel) {
    const notesFooter = document.createElement('div');
    notesFooter.className = 'form-actions';
    notesFooter.style.marginTop = '10px';
    
    const showReportBtn = document.createElement('button');
    showReportBtn.className = 'btn-primary';
    showReportBtn.innerHTML = '<i class="fas fa-file-lines"></i> Advanced Report';
    showReportBtn.addEventListener('click', () => {
      reportPanel.classList.remove('hidden');
      reportPanel.classList.remove('osintrix_report_minimized');
    });
    
    notesFooter.appendChild(showReportBtn);
    
    // Insert before the existing form-actions element
    const existingFormActions = notesPanel.querySelector('.form-actions');
    notesPanel.querySelector('.panel-content').insertBefore(notesFooter, existingFormActions);
  }
}

// Make panel draggable
function makePanelDraggable(panel, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  handle.addEventListener('mousedown', dragMouseDown);
  
  function dragMouseDown(e) {
    e.preventDefault();
    
    // Get the mouse position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
  }
  
  function elementDrag(e) {
    e.preventDefault();
    
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Calculate new position
    const newTop = panel.offsetTop - pos2;
    const newLeft = panel.offsetLeft - pos1;
    
    // Set new position with boundary checks
    const maxTop = window.innerHeight - panel.offsetHeight;
    const maxLeft = window.innerWidth - panel.offsetWidth;
    
    panel.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
    panel.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
    
    // Remove the transform that centers the panel
    panel.style.transform = 'none';
  }
  
  function closeDragElement() {
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  }
}

// Make report panel resizable
function makeReportPanelResizable(panel) {
  const resizeHorizontal = panel.querySelector('.osintrix_report_resizer_horizontal');
  const resizeVertical = panel.querySelector('.osintrix_report_resizer_vertical');
  
  let initialWidth, initialHeight, initialX, initialY;
  
  // Horizontal resizing
  if (resizeHorizontal) {
    resizeHorizontal.addEventListener('mousedown', e => {
      e.preventDefault();
      
      initialWidth = panel.offsetWidth;
      initialX = e.clientX;
      
      document.addEventListener('mousemove', resizeHorizontally);
      document.addEventListener('mouseup', stopResize);
    });
  }
  
  // Vertical resizing
  if (resizeVertical) {
    resizeVertical.addEventListener('mousedown', e => {
      e.preventDefault();
      
      initialHeight = panel.offsetHeight;
      initialY = e.clientY;
      
      document.addEventListener('mousemove', resizeVertically);
      document.addEventListener('mouseup', stopResize);
    });
  }
  
  function resizeHorizontally(e) {
    const deltaX = initialX - e.clientX;
    const newWidth = Math.max(300, initialWidth + deltaX);
    
    panel.style.width = newWidth + 'px';
  }
  
  function resizeVertically(e) {
    const deltaY = e.clientY - initialY;
    const newHeight = Math.max(200, initialHeight + deltaY);
    
    panel.style.height = newHeight + 'px';
  }
  
  function stopResize() {
    document.removeEventListener('mousemove', resizeHorizontally);
    document.removeEventListener('mousemove', resizeVertically);
    document.removeEventListener('mouseup', stopResize);
  }
}

// Initialize rich text editor
function initializeRichTextEditor() {
  const editor = document.getElementById('osintrix-notes-editor');
  const toolbar = document.querySelector('.osintrix_notes_toolbar');
  
  if (!editor || !toolbar) return;
  
  // Load saved content if exists
  const savedContent = localStorage.getItem('osintrix_advanced_notes');
  if (savedContent) {
    editor.innerHTML = savedContent;
  }
  
  // Save content when it changes
  editor.addEventListener('input', () => {
    localStorage.setItem('osintrix_advanced_notes', editor.innerHTML);
  });
  
  // Toolbar button functionality
  const toolbarButtons = toolbar.querySelectorAll('.osintrix_notes_tool');
  
  toolbarButtons.forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      
      if (command === 'createLink') {
        const url = prompt('Enter the URL:');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else if (command === 'insertImage') {
        const url = prompt('Enter the image URL:');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else {
        document.execCommand(command, false, null);
      }
      
      // Update active state
      if (document.queryCommandState(command)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  });
}

// Initialize timeline
function initializeTimeline() {
  const addTimelineEntryBtn = document.getElementById('add-timeline-entry');
  const timelineDate = document.getElementById('timeline-date');
  const timelineTime = document.getElementById('timeline-time');
  const timelineContent = document.getElementById('timeline-content');
  const timelineEntriesContainer = document.getElementById('timeline-entries');
  
  if (!addTimelineEntryBtn || !timelineDate || !timelineTime || !timelineContent || !timelineEntriesContainer) return;
  
  // Set default date and time
  const now = new Date();
  timelineDate.value = now.toISOString().slice(0, 10);
  timelineTime.value = now.toTimeString().slice(0, 5);
  
  // Load saved timeline entries
  loadTimelineEntries();
  
  // Add entry button
  addTimelineEntryBtn.addEventListener('click', () => {
    if (!timelineContent.value.trim()) {
      alert('Please enter some content for the timeline entry.');
      return;
    }
    
    addTimelineEntry({
      date: timelineDate.value,
      time: timelineTime.value,
      content: timelineContent.value,
      priority: 'normal'
    });
    
    // Clear the content field
    timelineContent.value = '';
    
    // Update the date and time to now
    const now = new Date();
    timelineDate.value = now.toISOString().slice(0, 10);
    timelineTime.value = now.toTimeString().slice(0, 5);
  });
  
  // Export button
  const exportBtn = document.getElementById('export-report');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportReport);
  }
  
  // Save button
  const saveBtn = document.getElementById('save-report');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveReport);
  }
}

// Add timeline entry
function addTimelineEntry(entry) {
  const timelineEntriesContainer = document.getElementById('timeline-entries');
  
  if (!timelineEntriesContainer) return;
  
  // Create new entry element
  const entryElement = document.createElement('div');
  entryElement.className = 'osintrix_report_timeline_entry';
  
  if (entry.priority === 'high') {
    entryElement.classList.add('high-priority');
  } else if (entry.priority === 'medium') {
    entryElement.classList.add('medium-priority');
  }
  
  // Format the date and time
  let formattedDateTime = '';
  
  if (entry.date) {
    const date = new Date(entry.date);
    formattedDateTime = date.toLocaleDateString();
    
    if (entry.time) {
      formattedDateTime += ' ' + entry.time;
    }
  }
  
  entryElement.innerHTML = `
    <div class="osintrix_report_timeline_time">
      ${formattedDateTime}
      <div class="osintrix_report_timeline_actions">
        <button class="osintrix_timeline_action" data-action="edit">
          <i class="fa fa-edit"></i>
        </button>
        <button class="osintrix_timeline_action" data-action="delete">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="osintrix_report_timeline_content">
      ${entry.content}
    </div>
  `;
  
  // Add to the container
  timelineEntriesContainer.appendChild(entryElement);
  
  // Add event listeners
  const deleteBtn = entryElement.querySelector('[data-action="delete"]');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this timeline entry?')) {
        entryElement.remove();
        saveTimelineEntries();
      }
    });
  }
  
  const editBtn = entryElement.querySelector('[data-action="edit"]');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      // Implement edit functionality
      alert('Edit functionality coming soon!');
    });
  }
  
  // Save entries
  saveTimelineEntries();
}

// Save timeline entries
function saveTimelineEntries() {
  const timelineEntriesContainer = document.getElementById('timeline-entries');
  
  if (!timelineEntriesContainer) return;
  
  // Get all entries
  const entries = [];
  
  timelineEntriesContainer.querySelectorAll('.osintrix_report_timeline_entry').forEach(entryElement => {
    const timeElement = entryElement.querySelector('.osintrix_report_timeline_time');
    const contentElement = entryElement.querySelector('.osintrix_report_timeline_content');
    
    if (timeElement && contentElement) {
      let priority = 'normal';
      if (entryElement.classList.contains('high-priority')) {
        priority = 'high';
      } else if (entryElement.classList.contains('medium-priority')) {
        priority = 'medium';
      }
      
      entries.push({
        dateTime: timeElement.textContent.trim(),
        content: contentElement.innerHTML,
        priority
      });
    }
  });
  
  // Save to localStorage
  localStorage.setItem('osintrix_timeline_entries', JSON.stringify(entries));
}

// Load timeline entries
function loadTimelineEntries() {
  const savedEntries = localStorage.getItem('osintrix_timeline_entries');
  
  if (savedEntries) {
    try {
      const entries = JSON.parse(savedEntries);
      
      entries.forEach(entry => {
        addTimelineEntry({
          date: entry.dateTime, // This is just a placeholder, as the date and time are combined
          time: '',
          content: entry.content,
          priority: entry.priority || 'normal'
        });
      });
    } catch (error) {
      console.error('Error loading timeline entries:', error);
    }
  }
}

// Export report
function exportReport() {
  const notesEditor = document.getElementById('osintrix-notes-editor');
  const timelineEntries = document.getElementById('timeline-entries');
  
  if (!notesEditor || !timelineEntries) return;
  
  const notesContent = notesEditor.innerHTML;
  const timelineContent = timelineEntries.innerHTML;
  
  // Create a HTML document
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Investigation Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
          color: #2D5BFF;
        }
        h2 {
          margin-top: 40px;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          color: #2D5BFF;
        }
        .notes-content {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        .timeline {
          border-left: 2px solid #ccc;
          margin-left: 20px;
          padding-left: 20px;
        }
        .timeline-entry {
          margin-bottom: 20px;
          position: relative;
        }
        .timeline-entry::before {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #2D5BFF;
          left: -26px;
          top: 6px;
        }
        .timeline-time {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 5px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <h1>OSINTrix Investigation Report</h1>
      
      <h2>Investigation Notes</h2>
      <div class="notes-content">
        ${notesContent}
      </div>
      
      <h2>Timeline</h2>
      <div class="timeline">
        ${timelineContent.replace(/osintrix_report_timeline_entry/g, 'timeline-entry')
            .replace(/osintrix_report_timeline_time/g, 'timeline-time')
            .replace(/osintrix_report_timeline_content/g, 'timeline-content')
            .replace(/<div class="osintrix_report_timeline_actions">.*?<\/div>/g, '')}
      </div>
      
      <footer>
        <p style="text-align: center; margin-top: 50px; color: #888; font-size: 0.8rem;">
          Generated with OSINTrix Cyber Investigation Tool
        </p>
      </footer>
    </body>
    </html>
  `;
  
  // Create a blob
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a download link
  const a = document.createElement('a');
  a.href = url;
  a.download = 'investigation-report.html';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

// Save report
function saveReport() {
  // Save notes content
  const notesEditor = document.getElementById('osintrix-notes-editor');
  if (notesEditor) {
    localStorage.setItem('osintrix_advanced_notes', notesEditor.innerHTML);
  }
  
  // Save timeline entries
  saveTimelineEntries();
  
  // Show confirmation
  alert('Report saved successfully!');
}

// Export report panel related functions
export {
  initializeReportPanel
};