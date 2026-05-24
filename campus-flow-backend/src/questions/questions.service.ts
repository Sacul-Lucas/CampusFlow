import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from './question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>,
  ) {}

  /**
   * Criar uma pergunta
   */
  async create(
    userId: string,
    courseId: string,
    dto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionModel.create({
      user: new Types.ObjectId(userId),
      course: new Types.ObjectId(courseId),
      message: dto.message,
    });
  }

  /**
   * Obter todas as perguntas de um curso
   */
  async findByCourse(courseId: string): Promise<Question[]> {
    return await this.questionModel
      .find({
        course: new Types.ObjectId(courseId),
      })
      .populate('user', '-password')
      .populate('answeredBy', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter todas as perguntas de um usuário
   */
  async findByUser(userId: string): Promise<Question[]> {
    return await this.questionModel
      .find({
        user: new Types.ObjectId(userId),
      })
      .populate('course')
      .populate('answeredBy', '-password')
      .sort({ createdAt: -1 });
  }

  /**
   * Obter uma pergunta específica
   */
  async findOne(questionId: string): Promise<Question> {
    const question = await this.questionModel
      .findById(questionId)
      .populate('user', '-password')
      .populate('course')
      .populate('answeredBy', '-password');

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    return question;
  }

  /**
   * Responder uma pergunta
   */
  async answerQuestion(
    questionId: string,
    respondentId: string,
    dto: AnswerQuestionDto,
  ): Promise<Question> {
    const question = await this.questionModel.findById(questionId);

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    if (question.isAnswered) {
      throw new BadRequestException('Esta pergunta já foi respondida');
    }

    question.answer = dto.answer;
    question.answeredBy = new Types.ObjectId(respondentId);
    question.isAnswered = true;

    return await question.save();
  }

  /**
   * Atualizar resposta de uma pergunta
   */
  async updateAnswer(
    questionId: string,
    respondentId: string,
    dto: AnswerQuestionDto,
  ): Promise<Question> {
    const question = await this.questionModel.findById(questionId);

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    // Verificar se o usuário que está atualizando é quem respondeu
    if (question.answeredBy?.toString() !== respondentId) {
      throw new BadRequestException(
        'Você não pode atualizar resposta de outro usuário',
      );
    }

    question.answer = dto.answer;

    return await question.save();
  }

  /**
   * Deletar uma pergunta
   */
  async delete(questionId: string, userId: string): Promise<void> {
    const question = await this.questionModel.findById(questionId);

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    // Apenas o dono da pergunta pode deletá-la
    if (question.user.toString() !== userId) {
      throw new BadRequestException(
        'Você não pode deletar pergunta de outro usuário',
      );
    }

    await this.questionModel.findByIdAndDelete(questionId);
  }

  /**
   * Deletar resposta de uma pergunta
   */
  async deleteAnswer(
    questionId: string,
    respondentId: string,
  ): Promise<Question> {
    const question = await this.questionModel.findById(questionId);

    if (!question) {
      throw new NotFoundException('Pergunta não encontrada');
    }

    // Verificar se o usuário é quem respondeu
    if (question.answeredBy?.toString() !== respondentId) {
      throw new BadRequestException(
        'Você não pode deletar resposta de outro usuário',
      );
    }

    question.answer = '';
    question.answeredBy = null;
    question.isAnswered = false;

    return await question.save();
  }

  /**
   * Obter perguntas não respondidas de um curso
   */
  async getUnansweredQuestions(courseId: string): Promise<Question[]> {
    return await this.questionModel
      .find({
        course: new Types.ObjectId(courseId),
        isAnswered: false,
      })
      .populate('user', '-password')
      .sort({ createdAt: 1 });
  }

  /**
   * Obter total de perguntas de um curso
   */
  async getTotalQuestions(courseId: string): Promise<number> {
    return await this.questionModel.countDocuments({
      course: new Types.ObjectId(courseId),
    });
  }
}
