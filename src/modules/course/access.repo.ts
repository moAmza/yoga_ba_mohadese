import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Access } from './access.schema';

@Injectable()
export class AccessRepo {
  constructor(
    @InjectModel(Access.name) private readonly model: Model<Access>,
  ) {}

  async create(userInfo: Access): Promise<MongoDoc<Access>> {
    return await this.model.create(userInfo);
  }

  async getByUserId(userId: string): Promise<MongoDoc<Access>[] | null> {
    return await this.model.find({ userId });
  }

  async getByUserAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<MongoDoc<Access> | null> {
    return await this.model.findOne({ userId, courseId });
  }
}
