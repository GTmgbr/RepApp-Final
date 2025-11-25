import api from "./api";
import {
  DashboardStatsDTO,
  HistoricoResponseDTO,
} from "../types/dashboard.types";

/**
 * Obtém as estatísticas gerais do dashboard
 * @param repId - ID da república
 * @returns Estatísticas do dashboard (saldos, receitas, despesas, tarefas)
 */
export const getDashboardStats = async (
  repId: number
): Promise<DashboardStatsDTO> => {
  const response = await api.get(`/reps/${repId}/dashboard/stats`);
  return response.data;
};

/**
 * Obtém o histórico de atividades recentes da república
 * @param repId - ID da república
 * @returns Array de atividades recentes (tarefas, despesas, eventos, avisos)
 */
export const getHistoricoAtividades = async (
  repId: number
): Promise<HistoricoResponseDTO[]> => {
  const response = await api.get(`/reps/${repId}/dashboard/atividades`);
  return response.data;
};
