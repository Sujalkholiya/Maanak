# Maanak Frontend — Legal Metrology Inspection & Enforcement Portal

The frontend application for **Maanak**, an AI-powered Legal Metrology compliance inspection platform designed for enforcement officers, legal analysts, and regulatory authorities. It delivers a modern, high-performance web interface for package scanning, automated declaration review, statutory applicability analysis, font and PDP verification, case management, digital evidence logging, and e-commerce compliance tracking.

---

## 1. Overview & System Features

- **Executive & Enforcement Dashboards**: Real-time visualization of compliance metrics, inspection queues, risk distributions, violation trends, and officer performance.
- **Multi-Stage Inspection Flow**:
  - **New Inspection & Package Scan**: Multi-angle image capture (front, back, sides) with OCR processing and bounding-box overlay.
  - **Compliance X-Ray**: Interactive visual inspection mapping detected text bounding boxes directly over package label images with instant compliance classification badges.
  - **Declaration Workspace**: Side-by-side verification of mandatory declarations (MRP, Net Quantity, Batch, Mfg Date, Expiry, Manufacturer Address, Consumer Care, Country of Origin, Unit Sale Price). Allows manual correction and confidence scoring.
  - **Statutory Applicability Engine**: Visualized decision tree evaluating applicable clauses under the Legal Metrology (Packaged Commodities) Rules, 2011, accounting for institutional exemptions (Rule 3(c)) and imported goods (Rule 6(1)(ma)).
  - **Font & PDP Analysis**: Area calculation for the Principal Display Panel (PDP) and statutory minimum numeral/letter height compliance checking under Rule 9.
  - **Human-in-the-Loop Verification**: Officer sign-off screen to confirm findings, attach notes, request rescans, or initiate enforcement notices.
- **Case Management Vault**: End-to-end inspection lifecycle tracking with priority tags, status pipelines, search, and filtration.
- **Digital Evidence Vault**: Cryptographically indexed, tamper-evident repository for high-resolution label photographs, barcode scans, and OCR audits.
- **Legal Notice & Report Generator**: Automated generation of statutory notices (e.g., Section 39 / Rule 32 notices of non-compliance) and audit reports.
- **E-Commerce & Market Intelligence**: Comparison of physical label declarations against e-commerce listings (Amazon, Flipkart, Blinkit) to identify digital listing discrepancies.
- **Field Offline Mode & Sync**: Local state queue allowing field officers to conduct inspections in low-connectivity environments with automatic background synchronization.

---

## 2. Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 (`^19.2.8`) | Reactive user interface and component architecture |
| **Language** | TypeScript (`~6.0.2`) | Static type safety across cases, rules, and UI state |
| **Build Tool** | Vite 8 (`^8.2.2`) | Fast hot module replacement (HMR) and optimized build bundling |
| **Routing** | React Router v7 (`^7.18.3`) | Declarative browser routing, nested routes, and lazy-loaded code splitting |
| **Styling** | Tailwind CSS v4 (`^4.3.3`) | Utility-first CSS engine with dark slate aesthetic |
| **Icons** | Lucide React (`^1.42.0`) | Consistent UI icon set |
| **Class Utilities** | `clsx` & `tailwind-merge` | Dynamic and collision-free CSS class composition |
| **Linter** | Oxlint (`^1.79.0`) | Blazing-fast JavaScript/TypeScript linting |

---

## 3. Project Structure

```
frontend/
├── index.html                 # Single-page application root HTML
├── package.json               # Frontend dependencies, scripts, and build metadata
├── vite.config.ts             # Vite configuration with React & Tailwind plugins
├── tsconfig.json              # TypeScript root configuration
├── public/                    # Static assets, logos, and mock images
└── src/
    ├── main.tsx               # App entry point (DOM root mounting)
    ├── App.tsx                # App shell wrapping providers with router
    ├── app/
    │   ├── providers/         # Global React context providers
    │   │   ├── AppProviders.tsx   # Provider composition tree
    │   │   ├── CaseContext.tsx    # Active inspection case state & dispatch
    │   │   └── ToastContext.tsx   # Global toast notifications
    │   └── router/
    │       └── index.tsx      # Centralized React Router configuration & route guards
    ├── components/
    │   ├── common/            # Reusable UI widgets (Sidebar, TopBar, StatusBadge, Toast, Modal)
    │   └── views/             # Composite view scaffolding components
    ├── data/
    │   └── mockData.ts        # Comprehensive mock dataset for cases, rules, and metrics
    ├── features/              # Modular domain feature components
    │   ├── auth/              # Officer login & authentication components
    │   ├── cases/             # Case management tables, filters, and cards
    │   ├── compliance/        # Compliance checkcards, rule status lists
    │   ├── dashboard/         # Metric cards, inspection queues, violation charts
    │   ├── evidence/          # Media gallery, EXIF inspection, chain of custody
    │   ├── inspection/        # Scanning UI, bounding box canvas, declaration forms
    │   ├── intelligence/      # Heatmaps, e-commerce scrapers, manufacturer index
    │   ├── offline/           # Offline queue manager & sync indicators
    │   ├── reports/           # Notice generators, report preview, export tools
    │   └── settings/          # System configuration, officer profile, ruleset toggles
    ├── hooks/                 # Custom reusable hooks (shortcuts, case actions, toasts)
    ├── layouts/               # Shell layouts (`MainLayout`, `AuthLayout`)
    ├── pages/                 # Lazy-loaded route boundary pages
    │   ├── auth/
    │   ├── cases/
    │   ├── dashboard/
    │   ├── evidence/
    │   ├── inspection/
    │   ├── intelligence/
    │   ├── reports/
    │   ├── rules/
    │   ├── offline/
    │   └── settings/
    ├── services/              # API clients & data services (`caseService.ts`, `syncService.ts`)
    └── types/                 # Shared TypeScript interface definitions
```

---

## 4. Route Map

| Route Path | Page Component | Purpose |
| :--- | :--- | :--- |
| `/` | `DashboardPage` | Executive compliance metrics and active case feed |
| `/login` | `LoginPage` | Enforcement officer login and authentication |
| `/inspection/new` | `NewInspectionPage` | Initiate fresh commodity inspection session |
| `/inspection/scan` | `ScanPackagePage` | Multi-side image capture and label upload |
| `/inspection/xray` | `ComplianceXRayPage` | Bounding box visualizer on label imagery |
| `/inspection/declarations` | `DeclarationWorkspacePage` | OCR extraction comparison & field verification |
| `/inspection/applicability` | `ApplicabilityEnginePage` | Rule applicability matrix & exemption evaluation |
| `/inspection/font-pdp` | `FontPdpAnalysisPage` | PDP dimensions & font height compliance tool |
| `/inspection/verify` | `HumanVerificationPage` | Final officer review and enforcement decision |
| `/cases` | `CasesPage` | Comprehensive inspection case ledger |
| `/evidence` | `EvidenceVaultPage` | Digital evidence repository & audit trails |
| `/reports` | `ReportsPage` | Inspection certificates & statutory notices |
| `/intelligence` | `AnalyticsPage` | Compliance trend analytics and forecasting |
| `/intelligence/ecommerce`| `EcommerceComparisonPage` | Physical vs. e-commerce listing verification |
| `/intelligence/heatmaps` | `HeatmapPage` | Geographic violation concentration maps |
| `/rules` | `RuleLibraryPage` | Legal Metrology rulebook explorer & clauses |
| `/offline` | `OfflineQueuePage` | Pending field scans awaiting network sync |
| `/settings` | `SettingsPage` | User preferences, API config, and system rules |

---

## 5. Development & Build Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Available Scripts

```bash
# Navigate to the frontend directory
cd Maanak/frontend

# Install dependencies
npm install

# Start local development server with HMR (typically at http://localhost:5173)
npm run dev

# Compile TypeScript and build for production
npm run build

# Run linter checks
npm run lint

# Preview the production build locally
npm run preview
```

---

## 6. Backend Integration

The frontend communicates with the **Maanak Backend** (running by default at `http://localhost:3000`).
The communication endpoints include:
- `POST /ocr`: Ingest label photos for OCR parsing and bounding box extraction.
- `POST /rules/evaluate`: Evaluate declaration payloads against statutory rules.
- `POST /applicability/evaluate`: Query dynamic statutory clauses and exemptions.
- `GET/POST/PUT /cases`: Synchronize inspection records and officer determinations.
