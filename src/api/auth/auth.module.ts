import { GlobalConfig } from '@/config/config.type';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from './entities/user.entity';
// import { GoogleStrategy } from './strategies/google.strategy'; // Temporarily commented out
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => ({
        secret: configService.getOrThrow('auth.jwtSecret', { infer: true }),
        signOptions: {
          expiresIn: configService.getOrThrow('auth.jwtExpirationTime', {
            infer: true,
          }),
        },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy /* , GoogleStrategy */], // GoogleStrategy temporarily commented out
  controllers: [AuthController],
})
export class AuthModule {}
