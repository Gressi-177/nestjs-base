import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;
}
