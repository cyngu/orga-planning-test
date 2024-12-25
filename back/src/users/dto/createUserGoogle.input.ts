import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserGoogleInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  idGoogleUser: string;
}
