import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoRepo } from './video.repo';
import { Video, VideoSchema } from './video.schema';
import { VideoService } from './video.service';
import { CourseController } from './video.controller';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    forwardRef(() => CourseModule),
  ],
  controllers: [CourseController],
  providers: [VideoService, VideoRepo],
  exports: [VideoService],
})
export class VideoModule {}
