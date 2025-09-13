import { DatabaseConfig } from '@/config/database/database-config.type';
import { AppConfig } from './app/app-config.type';
import { AuthConfig } from './auth/auth-config.type';

export type GlobalConfig = {
  app: AppConfig;
  database: DatabaseConfig;
  // redis: RedisConfig;
  auth: AuthConfig;
  // mail: MailConfig;
  // sentry: SentryConfig;
  // queue: BullConfig;
  // throttler: ThrottlerConfig;
  // aws: AwsConfig;
  // grafana: GrafanaConfig;
};
