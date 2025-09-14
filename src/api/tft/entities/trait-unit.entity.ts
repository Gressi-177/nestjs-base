import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Trait } from './trait.entity';
import { Unit } from './unit.entity';

@Entity('trait_units')
@Index(['traitId', 'unitId'], { unique: true })
export class TraitUnit extends BaseModel {
  @Column({ type: 'uuid' })
  traitId: string;

  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'integer' })
  unitCost: number;

  // Relations
  @ManyToOne(() => Trait, (trait) => trait.traitUnits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitId' })
  trait: Trait;

  @ManyToOne(() => Unit, (unit) => unit.traitUnits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;
}
