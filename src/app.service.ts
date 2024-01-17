import { Injectable } from '@nestjs/common';
import { EnvService } from './services/variables/env.service';

@Injectable()
export class AppService {
  constructor(private envService: EnvService) {}

  getStatus(): string {
    return `Server Online (${this.envService.NODE_ENV === 'prod' ? 'Production' : 'Development'})!`;
  }
}
