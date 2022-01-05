import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RoleEntity } from './role.entity';
import { AuthCacheService } from 'dn-api-core';
import { AssignPermission } from './role.dto';
import { PermissionService } from '../permission/permission.service';
@Injectable()
export class RoleService extends TypeOrmCrudService<RoleEntity> {
  private readonly logger = new Logger(RoleService.name);
  constructor(
    @InjectRepository(RoleEntity) repo,
    private authCacheService: AuthCacheService,
    private permissionService: PermissionService,
  ) {
    super(repo);
    this.initRoleInterval();
  }

  assignPermission(
    assignRole: AssignPermission,
    isUnAssign: boolean = false,
  ): Promise<boolean> {
    this.logger.debug(assignRole);
    return this.repo
      .findOne({
        where: { key: assignRole.roleKey },
        relations: ['permissions'],
      })
      .then((role) => {
        if (!role) {
          throw new Error('Role not found');
        }
        const existPermissionInRole = role.permissions.find(
          (permission) => permission.key === assignRole.permissionKey,
        );
        if (existPermissionInRole && !isUnAssign) {
          throw new Error('Permission was already assign to role');
        }
        return this.permissionService
          .findOne({ where: { key: assignRole.permissionKey } })
          .then((permission) => {
            if (!permission) {
              throw new Error('Permission not found');
            }
            if (isUnAssign) {
              role.permissions = role.permissions.filter(
                (permission) => permission.key !== assignRole.permissionKey,
              );
            } else {
              role.permissions.push(permission);
            }
            return role.save();
          });
      })
      .then((_) => {
        this.logger.log(
          `Permission ${assignRole.permissionKey} was assign to role ${assignRole.roleKey}`,
        );
        return Promise.resolve(true);
      })
      .catch((err) => {
        this.logger.error(err);
        throw new HttpException(err?.message || err, HttpStatus.BAD_REQUEST);
      });
  }

  private initRoleInterval() {
    this.runRoleUpdate();
    const intervalTime = process.env.AUTH_ROLE_INTERVAL
      ? parseInt(process.env.AUTH_ROLE_INTERVAL)
      : 200000;
    setInterval(() => {
      this.runRoleUpdate();
    }, intervalTime);
  }

  private runRoleUpdate() {
    this.logger.debug('Update role data');
    this.repo.find({ relations: ['permissions'] }).then((allRoles) => {
      allRoles.forEach((role) => {
        let permissionStr = role.permissions
          .map((item) => item.key)
          .join('|||');
        permissionStr = '|||' + permissionStr + '|||';
        this.authCacheService.set('ROLE_' + role.key, permissionStr);
      });
    });
  }
}
