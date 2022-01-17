import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule, RabbitMQModule, RABBITMQ_CONFIG } from 'dn-api-core';
import { UsersModule } from '../users/users.module';
import { APP_ID } from 'dn-core';

@Module({
  imports: [
    AuthModule,
    UsersModule,
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
  ],
  providers: [],
  controllers: [AuthController],
})
export class AuthControllerModule {}
