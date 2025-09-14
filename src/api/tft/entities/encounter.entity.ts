import { BaseModel } from '@/database/models/base.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EncounterTranslation } from './encounter-translation.entity';
import { TftSet } from './tft-set.entity';

@Entity('encounters')
@Index(['apiName', 'tftSetId'], { unique: true })
export class Encounter extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  apiName: string;

  @Column({ type: 'uuid' })
  tftSetId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  championSkin: string;

  // Relations
  @ManyToOne(() => TftSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tftSetId' })
  tftSet: TftSet;

  @OneToMany(
    () => EncounterTranslation,
    (translation) => translation.encounter,
    {
      cascade: true,
    },
  )
  translations: EncounterTranslation[];
}
