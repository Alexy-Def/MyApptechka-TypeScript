import fs from 'fs';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { AppLoggerFactory } from '@modules/core/logger';
import * as config from 'config';
import * as packageJson from 'package.json';

import { AppModule } from './app.module';

const API_PREFIX = 'api/v1';

const setupSwagger = (app: NestExpressApplication): void => {
  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  fs.writeFileSync('./api-openapi.json', JSON.stringify(document));

  if (config.API.ENABLE_SWAGGER) {
    SwaggerModule.setup(`${API_PREFIX}/doc`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
};

async function bootstrap(): Promise<void> {
  const port = config.API.PORT;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: AppLoggerFactory.createLogger(),
  });

  if (config.CORS) {
    const corsOptions = {
      origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void): void => {
        callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
      headers: ['x-user', 'X-Signature', 'accept', 'content-type', 'authorization'],
    };

    app.use(cors(corsOptions));
  }

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  setupSwagger(app);
  app.use(cookieParser());

  await app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
