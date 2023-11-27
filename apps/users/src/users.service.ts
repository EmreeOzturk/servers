import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, ActivationDto } from './dto/user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';

type UserData = {
  email: string;
  password: string;
  name: string;
  phone_number: number;
};
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
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
    const activation_token = activationToken.token;
    await this.emailService.sendEmail({
      subject: 'Account Activation!',
      template: './activation-email',
      activationCode: activitatonCode,
      email: user.email,
      name: user.name,
    });
    return { activation_token, response };
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

  async createActivationToken(user: UserData) {
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

  // activate account service

  async activateAccount(activationDto: ActivationDto, res: Response) {
    const { activationCode, activationToken } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      await this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      });
    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;
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

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, res };
  }
}
