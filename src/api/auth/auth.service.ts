import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserEntity } from './entities/user.entity';

// Temporarily commented out Google OAuth related code
/*
interface GoogleUser {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}
*/

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<{ id: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id };
  }

  async register({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      this.logger.warn(`Email already exists: ${email}`);
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const savedUser = await this.userRepository.save(user);

    // Auto-assign Free plan to new user - commented out for MVP
    // try {
    //   await this.subscriptionService.autoAssignFreePlan(savedUser.id);
    //   this.logger.log(`Auto-assigned Free plan to new user ${savedUser.id}`);
    // } catch (error) {
    //   this.logger.error(`Failed to auto-assign Free plan to user ${savedUser.id}:`, error);
    //   // Don't throw error here to avoid blocking user registration
    // }

    return savedUser;
  }

  async login(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      email: user.email,
      sub: user.id,
    });
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async generateTokens(payload: {
    email: string;
    sub: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, refreshToken },
      });

      if (!user) {
        this.logger.warn(`User not found or token doesn't match`);
        return Promise.reject(
          new UnauthorizedException('Invalid refresh token'),
        );
      }

      const newPayload = { email: user.email, sub: user.id };
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(newPayload);

      user.refreshToken = newRefreshToken;
      await this.userRepository.save(user);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logger.error(`Refresh token error: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        this.logger.warn(`User not found: ${userId}`);
        return;
      }
      user.refreshToken = null;
      await this.userRepository.save(user);
    } catch (e) {
      this.logger.error(`Revoke refresh token error: ${e.message}`);
    }
  }

  async validateJwtUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // Temporarily commented out Google OAuth validation
  /*
  async validateGoogleUser({
    googleId,
    email,
    firstName,
    lastName,
    picture,
  }: GoogleUser): Promise<UserEntity> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (user && user.googleId) {
        return user;
      }
      if (user && !user.googleId) {
        throw new BadRequestException('User already exists');
      }

      const newUser = await this.usersService.create({
        googleId,
        email,
        firstName,
        lastName,
        picture,
        isEmailVerified: true,
      });

      // Auto-assign Free plan to new Google user - commented out for MVP
      // try {
      //   await this.subscriptionService.autoAssignFreePlan(newUser.id);
      //   this.logger.log(`Auto-assigned Free plan to new Google user ${newUser.id}`);
      // } catch (error) {
      //   this.logger.error(`Failed to auto-assign Free plan to Google user ${newUser.id}:`, error);
      //   // Don't throw error here to avoid blocking user registration
      // }

      return newUser;
    } catch (error) {
      this.logger.error(
        `Error in validateOrCreateGoogleUser: ${error.message}`,
      );
      throw new Error('Failed to process Google user');
    }
  }
  */
}
