import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async getUsers() {
    return this.db.user.findMany({});
  }

  async findOrCreateUser({ email }: { email: string }) {
    const user = await this.db.user.findUnique({ where: { email } });

    if (!user) {
      return this.db.user.create({ data: { email } });
    }

    return user;
  }
}
