import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { LoggerModule } from 'nestjs-pino';
import { ApiModule } from './api/api.module';
import appConfig from './config/app/app.config';
import authConfig from './config/auth/auth.config';
import databaseConfig from './config/database/database.config';
import useLoggerFactory from './tools/logger/logger-factory';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: '.env',
    }),
    GracefulShutdownModule.forRoot({
      cleanup: (...args) => {
        // eslint-disable-next-line no-console
        console.log('App shutting down...', args);
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: useLoggerFactory,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    ApiModule,
  ],
})
export class AppModule {}
