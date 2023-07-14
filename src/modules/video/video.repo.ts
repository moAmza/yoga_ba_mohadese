import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from './video.schema';

@Injectable()
export class VideoRepo {
  constructor(@InjectModel(Video.name) private readonly model: Model<Video>) {}

  async create(videoInfo: Video): Promise<MongoDoc<Video>> {
    return await this.model.create(videoInfo);
  }

  async getById(videoId: string): Promise<MongoDoc<Video> | null> {
    return await this.model.findById(videoId);
  }

  async getByCourseId(course_id: string): Promise<MongoDoc<Video>[]> {
    return await this.model.find({ course_id });
  }
}
