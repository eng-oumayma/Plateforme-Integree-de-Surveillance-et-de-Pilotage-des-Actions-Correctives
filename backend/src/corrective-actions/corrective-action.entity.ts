// src/corrective-actions/corrective-action.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Anomaly } from '../anomalies/anomaly.entity';
import { User } from '../users/user.entity';
import { ActionStatus } from './enums/action-status.enum';
import { Criticality } from '../anomalies/enums/criticality.enum';
import { ActionProof } from './action-proof.entity';
import { OneToMany } from 'typeorm';
@Entity('corrective_actions')
export class CorrectiveAction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Relation 1:1 avec Anomaly ──────────────────────────────────
  @OneToOne(() => Anomaly, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anomaly_id' })
  anomaly!: Anomaly;

  @Column('uuid')
  anomalyId!: string;

  // ── Contenu ────────────────────────────────────────────────────
  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: Criticality })
  criticite!: Criticality;

  @Column({ type: 'date' })
  deadline!: Date;

  @Column({ type: 'text', nullable: true })
  criteresValidation!: string;

  // ── Statut ─────────────────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: ActionStatus,
    default: ActionStatus.A_FAIRE,
  })
  statut!: ActionStatus;

  @Column({ type: 'text', nullable: true })
  motifRejet!: string; // rempli si statut = REJETEE

  @Column({ default: 0 })
  progression!: number; // 0 à 100 %

  // ── Relations utilisateurs ─────────────────────────────────────
  @Column('uuid')
  piloteId!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'piloteId' })
  pilote!: User;

  @Column('uuid')
  createdById!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column('uuid', { nullable: true })
  closedById!: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'closedById' })
  closedBy!: User;
  @OneToMany(() => ActionProof, (proof) => proof.action, {
    cascade: true,
    eager: false,
  })
  proofs!: ActionProof[];
  @Column({ type: 'timestamp', nullable: true })
  closedAt!: Date;

  // ── Domaine / Site (dupliqués depuis anomalie pour dashboard) ──
  @Column({ nullable: true })
  domaine!: string;

  @Column({ nullable: true })
  site!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
