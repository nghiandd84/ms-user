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
export class UsersController {
  constructor(private usersService: UsersService) {}
  
  @ApiBearerAuth()
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
