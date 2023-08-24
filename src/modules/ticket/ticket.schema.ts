import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ticket {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  phone: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
