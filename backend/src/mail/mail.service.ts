// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';

@Injectable()
export class MailService {
  private transporter;

  constructor(
    private config: ConfigService,
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

  async sendMentionEmail(
    email: string,
    firstName: string,
    data: {
      authorName: string;
      message: string;
      actionId: string;
      actionDesc: string;
    },
  ): Promise<void> {
    const url = `http://localhost:5173/actions/${data.actionId}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: `💬 Vous avez été mentionné dans une action corrective`,
      html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#1F3864">Nouvelle mention</h2>
        <p>Bonjour <strong>${firstName}</strong>,</p>
        <p><strong>${data.authorName}</strong> vous a mentionné dans une action corrective :</p>
        <div style="background:#f5f5f5;border-left:3px solid #378ADD;padding:12px;margin:16px 0;border-radius:0 8px 8px 0">
          <p style="margin:0;font-style:italic">"${data.message}"</p>
        </div>
        <p style="color:#666;font-size:12px">Action : ${data.actionDesc}</p>
        <a href="${url}" style="display:inline-block;background:#378ADD;color:white;
           padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
          Voir l'action →
        </a>
      </div>
    `,
    });
  }
  // Email rejet action
  async sendActionRejectedEmail(
    piloteEmail: string,
    piloteFirstName: string,
    data: {
      actionId: string;
      actionDesc: string;
      motif: string;
      rejectedBy: string;
    },
  ): Promise<void> {
    const url = `http://localhost:5173/actions/${data.actionId}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: piloteEmail,
      subject: '⚠️ Action corrective rejetée — Action requise',
      html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
        <div style="background:#C62828;padding:16px 24px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:18px">Action corrective rejetée</h2>
        </div>
        <div style="border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <p>Bonjour <strong>${piloteFirstName}</strong>,</p>
          <p>
            Votre action corrective a été <strong style="color:#C62828">rejetée</strong>
            par <strong>${data.rejectedBy}</strong>.
          </p>
          <div style="background:#FFF3E0;border-left:4px solid #FF9800;
                      padding:12px 16px;border-radius:0 8px 8px 0;margin:16px 0">
            <p style="margin:0 0 4px;font-weight:600;color:#E65100">Motif du rejet :</p>
            <p style="margin:0;color:#555">${data.motif}</p>
          </div>
          <p style="color:#555">
            Action concernée : <strong>${data.actionDesc}</strong>
          </p>
          <p>Veuillez reprendre le travail et resoumettre l'action.</p>
          <a href="${url}"
             style="display:inline-block;background:#378ADD;color:white;
                    padding:12px 28px;border-radius:6px;text-decoration:none;
                    font-weight:bold">
            Voir l'action →
          </a>
        </div>
      </div>
    `,
    });
  }

  // Email validation action
  async sendActionValidatedEmail(
    piloteEmail: string,
    piloteFirstName: string,
    data: {
      actionId: string;
      actionDesc: string;
      validatedBy: string;
    },
  ): Promise<void> {
    const url = `http://localhost:5173/actions/${data.actionId}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: piloteEmail,
      subject: '✅ Action corrective validée — Félicitations !',
      html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto">
        <div style="background:#2E7D32;padding:16px 24px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:18px">Action validée ✅</h2>
        </div>
        <div style="border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <p>Bonjour <strong>${piloteFirstName}</strong>,</p>
          <p>
            Votre action corrective a été <strong style="color:#2E7D32">validée</strong>
            par <strong>${data.validatedBy}</strong>.
          </p>
          <p style="color:#555">Action : <strong>${data.actionDesc}</strong></p>
          <p>L'anomalie associée a été automatiquement clôturée.</p>
          <a href="${url}"
             style="display:inline-block;background:#4CAF50;color:white;
                    padding:12px 28px;border-radius:6px;text-decoration:none;
                    font-weight:bold">
            Voir l'action →
          </a>
        </div>
      </div>
    `,
    });
  }
}
