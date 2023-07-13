import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { CourseRepo } from './course.repo';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { DuplicateError } from '../../errors/duplicate-error';
import { InGetPaginatedCourses } from './dtos/in-get-paginated-courses.dto';
import { OutGetPaginatedCoursesDto } from './dtos/out-get-paginated-courses.dto';
import { TypeCourseDto } from './dtos/type-course.dto';
import { InCreateCourse } from './dtos/in-create-course.dto';
import { CourseDao } from './daos/course.dao';
import { AccessService } from './access.service';
import { BaseError } from 'src/errors/base-error';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepo,
    private accessService: AccessService,
  ) {}

  async createCourse(
    courseInfo: InCreateCourse,
  ): Promise<TypeCourseDto | DuplicateError> {
    const courseModel = await this.courseRepo.create(courseInfo);
    const courseFull = CourseDao.convertOne(courseModel);
    const access = this.accessService.createAccess({
      course_id: courseFull.id,
      level: 1,
      user_id: '1',
    });
    return courseFull;
  }

  async getCourseById(
    userId: string,
    courseId: string,
  ): Promise<TypeCourseDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(courseId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    if (!this.accessService.checkUserAccessToCourse(userId, courseId))
      return new NotFoundError('Course');
    const courseModel = await this.courseRepo.getById(courseId);
    if (!courseModel) return new NotFoundError('Course');
    const course = CourseDao.convertOne(courseModel);

    return course;
  }

  async getPaginatedCourses(
    userId: string,
    { page, num }: InGetPaginatedCourses,
  ): Promise<OutGetPaginatedCoursesDto | BadRequestError> {
    const userAccesses = await this.accessService.getAccessesByUserId(userId);
    if (userAccesses instanceof BaseError) return userAccesses.throw();
    const courses = await Promise.all(
      userAccesses.map((c) => this.courseRepo.getById(c.course_id)),
    );

    const res: OutGetPaginatedCoursesDto = {
      count: courses.length,
      values: courses.map(CourseDao.convertOne).slice(page - 1 * num, num),
    };

    return res;
  }
}
