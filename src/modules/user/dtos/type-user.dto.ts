import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeCourseDto } from '../../../modules/course/dtos/type-course.dto';

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

  @ApiProperty({ required: true, default: '09120000000' })
  phone: string;

  @ApiProperty({ required: true, default: 'test@test.test' })
  email: string;

  @ApiProperty({ required: true, default: new Date() })
  createdAt: Date;

  @ApiProperty({ required: true, default: new Date() })
  courses: TypeCourseDto[];

  @ApiProperty({ required: true, default: false })
  is_admin: boolean;
}
