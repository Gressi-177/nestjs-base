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

@Entity('roles')
@Index(['apiName', 'tftSetId'], { unique: true })
export class Role extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  apiName: string;

  @Column({ type: 'uuid' })
  tftSetId: string;

  // Relations
  @ManyToOne(() => TftSet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tftSetId' })
  tftSet: TftSet;

  @OneToMany('RoleTranslation', 'role', {
    cascade: true,
  })
  translations: any[];

  @OneToMany('RoleItem', 'role', {
    cascade: true,
  })
  roleItems: any[];
}
