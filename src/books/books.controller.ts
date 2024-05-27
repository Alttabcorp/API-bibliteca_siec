import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import {
  BookRouteParameters,
  CreateBookDto,
  FindAllParameters,
} from './dto/create-book.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<CreateBookDto> {
    return await this.booksService.findOne(id);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CreateBookDto[]> {
    return await this.booksService.findAll(params);
  }

  @Put('/:id')
  async update(
    @Param() params: BookRouteParameters,
    @Body() book: CreateBookDto,
  ) {
    return await this.booksService.update(params.id, book);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.booksService.remove(id);
  }
}
