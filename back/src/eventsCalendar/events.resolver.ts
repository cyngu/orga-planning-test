import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Event } from './models/event.model';
import { CreateEventInput } from './dto/createEvent.input';
import { DeleteEventInput } from './dto/deleteEvent.input';
import { UpdateEventInput } from './dto/updateEvent.input';
import { AdminGuard, GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { SetRttInput } from './dto/setRtt.input';
import { ReportInput } from './dto/report.input';
import { ReportPresenceType } from './models/reportPresence.model';
import { EventsService } from './events.service';

@Resolver(() => Event)
@UseGuards(GqlAuthGuard)
export class EventResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => [Event], { name: 'events' })
  getEvents() {
    return this.eventsService.getEvents();
  }

  @Query(() => [Event], { name: 'eventsByUserId' })
  getEventsByUserId(@Args('userId') userId: string) {
    return this.eventsService.getEventsByUserId(userId);
  }

  @Query(() => [Event], { name: 'eventsByUserIdAndDate' })
  getEventsByUserIdAndDate(
    @Args('userId') userId: string,
    @Args('date') date: string,
  ) {
    return this.eventsService.getEventsByUserIdAndDate(userId, date);
  }

  @Query(() => Number, { name: 'getParkingPlacesGettedCount' })
  getParkingPlacesGettedCount(
    @Args('date')
    date: Date,
  ) {
    return this.eventsService.getParkinglacesGettedCount(date);
  }

  @Mutation(() => String, { name: 'createEvent' })
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.createEvent(createEventInput);
  }

  @Mutation(() => String, { name: 'deleteEvent' })
  deleteEvent(@Args('deleteEventInput') deleteEventInput: DeleteEventInput) {
    return this.eventsService.deleteEvent(deleteEventInput);
  }

  @Mutation(() => String, { name: 'updateEvent' })
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.updateEvent(updateEventInput);
  }

  @Mutation(() => String, { name: 'updateOrCreateHoliday' })
  @UseGuards(AdminGuard)
  updateOrCreateHoliday(@Args('year') year: number) {
    return this.eventsService.updateOrCreateHoliday(year);
  }

  @Mutation(() => String, { name: 'adminCreateOrUpdateEventByUser' })
  @UseGuards(AdminGuard)
  adminCreateOrUpdateEventByUser(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    return this.eventsService.adminCreateOrUpdateEventByUser(createEventInput);
  }

  @Mutation(() => String, { name: 'setRttEmployerEvent' })
  @UseGuards(AdminGuard)
  setRttEmployerEvent(@Args('setRttInput') setRttInput: SetRttInput) {
    return this.setRttEmployerEvent(setRttInput);
  }

  @Mutation(() => String, { name: 'createEventAdmin' })
  @UseGuards(AdminGuard)
  createEventAdmin(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    return this.eventsService.createEventAdmin(createEventInput);
  }

  @Mutation(() => String, { name: 'updateEventAdmin' })
  @UseGuards(AdminGuard)
  updateEventAdmin(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
  ) {
    return this.eventsService.updateEventAdmin(updateEventInput);
  }

  @Mutation(() => String, { name: 'deleteEventAdmin' })
  @UseGuards(AdminGuard)
  deleteEventAdmin(
    @Args('deleteEventInput') deleteEventInput: DeleteEventInput,
  ) {
    return this.eventsService.deleteEventAdmin(deleteEventInput);
  }

  @Query(() => [ReportPresenceType], { name: 'getReportPresence' })
  @UseGuards(AdminGuard)
  getReportPresence(@Args('reportInput') reportInput: ReportInput) {
    return this.eventsService.getReportPresence(reportInput);
  }
}
