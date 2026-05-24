/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AddModuleDto } from './dto/add-module.dto';
import { AddVideoDto } from './dto/add-video.dto';
import { AddLiveDto } from './dto/add-live.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../auth/auth.user.interface';

@Controller('api/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Criar novo curso (apenas teacher/admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async create(@Body() dto: CreateCourseDto, @Request() req: ExpressRequest) {
    const user = (req as any).user as AuthUser;
    const course = await this.coursesService.create(dto, user.id);
    if (!course)
      throw new UnauthorizedException('Não foi possível criar o curso');

    return {
      success: true,
      message: course,
    };
  }

  /**
   * Obter todos os cursos
   */
  @Get()
  async findAll() {
    const courses = await this.coursesService.findAll();
    if (!courses)
      throw new UnauthorizedException('Não foi possível listar os cursos');

    return {
      success: true,
      message: courses,
    };
  }

  /**
   * Obter um curso por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  /**
   * Atualizar curso (apenas teacher/admin que é dono ou admin)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Request() req: ExpressRequest,
  ) {
    // Verificar autorização
    const user = (req as any).user as AuthUser;
    const course = await this.coursesService.findOne(id);
    if (course.teacher.toString() !== user.id && user.role !== 'admin') {
      throw new BadRequestException(
        'Você não tem permissão para atualizar este curso',
      );
    }

    const updatedCourse = this.coursesService.update(id, dto);
    if (!updatedCourse)
      throw new UnauthorizedException('Não foi possível atualizar o curso');

    return {
      success: true,
      message: updatedCourse,
    };
  }

  /**
   * Deletar curso (apenas teacher/admin que é dono ou admin)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async delete(@Param('id') id: string, @Request() req: ExpressRequest) {
    // Verificar autorização
    const user = (req as any).user as AuthUser;
    const course = await this.coursesService.findOne(id);
    if (course.teacher.toString() !== user.id && user.role !== 'admin') {
      throw new BadRequestException(
        'Você não tem permissão para deletar este curso',
      );
    }

    const deletedCourse = this.coursesService.delete(id);
    if (!deletedCourse)
      throw new UnauthorizedException('Não foi possível criar o curso');

    return {
      success: true,
      message: deletedCourse,
    };
  }

  /**
   * Matricular aluno em um curso (apenas student)
   */
  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('id') courseId: string, @Request() req: ExpressRequest) {
    const user = (req as any).user as AuthUser;
    if (user.role !== 'student') {
      throw new BadRequestException('Apenas alunos podem se matricular');
    }

    return this.coursesService.enrollStudent(courseId, user.id);
  }

  /**
   * Adicionar módulo ao curso (apenas teacher/admin que é dono ou admin)
   */
  @Post(':id/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async addModule(
    @Param('id') courseId: string,
    @Body() dto: AddModuleDto,
    @Request() req: ExpressRequest,
  ) {
    // Verificar autorização
    const user = (req as any).user as AuthUser;
    const course = await this.coursesService.findOne(courseId);
    if (course.teacher.toString() !== user.id && user.role !== 'admin') {
      throw new BadRequestException(
        'Você não tem permissão para adicionar módulos a este curso',
      );
    }

    return this.coursesService.addModule(courseId, dto);
  }

  /**
   * Adicionar vídeo a um módulo (apenas teacher/admin que é dono ou admin)
   */
  @Post(':id/modules/:moduleIndex/videos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async addVideo(
    @Param('id') courseId: string,
    @Param('moduleIndex') moduleIndex: string,
    @Body() dto: AddVideoDto,
    @Request() req: ExpressRequest,
  ) {
    // Verificar autorização
    const user = (req as any).user as AuthUser;
    const course = await this.coursesService.findOne(courseId);
    if (course.teacher.toString() !== user.id && user.role !== 'admin') {
      throw new BadRequestException(
        'Você não tem permissão para adicionar vídeos a este curso',
      );
    }

    const index = parseInt(moduleIndex, 10);
    if (isNaN(index)) {
      throw new BadRequestException('Índice do módulo inválido');
    }

    return this.coursesService.addVideo(courseId, index, dto);
  }

  /**
   * Adicionar live ao curso (apenas teacher/admin que é dono ou admin)
   */
  @Post(':id/lives')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async addLive(
    @Param('id') courseId: string,
    @Body() dto: AddLiveDto,
    @Request() req: ExpressRequest,
  ) {
    // Verificar autorização
    const user = (req as any).user as AuthUser;
    const course = await this.coursesService.findOne(courseId);
    if (course.teacher.toString() !== user.id && user.role !== 'admin') {
      throw new BadRequestException(
        'Você não tem permissão para adicionar lives a este curso',
      );
    }

    return this.coursesService.addLive(courseId, dto);
  }

  /**
   * Adicionar curso aos favoritos (apenas student)
   */
  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async favoriteCourse(
    @Param('id') courseId: string,
    @Request() req: ExpressRequest,
  ) {
    const user = (req as any).user as AuthUser;
    if (user.role !== 'student') {
      throw new BadRequestException('Apenas alunos podem favoritar cursos');
    }

    return this.coursesService.favoriteCourse(courseId, user.id);
  }

  /**
   * Remover curso dos favoritos (apenas student)
   */
  @Delete(':id/favorite')
  @UseGuards(JwtAuthGuard)
  async unfavoriteCourse(
    @Param('id') courseId: string,
    @Request() req: ExpressRequest,
  ) {
    const user = (req as any).user as AuthUser;
    if (user.role !== 'student') {
      throw new BadRequestException('Apenas alunos podem remover favoritos');
    }

    return this.coursesService.unfavoriteCourse(courseId, user.id);
  }

  /**
   * Obter cursos criados por um teacher
   */
  @Get('teacher/:teacherId')
  async getTeacherCourses(@Param('teacherId') teacherId: string) {
    return this.coursesService.getTeacherCourses(teacherId);
  }

  /**
   * Obter cursos inscritos por um aluno
   */
  @Get('student/:studentId/enrolled')
  async getStudentEnrolledCourses(@Param('studentId') studentId: string) {
    return this.coursesService.getStudentEnrolledCourses(studentId);
  }

  /**
   * Obter cursos favoritos de um aluno
   */
  @Get('student/:studentId/favorites')
  async getStudentFavoriteCourses(@Param('studentId') studentId: string) {
    return this.coursesService.getStudentFavoriteCourses(studentId);
  }
}
