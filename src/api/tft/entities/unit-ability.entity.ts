import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
@Entity('unit_abilities')
export class UnitAbility extends BaseModel {
  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  icon: string;

  // Relations
  @OneToOne('Unit', 'ability', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'unitId' })
  unit: any;

  @OneToMany('UnitAbilityTranslation', 'ability', {
    cascade: true,
  })
  translations: any[];

  @OneToMany('UnitAbilityVariable', 'ability', {
    cascade: true,
  })
  variables: any[];
}
