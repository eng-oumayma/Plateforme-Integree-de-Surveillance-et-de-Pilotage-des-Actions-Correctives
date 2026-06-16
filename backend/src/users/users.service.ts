import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './types/user-response.type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // password exclu par défaut, on le force ici
      .where('user.email = :email AND user.isActive = true', { email })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id, isActive: true } });
  }
  async save(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }
  // Ajouter ces méthodes dans UsersService

  // Sauvegarder le token de confirmation
  async saveConfirmationToken(id: string, token: string): Promise<void> {
    await this.usersRepository.update(id, { confirmationToken: token });
  }

  // Trouver user par token de confirmation
  async findByConfirmationToken(token: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.confirmationToken')
      .where('user.confirmationToken = :token', { token })
      .getOne();
  }

  // Confirmer le compte
  async confirmUser(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      isEmailConfirmed: true,
      confirmationToken: null,
    });
  }

  // Sauvegarder le token de reset
  async saveResetToken(
    id: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this.usersRepository.update(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  }

  // Trouver user par token de reset
  async findByResetToken(token: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.resetPasswordToken')
      .addSelect('user.resetPasswordExpires')
      .where('user.resetPasswordToken = :token', { token })
      .getOne();
  }

  // Mettre à jour le mot de passe
  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 12);
    await this.usersRepository.update(id, {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const exists = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const user = this.usersRepository.create(dto);

    const saved = await this.usersRepository.save(user);

    const { password, ...result } = saved;

    return result;
  }
}
