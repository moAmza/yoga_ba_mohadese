import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class InRegisterDto {
  @ApiProperty({ required: true, default: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ required: true, default: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ required: true, default: 'firstname' })
  @IsString()
  firstname: string;

  @ApiProperty({ required: true, default: 'lastnamee' })
  @IsString()
  lastname: string;

  @ApiProperty({ required: true, default: 'email@email.email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, default: '09120000000' })
  @IsString()
  @IsPhoneNumber('IR')
  phone: string;
}
