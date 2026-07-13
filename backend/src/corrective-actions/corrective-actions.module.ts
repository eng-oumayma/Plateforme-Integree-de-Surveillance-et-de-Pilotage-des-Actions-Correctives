import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorrectiveAction } from './corrective-action.entity';
import { Anomaly } from '../anomalies/anomaly.entity';
import { User } from '../users/user.entity';
import { CorrectiveActionsService } from './corrective-actions.service';
import { CorrectiveActionsController } from './corrective-actions.controller';
import { MailModule } from '../mail/mail.module';
import { ActionProof } from './action-proof.entity';
import { ActionComment } from './action-comment.entity';
import { ActionHistory } from './action-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorrectiveAction,
      ActionProof,
      Anomaly,
      User,
      ActionComment,
      ActionHistory,
    ]),
    MailModule,
  ],
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
  exports: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
