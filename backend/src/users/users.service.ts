// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountStatus } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

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

  // ── Liste tous les users (admin) ───────────────────
  async findAll(): Promise<User[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}
