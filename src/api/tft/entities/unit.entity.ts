import { BaseModel } from '@/database/models/base.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TftSet } from './tft-set.entity';

@Entity('units')
@Index(['apiName', 'tftSetId'], { unique: true })
export class Unit extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  apiName: string;

  @Column({ type: 'uuid' })
  tftSetId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  characterName: string;

  @Column({ type: 'integer' })
  cost: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  squareIcon: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tileIcon: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string;

  // Relations
  @ManyToOne(() => TftSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tftSetId' })
  tftSet: TftSet;

  @OneToMany('UnitTranslation', 'unit', {
    cascade: true,
  })
  translations: any[];

  @OneToOne('UnitAbility', 'unit', {
    cascade: true,
  })
  ability: any;

  @OneToOne('UnitStats', 'unit', {
    cascade: true,
  })
  stats: any;

  @OneToMany('UnitTrait', 'unit', {
    cascade: true,
  })
  unitTraits: any[];

  @OneToMany('TraitUnit', 'unit')
  traitUnits: any[];
}
