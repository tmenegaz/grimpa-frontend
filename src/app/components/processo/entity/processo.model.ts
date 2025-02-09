import { TranslateService } from "@ngx-translate/core";
import { translateProfilesProcesso } from "~app/components/shared/utils";
import { Cliente } from "~components/cliente/entity/cliente.model";
import { Tecnico } from "~components/tecnico/entity/tecnico.model";
import { Modalidade } from "~src/app/enums/modalidade.enum";
import { Perfil } from "~src/app/enums/perfil.enum";
import { Status } from "~src/app/enums/status.enum";
import { ProcessoDto } from "./processo.dto";

export class Processo {
  id?: string;
  modalidade: Modalidade;
  status: Status;
  titulo: string;
  observacao: string;
  perfis: Perfil[];
  filePath: { id: string, path: string };
  cliente: Cliente;
  tecnico: Tecnico;
  dataInicio?: Date | string;
  dataFim?: Date | string;
  perfisTraduzidos: string[];

  constructor(
    modalidade: Modalidade,
    status: Status,
    titulo: string,
    observacao: string,
    perfis: Perfil[],
    filePath: { id: string, path: string },
    cliente: Cliente,
    tecnico: Tecnico,
    translate: TranslateService,
    dataInicio?: Date | string,
    dataFim?: Date | string,
    id?: string,
  ) {
    this.id = id;
    this.modalidade = modalidade;
    this.status = status;
    this.titulo = titulo;
    this.perfis = perfis;
    this.filePath = filePath;
    this.observacao = observacao;
    this.cliente = cliente;
    this.tecnico = tecnico;
    this.dataInicio = dataInicio;
    this.dataFim = dataInicio;
    this.perfisTraduzidos = translateProfilesProcesso(perfis, translate);
  }

  static fromDto(dto: ProcessoDto, translate?: TranslateService): Processo {
    return new Processo(
      dto.modalidade,
      dto.status,
      dto.titulo,
      dto.observacao,
      dto.perfis,
      dto.filePath,
      dto.cliente,
      dto.tecnico,
      translate,
      dto.dataInicio,
      dto.dataFim,
      dto.id,
    );
  }

  toDto(): ProcessoDto {
    return {
      id: this.id,
      modalidade: this.modalidade,
      status: this.status,
      titulo: this.titulo,
      perfis: this.perfis,
      filePath: this.filePath,
      observacao: this.observacao,
      cliente: this.cliente,
      tecnico: this.tecnico,
      perfisTraduzidos: this.perfisTraduzidos,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim
    };
  }
}
