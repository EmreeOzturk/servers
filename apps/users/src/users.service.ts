import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly prisma : PrismaSer
    private readonly configService: ConfigService,
  ) {}

  // register service

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user = await this.prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   },
    // });
    const user = {
      name,
      email,
      password,
    };
    return user;
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
    // const users = await this.prisma.user.findMany();
    const users = [
      {
        id: '1234',
        name: 'test',
        email: 'test@g.com',
        password: '1234567f',
      },
    ];
    return users;
  }
}
