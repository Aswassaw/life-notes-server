import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EnvService } from 'src/services/variables/env.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { EmailService } from 'src/services/email/email.service';
import { TemplateService } from 'src/services/email/template.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private envService: EnvService,
    private emailService: EmailService,
    private templateService: TemplateService,
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
    const activationToken = `${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
    await this.prismaService.user.create({
      data: {
        first_name: dto.firstName,
        last_name: dto.lastName,
        email: dto.email,
        password: passwordHashed,
        token: {
          create: {
            token: activationToken,
          },
        },
      },
    });

    const templateEmail = {
      from: `"Life Notes" <${this.envService.EMAIL_FROM}>`,
      to: dto.email.toLowerCase(),
      subject: 'Thanks For Your Registration',
      html: this.templateService.verifyAfterRegistration({
        link: `${this.envService.API_URL}/auth/verify/${activationToken}`,
      }),
    };
    this.emailService.sendEmail(templateEmail);
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
