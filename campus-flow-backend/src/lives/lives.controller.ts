import { Controller, Get, Param } from '@nestjs/common';
import { LivesService, LiveWithCourse } from './lives.service';

@Controller('api/lives')
export class LivesController {
  constructor(private readonly livesService: LivesService) {}

  @Get()
  async getAllLives(): Promise<{ success: true; message: LiveWithCourse[] }> {
    const lives = await this.livesService.listLives();
    return {
      success: true,
      message: lives,
    };
  }

  @Get('course/:courseId')
  async getLivesByCourse(
    @Param('courseId') courseId: string,
  ): Promise<{ success: true; message: LiveWithCourse[] }> {
    const lives = await this.livesService.getLivesByCourse(courseId);
    return {
      success: true,
      message: lives,
    };
  }
}
