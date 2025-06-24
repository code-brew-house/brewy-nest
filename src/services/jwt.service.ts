import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(user: UserEntity): string {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return this.jwtService.sign(payload);
  }

  getExpirationTime(): number {
    // Return expiration time in seconds (e.g., 24 hours)
    return 24 * 60 * 60;
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
