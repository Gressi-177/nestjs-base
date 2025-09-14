import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Language } from './language.entity';
import { Unit } from './unit.entity';

@Entity('unit_translations')
@Index(['unitId', 'languageCode'], { unique: true })
@Index(['languageCode', 'name'])
export class UnitTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // Relations
  @ManyToOne(() => Unit, (unit) => unit.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;

  @ManyToOne(() => Language, (language) => language.unitTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
