import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';
import { RegisterRequestDto } from '../dtos/register-request.dto';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { UserEntity } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async register(
    @Body() registerUserDto: RegisterRequestDto,
  ): Promise<UserEntity> {
    return this.authService.signup(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async authenticate(
    @Body() loginUserDto: LoginRequestDto,
  ): Promise<AuthResponseDto> {
    const authenticatedUser = await this.authService.authenticate(loginUserDto);
    const jwtToken = this.jwtService.generateToken(authenticatedUser);

    return {
      token: jwtToken,
      expiresIn: this.jwtService.getExpirationTime(),
    };
  }
}
