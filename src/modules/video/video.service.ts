import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { VideoRepo } from './video.repo';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { DuplicateError } from '../../errors/duplicate-error';
import { TypeVideoDto } from './dtos/type-video.dto';
import { InCreateVideo } from './dtos/in-create-video.dto';
import { VideoDao } from './daos/course.dao';

@Injectable()
export class VideoService {
  constructor(private readonly videoRepo: VideoRepo) {}

  async createVideo(
    course_id: string,
    videoInfo: InCreateVideo,
  ): Promise<TypeVideoDto | DuplicateError> {
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
    let videoModels = await this.videoRepo.getByCourseId(courseId);
    return videoModels.map(VideoDao.convertOne);
  }
}
