export type StatusPresenca = 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO';

export interface EventoDTO {
  id: number;
  titulo: string;
  descricao?: string;
  local: string;
  dataHora: string;
  criadorNome: string;
  
  totalConfirmados: number;
  meuStatus: StatusPresenca;
}

export interface EventoRequestDTO {
  titulo: string;
  descricao?: string;
  local: string;
  dataHora: string;
}