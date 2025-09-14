import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../database/models/base.model';
import { Augment } from './augment.entity';

@Entity('augment_tags')
@Index(['augmentId', 'tag'])
export class AugmentTag extends BaseModel {
  @Column({ type: 'uuid' })
  augmentId: string;

  @Column({ type: 'varchar', length: 100 })
  tag: string;

  // Relations
  @ManyToOne(() => Augment, (augment) => augment.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'augmentId' })
  augment: Augment;
}
