const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
const port = 3000;

// Serve static files
app.use(express.static("source"));
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "assets/images"))
);
app.use(
  "/assets/styles",
  express.static(path.join(__dirname, "assets/styles"))
);

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// AES encryption settings
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // Generate a random key (32 bytes) for AES encryption
const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector) for AES encryption

// Encrypt function
function encrypt(buffer) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
}

// Decrypt function
function decrypt(buffer) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
}

// Serve index.html when root URL is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "source", "index.html"));
});

// Serve uploadDoc.html when /uploadDoc.html URL is accessed
app.get("/uploadDoc.html", (req, res) => {
  res.sendFile(path.join(__dirname, "source", "uploadDoc.html"));
});

// Handle file upload on /upload route
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    // Read the uploaded file
    const fileBuffer = fs.readFileSync(req.file.path);

    // Encrypt the file
    const encryptedBuffer = encrypt(fileBuffer);

    // Store the encrypted file
    const encryptedFilePath = path.join(
      __dirname,
      "uploads",
      `${req.file.originalname}.enc`
    );
    fs.writeFileSync(encryptedFilePath, encryptedBuffer);

    // Respond with success message
    res.json({
      success: true,
      message: "File uploaded and encrypted successfully",
    });

    // Optionally, you can delete the original unencrypted file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
