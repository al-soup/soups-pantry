import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform the payload to the DTO type
      whitelist: true, // Strip out unknown properties
      forbidNonWhitelisted: true, // Throw an error if a non-whitelisted property is found
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Soup's Pantry API")
    .setDescription("API documentation for Soup's Pantry")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
