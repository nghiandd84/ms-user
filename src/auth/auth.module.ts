import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { Constants } from './constant';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || Constants.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRESIN || Constants.JWT_EXPIRESIN,
      },
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
// TODO: Move to dn-api-core
