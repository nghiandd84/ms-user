import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AtGuard,
  DB_CONFIG,
  RabbitMQModule,
  RABBITMQ_CONFIG,
} from 'dn-api-core';
import { APP_ID } from 'dn-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessEntity, UserEntity } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthControllerModule } from './auth-controller/auth.module';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/permission.entity';
import { RoleEntity } from './role/role.entity';
import { RoleModule } from './role/role.module';
import migrations from './migrations';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env/local.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || DB_CONFIG.DB_HOST,
        port: parseInt(process.env.DB_PORT) || DB_CONFIG.DB_PORT,
        username: process.env.DB_USER || DB_CONFIG.DB_USER,
        password: process.env.DB_PASSWORD || DB_CONFIG.DB_PASSWORD,
        database: process.env.DB_NAME || 'ms_user',
        entities: [UserEntity, Permission, AccessEntity, RoleEntity],
        // synchronize: true, // REMOVE on PROD, only run when develop
        logging: true,
        migrationsTableName: 'app_migration',
        migrations: migrations,
        migrationsRun: true,
      }),
    }),
    UsersModule,
    AuthControllerModule,
    PermissionModule,
    RoleModule,
    AppModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
