import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Encounter } from './encounter.entity';
import { Language } from './language.entity';

@Entity('encounter_translations')
@Index(['encounterId', 'languageCode'], { unique: true })
export class EncounterTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  encounterId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  encounterRulesText: string;

  // Relations
  @ManyToOne(() => Encounter, (encounter) => encounter.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'encounterId' })
  encounter: Encounter;

  @ManyToOne(() => Language, (language) => language.encounterTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
