import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('extra_translations')
@Index(['languageCode', 'translationKey'], { unique: true })
export class ExtraTranslation extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  translationKey: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'text' })
  value: string;

  // Relations
  @ManyToOne('Language', 'extraTranslations', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: any;
}
