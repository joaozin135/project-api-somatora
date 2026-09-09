import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/users/repositories/user-repository.interface';
import type { IUserRepository } from 'src/users/repositories/user-repository.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }
}
