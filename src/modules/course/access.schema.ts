import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Access {
  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  user_id: string;
}

export const AccessSchema = SchemaFactory.createForClass(Access);
