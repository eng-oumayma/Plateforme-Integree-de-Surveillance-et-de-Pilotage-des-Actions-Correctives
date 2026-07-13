// src/corrective-actions/action-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { CorrectiveAction } from './corrective-action.entity';
import { User } from '../users/user.entity';

@Entity('action_history')
export class ActionHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CorrectiveAction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_id' })
  action!: CorrectiveAction;

  @Column('uuid')
  actionId!: string;

  @Column()
  fromStatut!: string;

  @Column()
  toStatut!: string;

  @Column({ nullable: true })
  motif!: string; // motif de rejet

  @Column('uuid')
  changedById!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'changedById' })
  changedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
