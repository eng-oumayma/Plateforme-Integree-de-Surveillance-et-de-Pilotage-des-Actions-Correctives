// src/anomalies/anomaly-photo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Anomaly } from './anomaly.entity';

@Entity('anomaly_photos')
export class AnomalyPhoto {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Anomaly, (a) => a.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anomaly_id' })
  anomaly!: Anomaly;

  @Column()
  filename!: string;

  @Column()
  url!: string;

  @Column({ nullable: true })
  originalName!: string;

  @CreateDateColumn()
  uploadedAt!: Date;
}
