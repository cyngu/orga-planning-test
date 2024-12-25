import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ReportInput {
  @Field(() => [String])
  userId: string[];

  @Field(() => [String])
  datesString: string[];
}
