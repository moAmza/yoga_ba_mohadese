import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
import { BaseError } from '../../errors/base-error';
import { UserService } from '../user/user.service';
import { VideoService } from '../video/video.service';
import { OutGetCoursesDto } from './dtos/out-get-course.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepo: CourseRepo,
    private readonly accessService: AccessService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
  ) {}

  async createCourse(
    courseInfo: InCreateCourse,
  ): Promise<TypeCourseDto | DuplicateError> {
    const courseModel = await this.courseRepo.create({
      ...courseInfo,
      end_date:
        courseInfo.level === 1 ? new Date(2100, 1) : courseInfo.end_date,
    });
    const courseFull = CourseDao.convertOne(courseModel);
    const access = await (
      await this.userService.getAdminUsers()
    ).map((user) =>
      this.accessService.createAccess({
        course_id: courseFull.id,
        user_id: user.id,
      }),
    );
    return courseFull;
  }

  async editCourse(
    course_id: string,
    courseInfo: InCreateCourse,
  ): Promise<OutGetCoursesDto | BadRequestError | NotFoundError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(course_id);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    await this.courseRepo.editById(
      new mongoose.Types.ObjectId(course_id),
      courseInfo,
    );
    const course = await this.courseRepo.getById(
      new mongoose.Types.ObjectId(course_id),
    );
    if (course === null) return new NotFoundError('Course');
    const courseFull = CourseDao.convertOne(course);
    const videos = await this.videoService.getVideosByCourseId(course.id);
    if (videos instanceof BaseError) return videos.throw();
    return { course: { ...courseFull, videos } };
  }

  async getCourseById(
    userId: string,
    courseId: string,
  ): Promise<TypeCourseDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(courseId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    if (!this.accessService.checkUserAccessToCourse(userId, courseId))
      return new NotFoundError('Course');
    const courseModel = await this.courseRepo.getById(
      new mongoose.Types.ObjectId(courseId),
    );
    if (!courseModel) return new NotFoundError('Course');
    const course = CourseDao.convertOne(courseModel);

    return course;
  }

  async getCoursesWithVidoes(
    userId: string,
    courseId: string,
  ): Promise<OutGetCoursesDto | NotFoundError | BadRequestError> {
    const course = await this.getCourseById(userId, courseId);
    if (course instanceof BaseError) return course;
    const videos = await this.videoService.getVideosByUserIdAndCourseId(
      userId,
      course.id,
    );
    if (videos instanceof BaseError) return videos.throw();
    return { course: { ...course, videos } };
  }

  async doesCourseExists(course_id: string): Promise<boolean> {
    const course = await this.courseRepo.getById(
      new mongoose.Types.ObjectId(course_id),
    );
    return course ? true : false;
  }

  async deleteCourseById(
    courseId: string,
  ): Promise<OutGetCoursesDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(courseId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const courseModel = await this.courseRepo.deleteById(
      new mongoose.Types.ObjectId(courseId),
    );
    if (!courseModel) return new NotFoundError('Course');
    const course = CourseDao.convertOne(courseModel);
    const videos = await this.videoService.getVideosByCourseId(course.id);
    if (videos instanceof BaseError) return videos.throw();
    return { course: { ...course, videos } };
  }

  async getAllCourses(
    userId: string,
  ): Promise<TypeCourseDto[] | BadRequestError> {
    const userAccesses = await this.accessService.getAccessesByUserId(userId);
    if (userAccesses instanceof BaseError) return userAccesses.throw();
    const courses = await Promise.all(
      userAccesses.map((c) =>
        this.courseRepo.getById(new mongoose.Types.ObjectId(c.course_id)),
      ),
    );

    return courses.filter((x) => x).map(CourseDao.convertOne);
  }

  async getPaginatedCourses(
    userId: string,
    { page, num }: InGetPaginatedCourses,
  ): Promise<OutGetPaginatedCoursesDto | BadRequestError> {
    const courses = await this.getAllCourses(userId);
    if (courses instanceof BadRequestError) return courses.throw();
    const res: OutGetPaginatedCoursesDto = {
      count: courses.length,
      values: courses.slice(page - 1 * num, num),
    };

    return res;
  }
}
