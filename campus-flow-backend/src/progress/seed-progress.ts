/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class SeedProgress implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
    private readonly progressService: ProgressService,
  ) {}

  async onApplicationBootstrap() {
    const students = await this.usersService.findAllStudents();
    const courses = await this.coursesService.findAll();

    if (!students.length || !courses.length) return;

    for (const student of students.slice(0, 3)) {
      for (const course of courses.slice(0, 2)) {
        await this.progressService.create({
          userId: student._id.toString(),
          courseId: course._id.toString(),
          completedVideos: Math.floor(Math.random() * 5),
          progressPercent: Math.floor(Math.random() * 100),
        });
      }
    }

    console.log('Seed de progressos criada');
  }
}
