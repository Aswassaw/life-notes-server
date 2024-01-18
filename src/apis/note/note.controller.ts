import { Controller, Post, Body, Req, Res, Get, Param } from '@nestjs/common';
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

  @Get()
  async findAll(@Req() req: NewRequest, @Res() res: Response) {
    const data = await this.noteService.findAll(req.auth.id);

    return res.status(200).json({
      message: 'Find All Note Success',
      statusCode: 200,
      data,
    });
  }

  @Get()
  async findById(
    @Req() req: NewRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const data = await this.noteService.findById(id, req.auth.id);

    return res.status(200).json({
      message: 'Find One Note Success',
      statusCode: 200,
      data,
    });
  }
}
