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
import { ProofType } from './enums/proof-type.enum';

@Entity('action_proofs')
export class ActionProof {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CorrectiveAction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_id' })
  action!: CorrectiveAction;

  @Column('uuid')
  actionId!: string;

  @Column({ type: 'enum', enum: ProofType })
  type!: ProofType;

  @Column()
  filename!: string; // nom stocké sur disque

  @Column()
  originalName!: string; // nom original uploadé par le pilote

  @Column()
  url!: string; // URL d'accès au fichier

  @Column()
  mimetype!: string; // image/jpeg, application/pdf, etc.

  @Column({ type: 'int' })
  size!: number; // taille en octets

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy!: User;

  @Column('uuid')
  uploadedById!: string;

  @CreateDateColumn()
  uploadedAt!: Date;
}
