import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  titleAm: string;

  @Field()
  titlePm: string;

  @Field()
  hourlyAm?: string;

  @Field()
  hourlyPm?: string;

  @Field()
  workTime?: string;

  @Field()
  userId: string;

  @Field()
  parking?: boolean;

  @Field(() => [String])
  date: string[];
}
