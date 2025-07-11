import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { ArticlesModule } from "./modules/articles/articles.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TextGenerationModule } from "./modules/text-generation/text-generation.module";
import { BullModule } from "@nestjs/bullmq";
import { BullBoardModule } from "@bull-board/nestjs";
import { ExpressAdapter } from "@bull-board/express";
import { AudioGenerationModule } from "./modules/audio-generation/audio-generation.module";
import { StreamModule } from "./modules/stream/stream.module";
import { StorageModule } from "./modules/storage/storage.module";
import { BriefsModule } from "./modules/briefs/briefs.module";
import { BriefAudioGenerationModule } from "./modules/brief-audio-generation/brief-audio-generation.module";
import { TopicsModule } from "./modules/topics/topics.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot({}),
    BullModule.forRoot({
      connection: {
        host: "localhost",
        port: 6379,
      },
    }),
    BullBoardModule.forRoot({
      route: "/queues",
      adapter: ExpressAdapter,
    }),
    UsersModule,
    ArticlesModule,
    AuthModule,
    TextGenerationModule,
    AudioGenerationModule,
    StreamModule,
    StorageModule,
    BriefsModule,
    BriefAudioGenerationModule,
    TopicsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
