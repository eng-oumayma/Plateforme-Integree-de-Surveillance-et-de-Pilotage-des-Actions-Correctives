// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AccountStatus } from 'src/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ← lit le token depuis Authorization: Bearer <token>
      ignoreExpiration: false, // ← rejette les tokens expirés
      secretOrKey: config.get('JWT_SECRET')!, // ← vérifie la signature avec le secret
    });
  }

  // Appelé automatiquement par JwtAuthGuard APRÈS vérification de la signature
  // payload = contenu décodé du JWT { sub, email, role, department }
  async validate(payload: {
    sub: string;
    email: string;
    role: string;
    department: string;
  }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.status !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Token invalide');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    }; // → devient req.user dans le controller
  }
}
