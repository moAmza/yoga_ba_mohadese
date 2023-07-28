import { Inject, Injectable, forwardRef } from '@nestjs/common';
import mongoose from 'mongoose';
import { VideoRepo } from './video.repo';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { DuplicateError } from '../../errors/duplicate-error';
import { TypeVideoDto } from './dtos/type-video.dto';
import { InCreateVideo } from './dtos/in-create-video.dto';
import { VideoDao } from './daos/course.dao';
import { CourseService } from '../course/course.service';

@Injectable()
export class VideoService {
  constructor(
    private readonly videoRepo: VideoRepo,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}

  async createVideo(
    course_id: string,
    videoInfo: InCreateVideo,
  ): Promise<TypeVideoDto | DuplicateError | BadRequestError | NotFoundError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(course_id);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const course = await this.courseService.doesCourseExists(course_id);
    if (!course) return new NotFoundError('Course');
    let existing_video = await this.videoRepo.getByNumAndCourseId(
      new mongoose.Types.ObjectId(course_id),
      videoInfo.num,
    );
    if (existing_video) return new DuplicateError('Video');
    const videoModel = await this.videoRepo.create({
      ...videoInfo,
      course_id: new mongoose.Types.ObjectId(course_id),
    });
    const video = VideoDao.convertOne(videoModel);

    return video;
  }

  async getVideosByCourseId(
    courseId: string,
  ): Promise<TypeVideoDto[] | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(courseId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    let videoModels = await this.videoRepo.getByCourseId(
      new mongoose.Types.ObjectId(courseId),
    );
    return videoModels.map(VideoDao.convertOne);
  }
}
