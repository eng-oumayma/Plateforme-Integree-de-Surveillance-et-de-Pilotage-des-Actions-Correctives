import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Domaine } from '../common/enums/domaine.enum';
import { InspectionStatus } from '../common/enums/Inspection-status.enum';
import { User } from '../users/user.entity';
import { IsUUID } from 'class-validator/types/decorator/string/IsUUID';
import { IsOptional } from 'class-validator/types/decorator/common/IsOptional';

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: Domaine })
  domaine!: Domaine;

  @Column()
  site!: string;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.EN_COURS,
  })
  statut!: InspectionStatus;

  @Column({ type: 'timestamp' })
  datePrevue!: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateRealise!: Date | null;

  /** Latitude capturée par navigator.geolocation côté client */
  @Column({ type: 'float', nullable: true })
  latitude!: number | null;

  /** Longitude capturée par navigator.geolocation côté client */
  @Column({ type: 'float', nullable: true })
  longitude!: number | null;

  /** Horodatage serveur — injecté à la création, non falsifiable */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  /** FK vers l'auditeur qui a créé l'inspection */
  @Column()
  auditeurId!: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'auditeurId' })
  auditeur!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  planId?: string;

  // ── Champs de clôture (US7) ──────────────────────────────────────────────
 
  /** ID de l'auditeur qui a clôturé */
  @Column({ nullable: true })
  closedById: string | null;
 
  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'closedById' })
  closedBy: User;
 
  /** Date/heure de clôture */
  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date | null;
 
  /** Durée de l'inspection en minutes (closedAt - timestamp) */
  @Column({ type: 'int', nullable: true })
  durationMinutes: number | null;
 
  /** Score checklist (0-100) calculé à la clôture */
  @Column({ type: 'float', nullable: true })
  score: number | null;
 
  /** Nombre de questions répondues à la clôture */
  @Column({ type: 'int', nullable: true })
  itemsAnswered: number | null;
 
  /** Nombre total de questions de la checklist */
  @Column({ type: 'int', nullable: true })
  itemsTotal: number | null;
 
  /** Nombre d'anomalies détectées */
  @Column({ type: 'int', nullable: true, default: 0 })
  anomaliesCount: number | null;
 
}