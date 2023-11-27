// import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // register service

  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    const phoneExists = await this.prisma.user.findUnique({
      where: { phone_number },
    });
    if (phoneExists) {
      throw new BadRequestException('Phone number already exists');
    }
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);
    const activitatonCode = activationToken.activationCode;
    console.log(activitatonCode);
    return { user, response };
  }

  // login service

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    // const user = await this.prisma.user.findUnique({ where: { email } });
    const user = {
      email,
      password,
    };

    return user;
  }

  // get all users service

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  // create activition token

  async createActivationToken(user: {
    email: string;
    password: string;
    name: string;
    phone_number: number;
  }) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      { user, activationCode },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }
}
