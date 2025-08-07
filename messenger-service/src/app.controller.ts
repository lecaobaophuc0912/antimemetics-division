import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get()
  getHello(@Query('name') name: string): string {
    return this.appService.getHello({
      name
    });
  }

  @GrpcMethod('HelloService', 'Hello')
  hello(data: {
    name: string
  }): { message: string } {
    const message = this.appService.getHello(data);
    return {
      message
    };
  }
}
