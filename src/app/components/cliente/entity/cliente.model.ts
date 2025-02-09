import { TranslateService } from "@ngx-translate/core";
import { Perfil } from "~src/app/enums/perfil.enum";
import { Roles } from "~src/app/enums/roles.enum";
import { translateProfilesCliente } from "../../shared/utils";
import { ClienteDto } from "./cliente.dto";

export class Cliente {
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
    this.perfisTraduzidos = translateProfilesCliente(perfis, translate);
  }

  static fromDto(dto: ClienteDto, translate?: TranslateService): Cliente {
    return new Cliente(
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

  toDto(): ClienteDto {
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
