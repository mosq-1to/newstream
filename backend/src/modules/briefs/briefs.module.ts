import { Module } from "@nestjs/common";
import { BriefsController } from "./briefs.controller";
import { BriefsService } from "./briefs.service";
import { BriefsRepository } from "./briefs.repository";
import { GenerateBriefUseCase } from "./use-cases/generate-brief.use-case";
import { ArticlesModule } from "../articles/articles.module";
import { TextGenerationModule } from "../text-generation/text-generation.module";
import { DatabaseService } from "../../utils/database/database.service";
import { BriefAudioStorageRepository } from "../storage/brief-audio-storage.repository";

@Module({
  imports: [ArticlesModule, TextGenerationModule],
  controllers: [BriefsController],
  providers: [
    BriefsService,
    BriefsRepository,
    GenerateBriefUseCase,
    DatabaseService,
    BriefAudioStorageRepository,
  ],
  exports: [BriefsService, BriefsRepository, BriefAudioStorageRepository],
})
export class BriefsModule {}
