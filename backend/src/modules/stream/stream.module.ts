import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { HlsService } from '../../utils/audio/hls.service';
import { StreamRepository } from './stream.repository';

@Module({
  providers: [StreamService, HlsService, StreamRepository],
  controllers: [StreamController],
})
export class StreamModule {}
