import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File, nameFile: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: `${process.env.APP_NAME}/${nameFile}`, // Use the dynamic nameFile
      },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // Method to delete a file from Cloudinary
  async destroy(publicId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        // Check result for successful deletion
        if (result.result === 'ok') {
          resolve();
        } else {
          reject(new Error(`Failed to delete the file: ${result.result}`));
        }
      });
    });
  }
}

