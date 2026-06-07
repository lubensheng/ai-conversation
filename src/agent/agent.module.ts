import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import LlmFactory from './llm/LlmFactory';

@Module({
  providers: [AgentService, LlmFactory],
  controllers: [AgentController],
})
export class AgentModule {}
