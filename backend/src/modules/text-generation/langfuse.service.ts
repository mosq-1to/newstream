import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Langfuse } from 'langfuse';

@Injectable()
export class LangfuseService {
  private langfuse: Langfuse;

  constructor(private readonly configService: ConfigService) {
    this.langfuse = new Langfuse({
      publicKey: this.configService.getOrThrow<string>('LANGFUSE_PUBLIC_KEY'),
      secretKey: this.configService.getOrThrow<string>('LANGFUSE_SECRET_KEY'),
      baseUrl: this.configService.getOrThrow<string>('LANGFUSE_HOST'),
    });
  }

  public createTrace({ name, userId = 'system' }: { name: string; userId?: string }) {
    return this.langfuse.trace({ name, userId });
  }
}
