import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EnvService {
  get NODE_ENV(): string {
    return process.env.NODE_ENV || 'prod';
  }
  get PORT(): number {
    return process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  }
  get JWT_SECRET(): string {
    return process.env.JWT_SECRET || 'jwt_secret';
  }
  get EMAIL_FROM(): string {
    return process.env.EMAIL_FROM || 'email_from';
  }
  get EMAIL_USER(): string {
    return process.env.EMAIL_USER || 'email_user';
  }
  get GOOGLE_CLIENT_ID(): string {
    return process.env.GOOGLE_CLIENT_ID || 'google_client_id';
  }
  get GOOGLE_CLIENT_SECRET(): string {
    return process.env.GOOGLE_CLIENT_SECRET || 'google_client_secret';
  }
  get REDIRECT_URI(): string {
    return process.env.REDIRECT_URI || 'redirect_uri';
  }
  get GMAIL_REFRESH_TOKEN(): string {
    return process.env.GMAIL_REFRESH_TOKEN || 'gmail_refresh_token';
  }
  get CLOUDINARY_CLOUD_NAME(): string {
    return process.env.CLOUDINARY_CLOUD_NAME || 'cloudinary_cloud_name';
  }
  get CLOUDINARY_API_KEY(): string {
    return process.env.CLOUDINARY_API_KEY || 'cloudinary_api_key';
  }
  get CLOUDINARY_API_SECRET(): string {
    return process.env.CLOUDINARY_API_SECRET || 'cloudinary_api_secret';
  }
}
