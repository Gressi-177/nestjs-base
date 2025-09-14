import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Language } from './language.entity';
import { UnitAbility } from './unit-ability.entity';

@Entity('unit_ability_translations')
@Index(['abilityId', 'languageCode'], { unique: true })
export class UnitAbilityTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  abilityId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => UnitAbility, (ability) => ability.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'abilityId' })
  ability: UnitAbility;

  @ManyToOne(() => Language, (language) => language.unitAbilityTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
