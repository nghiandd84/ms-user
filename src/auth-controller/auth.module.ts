import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule } from 'dn-api-core';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule
  ],
  providers: [],
  controllers: [AuthController],
})
export class AuthControllerModule {}
