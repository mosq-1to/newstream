import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseService } from '../utils/database/database.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const databaseService = app.get(DatabaseService);

  try {
    const meta = await databaseService.article.deleteMany({});
    console.log(`Articles collection cleaned: ${meta.count}`);
  } catch (e) {
    console.error(
      'Cannot clean the articles collection: ' + JSON.stringify(e, null, 2),
    );
  }

  await app.close();
}

void bootstrap();
