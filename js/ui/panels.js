// UI Panel management

// Initialize panels
function initializePanels() {
  // Make panels draggable
  makeElementDraggable(document.getElementById('entity-panel'));
  makeElementDraggable(document.getElementById('entity-list-panel'));
  makeElementDraggable(document.getElementById('notes-panel'));
}

// Make an element draggable
function makeElementDraggable(element) {
  if (!element) return;
  
  const header = element.querySelector('.panel-header');
  
  if (!header) return;
  
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let isDragging = false;
  
  header.addEventListener('mousedown', dragMouseDown);
  
  function dragMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    
    // Get the mouse position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    document.addEventListener('mouseup', closeDragElement);
    document.addEventListener('mousemove', elementDrag);
  }
  
  function elementDrag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    // Set the element's new position
    const newTop = element.offsetTop - pos2;
    const newLeft = element.offsetLeft - pos1;
    
    // Check boundaries
    const maxTop = window.innerHeight - element.offsetHeight;
    const maxLeft = window.innerWidth - element.offsetWidth;
    
    element.style.top = Math.min(Math.max(0, newTop), maxTop) + "px";
    element.style.left = Math.min(Math.max(0, newLeft), maxLeft) + "px";
  }
  
  function closeDragElement() {
    isDragging = false;
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  }
}

// Toggle panel visibility
function togglePanel(panelId, collapse = false, hide = false) {
  const panel = document.getElementById(panelId);
  
  if (!panel) return;
  
  // If hide is true, hide the panel completely
  if (hide) {
    panel.classList.add('hidden');
    return;
  }
  
  // If collapse is true, toggle collapse state
  if (collapse) {
    if (panelId === 'entity-list-panel') {
      panel.classList.toggle('collapsed');
      
      // Update button icon
      const button = document.getElementById('collapse-entity-list-btn');
      if (button) {
        button.innerHTML = panel.classList.contains('collapsed') ? 
          '<i class="fas fa-chevron-right"></i>' : 
          '<i class="fas fa-chevron-left"></i>';
      }
    } else if (panelId === 'entity-panel') {
      panel.classList.toggle('collapsed');
      panel.classList.toggle('right');
      
      // Reset position when collapsing
      if (panel.classList.contains('collapsed')) {
        panel.style.removeProperty('top');
        panel.style.removeProperty('left');
      }
      
      // Update button icon
      const button = document.getElementById('collapse-entity-panel-btn');
      if (button) {
        button.innerHTML = panel.classList.contains('collapsed') ? 
          '<i class="fas fa-chevron-left"></i>' : 
          '<i class="fas fa-chevron-right"></i>';
      }
    } else if (panelId === 'notes-panel') {
      panel.classList.toggle('collapsed');
      
      // Update button icon
      const button = document.getElementById('collapse-notes-btn');
      if (button) {
        button.innerHTML = panel.classList.contains('collapsed') ? 
          '<i class="fas fa-chevron-up"></i>' : 
          '<i class="fas fa-chevron-down"></i>';
      }
    }
  } else {
    // Toggle visibility
    panel.classList.toggle('hidden');
    
    // If showing panel, ensure it's not collapsed
    if (!panel.classList.contains('hidden')) {
      panel.classList.remove('collapsed');
      panel.classList.remove('right');
      
      // Reset position
      if (panelId === 'entity-panel') {
        panel.style.removeProperty('top');
        panel.style.removeProperty('left');
      }
      
      // Update button icon
      if (panelId === 'entity-list-panel') {
        const button = document.getElementById('collapse-entity-list-btn');
        if (button) {
          button.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }
      } else if (panelId === 'entity-panel') {
        const button = document.getElementById('collapse-entity-panel-btn');
        if (button) {
          button.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
      } else if (panelId === 'notes-panel') {
        const button = document.getElementById('collapse-notes-btn');
        if (button) {
          button.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
      }
    }
  }
}

// Close all panels
function closeAllPanels() {
  const panels = document.querySelectorAll('.panel');
  
  panels.forEach(panel => {
    panel.classList.add('hidden');
  });
}

// Export panel related functions
export {
  initializePanels,
  togglePanel,
  closeAllPanels,
  makeElementDraggable
};