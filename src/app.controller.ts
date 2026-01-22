import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRootHealth(): string {
    return 'OK';
  }
}
