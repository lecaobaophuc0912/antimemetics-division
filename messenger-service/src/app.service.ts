import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(data: { name: string }): string {
    console.log(data);
    return `Hello ${data.name}!`;
  }
}
