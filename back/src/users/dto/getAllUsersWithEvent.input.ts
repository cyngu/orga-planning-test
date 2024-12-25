import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetAllUsersWithEventInput {
  @Field(() => [Date])
  dateList: Date[];
}
