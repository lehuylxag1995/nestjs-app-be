import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Cài đặt CORS (cho phép/từ chối request từ domain bên ngoài vào app)
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép cookie/authorization header
  });

  //Cài đặt bảo mật cho HTTP cơ bản
  app.use(helmet());

  //Cài đặt Pipes toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true, // Dừng tại lỗi đầu tiên
      whitelist: true, // Bỏ qua các DTO không validation
      transform: true, // bật chức năng auto. Nhưng cần khai báo rõ @Type() trong DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🙌 Server: http://localhost:3000`);
}
bootstrap();
