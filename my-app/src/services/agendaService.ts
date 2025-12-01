import api from "./api";
import { EventoDTO, EventoRequestDTO, StatusPresenca } from "../types/agenda.types";

const BASE_URL = (repId: number) => `/reps/${repId}/agenda`;

export const criarEvento = async (repId: number, evento: EventoRequestDTO): Promise<EventoDTO> => {
  const response = await api.post(BASE_URL(repId), evento);
  return response.data;
};

export const atualizarEvento = async (repId: number, eventoId: number, evento: EventoRequestDTO): Promise<EventoDTO> => {
  const response = await api.put(`${BASE_URL(repId)}/${eventoId}`, evento);
  return response.data;
};

export const excluirEvento = async (repId: number, eventoId: number): Promise<void> => {
  await api.delete(`${BASE_URL(repId)}/${eventoId}`);
};

export const getProximosEventos = async (repId: number): Promise<EventoDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/proximos`);
  return response.data;
};

export const getEventosPorMes = async (repId: number, ano: number, mes: number): Promise<EventoDTO[]> => {
  const response = await api.get(`${BASE_URL(repId)}/mes`, {
    params: { ano, mes }
  });
  return response.data;
};

export const responderPresenca = async (repId: number, eventoId: number, status: StatusPresenca): Promise<void> => {
  await api.put(`${BASE_URL(repId)}/${eventoId}/presenca`, null, {
    params: { status }
  });
};