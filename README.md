# 🕵️‍♂️ OSINT Graph Visualizer — Personal Cyber Investigation Tool

> A client-side graph-based visualization tool for **OSINT, threat intelligence, and cryptocurrency fraud investigations**, built using **HTML, CSS, vanilla JavaScript**, and **Cytoscape.js** (no frameworks like React or Angular).


---

## 🎯 Project Overview

This is a **personal-use investigation tool** built for mapping complex relationships between people, wallets, domains, IPs, and more — designed to assist with:

- OSINT (Open Source Intelligence)
- Blockchain/Cryptocurrency analysis
- Threat actor profiling
- Cybercrime investigations

Built entirely with frontend technologies and uses **Cytoscape.js** for graph rendering and **Font Awesome** for iconography. No heavy frontend frameworks or build steps — fully browser-based.

> 🚀 This is a personal project built with the help of **bolt.new AI** — still in active development. Expect bugs, fixes, and fresh features soon!

---

## ✨ Features

### 🧠 Interactive Graph (via Cytoscape.js)

- Drag, zoom, pan smoothly
- Create custom nodes with metadata:
  - 👤 Person
  - 🏢 Organization
  - 💸 Wallet Address
  - 🌍 IP Address (flag icon)
  - 📍 Location
  - 🌐 Domains/Websites
  - 🧾 Transaction IDs
  - 📱 Social Media, Bank, Group, Username
- Right-click context menu:
  - Edit, Delete, Connect, Highlight
- Labeled edges between entities

### 📑 Metadata Panels

- **Node Detail Panel (Top-Right)**:
  - Shows selected node's full metadata: label, description, time/date, location, tags, image
  - Image preview for QR codes, screenshots, or logos
  - Edit/Delete node
  - Connected nodes overview

- **Entity List Panel (Right Half)**:
  - Live list of all created entities
  - Click to focus node
  - Updates on create/delete

### 📝 Rich Notes Panel (Bottom-Right)

- Draggable, resizable notes section
- Rich text editing:
  - Bold, Italic, Underline, Font size, Bullet points, Highlight
  - Add links, upload images
- Can be minimized to bottom-right
- **Exportable to clean HTML** for investigation reports

### 🕒 Timeline View (Bottom Panel)

- Track chronological evolution of events or transactions
- Toggle visibility

### 🔎 Search & Filters

- Global search by label, type, or metadata
- Filter graph by entity type (e.g., show only IPs or Wallets)

### 🛠️ Utility Features

- Undo / Redo support
- Light/Dark theme toggle
- Save/Load investigations to local `.json` files
- Export/Import investigation (includes images in base64)
- Reset view
- Collapsible node groups / subgraphs

---

## 🧾 Technologies Used

| Tech             | Purpose                    |
|------------------|-----------------------------|
| HTML/CSS         | UI structure and styling    |
| JavaScript (Vanilla) | Graph logic & interactivity |
| **Cytoscape.js** | Graph rendering engine      |
| **Font Awesome** | Entity icons and UI visuals |

> No React, no frameworks, no build step.

---

## ⚡ Why I Built This

Most OSINT or investigation tools available today are either:
- **Too expensive**, with premium features locked behind paywalls
- **Too limited**, missing the flexibility or personal control I needed
- Or they just didn’t *feel right* for the way I investigate

So I built this tool myself — from scratch — with full control, no dependencies, and no costs involved.

> This project was designed and developed by **bolt.new AI** — a personal initiative to create smarter, leaner tools without paying a cent.

---

## 🚧 Project Status & Roadmap

This project is still in active development.

- 🐞 **Known Bugs**: Some minor bugs and quirks may be present during node editing, panel resizing, and metadata rendering.
- 🧪 **Experimental Features**: Timeline view and rich text notes are functional but still evolving.
- 🔧 **Planned Improvements**:
  - Better layout controls
  - Subgraph grouping/collapsing
  - Real-time collaboration (in future versions)
  - Encrypted project files (optional)
  - Performance optimization for large graphs

> ⚠️ Bug fixes and new features will be added regularly as I refine the tool based on real-world use.

---


