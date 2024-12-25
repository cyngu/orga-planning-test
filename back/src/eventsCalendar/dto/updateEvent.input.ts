import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  hourlyAm?: string;

  @Field({ nullable: true })
  hourlyPm?: string;

  @Field({ nullable: true })
  titleAm?: string;

  @Field(() => String, { nullable: true })
  titlePm?: string;

  @Field({ nullable: true })
  parking?: boolean;

  @Field({ nullable: true })
  workTime?: string;
}
