import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Language } from './language.entity';
import { Trait } from './trait.entity';

@Entity('trait_translations')
@Index(['traitId', 'languageCode'], { unique: true })
@Index(['languageCode', 'name'])
export class TraitTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  traitId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => Trait, (trait) => trait.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitId' })
  trait: Trait;

  @ManyToOne(() => Language, (language) => language.traitTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
