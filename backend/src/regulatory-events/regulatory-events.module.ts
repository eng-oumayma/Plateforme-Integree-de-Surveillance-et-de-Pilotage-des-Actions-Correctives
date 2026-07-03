import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegulatoryEventsService } from './regulatory-events.service';
import { RegulatoryEventsController } from './regulatory-events.controller';
import { RegulatoryEvent } from './entities/regulatory-event.entity';
import { RegulatoryEventsCronService } from './regulatory-events.cron';

@Module({
  imports: [
    // 🎯 Enregistrement de l'entité pour permettre l'utilisation de @InjectRepository(RegulatoryEvent)
    TypeOrmModule.forFeature([RegulatoryEvent]),
  ],
  controllers: [RegulatoryEventsController],
  providers: [RegulatoryEventsService,
    RegulatoryEventsCronService
  ],
  exports: [RegulatoryEventsService], // Exporté au cas où un autre module (comme le Cron d'alertes) en aurait besoin
})
export class RegulatoryEventsModule {}