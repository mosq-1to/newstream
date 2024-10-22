import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TextGenerationService } from '../modules/text-generation/text-generation.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const textGenerationService = app.get(TextGenerationService);

  const response = await textGenerationService.generateText(
    'Generate a random phrase about the King and the Queen',
  );

  console.log(response);

  await app.close();
}

void bootstrap();
