import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../database/models/base.model';
import { Augment } from './augment.entity';

@Entity('augment_effects')
@Index(['augmentId', 'effectKey'])
export class AugmentEffect extends BaseModel {
  @Column({ type: 'uuid' })
  augmentId: string;

  @Column({ type: 'varchar', length: 100 })
  effectKey: string;

  @Column({ type: 'decimal', precision: 15, scale: 8 })
  effectValue: number;

  // Relations
  @ManyToOne(() => Augment, (augment) => augment.effects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'augmentId' })
  augment: Augment;
}
