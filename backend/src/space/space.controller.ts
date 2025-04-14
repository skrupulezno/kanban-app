import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  async create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.create(createSpaceDto);
  }

  @Get()
  async findAll() {
    return this.spaceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spaceService.findOne(id);
  }

  @Get(':id/boards')
  async getBoards(@Param('id', ParseIntPipe) id: number) {
    return this.spaceService.getBoardsBySpaceId(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.spaceService.remove(id);
  }
}