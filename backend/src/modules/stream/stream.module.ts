import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { HlsService } from '../../utils/audio/hls.service';

@Module({
  providers: [StreamService, HlsService],
  controllers: [StreamController],
})
export class StreamModule {}
