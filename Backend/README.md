# Maanak Backend — Legal Metrology Inspection Engine

A robust, enterprise-grade Node.js and Express backend powering the **Maanak** Legal Metrology compliance and inspection platform. The backend provides automated OCR extraction, a deterministic statutory rule evaluation engine, dynamic legal applicability analysis, case management workflows, and digital evidence asset management under the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011** (with latest 2024–2026 amendments).

---

## 1. Overview & Core Capabilities

- **Intelligent OCR Extraction**: Ingests packaged commodity label images and extracts statutory declarations (MRP, Net Quantity, Batch Number, Manufacturing Date, Expiry Date, Manufacturer Address, Consumer Care details, Country of Origin, and Unit Sale Price) using Tesseract.js enhanced with domain-specific regex heuristics and confidence scoring.
- **Deterministic Rule Evaluation Engine**: Evaluates mandatory package declarations against statutory provisions under Rule 6(1)(a)-(n) of the Legal Metrology (Packaged Commodities) Rules, 2011. Calculates compliance status (`COMPLIANT`, `POTENTIAL_NON_COMPLIANCE`, `NEEDS_HUMAN_VERIFICATION`) with legal clauses and statutory penalties.
- **Statutory Applicability Engine**: Dynamically assesses which statutory clauses apply to a given package based on commodity classification, trade channel (retail vs. institutional under Rule 3(c)), package size thresholds (e.g., >50g/50ml for USP), and domestic vs. imported origins (Rule 6(1)(ma)).
- **Inspection Case Management**: Comprehensive RESTful state machine supporting case creation, field inspection updates, officer notes, evidence tracking, and formal verification decisions (`CONFIRMED`, `REJECTED`, `RESCAN_REQUESTED`).
- **Cloud Evidence & Media Storage**: Integrated with ImageKit for secure, cloud-hosted storage of label photos, package angles, and digital evidence vaults.
- **Authentication & Security**: Secure token-based authentication using JSON Web Tokens (JWT), HTTP-only cookies, and bcryptjs credential hashing.

---

## 2. Tech Stack & Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js (v18+) & Express 5 (`^5.2.1`) | HTTP server, REST routing, and middleware pipeline |
| **Database & ODM** | MongoDB & Mongoose (`^9.7.4`) | Document persistence, schemas for cases, users, images, and products |
| **OCR & Vision** | Tesseract.js (`^5.x` / `eng.traineddata`) | Optical Character Recognition for package label scanning |
| **Asset Storage** | `@imagekit/nodejs` (`^7.9.1`) | Cloud media upload, transformation, and CDN distribution |
| **File Handling** | Multer (`^2.2.0`) | In-memory multipart/form-data upload handling |
| **Authentication** | `jsonwebtoken` & `bcryptjs` | JWT access control and password hashing |
| **Utilities** | `dotenv`, `cookie-parser` | Configuration management and cookie parsing |

---

## 3. Architecture & Project Structure

```
Backend/
├── eng.traineddata            # Tesseract OCR offline language training data
├── package.json               # Backend dependencies and scripts
├── server.js                  # Application entry point & server bootstrap
├── .env                       # Environment variables (MongoDB, ImageKit, JWT)
└── src/
    ├── app.js                 # Express app initialization, CORS & route mounting
    ├── Controllers/           # Business logic & controller handlers
    │   ├── applicabilityController.js  # Statutory applicability evaluation logic
    │   ├── auth.controller.js          # User registration & JWT login
    │   ├── case.js                     # Inspection case CRUD & status transitions
    │   ├── home.js                     # System health & root endpoint
    │   ├── image.controller.js         # ImageKit cloud media upload & retrieval
    │   ├── ocrController.js            # OCR pipeline & declaration extraction regexes
    │   ├── product.controller.js       # Product registry management
    │   └── ruleController.js           # Legal Metrology statutory rule evaluation
    ├── Database/
    │   └── database.js        # Mongoose MongoDB connection handler
    ├── Models/                # Mongoose database schemas
    │   ├── case.js            # Case model (declarations, bounding boxes, findings)
    │   ├── image.model.js     # Image asset metadata schema
    │   ├── product.model.js   # Product catalog schema
    │   └── user.model.js      # User identity & credentials schema
    ├── routes/                # Express routing layer
    │   ├── applicability.routes.js
    │   ├── auth.routes.js
    │   ├── case.js
    │   ├── home.js
    │   ├── image.routes.js
    │   ├── ocrRoute.js
    │   ├── product.routes.js
    │   └── rule.routes.js
    └── Services/
        └── Storage.service.js # ImageKit integration client configuration
```

---

## 4. API Reference

### 4.1 Health Check
- `GET /`
  - Returns backend service status and welcoming ping.

### 4.2 OCR & Label Extraction
- `POST /ocr`
  - **Payload**: `multipart/form-data` with `image` file field.
  - **Description**: Runs Tesseract OCR on the uploaded package label image. Cleans output, parses mandatory declarations (MRP, Net Quantity, Batch, Mfg Date, Expiry, Manufacturer, Consumer Care, Country of Origin, Unit Sale Price), and returns structured declarations with confidence scores and bounding boxes.

### 4.3 Statutory Rule Evaluation
- `POST /rules/evaluate`
  - **Body**:
    ```json
    {
      "declarations": [
        { "fieldId": "f-mrp", "value": "₹150.00", "confidence": 95 },
        { "fieldId": "f-net-qty", "value": "500 g", "confidence": 92 }
      ],
      "applicability": {},
      "category": "Food & Beverages"
    }
    ```
  - **Description**: Tests declarations against Legal Metrology Rules:
    - `RULE-6-1-A`: Manufacturer / Packer details & complete postal address.
    - `RULE-6-1-B`: Generic or common name of commodity.
    - `RULE-6-1-C`: Net Quantity in standard SI metric units (g, kg, ml, l).
    - `RULE-6-1-D`: Month and year of manufacture / packing / import.
    - `RULE-6-1-DA`: Unit Sale Price (USP) per g/ml for packages above 50g/50ml.
    - `RULE-6-1-E`: Maximum Retail Price (MRP) inclusive of all taxes.
    - `RULE-6-1-MA`: Country of origin for imported goods.
    - `RULE-6-1-N`: Consumer care contact (name, phone, email, address).
  - **Response**: List of rule evaluations with status, rationale, legal clause, and penalty severity.

### 4.4 Applicability Engine
- `POST /applicability/evaluate`
  - **Body**:
    ```json
    {
      "productName": "Refined Almond Oil",
      "category": "Edible Oils",
      "isImported": false,
      "isInstitutional": false,
      "declarations": []
    }
    ```
  - **Description**: Computes mandatory statutory requirements, potential exemptions (e.g., Rule 3(c) for institutional consumers), and origin-based rules (Rule 6(1)(ma)).

### 4.5 Case Management
- `GET /cases`: Retrieve all inspection cases (supports sorting & filters).
- `GET /cases/:id`: Retrieve single case by MongoDB `_id` or unique `caseId` (e.g., `CASE-2026-0891`).
- `POST /cases`: Create a new inspection case.
- `PUT /cases/:id`: Update case fields, status, or officer notes.
- `PUT /cases/:id/inspection`: Update live inspection data, findings counts, and bounding boxes.
- `PUT /cases/:id/verification`: Record legal officer verification decision (`CONFIRMED`, `REJECTED`, `RESCAN_REQUESTED`).
- `DELETE /cases/:id`: Remove an inspection case.

### 4.6 Media & Evidence Storage
- `POST /api/image/upload`: Upload up to 6 inspection label images (`multipart/form-data`) to ImageKit.
- `GET /api/image/all`: Fetch all uploaded evidence assets.

### 4.7 Authentication
- `POST /api/auth/register`: Register an inspection officer or admin account.
- `POST /api/auth/login`: Authenticate credentials, issue JWT token, and set HTTP-only cookie.

---

## 5. Environment Configuration

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=3000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/maanak?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here

# ImageKit Configuration (for digital evidence vault)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint_id
```

---

## 6. Installation & Execution

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- MongoDB instance running locally or on MongoDB Atlas

### Commands

```bash
# Navigate to Backend directory
cd Maanak/Backend

# Install dependencies
npm install

# Start server in development mode (with nodemon auto-restart)
npm run dev

# Start server in production mode
npm start
```

The server will initialize on port `3000` (default) or the port specified in `.env`.
