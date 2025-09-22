import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

export const AppConfigModule = [
  //Cấu hình Config Service
  ConfigModule.forRoot({
    isGlobal: true,
  }),

  // Rate-Limit (Giới hạn truy vấn vào API)
  ThrottlerModule.forRoot({
    throttlers: [
      {
        ttl: 60000,
        limit: 3,
      },
    ],
  }),
];
