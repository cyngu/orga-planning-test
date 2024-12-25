import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminConfiguration {
  @Field(() => String)
  id: string;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  value: string;

  @Field({ nullable: false })
  description: string;
}
