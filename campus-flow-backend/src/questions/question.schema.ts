import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  /**
   * USUÁRIO QUE FEZ A PERGUNTA
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: Types.ObjectId;

  /**
   * CURSO
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  course!: Types.ObjectId;

  /**
   * MENSAGEM/PERGUNTA
   */
  @Prop({
    required: true,
  })
  message!: string;

  /**
   * RESPOSTA
   */
  @Prop({
    default: '',
  })
  answer!: string;

  /**
   * QUEM RESPONDEU
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  answeredBy!: Types.ObjectId | null;

  /**
   * FOI RESPONDIDA?
   */
  @Prop({
    default: false,
  })
  isAnswered!: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
