import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Domaine } from '../common/enums/domaine.enum';
import { Frequence } from '../common/enums/Frequence.enum';
import { PlanStatut } from '../common/enums/Plan-statut.enum';
import { User } from '../users/user.entity';

@Entity('plan_surveillance')
@Index(['annee', 'semaine', 'domaine'], { unique: true })
export class PlanSurveillance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Numéro de semaine ISO (1–52) */
  @Column({ type: 'int' })
  semaine: number;

  /** Année du plan */
  @Column({ type: 'int' })
  annee: number;

  @Column({ type: 'enum', enum: Domaine })
  domaine: Domaine;

  @Column({ type: 'enum', enum: Frequence })
  frequence: Frequence;

  @Column({ type: 'enum', enum: PlanStatut, default: PlanStatut.PLANIFIE })
  statut: PlanStatut;

  /** Site concerné */
  @Column({ nullable: true })
  site: string;

  /** Date de début de la semaine (lundi) */
  @Column({ type: 'date' })
  dateDebut: Date;

  /** Date de fin de la semaine (dimanche) */
  @Column({ type: 'date' })
  dateFin: Date;

  /** Lien vers l'inspection réalisée (quand statut = REALISE) */


  @Column({ type: 'varchar', nullable: true })
inspectionId: string;

  /** Responsable assigné */
  @Column({ nullable: true })
  responsableId: string | null;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'responsableId' })
  responsable: User;

  /** Commentaire libre */
  @Column({ type: 'text', nullable: true })
 commentaire?: string | null;

  /** Vrai si généré automatiquement par le cron */
  @Column({ default: false })
  autoGenere: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}