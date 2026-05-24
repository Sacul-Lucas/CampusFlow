import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { ReviewsService } from '../reviews/reviews.service';
import { Types } from 'mongoose';

@Injectable()
export class SeedReviews implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async onApplicationBootstrap() {
    const students = await this.usersService.findAllStudents();
    const courses = await this.coursesService.findAll();

    if (!students.length || !courses.length) return;

    const course = courses[0];

    if (students.length < 2) {
      console.warn('Não há alunos suficientes para seed de reviews');
      return;
    }

    // 🔎 Verifica se já existem reviews desse curso
    const existingReviews = await this.reviewsService.findByCourse(
      course._id.toString(),
    );

    const student1AlreadyReviewed = existingReviews.some(
      (r) => r.user.toString() === students[0]._id.toString(),
    );

    const student2AlreadyReviewed = existingReviews.some(
      (r) => r.user.toString() === students[1]._id.toString(),
    );

    const createdReviews: Types.ObjectId[] = [];

    // 👇 só cria se ainda não avaliou
    if (!student1AlreadyReviewed) {
      const review1 = await this.reviewsService.create(
        students[0]._id.toString(),
        course._id.toString(),
        {
          rating: 5,
          comment: 'Curso excelente!',
        },
      );

      createdReviews.push(review1._id);
    }

    if (!student2AlreadyReviewed) {
      const review2 = await this.reviewsService.create(
        students[1]._id.toString(),
        course._id.toString(),
        {
          rating: 4,
          comment: 'Muito bom, bem explicado',
        },
      );

      createdReviews.push(review2._id);
    }

    // 🧠 só adiciona novas reviews ao course
    if (createdReviews.length > 0) {
      course.reviews = [...(course.reviews || []), ...createdReviews];

      await course.save();
    }

    console.log('Seed de reviews finalizada (sem duplicações)');
  }
}
