export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA';
export type CategoriaAviso = 'MANUTENCAO' | 'FINANCEIRO' | 'GERAL' | 'REGRAS';

export interface UsuarioResumo {
  id: number;
  nome: string;
}

export interface Tarefa {
  id: number;
  titulo: string;
  descricao?: string;
  prazo: string; // Formato ISO: "2025-11-26"
  concluida: boolean;
  prioridade: Prioridade;
  responsaveis: UsuarioResumo[];
}

export interface CriarTarefaDTO {
  titulo: string;
  prazo: string;
  prioridade: Prioridade;
  responsaveisIds: number[];
}

export interface Aviso {
  id: number;
  titulo: string;
  descricao: string;
  categoria: CategoriaAviso;
  urgencia: Prioridade;
  dataCriacao: string;
}