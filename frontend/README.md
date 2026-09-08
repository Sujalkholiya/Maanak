# METROSCAN (SIH26034) — Legal Metrology Frontend

> **Automated Package Inspection & Legal Metrology Compliance Platform**  
> Built for Legal Metrology Officers, Field Inspectors, and Compliance Enforcement Authorities.

---

## 📌 Project Overview

**METROSCAN** is a high-performance web platform designed to automate and streamline compliance auditing under the **Legal Metrology (Packaged Commodities) Rules, 2011** and the **Legal Metrology Act, 2009** (India).

The application enables field inspection officers and enforcement authorities to:
- **Scan & Extract**: Capture physical package labeling and leverage structured OCR to extract mandatory declarations in both English and Hindi.
- **Audit & Verify**: Compute dynamic legal applicability, inspect Principal Display Panel (PDP) font size/area ratios, compare physical packaging with online e-commerce listings, and review bounding box evidence overlays (Compliance X-Ray).
- **Enforce & Report**: Manage inspection cases, conduct officer human-in-the-loop verification, generate official statutory legal notices, and trace chain of custody via SHA-256 hashed evidence vaults.
- **Intelligence & Analytics**: Monitor manufacturer compliance histories, spatial violation heatmaps, and city/district enforcement analytics.
- **Offline Reliability**: Operate in low-connectivity/remote field locations with cached offline queues and automated sync pipelines.

---

## 🛠️ Technology Stack

| Layer / Tool | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React `v19.2.8` | High-efficiency component architecture with React 19 hooks |
| **Language** | TypeScript `v6.0.2` | End-to-end static typing, interfaces, and strict type safety |
| **Build Tool & Dev Server**| Vite `v8.2.2` | Lightning-fast HMR and optimized production bundling |
| **Styling & Design** | Tailwind CSS `v4.3.3` | Utility-first styling with modern Vite Tailwind integration |
| **Iconography** | Lucide React `v1.42.0` | Accessible, consistent SVG icons |
| **Class Utilities** | `clsx` & `tailwind-merge` | Safe dynamic class merging and conditional styling |
| **Code Quality & Linting** | Oxlint `v1.79.0` | Next-gen high-speed Rust-based code linter |

---

## 🚀 Key Modules & Capabilities

### 1. 🔍 Primary Workspace
- **Dashboard (`DashboardView`)**: High-level executive overview with metrics, active case feeds, enforcement priority queues, and quick action shortcuts.
- **Guided New Inspection (`NewInspectionWorkflow`)**: Step-by-step wizard guiding officers through commodity category selection, package scanning, and preliminary rule applicability setup.
- **Scan Package (`CaptureScreen`)**: Multi-angle camera stream viewport with real-time bounding box segmentation and OCR capture controls.
- **Compliance X-Ray (`ComplianceXRay`)**: Interactive visual inspection canvas displaying color-coded bounding boxes (Compliant, Non-Compliant, Needs Review), rule citations, legal limits, and confidence metrics overlaid directly on high-res package imagery.
- **Case Management (`CaseManagementView`)**: Filterable registry of all active, closed, and flagged inspection cases with status badges and officer assignments.

### 2. ⚡ Inspection & Verification Workspace
- **Structured OCR Workspace (`DeclarationWorkspace`)**: Side-by-side extraction interface for mandatory declarations (Net Quantity, MRP, Date of Manufacture, Country of Origin, Batch Number, Customer Care details) with manual override and bilingual verification.
- **Applicability Engine (`ApplicabilityEngineView`)**: Dynamic rule evaluator evaluating statutory clauses based on commodity types, imported status, institutional packaging exemptions, and packaging dimensions.
- **Font & PDP Analysis (`FontPdpAnalysisView`)**: Automated measurement of Principal Display Panel area, font height thresholds relative to surface area, contrast ratios, and text legibility metrics.
- **Product vs Online Listing (`EcommerceComparisonView`)**: Audit tool comparing physical packaging declarations against e-commerce PDP listings (e.g., Amazon, Flipkart, Blinkit, Instamart) to identify online consumer misdeclarations.
- **Officer Review (`HumanVerificationView`)**: Human-in-the-loop verification portal allowing legal officers to confirm findings, leave officer notes, approve legal notices, or trigger rescans.

### 3. 📊 Intelligence, Records & Governance
- **Inspection Reports (`InspectionReportView`)**: Official legal notice generator producing printable/exportable statutory inspection certificates and formal violation notices under the Legal Metrology Act.
- **Evidence Vault (`EvidenceVaultView`)**: Secure, immutable evidence repository recording digital signatures, capture timestamps, device identifiers, and SHA-256 hashes for judicial admissibility.
- **Manufacturer Intelligence (`ManufacturerIntelligenceView`)**: Comprehensive profiling of manufacturers and brands, compliance scores, recurring violation patterns, and historical audit timelines.
- **Geographic Heatmap (`HeatmapView`)**: Spatial mapping of non-compliance hotspots across states, districts, and retail markets.
- **Compliance Analytics (`AnalyticsView`)**: Metric breakdown of inspection throughput, rule violation frequencies, commodity trends, and enforcement efficiency.
- **Audit Trail (`AuditTrailView`)**: Immutable system activity log recording every officer action, status shift, data modification, and system login event.
- **Rule Library (`RuleLibraryView`)**: Standardized repository of Legal Metrology Act sections, Packaged Commodity Rules, dimensional threshold tables, and statutory penalty schedules.
- **Offline Field Mode (`OfflineFieldModeView`)**: Field inspection interface supporting offline state caching, local queue management, and automated background sync when connection is restored.

---

## 📁 Directory Structure

```
frontend/
├── public/                     # Static assets (images, logos, static files)
├── src/
│   ├── assets/                 # Application images & icons
│   ├── components/
│   │   ├── common/             # Shared UI components
│   │   │   ├── DemoBadge.tsx               # Demo status indicator badge
│   │   │   ├── GlobalSearchModal.tsx       # Universal Ctrl+K search modal
│   │   │   ├── Sidebar.tsx                 # Tiered primary navigation drawer
│   │   │   ├── StatusBadge.tsx             # Compliance state indicator badge
│   │   │   └── TopBar.tsx                  # Global header & system control bar
│   │   └── views/              # Main application views & feature screens
│   │       ├── AnalyticsView.tsx
│   │       ├── ApplicabilityEngineView.tsx
│   │       ├── AuditTrailView.tsx
│   │       ├── AuthView.tsx
│   │       ├── CaptureScreen.tsx
│   │       ├── CaseManagementView.tsx
│   │       ├── ComplianceXRay.tsx
│   │       ├── DeclarationWorkspace.tsx
│   │       ├── EcommerceComparisonView.tsx
│   │       ├── EvidenceVaultView.tsx
│   │       ├── FontPdpAnalysisView.tsx
│   │       ├── HeatmapView.tsx
│   │       ├── HumanVerificationView.tsx
│   │       ├── InspectionReportView.tsx
│   │       ├── ManufacturerIntelligenceView.tsx
│   │       ├── NewInspectionWorkflow.tsx
│   │       ├── OfflineFieldModeView.tsx
│   │       ├── RuleEngineView.tsx
│   │       ├── RuleLibraryView.tsx
│   │       ├── ScannerProcessing.tsx
│   │       └── SettingsView.tsx
│   ├── data/                   # Mock datasets & demo case data
│   │   └── mockData.ts
│   ├── types/                  # TypeScript interface definitions
│   │   └── index.ts
│   ├── App.css                 # Custom application component styles
│   ├── App.tsx                 # Root application component & layout shell
│   ├── index.css               # Base Tailwind CSS v4 import & global styles
│   └── main.tsx                # React DOM entry point
├── .gitignore
├── .oxlintrc.json              # Oxlint linting configuration
├── index.html                  # HTML5 document root
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # Root TypeScript configuration
├── tsconfig.app.json           # Application TypeScript compiler options
├── tsconfig.node.json          # Vite node setup TypeScript configuration
└── vite.config.ts              # Vite bundle & plugin configuration
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js**: `v18.0.0` or higher (Recommended: `v20+`)
- **Package Manager**: `npm` (comes with Node.js) or `yarn` / `pnpm`

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install all project dependencies:
   ```bash
   npm install
   ```

---

## 💻 Development & Build Commands

| Command | Action | Description |
| :--- | :--- | :--- |
| `npm run dev` | **Start Dev Server** | Launches Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173` |
| `npm run build` | **Production Build** | Runs TypeScript type checking (`tsc -b`) and builds production assets into `dist/` |
| `npm run preview` | **Preview Build** | Locally serves the built production bundle for testing |
| `npm run lint` | **Run Oxlint** | Performs fast static code analysis & linting using Oxlint |

---

## ⌨️ Universal Keyboard Shortcuts & Controls

- **`Ctrl + K` / `Cmd + K`**: Opens the **Global Universal Search Modal** from anywhere in the application to search cases, rules, manufacturers, or jump directly to any view.
- **Offline Toggle**: Use the header control bar or Offline Field Mode view to simulate remote field operations with local data caching.
- **Mobile Menu**: Responsive drawer menu accessible via hamburger button on smaller viewports.

---

## 🎨 Design System & Theme Principles

- **Primary Slate Palette**: Deep dark slate sidebar (`#0B192C`), slate workspace canvas (`#F8FAFC`), crisp border contrasts for high clarity in field environments.
- **Compliance Visual Indicators**:
  - 🟢 **COMPLIANT**: Green status badge & bounding box (`#10B981`)
  - 🔴 **POTENTIAL_NON_COMPLIANCE**: Red status badge & bounding box (`#EF4444`)
  - 🟡 **NEEDS_HUMAN_VERIFICATION**: Amber status badge & bounding box (`#F59E0B`)
- **Typography**: Clean system sans-serif font stack optimized for tabular inspection data, bilingual Hindi/English declarations, and statutory compliance reading.

---

## 📜 License & Project Context

Developed for **SIH 2026 / Legal Metrology Hackathon Project (SIH26034)**.  
All Rights Reserved © 2026 METROSCAN Compliance Systems.
