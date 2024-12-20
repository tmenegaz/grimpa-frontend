export interface Cliente {
    id?: string | number;
    nome: string;
    cpf: string;
    email: string;
    senha: string;
    perfil: string[];
    dataCriacao: Date | string;
    dataFinal?: Date | string;
  }