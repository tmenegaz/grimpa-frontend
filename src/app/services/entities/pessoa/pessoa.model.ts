import { Perfil } from "~src/app/enums/perfil.enum";
import { PessoaDto } from "./pessoa.dto";

export class Pessoa {
  perfis: Perfil[];

  constructor(
    perfis: Perfil[],
  ) {
    this.perfis = perfis;
  }

  static fromDto(dto: PessoaDto) {
    return new Pessoa(
      dto.perfis
    );
  }

  toDto(): PessoaDto {
    return { perfis: this.perfis }
  }
}