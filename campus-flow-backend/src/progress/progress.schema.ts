import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Progress extends Document {
  /**
   * USUÁRIO
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
   * VÍDEOS CONCLUÍDOS
   */
  @Prop({
    type: [String],
    default: [],
  })
  completedVideos!: string[];

  /**
   * VÍDEO ATUAL
   */
  @Prop({
    default: '',
  })
  currentVideo!: string;

  /**
   * MÓDULO ATUAL
   */
  @Prop({
    default: '',
  })
  currentModule!: string;

  /**
   * PORCENTAGEM
   */
  @Prop({
    default: 0,
  })
  percentage!: number;

  /**
   * TEMPO ASSISTIDO
   */
  @Prop({
    default: 0,
  })
  watchedMinutes!: number;

  /**
   * CURSO FINALIZADO?
   */
  @Prop({
    default: false,
  })
  completed!: boolean;

  /**
   * ÚLTIMO ACESSO
   */
  @Prop({
    default: Date.now,
  })
  lastAccessAt!: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
