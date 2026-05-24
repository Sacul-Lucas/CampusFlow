import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  /**
   * USUÁRIO QUE FEZ A AVALIAÇÃO
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  /**
   * CURSO AVALIADO
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course!: Types.ObjectId;

  /**
   * CLASSIFICAÇÃO (1-5)
   */
  @Prop({
    required: true,
    min: 1,
    max: 5,
  })
  rating!: number;

  /**
   * COMENTÁRIO
   */
  @Prop({
    default: '',
  })
  comment!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
