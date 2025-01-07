export interface TecnicoDto {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  perfis: string[];
  dataCriacao: Date | string;
}
