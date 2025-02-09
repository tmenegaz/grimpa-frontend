import { Perfil } from "~src/app/enums/perfil.enum";
import { Roles } from "~src/app/enums/roles.enum";
import { TecnicoDto } from "./tecnico.dto";
import { TranslateService } from "@ngx-translate/core";
import { translateProfilesTecnico } from "~app/components/shared/utils";

export class Tecnico {
  id?: string;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  roles: Roles;
  filePath: { id: string, path: string };
  perfis: Perfil[];
  dataCriacao: Date | string;
  perfisTraduzidos: string[];

  constructor(
    nome: string,
    cpf: string,
    email: string,
    senha: string,
    roles: Roles,
    filePath: { id: string, path: string },
    perfis: Perfil[],
    dataCriacao: Date | string,
    translate: TranslateService,
    id?: string,
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.email = email;
    this.roles = roles;
    this.filePath = filePath;
    this.senha = senha;
    this.perfis = perfis;
    this.dataCriacao = dataCriacao;
    this.perfisTraduzidos = translateProfilesTecnico(perfis, translate);
  }

  static fromDto(dto: TecnicoDto, translate?: TranslateService): Tecnico {
    return new Tecnico(
      dto.nome,
      dto.cpf,
      dto.email,
      dto.senha,
      dto.roles,
      dto.filePath,
      dto.perfis,
      dto.dataCriacao,
      translate,
      dto.id,
    );
  }

  toDto(): TecnicoDto {
    return {
      id: this.id,
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      roles: this.roles,
      filePath: this.filePath,
      senha: this.senha,
      perfis: this.perfis,
      perfisTraduzidos: this.perfisTraduzidos,
      dataCriacao: this.dataCriacao
    };
  }
}
