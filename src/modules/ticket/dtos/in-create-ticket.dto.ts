import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class InCreateTicket {
  @ApiProperty({ required: true, default: 'forgot_password' })
  @IsString()
  type: string;

  @ApiProperty({ required: true, default: 'firstname' })
  @IsString()
  firstname: string;

  @ApiProperty({ required: true, default: 'lastname' })
  @IsString()
  lastname: string;

  @ApiProperty({ required: true, default: 'description' })
  @IsString()
  description: string;

  @ApiProperty({ required: true, default: '09120000000' })
  @IsString()
  phone: string;
}
