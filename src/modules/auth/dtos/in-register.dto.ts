import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class InRegisterDto {
  @ApiProperty({ required: true, default: 'username' })
  @IsString()
  @MinLength(8)
  @Transform((param) => param.value.toLowerCase())
  username: string;

  @ApiProperty({ required: true, default: 'password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: true, default: 'firstname' })
  @IsString()
  firstname: string;

  @ApiProperty({ required: true, default: 'lastnamee' })
  @IsString()
  lastname: string;

  @ApiProperty({ required: false, default: 'email@email.email' })
  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email?: string;

  @ApiProperty({ required: false, default: '09120000000' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('IR')
  phone?: string;
}
