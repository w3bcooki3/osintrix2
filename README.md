# 🕵️‍♂️ OSINT Graph Visualizer — Personal Cyber Investigation Tool

> A powerful client-side graph-based visualization tool for **OSINT, threat intelligence, and cryptocurrency fraud investigations**, built using **HTML, CSS, vanilla JavaScript**, and **Cytoscape.js** (no frameworks like React or Angular).

![screenshot-placeholder](preview.png) <!-- Replace with your screenshot -->

---

## 🎯 Project Overview

This is a **personal-use investigation tool** built for mapping complex relationships between people, wallets, domains, IPs, and more — designed to assist with:

- OSINT (Open Source Intelligence)
- Blockchain/Cryptocurrency analysis
- Threat actor profiling
- Cybercrime investigations

Built entirely with frontend technologies and uses **Cytoscape.js** for graph rendering and **Font Awesome** for iconography. No heavy frontend frameworks or build steps — fully browser-based.

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

