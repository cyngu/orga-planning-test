import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkType } from './workType.model';
import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';
import { UpdateWorkTypeInput } from './dto/updateWorkType.input';
import { CreateWorkTypeInput } from './dto/createWorkType.input';

@Injectable()
export class WorkTypeService {
  constructor(private prisma: PrismaService) {}

  async getAllWorkType(): Promise<WorkType[]> {
    return this.prisma.workType.findMany();
  }

  async getWorkTypeById(id: string): Promise<WorkType> {
    return this.prisma.workType.findFirst({ where: { id } });
  }

  async getWorkTypeByUserId(id: string): Promise<WorkType> {
    try {
      const { workTypeId } = await this.prisma.user.findFirst({
        where: { id },
        select: { workTypeId: true },
      });

      if (!workTypeId) {
        throw new UserInputError('User not found');
      }

      return this.prisma.workType.findFirst({ where: { id: workTypeId } });
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async updateWorkType(
    updateWorkTypeInput: UpdateWorkTypeInput,
  ): Promise<WorkType> {
    try {
      const {
        id,
        weeklyHour,
        name,
        friday,
        monday,
        thursday,
        tuesday,
        wednesday,
      } = updateWorkTypeInput;
      if (!id) {
        throw new UserInputError('Invalid input');
      }
      const workTypeExist = await this.prisma.workType.findFirst({
        where: { id },
      });

      if (!workTypeExist) {
        throw new UserInputError('Work type not found');
      }

      const workTypeExistName = await this.prisma.workType.findFirst({
        where: { name: name.toLowerCase(), id: { not: id } },
      });

      if (workTypeExistName) {
        throw new UserInputError('Le profil existe déjà');
      }

      return this.prisma.workType.update({
        where: { id },
        data: {
          name: name ? name.toLowerCase() : workTypeExist.name,
          monday: monday ? monday : workTypeExist.monday,
          tuesday: tuesday ? tuesday : workTypeExist.tuesday,
          wednesday: wednesday ? wednesday : workTypeExist.wednesday,
          thursday: thursday ? thursday : workTypeExist.thursday,
          friday: friday ? friday : workTypeExist.friday,
          weeklyHour: weeklyHour ? weeklyHour : workTypeExist.weeklyHour,
        },
      });
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async createWorkType(createWorkTypeInput: CreateWorkTypeInput) {
    try {
      const { name, weeklyHour, friday, monday, thursday, tuesday, wednesday } =
        createWorkTypeInput;
      if (!name || !weeklyHour) {
        throw new UserInputError('Invalid input');
      }
      const workTypeExist = await this.prisma.workType.findFirst({
        where: { name: name.toLowerCase() },
      });

      if (workTypeExist) {
        throw new UserInputError('Le profil existe déjà');
      }

      return this.prisma.workType.create({
        data: {
          name: name.toLowerCase(),
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          weeklyHour,
        },
      });
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }

  async deleteWorkType(id: string): Promise<string> {
    try {
      const workTypeExist = await this.prisma.workType.findFirst({
        where: { id },
        select: {
          User: true,
          id: true,
          name: true,
          weeklyHour: true,
        },
      });

      if (!workTypeExist) {
        throw new UserInputError('Le profil n’existe pas');
      }
      if (workTypeExist.User.length > 0) {
        throw new UserInputError(
          'Le profil est utilisé par un ou plusieurs utilisateurs',
        );
      }
      await this.prisma.workType.delete({ where: { id } });
      return 'Work type deleted successfully';
    } catch (err) {
      if (err instanceof UserInputError || err instanceof AuthenticationError) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }
}
