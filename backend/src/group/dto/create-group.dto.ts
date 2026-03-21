import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { CourseType } from 'src/generated/prisma/enums';

export class CreateGroupDto {
  @ApiProperty({ example: 'Group-007' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Math group!' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Math | English' })
  @IsEnum(CourseType)
  @IsNotEmpty()
  courseType: CourseType;

  @ApiProperty({ example: 550000 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 'Teacher`s UUID' })
  @IsUUID()
  teacherId?: string;
}
