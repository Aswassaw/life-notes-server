import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Res() res: Response, @Body() body: RegisterDto) {
    await this.authService.register(body);

    return res.status(201).json({
      message: 'Register Success',
      statusCode: 201,
    });
  }

  @Post('/login')
  async login(@Res() res: Response, @Body() body: LoginDto) {
    const data = await this.authService.login(body);

    return res.status(200).json({
      message: 'Login Success',
      statusCode: 200,
      data,
    });
  }
}
