import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class InCreateVideo {
  @ApiProperty({ required: true, default: 'title' })
  @IsString()
  title: string;

  @ApiProperty({ required: true, default: 'www.google.com' })
  @IsString()
  link: string;
}
