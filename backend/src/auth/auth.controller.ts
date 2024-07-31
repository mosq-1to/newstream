import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/users')
  getUsers() {
    return this.authService.getUsers();
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleLogin() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleLoginCallback() {}
}
