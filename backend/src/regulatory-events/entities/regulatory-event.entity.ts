import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RegulatoryEventType } from '../enums/regulatory-type.enum';
import { User } from '../../users/user.entity'; // À adapter selon le chemin de votre entité User

export enum RegulatoryEventStatut {
  PLANIFIE  = 'PLANIFIE',
  REALISE   = 'REALISE',
  EN_RETARD = 'EN_RETARD',
  ANNULE    = 'ANNULE',
}

@Entity('regulatory_events')
export class RegulatoryEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RegulatoryEventType,
  })
  type: RegulatoryEventType;

  @Column({ type: 'varchar', length: 255 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  datePrevue: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateRealisation: Date;

  @Column({
    type: 'enum',
    enum: RegulatoryEventStatut,
    default: RegulatoryEventStatut.PLANIFIE,
  })
  statut: RegulatoryEventStatut;

  @Column({ type: 'varchar', length: 100, default: 'AUCUNE' }) // AUCUNE, ANNUELLE, SEMESTRIELLE, etc.
  recurrence: string;

  @Column({ name: 'responsable_id' })
  responsableId: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'responsable_id' })
  responsable: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}