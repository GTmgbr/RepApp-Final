export interface DashboardStatsDTO {
  saldoAtual: number;
  totalEntradasMes: number;
  totalSaidasMes: number;
  tarefasConcluidasSemana: number;
  despesasCriadasMes: number;
}

export interface HistoricoResponseDTO {
  id: number;
  tipo: 'TAREFA_CONCLUIDA' | 'DESPESA_CRIADA' | 'EVENTO_CRIADO' | 'AVISO_POSTADO' | 'OUTRO';
  titulo: string;
  descricao: string;
  dataHora: string;
  tempoDecorrido?: string; 
  autorFoto: string | null;
}