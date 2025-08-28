import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory';
import { Module } from '@nestjs/common';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
