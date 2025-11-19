const express = require("express");
const multer = require("multer");
const path = require("path");
const { parseFile } = require("../services/fileParser");
const { validateRecord } = require("../services/externalValidator");
const fs = require("fs");
const dbPath = path.join(__dirname, "..", "data", "database.json");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 
1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowed = [".pdf", ".json"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF and JSON files are allowed."));
    }
    cb(null, true);
  }
});

// Simple JSON “database”
function loadDb() {
  if (!fs.existsSync(dbPath)) {
    return { records: [] };
  }
  const content = fs.readFileSync(dbPath, "utf8") || '{"records":[]}';
  return JSON.parse(content);
}

function saveDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// POST /api/upload/file
router.post("/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const parsed = await parseFile(req.file);
    const validation = await validateRecord(parsed);

    const db = loadDb();
    const record = {
      id: parsed.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      type: parsed.type,
      metadata: parsed.metadata,
      validation,
      uploadedAt: new Date().toISOString()
    };

    db.records.push(record);
    saveDb(db);

    res.status(201).json({
      message: "File uploaded and validated successfully.",
      record
    });
  } catch (err) {
    console.error("Error in /api/upload/file:", err);
    res.status(500).json({
      message: "Failed to process file.",
      error: err.message
    });
  }
});

// GET /api/upload/records
router.get("/records", (req, res) => {
  const db = loadDb();
  res.json(db.records);
});

// GET /api/upload/records/:id
router.get("/records/:id", (req, res) => {
  const db = loadDb();
  const found = db.records.find(r => r.id === req.params.id);
  if (!found) {
    return res.status(404).json({ message: "Record not found." });
  }
  res.json(found);
});

module.exports = router;

