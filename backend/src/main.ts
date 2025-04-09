// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe
import { ConfigService } from '@nestjs/config'; // Import ConfigService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Get ConfigService instance
  const port = configService.get<number>('PORT') || 3000; // Get PORT from .env

  // Enable CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: 'http://localhost:5173', // Or your frontend URL (Vite default)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically remove properties without decorators
    transform: true, // Automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    transformOptions: {
       enableImplicitConversion: true, // Convert query params etc. based on TS type
    },
  }));


  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();