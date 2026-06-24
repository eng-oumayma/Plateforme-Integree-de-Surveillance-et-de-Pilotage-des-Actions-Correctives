// src/checklists/checklist-response-photo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ChecklistResponse } from './checklist-response.entity';

@Entity('checklist_response_photos')
export class ChecklistResponsePhoto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ChecklistResponse, (r) => r.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'response_id' })
  response!: ChecklistResponse;

  @Column()
  filename!: string; // nom du fichier stocké

  @Column()
  url!: string; // URL d'accès à la photo

  @Column({ nullable: true })
  originalName!: string; // nom original uploadé

  @CreateDateColumn()
  uploadedAt!: Date;
}
