import { Injectable } from '@nestjs/common';
import { MODAL_TYPE } from '../constants';

import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
class LlmFactory {
  createModal(modelType: MODAL_TYPE, apiKey: string): BaseChatModel {
    switch (modelType) {
      case MODAL_TYPE.DEEP_SEEK: {
        return new ChatDeepSeek({
          apiKey: apiKey,
          model: 'deepseek-chat',
          temperature: 0.7,
          maxTokens: 2048,
        });
      }
      case MODAL_TYPE.CLAUDE: {
        return new ChatOpenAI({
          model: 'gpt-5.4', // 替换为你实际的模型名称
          apiKey,
          configuration: {
            baseURL: 'https://code.newcli.com/codex/v1',
          },
          temperature: 0.7,
          maxTokens: 2048,
        });
      }
      default: {
        throw new Error(`不支持的类型${modelType as string}`);
      }
    }
  }
}

export default LlmFactory;
