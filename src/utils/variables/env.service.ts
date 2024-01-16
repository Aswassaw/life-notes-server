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
}
