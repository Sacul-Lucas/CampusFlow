import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../courses/courses.schema';

export interface LiveWithCourse {
  _id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  banner?: string;
  liveUrl: string;
  scheduledDate: string;
  status: 'scheduled' | 'live' | 'finished';
  createdAt?: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  courseCategory?: string;
}

@Injectable()
export class LivesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
  ) {}

  async listLives(): Promise<LiveWithCourse[]> {
    const courses = await this.courseModel.find().lean();
    const host = process.env.APP_URL || `http://localhost:${process.env.PORT || 3500}`;
    const lives: LiveWithCourse[] = [];

    for (const course of courses) {
      if (!course.lives?.length) continue;

      for (const live of course.lives as any[]) {
        if (!live) continue;
        const thumbnail = live.thumbnail && live.thumbnail.startsWith('/') ? `${host}${live.thumbnail}` : live.thumbnail;
        const banner = live.banner && live.banner.startsWith('/') ? `${host}${live.banner}` : live.banner;
        const courseThumbnail = course.thumbnail && course.thumbnail.startsWith('/') ? `${host}${course.thumbnail}` : course.thumbnail;

        lives.push({
          _id: live._id?.toString?.() ?? '',
          title: live.title,
          description: live.description,
          thumbnail,
          banner,
          liveUrl: live.liveUrl,
          scheduledDate: live.scheduledDate?.toString() ?? '',
          status: live.status ?? 'scheduled',
          createdAt: live.createdAt?.toString?.() ?? undefined,
          courseId: course._id.toString(),
          courseTitle: course.title,
          courseThumbnail,
          courseCategory: course.category,
        });
      }
    }

    return lives.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );
  }

  async getLivesByCourse(courseId: string): Promise<LiveWithCourse[]> {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new NotFoundException('Curso não encontrado');
    }

    const course = await this.courseModel.findById(courseId).lean();
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    const host = process.env.APP_URL || `http://localhost:${process.env.PORT || 3500}`;

    return (course.lives ?? []).map((live: any) => {
      const thumbnail = live.thumbnail && live.thumbnail.startsWith('/') ? `${host}${live.thumbnail}` : live.thumbnail;
      const banner = live.banner && live.banner.startsWith('/') ? `${host}${live.banner}` : live.banner;
      const courseThumbnail = course.thumbnail && course.thumbnail.startsWith('/') ? `${host}${course.thumbnail}` : course.thumbnail;

      return {
        _id: live._id?.toString?.() ?? '',
        title: live.title,
        description: live.description,
        thumbnail,
        banner,
        liveUrl: live.liveUrl,
        scheduledDate: live.scheduledDate?.toString() ?? '',
        status: live.status ?? 'scheduled',
        createdAt: live.createdAt?.toString?.() ?? undefined,
        courseId: course._id.toString(),
        courseTitle: course.title,
        courseThumbnail,
        courseCategory: course.category,
      };
    });
  }
}
