import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegulatoryEvent } from './entities/regulatory-event.entity';
import { CreateRegulatoryEventDto } from './dto/create-regulatory-event.dto';

@Injectable()
export class RegulatoryEventsService {
  constructor(
    @InjectRepository(RegulatoryEvent)
    private readonly repo: Repository<RegulatoryEvent>,
  ) {}

  async create(dto: CreateRegulatoryEventDto): Promise<RegulatoryEvent> {
    const event = this.repo.create({
      ...dto,
      datePrevue: new Date(dto.datePrevue),
    });
    return this.repo.save(event);
  }

  async findAll(): Promise<RegulatoryEvent[]> {
    return this.repo.find({ order: { datePrevue: 'ASC' } });
  }

  async findOne(id: string): Promise<RegulatoryEvent> {
    const event = await this.repo.findOne({ where: { id } });
    if (!event) throw new NotFoundException(`Événement réglementaire #${id} introuvable.`);
    return event;
  }

  async update(id: string, attrs: Partial<RegulatoryEvent>): Promise<RegulatoryEvent> {
    const event = await this.findOne(id);
    Object.assign(event, attrs);
    return this.repo.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.repo.remove(event);
  }
}