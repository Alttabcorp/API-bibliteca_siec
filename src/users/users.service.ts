import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, FindAllParameters } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByUserName(username: string): Promise<CreateUserDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { username },
    });

    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
