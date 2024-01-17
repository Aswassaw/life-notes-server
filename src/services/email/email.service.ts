import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { EnvService } from '../variables/env.service';

@Injectable()
export class EmailService {
  private oAuth2Client;

  constructor(private envService: EnvService) {
    this.oAuth2Client = new google.auth.OAuth2(
      this.envService.GOOGLE_CLIENT_ID,
      this.envService.GOOGLE_CLIENT_SECRET,
      this.envService.REDIRECT_URI,
    );
    this.oAuth2Client.setCredentials({
      refresh_token: this.envService.GMAIL_REFRESH_TOKEN,
    });
  }

  async sendEmail(emailOptions: {
    from: string;
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const accessToken = await this.oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.envService.EMAIL_USER,
        clientId: this.envService.GOOGLE_CLIENT_ID,
        clientSecret: this.envService.GOOGLE_CLIENT_SECRET,
        refreshToken: this.envService.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token || '',
      },
    });

    const info = await transporter.sendMail(emailOptions);
    console.log('Email sent successfully.');
    console.log(info);
  }
}
