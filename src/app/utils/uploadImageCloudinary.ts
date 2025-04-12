import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
export const sendImageCloudinary = (name: string, path: string) => {
  return new Promise((resolve, reject) => {
    (async function () {
      try {
        // Configuration
        cloudinary.config({
          cloud_name: 'dkdibsanz',
          api_key: '558721645753651',
          api_secret: 'Ky5Ga3DuiaRU77goqQem_bEdWQU',
        });

        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(path, {
          public_id: name,
        });
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('file is deleted');
          }
        });
        // Optional: log optimized URLs
        const optimizeUrl = cloudinary.url(name, {
          fetch_format: 'auto',
          quality: 'auto',
        });
        console.log('Optimized URL:', optimizeUrl);

        const autoCropUrl = cloudinary.url(name, {
          crop: 'auto',
          gravity: 'auto',
          width: 500,
          height: 500,
        });
        console.log('Auto Crop URL:', autoCropUrl);

        resolve(uploadResult);
      } catch (error) {
        reject(error);
      }
    })();
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
