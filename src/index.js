const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const uploadRouter = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "court-record-validator-api" });
});

app.use("/api/upload", uploadRouter);

app.use("/uploads", express.static(path.join(__dirname, "..", 
"uploads")));

app.listen(PORT, () => {
  console.log(`Court Record Validator API running on 
http://localhost:${PORT}`);
});

