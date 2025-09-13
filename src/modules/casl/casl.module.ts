import { CaslAbilityFactory } from '@Modules/casl/casl-ability.factory';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
