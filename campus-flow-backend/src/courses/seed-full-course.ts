/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedCoursesFull implements OnApplicationBootstrap {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    const teacher = await this.usersService.findByEmail(
      process.env.ADMIN_EMAIL!,
    );

    if (!teacher) return;

    const exists = await this.coursesService.findAll();
    if (exists.length > 4) return;

    await this.coursesService.create(
      {
        title: 'NestJS Completo com Arquitetura Real',
        shortDescription: 'Backend escalável com NestJS',
        fullDescription: 'Curso completo com módulos, vídeos e estrutura real',
        thumbnail: '/uploads/seed/nest',
        banner: '/uploads/seed/nest',
        shortUrl: 'https://www.youtube.com/shorts/rH28fg0ZQ_M',
        level: 'advanced',
        category: 'Backend',
        tags: ['nestjs', 'backend'],
        modules: [
          {
            title: 'Introdução',
            description: 'Fundamentos do NestJS',
            videos: [
              {
                title: 'O que é NestJS',
                description: 'Introdução ao framework',
                videoUrl: 'https://video.com/1',
                durationInMinutes: 10,
                isPreview: true,
              },
              {
                title: 'Instalação',
                description: 'Setup inicial',
                videoUrl: 'https://video.com/2',
                durationInMinutes: 15,
              },
            ],
          },
          {
            title: 'Controllers e Services',
            description: 'Arquitetura base',
            videos: [
              {
                title: 'Controllers',
                videoUrl: 'https://video.com/3',
                durationInMinutes: 20,
              },
            ],
          },
        ],
        lives: [],
      } as any,
      teacher._id.toString(),
    );

    console.log('Seed de cursos completos criada');
  }
}
