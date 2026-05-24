/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CoursesService } from '../courses/courses.service';

@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly coursesService: CoursesService,
  ) {}

  /**
   * Criar uma avaliação (apenas student matriculado)
   */
  @Post(':courseId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    if (req.user.role !== 'student') {
      throw new BadRequestException('Apenas alunos podem avaliar cursos');
    }

    // Verificar se aluno está matriculado
    const isEnrolled = await this.coursesService.isStudentEnrolled(
      courseId,
      req.user.id,
    );
    if (!isEnrolled) {
      throw new BadRequestException(
        'Você precisa estar matriculado no curso para avaliá-lo',
      );
    }

    return this.reviewsService.create(req.user.id, courseId, dto);
  }

  /**
   * Obter todas as avaliações de um curso
   */
  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.findByCourse(courseId);
  }

  /**
   * Obter todas as avaliações de um usuário
   */
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  /**
   * Obter uma avaliação específica
   */
  @Get(':reviewId')
  async findOne(@Param('reviewId') reviewId: string) {
    return this.reviewsService.findOne(reviewId);
  }

  /**
   * Atualizar uma avaliação
   */
  @Patch(':reviewId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('reviewId') reviewId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    return this.reviewsService.update(reviewId, req.user.id, dto);
  }

  /**
   * Deletar uma avaliação
   */
  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('reviewId') reviewId: string, @Request() req: any) {
    return this.reviewsService.delete(reviewId, req.user.id);
  }

  /**
   * Obter rating médio de um curso
   */
  @Get('course/:courseId/average-rating')
  async getAverageRating(@Param('courseId') courseId: string) {
    const averageRating = await this.reviewsService.getAverageRating(courseId);
    return { averageRating };
  }

  /**
   * Obter distribuição de ratings de um curso
   */
  @Get('course/:courseId/rating-distribution')
  async getRatingDistribution(@Param('courseId') courseId: string) {
    return this.reviewsService.getRatingDistribution(courseId);
  }

  /**
   * Verificar se usuário já avaliou um curso
   */
  @Get('course/:courseId/has-reviewed')
  @UseGuards(JwtAuthGuard)
  async hasUserReviewedCourse(
    @Param('courseId') courseId: string,
    @Request() req: any,
  ) {
    const hasReviewed = await this.reviewsService.hasUserReviewedCourse(
      req.user.id,
      courseId,
    );
    return { hasReviewed };
  }
}
