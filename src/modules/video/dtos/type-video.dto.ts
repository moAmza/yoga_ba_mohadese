import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TypeVideoDto {
  @ApiProperty({ required: true, default: 'id' })
  @IsString()
  id: string;

  @ApiProperty({ required: true, default: 'level' })
  @IsString()
  course_id: string;

  @ApiProperty({ required: true, default: 'title' })
  title: string;

  @ApiProperty({ required: true, default: 'www.google.com' })
  link: string;
}
