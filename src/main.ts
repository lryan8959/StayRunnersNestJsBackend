import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {


  // Define HTTPS options
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt')),
  };

  const keyPath = path.resolve(__dirname, '../ssl/server.key');
  const certPath = path.resolve(__dirname, '../ssl/server.crt');

  // Read the certificate files
  const key = fs.readFileSync(keyPath);
  const cert = fs.readFileSync(certPath);
  console.log('SSL Key:', key.toString());
  console.log('SSL Certificate:', cert.toString());
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
