import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Augment } from './augment.entity';
import { Encounter } from './encounter.entity';
import { Item } from './item.entity';
import { Role } from './role.entity';
import { Trait } from './trait.entity';
import { Unit } from './unit.entity';

@Entity('tft_sets')
@Index(['setVersion'], { unique: true })
export class TftSet extends BaseModel {
  @Column({ type: 'varchar', length: 20, unique: true })
  setVersion: string; // 'Set15', 'Set16', etc.

  @Column({ type: 'varchar', length: 100 })
  displayName: string; // 'TFT Set 15: InkBorn Fables'

  @Column({ type: 'varchar', length: 500 })
  viApiUrl: string;

  @Column({ type: 'varchar', length: 500 })
  enApiUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @Column({ type: 'text', nullable: true })
  syncStatus: string; // 'success', 'failed', 'in_progress'

  // Relations
  @OneToMany(() => Item, (item) => item.tftSet)
  items: Item[];

  @OneToMany(() => Unit, (unit) => unit.tftSet)
  units: Unit[];

  @OneToMany(() => Trait, (trait) => trait.tftSet)
  traits: Trait[];

  @OneToMany(() => Augment, (augment) => augment.tftSet)
  augments: Augment[];

  @OneToMany(() => Role, (role) => role.tftSet)
  roles: Role[];

  @OneToMany(() => Encounter, (encounter) => encounter.tftSet)
  encounters: Encounter[];
}
