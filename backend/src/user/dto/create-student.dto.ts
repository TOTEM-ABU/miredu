import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Aziz' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Azizov' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'aziz@gmail.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '+998XXXXXXXXX' })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '+998XXXXXXXXX' })
  @IsString()
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  parentsPhoneNumber: string;

  @ApiProperty({ example: 'https://example.com.png/' })
  @IsString()
  @IsNotEmpty()
  avatar: string;
}
