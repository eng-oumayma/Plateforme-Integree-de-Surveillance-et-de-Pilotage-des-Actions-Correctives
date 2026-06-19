// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { AccountStatus } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  // ── Valider credentials login ──────────────────────
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Identifiants incorrects');

    // Compte pas encore activé (password pas défini)
    if (user.status === AccountStatus.PENDING) {
      throw new UnauthorizedException(
        'Veuillez définir votre mot de passe via le lien envoyé par email',
      );
    }

    if (user.status === AccountStatus.INACTIVE) {
      throw new UnauthorizedException("Compte désactivé, contactez l'admin");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Identifiants incorrects');

    return user;
  }

  // ── Générer tokens JWT ─────────────────────────────
  // async login(user: any) {
  //   const payload = {
  //     sub: user.id,
  //     email: user.email,
  //     role: user.role,
  //     department: user.department,
  //   };
  //   return {
  //     access_token: this.jwtService.sign(payload, {
  //       secret: this.config.get('JWT_SECRET'),
  //       expiresIn: this.config.get('JWT_EXPIRES_IN'),
  //     }),
  //     refresh_token: this.jwtService.sign(payload, {
  //       secret: this.config.get('JWT_REFRESH_SECRET'),
  //       expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
  //     }),
  //     token_type: 'Bearer',
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       role: user.role,
  //       department: user.department,
  //     },
  //   };
  // }
  // Dans ton auth.service.ts
  async login(user: any) {
    try {
      const payload = {
        sub: user?.id,
        email: user?.email,
        role: user?.role,
        department: user?.department,
      };

      console.log('=== LOG DE TEST PAYLOAD ===', payload); // Permet de voir si "user" contient bien les données

      const access_token = this.jwtService.sign(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN'),
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
      });

      return {
        tokens: {
          access_token,
          refresh_token,
          token_type: 'Bearer',
        },
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
        },
      };
    } catch (error) {
      // 🔥 CE LOG VA TOUT TE DIRE DANS TON TERMINAL BACKEND !
      console.error('❌ ERREUR CRITIQUE DANS AUTH.SERVICE.LOGIN :', error);
      throw error;
    }
  }
  // ── Définir password (premier accès) ──────────────
  async setPassword(token: string, password: string) {
    const user = await this.usersService.findBySetPasswordToken(token);
    if (!user) throw new BadRequestException('Lien invalide');
    if (!user.setPasswordExpires) {
      throw new BadRequestException('Lien invalide');
    }
    if (new Date() > new Date(user.setPasswordExpires)) {
      throw new BadRequestException("Lien expiré, contactez l'administrateur");
    }

    await this.usersService.setPassword(user.id, password);

    // Envoyer email de confirmation d'activation
    await this.mailService.sendAccountActivatedEmail(
      user.email,
      user.firstName,
    );

    return {
      message:
        '✅ Mot de passe défini ! Vous pouvez maintenant vous connecter.',
    };
  }

  // ── Forgot password ────────────────────────────────
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'Si cet email existe, un lien a été envoyé' };

    if (user.status === AccountStatus.PENDING) {
      throw new BadRequestException(
        "Votre compte n'est pas encore activé. Vérifiez vos emails.",
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1h

    await this.usersService.saveResetToken(user.id, token, expires);
    await this.mailService.sendResetPasswordEmail(email, token);

    return { message: 'Si cet email existe, un lien a été envoyé' };
  }

  // ── Reset password ─────────────────────────────────
  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Token invalide');
    if (!user.resetPasswordExpires) {
      throw new BadRequestException('Token invalide');
    }
    if (new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Token expiré, refaites la demande');
    }

    await this.usersService.updatePassword(user.id, newPassword);
    return { message: '✅ Mot de passe réinitialisé avec succès !' };
  }

  // ── Refresh token ──────────────────────────────────
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return this.login(user);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }
}
