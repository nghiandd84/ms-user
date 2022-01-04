import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessEntity, UserEntity } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthControllerModule } from './auth-controller/auth.module';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/permission.entity';
import { RoleEntity } from './role/entities/role.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env/local.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [UserEntity, Permission, AccessEntity, RoleEntity],
        synchronize: true, // REMOVE on PROD
        logging: true,
      }),
    }),
    UsersModule,
    AuthControllerModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
