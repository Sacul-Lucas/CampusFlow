import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedAdmin implements OnApplicationBootstrap {
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const username = process.env.ADMIN_USERNAME || 'Administrador';
    const role = process.env.ADMIN_ROLE;

    if (!email || !password) {
      console.warn(
        'ADMIN_EMAIL e ADMIN_PASSWORD não estão definidos no .env. Admin não será criado.',
      );
      return;
    }

    const exists = await this.usersService.findByEmail(email);
    if (exists) {
      console.log(`Admin já existe: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'admin',
    });

    console.log(`Admin criado com sucesso: ${email}`);
  }
}
