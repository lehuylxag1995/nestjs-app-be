import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Setup validation auto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Bỏ qua các DTO không validation
      transform: true, // bật chức năng auto. Nhưng cần khai báo rõ @Type() trong DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🙌 Server: http://localhost:3000`);
}
bootstrap();
