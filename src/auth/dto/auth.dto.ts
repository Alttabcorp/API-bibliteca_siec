export class AuthDto {
    username: string;
    password:string;
}

export class AuthResponseDto {
    token: string;
    expiresIn: number;
  }
  