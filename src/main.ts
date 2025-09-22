import { BadRequestException, ValidationPipe } from '@nestjs/common';
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
      stopAtFirstError: true, // chỉ dừng validation trong phạm vi 1 field.
      whitelist: true, // Tự động loại bỏ (strip) tất cả các property không được định nghĩa trong DTO.
      forbidNonWhitelisted: true, // Nếu có field không khai báo trong DTO → ném lỗi luôn thay vì âm thầm bỏ qua.
      forbidUnknownValues: true, // toàn bộ object được validate không phải là một object hợp lệ → thì ném lỗi.
      transform: true, // bật chức năng auto. Nhưng cần khai báo rõ @Type() trong DTO
      // Tùy chỉnh xuất hiện lỗi một lần theo thứ tựF
      exceptionFactory: (errors) => {
        if (!errors || errors.length === 0) {
          return new BadRequestException('Dữ liệu không hợp lệ');
        }

        const firstError = errors[0];

        // Nếu có lỗi constraints (class-validator)
        if (firstError.constraints) {
          const firstConstraintKey = Object.keys(firstError.constraints)[0];
          const firstMessage = firstError.constraints[firstConstraintKey];
          return new BadRequestException(firstMessage);
        }

        // Nếu là lỗi khác (ví dụ: whitelist, forbidNonWhitelisted)
        if (firstError.children && firstError.children.length > 0) {
          // xử lý nested errors
          const childError = firstError.children[0];
          if (childError.constraints) {
            const firstConstraintKey = Object.keys(childError.constraints)[0];
            const firstMessage = childError.constraints[firstConstraintKey];
            return new BadRequestException(firstMessage);
          }
        }

        // fallback
        return new BadRequestException('Dữ liệu không hợp lệ');
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🙌 Server: http://localhost:3000`);
}
bootstrap();
