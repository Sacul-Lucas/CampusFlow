/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Save to a temporary uploads directory
      const tempDir = path.resolve(__dirname, '..', '..', 'uploads', 'temp');

      // Ensure the temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      // Generate a UUID and keep the original extension
      const extension = path.extname(file.originalname);
      const filename = `${uuidv4()}${extension}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Allow only images for now (we can extend for other types later)
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit (we can adjust per type in the service)
  },
};
