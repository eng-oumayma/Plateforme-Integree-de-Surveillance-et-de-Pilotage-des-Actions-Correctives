import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, Index,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum NotificationType {
  INSPECTION_CREEE      = 'INSPECTION_CREEE',
  INSPECTION_CLOTUREE   = 'INSPECTION_CLOTUREE',
  INSPECTION_EN_RETARD  = 'INSPECTION_EN_RETARD',
  PLAN_ASSIGNE          = 'PLAN_ASSIGNE',
  PLAN_EN_RETARD        = 'PLAN_EN_RETARD',
  EVENEMENT_ECHEANCE    = 'EVENEMENT_ECHEANCE',
  ACTION_ASSIGNEE       = 'ACTION_ASSIGNEE',
  ACTION_EN_RETARD      = 'ACTION_EN_RETARD',
  ANOMALIE_DETECTEE     = 'ANOMALIE_DETECTEE',
  SYSTEME               = 'SYSTEME',
}

@Entity('notifications')
@Index(['destinataireId', 'lu'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destinataireId: string;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'destinataireId' })
  destinataire: User;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  titre: string;

 @Column({ type: 'varchar', nullable: true })
  message: string;

  /** URL de navigation au clic — ex: /inspections/abc123 */

  @Column({ type: 'varchar', nullable: true })
  lien: string | null;

  @Column({ default: false })
  lu: boolean;

 @Column({ type: 'timestamp', nullable: true })
  luAt: Date | null;

  /** Métadonnée optionnelle (ID entité liée) */
@Column({ type: 'varchar', nullable: true })
  entityId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}