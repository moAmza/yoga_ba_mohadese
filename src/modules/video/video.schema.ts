import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Video {
  @Prop({ required: true })
  course_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  link: string;

  @Prop()
  deletedAt?: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
