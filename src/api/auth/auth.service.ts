import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';
import { EnvService } from 'src/utils/variables/env.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private envService: EnvService,
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

  async login(dto: LoginDto) {
    const userSelected = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!userSelected) {
      throw new UnauthorizedException('Email Or Password Wrong');
    }

    const isPasswordValid = await this.bcryptService.comparePassword(
      dto.password,
      userSelected.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email Or Password Wrong');
    }

    return {
      accessToken: this.jwtService.sign(
        { id: userSelected.id },
        {
          secret: this.envService.JWT_SECRET,
          expiresIn: 120,
        },
      ),
      refreshToken: this.jwtService.sign(
        { id: userSelected.id },
        {
          secret: this.envService.JWT_SECRET,
          expiresIn: 604800,
        },
      ),
    };
  }
}
