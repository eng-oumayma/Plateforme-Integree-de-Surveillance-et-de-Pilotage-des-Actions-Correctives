// src/mail/mail.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import bull from 'bull';
import * as nodemailer from 'nodemailer';

@Processor('mail-queue')
export class MailProcessor {
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

  @Process('action-assigned')
  async handleActionAssigned(job: bull.Job<any>) {
    const { piloteEmail, piloteFirstName, action } = job.data;
    const url = `http://localhost:5173/actions/${action.id}`;
    const deadline = new Date(action.deadline).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const critColors: Record<string, string> = { FAIBLE: '#4CAF50', MODERE: '#FFC107', CRITIQUE: '#FF9800', BLOQUANT: '#F44336' };
    const critLabels: Record<string, string> = { FAIBLE: 'Faible', MODERE: 'Modéré', CRITIQUE: 'Critique', BLOQUANT: 'Bloquant' };

    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: piloteEmail,
      subject: `⚡ Nouvelle action corrective assignée — ${critLabels[action.criticite] || 'Important'}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#333">
          <div style="background:#1F3864;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">LEONI HSEE Platform</h1>
            <p style="color:#C5D8EA;margin:4px 0 0;font-size:13px">Nouvelle action corrective</p>
          </div>
          <div style="border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p style="font-size:16px;margin-bottom:16px">Bonjour <strong>${piloteFirstName}</strong>,</p>
            <p style="color:#555;margin-bottom:20px">Une action corrective vous a été assignée par <strong>${action.createdByName}</strong>.</p>
            <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:20px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;font-size:12px;color:#888;width:140px">Anomalie</td><td style="padding:6px 0;font-size:13px">${action.anomalyDescription}</td></tr>
                <tr><td style="padding:6px 0;font-size:12px;color:#888">Action à réaliser</td><td style="padding:6px 0;font-size:13px;font-weight:500">${action.description}</td></tr>
                <tr><td style="padding:6px 0;font-size:12px;color:#888">Criticité</td><td style="padding:6px 0"><span style="background:${critColors[action.criticite]};color:white;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700">${critLabels[action.criticite]}</span></td></tr>
                <tr><td style="padding:6px 0;font-size:12px;color:#888">Deadline</td><td style="padding:6px 0;font-size:13px;font-weight:500;color:#E65100">📅 ${deadline}</td></tr>
              </table>
            </div>
            <a href="${url}" style="display:inline-block;background:#378ADD;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">Accéder à l'action →</a>
          </div>
        </div>`,
    });
  }

  // 🟨 Tâche 2 & 4 : Processus d'envoi du mail de validation ou de rejet
  @Process('action-status')
  async handleActionStatus(job: bull.Job<any>) {
    const { piloteEmail, piloteFirstName, actionTitle, status, comment } = job.data;
    
    // Customisation visuelle selon l'état validé ou rejeté
    const isApproved = status === 'VALIDEE'; 
    const headerColor = isApproved ? '#1D9E75' : '#D32F2F';
    const statusLabel = isApproved ? 'Validée' : 'Rejetée';

    await this.transporter.sendMail({
      from: `"LEONI HSEE" <${this.config.get('MAIL_USER')}>`,
      to: piloteEmail,
      subject: `📢 Statut d'action HSEE mis à jour : ${statusLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#333">
          <div style="background:${headerColor};padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:20px">LEONI HSEE Platform</h1>
            <p style="color:#FFF;opacity:0.8;margin:4px 0 0;font-size:13px">Mise à jour d'un statut d'action</p>
          </div>
          <div style="border:1px solid #e0e0e0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p style="font-size:16px;">Bonjour <strong>${piloteFirstName}</strong>,</p>
            <p>L'un de vos plans d'action a été révisé et marqué comme <strong><span style="color:${headerColor}">${statusLabel.toUpperCase()}</span></strong>.</p>
            <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:20px 0">
              <p style="margin:4px 0;"><strong>Action :</strong> ${actionTitle}</p>
              ${comment ? `<p style="margin:10px 0 0;color:#555;font-style:italic;"><strong>Motif de l'auditeur :</strong> ${comment}</p>` : ''}
            </div>
            <p style="color:#999;font-size:11px;">Plateforme de surveillance réglementaire LEONI HSEE.</p>
          </div>
        </div>`,
    });
  }

  // Gardez les anciens processeurs (set-password, reset-password etc.) si nécessaire...
}