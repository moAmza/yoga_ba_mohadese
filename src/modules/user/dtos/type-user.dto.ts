import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeCourseDto } from 'src/modules/course/dtos/type-course.dto';

export class TypeUserDto {
  @ApiProperty({ required: true, default: 'id' })
  @IsString()
  id: string;

  @ApiProperty({ required: true, default: 'username' })
  username: string;

  @ApiProperty({ required: true, default: 'firstname' })
  firstname: string;

  @ApiProperty({ required: true, default: 'lastname' })
  lastname: string;

  @ApiProperty({ required: true, default: 9120000000 })
  phone: number;

  @ApiProperty({ required: true, default: 'test@test.test' })
  email: string;

  @ApiProperty({ required: true, default: new Date() })
  createdAt: Date;

  @ApiProperty({ required: true, default: new Date() })
  courses: TypeCourseDto[];
}
