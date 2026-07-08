import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

/**
 * @Global() permet à NotificationsService d'être injecté dans tous les
 * autres modules sans avoir à importer NotificationsModule partout.
 * Ajoutez juste NotificationsModule dans app.module.ts une seule fois.
 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}