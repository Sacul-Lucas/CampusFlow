/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    if (!users)
      throw new UnauthorizedException('Não foi possível listar os usuários');

    return {
      success: true,
      message: users,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    return {
      success: true,
      message: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() body: CreateUserDto) {
    const createdUser = this.usersService.create(body);
    if (!createdUser)
      throw new UnauthorizedException('Não foi possível criar um novo usuário');

    if (!body.username)
      throw new UnauthorizedException('Insira um nome de usuário válido');
    if (!body.email) throw new UnauthorizedException('Insira um email válido');
    if (!body.password)
      throw new UnauthorizedException('Insira uma senha válida');

    const exists = await this.usersService.findByEmail(body.email);
    if (exists) throw new UnauthorizedException('Email já foi registrado');

    return {
      success: true,
      message: 'Novo usuário adicionado com sucesso!',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, body);
    if (!updatedUser)
      throw new UnauthorizedException('Não foi possível editar o usuário');

    return {
      success: true,
      message: 'Informações do usuário atualizadas com sucesso!',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const delUser = await this.usersService.remove(id);
    if (!delUser)
      throw new UnauthorizedException('Não foi possível remover o usuário');

    return {
      success: true,
      message: 'Usuário removido com sucesso!',
    };
  }
}
