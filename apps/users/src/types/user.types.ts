import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User | null | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType | null;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | null | any;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType | null;
}
