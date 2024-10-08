import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    constructor(
        private readonly mailService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    async sendMail({
        to,
        cc, // Made optional
        bcc, // Made optional
        subject,
        html,
        attachments = [] // Ensure attachments is an array
    }: {
        to: string;
        cc?: string; // Made optional
        bcc?: string; // Made optional
        subject: string;
        html: string;
        attachments?: Record<string, any>[]; // Made optional
    }) {
        return this.mailService.sendMail({
            from: `"Ecommerce" <${this.configService.get<string>('EMAIL_USERNAME')}>`,
            to,
            cc,
            bcc,
            subject,
            html,
            attachments // Correctly passing attachments
        });
    }
}

