# **Court Record Validator API (Node.js)**

A Node.js + Express API for uploading **court record files (JSON or PDF)**, performing **mock parsing + validation**, and storing results for review.

This project complements the **.NET + Python Court → FDLE Pipeline** by simulating the *real-time* validation side of a justice-system workflow.

---

## **Tech Stack**

* **Node.js** + **Express**
* **Multer** (file uploads)
* **UUID** (record IDs)
* **Axios** (optional external API validation)
* **dotenv** (environment config)
* **Morgan** (logging)
* Simple JSON "database" (`src/data/database.json`)

---

## **Project Structure**

```
court-record-validator-api/
│
├── src/
│   ├── index.js                # Express server entry
│   ├── routes/
│   │   └── upload.js           # Upload & record endpoints
│   ├── services/
│   │   ├── fileParser.js       # Simulated PDF/JSON parsing
│   │   └── externalValidator.js# Mock external validation logic
│   └── data/
│       └── database.json       # Simple JSON-based data storage
│
├── uploads/                    # Uploaded files stored here
├── .env
├── package.json
└── README.md
```

---


### **1. Install dependencies**

```bash
npm install
```

### **2. Setup environment**

Create `.env` in the project root:

```
PORT=4000
VALIDATION_API_URL=
```

If `VALIDATION_API_URL` is blank, the API will use a built-in **local mock validator**.

### **3. Start the development server**

```bash
npm run dev
```

You should see:

```
Court Record Validator API running on http://localhost:4000
```

---

## **API Endpoints**

### **Health Check**

**GET** `/health`

**Response:**

```json
{
  "status": "ok",
  "service": "court-record-validator-api"
}
```

---

### **Upload & Validate a Court Record File**

**POST** `/api/upload/file`
Content-Type: `multipart/form-data`
Form field: `file` (PDF or JSON)

Example JSON upload:

```json
{
  "caseId": "COURT-2025-00123",
  "defendantName": "Jane Doe",
  "county": "Orange",
  "status": "OPEN",
  "source": "CountyCourt"
}
```

**Success Response (201):**

```json
{
  "message": "File uploaded and validated successfully.",
  "record": {
    "id": "uuid",
    "fileName": "1732057920000-sample_case.json",
    "originalName": "sample_case.json",
    "type": "JSON_CASE",
    "metadata": { ... },
    "validation": {
      "isValid": true,
      "issues": [],
      "riskScore": 10,
      "validatedAt": "2025-01-01T10:00:00.000Z",
      "validator": "local-mock-validator",
      "via": "local-only"
    },
    "uploadedAt": "2025-01-18T15:00:00.000Z"
  }
}
```

---

### **Get All Processed Records**

**GET** `/api/upload/records`

Returns an array of processed uploads.

---

### **Get a Single Record By ID**

**GET** `/api/upload/records/:id`

If no record exists with that ID, returns `404`.

---

## **Postman Collection**

A ready-to-use Postman collection is available at:

```
postman/CourtRecordValidator.postman_collection.json
```

Import it into Postman to test:

* Health Check
* Upload File
* List Records
* Get Record by ID


## Demonstrated skills:

* Node.js backend development
* File upload handling
* JSON + PDF parsing simulation
* External API integration patterns
* Validation and data quality scoring
* Storing and retrieving processed uploads
* Clean REST API design



## **What I Want to Do Next**

* PDF text extraction using `pdf-parse`
* SQLite database instead of JSON file
* JWT authentication
* Dockerfile + Docker Compose
* Swagger API documentation
* Front-end (React) UI for uploading files
