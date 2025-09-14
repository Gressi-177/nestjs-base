import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../database/models/base.model';
import { Augment } from './augment.entity';
import { Language } from './language.entity';

@Entity('augment_translations')
@Index(['augmentId', 'languageCode'], { unique: true })
@Index(['languageCode', 'name'])
export class AugmentTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  augmentId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => Augment, (augment) => augment.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'augmentId' })
  augment: Augment;

  @ManyToOne(() => Language, (language) => language.augmentTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
