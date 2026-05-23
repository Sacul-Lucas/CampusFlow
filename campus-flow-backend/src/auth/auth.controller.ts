import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email) throw new UnauthorizedException('Insira um email válido');
    if (!body.password)
      throw new UnauthorizedException('Insira uma senha válido');

    const user = await this.usersService.findByEmail(body.email);
    if (!user) throw new UnauthorizedException('Email não encontrado');

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Senha incorreta');

    const token = this.authService.generateJwt(user);
    return { success: true, message: 'Login realizado com sucesso', token };
  }

  @Post('register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    if (!body.username)
      throw new UnauthorizedException('Insira um nome de usuário válido');
    if (!body.email) throw new UnauthorizedException('Insira um email válido');
    if (!body.password)
      throw new UnauthorizedException('Insira uma senha válida');

    const exists = await this.usersService.findByEmail(body.email);
    if (exists) throw new UnauthorizedException('Email já foi registrado');

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.usersService.create({
      username: body.username,
      email: body.email,
      password: hashedPassword,
      role: 'user',
    });

    const token = this.authService.generateJwt(user);
    return { success: true, message: 'Usuário registrado com sucesso', token };
  }
}
