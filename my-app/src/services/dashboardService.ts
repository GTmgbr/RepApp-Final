import api from "./api";
import { DashboardStatsDTO, HistoricoResponseDTO } from "../types/dashboard.types";

const BASE_URL = (repId: number) => `/reps/${repId}/dashboard`;

export const getDashboardStats = async (repId: number): Promise<DashboardStatsDTO> => {
  const response = await api.get(`${BASE_URL(repId)}/stats`);
  return response.data;
};

export const getAtividadesRecentes = async (repId: number): Promise<HistoricoResponseDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/atividades`);
  return response.data;
};