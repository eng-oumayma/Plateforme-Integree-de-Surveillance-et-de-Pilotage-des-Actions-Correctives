// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';

@Injectable()
export class MailService {
  private transporter;

  constructor(private config: ConfigService,
    @InjectQueue('mail-queue') private readonly mailQueue: bull.Queue, 
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  // ── Email 1 : Compte créé → définir son password ──
  async sendSetPasswordEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const url = `http://localhost:5173/set-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: '🎉 Votre compte LEONI Surveillance a été créé',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
          <h2 style="color:#1F3864">Bonjour ${firstName},</h2>
          <p>
            L'administrateur HSEE a créé votre compte sur la plateforme
            <strong>LEONI Surveillance</strong>.
          </p>
          <p>Cliquez sur le bouton ci-dessous pour définir votre mot de passe :</p>
          <a href="${url}"
             style="display:inline-block;background:#1D9E75;color:white;
                    padding:12px 28px;border-radius:6px;text-decoration:none;
                    font-weight:bold;margin:16px 0">
            Définir mon mot de passe
          </a>
          <p style="color:#999;font-size:12px">
            Ce lien est valable 48h. Si vous n'attendiez pas cet email,
            ignorez-le.
          </p>
        </div>
      `,
    });
  }

  // ── Email 2 : Compte activé avec succès ───────────
  async sendAccountActivatedEmail(
    email: string,
    firstName: string,
  ): Promise<void> {
    const url = `http://localhost:5173/login`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: '✅ Votre compte LEONI est activé !',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
          <h2 style="color:#1D9E75">Bonjour ${firstName},</h2>
          <p>
            Votre compte sur la plateforme <strong>LEONI Surveillance</strong>
            a été activé avec succès !
          </p>
          <p>Vous pouvez maintenant vous connecter :</p>
          <a href="${url}"
             style="display:inline-block;background:#378ADD;color:white;
                    padding:12px 28px;border-radius:6px;text-decoration:none;
                    font-weight:bold;margin:16px 0">
            Se connecter
          </a>
        </div>
      `,
    });
  }

  // ── Email 3 : Reset password ───────────────────────
  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const url = `http://localhost:5173/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: '🔐 Réinitialisation mot de passe LEONI',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
          <h2 style="color:#1F3864">Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
          <a href="${url}"
             style="display:inline-block;background:#378ADD;color:white;
                    padding:12px 28px;border-radius:6px;text-decoration:none;
                    font-weight:bold;margin:16px 0">
            Réinitialiser mon mot de passe
          </a>
          <p style="color:#999;font-size:12px">Lien valable 1h.</p>
          <p style="color:#999;font-size:12px">
            Si vous n'avez pas fait cette demande, ignorez cet email.
          </p>
        </div>
      `,
    });
  }
// Tâche 3 : Nouvelle action corrective
  async sendActionAssignedEmail(
    piloteEmail: string,
    piloteFirstName: string,
    action: {
      id: string;
      description: string;
      criticite: string;
      deadline: Date;
      anomalyDescription: string;
      createdByName: string;
    },
  ): Promise<void> {
    // On pousse l'action dans la file d'attente Redis sans bloquer l'exécution
    await this.mailQueue.add('action-assigned', {
      piloteEmail,
      piloteFirstName,
      action,
    });
  }

  // Tâche 4 : Statut mis à jour (Validation / Rejet)
  async sendActionStatusEmail(
    piloteEmail: string,
    piloteFirstName: string,
    actionTitle: string,
    status: string,
    comment?: string,
  ): Promise<void> {
    await this.mailQueue.add('action-status', {
      piloteEmail,
      piloteFirstName,
      actionTitle,
      status,
      comment,
    });
  }
}