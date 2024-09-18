import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables from .env file
  dotenv.config({
    path: '.env',
  });

  // Define HTTPS options
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt')),
  };

  // Create the NestJS application with HTTPS options
  const app = await NestFactory.create(AppModule, { httpsOptions });

  // Enable CORS with permissive settings
  app.enableCors({
    origin: '*', // Allow requests from all domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Start the server on port 5000
  await app.listen(5000);
}
bootstrap();
