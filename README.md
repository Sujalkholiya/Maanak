# Maanak — Legal Metrology Inspection & Compliance Platform

> **An AI-powered, end-to-end inspection, verification, and enforcement suite for packaged commodity compliance under the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011.**

[![Frontend: React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Vite%208-blue)](./frontend)
[![Backend: Express 5](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205%20%7C%20MongoDB-green)](./Backend)
[![Compliance: LM Rules 2011](https://img.shields.io/badge/Compliance-Legal%20Metrology%20Rules%202011-orange)](#statutory-scope)

---

## 1. System Overview

**Maanak** is a specialized regulatory compliance platform designed for Legal Metrology Officers (LMOs), enforcement agencies, and quality assurance inspectors. 

Pre-packaged commodities in commerce are required by law to carry clear, unambiguous, and standard declarations on their labels. Maanak automates the inspection process by combining **Optical Character Recognition (OCR)**, **deterministic statutory rule engines**, **PDP (Principal Display Panel) geometric analysis**, and **human-in-the-loop verification** into a single workflow.

### Key Capabilities
- **Automated Label Inspection**: Instant extraction of mandatory declarations (MRP, Net Quantity, Mfg/Expiry Dates, Batch Number, Country of Origin, Consumer Care, and Unit Sale Price).
- **Compliance X-Ray**: Interactive visual overlays bounding detected text on physical packages with real-time compliance status indicators.
- **Deterministic Legal Engine**: Direct evaluation against statutory clauses under the **Legal Metrology (Packaged Commodities) Rules, 2011** (Rules 6, 9, 32, etc.) without black-box hallucinations.
- **Dynamic Applicability Evaluator**: Tailors required declarations based on commodity category, trade channels (institutional vs. retail under Rule 3(c)), net quantity thresholds, and imported vs. domestic origins.
- **E-Commerce Scrutiny**: Cross-checks physical label declarations against online e-commerce platform listings (Amazon, Blinkit, Flipkart).
- **Tamper-Evident Evidence Vault**: Secure, chain-of-custody logging of packaging evidence, audit trails, and photographic proof for enforcement proceedings.
- **Statutory Notice Generation**: Auto-generates formal notices under Section 39 / Rule 32 for identified non-compliances.

---

## 2. Architecture & Data Flow

```
                      +------------------------------------------+
                      |         Physical Package Label           |
                      +------------------------------------------+
                                           |
                                           v
+----------------------------------------------------------------------------------+
|                             Frontend (React 19 + Vite)                           |
|  - New Inspection & Package Scanner (/inspection/scan)                          |
|  - Compliance X-Ray Bounding Visualizer (/inspection/xray)                       |
|  - Declaration Workspace & Manual Correction (/inspection/declarations)          |
|  - Statutory Applicability Engine (/inspection/applicability)                    |
|  - Font & Principal Display Panel (PDP) Analysis (/inspection/font-pdp)          |
|  - Officer Verification & Enforcement Sign-off (/inspection/verify)             |
|  - Case Management, Evidence Vault & Analytics Dashboard                         |
+----------------------------------------------------------------------------------+
                                  |                 ^
             REST Requests & JSON |                 | Structured Results & Bounding Boxes
                                  v                 |
+----------------------------------------------------------------------------------+
|                            Backend (Express 5 + Node.js)                         |
|  - REST API Routing & Auth Middleware (JWT, Cookie-Parser)                       |
|  - OCR Pipeline (/ocr) -> Tesseract.js Engine + Metric/Date Regex Heuristics     |
|  - Statutory Rule Engine (/rules/evaluate) -> Rule 6(1) Compliance Checks        |
|  - Applicability Engine (/applicability/evaluate) -> Statutory Exemptions Matrix |
|  - Case Lifecycle Controller (/cases) -> Status Transitions & Notes Storage      |
|  - Cloud Storage Adapter (/api/image) -> ImageKit CDN Evidence Management        |
+----------------------------------------------------------------------------------+
                                  |
               Persistent Storage v
+----------------------------------------------------------------------------------+
|                                MongoDB Database                                  |
|  - Collections: Cases, Users, Images, Products, Audit Logs                       |
+----------------------------------------------------------------------------------+
```

---

## 3. Repository Structure

This repository is organized as a monorepo containing both the server-side inspection engine and the client-side portal:

```
Maanak/
├── Backend/                 # Express 5 REST API & OCR evaluation engine
│   ├── eng.traineddata      # Offline Tesseract language dataset
│   ├── package.json         # Node.js dependencies & scripts
│   ├── server.js            # Server entry point & MongoDB initialization
│   ├── src/
│   │   ├── app.js           # Express app setup, CORS, route mounts
│   │   ├── Controllers/     # Rule evaluator, OCR parsing, Case management
│   │   ├── Database/        # MongoDB connection configuration
│   │   ├── Models/          # Mongoose schemas (Case, User, Image, Product)
│   │   ├── routes/          # Express route definitions
│   │   └── Services/        # ImageKit cloud media service
│   └── README.md            # Detailed Backend documentation
│
├── frontend/                # React 19 + TypeScript + Vite web portal
│   ├── index.html           # Single-page application entry point
│   ├── package.json         # React dependencies & scripts
│   ├── vite.config.ts       # Vite configuration with Tailwind CSS v4
│   ├── src/
│   │   ├── main.tsx         # React root mounting
│   │   ├── App.tsx          # App providers & router wrapping
│   │   ├── app/             # Router definition and Context Providers
│   │   ├── components/      # Common widgets (Sidebar, TopBar, Modals, Badges)
│   │   ├── features/        # Business domain modules (inspection, cases, rules)
│   │   ├── pages/           # Route boundary pages (Lazy-loaded)
│   │   └── services/        # Frontend API client services
│   └── README.md            # Detailed Frontend documentation
│
└── README.md                # Root project documentation (this file)
```

---

## 4. Statutory Scope & Legal Metrology Rules

The platform directly enforces mandatory requirements codified in Indian legal frameworks:

| Statutory Provision | Requirement Description | Engine Enforcement Logic |
| :--- | :--- | :--- |
| **Rule 6(1)(a)** | Manufacturer / Packer Name & Full Address | Validates corporate identity, premise address, city, state, and PIN code. |
| **Rule 6(1)(b)** | Generic or Common Name of Commodity | Verifies commodity nomenclature clarity on Principal Display Panel. |
| **Rule 6(1)(c)** | Net Quantity in Standard Metric Units | Enforces SI units (`g`, `kg`, `ml`, `l`, `pcs`) and standard unit packaging rules. |
| **Rule 6(1)(d)** | Month & Year of Manufacture / Packing / Import | Validates date formatting (`MM/YYYY` or `MM/YY`) and chronology checks. |
| **Rule 6(1)(da)** | Unit Sale Price (USP) | Required for commodities packed above 50g / 50ml (e.g., `₹0.30 per g`). |
| **Rule 6(1)(e)** | Maximum Retail Price (MRP) | Enforces INR currency symbol (`₹`), decimal formatting, and "incl. of all taxes". |
| **Rule 6(1)(ma)** | Country of Origin | Mandatory for all imported packaged consignments. |
| **Rule 6(1)(n)** | Consumer Care Identification | Enforces presence of contact person, helpline telephone, email, and postal address. |
| **Rule 3(c)** | Institutional Consumer Exemption | Identifies commercial/industrial exemptions where retail pricing rules differ. |
| **Rule 9** | Principal Display Panel (PDP) & Numeral Height | Minimum font height thresholds based on container area/volume. |

---

## 5. Quickstart Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: A running local instance (`mongodb://localhost:27017/maanak`) or MongoDB Atlas URI

---

### Step 1: Clone and Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd Maanak/Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file inside `Backend/`:
   ```env
   PORT=3000
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/maanak?retryWrites=true&w=majority
   JWT_SECRET=your_secret_jwt_key
   
   # Optional ImageKit credentials for cloud photo storage
   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will boot on `http://localhost:3000`.*

---

### Step 2: Configure and Start Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Maanak/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 6. Detailed Module Documentation

For deep technical dives into individual modules, refer to:
- [**Frontend Architecture & UI Reference**](./frontend/README.md)
- [**Backend API & Rule Engine Reference**](./Backend/README.md)
