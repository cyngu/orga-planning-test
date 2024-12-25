import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/createUser.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard, GqlAuthGuard } from 'src/auth/guards/auth.guard';
import { UserWithEventType } from './models/userWithEvent.model';
import { GetAllUsersWithEventInput } from './dto/getAllUsersWithEvent.input';
import { UserCustom } from './models/userCustom.model';
import { UpdateUserInput } from './dto/updateUser.input';
import { Role } from './models/role.model';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Query(() => [UserCustom], { name: 'getAllUsers' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Query(() => String, { name: 'userExists' })
  getUser(@Args('email') email: string, @Args('password') password: string) {
    return this.userService.verifyUser(email, password);
  }

  @Query(() => [UserWithEventType], { name: 'getAllUsersWithEvent' })
  @UseGuards(GqlAuthGuard)
  getAllUsersWithEvent(
    @Args('getAllUsersWithEventInput')
    getAllUsersWithEventInput: GetAllUsersWithEventInput,
  ) {
    return this.userService.getUsersWithEvent(getAllUsersWithEventInput);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput);
  }

  @Query(() => [Role], { name: 'getRolesByUserId' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  getRolesByUserId(@Args('userId') userId: string) {
    return this.userService.getRolesByUserId(userId);
  }

  @Query(() => [Role], { name: 'getAllRoles' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  getAllRoles() {
    return this.userService.getAllRoles();
  }

  @Mutation(() => String, { name: 'updateUserRole' })
  @UseGuards(GqlAuthGuard, AdminGuard)
  updateUserRole(
    @Args('userId') userId: string,
    @Args({ name: 'roleIdList', type: () => [String] }) roleIdList: string[],
  ) {
    return this.userService.updateUserRole(userId, roleIdList);
  }
}
