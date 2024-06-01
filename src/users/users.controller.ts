import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  FindAllParameters,
  UserRouteParameters,
} from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
  
  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<CreateUserDto> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CreateUserDto[]> {
    return await this.usersService.findAll(params);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async update(
    @Param() params: UserRouteParameters,
    @Body() user: CreateUserDto,
  ) {
    return await this.usersService.update(params.id, user);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
