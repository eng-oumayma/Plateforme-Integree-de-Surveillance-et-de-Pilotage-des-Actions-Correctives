// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private config: ConfigService) {
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
    const url = `http://localhost:5173/actions/${action.id}`;
    const deadline = new Date(action.deadline).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const critColors: Record<string, string> = {
      FAIBLE: '#4CAF50',
      MODERE: '#FFC107',
      CRITIQUE: '#FF9800',
      BLOQUANT: '#F44336',
    };
    const critLabels: Record<string, string> = {
      FAIBLE: 'Faible',
      MODERE: 'Modéré',
      CRITIQUE: 'Critique',
      BLOQUANT: 'Bloquant',
    };

    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: piloteEmail,
      subject: `⚡ Nouvelle action corrective assignée — ${critLabels[action.criticite]}`,
      html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#333">

        <div style="background:#1F3864;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">LEONI HSEE Platform</h1>
          <p style="color:#C5D8EA;margin:4px 0 0;font-size:13px">Nouvelle action corrective</p>
        </div>

        <div style="border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
          <p style="font-size:16px;margin-bottom:16px">
            Bonjour <strong>${piloteFirstName}</strong>,
          </p>
          <p style="color:#555;margin-bottom:20px">
            Une action corrective vous a été assignée par <strong>${action.createdByName}</strong>.
            Vous êtes responsable de sa mise en œuvre.
          </p>

          <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:20px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:6px 0;font-size:12px;color:#888;width:140px">Anomalie à l'origine</td>
                <td style="padding:6px 0;font-size:13px">${action.anomalyDescription}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:12px;color:#888">Action à réaliser</td>
                <td style="padding:6px 0;font-size:13px;font-weight:500">${action.description}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:12px;color:#888">Criticité</td>
                <td style="padding:6px 0">
                  <span style="background:${critColors[action.criticite]};color:white;
                               padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700">
                    ${critLabels[action.criticite]}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:12px;color:#888">Deadline</td>
                <td style="padding:6px 0;font-size:13px;font-weight:500;color:#E65100">
                  📅 ${deadline}
                </td>
              </tr>
            </table>
          </div>

          <a href="${url}"
             style="display:inline-block;background:#378ADD;color:white;
                    padding:12px 28px;border-radius:6px;text-decoration:none;
                    font-weight:bold;font-size:14px">
            Accéder à l'action →
          </a>

          <p style="color:#999;font-size:11px;margin-top:20px">
            Si vous avez des questions, contactez votre responsable HSEE.
          </p>
        </div>
      </div>
    `,
    });
  }
}
