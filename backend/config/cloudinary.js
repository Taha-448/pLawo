const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isLicense = file.fieldname === 'barLicenseFile';
    return {
      folder: isLicense ? 'pLawo/licenses' : 'pLawo/profiles',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
      resource_type: isLicense && file.mimetype === 'application/pdf' ? 'raw' : 'auto',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

module.exports = { cloudinary, storage };
