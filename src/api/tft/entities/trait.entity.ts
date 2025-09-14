import { BaseModel } from '@/database/models/base.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TftSet } from './tft-set.entity';

@Entity('traits')
@Index(['apiName', 'tftSetId'], { unique: true })
export class Trait extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  apiName: string;

  @Column({ type: 'uuid' })
  tftSetId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon: string;

  // Relations
  @ManyToOne(() => TftSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tftSetId' })
  tftSet: TftSet;

  @OneToMany('TraitTranslation', 'trait', {
    cascade: true,
  })
  translations: any[];

  @OneToMany('TraitEffect', 'trait', {
    cascade: true,
  })
  effects: any[];

  @OneToMany('TraitUnit', 'trait', {
    cascade: true,
  })
  traitUnits: any[];

  @OneToMany('UnitTrait', 'trait')
  unitTraits: any[];

  @OneToMany('ItemTrait', 'trait')
  itemTraits: any[];

  @OneToMany('AugmentTrait', 'trait')
  augmentTraits: any[];
}
