import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Course,
  CourseModuleItem,
  CourseVideo,
  CourseLive,
} from './courses.schema';
import { User } from '../users/user.schema';
import { Progress } from '../progress/progress.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AddModuleDto } from './dto/add-module.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { AddLiveDto } from './dto/add-live.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Progress.name)
    private readonly progressModel: Model<Progress>,
  ) {}

  /**
   * Criar novo curso
   */
  async create(dto: CreateCourseDto, teacherId: string): Promise<Course> {
    return await this.courseModel.create({
      ...dto,
      teacher: new Types.ObjectId(teacherId),
    });
  }

  /**
   * Obter todos os cursos
   */
  async findAll(): Promise<Course[]> {
    return await this.courseModel
      .find()
      .populate('teacher', '-password')
      .populate('students', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter um curso por ID
   */
  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel
      .findById(id)
      .populate('teacher', '-password')
      .populate('students', '-password')
      .populate('reviews')
      .populate('questions');

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  /**
   * Atualizar um curso
   */
  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  /**
   * Deletar um curso
   */
  async delete(id: string): Promise<void> {
    const course = await this.courseModel.findByIdAndDelete(id);

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
  }

  /**
   * Matricular aluno em um curso
   */
  async enrollStudent(courseId: string, userId: string): Promise<any> {
    const course = await this.courseModel.findById(courseId);
    const user = await this.userModel.findById(userId);

    if (!course || !user) {
      throw new NotFoundException('Curso ou usuário não encontrado');
    }

    // Verificar se aluno já está matriculado
    if (course.students.some((id) => id.toString() === userId)) {
      throw new BadRequestException('Aluno já está matriculado neste curso');
    }

    // Adicionar aluno ao curso
    course.students.push(new Types.ObjectId(userId));

    // Adicionar curso ao usuário
    user.enrolledCourses.push(new Types.ObjectId(courseId));

    // Criar progresso
    const progress = await this.progressModel.create({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });

    // Associar progresso
    user.progress.push(progress._id);
    course.progress.push(progress._id);

    // Atualizar estatísticas
    course.totalStudents += 1;

    await course.save();
    await user.save();

    return {
      message: 'Matrícula realizada com sucesso',
      progress: progress._id,
    };
  }

  /**
   * Adicionar módulo a um curso
   */
  async addModule(courseId: string, dto: AddModuleDto): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    const newModule: CourseModuleItem = {
      title: dto.title,
      description: dto.description || '',
      videos: [],
    };

    course.modules.push(newModule);
    course.totalModules = course.modules.length;

    return await course.save();
  }

  /**
   * Adicionar vídeo a um módulo
   */
  async addVideo(
    courseId: string,
    moduleIndex: number,
    dto: AddVideoDto,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (!course.modules[moduleIndex]) {
      throw new NotFoundException('Módulo não encontrado');
    }

    const newVideo: CourseVideo = {
      title: dto.title,
      description: dto.description,
      videoUrl: dto.videoUrl,
      durationInMinutes: dto.durationInMinutes,
      isPreview: dto.isPreview,
      thumbnail: '',
    };

    course.modules[moduleIndex].videos.push(newVideo);
    course.totalVideos = this.getTotalVideosInCourse(course);

    // Calcular total de horas
    course.totalHours = this.getTotalHoursInCourse(course);

    return await course.save();
  }

  /**
   * Adicionar live a um curso
   */
  async addLive(courseId: string, dto: AddLiveDto): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    const newLive: CourseLive = {
      title: dto.title,
      description: dto.description,
      liveUrl: dto.liveUrl,
      scheduledDate: new Date(dto.scheduledDate),
      isFinished: false,
    };

    course.lives.push(newLive);

    return await course.save();
  }

  /**
   * Adicionar curso aos favoritos
   */
  async favoriteCourse(courseId: string, userId: string): Promise<any> {
    const course = await this.courseModel.findById(courseId);
    const user = await this.userModel.findById(userId);

    if (!course || !user) {
      throw new NotFoundException('Curso ou usuário não encontrado');
    }

    // Verificar se já é favorito
    if (user.favoriteCourses.some((id) => id.toString() === courseId)) {
      throw new BadRequestException('Este curso já está nos favoritos');
    }

    user.favoriteCourses.push(new Types.ObjectId(courseId));
    await user.save();

    return {
      message: 'Curso adicionado aos favoritos',
    };
  }

  /**
   * Remover curso dos favoritos
   */
  async unfavoriteCourse(courseId: string, userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.favoriteCourses = user.favoriteCourses.filter(
      (id) => id.toString() !== courseId,
    );
    await user.save();

    return {
      message: 'Curso removido dos favoritos',
    };
  }

  /**
   * Obter cursos criados por um teacher
   */
  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    return await this.courseModel
      .find({
        teacher: new Types.ObjectId(teacherId),
      })
      .populate('teacher', '-password')
      .populate('students', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter cursos inscritos por um aluno
   */
  async getStudentEnrolledCourses(studentId: string): Promise<Course[]> {
    const user = await this.userModel.findById(studentId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.courseModel
      .find({
        _id: { $in: user.enrolledCourses },
      })
      .populate('teacher', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter cursos favoritos de um aluno
   */
  async getStudentFavoriteCourses(studentId: string): Promise<Course[]> {
    const user = await this.userModel.findById(studentId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.courseModel
      .find({
        _id: { $in: user.favoriteCourses },
      })
      .populate('teacher', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Calcular total de vídeos em um curso
   */
  private getTotalVideosInCourse(course: Course): number {
    let totalVideos = 0;

    if (course.modules && course.modules.length > 0) {
      for (const module of course.modules) {
        if (module.videos && module.videos.length > 0) {
          totalVideos += module.videos.length;
        }
      }
    }

    return totalVideos;
  }

  /**
   * Calcular total de horas em um curso
   */
  private getTotalHoursInCourse(course: Course): number {
    let totalMinutes = 0;

    if (course.modules && course.modules.length > 0) {
      for (const module of course.modules) {
        if (module.videos && module.videos.length > 0) {
          for (const video of module.videos) {
            totalMinutes += video.durationInMinutes;
          }
        }
      }
    }

    return Math.round(totalMinutes / 60);
  }

  /**
   * Verificar se aluno está matriculado no curso
   */
  async isStudentEnrolled(courseId: string, userId: string): Promise<boolean> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course.students.some((id) => id.toString() === userId);
  }
}
