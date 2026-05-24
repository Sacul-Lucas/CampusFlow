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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CoursesService } from '../courses/courses.service';

@Controller('api/questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly coursesService: CoursesService,
  ) {}

  /**
   * Criar uma pergunta (apenas student matriculado)
   */
  @Post(':courseId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateQuestionDto,
    @Request() req: any,
  ) {
    if (req.user.role !== 'student') {
      throw new BadRequestException('Apenas alunos podem fazer perguntas');
    }

    // Verificar se aluno está matriculado
    const isEnrolled = await this.coursesService.isStudentEnrolled(
      courseId,
      req.user.id,
    );
    if (!isEnrolled) {
      throw new BadRequestException(
        'Você precisa estar matriculado no curso para fazer perguntas',
      );
    }

    return this.questionsService.create(req.user.id, courseId, dto);
  }

  /**
   * Obter todas as perguntas de um curso
   */
  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string) {
    return this.questionsService.findByCourse(courseId);
  }

  /**
   * Obter todas as perguntas de um usuário
   */
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.questionsService.findByUser(userId);
  }

  /**
   * Obter uma pergunta específica
   */
  @Get(':questionId')
  async findOne(@Param('questionId') questionId: string) {
    return this.questionsService.findOne(questionId);
  }

  /**
   * Responder uma pergunta (apenas teacher/admin)
   */
  @Post(':questionId/answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async answerQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: AnswerQuestionDto,
    @Request() req: any,
  ) {
    return this.questionsService.answerQuestion(questionId, req.user.id, dto);
  }

  /**
   * Atualizar resposta de uma pergunta (apenas teacher/admin que respondeu)
   */
  @Patch(':questionId/answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async updateAnswer(
    @Param('questionId') questionId: string,
    @Body() dto: AnswerQuestionDto,
    @Request() req: any,
  ) {
    return this.questionsService.updateAnswer(questionId, req.user.id, dto);
  }

  /**
   * Deletar resposta de uma pergunta
   */
  @Delete(':questionId/answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async deleteAnswer(
    @Param('questionId') questionId: string,
    @Request() req: any,
  ) {
    return this.questionsService.deleteAnswer(questionId, req.user.id);
  }

  /**
   * Deletar uma pergunta (apenas dono ou admin)
   */
  @Delete(':questionId')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('questionId') questionId: string, @Request() req: any) {
    return this.questionsService.delete(questionId, req.user.id);
  }

  /**
   * Obter perguntas não respondidas de um curso
   */
  @Get('course/:courseId/unanswered')
  async getUnansweredQuestions(@Param('courseId') courseId: string) {
    return this.questionsService.getUnansweredQuestions(courseId);
  }

  /**
   * Obter total de perguntas de um curso
   */
  @Get('course/:courseId/count')
  async getTotalQuestions(@Param('courseId') courseId: string) {
    const total = await this.questionsService.getTotalQuestions(courseId);
    return { total };
  }
}
