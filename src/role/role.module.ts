import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { AuthModule } from 'dn-api-core';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), AuthModule, PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
