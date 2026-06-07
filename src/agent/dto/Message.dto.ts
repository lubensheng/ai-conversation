import { IsString } from 'class-validator';

class MessageDto {
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @IsString()
  content: string;
}

export default MessageDto;
