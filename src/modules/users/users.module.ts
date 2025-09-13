import { CaslModule } from '@Modules/casl/casl.module';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { RolesModule } from '@Modules/roles/roles.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, CaslModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
