import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WorkType {
  @Field(() => String)
  id: string;

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
