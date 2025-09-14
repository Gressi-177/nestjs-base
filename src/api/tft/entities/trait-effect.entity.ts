import { BaseModel } from '@/database/models/base.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('trait_effects')
@Index(['traitId', 'minUnits'])
export class TraitEffect extends BaseModel {
  @Column({ type: 'uuid' })
  traitId: string;

  @Column({ type: 'integer' })
  minUnits: number;

  @Column({ type: 'integer' })
  maxUnits: number;

  @Column({ type: 'integer', nullable: true })
  style: number;

  // Relations
  @ManyToOne('Trait', 'effects', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitId' })
  trait: any;

  @OneToMany('TraitEffectVariable', 'traitEffect', {
    cascade: true,
  })
  variables: any[];
}
