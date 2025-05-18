// Storage utilities

function setupStorage() {
  if (!window.localStorage) {
    console.error('localStorage is not available.');
    return false;
  }
  
  return true;
}

function saveInvestigation() {
  import('../entities.js').then(entities => {
    const entityData = entities.getAllEntities();
    
    localStorage.setItem('osintrix_investigation', JSON.stringify({
      entities: entityData,
      version: '1.0.0',
      savedAt: new Date().toISOString()
    }));
  });
}

function loadInvestigation() {
  const savedData = localStorage.getItem('osintrix_investigation');
  
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      
      import('../entities.js').then(entities => {
        entities.setEntitiesData(data.entities || []);
      });
      
      return data;
    } catch (error) {
      console.error('Error loading investigation data:', error);
      return null;
    }
  }
  
  return null;
}

function exportInvestigation(filename) {
  import('../entities.js').then(entities => {
    const entityData = entities.getAllEntities();
    
    import('../ui/notes.js').then(notes => {
      const notesContent = notes.getNotes();
      
      const exportData = {
        entities: entityData,
        notes: notesContent,
        advancedNotes: localStorage.getItem('osintrix_advanced_notes') || '',
        timelineEntries: JSON.parse(localStorage.getItem('osintrix_timeline_entries') || '[]'),
        version: '1.0.0',
        exportedAt: new Date().toISOString()
      };
      
      const jsonData = JSON.stringify(exportData, null, 2);
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    });
  });
}

function importInvestigation(data) {
  try {
    localStorage.removeItem('osintrix_investigation');
    localStorage.removeItem('osintrix_notes');
    localStorage.removeItem('osintrix_advanced_notes');
    localStorage.removeItem('osintrix_timeline_entries');
    
    import('../entities.js').then(entities => {
      entities.setEntitiesData(data.entities || []);
      
      import('../graph.js').then(graph => {
        // First add all nodes
        data.entities.forEach(entity => {
          graph.addNodeToGraph({
            id: entity.id,
            label: entity.label,
            type: entity.type
          }, false); // Pass false to prevent running layout for each node
        });
        
        // Then add all edges after nodes are created
        data.entities.forEach(entity => {
          if (entity.connections) {
            entity.connections.forEach(connection => {
              graph.addEdgeToGraph({
                source: entity.id,
                target: connection.targetId,
                label: connection.label || ''
              });
            });
          }
        });

        // Run layout once after all nodes and edges are added
        graph.resetGraphView();
      });
    });
    
    if (data.notes) {
      localStorage.setItem('osintrix_notes', data.notes);
      
      const notesTextarea = document.getElementById('investigation-notes');
      if (notesTextarea) {
        notesTextarea.value = data.notes;
      }
    }
    
    if (data.advancedNotes) {
      localStorage.setItem('osintrix_advanced_notes', data.advancedNotes);
      
      const notesEditor = document.getElementById('osintrix-notes-editor');
      if (notesEditor) {
        notesEditor.innerHTML = data.advancedNotes;
      }
    }
    
    if (data.timelineEntries) {
      localStorage.setItem('osintrix_timeline_entries', JSON.stringify(data.timelineEntries));
    }
    
    localStorage.setItem('osintrix_investigation', JSON.stringify({
      entities: data.entities,
      version: '1.0.0',
      savedAt: new Date().toISOString()
    }));
    
    import('../app.js').then(app => {
      app.updateEntityList();
    });
    
    return true;
  } catch (error) {
    console.error('Error importing investigation data:', error);
    return false;
  }
}

export {
  setupStorage,
  saveInvestigation,
  loadInvestigation,
  exportInvestigation,
  importInvestigation
};