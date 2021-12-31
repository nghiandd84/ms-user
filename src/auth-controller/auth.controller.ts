import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Login, LoginStatus, RegisterUser, AuthService, Public } from 'dn-api-core';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @Post('login')
  public login(@Body() loginUserDto: Login): Promise<LoginStatus> {
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
