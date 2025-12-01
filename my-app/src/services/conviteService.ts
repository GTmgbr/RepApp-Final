import api from "./api";
import { ConviteRequestDTO, ConviteResponseDTO } from "../types/membro.types";

interface JoinResponseDTO {
  id: number;         
  mensagem: string;   
  tokenCadastro?: string;
}

export const gerarConvite = async (repId: number, dados: ConviteRequestDTO): Promise<ConviteResponseDTO> => {
  const response = await api.post(`/reps/${repId}/convites`, dados);
  return response.data;
};

export const entrarComConvite = async (token: string, usuarioId: number): Promise<JoinResponseDTO> => {
  const response = await api.post("/convites/entrar", { token });
  return response.data;
};