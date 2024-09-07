import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  @ApiResponse({
    status: 200,
    description: 'Testing app controller get method.',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
