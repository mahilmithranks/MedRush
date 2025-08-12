// middleware/uploadAndCloudinary.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust)
  fileFilter: (req, file, cb) => {
    // accept images and PDFs (png,jpg,jpeg,pdf)
    if (/image|pdf/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only images or pdf allowed'));
  }
});

function uploadToCloudinary(buffer, folder = 'medrush/licenses') {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(upload_stream);
  });
}

module.exports = { upload, uploadToCloudinary };
