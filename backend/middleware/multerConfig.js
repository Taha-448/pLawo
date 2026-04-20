const multer = require('multer');

// Use memory storage instead of disk storage for Supabase uploads
const storage = multer.memoryStorage();

/**
 * Filter for image and PDF files
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const mimetype = file.mimetype;

  if (allowedTypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, .jpeg, .webp, and .pdf formats are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for PDFs
  fileFilter: fileFilter
});

module.exports = upload;
