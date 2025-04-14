import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(@Query() filterDto: FilterTasksDto, @Request() req) {
    return this.taskService.getTasks(filterDto, req.user);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(+id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.taskService.updateTask(+id, updateTaskDto, req.user);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(+id);
  }
}