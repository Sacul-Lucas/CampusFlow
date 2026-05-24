export interface FileStorageService {
  uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<{
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }>;
  deleteFile(filename: string): Promise<void>;
  getFileUrl(filename: string): string;
}
