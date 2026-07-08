import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';

export interface CreateNotifPayload {
  destinataireId: string;
  type: NotificationType;
  titre: string;
  message: string;
  lien?: string;
  entityId?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  // ── Créer une notification (appelé par tous les autres modules) ──────────
  async create(payload: CreateNotifPayload): Promise<Notification> {
    const notif = this.repo.create({
      destinataireId: payload.destinataireId,
      type:           payload.type,
      titre:          payload.titre,
      message:        payload.message,
      lien:           payload.lien    ?? null,
      entityId:       payload.entityId ?? null,
      lu:             false,
    });
    return this.repo.save(notif);
  }

  // ── Créer pour plusieurs destinataires à la fois ──────────────────────────
  async createForMany(
    destinataireIds: string[],
    payload: Omit<CreateNotifPayload, 'destinataireId'>,
  ): Promise<void> {
    const notifs = destinataireIds.map((id) =>
      this.repo.create({ ...payload, destinataireId: id, lu: false }),
    );
    await this.repo.save(notifs);
  }

  // ── GET /notifications (paginé) ──────────────────────────────────────────
  async findAllForUser(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
    const [data, total] = await this.repo.findAndCount({
      where:   { destinataireId: userId },
      order:   { createdAt: 'DESC' },
      skip:    (page - 1) * limit,
      take:    limit,
    });

    const unreadCount = await this.repo.count({
      where: { destinataireId: userId, lu: false },
    });

    return { data, total, unreadCount };
  }

  // ── Nombre de non-lus (pour le badge) ────────────────────────────────────
  async getUnreadCount(userId: string): Promise<number> {
    return this.repo.count({ where: { destinataireId: userId, lu: false } });
  }

  // ── Marquer une notification comme lue ───────────────────────────────────
  async markAsRead(id: string, userId: string): Promise<Notification> {
    await this.repo.update(
      { id, destinataireId: userId },
      { lu: true, luAt: new Date() },
    );
    return this.repo.findOneOrFail({ where: { id } });
  }

  // ── Marquer toutes comme lues ────────────────────────────────────────────
  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.repo.update(
      { destinataireId: userId, lu: false },
      { lu: true, luAt: new Date() },
    );
    return { updated: result.affected ?? 0 };
  }

  // ── Supprimer une notification ────────────────────────────────────────────
  async remove(id: string, userId: string): Promise<void> {
    await this.repo.delete({ id, destinataireId: userId });
  }

  // ── Supprimer toutes les lues (nettoyage) ────────────────────────────────
  async clearRead(userId: string): Promise<{ deleted: number }> {
    const result = await this.repo.delete({ destinataireId: userId, lu: true });
    return { deleted: result.affected ?? 0 };
  }

  // ── Polling : nouvelles notifs depuis un timestamp ────────────────────────
  async getNewSince(userId: string, since: string): Promise<Notification[]> {
    return this.repo
      .createQueryBuilder('n')
      .where('n.destinataireId = :userId', { userId })
      .andWhere('n.createdAt > :since', { since: new Date(since) })
      .orderBy('n.createdAt', 'DESC')
      .getMany();
  }
}