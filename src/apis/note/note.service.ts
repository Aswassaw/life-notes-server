import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateNoteDto, authId: string) {
    const tagsAvailable = await this.prismaService.tag.findMany({
      where: {
        id: {
          in: dto.tags,
        },
      },
    });

    if (tagsAvailable.length !== dto.tags.length) {
      throw new BadRequestException('Some Tag Not Available');
    }

    await this.prismaService.note.create({
      data: {
        title: dto.title,
        content: dto.content,
        user_id: authId,
        tags: {
          connect: dto.tags.map((tag) => ({ id: tag })),
        },
      },
    });
  }

  async findAll(authId: string) {
    return await this.prismaService.note.findMany({
      where: {
        user_id: authId,
      },
    });
  }

  async findById(noteId: string, authId: string) {
    return await this.prismaService.note.findFirst({
      where: {
        AND: {
          id: noteId,
          user_id: authId,
        },
      },
    });
  }
}
