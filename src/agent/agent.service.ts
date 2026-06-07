import { Injectable } from '@nestjs/common';
import LlmFactory from './llm/LlmFactory';
import { MODAL_TYPE } from './constants';
import MessageDto from './dto/Message.dto';
import {
  AIMessage,
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from 'langchain';

@Injectable()
export class AgentService {
  constructor(private readonly llmFactory: LlmFactory) {}

  async startChat(
    modalType: string,
    apiKey: string,
    messages: MessageDto[],
  ): Promise<AsyncIterable<AIMessageChunk>> {
    console.log(modalType);
    console.log(apiKey);
    const llm = this.llmFactory.createModal(
      (modalType as MODAL_TYPE) || MODAL_TYPE.DEEP_SEEK,
      apiKey ? apiKey : 'sk-0068b60c50b0451faac158138800ba43',
    );
    const langChainMessage = this.convertToLangChainMessages(messages);
    const stream = await llm.stream(langChainMessage);
    return stream;
  }

  private convertToLangChainMessages(messages: MessageDto[]): BaseMessage[] {
    return messages.map((item) => {
      switch (item.role) {
        case 'system': {
          return new SystemMessage(item.content);
        }
        case 'user': {
          return new HumanMessage(item.content);
        }
        case 'assistant': {
          return new AIMessage(item.content);
        }
        default: {
          throw new Error(`不合法的角色: ${item.role as string}`);
        }
      }
    });
  }
}
