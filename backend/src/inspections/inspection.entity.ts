// ── À ajouter dans prisma/schema.prisma ────────────────────────────────────
//
// enum Domaine {
//   Plant
//   Magasin
//   Sanitaires
//   Cantine
//   Chimique
//   Locaux_techniques
//   Dechets
//   Transport
//   Infirmerie
//   Recycleurs
//   Incendie
// }
//
// enum InspectionStatus {
//   EN_COURS
//   TERMINEE
//   VALIDEE
//   ANNULEE
// }
//
// model Inspection {
//   id            String            @id @default(uuid())
//   domaine       Domaine
//   site          String
//   statut        InspectionStatus  @default(EN_COURS)
//   datePrevue    DateTime
//   dateRealise   DateTime?
//   latitude      Float?
//   longitude     Float?
//   timestamp     DateTime          @default(now())   // horodatage serveur
//   auditeurId    String
//   auditeur      User              @relation(fields: [auditeurId], references: [id])
//   checklistId   String?
//   checklist     ChecklistTemplate? @relation(fields: [checklistId], references: [id])
//   createdAt     DateTime          @default(now())
//   updatedAt     DateTime          @updatedAt
// }
//
// model ChecklistTemplate {
//   id          String       @id @default(uuid())
//   domaine     Domaine      @unique
//   titre       String
//   inspections Inspection[]
//   items       ChecklistItem[]
//   createdAt   DateTime     @default(now())
// }

// ── Fichier TypeScript entity (si vous utilisez TypeORM au lieu de Prisma) ──
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { Domaine } from '../common/enums/domaine.enum';

export enum InspectionStatus {
  EN_COURS  = 'EN_COURS',
  TERMINEE  = 'TERMINEE',
  VALIDEE   = 'VALIDEE',
  ANNULEE   = 'ANNULEE',
}

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Domaine })
  domaine: Domaine;

  @Column()
  site: string;

  @Column({ type: 'enum', enum: InspectionStatus, default: InspectionStatus.EN_COURS })
  statut: InspectionStatus;

  @Column({ type: 'timestamp' })
  datePrevue: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateRealise: Date | null;

  /** Latitude capturée côté client (navigator.geolocation) */
  @Column({ type: 'float', nullable: true })
  latitude: number | null;

  /** Longitude capturée côté client (navigator.geolocation) */
  @Column({ type: 'float', nullable: true })
  longitude: number | null;

  /** Horodatage serveur — non falsifiable */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column()
  auditeurId: string;

  @Column({ nullable: true })
  checklistId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
