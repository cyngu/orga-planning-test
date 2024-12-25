import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReportPresenceType {
  @Field()
  userId: string;

  @Field()
  userName: string;

  @Field()
  workTypeName: string;

  @Field()
  remoteWorkDays: number;

  @Field()
  onsiteWorkDays: number;

  @Field()
  onsiteWorkPercentage: number;

  @Field()
  parkingUsagePercentage: number;

  @Field()
  totalWorkDays: number;

  @Field()
  totalDays: number;

  @Field()
  workDaysPercentage: number;

  @Field()
  noApplyEvent: number;

  @Field()
  businessDays: number;
}
