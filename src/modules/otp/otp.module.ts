import { OtpController } from '@Modules/otp/otp.controller';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';

@Module({
  controllers: [OtpController],
  imports: [PrismaModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
