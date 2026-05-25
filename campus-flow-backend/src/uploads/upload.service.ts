/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
import { Course } from '../courses/courses.schema';
import * as fs from 'fs/promises';
import * as path from 'path';
import { UploadUtils } from './upload.utils';
import { FileStorageService } from './upload.interface';
import { getAppBaseUrl } from '@/common/utils/media-url.util';

@Injectable()
export class UploadService implements FileStorageService {
  private readonly uploadsBasePath = path.resolve(process.cwd(), 'uploads');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    destination: string = '',
  ): Promise<{
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }> {
    if (!UploadUtils.validateImageMimetype(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and WebP images are allowed',
      );
    }

    if (!file.path) {
      throw new BadRequestException('Uploaded file path is missing');
    }

    const targetDir = path.join(this.uploadsBasePath, destination);
    await fs.mkdir(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, file.filename);
    await fs.rename(file.path, targetPath);

    const relativePath = path
      .join(destination, file.filename)
      .replace(/\\/g, '/');

    const appUrl = getAppBaseUrl();
    const url = appUrl
      ? `${appUrl}/uploads/${relativePath}`
      : `/uploads/${relativePath}`;

    return {
      url,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(filename: string): Promise<void> {
    const destinations = [
      'users/avatars',
      'courses/thumbnails',
      'courses/banners',
      'videos/thumbnails',
    ];

    for (const destination of destinations) {
      const filePath = path.join(this.uploadsBasePath, destination, filename);

      try {
        await fs.unlink(filePath);
        return;
      } catch {
        // ignore file not found and continue searching
      }
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.avatarUrl) {
      await this.deleteFile(path.basename(user.avatarUrl));
    }

    const result = await this.uploadFile(file, 'users/avatars');

    await this.userModel.findByIdAndUpdate(userId, {
      avatarUrl: result.url,
    });

    return result;
  }

  async uploadCourseThumbnail(courseId: string, file: Express.Multer.File) {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (course.thumbnail) {
      await this.deleteFile(path.basename(course.thumbnail));
    }

    const result = await this.uploadFile(file, 'courses/thumbnails');

    await this.courseModel.findByIdAndUpdate(courseId, {
      thumbnail: result.url,
    });

    return result;
  }

  async uploadCourseBanner(courseId: string, file: Express.Multer.File) {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (course.banner) {
      await this.deleteFile(path.basename(course.banner));
    }

    const result = await this.uploadFile(file, 'courses/banners');

    await this.courseModel.findByIdAndUpdate(courseId, {
      banner: result.url,
    });

    return result;
  }

  async uploadVideoThumbnail(videoId: string, file: Express.Multer.File) {
    const course = await this.courseModel.findOne({
      'modules.videos': {
        $elemMatch: { _id: videoId },
      },
    });

    if (!course) throw new NotFoundException('Video not found');

    const result = await this.uploadFile(file, 'videos/thumbnails');

    await this.courseModel.updateOne(
      { 'modules.videos._id': videoId },
      {
        $set: {
          'modules.videos.$.thumbnail': result.url,
        },
      },
    );

    return result;
  }
}
