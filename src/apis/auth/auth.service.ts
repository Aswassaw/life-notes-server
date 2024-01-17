import {
  BadRequestException,
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

    if (!userSelected.active) {
      throw new UnauthorizedException('Please Verify Your Account');
    }

    const isPasswordValid = await this.bcryptService.comparePassword(
      dto.password,
      userSelected.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email Or Password Wrong');
    }

    const tokenSelected = await this.prismaService.authentication.findUnique({
      where: {
        user_id: userSelected.id,
      },
    });
    if (tokenSelected) {
      await this.prismaService.authentication.delete({
        where: {
          user_id: userSelected.id,
        },
      });
    }

    const refreshToken = this.jwtService.sign(
      { id: userSelected.id },
      {
        secret: this.envService.JWT_SECRET,
        expiresIn: 604800,
      },
    );
    await this.prismaService.authentication.create({
      data: {
        token: refreshToken,
        user_id: userSelected.id,
      },
    });

    return {
      accessToken: this.jwtService.sign(
        { id: userSelected.id },
        {
          secret: this.envService.JWT_SECRET,
          expiresIn: 120,
        },
      ),
      refreshToken,
    };
  }

  async verify(token: string) {
    await this.prismaService.$transaction(
      async (prisma) => {
        const tokenSelected = await prisma.token.findUnique({
          where: {
            token: token,
          },
        });

        if (!tokenSelected) {
          throw new BadRequestException('Invalid Activation Token');
        }

        await this.prismaService.user.update({
          where: {
            id: tokenSelected.user_id,
          },
          data: {
            active: true,
          },
        });

        await this.prismaService.token.delete({
          where: {
            token,
          },
        });
      },
      { timeout: 5000 },
    );
  }

  async refreshAccess(token: string) {
    try {
      const auth = this.jwtService.verify(token, {
        secret: this.envService.JWT_SECRET,
      });

      const refreshToken = await this.prismaService.authentication.findUnique({
        where: {
          token,
        },
      });
      if (!refreshToken) throw new Error();

      return {
        accessToken: this.jwtService.sign(
          { id: auth.id },
          {
            secret: this.envService.JWT_SECRET,
            expiresIn: 120,
          },
        ),
      };
    } catch (error) {
      throw new BadRequestException('Refresh Token Invalid');
    }
  }
}
