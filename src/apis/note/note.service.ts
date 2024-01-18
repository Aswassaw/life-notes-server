import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UpdateNoteDto } from './dto/update-note.dto';

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
    const note = await this.prismaService.note.findFirst({
      where: {
        AND: {
          id: noteId,
          user_id: authId,
        },
      },
      include: {
        tags: true,
      },
    });

    if (!note) {
      throw new NotFoundException('Note Not Found');
    }

    return note;
  }

  async update(dto: UpdateNoteDto, noteId: string, authId: string) {
    const tagsAvailable = await this.prismaService.tag.findMany({
      where: {
        id: {
          in: dto.tags,
        },
      },
    });

    if (tagsAvailable.length !== dto.tags?.length) {
      throw new BadRequestException('Some Tag Not Available');
    }

    const note = await this.prismaService.note.findFirst({
      where: {
        AND: {
          id: noteId,
          user_id: authId,
        },
      },
      include: {
        tags: true,
      },
    });

    if (!note) {
      throw new NotFoundException('Note Not Found');
    }

    await this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: dto.title || '',
        content: dto.content || '',
        user_id: authId,
        tags: {
          disconnect: note.tags.map((tag) => ({ id: tag.id })),
          connect: dto.tags.map((tag) => ({ id: tag })),
        },
      },
    });
  }
}
