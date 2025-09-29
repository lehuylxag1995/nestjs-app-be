import { PrismaModule } from '@Modules/prisma/prisma.module';
import { UserSocialController } from '@Modules/user-provider/user-social.controller';
import { UserSocialService } from '@Modules/user-provider/user-social.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [UserSocialController],
  providers: [UserSocialService],
  exports: [UserSocialService],
})
export class UserSocialModule {}
