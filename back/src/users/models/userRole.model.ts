import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from './user.model';
import { Role } from './role.model';

@ObjectType()
export class UserRole {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  roleId: string;

  @Field(() => User)
  user: User;

  @Field(() => Role)
  role: Role;
}
