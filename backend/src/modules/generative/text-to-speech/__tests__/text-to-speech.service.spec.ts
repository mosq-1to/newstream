import { Test, TestingModule } from '@nestjs/testing';
import { TextToSpeechService } from '../text-to-speech.service';
import { ConfigModule } from '@nestjs/config';

describe('TextToSpeechService', () => {
  let service: TextToSpeechService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [TextToSpeechService],
    }).compile();

    service = module.get<TextToSpeechService>(TextToSpeechService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
