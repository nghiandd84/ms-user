/*
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
// import { JwtAuthGuard } from 'dn-api-core';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUser, User } from './users.dto';
@ApiTags('user')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  
  // @UseGuards(JwtAuthGuard)
  @Get()
  showAllUsers(@Request() req) {
    console.log(req.user);
    return this.usersService.showAll();
  }
  // @UseGuards(JwtAuthGuard)
  @Post()
  createUsers(@Body() data: User) {
    return this.usersService.create(data);
  }
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  readUser(@Param('id') id: number) {
    return this.usersService.read(id);
  }
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  uppdateUser(@Param('id') id: number, @Body() data: UpdateUser) {
    return this.usersService.update(id, data);
  }
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.destroy(id);
  }
}
*/
import { Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { Crud, CrudAuth } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, Access, AccessGuard } from 'dn-api-core';

import { UsersService } from './users.service';
import { CreateUser, UpdateUser } from './users.dto';

@ApiTags('users')
@CrudAuth({
  property: 'user',
})
@Crud({
  model: {
    type: User,
  },
  query: {
    join: {
      accesses: {
        eager: true,
      },
    },
    exclude: ['password']
  },

  routes: {
    getOneBase: {
      decorators: [UseGuards(AccessGuard('USER_GET_ONE', 'USER'))],
    }
    
  },
  dto: {
    create: CreateUser,
    update: UpdateUser,
    replace: UpdateUser,
  },
})
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}
}
