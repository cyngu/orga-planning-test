import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { createJwtToken } from 'src/utils/tokenAuth';

const FRONT_URL = process.env.FRONT_URL;
@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallBack(@Req() req, @Res() res) {
    const { user } = req;
    const token = createJwtToken(user);
    res.redirect(`${FRONT_URL}/connexion/sso?token=${token}`);
  }
}
