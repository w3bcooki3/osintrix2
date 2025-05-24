# 🕵️‍♂️ OSINT Graph Visualizer — Personal Cyber Investigation Tool

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](https://github.com/yourusername/osint-graph-visualizer)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made with Vanilla JS](https://img.shields.io/badge/made%20with-Vanilla%20JS-yellow)](#)
[![Frontend Only](https://img.shields.io/badge/backend-none-lightgrey)](#)

> A browser-based graph visualizer for **OSINT, threat intelligence, and crypto investigations**, built entirely with **HTML, CSS, and vanilla JavaScript** — no frameworks or servers required.

---

## 🔍 Overview

A lightweight, offline tool for visualizing connections between entities like people, domains, IPs, wallets, and more. Ideal for:

- Cybercrime & fraud investigations
- Blockchain and wallet forensics
- OSINT & threat actor research
- Visual network mapping

Built for analysts, researchers, and enthusiasts who want full control without subscriptions or restrictions.

---

## ✨ Features

### 🧠 Interactive Graph

- Built with [Cytoscape.js](https://js.cytoscape.org/)
- Drag, zoom, pan smoothly
- Rich context menu (Edit, Delete, Connect, Highlight)
- Labelled edges with custom types
- Find shortest/all paths between nodes
- Group & collapse related nodes

### 📑 Metadata & Panels

- **Node Detail Panel** (Top-Right)
  - Displays all metadata, images, location links, tags
  - Edit/Delete node
- **Entity List Panel** (Right)
  - Click-to-focus, filter by type, auto-updates
- **Notes Panel** (Bottom-Right)
  - Rich text support (images, links, highlights)
  - Resizable, dockable, exportable to HTML

### 🔗 Data Lookup Links Panel

> ✅ **Manually populated links** — not auto-generated  
Quick-access to external OSINT tools and resources based on selected entity type (e.g., email lookup, domain WHOIS, wallet explorers).

### 🧠 Dorking Assistant

Build and launch advanced Google/Shodan/Bing dorks for:
- Login panels, misconfigs, leaked databases
- Domain footprints, wallet mentions
- Exposed IPs or technologies

Includes:
- Prebuilt dork templates (email, wallet, domain, etc.)
- Custom query builder
- Copy to clipboard / open in new tab

### 🔎 Search & Filter

- Global search across all node data
- Filter graph by entity type
- Highlight results

### 🛠️ Utilities

- Save/Load from local JSON files
- Export full graph with base64 images
- Undo/Redo
- Theme toggle (Light/Dark)
- Reset camera view

---

## 📁 Supported Node Types

- 👤 Person
- 🏢 Organization
- 💸 Wallet Address
- 🌍 IP Address
- 📍 Location
- 🌐 Domain / Website
- 📱 Social Media / Username / Group
- 🔄 Transaction
- 💰 Money Amount
- 📧 Email Address
- 📞 Phone Number
- 🔖 Alias
- 🔐 File / Hash / Evidence
- 🐞 Malware / Tool

Each with dynamic, context-specific metadata fields + optional custom fields.

---

## 🧾 Technologies Used

| Tech             | Role                         |
|------------------|-------------------------------|
| HTML/CSS         | UI and layout                 |
| JavaScript       | Interactivity & logic         |
| Cytoscape.js     | Graph rendering engine        |
| Font Awesome     | Icons and visual enhancements |

> No React, no build tools, no backend — fully portable and private.

---

## 🚧 Roadmap & Status

| Area        | Status        |
|-------------|---------------|
| Core Graph  | ✅ Stable      |
| Notes Panel | ✅ Functional  |
| Timeline    | 🛠️ Planned |
| Dorking UI  | ✅ Added       |
| Data Links  | ✅ Added |
| Subgraphs   | 🛠️ Planned    |
| Encryption  | 🛠️ Planned    |

> 🔧 Ongoing improvements for performance, UX, and features based on real-world investigations.

---

## 📸 Screenshots

> _Coming Soon_: Example screenshots and graph samples.

---

## 🤝 Contributing

This is a personal project built for investigative needs, but contributions are welcome!

**To contribute:**
1. Fork the repo
2. Submit PRs for bugs, UI improvements, or new features
3. Suggest links or dork templates

> Please ensure pull requests are in plain HTML/CSS/JS (no frameworks).

---

## 🧠 Credits

Created by **bolt.new AI** — a solo initiative to provide free, open, and investigative-first tooling to cybersecurity researchers, OSINT analysts, and digital forensics enthusiasts.

> “This app was built as a free, private, and open-source alternative to paid OSINT tools. Expect bugs — improvements and new features are planned.”

---

## 📜 License

This project is licensed under the MIT License.  
See [LICENSE](LICENSE) for details.

---
