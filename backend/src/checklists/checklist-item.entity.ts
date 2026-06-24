// src/checklists/checklist-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChecklistTemplate } from './checklist-template.entity';

@Entity('checklist_items')
export class ChecklistItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ChecklistTemplate, (template) => template.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'template_id' })
  template!: ChecklistTemplate;

  @Column()
  section!: string;

  @Column()
  libelle!: string;

  // Pour Plant/Déchets : target = '1', '2' ou '3' = max de cotation de cet item
  // Pour Sanitaires : target = '' (l'échelle est fixe 0/4/6/8/10)
  // Pour Cantine/Infirmerie : target = '' (l'échelle est fixe 0/1/2)
  @Column({ nullable: true })
  target!: string;

  @Column({ default: 0 })
  ordre!: number;

  @Column({ default: true })
  actif!: boolean;
}
