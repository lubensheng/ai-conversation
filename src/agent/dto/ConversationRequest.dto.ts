import { IsNotEmpty, IsString } from 'class-validator';

class ConversationRequestDto {
  @IsNotEmpty()
  @IsString()
  apiType: string;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export default ConversationRequestDto;
