import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminGuard, GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { WorkType } from './workType.model';
import { UpdateWorkTypeInput } from './dto/updateWorkType.input';
import { CreateWorkTypeInput } from './dto/createWorkType.input';
import { WorkTypeService } from './workType.service';

@Resolver(() => WorkType)
@UseGuards(GqlAuthGuard)
export class WorkTypeResolver {
  constructor(private workTypeService: WorkTypeService) {}

  @Query(() => [WorkType], { name: 'getAllWorkType' })
  getAllWorkType() {
    return this.workTypeService.getAllWorkType();
  }

  @Query(() => WorkType, { name: 'getWorkTypeById' })
  getWorkTypeById(@Args('id') id: string) {
    return this.workTypeService.getWorkTypeById(id);
  }

  @Query(() => WorkType, { name: 'getWorkTypeByUserId' })
  getWorkTypeByUserId(@Args('id') id: string) {
    return this.workTypeService.getWorkTypeByUserId(id);
  }

  @Mutation(() => WorkType, { name: 'updateWorkType' })
  @UseGuards(AdminGuard)
  updateWorkType(
    @Args('updateWorkTypeInput') updateWorkTypeInput: UpdateWorkTypeInput,
  ) {
    return this.workTypeService.updateWorkType(updateWorkTypeInput);
  }

  @Mutation(() => WorkType, { name: 'createWorkType' })
  @UseGuards(AdminGuard)
  createWorkType(
    @Args('createWorkTypeInput') createWorkTypeInput: CreateWorkTypeInput,
  ) {
    return this.workTypeService.createWorkType(createWorkTypeInput);
  }

  @Mutation(() => String, { name: 'deleteWorkType' })
  @UseGuards(AdminGuard)
  deleteWorkType(@Args('id') id: string) {
    return this.workTypeService.deleteWorkType(id);
  }
}
