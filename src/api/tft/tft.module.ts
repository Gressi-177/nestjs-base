import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TftController } from './tft.controller';
import { TftService } from './tft.service';

import { AugmentEffect } from './entities/augment-effect.entity';
import { AugmentTag } from './entities/augment-tag.entity';
import { AugmentTrait } from './entities/augment-trait.entity';
import { AugmentTranslation } from './entities/augment-translation.entity';
import { Augment } from './entities/augment.entity';
import { EncounterTranslation } from './entities/encounter-translation.entity';
import { Encounter } from './entities/encounter.entity';
import { ExtraTranslation } from './entities/extra-translation.entity';
import { ItemComposition } from './entities/item-composition.entity';
import { ItemEffect } from './entities/item-effect.entity';
import { ItemTag } from './entities/item-tag.entity';
import { ItemTrait } from './entities/item-trait.entity';
import { ItemTranslation } from './entities/item-translation.entity';
import { Item } from './entities/item.entity';
import { Language } from './entities/language.entity';
import { RoleItem } from './entities/role-item.entity';
import { RoleTranslation } from './entities/role-translation.entity';
import { Role } from './entities/role.entity';
import { TftSet } from './entities/tft-set.entity';
import { TraitEffectVariable } from './entities/trait-effect-variable.entity';
import { TraitEffect } from './entities/trait-effect.entity';
import { TraitTranslation } from './entities/trait-translation.entity';
import { TraitUnit } from './entities/trait-unit.entity';
import { Trait } from './entities/trait.entity';
import { UnitAbilityTranslation } from './entities/unit-ability-translation.entity';
import { UnitAbilityVariable } from './entities/unit-ability-variable.entity';
import { UnitAbility } from './entities/unit-ability.entity';
import { UnitStats } from './entities/unit-stats.entity';
import { UnitTrait } from './entities/unit-trait.entity';
import { UnitTranslation } from './entities/unit-translation.entity';
import { Unit } from './entities/unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      Unit,
      UnitTranslation,
      UnitAbility,
      UnitAbilityTranslation,
      UnitAbilityVariable,
      UnitStats,
      UnitTrait,
      Item,
      ItemTranslation,
      ItemEffect,
      ItemComposition,
      ItemTag,
      ItemTrait,
      Trait,
      TraitTranslation,
      TraitEffect,
      TraitEffectVariable,
      TraitUnit,
      Augment,
      AugmentTranslation,
      AugmentEffect,
      AugmentTag,
      AugmentTrait,
      Role,
      RoleTranslation,
      RoleItem,
      Encounter,
      EncounterTranslation,
      ExtraTranslation,
      TftSet,
    ]),
  ],
  controllers: [TftController],
  providers: [TftService],
  exports: [TftService],
})
export class TftModule {}
