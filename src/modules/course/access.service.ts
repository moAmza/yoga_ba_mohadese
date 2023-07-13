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
import { AccessRepo } from './access.repo';
import { InAccessCourse } from './dtos/in-create-access.dto';
import { OutGetCoursesDto } from './dtos/out-get-course.dto';
import { AccessDao } from './daos/access.dao';
import { TypeAccessDto } from './dtos/type-access.dto';

@Injectable()
export class AccessService {
  constructor(private readonly accessRepo: AccessRepo) {}

  async createAccess(
    accessInfo: InAccessCourse,
  ): Promise<TypeAccessDto | DuplicateError> {
    const accessModel = await this.accessRepo.create(accessInfo);
    const accessFull = AccessDao.convertOne(accessModel);

    return accessFull;
  }

  async getAccessesByUserId(
    userId: string,
  ): Promise<TypeAccessDto[] | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const accessModel = await this.accessRepo.getByUserId(userId);
    if (!accessModel) return new NotFoundError('Course');
    const access = accessModel.map(AccessDao.convertOne);

    return access;
  }

  async checkUserAccessToCourse(
    userId: string,
    courseId: string,
  ): Promise<boolean | BadRequestError> {
    const isIdValid =
      mongoose.Types.ObjectId.isValid(courseId) &&
      mongoose.Types.ObjectId.isValid(courseId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    let access = await this.accessRepo.getByUserAndCourseId(userId, courseId);
    if (access.toJSON() === null) return false;
    else return true;
  }
}
