import { Controller, Get, Post, Body, Patch, Param, Put, Delete, ParseIntPipe, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskService } from 'src/task/task.service';
import { UpdateTaskStageDto } from 'src/task/dto/update-task-stage.dto';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService, 
    private readonly taskService: TaskService
  ) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  async findAll() {
    return this.boardService.findAll();
  }

  @Post(':boardId/tasks')
  async createTaskForBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createTaskDto: CreateTaskDto
  ) {
    if (!createTaskDto.spaceId) {
      throw new BadRequestException('spaceId is required');
    }
    return this.taskService.createTask({
      ...createTaskDto,
      boardId,
      stage: createTaskDto.stage
    });
  }

  @Patch('tasks/:id/stage')
  async updateTaskStage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskStageDto,
    @Request() req
  ) {
    return this.taskService.updateStage(id, dto.stage, req.user);
  }

  @Get(':id/tasks')
  async getTasksByBoard(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.taskService.getTasksByBoard(id, req.user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.remove(id);
  }
}
