import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AdminGuard, GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AdminConfiguration } from './adminConfiguration.model';
import { UpdateAdminConfigurationInput } from './dto/updateAdminConfiguration.input';
import { AdminConfigurationService } from './adminConfiguration.service';

@Resolver(() => Event)
@UseGuards(GqlAuthGuard)
export class AdminConfigurationResolver {
  constructor(private adminConfigurationService: AdminConfigurationService) {}

  @Query(() => AdminConfiguration, { name: 'getConfigurationParkingPlace' })
  getConfigurationParkingPlace() {
    return this.adminConfigurationService.getConfigurationParkingPlace();
  }

  @Query(() => AdminConfiguration, { name: 'getConfigurationParams' })
  getConfigurationParams(@Args('paramsName') paramsName: string) {
    return this.adminConfigurationService.getConfigurationParams(paramsName);
  }

  @Mutation(() => AdminConfiguration, {
    name: 'updateAdminConfiguration',
  })
  @UseGuards(AdminGuard)
  updateAdminConfiguration(
    @Args('updateAdminConfigurationInput')
    updateAdminConfigurationInput: UpdateAdminConfigurationInput,
  ) {
    return this.adminConfigurationService.updateAdminConfiguration(
      updateAdminConfigurationInput,
    );
  }
}
