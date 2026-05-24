/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * Obter progresso de um curso
   */
  @Get('course/:courseId')
  @UseGuards(JwtAuthGuard)
  async getCourseProgress(
    @Param('courseId') courseId: string,
    @Request() req: any,
  ) {
    return this.progressService.getCourseProgress(req.user.id, courseId);
  }

  /**
   * Marcar vídeo como concluído
   */
  @Post('course/:courseId/video/complete')
  @UseGuards(JwtAuthGuard)
  async completeVideo(
    @Param('courseId') courseId: string,
    @Body() body: { videoTitle: string },
    @Request() req: any,
  ) {
    return this.progressService.completeVideo(
      req.user.id,
      courseId,
      body.videoTitle,
    );
  }

  /**
   * Atualizar tempo assistido
   */
  @Post('course/:courseId/watch-time')
  @UseGuards(JwtAuthGuard)
  async updateWatchTime(
    @Param('courseId') courseId: string,
    @Body() body: { minutes: number },
    @Request() req: any,
  ) {
    return this.progressService.updateWatchTime(
      req.user.id,
      courseId,
      body.minutes,
    );
  }

  /**
   * Obter vídeos para continuar assistindo
   */
  @Get('continue-watching')
  @UseGuards(JwtAuthGuard)
  async getContinueWatching(@Request() req: any) {
    return this.progressService.getContinueWatching(req.user.id);
  }

  /**
   * Atualizar progresso
   */
  @Patch('course/:courseId')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Param('courseId') courseId: string,
    @Body() dto: UpdateProgressDto,
    @Request() req: any,
  ) {
    return this.progressService.updateProgress(req.user.id, courseId, dto);
  }

  /**
   * Obter progresso do usuário em todos os cursos
   */
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserProgress(@Request() req: any) {
    return this.progressService.getUserProgress(req.user.id);
  }
}
