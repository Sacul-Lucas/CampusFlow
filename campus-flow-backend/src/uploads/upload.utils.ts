import * as fs from 'fs';
import * as path from 'path';

export class UploadUtils {
  static deleteFileIfExists(filePath: string): void {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  static getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }

  static isImageFile(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  static validateImageMimetype(mimetype: string): boolean {
    const allowedMimetypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedMimetypes.includes(mimetype);
  }

  static getSizeLimitForType(type: string): number {
    const limits: Record<string, number> = {
      avatar: 2 * 1024 * 1024, // 2MB
      thumbnail: 5 * 1024 * 1024, // 5MB
      banner: 10 * 1024 * 1024, // 10MB
      default: 5 * 1024 * 1024, // 5MB
    };

    return limits[type] || limits.default;
  }
}
