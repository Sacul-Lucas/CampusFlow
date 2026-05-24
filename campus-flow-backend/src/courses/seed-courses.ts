import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedCourses implements OnApplicationBootstrap {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    const teacherEmail = process.env.ADMIN_EMAIL;

    if (!teacherEmail) {
      console.warn('ADMIN_EMAIL não definido. Seed de cursos ignorada.');
      return;
    }

    const teacher = await this.usersService.findByEmail(teacherEmail);

    if (!teacher) {
      console.warn('Professor admin não encontrado. Seed ignorada.');
      return;
    }

    const existingCourses = await this.coursesService.findAll();
    if (existingCourses.length > 0) {
      console.log('Cursos já existem. Seed ignorada.');
      return;
    }

    const teacherId = teacher._id.toString();

    await Promise.all([
      this.coursesService.create(
        {
          title: 'JavaScript do Zero ao Avançado',
          shortDescription: 'Aprenda JavaScript moderno do básico ao avançado',
          fullDescription:
            'Curso completo de JavaScript com ES6+, async/await, DOM e projetos reais',
          thumbnail: '/seed/js.jpg',
          banner: '/seed/js-banner.jpg',
          level: 'beginner',
          category: 'Programação',
          tags: ['javascript', 'frontend', 'web'],
        },
        teacherId,
      ),

      this.coursesService.create(
        {
          title: 'NestJS na Prática',
          shortDescription: 'APIs escaláveis com NestJS',
          fullDescription:
            'Aprenda arquitetura modular, autenticação JWT e MongoDB com NestJS',
          thumbnail: '/seed/nest.jpg',
          banner: '/seed/nest-banner.jpg',
          level: 'intermediate',
          category: 'Backend',
          tags: ['nestjs', 'node', 'api'],
        },
        teacherId,
      ),

      this.coursesService.create(
        {
          title: 'React + Next.js Completo',
          shortDescription: 'Frontend moderno com React e Next.js',
          fullDescription:
            'SSR, SSG, React Hooks, Tailwind e projetos completos com Next.js',
          thumbnail: '/seed/react.jpg',
          banner: '/seed/react-banner.jpg',
          level: 'intermediate',
          category: 'Frontend',
          tags: ['react', 'nextjs', 'frontend'],
        },
        teacherId,
      ),

      this.coursesService.create(
        {
          title: 'Arquitetura de Software Moderna',
          shortDescription: 'Design patterns e boas práticas',
          fullDescription:
            'Clean Architecture, SOLID, DDD e escalabilidade em sistemas reais',
          thumbnail: '/seed/architecture.jpg',
          banner: '/seed/architecture-banner.jpg',
          level: 'advanced',
          category: 'Arquitetura',
          tags: ['architecture', 'clean code', 'design patterns'],
        },
        teacherId,
      ),
    ]);

    console.log('Seed de cursos criada com sucesso.');
  }
}
