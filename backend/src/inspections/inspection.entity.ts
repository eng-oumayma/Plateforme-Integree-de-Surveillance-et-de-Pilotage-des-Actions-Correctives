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

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Domaine })
  domaine: Domaine;

  @Column()
  site: string;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.EN_COURS,
  })
  statut: InspectionStatus;

  @Column({ type: 'timestamp' })
  datePrevue: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateRealise: Date | null;

  /** Latitude capturée par navigator.geolocation côté client */
  @Column({ type: 'float', nullable: true })
  latitude: number | null;

  /** Longitude capturée par navigator.geolocation côté client */
  @Column({ type: 'float', nullable: true })
  longitude: number | null;

  /** Horodatage serveur — injecté à la création, non falsifiable */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  /** FK vers l'auditeur qui a créé l'inspection */
  @Column()
  auditeurId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'auditeurId' })
  auditeur: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}