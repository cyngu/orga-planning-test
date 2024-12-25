import { Module } from '@nestjs/common';
import { EventResolver } from './events.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsService } from './events.service';

@Module({
  providers: [EventResolver, EventsService],
  imports: [PrismaModule],
})
export class EventsModule {}
