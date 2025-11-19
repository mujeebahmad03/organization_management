import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy:
        configService.get('app.nodeEnv') === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Setup Pino logger
  app.useLogger(app.get(Logger));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Organization Management API')
    .setDescription(
      'A comprehensive API for managing departments and sub-departments with JWT authentication. ' +
        'This API provides both REST and GraphQL endpoints. Use the REST endpoints for Swagger documentation, ' +
        'or access the GraphQL Playground at /graphql for interactive GraphQL queries and mutations.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Departments', 'Department management endpoints')
    .addTag('Sub-Departments', 'Sub-department management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get<number>('app.port') ?? 3000;

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
  console.log(`Swagger API Documentation: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('Bootstrap error:', error);
  process.exit(1);
});
