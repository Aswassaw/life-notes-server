import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { NewRequest } from '../../interfaces/new.request';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(
    @Req() req: NewRequest,
    @Res() res: Response,
    @Body() body: CreateNoteDto,
  ) {
    await this.noteService.create(body, req.auth.id);

    return res.status(201).json({
      message: 'Create Note Success',
      statusCode: 201,
    });
  }
}
