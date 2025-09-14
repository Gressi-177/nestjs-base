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

@Entity('items')
@Index(['apiName', 'tftSetId'], { unique: true })
export class Item extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  apiName: string;

  @Column({ type: 'uuid' })
  tftSetId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon: string;

  @Column({ type: 'boolean', default: false })
  isUnique: boolean;

  // Relations
  @ManyToOne(() => TftSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tftSetId' })
  tftSet: TftSet;

  @OneToMany('ItemTranslation', 'item', {
    cascade: true,
    eager: false,
  })
  translations: any[];

  @OneToMany('ItemEffect', 'item', {
    cascade: true,
  })
  effects: any[];

  @OneToMany('ItemComposition', 'item', {
    cascade: true,
  })
  compositions: any[];

  @OneToMany('ItemTrait', 'item', {
    cascade: true,
  })
  itemTraits: any[];

  @OneToMany('ItemTag', 'item', {
    cascade: true,
  })
  tags: any[];

  @OneToMany('RoleItem', 'item')
  roleItems: any[];
}
