import { jwtStrategy } from '@Modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@Modules/auth/strategies/local.strategy';
import { MailModule } from '@Modules/mail/mail.module';
import { TokenModule } from '@Modules/token/token.module';
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
    PassportModule,
    TokenModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, jwtStrategy], //3./ Áp dụng chiến lược cho moduule
})
export class AuthModule {}
