import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Unit } from './unit.entity';

@Entity('unit_stats')
export class UnitStats extends BaseModel {
  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  armor: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  attackSpeed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  critChance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  critMultiplier: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  damage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hp: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  initialMana: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  magicResist: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  mana: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  range: number;

  // Relations
  @OneToOne(() => Unit, (unit) => unit.stats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;
}
