import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserCustom {
  @Field(() => String)
  id: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  trigramme: string;

  @Field({ nullable: false })
  active: boolean;

  @Field({ nullable: true })
  workTypeId: string;
}
