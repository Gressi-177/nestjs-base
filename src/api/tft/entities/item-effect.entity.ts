import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';

@Entity('item_effects')
@Index(['itemId', 'effectKey'])
export class ItemEffect extends BaseModel {
  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'varchar', length: 100 })
  effectKey: string;

  @Column({ type: 'decimal', precision: 15, scale: 8 })
  effectValue: number;

  // Relations
  @ManyToOne(() => Item, (item) => item.effects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
