// src/anomalies/anomaly.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChecklistItem } from '../checklists/checklist-item.entity';
import { AnomalyPhoto } from './anomaly-photo.entity';
import { Criticality } from './enums/criticality.enum';
import { AnomalyStatus } from './enums/anomaly-status.enum';
import { User } from '../users/user.entity';

@Entity('anomalies')
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // FK vers Inspection (Epic 2 — binôme)
  // UUID simple, sans relation TypeORM directe (évite dépendance circulaire)
  @Column('uuid')
  inspectionId!: string;

  // FK vers ChecklistItem (optionnel — une anomalie peut être créée
  // indépendamment d'un item checklist, ex: observation terrain libre)
  @ManyToOne(() => ChecklistItem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'checklist_item_id' })
  checklistItem!: ChecklistItem | null;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: Criticality })
  criticite!: Criticality;

  @Column({
    type: 'enum',
    enum: AnomalyStatus,
    default: AnomalyStatus.OUVERTE,
  })
  statut!: AnomalyStatus;

  @OneToMany(() => AnomalyPhoto, (p) => p.anomaly, {
    cascade: true,
    eager: true,
  })
  photos!: AnomalyPhoto[];

  // FK vers User (qui a créé l'anomalie)
  @Column('uuid')
  createdById!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  // Site / domaine dupliqués pour faciliter les requêtes dashboard (Epic 6)
  @Column({ nullable: true })
  domaine!: string;

  @Column({ nullable: true })
  site!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
