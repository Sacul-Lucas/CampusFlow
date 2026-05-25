/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { UploadService } from '../uploads/upload.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AddLiveDto } from '../courses/dto/add-live.dto';

@Injectable()
export class SeedLives implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedLives.name);

  constructor(
    private readonly coursesService: CoursesService,
    private readonly uploadService: UploadService,
  ) {}

  async onApplicationBootstrap() {
    const courses = await this.waitForCourses();
    if (!courses.length) {
      this.logger.warn('Nenhum curso encontrado para seed de lives.');
      return;
    }

    const currentLives = courses.reduce(
      (count, course) => count + (course.lives?.length ?? 0),
      0,
    );
    if (currentLives > 0) {
      this.logger.log('Lives já existem. Seed ignorada.');
      return;
    }

    const seedFiles = ['js.png', 'nest.png', 'react.png', 'arch.jpg'];
    const livesTemplates = [
      {
        suffix: 'Ao vivo',
        status: 'live' as const,
        daysOffset: 0,
      },
      {
        suffix: 'Agendada',
        status: 'scheduled' as const,
        daysOffset: 2,
      },
      {
        suffix: 'Finalizada',
        status: 'finished' as const,
        daysOffset: -3,
      },
    ];

    let imageIndex = 0;

    for (const course of courses) {
      for (const template of livesTemplates) {
        const fileName = seedFiles[imageIndex % seedFiles.length];
        imageIndex += 1;

        const thumbnailUpload = await this.uploadSeedAsset(
          fileName,
          'lives/thumbnails',
        );
        const bannerUpload = await this.uploadSeedAsset(
          fileName,
          'lives/banners',
        );

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + template.daysOffset);

        const livePayload: AddLiveDto = {
          title: `${course.title} - ${template.suffix}`,
          description: `Live ${template.suffix.toLowerCase()} do curso ${course.title}`,
          liveUrl: `https://live.campusflow.com/${course._id}/${template.status}`,
          scheduledDate: nextDate,
          thumbnail: thumbnailUpload.url,
          banner: bannerUpload.url,
          status: template.status,
          createdAt: new Date(),
        } as AddLiveDto;

        await this.coursesService.addLive(course._id.toString(), livePayload);
      }
    }

    this.logger.log('Seed de lives criada com sucesso.');
  }

  private async uploadSeedAsset(fileName: string, destination: string) {
    const sourcePath = path.resolve(process.cwd(), 'uploads', 'seed', fileName);
    const tempDir = path.resolve(process.cwd(), 'uploads', 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    const tempFilename = `${uuidv4()}${path.extname(fileName)}`;
    const tempPath = path.join(tempDir, tempFilename);
    await fs.copyFile(sourcePath, tempPath);

    const stat = await fs.stat(tempPath);
    const file = {
      fieldname: 'file',
      originalname: fileName,
      encoding: '7bit',
      mimetype: this.getMimeType(fileName),
      destination: tempDir,
      filename: tempFilename,
      path: tempPath,
      size: stat.size,
    } as Express.Multer.File;

    return this.uploadService.uploadFile(file, destination);
  }

  private async waitForCourses(): Promise<any[]> {
    let tries = 0;
    while (tries < 6) {
      const courses = await this.coursesService.findAll();
      if (courses.length > 0) {
        return courses;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      tries += 1;
    }

    return [];
  }

  private getMimeType(fileName: string) {
    const extension = path.extname(fileName).toLowerCase();
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  }
}
