import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { Trait } from './trait.entity';

@Entity('item_traits')
@Index(['itemId', 'traitId'], { unique: true })
export class ItemTrait extends BaseModel {
  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'uuid' })
  traitId: string;

  @Column({ type: 'boolean', default: false })
  isIncompatible: boolean;

  // Relations
  @ManyToOne(() => Item, (item) => item.itemTraits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Trait, (trait) => trait.itemTraits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'traitId' })
  trait: Trait;
}
