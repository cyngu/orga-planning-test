import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateWorkTypeInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  monday?: string;

  @Field({ nullable: true })
  tuesday?: string;

  @Field({ nullable: true })
  wednesday?: string;

  @Field({ nullable: true })
  thursday?: string;

  @Field({ nullable: true })
  friday?: string;

  @Field({ nullable: true })
  weeklyHour?: string;
}
