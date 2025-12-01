export type PrioridadeTarefa = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type CategoriaTarefa = 'LIMPEZA' | 'COMPRAS' | 'MANUTENCAO' | 'OUTROS';
export type StatusTarefa = 'PENDENTE' | 'CONCLUIDA' | 'ATRASADA';

export interface TarefaDTO {
  id: number;
  titulo: string;
  descricao?: string;
  dataPrazo: string;      
  dataConclusao?: string; 
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  categoria: CategoriaTarefa;
  
  responsavelId?: number;
  responsavelNome?: string;
  responsavelFoto?: string;
  
  concluida?: boolean; 
}

export interface TarefaRequestDTO {
  titulo: string;
  descricao?: string;
  dataPrazo: string; 
  prioridade: PrioridadeTarefa;
  categoria: CategoriaTarefa;
  responsavelId?: number;
}