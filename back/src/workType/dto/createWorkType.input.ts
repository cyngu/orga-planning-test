import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateWorkTypeInput {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  monday: string;

  @Field({ nullable: false })
  tuesday: string;

  @Field({ nullable: false })
  wednesday: string;

  @Field({ nullable: false })
  thursday: string;

  @Field({ nullable: false })
  friday: string;

  @Field({ nullable: false })
  weeklyHour: string;
}
