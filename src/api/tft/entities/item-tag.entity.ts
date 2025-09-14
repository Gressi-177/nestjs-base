import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';

@Entity('item_tags')
@Index(['itemId', 'tag'])
export class ItemTag extends BaseModel {
  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'varchar', length: 100 })
  tag: string;

  // Relations
  @ManyToOne(() => Item, (item) => item.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
