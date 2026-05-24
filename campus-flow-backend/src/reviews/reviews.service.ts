/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,
  ) {}

  /**
   * Criar uma avaliação
   */
  async create(
    userId: string,
    courseId: string,
    dto: CreateReviewDto,
  ): Promise<Review> {
    // Verificar se já existe review do mesmo usuário para o mesmo curso
    const existingReview = await this.reviewModel.findOne({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });

    if (existingReview) {
      throw new BadRequestException(
        'Você já avaliou este curso. Atualize sua avaliação anterior.',
      );
    }

    return await this.reviewModel.create({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
      rating: dto.rating,
      comment: dto.comment || '',
    });
  }

  /**
   * Obter todas as avaliações de um curso
   */
  async findByCourse(courseId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({
        course: new Types.ObjectId(courseId),
      })
      .populate('user', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter todas as avaliações de um usuário
   */
  async findByUser(userId: string): Promise<Review[]> {
    return await this.reviewModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .populate('course')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter uma avaliação específica
   */
  async findOne(reviewId: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(reviewId)
      .populate('user', '-password')
      .populate('course');

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  /**
   * Atualizar uma avaliação
   */
  async update(
    reviewId: string,
    userId: string,
    dto: CreateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Verificar se o usuário que está atualizando é o dono da avaliação
    if (review.user.toString() !== userId) {
      throw new BadRequestException(
        'Você não pode atualizar avaliação de outro usuário',
      );
    }

    review.rating = dto.rating;
    review.comment = dto.comment || '';

    return await review.save();
  }

  /**
   * Deletar uma avaliação
   */
  async delete(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    // Verificar se o usuário que está deletando é o dono da avaliação
    if (review.user.toString() !== userId) {
      throw new BadRequestException(
        'Você não pode deletar avaliação de outro usuário',
      );
    }

    await this.reviewModel.findByIdAndDelete(reviewId);
  }

  /**
   * Obter rating médio de um curso
   */
  async getAverageRating(courseId: string): Promise<number> {
    const result = await this.reviewModel.aggregate([
      {
        $match: {
          course: new Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    if (result.length === 0) {
      return 0;
    }

    return parseFloat(result[0].averageRating.toFixed(2));
  }

  /**
   * Obter contagem de avaliações por rating
   */
  async getRatingDistribution(courseId: string): Promise<any> {
    return await this.reviewModel.aggregate([
      {
        $match: {
          course: new Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  /**
   * Verificar se usuário já avaliou um curso
   */
  async hasUserReviewedCourse(
    userId: string,
    courseId: string,
  ): Promise<boolean> {
    const review = await this.reviewModel.findOne({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
    });

    return !!review;
  }
}
