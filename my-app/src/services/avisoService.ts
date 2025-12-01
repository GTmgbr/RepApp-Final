import api from "./api";
import { AvisoDTO, AvisoRequestDTO } from "../types/avisos.types";

const BASE_URL = (repId: number) => `/reps/${repId}/avisos`;

export const getAvisos = async (repId: number): Promise<AvisoDTO[]> => {
  const response = await api.get(BASE_URL(repId));
  return response.data;
};

export const criarAviso = async (repId: number, aviso: AvisoRequestDTO): Promise<AvisoDTO> => {
  const response = await api.post(BASE_URL(repId), aviso);
  return response.data;
};

export const toggleStatusAviso = async (repId: number, avisoId: number): Promise<void> => {
  await api.patch(`${BASE_URL(repId)}/${avisoId}/status`);
};

export const excluirAviso = async (repId: number, avisoId: number): Promise<void> => {
  await api.delete(`${BASE_URL(repId)}/${avisoId}`);
};