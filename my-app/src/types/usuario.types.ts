export interface UsuarioDTO {
  id: number;
  nomeCompleto: string;
  email: string;
  fotoUrl?: string;
  curso?: string;
  universidade?: string;
  ano?: number;
}

export interface UsuarioUpdateDTO {
  nomeCompleto?: string;
  fotoUrl?: string;
  curso?: string;
  universidade?: string;
  ano?: number;
}