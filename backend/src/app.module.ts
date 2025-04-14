import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SpaceModule } from './space/space.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SpaceModule, BoardModule, TaskModule, AuthModule, UserModule],
  providers: [PrismaService],
})
export class AppModule {}
