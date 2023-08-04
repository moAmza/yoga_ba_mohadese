import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { VideoService } from './video.service';
import { BaseError } from '../../errors/base-error';
import { OutGetCoursesDto } from '../course/dtos/out-get-course.dto';
import { InCreateVideo } from './dtos/in-create-video.dto';
import { DuplicateError } from '../../errors/duplicate-error';
import { CourseService } from '../course/course.service';
import { OutCreateVideo } from './dtos/out-create-video.dto';
import { OutStatusDto } from 'src/dtos/out-status.dto';

@UseGuards(RolesGuard)
@Controller('')
export class CourseController {
  constructor(private readonly videoService: VideoService) {}

  @Post('courses/:course_id/videos')
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create new video' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async createVideo(
    @Req() { userId }: { userId: string },
    @Param('course_id') courseId: string,
    @Body() videoInfo: InCreateVideo,
  ): Promise<OutCreateVideo> {
    const video = await this.videoService.createVideo(courseId, videoInfo);
    if (video instanceof BaseError) return video.throw();
    return { video };
  }

  @Delete('videos/:video_id')
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'remove video by id' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async deleteVideo(
    @Req() { userId }: { userId: string },
    @Param('video_id') videoId: string,
  ): Promise<OutStatusDto> {
    const video = await this.videoService.deleteVideo(videoId);
    if (video instanceof BaseError) return video.throw();
    return { status: true };
  }
}
