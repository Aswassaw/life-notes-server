import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'pretty',
      log: ['query', 'info', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async $onDestroy() {
    await this.$disconnect();
  }
}
