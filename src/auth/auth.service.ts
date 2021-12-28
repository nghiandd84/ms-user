import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtPayload, sign } from 'jsonwebtoken';
import { User } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import { Login, LoginStatus, RegisterUser } from './auth.dto';
import { Constants } from './constant';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async validateUser(payload: JwtPayload): Promise<User> {
    const userId = parseInt(payload.id);
    const user = await this.usersService.read(userId);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(loginUserDto: Login): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);
    const token = this.createToken(user.id);
    console.log(this.cacheManager);
    return {
      id: user.id,
      expiresIn: token.expiresIn,
      token: token.token
    };
  }

  register(userDto: RegisterUser): Promise<LoginStatus> {
    return this.usersService
      .create(userDto)
      .then(() =>
        this.login({ email: userDto.email, password: userDto.password }),
      );
  }

  private createToken(userId: number) {
    const expiresIn = parseInt(process.env.JWT_EXPIRESIN) || Constants.JWT_EXPIRESIN;
    const secretOrKey = process.env.JWT_SECRET || Constants.JWT_SECRET;
    const user = { id: userId };
    const token = sign(user, secretOrKey, { expiresIn });
    return { token, expiresIn };
  }
}
