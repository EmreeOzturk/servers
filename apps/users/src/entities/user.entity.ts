import { ObjectType, Field, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Avatars {
  @Field()
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field()
  password: string;

  @Field({ nullable: true })
  avatarId?: string;

  @Field(() => Avatars, { nullable: true })
  avatar?: Avatars | null;
}
