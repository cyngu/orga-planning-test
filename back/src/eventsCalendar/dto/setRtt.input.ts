import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SetRttInput {
  @Field()
  titleAm: string;

  @Field(() => [String])
  usersId: string[];

  @Field(() => [String])
  date: string[];
}
