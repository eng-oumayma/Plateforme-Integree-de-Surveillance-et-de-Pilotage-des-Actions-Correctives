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
        user: config.get('MAIL_USER'), // ton Gmail
        pass: config.get('MAIL_PASS'), // mot de passe d'application
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const url = `http://localhost:3000/api/auth/confirm?token=${token}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: '✅ Confirmez votre compte LEONI',
      html: `
        <h2>Bienvenue sur LEONI Surveillance</h2>
        <p>Cliquez pour confirmer votre compte :</p>
        <a href="${url}" style="background:#1D9E75;color:white;
           padding:12px 24px;border-radius:6px;text-decoration:none">
          Confirmer mon compte
        </a>
        <p style="color:#999;font-size:12px">Lien valable 24h.</p>
      `,
    });
  }
  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const url = `http://localhost:3000/api/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: email,
      subject: '🔐 Réinitialisation mot de passe LEONI',
      html: `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <a href="${url}" style="background:#378ADD;color:white;
         padding:12px 24px;border-radius:6px;text-decoration:none">
        Réinitialiser mon mot de passe
      </a>
      <p style="color:#999;font-size:12px">Lien valable 1h seulement.</p>
      <p style="color:#999;font-size:12px">
        Si vous n'avez pas fait cette demande, ignorez cet email.
      </p>
    `,
    });
  }
}
