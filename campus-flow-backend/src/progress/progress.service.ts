/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress } from './progress.schema';
import { Course } from '../courses/courses.schema';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  async create(data: {
    userId: string;
    courseId: string;
    completedVideos: number;
    progressPercent: number;
  }): Promise<Progress> {
    const userObjectId = new Types.ObjectId(data.userId);
    const courseObjectId = new Types.ObjectId(data.courseId);

    /**
     * 1. Verifica curso
     */
    const course = await this.courseModel.findById(courseObjectId);

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    /**
     * 2. Verifica se já existe progresso (evita duplicação)
     */
    const existing = await this.progressModel.findOne({
      user: userObjectId,
      course: courseObjectId,
    });

    if (existing) {
      return existing;
    }

    /**
     * 3. Pega total de vídeos do curso
     */
    const totalVideos = this.getTotalVideosInCourse(course);

    /**
     * 4. Cria progresso inicial baseado na seed
     */
    const progress = await this.progressModel.create({
      user: userObjectId,
      course: courseObjectId,

      /**
       * seed controlada
       */
      completedVideos: Array.from(
        { length: data.completedVideos },
        (_, i) => `video-${i + 1}`,
      ),

      percentage: Math.min(data.progressPercent, 100),

      currentVideo: '',
      currentModule: '',
      watchedMinutes: 0,

      completed: data.progressPercent >= 100,

      lastAccessAt: new Date(),
    });

    /**
     * 5. Recalcula consistência real (opcional mas recomendado)
     */
    const realPercentage =
      totalVideos > 0
        ? Math.round((data.completedVideos / totalVideos) * 100)
        : 0;

    progress.percentage = Math.max(progress.percentage, realPercentage);

    if (progress.percentage >= 100) {
      progress.completed = true;
    }

    await progress.save();

    /**
     * 6. Retorno populado
     */
    return this.progressModel
      .findById(progress._id)
      .populate('user', '-password')
      .populate('course')
      .exec() as any;
  }
  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<Progress>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
  ) {}

  /**
   * Obter progresso de um curso para um usuário
   */
  async getCourseProgress(userId: string, courseId: string): Promise<Progress> {
    const progress = await this.progressModel
      .findOne({
        user: new Types.ObjectId(userId),
        course: new Types.ObjectId(courseId),
      })
      .populate('user', '-password')
      .populate('course');

    if (!progress) {
      throw new NotFoundException('Progresso não encontrado');
    }

    return progress;
  }

  /**
   * Marcar vídeo como concluído
   */
  async completeVideo(
    userId: string,
    courseId: string,
    videoTitle: string,
  ): Promise<Progress> {
    const progress = await this.progressModel.findOne({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });

    if (!progress) {
      throw new NotFoundException('Progresso não encontrado');
    }

    // Evitar duplicação de vídeos concluídos
    if (!progress.completedVideos.includes(videoTitle)) {
      progress.completedVideos.push(videoTitle);
    }

    // Calcular porcentagem de progresso
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    const totalVideos = this.getTotalVideosInCourse(course);
    if (totalVideos > 0) {
      progress.percentage = Math.round(
        (progress.completedVideos.length / totalVideos) * 100,
      );
    }

    // Marcar como concluído se atingir 100%
    if (progress.percentage === 100) {
      progress.completed = true;
    }

    // Atualizar último acesso
    progress.lastAccessAt = new Date();

    const saved = await progress.save();
    await this.updateCourseAverageProgress(courseId);
    return saved;
  }

  /**
   * Atualizar tempo assistido
   */
  async updateWatchTime(
    userId: string,
    courseId: string,
    minutes: number,
  ): Promise<Progress> {
    const progress = await this.progressModel.findOne({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });

    if (!progress) {
      throw new NotFoundException('Progresso não encontrado');
    }

    progress.watchedMinutes += minutes;
    progress.lastAccessAt = new Date();

    const saved = await progress.save();
    await this.updateCourseAverageProgress(courseId);
    return saved;
  }

  /**
   * Obter vídeo para continuar assistindo
   */
  async getContinueWatching(userId: string): Promise<Progress[]> {
    const progressList = await this.progressModel
      .find({
        user: new Types.ObjectId(userId),
        completed: false,
      })
      .populate('user', '-password')
      .populate('course')
      .sort({ lastAccessAt: -1 })
      .limit(10);

    return progressList;
  }

  /**
   * Atualizar progresso com DTO
   */
  async updateProgress(
    userId: string,
    courseId: string,
    dto: UpdateProgressDto,
  ): Promise<Progress> {
    const progress = await this.progressModel.findOne({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });

    if (!progress) {
      throw new NotFoundException('Progresso não encontrado');
    }

    if (dto.currentVideo) {
      progress.currentVideo = dto.currentVideo;
    }

    if (dto.currentModule) {
      progress.currentModule = dto.currentModule;
    }

    if (dto.watchedMinutes !== undefined) {
      progress.watchedMinutes = dto.watchedMinutes;
    }

    if (dto.completed !== undefined) {
      progress.completed = dto.completed;
    }

    progress.lastAccessAt = new Date();

    const saved = await progress.save();
    await this.updateCourseAverageProgress(courseId);
    return saved;
  }

  /**
   * Obter total de vídeos em um curso
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
   * Obter progresso de um usuário em todos os cursos
   */
  async getUserProgress(userId: string): Promise<Progress[]> {
    return await this.progressModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .populate('user', '-password')
      .populate('course')
      .sort({ lastAccessAt: -1 });
  }

  private async updateCourseAverageProgress(courseId: string): Promise<void> {
    const progressRecords = await this.progressModel.find({
      course: new Types.ObjectId(courseId),
    });

    if (progressRecords.length === 0) {
      await this.courseModel.findByIdAndUpdate(courseId, {
        averageProgress: 0,
      });
      return;
    }

    const totalPercent = progressRecords.reduce(
      (sum, progress) => sum + progress.percentage,
      0,
    );

    const average = Math.round(totalPercent / progressRecords.length);
    await this.courseModel.findByIdAndUpdate(courseId, {
      averageProgress: average,
    });
  }

  /**
   * Criar progresso inicial
   */
  async createProgress(userId: string, courseId: string): Promise<Progress> {
    return await this.progressModel.create({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });
  }
}
