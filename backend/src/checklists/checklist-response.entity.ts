// src/checklists/checklist-response.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { ChecklistResponsePhoto } from './checklist-response-photo.entity';

// Note : inspection_id est une FK vers l'entité Inspection du binôme
// On utilise un simple UUID pour ne pas créer une dépendance circulaire
// Le binôme fera la relation depuis son côté

@Entity('checklist_responses')
export class ChecklistResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // FK vers Inspection (Epic 2 - binôme)
  // On stocke juste l'UUID sans relation TypeORM pour éviter la dépendance
  @Column('uuid')
  inspectionId!: string;

  @ManyToOne(() => ChecklistItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item!: ChecklistItem;

  @Column({ nullable: true })
  cotation!: string; // '0','1','2','3','NA','4','6','8','10'

  @Column({ type: 'text', nullable: true })
  observation!: string; // déviation / commentaire

  @Column({ type: 'text', nullable: true })
  analyseCauses!: string; // analyse des causes

  @Column({ nullable: true })
  responsable!: string; // responsable de l'action

  @Column({ nullable: true, type: 'date' })
  delai!: Date; // deadline pour corriger

  @OneToMany(() => ChecklistResponsePhoto, (p) => p.response, {
    cascade: true,
    eager: true,
  })
  photos!: ChecklistResponsePhoto[];

  @Column({ default: false })
  isDeviation!: boolean; // true si cotation insuffisante

  @CreateDateColumn()
  createdAt!: Date;
}
