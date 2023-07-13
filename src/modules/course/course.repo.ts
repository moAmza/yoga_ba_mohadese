import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';

@Injectable()
export class CourseRepo {
  constructor(
    @InjectModel(Course.name) private readonly model: Model<Course>,
  ) {}

  async create(userInfo: Course): Promise<MongoDoc<Course>> {
    return await this.model.create(userInfo);
  }

  async getById(userId: string): Promise<MongoDoc<Course> | null> {
    return await this.model.findById(userId);
  }

  async getPaginatedCourses(
    user_id: string,
    limit: number,
    skip: number,
  ): Promise<PaginatedType<MongoDoc<Course>>> {
    return (
      await this.model.aggregate([
        {
          $facet: {
            values: [{ $skip: skip }, { $limit: limit }],
            count: [{ $count: 'count' }],
          },
        },
        { $set: { count: '$count.count' } },
        { $unwind: { path: '$count', preserveNullAndEmptyArrays: true } },
      ])
    )[0];
  }
}
