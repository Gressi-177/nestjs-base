import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';

@Entity('item_compositions')
@Index(['itemId', 'position'])
export class ItemComposition extends BaseModel {
  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'varchar', length: 255 })
  componentApiName: string;

  @Column({ type: 'integer' })
  position: number;

  // Relations
  @ManyToOne(() => Item, (item) => item.compositions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
