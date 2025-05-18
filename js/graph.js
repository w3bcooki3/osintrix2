// Graph visualization and interaction
import cytoscape from 'https://cdn.jsdelivr.net/npm/cytoscape@3.28.1/+esm';

let cy;

// Color mapping for entity types
const entityColors = {
  'person': '#2D5BFF',      // Primary
  'organization': '#00C2CB', // Secondary
  'wallet': '#FF7D3B',      // Accent
  'ip': '#F59E0B',         // Warning
  'location': '#10B981',    // Success
  'transaction': '#1A3CB0', // Primary Dark
  'social': '#00939A',      // Secondary Dark
  'domain': '#D95A1B',      // Accent Dark
  'website': '#EF4444',     // Error
  'money': '#4CDEE6',       // Secondary Light
  'group': '#FF9E6D',       // Accent Light
  'username': '#5E80FF'     // Primary Light
};

function initGraph(container) {
  cy = cytoscape({
    container: container,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#2D5BFF',
          'label': 'data(label)',
          'color': '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'font-size': '10px',
          'width': '40px',
          'height': '40px',
          'text-outline-width': 1,
          'text-outline-color': '#2D5BFF',
          'text-wrap': 'ellipsis',
          'text-max-width': '80px'
        }
      },
      {
        selector: 'node[type]',
        style: {
          'background-color': function(ele) {
            return entityColors[ele.data('type')] || '#2D5BFF';
          },
          'text-outline-color': function(ele) {
            return entityColors[ele.data('type')] || '#2D5BFF';
          }
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': 2,
          'border-color': '#ffffff',
          'border-opacity': 0.8,
          'background-opacity': 1,
          'text-outline-color': '#555',
          'shadow-blur': 10,
          'shadow-color': '#000',
          'shadow-opacity': 0.5,
          'shadow-offset-x': 0,
          'shadow-offset-y': 0
        }
      },
      {
        selector: 'node.highlighted',
        style: {
          'border-width': 3,
          'border-color': '#ffffff',
          'border-opacity': 0.9,
          'background-opacity': 1,
          'text-outline-color': '#555',
          'shadow-blur': 15,
          'shadow-color': '#000',
          'shadow-opacity': 0.7,
          'shadow-offset-x': 0,
          'shadow-offset-y': 0,
          'z-index': 999
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#9CA3AF';
          },
          'target-arrow-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#9CA3AF';
          },
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '10px',
          'color': '#FFFFFF',
          'text-rotation': 'autorotate',
          'text-background-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#9CA3AF';
          },
          'text-background-opacity': 0.95,
          'text-background-padding': '4px',
          'text-border-width': 1,
          'text-border-color': '#000000',
          'text-border-opacity': 0.2,
          'text-outline-width': 0,
          'text-margin-y': -5
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'width': 3,
          'line-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#2D5BFF';
          },
          'target-arrow-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#2D5BFF';
          },
          'text-background-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#2D5BFF';
          }
        }
      },
      {
        selector: 'edge.highlighted',
        style: {
          'width': 3,
          'line-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#2D5BFF';
          },
          'target-arrow-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#2D5BFF';
          },
          'text-background-color': function(ele) {
            const sourceNode = ele.source();
            const sourceType = sourceNode.data('type');
            return entityColors[sourceType] || '#2D5BFF';
          },
          'z-index': 999
        }
      }
    ],
    layout: {
      name: 'cose',
      nodeDimensionsIncludeLabels: true,
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      boundingBox: {
        x1: 0,
        y1: 0,
        w: container.offsetWidth,
        h: container.offsetHeight
      }
    },
    wheelSensitivity: 0.3
  });

  setupGraphEvents();
}

function setupGraphEvents() {
  // Background click handler
  cy.on('click', function(event) {
    if (event.target === cy) {
      import('./app.js').then(app => {
        app.selectEntity(null);
      });
    }
  });

  // Node click handler
  cy.on('tap', 'node', function(event) {
    const node = event.target;
    import('./app.js').then(app => {
      app.selectEntity(node.id());
    });
  });

  // Right-click handler for nodes
  cy.on('cxttap', 'node', function(event) {
    event.preventDefault();
    const node = event.target;
    
    // Get the node's rendered position (in screen coordinates)
    const renderedPos = node.renderedPosition();
    const containerPos = cy.container().getBoundingClientRect();
    
    // Calculate screen coordinates
    const x = containerPos.left + renderedPos.x;
    const y = containerPos.top + renderedPos.y;
    
    // First select the node
    import('./app.js').then(app => {
      app.selectEntity(node.id());
      
      // Then show context menu
      import('./ui/contextMenu.js').then(contextMenu => {
        contextMenu.showContextMenu(x, y, node.id(), 'graph');
      });
    });
    
    return false;
  });

  // Hide context menu on background click
  cy.on('click', function(event) {
    if (event.target === cy) {
      import('./ui/contextMenu.js').then(contextMenu => {
        contextMenu.hideContextMenu();
      });
    }
  });
}

function addNodeToGraph(nodeData, runLayout = true) {
  const containerWidth = cy.width();
  const containerHeight = cy.height();
  
  cy.add({
    group: 'nodes',
    data: {
      id: nodeData.id,
      label: nodeData.label,
      type: nodeData.type
    },
    position: {
      x: containerWidth / 2,
      y: containerHeight / 2
    }
  });
  
  if (runLayout) {
    cy.layout({
      name: 'cose',
      nodeDimensionsIncludeLabels: true,
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: false,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 100,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    }).run();
  }
}

function removeNodeFromGraph(nodeId) {
  const node = cy.getElementById(nodeId);
  if (node.length > 0) {
    node.connectedEdges().remove();
    node.remove();
  }
}

function addEdgeToGraph(edgeData) {
  const sourceNode = cy.getElementById(edgeData.source);
  const targetNode = cy.getElementById(edgeData.target);
  
  if (sourceNode.length === 0) {
    console.error(`Cannot create edge: source node ${edgeData.source} does not exist`);
    return;
  }
  
  if (targetNode.length === 0) {
    console.error(`Cannot create edge: target node ${edgeData.target} does not exist`);
    return;
  }
  
  const edgeId = `${edgeData.source}-${edgeData.target}`;
  
  if (cy.getElementById(edgeId).length === 0) {
    cy.add({
      group: 'edges',
      data: {
        id: edgeId,
        source: edgeData.source,
        target: edgeData.target,
        label: edgeData.label || ''
      }
    });
  }
}

function removeEdgeFromGraph(edgeId) {
  cy.getElementById(edgeId).remove();
}

function findNode(nodeId) {
  return cy.getElementById(nodeId);
}

function highlightNode(nodeId) {
  clearHighlights();
  
  const node = cy.getElementById(nodeId);
  if (!node.length) return;
  
  node.addClass('highlighted');
  
  const connectedEdges = node.connectedEdges();
  connectedEdges.addClass('highlighted');
  
  const connectedNodes = node.neighborhood('node');
  connectedNodes.addClass('highlighted');
}

function clearHighlights() {
  cy.elements().removeClass('highlighted');
}

function findShortestPath(sourceId, targetId) {
  const sourceNode = cy.getElementById(sourceId);
  const targetNode = cy.getElementById(targetId);
  
  if (!sourceNode.length || !targetNode.length) {
    return null;
  }
  
  const dijkstra = cy.elements().dijkstra({
    root: sourceNode,
    directed: true
  });
  
  const pathToTarget = dijkstra.pathTo(targetNode);
  
  return pathToTarget.length > 0 ? pathToTarget : null;
}

function resetGraphView() {
  cy.fit();
  cy.layout({
    name: 'cose',
    nodeDimensionsIncludeLabels: true,
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  }).run();
}

function resetGraph() {
  if (cy) {
    cy.elements().remove();
    cy.fit();
  }
}

export {
  initGraph,
  addNodeToGraph,
  removeNodeFromGraph,
  addEdgeToGraph,
  removeEdgeFromGraph,
  findNode,
  highlightNode,
  clearHighlights,
  findShortestPath,
  resetGraphView,
  resetGraph
};