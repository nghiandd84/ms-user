import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { AuthCacheService } from 'dn-api-core';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, AuthCacheService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
