import {
  Controller, Get, Put, Delete, Param,
  Query, UseGuards, Req, ParseIntPipe, DefaultValuePipe,
  Res, Sse,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { Observable, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications?page=1&limit=20
   * Notifications paginées de l'utilisateur connecté
   */
  @Get()
  findAll(
    @Req() req,
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page:  number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.findAllForUser(req.user.userId, page, limit);
  }

  /**
   * GET /notifications/unread-count
   * Nombre de notifications non-lues — utilisé par le badge
   * ⚠️ Avant ':id'
   */
  @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.notificationsService.getUnreadCount(req.user.userId)
      .then((count) => ({ count }));
  }

  /**
   * GET /notifications/poll?since=2024-01-01T00:00:00Z
   * Polling — nouvelles notifs depuis un timestamp (fallback SSE)
   * ⚠️ Avant ':id'
   */
  @Get('poll')
  poll(@Req() req, @Query('since') since: string) {
    return this.notificationsService.getNewSince(req.user.userId, since);
  }

  /**
   * GET /notifications/stream — SSE (Server-Sent Events)
   * Le frontend s'abonne pour recevoir les notifs en temps réel
   * ⚠️ Avant ':id'
   */
  @Sse('stream')
  stream(@Req() req): Observable<MessageEvent> {
    const userId = req.user.userId;
    return interval(30000).pipe(
      switchMap(() => this.notificationsService.getUnreadCount(userId)),
      map((count) => ({
        data: JSON.stringify({ unreadCount: count }),
      } as MessageEvent)),
    );
  }

  /**
   * PUT /notifications/:id/read
   * Marquer une notification comme lue
   */
  @Put(':id/read')
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  /**
   * PUT /notifications/read-all
   * Marquer toutes comme lues
   * ⚠️ Avant ':id'
   */
  @Put('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  /**
   * DELETE /notifications/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.notificationsService.remove(id, req.user.userId);
  }

  /**
   * DELETE /notifications/clear-read
   * Supprimer toutes les notifs lues
   */
  @Delete('clear-read')
  clearRead(@Req() req) {
    return this.notificationsService.clearRead(req.user.userId);
  }
}