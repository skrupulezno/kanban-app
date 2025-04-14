import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Если тип JwtPayload ещё не определён, можно определить его так:
interface JwtPayload {
  id: number;
  role: string;
}

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto): Promise<Task> {
    // Если указан исполнитель, проверяем его существование
    if (dto.assignedToId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.assignedToId },
      });
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
    const { stage, spaceId, boardId, page, pageSize, sortBy, order } = filter;
    const where: Prisma.TaskWhereInput = {};
    if (stage) {
      where.stage = stage;
    }
    if (spaceId) {
      // Если scalar поле не поддерживается, фильтруем через связь
      where.space = { id: Number(spaceId) };
    }
    if (boardId) {
      where.board = { id: Number(boardId) };
    }
    if (user.role !== 'admin') {
      // Ограничиваем выборку задач текущим пользователем (через связь)
      where.assignedTo = { id: user.id };
    }
    const take = pageSize ? Number(pageSize) : 20;
    const skip = page ? (Number(page) - 1) * take : 0;
    let orderBy: Prisma.TaskOrderByWithRelationInput | undefined;
    if (sortBy) {
      const sortOrder: Prisma.SortOrder = order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
      orderBy = { [sortBy]: sortOrder };
    } else {
      orderBy = { updatedAt: 'desc' };
    }
    return this.prisma.task.findMany({
      where,
      skip,
      take,
      orderBy
    });
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async updateTask(id: number, dto: UpdateTaskDto, user: JwtPayload): Promise<Task> {
    const existingTask = await this.getTaskById(id);
    // Если не админ, разрешаем обновление только своей задачи
    if (user.role !== 'admin' && existingTask.assignedToId !== user.id) {
      throw new ForbiddenException('You are not allowed to update this task');
    }
    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        stage: dto.stage,
        // Если указан новый исполнитель, применяем связь
        assignedTo: dto.assignedToId ? { connect: { id: dto.assignedToId } } : undefined,
      }
    });
  }

  async deleteTask(id: number): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }
}