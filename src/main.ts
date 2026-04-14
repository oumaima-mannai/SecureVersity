import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200', // Allow the Angular frontend
    credentials: true, // Allow cookies to be sent across origin
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
