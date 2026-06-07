import { Body, Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import ConversationRequestDto from './dto/ConversationRequest.dto';
import { AgentService } from './agent.service';
import { AIMessageChunk } from 'langchain';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('/conversation')
  async conversation(
    @Body() query: ConversationRequestDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    try {
      const stream = await this.agentService.startChat(
        query.apiType,
        query.apiKey,
        [{ role: 'user', content: query.content }],
      );
      console.log(stream);
      for await (const chunk of stream) {
        const content = (chunk as AIMessageChunk).content as string;
        if (content) {
          // SSE 格式：data: 内容\n\n
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (_e) {
      console.log(_e);
      res.write(`event: error\ndata:\n\n`);
      res.end();
    }
  }
}
