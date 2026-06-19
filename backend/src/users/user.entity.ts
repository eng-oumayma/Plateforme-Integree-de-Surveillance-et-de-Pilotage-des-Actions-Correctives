// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Role } from './enums/role.enum';

export enum AccountStatus {
  PENDING = 'PENDING', // compte créé, password pas encore défini
  ACTIVE = 'ACTIVE', // password défini, peut se connecter
  INACTIVE = 'INACTIVE', // désactivé par admin
}

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

  @Column({ nullable: true, select: false })
  password!: string; // null jusqu'à ce que le user définit son password

  @Column({ type: 'enum', enum: Role, default: Role.AUDITEUR })
  role!: Role;

  @Column({ default: 'Menzel Hayet' })
  department!: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status!: AccountStatus; // PENDING → ACTIVE après définition password

  // Token pour définir le password (envoyé par email)
  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  setPasswordToken!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  setPasswordExpires!: Date | null;

  // Token pour reset password (oublié)
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
