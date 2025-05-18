// Context menu functionality
import * as entities from '../entities.js';
import { highlightNode, removeNodeFromGraph } from '../graph.js';

let contextMenuState = {
  visible: false,
  targetEntityId: null,
  targetType: null
};

function initializeContextMenu() {
  const contextMenu = document.getElementById('context-menu');
  
  // Hide context menu when clicking outside
  document.addEventListener('click', event => {
    if (contextMenuState.visible && !contextMenu.contains(event.target)) {
      hideContextMenu();
    }
  });

  // Setup entity list context menu
  setupEntityListContextMenu();
  
  // Context menu actions
  document.getElementById('context-edit').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      import('../app.js').then(app => {
        app.editEntity(contextMenuState.targetEntityId);
        hideContextMenu();
      });
    }
  });
  
  document.getElementById('context-connect').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      showModal('add-connection-modal');
      import('../app.js').then(app => {
        app.populateEntitySelects(contextMenuState.targetEntityId);
      });
      hideContextMenu();
    }
  });
  
  document.getElementById('context-highlight').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      highlightNode(contextMenuState.targetEntityId);
      hideContextMenu();
    }
  });
  
  document.getElementById('context-delete').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      if (confirm('Are you sure you want to delete this entity?')) {
        // Remove from graph
        removeNodeFromGraph(contextMenuState.targetEntityId);
        
        // Remove from data
        entities.deleteEntity(contextMenuState.targetEntityId);
        
        // Update UI
        import('../app.js').then(app => {
          app.updateEntityList();
          app.selectEntity(null);
        });
        
        // Save state
        import('../utils/storage.js').then(storage => {
          storage.saveInvestigation();
        });
      }
      hideContextMenu();
    }
  });
}

function setupEntityListContextMenu() {
  const entityList = document.getElementById('entity-list');
  
  if (!entityList) return;
  
  entityList.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const entityItem = e.target.closest('.entity-item');
    if (entityItem) {
      const entityId = entityItem.getAttribute('data-id');
      showContextMenu(e.clientX, e.clientY, entityId, 'list');
    }
  });
}

function showContextMenu(x, y, entityId, type = 'graph') {
  const contextMenu = document.getElementById('context-menu');
  
  // Update menu items based on context
  const menuItems = contextMenu.querySelectorAll('li');
  menuItems.forEach(item => {
    if (type === 'list' && item.id === 'context-highlight') {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
  
  // Position menu
  let posX = x;
  let posY = y;
  
  const menuWidth = contextMenu.offsetWidth;
  const menuHeight = contextMenu.offsetHeight;
  
  if (x + menuWidth > window.innerWidth) {
    posX = window.innerWidth - menuWidth;
  }
  
  if (y + menuHeight > window.innerHeight) {
    posY = window.innerHeight - menuHeight;
  }
  
  contextMenu.style.left = `${posX}px`;
  contextMenu.style.top = `${posY}px`;
  contextMenu.classList.remove('hidden');
  
  // Update state
  contextMenuState.visible = true;
  contextMenuState.targetEntityId = entityId;
  contextMenuState.targetType = type;
}

function hideContextMenu() {
  const contextMenu = document.getElementById('context-menu');
  contextMenu.classList.add('hidden');
  contextMenuState.visible = false;
  contextMenuState.targetEntityId = null;
  contextMenuState.targetType = null;
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

export {
  initializeContextMenu,
  showContextMenu,
  hideContextMenu
};