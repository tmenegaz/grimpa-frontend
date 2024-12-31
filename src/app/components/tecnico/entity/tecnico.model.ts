import { TecnicoDto } from "./tecnico.dto";

export class Tecnico {
  id?: string | number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfis: string[];
  dataCriacao: Date | string;

  constructor(
    nome: string,
    cpf: string,
    email: string,
    senha: string,
    perfis: string[],
    dataCriacao: Date | string,
    id?: string | number,
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.senha = senha;
    this.perfis = perfis;
    this.dataCriacao = dataCriacao;
  }

  static fromDto(dto: TecnicoDto): Tecnico {
    return new Tecnico(
      dto.nome,
      dto.cpf,
      dto.email,
      dto.senha,
      dto.perfis,
      dto.dataCriacao,
      dto.id,
    );
  }

  toDto(): TecnicoDto {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      senha: this.senha,
      perfis: this.perfis,
      dataCriacao: this.dataCriacao
    };
  }
}
