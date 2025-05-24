import { initGraph, addNodeToGraph, removeNodeFromGraph, addEdgeToGraph, removeEdgeFromGraph, findNode, highlightNode, clearHighlights, findShortestPath, resetGraphView, resetGraph, saveGraphAsPNG } from './graph.js';
import { createEntity, getEntityIcon, getEntityById, getAllEntities, deleteEntity, addEntityConnection, removeEntityConnection, updateEntity, setEntitiesData } from './entities.js';
import { setupStorage, saveInvestigation, loadInvestigation, exportInvestigation, importInvestigation } from './utils/storage.js';
import { initializePanels, togglePanel, closeAllPanels } from './ui/panels.js';
import { initializeNotes } from './ui/notes.js';
import { initializeContextMenu } from './ui/contextMenu.js';
import { initializeReportPanel } from './ui/reportPanel.js';
import { initializeDorkAssistant } from './dork_assistant.js';

// Application state
let state = {
  isDarkTheme: true,
  selectedEntityId: null,
  isInitialLoad: true,
  editMode: false,
  metadataFields: [],
  searchHighlightedNodes: new Set()
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
  initializeDorkAssistant();

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
  togglePanel('entity-list-panel', false, true); // Changed last argument to true to keep it collapsed initially
  
  state.isInitialLoad = false;
}

function initializeMetadataFields() {
  const addMetadataBtn = document.getElementById('add-metadata-field');
  const metadataContainer = document.getElementById('metadata-fields');
  
  if (!addMetadataBtn || !metadataContainer) return; //
  
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

function openDorkAssistantWithEntity(entityValue) {
  // Clear existing clauses and add one with the passed entity value
  window.openDorkAssistant([
    { type: 'site', value: entityValue }
  ]);
}


function setupEventListeners() {

  // Add entity button
  document.getElementById('add-entity-btn').addEventListener('click', () => {
    state.editMode = false;
    showModal('add-entity-modal');
    populateEntitySelects();
    resetAddEntityForm(); // Ensure form is reset when adding new
  });

  // Add connection button in toolbar
  document.getElementById('add-connection-toolbar-btn').addEventListener('click', () => {
    showModal('add-connection-modal');
    populateEntitySelects();
  });

  // Reset layout button
  document.getElementById('reset-layout-btn').addEventListener('click', resetGraphView);

  // Add save graph button handler
  document.getElementById('save-graph-btn').addEventListener('click', () => {
    saveGraphAsPNG();
  });

  // Add cancel button handler
  document.getElementById('cancel-add-entity').addEventListener('click', () => {
    resetAddEntityForm();
    hideModal('add-entity-modal');
  });
  
  // Update close button handler
  document.getElementById('close-add-entity-modal').addEventListener('click', () => {
    resetAddEntityForm();
    hideModal('add-entity-modal');
  });

  // Reset graph button
  document.getElementById('reset-graph-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the graph? This will delete all entities and connections.')) {
      // Clear graph
      resetGraph();
      
      // Clear entities data
      setEntitiesData([]);
      
      // Clear localStorage
      localStorage.removeItem('osintrix_investigation');
      localStorage.removeItem('osintrix_notes');
      localStorage.removeItem('osintrix_notes_title');
      localStorage.removeItem('osintrix_advanced_notes');
      localStorage.removeItem('osintrix_timeline_entries');
      
      // Reset UI
      updateEntityList();
      document.getElementById('investigation-title').value = '';
      document.getElementById('notes-editor').innerHTML = '';
      
      // Hide panels
      togglePanel('entity-panel', false, true);
      togglePanel('entity-list-panel', false, false);
      
      // Clear state
      state.selectedEntityId = null;
      state.searchHighlightedNodes.clear();
      
      // Clear search
      document.getElementById('search-input').value = '';
    }
  });

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

  // Links search and filter
  document.getElementById('links-search').addEventListener('input', filterLinks);
  document.getElementById('links-category').addEventListener('change', filterLinks);

  // Prevent collapse when interacting with search and category
  document.querySelector('.links-search').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Links panel toggle
  document.getElementById('toggle-links-btn').addEventListener('click', () => {
    const linksPanel = document.getElementById('links-panel');
    linksPanel.classList.toggle('hidden');
    if (!linksPanel.classList.contains('hidden')) {
      linksPanel.classList.remove('collapsed');
    }
  });

  // Links panel collapse
  document.getElementById('collapse-links-btn').addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from reaching the header
    const linksPanel = document.getElementById('links-panel');
    linksPanel.classList.toggle('collapsed');
    const icon = document.querySelector('#collapse-links-btn i');
    icon.className = linksPanel.classList.contains('collapsed') ? 
      'fas fa-chevron-up' : 
      'fas fa-chevron-down';
  });

  // Links panel header click to collapse
  document.querySelector('.links-header').addEventListener('click', (e) => {
    // Only collapse if clicking directly on the header, not its interactive children
    if (!e.target.closest('.links-search') && !e.target.closest('.btn-icon')) {
      const linksPanel = document.getElementById('links-panel');
      linksPanel.classList.toggle('collapsed');
      const icon = document.querySelector('#collapse-links-btn i');
      icon.className = linksPanel.classList.contains('collapsed') ? 
        'fas fa-chevron-up' : 
        'fas fa-chevron-down';
    }
  });

  // Add entity type change handler
  document.getElementById('entity-type').addEventListener('change', updateEntityFormFields);
}

function filterLinks() {
  const searchTerm = document.getElementById('links-search').value.toLowerCase();
  const category = document.getElementById('links-category').value;
  const sections = document.querySelectorAll('.links-section');

  sections.forEach(section => {
    const sectionCategory = section.getAttribute('data-category');
    const links = section.querySelectorAll('.link-item');
    let hasVisibleLinks = false;

    // Show/hide based on category
    if (category === 'all' || category === sectionCategory) {
      links.forEach(link => {
        const name = link.querySelector('.link-name').textContent.toLowerCase();
        const description = link.querySelector('.link-description').textContent.toLowerCase();
        const matches = name.includes(searchTerm) || description.includes(searchTerm);
        
        link.classList.toggle('highlight', matches && searchTerm.length > 0);
        link.style.display = matches || !searchTerm ? '' : 'none';
        
        if (matches || !searchTerm) {
          hasVisibleLinks = true;
        }
      });
      
      section.classList.toggle('hidden', !hasVisibleLinks);
    } else {
      section.classList.add('hidden');
    }
  });
}

function handleSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const entityItems = document.querySelectorAll('.entity-item');
  
  // Clear previous highlights
  clearHighlights();
  state.searchHighlightedNodes.clear();
  
  if (!searchTerm) {
    entityItems.forEach(item => {
      item.style.display = '';
    });
    return;
  }
  
  entityItems.forEach(item => {
    const entityName = item.querySelector('.entity-label').textContent.toLowerCase();
    const entityType = item.getAttribute('data-type').toLowerCase();
    const entityId = item.getAttribute('data-id');
    
    if (entityName.includes(searchTerm) || entityType.includes(searchTerm)) {
      item.style.display = '';
      
      // Highlight matching node and its connections in the graph
      if (entityId) {
        const node = findNode(entityId);
        if (node) {
          node.addClass('highlighted');
          state.searchHighlightedNodes.add(entityId);
          
          // Highlight connected edges and nodes
          const connectedEdges = node.connectedEdges();
          connectedEdges.addClass('highlighted');
          
          const connectedNodes = node.neighborhood('node');
          connectedNodes.forEach(connectedNode => {
            connectedNode.addClass('highlighted');
            state.searchHighlightedNodes.add(connectedNode.id());
          });
        }
      }
    } else {
      item.style.display = 'none';
    }
  });
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

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('hidden');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
}

function validateForm(form) {
  const inputs = form.querySelectorAll('input[type="text"], input[type="url"], input[type="email"], input[type="tel"], input[type="number"], textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (input.hasAttribute('pattern') && input.value) {
      const pattern = new RegExp(input.getAttribute('pattern'));
      if (!pattern.test(input.value)) {
        isValid = false;
        input.classList.add('is-invalid');
        alert(`Invalid input for ${input.id}: ${input.title}`);
      } else {
        input.classList.remove('is-invalid');
      }
    }
    // Add check for required fields that might not have a pattern
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      input.classList.add('is-invalid');
      // No alert here, as browser's validation will typically handle this
    } else if (input.hasAttribute('required') && input.value.trim()) {
      input.classList.remove('is-invalid');
    }
  });

  // Validate repeatable fields
  form.querySelectorAll('.repeatable-group').forEach(group => {
    const repeatableInputs = group.querySelectorAll('input');
    const fieldName = group.dataset.name;
    const validationRule = getValidationRuleForRepeatable(fieldName);

    repeatableInputs.forEach(input => {
      if (input.value && validationRule && !validationRule.pattern.test(input.value)) {
        isValid = false;
        input.classList.add('is-invalid');
        alert(`Invalid input for ${fieldName}: ${validationRule.title}`);
      } else {
        input.classList.remove('is-invalid');
      }
    });
  });

  return isValid;
}

// Helper to get validation rules for repeatable fields
function getValidationRuleForRepeatable(fieldName) {
  const entityType = document.getElementById('entity-type').value;
  let validationRules = {};

  // Define validation rules for repeatable fields
  switch (entityType) {
    case 'person':
      validationRules = {
        usernames: { pattern: /^[a-zA-Z0-9_.]+$/, title: 'Only letters, numbers, underscores, or periods.' },
        phones: { pattern: /^\+?[0-9\s\-\(\)]{7,20}$/, title: 'Valid phone number format (e.g., +1234567890).' },
        emails: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, title: 'Valid email format (e.g., example@domain.com).' },
        wallets: { pattern: /^(0x)?[0-9a-fA-F]{40}$|^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[LM3][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[4789][A-Za-z0-9]{93,105}$/, title: 'Valid cryptocurrency wallet address.' }
      };
      break;
    case 'wallet':
      validationRules = {
        transactions: { pattern: /^[a-fA-F0-9]{64}$/, title: 'Valid transaction ID/Hash.' } // Common hash pattern
      };
      break;
    case 'group':
      validationRules = {
        members: { pattern: /^.+$/, title: 'Member name cannot be empty.' }
      };
      break;
    case 'username':
      validationRules = {
        usernames: { pattern: /^[a-zA-Z0-9_.]+$/, title: 'Only letters, numbers, underscores, or periods.' },
        platforms: { pattern: /^.+$/, title: 'Platform name cannot be empty.' },
        linkedEmails: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, title: 'Valid email format (e.g., example@domain.com).' },
        linkedWallets: { pattern: /^(0x)?[0-9a-fA-F]{40}$|^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[LM3][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[4789][A-Za-z0-9]{93,105}$/, title: 'Valid cryptocurrency wallet address.' }
      };
      break;
    case 'money':
      validationRules = {
        associatedWallets: { pattern: /^(0x)?[0-9a-fA-F]{40}$|^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[LM3][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[4789][A-Za-z0-9]{93,105}$/, title: 'Valid cryptocurrency wallet address.' }
      };
      break;
    case 'email':
      validationRules = {
        emails: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, title: 'Valid email format (e.g., example@domain.com).' }
      };
      break;
    case 'phone':
      validationRules = {
        numbers: { pattern: /^\+?[0-9\s\-\(\)]{7,20}$/, title: 'Valid phone number format (e.g., +1234567890).' }
      };
      break;
    case 'alias':
      validationRules = {
        aliases: { pattern: /^.+$/, title: 'Alias name cannot be empty.' }
      };
      break;
    case 'document':
      validationRules = {
        hashes: { pattern: /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/, title: 'Valid MD5, SHA1, or SHA256 hash.' }
      };
      break;
    case 'malware':
      validationRules = {
        hashes: { pattern: /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/, title: 'Valid MD5, SHA1, or SHA256 hash.' },
        servers: { pattern: /^((https?|ftp):\/\/)?([\w_-]+(?:\.[\w_-]+)+)([a-zA-Z0-9.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, title: 'Valid URL or IP address for a server.' }
      };
      break;
  }
  return validationRules[fieldName];
}


function addNewEntity() {
  const form = document.getElementById('add-entity-form');
  if (!validateForm(form)) {
    alert('Please correct the invalid fields before adding the entity.');
    return;
  }

  const type = document.getElementById('entity-type').value;
  if (!type) return;

  // Get all form fields
  const dynamicFields = document.getElementById('dynamic-fields');
  const formData = {};

  // Add entity type
  formData.type = type;
  formData.label = ''; // Will be set based on primary field

  // Process dynamic fields
  if (dynamicFields) {
    // Handle regular inputs and textareas
    dynamicFields.querySelectorAll('input:not([type="file"]), textarea').forEach(field => {
      if (field.type === 'checkbox') {
        formData[field.id] = field.checked;
      } else if (!field.name.includes('[]')) {
        formData[field.id] = field.value.trim();
      }
    });

    // Handle repeatable fields
    dynamicFields.querySelectorAll('.repeatable-group').forEach(group => {
      const fieldName = group.dataset.name;
      formData[fieldName] = [];
      group.querySelectorAll('input').forEach(input => {
        const value = input.value.trim();
        if (value) {
          formData[fieldName].push(value);
        }
      });
    });
  }

  // Get metadata
  const metadata = {};
  document.querySelectorAll('.metadata-field').forEach(field => {
    const key = field.querySelector('.metadata-key').value.trim();
    const value = field.querySelector('.metadata-value').value.trim();
    if (key && value) {
      metadata[key] = value;
    }
  });
  formData.metadata = metadata;

  // Get image if exists
  const imagePreview = document.getElementById('image-preview');
  formData.image = imagePreview.classList.contains('has-image') ? 
    imagePreview.style.backgroundImage.slice(5, -2) : 
    '';

  // Handle tags field
  const tagsField = dynamicFields.querySelector('#tags');
  if (tagsField && tagsField.value) {
    formData.tags = tagsField.value.split(',').map(tag => tag.trim()).filter(Boolean);
  } else {
    formData.tags = [];
  }

  // Set the label based on primary field for each entity type
  switch (type) {
    case 'person':
      formData.label = formData.name || 'Unnamed Person';
      break;
    case 'organization':
      formData.label = formData.name || 'Unnamed Organization';
      break;
    case 'wallet':
      formData.label = formData.address || 'Unknown Wallet';
      break;
    case 'ip':
      formData.label = formData.ip || 'Unknown IP';
      break;
    case 'location':
      formData.label = [formData.city, formData.country].filter(Boolean).join(', ') || 'Unknown Location';
      break;
    case 'transaction':
      formData.label = formData.txId || 'Unknown Transaction';
      break;
    case 'social':
      formData.label = `${formData.username} (${formData.platform})` || 'Unknown Profile';
      break;
    case 'domain':
      formData.label = formData.domain || 'Unknown Domain';
      break;
    case 'group':
      formData.label = formData.name || 'Unknown Group';
      break;
    case 'username':
      formData.label = formData.usernames?.[0] || 'Unknown Username';
      break;
    case 'money':
      formData.label = `${formData.value} ${formData.currency}` || 'Unknown Amount';
      break;
    case 'email':
      formData.label = formData.emails?.[0] || 'Unknown Email';
      break;
    case 'phone':
      formData.label = formData.numbers?.[0] || 'Unknown Phone';
      break;
    case 'alias':
      formData.label = formData.aliases?.[0] || 'Unknown Alias';
      break;
    case 'document':
      formData.label = formData.filename || 'Unknown Document';
      break;
    case 'malware':
      formData.label = formData.name || 'Unknown Malware';
      break;
    default:
      formData.label = 'Unknown Entity';
  }

  // Create entity
  const entity = createEntity(formData);

  // Add to graph
  addNodeToGraph({
    id: entity.id,
    label: entity.label,
    type: entity.type
  });

  // Update UI
  updateEntityList();

  // Reset form and hide modal
  resetAddEntityForm();
  hideModal('add-entity-modal');

  // Save state
  saveInvestigation();
}

function resetAddEntityForm() {
  const form = document.getElementById('add-entity-form');
  form.reset();
  
  // Clear entity type
  document.getElementById('entity-type').value = '';
  
  // Clear dynamic fields
  const dynamicFields = document.getElementById('dynamic-fields');
  if (dynamicFields) {
    dynamicFields.remove();
  }
  
  // Clear metadata fields
  document.getElementById('metadata-fields').innerHTML = '';
  
  // Clear image preview
  const imagePreview = document.getElementById('image-preview');
  imagePreview.classList.remove('has-image');
  imagePreview.style.backgroundImage = '';
  
  // Reset submit button text
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.textContent = 'Add Entity';
  
  // Reset edit mode
  state.editMode = false;

  // Remove validation styles
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function editEntity(entityId) {
  if (!entityId) return; //
  
  const entity = getEntityById(entityId);
  if (!entity) return; //
  
  // Set edit mode
  state.editMode = true;
  
  // Clear existing metadata fields
  const metadataContainer = document.getElementById('metadata-fields');
  metadataContainer.innerHTML = '';
  
  // Set entity type and trigger field generation
  document.getElementById('entity-type').value = entity.type;
  updateEntityFormFields();
  
  // Populate dynamic fields
  const dynamicFields = document.getElementById('dynamic-fields');
  if (dynamicFields) {
    // Handle regular inputs and textareas
    dynamicFields.querySelectorAll('input:not([type="file"]), textarea').forEach(field => {
      if (field.type === 'checkbox') {
        field.checked = entity[field.id];
      } else if (!field.name.includes('[]')) {
        field.value = entity[field.id] || '';
      }
    });
    
    // Handle repeatable fields
    dynamicFields.querySelectorAll('.repeatable-group').forEach(group => {
      const fieldName = group.dataset.name;
      const values = entity[fieldName] || [];
      
      // Remove initial empty input
      group.querySelectorAll('.input-group').forEach(ig => ig.remove());
      
      // Add an input for each value
      values.forEach(value => {
        const inputGroup = createRepeatableInput(fieldName);
        inputGroup.querySelector('input').value = value;
        group.insertBefore(inputGroup, group.querySelector('.add-field'));
      });
      
      // Add one empty input if no values
      if (values.length === 0) {
        const inputGroup = createRepeatableInput(fieldName);
        group.insertBefore(inputGroup, group.querySelector('.add-field'));
      }
    });

    // Set tags
    const tagsField = dynamicFields.querySelector('#tags');
    if (tagsField && entity.tags) {
      tagsField.value = entity.tags.join(', ');
    }
  }
  
  // Add metadata fields
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      addMetadataField(key, value);
    });
  }
  
  // Set image if exists
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
  const form = document.getElementById('add-entity-form');
  if (!validateForm(form)) {
    alert('Please correct the invalid fields before updating the entity.');
    return;
  }

  const entityId = state.selectedEntityId;
  if (!entityId) return;

  const type = document.getElementById('entity-type').value;
  if (!type) return;

  // Get all form fields
  const dynamicFields = document.getElementById('dynamic-fields');
  const formData = {};

  // Add entity type
  formData.type = type;

  // Process dynamic fields
  if (dynamicFields) {
    // Handle regular inputs and textareas
    dynamicFields.querySelectorAll('input:not([type="file"]), textarea').forEach(field => {
      if (field.type === 'checkbox') {
        formData[field.id] = field.checked;
      } else if (!field.name.includes('[]')) {
        formData[field.id] = field.value.trim();
      }
    });

    // Handle repeatable fields
    dynamicFields.querySelectorAll('.repeatable-group').forEach(group => {
      const fieldName = group.dataset.name;
      formData[fieldName] = [];
      group.querySelectorAll('input').forEach(input => {
        const value = input.value.trim();
        if (value) {
          formData[fieldName].push(value);
        }
      });
    });

    // Handle tags field
    const tagsField = dynamicFields.querySelector('#tags');
    if (tagsField && tagsField.value) {
      formData.tags = tagsField.value.split(',').map(tag => tag.trim()).filter(Boolean);
    } else {
      formData.tags = [];
    }
  }

  // Get metadata
  const metadata = {};
  document.querySelectorAll('.metadata-field').forEach(field => {
    const key = field.querySelector('.metadata-key').value.trim();
    const value = field.querySelector('.metadata-value').value.trim();
    if (key && value) {
      metadata[key] = value;
    }
  });
  formData.metadata = metadata;

  // Get image if exists
  const imagePreview = document.getElementById('image-preview');
  formData.image = imagePreview.classList.contains('has-image') ? 
    imagePreview.style.backgroundImage.slice(5, -2) : 
    '';

  // Set the label based on primary field for each entity type
  switch (type) {
    case 'person':
      formData.label = formData.name || 'Unnamed Person';
      break;
    case 'organization':
      formData.label = formData.name || 'Unnamed Organization';
      break;
    case 'wallet':
      formData.label = formData.address || 'Unknown Wallet';
      break;
    case 'ip':
      formData.label = formData.ip || 'Unknown IP';
      break;
    case 'location':
      formData.label = [formData.city, formData.country].filter(Boolean).join(', ') || 'Unknown Location';
      break;
    case 'transaction':
      formData.label = formData.txId || 'Unknown Transaction';
      break;
    case 'social':
      formData.label = `${formData.username} (${formData.platform})` || 'Unknown Profile';
      break;
    case 'domain':
      formData.label = formData.domain || 'Unknown Domain';
      break;
    case 'group':
      formData.label = formData.name || 'Unknown Group';
      break;
    case 'username':
      formData.label = formData.usernames?.[0] || 'Unknown Username';
      break;
    case 'money':
      formData.label = `${formData.value} ${formData.currency}` || 'Unknown Amount';
      break;
    case 'email':
      formData.label = formData.emails?.[0] || 'Unknown Email';
      break;
    case 'phone':
      formData.label = formData.numbers?.[0] || 'Unknown Phone';
      break;
    case 'alias':
      formData.label = formData.aliases?.[0] || 'Unknown Alias';
      break;
    case 'document':
      formData.label = formData.filename || 'Unknown Document';
      break;
    case 'malware':
      formData.label = formData.name || 'Unknown Malware';
      break;
    default:
      formData.label = 'Unknown Entity';
  }

  // Update entity
  const updatedEntity = updateEntity(entityId, formData);

  // Update graph node
  const node = findNode(entityId);
  if (node) {
    node.data('label', formData.label);
    node.data('type', type);
  }

  // Update UI
  updateEntityList();
  showEntityDetails(entityId);

  // Reset form and hide modal
  resetAddEntityForm();
  hideModal('add-entity-modal');

  // Save state
  saveInvestigation();
}

// Add event listener for entity type change
document.getElementById('entity-type').addEventListener('change', updateEntityFormFields);

function updateEntityFormFields() {
  const entityType = document.getElementById('entity-type').value;
  const formGroup = document.getElementById('entity-type').closest('.form-group');
  const dynamicFields = document.getElementById('dynamic-fields');
  
  // Remove existing dynamic fields if any
  if (dynamicFields) {
    dynamicFields.remove();
  }
  
  // Create new dynamic fields container
  const newDynamicFields = document.createElement('div');
  newDynamicFields.id = 'dynamic-fields';
  
  // Define common fields that appear in all entity types
  const commonFields = [
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'tags', label: 'Tags (comma separated)', type: 'text' }
  ];
  
  // Define fields based on entity type
  let fields = [];
  
  switch (entityType) {
    case 'person':
      fields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'usernames', label: 'Usernames', type: 'repeatable', inputType: 'text', pattern: '^[a-zA-Z0-9_.]+$', title: 'Only letters, numbers, underscores, or periods.' },
        { name: 'dob', label: 'Date of Birth', type: 'date' },
        { name: 'nationality', label: 'Nationality', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'phones', label: 'Phone Numbers', type: 'repeatable', inputType: 'tel', pattern: '^\\+?[0-9\\s\\-\\(]{7,20}$', title: 'Valid phone number format (e.g., +1234567890).' },
        { name: 'emails', label: 'Email Addresses', type: 'repeatable', inputType: 'email', pattern: '^[^\s@]+@[^\s@]+\\.[^\s@]+$', title: 'Valid email format (e.g., example@domain.com).' },
        { name: 'wallets', label: 'Linked Wallets', type: 'repeatable', inputType: 'text', pattern: '^(0x)?[0-9a-fA-F]{40}$|^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[LM3][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[4789][A-Za-z0-9]{93,105}$', title: 'Valid cryptocurrency wallet address.' },
        { name: 'coordinates', label: 'Coordinates (lat,lng)', type: 'text', pattern: '^(?:-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$|Latitude:\s*-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*Longitude:\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$' },
        { name: 'googleMaps', label: 'Google Maps Link', type: 'url', title: 'Valid Google Maps URL.' }
      ];
      break;
      
    case 'organization':
      fields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'website', label: 'Website', type: 'url', pattern: '^http?://([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*\\/?$', title: 'Valid URL format (e.g., https://example.com).' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'hqAddress', label: 'HQ Address', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'coordinates', label: 'Coordinates (lat,lng)', type: 'text', pattern: '^(?:-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$|Latitude:\s*-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*Longitude:\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$' },
        { name: 'googleMaps', label: 'Google Maps Link', type: 'url', title: 'Valid Google Maps URL.' }
      ];
      break;
      
    case 'wallet':
      fields = [
        { name: 'blockchain', label: 'Blockchain', type: 'text', required: true },
        { name: 'address', label: 'Address', type: 'text', required: true },
        { name: 'owner', label: 'Known Owner', type: 'text' },
        { name: 'exchange', label: 'Exchange Used', type: 'text' },
        { name: 'transactions', label: 'Linked Transactions', type: 'repeatable', inputType: 'text', pattern: '^[a-fA-F0-9]{64}$', title: 'Valid transaction ID/Hash (e.g., SHA256).' }
      ];
      break;
      
    case 'ip':
      fields = [
        { name: 'ip', label: 'IP', type: 'text', required: true, pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$', title: 'Valid IPv4 or IPv6 address.' },
        { name: 'asn', label: 'ASN', type: 'text', pattern: '^AS\\d+$|^\\d+$', title: 'Valid ASN (e.g., AS12345 or 12345).' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'isp', label: 'ISP/Hostname', type: 'text' },
        { name: 'isVpn', label: 'VPN/Proxy', type: 'checkbox' }
      ];
      break;
      
    case 'location':
      fields = [
        { name: 'country', label: 'Country', type: 'text', required: true },
        { name: 'city', label: 'City', type: 'text'},
        { name: 'state', label: 'State', type: 'text' },
        { name: 'latitude', label: 'Latitude', type: 'text', pattern: '^-?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?)$', title: 'Valid latitude (-90 to 90).' },
        { name: 'longitude', label: 'Longitude', type: 'text', pattern: '^-?(180(\\.0+)?|((1[0-7]\\d)|([1-9]?\\d))(\\.\\d+)?)$', title: 'Valid longitude (-180 to 180).' },
        { name: 'googleMaps', label: 'Google Maps Link', type: 'url', title: 'Valid Google Maps URL.' }
      ];
      break;
      
    case 'transaction':
      fields = [
        { name: 'txId', label: 'Transaction ID/Hash', type: 'text', required: true, pattern: '^[a-fA-F0-9]{64}$', title: 'Valid transaction ID/Hash (e.g., SHA256).' },
        { name: 'platform', label: 'Platform', type: 'text' },
        { name: 'fromWallet', label: 'From Wallet', type: 'text' },
        { name: 'toWallet', label: 'To Wallet', type: 'text' },
        { name: 'amount', label: 'Amount', type: 'text', pattern: '^\\d+(\\.\\d+)?$', title: 'Numeric value.' },
        { name: 'currency', label: 'Currency', type: 'text' },
        { name: 'timestamp', label: 'Timestamp', type: 'datetime-local' },
        { name: 'country', label: 'Exchange/Platform Country', type: 'text' }
      ];
      break;
      
    case 'social':
      fields = [
        { name: 'username', label: 'Username/Handle', type: 'text', required: true },
        { name: 'platform', label: 'Platform', type: 'text', required: true },
        { name: 'profileUrl', label: 'Profile URL', type: 'url', pattern: '^https?://([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*\\/?$', title: 'Valid URL format (e.g., https://example.com).' },
        { name: 'avatar', label: 'Avatar URL', type: 'url', pattern: '^https?://([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*\\/?$', title: 'Valid URL format (e.g., https://example.com).' }
      ];
      break;
      
    case 'domain':
      fields = [
        { name: 'domain', label: 'Domain Name', type: 'text', required: true, pattern: '^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}$', title: 'Valid domain name (e.g., example.com).' },
        { name: 'ip', label: 'IP Address', type: 'text', pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$', title: 'Valid IPv4 or IPv6 address.' },
        { name: 'hostingCountry', label: 'Hosting Country', type: 'text' },
        { name: 'hostingCity', label: 'Hosting City', type: 'text' },
        { name: 'registrar', label: 'Registrar', type: 'text' },
        { name: 'coordinates', label: 'Coordinates', type: 'text', pattern: '^(?:-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$|Latitude:\s*-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*Longitude:\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$' },
        { name: 'googleMaps', label: 'Google Maps Link', type: 'url', title: 'Valid Google Maps URL.' },
        { name: 'whois', label: 'WHOIS Info', type: 'textarea' },
        { name: 'ssl', label: 'SSL Info', type: 'textarea' }
      ];
      break;
      
    case 'group':
      fields = [
        { name: 'name', label: 'Group Name', type: 'text', required: true },
        { name: 'groupType', label: 'Type', type: 'text' },
        { name: 'members', label: 'Known Members', type: 'repeatable', inputType: 'text' },
        { name: 'region', label: 'Operating Region', type: 'text' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'coordinates', label: 'Coordinates', type: 'text', pattern: '^(?:-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$|Latitude:\s*-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*Longitude:\s*-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?))$' }
      ];
      break;
      
    case 'username':
      fields = [
        { name: 'usernames', label: 'Usernames', type: 'repeatable', inputType: 'text', required: true, pattern: '^[a-zA-Z0-9_.]+$', title: 'Only letters, numbers, underscores, or periods.' },
        { name: 'platforms', label: 'Associated Platforms', type: 'repeatable', inputType: 'text' },
        { name: 'linkedEmails', label: 'Linked Emails', type: 'repeatable', inputType: 'email', pattern: '^[^\s@]+@[^\s@]+\\.[^\s@]+$', title: 'Valid email format (e.g., example@domain.com).' },
        { name: 'linkedWallets', label: 'Linked Wallets', type: 'repeatable', inputType: 'text', pattern: '^(0x)?[0-9a-fA-F]{40}$|^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[LM3][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[4789][A-Za-z0-9]{93,105}$', title: 'Valid cryptocurrency wallet address.' }
      ];
      break;
      
    case 'money':
      fields = [
        { name: 'value', label: 'Value', type: 'number', required: true, pattern: '^\\d+(\\.\\d+)?$', title: 'Numeric value (e.g., 100.50).' },
        { name: 'currency', label: 'Currency', type: 'text', required: true },
        { name: 'associatedWallets', label: 'Associated Wallets', type: 'repeatable', inputType: 'text', pattern: '^(0x)?[0-9a-fA-F]{40}$|^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[LM3][a-km-zA-HJ-NP-Z0-9]{26,33}$|^[4789][A-Za-z0-9]{93,105}$', title: 'Valid cryptocurrency wallet address.' }
      ];
      break;
      
    case 'email':
      fields = [
        { name: 'emails', label: 'Email Addresses', type: 'repeatable', inputType: 'email', required: true, pattern: '^[^\s@]+@[^\s@]+\\.[^\s@]+$', title: 'Valid email format (e.g., example@domain.com).' },
        { name: 'owner', label: 'Owner', type: 'text' },
        { name: 'breaches', label: 'Breaches', type: 'textarea' }
      ];
      break;
      
    case 'phone':
      fields = [
        { name: 'numbers', label: 'Phone Numbers', type: 'repeatable', inputType: 'tel', required: true, pattern: '^\\+?[0-9\\s\\-\\(]{7,20}$', title: 'Valid phone number format (e.g., +1234567890).' },
        { name: 'countryCode', label: 'Country Code', type: 'text', pattern: '^\\+[1-9]\\d{0,3}$', title: 'Valid country code (e.g., +1, +44).' },
        { name: 'carrier', label: 'Carrier', type: 'text' },
        { name: 'isVoip', label: 'VOIP', type: 'checkbox' }
      ];
      break;
      
    case 'alias':
      fields = [
        { name: 'aliases', label: 'Alias Names', type: 'repeatable', inputType: 'text', required: true },
        { name: 'realIdentity', label: 'Linked to Real Identity', type: 'text' },
        { name: 'context', label: 'Context', type: 'textarea' }
      ];
      break;
      
    case 'document':
      fields = [
        { name: 'filename', label: 'Filename', type: 'text', required: true },
        { name: 'hashes', label: 'SHA256/MD5', type: 'repeatable', inputType: 'text', pattern: '^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$', title: 'Valid MD5 (32 chars), SHA1 (40 chars), or SHA256 (64 chars) hash.' },
        { name: 'fileType', label: 'File Type', type: 'text' },
        { name: 'uploadedBy', label: 'Uploaded By', type: 'text' }
      ];
      break;
      
    case 'malware':
      fields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'malwareType', label: 'Malware Type', type: 'text' },
        { name: 'hashes', label: 'Known Hashes', type: 'repeatable', inputType: 'text', pattern: '^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$', title: 'Valid MD5 (32 chars), SHA1 (40 chars), or SHA256 (64 chars) hash.' },
        { name: 'servers', label: 'Known Servers', type: 'repeatable', inputType: 'text', pattern: '^((https?|ftp):\\/\\/)?([\\w_-]+(?:\\.[\\w_-]+)+)([a-zA-Z0-9.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?$', title: 'Valid URL or IP address for a server.' }
      ];
      break;
  }
  
  // Combine type-specific fields with common fields
  fields = [...fields, ...commonFields];
  
  // Generate HTML for fields
  fields.forEach(field => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-group';
    
    const label = document.createElement('label');
    label.setAttribute('for', field.name);
    label.textContent = field.label + (field.required ? ' *' : '');
    
    if (field.type === 'repeatable') {
      // Create repeatable field group
      const repeatableGroup = document.createElement('div');
      repeatableGroup.className = 'repeatable-group';
      repeatableGroup.dataset.name = field.name;
      
      // Add initial input
      const inputGroup = createRepeatableInput(field.name, field.inputType, field.pattern, field.title);
      repeatableGroup.appendChild(inputGroup);
      
      // Add button
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn-secondary add-field';
      addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Another';
      addBtn.onclick = () => {
        const newInput = createRepeatableInput(field.name, field.inputType, field.pattern, field.title);
        repeatableGroup.insertBefore(newInput, addBtn);
      };
      
      repeatableGroup.appendChild(addBtn);
      
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(repeatableGroup);
    } else {
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.type;
        if (field.pattern) {
          input.setAttribute('pattern', field.pattern);
          input.setAttribute('title', field.title);
        }
      }
      
      input.id = field.name;
      input.name = field.name;
      input.className = field.type === 'checkbox' ? '' : 'form-control';
      if (field.required) input.required = true;
      
      if (field.type === 'checkbox') {
        label.appendChild(input);
        fieldContainer.appendChild(label);
      } else {
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
      }
    }
    
    newDynamicFields.appendChild(fieldContainer);
  });
  
  // Insert dynamic fields after entity type
  formGroup.parentNode.insertBefore(newDynamicFields, formGroup.nextSibling);
}

function createRepeatableInput(name, type, pattern = '', title = '') {
  const inputGroup = document.createElement('div');
  inputGroup.className = 'input-group';
  
  const input = document.createElement('input');
  input.type = type || 'text';
  input.name = `${name}[]`;
  input.className = 'form-control';
  if (pattern) {
    input.setAttribute('pattern', pattern);
    input.setAttribute('title', title);
  }
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-icon remove-field';
  removeBtn.innerHTML = '<i class="fas fa-times"></i>';
  removeBtn.onclick = () => inputGroup.remove();
  
  inputGroup.appendChild(input);
  inputGroup.appendChild(removeBtn);
  
  return inputGroup;
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

  // Notes section
  if (entity.notes) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Notes</div>
        <p>${entity.notes}</p>
      </div>
    `;
  }

  // Type-specific fields section
  detailsHTML += `
    <div class="entity-section">
      <div class="entity-section-title">Details</div>
      <div class="entity-metadata">
  `;

  // Add type-specific fields based on entity type
  switch (entity.type) {
    case 'person':
      if (entity.name) detailsHTML += createMetadataField('Name', entity.name);
      if (entity.dob) detailsHTML += createMetadataField('Date of Birth', entity.dob);
      if (entity.nationality) detailsHTML += createMetadataField('Nationality', entity.nationality);
      if (entity.city) detailsHTML += createMetadataField('City', entity.city);
      if (entity.country) detailsHTML += createMetadataField('Country', entity.country);
      if (entity.coordinates) detailsHTML += createMetadataField('Coordinates', entity.coordinates);
      if (entity.googleMaps) detailsHTML += createMetadataField('Google Maps', `<a href="${entity.googleMaps}" target="_blank">View Location</a>`);
      if (entity.usernames && entity.usernames.length > 0) detailsHTML += createMetadataField('Usernames', entity.usernames.join(', '));
      if (entity.phones && entity.phones.length > 0) detailsHTML += createMetadataField('Phone Numbers', entity.phones.join(', '));
      if (entity.emails && entity.emails.length > 0) detailsHTML += createMetadataField('Email Addresses', entity.emails.join(', '));
      if (entity.wallets && entity.wallets.length > 0) detailsHTML += createMetadataField('Linked Wallets', entity.wallets.join(', '));
      break;

    case 'organization':
      if (entity.name) detailsHTML += createMetadataField('Name', entity.name);
      if (entity.website) detailsHTML += createMetadataField('Website', `<a href="${entity.website}" target="_blank">${entity.website}</a>`);
      if (entity.country) detailsHTML += createMetadataField('Country', entity.country);
      if (entity.hqAddress) detailsHTML += createMetadataField('HQ Address', entity.hqAddress);
      if (entity.city) detailsHTML += createMetadataField('City', entity.city);
      if (entity.coordinates) detailsHTML += createMetadataField('Coordinates', entity.coordinates);
      if (entity.googleMaps) detailsHTML += createMetadataField('Google Maps', `<a href="${entity.googleMaps}" target="_blank">View Location</a>`);
      break;

    case 'wallet':
      if (entity.blockchain) detailsHTML += createMetadataField('Blockchain', entity.blockchain);
      if (entity.address) detailsHTML += createMetadataField('Address', entity.address);
      if (entity.owner) detailsHTML += createMetadataField('Known Owner', entity.owner);
      if (entity.exchange) detailsHTML += createMetadataField('Exchange Used', entity.exchange);
      if (entity.transactions && entity.transactions.length > 0) detailsHTML += createMetadataField('Linked Transactions', entity.transactions.join(', '));
      break;

    case 'ip':
      if (entity.ip) detailsHTML += createMetadataField('IP', entity.ip);
      if (entity.asn) detailsHTML += createMetadataField('ASN', entity.asn);
      if (entity.country) detailsHTML += createMetadataField('Country', entity.country);
      if (entity.city) detailsHTML += createMetadataField('City', entity.city);
      if (entity.isp) detailsHTML += createMetadataField('ISP/Hostname', entity.isp);
      if (entity.isVpn !== undefined) detailsHTML += createMetadataField('VPN/Proxy', entity.isVpn ? 'Yes' : 'No');
      break;

    case 'location':
      if (entity.city) detailsHTML += createMetadataField('City', entity.city);
      if (entity.state) detailsHTML += createMetadataField('State', entity.state);
      if (entity.country) detailsHTML += createMetadataField('Country', entity.country);
      if (entity.latitude) detailsHTML += createMetadataField('Latitude', entity.latitude);
      if (entity.longitude) detailsHTML += createMetadataField('Longitude', entity.longitude);
      if (entity.googleMaps) detailsHTML += createMetadataField('Google Maps', `<a href="${entity.googleMaps}" target="_blank">View Location</a>`);
      break;

    case 'transaction':
      if (entity.txId) detailsHTML += createMetadataField('Transaction ID/Hash', entity.txId);
      if (entity.platform) detailsHTML += createMetadataField('Platform', entity.platform);
      if (entity.fromWallet) detailsHTML += createMetadataField('From Wallet', entity.fromWallet);
      if (entity.toWallet) detailsHTML += createMetadataField('To Wallet', entity.toWallet);
      if (entity.amount) detailsHTML += createMetadataField('Amount', entity.amount);
      if (entity.currency) detailsHTML += createMetadataField('Currency', entity.currency);
      if (entity.timestamp) detailsHTML += createMetadataField('Timestamp', entity.timestamp);
      if (entity.country) detailsHTML += createMetadataField('Exchange/Platform Country', entity.country);
      break;

    case 'social':
      if (entity.username) detailsHTML += createMetadataField('Username/Handle', entity.username);
      if (entity.platform) detailsHTML += createMetadataField('Platform', entity.platform);
      if (entity.profileUrl) detailsHTML += createMetadataField('Profile URL', `<a href="${entity.profileUrl}" target="_blank">${entity.profileUrl}</a>`);
      if (entity.avatar) detailsHTML += createMetadataField('Avatar URL', `<a href="${entity.avatar}" target="_blank">View Avatar</a>`);
      break;

    case 'domain':
      if (entity.domain) detailsHTML += createMetadataField('Domain Name', entity.domain);
      if (entity.ip) detailsHTML += createMetadataField('IP Address', entity.ip);
      if (entity.hostingCountry) detailsHTML += createMetadataField('Hosting Country', entity.hostingCountry);
      if (entity.hostingCity) detailsHTML += createMetadataField('Hosting City', entity.hostingCity);
      if (entity.registrar) detailsHTML += createMetadataField('Registrar', entity.registrar);
      if (entity.coordinates) detailsHTML += createMetadataField('Coordinates', entity.coordinates);
      if (entity.googleMaps) detailsHTML += createMetadataField('Google Maps', `<a href="${entity.googleMaps}" target="_blank">View Location</a>`);
      if (entity.whois) detailsHTML += createMetadataField('WHOIS Info', entity.whois);
      if (entity.ssl) detailsHTML += createMetadataField('SSL Info', entity.ssl);
      break;

    case 'group':
      if (entity.name) detailsHTML += createMetadataField('Group Name', entity.name);
      if (entity.groupType) detailsHTML += createMetadataField('Type', entity.groupType);
      if (entity.members && entity.members.length > 0) detailsHTML += createMetadataField('Known Members', entity.members.join(', '));
      if (entity.region) detailsHTML += createMetadataField('Operating Region', entity.region);
      if (entity.city) detailsHTML += createMetadataField('City', entity.city);
      if (entity.country) detailsHTML += createMetadataField('Country', entity.country);
      if (entity.coordinates) detailsHTML += createMetadataField('Coordinates', entity.coordinates);
      break;

    case 'username':
      if (entity.usernames && entity.usernames.length > 0) detailsHTML += createMetadataField('Usernames', entity.usernames.join(', '));
      if (entity.platforms && entity.platforms.length > 0) detailsHTML += createMetadataField('Associated Platforms', entity.platforms.join(', '));
      if (entity.linkedEmails && entity.linkedEmails.length > 0) detailsHTML += createMetadataField('Linked Emails', entity.linkedEmails.join(', '));
      if (entity.linkedWallets && entity.linkedWallets.length > 0) detailsHTML += createMetadataField('Linked Wallets', entity.linkedWallets.join(', '));
      break;

    case 'money':
      if (entity.value) detailsHTML += createMetadataField('Value', entity.value);
      if (entity.currency) detailsHTML += createMetadataField('Currency', entity.currency);
      if (entity.associatedWallets && entity.associatedWallets.length > 0) detailsHTML += createMetadataField('Associated Wallets', entity.associatedWallets.join(', '));
      break;

    case 'email':
      if (entity.emails && entity.emails.length > 0) detailsHTML += createMetadataField('Email Addresses', entity.emails.join(', '));
      if (entity.owner) detailsHTML += createMetadataField('Owner', entity.owner);
      if (entity.breaches) detailsHTML += createMetadataField('Breaches', entity.breaches);
      break;

    case 'phone':
      if (entity.numbers && entity.numbers.length > 0) detailsHTML += createMetadataField('Phone Numbers', entity.numbers.join(', '));
      if (entity.countryCode) detailsHTML += createMetadataField('Country Code', entity.countryCode);
      if (entity.carrier) detailsHTML += createMetadataField('Carrier', entity.carrier);
      if (entity.isVoip !== undefined) detailsHTML += createMetadataField('VOIP', entity.isVoip ? 'Yes' : 'No');
      break;

    case 'alias':
      if (entity.aliases && entity.aliases.length > 0) detailsHTML += createMetadataField('Alias Names', entity.aliases.join(', '));
      if (entity.realIdentity) detailsHTML += createMetadataField('Linked to Real Identity', entity.realIdentity);
      if (entity.context) detailsHTML += createMetadataField('Context', entity.context);
      break;

    case 'document':
      if (entity.filename) detailsHTML += createMetadataField('Filename', entity.filename);
      if (entity.hashes && entity.hashes.length > 0) detailsHTML += createMetadataField('SHA256/MD5', entity.hashes.join(', '));
      if (entity.fileType) detailsHTML += createMetadataField('File Type', entity.fileType);
      if (entity.uploadedBy) detailsHTML += createMetadataField('Uploaded By', entity.uploadedBy);
      break;

    case 'malware':
      if (entity.name) detailsHTML += createMetadataField('Name', entity.name);
      if (entity.malwareType) detailsHTML += createMetadataField('Malware Type', entity.malwareType);
      if (entity.hashes && entity.hashes.length > 0) detailsHTML += createMetadataField('Known Hashes', entity.hashes.join(', '));
      if (entity.servers && entity.servers.length > 0) detailsHTML += createMetadataField('Known Servers', entity.servers.join(', '));
      break;
  }

  detailsHTML += `
      </div>
    </div>
  `;

  // Custom metadata section
  if (entity.metadata && Object.keys(entity.metadata).length > 0) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Custom Metadata</div>
        <div class="entity-metadata">
    `;

    Object.entries(entity.metadata).forEach(([key, value]) => {
      detailsHTML += createMetadataField(key, value);
    });

    detailsHTML += `
        </div>
      </div>
    `;
  }

  // Tags section
  if (entity.tags && Array.isArray(entity.tags) && entity.tags.length > 0) {
    detailsHTML += `
      <div class="entity-section">
        <div class="entity-section-title">Tags</div>
        <div class="entity-tags">
    `;

    entity.tags.forEach(tag => {
      if (tag.trim()) {
        detailsHTML += `<span class="entity-tag">${tag}</span>`;
      }
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

function createMetadataField(key, value) {
  return `
    <div class="entity-metadata-key">${key}:</div>
    <div class="entity-metadata-value">${value}</div>
  `;
}

function showEditConnectionModal(sourceId, targetId) {
  const sourceEntity = getEntityById(sourceId);
  const connection = sourceEntity.connections.find(conn => conn.targetId === targetId);
  
  if (!connection) return; //
  
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
    const edge = findNode(`${sourceId}-${targetId}`);
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
  if (!state.selectedEntityId) return; //
  
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
  if (!file) return; //
  
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