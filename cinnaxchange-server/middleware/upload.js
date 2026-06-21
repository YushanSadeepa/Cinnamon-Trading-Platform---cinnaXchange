import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const dirs = ["uploads/products", "uploads/kyc"];
dirs.forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// Product images storage
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/products"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// KYC documents storage
const kycStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/kyc"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// Only allow images
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Only image files are allowed (JPG, PNG, WEBP)"));
};

// Product images upload — up to 5 files, field name "images"
export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).array("images", 5);

// KYC document upload — 3 specific fields
export const uploadKycDocs = multer({
  storage: kycStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
}).fields([
  { name: "nicFront", maxCount: 1 },
  { name: "nicBack", maxCount: 1 },
  { name: "selfie", maxCount: 1 },
]);

// Middleware wrappers that pass multer errors into Express error flow
export const handleProductUpload = (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

export const handleKycUpload = (req, res, next) => {
  uploadKycDocs(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};
