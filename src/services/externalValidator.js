const axios = require("axios");

function localValidation(metadata) {
  const issues = [];

  if (!metadata.caseId) {
    issues.push("Missing caseId.");
  }

  if (!metadata.defendantName || metadata.defendantName === "Unknown") {
    issues.push("Defendant name is unknown.");
  }

  if (metadata.status === "UNKNOWN") {
    issues.push("Case status is not set.");
  }

  const isValid = issues.length === 0;

  return {
    isValid,
    issues,
    riskScore: isValid ? 10 : 70,
    validatedAt: new Date().toISOString(),
    validator: "local-mock-validator"
  };
}

async function validateRecord(parsedRecord) {
  const apiUrl = process.env.VALIDATION_API_URL;

  if (apiUrl && apiUrl.trim() !== "") {
    try {
      const response = await axios.post(apiUrl, {
        type: parsedRecord.type,
        metadata: parsedRecord.metadata
      });

      return {
        ...response.data,
        via: "external"
      };
    } catch (err) {
      console.error("External validation failed, falling back to local:", 
err.message);
      return {
        ...localValidation(parsedRecord.metadata),
        via: "local-fallback"
      };
    }
  }

  return {
    ...localValidation(parsedRecord.metadata),
    via: "local-only"
  };
}

module.exports = {
  validateRecord
};

