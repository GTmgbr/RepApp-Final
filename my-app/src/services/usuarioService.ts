import api from "./api";
import { UsuarioDTO, UsuarioUpdateDTO } from "../types/usuario.types";

export const getMeuPerfil = async (): Promise<UsuarioDTO> => {
  const response = await api.get("/usuarios/me");
  return response.data;
};

export const atualizarPerfil = async (dados: UsuarioUpdateDTO): Promise<UsuarioDTO> => {
  const response = await api.put("/usuarios/me", dados);
  return response.data;
};