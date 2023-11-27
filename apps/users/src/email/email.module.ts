import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          secure: true,
          auth: {
            user: config.get('SMTP_MAIL'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: 'Foodie',
        },
        template: {
          dir: join(__dirname, '../../../../servers/email-templates'),
          options: {
            strict: false,
          },
          adapter: new EjsAdapter(),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
