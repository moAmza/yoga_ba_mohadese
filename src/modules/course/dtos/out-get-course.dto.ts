import { ApiProperty } from '@nestjs/swagger';
import { TypeCourseDto } from './type-course.dto';

export class OutGetCoursesDto {
  @ApiProperty({ required: true })
  course: TypeCourseDto;
}
