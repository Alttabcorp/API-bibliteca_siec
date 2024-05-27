import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto, FindAllParameters } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from 'src/db/entities/book.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const bookToSave: BookEntity = {
      description: createBookDto.description,
      title: createBookDto.title,
    };

    const createdBook = await this.booksRepository.save(bookToSave);

    return this.mapEntityToDto(createdBook);
  }

  async findAll(params: FindAllParameters): Promise<CreateBookDto[]> {
    const searchParams: FindOptionsWhere<BookEntity> = {};

    if (params.title) {
      searchParams.title = Like(`%${params.title}%`);
    }

    const bookFound = await this.booksRepository.find({
      where: searchParams,
    });

    return bookFound.map((bookEntity) => this.mapEntityToDto(bookEntity));
  }

  async findOne(id: string) {
    const foundBook = await this.booksRepository.findOne({
      where: { id },
    });
    if (!foundBook) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.mapEntityToDto(foundBook);
  }

  async update(id: string, book: CreateBookDto) {
    const foundBook = await this.booksRepository.findOne({ where: { id } });

    if (!foundBook) {
      throw new HttpException(
        `Task with id ${book.id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.booksRepository.update(id, this.mapDtoEntity(book));
  }

  async remove(id: string) {
    const result = await this.booksRepository.delete(id);

    if (!result.affected) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    } 
  }

  private mapEntityToDto(bookEntity: BookEntity): CreateBookDto {
    return {
      id: bookEntity.id,
      title: bookEntity.title,
      description: bookEntity.description,
    };
  }

  private mapDtoEntity(bookEntity: BookEntity): Partial<BookEntity> {
    return {
      id: bookEntity.id,
      title: bookEntity.title,
      description: bookEntity.description,
    };
  }
}
