import { Modalidade } from "~src/app/enums/modalidade.enum";
import { Perfil } from "~src/app/enums/perfil.enum";
import { Status } from "~src/app/enums/status.enum";
import { Cliente } from "../../cliente/entity/cliente.model";
import { Tecnico } from "../../tecnico/entity/tecnico.model";

export interface ProcessoDto {
  id: string;
  modalidade: Modalidade;
  status: Status;
  titulo: string;
  observacao: string;
  perfis: Perfil[];
  filePath: { id: string, path: string };
  cliente: Cliente;
  tecnico: Tecnico;
  dataInicio: Date | string;
  dataFim: Date | string;
  perfisTraduzidos: string[];
}
