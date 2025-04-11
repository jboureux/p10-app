import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlacklistService } from '../services/token-blacklist.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly blacklistService: TokenBlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: any,payload: any) {

    const token = req.get('authorization')?.replace('Bearer ', '');

    const isBlacklisted = await this.blacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Not authorized');
    }

    return { userId: payload.sub, email: payload.email };
  }


}
