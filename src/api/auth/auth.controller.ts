import { createResponse } from '@/common/interfaces/response.interface';
import { GlobalConfig } from '@/config/config.type';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService<GlobalConfig>,
    private authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return createResponse<UserEntity>(
      user,
      'User registered successfully',
      201,
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh tokens',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    const result = await this.authService.login(user.id);
    return createResponse(result, 'Login successful');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new access and refresh tokens',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return createResponse(result, 'Token refreshed successfully');
  }

  // Temporarily commented out Google OAuth routes
  /*
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login' })
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google auth callback' })
  @ApiResponse({ status: 302, description: 'Redirect after Google login' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    // const frontendUrl = this.configService.getOrThrow('app.corsOrigin', {
    //   infer: true,
    // });
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        req.user.id,
      );

      return res.redirect(
        `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      );
    } catch (error: any) {
      return res.redirect(`${frontendUrl}/auth/error?error=${error.message}`);
    }
  }
  */

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user (revoke refresh token)' })
  @ApiResponse({ status: 200, description: 'Refresh token revoked' })
  async logout(@Req() req) {
    await this.authService.revokeRefreshToken(req.user.id);
    return createResponse(null, 'Logout successful');
  }
}
