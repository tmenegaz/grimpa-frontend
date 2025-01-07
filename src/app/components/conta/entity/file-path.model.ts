import { FilePathDto } from "./file-path.dto";


export class FilePath {
  id?: string;
  path: string;

  constructor(
    path: string,
    id?: string,
  ) {
    this.id = id;
    this.path = path;
  }

  static fromDto(dto: FilePathDto): FilePath {
    return new FilePath(
      dto.path,
      dto.id,
    );
  }

  toDto(): FilePathDto {
    return {
      id: this.id,
      path: this.path,
    };
  }
}
