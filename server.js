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
app.use(
  "/assets/scripts",
  express.static(path.join(__dirname, "assets/scripts"))
);

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// AES encryption settings
const algorithm = "aes-256-cbc";

// Function to derive key from password using PBKDF2
function deriveKeyFromPassword(password) {
  const salt = crypto.randomBytes(16); // Generate a random salt
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

// Encrypt function
function encrypt(buffer, key) {
  const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encryptedData: encrypted, iv: iv };
}

// Decrypt function
function decrypt(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
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
app.post("/uploads", upload.single("file"), (req, res) => {
  try {
    const password = req.body.password; // Assuming the user's password is sent in the request body

    // Derive key from password
    const key = deriveKeyFromPassword(password);

    // Read the uploaded file
    const fileBuffer = fs.readFileSync(req.file.path);

    // Encrypt the file
    const { encryptedData, iv } = encrypt(fileBuffer, key);

    // Store the encrypted file
    const encryptedFilePath = path.join(
      __dirname,
      "uploads",
      `${req.file.originalname}.enc`
    );
    fs.writeFileSync(encryptedFilePath, encryptedData);

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
