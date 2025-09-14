import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TraitEffect } from './trait-effect.entity';

@Entity('trait_effect_variables')
@Index(['traitEffectId', 'variableKey'])
export class TraitEffectVariable extends BaseModel {
  @Column({ type: 'uuid' })
  traitEffectId: string;

  @Column({ type: 'varchar', length: 100 })
  variableKey: string;

  @Column({ type: 'decimal', precision: 15, scale: 8 })
  variableValue: number;

  // Relations
  @ManyToOne(() => TraitEffect, (traitEffect) => traitEffect.variables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitEffectId' })
  traitEffect: TraitEffect;
}
