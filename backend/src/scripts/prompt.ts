import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TextGenerationService } from '../modules/text-generation/text-generation.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const textGenerationService = app.get(TextGenerationService);

  if (process.argv.length < 3) {
    console.error('Please provide a prompt');
    process.exit(1);
  }

  const prompt = process.argv[2];

  const response = await textGenerationService.generateContent(prompt);
  console.log(`\n ${response}`);

  await app.close();
}

void bootstrap();
