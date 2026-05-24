import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from './progress.schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Course, CourseSchema } from '../courses/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Progress.name,
        schema: ProgressSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
