export class CreateUserDto {
  id: string;
  username: string;
  password: string;
}

export interface FindAllParameters {
  username: string;
}

export class UserRouteParameters {
  id: string;
}
