// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import config from '../config';

// // Cloudinary config
// cloudinary.config({
//   cloud_name: config.cloud_name,
//   api_key: config.api_key,
//   api_secret: config.api_secret,
// });

// // Function to upload image to Cloudinary
// export const sendImageToCloudinary = async (
//   imageName: string,
//   filePath: string,
// ): Promise<Record<string, unknown>> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       filePath,
//       {
//         public_id: imageName.trim(),
//       },
//       function (error, result) {
//         if (error) {
//           reject(error);
//         } else {
//           console.log('Cloudinary result:', result); // Log the result for debugging
//           resolve(result as UploadApiResponse);
//         }

//         // Delete the file after upload (whether successful or not)
//         fs.unlink(filePath, (err) => {
//           if (err) {
//             console.error('Error deleting file:', err);
//           } else {
//             console.log('File deleted successfully');
//           }
//         });
//       },
//     );
//   });
// };

// // Ensure the uploads folder exists before uploading files
// const uploadDir = path.join(process.cwd(), 'uploads');

// // Check if the 'uploads' folder exists, create it if it doesn't
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('Uploads folder created at:', uploadDir);
// }

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

// // Multer instance for handling file uploads
// export const upload = multer({ storage: storage });

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
// import config from '../config/config';
import config from '../config';
import multer from 'multer';
import fs from 'fs';
import AppError from '../../app/errors/AppError';
import status from 'http-status';

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName.trim(),
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        fs.unlink(path, (err) => {
          if (err) {
            throw new AppError(
              status.INTERNAL_SERVER_ERROR,
              'File not deleted',
            );
          }
        });
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
