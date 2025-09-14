import { BaseModel } from '@/database/models/base.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Language } from './language.entity';
import { Role } from './role.entity';

@Entity('role_translations')
@Index(['roleId', 'languageCode'], { unique: true })
export class RoleTranslation extends BaseModel {
  @Column({ type: 'uuid' })
  roleId: string;

  @Column({ type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @ManyToOne(() => Role, (role) => role.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Language, (language) => language.roleTranslations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language: Language;
}
