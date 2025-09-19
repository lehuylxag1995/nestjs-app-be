import { PrismaModule } from '@Modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';

@Module({
  imports: [PrismaModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
