import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar prefijo global para que todas las rutas empiecen con /api
  app.setGlobalPrefix('api'); // ⬅️ ¡ESTA LÍNEA ES LA QUE TE FALTA!

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Maleta Didáctica')
    .setDescription('Backend de Evaluación 3')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger estará en localhost:3000/api

  await app.listen(4000);
}
bootstrap();