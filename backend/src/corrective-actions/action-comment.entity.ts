// src/corrective-actions/action-comment.entity.ts
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

@Entity('action_comments')
export class ActionComment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CorrectiveAction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_id' })
  action!: CorrectiveAction;

  @Column('uuid')
  actionId!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column('uuid')
  authorId!: string;

  @Column({ type: 'text' })
  message!: string;

  // Mentions : liste d'UUIDs des utilisateurs mentionnés (@user)
  @Column({ type: 'simple-array', nullable: true, default: '' })
  mentions!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}
