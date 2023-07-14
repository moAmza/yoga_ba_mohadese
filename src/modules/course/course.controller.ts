import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
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
import { InGetPaginatedCourses } from './dtos/in-get-paginated-courses.dto';
import { OutGetPaginatedCoursesDto } from './dtos/out-get-paginated-courses.dto';
import { OutGetCoursesDto } from './dtos/out-get-course.dto';
import { InCreateCourse } from './dtos/in-create-course.dto';
import { DuplicateError } from 'src/errors/duplicate-error';
import { VideoService } from '../video/video.service';
import { BaseError } from 'src/errors/base-error';

@UseGuards(RolesGuard)
@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly videoService: VideoService,
  ) {}

  @Get('/')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all courses' })
  async getPaginatedCourses(
    @Req() { userId }: { userId: string },
    @Query() input: InGetPaginatedCourses,
  ): Promise<OutGetPaginatedCoursesDto> {
    const courses = await this.courseService.getPaginatedCourses(userId, input);
    if (courses instanceof BadRequestError) return courses.throw();
    return courses;
  }

  @Post('/')
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create courses' })
  async createCourse(
    @Req() { userId }: { userId: string },
    @Body() input: InCreateCourse,
  ): Promise<OutGetCoursesDto> {
    const course = await this.courseService.createCourse(input);
    if (course instanceof DuplicateError) return course.throw();
    return { course: { ...course, videos: [] } };
  }

  @Get(':course_id')
  @Role('USER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get single course by id' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async getCourse(
    @Req() { userId }: { userId: string },
    @Param('course_id') courseId: string,
  ): Promise<OutGetCoursesDto> {
    const course = await this.courseService.getCourseById(userId, courseId);
    if (course instanceof NotFoundError) return course.throw();
    if (course instanceof BadRequestError) return course.throw();
    const videos = await this.videoService.getVideosByCourseId(course.id);
    if (videos instanceof BaseError) return videos.throw();
    return { course: { ...course, videos } };
  }

  @Put(':course_id')
  @Role('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'modify course by id' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  async modifyCourse(
    @Req() { userId }: { userId: string },
    @Param('course_id') courseId: string,
    @Body() input: InCreateCourse,
  ): Promise<OutGetCoursesDto> {
    const new_course = await this.courseService.editCourse(courseId, input);
    if (new_course instanceof BaseError) return new_course.throw();
    const videos = await this.videoService.getVideosByCourseId(new_course.id);
    if (videos instanceof BaseError) return videos.throw();
    return { course: { ...new_course, videos } };
  }
}
