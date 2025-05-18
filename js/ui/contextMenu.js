// Context menu functionality
import * as entities from '../entities.js';

let contextMenuState = {
  visible: false,
  targetEntityId: null,
  targetType: null
};

function initializeContextMenu() {
  const contextMenu = document.getElementById('context-menu');
  
  document.addEventListener('click', event => {
    if (contextMenuState.visible && !contextMenu.contains(event.target)) {
      hideContextMenu();
    }
  });

  setupEntityListContextMenu();
  setupConnectionContextMenu();
  
  document.getElementById('context-edit').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      import('../app.js').then(app => {
        app.editSelectedEntity();
        hideContextMenu();
      });
    }
  });
  
  document.getElementById('context-connect').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      document.getElementById('add-connection-modal').classList.remove('hidden');
      
      const sourceSelect = document.getElementById('source-entity');
      if (sourceSelect) {
        import('../app.js').then(app => {
          app.populateEntitySelects(contextMenuState.targetEntityId);
        });
      }
      
      hideContextMenu();
    }
  });
  
  document.getElementById('context-highlight').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      import('../graph.js').then(graph => {
        graph.highlightNode(contextMenuState.targetEntityId);
      });
      
      hideContextMenu();
    }
  });
  
  document.getElementById('context-delete').addEventListener('click', () => {
    if (contextMenuState.targetEntityId) {
      if (confirm('Are you sure you want to delete this entity?')) {
        import('../graph.js').then(graph => {
          graph.removeNodeFromGraph(contextMenuState.targetEntityId);
        });
        
        entities.deleteEntity(contextMenuState.targetEntityId);
        
        import('../app.js').then(app => {
          app.updateEntityList();
          
          if (app.state.selectedEntityId === contextMenuState.targetEntityId) {
            import('./panels.js').then(panels => {
              panels.togglePanel('entity-panel', true);
            });
            app.state.selectedEntityId = null;
          }
        });
        
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

function setupConnectionContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    const connectionItem = e.target.closest('.connection-item');
    if (connectionItem) {
      e.preventDefault();
      const targetId = connectionItem.getAttribute('data-id');
      const sourceId = document.querySelector('.entity-details').getAttribute('data-entity-id');
      
      if (sourceId && targetId) {
        showConnectionContextMenu(e.clientX, e.clientY, sourceId, targetId);
      }
    }
  });
}

function showConnectionContextMenu(x, y, sourceId, targetId) {
  const contextMenu = document.getElementById('context-menu');
  
  // Customize menu items for connection
  contextMenu.innerHTML = `
    <ul>
      <li id="context-edit-connection"><i class="fas fa-edit"></i> Edit Connection</li>
      <li id="context-delete-connection"><i class="fas fa-unlink"></i> Remove Connection</li>
    </ul>
  `;
  
  // Add event listeners
  contextMenu.querySelector('#context-edit-connection').addEventListener('click', () => {
    editConnection(sourceId, targetId);
    hideContextMenu();
  });
  
  contextMenu.querySelector('#context-delete-connection').addEventListener('click', () => {
    if (confirm('Are you sure you want to remove this connection?')) {
      removeConnection(sourceId, targetId);
      hideContextMenu();
    }
  });
  
  showContextMenu(x, y, sourceId, 'connection');
}

function editConnection(sourceId, targetId) {
  const entity = entities.getEntityById(sourceId);
  const connection = entity.connections.find(c => c.targetId === targetId);
  
  if (!connection) return;
  
  const newLabel = prompt('Enter new connection label:', connection.label || '');
  if (newLabel !== null) {
    entities.addEntityConnection(sourceId, targetId, newLabel);
    
    import('../graph.js').then(graph => {
      const edgeId = `${sourceId}-${targetId}`;
      graph.removeEdgeFromGraph(edgeId);
      graph.addEdgeToGraph({
        source: sourceId,
        target: targetId,
        label: newLabel
      });
    });
    
    import('../app.js').then(app => {
      app.showEntityDetails(sourceId);
    });
    
    import('../utils/storage.js').then(storage => {
      storage.saveInvestigation();
    });
  }
}

function removeConnection(sourceId, targetId) {
  entities.removeEntityConnection(sourceId, targetId);
  
  import('../graph.js').then(graph => {
    const edgeId = `${sourceId}-${targetId}`;
    graph.removeEdgeFromGraph(edgeId);
  });
  
  import('../app.js').then(app => {
    app.showEntityDetails(sourceId);
  });
  
  import('../utils/storage.js').then(storage => {
    storage.saveInvestigation();
  });
}

function showContextMenu(x, y, entityId, type = 'graph') {
  const contextMenu = document.getElementById('context-menu');
  
  // Reset to default menu items if not a connection context menu
  if (type !== 'connection') {
    contextMenu.innerHTML = `
      <ul>
        <li id="context-edit"><i class="fas fa-edit"></i> Edit</li>
        <li id="context-connect"><i class="fas fa-link"></i> Connect</li>
        <li id="context-highlight"><i class="fas fa-highlighter"></i> Highlight</li>
        <li id="context-delete"><i class="fas fa-trash"></i> Delete</li>
      </ul>
    `;
  }
  
  const menuItems = contextMenu.querySelectorAll('li');
  
  menuItems.forEach(item => {
    if (type === 'list' && item.id === 'context-highlight') {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
  
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

export {
  initializeContextMenu,
  showContextMenu,
  hideContextMenu
};