import { FacebookStrategy } from '@Modules/auth/strategies/facebook.strategy';
import { jwtStrategy } from '@Modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@Modules/auth/strategies/local.strategy';
import { MailModule } from '@Modules/mail/mail.module';
import { OtpModule } from '@Modules/otp/otp.module';
import { PrismaModule } from '@Modules/prisma/prisma.module';
import { RolesModule } from '@Modules/roles/roles.module';
import { TokenModule } from '@Modules/token/token.module';
import { UserSocialModule } from '@Modules/user-provider/user-social.module';
import { UsersModule } from '@Modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    UserSocialModule,
    RolesModule,
    PassportModule,
    TokenModule,
    OtpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: '15m', // chỉ set cho access token
        },
      }),
    }),
    MailModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, jwtStrategy, FacebookStrategy], //3./ Áp dụng chiến lược cho moduule
})
export class AuthModule {}
