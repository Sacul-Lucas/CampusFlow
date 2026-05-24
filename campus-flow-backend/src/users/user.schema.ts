import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, default: 'user' })
  role!: 'teacher' | 'student' | 'admin';

  /**
   * FOTO
   */
  @Prop({
    default: '',
  })
  avatarUrl!: string;

  /**
   * CURSOS CRIADOS
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Course',
      },
    ],
    default: [],
  })
  createdCourses!: Types.ObjectId[];

  /**
   * CURSOS MATRICULADOS
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Course',
      },
    ],
    default: [],
  })
  enrolledCourses!: Types.ObjectId[];

  /**
   * FAVORITOS
   */
  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Course',
      },
    ],
    default: [],
  })
  favoriteCourses!: Types.ObjectId[];

  /**
   * PROGRESSO
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
}

export const UserSchema = SchemaFactory.createForClass(User);
