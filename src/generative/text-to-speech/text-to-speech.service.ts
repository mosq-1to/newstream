import { Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';
import { AxiosError } from 'axios';
import { Response } from 'express';

@Injectable()
export class TextToSpeechService {
  API_KEY = '';
  API_URL = '';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.API_KEY = this.configService.get('ELEVENLABS_API_KEY');
    this.API_URL = this.configService.get('ELEVENLABS_API_URL');
  }

  async generateSpeech(@Res() res: Response, text: string) {
    const voiceId = 'pNInz6obpgDQGcFmaJgB';

    this.httpService
      .post(
        this.API_URL + `/v1/text-to-speech/${voiceId}?enable_logging=true`,
        { text },
        {
          headers: {
            'xi-api-key': this.API_KEY,
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      )
      .pipe(
        catchError((error: AxiosError) => {
          console.error(error.response.data);

          throw 'An error occured';
        }),
        map((response) => response.data),
      )
      .subscribe((data) => {
        res.set({
          'Content-Type': 'audio/mpeg',
          'Content-Length': data.length,
        });
        res.send(data);
      });

    return res;
  }
}
