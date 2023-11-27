import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { ActivationResponse, RegisterResponse } from './types/user.types';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.email || !registerDto.password || !registerDto.name) {
      throw new BadRequestException('Please provide all the required fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );
    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.usersService.activateAccount(activationDto, context.res);
  }

  @Query(() => [User])
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
