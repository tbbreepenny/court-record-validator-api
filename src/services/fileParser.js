const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function parseFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".json") {
    const content = fs.readFileSync(file.path, "utf8");
    let parsedJson;
    try {
      parsedJson = JSON.parse(content);
    } catch (e) {
      throw new Error("Invalid JSON file.");
    }

    const id = parsedJson.caseId || uuidv4();

    return {
      id,
      type: "JSON_CASE",
      metadata: {
        source: parsedJson.source || "CountyCourt",
        caseId: parsedJson.caseId || id,
        defendantName: parsedJson.defendantName || "Unknown",
        status: parsedJson.status || "UNKNOWN",
        county: parsedJson.county || "Unknown",
        raw: parsedJson
      }
    };
  }

  if (ext === ".pdf") {
    const id = uuidv4();
    return {
      id,
      type: "PDF_CASE",
      metadata: {
        source: "UploadedPDF",
        caseId: id,
        defendantName: "Unknown (PDF not parsed)",
        status: "PENDING",
        county: "Unknown",
        note: "PDF parsing is simulated for this demo."
      }
    };
  }

  throw new Error("Unsupported file type.");
}

module.exports = {
  parseFile
};

