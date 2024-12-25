import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from 'src/eventsCalendar/models/event.model';

@ObjectType()
export class UserWithEventType {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  id: string;
  @Field()
  workTypeId: string;
  @Field(() => [Event])
  EventCalendar: Event[];
}
