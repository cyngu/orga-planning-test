import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminConfigurationResolver } from './adminConfiguration.resolver';
import { AdminConfigurationService } from './adminConfiguration.service';

@Module({
  providers: [AdminConfigurationResolver, AdminConfigurationService],
  imports: [PrismaModule],
})
export class AdminConfigurationModule {}
