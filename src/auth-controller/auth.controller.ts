import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Login,
  LoginStatus,
  RegisterUser,
  AuthService,
  Public,
  AmqpConnection,
  RABBIT_EXCHANGE_TYPE,
  Logger
} from 'dn-api-core';
import { APP_ID } from 'dn-core';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,

    private readonly amqpConnection: AmqpConnection,
    private readonly logger: Logger,
  ) {}

  @Public()
  @Post('login')
  public login(@Body() loginUserDto: Login): Promise<LoginStatus> {
    this.amqpConnection.publish(`${APP_ID.USER}.${RABBIT_EXCHANGE_TYPE.TOPIC}`, 'user-login', loginUserDto);
    this.logger.log('Login')
    return this.authService.login(loginUserDto, this.userService);
  }

  @Public()
  @Post('register')
  public async register(
    @Body() registerUser: RegisterUser,
  ): Promise<LoginStatus> {
    return this.authService.register(registerUser, this.userService);
  }
}
