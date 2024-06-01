import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface FindAllParameters {
  username: string;
}

export class UserRouteParameters {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
