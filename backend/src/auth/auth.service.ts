import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Регистрация нового пользователя
  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });
    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '120m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
  }

  // Логин
  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordValid = await bcrypt.compare(data.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '120m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
  }
}
