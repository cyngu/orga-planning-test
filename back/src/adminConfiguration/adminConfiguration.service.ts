import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAdminConfigurationInput } from './dto/updateAdminConfiguration.input';
import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express';

@Injectable()
export class AdminConfigurationService {
  constructor(private prisma: PrismaService) {}

  async getConfigurationParkingPlace(): Promise<{ value: string }> {
    const response = await this.prisma.adminConfiguration.findFirst({
      where: {
        name: 'ParkingPlace',
      },
      select: {
        value: true,
      },
    });

    if (!response) {
      throw new NotFoundException('ParkingPlace not found ');
    }

    return response;
  }

  async getConfigurationParams(paramsName: string): Promise<{ value: string }> {
    const response = await this.prisma.adminConfiguration.findFirst({
      where: {
        name: paramsName,
      },
      select: {
        value: true,
      },
    });

    if (!response) {
      throw new NotFoundException('Une erreur est survenue');
    }

    return response;
  }

  async updateAdminConfiguration(
    updateAdminConfigurationInput: UpdateAdminConfigurationInput,
  ): Promise<{ value: string }> {
    try {
      const { value, paramsName } = updateAdminConfigurationInput;

      if (!value) {
        throw new UserInputError('Une erreur est survenue');
      }

      const adminParams = await this.prisma.adminConfiguration.findFirst({
        where: { name: paramsName },
      });

      if (!adminParams) {
        throw new NotFoundException('Une erreur est survenue');
      }

      return await this.prisma.adminConfiguration.update({
        where: { id: adminParams.id },
        data: { value: value },
      });
    } catch (err) {
      if (
        err instanceof UserInputError ||
        err instanceof AuthenticationError ||
        err instanceof NotFoundException
      ) {
        throw err;
      }
      throw new ApolloError(err.message);
    }
  }
}
