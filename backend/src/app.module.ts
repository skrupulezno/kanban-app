import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SpaceModule } from './space/space.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [SpaceModule, BoardModule, TaskModule],
  providers: [PrismaService],
})
export class AppModule {}
