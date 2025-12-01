import api from "./api";
import { TarefaDTO, TarefaRequestDTO } from "../types/tarefas.types";

const BASE_URL = (repId: number) => `/reps/${repId}/tarefas`;

export const getTarefasDashboard = async (repId: number): Promise<TarefaDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/dashboard`);
  return response.data;
};

export const getTarefas = async (repId: number): Promise<TarefaDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/todas`);
  return response.data;
};

export const getMinhasTarefas = async (repId: number): Promise<TarefaDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/minhas`);
  return response.data;
};

export const getTarefasPendentes = async (repId: number): Promise<TarefaDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/pendentes`);
  return response.data;
};

export const criarTarefa = async (repId: number, tarefa: TarefaRequestDTO): Promise<TarefaDTO> => {
  const response = await api.post(BASE_URL(repId), tarefa);
  return response.data;
};

export const concluirTarefa = async (repId: number, tarefaId: number): Promise<TarefaDTO> => {
  const response = await api.patch(`${BASE_URL(repId)}/${tarefaId}/concluir`);
  return response.data;
};

export const excluirTarefa = async (repId: number, tarefaId: number): Promise<void> => {
  await api.delete(`${BASE_URL(repId)}/${tarefaId}`);
};