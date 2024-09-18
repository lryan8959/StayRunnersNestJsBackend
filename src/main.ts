import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allow requests from your frontend
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000); // Listen on port 3000
}
bootstrap();
