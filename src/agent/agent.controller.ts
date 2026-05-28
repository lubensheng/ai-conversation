import { Controller, Post } from '@nestjs/common';

@Controller('agent')
export class AgentController {
  @Post('/conversation')
  conversation(): string {
    return '';
  }
}
