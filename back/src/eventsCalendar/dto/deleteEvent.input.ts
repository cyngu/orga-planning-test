import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteEventInput {
  @Field()
  id: string;

  @Field()
  userId: string;
}
