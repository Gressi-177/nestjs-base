import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TftModule } from './tft/tft.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, TftModule],
})
export class ApiModule {}
