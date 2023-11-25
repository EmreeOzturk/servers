// import { UseFilters } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { RegisterResponse } from './types/user.types';
import { User } from './entities/user.entity';

@Resolver('User')
// @UseFilters()
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<RegisterResponse> {
    if (!registerDto.email || !registerDto.password || !registerDto.name) {
      throw new BadRequestException('Please provide all the required fields');
    }

    const user = await this.usersService.register(registerDto);
    return { user };
  }

  @Query(() => [User])
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
