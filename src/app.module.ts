import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DB_CONFIG,
  RabbitMQModule as RabbitMQModule,
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

import { RabbitMQModule as RabbitMQModule1 } from '@golevelup/nestjs-rabbitmq';

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
        // logging: true,
        migrationsTableName: 'app_migration',
        migrations: migrations,
        migrationsRun: true,
      }),
    }),
    UsersModule,
    AuthControllerModule,
    PermissionModule,
    RoleModule,

    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: APP_ID.USER,
          type: 'topic',
        },
        {
          name: APP_ID.USER,
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URL || RABBITMQ_CONFIG.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
    /*
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => ({
      exchanges: [
        {
          name: APP_ID.USER,
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL || RABBITMQ_CONFIG.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
       // channels: {
      //   'channel-1': {
      //     prefetchCount: 15,
      //     default: true,
      //   },
      //   'channel-2': {
      //     prefetchCount: 2,
      //   },
      // },
    })
  }),
  */
    AppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
