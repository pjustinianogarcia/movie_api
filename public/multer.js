// multer-config.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'movie_images',
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

const parser = multer({ storage: storage });

module.exports = parser;
