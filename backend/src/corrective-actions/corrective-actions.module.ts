import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorrectiveAction } from './corrective-action.entity';
import { Anomaly } from '../anomalies/anomaly.entity';
import { User } from '../users/user.entity';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CorrectiveActionsController } from './corrective-actions.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CorrectiveAction, Anomaly, User]),
    MailModule,
  ],
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
  exports: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
