import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Event {
  @Field(() => String)
  id: string;

  @Field({ nullable: false })
  titleAm: string;

  @Field({ nullable: false })
  titlePm: string;

  @Field({ nullable: false })
  parking: boolean;

  @Field({ nullable: false })
  hourlyAm: string;

  @Field({ nullable: false })
  hourlyPm: string;

  @Field({ nullable: false })
  workTime: string;

  @Field({ nullable: false })
  start: Date;

  @Field({ nullable: false })
  end: Date;

  @Field(() => [User])
  userId: string;
}
