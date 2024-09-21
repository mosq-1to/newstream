import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/me')
  getCurrentUser(@Req() req) {
    return this.authService.getCurrentUser(req.user.id);
  }

  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }

  @SkipAuth()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleLogin() {}

  @SkipAuth()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleLoginCallback(@Req() req) {
    return this.authService.signJwt(req.user);
  }
}
