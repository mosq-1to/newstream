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
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { AudioGenerationModule } from './modules/audio-generation/audio-generation.module';
import { StreamModule } from './modules/stream/stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot({}),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    UsersModule,
    ArticlesModule,
    StoriesModule,
    AuthModule,
    TextGenerationModule,
    StoryGenerationModule,
    AudioGenerationModule,
    StreamModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
