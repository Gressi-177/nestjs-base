import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../database/models/base.model';
import { Augment } from './augment.entity';
import { Trait } from './trait.entity';

@Entity('augment_traits')
@Index(['augmentId', 'traitId'], { unique: true })
export class AugmentTrait extends BaseModel {
  @Column({ type: 'uuid' })
  augmentId: string;

  @Column({ type: 'uuid' })
  traitId: string;

  // Relations
  @ManyToOne(() => Augment, (augment) => augment.augmentTraits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'augmentId' })
  augment: Augment;

  @ManyToOne(() => Trait, (trait) => trait.augmentTraits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitId' })
  trait: Trait;
}
