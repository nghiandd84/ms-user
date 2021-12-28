import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './users/users.entity';
import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
// import { AuthController } from './auth-controller/auth.controller';
import { AuthControllerModule } from './auth-controller/auth.module';

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
        entities: [UserEntity],
        synchronize: true, // REMOVE on PROD
        logging: true,
      }),
    }),
    UsersModule,
    AuthControllerModule
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
