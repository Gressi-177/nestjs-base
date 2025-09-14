import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

import { AppModule } from './app.module';
import { GlobalConfig } from './config/config.type';
import setupSwagger from './tools/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService<GlobalConfig>);
  const env = configService.getOrThrow('app.nodeEnv', { infer: true });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(errors),
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.enableCors({
    origin: configService.getOrThrow('app.corsOrigin', { infer: true }),
    methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
  });

  app.use(
    helmet.hidePoweredBy(),
    helmet.frameguard({ action: 'sameorigin' }),
    helmet.noSniff(),
  );

  if (env !== 'production') {
    setupSwagger(app);
  }

  if (env !== 'local') {
    setupGracefulShutdown({ app });
  }

  // TODO: Add Sentry integration
  // TODO: Add basic auth middleware for sensitive endpoints
  // const pathsToIntercept = [SWAGGER_PATH, `/api/auth/reference`];

  await app.listen(configService.getOrThrow('app.port', { infer: true }));

  // eslint-disable-next-line no-console
  console.info(`\x1b[34m$ Server running at ${await app.getUrl()}`);
  // eslint-disable-next-line no-console
  console.info(`\x1b[34m$ Swagger running at ${await app.getUrl()}/swagger`);

  return app;
}

void bootstrap();
