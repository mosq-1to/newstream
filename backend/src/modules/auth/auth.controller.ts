import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users/me')
  async getCurrentUser(@Req() req): Promise<UserResponseDto> {
    const currentUser = await this.authService.getCurrentUser(req.user.id);
    return {
      id: currentUser.id,
      email: currentUser.email,
    };
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
