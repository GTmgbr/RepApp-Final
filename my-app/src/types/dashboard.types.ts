// Tipos baseados nos DTOs do backend para Dashboard

export interface DashboardStatsDTO {
  saldoAtual: number;
  totalEntradasMes: number;
  totalSaidasMes: number;
  tarefasConcluidasSemana: number;
  despesasCriadasMes: number;
}

export interface HistoricoResponseDTO {
  tipo: TipoAtividade;
  titulo: string;
  descricao: string;
  data: string;
  tempoDecorrido: string;
  fotoAutor: string | null;
}

export enum TipoAtividade {
  TAREFA_CONCLUIDA = "TAREFA_CONCLUIDA",
  DESPESA_CRIADA = "DESPESA_CRIADA",
  EVENTO_CRIADO = "EVENTO_CRIADO",
  AVISO_CRIADO = "AVISO_CRIADO",
}
