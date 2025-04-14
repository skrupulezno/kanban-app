import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto) {
    // Проверка на существование Space можно добавить по необходимости
    return this.prisma.board.create({
      data: {
        name: createBoardDto.name,
        description: createBoardDto.description,
        spaceId: createBoardDto.spaceId,
      },
    });
  }

  async findAll() {
    return this.prisma.board.findMany({
      include: { tasks: true, space: true },
    });
  }

  async findOne(id: number) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { tasks: true, space: true },
    });
    if (!board) {
      throw new NotFoundException(`Board with id=${id} not found`);
    }
    return board;
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    await this.findOne(id);
    return this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.board.delete({
      where: { id },
    });
  }
}
