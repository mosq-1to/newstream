import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async getCurrentUser(userId: string) {
    return this.db.user.findUnique({ where: { id: userId } });
  }

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

  signJwt(user: { email: string; id: string }) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
