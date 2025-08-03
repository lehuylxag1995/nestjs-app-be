import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Setup validation auto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Bỏ qua các DTO không validation
      transform: true, // Auto chuyển đổi string(mặc định) -> int(controller)
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🙌 Server: http://localhost:3000`);
}
bootstrap();
