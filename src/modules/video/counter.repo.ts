import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { Counter } from './counter.schema';

@Injectable()
export class CounterRepo {
  constructor(
    @InjectModel(Counter.name) private readonly model: Model<Counter>,
  ) {}

  async create(counterInfo: Counter): Promise<MongoDoc<Counter>> {
    return await this.model.create(counterInfo);
  }

  async getCountByVideoAndUserId(
    user_id: mongoose.Types.ObjectId,
    video_id: mongoose.Types.ObjectId,
  ): Promise<number> {
    return await this.model.find({ user_id, video_id }).count();
  }
}
