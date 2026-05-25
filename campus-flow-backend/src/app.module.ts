import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { ProgressModule } from './progress/progress.module';
import { ReviewsModule } from './reviews/reviews.module';
import { QuestionsModule } from './questions/questions.module';
import { UploadModule } from './uploads/upload.module';
import { LivesModule } from './lives/lives.module';
import { SeedAdmin } from './users/seed-admin';
import { SeedCourses } from './courses/seed-courses';
import { SeedCoursesFull } from './courses/seed-full-course';
import { SeedLives } from './lives/seed-lives';
import { SeedReviews } from './reviews/seed-reviews';
import { SeedProgress } from './progress/seed-progress';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    ProgressModule,
    ReviewsModule,
    QuestionsModule,
    UploadModule,
    LivesModule,
  ],
  providers: [
    SeedAdmin,
    SeedCourses,
    SeedCoursesFull,
    SeedLives,
    SeedProgress,
    SeedReviews,
  ],
})
export class AppModule {}
