import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
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
  // app.setGlobalPrefix('api');

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

  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         defaultSrc: ["'self'"],
  //         styleSrc: ["'self'", "'unsafe-inline'"],
  //         scriptSrc: [
  //           "'self'",
  //           "'unsafe-inline'",
  //           'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
  //         ],
  //         connectSrc: ["'self'"],
  //         imgSrc: ["'self'", 'data:', 'https:'],
  //       },
  //     },
  //   }),
  // );

  // Interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  if (env !== 'production') {
    setupSwagger(app);
  }

  // TODO: Add Sentry

  if (env !== 'local') {
    setupGracefulShutdown({ app });
  }

  // TODO: Add basic auth middleware
  // const pathsToIntercept = [
  //   SWAGGER_PATH,
  //   `/api/auth/reference`, // Better Auth API's
  // ];
  // app.use((req, res, next) => {
  //   if (pathsToIntercept.some((p) => req.path.startsWith(p))) {
  //     return basicAuthMiddleware(req, res, next);
  //   }
  //   next();
  // });

  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    // '0.0.0.0',
  );

  // eslint-disable-next-line no-console
  console.info(`\x1b[34m$ Server running at ${await app.getUrl()}`);
  // eslint-disable-next-line no-console
  console.info(`\x1b[34m$ Swagger running at ${await app.getUrl()}/swagger`);

  return app;
}

void bootstrap();
