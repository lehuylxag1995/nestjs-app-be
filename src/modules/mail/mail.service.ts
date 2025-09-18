import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmEmailRegister(user: User) {
    const name = user.name;
    const token = user.tokenEmailVerify;
    // const url = `http:localhost:3000/auth/verify?token=${user.tokenEmailVerify}`;

    return (await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mail xác thực đăng ký tài khoản',
      template: 'confirm',
      context: {
        token,
        name,
      },
    }))
      ? true
      : false;
  }
}
