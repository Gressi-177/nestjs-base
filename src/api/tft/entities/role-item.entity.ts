import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { Role } from './role.entity';

@Entity('role_items')
@Index(['roleId', 'itemId'], { unique: true })
export class RoleItem extends BaseModel {
  @Column({ type: 'uuid' })
  roleId: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'integer', nullable: true })
  recommendationOrder: number;

  // Relations
  @ManyToOne(() => Role, (role) => role.roleItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Item, (item) => item.roleItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
