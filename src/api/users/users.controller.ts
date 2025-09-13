import { createResponse } from '@/common/interfaces/response.interface';
import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile (protected)' })
  async getProfile(@Request() req) {
    return createResponse(req.user, 'Profile retrieved successfully');
  }

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile (firstName, lastName, email, picture)',
  })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateProfile(
      req.user.id,
      updateUserDto,
    );
    return createResponse(updatedUser, 'Profile updated successfully');
  }

  @Patch('password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const updatedUser = await this.usersService.changePassword(
      req.user.id,
      changePasswordDto,
    );
    return createResponse(updatedUser, 'Password changed successfully');
  }
}
