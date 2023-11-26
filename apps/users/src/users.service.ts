// import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    // private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    // private readonly configService: ConfigService,
  ) {}

  // register service

  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
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
}
