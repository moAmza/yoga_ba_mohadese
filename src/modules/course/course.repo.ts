import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';
import mongoose from 'mongoose';

@Injectable()
export class CourseRepo {
  constructor(
    @InjectModel(Course.name) private readonly model: Model<Course>,
  ) {}

  async create(courseInfo: Course): Promise<MongoDoc<Course>> {
    return await this.model.create(courseInfo);
  }

  async editById(
    course_id: mongoose.Types.ObjectId,
    courseInfo: Course,
  ): Promise<boolean> {
    return (await this.model.updateOne({ _id: course_id }, courseInfo))
      .acknowledged;
  }

  async getById(
    course_id: mongoose.Types.ObjectId,
  ): Promise<MongoDoc<Course> | null> {
    return await this.model.findById(course_id);
  }

  async getPaginatedCourses(
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
