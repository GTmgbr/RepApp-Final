import api from "./api";
import {
  FinanceiroResumoDTO,
  DespesaRequestDTO,
  DespesaDTO,
} from "../types/financeiro.types";

/**
 * Obtém o resumo financeiro completo da república
 * Inclui: saldo total, saldos individuais dos moradores e despesas recentes
 * @param repId - ID da república
 * @returns Resumo financeiro completo
 */
export const getResumoFinanceiro = async (
  repId: number
): Promise<FinanceiroResumoDTO> => {
  const response = await api.get(`/reps/${repId}/financeiro`);
  return response.data;
};

/**
 * Adiciona uma nova despesa à república
 * @param repId - ID da república
 * @param despesa - Dados da despesa a ser criada
 * @returns Dados da despesa criada
 */
export const adicionarDespesa = async (
  repId: number,
  despesa: DespesaRequestDTO
): Promise<DespesaDTO> => {
  const response = await api.post(`/reps/${repId}/financeiro/despesas`, despesa);
  return response.data;
};
