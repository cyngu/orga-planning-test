import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserCustom } from './models/userCustom.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { createJwtToken } from 'src/utils/tokenAuth';
import { comparePassword } from 'src/utils/comparePassword';
import { GetAllUsersWithEventInput } from './dto/getAllUsersWithEvent.input';
import { UserWithEventType } from './models/userWithEvent.model';
import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { addHours } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers(): Promise<UserCustom[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        trigramme: true,
        workTypeId: true,
        active: true,
      },
    });
  }

  async verifyUser(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        UserRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await comparePassword(password, user.password))) {
      throw new UnauthorizedException('Wrong password');
    }

    const token = createJwtToken(user);

    return token;
  }

  async getUsersWithEvent(
    getAllUsersWithEventInput: GetAllUsersWithEventInput,
  ): Promise<UserWithEventType[]> {
    try {
      const { dateList } = getAllUsersWithEventInput;
      if (!dateList) {
        throw new Error('Date list is required');
      }
      const env = process.env.ENV

      const dateFormated = env === 'DEV' ? dateList : dateList.map((date) => addHours(date, 1));
      // const dateFormated = dateList.map((date) => addHours(date, 1));

      const usersWithEvent = await this.prisma.user.findMany({
        select: {
          firstName: true,
          lastName: true,
          id: true,
          workTypeId: true,
          EventCalendar: {
            select: {
              id: true,
              start: true,
              end: true,
              hourlyAm: true,
              hourlyPm: true,
              titleAm: true,
              titlePm: true,
              workTime: true,
              parking: true,
              userId: true,
            },
            where: {
              start: {
                in: dateFormated,
              },
            },
          },
        },
        where: {
          active: true,
        },
      });

      return usersWithEvent;
    } catch (err) {
      throw new ApolloError(err.message);
    }
  }

  async createUser(createUserInput: CreateUserInput) {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: { email: createUserInput.email },
      });
      if (userExist) {
        throw new UserInputError("l'email existe déjà");
      }

      const trigrammeExist = await this.prisma.user.findFirst({
        where: { trigramme: createUserInput.trigramme.toUpperCase() },
      });

      if (trigrammeExist) {
        throw new UserInputError('Le trigramme existe déjà');
      }

      const defaultWorkType = await this.prisma.adminConfiguration.findFirst({
        where: { name: 'WorkTypeDefault' },
        select: {
          value: true,
        },
      });

      if (!defaultWorkType) {
        throw new Error('Default work type not found');
      }

      const userCreated = await this.prisma.user.create({
        data: {
          email: createUserInput.email,
          password: createUserInput.password,
          firstName: createUserInput.firstName,
          lastName: createUserInput.lastName,
          trigramme: createUserInput.trigramme.toUpperCase(),
          workTypeId: defaultWorkType.value,
        },
      });

      const userRoleCollaboratorId = process.env.USER_ROLE_COLLABORATOR_ID;

      await this.prisma.userRole.create({
        data: {
          userId: userCreated.id,
          roleId: userRoleCollaboratorId,
        },
      });

      return userCreated;
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async updateUser(updateUserInput: UpdateUserInput) {
    try {
      const { id, ...data } = updateUserInput;
      const userExist = await this.prisma.user.findFirst({
        where: { id },
      });

      if (!userExist) {
        throw new UserInputError('User not found');
      }

      return this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async getRolesByUserId(userId: string) {
    return this.prisma.role.findMany({
      where: {
        UserRoles: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async getAllRoles() {
    return this.prisma.role.findMany();
  }

  async updateUserRole(userId: string, roleIdList: string[]) {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!userExist) {
        throw new UserInputError("L'utilisateur n'existe pas");
      }

      const allRoleList = await this.prisma.role.findMany();
      const roleToCreate = allRoleList.filter((role) =>
        roleIdList.includes(role.roleId),
      );

      const roleToDelete = allRoleList.filter(
        (role) => !roleIdList.includes(role.roleId),
      );

      for (const role of roleToCreate) {
        const userRoleExist = await this.prisma.userRole.findFirst({
          where: { userId, roleId: role.roleId },
        });
        if (!userRoleExist) {
          await this.prisma.userRole.create({
            data: {
              userId,
              roleId: role.roleId,
            },
          });
        }
      }

      for (const role of roleToDelete) {
        const userRoleExist = await this.prisma.userRole.findFirst({
          where: { userId, roleId: role.roleId },
        });
        if (userRoleExist) {
          await this.prisma.userRole.delete({
            where: {
              userId_roleId: {
                userId,
                roleId: role.roleId,
              },
            },
          });
        }
      }
      return "Les rôles de l'utilisateur ont été mis à jour";
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }
}
