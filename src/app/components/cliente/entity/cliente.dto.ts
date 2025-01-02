export interface ClienteDto {
  id: string | number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfis: string[];
  dataCriacao: Date | string;
}
