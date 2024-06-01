import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, FindAllParameters } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: CreateUserDto) {
    const userAlreadyRegistered = await this.findByUserName(newUser.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(
        `User '${newUser.username}'already registered`,
      );
    }
    const dbUser = new UserEntity();

    dbUser.username = newUser.username;
    dbUser.passwordHash = bcryptHashSync(newUser.password, 10);
    const { id, username } = await this.usersRepository.save(dbUser);

    return { id, username };
  }

  async findAll(params: FindAllParameters): Promise<CreateUserDto[]> {
    const searchParams: FindOptionsWhere<UserEntity> = {};

    if (params.username) {
      searchParams.username = Like(`%${params.username}%`);
    }

    const userFound = await this.usersRepository.find({
      where: searchParams,
    });

    return userFound.map((userEntity) => this.mapEntityToDto(userEntity));
  }

  async findOne(id: string) {
    const foundUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.mapEntityToDto(foundUser);
  }

  async findByUserName(username: string): Promise<CreateUserDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      return null;
    }

    return this.mapEntityToDto(userFound);
  }

  async update(id: string, user: CreateUserDto) {
    const foundUser = await this.usersRepository.findOne({
      where:{id}
    })

    if(!foundUser){
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND)
    }
    const dbUser = new UserEntity();

    dbUser.username = user.username;
    dbUser.passwordHash = bcryptHashSync(user.password, 10);

    await this.usersRepository.update(id, this.mapDtoEntity(dbUser))
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete(id);

    if (!result.affected) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    } 
  }

  private mapEntityToDto(userEntity: UserEntity): CreateUserDto {
    return {
      id: userEntity.id,
      username: userEntity.username,
      password: userEntity.passwordHash,
    };
  }

  private mapDtoEntity(userEntity: UserEntity): Partial<UserEntity> {
    return {
      id: userEntity.id,
      username: userEntity.username,
      passwordHash: userEntity.passwordHash,
    };
  }
}
