// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // ── Créer user par l'admin ─────────────────────────
  async create(
    dto: CreateUserDto,
  ): Promise<{ user: Partial<User>; token: string }> {
    const exists = await this.repo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Cet email est déjà utilisé');

    // Générer token pour définir le password (expire dans 48h)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 48 * 3600000);

    const user = this.repo.create({
      ...dto,
      status: AccountStatus.PENDING,
      setPasswordToken: token,
      setPasswordExpires: expires,
    });

    const saved = await this.repo.save(user);
    const { password, setPasswordToken, resetPasswordToken, ...result } = saved;
    return { user: result, token };
  }

  // ── Trouver par email ──────────────────────────────
  async findByEmail(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  // ── Trouver par ID ─────────────────────────────────
  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  // ── Trouver par setPasswordToken ───────────────────
  async findBySetPasswordToken(token: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.setPasswordToken')
      .addSelect('user.setPasswordExpires')
      .where('user.setPasswordToken = :token', { token })
      .getOne();
  }

  // ── Définir le password (première fois) ───────────
  async setPassword(id: string, password: string): Promise<void> {
    const hashed = await bcrypt.hash(password, 12);
    await this.repo.update(id, {
      password: hashed,
      status: AccountStatus.ACTIVE,
      setPasswordToken: null,
      setPasswordExpires: null,
    });
  }

  // ── Reset password token ───────────────────────────
  async saveResetToken(
    id: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.repo.update(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.resetPasswordToken')
      .addSelect('user.resetPasswordExpires')
      .where('user.resetPasswordToken = :token', { token })
      .getOne();
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.repo.update(id, {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  // ── GET tous les users ─────────────────────────────
  async findAll(): Promise<User[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  // ── PUT modifier un user ───────────────────────────
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    Object.assign(user, dto);
    return this.repo.save(user);
  }

  // ── PATCH activer / désactiver ─────────────────────
  async updateStatus(
    id: string,
    status: AccountStatus,
  ): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }
    // Empêcher de désactiver l'admin
    if (user.role === Role.ADMIN_HSEE && status === AccountStatus.INACTIVE) {
      throw new BadRequestException(
        'Impossible de désactiver un compte Admin HSEE',
      );
    }

    await this.repo.update(id, { status });
    return {
      message:
        status === AccountStatus.ACTIVE
          ? `✅ Compte de ${user.firstName} activé`
          : `⛔ Compte de ${user.firstName} désactivé`,
    };
  }

  // ── DELETE supprimer un user ───────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Empêcher de supprimer l'admin
    if (user.role === Role.ADMIN_HSEE) {
      throw new BadRequestException(
        'Impossible de supprimer un compte Admin HSEE',
      );
    }

    await this.repo.delete(id);
    return {
      message: `✅ Utilisateur ${user.firstName} ${user.lastName} supprimé`,
    };
  }
}
