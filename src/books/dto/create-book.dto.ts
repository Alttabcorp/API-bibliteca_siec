export class CreateBookDto {
  id: string;
  title: string;
  description: string;
}

export interface FindAllParameters{
    title:string;
}

export class BookRouteParameters{
    id:string
}
