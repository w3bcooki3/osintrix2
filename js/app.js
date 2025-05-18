// Import all necessary modules
import { initGraph, addNodeToGraph, removeNodeFromGraph, addEdgeToGraph, removeEdgeFromGraph, findNode, highlightNode, clearHighlights, findShortestPath, resetGraphView } from './graph.js';
import { createEntity, getEntityIcon, getEntityById, getAllEntities, deleteEntity, addEntityConnection, removeEntityConnection, updateEntity, duplicateEntity } from './entities.js';
import { setupStorage, saveInvestigation, loadInvestigation, exportInvestigation, importInvestigation } from './utils/storage.js';
import { initializePanels, togglePanel, closeAllPanels } from './ui/panels.js';
import { initializeNotes } from './ui/notes.js';
import { initializeContextMenu } from './ui/contextMenu.js';
import { initializeReportPanel } from './ui/reportPanel.js';

// Application state
let state = {
  isDarkTheme: true,
  selectedEntityId: null,
  isInitialLoad: true,
  editMode: false,
  metadataFields: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {

  // Apply dark theme immediately
  document.body.classList.add('dark-theme');
  
  // Update theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Show welcome screen for 3 seconds
  setTimeout(() => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const app = document.getElementById('app');
    
    welcomeScreen.classList.add('welcome-screen-hidden');
    app.classList.remove('hidden');
    
    // Initialize the application after welcome screen
    initializeApp();
  }, 3000);
});

function initializeApp() {
  // Initialize graph
  const graphContainer = document.getElementById('graph-container');
  initGraph(graphContainer);

  // Initialize UI components
  initializePanels();
  initializeNotes();
  initializeContextMenu();
  initializeReportPanel();
  initializeMetadataFields();

  // Initialize storage
  setupStorage();

  // Load saved investigation if exists
  const savedData = loadInvestigation();
  if (savedData) {
    importData(savedData);
  }

  // Set up event listeners
  setupEventListeners();

  // Toggle panels for initial view
  togglePanel('entity-list-panel', false);
  
  state.isInitialLoad = false;
}

function initializeMetadataFields() {
  const addMetadataBtn = document.getElementById('add-metadata-field');
  const metadataContainer = document.getElementById('metadata-fields');
  
  if (!addMetadataBtn || !metadataContainer) return;
  
  addMetadataBtn.addEventListener('click', () => {
    addMetadataField();
  });
}

function addMetadataField(key = '', value = '') {
  const metadataContainer = document.getElementById('metadata-fields');
  const fieldId = `metadata-${Date.now()}`;
  
  const fieldDiv = document.createElement('div');
  fieldDiv.className = 'form-row metadata-field';
  fieldDiv.innerHTML = `
    <div class="form-group half">
      <input type="text" class="metadata-key" placeholder="Key" value="${key}">
    </div>
    <div class="form-group half">
      <input type="text" class="metadata-value" placeholder="Value" value="${value}">
    </div>
    <button type="button" class="btn-icon remove-metadata">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add remove button handler
  const removeBtn = fieldDiv.querySelector('.remove-metadata');
  removeBtn.addEventListener('click', () => {
    fieldDiv.remove();
  });
  
  metadataContainer.appendChild(fieldDiv);
}

function setupEventListeners() {
  // Add entity button
  document.getElementById('add-entity-btn').addEventListener('click', () => {
    state.editMode = false;
    showModal('add-entity-modal');
    populateEntitySelects();
  });

  // Add connection button in toolbar
  document.getElementById('add-connection-toolbar-btn').addEventListener('click', () => {
    showModal('add-connection-modal');
    populateEntitySelects();
  });

  // Reset layout button
  document.getElementById('reset-layout-btn').addEventListener('click', resetGraphView);

  // Entity form submission
  document.getElementById('add-entity-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.editMode) {
      updateExistingEntity();
    } else {
      addNewEntity();
    }
  });

  // Toggle theme button
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  // Toggle panels buttons
  document.getElementById('toggle-entity-list-btn').addEventListener('click', () => togglePanel('entity-list-panel'));
  document.getElementById('toggle-notes-btn').addEventListener('click', () => togglePanel('notes-panel'));

  // Panel action buttons
  document.getElementById('collapse-entity-list-btn').addEventListener('click', () => togglePanel('entity-list-panel', true));
  document.getElementById('collapse-entity-panel-btn').addEventListener('click', () => togglePanel('entity-panel', true));
  document.getElementById('collapse-notes-btn').addEventListener('click', () => togglePanel('notes-panel', true));

  // Filter toggle
  document.getElementById('toggle-filter-btn').addEventListener('click', toggleFilters);

  // Entity type filters
  document.querySelectorAll('.entity-type-filter').forEach(checkbox => {
    checkbox.addEventListener('change', filterEntities);
  });

  // Search input
  document.getElementById('search-input').addEventListener('input', handleSearch);

  // Export/Import buttons
  document.getElementById('export-btn').addEventListener('click', () => showModal('export-modal'));
  document.getElementById('import-btn').addEventListener('click', () => showModal('import-modal'));
  
  document.getElementById('confirm-export').addEventListener('click', handleExport);
  document.getElementById('confirm-import').addEventListener('click', handleImport);

  // Modal close buttons
  document.querySelectorAll('.modal').forEach(modal => {
    const closeButtons = modal.querySelectorAll('[id^="close-"], [id^="cancel-"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => hideModal(modal.id));
    });
  });

  // Entity actions
  document.getElementById('edit-entity-btn').addEventListener('click', () => editEntity(state.selectedEntityId));
  document.getElementById('delete-entity-btn').addEventListener('click', () => deleteSelectedEntity());

  // Connection form
  document.getElementById('add-connection-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addNewConnection();
  });

  // Edit connection form
  document.getElementById('edit-connection-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateConnection();
  });

  // Delete connection button
  document.getElementById('delete-connection').addEventListener('click', deleteConnection);

  // Image upload handling
  document.getElementById('upload-image-btn').addEventListener('click', () => {
    document.getElementById('node-image').click();
  });

  document.getElementById('node-image').addEventListener('change', handleImageUpload);
}

function editEntity(entityId) {
  if (!entityId) return;
  
  const entity = getEntityById(entityId);
  if (!entity) return;
  
  // Set edit mode
  state.editMode = true;
  
  // Clear existing metadata fields
  const metadataContainer = document.getElementById('metadata-fields');
  metadataContainer.innerHTML = '';
  
  // Populate form with entity data
  document.getElementById('entity-type').value = entity.type || '';
  document.getElementById('entity-name').value = entity.name;
  document.getElementById('entity-label').value = entity.label;
  document.getElementById('entity-date').value = entity.date;
  document.getElementById('entity-time').value = entity.time;
  document.getElementById('entity-location').value = entity.location;
  document.getElementById('entity-tags').value = entity.tags.join(', ');
  document.getElementById('entity-description').value = entity.description;
  
  // Add metadata fields
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      addMetadataField(key, value);
    });
  }
  
  if (entity.image) {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.style.backgroundImage = `url(${entity.image})`;
    imagePreview.classList.add('has-image');
  }
  
  // Update form button text
  const submitButton = document.querySelector('#add-entity-form button[type="submit"]');
  submitButton.textContent = 'Update Entity';
  
  // Show modal
  showModal('add-entity-modal');
}

function updateExistingEntity() {
  const entityId = state.selectedEntityId;
  if (!entityId) return;

  const type = document.getElementById('entity-type').value;
  const name = document.getElementById('entity-name').value;
  const label = document.getElementById('entity-label').value || name;
  const date = document.getElementById('entity-date').value;
  const time = document.getElementById('entity-time').value;
  const location = document.getElementById('entity-location').value;
  const tags = document.getElementById('entity-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
  const description = document.getElementById('entity-description').value;

  // Get metadata
  const metadata = {};
  document.querySelectorAll('.metadata-field').forEach(field => {
    const key = field.querySelector('.metadata-key').value.trim();
    const value = field.querySelector('.metadata-value').value.trim();
    if (key && value) {
      metadata[key] = value;
    }
  });

  const imagePreview = document.getElementById('image-preview');
  const imageData = imagePreview.classList.contains('has-image') ? 
    imagePreview.style.backgroundImage.slice(5, -2) : 
    '';

  const updatedEntity = updateEntity(entityId, {
    type,
    name,
    label,
    date,
    time,
    location,
    tags,
    description,
    metadata,
    image: imageData
  });

  // Update graph node
  const node = findNode(entityId);
  if (node) {
    node.data('label', label);
    node.data('type', type);
  }

  // Update UI
  updateEntityList();
  showEntityDetails(entityId);

  // Reset form and hide modal
  document.getElementById('add-entity-form').reset();
  document.getElementById('image-preview').classList.remove('has-image');
  document.getElementById('image-preview').style.backgroundImage = '';
  document.getElementById('metadata-fields').innerHTML = '';

  // Reset submit button text
  const submitButton = document.querySelector('#add-entity-form button[type="submit"]');
  submitButton.textContent = 'Add Entity';

  hideModal('add-entity-modal');
  state.editMode = false;

  // Save state
  saveInvestigation();
}

function toggleTheme() {
  const body = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  state.isDarkTheme = !state.isDarkTheme;
  
  if (state.isDarkTheme) {
    body.classList.add('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark-theme');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

function toggleFilters() {
  const filterOptions = document.getElementById('filter-options');
  filterOptions.classList.toggle('hidden');
}

function filterEntities() {
  const selectedTypes = Array.from(document.querySelectorAll('.entity-type-filter:checked'))
    .map(checkbox => checkbox.value);
  
  const entityItems = document.querySelectorAll('.entity-item');
  
  entityItems.forEach(item => {
    const entityType = item.getAttribute('data-type');
    if (selectedTypes.includes(entityType)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

function handleSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const entityItems = document.querySelectorAll('.entity-item');
  
  entityItems.forEach(item => {
    const entityName = item.querySelector('.entity-label').textContent.toLowerCase();
    const entityType = item.getAttribute('data-type').toLowerCase();
    
    if (entityName.includes(searchTerm) || entityType.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
}

function addNewEntity() {
  const type = document.getElementById('entity-type').value;
  const name = document.getElementById('entity-name').value;
  const label = document.getElementById('entity-label').value || name;
  const date = document.getElementById('entity-date').value;
  const time = document.getElementById('entity-time').value;
  const location = document.getElementById('entity-location').value;
  const tags = document.getElementById('entity-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
  const description = document.getElementById('entity-description').value;
  
  // Get metadata
  const metadata = {};
  document.querySelectorAll('.metadata-field').forEach(field => {
    const key = field.querySelector('.metadata-key').value.trim();
    const value = field.querySelector('.metadata-value').value.trim();
    if (key && value) {
      metadata[key] = value;
    }
  });
  
  // Get image if exists
  const imagePreview = document.getElementById('image-preview');
  const imageData = imagePreview.classList.contains('has-image') ? 
    imagePreview.style.backgroundImage.slice(5, -2) : 
    '';
  
  const entity = createEntity({
    type,
    name,
    label,
    date,
    time,
    location,
    tags,
    description,
    metadata,
    image: imageData
  });
  
  // Add to graph
  addNodeToGraph({
    id: entity.id,
    label: entity.label,
    type: entity.type
  });
  
  // Update UI
  updateEntityList();
  
  // Reset form and hide modal
  document.getElementById('add-entity-form').reset();
  document.getElementById('image-preview').classList.remove('has-image');
  document.getElementById('image-preview').style.backgroundImage = '';
  document.getElementById('metadata-fields').innerHTML = '';
  
  hideModal('add-entity-modal');
  
  // Save state
  saveInvestigation();
}

function updateEntityList() {
  const entityList = document.getElementById('entity-list');
  entityList.innerHTML = '';
  
  const entities = getAllEntities();
  
  entities.forEach(entity => {
    const entityItem = document.createElement('li');
    entityItem.className = 'entity-item';
    entityItem.setAttribute('data-id', entity.id);
    entityItem.setAttribute('data-type', entity.type || '');
    
    if (state.selectedEntityId === entity.id) {
      entityItem.classList.add('selected');
    }

    const entityType = typeof entity.type === 'string' && entity.type.length > 0 
      ? entity.type.charAt(0).toUpperCase() + entity.type.slice(1)
      : 'Unknown';
    
    entityItem.innerHTML = `
      <div class="entity-icon ${entity.type || ''}">
        <i class="fas ${getEntityIcon(entity.type)}"></i>
      </div>
      <div class="entity-info">
        <h4 class="entity-label">${entity.label}</h4>
        <div class="entity-type">${entityType}</div>
      </div>
    `;
    
    entityItem.addEventListener('click', () => selectEntity(entity.id));
    
    entityList.appendChild(entityItem);
  });
}

function selectEntity(entityId) {
  // Deselect previously selected item
  const previousSelected = document.querySelector('.entity-item.selected');
  if (previousSelected) {
    previousSelected.classList.remove('selected');
  }
  
  // Select new item
  const entityItem = document.querySelector(`.entity-item[data-id="${entityId}"]`);
  if (entityItem) {
    entityItem.classList.add('selected');
  }
  
  // Update state
  state.selectedEntityId = entityId;
  
  // Highlight in graph
  highlightNode(entityId);
  
  // Show entity details
  showEntityDetails(entityId);
}

function showEntityDetails(entityId) {
  const entity = getEntityById(entityId);
  if (!entity) return;

  const entityType = typeof entity.type === 'string' && entity.type.length > 0 
    ? entity.type.charAt(0).toUpperCase() + entity.type.slice(1)
    : 'Unknown';
  
  const entityDetails = document.getElementById('entity-details');
  
  // Build entity details HTML
  let detailsHTML = `
    <div class="entity-header">
      <div class="entity-header-icon ${entity.type || ''}">
        <i class="fas ${getEntityIcon(entity.type)}"></i>
      </div>
      <div class="entity-header-info">
        <h2 class="entity-header-label">${entity.label}</h2>
        <div class="entity-header-type">${entityType}</div>
      </div>
    </div>
  `;
  
  // Description section
  if (entity.description) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Description</div>
        <p>${entity.description}</p>
      </div>
    `;
  }
  
  // Metadata section
  detailsHTML += `
    <div class="entity-section">
      <div class="entity-section-title">Metadata</div>
      <div class="entity-metadata">
  `;
  
  if (entity.name) {
    detailsHTML += `
      <div class="entity-metadata-key">Name/ID:</div>
      <div class="entity-metadata-value">${entity.name}</div>
    `;
  }
  
  if (entity.date) {
    detailsHTML += `
      <div class="entity-metadata-key">Date:</div>
      <div class="entity-metadata-value">${entity.date}</div>
    `;
  }
  
  if (entity.time) {
    detailsHTML += `
      <div class="entity-metadata-key">Time:</div>
      <div class="entity-metadata-value">${entity.time}</div>
    `;
  }
  
  if (entity.location) {
    detailsHTML += `
      <div class="entity-metadata-key">Location:</div>
      <div class="entity-metadata-value">${entity.location}</div>
    `;
  }
  
  // Custom metadata
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      detailsHTML += `
        <div class="entity-metadata-key">${key}:</div>
        <div class="entity-metadata-value">${value}</div>
      `;
    });
  }
  
  detailsHTML += `
      </div>
    </div>
  `;
  
  // Tags section
  if (entity.tags && entity.tags.length > 0) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Tags</div>
        <div class="entity-tags">
    `;
    
    entity.tags.forEach(tag => {
      detailsHTML += `<span class="entity-tag">${tag}</span>`;
    });
    
    detailsHTML += `
        </div>
      </div>
    `;
  }
  
  // Image section
  if (entity.image) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Image</div>
        <img src="${entity.image}" class="entity-image" alt="${entity.label}">
      </div>
    `;
  }
  
  // Connections section
  if (entity.connections && entity.connections.length > 0) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Connections</div>
        <div class="entity-connections">
    `;
    
    entity.connections.forEach(connection => {
      const connectedEntity = getEntityById(connection.targetId);
      if (connectedEntity) {
        detailsHTML += `
          <div class="connection-item" data-id="${connectedEntity.id}" data-source="${entity.id}" data-target="${connectedEntity.id}">
            <div class="connection-icon ${connectedEntity.type || ''}">
              <i class="fas ${getEntityIcon(connectedEntity.type)}"></i>
            </div>
            <div class="connection-info">
              <div class="connection-label">${connectedEntity.label}</div>
              <div class="connection-relation">${connection.label || 'connected to'}</div>
            </div>
            <button class="btn-icon edit-connection-btn">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        `;
      }
    });
    
    detailsHTML += `
        </div>
      </div>
    `;
  }
  
  // Actions section
  detailsHTML += `
    <div class="entity-actions">
      <button id="add-connection-btn" class="btn-secondary">
        <i class="fas fa-link"></i> Add Connection
      </button>
    </div>
  `;
  
  // Update the details panel
  entityDetails.innerHTML = detailsHTML;
  
  // Add event listeners for connections
  document.querySelectorAll('.connection-item').forEach(item => {
    // Click on connection to select entity
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.edit-connection-btn')) {
        selectEntity(item.getAttribute('data-id'));
      }
    });
    
    // Edit connection button
    const editBtn = item.querySelector('.edit-connection-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const sourceId = item.getAttribute('data-source');
        const targetId = item.getAttribute('data-target');
        showEditConnectionModal(sourceId, targetId);
      });
    }
  });
  
  // Add connection button
  document.getElementById('add-connection-btn').addEventListener('click', () => {
    showModal('add-connection-modal');
    populateEntitySelects(entityId);
  });
  
  // Show the panel
  togglePanel('entity-panel', false, false);
}

function showEditConnectionModal(sourceId, targetId) {
  const sourceEntity = getEntityById(sourceId);
  const connection = sourceEntity.connections.find(conn => conn.targetId === targetId);
  
  if (!connection) return;
  
  // Populate form
  document.getElementById('edit-connection-source').value = sourceId;
  document.getElementById('edit-connection-target').value = targetId;
  document.getElementById('edit-connection-label').value = connection.label || '';
  
  // Show modal
  showModal('edit-connection-modal');
}

function updateConnection() {
  const sourceId = document.getElementById('edit-connection-source').value;
  const targetId = document.getElementById('edit-connection-target').value;
  const label = document.getElementById('edit-connection-label').value;
  
  // Update connection in data
  const sourceEntity = getEntityById(sourceId);
  const connection = sourceEntity.connections.find(conn => conn.targetId === targetId);
  
  if (connection) {
    connection.label = label;
    
    // Update graph
    const edgeId = `${sourceId}-${targetId}`;
    const edge = findNode(edgeId);
    if (edge) {
      edge.data('label', label);
    }
    
    // Update UI
    showEntityDetails(state.selectedEntityId);
    
    // Save state
    saveInvestigation();
  }
  
  // Hide modal
  hideModal('edit-connection-modal');
}

function deleteConnection() {
  const sourceId = document.getElementById('edit-connection-source').value;
  const targetId = document.getElementById('edit-connection-target').value;
  
  if (confirm('Are you sure you want to delete this connection?')) {
    // Remove from data
    removeEntityConnection(sourceId, targetId);
    
    // Remove from graph
    const edgeId = `${sourceId}-${targetId}`;
    removeEdgeFromGraph(edgeId);
    
    // Update UI
    showEntityDetails(state.selectedEntityId);
    
    // Save state
    saveInvestigation();
    
    // Hide modal
    hideModal('edit-connection-modal');
  }
}

function deleteSelectedEntity() {
  if (!state.selectedEntityId) return;
  
  if (confirm(`Are you sure you want to delete this entity?`)) {
    // Remove from graph
    removeNodeFromGraph(state.selectedEntityId);
    
    // Remove from data
    deleteEntity(state.selectedEntityId);
    
    // Update UI
    updateEntityList();
    
    // Hide entity panel
    togglePanel('entity-panel', false, true);
    
    // Clear selection
    state.selectedEntityId = null;
    
    // Save state
    saveInvestigation();
  }
}

function populateEntitySelects(preSelectedSourceId = null) {
  const sourceSelect = document.getElementById('source-entity');
  const targetSelect = document.getElementById('target-entity');
  
  // Clear current options
  sourceSelect.innerHTML = '<option value="">Select Source Entity</option>';
  targetSelect.innerHTML = '<option value="">Select Target Entity</option>';
  
  // Get all entities
  const entities = getAllEntities();
  
  // Populate selects
  entities.forEach(entity => {
    const sourceOption = document.createElement('option');
    sourceOption.value = entity.id;
    sourceOption.textContent = entity.label;
    
    const targetOption = document.createElement('option');
    targetOption.value = entity.id;
    targetOption.textContent = entity.label;
    
    sourceSelect.appendChild(sourceOption);
    targetSelect.appendChild(targetOption);
  });
  
  // Set pre-selected source if provided
  if (preSelectedSourceId) {
    sourceSelect.value = preSelectedSourceId;
  }
}

function addNewConnection() {
  const sourceId = document.getElementById('source-entity').value;
  const targetId = document.getElementById('target-entity').value;
  const label = document.getElementById('connection-label').value;
  
  if (!sourceId || !targetId) {
    alert('Please select both source and target entities.');
    return;
  }
  
  if (sourceId === targetId) {
    alert('Source and target entities cannot be the same.');
    return;
  }

  // Check if both nodes exist in the graph before creating the edge
  const sourceNode = findNode(sourceId);
  const targetNode = findNode(targetId);

  if (!sourceNode || !targetNode) {
    alert('One or both of the selected entities do not exist in the graph. Please try again.');
    return;
  }
  
  // Add connection to data
  addEntityConnection(sourceId, targetId, label);
  
  // Add to graph
  addEdgeToGraph({
    source: sourceId,
    target: targetId,
    label: label
  });
  
  // Update UI if an entity is selected
  if (state.selectedEntityId) {
    showEntityDetails(state.selectedEntityId);
  }
  
  // Reset form and hide modal
  document.getElementById('add-connection-form').reset();
  hideModal('add-connection-modal');
  
  // Save state
  saveInvestigation();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.style.backgroundImage = `url(${e.target.result})`;
    imagePreview.classList.add('has-image');
  };
  
  reader.readAsDataURL(file);
}

function handleExport() {
  const filename = document.getElementById('export-filename').value || 'osintrix-investigation';
  exportInvestigation(filename);
  hideModal('export-modal');
}

function handleImport() {
  const fileInput = document.getElementById('import-file');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file to import.');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      importData(data);
      hideModal('import-modal');
    } catch (error) {
      alert('Error importing file: Invalid format.');
      console.error(error);
    }
  };
  
  reader.readAsText(file);
}

function importData(data) {
  // Import entities and connections
  importInvestigation(data);
  
  // Update UI
  updateEntityList();
}

// Export app functions
export {
  state,
  selectEntity,
  updateEntityList,
  editEntity,
  populateEntitySelects
};