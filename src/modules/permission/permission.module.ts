import { CaslModule } from '@Modules/casl/casl.module';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [PrismaModule, CaslModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
