import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Strategy, Profile, VerifyFunction } from 'passport-google-oauth';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: 'email profile',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyFunction,
  ) {
    try {
      const user = await this.authService.findOrCreateUser({
        email: profile.emails[0].value,
      });

      if (!user) {
        done(new UnauthorizedException(), false);
      }
      done(null, user);
    } catch (e) {
      done(e, false);
    }
  }

  parseResponseError(...args: any[]) {
    console.log(args);
  }
}
