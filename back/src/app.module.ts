import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { EventsModule } from './eventsCalendar/events.module';
import { secureApiMiddleware } from './middlewares/secureApi.middleware';
import { AuthModule } from './auth/auth.module';
import { AdminConfigurationModule } from './adminConfiguration/adminConfiguration.module';
import { WorkTypeModule } from './workType/workType.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: process.env.ENV === 'INTEGRATION',
    }),
    PrismaModule,
    UsersModule,
    EventsModule,
    AuthModule,
    AdminConfigurationModule,
    WorkTypeModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(secureApiMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.POST });
  }
}
