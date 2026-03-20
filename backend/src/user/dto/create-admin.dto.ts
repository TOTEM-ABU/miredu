import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'Aziz' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'aziz@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 8)
  password: string;

  @ApiProperty({ example: 'https://example.com.png/' })
  @IsString()
  avatar: string;
}
