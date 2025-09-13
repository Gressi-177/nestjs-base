import validateConfig from '@/utils/config/validate-config';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRATION_TIME: string;

  @IsString()
  @IsOptional()
  BASIC_AUTH_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  BASIC_AUTH_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  GITHUB_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  GITHUB_CLIENT_SECRET: string;
}

export function getConfig(): AuthConfig {
  return {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
    basicAuth: {
      username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD,
    },
    oAuth: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      },
    },
  };
}

export default registerAs<AuthConfig>('auth', () => {
  // eslint-disable-next-line no-console
  console.info(`Registering AuthConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return getConfig();
});
