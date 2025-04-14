import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        stage: createTaskDto.stage, // по умолчанию будет установлено значение из схемы, если не передано
        boardId: createTaskDto.boardId,
        userId: createTaskDto.userId,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: { board: true, user: true },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { board: true, user: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
