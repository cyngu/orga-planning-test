import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkTypeResolver } from './workType.resolver';
import { WorkTypeService } from './workType.service';

@Module({
  providers: [WorkTypeResolver, WorkTypeService],
  imports: [PrismaModule],
})
export class WorkTypeModule {}
