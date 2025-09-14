import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseModel } from '../../../database/models/base.model';
import { TftSet } from './tft-set.entity';

@Entity('augments')
@Index(['apiName', 'tftSetId'], { unique: true })
export class Augment extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  apiName: string;

  @Column({ type: 'uuid' })
  tftSetId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  texture: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'boolean', default: false })
  isUnique: boolean;

  // Relations
  @ManyToOne(() => TftSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tftSetId' })
  tftSet: TftSet;

  @OneToMany('AugmentTranslation', 'augment', {
    cascade: true,
  })
  translations: any[];

  @OneToMany('AugmentEffect', 'augment', {
    cascade: true,
  })
  effects: any[];

  @OneToMany('AugmentTrait', 'augment', {
    cascade: true,
  })
  augmentTraits: any[];

  @OneToMany('AugmentTag', 'augment', {
    cascade: true,
  })
  tags: any[];
}
