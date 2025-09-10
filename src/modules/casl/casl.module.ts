import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
