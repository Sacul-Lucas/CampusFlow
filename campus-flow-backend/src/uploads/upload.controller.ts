/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req.user.userId; // Assuming the JWT payload has userId
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    return this.uploadService.uploadUserAvatar(userId, file);
  }

  @Post('course-thumbnail')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCourseThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const { courseId } = req.body;
    if (!courseId) {
      throw new BadRequestException('Course ID is required');
    }
    return this.uploadService.uploadCourseThumbnail(courseId, file);
  }

  @Post('course-banner')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCourseBanner(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const { courseId } = req.body;
    if (!courseId) {
      throw new BadRequestException('Course ID is required');
    }
    return this.uploadService.uploadCourseBanner(courseId, file);
  }

  @Post('video-thumbnail')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideoThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const { videoId } = req.body;
    if (!videoId) {
      throw new BadRequestException('Video ID is required');
    }
    return this.uploadService.uploadVideoThumbnail(videoId, file);
  }

  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const { destination } = req.body;
    if (!destination) {
      throw new BadRequestException('Destination is required');
    }
    // For generic upload, we just return the file info
    // The destination would need to be handled differently if we want to organize files
    // For now, we'll just return the basic upload result
    return this.uploadService.uploadFile(file);
  }
}
