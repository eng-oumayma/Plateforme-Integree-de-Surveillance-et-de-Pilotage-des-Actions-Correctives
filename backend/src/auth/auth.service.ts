import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  // Appelé par LocalStrategy (vérifie email + password)
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Identifiants incorrects');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Identifiants incorrects');

    if (!user.isActive) throw new UnauthorizedException('Compte désactivé');

    // ← AJOUTER CETTE LIGNE :
    if (!user.isEmailConfirmed) {
      throw new UnauthorizedException(
        'Veuillez confirmer votre email avant de vous connecter',
      );
    }

    return user;
  }

  // Génère access_token + refresh_token
  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
  // ─── Confirmation email ───────────────────────────────
  async sendConfirmationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Email introuvable');
    if (user.isEmailConfirmed)
      throw new BadRequestException('Compte déjà confirmé');
    // Générer token aléatoire
    const token = crypto.randomBytes(32).toString('hex');

    // Sauvegarder le token dans la BDD
    await this.usersService.saveConfirmationToken(user.id, token);

    // Envoyer l'email
    await this.mailService.sendConfirmationEmail(email, token);
    return { message: 'Email de confirmation envoyé' };
  }
  async confirmEmail(token: string) {
    const user = await this.usersService.findByConfirmationToken(token);
    if (!user) throw new BadRequestException('Token invalide ou expiré');

    // Activer le compte
    await this.usersService.confirmUser(user.id);
    return { message: 'Compte confirmé avec succès' };
  }
  // Mot de passe oublié – envoyer le lien
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Toujours même message (sécurité – ne pas révéler les emails)
    if (!user) return { message: 'Si cet email existe, un lien a été envoyé' };

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // +1 heure

    await this.usersService.saveResetToken(user.id, token, expires);
    await this.mailService.sendResetPasswordEmail(email, token);

    return { message: 'Si cet email existe, un lien a été envoyé' };
  }
  // Réinitialiser le mot de passe avec le token
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Token invalide');

    // Vérifier l'expiration
    if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Token expiré, refaites la demande');
    }

    // Mettre à jour le password (bcrypt dans la méthode)
    await this.usersService.updatePassword(user.id, newPassword);
    return { message: '✅ Mot de passe réinitialisé avec succès !' };
  }
  // Renouveler l'access_token depuis le refresh_token
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) throw new UnauthorizedException();
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }
}
