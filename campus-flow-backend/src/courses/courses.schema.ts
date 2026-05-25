import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class CourseVideo {
  @Prop({
    required: true,
  })
  title!: string;

  @Prop()
  description!: string;

  @Prop({
    required: true,
  })
  videoUrl!: string;

  @Prop({
    default: 0,
  })
  durationInMinutes!: number;

  @Prop({
    default: false,
  })
  isPreview!: boolean;

  @Prop()
  thumbnail!: string;
}

@Schema({ _id: false })
export class CourseModuleItem {
  @Prop({
    required: true,
  })
  title!: string;

  @Prop()
  description!: string;

  @Prop({
    type: [CourseVideo],
    default: [],
  })
  videos!: CourseVideo[];
}

@Schema()
export class CourseLive {
  @Prop({
    required: true,
  })
  title!: string;

  @Prop()
  description!: string;

  @Prop({
    required: true,
  })
  liveUrl!: string;

  @Prop({
    required: true,
  })
  scheduledDate!: Date;

  @Prop({
    default: 'scheduled',
  })
  status!: 'scheduled' | 'live' | 'finished';

  @Prop({
    default: '',
  })
  thumbnail!: string;

  @Prop({
    default: '',
  })
  banner!: string;

  @Prop({
    default: () => new Date(),
  })
  createdAt!: Date;
}

@Schema({
  timestamps: true,
})
export class Course extends Document {
  @Prop({
    required: true,
  })
  title!: string;

  @Prop({
    required: true,
  })
  shortDescription!: string;

  @Prop({
    required: true,
  })
  fullDescription!: string;

  @Prop({
    required: true,
  })
  thumbnail!: string;

  @Prop()
  banner!: string;

  @Prop({
    default: 'beginner',
  })
  level!: string;

  @Prop()
  category!: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags!: string[];

  /**
   * PROFESSOR
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  teacher!: Types.ObjectId;

  /**
   * ALUNOS
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  })
  students!: Types.ObjectId[];

  /**
   * MÓDULOS
   */
  @Prop({
    type: [CourseModuleItem],
    default: [],
  })
  modules!: CourseModuleItem[];

  /**
   * LIVES
   */
  @Prop({
    type: [CourseLive],
    default: [],
  })
  lives!: CourseLive[];

  /**
   * PROGRESSOS
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Progress',
      },
    ],
    default: [],
  })
  progress!: Types.ObjectId[];

  /**
   * AVALIAÇÕES
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Review',
      },
    ],
    default: [],
  })
  reviews!: Types.ObjectId[];

  /**
   * PERGUNTAS
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Question',
      },
    ],
    default: [],
  })
  questions!: Types.ObjectId[];

  /**
   * ESTATÍSTICAS
   */
  @Prop({
    default: 0,
  })
  totalStudents!: number;

  @Prop({
    default: 0,
  })
  totalModules!: number;

  @Prop({
    default: 0,
  })
  totalVideos!: number;

  @Prop({
    default: 0,
  })
  totalHours!: number;

  @Prop({
    default: 0,
  })
  averageProgress!: number;

  @Prop({
    default: true,
  })
  published!: boolean;

  @Prop({
    default: true,
  })
  hasCertificate!: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
