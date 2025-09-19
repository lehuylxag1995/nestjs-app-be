import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmEmailRegister(email: string, name: string, otp: string) {
    try {
      const isCheckSendMail = (await this.mailerService.sendMail({
        to: email,
        subject: 'Mail xác thực đăng ký tài khoản',
        template: 'confirm',
        context: {
          name,
          otp,
        },
      }))
        ? true
        : false;

      if (!isCheckSendMail)
        throw new BadRequestException('Không gửi được mail để xác thực');

      return isCheckSendMail;
    } catch (error) {
      throw error;
    }
  }
}
