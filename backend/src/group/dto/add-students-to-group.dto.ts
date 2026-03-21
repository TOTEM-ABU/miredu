import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AddStudentsToGroupDto {
  @ApiProperty({ example: 'Student`s UUID' })
  @IsString()
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: 'Group`s UUID' })
  @IsString()
  @IsUUID()
  groupId: string;
}
