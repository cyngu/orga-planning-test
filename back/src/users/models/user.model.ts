import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from './userRole.model';
import { Event } from 'src/eventsCalendar/models/event.model';

@ObjectType()
export class User {
  @Field(() => String)
  id: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: false })
  trigramme: string;

  @Field({ nullable: false })
  active: boolean;

  @Field({ nullable: true })
  workTypeId: string;

  @Field(() => [UserRole])
  UserRoles: UserRole[];

  @Field(() => [Event])
  EventCalendar: Event[];
}
