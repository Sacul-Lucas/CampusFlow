import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../courses/courses.schema';
import { normalizeMediaUrl } from '@/common/utils/media-url.util';

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
    const lives: LiveWithCourse[] = [];

    for (const course of courses) {
      if (!course.lives?.length) continue;

      for (const live of course.lives as any[]) {
        if (!live) continue;
        const thumbnail = normalizeMediaUrl(live.thumbnail);
        const banner = normalizeMediaUrl(live.banner);
        const courseThumbnail = normalizeMediaUrl(course.thumbnail);

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
    return (course.lives ?? []).map((live: any) => {
      const thumbnail = normalizeMediaUrl(live.thumbnail);
      const banner = normalizeMediaUrl(live.banner);
      const courseThumbnail = normalizeMediaUrl(course.thumbnail);

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
