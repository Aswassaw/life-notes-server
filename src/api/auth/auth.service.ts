import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  async register(dto: RegisterDto) {
    const userSelected = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (userSelected) {
      throw new ConflictException('Email Already Exist');
    }

    const passwordHashed = await this.bcryptService.hashPassword(dto.password);
    await this.prismaService.user.create({
      data: {
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        password: passwordHashed,
      },
    });
  }
}
