import { MailBadRequestException } from '@Modules/mail/exceptions/mail-badrequest.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

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
        throw new MailBadRequestException({
          message: 'Không gửi được mail để xác thực',
        });

      return isCheckSendMail;
    } catch (error) {
      throw error;
    }
  }

  async sendResetPassword(
    uId: string,
    email: string,
    name: string,
    otp: string,
  ) {
    try {
      const isCheckSendMail = (await this.mailerService.sendMail({
        to: email,
        subject: 'Mail cập nhật mật khẩu tài khoản',
        template: 'reset-password',
        context: {
          name,
          otp,
          uId,
        },
      }))
        ? true
        : false;

      if (!isCheckSendMail)
        throw new MailBadRequestException({
          message: 'Không gửi được mail để xác thực',
        });

      return isCheckSendMail;
    } catch (error) {
      throw error;
    }
  }
}
