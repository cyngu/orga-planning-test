import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [PrismaModule],
})
export class UsersModule {}
