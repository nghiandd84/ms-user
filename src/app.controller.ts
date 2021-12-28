import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Unicorn } from 'dn-core';

@Controller('hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const unicorn = new Unicorn();
    return this.appService.getHello() + '---' + unicorn.sayHelloTo('HAHA');
  }
}
