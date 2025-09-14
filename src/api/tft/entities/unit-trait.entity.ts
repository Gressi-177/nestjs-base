import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Trait } from './trait.entity';
import { Unit } from './unit.entity';

@Entity('unit_traits')
@Index(['unitId', 'traitId'], { unique: true })
export class UnitTrait extends BaseModel {
  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'uuid' })
  traitId: string;

  // Relations
  @ManyToOne(() => Unit, (unit) => unit.unitTraits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unitId' })
  unit: Unit;

  @ManyToOne(() => Trait, (trait) => trait.unitTraits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitId' })
  trait: Trait;
}
