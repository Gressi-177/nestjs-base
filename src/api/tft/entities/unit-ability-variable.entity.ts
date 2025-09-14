import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UnitAbility } from './unit-ability.entity';

@Entity('unit_ability_variables')
@Index(['abilityId', 'variableName'])
export class UnitAbilityVariable extends BaseModel {
  @Column({ type: 'uuid' })
  abilityId: string;

  @Column({ type: 'varchar', length: 100 })
  variableName: string;

  @Column({ type: 'decimal', precision: 15, scale: 8, nullable: true })
  level1Value: number;

  @Column({ type: 'decimal', precision: 15, scale: 8, nullable: true })
  level2Value: number;

  @Column({ type: 'decimal', precision: 15, scale: 8, nullable: true })
  level3Value: number;

  // Relations
  @ManyToOne(() => UnitAbility, (ability) => ability.variables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'abilityId' })
  ability: UnitAbility;
}
