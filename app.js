const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { Readable } = require("stream");
const invoiceRoutes = require("./routes/invoicesRoute.js");
const adminRoutes = require("./routes/adminRoute.js");
const ewPolicyRoutes = require("./routes/EwPolicyRoute.js");
const userRoutes = require("./routes/userRoute.js");
const AMCRoutes = require("./routes/AMCRoutes.js");
const BuyBackRoutes = require("./routes/BuyBackRoute.js");
const connectDb = require("./db/mongoConnection");
const { AMCs } = require("./model/AmcModel.js");
const BuyBacks = require("./model/BuyBackModel.js");
http = require("http");

dotenv.config();
const app = express();
const port = process.env.PORT;

cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Delete policies that were rejected more than 1 month ago
    await AMCs.deleteMany({
      policyStatus: "rejected",
      rejectedAt: { $lte: now },
    });
    console.log("Deleted policies that were rejected more than 1 month ago.");

    // Delete policies that have been disabled for more than 1 month
    await BuyBacks.deleteMany({
      isDisabled: true,
      disabledAt: { $lte: oneMonthAgo },
    });
    console.log(
      "Deleted policies that have been disabled for more than 1 month."
    );
  } catch (err) {
    console.error("Error running cron job:", err);
  }
});

async function startServer() {
  // Security middleware first
  app.use(helmet({ crossOriginResourcePolicy: false }));
  
  // CORS should come early to handle preflight OPTIONS requests
  app.use(cors());

  // Debug middleware: Use raw body parser for specific route to capture body BEFORE JSON parsing
  app.use("/api/v1/add-expense-amc", express.raw({ 
    type: "application/json",
    limit: "200mb" 
  }), (req, res, next) => {
    if (req.method === "POST") {
      const contentLength = req.get("content-length");
      const contentType = req.get("content-type");
      const payloadSizeKB = contentLength ? (parseInt(contentLength) / 1024).toFixed(2) : "unknown";
      const payloadSizeMB = contentLength ? (parseInt(contentLength) / (1024 * 1024)).toFixed(2) : "unknown";

      console.log("\n=== REQUEST PAYLOAD DEBUG (BEFORE JSON PARSING) ===");
      console.log("Path:", req.path);
      console.log("Method:", req.method);
      console.log("Content-Length Header:", contentLength, "bytes");
      console.log("Payload Size:", payloadSizeKB, "KB /", payloadSizeMB, "MB");
      console.log("Content-Type:", contentType);
      console.log("Remote IP:", req.ip || req.connection.remoteAddress);

      if (req.body && Buffer.isBuffer(req.body)) {
        const rawBody = req.body;
        const actualSizeKB = (rawBody.length / 1024).toFixed(2);
        const actualSizeMB = (rawBody.length / (1024 * 1024)).toFixed(2);
        
        console.log("Actual Body Size:", rawBody.length, "bytes (", actualSizeKB, "KB /", actualSizeMB, "MB)");
        
        // Try to parse and log JSON content (for debugging)
        try {
          const bodyString = rawBody.toString("utf8");
          const parsedBody = JSON.parse(bodyString);
          
          // Set req.body to parsed JSON for next middleware
          req.body = parsedBody;
          
          const bodyType = typeof parsedBody;
          const bodyIsArray = Array.isArray(parsedBody);
          
          console.log("Body Type:", bodyType);
          console.log("Body Is Array:", bodyIsArray);
          
          if (bodyIsArray && parsedBody.length > 0) {
            console.log("Body Array Length:", parsedBody.length);
            console.log("First Entry Keys:", Object.keys(parsedBody[0] || {}));
            if (parsedBody[0]?.expenses) {
              console.log("First Entry Expenses Count:", parsedBody[0].expenses?.length || 0);
            }
            // Log sample of first entry (truncated to avoid huge logs)
            const sample = JSON.stringify(parsedBody[0]).substring(0, 500);
            console.log("First Entry Sample (first 500 chars):", sample);
          } else if (bodyType === "object") {
            console.log("Body Keys:", Object.keys(parsedBody));
            const sample = JSON.stringify(parsedBody).substring(0, 500);
            console.log("Body Sample (first 500 chars):", sample);
          }
        } catch (parseError) {
          console.error("Could not parse body as JSON:", parseError.message);
          // Log first 500 chars of raw body
          const bodyPreview = rawBody.toString("utf8").substring(0, 500);
          console.log("Raw Body Preview (first 500 chars):", bodyPreview);
          // Don't set req.body, let it remain as buffer for error handling
        }
        
        console.log("=== END PAYLOAD DEBUG (BEFORE JSON PARSING) ===\n");
      } else {
        console.log("Body: null, undefined, or not a buffer");
        console.log("=== END PAYLOAD DEBUG (BEFORE JSON PARSING) ===\n");
      }
    }
    next();
  });
  
  // Body parsers for all other routes (order matters - json first, then urlencoded)
  app.use(express.json({ limit: "200mb" }));
  app.use(express.urlencoded({ limit: "200mb", extended: true }));
  
  // Logging middleware (after body parsers)
  app.use(morgan("common"));

  // Debug middleware to track payload sizes and content
  app.use((req, res, next) => {
    if (req.path === "/api/v1/add-expense-amc" && req.method === "POST") {
      const contentLength = req.get("content-length");
      const contentType = req.get("content-type");
      const payloadSizeKB = contentLength ? (parseInt(contentLength) / 1024).toFixed(2) : "unknown";
      const payloadSizeMB = contentLength ? (parseInt(contentLength) / (1024 * 1024)).toFixed(2) : "unknown";

      console.log("\n=== REQUEST PAYLOAD DEBUG ===");
      console.log("Path:", req.path);
      console.log("Method:", req.method);
      console.log("Content-Length:", contentLength, "bytes");
      console.log("Payload Size:", payloadSizeKB, "KB /", payloadSizeMB, "MB");
      console.log("Content-Type:", contentType);
      console.log("Remote IP:", req.ip || req.connection.remoteAddress);
      
      if (req.body) {
        const bodyType = typeof req.body;
        const bodyIsArray = Array.isArray(req.body);
        const bodyStringLength = JSON.stringify(req.body).length;
        
        console.log("Body Type:", bodyType);
        console.log("Body Is Array:", bodyIsArray);
        console.log("Body Stringified Length:", bodyStringLength, "bytes");
        
        if (bodyIsArray && req.body.length > 0) {
          console.log("Body Array Length:", req.body.length);
          console.log("First Entry Keys:", Object.keys(req.body[0] || {}));
          if (req.body[0]?.expenses) {
            console.log("First Entry Expenses Count:", req.body[0].expenses?.length || 0);
          }
          // Log sample of first entry (truncated to avoid huge logs)
          const sample = JSON.stringify(req.body[0]).substring(0, 500);
          console.log("First Entry Sample (first 500 chars):", sample);
        } else if (bodyType === "object") {
          console.log("Body Keys:", Object.keys(req.body));
          const sample = JSON.stringify(req.body).substring(0, 500);
          console.log("Body Sample (first 500 chars):", sample);
        }
      } else {
        console.log("Body: null or undefined");
      }
      console.log("=== END PAYLOAD DEBUG ===\n");
    }
    next();
  });

  const server = http.createServer(app);
  app.use("/api/v1/", invoiceRoutes);
  app.use("/api/v1/", adminRoutes);
  app.use("/api/v1/", userRoutes);
  app.use("/api/v1/", AMCRoutes);
  app.use("/api/v1/", BuyBackRoutes);
  app.use("/api/v1/", ewPolicyRoutes);

  app.use("/running-status", (req, res) => {
    res.status(200).send("API is connected");
  });

  // Error handling middleware for body parsing errors (must be after routes)
  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
      const contentLength = req.get("content-length");
      const payloadSizeKB = contentLength ? (parseInt(contentLength) / 1024).toFixed(2) : "unknown";
      
      console.error("\n=== BODY PARSING ERROR ===");
      console.error("Path:", req.path);
      console.error("Error Type:", err.type);
      console.error("Error Message:", err.message);
      console.error("Content-Length:", contentLength, "bytes (", payloadSizeKB, "KB)");
      console.error("Content-Type:", req.get("content-type"));
      console.error("=== END BODY PARSING ERROR ===\n");
      
      return res.status(400).json({
        success: false,
        message: "Invalid request body or payload too large",
        error: err.message,
      });
    }
    next(err);
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

connectDb().then(startServer);
