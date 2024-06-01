import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthResponseDto {
  token: string;
  expiresIn: number;
}
