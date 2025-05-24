// Dork Assistant functionality
const DORK_CATEGORIES = {
  information: {
    title: "Information Gathering",
    icon: "fas fa-info-circle",
    templates: [
      {
        title: "Domain Information",
        description: "Find all pages indexed for a specific domain",
        query: "site:{domain}"
      },
      {
        title: "Email Discovery",
        description: "Find email addresses associated with a domain",
        query: 'site:{domain} "@{domain}" OR "email" OR "contact"'
      },
      {
        title: "Employee Information",
        description: "Find employee information for a company",
        query: 'site:linkedin.com "{company}" employees OR staff OR team'
      }
    ]
  },
  files: {
    title: "File Discovery",
    icon: "fas fa-file-alt",
    templates: [
      {
        title: "PDF Documents",
        description: "Find PDF files on a domain",
        query: "site:{domain} filetype:pdf"
      },
      {
        title: "Excel Files",
        description: "Find Excel spreadsheets",
        query: "site:{domain} filetype:xlsx OR filetype:xls"
      },
      {
        title: "Configuration Files",
        description: "Find potential configuration files",
        query: 'filetype:conf OR filetype:config OR filetype:env "{keyword}"'
      }
    ]
  },
  vulnerabilities: {
    title: "Vulnerability Scanning",
    icon: "fas fa-bug",
    templates: [
      {
        title: "Admin Panels",
        description: "Find admin login pages",
        query: 'site:{domain} inurl:admin OR inurl:login OR inurl:administrator'
      },
      {
        title: "SQL Errors",
        description: "Find pages with SQL errors",
        query: 'site:{domain} "sql syntax" OR "mysql error"'
      },
      {
        title: "Exposed Git",
        description: "Find exposed Git repositories",
        query: 'site:{domain} inurl:.git'
      }
    ]
  },
  social: {
    title: "Social Media",
    icon: "fas fa-share-alt",
    templates: [
      {
        title: "LinkedIn Profiles",
        description: "Find LinkedIn profiles",
        query: 'site:linkedin.com "{name}" OR "{company}"'
      },
      {
        title: "Twitter Accounts",
        description: "Find Twitter profiles",
        query: 'site:twitter.com "{username}" OR "{name}"'
      },
      {
        title: "Facebook Pages",
        description: "Find Facebook presence",
        query: 'site:facebook.com "{name}" OR "{company}"'
      }
    ]
  },
  credentials: {
    title: "Credentials & Auth",
    icon: "fas fa-key",
    templates: [
      {
        title: "Password Files",
        description: "Find potential password files",
        query: 'site:{domain} filetype:txt "password" OR "pwd" OR "passwd"'
      },
      {
        title: "API Keys",
        description: "Find exposed API keys",
        query: 'site:{domain} "api_key" OR "apikey" OR "client_secret"'
      },
      {
        title: "Config Files",
        description: "Find configuration files with credentials",
        query: 'site:{domain} filetype:env OR filetype:cfg "password" OR "credential"'
      }
    ]
  },
  database: {
    title: "Database Exposure",
    icon: "fas fa-database",
    templates: [
      {
        title: "SQL Dumps",
        description: "Find exposed SQL dumps",
        query: 'site:{domain} filetype:sql "INSERT INTO" OR "CREATE TABLE"'
      },
      {
        title: "Database Files",
        description: "Find database files",
        query: 'site:{domain} filetype:db OR filetype:sqlite OR filetype:mdb'
      },
      {
        title: "Connection Strings",
        description: "Find database connection strings",
        query: 'site:{domain} "mysqli_connect" OR "mysql_connect"'
      }
    ]
  },
  network: {
    title: "Network Infrastructure",
    icon: "fas fa-network-wired",
    templates: [
      {
        title: "Router Config",
        description: "Find exposed router configurations",
        query: 'site:{domain} intitle:"router configuration" OR inurl:cisco'
      },
      {
        title: "Open Ports",
        description: "Find services on non-standard ports",
        query: 'site:{domain} port:8080 OR port:8443 OR port:3306'
      },
      {
        title: "Network Devices",
        description: "Find network devices",
        query: 'site:{domain} intitle:"Network Camera" OR inurl:phpinfo'
      }
    ]
  },
  phones: {
    title: "Phone Numbers",
    icon: "fas fa-phone",
    templates: [
      {
        title: "Contact Numbers",
        description: "Find phone numbers on a domain",
        query: 'site:{domain} "phone" OR "tel" OR "contact" OR "call us"'
      },
      {
        title: "Mobile Numbers",
        description: "Find mobile numbers",
        query: 'site:{domain} intext:"+1" OR "+44" filetype:pdf OR filetype:doc'
      }
    ]
  },
  emails: {
    title: "Emails",
    icon: "fas fa-envelope",
    templates: [
      {
        title: "Email Addresses",
        description: "Find email addresses",
        query: 'site:{domain} "@{domain}"'
      },
      {
        title: "Contact Emails",
        description: "Find contact email addresses",
        query: 'site:{domain} "contact" OR "email us" "@"'
      }
    ]
  },
  crypto: {
    title: "Crypto & Wallets",
    icon: "fas fa-coins",
    templates: [
      {
        title: "Bitcoin Addresses",
        description: "Find Bitcoin wallet addresses",
        query: 'site:{domain} "bitcoin" OR "btc" OR "1" OR "3" OR "bc1"'
      },
      {
        title: "Ethereum Addresses",
        description: "Find Ethereum addresses",
        query: 'site:{domain} "ethereum" OR "eth" OR "0x"'
      }
    ]
  }
};

const SEARCH_ENGINES = {
  google: {
    name: "Google",
    icon: "fab fa-google",
    url: "https://www.google.com/search?q="
  },
  yandex: {
    name: "Yandex",
    icon: "fab fa-yandex",
    url: "https://yandex.com/search/?text="
  },
  bing: {
    name: "Bing",
    icon: "fab fa-microsoft",
    url: "https://www.bing.com/search?q="
  },
  duckduckgo: {
    name: "DuckDuckGo",
    icon: "fas fa-duck",
    url: "https://duckduckgo.com/?q="
  },
  yahoo: {
    name: "Yahoo",
    icon: "fab fa-yahoo",
    url: "https://search.yahoo.com/search?p="
  },
  shodan: {
    name: "Shodan",
    icon: "fas fa-globe",
    url: "https://www.shodan.io/search?query="
  },
  censys: {
    name: "Censys",
    icon: "fas fa-search",
    url: "https://search.censys.io/search?resource=hosts&q="
  }
};

function initializeDorkAssistant() {
  const dorkPanel = document.getElementById('dork-panel');
  const dorkHeader = dorkPanel?.querySelector('.dork-header');
  const toggleBtn = document.getElementById('toggle-dork-btn');
  const closeBtn = document.getElementById('close-dork-btn');
  const searchBtn = document.getElementById('search-dork');
  const resetBtn = document.getElementById('reset-dork');
  const helpBtn = document.getElementById('dork-help-btn');
  const categorySelect = document.getElementById('dork-category');
  const templateSelect = document.getElementById('dork-template');
  const searchEngineSelect = document.getElementById('dork-search-engine');
  const customQueryInput = document.getElementById('dork-custom-query');
  const finalQueryDisplay = document.getElementById('dork-final-query');
  const copyBtn = document.getElementById('copy-dork');

  if (!dorkPanel || !dorkHeader) return;

  // Make panel draggable with boundary constraints
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  dorkHeader.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  function dragStart(e) {
    if (e.target === closeBtn) return;
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === dorkHeader) {
      isDragging = true;
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      // Calculate boundaries
      const panelRect = dorkPanel.getBoundingClientRect();
      const maxX = window.innerWidth - panelRect.width;
      const maxY = window.innerHeight - panelRect.height;

      // Constrain to screen boundaries
      currentX = Math.min(Math.max(0, currentX), maxX);
      currentY = Math.min(Math.max(0, currentY), maxY);

      xOffset = currentX;
      yOffset = currentY;

      // Remove transform: translateX(-50%) while dragging
      dorkPanel.style.transform = 'none';
      dorkPanel.style.left = currentX + 'px';
      dorkPanel.style.top = currentY + 'px';
      
      // Remove bottom positioning
      dorkPanel.style.bottom = 'auto';
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

  // Initialize categories
  initializeCategories();
  
  // Initialize search engines
  initializeSearchEngines();

  // Toggle panel
  toggleBtn?.addEventListener('click', () => {
    dorkPanel.classList.toggle('hidden');
  });

  // Close panel
  closeBtn?.addEventListener('click', () => {
    dorkPanel.classList.add('hidden');
  });

  // Category change
  categorySelect?.addEventListener('change', () => {
    updateTemplates();
    updateQuery();
  });

  // Template change
  templateSelect?.addEventListener('change', updateQuery);

  // Custom query input
  customQueryInput?.addEventListener('input', updateQuery);

  // Copy button
  copyBtn?.addEventListener('click', () => {
    const query = finalQueryDisplay.textContent;
    navigator.clipboard.writeText(query).then(() => {
      showNotification('Query copied to clipboard!', 'success');
    });
  });

  // Search button
  searchBtn?.addEventListener('click', () => {
    const query = finalQueryDisplay.textContent;
    const engine = searchEngineSelect.value;
    if (!query) {
      showNotification('Please enter a search query', 'error');
      return;
    }
    const searchUrl = SEARCH_ENGINES[engine].url + encodeURIComponent(query);
    window.open(searchUrl, '_blank');
  });

  // Reset button
  resetBtn?.addEventListener('click', () => {
    categorySelect.selectedIndex = 0;
    updateTemplates();
    customQueryInput.value = '';
    updateQuery();
  });

  // Help button
  helpBtn?.addEventListener('click', showHelp);
}

function initializeCategories() {
  const categorySelect = document.getElementById('dork-category');
  if (!categorySelect) return;

  Object.entries(DORK_CATEGORIES).forEach(([key, category]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });

  updateTemplates();
}

function initializeSearchEngines() {
  const searchEngineSelect = document.getElementById('dork-search-engine');
  if (!searchEngineSelect) return;

  Object.entries(SEARCH_ENGINES).forEach(([key, engine]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = engine.name;
    searchEngineSelect.appendChild(option);
  });
}

function updateTemplates() {
  const categorySelect = document.getElementById('dork-category');
  const templateSelect = document.getElementById('dork-template');
  if (!categorySelect || !templateSelect) return;

  const category = DORK_CATEGORIES[categorySelect.value];
  templateSelect.innerHTML = '';

  if (category) {
    category.templates.forEach((template, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = template.title;
      templateSelect.appendChild(option);
    });
  }

  updateQuery();
}

function updateQuery() {
  const categorySelect = document.getElementById('dork-category');
  const templateSelect = document.getElementById('dork-template');
  const customQueryInput = document.getElementById('dork-custom-query');
  const finalQueryDisplay = document.getElementById('dork-final-query');
  
  if (!categorySelect || !templateSelect || !customQueryInput || !finalQueryDisplay) return;

  const category = DORK_CATEGORIES[categorySelect.value];
  const templateIndex = parseInt(templateSelect.value);
  const template = category?.templates[templateIndex];
  const customQuery = customQueryInput.value.trim();

  let finalQuery = '';
  if (template) {
    finalQuery = template.query;
    // Replace placeholders with custom input if provided
    if (customQuery) {
      finalQuery = finalQuery
        .replace(/{domain}/g, customQuery)
        .replace(/{keyword}/g, customQuery)
        .replace(/{name}/g, customQuery)
        .replace(/{company}/g, customQuery)
        .replace(/{username}/g, customQuery);
    }
  }

  finalQueryDisplay.textContent = finalQuery;
}

function showHelp() {
  const helpContent = `
    <h3>Dork Operators</h3>
    <ul>
      <li><strong>site:</strong> - Search within a specific domain</li>
      <li><strong>intitle:</strong> - Search page titles</li>
      <li><strong>inurl:</strong> - Search URLs</li>
      <li><strong>filetype:</strong> - Search for specific file types</li>
      <li><strong>intext:</strong> - Search page content</li>
      <li><strong>cache:</strong> - View cached version</li>
    </ul>
    <h3>Tips</h3>
    <ul>
      <li>Use quotes for exact matches: "example"</li>
      <li>Use OR to combine searches: term1 OR term2</li>
      <li>Use - to exclude terms: -exclude</li>
      <li>Use .. for number ranges: 2020..2023</li>
    </ul>
  `;

  showModal('Dork Help', helpContent);
}

function showModal(title, content) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="btn-icon modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

export { initializeDorkAssistant };