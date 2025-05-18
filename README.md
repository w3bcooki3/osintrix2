# 🕵️‍♂️ OSINT Graph Visualizer — Personal Cyber Investigation Tool

> A professional-grade graph-based investigation tool built using **pure HTML, CSS, and JavaScript** (no frameworks), designed for **OSINT investigations, threat hunting, and cryptocurrency fraud tracing**.

## 🎯 Overview

This project is a **fully client-side** graph visualization tool created for personal use in cybercrime and blockchain investigations. It supports complex entity mapping, chronological event tracking, and exportable notes/reporting — all with an intuitive, interactive interface.

Built as a **portfolio project** to demonstrate real-world capability in front-end development, visualization logic, and UI/UX design without relying on any modern frontend frameworks.

---

## 🔍 Use Cases

- OSINT Investigations
- Threat Intelligence & Actor Mapping
- Blockchain & Crypto Fraud Tracing
- Dark Web Monitoring
- Personal Cybersecurity Research
- Incident Response Documentation

---

## ✨ Features

### 🧠 Interactive Graph Engine

- Smooth drag, zoom, pan
- Create nodes for:
  - 👤 Person (w/ photo)
  - 🏢 Organization (w/ logo)
  - 🏦 Bank
  - 💸 Wallet Address (e.g., Ethereum)
  - 🌍 IP Address (with country flag)
  - 🌐 Domain / Website
  - 🧾 Transaction IDs
  - 📍 Locations (city/country)
  - 📱 Social Media / Username
- Create labeled edges (relationships/links)
- Right-click context menu for quick actions: Edit / Delete / Connect / Highlight

### 📑 Node Details Panel

- Appears when node selected
- View and edit all node metadata:
  - Type, label, notes, date/time, location
  - Connections overview
  - Larger image preview (e.g., QR, screenshot)

### 📝 Draggable Notes Panel

- Located in bottom-right corner (minimizable)
- Rich text editing:
  - Bold / Italic / Underline / Font Size / Highlights
  - Bullet points, hyperlinks, image embedding
- Export notes as clean HTML for reporting

### 🕒 Timeline View

- Chronological view of relationships/events
- Helps visualize flow of transactions or communications
- Collapsible panel on bottom of screen

### 🔍 Search & Filters

- Global search (label, type, metadata)
- Filter by node/entity type

### 🛠️ Utility Features

- Undo / Redo
- Save / Load investigation to/from JSON
- Export/Import (JSON includes image data as base64)
- Dark / Light theme toggle
- Reset view
- Collapsible subgraphs / node grouping

---

## 🧾 Tech Stack

| Technology     | Usage                         |
|----------------|-------------------------------|
| HTML/CSS       | Layout and UI Styling         |
| Vanilla JS     | Graph rendering, logic, UI    |
| SVG / Canvas   | Graph visualization            |
| File API       | JSON import/export            |
| Base64 Encoding| Image handling                |

> ⚠️ This project uses **no frameworks** — no React, Vue, jQuery, D3, or external libraries. 100% raw code.

---

## 🚀 Getting Started

1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/osint-graph-visualizer.git
