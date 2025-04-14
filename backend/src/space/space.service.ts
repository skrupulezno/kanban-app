import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpaceService {
  constructor(private prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    return this.prisma.space.create({
      data: {
        name: createSpaceDto.name,
        description: createSpaceDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.space.findMany({
      include: { boards: true, users: true },
    });
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: { boards: true, users: true },
    });
    if (!space) {
      throw new NotFoundException(`Space with id=${id} not found`);
    }
    return space;
  }

  async getBoardsBySpaceId(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: { boards: true },
    });
    if (!space) {
      throw new NotFoundException(`Space with id=${id} not found`);
    }
    return space.boards;
  }

  async update(id: number, updateSpaceDto: UpdateSpaceDto) {
    await this.findOne(id);
    return this.prisma.space.update({
      where: { id },
      data: updateSpaceDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.space.delete({
      where: { id },
    });
  }
}
