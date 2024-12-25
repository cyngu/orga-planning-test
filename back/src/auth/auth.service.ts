import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserGoogleInput } from 'src/users/dto/createUserGoogle.input';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async validateGoogleUser(googleUser: CreateUserGoogleInput) {
    const { email, firstName, lastName, idGoogleUser } = googleUser;
    const user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
      include: {
        UserRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (user) {
      return user;
    }

    const defaultWorkType = await this.prisma.adminConfiguration.findFirst({
      where: { name: 'WorkTypeDefault' },
      select: {
        value: true,
      },
    });

    const userCreated = await this.prisma.user.create({
      data: {
        email: email,
        password: idGoogleUser,
        firstName: firstName,
        lastName: lastName,
        trigramme:
          `${firstName[0]}${lastName[0]}${lastName[lastName.length - 1]}`.toUpperCase(),
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

    const newUser = await this.prisma.user.findUnique({
      where: { id: userCreated.id },
      include: {
        UserRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return newUser;
  }
}
