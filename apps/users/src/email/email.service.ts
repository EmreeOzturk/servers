import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
type mailOptions = {
  subject: string;
  template: string;
  activationCode: string;
  email: string;
  name: string;
};

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendEmail({
    subject,
    template,
    activationCode,
    email,
    name,
  }: mailOptions) {
    await this.mailService.sendMail({
      to: email,
      subject,
      template,
      context: {
        activationCode,
        name,
      },
    });
  }
}
