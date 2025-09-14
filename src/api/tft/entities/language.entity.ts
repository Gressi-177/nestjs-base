import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('languages')
export class Language extends BaseModel {
  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  nativeName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @OneToMany('ItemTranslation', 'language')
  itemTranslations: any[];

  @OneToMany('UnitTranslation', 'language')
  unitTranslations: any[];

  @OneToMany('TraitTranslation', 'language')
  traitTranslations: any[];

  @OneToMany('AugmentTranslation', 'language')
  augmentTranslations: any[];

  @OneToMany('RoleTranslation', 'language')
  roleTranslations: any[];

  @OneToMany('EncounterTranslation', 'language')
  encounterTranslations: any[];

  @OneToMany('UnitAbilityTranslation', 'language')
  unitAbilityTranslations: any[];

  @OneToMany('ExtraTranslation', 'language')
  extraTranslations: any[];
}
