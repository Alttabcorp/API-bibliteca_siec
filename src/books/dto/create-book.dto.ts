import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(512)
  description: string;
}

export interface FindAllParameters {
  title: string;
}

export class BookRouteParameters {

  @IsUUID()
  @IsNotEmpty()
  id: string;
}
