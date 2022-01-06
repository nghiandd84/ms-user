
import {
  CanActivate,
  ExecutionContext,
  Logger,
  Type,
  mixin,
  Injectable,
} from '@nestjs/common';
import { User, AuthCacheService } from 'dn-api-core';
import { AssignRole } from '../users.dto';
export const AssignRoleGuard = (
  permisionKey: string,
  locationId: string = null,
): Type<CanActivate> => {
  @Injectable()
  class AssignRoleGuardMixin implements CanActivate {
    private readonly logger = new Logger(AssignRoleGuard.name);
    constructor(private authCacheService: AuthCacheService) {}
    canActivate(context: ExecutionContext) {
      const request = context
        .switchToHttp()
        .getRequest<{ user: User; body: AssignRole }>();
      const { user, body } = request;
      this.logger.debug(`Assign role ${body.roleKey} to user ${body.userId}`);
      this.logger.debug(permisionKey, locationId);

      let accesses = user.accesses || [];
      if (locationId) {
        accesses = accesses.filter(
          (access) => access.locationId === locationId,
        );
      }
      const findAccess = accesses.find((item) => item.roleKey === body.roleKey);
      this.logger.debug(findAccess);
      if (!findAccess) {
        this.logger.error('User not have role');
        return false;
      }
      if (
        findAccess.locationId !== null &&
        findAccess.locationId !== body.locationId
      ) {
        this.logger.error('Location not match');
        return false;
      }
      if (findAccess.roleKey !== body.roleKey) {
        this.logger.error('Role not match');
        return false;
      }
      return this.authCacheService
        .get<string>('ROLE_' + body.roleKey)
        .then((permissionStr) => {
          if (!permissionStr) {
            this.logger.error('Role is invalid');
            return Promise.reject();
          }
          const isMatch = permissionStr.indexOf(permisionKey) >= 0;
          if (!isMatch) {
            this.logger.error('Permission is not match');
            return Promise.reject(false);
          }
          return Promise.resolve(true);
        });
    }
  }

  return mixin(AssignRoleGuardMixin);
};
