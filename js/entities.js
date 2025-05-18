// Entity management
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.1/+esm';

// Store the entities
let entities = [];

// Create a new entity
function createEntity(entityData) {
  const entity = {
    id: uuidv4(),
    type: entityData.type,
    name: entityData.name,
    label: entityData.label || entityData.name,
    description: entityData.description || '',
    date: entityData.date || '',
    time: entityData.time || '',
    location: entityData.location || '',
    tags: entityData.tags || [],
    metadata: entityData.metadata || {},
    image: entityData.image || '',
    connections: [],
    createdAt: new Date().toISOString()
  };
  
  entities.push(entity);
  return entity;
}

// Get entity by ID
function getEntityById(id) {
  return entities.find(entity => entity.id === id);
}

// Get all entities
function getAllEntities() {
  return [...entities];
}

// Update an entity
function updateEntity(id, entityData) {
  const index = entities.findIndex(entity => entity.id === id);
  
  if (index !== -1) {
    entities[index] = {
      ...entities[index],
      ...entityData,
      updatedAt: new Date().toISOString()
    };
    
    return entities[index];
  }
  
  return null;
}

// Delete an entity
function deleteEntity(id) {
  // First, remove all connections to this entity
  entities.forEach(entity => {
    entity.connections = entity.connections.filter(conn => conn.targetId !== id);
  });
  
  // Then, remove the entity itself
  entities = entities.filter(entity => entity.id !== id);
}

// Duplicate an entity
function duplicateEntity(entity) {
  const newEntity = {
    ...entity,
    id: uuidv4(),
    label: `${entity.label} (Copy)`,
    connections: [],
    createdAt: new Date().toISOString()
  };
  
  entities.push(newEntity);
  return newEntity;
}

// Add a connection between entities
function addEntityConnection(sourceId, targetId, label = '') {
  const sourceEntity = getEntityById(sourceId);
  
  if (sourceEntity) {
    // Check if connection already exists
    const existingConnection = sourceEntity.connections.find(conn => conn.targetId === targetId);
    
    if (!existingConnection) {
      sourceEntity.connections.push({
        targetId,
        label,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update existing connection label
      existingConnection.label = label;
      existingConnection.updatedAt = new Date().toISOString();
    }
  }
}

// Remove a connection between entities
function removeEntityConnection(sourceId, targetId) {
  const sourceEntity = getEntityById(sourceId);
  
  if (sourceEntity) {
    sourceEntity.connections = sourceEntity.connections.filter(conn => conn.targetId !== targetId);
  }
}

// Get all entities connected to an entity
function getConnectedEntities(id) {
  const entity = getEntityById(id);
  
  if (!entity) return [];
  
  return entity.connections.map(conn => {
    const targetEntity = getEntityById(conn.targetId);
    return {
      ...targetEntity,
      connectionLabel: conn.label
    };
  }).filter(e => e);
}

// Get icon for entity type
function getEntityIcon(type) {
  const iconMap = {
    person: 'fa-user',
    organization: 'fa-building',
    wallet: 'fa-wallet',
    ip: 'fa-network-wired',
    location: 'fa-map-marker-alt',
    transaction: 'fa-exchange-alt',
    social: 'fa-share-alt',
    domain: 'fa-globe',
    website: 'fa-desktop',
    money: 'fa-money-bill-wave',
    group: 'fa-users',
    username: 'fa-user-tag'
  };
  
  return iconMap[type] || 'fa-question';
}

// Set entities data (used for import/load)
function setEntitiesData(data) {
  entities = data;
}

// Export entity related functions
export {
  createEntity,
  getEntityById,
  getAllEntities,
  updateEntity,
  deleteEntity,
  duplicateEntity,
  addEntityConnection,
  removeEntityConnection,
  getConnectedEntities,
  getEntityIcon,
  setEntitiesData
};