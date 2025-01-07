import { Perfil } from "~src/app/enums/perfil.enum";
import { Roles } from "~src/app/enums/roles.enum";

export interface ClienteDto {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  filePath: { id: string, path: string };
  senha: string;
  roles: Roles;
  perfis: Perfil[];
  dataCriacao: Date | string;
}
