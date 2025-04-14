import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TaskModule } from 'src/task/task.module';

@Module({
  controllers: [BoardController],
  providers: [BoardService, PrismaService],
  imports: [TaskModule]
})
export class BoardModule {}
