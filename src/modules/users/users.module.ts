import { CaslModule } from '@modules/casl/casl.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, CaslModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
