// src/users/users.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Put,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountStatus } from './user.entity';
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN_HSEE) // ← tout le controller = Admin only
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  // POST /api/users  ← Admin crée un user
  @Post()
  @Roles(Role.ADMIN_HSEE)
  async create(@Body() dto: CreateUserDto) {
    const { user, token } = await this.usersService.create(dto);

    // Envoyer email avec lien pour définir le password
    await this.mailService.sendSetPasswordEmail(
      user.email as string,
      user.firstName as string,
      token,
    );

    return {
      message: `Compte créé. Un email a été envoyé à ${user.email}`,
      user,
    };
  }

  // GET /api/users  ← Admin voit tous les users
  @Get()
  @Roles(Role.ADMIN_HSEE)
  findAll() {
    return this.usersService.findAll();
  }
  // GET /api/users/:id ← détail d'un user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // PATCH /api/users/:id ← modifier nom, rôle
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // PATCH /api/users/:id/status ← activer ou désactiver
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: AccountStatus) {
    return this.usersService.updateStatus(id, status);
  }
  // DELETE /api/users/:id ← supprimer
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
