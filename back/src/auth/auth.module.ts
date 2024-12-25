import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

const publicKey = process.env.AUTH_PUBLIC_KEY;

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: publicKey,
      signOptions: { expiresIn: '7d' },
    }),
    ConfigModule.forFeature(googleOauthConfig),
    PassportModule.register({ defaultStrategy: 'microsoft' }),
  ],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    AuthService,
    PrismaService,
    UsersService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
