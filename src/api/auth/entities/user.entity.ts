import { BaseModel } from '@/database/models/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseModel {
  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty()
  lastName: string;

  @Column()
  @Exclude()
  @ApiProperty()
  password: string;

  @Column({ default: false })
  @ApiProperty()
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  picture: string;

  @Column({ nullable: true })
  @ApiProperty()
  googleId: string;

  @Column({ nullable: true, type: 'varchar' })
  @Exclude()
  @ApiProperty()
  refreshToken: string | null;

  // Payment relationships - commented out for MVP
  // subscriptions?: any[]; // UserSubscription[]
  // usages?: any[]; // SubscriptionUsage[]
}
