import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAdminConfigurationInput {
  @Field()
  value: string;

  @Field()
  paramsName: string;
}
