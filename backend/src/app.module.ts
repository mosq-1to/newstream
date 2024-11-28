import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ArticlesModule } from './modules/articles/articles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StoriesModule } from './modules/stories/stories.module';
import { TextGenerationModule } from './modules/text-generation/text-generation.module';
import { BullModule } from '@nestjs/bullmq';
import { StoryGenerationModule } from './modules/story-generation/story-generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot({}),
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    UsersModule,
    ArticlesModule,
    StoriesModule,
    AuthModule,
    TextGenerationModule,
    StoryGenerationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
