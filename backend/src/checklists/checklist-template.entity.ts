// src/checklists/checklist-template.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChecklistItem } from './checklist-item.entity';
import { CotationType } from './enums/cotation-type.enum';
import { Domaine } from '../common/enums/domaine.enum';

@Entity('checklist_templates')
export class ChecklistTemplate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: Domaine })
  domaine!: Domaine;

  @Column()
  titre!: string;

  @Column({ default: 1 })
  version!: number;

  @Column({ type: 'enum', enum: CotationType })
  cotationType!: CotationType;

  @Column({ default: true })
  actif!: boolean;

  @OneToMany(() => ChecklistItem, (item) => item.template, {
    cascade: true,
    eager: false,
  })
  items!: ChecklistItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
