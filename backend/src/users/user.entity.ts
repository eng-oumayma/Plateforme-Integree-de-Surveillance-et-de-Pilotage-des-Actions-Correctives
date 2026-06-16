import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // jamais renvoyé dans les réponses API
  password!: string;
  @Column({ type: 'enum', enum: Role, default: Role.AUDITEUR })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }
  // Ajouter ces colonnes dans user.entity.ts
  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  confirmationToken!: string | null;

  @Column({ default: false })
  isEmailConfirmed!: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  resetPasswordToken!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordExpires!: Date | null;
}
