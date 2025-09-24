import { PrismaModule } from '@Modules/prisma/prisma.module';
import { UserSocialService } from '@Modules/user-provider/user-social.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [UserSocialService],
  exports: [UserSocialService],
})
export class UserSocialModule {}
