import { Body, Controller, Post } from '@nestjs/common';
import { Login, LoginStatus, RegisterUser } from '../auth/auth.dto';
import { AuthService } from 'dn-api-core';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
    ) {}

  @Post('login')
  public login(@Body() loginUserDto: Login): Promise<LoginStatus> {
    return this.authService.login(loginUserDto, this.userService);
  }

  @Post('register')
  public async register(
    @Body() registerUser: RegisterUser,
  ): Promise<LoginStatus> {
    return this.authService.register(registerUser, this.userService);
  }
}
