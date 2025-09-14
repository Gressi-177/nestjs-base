import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { Language } from './language.entity';

@Entity('item_translations')
@Index(['itemId', 'languageCode'], { unique: true })
@Index(['languageCode', 'name'])
export class ItemTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => Item, (item) => item.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => Language, (language) => language.itemTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
