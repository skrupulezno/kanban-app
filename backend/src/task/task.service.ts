import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface JwtPayload {
  id: number;
  role: string;
}

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    if (dto.assignedToId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.assignedToId } });
      if (!user) {
        throw new NotFoundException(`User with id ${dto.assignedToId} not found`);
      }
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        stage: dto.stage ?? 'TODO',
        board: { connect: { id: dto.boardId } },
        space: { connect: { id: dto.spaceId } },
        assignedTo: dto.assignedToId ? { connect: { id: dto.assignedToId } } : undefined,
      },
    });
  }

  async getTasks(filter: FilterTasksDto, user: JwtPayload): Promise<Task[]> {
    const { stage, spaceId, boardId } = filter;
    const where: Prisma.TaskWhereInput = {};
  
    if (stage) where.stage = stage;
    if (spaceId) where.space = { id: Number(spaceId) };
    if (boardId) where.boardId = Number(boardId);
  
    return this.prisma.task.findMany({ where });
  }
  
  
  async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async updateTask(id: number, dto: UpdateTaskDto, user: JwtPayload): Promise<Task> {
    const existingTask = await this.getTaskById(id);
    if (user.role !== 'admin' && existingTask.assignedToId !== user.id) {
      throw new ForbiddenException('You are not allowed to update this task');
    }
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        stage: dto.stage,
        assignedTo: dto.assignedToId ? { connect: { id: dto.assignedToId } } : undefined,
      }
    });
  }

  async deleteTask(id: number): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }

  async updateStage(id: number, stage: 'TODO' | 'IN_PROGRESS' | 'DONE', user: JwtPayload): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { stage },
    });
  }

  async getTasksByBoard(boardId: number, user: JwtPayload): Promise<Task[]> {
    const where: Prisma.TaskWhereInput = {
      boardId
    };
    return this.prisma.task.findMany({ where });
  }
}