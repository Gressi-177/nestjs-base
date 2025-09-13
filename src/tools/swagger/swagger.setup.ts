import { getConfig as getAppConfig } from '@/config/app/app.config';
import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = '/swagger';

function setupSwagger(app: INestApplication): OpenAPIObject {
  const appConfig = getAppConfig();
  const appName = appConfig.name;

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`<p>NestJS Boilerplate.</p>`)
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .addServer(appConfig.url, 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    customSiteTitle: appName,
    jsonDocumentUrl: 'swagger/json',
  });

  return document;
}

export default setupSwagger;
