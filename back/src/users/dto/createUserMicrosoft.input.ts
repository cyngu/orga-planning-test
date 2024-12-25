import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUseMicrosoftInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  idMicrosoftUser: string;
}
