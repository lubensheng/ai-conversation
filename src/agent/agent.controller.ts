import { Body, Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import ConversationRequestDto from './dto/ConversationRequest.dto';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  private readonly randomTexts = [
    '正在解析请求',
    '梳理回答逻辑',
    '组织内容片段',
    '补充细节信息',
    '优化语句表达',
    '持续生成中...',
    '加载回复内容',
    '整合相关信息',
  ];

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
        const content = chunk.content as string;
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

  @Get('/mockConversation')
  // eslint-disable-next-line @typescript-eslint/require-await
  async mockConversation(
    @Body() query: ConversationRequestDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    const totalTime = 10 * 1000;
    const startTime = Date.now();

    // 定时推送，间隔 200~600ms 随机
    const timer = setInterval(
      () => {
        const now = Date.now();
        // 超时则关闭连接
        if (now - startTime >= totalTime) {
          clearInterval(timer);
          res.write('data: [结束] 流传输完成\n\n');
          return res.end();
        }

        // 随机取文本
        const randomContent =
          this.randomTexts[Math.floor(Math.random() * this.randomTexts.length)];
        // SSE 标准格式：data: 内容 + 两个换行
        res.write(`data: ${randomContent}\n\n`);
      },
      Math.floor(Math.random() * 400) + 200,
    );
  }
}
