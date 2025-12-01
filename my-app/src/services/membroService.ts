import api from "./api";
import { MembroDTO, TipoMembro } from "../types/membro.types";

const BASE_URL = (repId: number) => `/reps/${repId}/membros`;

export const getMembros = async (repId: number): Promise<MembroDTO[]> => {
  const response = await api.get(BASE_URL(repId));
  return response.data;
};

export const alterarFuncao = async (repId: number, usuarioId: number, novaFuncao: TipoMembro): Promise<void> => {
  await api.put(`${BASE_URL(repId)}/${usuarioId}/funcao`, null, {
    params: { novaFuncao }
  });
};

export const removerMembro = async (repId: number, usuarioId: number): Promise<void> => {
  await api.delete(`${BASE_URL(repId)}/${usuarioId}`);
};